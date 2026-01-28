import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api/api-client';

export interface CurrentUser {
    id: string;
    name: string;
    email: string;
    image?: string;
    institution?: string | null;
    major?: string | null;
    bio?: string | null;
}

export interface UpdateProfileData {
    name?: string;
    image?: string;
    email?: string;
    institution?: string;
    major?: string;
    bio?: string;
}

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            return apiClient.get<CurrentUser>('/users/me');
        },
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateProfileData) => {
            return apiClient.patch<CurrentUser>('/users/me', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
    });
};

export const useDeleteAccount = () => {
    return useMutation({
        mutationFn: async () => {
            return apiClient.delete<{ success: boolean }>('/users/me');
        },
    });
};
