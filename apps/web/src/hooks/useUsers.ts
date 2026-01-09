import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api/api-client';

export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    avatar?: string;
}

export const useSearchUsers = (query: string) => {
    return useQuery({
        queryKey: ['users', 'search', query],
        queryFn: async () => {
            if (!query || query.length < 2) return [];
            return apiClient.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`);
        },
        enabled: query.length >= 2,
        staleTime: 1000 * 60, // 1 minute
    });
};
