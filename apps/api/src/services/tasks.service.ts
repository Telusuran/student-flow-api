import { eq, and, asc, inArray } from 'drizzle-orm';
import { db, type Database } from '../config/db.js';
import {
    tasks,
    taskAssignees,
    comments,
    attachments,
} from '../db/schema/index.js';
import { notificationsService } from './notifications.service.js';

export interface CreateTaskDTO {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    category?: string;
    dueDate?: Date;
    order?: number;
}

export interface UpdateTaskDTO extends Partial<CreateTaskDTO> {
    progress?: number;
}

export class TasksService {
    constructor(private database: Database = db) { }

    async getAll(projectIds: string[]) {
        if (projectIds.length === 0) return [];

        return this.database.query.tasks.findMany({
            where: inArray(tasks.projectId, projectIds),
            orderBy: [asc(tasks.dueDate), asc(tasks.order)],
            with: {
                project: true,
                assignees: {
                    with: { user: true },
                },
            },
        });
    }

    async getByProject(projectId: string) {
        return this.database.query.tasks.findMany({
            where: eq(tasks.projectId, projectId),
            orderBy: [asc(tasks.order), asc(tasks.createdAt)],
            with: {
                assignees: {
                    with: { user: true },
                },
                comments: {
                    with: { user: true },
                    limit: 5,
                    orderBy: (c, { desc }) => [desc(c.createdAt)],
                },
                attachments: true,
            },
        });
    }

    async getById(id: string) {
        return this.database.query.tasks.findFirst({
            where: eq(tasks.id, id),
            with: {
                project: true,
                creator: true,
                assignees: {
                    with: { user: true },
                },
                comments: {
                    with: { user: true },
                    orderBy: (c, { desc }) => [desc(c.createdAt)],
                },
                attachments: true,
            },
        });
    }

    async create(projectId: string, data: CreateTaskDTO, userId: string) {
        const [task] = await this.database
            .insert(tasks)
            .values({
                ...data,
                projectId,
                createdBy: userId,
            })
            .returning();

        return task;
    }

    async update(id: string, data: UpdateTaskDTO) {
        const [updated] = await this.database
            .update(tasks)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(tasks.id, id))
            .returning();

        return updated;
    }

    async updateStatus(id: string, status: string) {
        return this.update(id, { status });
    }

    async delete(id: string) {
        await this.database.delete(tasks).where(eq(tasks.id, id));
        return true;
    }



    // Assignees
    async addAssignee(taskId: string, userId: string) {
        const [assignee] = await this.database
            .insert(taskAssignees)
            .values({ taskId, userId })
            .returning();

        // Trigger notification
        try {
            const task = await this.getById(taskId);
            if (task) {
                await notificationsService.create({
                    userId,
                    type: 'task_assigned',
                    title: 'New Task Assigned',
                    message: `You have been assigned to task: ${task.title}`,
                    data: { taskId, projectId: task.projectId }
                });
            }
        } catch (error) {
            console.error('Failed to create notification:', error);
        }

        return assignee;
    }

    async removeAssignee(taskId: string, userId: string) {
        await this.database
            .delete(taskAssignees)
            .where(
                and(
                    eq(taskAssignees.taskId, taskId),
                    eq(taskAssignees.userId, userId)
                )
            );
    }

    // Comments
    async addComment(taskId: string, userId: string, content: string) {
        const [comment] = await this.database
            .insert(comments)
            .values({ taskId, userId, content })
            .returning();
        return comment;
    }

    async getComments(taskId: string) {
        return this.database.query.comments.findMany({
            where: eq(comments.taskId, taskId),
            with: { user: true },
            orderBy: (c, { desc }) => [desc(c.createdAt)],
        });
    }

    // Attachments
    async addAttachment(
        taskId: string,
        userId: string,
        data: { name: string; url: string; type?: string; size?: number }
    ) {
        const [attachment] = await this.database
            .insert(attachments)
            .values({ taskId, uploadedBy: userId, ...data })
            .returning();
        return attachment;
    }

    async getAttachments(taskId: string) {
        return this.database.query.attachments.findMany({
            where: eq(attachments.taskId, taskId),
        });
    }
}

export const tasksService = new TasksService();
