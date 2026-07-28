# Testing

Vitest + Testing Library harness. **B11.1** added the infrastructure (config, `renderWithProviders`,
setup file). **B11.2** added the actual test suite — see [Coverage](#coverage) below for what's
tested and, just as importantly, what's deliberately not.

---

## Running tests

```bash
npm test          # vitest run — single pass, CI-style
npm run test:watch  # vitest — watch mode for local development
npm run typecheck   # tsc --noEmit — not wired into any script that runs it automatically yet
```

No `coverage` script exists yet. `/coverage` is already ignored in `.gitignore` (under the
pre-existing `# testing` section) for whenever one is added.

---

## Stack

| Piece | Package | Role |
|---|---|---|
| Runner | `vitest` | Test runner, assertions (`expect`), mocking |
| DOM environment | `jsdom` | Simulates a browser DOM in Node |
| Rendering | `@testing-library/react` | Renders components, queries the DOM |
| Interaction | `@testing-library/user-event` | Simulates real user input (click, type, tab) |
| Matchers | `@testing-library/jest-dom` | `toBeInTheDocument()`, `toHaveTextContent()`, etc. |
| Alias resolution | Vite's native `resolve.tsconfigPaths` | Reads `tsconfig.json` `paths` — single source of truth |
| React plugin | `@vitejs/plugin-react` | JSX transform for Vitest's Vite pipeline |

Config lives in `vitest.config.ts` (repo root) and `src/test/setup.ts` (global setup, runs
before every test file).

### jsdom version pinned below latest

`jsdom@30` requires Node `^22.22.2 || ^24.15.0 || >=26.0.0`. This environment runs Node
`22.16.0`, which doesn't satisfy that range, so `npm install` resolved `jsdom@^29.1.1`
instead. Not a manual downgrade — just documenting why the installed major differs from
`npm view jsdom version`.

---

## Why `globals` is OFF

`vitest.config.ts` does **not** set `test.globals: true`. Every test file imports
`describe`, `it`, `expect` (and anything else it needs) explicitly from `'vitest'`:

```ts
import { describe, expect, it } from 'vitest';
```

More verbose than relying on injected globals, but:
- No `"vitest/globals"` entry needed in `tsconfig.json` `compilerOptions.types` — one less
  thing for `typecheck` to depend on.
- Matches the repo's general style of explicit imports over ambient globals (see
  `.claude/rules/conventions.md` — no `process.env` outside `env.ts`, no implicit anything).

If a future block finds this too verbose across dozens of test files, revisit — it's a
convention, not a hard constraint.

---

## `renderWithProviders` — the harness

`src/test/render.tsx` exports `renderWithProviders(ui, options?)`, the only way components
should be rendered in tests. It wraps `ui` in `QueryClientProvider` and
`NextIntlClientProvider`, then re-exports everything from `@testing-library/react` so tests
import both from one place:

```tsx
import { renderWithProviders, screen } from '@/test/render';

renderWithProviders(<MyComponent />);
expect(screen.getByText('...')).toBeInTheDocument();
```

### Why it does not reuse `Providers` from `src/app/providers.tsx`

`Providers` instantiates its `QueryClient` **at module scope** (`src/app/providers.tsx:12`).
That's correct for the app — one client for the whole browser session — but wrong for tests:
importing `Providers` in a test suite would mean every test in that file (and, with Vitest's
module caching, potentially across files in the same worker) shares one cache. A mutation or
query in test A can leave data that test B finds already cached, and test B either gets a
false pass or a flaky failure depending on run order. That failure mode is silent in isolation
and only shows up under the full suite — exactly the kind of thing this harness exists to
prevent.

`renderWithProviders` creates a **new `QueryClient` on every call**:

```ts
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0 },
    },
  });
}
```

- `retry: false` — the app's default is `QUERY.RETRY_COUNT` (see `src/config/constants.ts`).
  With retries on, a test asserting an error state (`isError`) would sit through retry
  backoff before the query settles, and could hit the test timeout instead of failing fast.
- `staleTime: 0` — the app default is 30s, tuned for a real browsing session. In a test, each
  render should refetch and settle deterministically, not read a value cached from a previous
  assertion.

`NextIntlClientProvider` isn't in `Providers` at all — the real app applies it in
`src/app/[locale]/layout.tsx`, one level above where `Providers` mounts. The test harness adds
it directly since there's no app layout in a unit test.

### Injecting messages

```ts
renderWithProviders(<MyComponent />, {
  locale: 'es',                                    // optional, defaults to 'en'
  messages: { users: { title: 'Usuarios' } },       // optional, defaults to {}
});
```

**Decision: messages default to `{}`, not the real `common.json` / feature JSON files.**

Two options existed:

- **A — load the real message files.** More realistic (catches missing keys, matches
  production copy), but couples every test to translation content. A copywriting change in
  `common.json` would fail tests that have nothing to do with copy.
- **B — empty by default; each test passes only the keys it exercises.** Chosen. A test that
  renders `<UserForm />` and asserts on `t('actions.save')` declares
  `messages: { users: { actions: { save: 'Save' } } }` and nothing else. The test is explicit
  about what it depends on, and unrelated translation changes can't break it.

`loadMessages` in `src/i18n/request.ts` imports ~25 namespace JSON files for the real app —
importing all of that per test file would also be wasteful for tests that touch one or two
strings.

### `Toaster` and `AuthInterceptor` are opt-in, not default

`Providers` also mounts `<Toaster />` (a portal) and `<AuthInterceptor />` (a global fetch
response interceptor with a side effect on `window`). Neither is in the default wrapper.
A test that specifically exercises toast behavior or the 401-interceptor flow should mount
those itself, scoped to that test — not have them silently active in every render.

---

## Path aliases in tests

`vitest.config.ts` resolves aliases via Vite's native `resolve: { tsconfigPaths: true }` option,
which reads `tsconfig.json`'s `compilerOptions.paths` directly. There is no second alias map in
the Vitest config — `tsconfig.json` is the single source of truth for all nine aliases (`@/`,
`@app/`, `@features/`, `@components/`, `@lib/`, `@config/`, `@store/`, `@types/`, `@styles/`).
A test can `import { QUERY } from '@config/constants'` exactly like application code.

**B11.2**: replaced the `vite-tsconfig-paths` plugin with this native option (uninstalled the
dependency). Same source of truth, one fewer dependency, and it silences the deprecation notice
`vite-tsconfig-paths` printed on every `npm test` run recommending exactly this switch.

---

## Known limitation: no React Compiler in tests

`next.config.ts` sets `reactCompiler: true`, applied by the **Next.js build pipeline**
(via `babel-plugin-react-compiler`, wired through `next build` / `next dev`). Vitest doesn't
go through that pipeline — it uses `@vitejs/plugin-react`'s own Babel/SWC transform, with no
compiler pass.

This is accepted, not worked around:

- The React Compiler is designed to be **semantically transparent** — it memoizes
  automatically but must not change observable behavior. A component that behaves
  differently with vs. without the compiler has a bug in how it's written (a violation of the
  Rules of React), not a test gap.
- Wiring the compiler into the Vitest pipeline is extra build configuration, extra
  transform time on every test run, and one more thing that can break — for a pass whose
  entire purpose is to be a no-op on behavior.

**Practical effect:** tests won't catch a component that silently relies on the compiler for
correctness (e.g., something that only "works" because an auto-memoized value never becomes
stale). If that's ever suspected, verify manually against the dev/build output — don't add
the compiler to the test pipeline to check it.

---

## Coverage

Added in **B11.2**. 36 tests across 13 files (35 new + the B11.1 harness smoke test). All
colocated with the source they cover.

### Pure logic

- **`src/lib/route-info.test.ts`** — the most important suite in the repo. Covers exact match,
  longest-prefix match for dynamic segments (`/users/123` → Users), `exact: true` links being
  excluded from prefix matching, the `/ui` → section-title rule, the `/reports` → group-label
  rule, unknown routes, and the full ancestor chain for a group child.
- **`src/lib/api/validate.test.ts`** — valid data returns the typed value; invalid data throws
  `ApiError` with `code: 'VALIDATION_ERROR'`, never a raw `ZodError`.
- **`src/lib/validators/{auth,user,settings}.schema.test.ts`** — one file per Zod factory.
  Confirms the *injected* message (not a hardcoded one) surfaces in `safeParse().error.issues`,
  and that valid input passes. Test messages use recognizable strings like `'REQUIRED_EMAIL'`
  to make the injection visible.

### Auth

- **`src/features/auth/api/auth.handler.test.ts`** — `authHandler.me()`: a 401 resolves to
  `null` (no session is not an app error, per `.claude/rules/auth.md`), a 500 propagates as
  `ApiError`, and a valid response returns the validated session.
  **Isolation choice: OPCIÓN A** (`vi.mock('@lib/api/client', ...)`). Mocks the exact module
  `auth.handler.ts` imports (`import { api } from '@lib/api/client'` — not the `@lib/api`
  barrel), so the test stays stable across changes to request construction, headers, or
  `credentials` handling, none of which the handler's contract depends on.

### Components (RTL, via `renderWithProviders`)

Five components, chosen for having real logic (not just CSS variants): `Button` (loading
disables + shows a spinner; `iconOnly` requires and renders an accessible name), `Avatar`
(falls back to initials with no `src`, and after the `next/image` `onError` fires), `Badge`
(`onRemove` fires and stops propagation to a parent handler; no remove button renders without
`onRemove`), `ErrorState` (`onRetry` fires on click; dev-only technical details render only
when an `error` is passed), `EmptyState` (per-variant i18n title resolution; explicit `title`
prop wins over the i18n default).

None of these assert `toHaveClass(...)` — every assertion is on observable behavior (DOM text,
`disabled`, callbacks, presence/absence of elements), so renaming a CSS class can't break a
test that isn't testing CSS.

### `DataTable` search filter

`src/components/ui/data-table.test.tsx` — typing in the search input filters rows, matching is
case-insensitive, a query with no matches shows `table.noResults`, and a **contract test**
proves the known limitation D-1/D-5 (see `docs/B9-audit.md`): the filter reads raw column
values, so a query that only matches a `col.render`-transformed string (e.g. searching
`"currently"` when `render` displays "Currently active" but the raw value is `"active"`) finds
nothing. That test asserts the *current* (limited) behavior on purpose — it will need updating,
not deleting, if D-5 is ever fixed.

### Deliberately NOT covered — Decision 1

Nine modules depend on `@/i18n/navigation` (`useRouter`/`usePathname`/`Link`): `login-form`,
`session-provider`, the four `sidebar/*` files, `topbar`, `breadcrumbs`, `language-switcher`.
None of these have component tests in B11.2.

**Reasoning**: router-dependent components need router mocks, and the mock cost is paid per
test with little payoff here, because the logic that actually matters in `Topbar` and
`Breadcrumbs` — deriving a page title and an ancestor chain from a pathname — has already been
extracted into `src/lib/route-info.ts`, a pure function with zero React or router dependency.
`route-info.test.ts` tests that logic directly and exhaustively. A component test for `Topbar`
would only be testing that it calls `getRouteLabel()` and renders the result — wiring, not
logic — for the cost of a full router mock. If `Topbar`/`Breadcrumbs` ever grow real
conditional logic beyond "call route-info and render", revisit this decision.

---

## Adding a new test

Colocate the test file next to the source file it covers — `route-info.test.ts` beside
`route-info.ts`, not in a separate `__tests__/` directory. This matches the feature-based
layout already used across the repo (see `.claude/rules/architecture.md`): each vertical
slice, including its tests, is self-contained.

See `.claude/rules/testing.md` for the short, enforceable rules.
