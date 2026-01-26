import { Router } from 'express';
import { notificationsService } from '../services/notifications.service.js';
import { notificationSettingsService } from '../services/notificationSettings.service.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Get notifications
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user!.id;
        const notifications = await notificationsService.getForUser(userId);
        res.json(notifications);
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// Mark as read
router.patch('/:id/read', authMiddleware, async (req, res) => {
    try {
        const userId = req.user!.id;
        const { id } = req.params;
        const notification = await notificationsService.markAsRead(id, userId);
        res.json(notification);
    } catch (error) {
        console.error('Mark notification read error:', error);
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

// Mark ALL as read
router.post('/mark-all-read', authMiddleware, async (req, res) => {
    try {
        const userId = req.user!.id;
        await notificationsService.markAllAsRead(userId);
        res.json({ success: true });
    } catch (error) {
        console.error('Mark all read error:', error);
        res.status(500).json({ error: 'Failed to mark all as read' });
    }
});

// GET /api/notifications/settings - Get notification settings
router.get('/settings', authMiddleware, async (req, res) => {
    try {
        const userId = req.user!.id;
        const settings = await notificationSettingsService.getSettings(userId);
        res.json(settings);
    } catch (error) {
        console.error('Get notification settings error:', error);
        res.status(500).json({ error: 'Failed to fetch notification settings' });
    }
});

// PUT /api/notifications/settings - Update notification settings
router.put('/settings', authMiddleware, async (req, res) => {
    try {
        const userId = req.user!.id;
        const settings = await notificationSettingsService.updateSettings(userId, req.body);
        res.json(settings);
    } catch (error) {
        console.error('Update notification settings error:', error);
        res.status(500).json({ error: 'Failed to update notification settings' });
    }
});

export default router;

