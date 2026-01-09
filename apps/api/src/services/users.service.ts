import { ilike, or, and, ne } from 'drizzle-orm';
import { db, type Database } from '../config/db.js';
import { user } from '../db/schema/index.js';

export class UsersService {
    constructor(private database: Database = db) { }

    async search(query: string, excludeUserId?: string) {
        if (!query || query.length < 2) return [];

        const searchPattern = `%${query}%`;

        return this.database.query.user.findMany({
            where: and(
                or(
                    ilike(user.name, searchPattern),
                    ilike(user.email, searchPattern)
                ),
                excludeUserId ? ne(user.id, excludeUserId) : undefined
            ),
            columns: {
                id: true,
                name: true,
                email: true,
                image: true,
            },
            limit: 10,
        });
    }

    async getById(id: string) {
        return this.database.query.user.findFirst({
            where: eq(user.id, id),
            columns: {
                id: true,
                name: true,
                email: true,
                image: true,
            },
        });
    }

    async update(id: string, data: { name?: string; image?: string; email?: string }) {
        const result = await this.database
            .update(user)
            .set({
                name: data.name,
                image: data.image,
                email: data.email,
                updatedAt: new Date(),
            })
            .where(eq(user.id, id))
            .returning({
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
            });
        return result[0];
    }

    async delete(id: string) {
        await this.database.delete(user).where(eq(user.id, id));
        return { success: true };
    }
}

import { eq } from 'drizzle-orm';
export const usersService = new UsersService();
