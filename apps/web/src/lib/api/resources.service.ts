import { apiClient } from "./api-client";
import type { CreateResourceDTO, Resource } from "./types";

export const resourcesService = {
    // Get resources by folder (or root if parentId is null/undefined)
    getByFolder: (projectId: string, parentId?: string | null): Promise<Resource[]> => {
        const query = parentId ? `?parentId=${parentId}` : '';
        return apiClient.get<Resource[]>(`/projects/${projectId}/resources${query}`);
    },

    // Legacy: get all project resources (flat, no folder filter)
    getByProject: (projectId: string): Promise<Resource[]> => {
        return apiClient.get<Resource[]>(`/projects/${projectId}/resources`);
    },

    create: (data: CreateResourceDTO): Promise<Resource> => {
        return apiClient.post<Resource>("/resources", data);
    },

    createFolder: (projectId: string, name: string, parentId?: string | null): Promise<Resource> => {
        return apiClient.post<Resource>(`/projects/${projectId}/resources/folder`, { name, parentId });
    },

    delete: (id: string): Promise<void> => {
        return apiClient.delete<void>(`/resources/${id}`);
    },

    rename: (id: string, name: string): Promise<Resource> => {
        return apiClient.patch<Resource>(`/resources/${id}/rename`, { name });
    },

    move: (id: string, parentId: string | null): Promise<Resource> => {
        return apiClient.patch<Resource>(`/resources/${id}/move`, { parentId });
    },

    upload: (projectId: string, file: File, parentId?: string | null): Promise<Resource> => {
        const formData = new FormData();
        formData.append('file', file);
        if (parentId) {
            formData.append('parentId', parentId);
        }
        // Don't set Content-Type - browser will set it automatically with the boundary
        return apiClient.post<Resource>(`/projects/${projectId}/resources/upload`, formData);
    }
};

