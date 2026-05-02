import { env } from '@config/env';

/** Empty string means same-origin: handlers will hit `/users`, `/reports`, etc. */
export const API_BASE_URL: string = env.NEXT_PUBLIC_API_URL;

/**
 * When true, handlers serve data from in-memory mocks (with simulated latency).
 * When false, handlers route every call through the HTTP client at `API_BASE_URL`.
 *
 * Default: true. Flip to "false" in `.env.local` to point the app at a real backend.
 */
export const USE_MOCKS: boolean = env.NEXT_PUBLIC_USE_MOCKS;
