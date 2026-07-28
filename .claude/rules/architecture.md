---
description: High-level architecture overview — layers, feature structure, dependency rules
paths:
  - src/**
---

## Project type

Next.js 16 analytics dashboard template with App Router, React 19, React Compiler. Mock data by default; real API with `NEXT_PUBLIC_USE_MOCKS=false`.

Full reference: `docs/architecture.md`.

## Folder layout

```
src/app/         Pages and layouts (thin — delegate to features)
src/features/    Business domains (users, analytics, reports, dashboard, auth, settings, ui-showcase)
src/components/  Shared UI (ui/, charts/, forms/, layout/, feedback/, dashboard/, auth/, i18n/)
src/config/      Configuration (env, constants, routes, i18n)
src/lib/         Domain-free utilities (api client, validate, utils, route-info, charts)
src/hooks/       Cross-feature hooks (use-sidebar, use-media-query, use-floating-position, use-logout-action)
src/store/       Zustand stores (ui.store, sidebar.store, user.store)
src/i18n/        next-intl request config and localized navigation wrappers
src/messages/    Cross-cutting translations (common.json per locale)
src/styles/      tokens.css (themes + accents) and components.css (nx-* classes)
src/test/        Vitest setup and the renderWithProviders harness
src/types/       Global types (api.types.ts only)
src/proxy.ts     Edge middleware — auth gate on dashboard routes
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
i18n/
  en.json / es.json     Feature strings — MANDATORY, registered in src/i18n/request.ts
components/             Domain-specific components (optional)
index.ts                Public barrel — hooks, types, components ONLY
```

Do not skip `i18n/`: every user-visible string must live in a translation file (see `i18n.md`).
A feature created without it will violate the i18n rules on its first rendered label.

Two features deviate on purpose: `settings/` is i18n-only (its form schema lives in
`src/lib/validators/`), and `ui-showcase/` has no `api/` or `schemas/` because it fetches nothing.

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
