import { Router } from 'express';
import projectsRoutes from './projects.routes.js';
import tasksRoutes from './tasks.routes.js';
import aiRoutes from './ai.routes.js';
import messagingRoutes from './messaging.routes.js';

const router = Router();

// Mount routes
router.use('/projects', projectsRoutes);
router.use('/', tasksRoutes); // Tasks have mixed paths
router.use('/ai', aiRoutes);
router.use('/messaging', messagingRoutes);
import usersRoutes from './users.routes.js';
router.use('/users', usersRoutes);
import notificationsRoutes from './notifications.routes.js';
router.use('/notifications', notificationsRoutes);
import resourcesRoutes from './resources.routes.js';
router.use('/', resourcesRoutes); // Resources routes have specific paths like /projects/:id/resources and /resources

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
