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
            // Use raw SQL to only select columns that exist
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

// PATCH /api/admin/users/:userId/role - Update user role
router.patch('/users/:userId/role', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['student', 'mentor', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        // Use raw SQL to avoid schema mismatch
        await db.execute(sql`
            UPDATE user_profiles 
            SET role = ${role}, updated_at = NOW()
            WHERE user_id = ${userId}
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

// PATCH /api/admin/projects/:projectId - Update project
router.patch('/projects/:projectId', async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const { status } = req.body;

        await db.update(projects)
            .set({ status, updatedAt: new Date() })
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
