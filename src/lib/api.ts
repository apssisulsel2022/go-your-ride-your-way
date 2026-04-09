// ─── API Service Layer ──────────────────────────────────────────────────────
// Centralized REST client with token management, error handling, and logging.
// Currently uses mock responses; swap BASE_URL to a real backend when ready.

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string>;
}

const TOKEN_KEY = "pyugo_auth_token";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl;
  }

  // ── Token management ────────────────────────────────────────────────────

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  // ── Core request ────────────────────────────────────────────────────────

  private async request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
    const { body, params, headers: extraHeaders, ...rest } = options;

    // Build URL with query params
    let url = `${this.baseUrl}${path}`;
    if (params) {
      const qs = new URLSearchParams(params).toString();
      url += `?${qs}`;
    }

    // Build headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((extraHeaders as Record<string, string>) || {}),
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Dev logging
    if (import.meta.env.DEV) {
      console.log(`[API] ${method} ${url}`, body ?? "");
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        ...rest,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorBody.code || `HTTP_${response.status}`,
          errorBody.message || response.statusText,
          errorBody
        );
      }

      // Handle 204 No Content
      if (response.status === 204) return undefined as T;

      const data = await response.json();

      if (import.meta.env.DEV) {
        console.log(`[API] ✓ ${method} ${url}`, data);
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        this.handleError(error);
        throw error;
      }
      // Network or parsing error
      const apiError = new ApiError(0, "NETWORK_ERROR", (error as Error).message);
      this.handleError(apiError);
      throw apiError;
    }
  }

  // ── Error interceptor ──────────────────────────────────────────────────

  private handleError(error: ApiError): void {
    if (import.meta.env.DEV) {
      console.error(`[API] ✗ ${error.code}: ${error.message}`);
    }

    // Auto-logout on 401
    if (error.status === 401) {
      this.clearToken();
      // Could dispatch an event or redirect here
    }
  }

  // ── HTTP methods ───────────────────────────────────────────────────────

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("GET", path, options);
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>("POST", path, { ...options, body });
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>("PUT", path, { ...options, body });
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>("PATCH", path, { ...options, body });
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("DELETE", path, options);
  }
}

// Singleton instance — swap baseUrl when connecting a real backend
export const api = new ApiClient();

export default api;
