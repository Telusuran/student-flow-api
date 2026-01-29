import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth.schema';

export const projects = pgTable('projects', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    description: text('description'),
    courseCode: text('course_code'), // e.g., "CS101", "HIS200"
    courseName: text('course_name'),
    color: text('color').default('#3B82F6'),
    icon: text('icon').default('folder'),
    status: text('status').default('active'), // active, archived, deleted
    dueDate: timestamp('due_date'),
    startDate: timestamp('start_date'),
    progress: integer('progress').default(0), // 0-100
    ownerId: text('owner_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'), // soft delete
});

export const projectMembers = pgTable('project_members', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    projectId: text('project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    role: text('role').default('member'), // owner, member, viewer
    joinedAt: timestamp('joined_at').defaultNow(),
});

// Relations
export const projectsRelations = relations(projects, ({ one, many }) => ({
    owner: one(user, {
        fields: [projects.ownerId],
        references: [user.id],
    }),
    members: many(projectMembers),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
    project: one(projects, {
        fields: [projectMembers.projectId],
        references: [projects.id],
    }),
    user: one(user, {
        fields: [projectMembers.userId],
        references: [user.id],
    }),
}));
