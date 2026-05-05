## Sidebar — Reglas

### Para añadir un ítem al sidebar

**Siempre editar `src/components/layout/sidebar/sidebar.config.ts`**. Nunca hardcodear ítems directamente en los componentes.

```ts
// Añadir un link directo
{ type: 'link', label: 'Proyectos', href: routes.projects.list, icon: FolderOpen }

// Añadir un grupo colapsable
{
  type: 'group',
  label: 'Proyectos',
  icon: FolderOpen,
  children: [
    { type: 'link', label: 'Todos', href: routes.projects.list },
    { type: 'link', label: 'Archivados', href: routes.projects.archived },
  ],
}
```

### Mezcla de links y grupos en una sección

Una sección puede contener cualquier combinación de links directos y grupos colapsables:

```ts
{
  id: 'ui',
  title: 'UI',
  items: [
    { type: 'link', label: 'Overview', href: routes.ui.overview, icon: Sparkles },
    { type: 'group', label: 'Components', icon: Layers, children: [...] },
    { type: 'group', label: 'Layout', icon: PanelLeft, children: [...] },
  ],
}
```

Usar grupos cuando hay 2+ ítems relacionados que se beneficien de una jerarquía visual. Un link suelto al inicio de la sección es el patrón para una landing o overview.

### Sub-items: línea guía vertical

Los sub-items de un grupo expandido se muestran con una **línea vertical guía** continua a la izquierda. No usar puntos, bullets ni markers tipográficos.

- La línea está implementada como `border-l border-[var(--border-strong)]` en el contenedor de hijos (`sidebar-group.tsx`)
- Alineada con el centro del icono del grupo padre (`ml-[22px]`)
- El color es `var(--border-strong)` — nunca `var(--accent)`, nunca hardcodeado
- En modo colapsado (popover), los sub-items no tienen línea guía

### Profundidad máxima

**2 niveles** (Sección → Grupo → Links). Los grupos no pueden contener otros grupos.

Si un grupo tiene más de 6–7 hijos, considerar moverlo a su propia página con `UiSubnav` como navegación secundaria.

### Sidebar sections vs UiSubnav

**Preferir secciones del sidebar principal** para ítems de navegación primaria. Las secciones organizan verticalmente el sidebar sin coste de espacio adicional y son consistentes con el modelo de datos existente.

**Usar `UiSubnav`** solo cuando la sección es secundaria o de admin, y añadirla al sidebar principal distraería de la navegación del producto. `UiSubnav` vive en `src/features/ui-showcase/components/ui-subnav.tsx` y se renderiza como panel lateral dentro del layout de la página.

```tsx
// En un layout de sección secundaria
import { UiSubnav } from '@features/ui-showcase';

export default function SectionLayout({ children }) {
  return (
    <div className="flex -m-6 min-h-[calc(100vh-56px)]">
      <aside className="w-52 shrink-0 border-r border-[var(--border)]">
        <UiSubnav />
      </aside>
      <div className="flex-1 min-w-0 p-8">{children}</div>
    </div>
  );
}
```

### Persistencia de grupos

Los grupos abiertos se guardan en `sidebar.store.ts` (localStorage key: `nexdash-sidebar`). La lógica vive en `use-expanded-groups.ts`.

**Comportamiento**: navegar a una ruta dentro de un grupo lo auto-expande (guardando en el store). Cerrar manualmente lo elimina del store. Volver a navegar a esa ruta lo re-expande.

### Badges y counts

```ts
{ type: 'link', label: 'Inbox', href: routes.inbox, count: 12 }
{ type: 'link', label: 'Nueva', href: routes.feature, badge: { label: 'Beta', variant: 'warning' } }
```

Variantes de badge: `accent` | `success` | `warning` | `error` | `info` | `neutral`.

### Modo colapsado

Cuando el sidebar está en modo icon-only (`w-16`):
- Links → tooltip derecha al hover
- Grupos → `SidebarPopover` (portalled, aparece a la derecha del sidebar)

El popover es navegable con teclado. Escape lo cierra.

### Añadir una ruta nueva al grupo Reports (o cualquier grupo existente)

1. Añadir la ruta en `src/config/routes.ts`
2. Crear la página en `src/app/(dashboard)/[ruta]/page.tsx`
3. Añadir la label en `src/components/layout/breadcrumbs.tsx` (routeLabels)
4. Añadir la label en `src/components/layout/topbar.tsx` (pageTitles) si necesita título en la topbar
5. Añadir el child en `sidebar.config.ts`
