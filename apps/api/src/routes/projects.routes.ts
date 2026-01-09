import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { projectsService } from '../services/projects.service.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/projects - List user's projects
router.get('/', async (req, res, next) => {
    try {
        const projects = await projectsService.getAll(req.user!.id);
        res.json(projects);
    } catch (error) {
        next(error);
    }
});

// GET /api/projects/archived - List archived projects
router.get('/archived', async (req, res, next) => {
    try {
        const projects = await projectsService.getArchived(req.user!.id);
        res.json(projects);
    } catch (error) {
        next(error);
    }
});

// POST /api/projects - Create project
router.post('/', async (req, res, next) => {
    try {
        const project = await projectsService.create(req.body, req.user!.id);
        res.status(201).json(project);
    } catch (error) {
        next(error);
    }
});

// GET /api/projects/:id - Get project by ID
router.get('/:id', async (req, res, next) => {
    try {
        const project = await projectsService.getById(req.params.id, req.user!.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        next(error);
    }
});

// PUT /api/projects/:id - Update project
router.put('/:id', async (req, res, next) => {
    try {
        const project = await projectsService.update(
            req.params.id,
            req.body,
            req.user!.id
        );
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req, res, next) => {
    try {
        const deleted = await projectsService.delete(req.params.id, req.user!.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

// POST /api/projects/:id/restore - Restore deleted project
router.post('/:id/restore', async (req, res, next) => {
    try {
        const project = await projectsService.restore(req.params.id, req.user!.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        next(error);
    }
});

// POST /api/projects/:id/members - Add member
router.post('/:id/members', async (req, res, next) => {
    try {
        const { userId, role } = req.body;
        const member = await projectsService.addMember(
            req.params.id,
            userId,
            role
        );
        res.status(201).json(member);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/projects/:id/members/:userId - Remove member
router.delete('/:id/members/:userId', async (req, res, next) => {
    try {
        await projectsService.removeMember(req.params.id, req.params.userId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;
