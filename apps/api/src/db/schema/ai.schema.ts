import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth.schema';
import { projects } from './projects.schema';

export const aiSuggestions = pgTable('ai_suggestions', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    projectId: text('project_id').references(() => projects.id, {
        onDelete: 'cascade',
    }),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    type: text('type').notNull(), // task_suggestion, insight, document_analysis
    prompt: text('prompt'),
    response: text('response'),
    context: jsonb('context'), // source data used
    status: text('status').default('pending'), // pending, accepted, dismissed
    createdAt: timestamp('created_at').defaultNow(),
});

export const aiAnalysisCache = pgTable('ai_analysis_cache', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    projectId: text('project_id').references(() => projects.id, {
        onDelete: 'cascade',
    }),
    analysisType: text('analysis_type').notNull(), // health_score, velocity, resource_breakdown
    data: jsonb('data'),
    validUntil: timestamp('valid_until'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const aiSuggestionsRelations = relations(aiSuggestions, ({ one }) => ({
    project: one(projects, {
        fields: [aiSuggestions.projectId],
        references: [projects.id],
    }),
    user: one(user, {
        fields: [aiSuggestions.userId],
        references: [user.id],
    }),
}));

export const aiAnalysisCacheRelations = relations(
    aiAnalysisCache,
    ({ one }) => ({
        project: one(projects, {
            fields: [aiAnalysisCache.projectId],
            references: [projects.id],
        }),
    })
);
