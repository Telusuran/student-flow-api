import { pgTable, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth.schema.js';

export const notifications = pgTable('notifications', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    type: text('type').notNull(), // task_assigned, deadline, mention, etc.
    title: text('title').notNull(),
    message: text('message'),
    read: boolean('read').default(false),
    data: jsonb('data'), // flexible payload
    createdAt: timestamp('created_at').defaultNow(),
});

export const notificationSettings = pgTable('notification_settings', {
    userId: text('user_id')
        .primaryKey()
        .references(() => user.id, { onDelete: 'cascade' }),
    taskAssigned: boolean('task_assigned').default(true),
    taskAssignedEmail: boolean('task_assigned_email').default(true),
    taskAssignedInApp: boolean('task_assigned_in_app').default(true),
    taskStatusChange: boolean('task_status_change').default(false),
    deadlineApproaching: boolean('deadline_approaching').default(true),
    deadlinePush: boolean('deadline_push').default(true),
    alertTime: text('alert_time').default('24 hours before'),
    projectReminders: boolean('project_reminders').default(true),
    documentUploaded: boolean('document_uploaded').default(false),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const notificationsRelations = relations(notifications, ({ one }) => ({
    user: one(user, {
        fields: [notifications.userId],
        references: [user.id],
    }),
}));

export const notificationSettingsRelations = relations(
    notificationSettings,
    ({ one }) => ({
        user: one(user, {
            fields: [notificationSettings.userId],
            references: [user.id],
        }),
    })
);
