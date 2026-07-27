---
description: Vitest + Testing Library conventions — harness usage, colocation, what to mock
paths:
  - src/test/**
  - vitest.config.ts
  - src/**/*.test.ts
  - src/**/*.test.tsx
---

## Rendering components

**Always use `renderWithProviders` from `@/test/render`** — never `render` from
`@testing-library/react` directly for anything that touches TanStack Query or next-intl:

```ts
import { renderWithProviders, screen } from '@/test/render';   // ✓
import { render, screen } from '@testing-library/react';        // ✗ no providers
```

It re-exports everything `@testing-library/react` exports, so it's a full drop-in — import
`screen`, `waitFor`, `within`, etc. from the same module.

## Never import `Providers` from `src/app/providers.tsx` in a test

Its `QueryClient` is module-scoped — shared across every test that imports it, leaking
cached data between tests. `renderWithProviders` creates a fresh `QueryClient` per call with
`retry: false, staleTime: 0`. See `docs/testing.md` for the full reasoning.

## Messages: pass only what the test uses

```ts
renderWithProviders(<UserForm />, {
  messages: { users: { actions: { save: 'Save' } } },   // ✓ scoped to what's asserted
});
```

Don't import real `common.json` / feature JSON files into tests. Default is `{}` —
a missing key throws or renders the key path, which is the point: if the component you're
testing needs a string, declare it.

## No globals — import from `vitest` explicitly

```ts
import { describe, expect, it, vi } from 'vitest';   // ✓
```

`test.globals` is off in `vitest.config.ts`. Don't add `beforeEach`/`describe`/`it` as if
they were ambient — they aren't.

## Colocation, not `__tests__/`

```
src/lib/route-info.ts
src/lib/route-info.test.ts        ✓ same directory
src/lib/__tests__/route-info.test.ts   ✗ never
```

## `Toaster` / `AuthInterceptor` are opt-in

Not included in `renderWithProviders` by default. If a test needs toast assertions or the
401-interceptor flow, mount that piece explicitly inside the test — don't reach for a
"full app" wrapper.

## Don't chase React Compiler parity

Tests run without the React Compiler transform (see `docs/testing.md`). If a component needs
the compiler to behave correctly, that's a bug in the component (Rules of React violation),
not something to patch into the test config.

## Retry and stale time in test queries

If a test asserts an `isError` state, do not add custom retry logic to make it "more
realistic" — the harness already sets `retry: false` for exactly this reason. A hand-rolled
retry override in a single test is a sign the harness default was bypassed by accident.
