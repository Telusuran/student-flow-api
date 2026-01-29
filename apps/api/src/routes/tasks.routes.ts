import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { tasksService } from '../services/tasks.service.js';
import { upload } from '../config/multer.js';

const router = Router();

router.use(authMiddleware);

// GET /api/tasks - List tasks across all user projects
router.get('/tasks', async (req, res, next) => {
    try {
        // Need to import projectsService dynamically or move logic to avoid circular deps if any
        // Assuming simple import works here as routes import services
        const { projectsService } = await import('../services/projects.service.js');
        const projects = await projectsService.getAll(req.user!.id);
        const projectIds = projects.map(p => p.id);

        const tasks = await tasksService.getAll(projectIds);
        res.json(tasks);
    } catch (error) {
        next(error);
    }
});

// GET /api/projects/:projectId/tasks - List tasks for a project
router.get('/projects/:projectId/tasks', async (req, res, next) => {
    try {
        const tasks = await tasksService.getByProject(req.params.projectId);
        res.json(tasks);
    } catch (error) {
        next(error);
    }
});

// POST /api/projects/:projectId/tasks - Create task
router.post('/projects/:projectId/tasks', async (req, res, next) => {
    try {
        // Convert dueDate string to Date object if provided
        const taskData = {
            ...req.body,
            dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined,
        };

        const task = await tasksService.create(
            req.params.projectId,
            taskData,
            req.user!.id
        );
        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
});

// GET /api/tasks/:id - Get task by ID
router.get('/tasks/:id', async (req, res, next) => {
    try {
        const task = await tasksService.getById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        next(error);
    }
});

// PUT /api/tasks/:id - Update task
router.put('/tasks/:id', async (req, res, next) => {
    try {
        // Convert dueDate string to Date object if provided
        const updateData = {
            ...req.body,
            dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined,
        };

        const task = await tasksService.update(req.params.id, updateData);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        next(error);
    }
});

// PATCH /api/tasks/:id/status - Update task status
router.patch('/tasks/:id/status', async (req, res, next) => {
    try {
        const { status } = req.body;
        const task = await tasksService.updateStatus(req.params.id, status);
        res.json(task);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/tasks/:id', async (req, res, next) => {
    try {
        await tasksService.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

// POST /api/tasks/:id/assignees - Add assignee
router.post('/tasks/:id/assignees', async (req, res, next) => {
    try {
        const { userId } = req.body;
        const assignee = await tasksService.addAssignee(req.params.id, userId);
        res.status(201).json(assignee);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/tasks/:id/assignees/:userId - Remove assignee
router.delete('/tasks/:id/assignees/:userId', async (req, res, next) => {
    try {
        await tasksService.removeAssignee(req.params.id, req.params.userId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

// GET /api/tasks/:id/comments - Get comments
router.get('/tasks/:id/comments', async (req, res, next) => {
    try {
        const comments = await tasksService.getComments(req.params.id);
        res.json(comments);
    } catch (error) {
        next(error);
    }
});

// POST /api/tasks/:id/comments - Add comment
router.post('/tasks/:id/comments', async (req, res, next) => {
    try {
        const { content } = req.body;
        const comment = await tasksService.addComment(
            req.params.id,
            req.user!.id,
            content
        );
        res.status(201).json(comment);
    } catch (error) {
        next(error);
    }
});

// GET /api/tasks/:id/attachments - Get attachments
router.get('/tasks/:id/attachments', async (req, res, next) => {
    try {
        const attachments = await tasksService.getAttachments(req.params.id);
        res.json(attachments);
    } catch (error) {
        next(error);
    }
});

// POST /api/tasks/:id/attachments - Add attachment
router.post('/tasks/:id/attachments', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Need to import storageService dynamically or move logic
        // Assuming we can import it at the top if not circular, but keeping pattern
        const { storageService } = await import('../services/storage.service.js');

        const url = await storageService.upload(req.file, 'attachments'); // Upload to 'attachments' folder

        const attachment = await tasksService.addAttachment(
            req.params.id,
            req.user!.id,
            {
                name: req.file.originalname,
                url: url,
                type: req.file.mimetype,
                size: req.file.size
            }
        );
        res.status(201).json(attachment);
    } catch (error) {
        next(error);
    }
});

export default router;
