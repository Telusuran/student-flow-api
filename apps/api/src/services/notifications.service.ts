import { eq, and, desc } from 'drizzle-orm';
import { db, type Database } from '../config/db.js';
import { notifications } from '../db/schema/index.js';

export class NotificationsService {
    constructor(private database: Database = db) { }

    async create(data: {
        userId: string;
        type: string;
        title: string;
        message?: string;
        data?: Record<string, any>;
    }) {
        const [notification] = await this.database
            .insert(notifications)
            .values(data)
            .returning();
        return notification;
    }

    async getForUser(userId: string) {
        return this.database.query.notifications.findMany({
            where: eq(notifications.userId, userId),
            orderBy: [desc(notifications.createdAt)],
            limit: 50,
        });
    }

    async markAsRead(id: string, userId: string) {
        const [updated] = await this.database
            .update(notifications)
            .set({ read: true })
            .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
            .returning();
        return updated;
    }

    async markAllAsRead(userId: string) {
        await this.database
            .update(notifications)
            .set({ read: true })
            .where(eq(notifications.userId, userId));
    }
}

export const notificationsService = new NotificationsService();
