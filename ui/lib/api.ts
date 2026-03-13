const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8090";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiOptions extends RequestInit {}

export interface ApiEnvelope<T> {
  data: T | null;
  success: boolean;
  message: string;
  timestamp: string;
}

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

async function request<T>(
  path: string,
  method: HttpMethod,
  options: ApiOptions = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  if (accessToken) {
    (headers as Record<string, string>)["Authorization"] =
      `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    ...options,
    method,
    headers,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `API error ${response.status} ${response.statusText}: ${text}`,
    );
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string, options?: ApiOptions) =>
    request<T>(path, "GET", options),
  post: <T>(path: string, body?: unknown, options?: ApiOptions) =>
    request<T>(path, "POST", {
      ...options,
      body: body != null ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body?: unknown, options?: ApiOptions) =>
    request<T>(path, "PUT", {
      ...options,
      body: body != null ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown, options?: ApiOptions) =>
    request<T>(path, "PATCH", {
      ...options,
      body: body != null ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string, options?: ApiOptions) =>
    request<T>(path, "DELETE", options),
};


