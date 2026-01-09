import { eq, and, desc } from 'drizzle-orm';
import { db, type Database } from '../config/db.js';
import { resources } from '../db/schema/index.js';

export interface CreateResourceDTO {
    projectId: string;
    name: string;
    type: 'linked_file' | 'external_tool' | 'uploaded_file';
    url?: string;
    description?: string;
    source?: string;
    thumbnailUrl?: string;
    fileType?: string;
    tags?: string[];
}

export class ResourcesService {
    constructor(private database: Database = db) { }

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
                addedBy: userId,
            })
            .returning();
        return resource;
    }

    async delete(id: string) {
        await this.database.delete(resources).where(eq(resources.id, id));
        return true;
    }
}

export const resourcesService = new ResourcesService();
