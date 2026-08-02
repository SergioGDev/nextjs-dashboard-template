# NexDash

A Next.js 16 analytics dashboard template — feature-based architecture, mock data out of the box, one env var to switch to a real API. Multi-language ready (English + Spanish, easily extensible).

### ▶ Live demo: **https://tfm-master-desarrollo-ia.sergiogdev.com**

Sign in with `admin@nexdash.com` / `admin123` — no backend needed, the credentials are also shown
on the login page.

> **Status**: B1–B13.3 complete. The app is built, tested, containerised and deployed: architecture,
> data layer, auth, UX feedback, i18n, full design system showcase, tech debt audit, 53 tests,
> security bump, Docker image, GitHub Actions quality gate, a live VPS deployment via Dokploy
> with auto-deploy on push to `main`, a functional topbar (route search + real notifications), a
> standalone `Pagination` component with windowed/ellipsis paging used by `DataTable`, and
> deployment hardening (`/api/version`, security headers). See [CHANGELOG](docs/CHANGELOG.md).

## Stack

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | Framework + routing |
| React 19 + React Compiler | UI with automatic memoization |
| TypeScript 5 (strict) | Type safety |
| Tailwind CSS v4 | Styling via CSS custom properties |
| TanStack Query v5 | Server-state, caching, mutations |
| Zustand v5 | Client-state (sidebar, accent) |
| React Hook Form + Zod | Forms and validation |
| Recharts v3 | Data visualisation |
| next-themes | Dark/light switching without FOUC |
| next-intl v4 | i18n: locale routing, message loading, ICU plurals |
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

Open [http://localhost:3000](http://localhost:3000) and sign in with one of the mock accounts
(no backend needed — they are also listed on the login page):

| Email | Password | Role |
|---|---|---|
| `admin@nexdash.com` | `admin123` | admin |
| `user@nexdash.com` | `user123` | user |

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
├── test/             Vitest setup and the renderWithProviders harness
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

## Internationalization

Two languages out of the box: **English** (default) and **Spanish**. URL prefix routing
(`/en/...`, `/es/...`), persisted via the `NEXT_LOCALE` cookie, automatic detection from
`Accept-Language`. Switch language from the topbar or **Settings → Appearance**. Every visible
string lives in a JSON file under `src/messages/` or `src/features/*/i18n/` — none are hardcoded
in components.

→ Add a new language: see [docs/i18n.md](docs/i18n.md#cómo-añadir-un-idioma-nuevo).

## Development

```bash
npm run dev         # Start dev server (localhost:3000)
npm run build       # Production build
npm run lint        # ESLint (0 errors policy)
npm run typecheck   # tsc --noEmit
npm test            # Vitest — single pass, CI-style
npm run test:watch  # Vitest — watch mode for local development
npm run check:docs  # Verify every path cited in the documentation still exists on disk
```

Test suite: Vitest + Testing Library (jsdom). Covers pure logic (`route-info`, `validate()`,
Zod validator factories), `authHandler.me()` and `notificationsHandler.getAll()`, a handful of
UI components (behavior, not CSS classes) including the topbar route search and the notification
bell, and the `DataTable` search filter. See [docs/testing.md](docs/testing.md) for what's
covered, what's deliberately out of scope, and why.

### CI

Two GitHub Actions workflows, both scoped to `main` (this repo has no pull-request history — every
commit goes straight to `main`, so PR-only checks would never run):

- **`ci.yml`** — lint, typecheck, test, `check:docs`, build. Runs on every push and PR.
- **`docker.yml`** — builds the Docker image and smoke-tests it (boots the container, curls
  `/api/health` and `/en/login`). Always on PR; on push to `main`, only when files that can change
  the image (`Dockerfile`, `package.json`, `package-lock.json`, `next.config.ts`, …) are touched.
  Never publishes the image — see Deployment below.

→ Full reasoning: [docs/deployment.md#ci-github-actions](docs/deployment.md#ci-github-actions)

## Deployment

```bash
docker build -t nexdash .
docker run -d -p 3000:3000 nexdash
```

Multi-stage Dockerfile producing a minimal, non-root runtime image via Next's `output:
'standalone'`. `NEXT_PUBLIC_*` vars are build args (`--build-arg NEXT_PUBLIC_USE_MOCKS=false`),
not runtime env vars — they're inlined into the client bundle at build time. Healthcheck at
`/api/health`.

CI builds and smoke-tests this image on every push/PR but doesn't publish it — Dokploy builds and
deploys its own copy on the VPS via webhook on push to `main`, so nothing here duplicates that
work. The deployment runs a single replica: the mock session store is an in-memory `Map` on
`globalThis` and does not survive a second container.

→ Full reasoning, traps, and verification steps: [docs/deployment.md](docs/deployment.md)

## Documentation

- [Architecture](docs/architecture.md) — layers, features, dependency rules, decision log
- [Data layer](docs/data-layer.md) — handler/hook/validate/keys pattern
- [Configuration](docs/configuration.md) — env vars, constants, routes
- [Auth](docs/auth.md) — session, middleware, login/logout flow
- [Feedback](docs/feedback.md) — toasts, empty states, error states, skeletons
- [i18n](docs/i18n.md) — locale routing, namespaces, adding a language, glossary
- [Testing](docs/testing.md) — Vitest + Testing Library harness, coverage, conventions
- [Deployment](docs/deployment.md) — Docker, build args vs. runtime env, traps, verification
- [Changelog](docs/CHANGELOG.md) — block-by-block history

## Roadmap

| Block | Status | Description |
|---|---|---|
| B1 | ✅ Done | Cleanup: next-themes, lint fixes, dead code |
| B2 | ✅ Done | Swappable data layer: HTTP client, USE_MOCKS, handlers |
| B2.5 | ✅ Done | Architecture refactor: features, Zod schemas, config |
| B3 | ✅ Done | Auth: middleware, login/logout, cookie, 401 interceptor |
| B4 | ✅ Done | UX: toasts, empty states, error states, skeletons |
| B5 | ✅ Done | i18n: next-intl, locale routing, language switcher, full translation pass |
| B6 | ✅ Done | UI showcase: foundations, components, table, data-table |
| B7 | ✅ Done | Charts showcases: area, bar, line, donut |
| B8 | ✅ Done | Layout polish: single source of truth for routes + showcases |
| B9 | ✅ Done | Tech debt audit (38 items) + cleanup of 8 |
| B10 | ✅ Done | Documentation realignment |
| B11 | ✅ Done | Test suite: Vitest + Testing Library |
| B11.5 | ✅ Done | Security: Next 16.2.4 → 16.2.12 (22 high advisories closed) |
| B11.6 | ✅ Done | Realigned agent context: `CLAUDE.md` + `.claude/rules/` |
| B12.1 | ✅ Done | Dockerized: multi-stage build, `output: standalone`, `/api/health`, verified locally |
| B12.2 | ✅ Done | GitHub Actions: quality gate (lint/typecheck/test/docs/build) + Docker build-and-smoke-test |
| B12.3 | ✅ Done | Deployed to VPS via Dokploy, TLS + auto-deploy on push to `main` |
| B13.1 | ✅ Done | Topbar: functional route search + `notifications` feature (closes T-1, T-2) |
| B13.2 | ✅ Done | `Pagination` extracted, windowed with ellipsis, 70-user mock dataset (closes D-1, D-2, D-4) |
| B13.3 | ✅ Done | Deployment hardening: `/api/version`, `poweredByHeader: false`, security headers (`HSTS`, etc.) |

B9.2 and B9.3 remain partially open: items with visible demo impact are addressed in B13; the
rest is tracked as known debt in [docs/B9-audit.md](docs/B9-audit.md).
