# NexDash

A Next.js 15 analytics dashboard template — feature-based architecture, mock data out of the box, one env var to switch to a real API.

> **Status**: architecture complete (B1–B2.5), auth in progress (B3). See [CHANGELOG](docs/CHANGELOG.md).

## Stack

| Technology | Purpose |
|---|---|
| Next.js 15 (App Router) | Framework + routing |
| React 19 + React Compiler | UI with automatic memoization |
| TypeScript 5 (strict) | Type safety |
| Tailwind CSS v4 | Styling via CSS custom properties |
| TanStack Query v5 | Server-state, caching, mutations |
| Zustand v5 | Client-state (sidebar, accent) |
| React Hook Form + Zod | Forms and validation |
| Recharts v3 | Data visualisation |
| next-themes | Dark/light switching without FOUC |
| Lucide React | Icons |

## Getting started

```bash
# 1. Install
npm install

# 2. Configure (optional — works without a backend)
cp .env.example .env.local

# 3. Start
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with any email/password to enter the dashboard (mock auth, no backend needed).

### Connecting a real backend

In `.env.local`:

```bash
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_USE_MOCKS=false
```

Restart the dev server. No component or hook changes required.

## Structure

```
src/
├── app/              Pages and layouts (thin — delegate to features)
├── features/         Business domains: dashboard, analytics, reports, users
│   └── users/        Each feature owns its handler, hook, schema, types, components
├── components/       Shared UI: ui/, charts/, forms/, layout/
├── config/           env vars, constants, typed routes — single entry point
├── lib/              API client, validation helper, utilities
├── hooks/            Cross-feature hooks (sidebar, media query)
├── store/            Zustand stores (ui preferences, current user)
└── types/            Global types (api.types.ts)
```

→ Full architecture: [docs/architecture.md](docs/architecture.md)

## Features

| Page | Route | What it shows |
|---|---|---|
| Dashboard | `/` | KPI cards, revenue chart, sessions chart, campaign table, activity feed |
| Analytics | `/analytics` | Date-range selector, multi-series line chart, traffic donut, daily breakdown table |
| Reports | `/reports` | Report list with type/status badges and download buttons |
| Users | `/users` | User table with search/filter, create dialog, inline delete |
| User detail | `/users/:id` | Profile card + edit form |
| Settings | `/settings` | Profile form, theme switcher, accent color picker |

## Theming

Two themes (dark default): **Midnight Pro** and **Arctic Light**. Six accent presets: `indigo`, `violet`, `emerald`, `rose`, `amber`, `cyan`. All colors are CSS custom properties — no hardcoded hex in components. Change theme/accent in **Settings → Appearance**.

## Development

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint (0 errors policy)
```

No test suite yet — added in B6.

## Documentation

- [Architecture](docs/architecture.md) — layers, features, dependency rules, decision log
- [Data layer](docs/data-layer.md) — handler/hook/validate/keys pattern
- [Configuration](docs/configuration.md) — env vars, constants, routes
- [Changelog](docs/CHANGELOG.md) — block-by-block history

## Roadmap

| Block | Status | Description |
|---|---|---|
| B1 | ✅ Done | Cleanup: next-themes, lint fixes, dead code |
| B2 | ✅ Done | Swappable data layer: HTTP client, USE_MOCKS, handlers |
| B2.5 | ✅ Done | Architecture refactor: features, Zod schemas, config |
| B3 | 🔄 Next | Auth: middleware, login/logout, cookie, 401 interceptor |
| B4 | Pending | UX: toasts, empty states, error states, not-found |
| B5 | Pending | DX: README final, guides for adding features/replacing mocks |
| B6 | Pending | Quality: Vitest, Testing Library, Husky, GitHub Actions CI |
| B7 | Pending | Polish: Framer Motion, a11y, metadata, next/image |
