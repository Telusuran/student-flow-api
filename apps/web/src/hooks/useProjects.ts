import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { projectsService } from "../lib/api/projects.service";
import type {
    Project,
    CreateProjectData,
    UpdateProjectData,
} from "../lib/api/types";

// Query keys
export const projectKeys = {
    all: ["projects"] as const,
    lists: () => [...projectKeys.all, "list"] as const,
    list: (filters: string) => [...projectKeys.lists(), { filters }] as const,
    archived: () => [...projectKeys.all, "archived"] as const,
    details: () => [...projectKeys.all, "detail"] as const,
    detail: (id: string) => [...projectKeys.details(), id] as const,
};

/**
 * Hook to fetch all active projects
 */
export function useProjects() {
    return useQuery({
        queryKey: projectKeys.lists(),
        queryFn: projectsService.getAll,
    });
}

/**
 * Hook to fetch archived projects
 */
export function useArchivedProjects() {
    return useQuery({
        queryKey: projectKeys.archived(),
        queryFn: projectsService.getArchived,
    });
}

/**
 * Hook to fetch a single project by ID
 */
export function useProject(id: string) {
    return useQuery({
        queryKey: projectKeys.detail(id),
        queryFn: () => projectsService.getById(id),
        enabled: !!id,
    });
}

/**
 * Hook to create a new project
 */
export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateProjectData) => projectsService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        },
    });
}

/**
 * Hook to update an existing project
 */
export function useUpdateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateProjectData }) =>
            projectsService.update(id, data),
        onSuccess: (updatedProject: Project) => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
            queryClient.setQueryData(
                projectKeys.detail(updatedProject.id),
                updatedProject
            );
        },
    });
}

/**
 * Hook to delete a project
 */
export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => projectsService.delete(id),
        onSuccess: (_, deletedId) => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
            queryClient.removeQueries({
                queryKey: projectKeys.detail(deletedId),
            });
        },
    });
}

/**
 * Hook to restore a deleted project
 */
export function useRestoreProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => projectsService.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
            queryClient.invalidateQueries({ queryKey: projectKeys.archived() });
        },
    });
}

/**
 * Hook to add a member to a project
 */
export function useAddProjectMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            projectId,
            userId,
            role = "member",
        }: {
            projectId: string;
            userId: string;
            role?: string;
        }) => projectsService.addMember(projectId, userId, role),
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({
                queryKey: projectKeys.detail(projectId),
            });
        },
    });
}

/**
 * Hook to remove a member from a project
 */
export function useRemoveProjectMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            projectId,
            userId,
        }: {
            projectId: string;
            userId: string;
        }) => projectsService.removeMember(projectId, userId),
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({
                queryKey: projectKeys.detail(projectId),
            });
        },
    });
}
