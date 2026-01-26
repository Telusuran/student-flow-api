import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth.schema.js';
import { projects } from './projects.schema.js';

export const calendarEvents = pgTable('calendar_events', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    projectId: text('project_id').references(() => projects.id, {
        onDelete: 'set null',
    }),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time'),
    allDay: boolean('all_day').default(false),
    color: text('color').default('blue'),
    location: text('location'),
    type: text('type').default('event'), // event, deadline, meeting
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const calendarEventsRelations = relations(calendarEvents, ({ one }) => ({
    project: one(projects, {
        fields: [calendarEvents.projectId],
        references: [projects.id],
    }),
    user: one(user, {
        fields: [calendarEvents.userId],
        references: [user.id],
    }),
}));
