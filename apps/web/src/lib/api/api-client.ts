const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";

interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        console.log('[ApiClient] Initialized with Base URL:', baseUrl);
    }

    private async request<T>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<T> {
        const { params, ...fetchOptions } = options;

        let url = `${this.baseUrl}/api${endpoint}`;

        if (params) {
            const searchParams = new URLSearchParams(params);
            url += `?${searchParams.toString()}`;
        }

        const headers: Record<string, string> = { ...fetchOptions.headers as Record<string, string> };

        // Check if we should skip setting Content-Type (for FormData uploads)
        const skipContentType = headers['X-Skip-Content-Type'] === 'true';
        delete headers['X-Skip-Content-Type'];

        // Only set default Content-Type if not already set and not skipped
        if (!skipContentType && !Object.keys(headers).some(key => key.toLowerCase() === 'content-type')) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(url, {
            ...fetchOptions,
            credentials: "include",
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                error: "Request failed",
            }));
            throw new Error(error.error || error.message || "Request failed");
        }

        // Handle 204 No Content
        if (response.status === 204) {
            return undefined as T;
        }

        return response.json();
    }

    async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: "GET" });
    }

    async post<T>(
        endpoint: string,
        data?: unknown,
        options?: RequestOptions
    ): Promise<T> {
        const isFormData = data instanceof FormData;

        if (isFormData) {
            // For FormData, don't set Content-Type - let browser set it with boundary
            return this.request<T>(endpoint, {
                ...options,
                method: "POST",
                body: data as FormData,
                headers: {
                    'X-Skip-Content-Type': 'true',
                    ...options?.headers,
                },
            });
        }

        return this.request<T>(endpoint, {
            ...options,
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
        });
    }

    async put<T>(
        endpoint: string,
        data?: unknown,
        options?: RequestOptions
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async patch<T>(
        endpoint: string,
        data?: unknown,
        options?: RequestOptions
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: "PATCH",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: "DELETE" });
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
