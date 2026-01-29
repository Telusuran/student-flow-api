import { eq, and, desc, isNull, asc } from 'drizzle-orm';
import { db, type Database } from '../config/db.js';
import { resources } from '../db/schema/index.js';

export interface CreateResourceDTO {
    projectId: string;
    parentId?: string | null;
    isFolder?: boolean;
    name: string;
    type: 'linked_file' | 'external_tool' | 'uploaded_file' | 'folder';
    url?: string;
    description?: string;
    source?: string;
    thumbnailUrl?: string;
    fileType?: string;
    fileSize?: string;
    tags?: string[];
}

export class ResourcesService {
    constructor(private database: Database = db) { }

    // Get resources in a folder (or root if parentId is null)
    async getByFolder(projectId: string, parentId: string | null = null) {
        const whereClause = parentId
            ? and(eq(resources.projectId, projectId), eq(resources.parentId, parentId))
            : and(eq(resources.projectId, projectId), isNull(resources.parentId));

        return this.database.query.resources.findMany({
            where: whereClause,
            orderBy: [
                // Folders first, then files
                desc(resources.isFolder),
                asc(resources.name),
            ],
            with: {
                uploader: true,
            },
        });
    }

    // Legacy: get all resources for a project (flat list)
    async getByProject(projectId: string) {
        return this.database.query.resources.findMany({
            where: eq(resources.projectId, projectId),
            orderBy: [desc(resources.createdAt)],
            with: {
                uploader: true,
            },
        });
    }

    async create(data: CreateResourceDTO, userId: string) {
        const [resource] = await this.database
            .insert(resources)
            .values({
                ...data,
                isFolder: data.isFolder ?? false,
                addedBy: userId,
            })
            .returning();
        return resource;
    }

    async createFolder(projectId: string, name: string, parentId: string | null, userId: string) {
        return this.create({
            projectId,
            parentId,
            name,
            isFolder: true,
            type: 'folder',
        }, userId);
    }

    async getById(id: string) {
        return this.database.query.resources.findFirst({
            where: eq(resources.id, id),
            with: {
                uploader: true,
            },
        });
    }

    async rename(id: string, newName: string) {
        const [updated] = await this.database
            .update(resources)
            .set({ name: newName, updatedAt: new Date() })
            .where(eq(resources.id, id))
            .returning();
        return updated;
    }

    async move(id: string, newParentId: string | null) {
        const [updated] = await this.database
            .update(resources)
            .set({ parentId: newParentId, updatedAt: new Date() })
            .where(eq(resources.id, id))
            .returning();
        return updated;
    }

    async delete(id: string) {
        // Note: If deleting a folder, consider cascading delete of children
        // For now, just delete the item itself
        await this.database.delete(resources).where(eq(resources.id, id));
        return true;
    }
}

export const resourcesService = new ResourcesService();

