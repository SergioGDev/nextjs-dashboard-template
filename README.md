# NexDash

A Next.js 16 analytics dashboard template — feature-based architecture, mock data out of the box,
one env var to switch to a real API. Multi-language ready (English + Spanish).

### ▶ Live demo: **https://tfm-master-desarrollo-ia.sergiogdev.com**

Sign in with `admin@nexdash.com` / `admin123` — no backend needed, the credentials are also shown
on the login page.

```bash
npm install && npm run dev     # → http://localhost:3000
```

That's the whole setup. → [Full guide](docs/getting-started.md)

---

## Documentation

**Understand the project**

| | |
|---|---|
| [Goals and scope](docs/project-goals.md) | What it is, what it demonstrates, what's deliberately left out |
| [Methodology](docs/methodology.md) | How it was built with AI: architect/executor split, verification, what went wrong |
| [Architecture](docs/architecture.md) | Layers, feature anatomy, dependency rules, decision log |

**Get it running**

| | |
|---|---|
| [Getting started](docs/getting-started.md) | Install, scripts, mock accounts, project tour |
| [Configuration](docs/configuration.md) | Env vars, constants, typed routes |
| [Deployment](docs/deployment.md) | Docker, build args vs runtime env, CI, Dokploy, traps |

**Extend it**

| | |
|---|---|
| [Data layer](docs/data-layer.md) | Handler → hook → validate → keys; swapping mocks for a real API |
| [Components](docs/components.md) | Adding a design-system component and its `/ui` page |
| [Feedback](docs/feedback.md) | Toasts, empty states, error states, skeletons |
| [i18n](docs/i18n.md) | Locale routing, namespaces, adding a language |
| [Auth](docs/auth.md) | Session flow, cookies, proxy, invariants |
| [Testing](docs/testing.md) | Vitest harness, coverage, conventions |
| [Foundations](docs/foundations.md) | Design tokens and the `/ui/foundations` page |

**History**

| | |
|---|---|
| [Changelog](docs/CHANGELOG.md) | 63 blocks: what, why, and what was discarded |
| [B6 audit](docs/B6-audit.md) · [B9 audit](docs/B9-audit.md) | Historical snapshots — not edited |

---

## Stack

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | Framework + routing |
| React 19 + React Compiler | UI with automatic memoization |
| TypeScript 5 (strict) | Type safety |
| Tailwind CSS v4 | Styling via CSS custom properties |
| TanStack Query v5 | Server state, caching, mutations |
| Zustand v5 | Client state (sidebar, accent, user) |
| React Hook Form + Zod | Forms and validation |
| Recharts v3 | Data visualisation |
| next-themes · next-intl v4 | Theming without FOUC · i18n |
| Vitest + Testing Library | 56 tests across 17 files |

## What's in it

| Page | Route | What it shows |
|---|---|---|
| Dashboard | `/` | KPI cards, revenue and sessions charts, campaign table, activity feed |
| Analytics | `/analytics` | Date-range selector, multi-series line chart, traffic donut, breakdown table |
| Reports | `/reports` | Report list with type/status badges and downloads |
| Users | `/users` | Searchable table, filters, create dialog, bulk delete |
| Settings | `/settings` | Profile form, theme switcher, accent picker |
| Design system | `/ui` | Living reference: every primitive with anatomy, variants, props |

Two themes and six accent presets, all driven by CSS custom properties — no hardcoded colour in
any component. English and Spanish with URL-prefix routing; every visible string lives in a
translation file.

---

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
| B12.1 | ✅ Done | Dockerized: multi-stage build, `output: standalone`, `/api/health` |
| B12.2 | ✅ Done | GitHub Actions: quality gate + Docker build-and-smoke-test |
| B12.3 | ✅ Done | Deployed to VPS via Dokploy, TLS + auto-deploy on push to `main` |
| B13.1 | ✅ Done | Topbar: functional route search + `notifications` feature |
| B13.2 | ✅ Done | `Pagination` extracted, windowed with ellipsis, 70-user dataset |
| B13.3 | ✅ Done | Deployment hardening: `/api/version`, security headers |
| B14 | ✅ Done | Documentation hub: goals, methodology, getting started |

B9.2 and B9.3 remain partially open: items with visible demo impact were addressed in B13; the
rest is tracked as known debt in [docs/B9-audit.md](docs/B9-audit.md).
