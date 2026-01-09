import { eq, and, isNull, desc } from 'drizzle-orm';
import { db, type Database } from '../config/db.js';
import { projects, projectMembers } from '../db/schema/index.js';
import { channels } from '../db/schema/messaging.schema.js';

export interface CreateProjectDTO {
    name: string;
    description?: string;
    courseCode?: string;
    courseName?: string;
    color?: string;
    icon?: string;
    dueDate?: Date;
    startDate?: Date;
}

export interface UpdateProjectDTO extends Partial<CreateProjectDTO> {
    status?: 'active' | 'archived' | 'deleted';
    progress?: number;
}

export class ProjectsService {
    constructor(private database: Database = db) { }

    async getAll(userId: string) {
        return this.database.query.projects.findMany({
            where: and(
                eq(projects.ownerId, userId),
                isNull(projects.deletedAt)
            ),
            orderBy: [desc(projects.updatedAt)],
            with: {
                members: {
                    with: { user: true },
                },
            },
        });
    }

    async getById(id: string, userId: string) {
        const project = await this.database.query.projects.findFirst({
            where: and(eq(projects.id, id), isNull(projects.deletedAt)),
            with: {
                owner: true,
                members: {
                    with: { user: true },
                },
            },
        });

        if (!project) return null;

        // Check if user has access
        const hasAccess =
            project.ownerId === userId ||
            project.members.some((m) => m.userId === userId);

        return hasAccess ? project : null;
    }

    async create(data: CreateProjectDTO, userId: string) {
        const [project] = await this.database
            .insert(projects)
            .values({
                ...data,
                ownerId: userId,
            })
            .returning();

        // Add owner as a member
        await this.database.insert(projectMembers).values({
            projectId: project.id,
            userId,
            role: 'owner',
        });

        // Create default "General" channel
        await this.database.insert(channels).values({
            projectId: project.id,
            name: 'General',
            icon: 'tag',
        });

        return project;
    }

    async update(id: string, data: UpdateProjectDTO, userId: string) {
        const project = await this.getById(id, userId);
        if (!project) return null;

        const [updated] = await this.database
            .update(projects)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(projects.id, id))
            .returning();

        return updated;
    }

    async delete(id: string, userId: string) {
        const project = await this.getById(id, userId);
        if (!project || project.ownerId !== userId) return false;

        // Soft delete
        await this.database
            .update(projects)
            .set({
                status: 'deleted',
                deletedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(projects.id, id));

        return true;
    }

    async restore(id: string, userId: string) {
        const project = await this.database.query.projects.findFirst({
            where: and(eq(projects.id, id), eq(projects.ownerId, userId)),
        });

        if (!project) return null;

        const [restored] = await this.database
            .update(projects)
            .set({
                status: 'active',
                deletedAt: null,
                updatedAt: new Date(),
            })
            .where(eq(projects.id, id))
            .returning();

        return restored;
    }

    async getArchived(userId: string) {
        return this.database.query.projects.findMany({
            where: and(
                eq(projects.ownerId, userId),
                eq(projects.status, 'archived')
            ),
            orderBy: [desc(projects.updatedAt)],
        });
    }

    async addMember(projectId: string, userId: string, role = 'member') {
        const [member] = await this.database
            .insert(projectMembers)
            .values({ projectId, userId, role })
            .returning();
        return member;
    }

    async removeMember(projectId: string, userId: string) {
        await this.database
            .delete(projectMembers)
            .where(
                and(
                    eq(projectMembers.projectId, projectId),
                    eq(projectMembers.userId, userId)
                )
            );
    }
}

export const projectsService = new ProjectsService();
