import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '../db/schema/index.js';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

// Log connection errors
pool.on('error', (err) => {
    console.error('Unexpected error on idle client:', err);
});

// Test connection on startup
pool.connect()
    .then(client => {
        console.log('✓ Database connected successfully');
        client.release();
    })
    .catch(err => {
        console.error('✗ Database connection failed:', err.message);
    });

export const db = drizzle(pool, { schema });

export type Database = typeof db;
