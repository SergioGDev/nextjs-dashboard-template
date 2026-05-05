# B6 — Component Catalog Audit

Generated on 2026-05-04. Auditoría previa al bloque B6 (Completar UI Showcase). Solo lectura del repo: ningún cambio de código de producción.

## Summary

- **Total React components / patterns found in the repo**: 32 (sin contar showcase utilities, providers, ni form compositions)
- **Catalog entries in target B6 catalog**: 59
- **Already exist + already documented in /ui**: 5 (Toasts, Empty states, Error states, Skeletons, Sidebar)
- **Already exist + need showcase page**: 22
- **Need to be built from scratch**: 32 (foundations + missing primitives)
- **Components found but NOT in target catalog**: 7 (ThemeToggle, LanguageSwitcher, ActivityFeed, LoginForm, SettingsForm, UserForm, SessionProvider — además de las 5 utilities `ShowcaseSection/Demo/Grid/PropsTable/UiSubnav` que son meta-herramientas)

Nota metodológica: los counts de "já documentado en /ui" cuentan solo páginas dedicadas en `/ui/*`. La página `/ui/i18n` se cuenta aparte porque documenta el patrón de localización, no un componente concreto.

## Matrix by category

### Foundations

Tokens existen en `src/styles/tokens.css` y `src/app/globals.css`, pero ninguno tiene página de showcase. Todo TO BUILD.

| Component | Status | Notes |
|-----------|--------|-------|
| Colors | TO BUILD | Tokens (`--background/surface/surface-raised/border/text-*/accent/success/warning/error/info`) y 6 accent palettes definidos en `tokens.css`. Necesita página que renderice swatches + nombres. |
| Typography | TO BUILD | Escala (`--fs-xs/sm/base/lg/xl/2xl/3xl`), pesos (`--fw-regular/medium/semibold/bold`), letter-spacing (`--tracking-*`). Renderizar specimen. |
| Spacing | TO BUILD | Escala 4px-base (`--space-0…16`). Renderizar como bandas/cuadrados con label. |
| Border radius | TO BUILD | `--radius-sm/md/lg/xl/full`. Renderizar 5 cuadrados de muestra. |
| Shadows | TO BUILD | `--shadow-card`, `--shadow-pop` (distintos por theme). Renderizar tarjetas de muestra. |
| Motion | TO BUILD | `--ease-out`, `--dur-fast` (120ms), `--dur-base` (180ms). Más animaciones existentes (`nx-toast-in/out`, `nx-popover-in`, `nx-sidebar-collapse`). Renderizar demos interactivas. |
| Icons | TO BUILD | `lucide-react` ya en uso (~50 imports distintos). Página con grid de iconos comunes y guía de uso. |

### Inputs básicos

| Component | Path | Status | Showcase | Used in | Notes |
|-----------|------|--------|----------|---------|-------|
| Button | `components/ui/button.tsx` | EXISTS | NO | 20 files | 6 variants × 4 sizes + `loading`. API estable, listo para documentar. |
| Icon button | `components/ui/button.tsx` (size="icon") | EXISTS | NO | derivado del anterior | Ya soportado vía `size="icon"` (h-9 w-9 p-0). Documentar como variant del Button, no como componente separado. |
| Buttons group (segmented) | — | TO BUILD | NO | — | Componente nuevo. Pattern: ButtonGroup/SegmentedControl con value controlado, items[]. |
| Input | `components/ui/input.tsx` | EXISTS | NO | 5 files | `label`, `error`, `leftIcon`, `rightIcon`. Sin variants; tamaño único (h-9). |
| Textarea | `components/ui/textarea.tsx` | EXISTS | NO | 1 file (settings-form) | `label`, `error`. Sin `rows` prop explícito (usa `min-h-20 resize-y`). |
| Search input (variant) | `components/ui/input.tsx` (con leftIcon=Search) | EXISTS_PARTIAL | NO | usado inline en `topbar.tsx` | Documentar como pattern: `<Input leftIcon={<Search/>} placeholder="..." />`. No requiere componente nuevo. |
| Field wrapper (label + help + error) | — / clases CSS `nx-field`/`nx-label`/`nx-help` | TO BUILD | NO | — | Patrón actual: cada input renderiza su propio label/error inline. Decidir en B6 si extraer `FieldWrapper` o mantener pattern actual. CSS existe pero sin React component. |

### Inputs avanzados

| Component | Path | Status | Showcase | Used in | Notes |
|-----------|------|--------|----------|---------|-------|
| Select | `components/ui/select.tsx` | EXISTS | NO | 2 files (user-form) | Native `<select>` con chevron decorativo. Sin búsqueda, sin multi-select, sin option icons. Documentar como "nativo intencional" o decidir si construir Select avanzado. |
| Checkbox | `components/ui/checkbox.tsx` | EXISTS_UNUSED | NO | 0 files | `label`, `description`. Visual completo con check de lucide; nunca usado en producción todavía. |
| Switch | `components/ui/switch.tsx` | EXISTS_UNUSED | NO | 0 files | `label`, `description`. Pattern thumb sliding. Sin uso real todavía. |
| Radio group | — | TO BUILD | NO | — | Componente nuevo. Pattern: RadioGroup/RadioItem con `value`/`onChange`. |
| Slider | — | TO BUILD | NO | — | Componente nuevo. Single + range. |
| Date picker | — | TO BUILD | NO | — | HIGH complexity. Decisiones: ¿librería externa (react-day-picker) o custom? ¿Range support? |
| Time picker | — | TO BUILD | NO | — | Complementario a date picker. Considerar combinar en DateTimePicker. |
| File upload | — | TO BUILD | NO | — | Botón "Choose file" + lista de archivos. |
| Dropzone | — | TO BUILD | NO | — | Drag-and-drop area. Puede compartir hook con File upload. |

### Display

| Component | Path | Status | Showcase | Used in | Notes |
|-----------|------|--------|----------|---------|-------|
| Card | `components/ui/card.tsx` | EXISTS_PARTIAL | NO | 9 files | Card + CardHeader/Title/Description/Content/Footer. **Falta**: prop `variant?: 'default' \| 'raised' \| 'interactive'` (las clases CSS `nx-card--raised`/`--interactive` existen pero el componente React no las expone). |
| Badge | `components/ui/badge.tsx` | EXISTS | NO | 5 files | 6 variants (`default/success/warning/error/info/muted`). Listo para documentar. |
| Tag / Chip | — | TO BUILD | NO | — | Decidir si Badge cubre el caso o se introduce Chip distinto (con `onRemove`, leading icon, etc.). |
| Avatar | `components/ui/avatar.tsx` | EXISTS | NO | 5 files | 5 sizes (xs/sm/md/lg/xl), `src`/`alt`/`fallback`. Usa `<img>` (warn de lint pre-existente). **Deuda**: usa `useState` sin `'use client'` directive — funciona porque siempre se consume desde client components, pero es frágil. |
| Divider / Separator | `components/ui/separator.tsx` | EXISTS | NO | 1 file (settings) | Orientation horizontal/vertical. |
| Kbd | clase CSS `.nx-kbd` | TO BUILD | NO | — | Solo CSS class; sin React component. |
| Links | `Button variant="link"` | EXISTS_PARTIAL | NO | derivado | Button cubre el patrón de "link button". Decidir si añadir Link distinto para anchors estilizados sin role=button. |
| List | — | TO BUILD | NO | — | Lista estilizada (with bullets, ordered, definition). Pattern de design system. |
| Skeleton primitive | `components/ui/skeleton.tsx` | EXISTS | PARCIAL | 14 files | Primitivo `animate-pulse rounded-md`. Aparece mencionado en `/ui/skeletons` pero la página documenta los typed skeletons (en `feedback/skeleton/`). Conviene una sub-sección "Skeleton primitive" en esa página o página propia. |

### Feedback

| Component | Path | Status | Showcase | Used in | Notes |
|-----------|------|--------|----------|---------|-------|
| Toasts | `components/feedback/toast/` | EXISTS | YES (`/ui/toasts`) | 22 files (incluyendo `toast.success` calls) | Documentación completa. |
| Empty states | `components/feedback/empty-state/` | EXISTS | YES (`/ui/empty-states`) | 19 files | Documentación completa. |
| Error states | `components/feedback/error-state/` | EXISTS | YES (`/ui/error-states`) | 11 files | Documentación completa. |
| Skeletons (typed) | `components/feedback/skeleton/` | EXISTS | YES (`/ui/skeletons`) | 14 files | 7 typed skeletons documentados (KpiCard/Chart/Table/List/Form/UserCard/SkeletonBase). |
| Dialog | `components/ui/dialog.tsx` | EXISTS | NO | 1 file (users) | `open/onClose/title/description`. No tiene variants ni size prop. Funcional pero austero. |
| Tooltip | `components/ui/tooltip.tsx` | EXISTS | NO | 3 files | `content`, `side` (top/bottom/left/right). Render absoluto sin portal — limitado en contenedores con overflow. |
| Dropdown menu | `components/ui/dropdown-menu.tsx` | EXISTS | NO | 2 files (topbar, lang-switcher) | DropdownMenu + Item + Separator + Label. **Falta**: keyboard nav (arrow up/down, focus trap). Documentar limitación o ampliar. |
| Popover (genérico) | — (existe `SidebarPopover` feature-specific) | TO BUILD | NO | — | `SidebarPopover` usa `createPortal` y aria-haspopup. Extraer Popover genérico que sirva de base para Tooltip+, Dropdown+, etc. |
| Alert / Notification | — (banner inline en `login-form.tsx`) | TO BUILD | NO | — | El banner del login (rojo con AlertCircle) podría extraerse como `<Alert variant="error">`. |
| Progress bar (lineal + circular) | — | TO BUILD | NO | — | Componente nuevo. Lineal + radial. |
| Spinner | inline `<svg className="animate-spin">` en Button | TO BUILD | NO | — | Existe inlineado en `Button` para `loading`. Extraer como `<Spinner size="sm/md/lg" />` reutilizable. |

### Data

| Component | Path | Status | Showcase | Used in | Notes |
|-----------|------|--------|----------|---------|-------|
| Data table | `components/ui/data-table.tsx` | EXISTS_PARTIAL | NO | 4 files | `columns`, `data`, `loading`, `pageSize`, `selectable`, `getRowId`, `emptyMessage`. **Limitaciones**: pagination embebida (no funciona con datos paginados externamente), selección interna (caller no puede leer ni controlar). Documentar como está y abrir tickets de mejora. |
| Pagination (independiente) | — (embebido en DataTable) | TO BUILD | NO | — | Extraer paginación de DataTable como componente standalone. |
| Filter bar (patrón) | — | TO BUILD | NO | — | Pattern, no componente único. Documentar combinación de Input(search) + Select(facets) + Button(reset). |
| Sortable column header | DataTable interno | EXISTS_PARTIAL | NO | DataTable | Pattern: `column.sortable: true` activa botón con icono. Documentar como prop de Column en DataTable. |
| Row selection | DataTable interno | EXISTS_PARTIAL | NO | DataTable | `selectable: true` añade checkboxes y `Set<string>` interno. Falta `onSelectionChange(ids[])` callback. |

### Charts

| Component | Path | Status | Showcase | Used in | Notes |
|-----------|------|--------|----------|---------|-------|
| Area chart | `components/charts/area-chart.tsx` | EXISTS | NO | 1 file (analytics) | `data`, `xKey`, `yKey`, `color`, `formatY`, `formatTooltip`, `height`. |
| Bar chart | `components/charts/bar-chart.tsx` | EXISTS | NO | 1 file | Misma API que Area. |
| Line chart | `components/charts/line-chart.tsx` | EXISTS | NO | 1 file | API distinta: `series: { key, color, label? }[]` (multi-line). Inconsistencia documentable. |
| Donut chart | `components/charts/donut-chart.tsx` | EXISTS | NO | 1 file | `data: { name, value, color }[]`, `innerRadius`, `outerRadius`. |
| Stat / KPI card | `features/dashboard/components/kpi-card.tsx` | EXISTS | NO | 2 files (dashboard, analytics) | **Vive en `features/dashboard/`** — genérico de uso pero reglas de arquitectura piden moverlo a `components/dashboard/` o `components/ui/` antes de documentarlo en `/ui`. |
| Sparkline | — | TO BUILD | NO | — | Opcional. Variante de LineChart sin axes/grid. |

### Layout

| Component | Path | Status | Showcase | Used in | Notes |
|-----------|------|--------|----------|---------|-------|
| Sidebar | `components/layout/sidebar/` | EXISTS | YES (`/ui/sidebar`) | 1 (layout) | Documentación completa con config + grupos colapsables + popover en modo collapsed. |
| Topbar | `components/layout/topbar.tsx` | EXISTS | NO | 1 (layout) | Composición: title + breadcrumbs + search + lang-switcher + bell + theme-toggle + user dropdown. Documentar como pattern compuesto. |
| Breadcrumbs | `components/layout/breadcrumbs.tsx` | EXISTS | NO | 1 (topbar) | Auto-generado desde pathname con maps `routeLabelKeys`/`uiGroupLabelKeys`. Documentar API + cómo extender labels. |
| Tabs | — | TO BUILD | NO | — | Componente nuevo. Pattern: TabList + TabTrigger + TabPanel con value controlado. |
| Page header | — | TO BUILD | NO | — | Pattern h1 + description + actions actualmente inline en cada page.tsx. Formalizar como `<PageHeader title=… description=… actions=… />`. |

## Existing components NOT in target catalog

| Component | Path | Recomendación | Razón |
|-----------|------|---------------|-------|
| ThemeToggle | `components/layout/theme-toggle.tsx` | **INCLUDE** (Layout / Theming) | Pequeño pero valioso. Documentar junto a Topbar o en sección "Theming utilities". |
| LanguageSwitcher | `components/i18n/language-switcher/` | **INCLUDE** (Layout / i18n) | Ya hay página `/ui/i18n` que cubre el patrón; añadir referencia explícita al componente y sus 2 variants (`compact`/`full`). |
| ActivityFeed | `features/dashboard/components/activity-feed.tsx` | **REVIEW** | Es feature-specific (icons hardcodeados por activity type). Si se generaliza (Feed con `renderItem` callback), encaja en Display. Si no, dejar fuera del catalog. |
| LoginForm | `components/forms/login-form.tsx` | **SKIP** | Composición concreta del feature auth, no primitiva. |
| SettingsForm | `components/forms/settings-form.tsx` | **SKIP** | Composición concreta del feature settings. |
| UserForm | `features/users/components/user-form.tsx` | **SKIP** | Composición concreta del feature users. |
| SessionProvider | `components/auth/session-provider.tsx` | **SKIP** | Provider de glue, no UI primitive. |
| ShowcaseSection / ShowcaseDemo / ShowcaseGrid / PropsTable / UiSubnav | `features/ui-showcase/` | **SKIP** (meta) | Herramientas de la propia documentación. |

## Components to BUILD (priority list)

Ordenados por (a) bloqueo a sub-bloques posteriores y (b) complejidad. La complejidad considera APIs públicas, accesibilidad y dependencias.

| # | Component | Category | Complexity | Notes |
|---|-----------|----------|------------|-------|
| 1 | Colors | Foundations | LOW | Página de swatches; ningún código nuevo en components/. |
| 2 | Typography | Foundations | LOW | Specimen page. |
| 3 | Spacing | Foundations | LOW | Visual de la escala. |
| 4 | Border radius | Foundations | LOW | Visual de los radios. |
| 5 | Shadows | Foundations | LOW | Tarjetas de muestra (light vs dark). |
| 6 | Motion | Foundations | LOW-MEDIUM | Mostrar `--dur-*`, `--ease-out`; demos interactivas. |
| 7 | Icons | Foundations | LOW | Grid de los iconos lucide más usados con buscador opcional. |
| 8 | Spinner | Feedback | LOW | Extraer de Button.loading. Reutilizable en cargas full-page. |
| 9 | Alert / Notification | Feedback | LOW | Extraer del banner de `login-form.tsx`. Variants success/warning/error/info. |
| 10 | Kbd | Display | LOW | Wrap de `<kbd>` con clase `.nx-kbd`. Trivial. |
| 11 | Tag / Chip | Display | LOW | Decidir si Badge cubre — si no, Chip con `onRemove`. |
| 12 | List | Display | LOW | Pattern de lista estilizada (ul/ol/dl). |
| 13 | Buttons group (segmented) | Inputs | LOW-MEDIUM | Composición de Button con value controlado. |
| 14 | Field wrapper | Inputs | LOW | Si se decide extraer; si no, omitir. |
| 15 | Page header | Layout | LOW | Componente trivial pero estandariza padding/spacing entre páginas. |
| 16 | Search input (variant) | Inputs | LOW | Documentación-only; usar `<Input leftIcon={Search} />`. |
| 17 | Tabs | Layout | MEDIUM | TabList/TabTrigger/TabPanel + estado controlado. ARIA tabs. |
| 18 | Radio group | Inputs avanzados | MEDIUM | Roving tabindex + arrows. |
| 19 | Progress bar | Feedback | MEDIUM | Lineal trivial; circular requiere SVG con `stroke-dasharray`. |
| 20 | Pagination | Data | MEDIUM | Extraer de DataTable como componente independiente con `page`/`pageSize`/`onChange`. |
| 21 | Sparkline | Charts | MEDIUM | Variante minimal de LineChart. |
| 22 | Popover (genérico) | Feedback | MEDIUM-HIGH | Extraer base de SidebarPopover; replantear Tooltip y Dropdown sobre él. **Bloquea** mejoras a Tooltip/Dropdown. |
| 23 | Filter bar (pattern) | Data | MEDIUM | Más documentación que código; combinaciones de Input/Select/Button. |
| 24 | Slider | Inputs avanzados | MEDIUM | Single value primero; range value después. |
| 25 | File upload | Inputs avanzados | MEDIUM | Botón + lista; manejo de FileList. |
| 26 | Dropzone | Inputs avanzados | MEDIUM | DragEvents + estado visual. Comparte hook con File upload. |
| 27 | Time picker | Inputs avanzados | MEDIUM-HIGH | Decidir si independiente o solo dentro de DateTimePicker. |
| 28 | Date picker | Inputs avanzados | HIGH | Calendar popup, range support, i18n de meses/días. Decisión: ¿react-day-picker o custom? |

## Components to DOCUMENT (already exist)

Lista priorizada por (a) cuántos consumidores ya tiene (más uso = más urgente documentar) y (b) si requiere ajustes pequeños antes de la página.

| # | Component | Category | Variants found | API surface | Pre-work needed |
|---|-----------|----------|----------------|-------------|-----------------|
| 1 | Button | Inputs | default, secondary, ghost, outline, destructive, link · sizes sm/md/lg/icon · loading | `variant`, `size`, `loading`, `disabled`, `className`, `...HTMLButtonAttributes` | Ninguno. Listo. |
| 2 | Card | Display | default · raised (CSS) · interactive (CSS) | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` + `className` | **Añadir prop `variant`** (default/raised/interactive) que aplique las clases CSS existentes. |
| 3 | Skeleton primitive | Display | — | `Skeleton({ className, ...HTMLDivAttributes })` | Ninguno. Sub-sección en la página actual de skeletons o página propia. |
| 4 | Avatar | Display | sizes xs/sm/md/lg/xl | `src`, `alt`, `fallback`, `size`, `className` | **Deuda**: añadir `'use client'` o convertir a presentational sin `useState` (renderizar siempre con fallback como sibling). |
| 5 | Badge | Display | default/success/warning/error/info/muted | `variant`, `className` | Ninguno. |
| 6 | Input | Inputs | — | `label`, `error`, `leftIcon`, `rightIcon` + `...HTMLInputAttributes` | Ninguno. |
| 7 | DataTable | Data | sortable columns, selectable rows, loading | `columns`, `data`, `loading`, `pageSize`, `selectable`, `getRowId`, `emptyMessage`, `className` | Documentar limitaciones (pagination embebida, selection no extraíble). Eventualmente extraer Pagination y exponer `onSelectionChange`. |
| 8 | Tooltip | Feedback | sides top/bottom/left/right | `content`, `children`, `side`, `className` | Documentar limitación de overflow (no usa portal). |
| 9 | Dropdown menu | Feedback | align left/right · destructive item | `DropdownMenu({ trigger, children, align })` + `Item({ destructive, onClick })` + `Separator`, `Label` | Documentar falta de keyboard nav. |
| 10 | Dialog | Feedback | — | `open`, `onClose`, `title`, `description`, `children`, `className` | Ninguno (austero pero funcional). Documentar como está. |
| 11 | Separator | Display | horizontal/vertical | `orientation`, `className` | Ninguno. |
| 12 | Textarea | Inputs | — | `label`, `error` + `...HTMLTextareaAttributes` | Ninguno. |
| 13 | Select | Inputs avanzados | — (native) | `label`, `error`, `placeholder` + `...HTMLSelectAttributes` | Documentar como **Select nativo** intencional; opcionalmente añadir nota de roadmap a Select avanzado. |
| 14 | Checkbox | Inputs avanzados | — | `label`, `description` + `...HTMLInputAttributes` | EXISTS_UNUSED — primer caso de uso real puede surgir durante el showcase. Validar API entonces. |
| 15 | Switch | Inputs avanzados | — | `label`, `description` + `...HTMLInputAttributes` | EXISTS_UNUSED — idem. |
| 16 | AreaChart | Charts | — | `data`, `xKey`, `yKey`, `color`, `formatY`, `formatTooltip`, `height` | Ninguno. |
| 17 | BarChart | Charts | — | misma forma que AreaChart | Ninguno. |
| 18 | LineChart | Charts | multi-series | `data`, `xKey`, `series[]`, `formatY`, `formatTooltip`, `height` | Documentar inconsistencia con AreaChart/BarChart (forma distinta de pasar color). |
| 19 | DonutChart | Charts | — | `data{name,value,color}[]`, `innerRadius`, `outerRadius`, `height` | Ninguno. |
| 20 | KPICard | Charts | loading | `title`, `value`, `growth`, `icon`, `loading`, `className` | **Mover** de `features/dashboard/components/` a `components/dashboard/` o `components/ui/` antes de documentar. |
| 21 | Topbar | Layout | — | (sin props públicas; composición) | Documentar como pattern compuesto, no como componente parametrizable. |
| 22 | Breadcrumbs | Layout | — | (sin props; auto-genera desde pathname) | Documentar API extensión: cómo añadir labels en `routeLabelKeys`. |

Componentes adicionales fuera del target pero candidatos a INCLUDE:

| Component | Category sugerida | Notes |
|-----------|-------------------|-------|
| ThemeToggle | Layout / Theming | Trivial. Documentar junto a accent picker. |
| LanguageSwitcher | Layout / i18n | 2 variants (compact/full). Ya está mencionado en `/ui/i18n`. |

## Technical debt detected

Lista de inconsistencias detectadas durante la auditoría que conviene resolver durante B6 o abrir como tickets de seguimiento. Numeradas por prioridad descendente.

1. **Avatar usa `useState` sin `'use client'`**. Funciona porque siempre se consume desde components con `'use client'`, pero es frágil. Fix: o bien añadir `'use client'`, o reescribir sin useState (CSS `:has()` o renderizar img + fallback siempre y ocultar uno por CSS). Recomendación: añadir `'use client'` ahora; replantear más adelante.

2. **Card sin prop `variant`**. CSS expone `nx-card--raised`/`--interactive` pero el componente React solo renderiza `default`. Añadir `variant?: 'default' | 'raised' | 'interactive'` durante B6c (Display) antes de documentar.

3. **DataTable: estado interno no extraíble**. `selected` es `useState<Set<string>>` privado. Añadir props opcionales `selectedIds?: Set<string>`, `onSelectionChange?: (ids: Set<string>) => void` para soportar selección controlada sin romper el caso uncontrolled.

4. **Pagination embebida en DataTable**. Imposible reutilizar la paginación con datos servidor-paginados. Extraer `Pagination` como componente independiente; DataTable lo consume internamente y opcionalmente acepta `pagination?: 'auto' | 'external'`.

5. **Componentes definidos pero sin uso**: `Checkbox`, `Switch`, `Label` (0 imports). El primer caso de uso real puede revelar fallos en la API. Validar manualmente al construir las páginas de showcase de B6 (las propias páginas son el primer consumidor real).

6. **Inconsistencia API entre charts**: `AreaChart`/`BarChart` aceptan `color` (string) y `yKey` (single), `LineChart` requiere `series[]`, `DonutChart` espera color en cada datum. Documentar la divergencia tal cual; no normalizar todavía (rompe consumidores).

7. **Tooltip sin portal**. En contenedores con `overflow:hidden` el tooltip queda recortado. Documentar limitación; reemplazar cuando exista Popover genérico (#22 de "Components to BUILD").

8. **DropdownMenu sin keyboard navigation**. Falta arrow-up/down, enter para activar item enfocado, focus trap. Documentar limitación; abrir ticket separado si se quiere robustez completa.

9. **`Table` primitive solo se usa internamente** por `DataTable`. Si no se piensa exponer al consumidor, mover a `data-table.parts.tsx` (privado). Si sí se expone, documentarlo en /ui.

10. **`KPICard` vive en `features/dashboard/`**. Es genérico de UI y bloquea la regla "components/ui no importan de features": para documentarlo en /ui o consumirlo desde otro feature, mover a `components/dashboard/` o `components/ui/`.

11. **`Field wrapper` ausente**: Input/Select/Textarea cada uno renderiza su propio label/error inline. Hay duplicación pequeña. Decidir en B6 si extraer `FieldWrapper` o documentar el pattern actual como "label/error embebido por convención".

12. **Clases CSS `nx-*` sin componente React equivalente**: `.nx-kbd`, `.nx-divider`, `.nx-dot`. Decidir si crear React component (Kbd al menos) o documentar la clase tal cual.

13. **Native `<select>`** vs design system "premium": el `Select` actual es nativo. Documentar como decisión intencional. Si más adelante se necesita listbox custom, abrir sub-bloque opcional.

14. **`<img>` en Avatar** (lint warning preexistente): pendiente desde B1; pendiente configurar `images.remotePatterns` en `next.config.ts`.

15. **Spinner inline en Button**: el SVG `animate-spin` está duplicado/incrustado. Extraer como `<Spinner size="sm/md/lg" />` cuando se construya en B6e (Feedback) y refactorizar Button para consumirlo.

## Recommendations for B6 sub-blocks

Basándose en la matriz, propuesta de orden y agrupación de sub-bloques:

### Orden recomendado

1. **B6a — Foundations** (LOW complexity en agregado, bloquea referencias en páginas posteriores).
   - 7 páginas: Colors, Typography, Spacing, Radius, Shadows, Motion, Icons.
   - Sin nuevo código de componentes; solo páginas + traducciones + entradas en `routes.ts`/`sidebar.config.ts`/`ui-subnav.tsx`.

2. **B6b — Inputs básicos**.
   - Documentar: Button (incluyendo icon variant), Input, Textarea, Search (variant doc-only).
   - Construir: Buttons group; opcionalmente Field wrapper.
   - **Pre-work**: ninguno.

3. **B6c — Display**.
   - Documentar: Card (con variant añadido), Badge, Avatar (con `'use client'` añadido), Separator, Skeleton primitive.
   - Construir: Tag/Chip (si Badge no lo cubre), Kbd, List, Links (decidir).
   - **Pre-work**: arreglar deudas técnicas #1 y #2 antes de documentar Card y Avatar.

4. **B6d — Inputs avanzados (parte 1: existentes)**.
   - Documentar: Select (nativo), Checkbox, Switch.
   - Construir: Radio group, Slider.
   - **Pre-work**: validar la API de Checkbox/Switch en uso real de las propias páginas.

5. **B6e — Feedback (lo que falta)**.
   - Documentar: Dialog, Tooltip, Dropdown menu.
   - Construir: Spinner, Alert, Progress bar, Popover genérico.
   - **Pre-work**: extraer Spinner del Button antes de documentar Button (o documentarlo y refactorizar después; cualquiera de las dos).

6. **B6f — Data**.
   - Documentar: DataTable (con limitaciones explícitas).
   - Construir: Pagination (extraer de DataTable), Filter bar (pattern).
   - **Pre-work**: deudas técnicas #3 y #4 idealmente resueltas antes; alternativamente, documentar DataTable con limitaciones y mover deuda a B7.

7. **B6g — Charts**.
   - Documentar: AreaChart, BarChart, LineChart, DonutChart, KPICard.
   - Construir: Sparkline (opcional, o aplazar a futuro).
   - **Pre-work**: mover KPICard fuera de `features/dashboard/` (deuda #10).

8. **B6h — Layout**.
   - Documentar: Topbar, Breadcrumbs (más ThemeToggle y LanguageSwitcher como bonus).
   - Construir: Tabs, Page header.
   - **Pre-work**: ninguno.

9. **B6i — Inputs avanzados (parte 2: complejos)** (sub-bloque opcional grande).
   - Construir: Date picker, Time picker, File upload, Dropzone.
   - Por complejidad puede ser su propio bloque (B7) o quedar como "fuera de scope".

### Dependencias a respetar

- **Card variant prop** debe añadirse antes de B6c (Display).
- **Avatar 'use client'** debe arreglarse antes de B6c.
- **Popover genérico** (B6e) sería base para mejorar Tooltip/Dropdown — pero como ambos son funcionales, pueden documentarse "como están" en B6e y refactorizarse en B7.
- **KPICard relocation** debe pasar antes de B6g.
- **Spinner extraction** y **Pagination extraction** son nice-to-have antes de B6e/B6f, no bloqueantes.

### Redistribución sugerida vs plan inicial

El plan inicial menciona B6a-B6h. Comparado con el inventario:

- **B6a (Foundations)**: 7 páginas a construir, todas LOW. Volumen razonable.
- **B6b (Inputs básicos)**: 4-5 documentar + 1-2 construir. Volumen razonable.
- **B6c (Display)**: 5 documentar + 3-4 construir. Volumen alto pero LOW complexity.
- **B6d (Inputs avanzados)**: 3 documentar + 2 construir (radio/slider) en parte 1; 4 construir HIGH (date/time/file/dropzone) en parte 2. **Recomendación**: dividir en B6d.1 (existentes + radio/slider) y B6d.2/B6i (date/time/file/dropzone) — la parte 2 puede salir incluso fuera del bloque B6.
- **B6e (Feedback)**: 3 documentar + 4 construir. Volumen moderado-alto. Popover es la mayor incógnita.
- **B6f (Data)**: 1 documentar + 2 construir. Volumen bajo si Pagination/Filter bar se mantienen mínimos.
- **B6g (Charts)**: 5 documentar + 1 opcional. Volumen bajo.
- **B6h (Layout)**: 2 documentar (+2 bonus) + 2 construir. Volumen razonable.

**Total páginas nuevas en /ui**: 7 (foundations) + ~22 (existentes a documentar) + ~25 (nuevos) ≈ **54 páginas**. Considerar si todas tienen página propia o si algunas se agrupan (ej. todas las foundations en una single page con secciones). Recomendación: foundations en página única con secciones internas (1 página `/ui/foundations`); los demás cada uno en su página.

### Riesgo principal

El sub-bloque más arriesgado es **B6d.2 (Date/Time pickers)**. Si se decide construir custom en lugar de adoptar `react-day-picker`, el alcance puede multiplicarse fácilmente. **Recomendación**: si se quiere date picker en B6, adoptar `react-day-picker` como dependencia y wrappear; reservar custom para un bloque posterior.
