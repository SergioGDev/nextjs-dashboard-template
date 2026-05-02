import { API_BASE_URL } from './config';
import { ApiError } from './errors';

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

export interface RequestConfig {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  params?: QueryParams;
}

export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
export type ResponseInterceptor = (
  response: Response,
  config: RequestConfig
) => Response | Promise<Response>;

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];

/** Register a request interceptor. Returns an unsubscribe function. */
export function addRequestInterceptor(fn: RequestInterceptor): () => void {
  requestInterceptors.push(fn);
  return () => {
    const i = requestInterceptors.indexOf(fn);
    if (i >= 0) requestInterceptors.splice(i, 1);
  };
}

/** Register a response interceptor. Returns an unsubscribe function. */
export function addResponseInterceptor(fn: ResponseInterceptor): () => void {
  responseInterceptors.push(fn);
  return () => {
    const i = responseInterceptors.indexOf(fn);
    if (i >= 0) responseInterceptors.splice(i, 1);
  };
}

function buildUrl(path: string, params?: QueryParams): string {
  const base = API_BASE_URL.replace(/\/$/, '');
  const fullPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${base}${fullPath}`;
  if (!params) return url;
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) search.append(k, String(v));
  }
  const query = search.toString();
  return query ? `${url}?${query}` : url;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  let config: RequestConfig = {
    method,
    url: buildUrl(path, options.params),
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
    body,
    signal: options.signal,
  };

  for (const interceptor of requestInterceptors) {
    config = await interceptor(config);
  }

  let response: Response;
  try {
    response = await fetch(config.url, {
      method: config.method,
      headers: config.headers,
      body: config.body !== undefined ? JSON.stringify(config.body) : undefined,
      signal: config.signal,
      // Send cookies on cross-origin requests so cookie-based auth works
      // out of the box. Backend must respond with the matching CORS headers.
      credentials: 'include',
    });
  } catch (err) {
    // Re-throw aborts so callers (and React Query) can detect cancellation.
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    throw new ApiError(0, 'Network error', 'NETWORK_ERROR', err);
  }

  for (const interceptor of responseInterceptors) {
    response = await interceptor(response, config);
  }

  if (!response.ok) {
    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      payload = undefined;
    }
    const p = payload as { message?: string; code?: string } | undefined;
    throw new ApiError(
      response.status,
      p?.message ?? response.statusText ?? 'Request failed',
      p?.code,
      payload
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions) => request<T>('GET', path, undefined, opts),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>('POST', path, body, opts),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>('PUT', path, body, opts),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>('PATCH', path, body, opts),
  delete: <T>(path: string, opts?: RequestOptions) => request<T>('DELETE', path, undefined, opts),
};
