import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const userProfiles = pgTable('user_profiles', {
    userId: text('user_id')
        .primaryKey()
        .references(() => user.id, { onDelete: 'cascade' }),
    displayName: text('display_name'),
    avatarUrl: text('avatar_url'),
    role: text('role').default('student'), // student, mentor, admin
    institution: text('institution'),
    currentTerm: text('current_term'),
    timezone: text('timezone').default('UTC'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
