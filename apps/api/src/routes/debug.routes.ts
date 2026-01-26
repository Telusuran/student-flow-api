import { Router } from 'express';

const router = Router();

import { auth } from '../config/auth.js';
import { db } from '../config/db.js';
import { sql } from 'drizzle-orm';

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

router.get('/db', async (req, res) => {
    try {
        // Try a simple query to assert connection
        const result = await db.execute(sql`SELECT NOW() as now`);

        // Try to check if tables exist (Postgres specific)
        const tables = await db.execute(sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);

        res.json({
            status: 'ok',
            connection: 'success',
            time: result.rows[0],
            tables: tables.rows.map((r: any) => r.table_name)
        });
    } catch (error: any) {
        console.error('Debug DB Error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message,
            code: error.code, // Postgres error code
            detail: error.detail
        });
    }
});

export default router;
