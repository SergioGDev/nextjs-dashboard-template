# Components — Documentar un componente nuevo

## Cuándo crear una página en /ui

Cuando creas un componente nuevo que forma parte del design system (algo que
más de una página o feature va a consumir), crea su página de referencia en
`/ui/{categoria}/{nombre}`.

Categorías actuales:
- `feedback/` — Toasts, dialogs, tooltips, alerts
- `inputs/` — Buttons, inputs, selects, checkboxes
- `display/` — Cards, badges, avatars
- `data/` — Tables, filters, pagination
- `charts/` — Area, bar, line, donut
- `layout/` — Sidebar, topbar, grids
- `foundations/` — Colors, typography, spacing, icons

## Pasos para añadir una nueva página

1. **Crear la página**: `src/app/(dashboard)/ui/{categoria}/{nombre}/page.tsx`

2. **Registrar la ruta** en `src/config/routes.ts`:
   ```ts
   ui: {
     ...existing,
     myComponent: '/ui/categoria/my-component',
   }
   ```

3. **Activar el ítem** en `src/features/ui-showcase/components/ui-subnav.tsx`:
   Cambiar `disabled: true` → eliminar o poner `disabled: false`.

4. **Actualizar el overview** en `src/app/(dashboard)/ui/page.tsx`:
   Incrementar el `count` de la categoría correspondiente.

5. **Añadir labels de breadcrumb** en `src/components/layout/breadcrumbs.tsx`
   si el segmento de URL no es obvio.

## Estructura estándar de una página de showcase

```tsx
'use client'; // si tiene demos interactivos

import { ShowcaseSection, ShowcaseDemo, ShowcaseGrid, PropsTable } from '@features/ui-showcase';
import type { PropDoc } from '@features/ui-showcase';
import { Button } from '@components/ui/button';

const PROPS: PropDoc[] = [
  { prop: 'variant', type: "'default' | 'secondary'", default: "'default'", description: '...' },
  { prop: 'onClick', type: '() => void', description: '...', required: true },
];

export default function MyComponentPage() {
  return (
    <div className="space-y-12">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
          My Component
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)] ...">Descripción 1-2 líneas.</p>
        <div className="mt-4 rounded-lg border ...">
          <pre><code>import { MyComponent } from '@components/ui/my-component';</code></pre>
        </div>
      </div>

      {/* 2. Variants */}
      <ShowcaseSection title="Variants">
        <ShowcaseGrid columns={2}>
          <ShowcaseDemo title="Default" code={`<MyComponent />`}>
            <MyComponent />
          </ShowcaseDemo>
        </ShowcaseGrid>
      </ShowcaseSection>

      {/* 3. Props API */}
      <ShowcaseSection title="API">
        <PropsTable rows={PROPS} />
      </ShowcaseSection>
    </div>
  );
}
```

## Componentes de ui-showcase disponibles

| Componente | Uso |
|---|---|
| `ShowcaseSection` | Agrupa demos bajo un título y separador. Props: `title`, `description?`, `children` |
| `ShowcaseDemo` | Una demo individual con preview + código copiable. Props: `title`, `description?`, `code`, `children`, `align?` |
| `ShowcaseGrid` | Rejilla de variantes. Props: `columns` (1\|2\|3, default 2), `children` |
| `PropsTable` | Tabla Prop/Type/Default/Required/Description. Props: `rows: PropDoc[]` |

Todos se importan desde `@features/ui-showcase`.

## Referencia: página de Toasts

`src/app/(dashboard)/ui/toasts/page.tsx` es el patrón de referencia más
completo. Incluye: variantes, with-description, with-action, estado persistente,
overflow demo, tabla de API y tabla de métodos.
