import { pgTable, text, timestamp, integer, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth.schema.js';
import { projects } from './projects.schema.js';

export const tasks = pgTable('tasks', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    projectId: text('project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    status: text('status').default('todo'), // todo, in_progress, review, done
    priority: text('priority').default('medium'), // low, medium, high
    category: text('category'), // Research, Outline, Reading, Admin, etc.
    dueDate: timestamp('due_date'),
    progress: integer('progress').default(0),
    order: integer('order').default(0), // for kanban ordering
    createdBy: text('created_by').references(() => user.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const taskAssignees = pgTable(
    'task_assignees',
    {
        taskId: text('task_id')
            .notNull()
            .references(() => tasks.id, { onDelete: 'cascade' }),
        userId: text('user_id')
            .notNull()
            .references(() => user.id, { onDelete: 'cascade' }),
        assignedAt: timestamp('assigned_at').defaultNow(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.taskId, table.userId] }),
    })
);

export const comments = pgTable('comments', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    taskId: text('task_id')
        .notNull()
        .references(() => tasks.id, { onDelete: 'cascade' }),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const attachments = pgTable('attachments', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    taskId: text('task_id')
        .notNull()
        .references(() => tasks.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    url: text('url').notNull(),
    type: text('type'), // pdf, image, doc, etc.
    size: integer('size'), // bytes
    uploadedBy: text('uploaded_by').references(() => user.id),
    createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const tasksRelations = relations(tasks, ({ one, many }) => ({
    project: one(projects, {
        fields: [tasks.projectId],
        references: [projects.id],
    }),
    creator: one(user, {
        fields: [tasks.createdBy],
        references: [user.id],
    }),
    assignees: many(taskAssignees),
    comments: many(comments),
    attachments: many(attachments),
}));

export const taskAssigneesRelations = relations(taskAssignees, ({ one }) => ({
    task: one(tasks, {
        fields: [taskAssignees.taskId],
        references: [tasks.id],
    }),
    user: one(user, {
        fields: [taskAssignees.userId],
        references: [user.id],
    }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
    task: one(tasks, {
        fields: [comments.taskId],
        references: [tasks.id],
    }),
    user: one(user, {
        fields: [comments.userId],
        references: [user.id],
    }),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
    task: one(tasks, {
        fields: [attachments.taskId],
        references: [tasks.id],
    }),
    uploader: one(user, {
        fields: [attachments.uploadedBy],
        references: [user.id],
    }),
}));
