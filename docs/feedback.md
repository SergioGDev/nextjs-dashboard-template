# Feedback

Componentes de estado y retroalimentación visual.

---

## Pattern of use

Every component that consumes a `useQuery` hook manages its three states locally in this order: **loading → error → empty → success**. Never centralize state at the page level for independent data slots (if one section fails, the others remain useful).

```tsx
function MyDataSection() {
  const { data, isLoading, isError, error, refetch } = useSomeQuery();

  if (isLoading) return <SomeTypedSkeleton />;

  if (isError) {
    return (
      <ErrorState
        title="Couldn't load data"
        description="Try again in a moment."
        onRetry={() => refetch()}
        error={error}
      />
    );
  }

  if (!data?.length) {
    return <EmptyState variant="default" title="Nothing here yet" />;
  }

  return <ActualContent data={data} />;
}
```

**Exception**: when multiple UI slots share a single query (e.g. 4 KPI cards from `useDashboardKPIs`), show one error state that covers all affected slots — not one per slot.

### Slot mapping

| Slot type | Skeleton | Error variant | Empty |
|---|---|---|---|
| KPI card | `KpiCardSkeleton` (or `KPICard loading`) | `compact` inside card | n/a (0 is a valid value) |
| Chart | `ChartSkeleton type="area\|bar\|line\|donut"` | `default` | `default` "No data for this period" |
| Table | `TableSkeleton rows={n} columns={n}` | `default` | DataTable's built-in `emptyMessage` |
| List / feed | `ListSkeleton` | `default` | `default` "No items yet" |
| Form | `FormSkeleton` | `default` | n/a |
| User card | `UserCardSkeleton` | `default` | `default` |

### Empty state variants by context

| Context | Variant | Suggested CTA |
|---|---|---|
| Table with active filters | `search` | secondaryAction "Clear filters" |
| Table with no data | `default` | none |
| Chart with no data | `default` | none or "Reset to last 30d" |
| Feed with no events | `default` | none |

### Accessibility

- **Skeletons**: root container has `aria-busy="true"` and `aria-label="Loading …"`.
- **ErrorState**: root has `role="alert"` (implicit `aria-live="assertive"`).
- **EmptyState**: root has `role="status"` (implicit `aria-live="polite"`).

---

## Mutations and toasts

Every mutation must have visible feedback. Toasts are the standard mechanism.

### Toast location rule

**Toasts always live in the component that triggers the mutation, never inside the hook.**
This allows different call-sites to use different messages.

```tsx
// ✗ Never — toast inside the hook
function useDeleteUser() {
  return useMutation({
    mutationFn: handler.deleteUser,
    onSuccess: () => toast.success('User deleted'), // ← wrong
  });
}

// ✓ Always — toast in the component
function UserActions({ user }: { user: User }) {
  const deleteUser = useDeleteUser();
  function handleDelete() {
    deleteUser.mutate(user.id, {
      onSuccess: () => toast.success('User deleted'),
      onError:   () => toast.error('Failed to delete user'),
    });
  }
  return <Button onClick={handleDelete}>Delete</Button>;
}
```

### Toast messages

Success messages use the **past tense**, short and specific:
- ✓ `"User created"`, `"User updated"`, `"User deleted"`, `"Report sent"`
- ✗ `"User has been successfully created"` (verbose)
- ✗ `"Success!"` (not informative)

If there's additional context, use `description`:
```ts
toast.success('User created', { description: 'An invitation email has been sent.' });
```

Error messages use `"Failed to <action>"` when the API gives no useful message:
```ts
toast.error('Failed to update user');
// With API error message:
toast.error(error.message);
// Network error:
toast.error('Connection error', { description: 'Check your internet and try again.' });
```

### Async pattern with try/catch

When using `mutateAsync`, wrap in try/catch to keep the dialog or form open on error:

```tsx
async function handleCreate(values: UserFormValues) {
  try {
    await createUser.mutateAsync(values);
    setShowDialog(false);        // close only on success
    toast.success('User created');
  } catch {
    toast.error('Failed to create user'); // form stays open — user can retry
  }
}
```

When using `mutate` (fire-and-forget), pass callbacks:

```tsx
deleteUser.mutate(id, {
  onSuccess: () => { toast.success('User deleted'); setDeleteTarget(null); },
  onError:   () => { toast.error('Failed to delete user'); setDeleteTarget(null); },
});
```

### Confirmation dialogs before destructive actions

Delete, bulk operations, and irreversible actions require a confirmation dialog before
executing the mutation. Use `Dialog` from `@components/ui/dialog`:

```tsx
const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

// In the render:
<Dialog
  open={deleteTarget !== null}
  onClose={() => setDeleteTarget(null)}
  title="Delete user?"
  description={`"${deleteTarget?.name}" will be permanently deleted.`}
>
  <div className="flex justify-end gap-2 pt-2">
    <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
    <Button
      variant="destructive"
      loading={deleteUser.isPending}
      onClick={() => deleteUser.mutate(deleteTarget!.id, {
        onSuccess: () => { toast.success('User deleted'); setDeleteTarget(null); },
        onError:   () => { toast.error('Failed to delete user'); setDeleteTarget(null); },
      })}
    >
      Delete
    </Button>
  </div>
</Dialog>
```

### Simulated async actions (mock/demo)

For actions without a real backend (e.g. report downloads in demo mode), use sequential
toasts with a timeout to simulate async behavior:

```ts
function handleDownload(report: Report) {
  toast.info(`Preparing "${report.name}"…`);
  setTimeout(() => toast.success(`"${report.name}" is ready`), 1500);
}
```

### Validation errors

Form validation errors (react-hook-form + Zod) are shown **inline** in the form fields,
not as toasts. Toasts only handle server/API errors.

---

## Empty states

`EmptyState` — contenedor vacío con ilustración, título, descripción y acciones opcionales.

```tsx
import { EmptyState } from '@components/feedback/empty-state';

// Variante básica
<EmptyState variant="default" title="No items yet" />

// Con descripción + acción
<EmptyState
  variant="search"
  title="No results found"
  description="Try adjusting your search or filters."
  action={<Button>Clear filters</Button>}
/>

// Icono personalizado
<EmptyState
  icon={<MyIcon />}
  title="Drop files here"
  description="Drag and drop or click to browse."
/>
```

### Variantes

| Variante | Ilustración | Caso de uso |
|---|---|---|
| `default` | Documento + bandeja | Lista vacía genérica |
| `search` | Lupa | Sin resultados de búsqueda |
| `error` | Triángulo de advertencia | Fallo al cargar datos |

### Ilustraciones independientes

```ts
import { EmptyDefault, EmptySearch, EmptyError } from '@components/feedback/empty-state';
```

Usan CSS custom properties (`var(--accent)`, `var(--warning)`, etc.) — funcionan en light y dark mode.

### Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | `string` | — | **Required.** Texto principal. |
| `variant` | `"default" \| "search" \| "error"` | `"default"` | Ilustración predefinida. |
| `description` | `string` | — | Texto secundario. |
| `icon` | `React.ReactNode` | — | Ilustración personalizada. Sobreescribe `variant`. |
| `action` | `React.ReactNode` | — | CTA principal (Button). |
| `secondaryAction` | `React.ReactNode` | — | CTA secundario. |
| `className` | `string` | — | Clases adicionales. |

---

## Error states

`ErrorState` — reemplaza el contenido de una sección cuando hay un error de carga.

```tsx
import { ErrorState } from '@components/feedback/error-state';

// Minimal
<ErrorState />

// Con retry
<ErrorState onRetry={() => refetch()} />

// Compacto (inline)
<ErrorState size="compact" title="Failed to load users" onRetry={() => refetch()} />

// Con detalle técnico (solo en desarrollo)
<ErrorState title="Couldn't load chart" onRetry={() => refetch()} error={error} />
```

### Tamaños

- `default` — layout centrado vertical con icono, título, descripción y botón retry.
- `compact` — una sola línea horizontal (icono + texto truncado + botón retry pequeño). Para filas de tabla, items de lista, paneles pequeños.

### Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | `string` | `"Couldn't load data"` | Mensaje de error. |
| `description` | `string` | `"Something went wrong…"` | Descripción de apoyo. |
| `onRetry` | `() => void` | — | Si se provee, muestra botón de retry. |
| `error` | `Error` | — | Expone detalles técnicos en dev mode. |
| `size` | `"default" \| "compact"` | `"default"` | Tamaño del componente. |
| `className` | `string` | — | Clases adicionales. |

### Error de ruta (Next.js error.tsx)

Los `error.tsx` de Next.js reciben `{ error, reset }`. Para recuperación de navegación usar `EmptyState variant="error"` + `useRouter`:

```tsx
// src/app/(dashboard)/error.tsx
'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui/button';
import { EmptyState } from '@components/feedback/empty-state';
import { routes } from '@config/routes';

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <EmptyState
      variant="error"
      title="Something went wrong"
      action={<Button onClick={reset}>Try again</Button>}
      secondaryAction={
        <Button variant="secondary" onClick={() => router.push(routes.dashboard)}>Go home</Button>
      }
    />
  );
}
```

### Error global (global-error.tsx)

`src/app/global-error.tsx` debe ser `'use client'` y renderizar `<html><body>`. **Sin dependencias del design system** — usa inline styles, ya que los CSS custom properties no estarán disponibles en un fallo crítico de React.

---

## Skeletons

Placeholders animados para estados de carga. Reducen el CLS (Cumulative Layout Shift) al coincidir con las dimensiones del componente real.

```tsx
import {
  SkeletonBase,
  TableSkeleton,
  KpiCardSkeleton,
  ChartSkeleton,
  ListSkeleton,
  FormSkeleton,
  UserCardSkeleton,
} from '@components/feedback/skeleton';
```

### Componentes

| Componente | Reemplaza | Props clave |
|---|---|---|
| `SkeletonBase` | Cualquier primitiva | `variant`, `width`, `height` |
| `KpiCardSkeleton` | `KpiCard` | `className` |
| `ChartSkeleton` | Gráficos Recharts | `type`, `height` |
| `TableSkeleton` | DataTable | `rows`, `columns`, `showHeader` |
| `ListSkeleton` | ActivityFeed | `items`, `showAvatar`, `showSecondary` |
| `FormSkeleton` | Formularios | `fields`, `showButton` |
| `UserCardSkeleton` | Filas de usuario | `className` |

### SkeletonBase — variantes

| Variante | Dimensiones por defecto | Clase |
|---|---|---|
| `text` | 100% × 13px | `rounded-full` |
| `title` | 60% × 20px | `rounded-full` |
| `avatar` | 32px × 32px | `rounded-full` |
| `btn` | 80px × 34px | `rounded-md` |
| `card` | 100% × 120px | `rounded-xl` |

### ChartSkeleton — tipos

| Tipo | Representación |
|---|---|
| `bar` | Barras verticales con alturas variables |
| `area` | Barras con opacidad reducida (efecto área) |
| `line` | Puntos conectados de altura variable |
| `donut` | Círculo con borde grueso + valor central |

### Regla CLS

Los skeletons deben tener **exactamente la misma altura y padding** que el componente real. Si el componente real tiene `p-5` y el contenido mide ~100px, el skeleton debe ocupar ~140px totales. Probar con el toggle "skeleton vs real" en `/ui/skeletons`.

---

## Toast System

## API de uso

```ts
import { toast } from '@components/feedback/toast';

toast.success('Guardado');
toast.error('Error al guardar', { description: 'Inténtalo de nuevo.' });
toast.warning('Sesión por expirar');
toast.info('Nueva versión disponible');

// Persistente (no se cierra solo)
toast.success('Proceso completado', { duration: 0 });

// Duración personalizada (ms)
toast.info('Mensaje breve', { duration: 2000 });

// Cerrar un toast por id (avanzado)
toast.dismiss(id);

// Limpiar todos
toast.clear();
```

`toast` es un singleton — funciona fuera de componentes React (handlers, callbacks, etc.).

## Duraciones por defecto

| Variante | Duración |
|---|---|
| `success` | 4 s |
| `info` | 4 s |
| `warning` | 5 s |
| `error` | 6 s |

Configurado en `src/config/constants.ts` → `TOAST.DURATION`.

## Cola y límite

- Máximo **5 toasts** visibles simultáneamente (`TOAST.MAX_VISIBLE`).
- Al añadir el sexto, el más antiguo desaparece (FIFO via `slice(-MAX_VISIBLE)`).

## Hook (cuando necesitas el array de toasts)

```ts
import { useToast } from '@components/feedback/toast';

function MyComponent() {
  const { toast, toasts } = useToast();
  // toasts: ToastItem[] — solo para casos avanzados (contador de notifs, etc.)
}
```

## Animaciones

- **Entrada**: `nx-toast-in` — slide desde la derecha, 200ms (`--dur-base`).
- **Salida**: `nx-toast-out` — slide hacia la derecha + colapso de altura, 300ms.

El timing de salida debe coincidir con `TOAST.EXIT_DURATION_MS = 300`.

## Hover-pause

Al hacer hover sobre un toast, el timer se pausa. Al quitar el cursor, el timer se reinicia con la duración original completa.

## Estructura de archivos

```
src/components/feedback/toast/
  toast.types.ts   — ToastItem, ToastVariant, ToastOptions
  toast.store.ts   — Zustand store (add, remove, clear)
  toast.api.ts     — Singleton: toast.success/error/warning/info/dismiss/clear
  toast.tsx        — Componente individual (icono, border-left, timer)
  toaster.tsx      — Portal a document.body, gestiona exitingIds
  use-toast.ts     — Hook: { toasts, toast }
  index.ts         — Barrel público
```

## Extensión

### Añadir una acción en el toast

```tsx
export interface ToastOptions {
  description?: string;
  duration?: number;
  action?: { label: string; onClick: () => void }; // añadir al tipo
}
```

En `toast.tsx`, añadir debajo de la descripción:

```tsx
{item.action && (
  <button onClick={item.action.onClick} className="...">
    {item.action.label}
  </button>
)}
```

### Cambiar posición

En `toaster.tsx`, cambiar las clases del contenedor:
- Bottom-right: `bottom-4 right-4`
- Top-right: `top-4 right-4`
- Bottom-center: `bottom-4 left-1/2 -translate-x-1/2`

### Añadir progress bar

Añadir un `<div>` con animación de `width: 100% → 0%` en `duration` ms al final del inner container.

## Contrato del barrel

```ts
import { toast, useToast, Toaster } from '@components/feedback/toast';
import type { ToastVariant, ToastItem, ToastOptions } from '@components/feedback/toast';
```

`Toaster` ya está registrado en `src/app/providers.tsx` — no necesita montarse manualmente.
