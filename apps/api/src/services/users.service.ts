import { ilike, or, and, ne, eq } from 'drizzle-orm';
import { db, type Database } from '../config/db.js';
import { user, userProfiles } from '../db/schema/index.js';

interface ProfileData {
    name?: string;
    image?: string;
    email?: string;
    institution?: string;
    major?: string;
    bio?: string;
}

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
        // Get base user data
        const userData = await this.database.query.user.findFirst({
            where: eq(user.id, id),
            columns: {
                id: true,
                name: true,
                email: true,
                image: true,
            },
        });

        if (!userData) return null;

        // Get profile data if exists (wrapped in try-catch for migration safety)
        let profileData: { institution?: string | null; major?: string | null; bio?: string | null } | null = null;
        try {
            profileData = await this.database.query.userProfiles.findFirst({
                where: eq(userProfiles.userId, id),
                columns: {
                    institution: true,
                    major: true,
                    bio: true,
                },
            }) ?? null;
        } catch (error) {
            // Profile table/columns might not exist yet - gracefully continue
            console.warn('[UsersService] Could not fetch profile data:', error);
        }

        return {
            ...userData,
            institution: profileData?.institution ?? null,
            major: profileData?.major ?? null,
            bio: profileData?.bio ?? null,
        };
    }

    async update(id: string, data: ProfileData) {
        // Update user table (name, image, email)
        const userUpdateResult = await this.database
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

        if (userUpdateResult.length === 0) {
            throw new Error('User not found');
        }

        // Update or insert profile data (institution, major, bio)
        const hasProfileFields = data.institution !== undefined || data.major !== undefined || data.bio !== undefined;

        if (hasProfileFields) {
            try {
                // Check if profile exists
                const existingProfile = await this.database.query.userProfiles.findFirst({
                    where: eq(userProfiles.userId, id),
                });

                if (existingProfile) {
                    // Update existing profile
                    await this.database
                        .update(userProfiles)
                        .set({
                            institution: data.institution,
                            major: data.major,
                            bio: data.bio,
                            updatedAt: new Date(),
                        })
                        .where(eq(userProfiles.userId, id));
                } else {
                    // Insert new profile
                    await this.database
                        .insert(userProfiles)
                        .values({
                            userId: id,
                            institution: data.institution ?? null,
                            major: data.major ?? null,
                            bio: data.bio ?? null,
                        });
                }
            } catch (error) {
                // Profile table/columns might not exist yet - log and continue
                console.warn('[UsersService] Could not update profile data:', error);
            }
        }

        // Return combined data
        return this.getById(id);
    }

    async delete(id: string) {
        await this.database.delete(user).where(eq(user.id, id));
        return { success: true };
    }
}

export const usersService = new UsersService();
