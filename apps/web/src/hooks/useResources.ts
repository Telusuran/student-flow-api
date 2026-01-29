import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { resourcesService } from "../lib/api/resources.service";
import type { Resource, CreateResourceDTO } from "../lib/api/types";

// Query keys
export const resourceKeys = {
    all: ["resources"] as const,
    lists: () => [...resourceKeys.all, "list"] as const,
    list: (projectId: string) => [...resourceKeys.lists(), { projectId }] as const,
    folder: (projectId: string, parentId: string | null) =>
        [...resourceKeys.list(projectId), { parentId }] as const,
};

/**
 * Hook to fetch resources in a folder (or root)
 */
export function useResourcesInFolder(projectId: string, parentId: string | null = null) {
    return useQuery({
        queryKey: resourceKeys.folder(projectId, parentId),
        queryFn: () => resourcesService.getByFolder(projectId, parentId),
        enabled: !!projectId,
    });
}

/**
 * Hook to fetch all resources for a project (flat list)
 */
export function useResources(projectId: string) {
    return useQuery({
        queryKey: resourceKeys.list(projectId),
        queryFn: () => resourcesService.getByProject(projectId),
        enabled: !!projectId,
    });
}

/**
 * Hook to create a new resource
 */
export function useCreateResource() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateResourceDTO) => resourcesService.create(data),
        onSuccess: (newResource: Resource) => {
            queryClient.invalidateQueries({
                queryKey: resourceKeys.list(newResource.projectId),
            });
        },
    });
}

/**
 * Hook to create a folder
 */
export function useCreateFolder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ projectId, name, parentId }: { projectId: string; name: string; parentId?: string | null }) =>
            resourcesService.createFolder(projectId, name, parentId),
        onSuccess: (newFolder: Resource) => {
            queryClient.invalidateQueries({
                queryKey: resourceKeys.list(newFolder.projectId),
            });
        },
    });
}

/**
 * Hook to rename a resource
 */
export function useRenameResource() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, name }: { id: string; name: string; projectId: string }) =>
            resourcesService.rename(id, name),
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({
                queryKey: resourceKeys.list(projectId),
            });
        },
    });
}

/**
 * Hook to move a resource to a different folder
 */
export function useMoveResource() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, parentId }: { id: string; parentId: string | null; projectId: string }) =>
            resourcesService.move(id, parentId),
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({
                queryKey: resourceKeys.list(projectId),
            });
        },
    });
}

/**
 * Hook to delete a resource
 */
export function useDeleteResource() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: { id: string; projectId: string }) =>
            resourcesService.delete(id),
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({
                queryKey: resourceKeys.list(projectId),
            });
        },
    });
}

/**
 * Hook to upload a file resource
 */
export function useUploadResource() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ projectId, file, parentId }: { projectId: string; file: File; parentId?: string | null }) =>
            resourcesService.upload(projectId, file, parentId),
        onSuccess: (newResource: Resource) => {
            queryClient.invalidateQueries({
                queryKey: resourceKeys.list(newResource.projectId),
            });
        },
    });
}

