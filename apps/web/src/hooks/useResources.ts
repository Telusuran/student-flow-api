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
};

/**
 * Hook to fetch resources for a project
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
        mutationFn: ({ projectId, file }: { projectId: string; file: File }) =>
            resourcesService.upload(projectId, file),
        onSuccess: (newResource: Resource) => {
            queryClient.invalidateQueries({
                queryKey: resourceKeys.list(newResource.projectId),
            });
        },
    });
}
