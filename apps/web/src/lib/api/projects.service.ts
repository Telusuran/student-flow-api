import { apiClient } from "./api-client";
import type {
    Project,
    ProjectMember,
    CreateProjectData,
    UpdateProjectData,
} from "./types";

export const projectsService = {
    /**
     * Get all active projects for the current user
     */
    getAll: (): Promise<Project[]> => {
        return apiClient.get<Project[]>("/projects");
    },

    /**
     * Get all archived projects for the current user
     */
    getArchived: (): Promise<Project[]> => {
        return apiClient.get<Project[]>("/projects/archived");
    },

    /**
     * Get a single project by ID
     */
    getById: (id: string): Promise<Project> => {
        return apiClient.get<Project>(`/projects/${id}`);
    },

    /**
     * Create a new project
     */
    create: (data: CreateProjectData): Promise<Project> => {
        return apiClient.post<Project>("/projects", data);
    },

    /**
     * Update an existing project
     */
    update: (id: string, data: UpdateProjectData): Promise<Project> => {
        return apiClient.put<Project>(`/projects/${id}`, data);
    },

    /**
     * Delete a project (soft delete)
     */
    delete: (id: string): Promise<void> => {
        return apiClient.delete<void>(`/projects/${id}`);
    },

    /**
     * Restore a deleted project
     */
    restore: (id: string): Promise<Project> => {
        return apiClient.post<Project>(`/projects/${id}/restore`);
    },

    /**
     * Add a member to the project
     */
    addMember: (
        projectId: string,
        userId: string,
        role: string = "member"
    ): Promise<ProjectMember> => {
        return apiClient.post<ProjectMember>(`/projects/${projectId}/members`, {
            userId,
            role,
        });
    },

    /**
     * Remove a member from the project
     */
    removeMember: (projectId: string, userId: string): Promise<void> => {
        return apiClient.delete<void>(
            `/projects/${projectId}/members/${userId}`
        );
    },
};
