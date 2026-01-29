import { Router, Request, Response } from 'express';
import { db } from '../db/index.js';
import { user } from '../db/schema/auth.schema.js';
import { userProfiles } from '../db/schema/users.schema.js';
import { projects } from '../db/schema/projects.schema.js';
import { tasks } from '../db/schema/tasks.schema.js';
import { eq, desc, count } from 'drizzle-orm';

const router = Router();

// Middleware to check if user is admin (basic check - should be enhanced)
const requireAdmin = async (req: Request, res: Response, next: Function) => {
    const userId = (req as Request & { userId?: string }).userId;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const profile = await db.select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .limit(1);

    if (!profile[0] || profile[0].role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    next();
};

// GET /api/admin/stats - Get dashboard statistics
router.get('/stats', async (req: Request, res: Response) => {
    try {
        const [usersCount] = await db.select({ count: count() }).from(user);
        const [projectsCount] = await db.select({ count: count() }).from(projects);
        const [tasksCount] = await db.select({ count: count() }).from(tasks);

        res.json({
            totalUsers: usersCount.count,
            totalProjects: projectsCount.count,
            totalTasks: tasksCount.count,
        });
    } catch (error) {
        console.error('Failed to get stats:', error);
        res.status(500).json({ error: 'Failed to get statistics' });
    }
});

// GET /api/admin/users - Get all users with profiles
router.get('/users', async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 100;

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

        // Get profiles for all users
        const profiles = await db.select().from(userProfiles);
        const profileMap = new Map(profiles.map(p => [p.userId, p]));

        const usersWithProfiles = users.map(u => ({
            ...u,
            profile: profileMap.get(u.id) || null,
        }));

        res.json(usersWithProfiles);
    } catch (error) {
        console.error('Failed to get users:', error);
        res.status(500).json({ error: 'Failed to get users' });
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

        await db.update(userProfiles)
            .set({ role, updatedAt: new Date() })
            .where(eq(userProfiles.userId, userId));

        res.json({ success: true });
    } catch (error) {
        console.error('Failed to update user role:', error);
        res.status(500).json({ error: 'Failed to update user role' });
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
    } catch (error) {
        console.error('Failed to get projects:', error);
        res.status(500).json({ error: 'Failed to get projects' });
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
    } catch (error) {
        console.error('Failed to update project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

export default router;
