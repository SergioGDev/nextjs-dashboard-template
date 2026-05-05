# Architecture

## Overview

NexDash is a Next.js 15 analytics dashboard template designed to be cloned, configured, and extended. It ships with mock data so it works immediately without a backend. When you're ready to connect a real API, a single environment variable flips the entire data layer without touching any component.

The architecture is **feature-based**: each business domain (users, analytics, reports, dashboard) lives in a self-contained folder under `src/features/`. A feature owns everything related to its domain — data fetching, validation, types, and domain-specific UI components. Pages in `src/app/` consume features via barrel imports and are kept intentionally thin. Shared, reusable UI primitives live in `src/components/`.

Three architectural pillars define the codebase: (1) **typed schemas as the source of truth** — Zod schemas generate TypeScript types rather than the reverse, ensuring type and runtime validation never drift; (2) **strict boundaries** — configuration, routing, and environment access each have a single entry point; (3) **swappable data layer** — handlers branch on `USE_MOCKS` internally, so the rest of the app is oblivious to whether data is mock or real.

The project targets React 19 with the React Compiler (`reactCompiler: true`) and Next.js App Router. All state management follows a clear hierarchy: TanStack Query for server data, Zustand for persisted UI preferences, React Hook Form for form state, and `useState`/`useReducer` for ephemeral local state.

---

## Folder structure

```
src/
├── app/                         Next.js App Router pages
│   ├── (auth)/                  Public route group — no sidebar/topbar
│   │   └── login/page.tsx
│   ├── (dashboard)/             Protected route group — shared layout
│   │   ├── layout.tsx           Sidebar + Topbar shell
│   │   ├── page.tsx             Dashboard home
│   │   ├── analytics/
│   │   ├── reports/
│   │   ├── settings/
│   │   ├── users/[id]/
│   │   └── ui/                  Design system reference (groups in main sidebar)
│   ├── layout.tsx               Root layout (fonts, metadata, Providers)
│   └── providers.tsx            QueryClient + NextThemes + AccentSync
│
├── features/                    Domain modules — each is self-contained
│   ├── dashboard/               KPIs, activity feed, campaigns
│   ├── analytics/               Monthly/daily metrics, traffic sources
│   ├── reports/                 Report list and status
│   ├── users/                   User CRUD — the most complete example
│   └── ui-showcase/             Design system documentation utilities
│       ├── api/
│       │   ├── _mock-data.ts    Static mock fixtures (NOT exported outside feature)
│       │   ├── users.handler.ts Handler: branches USE_MOCKS → mock or API client
│       │   ├── users.keys.ts    Query key factory (NOT exported outside feature)
│       │   └── use-users.ts     TanStack Query hooks — the public data API
│       ├── components/
│       │   └── user-form.tsx    Domain-specific UI component
│       ├── schemas/
│       │   └── users.schemas.ts Zod schemas — source of truth for all User types
│       ├── types/
│       │   └── user.types.ts    z.infer<> re-exports + UI-only types
│       └── index.ts             Barrel: ONLY public API (hooks, types, components)
│
├── components/                  Shared, domain-agnostic components
│   ├── ui/                      Primitives: Button, Card, Input, DataTable, …
│   ├── charts/                  Recharts wrappers: AreaChart, BarChart, …
│   ├── forms/                   Form compositions: LoginForm, SettingsForm
│   └── layout/                  App shell: Sidebar, Topbar, Breadcrumbs, ThemeToggle
│
├── config/                      Single entry point for all configuration
│   ├── env.ts                   Zod-validated env vars — the ONLY place process.env is read
│   ├── constants.ts             Typed global constants (QUERY, API, PAGINATION, THEME)
│   ├── routes.ts                Typed app routes — no hardcoded strings in components
│   └── index.ts                 Barrel re-export
│
├── lib/                         Utilities with no business logic
│   ├── api/
│   │   ├── client.ts            Fetch wrapper: api.get/post/put/patch/delete
│   │   ├── errors.ts            ApiError class
│   │   ├── validate.ts          validate(schema, data) helper
│   │   └── config.ts            Thin re-export of env.NEXT_PUBLIC_API_URL + USE_MOCKS
│   ├── utils.ts                 cn(), format helpers, sleep(), randomDelay()
│   └── validators/              Form schemas (react-hook-form + zod resolver)
│
├── hooks/                       Cross-feature hooks — no domain logic
│   ├── use-sidebar.ts           Sidebar collapse state + breakpoint detection
│   └── use-media-query.ts       useSyncExternalStore wrapper for matchMedia
│
├── store/                       Zustand stores — persisted UI state only
│   ├── ui.store.ts              sidebarCollapsed, accent (persisted)
│   ├── sidebar.store.ts         expandedGroups — which groups are open (persisted)
│   └── user.store.ts            currentUser (session only, set after login)
│
├── i18n/                        next-intl wiring — locale-aware navigation + request
│   ├── routing.ts               defineRouting (locales, prefix, cookie, detection)
│   ├── navigation.ts            Locale-aware Link, useRouter, usePathname, redirect
│   └── request.ts               getRequestConfig: dynamic per-locale message loading
│
├── messages/                    Cross-feature translation strings
│   ├── en/common.json           Actions, status, navigation, sidebar, metadata, feedback
│   └── es/common.json           Spanish equivalent
│
└── types/                       Truly global types (not owned by any feature)
    └── api.types.ts             ApiResponse<T>, PaginatedResponse<T>, PaginationParams
```

Each feature also has its own `i18n/{locale}.json` for feature-scoped strings (see Features
section below).

---

## Layers

A data request follows this path:

```
app/(dashboard)/users/page.tsx      Page renders, calls hook
  → features/users/api/use-users.ts   Hook calls handler via queryFn
    → features/users/api/users.handler.ts  Handler branches on USE_MOCKS
      if USE_MOCKS:
        → api/_mock-data.ts              Reads in-memory store
        → lib/api/validate.ts            Validates against Zod schema
        → return User[]
      else:
        → lib/api/client.ts              fetch() with credentials:include
          → real backend
        → lib/api/validate.ts            Validates response against Zod schema
        → return User[]
```

### Import rules (what can import what)

| Layer | Can import from |
|---|---|
| `app/` pages | `@features/*` (barrel only), `@components/*`, `@lib/*`, `@config/*` |
| `features/*/api/` | `@lib/api/*`, `@config/*`, own feature's `schemas/`, `types/` |
| `features/*/components/` | `@components/ui/*`, `@lib/utils`, own feature's `types/` |
| `features/*/index.ts` | Own feature internals only |
| `components/ui/` | `@lib/utils` — no features, no store |
| `components/layout/` | `@store/*`, `@config/*`, `@components/ui/*`, `@lib/utils` |
| `lib/` | No imports from `features/`, `app/`, `components/` |
| `config/` | Only standard library and Zod |

**Forbidden:**
- A feature importing from another feature
- `components/ui/` importing from `@features/*`
- `lib/` importing from `features/`
- Any file calling `process.env` directly (use `@config/env`)

### i18n layer

Internationalization is layered orthogonally to the data flow. Translation keys flow from JSON
files to the rendered DOM:

```
src/messages/{locale}/common.json           ← global strings
src/features/{feature}/i18n/{locale}.json   ← feature-scoped strings
  →
src/i18n/request.ts                          ← getRequestConfig: dynamic import
  loadMessages(locale) → { common, auth, dashboard, analytics, users, reports, settings, uiShowcase }
  →
NextIntlClientProvider                       ← provided in [locale]/layout.tsx
  →
useTranslations('namespace')                 ← in client components
getTranslations({ locale, namespace })       ← in server components
  → t('key')                                 → string
  → t.rich('key', { code, strong })          → ReactElement (with inline tags)
  → format.number(value, options)            → locale-aware formatting
```

**Routing layer** (`src/i18n/routing.ts`, `src/proxy.ts`):
- `localePrefix: 'always'` — every URL has a locale prefix
- Cookie `NEXT_LOCALE` persists user choice
- Accept-Language used as fallback when no cookie
- Proxy composes intl middleware with auth (intl first, auth second — see `docs/i18n.md`)

**Navigation wrappers** (`src/i18n/navigation.ts`): `Link`, `useRouter`, `usePathname`, `redirect`
all locale-aware. Components must use these instead of `next/link` and `next/navigation`.

Full reference: `docs/i18n.md`.

---

## Features

A feature is an isolated vertical slice of a business domain. It has no knowledge of other features. Pages orchestrate features — features do not orchestrate each other.

### Anatomy (using `users` as the reference)

```
features/users/
  api/
    _mock-data.ts        Static mock array — private to the feature
    users.handler.ts     The data access object: mock or real API
    users.keys.ts        Query key factory — private (not in barrel)
    use-users.ts         TanStack Query hooks — the public data interface
  components/
    user-form.tsx        Domain UI only shown in user contexts
  schemas/
    users.schemas.ts     Zod schemas: UserSchema, CreateUserInputSchema, UpdateUserInputSchema
  types/
    user.types.ts        Inferred types: User, UserRole, UserStatus, CreateUserInput, UpdateUserInput
  index.ts               Public barrel — everything else is private
```

### Barrel rule

`index.ts` exports exactly: hooks, public types, domain components.

It **never** exports: handler, keys factory, mock data, schemas, internal helpers.

```ts
// index.ts — correct
export { useUsers, useUser, useCreateUser, useUpdateUser, useDeleteUser } from './api/use-users';
export type { User, UserRole, UserStatus, CreateUserInput, UpdateUserInput } from './types/user.types';
export { UserForm } from './components/user-form';

// index.ts — never export these
// export { usersHandler } from './api/users.handler';   ← implementation detail
// export { userKeys } from './api/users.keys';          ← internal
// export { mockUsers } from './api/_mock-data';         ← internal
```

---

## Data layer

### Handler pattern

Every handler method is a two-branch function. The public signature is identical regardless of which branch runs.

```ts
async getAll(opts: { signal?: AbortSignal } = {}) {
  if (USE_MOCKS) {
    await randomDelay(opts.signal);                     // simulate 400-800ms latency
    return validate(z.array(EntitySchema), [...store]); // validate mock data too
  }
  const data = await api.get<unknown>('/entities', opts);
  return validate(z.array(EntitySchema), data);         // validate API response
}
```

Key details:
- `api.get<unknown>` — always `unknown` when result goes to `validate()`
- `validate()` uses `safeParse` internally and throws `ApiError(0, …, 'VALIDATION_ERROR')` on failure
- Mock data is validated too — inconsistencies are caught at development time

→ See [data-layer.md](data-layer.md) for the complete reference.

### TanStack Query

- `staleTime: 30s`, `retry: 1` globally in `QueryClient`
- Every hook passes the `signal` from `queryFn` through to the handler for cancellation
- Mutations always call `invalidateQueries` on success using the key factory
- Query keys are **never** raw string arrays — always use the feature's `*.keys.ts` factory

---

## Configuration

All configuration is accessed via `src/config/`. Three concerns:

| File | Exports | Rule |
|---|---|---|
| `env.ts` | `env` object | Only place `process.env` is read |
| `constants.ts` | `QUERY`, `API`, `PAGINATION`, `THEME` | No magic numbers elsewhere |
| `routes.ts` | `routes` object | No hardcoded route strings in components |

→ See [configuration.md](configuration.md) for the complete reference.

---

## Theming

Two named themes: **Midnight Pro** (dark, default) and **Arctic Light** (light).

- `next-themes` manages persistence and writes `.theme-dark` / `.theme-light` on `<html>`
- `data-accent` on `<html>` selects one of six accent presets: `indigo`, `violet`, `emerald`, `rose`, `amber`, `cyan`
- All colors are CSS custom properties (`var(--accent)`, `var(--surface)`, etc.) — never hardcoded hex in components
- Accent is stored in Zustand (`useUIStore`) and synced to `<html>` via `AccentSync` in `providers.tsx`
- Tailwind v4 maps CSS vars to the utility palette: `bg-[var(--surface)]` or `bg-surface` (both work)

---

## Decision log

### Feature-based over Clean Architecture layers

**Decided**: group by domain (`features/users/`) not by role (`repositories/`, `services/`, `controllers/`).  
**Why**: in a mid-size template, the overhead of horizontal layers creates more boilerplate than it prevents. Vertical slices are self-contained and easier to delete, copy, or hand to a new developer.  
**Discarded**: pure hexagonal / Clean Architecture. Too much indirection for the scale.

### Zod schemas as the single source of truth for types

**Decided**: `export type User = z.infer<typeof UserSchema>` everywhere. No manual interfaces for API entities.  
**Why**: one source of truth. Schema change → type change automatically. Avoids the classic "updated the type but forgot the validator" bug.  
**Discarded**: manual interfaces + separate Zod schemas. The duplication is unjustifiable at this scale.

### Query key factories over raw string arrays

**Decided**: each feature has a `*.keys.ts` file with a factory. All hooks use it. Factories are not exported from barrels.  
**Why**: `queryKey: ['users', id]` is error-prone and invisible at refactor time. Factories provide autocomplete, are easy to find-and-replace, and allow granular invalidation (`userKeys.lists()` vs `userKeys.all`).  
**Discarded**: `createQueryKeyStore` library. Adds a dependency for something straightforward to write.

### validate() helper wrapping safeParse

**Decided**: `validate(Schema, data)` calls `safeParse` and throws `ApiError(0, 'VALIDATION_ERROR')` on failure.  
**Why**: the data layer has one error type — `ApiError`. Leaking `ZodError` would require callers to handle two error shapes. Wrapping keeps the contract clean.  
**Discarded**: using `.parse()` directly. Throws `ZodError`, not `ApiError`, breaking the error contract.

### next-themes over a custom ThemeContext

**Decided**: delegate theme persistence and FOUC prevention to `next-themes`.  
**Why**: `next-themes` injects a blocking script that sets the class before first paint. A custom context cannot do this without duplicating that logic.  
**Discarded**: custom `ThemeContext` + `useState/useEffect`. Caused FOUC and lint errors (`setState in effect`) under React 19 + React Compiler.

### Strict env var validation at startup

**Decided**: `parseEnv()` runs at module import time. Missing required vars throw immediately.  
**Why**: misconfigured deployments should fail loudly at boot, not silently return wrong data at runtime. The error message names the exact variable.  
**Discarded**: reading `process.env` inline everywhere. No single point of validation; typos cause silent `undefined` behavior.

### USE_MOCKS as a build-time env flag

**Decided**: `NEXT_PUBLIC_USE_MOCKS=false` flips the entire data layer to real API.  
**Why**: no code changes needed to test against a backend. CI can run with mocks; staging with the real API. The flag is inlined at build time by Next.js so there's zero runtime cost.  
**Discarded**: separate mock files (`*.mock.ts` alongside `*.ts`). Requires maintaining two implementations and a switching mechanism in each file.

### Refactor in sub-blocks (B2.5a–e)

**Decided**: split the architectural refactor into five independent, green sub-blocks rather than one large branch.  
**Why**: each sub-block leaves the repo in a passing state (`lint + build`). Reviewers can inspect the evolution step by step. Any sub-block can be reverted without losing the others.  
**Discarded**: single "big-bang" refactor PR. High conflict risk, hard to review, all-or-nothing rollback.

---

## How to extend

### Add a new feature

1. Create the folder structure:
   ```
   src/features/my-feature/
     api/
       _mock-data.ts
       my-feature.handler.ts
       my-feature.keys.ts
       use-my-feature.ts
     components/         (if any domain components)
     schemas/
       my-feature.schemas.ts
     types/
       my-feature.types.ts
     index.ts
   ```

2. **Schema** (`schemas/my-feature.schemas.ts`):
   ```ts
   import { z } from 'zod';
   export const ThingSchema = z.object({
     id: z.string(),
     name: z.string(),
     status: z.enum(['active', 'archived']),
   });
   export const CreateThingSchema = z.object({ name: z.string() });
   ```

3. **Types** (`types/my-feature.types.ts`):
   ```ts
   import { type z } from 'zod';
   import { type ThingSchema, type CreateThingSchema } from '../schemas/my-feature.schemas';
   export type Thing = z.infer<typeof ThingSchema>;
   export type CreateThingInput = z.infer<typeof CreateThingSchema>;
   ```

4. **Mock data** (`api/_mock-data.ts`):
   ```ts
   import { type Thing } from '../types/my-feature.types';
   export const mockThings: Thing[] = [
     { id: '1', name: 'First thing', status: 'active' },
   ];
   ```

5. **Key factory** (`api/my-feature.keys.ts`):
   ```ts
   export const thingKeys = {
     all: ['things'] as const,
     lists: () => [...thingKeys.all, 'list'] as const,
     details: () => [...thingKeys.all, 'detail'] as const,
     detail: (id: string) => [...thingKeys.details(), id] as const,
   };
   ```

6. **Handler** (`api/my-feature.handler.ts`):
   ```ts
   import { z } from 'zod';
   import { validate } from '@lib/api/validate';
   import { ThingSchema } from '../schemas/my-feature.schemas';
   import { mockThings } from './_mock-data';
   import { randomDelay } from '@lib/utils';
   import { USE_MOCKS } from '@lib/api/config';
   import { api } from '@lib/api/client';
   import { type Thing } from '../types/my-feature.types';

   type Opts = { signal?: AbortSignal };
   let store: Thing[] = [...mockThings];

   export const thingsHandler = {
     async getAll(opts: Opts = {}) {
       if (USE_MOCKS) {
         await randomDelay(opts.signal);
         return validate(z.array(ThingSchema), [...store]);
       }
       const data = await api.get<unknown>('/things', opts);
       return validate(z.array(ThingSchema), data);
     },
   };
   ```

7. **Hook** (`api/use-my-feature.ts`):
   ```ts
   'use client';
   import { useQuery } from '@tanstack/react-query';
   import { thingsHandler } from './my-feature.handler';
   import { thingKeys } from './my-feature.keys';

   export function useThings() {
     return useQuery({
       queryKey: thingKeys.lists(),
       queryFn: ({ signal }) => thingsHandler.getAll({ signal }),
     });
   }
   ```

8. **Barrel** (`index.ts`):
   ```ts
   export { useThings } from './api/use-my-feature';
   export type { Thing } from './types/my-feature.types';
   ```

9. **Use in a page**:
   ```tsx
   import { useThings, type Thing } from '@features/my-feature';
   ```

### Add an endpoint to an existing feature

1. Add the method to the handler (both branches + validate call)
2. Add the corresponding hook in `use-{feature}.ts` using the key factory
3. Export the new hook from `index.ts`
4. If it's a mutation, add `invalidateQueries` in `onSuccess`

### Add a route

In `src/config/routes.ts`:
```ts
export const routes = {
  // ...existing
  things: {
    list: '/things',
    detail: (id: string) => `/things/${id}`,
  },
} as const;
```

Then use `routes.things.list` and `routes.things.detail(id)` in components.

### Add an env var / constant

→ See [configuration.md](configuration.md).

---

## Sidebar

The sidebar is **data-driven**: all items are declared in a single config file and rendered generically. Adding a nav item requires editing the config, not the component.

### Structure

```
src/components/layout/sidebar/
  sidebar.config.ts          Items config — edit this to add/change nav items
  sidebar.types.ts           SidebarConfig, SidebarSection, SidebarItem, SidebarLink, SidebarGroup
  sidebar.tsx                Orchestrator — reads config, renders sections
  sidebar-section.tsx        Section with optional UPPERCASE title
  sidebar-link.tsx           Direct navigation link (icon, badge, count, disabled)
  sidebar-group.tsx          Collapsable group with chevron and animated children
  sidebar-popover.tsx        Hover popover for groups in collapsed mode
  use-expanded-groups.ts     Hook combining store + active route → effective open set
  index.ts                   Barrel (exports Sidebar, sidebarConfig, types)
```

### Two-signal expansion

Groups open when either signal is true:
1. **Store signal**: the user manually opened the group — saved in `sidebar.store.ts`, key `nexdash-sidebar`.
2. **Route signal**: navigating to a child of a group fires `setGroupExpanded(id, true)` via `useExpandedGroups`.

When the user manually closes a group, it's removed from the store. If they later navigate to one of its children, the route signal re-opens it. This feels natural — navigating to content always shows that content in context.

### Collapsed mode

When `sidebarCollapsed = true` (w-16):
- Links: icon only + tooltip on hover.
- Groups: icon only + `SidebarPopover` on hover. Popover is portalled to `document.body`, appears to the right of the sidebar, and is keyboard-navigable (Tab between children, Escape closes).

### Adding a group

```ts
// 1. src/config/routes.ts
projects: {
  list:     '/projects',
  detail:   (id: string) => `/projects/${id}`,
},

// 2. src/components/layout/sidebar/sidebar.config.ts
{
  type: 'group',
  label: 'Projects',
  icon: FolderOpen,
  children: [
    { type: 'link', label: 'All projects', href: routes.projects.list },
  ],
},
```

### Sections with mixed items

A section can contain any combination of direct links and collapsable groups. The current `ui` section is the canonical example: it has one direct link (Overview) followed by two collapsable groups (Components, Layout). There is no restriction on mixing types within a section.

### Sub-item visual hierarchy

Child links inside an expanded group show a **continuous vertical guide line** on the left (a `border-l` on the children container, positioned at ~22px to align with the parent icon center). This replaces the previous dot-bullet approach and matches the style used by Linear and Vercel. The guide line color is `var(--border-strong)` and is unaffected by the active accent color.

### Depth limit

Maximum 2 levels: Section → Group → Link. Groups cannot contain other groups. If a group would have more than 6–7 children, consider a dedicated page with `UiSubnav` as a secondary navigation panel (see below).

### UiSubnav — alternative for secondary navigation

`UiSubnav` (`src/features/ui-showcase/components/ui-subnav.tsx`) provides a secondary navigation panel rendered inside the page layout rather than the main sidebar. Use it when a section is supplementary or admin-only and adding it to the main sidebar would clutter the primary navigation. It is documented as an alternative pattern in `/ui/sidebar` but is not used in the main dashboard navigation.

```tsx
// In a section layout (e.g. src/app/(dashboard)/my-section/layout.tsx)
import { UiSubnav } from '@features/ui-showcase';

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex -m-6 min-h-[calc(100vh-56px)]">
      <aside className="w-52 shrink-0 border-r border-[var(--border)]">
        <UiSubnav />
      </aside>
      <div className="flex-1 min-w-0 p-8">{children}</div>
    </div>
  );
}
```

**When to use sidebar sections vs UiSubnav**: prefer sidebar sections (with collapsable groups if needed) for all primary navigation. Use UiSubnav only when the section is genuinely supplementary and adding it to the main sidebar would distract from the core product navigation.
