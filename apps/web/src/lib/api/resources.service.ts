import { apiClient } from "./api-client";
import type { CreateResourceDTO, Resource } from "./types";

export const resourcesService = {
    getByProject: (projectId: string): Promise<Resource[]> => {
        return apiClient.get<Resource[]>(`/projects/${projectId}/resources`);
    },

    create: (data: CreateResourceDTO): Promise<Resource> => {
        return apiClient.post<Resource>("/resources", data);
    },

    delete: (id: string): Promise<void> => {
        return apiClient.delete<void>(`/resources/${id}`);
    },

    upload: (projectId: string, file: File): Promise<Resource> => {
        const formData = new FormData();
        formData.append('file', file);
        // Don't set Content-Type - browser will set it automatically with the boundary
        return apiClient.post<Resource>(`/projects/${projectId}/resources/upload`, formData);
    }
};
