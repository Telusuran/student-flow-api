import { eq, and, desc, gte } from 'drizzle-orm';
import { db, type Database } from '../config/db.js';
import { generateAICompletion, isAIEnabled } from '../config/ai.js';
import {
    projects,
    tasks,
    aiSuggestions,
    aiAnalysisCache,
} from '../db/schema/index.js';

interface ProjectMetrics {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    daysUntilDeadline: number | null;
    tasksCompletedThisWeek: number;
    avgCompletionTime: number;
}

interface HealthScore {
    score: number;
    status: 'excellent' | 'good' | 'at_risk' | 'critical';
    insights: string[];
}

export class AIService {
    constructor(private database: Database = db) { }

    private async getProjectMetrics(projectId: string): Promise<ProjectMetrics> {
        const project = await this.database.query.projects.findFirst({
            where: eq(projects.id, projectId),
        });

        const allTasks = await this.database.query.tasks.findMany({
            where: eq(tasks.projectId, projectId),
        });

        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const totalTasks = allTasks.length;
        const completedTasks = allTasks.filter((t) => t.status === 'done').length;
        const inProgressTasks = allTasks.filter(
            (t) => t.status === 'in_progress'
        ).length;
        const overdueTasks = allTasks.filter(
            (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done'
        ).length;

        const daysUntilDeadline = project?.dueDate
            ? Math.ceil(
                (new Date(project.dueDate).getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24)
            )
            : null;

        const tasksCompletedThisWeek = allTasks.filter(
            (t) =>
                t.status === 'done' &&
                t.updatedAt &&
                new Date(t.updatedAt) >= weekAgo
        ).length;

        return {
            totalTasks,
            completedTasks,
            inProgressTasks,
            overdueTasks,
            daysUntilDeadline,
            tasksCompletedThisWeek,
            avgCompletionTime: 3,
        };
    }

    async calculateProjectHealth(
        projectId: string,
        userId: string
    ): Promise<HealthScore> {
        // Check cache first
        const cached = await this.database.query.aiAnalysisCache.findFirst({
            where: and(
                eq(aiAnalysisCache.projectId, projectId),
                eq(aiAnalysisCache.analysisType, 'health_score'),
                gte(aiAnalysisCache.validUntil, new Date())
            ),
        });

        if (cached?.data) {
            return cached.data as HealthScore;
        }

        const metrics = await this.getProjectMetrics(projectId);

        // If AI is not enabled, use a simple calculation
        if (!isAIEnabled()) {
            return this.calculateFallbackHealth(metrics);
        }

        const prompt = `Calculate a project health score (0-100) based on these metrics:
- Total tasks: ${metrics.totalTasks}
- Completed tasks: ${metrics.completedTasks}
- In progress tasks: ${metrics.inProgressTasks}
- Overdue tasks: ${metrics.overdueTasks}
- Days until deadline: ${metrics.daysUntilDeadline ?? 'No deadline set'}
- Tasks completed this week: ${metrics.tasksCompletedThisWeek}

Respond with JSON: { "score": number, "status": "excellent"|"good"|"at_risk"|"critical", "insights": string[] }`;

        try {
            const text = await generateAICompletion({ prompt, maxTokens: 512 });
            const healthScore = JSON.parse(text) as HealthScore;

            // Cache for 1 hour
            await this.database.insert(aiAnalysisCache).values({
                projectId,
                analysisType: 'health_score',
                data: healthScore,
                validUntil: new Date(Date.now() + 60 * 60 * 1000),
            });

            return healthScore;
        } catch (error) {
            console.error('AI health calculation failed:', error);
            return this.calculateFallbackHealth(metrics);
        }
    }

    private calculateFallbackHealth(metrics: ProjectMetrics): HealthScore {
        const completionRate =
            metrics.totalTasks > 0
                ? (metrics.completedTasks / metrics.totalTasks) * 100
                : 0;
        const overdueRatio =
            metrics.totalTasks > 0
                ? (metrics.overdueTasks / metrics.totalTasks) * 100
                : 0;

        let score = Math.round(completionRate - overdueRatio * 2);
        score = Math.max(0, Math.min(100, score));

        const status =
            score >= 80
                ? 'excellent'
                : score >= 60
                    ? 'good'
                    : score >= 40
                        ? 'at_risk'
                        : 'critical';

        return {
            score,
            status,
            insights: [
                `${metrics.completedTasks}/${metrics.totalTasks} tasks completed`,
                metrics.overdueTasks > 0
                    ? `${metrics.overdueTasks} overdue tasks need attention`
                    : 'No overdue tasks',
            ],
        };
    }

    async suggestNextTasks(projectId: string, userId: string) {
        if (!isAIEnabled()) {
            return [];
        }

        const projectTasks = await this.database.query.tasks.findMany({
            where: eq(tasks.projectId, projectId),
            orderBy: [desc(tasks.updatedAt)],
            limit: 20,
        });

        const project = await this.database.query.projects.findFirst({
            where: eq(projects.id, projectId),
        });

        const prompt = `Given this project context:
Project: ${project?.name || 'Unknown'} - ${project?.description || 'No description'}
Course: ${project?.courseCode || ''} ${project?.courseName || ''}
Current tasks: ${JSON.stringify(
            projectTasks.map((t) => ({
                title: t.title,
                status: t.status,
                priority: t.priority,
                dueDate: t.dueDate,
            }))
        )}

Suggest 3 next tasks the user should create or work on.

Respond with JSON array: [{ "title": string, "description": string, "priority": "low"|"medium"|"high", "reasoning": string }]`;

        try {
            const text = await generateAICompletion({ prompt, maxTokens: 1024 });
            const suggestions = JSON.parse(text);

            if (!Array.isArray(suggestions)) {
                console.warn('AI suggestions response is not an array:', text);
                return [];
            }

            // Store suggestions
            for (const suggestion of suggestions) {
                await this.database.insert(aiSuggestions).values({
                    projectId,
                    userId,
                    type: 'task_suggestion',
                    prompt: prompt.slice(0, 500),
                    response: JSON.stringify(suggestion),
                    context: { projectTasks: projectTasks.length },
                });
            }

            return suggestions;
        } catch (error) {
            console.error('AI suggestion failed:', error);
            return [];
        }
    }

    async analyzeDocument(content: string, projectId: string, userId: string) {
        if (!isAIEnabled()) {
            return { error: 'AI features not available' };
        }

        const today = new Date().toISOString().split('T')[0];

        const prompt = `You are an intelligent academic project assistant. Analyze this document and provide actionable insights.

TODAY'S DATE: ${today}

DOCUMENT CONTENT:
${content.slice(0, 12000)}

ANALYZE AND PROVIDE:

1. **Key Topics** - Main subjects that need research or understanding
2. **Suggested Tasks** - Break down the work into actionable tasks with:
   - Clear, specific title
   - Description of what needs to be done
   - Priority (low/medium/high) based on importance and dependencies
   - Estimated due date (YYYY-MM-DD format) - Calculate reasonable deadlines based on:
     * Mentioned dates in the document
     * Logical sequence (research before writing, outline before draft)
     * Typical academic timelines
   - Category (Research, Writing, Reading, Review, Admin, Preparation)
3. **Deadlines** - Any explicit deadlines found in the document
4. **Key Concepts** - Important terms or ideas to understand
5. **Summary** - Brief 2-3 sentence summary of what this document is about

Respond with JSON:
{
  "summary": "string",
  "topics": ["string"],
  "suggestedTasks": [{
    "title": "string",
    "description": "string", 
    "priority": "low|medium|high",
    "dueDate": "YYYY-MM-DD",
    "category": "Research|Writing|Reading|Review|Admin|Preparation"
  }],
  "deadlines": [{ "date": "YYYY-MM-DD", "description": "string" }],
  "keyConcepts": ["string"]
}`;

        try {
            const text = await generateAICompletion({ prompt, maxTokens: 2048 });
            const analysis = JSON.parse(text);

            await this.database.insert(aiSuggestions).values({
                projectId,
                userId,
                type: 'document_analysis',
                response: JSON.stringify(analysis),
            });

            return analysis;
        } catch (error: any) {
            console.error('Document analysis failed:', error);
            return { error: 'Analysis failed: ' + error.message };
        }
    }

    // Analyze uploaded file (PDF, Image) using multimodal AI
    async analyzeFile(fileBuffer: Buffer, mimeType: string, fileName: string, projectId: string | null, userId: string) {
        // Import the multimodal function
        const { generateAICompletionWithFile } = await import('../config/ai.js');

        const today = new Date().toISOString().split('T')[0];

        const prompt = `You are an intelligent academic project assistant. Analyze this uploaded document/image and provide actionable insights.

TODAY'S DATE: ${today}
FILE NAME: ${fileName}
FILE TYPE: ${mimeType}

ANALYZE THE CONTENT AND PROVIDE:

1. **Summary** - Brief 2-3 sentence summary of what this document is about
2. **Key Topics** - Main subjects that need research or understanding
3. **Suggested Tasks** - Break down the work into actionable tasks with:
   - Clear, specific title
   - Description of what needs to be done
   - Priority (low/medium/high) based on importance and dependencies
   - Estimated due date (YYYY-MM-DD format) - Calculate reasonable deadlines
   - Category (Research, Writing, Reading, Review, Admin, Preparation)
4. **Deadlines** - Any explicit deadlines found in the document
5. **Key Concepts** - Important terms or ideas to understand

Respond with JSON:
{
  "summary": "string",
  "topics": ["string"],
  "suggestedTasks": [{
    "title": "string",
    "description": "string", 
    "priority": "low|medium|high",
    "dueDate": "YYYY-MM-DD",
    "category": "Research|Writing|Reading|Review|Admin|Preparation"
  }],
  "deadlines": [{ "date": "YYYY-MM-DD", "description": "string" }],
  "keyConcepts": ["string"]
}`;

        try {
            const text = await generateAICompletionWithFile({
                prompt,
                fileBuffer,
                mimeType,
                maxTokens: 4096,
            });
            const analysis = JSON.parse(text);

            // Store analysis if projectId provided
            if (projectId) {
                await this.database.insert(aiSuggestions).values({
                    projectId,
                    userId,
                    type: 'file_analysis',
                    response: JSON.stringify(analysis),
                });
            }

            return analysis;
        } catch (error: any) {
            console.error('File analysis failed:', error);
            return { error: 'File analysis failed: ' + error.message };
        }
    }

    async generateInsightsReport(projectId: string, userId: string) {
        const metrics = await this.getProjectMetrics(projectId);
        const health = await this.calculateProjectHealth(projectId, userId);

        if (!isAIEnabled()) {
            return {
                health,
                metrics,
                summary: `Project has ${metrics.completedTasks}/${metrics.totalTasks} tasks completed.`,
                recommendations: [],
            };
        }

        const prompt = `Generate an insights report for this project:
Health Score: ${health.score} (${health.status})
Metrics: ${JSON.stringify(metrics)}

Provide:
1. Executive summary (2-3 sentences)
2. Key achievements
3. Areas needing attention
4. Recommended next steps

Respond with JSON: { "summary": string, "achievements": string[], "attention": string[], "recommendations": string[] }`;

        try {
            const text = await generateAICompletion({ prompt, maxTokens: 1024 });
            const report = JSON.parse(text);

            return { health, metrics, ...report };
        } catch (error) {
            console.error('Report generation failed:', error);
            return {
                health,
                metrics,
                summary: 'Report generation encountered an error',
                recommendations: [],
            };
        }
    }

    async generateSuggestionsFromTasks(
        projectId: string | null,
        taskList: Array<{ title: string; status: string | null; priority: string | null; dueDate: string | null }>,
        userId: string
    ) {
        if (!isAIEnabled()) {
            return [];
        }

        let projectContext = 'All Projects';
        if (projectId && projectId !== 'all') {
            const project = await this.database.query.projects.findFirst({
                where: eq(projects.id, projectId),
            });
            projectContext = project ? `${project.name} - ${project.description || 'No description'}` : 'Unknown Project';
        }

        const today = new Date().toISOString().split('T')[0];
        const prompt = `You are an AI assistant for a student project management app.
Analyze these existing tasks and suggest 3 NEW tasks that would help the user make progress.

TODAY'S DATE: ${today}

Project Context: ${projectContext}
Current Tasks:
${JSON.stringify(taskList.slice(0, 30), null, 2)}

Based on these tasks:
1. Identify gaps or missing steps
2. Suggest complementary tasks that would help complete the work
3. Recommend preparatory or follow-up tasks
4. Suggest realistic due dates based on task complexity and existing deadlines

Respond ONLY with a JSON array: [{ "title": string, "description": string, "priority": "low"|"medium"|"high", "dueDate": "YYYY-MM-DD", "reasoning": string }]`;

        try {
            const text = await generateAICompletion({ prompt, maxTokens: 1024 });
            return JSON.parse(text);
        } catch (error) {
            console.error('Generate suggestions from tasks failed:', error);
            return [];
        }
    }

    private async getGlobalMetrics(userId: string): Promise<ProjectMetrics> {
        const userProjects = await this.database.query.projects.findMany({
            where: eq(projects.ownerId, userId),
        });

        if (userProjects.length === 0) {
            return {
                totalTasks: 0,
                completedTasks: 0,
                inProgressTasks: 0,
                overdueTasks: 0,
                daysUntilDeadline: null,
                tasksCompletedThisWeek: 0,
                avgCompletionTime: 0,
            };
        }

        const projectIds = userProjects.map(p => p.id);

        // Import inArray dynamically or assume it is available if I change imports (I will add it to imports in next step if needed, but for now I'll use logic that doesn't strictly depend on it if I don't edit imports yet? No, I should edit imports first or use a loop. 
        // Better: I will edit the imports in a separate tool call if replace_file_content doesn't allow 'top of file' edits easily with this block. 
        // Actually, let's try to query tasks for all projects.
        // For simplicity and safety without modifying imports at the top right now, I'll fetch tasks by project individually or use a query builder if 'inArray' was imported. 
        // Wait, I can't easily add 'inArray' to imports without a separate edit. unique imports are at the top.
        // I'll stick to fetching all tasks for these projects by iterating or fetching all user tasks if `tasks.userId` exists.
        // Looking at schema usage elsewhere: tasks usually have projectId. 

        // Let's assume I can't change imports in this specific block effectively without touching line 1.
        // I will implement a slightly less efficient loop or multiple queries if 'inArray' isn't available, OR I will assume I can update imports in a subsequent step.
        // Actually, I'll update the imports first in a separate step to be safe. But wait, I'm defining the methods here.

        // Okay, I'll assume 'inArray' IS needed and I will add it to the imports in a separate call or rely on existing imports.
        // Checking file: line 1 has `import { eq, and, desc, gte } from 'drizzle-orm';`. 'inArray' is missing.

        // Strategy: I will add the methods here, but implemented using javascript logic after fetching all projects and their tasks, to avoid import issues for now if I can't change line 1 easily in same turn (I can, but I want to be safe). 
        // Actually, `this.database.query.tasks.findMany` usually accepts `where: inArray(...)`.

        // ALTERNATIVE: Use `userProjects` to fetch tasks. 
        // const allTasks = (await Promise.all(userProjects.map(p => this.database.query.tasks.findMany({ where: eq(tasks.projectId, p.id) })))).flat();
        // This is safe without 'inArray'.

        const allTasksPromises = userProjects.map(p =>
            this.database.query.tasks.findMany({
                where: eq(tasks.projectId, p.id),
            })
        );
        const allTasksResults = await Promise.all(allTasksPromises);
        const allTasks = allTasksResults.flat();

        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const totalTasks = allTasks.length;
        const completedTasks = allTasks.filter((t) => t.status === 'done').length;
        const inProgressTasks = allTasks.filter(
            (t) => t.status === 'in_progress'
        ).length;
        const overdueTasks = allTasks.filter(
            (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done'
        ).length;

        // For global deadline, maybe nearest deadline?
        const upcomingDeadlines = userProjects
            .filter(p => p.dueDate && new Date(p.dueDate) > now)
            .map(p => new Date(p.dueDate!).getTime());

        const nearestDeadline = upcomingDeadlines.length > 0 ? Math.min(...upcomingDeadlines) : null;

        const daysUntilDeadline = nearestDeadline
            ? Math.ceil((nearestDeadline - now.getTime()) / (1000 * 60 * 60 * 24))
            : null;

        const tasksCompletedThisWeek = allTasks.filter(
            (t) =>
                t.status === 'done' &&
                t.updatedAt &&
                new Date(t.updatedAt) >= weekAgo
        ).length;

        return {
            totalTasks,
            completedTasks,
            inProgressTasks,
            overdueTasks,
            daysUntilDeadline,
            tasksCompletedThisWeek,
            avgCompletionTime: 3,
        };
    }

    async calculateGlobalHealth(userId: string): Promise<HealthScore> {
        // Simple/No-cache for now or cache with key 'global_health_USERID'
        // But schema 'aiAnalysisCache' uses 'projectId'. I can use a fake projectId like 'global' or 'user_ID'.
        // Let's use 'global_USERID' as projectId field in cache if it fits, or just don't cache global for now to save schema changes. 
        // The schema `projectId` is likely a uuid/foreign key? If it references `projects` table, I can't put a string there.
        // I'll check schema later. For now, NO CACHE for global to avoid FK constraint errors.

        const metrics = await this.getGlobalMetrics(userId);

        if (!isAIEnabled()) {
            return this.calculateFallbackHealth(metrics);
        }

        const prompt = `Calculate a GLOBAL workspace health score (0-100) for a student managing multiple projects, based on these aggregated metrics:
- Total tasks (all projects): ${metrics.totalTasks}
- Completed tasks: ${metrics.completedTasks}
- In progress tasks: ${metrics.inProgressTasks}
- Overdue tasks: ${metrics.overdueTasks}
- Days until nearest major deadline: ${metrics.daysUntilDeadline ?? 'No upcoming deadlines'}
- Tasks completed this week: ${metrics.tasksCompletedThisWeek}

Respond with JSON: { "score": number, "status": "excellent"|"good"|"at_risk"|"critical", "insights": string[] }`;

        try {
            const text = await generateAICompletion({ prompt, maxTokens: 512 });
            return JSON.parse(text) as HealthScore;
        } catch (error) {
            console.error('AI global health calculation failed:', error);
            return this.calculateFallbackHealth(metrics);
        }
    }

    async suggestNextGlobalTasks(userId: string) {
        if (!isAIEnabled()) {
            return [];
        }
        console.log('suggestNextGlobalTasks called for user:', userId);

        const userProjects = await this.database.query.projects.findMany({
            where: eq(projects.ownerId, userId),
        });

        const allTasksPromises = userProjects.map(p =>
            this.database.query.tasks.findMany({
                where: eq(tasks.projectId, p.id),
                orderBy: [desc(tasks.updatedAt)],
                limit: 5, // Get top 5 recent from each to save tokens
            })
        );
        const results = await Promise.all(allTasksPromises);
        const allRecentTasks = results.flat();

        const prompt = `Context: User is a student managing ${userProjects.length} projects.
Recent tasks across all projects: ${JSON.stringify(
            allRecentTasks.map((t) => ({
                title: t.title,
                status: t.status,
                priority: t.priority,
                dueDate: t.dueDate,
            })).slice(0, 30) // Limit total context
        )}

Suggest 3 high-impact next tasks the user should focus on across their workspace (or new tasks to add).
Respond with JSON array: [{ "title": string, "description": string, "priority": "low"|"medium"|"high", "reasoning": string }]`;

        try {
            const text = await generateAICompletion({ prompt, maxTokens: 1024 });
            return JSON.parse(text);
        } catch (error) {
            console.error('AI global suggestion failed:', error);
            return [];
        }
    }

    async generateGlobalInsightsReport(userId: string) {
        const metrics = await this.getGlobalMetrics(userId);
        const health = await this.calculateGlobalHealth(userId);

        if (!isAIEnabled()) {
            return {
                health,
                metrics,
                summary: `You have completed ${metrics.completedTasks} out of ${metrics.totalTasks} tasks across all projects.`,
                recommendations: [],
            };
        }

        const prompt = `Generate an executive insights report for a student's ENTIRE workspace:
Health Score: ${health.score} (${health.status})
Aggregated Metrics: ${JSON.stringify(metrics)}

Provide:
1. Executive summary (2-3 sentences)
2. Key achievements (cross-project)
3. Areas needing attention (bottlenecks, overdue items)
4. Recommended next steps (strategic)

Respond with JSON: { "summary": string, "achievements": string[], "attention": string[], "recommendations": string[] }`;

        try {
            const text = await generateAICompletion({ prompt, maxTokens: 1024 });
            const report = JSON.parse(text);
            return { health, metrics, ...report };
        } catch (error) {
            console.error('Global report generation failed:', error);
            return {
                health,
                metrics,
                summary: 'Report generation encountered an error',
                recommendations: [],
            };
        }
    }
}

export const aiService = new AIService();
