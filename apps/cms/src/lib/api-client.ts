const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";

interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
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

        if (!Object.keys(headers).some(key => key.toLowerCase() === 'content-type')) {
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
        return this.request<T>(endpoint, {
            ...options,
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
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

    async upload<T>(
        endpoint: string,
        file: File,
        fieldName: string = 'file',
        additionalData?: Record<string, string | Blob>
    ): Promise<T> {
        const formData = new FormData();
        formData.append(fieldName, file);

        if (additionalData) {
            Object.entries(additionalData).forEach(([key, value]) => {
                formData.append(key, value);
            });
        }

        const url = `${this.baseUrl}/api${endpoint}`;

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            credentials: 'include',
            // Do NOT set Content-Type header, browser sets it with boundary for FormData
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                error: "Upload failed",
            }));
            throw new Error(error.error || error.message || "Upload failed");
        }

        return response.json();
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
