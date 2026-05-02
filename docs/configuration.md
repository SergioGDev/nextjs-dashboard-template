# Configuration

NexDash centralises all configuration in `src/config/`. This document explains how to extend it.

## Overview

```
src/config/
  env.ts        ← Zod-validated env vars (single source of process.env)
  constants.ts  ← Global typed constants (QUERY, API, PAGINATION, THEME)
  routes.ts     ← Typed app routes
  index.ts      ← Barrel re-export
```

**Rule**: never call `process.env` outside `src/config/env.ts`. Import `env` instead.

## Adding an environment variable

1. **Add to the schema in `src/config/env.ts`**:
   ```ts
   const clientSchema = z.object({
     // existing...
     NEXT_PUBLIC_FEATURE_FLAG: z.enum(['true', 'false']).default('false')
       .transform((v) => v === 'true'),
   });
   ```
   - Use `clientSchema` for `NEXT_PUBLIC_*` vars (available on client and server).
   - Use `serverSchema` for server-only vars (secrets, DB URLs — never sent to the browser).
   - Provide `.default(...)` for optional vars. Omit it to make the var required — a missing required var throws at startup with a clear message.

2. **Document it in `.env.example`**:
   ```bash
   # Short description of what it does.
   # Default: false
   # NEXT_PUBLIC_FEATURE_FLAG=false
   ```
   Commented-out lines indicate optional vars. Uncommented lines are required (no default).

3. **Set it in `.env.local`** (gitignored):
   ```bash
   NEXT_PUBLIC_FEATURE_FLAG=true
   ```

4. **Use it**:
   ```ts
   import { env } from '@config/env';
   if (env.NEXT_PUBLIC_FEATURE_FLAG) { /* … */ }
   ```

### Why strict validation?

If a required var is missing or malformed, the Node.js process throws immediately on startup — before any request is served. The error message names the exact variable and the constraint that failed:

```
❌ Invalid environment variables:
  - NEXT_PUBLIC_API_URL: Invalid URL
```

This catches misconfigured deployments before they cause silent runtime failures.

## Adding a constant

Add to the appropriate category in `src/config/constants.ts`:

```ts
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100] as const,
  // add here:
  MAX_PAGE_SIZE: 200,
} as const;
```

**Guidelines**:
- Use `as const` on every object to get literal types.
- Put it in the existing category that best fits (QUERY, API, PAGINATION, THEME).
- If it's specific to a single feature (e.g. a timeout only used in one handler), keep it in that feature file — not here.
- If it's used in 2+ places or describes a system-wide policy, it belongs here.

**Naming convention**: `SCREAMING_SNAKE_CASE` for constant names, `PascalCase` for the category object.

## Adding a route

Add to `src/config/routes.ts`:

```ts
export const routes = {
  // existing...
  projects: {
    list: '/projects',
    detail: (id: string) => `/projects/${id}`,
    new: '/projects/new',
  },
} as const;
```

Then use it anywhere:
```tsx
import { routes } from '@config/routes';
<Link href={routes.projects.list}>All projects</Link>
<Link href={routes.projects.detail(project.id)}>View</Link>
```

**Rules**:
- Every internal navigation `href` and `router.push(...)` call must use `routes.*`.
- No string literal routes in components — a typo is a TypeScript error, not a silent 404.
- Dynamic segments are functions: `(id: string) => \`/projects/${id}\``.

## Current values

### `env`

| Variable | Type | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | `string` | `''` | Backend base URL. Empty = same-origin. |
| `NEXT_PUBLIC_USE_MOCKS` | `boolean` | `true` | Serve mock data instead of calling the API. |
| `NEXT_PUBLIC_APP_NAME` | `string` | `'NexDash'` | App display name (sidebar, page title). |
| `NODE_ENV` | `'development' \| 'test' \| 'production'` | `'development'` | Node environment. |

### `QUERY`

| Key | Value | Usage |
|---|---|---|
| `STALE_TIME` | `30_000` ms | TanStack Query default stale time |
| `GC_TIME` | `300_000` ms | TanStack Query default garbage collection time |
| `RETRY_COUNT` | `1` | Failed query retry count |

### `API`

| Key | Value | Usage |
|---|---|---|
| `TIMEOUT_MS` | `30_000` ms | HTTP client request timeout (reference) |
| `MOCK_DELAY_RANGE` | `[400, 800]` ms | `randomDelay()` simulation range |

### `PAGINATION`

| Key | Value | Usage |
|---|---|---|
| `DEFAULT_PAGE_SIZE` | `10` | `DataTable` default rows per page |
| `PAGE_SIZE_OPTIONS` | `[10, 25, 50, 100]` | Future page size selector |

### `THEME`

| Key | Value | Usage |
|---|---|---|
| `STORAGE_KEY` | `'nexdash-theme'` | `next-themes` localStorage key |
| `UI_STORAGE_KEY` | `'nexdash-ui'` | Zustand persist key for UI state |
| `DEFAULT_ACCENT` | `'indigo'` | Default accent color |
| `ACCENTS` | `['indigo', …]` | Canonical list of available accents |

### `routes`

| Key | Value |
|---|---|
| `routes.login` | `/login` |
| `routes.dashboard` | `/` |
| `routes.analytics` | `/analytics` |
| `routes.reports` | `/reports` |
| `routes.settings` | `/settings` |
| `routes.users.list` | `/users` |
| `routes.users.detail(id)` | `/users/:id` |
