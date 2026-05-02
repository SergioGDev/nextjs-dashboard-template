---
description: Configuration conventions — env vars, constants, and typed routes
paths:
  - src/config/**
  - src/app/**
  - src/components/**
  - src/store/**
---

## Environment Variables

**Never use `process.env` directly.** Always import from `@config/env`:

```ts
import { env } from '@config/env';
const isDemo = env.NEXT_PUBLIC_USE_MOCKS;
```

To add a new env var:
1. Add to `clientSchema` (if `NEXT_PUBLIC_*`) or `serverSchema` (server-only) in `src/config/env.ts`
2. Give it `.default(value)` if optional; omit default if required (missing value throws at startup)
3. Document in `.env.example` with a comment explaining what it does

## Constants

**No magic numbers or repeated string literals in components.** Add to `src/config/constants.ts`:

```ts
import { QUERY, API, PAGINATION, THEME } from '@config/constants';
```

| Object | Contents |
|---|---|
| `QUERY` | `STALE_TIME`, `GC_TIME`, `RETRY_COUNT` |
| `API` | `TIMEOUT_MS`, `MOCK_DELAY_RANGE` |
| `PAGINATION` | `DEFAULT_PAGE_SIZE`, `PAGE_SIZE_OPTIONS` |
| `THEME` | `STORAGE_KEY`, `UI_STORAGE_KEY`, `DEFAULT_ACCENT`, `ACCENTS` |

If a constant is used in only one feature file, keep it there. If it's shared across 2+ files or describes a system-wide policy, put it in `constants.ts`.

## Routes

**No hardcoded route strings in components.** Use the `routes` object:

```ts
import { routes } from '@config/routes';

// Static route
<Link href={routes.users.list}>Users</Link>

// Dynamic route
<Link href={routes.users.detail(user.id)}>Edit</Link>
router.push(routes.settings);
```

To add a new route, add to `src/config/routes.ts`. Dynamic segments are functions:
```ts
projects: {
  list: '/projects',
  detail: (id: string) => `/projects/${id}`,
}
```

## Barrel import

Both forms are valid — use whichever is clearest:

```ts
import { env, routes, PAGINATION } from '@config';   // barrel (multiple imports)
import { routes } from '@config/routes';              // specific (single import)
```
