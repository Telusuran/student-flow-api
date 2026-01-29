import { apiClient } from "./api-client";
import type {
    Task,
    TaskAssignee,
    Comment,
    Attachment,
    CreateTaskData,
    UpdateTaskData,
    CreateCommentData,
} from "./types";

export const tasksService = {
    /**
     * Get all tasks across all projects
     */
    getAll: (): Promise<Task[]> => {
        return apiClient.get<Task[]>("/tasks");
    },

    /**
     * Get all tasks for a project
     */
    getByProject: (projectId: string): Promise<Task[]> => {
        return apiClient.get<Task[]>(`/projects/${projectId}/tasks`);
    },

    /**
     * Get a single task by ID
     */
    getById: (id: string): Promise<Task> => {
        return apiClient.get<Task>(`/tasks/${id}`);
    },

    /**
     * Create a new task in a project
     */
    create: (projectId: string, data: CreateTaskData): Promise<Task> => {
        return apiClient.post<Task>(`/projects/${projectId}/tasks`, data);
    },

    /**
     * Update an existing task
     */
    update: (id: string, data: UpdateTaskData): Promise<Task> => {
        return apiClient.put<Task>(`/tasks/${id}`, data);
    },

    /**
     * Update task status only
     */
    updateStatus: (id: string, status: string): Promise<Task> => {
        return apiClient.patch<Task>(`/tasks/${id}/status`, { status });
    },

    /**
     * Delete a task
     */
    delete: (id: string): Promise<void> => {
        return apiClient.delete<void>(`/tasks/${id}`);
    },

    /**
     * Add an assignee to the task
     */
    addAssignee: (taskId: string, userId: string): Promise<TaskAssignee> => {
        return apiClient.post<TaskAssignee>(`/tasks/${taskId}/assignees`, {
            userId,
        });
    },

    /**
     * Remove an assignee from the task
     */
    removeAssignee: (taskId: string, userId: string): Promise<void> => {
        return apiClient.delete<void>(`/tasks/${taskId}/assignees/${userId}`);
    },

    /**
     * Get all comments for a task
     */
    getComments: (taskId: string): Promise<Comment[]> => {
        return apiClient.get<Comment[]>(`/tasks/${taskId}/comments`);
    },

    /**
     * Add a comment to the task
     */
    addComment: (taskId: string, data: CreateCommentData): Promise<Comment> => {
        return apiClient.post<Comment>(`/tasks/${taskId}/comments`, data);
    },

    /**
     * Get all attachments for a task
     */
    getAttachments: (taskId: string): Promise<Attachment[]> => {
        return apiClient.get<Attachment[]>(`/tasks/${taskId}/attachments`);
    },

    /**
     * Add an attachment to the task
     */
    addAttachment: (
        taskId: string,
        file: File
    ): Promise<Attachment> => {
        const formData = new FormData();
        formData.append('file', file);
        return apiClient.post<Attachment>(`/tasks/${taskId}/attachments`, formData);
    },
};
