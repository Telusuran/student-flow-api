import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter for AI endpoints
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
    windowMs?: number; // Time window in milliseconds
    max?: number; // Max requests per window
}

export const rateLimitMiddleware = (options: RateLimitOptions = {}) => {
    const { windowMs = 60000, max = 10 } = options; // Default: 10 requests per minute

    return (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id || req.ip || 'anonymous';
        const key = `${userId}:${req.path}`;
        const now = Date.now();

        const record = rateLimitStore.get(key);

        if (!record || now > record.resetAt) {
            // New window
            rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
            return next();
        }

        if (record.count >= max) {
            const retryAfter = Math.ceil((record.resetAt - now) / 1000);
            res.setHeader('Retry-After', retryAfter);
            return res.status(429).json({
                error: 'Too many requests',
                retryAfter,
            });
        }

        record.count++;
        next();
    };
};

// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
        if (now > value.resetAt) {
            rateLimitStore.delete(key);
        }
    }
}, 60000);
