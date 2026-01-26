import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './config/auth.js';
import routes from './routes/index.js';
import {
    errorMiddleware,
    notFoundHandler,
} from './middleware/error.middleware.js';

const app = express();
const PORT = process.env.PORT || 3002;

// CORS configuration
const allowedOrigins = [
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
                return callback(null, true);
            }
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

// Serve uploads directory
import path from 'path';
import fs from 'fs';
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Better Auth handler - must be before other routes
// This handles /api/auth/* routes automatically
app.all('/api/auth/*', toNodeHandler(auth));

// Debug routes (must be before main /api routes to avoid auth middleware capture)
import debugRoutes from './routes/debug.routes.js';
app.use('/api/debug', debugRoutes);

// API routes
app.use('/api', routes);


// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorMiddleware);

// Start server
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`
╔════════════════════════════════════════════════════╗
║     Student Flow PM API Server                     ║
╠════════════════════════════════════════════════════╣
║  🚀 Server running on http://localhost:${PORT}        ║
║  📚 API docs: http://localhost:${PORT}/api/health    ║
║  🔐 Auth: http://localhost:${PORT}/api/auth          ║
╚════════════════════════════════════════════════════╝
      `);
    });
}

export default app;
