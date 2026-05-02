---
description: Naming conventions, import rules, and barrel patterns across the codebase
paths:
  - src/**
---

## Naming conventions

| What | Convention | Example |
|---|---|---|
| Files (all) | kebab-case | `user-form.tsx`, `use-users.ts` |
| React components | PascalCase export | `export function UserForm()` |
| Hooks | `use-` prefix | `use-users.ts` → `useUsers()` |
| Handlers | `{feature}.handler.ts` | `users.handler.ts` |
| Key factories | `{feature}.keys.ts` | `users.keys.ts` |
| Schemas | `{feature}.schemas.ts` | `users.schemas.ts` |
| Types | `{feature}.types.ts` | `user.types.ts` |
| Mock data | `_mock-data.ts` (underscore = private) | `_mock-data.ts` |
| Stores | `{name}.store.ts` | `ui.store.ts` |
| Constants | `SCREAMING_SNAKE_CASE` | `STALE_TIME`, `DEFAULT_ACCENT` |

## Import aliases

| Alias | Points to | Use for |
|---|---|---|
| `@features/*` | `src/features/*` | Feature barrels only (`@features/users`) |
| `@components/*` | `src/components/*` | UI primitives, layout, charts |
| `@lib/*` | `src/lib/*` | Utilities, API client, validators |
| `@config/*` | `src/config/*` | env, constants, routes |
| `@store/*` | `src/store/*` | Zustand stores |
| `@/*` | `src/*` | Escape hatch — prefer specific aliases |

## Import rules (strict)

1. **Features are consumed via barrel only**:
   ```ts
   // ✅ correct
   import { useUsers, User } from '@features/users';
   // ❌ never
   import { usersHandler } from '@features/users/api/users.handler';
   ```

2. **Features do not import from other features**:
   ```ts
   // ❌ never (inside features/analytics/)
   import { User } from '@features/users';
   ```

3. **UI primitives do not import from features or stores**:
   ```ts
   // ❌ never (inside components/ui/)
   import { useUsers } from '@features/users';
   ```

4. **No process.env outside config/env.ts**:
   ```ts
   // ❌ never
   const url = process.env.NEXT_PUBLIC_API_URL;
   // ✅ always
   import { env } from '@config/env';
   const url = env.NEXT_PUBLIC_API_URL;
   ```

5. **No hardcoded route strings in components**:
   ```ts
   // ❌ never
   <Link href="/users">
   router.push('/');
   // ✅ always
   import { routes } from '@config/routes';
   <Link href={routes.users.list}>
   router.push(routes.dashboard);
   ```

## Barrel pattern

Each feature's `index.ts` exports the **public surface only**:
- Hooks (`use-*`)
- Public types
- Domain components (if consumed outside the feature)

Never export: handler, keys factory, mock data, schemas, internal utils.

## `'use client'` directive

Required on: hooks, components with event handlers, components using browser APIs.  
Omit on: server components, layouts, static pages, utility files.

## Comments

Write no comments unless the WHY is non-obvious. One short line maximum. Never document WHAT the code does (the names do that).
