---
description: High-level architecture overview — layers, feature structure, dependency rules
paths:
  - src/**
---

## Project type

Next.js 15 analytics dashboard template with App Router, React 19, React Compiler. Mock data by default; real API with `NEXT_PUBLIC_USE_MOCKS=false`.

Full reference: `docs/architecture.md`.

## Folder layout

```
src/app/         Pages and layouts (thin — delegate to features)
src/features/    Business domains (users, analytics, reports, dashboard)
src/components/  Shared UI (ui/, charts/, forms/, layout/)
src/config/      Configuration (env, constants, routes)
src/lib/         Domain-free utilities (api client, validate, utils)
src/hooks/       Cross-feature hooks (use-sidebar, use-media-query)
src/store/       Zustand stores (ui.store, user.store)
src/types/       Global types (api.types.ts only)
```

## Feature anatomy

Every feature (`src/features/{name}/`) has this structure:

```
api/
  _mock-data.ts         Private mock fixtures
  {name}.handler.ts     Data access — branches USE_MOCKS
  {name}.keys.ts        Query key factory — PRIVATE (not in barrel)
  use-{name}.ts         TanStack Query hooks — PUBLIC
schemas/
  {name}.schemas.ts     Zod schemas — source of truth for all types
types/
  {name}.types.ts       z.infer<> exports + UI-only types
components/             Domain-specific components (optional)
index.ts                Public barrel — hooks, types, components ONLY
```

## Dependency rules

- Pages import from `@features/*` (barrel only), `@components/*`, `@lib/*`, `@config/*`
- Features never import from other features
- `components/ui/` never imports from `@features/*` or `@store/*`
- `lib/` never imports from `features/`, `app/`, `components/`
- `process.env` only in `src/config/env.ts`
- Route strings only in `src/config/routes.ts`

## Adding a feature

See `docs/architecture.md#how-to-extend` for the complete step-by-step recipe with code snippets.

Short version: schema → types → mock data → key factory → handler → hook → barrel → page.
