import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../src/config/auth.js';
import routes from '../src/routes/index.js';
import {
    errorMiddleware,
    notFoundHandler,
} from '../src/middleware/error.middleware.js';
import path from 'path';
import fs from 'fs';

const app = express();

// Environment variable check endpoint for debugging
app.get('/api/env-check', (req: Request, res: Response) => {
    res.json({
        hasDbUrl: !!process.env.DATABASE_URL || !!process.env.POSTGRES_URL,
        hasAuthSecret: !!process.env.BETTER_AUTH_SECRET,
        hasFrontendUrl: !!process.env.FRONTEND_URL,
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
    });
});

// CORS configuration - Allow all vercel.app domains
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            // Allow localhost for development
            if (origin.includes('localhost')) return callback(null, true);
            // Allow all vercel.app domains
            if (origin.endsWith('.vercel.app')) return callback(null, true);
            // Allow configured frontend URL
            if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) return callback(null, true);
            console.warn('Blocked by CORS:', origin);
            return callback(null, false);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploads directory (note: won't persist on Vercel)
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    try {
        fs.mkdirSync(uploadDir, { recursive: true });
    } catch (e) {
        // Ignore - Vercel is read-only
    }
}
app.use('/uploads', express.static(uploadDir));

// Better Auth handler
app.all('/api/auth/*', toNodeHandler(auth));

// API routes
app.use('/api', routes);

// Health check at root
app.get('/', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Student Flow API is running' });
});

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorMiddleware);

export default app;
