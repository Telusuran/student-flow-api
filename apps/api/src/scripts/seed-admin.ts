import 'dotenv/config';
import { db } from '../config/db.js';
import { user } from '../db/schema/auth.schema.js';
import { userProfiles } from '../db/schema/users.schema.js';
import { eq } from 'drizzle-orm';

async function seedAdmin() {
    const email = 'testuser@example.com';
    const password = 'TestPass123!';

    console.log('🌱 Starting Admin Seeding...');

    // 1. Sign up user via API
    try {
        console.log(`Registering ${email}...`);
        const response = await fetch('http://localhost:3002/api/auth/sign-up/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3002', // Required by Better Auth
                'Referer': 'http://localhost:3002/api/auth'
            },
            body: JSON.stringify({
                email,
                password,
                name: 'Admin Test User'
            })
        });

        if (response.ok) {
            console.log('User registered via API.');
        } else {
            const text = await response.text();
            // 400 or 422 usually
            console.log(`API Registration status: ${response.status}. Response: ${text}`);
            if (response.status === 200 || response.status === 201) {
                // Success
            }
        }
    } catch (e) {
        console.error('Failed to call API:', e);
        console.log('Make sure apps/api is running on port 3002!');
        process.exit(1);
    }

    // 2. Update Role in DB
    try {
        const users = await db.select().from(user).where(eq(user.email, email)).limit(1);

        if (users.length === 0) {
            console.error('❌ User not found in DB. Registration must have failed completely.');
            process.exit(1);
        }

        const userId = users[0].id;
        console.log(`Found user ID: ${userId}. Checking profile...`);

        const profiles = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));

        if (profiles.length > 0) {
            console.log('Profile found. Updating role to admin...');
            await db.update(userProfiles)
                .set({ role: 'admin' })
                .where(eq(userProfiles.userId, userId));
        } else {
            console.log('Profile missing. Inserting admin profile...');
            await db.insert(userProfiles).values({
                userId: userId,
                role: 'admin',
                displayName: 'Admin Test User',
                institution: 'Test University',
                major: 'Computer Science'
            });
        }

        console.log('✅ Success: User is now Admin.');
        process.exit(0);

    } catch (err) {
        console.error('❌ DB Update failed:', err);
        process.exit(1);
    }
}

seedAdmin();
