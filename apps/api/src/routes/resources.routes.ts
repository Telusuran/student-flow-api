import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { resourcesService } from '../services/resources.service.js';
import { upload } from '../config/multer.js';
import { storageService } from '../services/storage.service.js';

const router = Router();

router.use(authMiddleware);

// GET /api/projects/:projectId/resources - List resources (with optional ?parentId for folder navigation)
router.get('/projects/:projectId/resources', async (req, res, next) => {
    try {
        const { parentId } = req.query;
        // If parentId is provided, get resources in that folder
        // If parentId is 'root' or not provided, get root level resources
        const parent = parentId && parentId !== 'root' ? String(parentId) : null;
        const resources = await resourcesService.getByFolder(req.params.projectId, parent);
        res.json(resources);
    } catch (error) {
        next(error);
    }
});

// POST /api/projects/:projectId/resources/folder - Create a folder
router.post('/projects/:projectId/resources/folder', async (req, res, next) => {
    try {
        const { name, parentId } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Folder name is required' });
        }
        const folder = await resourcesService.createFolder(
            req.params.projectId,
            name,
            parentId || null,
            req.user!.id
        );
        res.status(201).json(folder);
    } catch (error) {
        next(error);
    }
});

// POST /api/projects/:projectId/resources/upload - Upload a file
router.post('/projects/:projectId/resources/upload', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const projectId = req.params.projectId;
        const { parentId } = req.body;

        // Upload file via StorageService (handles both local and cloud)
        const fileUrl = await storageService.upload(req.file, 'resources');

        const resource = await resourcesService.create({
            projectId,
            parentId: parentId || null,
            name: req.file.originalname,
            type: 'linked_file',
            url: fileUrl,
            fileType: req.file.mimetype,
            fileSize: String(req.file.size),
            source: 'upload',
            tags: ['upload'],
        }, req.user!.id);

        res.status(201).json(resource);
    } catch (error) {
        next(error);
    }
});

// POST /api/resources - Create resource (link or external)
router.post('/resources', async (req, res, next) => {
    try {
        const resource = await resourcesService.create(req.body, req.user!.id);
        res.status(201).json(resource);
    } catch (error) {
        next(error);
    }
});

// GET /api/resources/:id - Get single resource by ID
router.get('/resources/:id', async (req, res, next) => {
    try {
        const resource = await resourcesService.getById(req.params.id);
        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }
        res.json(resource);
    } catch (error) {
        next(error);
    }
});

// PATCH /api/resources/:id/rename - Rename resource
router.patch('/resources/:id/rename', async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const resource = await resourcesService.rename(req.params.id, name);
        res.json(resource);
    } catch (error) {
        next(error);
    }
});

// PATCH /api/resources/:id/move - Move resource to different folder
router.patch('/resources/:id/move', async (req, res, next) => {
    try {
        const { parentId } = req.body;
        // parentId can be null to move to root
        const resource = await resourcesService.move(req.params.id, parentId ?? null);
        res.json(resource);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/resources/:id - Delete resource
router.delete('/resources/:id', async (req, res, next) => {
    try {
        await resourcesService.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;

