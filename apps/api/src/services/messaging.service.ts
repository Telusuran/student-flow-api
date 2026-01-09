import { eq, desc, asc } from 'drizzle-orm';
import { db, type Database } from '../config/db';
import {
    channels,
    messages,
} from '../db/schema/messaging.schema';

export class MessagingService {
    constructor(private database: Database = db) { }

    // Channel Methods
    async createChannel(projectId: string, name: string) {
        const [channel] = await this.database
            .insert(channels)
            .values({
                projectId,
                name: name.toLowerCase().replace(/\s+/g, '-'), // Normalize channel names
            })
            .returning();
        return channel;
    }

    async getProjectChannels(projectId: string) {
        return this.database
            .select()
            .from(channels)
            .where(eq(channels.projectId, projectId))
            .orderBy(asc(channels.name));
    }

    async getChannelById(channelId: string) {
        const [channel] = await this.database
            .select()
            .from(channels)
            .where(eq(channels.id, channelId));
        return channel;
    }

    // Message Methods
    async sendMessage(userId: string, channelId: string, content: string, attachment?: { name: string, url: string, type: string }) {
        const [message] = await this.database
            .insert(messages)
            .values({
                userId,
                channelId,
                content,
                attachmentName: attachment?.name,
                attachmentUrl: attachment?.url,
                attachmentType: attachment?.type,
            })
            .returning();

        // Fetch full message with user details for immediate display
        return this.getMessageById(message.id);
    }

    async getChannelMessages(channelId: string, limit = 50) {
        return this.database.query.messages.findMany({
            where: eq(messages.channelId, channelId),
            orderBy: [asc(messages.createdAt)], // Oldest first for chat history
            limit: limit,
            with: {
                sender: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    }
                }
            }
        });
    }

    async getMessageById(messageId: string) {
        return this.database.query.messages.findFirst({
            where: eq(messages.id, messageId),
            with: {
                sender: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    }
                }
            }
        });
    }
}

export const messagingService = new MessagingService();
