import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { messagingService } from '../services/messaging.service.js';

const router = Router();

// Middleware to ensure user is logged in
router.use(authMiddleware);

// Schema validation
const createChannelSchema = z.object({
    name: z.string().min(1).max(50),
});

const sendMessageSchema = z.object({
    content: z.string().min(1),
    attachment: z.object({
        name: z.string(),
        url: z.string().url(),
        type: z.string(),
    }).optional(),
});

// --- Channel Routes ---

// Get all channels for a project
router.get('/projects/:projectId/channels', async (req, res) => {
    try {
        const { projectId } = req.params;
        const channels = await messagingService.getProjectChannels(projectId);
        res.json(channels);
    } catch (error) {
        console.error('Error fetching channels:', error);
        res.status(500).json({ error: 'Failed to fetch channels' });
    }
});

// Create a new channel in a project
router.post('/projects/:projectId/channels', async (req, res) => {
    try {
        const { projectId } = req.params;
        const { name } = createChannelSchema.parse(req.body);

        const channel = await messagingService.createChannel(projectId, name);
        res.status(201).json(channel);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Error creating channel:', error);
        res.status(500).json({ error: 'Failed to create channel' });
    }
});

// --- Message Routes ---

// Get messages for a channel
router.get('/channels/:channelId/messages', async (req, res) => {
    try {
        const { channelId } = req.params;
        const messages = await messagingService.getChannelMessages(channelId);
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Send a message to a channel
router.post('/channels/:channelId/messages', async (req, res) => {
    try {
        const { channelId } = req.params;
        const userId = req.user!.id; // Auth middleware ensures user exists
        const { content, attachment } = sendMessageSchema.parse(req.body);

        const message = await messagingService.sendMessage(userId, channelId, content, attachment);
        res.status(201).json(message);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

export default router;
