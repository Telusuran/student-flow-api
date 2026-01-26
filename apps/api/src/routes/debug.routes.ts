import { Router } from 'express';

const router = Router();

router.get('/config', (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || '';

    // Replicate logic from auth.ts
    const trustedOrigins = [
        'http://127.0.0.1:5173',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        ...(frontendUrl
            ? frontendUrl.split(',').map(url => url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`)
            : [])
    ].filter(Boolean);

    res.json({
        env: {
            NODE_ENV: process.env.NODE_ENV,
            FRONTEND_URL: frontendUrl,
            BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
            VERCEL_URL: process.env.VERCEL_URL, // Vercel system env
        },
        computed: {
            trustedOrigins,
            requestOrigin: req.headers.origin,
            requestReferer: req.headers.referer,
            isOriginTrusted: req.headers.origin ? trustedOrigins.includes(req.headers.origin) : 'no-origin-header',
        }
    });
});

export default router;
