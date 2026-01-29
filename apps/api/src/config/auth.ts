import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db.js';

// Build trusted origins list
const trustedOrigins: string[] = [
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:3003', // CMS local
    'http://localhost:3003',
    process.env.BETTER_AUTH_URL || '',
    // Support comma-separated FRONTEND_URL
    ...(process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(',').map(url => url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`)
        : []),
    // Support comma-separated CMS_URL
    ...(process.env.CMS_URL
        ? process.env.CMS_URL.split(',').map(url => url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`)
        : [])
].filter(Boolean);

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: drizzleAdapter(db, {
        provider: 'pg',
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
    },
    trustedOrigins: ["*.vercel.app", ...trustedOrigins],
    advanced: {
        defaultCookieAttributes: {
            sameSite: "none",
            secure: true,
        },
    },
});

export type Auth = typeof auth;
