# Getting started

Everything needed to run NexDash locally, sign in, and find your way around the codebase.

Prerequisites: **Node.js ≥ 22.16** (declared in `package.json` `engines`) and npm.

---

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No backend, no database, no environment
file required — the app ships with mock data and a mock auth store.

Sign in with one of the seeded accounts (they're also listed on the login page):

| Email | Password | Role |
|---|---|---|
| `admin@nexdash.com` | `admin123` | admin |
| `user@nexdash.com` | `user123` | user |

Sessions live in memory and are cleared when the dev server restarts — expected behaviour for a
mock store, see [auth.md](auth.md).

---

## Available scripts

```bash
npm run dev         # Dev server on localhost:3000
npm run build       # Production build
npm run start       # Serve the production build
npm run lint        # ESLint — 0 errors policy
npm run typecheck   # tsc --noEmit
npm test            # Vitest — single pass, CI-style
npm run test:watch  # Vitest — watch mode
npm run check:docs  # Verify every path cited in the docs still exists on disk
```

The five gates run in CI on every push: `lint → typecheck → test → check:docs → build`.

> **Never run `npm audit fix --force`.** It proposes `next@9.3.3` — a 2020 release — as the "fix"
> for two transitive advisories bundled inside Next. See [deployment.md](deployment.md).

---

## Connecting a real backend

In `.env.local`:

```bash
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_USE_MOCKS=false
```

Restart the dev server. **No component or hook changes are required** — only the handler layer
branches on that flag. See [data-layer.md](data-layer.md) for the swap point.

Note that `NEXT_PUBLIC_*` variables are inlined at **build** time. In a container they must be
passed as build args, not runtime environment variables — a runtime value is silently ignored.
[deployment.md](deployment.md) covers this trap in detail.

---

## Project structure

```
src/
├── app/              Next.js App Router — pages and layouts (thin, delegate to features)
│   ├── [locale]/     Locale-prefixed routes: (auth) public, (dashboard) protected
│   └── api/          Route handlers: mock auth, /api/health, /api/version
├── features/         Business domains — each owns its full vertical slice
│   └── users/          api/ (handler, hooks, keys, mock data), schemas/, types/, i18n/, components/
├── components/       Shared UI: ui/, charts/, forms/, layout/, feedback/, dashboard/, auth/, i18n/
├── config/           env, constants, typed routes, i18n config — the only place reading process.env
├── lib/              Domain-free utilities: api client, validate(), route-info, utils
├── hooks/            Cross-feature hooks only (sidebar, media query, floating position, logout)
├── store/            Zustand stores: ui, sidebar, user
├── i18n/             next-intl request config and localized navigation wrappers
├── messages/         Cross-cutting translations (common.json per locale)
├── styles/           tokens.css (themes + accents), components.css (nx-* classes)
├── test/             Vitest setup and the renderWithProviders harness
└── proxy.ts          Edge middleware — auth gate on dashboard routes
```

The rule that explains the shape: **features own their data, components own their presentation.**
A feature never imports from another feature; `components/ui/` never imports from features.

→ Full detail and dependency rules: [architecture.md](architecture.md)

---

## Where to go next

| If you want to… | Read |
|---|---|
| Understand why it's built this way | [architecture.md](architecture.md) |
| Add a feature or repoint the data layer | [data-layer.md](data-layer.md) |
| Add a component to the design system | [components.md](components.md) |
| Add or change a translated string | [i18n.md](i18n.md) |
| Write tests | [testing.md](testing.md) |
| Deploy it | [deployment.md](deployment.md) |
