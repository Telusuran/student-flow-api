import { eq } from 'drizzle-orm';
import { db, type Database } from '../config/db.js';
import { notificationSettings } from '../db/schema/index.js';

export interface NotificationSettingsData {
    taskAssigned?: boolean;
    taskAssignedEmail?: boolean;
    taskAssignedInApp?: boolean;
    taskStatusChange?: boolean;
    deadlineApproaching?: boolean;
    deadlinePush?: boolean;
    alertTime?: string;
    projectReminders?: boolean;
    documentUploaded?: boolean;
}

export class NotificationSettingsService {
    constructor(private database: Database = db) { }

    /**
     * Get notification settings for a user.
     * Creates default settings if none exist.
     */
    async getSettings(userId: string) {
        let settings = await this.database.query.notificationSettings.findFirst({
            where: eq(notificationSettings.userId, userId),
        });

        // If no settings exist, create default settings
        if (!settings) {
            const result = await this.database
                .insert(notificationSettings)
                .values({ userId })
                .returning();
            settings = result[0];
        }

        return settings;
    }

    /**
     * Update notification settings for a user.
     * Creates settings if they don't exist, then updates.
     */
    async updateSettings(userId: string, data: NotificationSettingsData) {
        // Ensure settings exist first
        await this.getSettings(userId);

        // Update the settings
        const result = await this.database
            .update(notificationSettings)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(notificationSettings.userId, userId))
            .returning();

        return result[0];
    }
}

export const notificationSettingsService = new NotificationSettingsService();
