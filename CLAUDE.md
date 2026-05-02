# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Run production server
npm run lint     # ESLint (v9 flat config)
```

No test suite is configured.

## Architecture

NexDash is a Next.js 15 analytics dashboard template using the App Router with two route groups:
- `(auth)` — public pages (login)
- `(dashboard)` — protected pages with a shared layout (sidebar + topbar)

### Data Flow

All data is mocked. The pattern per feature:

```
src/mocks/data/       →  raw mock datasets
src/mocks/handlers/   →  async functions simulating API endpoints (400–800ms delay)
src/hooks/            →  TanStack Query hooks wrapping those handlers
src/components/       →  UI consuming those hooks
```

To replace mocks with a real API, swap handler implementations; the hook interface stays the same.

### State Management

- **Server state** (data fetching): TanStack Query v5 with `staleTime: 30s`, mutations call `invalidateQueries`.
- **UI state**: Zustand stores in `src/store/` — `ui.store.ts` (sidebar collapse, accent color, localStorage-persisted), `user.store.ts` (logged-in user).
- **Form state**: React Hook Form + Zod schemas in `src/lib/validators/`.

### Component Layers

```
src/components/ui/        # Base design system (Button, Card, Input, etc.)
src/components/forms/     # login-form, user-form, settings-form
src/components/charts/    # Recharts wrappers (area, bar, line, donut)
src/components/layout/    # sidebar, topbar, breadcrumbs, theme-toggle
src/components/dashboard/ # kpi-card, activity-feed, data-table
```

### Theming

Tailwind v4 (no `tailwind.config` file; uses native CSS). Themes are driven by CSS custom properties in `src/app/globals.css`:
- `[data-theme="dark|light"]` on `<html>` via next-themes
- `[data-accent]` on `<html>` for six accent presets (indigo, violet, emerald, rose, amber, cyan)

### Path Alias

`@/*` maps to `./src/*` (configured in `tsconfig.json`).

## Documentación adicional

Reglas específicas por área en `.claude/rules/` (se cargan automáticamente por paths):
- `components.md` — capas de componentes, tokens, convenciones
- `data-layer.md` — patrón mock→handler→hook, TanStack Query
- `forms.md` — React Hook Form + Zod
- `styling.md` — Tailwind v4, CSS custom properties, theming
- `state.md` — Zustand vs TanStack Query, stores existentes
