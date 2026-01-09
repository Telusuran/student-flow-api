import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { rateLimitMiddleware } from '../middleware/rate-limit.middleware.js';
import { aiService } from '../services/ai.service.js';

const router = Router();

router.use(authMiddleware);

// Rate limit AI endpoints: 10 requests per minute
const aiRateLimit = rateLimitMiddleware({ windowMs: 60000, max: 10 });

// GET /api/projects/:id/ai/health - Get AI health score
router.get('/projects/:id/ai/health', aiRateLimit, async (req, res, next) => {
    try {
        const health = await aiService.calculateProjectHealth(
            req.params.id,
            req.user!.id
        );
        res.json(health);
    } catch (error) {
        next(error);
    }
});

// GET /api/projects/:id/ai/suggestions - Get smart task suggestions
router.get(
    '/projects/:id/ai/suggestions',
    aiRateLimit,
    async (req, res, next) => {
        try {
            const suggestions = await aiService.suggestNextTasks(
                req.params.id,
                req.user!.id
            );
            res.json(suggestions);
        } catch (error) {
            next(error);
        }
    }
);

// GET /api/projects/:id/ai/report - Generate insights report
router.get('/projects/:id/ai/report', aiRateLimit, async (req, res, next) => {
    try {
        const report = await aiService.generateInsightsReport(
            req.params.id,
            req.user!.id
        );
        res.json(report);
    } catch (error) {
        next(error);
    }
});

// GET /api/ai/global-health - Get Global AI health score
router.get('/global-health', aiRateLimit, async (req, res, next) => {
    try {
        const health = await aiService.calculateGlobalHealth(req.user!.id);
        res.json(health);
    } catch (error) {
        next(error);
    }
});

// GET /api/ai/global-suggestions - Get global smart task suggestions
router.get('/global-suggestions', aiRateLimit, async (req, res, next) => {
    try {
        const suggestions = await aiService.suggestNextGlobalTasks(req.user!.id);
        res.json(suggestions);
    } catch (error) {
        next(error);
    }
});

// GET /api/ai/global-report - Generate global insights report
router.get('/global-report', aiRateLimit, async (req, res, next) => {
    try {
        const report = await aiService.generateGlobalInsightsReport(req.user!.id);
        res.json(report);
    } catch (error) {
        next(error);
    }
});

// POST /api/ai/analyze-document - Analyze document content
router.post('/analyze-document', aiRateLimit, async (req, res, next) => {
    try {
        const { content, projectId } = req.body;
        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }
        const analysis = await aiService.analyzeDocument(
            content,
            projectId,
            req.user!.id
        );
        res.json(analysis);
    } catch (error) {
        next(error);
    }
});

// POST /api/ai/generate-suggestions - Generate suggestions from provided tasks
router.post('/generate-suggestions', aiRateLimit, async (req, res, next) => {
    try {
        const { projectId, tasks } = req.body;
        if (!tasks || !Array.isArray(tasks)) {
            return res.status(400).json({ error: 'Tasks array is required' });
        }
        const suggestions = await aiService.generateSuggestionsFromTasks(
            projectId,
            tasks,
            req.user!.id
        );
        res.json(suggestions);
    } catch (error) {
        next(error);
    }
});

export default router;

