import { Router } from 'express';
import { z } from 'zod';
import { usersService } from '../services/users.service.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Schema for updating profile
const updateProfileSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    image: z.string().url().optional(),
    email: z.string().email().optional(),
    institution: z.string().max(200).optional(),
    major: z.string().max(200).optional(),
    bio: z.string().max(1000).optional(),
});

// Schema for search query
const searchSchema = z.object({
    q: z.string().min(2),
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const userId = req.user!.id;
        const userData = await usersService.getById(userId);
        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(userData);
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ error: 'Failed to get user data' });
    }
});

// Update current user profile
router.patch('/me', authMiddleware, async (req, res) => {
    try {
        const userId = req.user!.id;
        const result = updateProfileSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                error: 'Invalid data',
                details: result.error.flatten()
            });
        }

        const updated = await usersService.update(userId, result.data);
        res.json(updated);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Delete current user account
router.delete('/me', authMiddleware, async (req, res) => {
    try {
        const userId = req.user!.id;
        await usersService.delete(userId);
        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

// Search users
router.get('/search', authMiddleware, async (req, res) => {
    try {
        const result = searchSchema.safeParse(req.query);

        if (!result.success) {
            return res.status(400).json({
                error: 'Invalid query',
                details: result.error.flatten()
            });
        }

        const { q } = result.data;
        const currentUserId = req.user?.id;

        const users = await usersService.search(q, currentUserId);
        res.json(users);
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({ error: 'Failed to search users' });
    }
});

export default router;
