import { Router, Request, Response } from 'express';
import { db } from '../config/db.js';
import { user } from '../db/schema/auth.schema.js';
import { projects } from '../db/schema/projects.schema.js';
import { tasks } from '../db/schema/tasks.schema.js';
import { eq, desc, count, sql } from 'drizzle-orm';

const router = Router();

// GET /api/admin/stats - Get dashboard statistics
router.get('/stats', async (req: Request, res: Response) => {
    try {
        const [usersCount] = await db.select({ count: count() }).from(user);
        const [projectsCount] = await db.select({ count: count() }).from(projects);
        const [tasksCount] = await db.select({ count: count() }).from(tasks);

        res.json({
            totalUsers: Number(usersCount?.count || 0),
            totalProjects: Number(projectsCount?.count || 0),
            totalTasks: Number(tasksCount?.count || 0),
        });
    } catch (error: any) {
        console.error('Failed to get stats:', error);
        res.status(500).json({
            error: 'Failed to get statistics',
            message: error?.message || 'Unknown error'
        });
    }
});

// GET /api/admin/users - Get all users with profiles
router.get('/users', async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 100;

        // Get all users - only select columns that definitely exist
        const users = await db.select({
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            image: user.image,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        })
            .from(user)
            .orderBy(desc(user.createdAt))
            .limit(limit);

        // Try to get profiles, but handle case where table might be missing columns
        let profiles: any[] = [];
        try {
            const profilesResult = await db.execute(sql`
                SELECT user_id, display_name, avatar_url, role, timezone, created_at, updated_at
                FROM user_profiles
            `);
            profiles = profilesResult.rows as any[];
        } catch (profileError: any) {
            console.warn('Could not fetch profiles:', profileError.message);
        }

        const profileMap = new Map(profiles.map((p: any) => [p.user_id, {
            userId: p.user_id,
            displayName: p.display_name,
            avatarUrl: p.avatar_url,
            role: p.role || 'student',
            timezone: p.timezone,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
        }]));

        const usersWithProfiles = users.map(u => ({
            ...u,
            profile: profileMap.get(u.id) || { role: 'student' },
        }));

        res.json(usersWithProfiles);
    } catch (error: any) {
        console.error('Failed to get users:', error);
        res.status(500).json({
            error: 'Failed to get users',
            message: error?.message || 'Unknown error'
        });
    }
});

// GET /api/admin/users/:userId - Get single user details
router.get('/users/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const [userData] = await db.select({
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            image: user.image,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        })
            .from(user)
            .where(eq(user.id, userId));

        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get profile
        let profile: any = null;
        try {
            const profileResult = await db.execute(sql`
                SELECT user_id, display_name, avatar_url, role, timezone
                FROM user_profiles WHERE user_id = ${userId}
            `);
            if (profileResult.rows[0]) {
                const p: any = profileResult.rows[0];
                profile = {
                    userId: p.user_id,
                    displayName: p.display_name,
                    avatarUrl: p.avatar_url,
                    role: p.role || 'student',
                    timezone: p.timezone,
                };
            }
        } catch (e) {
            // Profile table might not have all columns
        }

        res.json({ ...userData, profile: profile || { role: 'student' } });
    } catch (error: any) {
        console.error('Failed to get user:', error);
        res.status(500).json({ error: 'Failed to get user', message: error?.message });
    }
});

// PATCH /api/admin/users/:userId - Update user details
router.patch('/users/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { name, email, role } = req.body;

        // Update user table
        if (name || email) {
            await db.update(user)
                .set({
                    ...(name && { name }),
                    ...(email && { email }),
                    updatedAt: new Date(),
                })
                .where(eq(user.id, userId));
        }

        // Update role in profile if provided
        if (role && ['student', 'mentor', 'admin'].includes(role)) {
            await db.execute(sql`
                INSERT INTO user_profiles (user_id, role, updated_at)
                VALUES (${userId}, ${role}, NOW())
                ON CONFLICT (user_id) 
                DO UPDATE SET role = ${role}, updated_at = NOW()
            `);
        }

        res.json({ success: true });
    } catch (error: any) {
        console.error('Failed to update user:', error);
        res.status(500).json({
            error: 'Failed to update user',
            message: error?.message || 'Unknown error'
        });
    }
});

// PATCH /api/admin/users/:userId/role - Update user role (legacy endpoint)
router.patch('/users/:userId/role', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['student', 'mentor', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        await db.execute(sql`
            INSERT INTO user_profiles (user_id, role, updated_at)
            VALUES (${userId}, ${role}, NOW())
            ON CONFLICT (user_id) 
            DO UPDATE SET role = ${role}, updated_at = NOW()
        `);

        res.json({ success: true });
    } catch (error: any) {
        console.error('Failed to update user role:', error);
        res.status(500).json({
            error: 'Failed to update user role',
            message: error?.message || 'Unknown error'
        });
    }
});

// DELETE /api/admin/users/:userId - Delete a user
router.delete('/users/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        // Delete related data first (in order of dependencies)
        // 1. Delete user's project memberships
        await db.execute(sql`DELETE FROM project_members WHERE user_id = ${userId}`);

        // 2. Delete user's task assignments
        await db.execute(sql`DELETE FROM task_assignees WHERE user_id = ${userId}`);

        // 3. Delete user's sessions
        await db.execute(sql`DELETE FROM session WHERE user_id = ${userId}`);

        // 4. Delete user's accounts
        await db.execute(sql`DELETE FROM account WHERE user_id = ${userId}`);

        // 5. Delete user's profile
        await db.execute(sql`DELETE FROM user_profiles WHERE user_id = ${userId}`);

        // 6. Update projects owned by this user (set owner to null or delete)
        await db.execute(sql`UPDATE projects SET owner_id = NULL WHERE owner_id = ${userId}`);

        // 7. Finally delete the user
        await db.delete(user).where(eq(user.id, userId));

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error: any) {
        console.error('Failed to delete user:', error);
        res.status(500).json({
            error: 'Failed to delete user',
            message: error?.message || 'Unknown error'
        });
    }
});

// GET /api/admin/projects - Get all projects
router.get('/projects', async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 100;

        const allProjects = await db.select()
            .from(projects)
            .orderBy(desc(projects.createdAt))
            .limit(limit);

        res.json(allProjects);
    } catch (error: any) {
        console.error('Failed to get projects:', error);
        res.status(500).json({
            error: 'Failed to get projects',
            message: error?.message || 'Unknown error'
        });
    }
});

// DELETE /api/admin/projects/:projectId - Delete a project
router.delete('/projects/:projectId', async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;

        await db.delete(projects).where(eq(projects.id, projectId));

        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error: any) {
        console.error('Failed to delete project:', error);
        res.status(500).json({
            error: 'Failed to delete project',
            message: error?.message || 'Unknown error'
        });
    }
});

// PATCH /api/admin/projects/:projectId - Update project
router.patch('/projects/:projectId', async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const { status, name, description } = req.body;

        await db.update(projects)
            .set({
                ...(status && { status }),
                ...(name && { name }),
                ...(description && { description }),
                updatedAt: new Date()
            })
            .where(eq(projects.id, projectId));

        res.json({ success: true });
    } catch (error: any) {
        console.error('Failed to update project:', error);
        res.status(500).json({
            error: 'Failed to update project',
            message: error?.message || 'Unknown error'
        });
    }
});

export default router;
