## Standard pattern for data-fetching components

Every component (or page section) that calls `useQuery` must handle three states locally:

```tsx
if (isLoading) return <TypedSkeleton />;
if (isError) return <ErrorState onRetry={() => refetch()} error={error} />;
if (!data?.length) return <EmptyState ... />;
return <Content data={data} />;
```

Rules:
- **Never use text "Loading…"** — always use the typed skeleton that matches the real component's dimensions.
- **Never leave `isError` unhandled** — silent failures produce blank sections with no user feedback.
- **Match skeleton dimensions** to the real component exactly to prevent CLS.
- When multiple UI slots share one query, show one error state covering all slots — not one per slot.
- `DataTable` renders its own "no data" message for empty arrays — no `EmptyState` needed unless the table is outside `DataTable`.

See `docs/feedback.md#pattern-of-use` for the full slot mapping table.

---

## Mutations and toasts

- **Every mutation must have visible feedback**: `toast.success` on success, `toast.error` on error.
- **Toast lives in the component, never in the hook** — so different call-sites can show different messages.
- **Destructive actions require confirmation** — show a `Dialog` with title, description, and Cancel/Confirm buttons before mutating.
- **Validation errors go inline** (react-hook-form / Zod), not as toasts. Toasts only for server/API errors.
- **Auth errors (login) go inline** — toast would disappear before the user retries; the inline message must persist.
- **Synchronous state changes** (theme toggle, accent picker, localStorage) don't need toasts — the visual change is immediate feedback.
- Use `mutateAsync` + try/catch when you need to close a dialog only on success (keep dialog open on error so user can retry).
- Use `mutate(id, { onSuccess, onError })` callbacks for fire-and-forget patterns.
- **`onSuccess` receives the mutation result** — use it for personalized messages: `onSuccess: (session) => toast.success(\`Welcome back, ${session.user.name}!\`)`.
- **Toasts survive client-side navigation** — `Toaster` is at root layout level (providers.tsx), so firing a toast before `router.push()` works correctly.

```tsx
// Async — dialog stays open on error
async function handleCreate(values: UserFormValues) {
  try {
    await createUser.mutateAsync(values);
    setOpen(false);
    toast.success('User created');
  } catch {
    toast.error('Failed to create user');
  }
}

// Fire-and-forget — toast from callbacks
deleteUser.mutate(id, {
  onSuccess: () => { toast.success('User deleted'); setDeleteTarget(null); },
  onError:   () => { toast.error('Failed to delete user'); setDeleteTarget(null); },
});
```

See `docs/feedback.md#mutations-and-toasts` for the full pattern reference.

---

## Empty states

`EmptyState` lives in `src/components/feedback/empty-state/`. Import via barrel.

```ts
import { EmptyState } from '@components/feedback/empty-state';
```

**Three variants**: `default` (document tray), `search` (magnifying glass), `error` (warning triangle). Override with `icon` prop for a custom illustration.

**Illustrations** use CSS custom properties (`var(--accent)`, `var(--warning)`, etc.) — they adapt automatically to all accent themes and dark/light mode. Never hardcode colors in illustrations.

**For route-level errors** (`error.tsx`): use `EmptyState variant="error"` paired with `useRouter` for navigation recovery. `ErrorState` is for inline section errors, not full-page route errors.

---

## Error states

`ErrorState` lives in `src/components/feedback/error-state/`. Import via barrel.

```ts
import { ErrorState } from '@components/feedback/error-state';
```

**Two sizes**: `default` (centered layout, for sections) and `compact` (inline single-line, for table rows / list items).

**Dev details**: pass `error={error}` to show a `<details>` block with the error message. This is automatically hidden in production (`process.env.NODE_ENV !== 'production'`).

**`global-error.tsx`**: must be `'use client'`, render `<html><body>`, and use **zero design system dependencies** — inline styles only. CSS custom properties won't be available in a critical React failure.

---

## Skeletons

All skeletons live in `src/components/feedback/skeleton/`. Import via barrel.

```ts
import { TableSkeleton, KpiCardSkeleton, ChartSkeleton } from '@components/feedback/skeleton';
```

**Available**: `SkeletonBase`, `KpiCardSkeleton`, `ChartSkeleton`, `TableSkeleton`, `ListSkeleton`, `FormSkeleton`, `UserCardSkeleton`.

**CLS rule**: skeleton dimensions must exactly match the real component. Use the toggle in `/ui/skeletons` to verify visually.

**`loading.tsx` files** must use typed skeletons that match the page layout — never raw `<Skeleton className="h-N rounded-xl" />` blobs. Structure the loading.tsx to mirror the real page grid: `KpiCardSkeleton` for KPI cards, `ChartSkeleton` for charts, `TableSkeleton` for tables.

**Adding a new typed skeleton**: create in `src/components/feedback/skeleton/`, export from `index.ts`, add a showcase demo in `/ui/skeletons/page.tsx`.

---

## Toast system

Toast API lives in `src/components/feedback/toast/`. `Toaster` is mounted in `providers.tsx`.

**Calling toasts:**
```ts
import { toast } from '@components/feedback/toast';
toast.success('Done');
toast.error('Failed', { description: 'Try again.' });
```

Singleton — works outside React components (in handlers, event callbacks, etc.).

**Not needed**: importing `Toaster` anywhere else, calling `useToast()` just to trigger a toast.

**Duration defaults** (`TOAST.DURATION` in `constants.ts`): success/info = 4s, warning = 5s, error = 6s. `duration: 0` = persistent.

**Exit animation timing** (`TOAST.EXIT_DURATION_MS = 300`) must match the `nx-toast-out` keyframe duration in `components.css`. Change both together.

**React Compiler / lint**: Do NOT set `ref.current` in render body (triggers `react-hooks/refs` error). Use `useCallback` with proper deps instead of the ref-sync pattern.

**Extending**: See `docs/feedback.md` for adding actions, changing position, progress bars.
