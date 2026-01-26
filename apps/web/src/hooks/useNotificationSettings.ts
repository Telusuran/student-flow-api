import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api/api-client';

export interface NotificationSettings {
    userId: string;
    taskAssigned: boolean;
    taskAssignedEmail: boolean;
    taskAssignedInApp: boolean;
    taskStatusChange: boolean;
    deadlineApproaching: boolean;
    deadlinePush: boolean;
    alertTime: string;
    projectReminders: boolean;
    documentUploaded: boolean;
    updatedAt: string;
}

export type UpdateNotificationSettingsData = Partial<Omit<NotificationSettings, 'userId' | 'updatedAt'>>;

/**
 * Hook to fetch notification settings for current user
 */
export const useNotificationSettings = () => {
    return useQuery({
        queryKey: ['notificationSettings'],
        queryFn: async () => {
            return apiClient.get<NotificationSettings>('/notifications/settings');
        },
    });
};

/**
 * Hook to update notification settings
 */
export const useUpdateNotificationSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateNotificationSettingsData) => {
            return apiClient.put<NotificationSettings>('/notifications/settings', data);
        },
        onSuccess: (updatedSettings) => {
            queryClient.setQueryData(['notificationSettings'], updatedSettings);
        },
    });
};
