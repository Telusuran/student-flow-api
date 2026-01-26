import { Router } from 'express';

const router = Router();

import { auth } from '../config/auth.js';

router.get('/config', (req, res) => {
    // Inspect actual auth configuration
    const actualTrustedOrigins = auth.options.trustedOrigins;

    res.json({
        env: {
            NODE_ENV: process.env.NODE_ENV,
            FRONTEND_URL: process.env.FRONTEND_URL,
            BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        },
        actualConfig: {
            trustedOrigins: actualTrustedOrigins,
        },
        request: {
            origin: req.headers.origin,
            referer: req.headers.referer,
            host: req.headers.host,
            matches: req.headers.origin ? actualTrustedOrigins?.includes(req.headers.origin) : 'no-origin',
        }
    });
});

export default router;
