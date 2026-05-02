---
description: Data fetching patterns, mock system, USE_MOCKS branching, and TanStack Query conventions
paths:
  - src/features/**/api/**
  - src/features/**/schemas/**
  - src/features/**/types/**
  - src/lib/api/**
---

## Data Flow

```
src/features/{feature}/
  schemas/  ← Zod schemas (source of truth for types)
  types/    ← z.infer<> exports + UI-only types (DateRange, etc.)
  api/
    _mock-data.ts        ← static mock fixtures
    {feature}.handler.ts ← branches on USE_MOCKS; validates responses
    {feature}.keys.ts    ← query key factory (feature-internal, NOT in index.ts)
    use-{feature}.ts     ← TanStack Query hooks

src/lib/api/
  client.ts    ← fetch wrapper
  errors.ts    ← ApiError
  validate.ts  ← Zod validation helper
  config.ts    ← USE_MOCKS flag
```

Full reference: `docs/data-layer.md`.

## Schemas (Zod)

Define a schema per API entity in `schemas/{feature}.schemas.ts`:

```ts
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(['admin', 'editor', 'viewer', 'manager']),
  // ...
});
```

Types are always inferred — never written manually for API entities:

```ts
// types/user.types.ts
export type User = z.infer<typeof UserSchema>;
export type UserRole = User['role'];  // derived, not duplicated
```

UI-only types (filters, enums not from the API) can be manual type aliases in the same file.

## Query Key Factory

One `{feature}.keys.ts` per feature. **Not exported from the feature's `index.ts`.**

```ts
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};
```

Rules:
- Every level builds on the previous — invalidating a parent invalidates all children.
- All entries `as const` for literal tuple inference.
- For aggregated queries use semantic names: `dashboardKeys.kpis()`, `analyticsKeys.monthly()`.

## Handler Conventions

Every handler method:
- Accepts an optional `opts: { signal?: AbortSignal } = {}`.
- Branches on `USE_MOCKS`.
- Calls `validate(Schema, data)` on the response in **both** branches.
- Uses `api.get<unknown>(…)` (not typed) when result goes to `validate()`.

```ts
import { z } from 'zod';
import { validate } from '@lib/api/validate';
import { EntitySchema } from '../schemas/entity.schemas';

type Opts = { signal?: AbortSignal };
let store: Entity[] = [...mockData];

export const entityHandler = {
  async getAll(opts: Opts = {}) {
    if (USE_MOCKS) {
      await randomDelay(opts.signal);
      return validate(z.array(EntitySchema), [...store]);
    }
    const data = await api.get<unknown>('/entities', opts);
    return validate(z.array(EntitySchema), data);
  },

  async getById(id: string, opts: Opts = {}): Promise<Entity | undefined> {
    if (USE_MOCKS) {
      await randomDelay(opts.signal);
      const found = store.find((e) => e.id === id);
      return found ? validate(EntitySchema, found) : undefined;
    }
    const data = await api.get<unknown>(`/entities/${id}`, opts);
    return validate(EntitySchema, data);
  },
};
```

Mutating handlers keep `let store = [...mockData]` at module level. Read-only handlers use `const`.

## Hook Conventions

One `use-{feature}.ts` per feature. Always use the key factory.

```ts
'use client';

export function useEntities() {
  return useQuery({
    queryKey: entityKeys.lists(),
    queryFn: ({ signal }) => entityHandler.getAll({ signal }),
  });
}

export function useCreateEntity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateEntityInput) => entityHandler.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: entityKeys.lists() }),
  });
}
```

Invalidation scoping:
- Create/delete → `invalidate(keys.lists())`
- Update → `invalidate(keys.lists())` + `invalidate(keys.detail(data.id))`

## `validate()` helper

```ts
import { validate } from '@lib/api/validate';

// throws ApiError(status=0, code='VALIDATION_ERROR') if parse fails
return validate(z.array(UserSchema), data);
```

- Uses `safeParse` internally — never throws raw `ZodError`.
- Failure produces `ApiError` like any other data-layer error.
- Run in both mock and real branches to catch mock inconsistencies early.

## Errors

Non-2xx responses from the real API throw `ApiError`. Validation failures throw `ApiError(0, …, 'VALIDATION_ERROR')`. Mock handlers throw plain `Error` (or `AbortError`). Use `ApiError.is(err)` to narrow before reading `status`/`code`/`details`.

## Adding a New Feature End-to-End

1. `schemas/{feature}.schemas.ts` — Zod schemas for every entity and input
2. `types/{feature}.types.ts` — inferred types + UI-only types
3. `api/_mock-data.ts` — typed mock array
4. `api/{feature}.keys.ts` — key factory (internal)
5. `api/{feature}.handler.ts` — handler with USE_MOCKS branching + validate()
6. `api/use-{feature}.ts` — TanStack Query hooks using key factory
7. `index.ts` — export hooks, types, components (NOT keys)

## Switching to a Real API

Set `NEXT_PUBLIC_USE_MOCKS=false` and `NEXT_PUBLIC_API_URL=https://…` in `.env.local`, restart dev server. No component, hook, or page changes needed.
