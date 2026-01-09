import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { resourcesService } from '../services/resources.service.js';

const router = Router();

router.use(authMiddleware);

// GET /api/projects/:projectId/resources
router.get('/projects/:projectId/resources', async (req, res, next) => {
    try {
        const resources = await resourcesService.getByProject(req.params.projectId);
        res.json(resources);
    } catch (error) {
        next(error);
    }
});

// POST /api/projects/:projectId/resources/upload
import { upload } from '../config/multer.js';
router.post('/projects/:projectId/resources/upload', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const projectId = req.params.projectId;
        const fileUrl = `/uploads/${req.file.filename}`;

        const resource = await resourcesService.create({
            projectId,
            name: req.file.originalname,
            type: 'linked_file',
            url: fileUrl,
            fileType: req.file.mimetype,
            source: 'upload',
            tags: ['upload'],
        }, req.user!.id);

        res.status(201).json(resource);
    } catch (error) {
        next(error);
    }
});

// POST /api/resources
router.post('/resources', async (req, res, next) => {
    try {
        const resource = await resourcesService.create(req.body, req.user!.id);
        res.status(201).json(resource);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/resources/:id
router.delete('/resources/:id', async (req, res, next) => {
    try {
        await resourcesService.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;
