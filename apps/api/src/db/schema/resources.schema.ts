import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth.schema';
import { projects } from './projects.schema';

export const resources = pgTable('resources', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    projectId: text('project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
    parentId: text('parent_id'), // Self-referencing for folder hierarchy (null = root)
    isFolder: boolean('is_folder').default(false).notNull(),
    name: text('name').notNull(),
    description: text('description'),
    type: text('type').notNull(), // linked_file, external_tool, folder
    source: text('source'), // google_drive, figma, trello, upload, etc.
    url: text('url'),
    thumbnailUrl: text('thumbnail_url'),
    fileType: text('file_type'), // pdf, jpg, doc, etc. (null for folders)
    fileSize: text('file_size'), // File size in bytes (for display)
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
