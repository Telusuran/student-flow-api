import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { tasksService } from "../lib/api/tasks.service";
import type {
    Task,
    CreateTaskData,
    UpdateTaskData,
    CreateCommentData,
    CreateAttachmentData,
} from "../lib/api/types";

// Query keys
export const taskKeys = {
    all: ["tasks"] as const,
    lists: () => [...taskKeys.all, "list"] as const,
    listByProject: (projectId: string) =>
        [...taskKeys.lists(), { projectId }] as const,
    details: () => [...taskKeys.all, "detail"] as const,
    detail: (id: string) => [...taskKeys.details(), id] as const,
    comments: (taskId: string) =>
        [...taskKeys.all, "comments", taskId] as const,
    attachments: (taskId: string) =>
        [...taskKeys.all, "attachments", taskId] as const,
};

/**
 * Hook to fetch all tasks across projects
 */
export function useAllTasks() {
    return useQuery({
        queryKey: taskKeys.lists(),
        queryFn: tasksService.getAll,
    });
}

/**
 * Hook to fetch tasks for a project
 */
export function useProjectTasks(projectId: string) {
    return useQuery({
        queryKey: taskKeys.listByProject(projectId),
        queryFn: () => tasksService.getByProject(projectId),
        enabled: !!projectId,
    });
}

/**
 * Hook to fetch a single task by ID
 */
export function useTask(id: string) {
    return useQuery({
        queryKey: taskKeys.detail(id),
        queryFn: () => tasksService.getById(id),
        enabled: !!id,
    });
}

/**
 * Hook to create a new task
 */
export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            projectId,
            data,
        }: {
            projectId: string;
            data: CreateTaskData;
        }) => tasksService.create(projectId, data),
        onSuccess: (newTask: Task) => {
            queryClient.invalidateQueries({
                queryKey: taskKeys.listByProject(newTask.projectId),
            });
        },
    });
}

/**
 * Hook to update an existing task
 */
export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) =>
            tasksService.update(id, data),
        onSuccess: (updatedTask: Task) => {
            queryClient.invalidateQueries({
                queryKey: taskKeys.listByProject(updatedTask.projectId),
            });
            queryClient.setQueryData(
                taskKeys.detail(updatedTask.id),
                updatedTask
            );
        },
    });
}

/**
 * Hook to update task status
 */
export function useUpdateTaskStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            tasksService.updateStatus(id, status),
        onSuccess: (updatedTask: Task) => {
            queryClient.invalidateQueries({
                queryKey: taskKeys.listByProject(updatedTask.projectId),
            });
            queryClient.setQueryData(
                taskKeys.detail(updatedTask.id),
                updatedTask
            );
        },
    });
}

/**
 * Hook to delete a task
 */
export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            projectId: _projectId,
        }: {
            id: string;
            projectId: string;
        }) => tasksService.delete(id),
        onSuccess: (_, { id, projectId }) => {
            queryClient.invalidateQueries({
                queryKey: taskKeys.listByProject(projectId),
            });
            queryClient.removeQueries({ queryKey: taskKeys.detail(id) });
        },
    });
}

/**
 * Hook to add an assignee to a task
 */
export function useAddTaskAssignee() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ taskId, userId }: { taskId: string; userId: string }) =>
            tasksService.addAssignee(taskId, userId),
        onSuccess: (_, { taskId }) => {
            queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
        },
    });
}

/**
 * Hook to remove an assignee from a task
 */
export function useRemoveTaskAssignee() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ taskId, userId }: { taskId: string; userId: string }) =>
            tasksService.removeAssignee(taskId, userId),
        onSuccess: (_, { taskId }) => {
            queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
        },
    });
}

/**
 * Hook to fetch comments for a task
 */
export function useTaskComments(taskId: string) {
    return useQuery({
        queryKey: taskKeys.comments(taskId),
        queryFn: () => tasksService.getComments(taskId),
        enabled: !!taskId,
    });
}

/**
 * Hook to add a comment to a task
 */
export function useAddComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            taskId,
            data,
        }: {
            taskId: string;
            data: CreateCommentData;
        }) => tasksService.addComment(taskId, data),
        onSuccess: (_, { taskId }) => {
            queryClient.invalidateQueries({
                queryKey: taskKeys.comments(taskId),
            });
        },
    });
}

/**
 * Hook to fetch attachments for a task
 */
export function useTaskAttachments(taskId: string) {
    return useQuery({
        queryKey: taskKeys.attachments(taskId),
        queryFn: () => tasksService.getAttachments(taskId),
        enabled: !!taskId,
    });
}

/**
 * Hook to add an attachment to a task
 */
export function useAddAttachment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            taskId,
            data,
        }: {
            taskId: string;
            data: CreateAttachmentData;
        }) => tasksService.addAttachment(taskId, data),
        onSuccess: (_, { taskId }) => {
            queryClient.invalidateQueries({
                queryKey: taskKeys.attachments(taskId),
            });
        },
    });
}
