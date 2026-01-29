import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
    schema: './dist/db/schema/*.js',
    out: './src/db/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL || process.env.POSTGRES_URL!,
    },
} satisfies Config;
