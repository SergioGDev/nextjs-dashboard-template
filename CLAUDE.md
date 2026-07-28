# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (localhost:3000)
npm run build      # Production build
npm run start      # Run production server
npm run lint       # ESLint (v9 flat config)
npm run typecheck  # tsc --noEmit
npm test           # Vitest — single pass, CI-style
npm run test:watch # Vitest — watch mode
```

### Never run `npm audit fix --force`

`npm audit` reports two transitive advisories bundled inside Next (`postcss`, `sharp`) and
proposes `next@9.3.3` as the "fix" — a 2020 release. Running `--force` would destroy the
project. Both are upstream-bound: Next pins `sharp@^0.34.5`, so the patched `0.35.x` is outside
its declared range. Accepted as known debt; see `docs/CHANGELOG.md` under B11.5.

## Architecture

NexDash is a Next.js 16 analytics dashboard template using the App Router with two route groups:
- `(auth)` — public pages (login)
- `(dashboard)` — protected pages with a shared layout (sidebar + topbar)

### Data Flow

All data is mocked. Each feature owns its own data layer — there is no central `mocks/` folder:

```
src/features/{name}/api/_mock-data.ts      →  private mock fixtures
src/features/{name}/api/{name}.handler.ts  →  data access; branches on USE_MOCKS
src/features/{name}/api/{name}.keys.ts     →  query key factory (private, not in barrel)
src/features/{name}/api/use-{name}.ts      →  TanStack Query hooks (public, via barrel)
src/components/                            →  UI consuming those hooks
```

`src/hooks/` holds only cross-feature hooks (sidebar, media query, floating position, logout) —
never data-fetching hooks.

To replace mocks with a real API, swap handler implementations; the hook interface stays the same.

### State Management

- **Server state** (data fetching): TanStack Query v5 with `staleTime: 30s`, mutations call `invalidateQueries`.
- **UI state**: Zustand stores in `src/store/` — `ui.store.ts` (sidebar collapse, accent color, localStorage-persisted), `sidebar.store.ts` (which sidebar groups are expanded, persisted), `user.store.ts` (logged-in user, **not** persisted — rehydrated from `/me`).
- **Form state**: React Hook Form + Zod schemas in `src/lib/validators/`.

### Component Layers

```
src/components/ui/        # Base design system (Button, Card, Input, DataTable, etc.)
src/components/forms/     # login-form, user-form, settings-form
src/components/charts/    # Recharts wrappers (area, bar, line, donut)
src/components/layout/    # sidebar, topbar, breadcrumbs, theme-toggle
src/components/feedback/  # toast, empty-state, error-state, skeleton
src/components/dashboard/ # kpi-card
src/components/auth/      # session-provider
src/components/i18n/      # language-switcher
```

`DataTable` lives in `ui/`, not `dashboard/`. `activity-feed` is still feature-local in
`src/features/dashboard/components/`.

### Theming

Tailwind v4 (no `tailwind.config` file). `src/app/globals.css` holds `@theme inline` plus base
styles and imports the real token files. Theme blocks live in **`src/styles/tokens.css`**:
- `.theme-dark` / `.theme-light` **classes** on `<html>` via next-themes (`attribute="class"`)
  — not a `data-theme` attribute
- `[data-accent]` on `<html>` for six accent presets (indigo, violet, emerald, rose, amber, cyan)
- Combined selectors look like `.theme-dark[data-accent="indigo"]`

### Path Aliases

Six aliases in active use — prefer the specific one over `@/`:

```
@features/*  @components/*  @lib/*  @config/*  @store/*  @/*
```

`tsconfig.json` also declares `@app/*`, `@types/*` and `@styles/*`, but they have zero usages.
Dead config — do not start using them; see `conventions.md`.

## Documentación adicional

Reglas específicas por área en `.claude/rules/` (se cargan automáticamente por paths):
- `architecture.md` — capas, anatomía de feature, reglas de dependencia
- `components.md` — capas de componentes, tokens, convenciones
- `conventions.md` — naming, estructura de ficheros
- `config.md` — env, constants, routes
- `data-layer.md` — patrón handler→hook, TanStack Query
- `forms.md` — React Hook Form + Zod
- `state.md` — Zustand vs TanStack Query, stores existentes
- `styling.md` — Tailwind v4, CSS custom properties, theming
- `feedback.md` — toasts, empty/error states, skeletons
- `i18n.md` — next-intl, namespaces, navegación localizada
- `auth.md` — sesión, cookies, proxy, invariantes
- `sidebar.md` — sidebar.config.ts, grupos, persistencia
- `testing.md` — Vitest, renderWithProviders, convenciones
- `ui-showcase.md` — páginas `/ui`, showcase de design system
- `architect-prompts.md` — cómo se redactan los prompts del ejecutor

Docs de referencia en `docs/`: `architecture.md`, `data-layer.md`, `configuration.md`, `auth.md`,
`feedback.md`, `i18n.md`, `testing.md`, `foundations.md`, `components.md`, `CHANGELOG.md`, y los
audits `B6-audit.md` / `B9-audit.md` (snapshots históricos, no se editan).
