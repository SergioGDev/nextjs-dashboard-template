---
description: State management strategy — Zustand vs TanStack Query, store conventions
paths:
  - src/store/**
---

## Which State Manager to Use

| Use case | Tool |
|---|---|
| Remote data (fetching, caching, sync) | TanStack Query (`src/hooks/`) |
| UI state that persists across navigations | Zustand (`src/store/`) |
| Form state | React Hook Form |
| Ephemeral local state | `useState` / `useReducer` |

Don't put server data in Zustand. Don't put UI preferences in TanStack Query.

## Zustand Conventions

Stores live in `src/store/<name>.store.ts` and export a single `useXStore` hook. Use `persist` middleware for anything that should survive a page refresh (e.g., UI preferences). Omit it for session-only state.

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MyState {
  value: string;
  setValue: (v: string) => void;
}

export const useMyStore = create<MyState>()(
  persist(
    (set) => ({
      value: 'default',
      setValue: (value) => set({ value }),
    }),
    { name: 'nexdash-<store-name>' } // localStorage key — must be unique
  )
);
```

## Existing Stores

| Store | Key | Persisted | Contents |
|---|---|---|---|
| `useUIStore` | `nexdash-ui` | Yes | `sidebarCollapsed`, `accent` |
| `useUserStore` | — | No | Current logged-in user |
