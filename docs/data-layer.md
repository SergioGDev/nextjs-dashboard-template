# Data Layer Architecture

How data flows in NexDash, and how to extend or repoint it at a real backend.

## TL;DR

```
src/features/{feature}/
  schemas/   ← Zod schemas (source of truth for types)
  types/     ← inferred types (re-exports of z.infer<…>)
  api/
    _mock-data.ts         ← static mock fixtures
    {feature}.handler.ts  ← branches on USE_MOCKS; validates responses
    {feature}.keys.ts     ← query key factory (internal)
    use-{feature}.ts      ← TanStack Query hooks

src/lib/api/
  client.ts    ← fetch wrapper (api.get/post/put/patch/delete)
  errors.ts    ← ApiError class
  validate.ts  ← Zod validation helper
  config.ts    ← USE_MOCKS flag
```

To swap mocks → real API: set `NEXT_PUBLIC_USE_MOCKS=false` in `.env.local`. Hooks, pages, and components never change.

## The `USE_MOCKS` flag

Defined in `src/lib/api/config.ts`:

```ts
export const USE_MOCKS: boolean = process.env.NEXT_PUBLIC_USE_MOCKS !== 'false';
```

- Default `true` — a fresh checkout works without a backend.
- Set to `"false"` in `.env.local` to route every handler call through the HTTP client.
- `NEXT_PUBLIC_*` variables are inlined by Next.js at start time — restart `npm run dev` after changing.

## Query keys factory

Every feature has a `{feature}.keys.ts` file with a typed key factory:

```ts
// src/features/users/api/users.keys.ts
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};
```

Rules:
- Each level builds on the previous with spread — parent key can be used to invalidate all children.
- All entries are `as const` so TypeScript infers literal tuples.
- Follow the standard TanStack naming: `all`, `lists`, `list(filters)`, `details`, `detail(id)`. For aggregated queries use semantic names: `dashboardKeys.kpis()`, `analyticsKeys.monthly()`.
- Key factories are **internal to the feature** — not exported from `index.ts`.

Hooks use the factory in both `queryKey` and `invalidateQueries`:

```ts
// query
useQuery({ queryKey: userKeys.detail(id), queryFn: … });

// invalidation in mutation
queryClient.invalidateQueries({ queryKey: userKeys.lists() });
queryClient.invalidateQueries({ queryKey: userKeys.detail(data.id) });
```

## Zod schemas & types

Every feature has a `schemas/{feature}.schemas.ts` file:

```ts
// src/features/users/schemas/users.schemas.ts
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'editor', 'viewer', 'manager']),
  avatar: z.string(),
  status: z.enum(['active', 'inactive']),
  createdAt: z.string(),
  lastLogin: z.string(),
});
```

Types are inferred from the schema — never defined manually for API entities:

```ts
// src/features/users/types/user.types.ts
export type User = z.infer<typeof UserSchema>;
export type UserRole = User['role'];   // 'admin' | 'editor' | 'viewer' | 'manager'
```

Types that are NOT API entities (UI filters, component props) stay as manual type aliases in the same file.

## Response validation

`src/lib/api/validate.ts` provides a helper used by every handler:

```ts
import { validate } from '@lib/api/validate';

// usage in handler
const data = await api.get<unknown>('/users', opts);
return validate(z.array(UserSchema), data);
```

`validate()` calls `.safeParse()` internally. On failure it throws an `ApiError` with:
- `status: 0` (not an HTTP error — schema mismatch)
- `code: 'VALIDATION_ERROR'`
- `details.issues`: the Zod issue array

This runs in both mock and real-API branches, so mock data inconsistencies are caught immediately.

## Handler shape

```ts
async getAll(opts: { signal?: AbortSignal } = {}) {
  if (USE_MOCKS) {
    await randomDelay(opts.signal);
    return validate(z.array(EntitySchema), [...store]);
  }
  const data = await api.get<unknown>('/entities', opts);
  return validate(z.array(EntitySchema), data);
}
```

Two branches, identical inferred return type. The hook never knows which one ran.

For mutating handlers, the mock branch updates a module-level `let store = [...mockData]`; changes live for the session and reset on reload.

## The HTTP client (`src/lib/api/client.ts`)

```ts
import { api } from '@lib/api/client';

await api.get<unknown>('/users');
await api.get<unknown>('/users/42', { signal });
await api.get<unknown>('/analytics/daily', { params: { range: '30d' } });
await api.post<unknown>('/users', { name, email, role, status });
await api.patch<unknown>('/users/42', { role: 'admin' });
await api.delete<void>('/users/42');
```

Notes:
- Base URL is `process.env.NEXT_PUBLIC_API_URL` (empty = same-origin).
- Sends `credentials: 'include'` so cookie-based auth works without extra config.
- Always reads JSON. `204 No Content` returns `undefined`.
- Non-2xx responses throw `ApiError`.
- Type parameter should be `unknown` when the response will be passed to `validate()`.

### Errors: `ApiError`

```ts
class ApiError extends Error {
  status: number;     // HTTP status, or 0 for transport/validation failure
  code?: string;      // 'VALIDATION_ERROR' | backend-supplied code
  details?: unknown;  // { issues: ZodIssue[] } | raw response payload
}
```

Pattern in components/hooks:

```ts
try {
  await usersHandler.create(input);
} catch (err) {
  if (ApiError.is(err) && err.status === 409) {
    form.setError('email', { message: 'Email already in use' });
    return;
  }
  throw err; // let the global error boundary handle it
}
```

### Interceptors

```ts
import { addRequestInterceptor, addResponseInterceptor } from '@lib/api';

const offReq = addRequestInterceptor((config) => {
  const token = getAccessToken();
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

const offRes = addResponseInterceptor((response) => {
  if (response.status === 401 && typeof window !== 'undefined') {
    window.location.assign('/login');
  }
  return response;
});

// Both return an unsubscribe function — register them once at app start.
```

### Cancellation with AbortSignal

TanStack Query passes a `signal` to `queryFn`; thread it through the handler:

```ts
useQuery({
  queryKey: userKeys.lists(),
  queryFn: ({ signal }) => usersHandler.getAll({ signal }),
});
```

When the component unmounts or the query key changes, React Query aborts the signal. The fetch is cancelled and `randomDelay()` (mock branch) resolves with an `AbortError`.

## Adding a new resource end-to-end

1. **Schema** — `src/features/{feature}/schemas/{feature}.schemas.ts`
   ```ts
   import { z } from 'zod';
   export const ProjectSchema = z.object({
     id: z.string(),
     name: z.string(),
     ownerId: z.string(),
   });
   export const CreateProjectInputSchema = z.object({
     name: z.string(),
     ownerId: z.string(),
   });
   ```

2. **Types** — `src/features/{feature}/types/{feature}.types.ts`
   ```ts
   import { type z } from 'zod';
   import { type ProjectSchema, type CreateProjectInputSchema } from '../schemas/projects.schemas';
   export type Project = z.infer<typeof ProjectSchema>;
   export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;
   ```

3. **Mock data** — `src/features/{feature}/api/_mock-data.ts`
   ```ts
   import { type Project } from '../types/projects.types';
   export const mockProjects: Project[] = [/* … */];
   ```

4. **Key factory** — `src/features/{feature}/api/{feature}.keys.ts`
   ```ts
   export const projectKeys = {
     all: ['projects'] as const,
     lists: () => [...projectKeys.all, 'list'] as const,
     details: () => [...projectKeys.all, 'detail'] as const,
     detail: (id: string) => [...projectKeys.details(), id] as const,
   };
   ```

5. **Handler** — `src/features/{feature}/api/{feature}.handler.ts`
   ```ts
   import { z } from 'zod';
   import { validate } from '@lib/api/validate';
   import { ProjectSchema } from '../schemas/projects.schemas';

   export const projectsHandler = {
     async getAll(opts: Opts = {}) {
       if (USE_MOCKS) {
         await randomDelay(opts.signal);
         return validate(z.array(ProjectSchema), [...store]);
       }
       const data = await api.get<unknown>('/projects', opts);
       return validate(z.array(ProjectSchema), data);
     },
   };
   ```

6. **Hooks** — `src/features/{feature}/api/use-{feature}.ts`
   ```ts
   export function useProjects() {
     return useQuery({
       queryKey: projectKeys.lists(),
       queryFn: ({ signal }) => projectsHandler.getAll({ signal }),
     });
   }
   ```

7. **Barrel** — add to `src/features/{feature}/index.ts`:
   ```ts
   export { useProjects } from './api/use-projects';
   export type { Project } from './types/projects.types';
   ```

## From mocks to a real backend

1. Run the backend at the chosen URL.
2. Set in `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=https://api.example.com
   NEXT_PUBLIC_USE_MOCKS=false
   ```
3. Restart `npm run dev`.
4. Implement endpoints with the path/method conventions used in handlers
   (REST: `/users`, `/users/:id`, `/dashboard/kpis`, `/analytics/daily?range=…`).
5. If the backend uses a token instead of cookies, register a request interceptor
   in `app/providers.tsx` to attach `Authorization`.

No component, hook, or page needs to change.

## URL convention table

| Resource | Method | Path | Hook | Key |
|---|---|---|---|---|
| Users list | GET | `/users` | `useUsers` | `userKeys.lists()` |
| User detail | GET | `/users/:id` | `useUser(id)` | `userKeys.detail(id)` |
| Create user | POST | `/users` | `useCreateUser` | invalidates `userKeys.lists()` |
| Update user | PATCH | `/users/:id` | `useUpdateUser` | invalidates `lists()` + `detail(id)` |
| Delete user | DELETE | `/users/:id` | `useDeleteUser` | invalidates `userKeys.lists()` |
| Reports list | GET | `/reports` | `useReports` | `reportsKeys.lists()` |
| Report detail | GET | `/reports/:id` | — | `reportsKeys.detail(id)` |
| Dashboard KPIs | GET | `/dashboard/kpis` | `useDashboardKPIs` | `dashboardKeys.kpis()` |
| Recent activity | GET | `/dashboard/activity` | `useRecentActivity` | `dashboardKeys.activity()` |
| Campaigns | GET | `/dashboard/campaigns` | `useCampaigns` | `dashboardKeys.campaigns()` |
| Monthly analytics | GET | `/analytics/monthly` | `useAnalyticsMonthly` | `analyticsKeys.monthly()` |
| Daily analytics | GET | `/analytics/daily?range=` | `useAnalyticsDaily(range)` | `analyticsKeys.daily(range)` |
| Traffic sources | GET | `/analytics/traffic-sources` | `useTrafficSources` | `analyticsKeys.traffic()` |
