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
            protocol: req.protocol,
            secure: req.secure,
            xForwardedProto: req.get('x-forwarded-proto'),
            matches: req.headers.origin ? actualTrustedOrigins?.includes(req.headers.origin) : 'no-origin-header',
            manualCheck: req.query.origin ? {
                tested: req.query.origin,
                result: actualTrustedOrigins?.includes(req.query.origin as string)
            } : 'provide ?origin=URL to test'
        }
    });
});

export default router;
