import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth.schema.js';
import { projects } from './projects.schema.js';

export const channels = pgTable('channels', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    projectId: text('project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    icon: text('icon').default('tag'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const messages = pgTable('messages', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    channelId: text('channel_id')
        .notNull()
        .references(() => channels.id, { onDelete: 'cascade' }),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    attachmentUrl: text('attachment_url'),
    attachmentName: text('attachment_name'),
    attachmentType: text('attachment_type'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const channelsRelations = relations(channels, ({ one, many }) => ({
    project: one(projects, {
        fields: [channels.projectId],
        references: [projects.id],
    }),
    messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
    channel: one(channels, {
        fields: [messages.channelId],
        references: [channels.id],
    }),
    sender: one(user, {
        fields: [messages.userId],
        references: [user.id],
    }),
}));
