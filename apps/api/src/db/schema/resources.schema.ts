import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth.schema.js';
import { projects } from './projects.schema.js';

export const resources = pgTable('resources', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    projectId: text('project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    type: text('type').notNull(), // linked_file, external_tool
    source: text('source'), // google_drive, figma, trello, etc.
    url: text('url'),
    thumbnailUrl: text('thumbnail_url'),
    fileType: text('file_type'), // pdf, jpg, doc, etc.
    tags: text('tags').array(),
    addedBy: text('added_by').references(() => user.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const resourcesRelations = relations(resources, ({ one }) => ({
    project: one(projects, {
        fields: [resources.projectId],
        references: [projects.id],
    }),
    uploader: one(user, {
        fields: [resources.addedBy],
        references: [user.id],
    }),
}));
