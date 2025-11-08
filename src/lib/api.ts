// API utility functions

const API_BASE_URL = "/api";

export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    userId?: string
): Promise<T> {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (userId) {
        headers["x-user-id"] = userId;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

