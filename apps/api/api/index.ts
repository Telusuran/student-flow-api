import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();

// Diagnostic endpoint - no dependencies, always works
app.get('/api/health', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        message: 'Student Flow API is running',
        env: {
            hasDbUrl: !!(process.env.DATABASE_URL || process.env.POSTGRES_URL),
            hasAuthSecret: !!process.env.BETTER_AUTH_SECRET,
            hasFrontendUrl: !!process.env.FRONTEND_URL,
            vercel: process.env.VERCEL,
        }
    });
});

// Health check at root - also no dependencies
app.get('/', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Student Flow API is running' });
});

// CORS configuration - Allow all vercel.app domains
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (origin.includes('localhost') || origin.includes('127.0.0.1')) return callback(null, true);
            if (origin.endsWith('.vercel.app')) return callback(null, true);
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
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    app.use('/uploads', express.static(uploadDir));
} catch (e) {
    // Ignore - Vercel is read-only
}

// Lazy load auth and routes to catch initialization errors
let authHandler: any = null;
let routes: any = null;
let debugHandler: any = null;
let initError: Error | null = null;

async function initializeApp() {
    try {
        const { toNodeHandler } = await import('better-auth/node');
        const { auth } = await import('../src/config/auth.js');
        const routesModule = await import('../src/routes/index.js');
        const debugModule = await import('../src/routes/debug.routes.js');

        authHandler = toNodeHandler(auth);
        routes = routesModule.default;
        debugHandler = debugModule.default;

        return true;
    } catch (error) {
        initError = error as Error;
        console.error('Failed to initialize app:', error);
        return false;
    }
}

// Initialize on first request
let initialized = false;

app.use(async (req: Request, res: Response, next: NextFunction) => {
    // Skip for health endpoints
    if (req.path === '/' || req.path === '/api/health') {
        return next();
    }

    if (!initialized) {
        await initializeApp();
        initialized = true;
    }

    if (initError) {
        return res.status(500).json({
            error: 'App initialization failed',
            message: initError.message,
            stack: process.env.NODE_ENV === 'development' ? initError.stack : undefined
        });
    }

    next();
});

// Better Auth handler - lazy loaded
app.all('/api/auth/*', async (req: Request, res: Response, next: NextFunction) => {
    if (!authHandler) {
        return res.status(500).json({ error: 'Auth not initialized' });
    }
    return authHandler(req, res, next);
});

// Debug routes - lazy loaded (Added before API routes)
app.use('/api/debug', (req: Request, res: Response, next: NextFunction) => {
    if (!debugHandler) {
        return res.status(500).json({ error: 'Debug handler not initialized' });
    }
    return debugHandler(req, res, next);
});

// API routes - lazy loaded
app.use('/api', (req: Request, res: Response, next: NextFunction) => {
    if (!routes) {
        return res.status(500).json({ error: 'Routes not initialized', initError: initError?.message });
    }
    return routes(req, res, next);
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found', path: req.path });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message,
    });
});

export default app;
