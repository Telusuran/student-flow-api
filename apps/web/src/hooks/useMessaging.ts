import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '../lib/api/api-client';

export interface Channel {
    id: string;
    projectId: string;
    name: string;
    icon: string;
    createdAt: string;
}

export interface Message {
    id: string;
    channelId: string;
    userId: string;
    content: string;
    attachmentUrl?: string;
    attachmentName?: string;
    attachmentType?: string;
    createdAt: string;
    sender: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
    };
}

export const useProjectChannels = (projectId: string) => {
    return useQuery({
        queryKey: ['channels', projectId],
        queryFn: async () => {
            if (!projectId) return [];
            const response = await api.get<Channel[]>(`/messaging/projects/${projectId}/channels`);
            return response;
        },
        enabled: !!projectId,
    });
};

export const useCreateChannel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ projectId, name }: { projectId: string; name: string }) => {
            const response = await api.post<Channel>(`/messaging/projects/${projectId}/channels`, { name });
            return response;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['channels', variables.projectId] });
        },
    });
};

export const useChannelMessages = (channelId: string) => {
    return useQuery({
        queryKey: ['messages', channelId],
        queryFn: async () => {
            if (!channelId) return [];
            const response = await api.get<Message[]>(`/messaging/channels/${channelId}/messages`);
            return response;
        },
        enabled: !!channelId,
        refetchInterval: 3000, // Poll every 3 seconds for new messages
    });
};

export const useSendMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ channelId, content }: { channelId: string; content: string }) => {
            const response = await api.post<Message>(`/messaging/channels/${channelId}/messages`, { content });
            return response;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['messages', variables.channelId] });
        },
    });
};
