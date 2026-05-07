# NexDash Boilerplate — Changelog

Registro de cambios por bloque de trabajo. Cada bloque deja el repo en verde
(`npm run lint` y `npm run build` sin errores). Documento pensado como apoyo
para el TFM: incluye **qué** se hizo, **por qué** y **qué se descartó**.

---

## [B6d.1] Inputs avanzados: Select, Checkbox, Switch — 2026-05-07

Migración nx-* de los tres controles de formulario pendientes + 3 páginas de showcase. La categoría Inputs pasa de 4 a 7 componentes en el overview.

### Migración nx-*

**Select** — componente totalmente refactorizado:
- Nueva clase `.nx-select` en `components.css`: `appearance: none`, mismos tokens que `.nx-input` (height 34px, `--surface`, `--border-strong`, `--radius-md`), `padding-right: var(--space-8)` para el icono chevron. Estados hover, focus (ring 3px `--accent-muted`), `is-error`, y disabled.
- Nueva clase `.nx-select__icon` para el `ChevronDown` (position absolute, pointer-events none).
- `select.tsx` migra el wrapper a `nx-field/nx-label/nx-help` (igual que `input.tsx`) y la `<select>` a `cn('nx-select', error && 'is-error')`.
- **Consumidores verificados**: `user-form.tsx` (Role + Status) y `users-content.tsx` (filtros All roles / All statuses) — ninguna regresión visual.

**Checkbox** — refactor estructural + nueva prop:
- Clase `.nx-checkbox` preexistente ampliada: focus-visible (ring accent), indeterminate (fondo accent + barra horizontal CSS).
- Nuevas clases React: `.nx-checkbox-field` (wrapper label), `.nx-checkbox-control` (relative container), `.nx-checkbox-box` (visual 16px), `.nx-checkbox-icon` (opacity 0→1). Checked/indeterminate/focus/disabled gestionados por CSS `:has()`.
- `checkbox.tsx`: elimina el patrón `sr-only peer` + div. El input nativo está en `.nx-checkbox-control` con `opacity: 0; inset: 0`. El icono `Check` o `Minus` (lucide) vive dentro de `.nx-checkbox-box`.
- **Nueva prop `indeterminate?: boolean`**: se aplica vía `useEffect` (`el.indeterminate = true`), que es la única forma de establecer el estado indeterminado en un input nativo.

**Switch** — componente completamente reescrito + nueva prop:
- Nuevas clases `.nx-switch`, `.nx-switch__track`, `.nx-switch__thumb`. Track: `--border-strong` → `--accent` al checked. Thumb: círculo blanco `16×16`, `transform: translateX(16px)` al checked. Todo vía CSS `:has(input:checked)`.
- `switch.tsx`: el input nativo es transparente (`opacity: 0; inset: 0`) dentro de `.nx-switch`. Elimina el patrón `peer-checked:` de Tailwind.
- **Nueva prop `size?: 'sm' | 'md'`** (default `'md'`): modifier class `.nx-switch--sm` (28×16px, thumb 12px, translate 12px). Omitido de `InputHTMLAttributes` vía `Omit<..., 'type' | 'size'>` para evitar conflicto con `size: number` del DOM.

### Showcase

- `/ui/select` — Anatomy (label+field+icon+helper) + States (default, error, disabled, with label) + Placeholder + Roadmap (nota native-first) + Props + Localization.
- `/ui/checkbox` — Anatomy (control+box+icon+label+description) + States (5 demos: unchecked, checked, indeterminate, disabled, with description) + Group (demo interactivo de estado indeterminado padre) + Props + Localization.
- `/ui/switch` — Anatomy (input+track+thumb+label+description) + States (4 demos: off, on, disabled-off, disabled-on) + Sizes (sm/md) + With label+description + Settings panel pattern + Props + Localization.

### Config / i18n

- `routes.ts`: `select: '/ui/select'`, `checkbox: '/ui/checkbox'`, `switch: '/ui/switch'`.
- `sidebar.config.ts`: 3 nuevos items en el grupo Components, entre List y Toasts.
- `common.json` (en + es): claves `uiSelect`, `uiCheckbox`, `uiSwitch`.
- `request.ts`: 3 namespaces añadidos al `Promise.all` + return object (`select`, `checkbox`, `switch`). La clave `switch` se admite como nombre de propiedad en object literal JS (no es reservada en ese contexto); la variable se nombra `switchNs` en la destructuración del array.
- 6 archivos JSON de traducción: `select-{en,es}.json`, `checkbox-{en,es}.json`, `switch-{en,es}.json`.

### Build

- `npm run lint`: 0 errores nuevos (los 2 warnings preexistentes no son de este bloque).
- `npm run build`: 66 páginas (+6 = 3 rutas × 2 locales). ✓

### Decisión documentada

Select nativo vs. listbox custom: se eligió el nativo por accesibilidad garantizada, soporte móvil out-of-the-box y cero JS extra. Listbox custom (búsqueda, multi-select, agrupado, async) documentado como roadmap en el showcase.

Checkbox con `:has()` vs. `peer-checked:` Tailwind: se migra a `:has()` para consistencia con el resto del nx-* system. La cobertura de `:has()` es >96% a mayo 2026.

---

## [B6c.2] Display: Kbd + List + CardFooter nx-* — cierre del bloque B6c — 2026-05-07

Último sub-bloque de B6c. Cierra la deuda de migración nx-* de Card (CardFooter) y completa la sección "Display" con `Kbd` (componente React trivial) y `List` (utility CSS sin componente). La categoría Display pasa a 6 entradas y la migración nx-* de Card es total.

### Pre-work — CardFooter (deuda heredada de B6c.1)

`CardFooter` quedó sin migrar a nx-* en B6c.1: renderizaba con Tailwind directo (`flex items-center pt-4 mt-4 border-t …`) sin padding lateral. Dado que el reset `:has(> .nx-card__body)` elimina el padding del root cuando la Card usa sub-componentes, el footer quedaba pegado al borde horizontal.

- **`components.css`**: nueva clase `.nx-card__footer` con `padding: var(--space-4) var(--space-5)` y `border-top`. Añadido `.nx-card:has(> .nx-card__footer)` al bloque `:has()` de reset.
- **`card.tsx`**: `CardFooter` pasa de Tailwind a `cn('nx-card__footer', className)`.
- **Consumidores**: `CardFooter` solo se usa en `card-content.tsx` (showcase). No hay consumidores en producción.
- **Verificado**: `/ui/card` sección "Sub-components" — botón "View details" con `padding: 16px 20px` confirmado via `getComputedStyle`.

### Componentes

- **`Kbd` nuevo** (`src/components/ui/kbd.tsx`): wrapper trivial sobre `<kbd>` con `cn('nx-kbd', className)`. Acepta y propaga `React.HTMLAttributes<HTMLElement>`. La clase `.nx-kbd` ya existía en `components.css`; no se ha modificado (fuente mono, border `--border-strong`, fondo `--surface-raised`, color `--text-secondary`).

- **Utility CSS `nx-list-*`** (`src/styles/components.css`, bloque nuevo al final):
  - `.nx-list` — lista con viñetas base: `list-style: disc`, `color: var(--text-secondary)`, `gap: var(--space-1)`, marker `--text-muted`.
  - `.nx-list--ordered` — numeración decimal con marker `--text-muted`.
  - `.nx-list--description` — elimina viñetas, estiliza `dt` (semibold, `--text-primary`) y `dd` (muted, sangría `--space-4`).
  - `.nx-list--compact` — reduce gap entre items (`gap: 0`, `padding-block: 1px`).
  - Anidado: `.nx-list .nx-list` añade `margin-top: var(--space-1)`.
  - **Sin componente React List.tsx** — las clases se aplican directamente a `ul`, `ol`, `dl` semánticos.

### Decisión documentada

List es utility CSS (no componente React) porque es 100% presentacional. El mismo patrón que `.nx-kbd`. Un componente sería overhead sin beneficio. La composición con iconos personalizados se consigue con `style={{ listStyle: 'none', paddingLeft: 0 }}` + un `flex items-start gap-2` dentro de cada `li`.

### Showcase

- `/ui/kbd` — Header + Single keys (7 keys) + Modifier combinations (4 combos en grid 2×2) + Key sequence (g then d) + Inline prose (`t.rich` con renderers `esc`/`enter`) + PropsTable + Localization.
- `/ui/list` — Header + Bulleted + Ordered + Description list + Custom icon (Lucide `Check`) + Nested + Classes reference table (4 filas: Class / Applied to / Description) + Localization.
- Overview `/ui/page.tsx`: display count 4 → 6, descripción actualizada.

### i18n

- `kbd-{en,es}.json` y `list-{en,es}.json` en `src/features/ui-showcase/i18n/`.
- `request.ts`: namespaces `kbd` y `list` registrados.
- `routes.ts`: `ui.kbd = '/ui/kbd'`, `ui.list = '/ui/list'`.
- `common.json` (en/es): `sidebar.items.uiKbd = "Kbd"`, `sidebar.items.uiList = "List"`.
- `sidebar.config.ts`: items Kbd y List en Components, después de Separator.
- Cadenas con `<tag>` evitadas en todos los JSON (lección de B6c.1.5).
- `demos.prose` en kbd-{en,es}.json usa rich text tags (`<esc>Esc</esc>`) — componente usa `t.rich()` con renderers `(chunks) => <Kbd>{chunks}</Kbd>`.

### Fix detectado durante verificación

`demos.prose` usaba inicialmente `{esc}` (ICU string placeholder) en lugar de `<esc>Esc</esc>` (rich text tag). El placeholder devolvía cadena vacía en `t.rich()`. Corregido antes del commit.

### Build

- Lint: 0 errores nuevos (6 warnings pre-existentes).
- Build: 60 páginas (era 56; +4 = 2 rutas × 2 locales).

---

## [B6c.1.5] Fix: Card padding regression + i18n angle-bracket keys — 2026-05-07

Dos regresiones introducidas en B6c.1, corregidas antes de continuar.

### Fix 1 — Card sin padding interno

Al migrar Card a `nx-card`, se perdió el `padding: 24px` original (los tokens tienen `--space-6` = 24px). La corrección añade `padding: var(--space-6)` a `.nx-card` y lo anula con un selector `:has()` cuando la tarjeta usa sub-componentes (`nx-card__head` o `nx-card__body`), que ya gestionan su propio padding internamente.

```css
.nx-card { padding: var(--space-6); }
.nx-card:has(> .nx-card__head),
.nx-card:has(> .nx-card__body) { padding: 0; }
```

Verificado en Dashboard, Analytics, Settings, /ui/card y Login: las tarjetas simples muestran `padding: 24px`; las compuestas `padding: 0`.

### Fix 2 — Claves literales en /ui/card (next-intl v4 + angle brackets)

En next-intl v4, `t()` falla silenciosamente y devuelve la clave si el valor del mensaje contiene etiquetas HTML (`<div>`, `<h3>`, `<p>`). Las cuatro claves afectadas en `card-en.json` y `card-es.json` se reescriben sin corchetes angulares:
- `anatomy.parts.title`: `"…as an <h3>."` → `"…as an h3 element."`
- `anatomy.parts.description`: `"…as a <p>."` → `"…as a p element."`
- `sections.props.description`: `"…<div> attributes."` → `"…div attributes."`
- `props.extendsNote`: `"…<div> attributes…"` → `"…div attributes…"`

### Build

- Lint: 0 errores nuevos.
- Build: 56 páginas (sin cambio).

---

## [B6c.1] Display components — Card, Badge, Avatar, Separator + radius-lg — 2026-05-07

Tercer bloque de B6 (Display). Reabre el principio Mercury que mantenía las tarjetas con `--radius-lg: 0px`, migra Card / Badge / Separator / Skeleton al sistema de clases `nx-*`, extiende Badge con modo chip (onRemove + leadingIcon), añade Avatar con clases `nx-avatar`, y crea las 4 páginas de showcase del grupo "Display".

### Token fix

- **`--radius-lg: 0px` → `12px`** (`src/styles/tokens.css`): el valor `0px` era un override deliberado del bloque B3 ("CARDS ARE SHARP") que fue revertido. Afecta a `nx-card`, `nx-card--raised/interactive` y cualquier `rounded-[var(--radius-lg)]` en componentes existentes. El resto de radii de Mercury (`--radius-sm: 2px`, `--radius-md: 4px`, `--radius-pill: 32px`) no cambian.

### Componentes

- **`Card` refactor** (`src/components/ui/card.tsx`): añade `variant?: 'default' | 'raised' | 'interactive'` y migra a clases `nx-card` / `nx-card--raised` / `nx-card--interactive`. Sub-componentes `CardHeader` → `nx-card__head`, `CardTitle` → `nx-card__title`, `CardContent` → `nx-card__body`. `CardDescription` y `CardFooter` mantienen Tailwind directo (no tienen clase nx-* propia). CSS pre-existente en `components.css`.
- **`Badge` refactor** (`src/components/ui/badge.tsx`): renombra variantes (`default` → `accent`, `muted` → `neutral`), añade `leadingIcon?: ReactNode` y modo chip con **discriminated union** (`onRemove: () => void` + `aria-label: string` requerido cuando onRemove está presente). Migra a clases `nx-badge` + `nx-badge--{variant}`. Nueva clase `nx-badge__remove` en `components.css` para el botón de cierre del chip.
- **`Avatar` refactor** (`src/components/ui/avatar.tsx`): añade `'use client'` (usa `useState` para el fallback de imagen rota), migra a clases `nx-avatar` + `nx-avatar--{xs|sm|md|lg|xl}`. Nuevas clases en `components.css`.
- **`Separator` refactor** (`src/components/ui/separator.tsx`): migra de Tailwind directo a `nx-separator` + `nx-separator--horizontal/vertical`. Añade `aria-orientation`. En CSS se renombra `nx-divider` → `nx-separator` (el nombre legacy no tenía consumidores externos).
- **`Skeleton` refactor** (`src/components/ui/skeleton.tsx`): sustituye `animate-pulse bg-[var(--surface-raised)]` por clase `nx-skeleton`. Nueva clase + keyframe `@keyframes nx-pulse` en `components.css`.
- **`components.css`**: añade `nx-badge__remove`, renombra `nx-divider` → `nx-separator` con variante vertical, añade bloque `nx-avatar` (5 sizes), añade bloque `nx-skeleton` + `@keyframes nx-pulse`.

### Migración de variantes Badge

Todos los consumidores de `variant="muted"` → `variant="neutral"` y `variant="default"` → `variant="accent"`:
- `ui/page.tsx`, `reports-content.tsx`, `users-content.tsx`, `dashboard-content.tsx`, `users/[id]/user-detail-content.tsx` (incluye `roleVariant` record).

### Showcase

- `/ui/card` — Header + Anatomy (root/header/title/description/content/footer) + Variants (default/raised/interactive con toast on click) + Sub-components (full composition) + PropsTable.
- `/ui/badge` — Header + Anatomy (icon/label/remove) + Variants (6) + Leading icon + Chip mode (chips reactivos con reset) + PropsTable.
- `/ui/avatar` — Header + Anatomy (container/image/fallback) + Sizes (xs–xl alineados en fila) + Fallback behavior (3 demos) + PropsTable.
- `/ui/separator` — Header + Anatomy (line) + Orientations (horizontal/vertical) + PropsTable.
- `/ui/skeletons` — Nueva sub-sección "Primitive — Skeleton" (text/circle/block) antes de la sección SkeletonBase existente.
- Overview `/ui/page.tsx`: display count 0 → 4, href apunta a `/ui/card`.

### i18n / Config

- `common.json` (en/es): `sidebar.items.uiCard`, `uiBadge`, `uiAvatar`, `uiSeparator`.
- `request.ts`: namespaces `card`, `badge`, `avatar`, `separator`.
- `routes.ts`: `ui.card`, `ui.badge`, `ui.avatar`, `ui.separator`.
- `sidebar.config.ts`: Card, Badge, Avatar, Separator en el grupo Components (después de Textarea, antes de Toasts).
- `uiShowcase.skeletons.sections.skeleton` (en/es): nueva clave para la sub-sección del primitivo.
- 8 nuevos ficheros de traducción en `src/features/ui-showcase/i18n/` (card/badge/avatar/separator × en/es).

### Build

- Lint: 0 errores nuevos.
- Build: 56 páginas (era 48; +8 = 4 rutas × 2 locales).

---

## [B6b.2] Input + Textarea showcase + migración size="icon" — 2026-05-06

Segundo sub-bloque de B6b (Inputs básicos). Cierra la migración de `size="icon"` a `iconOnly`, extiende `Input` y `Textarea` con props de tamaño y texto de ayuda, los migra a las clases `nx-*` de `components.css`, y añade sus páginas de showcase completas incluyendo el patrón Search.

### Componentes

- **`Input` refactor** (`src/components/ui/input.tsx`): añade `size?: 'sm' | 'md' | 'lg'` (soluciona conflicto con el `size?: number` nativo via `Omit`), `helperText?: string` (texto bajo el campo sin estado de error), y migra el markup interno a clases `nx-*`: `nx-field` (wrapper), `nx-label`, `nx-input` + modificadores `nx-input--sm/lg`, `nx-input-slot--leading/trailing`, `nx-help`. Mantiene `leftIcon`/`rightIcon` como nombres (en uso en `login-form.tsx`).
- **`Textarea` refactor** (`src/components/ui/textarea.tsx`): añade `size?: 'sm' | 'md' | 'lg'` y `helperText?: string`, migra a `nx-textarea` + `nx-textarea--sm/lg`.
- **`Button` — eliminación de `size="icon"`**: se elimina del union `ButtonSize` tras migrar todos los usages (6 en 3 ficheros). `iconOnlyClasses` pasa de `Record<Exclude<ButtonSize, 'icon'>, string>` a `Record<ButtonSize, string>`. `computedSizeClass` simplificado.
- **`components.css`**: `nx-input` height corregida 34px → 36px; `nx-field` añade `width: 100%`; nuevas clases `nx-input--sm`, `nx-input--lg`, `nx-input-wrapper`, `nx-input-slot`, `nx-input-slot--leading/trailing`, `nx-input.has-leading/has-trailing`; nuevo bloque `nx-textarea` con variantes y estados.

### Migración `size="icon"` → `iconOnly`

- `theme-toggle.tsx`: `size="icon"` → `iconOnly` (aria-label ya existía via `{tooltipLabel}`).
- `data-table.tsx`: prev/next paginación → `iconOnly aria-label={t('table.previousPage|nextPage')}`. Botones de número de página → `size="sm" className="h-8 w-8 p-0"` (tienen texto — no son icon-only).
- `users-content.tsx`: edit/delete de fila → `iconOnly size="sm" aria-label={t('actions.edit|delete')}`. Se añaden `actions.edit` a los ficheros i18n de users (en/es) con texto descriptivo ("Edit user"/"Editar usuario").

### Showcase

- `/ui/inputs` — Header + Anatomy (label + leading + field + trailing + helper) + States (default, helper, error, disabled) + Sizes (sm/md/lg) + With icons (leading, password toggle) + Search pattern (leftIcon + clear button reactivo) + PropsTable + Localization.
- `/ui/textarea` — Header + Anatomy (label + field + helper) + States + Sizes + PropsTable + Localization.
- Overview `/ui/page.tsx`: inputs count 2 → 4.
- `buttons-content.tsx` PropsTable: `size` type corregido a `'sm' | 'md' | 'lg'`.

### i18n / Config

- `common.json` (en/es): `table.previousPage`, `table.nextPage`, `sidebar.items.uiInput`, `sidebar.items.uiTextarea`.
- `request.ts`: namespaces `inputs`, `textarea`.
- `routes.ts`: `ui.inputs`, `ui.textarea`.
- `sidebar.config.ts`: Input y Textarea en el grupo Components, entre ButtonsGroup y Toasts.

### Build

- Lint: 0 errores nuevos. 4 warnings (2 preexistentes × 2 por worktree incluido en eslint scope).
- Build: 48 páginas (era 44; +4 = 2 nuevas × 2 locales).

---

## [B6b.1] Button + ButtonsGroup + Spinner extracción — 2026-05-05

Primer sub-bloque de B6b (Inputs básicos). Introduce el patrón de showcase canónico para todo B6 (Anatomy → Variants → … → PropsTable → Localization), extrae `Spinner` como componente independiente, refactoriza `Button` para consumirlo internamente, añade un modificador ortogonal `iconOnly` y crea el componente nuevo `ButtonsGroup`.

### Componentes

- **`Spinner`** (`src/components/ui/spinner.tsx` + clases `nx-spinner` en `components.css`): SVG circular con stroke parcial dasheado y animación `nx-spin` (rotación lineal infinita 0.8s). Sizes `xs/sm/md/lg`, colores `current/accent/muted`, `label` para accesibilidad (`role="status"`, default `"Loading"`). Usa `currentColor` por defecto, lo que lo hace componible dentro de cualquier wrapper coloreado (Button, list rows, overlays).
- **`Button` refactor**: el spinner inline (`<svg className="animate-spin"…>`) se sustituye por `<Spinner />`. Cuando `loading=true`, el contenido se mantiene en el DOM con `visibility:hidden` y el spinner se superpone con `position:absolute`, **manteniendo el ancho del botón**. Esto evita CLS al alternar loading state — el comportamiento previo (spinner inline + label) hacía crecer el botón ~24px al cargar.
- **`Button.iconOnly` (prop nueva)**: ortogonal a `size`. Cuando es `true`, fuerza aspect 1:1 con la altura del size correspondiente (sm:32, md:36, lg:44). Convive con la `size="icon"` legacy (h-9 w-9), que se mantiene retrocompatible. Se usa **discriminated union** para forzar `aria-label` requerido cuando `iconOnly: true` — TypeScript falla en compilación si se omite. La prop `size="icon"` legacy no fuerza aria-label (preserva comportamiento existente; la auditoría puede recomendar deprecarla en sub-bloques posteriores).
- **`ButtonsGroup`** (`src/components/ui/buttons-group.tsx` + clases `nx-btn-group` en `components.css`): contenedor flex que une visualmente botones hijos. Esquinas externas con `--radius-pill` (horizontal) o `--radius-md` (vertical). Bordes deduplicados via `margin: -1px` y `position: relative + z-index` para que el focus ring no quede tapado. `role="group"` por defecto, override a `"toolbar"` para barras de edición. Sin propagación mágica de `size` a los hijos — cada Button declara su propio size (decisión: explícito > mágico).

### Showcase

- **`Anatomy`** (`src/features/ui-showcase/components/anatomy.tsx`): componente reutilizable que define el patrón Anatomy fijado para todo B6. Recibe `render` (la previsualización con `AnatomyPartHighlight` aplicado a las partes) y `parts: AnatomyPart[]` (tabla compacta con name/type/required/description). Las descripciones son traducibles; los nombres de partes (`leading`, `label`, `trailing`, `container`, `buttons`) se mantienen en inglés en ambos locales (jerga universal del design system).
- **`AnatomyPartHighlight`**: helper visual con `border: 1px dashed var(--accent)` y un label en font-mono `text-[10px]` posicionado en `top: -20px`. Se usa también para resaltar partes anidadas (en `ButtonsGroup` resalta el `container` y cada `button` por separado).
- Tres páginas de showcase nuevas (split server/client porque necesitan interacción para snippets copiables):
  - `/ui/buttons` — Anatomy + Variants × 6 + Sizes × 3 + With icons + Icon-only + Loading + Disabled + Full width + PropsTable + Localization. La sección Icon-only incluye una nota destacada (`Info` icon + texto en panel `info-muted`) explicando el contrato de `aria-label`.
  - `/ui/buttons-group` — Anatomy (con highlights anidados) + Horizontal + Vertical + Mixed variants + With icons + As toolbar + PropsTable + Localization.
  - `/ui/spinner` — versión mínima (sizes + colors + PropsTable + nota apuntando a la sección Feedback). **Sin sección Anatomy**: los componentes atómicos no llevan Anatomy (decisión documentada).

### i18n

- 3 namespaces nuevos como archivos separados (patrón ya establecido por `foundations`):
  - `buttons` (`buttons-{en,es}.json`)
  - `buttonsGroup` (`buttons-group-{en,es}.json`)
  - `spinner` (`spinner-{en,es}.json`)
- Registrados en `src/i18n/request.ts`. Política híbrida: snippets de código en EN literal (referencia copy-paste); demos, prosa, descriptions de partes y de props en idioma activo; nombres de partes y nombres de props en EN literal.
- Claves `anatomy.title` y `anatomy.columns.*` añadidas al namespace `uiShowcase` (compartidas por todas las Anatomy de B6).
- Labels de sidebar nuevos: `sidebar.items.uiButton`, `sidebar.items.uiButtonsGroup`, `sidebar.items.uiSpinner` en EN/ES.

### Integración

- `routes.ts`: `routes.ui.buttons`, `routes.ui.buttonsGroup`, `routes.ui.spinner`.
- `sidebar.config.ts`: 3 nuevos children en el grupo "Components", insertados al inicio (Button, Buttons group) y agrupados con feedback (Spinner) según orden de pertenencia mental, no alfabético. Sin iconos en children (consistencia con resto del sidebar — `sidebar-link.tsx` ignora icons en `isChild`).
- Overview `/ui`: la card "Inputs" pasa de coming-soon a activa con `count: 2` y href a `/ui/buttons`. La card "Feedback" sube de 4 a 5 (incluye ahora Spinner). Descripciones actualizadas en `uiShowcase.overview.categories.{inputs,feedback}` para reflejar los componentes reales.

### Decisiones técnicas

- **`iconOnly` vs renombrar `size="icon"`**: se mantiene `size="icon"` para retrocompatibilidad (usado en data-table, theme-toggle, users-content). `iconOnly` es una prop adicional ortogonal, no una sustitución. Pendiente: revisar si convergir ambos en B6b.2 cuando se documente la migración.
- **Discriminated union vs warning runtime**: se eligió la unión discriminada (`{iconOnly:true; 'aria-label':string} | {iconOnly?:false}`). Se descartó warning en `useEffect` porque la unión TypeScript bloquea el error en compile time, mejor experiencia para el desarrollador.
- **`fullWidth` añadida como prop nueva**: la auditoría B6.0 la pidió implícitamente (Botón "Continue" en login form usa `className="w-full"`). Ahora es una prop semántica explícita. Backwards-compat: las clases `w-full` manuales siguen funcionando (se merge via `cn`).
- **Spinner standalone vs override de Button.icon**: `Spinner` es público y reutilizable (no solo dentro de Button). Esto permite componer loading states en list items, overlays, KPI cards, etc. sin duplicar SVGs.
- **Anatomy column "description"**: condicional. Si ninguna parte tiene description, la columna no se renderiza.
- **`ButtonsGroup` sin propagación de `size`**: explícito > mágico. Cada Button hijo declara su size. Si se necesita en el futuro (toolbars con muchos botones idénticos), se puede añadir como helper sin breaking change.

### Lint y build

- `npm run lint` → 0 errores nuevos (2 warnings preexistentes intactos: `_data` no usado en settings-form, `<img>` en avatar).
- `npm run build` → 44 páginas estáticas (era 38; +6 = 3 páginas nuevas × 2 locales).

### Deuda técnica detectada

- **`size="icon"` legacy vs `iconOnly`**: dos formas de hacer lo mismo. Resolver en B6b.2 (migrar usages a `iconOnly` + size, marcar `size="icon"` como deprecated).
- **Componentes atómicos sin Anatomy**: documentar en `docs/components.md` (al cierre de B6) que los componentes atómicos (Spinner, Divider, Skeleton) no llevan sección Anatomy.
- **Skeleton aria-labels en EN**: deuda heredada (no resuelta en B6b.1). Sigue documentada en `i18n.md`.

---

## [B6a.4] Sidebar active matcher fix + "Foundations" → "Bases" (ES) — 2026-05-05

Dos paper cuts detectados tras cerrar B6a, arreglados antes de arrancar B6b. Sin cambios funcionales más allá de estos dos puntos.

### Fix: sidebar active state

El item `Overview` (`href: /ui`) se marcaba como activo en cualquier ruta hija de `/ui` (Foundations, Toasts, Empty states, etc.). El bug también afectaba latentemente al item `Reports overview` (`href: /reports`) cuando se navegaba a `/reports/scheduled` o `/reports/archived` — los dos quedaban marcados.

Causa: `sidebar-section.tsx` aplicaba prefix match (`pathname === href || pathname.startsWith(href + '/')`) a todos los `type: 'link'`. El único caso especial era `href === '/'` para Dashboard.

Solución (Option A del plan, no Option B): nueva propiedad `exact?: boolean` en `SidebarLink`. Items con `exact: true` se matchean sólo exactamente; el resto mantiene el comportamiento anterior (prefix-or-exact).

Razón para descartar Option B (default exact, prefix opt-in via `children`): este codebase no tiene "items con children" navegables — los grupos no son links. Pero hay leaf links que SÍ deben hacer prefix match (p. ej. `Users` con `/users` y `/users/{id}` para detalle de usuario, donde detalle no aparece en el sidebar). Option B regresaría ese caso.

Cambios:
- `sidebar.types.ts`: nueva prop `exact?: boolean` en `SidebarLink`.
- `is-link-active.ts`: nuevo helper que centraliza la lógica (`exact || href === '/' → exact match; else prefix-or-exact`). Usado por section, group y popover para evitar duplicación.
- `sidebar-section.tsx`, `sidebar-group.tsx`, `sidebar-popover.tsx`: reemplazado el matcher inline por el helper.
- `sidebar.config.ts`: marcado `exact: true` en los dos items que lo necesitan (Reports overview y UI Overview). Resto intacto.

Comportamiento verificado:
- `/ui` → `Overview` activo, `Bases`/`Foundations` no.
- `/ui/foundations` → `Bases` activo, `Overview` no.
- `/ui/toasts` → `Toasts` activo, `Overview` no.
- `/reports/scheduled` → `Scheduled` activo, `Overview` (de Reports) no, grupo `Reports` se mantiene como contenedor del activo.
- `/users/123` → `Users` activo (preservado).
- `/` → `Dashboard` activo (preservado).
- `/analytics` → `Analytics` activo, `Dashboard` no (preservado).

### i18n: "Foundations" → "Bases" (ES)

Reemplazado en las tres strings ES visibles que mostraban el label:
- `src/messages/es/common.json` → `sidebar.items.uiFoundations: "Bases"` (label del sidebar).
- `src/features/ui-showcase/i18n/foundations-es.json` → `title: "Bases"` (h1 de la página).
- `src/features/ui-showcase/i18n/es.json` → `overview.categories.foundations.label: "Bases"` (card del overview de `/ui`).

Inglés intacto: `Foundations` sigue en EN en todos los archivos.

URLs intactas: `/ui/foundations` sigue siendo la ruta en ambos idiomas (`routes.ui.foundations` no se toca).

Identifiers de código intactos: `FoundationsContent`, `FoundationsPage`, namespace `foundations`, archivo `foundations-{en,es}.json`, `routes.ui.foundations`. Todo lo que no se ve en UI permanece como referencia técnica al concepto del design system.

### Verificación

- `npm run lint` → 0 errores nuevos.
- `npm run build` → 38 páginas.

### B6a sigue CERRADO

B6a.4 es un fix post-cierre, no parte del scope original de B6a. Próximo: **B6b — Inputs básicos**.

---

## [B6a.3] Foundations — Elevation, Motion, Iconography + cierre B6a — 2026-05-05

Tercer y último sub-bloque de B6a. Añade las 3 secciones que faltaban (Elevation, Motion, Iconography), expone Foundations en el sidebar y en el overview, y crea `docs/foundations.md`. **B6a queda CERRADO**: las 8 secciones de Foundations están con contenido y la página es navegable desde la propia UI.

### Cambios

- **ElevationSection** (`id="elevation"`):
  - **Surface layering**: torre visual de 4 superficies anidadas (`--surface-sunk` → `--background` → `--surface` → `--surface-raised`), cada nivel con su label en font-mono y border sutil para que se distinga incluso cuando la diferencia tonal es mínima. Decisión: omitida la grid duplicada de TokenSwatch (los 4 surfaces ya están en Colors); la torre los enseña en su rol de elevación.
  - **Box shadows**: 2 cards demo (`--shadow-card` y `--shadow-pop`) con notas explicativas (`shadows.dark_note` y `shadows.pop_note`). En dark, la card de `--shadow-card` aparece sin sombra — comportamiento correcto y documentado.
- **MotionSection** (`id="motion"`):
  - **Durations**: 3 `TokenRow` (`--dur-fast`, `--dur-base`, `--dur-slow`) con preview siendo un pulse infinito (opacity 0.3↔1) con la duración del token.
  - **Easings**: 2 `TokenRow` (`--ease-out`, `--ease-in-out`) con mini-track 80×20px y cuadrado animado en bucle alternate de 1500ms con el easing del token.
  - **Demo grid 3×2**: 6 cells (3 duraciones × 2 easings) con botón "Replay all" (icono `RotateCcw`). El botón incrementa una `key` en el contenedor que fuerza re-mount y reinicia las 6 animaciones a la vez. Cada cell usa una clase del CSS module con `animation-iteration-count: 1` y `fill-mode: forwards`.
  - Animaciones implementadas en CSS module local (`foundations-content.module.css`): keyframes `nx-foundations-pulse` y `nx-foundations-slide` + 11 clases (3 pulse, 2 loop, 6 cell). `tokens.css` y `components.css` intactos.
- **IconographySection** (`id="iconography"`):
  - **Library**: card con `import` statement (font-mono) y rejilla de 12 iconos representativos a 20px con hover transition al `--text-primary`.
  - **Sizes**: variante inline tipo TokenRow con grid `[80px, 160px, 1fr]` mostrando los 4 tamaños canónicos (14, 16, 20, 24) con `Search` como icono de muestra. NO se reusa `TokenRow` porque no hay var name semánticamente correcto para tamaños de icono.
- **i18n** (`foundations-en.json` + `foundations-es.json`):
  - Subtitles y descriptions de elevation/motion/iconography reescritos para alinearse con la prosa propuesta en el plan.
  - Nuevas claves: `elevation.shadows.dark_note`, `elevation.shadows.pop_note`, `iconography.sizes.{nav,inline,control,display}`.
  - **Stroke-width corregido**: el plan sugería documentar 1.75 como default, pero el código del proyecto NO setea `strokeWidth` en ningún uso de Lucide React, por lo que se aplica el default real de la librería (2). Documentado correctamente como "stays at the Lucide default (2)".
- **Sidebar `/ui`** (`sidebar.config.ts`):
  - Foundations añadido como entrada directa después de Overview, ANTES del grupo Components. Icono `Palette` (mismo que el overview, evita reusar `Layers` ya empleado por el grupo Components).
  - Etiqueta i18n nueva: `common.json` → `sidebar.items.uiFoundations` ("Foundations" en EN y ES — mantener nombre en inglés por consistencia con el resto de nombres del design system).
- **Overview `/ui`** (`/ui/page.tsx`):
  - Foundations cambia de "Coming soon" (`count: 0, href: null`) a card activa (`count: 8, href: routes.ui.foundations`).
  - Sigue siendo la primera del array (no se ha cambiado el orden).
  - Nueva propiedad `unit?: 'components' | 'sections'` en el tipo `Category`. Foundations usa `unit: 'sections'`; el resto mantiene `'components'` por defecto.
  - Nueva clave i18n `uiShowcase.overview.sectionCount` con plural ICU equivalente al `componentCount` existente.
  - Descripción de la categoría Foundations actualizada en EN ("Tokens, philosophy, colors, typography, motion") y ES (equivalente). La anterior ("Colors, typography, spacing, icons") quedaba corta.
- **`docs/foundations.md`**: documento nuevo con estructura, componentes auxiliares, política i18n, comportamiento de `AccentScope`, animaciones de Motion, cuándo actualizar la página e integración.

### Decisiones tomadas

- **CSS module local** (`foundations-content.module.css`) en lugar de tocar `components.css` global. Razón: las animaciones son específicas de la página Foundations y no se usan en ningún otro sitio. Mantener el scope local evita polución del CSS global y permite que futuros refactors de Foundations no toquen archivos compartidos.
- **Re-mount con `key`** para "Replay all" en lugar de manipular `transition` y `transform` con state. Razón: simpler, robusto, declarativo. Cada cell tiene una sola clase CSS con la animación; el re-mount reinicia el ciclo. Sin riesgos de race conditions o transiciones interrumpidas.
- **Preview de Easings con cuadrado en bucle alternate**, no curva Bézier en SVG. Razón: el cuadrado moviéndose comunica intuitivamente la diferencia entre `--ease-out` (acelera al final) y `--ease-in-out` (simétrico). Calcular la curva en SVG sería más preciso pero menos legible para alguien sin background de motion design.
- **Stroke-width documentado como 2** (Lucide default), no 1.75 como sugería el plan. Razón: verificación empírica en el código — no hay uso de `strokeWidth` prop en ningún Lucide del proyecto, por lo que se aplica el default real de la librería.
- **Foundations como link directo en el sidebar**, no dentro del grupo Components. Razón: Foundations no documenta un componente individual sino los tokens base del sistema. Está en la misma capa conceptual que Overview, no al mismo nivel que Toasts/Empty states/etc.
- **Iconos del sidebar para Foundations**: `Palette`, mismo que el overview. Coherencia visual entre sidebar y overview ayuda al usuario a identificar la sección. `Layers` está reservado para el grupo Components.
- **`unit: 'sections'` para Foundations** en lugar de quedarnos con "8 components". Razón: Foundations no documenta componentes sino tokens y principios; "8 sections" es semánticamente más honesto.

### Verificación

- `npm run lint` → 0 errores nuevos. Solo dos warnings preexistentes (no relacionados).
- `npm run build` → 38 páginas (sin nuevas rutas; `/ui/foundations` ahora está expuesta también desde sidebar y overview).
- TOC sin anchors muertos: las 8 entradas (`philosophy`, `colors`, `typography`, `spacing`, `radii`, `elevation`, `motion`, `iconography`) apuntan a contenido real.

### Deuda técnica detectada

- **Texto de los principles aún hardcoded en namespace**: `PRINCIPLE_KEYS` mapea a iconos en código. Si en el futuro se añaden o reordenan principios, hay que tocar dos sitios (i18n + array TS). Aceptable para 6 entradas, revisitar si se acerca a 10+.
- **Re-mount de Replay grid hace flicker en navegadores lentos**: las 6 cells se desmontan y vuelven a montar al pulsar el botón. En la práctica imperceptible, pero si se vuelve molesto, alternativa: usar `Element.getAnimations()` y resetear `currentTime = 0`.
- **Inconsistencia visual de radii en `/ui` aún sin resolver** (deuda heredada de B6a.1). Algunos paneles del showcase usan `rounded-xl` (12px tailwind), otros `--radius-md` (4px). Foundations entera usa `--radius-md`. Resolución pendiente para el cierre de B6.

### Estado del bloque B6a — CERRADO

- 8/8 secciones de Foundations con contenido real.
- Página integrada en sidebar y overview.
- `docs/foundations.md` documenta la estructura para futuros bloques de B6.
- Próximo: **B6b — Inputs básicos**.

---

## [B6a.2] Foundations — Typography, Spacing, Radii — 2026-05-05

Segundo sub-bloque de B6a. Añade tres secciones reales (Typography con 4 subsecciones, Spacing y Radii) a la página `/ui/foundations`. Cinco de las ocho secciones planeadas ya tienen contenido. Pendiente B6a.3 (Elevation, Motion, Iconography + integración en sidebar y overview de `/ui`).

### Cambios

- **TypographySection** (`foundations-content.tsx`):
  - **Families**: dos cards lado a lado (Sans/Inter, Mono/JetBrains Mono) con palabra grande, pangram en su familia y stack CSS literal en font-mono.
  - **Scale**: 7 `TypeSpecimen` en orden descendente (Display 3XL → Caption XS) con sample, specs (--fs, --lh, --fw, --tracking) y usage hint.
  - **Weights**: 4 cards con "Aa" enorme, los dos tokens que llegan a 530 (`--fw-semibold` y `--fw-bold`) llevan nota italic "Capped at 530". Para `--fw-medium` y `--fw-bold` se muestra el remap "(was 500)" y "(was 700)" en `--text-subtle`.
  - **Tracking**: nota italic con `t('tracking.note')` + tabla de 4 `TokenRow` (tracking-tight, normal, wide, wider). Cada preview renderiza la palabra muestra con su `letter-spacing` aplicado; tracking-wider usa "OVERLINE LABEL" en uppercase + `--fs-xs` para evidenciar el uso real.
- **SpacingSection** (`id="spacing"`): 11 `TokenRow` (`--space-0` a `--space-16`). Las barras preview tienen el ancho hardcodeado en px equivalente al token (no usan `var()`) para garantizar la magnitud absoluta visualmente. `--space-0` se renderiza como una línea hairline al 50% de opacidad.
- **RadiiSection** (`id="radii"`): dos paneles de "firma Mercury" arriba (Cards are sharp con cuadrado `--radius-lg: 0px`, Controls are pills con botón `--radius-pill: 32px`) + lista completa de los 7 tokens (`--radius-sm` a `--radius-full`) con previews proporcionales y labels para los tres con uso semántico fijo (Cards / Controls / Large CTAs / Badges, dots).
- **i18n** (`foundations-en.json` + `foundations-es.json`):
  - Subtitles y descriptions de typography/spacing/radii reescritos para alinearse con la prosa propuesta en el plan (más específica sobre tokens y px).
  - Nueva clave `foundations.typography.tracking.note` añadida en EN y ES.
  - Política híbrida confirmada: nombres de fonts (Inter, JetBrains Mono), valores (px, em, rem), tokens (`--xxx`) y términos (tracking, font-weight) en inglés en ambos idiomas.

### Decisiones tomadas

- **Containers de Scale, Tracking, Spacing, Radii (lista)**: todos envueltos en un panel border + `--radius-md` con `padding-x: 6` para que los `TokenRow`/`TypeSpecimen` (que usan `last:border-0`) queden visualmente enmarcados. Sin esto, las filas quedan flotando sobre el background sin afordancia de "tabla".
- **Spacing previews con px hardcodeado**, no `var(--space-N)`. Razón: el preview comunica la magnitud absoluta del token; si el sistema redefine los px en el futuro, la imagen seguiría siendo correcta a su valor histórico.
- **Radii previews con dos formas distintas** (cuadrados 24×24, rectángulos para pill, círculo para full): el ancho se ajusta al uso real (un pill cuadrado no leería como pill). El `border-radius` también va hardcodeado en px por la misma razón que en spacing.
- **Weight cards renderizan "Aa" con el peso aplicado vía `font-weight` numérico**, no vía `var(--fw-*)`. Razón: necesitamos un valor numérico literal para que el navegador interpole el variable font correctamente. El nombre del token sigue mostrándose junto a la "Aa" para enseñar el binding.
- **Pangrams en EN, no traducidos**: el patrón "The quick brown fox" es un pangram universal usado para muestras tipográficas. Traducirlo no añade valor pedagógico y rompe el patrón reconocido por diseñadores. Coherente con la política híbrida (los nombres propios y patrones técnicos van en inglés).

### Verificación

- `npm run lint` → 0 errores nuevos. Solo dos warnings preexistentes (no relacionados).
- `npm run build` → 38 páginas (sin nuevas rutas, solo se enriquece `/ui/foundations`).

### Deuda técnica detectada

- **TOC con 3 anchors muertos restantes** (`#elevation`, `#motion`, `#iconography`). Se completan en B6a.3.
- **`TypeSpecimen` se renderiza con `font-weight: var(--fw-*)` en `style` inline**. Esto funciona en navegadores modernos (CSS variables resuelven a número), pero es frágil con TypeScript: hay que castear `as unknown as number`. Si en el futuro se añaden más specs, considerar pasar el peso numérico directamente y dejar el token name solo como decoración.
- **No se ha extraído la TOC a componente reusable** (decisión de B6a.1, sin cambios). La TOC sigue inline.

### Estado del bloque B6a

- Foundations: 5 de 8 secciones con contenido (philosophy, colors, typography, spacing, radii).
- Pendientes: elevation, motion, iconography + integración en sidebar y `/ui` overview (B6a.3).

---

## [B6a.1] Foundations — setup, shell, Philosophy, Colors — 2026-05-05

Primer sub-bloque de B6a (Foundations). Deja en pie el setup común, el shell de la página `/ui/foundations` (hero + TOC sticky), y dos secciones reales con contenido (Design philosophy + Colors). Las secciones Typography / Spacing / Radii (B6a.2) y Elevation / Motion / Iconography + integración (B6a.3) quedan pendientes — ya tienen entradas en la TOC y namespace i18n preparado.

### Cambios

- **Tokens de motion ampliados** (`src/styles/tokens.css`): añadidos `--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)` y `--dur-slow: 240ms`. Necesarios para overlays simétricos (popovers, dialogs en B6e). Documentación inline de los 5 valores se hará en B6a.3.
- **5 componentes auxiliares de showcase** (`src/features/ui-showcase/components/`):
  - `token-swatch.tsx` — server component. Cuadrado de color + label + descripción + var name + value opcional. Soporta tres tamaños y patrón cuadriculado para mostrar transparencias.
  - `token-row.tsx` — server component. Fila de tabla con `--var-name`, value, preview y label. Para listar tokens en formato denso.
  - `type-specimen.tsx` — server component. Muestra un sample de texto con sus specs (--fs-*, --lh-*, --fw-*, --tracking-*) en una columna lateral. Soporta familia mono.
  - `accent-scope.tsx` — client component. Exporta `<AccentScope>` (provider + wrapper con `data-accent`) y `<AccentPicker>` (6 botones circulares). Comparten estado vía Context. El picker scoped solo afecta al subárbol del Scope, nunca al sidebar/topbar.
  - `philosophy-card.tsx` — server component. Card con icon en cuadrado tinted accent, título y descripción. Usa `--radius-md` (no `nx-card` sharp) por consistencia visual con los otros paneles del showcase.
- **Namespace i18n `foundations`** (en + es):
  - `src/features/ui-showcase/i18n/foundations-en.json` y `foundations-es.json`
  - Estructura completa: title, subtitle, toc (8 anchors + label), philosophy (6 principles), colors (surfaces, text, borders, semantic, accent), typography, spacing, radii, elevation, motion, iconography, localization.
  - Política híbrida aplicada: hex, rem, px, ms, OKLCH, nombres de tokens (--xxx), nombres de fonts y de accents en inglés en ambos idiomas.
  - Registrado como 9º namespace en `src/i18n/request.ts` siguiendo el patrón existente.
- **Página `/ui/foundations`** (split server/client):
  - `page.tsx` (server, 16 líneas) — exporta `generateMetadata` y renderiza `<FoundationsContent />`.
  - `foundations-content.tsx` (client) — Hero + layout grid con TOC sticky a la derecha en lg+ y main area con las secciones. Solo Philosophy y Colors renderizan contenido; los otros 6 anchors apuntan a IDs que no existen aún (los siguientes sub-bloques los añadirán).
- **Ruta**: `routes.ui.foundations = '/ui/foundations'` añadida en `src/config/routes.ts`. NO se ha enlazado todavía desde el sidebar ni desde el overview de `/ui` — esa integración es de B6a.3.

### Decisiones tomadas durante el trabajo

- **Foundations como namespace top-level** (no anidado dentro de `uiShowcase`): se carga desde un archivo separado (`foundations-{locale}.json`) en `request.ts`. Razón: la página es lo bastante densa para justificar su propio namespace, y mantenerla separada permite recargar/cachear la prosa de Foundations independientemente del resto del showcase.
- **`AccentScope` envuelve toda la página**, no solo la subsección Accent. Razón: el toggle también re-tematiza el color del botón demo, el texto demo y los swatches accent/accent-muted que viven dentro de la sección Colors. Encapsular más arriba garantiza que cualquier uso futuro de `var(--accent)` dentro de Foundations responda al picker.
- **`PhilosophyCard` con `--radius-md` (4px)**, no con `nx-card` (0px). El sistema base es sharp, pero los paneles internos del showcase ya usan radii suaves (ver `ShowcaseDemo` con `rounded-xl`). Mantener consistencia visual con el patrón existente del showcase pesa más que la firma sharp del sistema en este contexto documental.
- **TOC inline dentro de `foundations-content.tsx`**, no extraído a un componente reusable: solo lo usa una página por ahora. Si en B6a.3 más páginas lo necesitan, se extrae entonces (YAGNI).
- **Iconos para los principios**: Lucide. Para `pill_controls` usado `RectangleHorizontal` (Lucide no exporta `Pill` ni `Capsule`).
- **`AccentPicker` con hex hardcodeados a la variante DARK** del accent: el botón debe mostrar el color de marca independientemente del tema activo (dark/light) y del accent activo. Confirmado correcto según verificación visual.

### Verificación

- `npm run lint` → 0 errores nuevos. Solo dos warnings preexistentes (no relacionados): `_data` unused en settings-form, `<img>` en avatar.
- `npm run build` → 38 páginas generadas (incluye `/en/ui/foundations` y `/es/ui/foundations`).

### Deuda técnica detectada

- **Inconsistencia visual de radii en `/ui`**: los paneles de showcase mezclan `rounded-xl` (12px tailwind), `rounded-lg`, y ahora `--radius-md` (4px) en `PhilosophyCard`. Sería deseable unificar a una convención única (probablemente `--radius-md` para todos los paneles de showcase). NO bloqueante para B6a.1; revisitar al cerrar B6a.
- **`AccentScope` y next-themes**: el provider no comprueba el `data-accent` de la raíz `<html>` (gestionado por `ui.store`). Esto es deliberado — el scope debe poder elegir un accent distinto al global. Si el usuario cambia el accent global mientras está en `/ui/foundations`, los dos coexisten sin sincronización. Documentar este comportamiento si se hace soporte de "reset to global accent" en el picker.
- **TOC con anchors muertos**: los IDs `typography`, `spacing`, `radii`, `elevation`, `motion`, `iconography` aparecen en la TOC pero no existen en el DOM hasta B6a.2/B6a.3. Click hace nada. Aceptable para B6a.1 porque la TOC se completa al cerrar B6a.

### Sub-bloques pendientes para cerrar B6a

- **B6a.2** — Typography, Spacing, Radii.
- **B6a.3** — Elevation, Motion, Iconography + integración: añadir `foundations` al sidebar (sección UI), incrementar el `count` de Foundations en `/ui` overview, posiblemente extraer la TOC a componente reusable, considerar `docs/foundations.md`.

---

## [B6.0] Auditoría del catálogo de componentes — 2026-05-04

Sub-bloque de reconocimiento previo al bloque B6 (Completar UI Showcase). Sin cambios en código de producción: solo lectura del repo y generación del documento de auditoría.

### Salida

- Nuevo: [`docs/B6-audit.md`](./B6-audit.md) — matriz completa por categoría (Foundations, Inputs básicos, Inputs avanzados, Display, Feedback, Data, Charts, Layout) con estado EXISTS / EXISTS_PARTIAL / EXISTS_UNUSED / TO BUILD para cada entrada del catálogo objetivo.

### Recuento ejecutivo

- 32 componentes/patterns React encontrados en el repo (sin contar showcase utilities, providers, ni form compositions).
- 59 entradas en el catálogo objetivo de B6.
- 5 ya documentados en `/ui` (Toasts, Empty states, Error states, Skeletons, Sidebar).
- 22 existen y solo necesitan página de showcase.
- 32 a construir (incluye los 7 de Foundations).
- 7 componentes encontrados fuera del catálogo objetivo (ThemeToggle, LanguageSwitcher, ActivityFeed, 3 forms, SessionProvider). Recomendación: INCLUDE para ThemeToggle y LanguageSwitcher; SKIP para forms/provider; REVIEW para ActivityFeed.

### Deuda técnica detectada (a resolver durante B6)

15 puntos identificados; los más relevantes:

- Avatar usa `useState` sin `'use client'` (frágil).
- Card no expone prop `variant` pese a tener clases CSS `nx-card--raised`/`--interactive`.
- DataTable: selección y paginación internas no extraíbles; Pagination debe extraerse como componente independiente.
- KPICard vive en `features/dashboard/` y debe relocarse antes de documentarse en `/ui`.
- Componentes definidos pero sin uso real: Checkbox, Switch, Label (validar API en su primer caso de uso real durante B6).
- Spinner inlineado en Button — extraer para reutilización.
- Tooltip sin portal (recortado en contenedores con overflow).
- DropdownMenu sin keyboard navigation completo.
- Inconsistencia de API entre charts (color como string vs series[] vs color por datum).
- Native `<select>` vs design system "premium" — decidir si documentar como "nativo intencional" o construir Select avanzado.
- `.nx-kbd`/`.nx-divider`/`.nx-dot` solo CSS; sin React component.

### Recomendaciones para sub-bloques B6a–B6h

- Documento propone orden: Foundations → Inputs básicos → Display → Inputs avanzados (parte 1) → Feedback → Data → Charts → Layout, con Inputs avanzados parte 2 (Date/Time/File/Dropzone) como sub-bloque separado o fuera de B6.
- Foundations en una única página `/ui/foundations` con secciones internas, no 7 páginas separadas.
- Pre-work bloqueante por sub-bloque (Card variant antes de B6c, Avatar `'use client'` antes de B6c, KPICard relocation antes de B6g) listado en el documento.
- Riesgo principal identificado: Date picker. Recomendación: adoptar `react-day-picker` y wrappear, reservar custom para bloque posterior.

### Estado al cerrar el sub-bloque

- `npm run lint` → sin cambios respecto a antes (no se modificó código de producción).
- `npm run build` → sin cambios.
- Archivos nuevos en `docs/`: 1 (`B6-audit.md`).

---

## [B5 — Cierre del bloque] Sistema i18n completo — 2026-05-04

### Resumen ejecutivo

Cierre formal del bloque B5. NexDash incorpora un sistema de internacionalización completo basado
en next-intl, con dos idiomas iniciales (en, es), routing localizado con prefijo siempre presente,
detección automática + cookie persistente, y selector de idioma con dos variantes. Toda la app —
páginas, componentes, formularios, mensajes de feedback, metadata, error boundaries — funciona
en ambos idiomas con cambio inmediato sin recarga.

### Componentes y patrones implementados (B5a → B5c.5b)

- **next-intl v4 con App Router**: routing `localePrefix: 'always'`, `getRequestConfig` carga
  mensajes por locale + feature, proxy compone middleware intl con auth.
- **2 idiomas iniciales** (en, es) con guía documentada para añadir más.
- **Detección automática + cookie**: `NEXT_LOCALE` (gestionada por next-intl), Accept-Language
  como fallback, `defaultLocale` como último recurso.
- **LanguageSwitcher con dos variants**: `compact` (topbar, dropdown) y `full` (settings, pill
  buttons). Hook `useLocaleSwitch` reutilizable para switchers personalizados.
- **Política híbrida**: jerga técnica de design systems en inglés (Toast, Sidebar, Skeleton,
  Variants, Props, API), prosa traducida.
- **Schema Zod factory pattern** para validaciones traducidas: `createXSchema(messages)` recibe
  los mensajes como parámetro y los inyecta en el schema.
- **Localized formatting** vía `useFormatter`: números, monedas, fechas, plurales ICU
  (`{count, plural, one {# component} other {# components}}`).
- **Strings por defecto centralizados** en `common.feedback.*` (EmptyState, ErrorState).
- **Bilingüe en `global-error.tsx`**: estilos inline + claves de traducción duplicadas (no puede
  acceder al CSS ni al provider de next-intl).
- **Snippets vs demos en /ui**: duplicación intencional — snippets de código en inglés hardcoded
  como referencia copy-paste; demos disparan strings traducidos al locale activo.
- **Sección "Localization" al final** de cada página /ui, con link a `/ui/i18n`.
- **PropsTable híbrida**: identificadores de código en inglés, descriptions traducidas, headers
  de columna traducidos.

### Métricas

- **18 rutas × 2 locales = 36 páginas** generadas en `npm run build`.
- **Archivos JSON de traducción**: 16 (1 common × 2 locales + 7 features × 2 locales).
- **Namespaces**: 8 (`common`, `auth`, `dashboard`, `analytics`, `users`, `reports`, `settings`,
  `uiShowcase`).
- **`uiShowcase` namespace**: ~480 líneas por locale, cubre el showcase completo (overview, toasts,
  empty states, error states, skeletons, sidebar, i18n, plus el subnav, props table, localization
  note y los componentes genéricos).
- **`common.json`**: ~106 líneas por locale.
- **0 errores de lint** (`npm run lint`).
- **0 errores de build** (`npm run build`).

### Limitaciones conocidas y deuda técnica

- **Skeleton aria-labels** (`Loading table`, `Loading list`, etc.) permanecen en inglés. Razón:
  los componentes son server-renderable y añadir `useTranslations` los forzaría a client. La
  alternativa (prop opcional con fallback en cada call site) tiene un coste de invasividad alto
  para un string brevemente audible solo a usuarios de screen reader. Aceptable como deuda
  técnica documentada hasta que aparezca un caso de uso que lo justifique.
- **Los snippets de código en /ui** muestran strings de ejemplo hardcoded en inglés
  ("User created successfully", "Failed to load users", etc.). Esto es **intencional** — el
  desarrollador que copia el snippet añadirá `t()` en su propio código. La demo asociada al botón
  sí usa `t()` para mostrar el toast en el idioma activo.
- **No se ha añadido un tercer idioma para validar la guía**. La guía está documentada en
  `docs/i18n.md#cómo-añadir-un-idioma-nuevo`, pero no se ha probado en producción.

### Estado del repo al cierre

```
Routes (App Router):
├ /[locale]                       (dashboard home)
├ /[locale]/login
├ /[locale]/analytics
├ /[locale]/reports               + /scheduled, /archived
├ /[locale]/settings
├ /[locale]/users                 + /[id]
└ /[locale]/ui                    + /toasts, /empty-states, /error-states,
                                    /skeletons, /sidebar, /i18n
```

`npm run lint` → 0 errores · 2 warnings preexistentes ajenos al bloque B5.
`npm run build` → OK, 36 páginas generadas, sin errores de TypeScript.

### Pendiente — Bloque B6

Completar UI Showcase con foundations, charts, data-table y los componentes restantes.

---

## [B5c.5b] Sección /ui — 3 páginas restantes + auditoría transversal — 2026-05-04

### Resumen ejecutivo

Segundo y último sub-bloque del refactor de la sección `/ui`. Se localizan las 3 páginas
restantes (`/ui/skeletons`, `/ui/sidebar`, `/ui/i18n`), se aplican las convenciones establecidas
en B5c.5a, se realiza una auditoría transversal de toda la app en ambos idiomas y se documenta
el cierre formal del bloque B5.

### Páginas refactorizadas

Las tres páginas siguen el patrón split server/client cuando hay `generateMetadata` + interactividad:

- `src/app/[locale]/(dashboard)/ui/skeletons/page.tsx` (server, metadata) +
  `skeletons-content.tsx` (`'use client'`, contiene `useState` para el toggle real/skeleton)
- `src/app/[locale]/(dashboard)/ui/sidebar/page.tsx` (server completo, async, usa `getTranslations`
  y `t.rich` para los footnotes con código inline)
- `src/app/[locale]/(dashboard)/ui/i18n/page.tsx` (server, metadata) +
  `i18n-content.tsx` (`'use client'`, contiene `LanguageSwitcher` y `t.rich` para el header)

### Texto enriquecido con `t.rich` y tags inline

Las descripciones que mezclan prosa con identificadores de código (`<code>`) o énfasis
(`<strong>`) usan `t.rich` con callbacks que producen los elementos React:

```tsx
const code = (chunks: React.ReactNode) => (
  <code className="font-mono bg-[var(--surface-raised)] px-1 py-0.5 rounded">{chunks}</code>
);
{t.rich('sections.persistence.footnote', { code })}
```

JSON correspondiente:
```json
"footnote": "Store key: <code>nexdash-sidebar</code> in localStorage. Implemented in <code>src/store/sidebar.store.ts</code>."
```

### ICU escape para llaves literales

Para mostrar literalmente texto con llaves (`{sectionId}.{kebab-label}`) que de otro modo serían
interpretadas como placeholders de ICU MessageFormat, se usan single quotes:

```json
"<code>'{sectionId}.{kebab-label}'</code>"
```

Las single quotes activan modo literal en ICU; el resultado renderizado es
`<code>{sectionId}.{kebab-label}</code>`.

### Resultado de la auditoría transversal

**Inconsistencias encontradas y resueltas:**

1. **Dashboard KPI titles** (`dashboard-content.tsx`): "Total Revenue", "Active Users",
   "Total Sessions", "Conversion Rate" estaban hardcoded. Añadidos a
   `dashboard.kpis.{totalRevenue,activeUsers,totalSessions,conversionRate}`.
2. **Dashboard table headers** (`dashboard-content.tsx`): columnas "Revenue", "Conversions", "ROI"
   estaban hardcoded. Añadidas a `dashboard.campaigns.columns.{revenue,conversions,roi}`.
3. **Analytics KPI titles** (`analytics-content.tsx`): "Revenue", "New Users", "Sessions",
   "Conversion Rate" hardcoded. Añadidos a
   `analytics.kpis.{revenue,newUsers,sessions,conversionRate}`.
4. **Analytics daily table headers**: "Revenue", "Users", "Sessions", "Conv. Rate" hardcoded.
   Añadidos a `analytics.dailyTable.columns.{revenue,users,sessions,conversionRate}`.
5. **Toaster aria-label** (`toaster.tsx`): "Notifications" hardcoded. Refactorizado a
   `useTranslations('common.navigation').notifications`.

**Inconsistencias documentadas como deuda técnica aceptable:**

1. **Skeleton aria-labels** ("Loading table", "Loading list", "Loading form", "Loading metric",
   "Loading chart", "Loading user"): permanecen en inglés. Componentes server-renderable;
   añadir `useTranslations` los forzaría a `'use client'` solo para un string brevemente audible
   a usuarios de screen reader.

**Patrones verificados sin issues:**

- Todos los `placeholder=` usan `t()`.
- Todos los `header:` en columnas de DataTable usan `t()`.
- Todos los status mappings (`row.status`) pasan por `t(...status.{value})`.
- Forms (login, settings, user) totalmente traducidos vía Zod factory pattern.
- Topbar, sidebar, breadcrumbs traducidos.
- `error.tsx`, `loading.tsx`, `not-found.tsx`, `global-error.tsx` traducidos.

### Card de Feedback en /ui

- `feedback.count = 4` (toasts, empty states, error states, skeletons) — verificado.
- `layout.count = 1` con `href = routes.ui.sidebar` — actualizado: previamente era
  `count: 0, href: null` con badge "Coming soon". Ahora la card de Layout es navegable y muestra
  "1 component" / "1 componente".
- `i18n` no aparece en cards del overview por decisión del bloque (es un sistema, no un
  componente). Sí está en el sidebar bajo `UI`.

### Archivos modificados

**Páginas refactorizadas:**
- `src/app/[locale]/(dashboard)/ui/skeletons/page.tsx` (split) + `skeletons-content.tsx` (nuevo)
- `src/app/[locale]/(dashboard)/ui/sidebar/page.tsx` (refactor completo, server async)
- `src/app/[locale]/(dashboard)/ui/i18n/page.tsx` (split) + `i18n-content.tsx` (nuevo)
- `src/app/[locale]/(dashboard)/ui/page.tsx` (layout count + href)

**Archivos de traducción ampliados:**
- `src/features/ui-showcase/i18n/en.json` — namespaces `skeletons`, `sidebar`, `i18n`
- `src/features/ui-showcase/i18n/es.json` — equivalentes en español
- `src/features/dashboard/i18n/{en,es}.json` — kpis y columns adicionales
- `src/features/analytics/i18n/{en,es}.json` — kpis y dailyTable.columns adicionales

**Componentes touched durante la auditoría:**
- `src/app/[locale]/(dashboard)/dashboard-content.tsx` — KPI titles + table headers vía `t()`
- `src/app/[locale]/(dashboard)/analytics/analytics-content.tsx` — KPI titles + daily columns vía `t()`
- `src/components/feedback/toast/toaster.tsx` — aria-label vía `useTranslations`

### Verificación

- `npm run lint` → 0 errores
- `npm run build` → OK, 36 páginas generadas
- Test programático del ICU escape: `'{sectionId}.{kebab-label}'` → `{sectionId}.{kebab-label}` ✓

---

## [B5c.5a] Sección /ui — componentes ui-showcase + 4 páginas — 2026-05-04

### Resumen ejecutivo

Primera parte del refactor de la sección `/ui` (showcase del sistema de diseño). Se localizan los
componentes genéricos del feature `ui-showcase` (`ShowcaseDemo`, `PropsTable`, `UiSubnav`) y las
páginas `/ui` (overview), `/ui/toasts`, `/ui/empty-states`, `/ui/error-states`. Se establece la
convención específica de la sección y la duplicación intencional entre snippet y demo.

### Política de traducción para la sección /ui

Términos que se mantienen en inglés (no se traducen):
- Nombres de componentes: Toast, Empty state, Error state, Sidebar, Dropdown, Popover, Dialog
- Jerga universal de design systems: Variants, Props, API, Methods, States
- Términos técnicos por convención: Hook, Component, Utility, Token
- Nombres de propiedades, métodos, variables y tipos en snippets de código

Términos que se traducen:
- Títulos descriptivos de página y subtítulos explicativos
- Descripciones de cada section, demo y prop individual
- Labels de los botones de las demos ("Show success" → "Mostrar success")
- Textos de status como "Coming soon"
- Mensajes ejemplo dentro de las demos cuando son prosa visible al usuario

### Decisión clave: snippets en inglés vs demos en idioma activo

Las páginas de showcase tienen demos donde se renderizan los componentes con strings de ejemplo.
La decisión adoptada introduce una **duplicación intencional**:

- Los snippets de código visibles permanecen **en inglés hardcoded** (referencia copy-paste para
  el desarrollador). Si copia el snippet, lo envuelve con `t()` en su propio código.
- La demo asociada al botón usa `t()` y muestra el texto traducido al locale activo.

Ejemplo en `/ui/toasts`:

```tsx
// Snippet (visible en inglés siempre)
code={`toast.success('User created successfully');`}

// Demo (texto traducido al locale activo)
<Button onClick={() => toast.success(t('demos.success.message'))}>
  {t('demos.success.label')}
</Button>
```

Razón: el snippet es educativo (muestra cómo se escribe el código), mientras que la demo es
funcional (muestra cómo se ve el componente al usuario final). Mezclarlos confundiría al
desarrollador que clona la plantilla.

### Decisión: nombres de componentes en metadata

Los `<title>` de pestaña mantienen el nombre del componente:
- `Toasts` en ambos locales
- `Empty states` / `Estados vacíos`
- `Error states` / `Estados de error`

Regla: si es un nombre propio del componente del design system, queda en inglés (Toasts).
Si es un concepto genérico traducible, se traduce (Empty states).

### Estructura del namespace `uiShowcase`

```
metadata.{title,description}
common.{comingSoon,copyCode,codeCopied,yes,soon}
propsTable.columns.{prop,type,default,required,description}
subnav.groups.{components,layout}
subnav.items.{overview,toasts,emptyStates,errorStates,skeletons,sidebar}
overview.header.{title,subtitle}
overview.componentCount             ← plural ICU: {count, plural, one {# component} other {# components}}
overview.categories.{key}.{label,description}
toasts.metadata.title
toasts.header.{title,subtitle}
toasts.sections.{variants,withDescription,withAction,persistent,queue,api,methods}.{title,description}
toasts.demos.{success,error,warning,info,withDescription,withAction,persistent,queue}.{title,label,message,...}
toasts.props.{title,description,duration,action}
toasts.methods.{success,error,warning,info,dismiss,clear}
emptyStates.* (mismo patrón)
errorStates.* (mismo patrón)
localizationNote.{title,description,linkLabel}
```

### Componentes refactorizados

- `src/features/ui-showcase/components/showcase-demo.tsx`
  - `aria-label="Copy code"` → `t('common.copyCode')`
  - `toast.success('Copied to clipboard')` → `t('common.codeCopied')`
- `src/features/ui-showcase/components/props-table.tsx`
  - Headers de columnas (Prop, Type, Default, Required, Description) → `t('propsTable.columns.*')`
  - `'Yes'` → `t('common.yes')`
- `src/features/ui-showcase/components/ui-subnav.tsx`
  - `NAV_ITEMS` ahora contiene claves de traducción en lugar de strings literales (mismo patrón que
    `sidebar.config.ts`). El componente resuelve cada `label` y `group` con `useTranslations`.
  - `'soon'` → `t('common.soon')`
- `ShowcaseSection` y `ShowcaseGrid` no requieren cambios (no contienen strings hardcoded).

### Páginas refactorizadas

Las cuatro páginas se dividieron en dos archivos para soportar `generateMetadata` localizada:

- `src/app/[locale]/(dashboard)/ui/page.tsx` — server component, async, con `generateMetadata`
- `src/app/[locale]/(dashboard)/ui/toasts/page.tsx` + `toasts-content.tsx` (`'use client'`)
- `src/app/[locale]/(dashboard)/ui/empty-states/page.tsx` + `empty-states-content.tsx`
- `src/app/[locale]/(dashboard)/ui/error-states/page.tsx` + `error-states-content.tsx`

Mismo patrón ya consolidado en `settings/page.tsx` y `reports/page.tsx`.

### Sección "Localization" al final de cada página

Se añade un `<ShowcaseSection title={tNote('title')}>` al final de cada página de showcase con
una descripción que recuerda al desarrollador que en producción los strings deben envolverse en
`t()`, y un `Link` a `/ui/i18n` ("See the i18n guide" / "Ver la guía de i18n"). Patrón a aplicar
también en B5c.5b para las páginas restantes.

### PropsTable: política mixta

`PropsTable` traduce únicamente los **headers de columna** y la celda `Yes`. Los valores de las
celdas (nombres de props, tipos, valores por defecto) **nunca se traducen**: son identificadores
de código. Los `description` de cada `PropDoc` se construyen desde el componente padre con `t()`,
de modo que el array `props` se crea dentro del componente cliente, no en el module scope.

### Plural ICU para el contador de componentes

`overview.componentCount` usa formato ICU plural:

```json
"componentCount": "{count, plural, one {# component} other {# components}}"
```

```tsx
t('overview.componentCount', { count })
// count=1 → "1 component"
// count=4 → "4 components"
```

Equivalente en español con la misma forma plural (`# componente` / `# componentes`).

### Archivos modificados

- `src/features/ui-showcase/i18n/en.json` — namespace expandido (~210 líneas)
- `src/features/ui-showcase/i18n/es.json` — equivalente en español
- `src/features/ui-showcase/components/showcase-demo.tsx`
- `src/features/ui-showcase/components/props-table.tsx`
- `src/features/ui-showcase/components/ui-subnav.tsx`
- `src/app/[locale]/(dashboard)/ui/page.tsx`
- `src/app/[locale]/(dashboard)/ui/toasts/page.tsx` + `toasts-content.tsx` (nuevo)
- `src/app/[locale]/(dashboard)/ui/empty-states/page.tsx` + `empty-states-content.tsx` (nuevo)
- `src/app/[locale]/(dashboard)/ui/error-states/page.tsx` + `error-states-content.tsx` (nuevo)

### Verificación

- `npm run lint` → 0 errores (2 warnings preexistentes ajenos al bloque)
- `npm run build` → OK, las 36 páginas se generan (18 rutas × 2 locales)
- Cambio de idioma desde topbar en cualquier página `/ui/*`: header, sections, demos y subnav se
  actualizan inmediatamente. Snippets permanecen en inglés (intencional).
- Disparar cada demo de toast/empty/error en `/es/*` produce strings en español; en `/en/*`, en inglés.
- `<title>` de pestaña localizado por página.

### Pendiente — B5c.5b

Páginas `/ui/skeletons`, `/ui/sidebar`, `/ui/i18n` + cierre del bloque B5.

---

## [B5c.1] Chrome global + auth — strings hardcodeados — 2026-05-04

### Resumen ejecutivo

Extracción de todos los strings visibles de los componentes de layout (sidebar, topbar, breadcrumbs,
theme-toggle) y de la página y formulario de login. Tras este bloque, el cambio de idioma es inmediato
y consistente en todo el chrome del dashboard: sidebar, topbar, breadcrumbs y login.

### Convenciones de naming establecidas

Las claves de traducción siguen estructura jerárquica `namespace.categoria.elemento`:

- `common.actions.*` — acciones genéricas (save, cancel, delete…)
- `common.status.*` — estados de carga/error/vacío
- `common.navigation.*` — search placeholder, notification labels
- `common.sidebar.sections.*` — títulos de secciones del sidebar
- `common.sidebar.items.*` — labels de items de navegación
- `common.sidebar.actions.*` — expand/collapse/logOut del sidebar
- `common.userMenu.*` — profile, settings, signOut, signingOut
- `common.theme.*` — switchToLight, switchToDark
- `common.metadata.*` — title, description para `<head>`
- `auth.login.*` — todo el namespace del formulario de login

### Patrón sidebar.config.ts — Opción A (claves en lugar de strings)

Los labels en `sidebar.config.ts` son ahora claves de traducción relativas al namespace `common`:

```ts
// Antes
{ type: 'link', label: 'Dashboard', href: routes.dashboard, icon: LayoutDashboard }

// Después
{ type: 'link', label: 'sidebar.items.dashboard', href: routes.dashboard, icon: LayoutDashboard }
```

El componente que renderiza resuelve la clave con `useTranslations('common')`. El config sigue siendo
una constante estática — no necesita ser función ni recibir `t` como parámetro.

### Patrón useTranslations vs getTranslations

- Client components (ya marcados `'use client'`): `useTranslations('namespace')`
- Server components: `getTranslations({ locale, namespace: 'ns' })` (async)
- No se añade `'use client'` solo para traducir — se convierte en async server component

Componentes que se marcaron `'use client'` para poder usar el hook: `sidebar-link.tsx`, `sidebar-section.tsx`.

### Patrón Zod con mensajes traducidos

El schema de login se convierte en factory que recibe los mensajes traducidos:

```ts
// lib/validators/auth.schema.ts
export function createLoginSchema(messages: { emailRequired: string; emailInvalid: string; passwordRequired: string }) {
  return z.object({ email: z.string().min(1, messages.emailRequired).email(messages.emailInvalid), ... });
}

// login-form.tsx (client component)
const t = useTranslations('auth');
const schema = createLoginSchema({
  emailRequired: t('login.validation.emailRequired'),
  emailInvalid: t('login.validation.emailInvalid'),
  passwordRequired: t('login.validation.passwordRequired'),
});
```

### Metadata localizada

`[locale]/layout.tsx` añade `generateMetadata` con title template:
```ts
title: { default: t('metadata.title'), template: `%s · ${t('metadata.title')}` }
```

`(auth)/login/page.tsx` tiene su propio `generateMetadata` con título del locale activo.

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/messages/en/common.json` | Añadidas secciones `navigation`, `sidebar`, `userMenu`, `theme`, `metadata` |
| `src/messages/es/common.json` | Idem en español |
| `src/features/auth/i18n/en.json` | Expandido con `form`, `errors`, `validation`, `demo`, `welcomeBack` |
| `src/features/auth/i18n/es.json` | Idem en español |
| `src/lib/validators/auth.schema.ts` | Schema → factory `createLoginSchema(messages)` |
| `src/components/layout/sidebar/sidebar.config.ts` | Labels → claves de traducción |
| `src/components/layout/sidebar/sidebar-link.tsx` | `'use client'` + `useTranslations` |
| `src/components/layout/sidebar/sidebar-group.tsx` | `useTranslations` |
| `src/components/layout/sidebar/sidebar-section.tsx` | `'use client'` + `useTranslations` |
| `src/components/layout/sidebar/sidebar-popover.tsx` | `useTranslations` |
| `src/components/layout/sidebar/sidebar.tsx` | `useTranslations` para aria-labels |
| `src/components/layout/breadcrumbs.tsx` | `useTranslations`; labels → claves |
| `src/components/layout/topbar.tsx` | `useTranslations`; pageTitles → claves; search placeholder; user menu |
| `src/components/layout/theme-toggle.tsx` | `useTranslations`; tooltip traducido |
| `src/app/[locale]/layout.tsx` | `generateMetadata` con title template localizado |
| `src/app/[locale]/(auth)/login/page.tsx` | Server component async; `getTranslations`; subtitle traducido |
| `src/components/forms/login-form.tsx` | `useTranslations('auth')`; schema dinámico; todos los strings |

### Build

36 páginas, TypeScript: sin errores.

---

## [B5b] Selector de idioma + integración en UI — 2026-05-04

### Resumen ejecutivo

Se implementa el componente `LanguageSwitcher` con dos variantes (compact para topbar, full para
Settings). Se añade la showcase page `/ui/i18n`. La infraestructura de i18n queda integrada
visualmente: el usuario puede cambiar de idioma tanto desde el topbar como desde Settings → Appearance.

### Decisiones clave

**Dos variantes en un componente**: `compact` (dropdown con flag + código de locale en topbar) y
`full` (pill buttons para Settings). Un solo componente con un prop `variant` evita duplicar la
lógica del hook y mantiene un único punto de importación.

**`router.replace` en lugar de `router.push`**: El cambio de idioma no añade entrada al historial del
navegador. Si el usuario pulsa "Atrás" no vuelve al idioma anterior — eso sería desorientador.

**Sin toast en cambio de idioma**: El cambio es instantáneo y visible (toda la UI cambia de idioma).
Un toast sería redundante y en cualquier caso estaría en el idioma recién seleccionado, no en el
anterior. Consistente con cómo lo hacen la mayoría de productos.

**Cookie gestionada por next-intl**: No se escribe la cookie `NEXT_LOCALE` manualmente. next-intl
la actualiza automáticamente al navegar a una ruta con prefijo diferente. El hook solo llama a
`router.replace(pathname, { locale: newLocale })`.

**Strings de Language en `settings` namespace**: Las etiquetas de la sección Language en Settings
("Language", "Choose your display language") van en `src/features/settings/i18n/{locale}.json` bajo
`appearance.language.*`. Consistente con el patrón de namespace por feature.

### Archivos creados

| Archivo | Descripción |
|---|---|
| `src/components/i18n/language-switcher/use-locale-switch.ts` | Hook: `useLocale` + `router.replace` |
| `src/components/i18n/language-switcher/language-switcher.tsx` | Componente con variantes compact/full |
| `src/components/i18n/language-switcher/index.ts` | Barrel de exports |
| `src/app/[locale]/(dashboard)/ui/i18n/page.tsx` | Showcase page del LanguageSwitcher |

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/components/layout/topbar.tsx` | Añadido `<LanguageSwitcher variant="compact" />` antes del bell |
| `src/app/[locale]/(dashboard)/settings/page.tsx` | Añadida sección Language en Appearance card |
| `src/features/settings/i18n/en.json` | Añadido `appearance.language.{label,description}` |
| `src/features/settings/i18n/es.json` | Idem en español |
| `src/config/routes.ts` | Añadido `ui.i18n: '/ui/i18n'` |
| `src/components/layout/sidebar/sidebar.config.ts` | Añadido link i18n en UI → Components |
| `src/components/layout/breadcrumbs.tsx` | Añadido `i18n` en routeLabels y uiGroupLabel |

### Build

36 páginas generadas (34 de B5a + `/[locale]/ui/i18n` × 2 locales). TypeScript: sin errores.

---

## [B5a] Infraestructura i18n — 2026-05-04

### Resumen ejecutivo

Se instala y configura next-intl v4 con App Router. Se establece el routing con prefijo de
locale siempre presente (`/en/*`, `/es/*`), se integra el middleware de i18n con la lógica
de auth existente, y se crea la estructura completa de archivos de traducción por feature.
No se extraen strings reales — solo se valida el sistema end-to-end con strings de prueba.

### Decisiones clave

**`localePrefix: 'always'`**: Todas las URLs llevan prefijo, incluyendo el locale por defecto.
Razón: URLs consistentes, mejor SEO, sin ambigüedad. Alternativa `'as-needed'` omite el
prefijo del locale por defecto (`/` para inglés) pero complica el proxy y el matching.

**next-intl v4 (4.11.0)**: Versión instalada. API compatible con la spec:
`requestLocale: Promise<string|undefined>` en `getRequestConfig`, `createMiddleware(routing)`,
`createNavigation(routing)`, `defineRouting(config)`.

**Namespaces por feature**: Los strings de cada feature viven en su directorio `i18n/` junto
al código del feature. `common.json` solo para strings verdaderamente transversales. Esta
organización evita el archivo monolítico de traducciones y mantiene cohesión feature/texto.

**Composición de proxy (intl primero, auth después)**: El middleware de next-intl resuelve
el locale antes de aplicar auth. Si el usuario visita `/users` sin sesión, el intl middleware
detectaría que `/users` necesita prefijo, pero la auth intercepta antes de esa redirección
para ir directamente a `/en/login`. Evita el doble redirect (`/` → `/en/` → `/en/login`).

**`localeDetection: true`**: Detecta locale de cookie `NEXT_LOCALE` y header `Accept-Language`.
El usuario nuevo sin cookie obtiene el locale del browser. El usuario recurrente recibe su
preferencia guardada. B5b añadirá el selector manual en la UI.

**Páginas como `ƒ (Dynamic)`**: Las páginas eran `○ (Static)` en B4. Con i18n, `getMessages()`
en el layout y `cookies()` en el root layout las convierte en dinámicas. Esperado y aceptable
para un dashboard autenticado.

### Archivos creados

| Archivo | Descripción |
|---|---|
| `src/config/i18n.ts` | `locales`, `defaultLocale`, `LOCALE_COOKIE`, labels, flags |
| `src/i18n/routing.ts` | `defineRouting` con locales, prefix, cookie, detection |
| `src/i18n/navigation.ts` | `Link`, `useRouter`, `usePathname`, `redirect` localizados |
| `src/i18n/request.ts` | `getRequestConfig` que carga mensajes de todos los features |
| `src/messages/en/common.json` | Strings transversales en inglés |
| `src/messages/es/common.json` | Strings transversales en español |
| `src/features/{feature}/i18n/en.json` | Strings de prueba en inglés (×7 features) |
| `src/features/{feature}/i18n/es.json` | Strings de prueba en español (×7 features) |
| `src/app/[locale]/layout.tsx` | Layout del locale: NextIntlClientProvider + Providers |
| `docs/i18n.md` | Documentación completa del sistema i18n |
| `.claude/rules/i18n.md` | Reglas de navegación, strings y namespaces para el agente |

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `next.config.ts` | `createNextIntlPlugin('./src/i18n/request.ts')` |
| `src/config/index.ts` | Re-exporta `src/config/i18n.ts` |
| `src/app/layout.tsx` | Root layout: async, lee locale de cookie para `<html lang>` |
| `src/proxy.ts` | Compone `createMiddleware(routing)` + lógica de auth |
| `src/app/[locale]/*` | Todos los archivos de `(auth)/` y `(dashboard)/` movidos aquí |
| `src/components/layout/sidebar/sidebar-link.tsx` | `Link` de `@/i18n/navigation` |
| `src/components/layout/sidebar/sidebar-popover.tsx` | `Link` de `@/i18n/navigation` |
| `src/components/layout/sidebar/sidebar.tsx` | `usePathname` de `@/i18n/navigation` |
| `src/components/layout/sidebar/use-expanded-groups.ts` | `usePathname` de `@/i18n/navigation` |
| `src/components/layout/breadcrumbs.tsx` | `usePathname`, `Link` de `@/i18n/navigation` |
| `src/components/layout/topbar.tsx` | `usePathname` de `@/i18n/navigation` |
| `src/components/auth/session-provider.tsx` | `useRouter` de `@/i18n/navigation` |
| `src/components/forms/login-form.tsx` | `useRouter` de `@/i18n/navigation` |
| `src/hooks/use-logout-action.ts` | `useRouter` de `@/i18n/navigation` |
| `src/features/ui-showcase/components/ui-subnav.tsx` | `Link`, `usePathname` de `@/i18n/navigation` |
| Todos los `error.tsx` del dashboard | `useRouter` de `@/i18n/navigation` |
| `[locale]/(dashboard)/page.tsx` | `useTranslations('dashboard')` para verificación e2e |

### Verificación

```
npm run lint  → 0 errores (2 warnings pre-existentes)
npm run build → 34 páginas generadas (17 rutas × 2 locales), sin errores
```

Build route map:
- `/[locale]` → dashboard, `/[locale]/analytics`, `/[locale]/login`, `/[locale]/reports/*`
- `/[locale]/settings`, `/[locale]/ui/*`, `/[locale]/users`, `/[locale]/users/[id]`
- `/api/auth/*` permanece fuera del segmento `[locale]`

---

## [B4 — Cierre del bloque] Sistema de feedback completo — 2026-05-04

### Resumen ejecutivo

B4 cubre el diseño, construcción e integración completa del sistema de feedback visual de NexDash.

**Componentes construidos (B4a–B4c):**
- `Toast` — singleton con 4 variantes, duración configurable, hover-pause, cola FIFO, animaciones entrada/salida
- `EmptyState` — 3 variantes (default, search, error) con ilustraciones SVG adaptables a theme y accent
- `ErrorState` — 2 tamaños (default, compact) con detalles técnicos en dev mode
- Skeletons tipados: `KpiCardSkeleton`, `ChartSkeleton`, `TableSkeleton`, `ListSkeleton`, `FormSkeleton`, `UserCardSkeleton`
- Sidebar avanzado: guía vertical continua en sub-items, sección UI unificada con grupos colapsables, breadcrumbs virtuales

**Páginas integradas (B4d):**
- Dashboard home: KPIs, AreaChart, DataTable de campaigns, ActivityFeed
- Analytics: KPIs, LineChart, DonutChart, tabla diaria con filtros de rango
- Users list: tabla con filtros, EmptyState search/default, confirmación Dialog en delete, toasts CRUD
- Users detail: UserCardSkeleton + FormSkeleton, EmptyState not-found, toast en update
- Reports: TableSkeleton, ErrorState, toast simulado para descarga
- Settings: FormSkeleton, toast en profile update, Appearance sin toast (cambio síncrono)
- Login: errores inline (no toast), welcome toast en login, signed-out toast en logout

**Patrones establecidos:**
1. `isLoading → TypedSkeleton` / `isError → ErrorState` / `!data → EmptyState` / datos → contenido
2. Toast en el componente, nunca en el hook; mensajes en pasado y concisos
3. Errores de validación inline; errores de auth inline (no toast)
4. Acciones destructivas con Dialog de confirmación antes de mutación
5. `mutateAsync` + try/catch para dialogs que quedan abiertos en error; `mutate` + callbacks para fire-and-forget
6. `error.tsx` de ruta → `EmptyState variant="error"` + useRouter; `loading.tsx` → skeletons tipados
7. Skeletons con `aria-busy="true"`, ErrorState con `role="alert"`, EmptyState con `role="status"`

**Estado al cierre:** lint 0 errores (2 warnings pre-existentes), build verde, 20 páginas generadas.

---

## [B4d.3] Integración de feedback — Settings + Login + Revisión final — 2026-05-04

### Resumen ejecutivo

Tercer y último sub-bloque de B4d. Integración de feedback en Settings y Login (formularios con
particularidades propias), seguida de una revisión transversal de todo el bloque B4 para detectar
y resolver inconsistencias. Cierre formal del bloque.

### Settings

**Profile section**: el `SettingsForm` tenía un `onSubmit` simulado (sleep 500ms) sin feedback.
Se añaden `toast.success('Profile updated')` en éxito y `toast.error('Failed to update profile')` en error.
El try/catch ya está preparado para el reemplazo por una mutation real.

**Appearance section**: no se añaden toasts. El theme toggle y el accent picker son cambios síncronos
en localStorage/next-themes — el feedback es el propio cambio visual inmediato. Un toast de "Accent changed"
sería ruido sin aporte informativo.

**`settings/loading.tsx`**: reescrito con `FormSkeleton fields={4} showButton` para la sección Profile y
skeletons específicos para los controles de Appearance (swatches de tema + círculos de accent).

**`settings/error.tsx`**: reescrito con `EmptyState variant="error"` + `useRouter` (estándar de route-level errors).
Antes usaba un layout custom con `AlertTriangle` inline.

### Login

**Errores de autenticación**: ya estaban inline con `AlertCircle` desde B3c. Correcto — los errores de auth
no van a toast porque el mensaje debe persistir hasta el siguiente intento, no desaparecer automáticamente.

**Button loading**: ya tenía `loading={isPending}` desde B3c. No hay cambios.

**Welcome toast**: se añade `toast.success(\`Welcome back, ${session.user.name}!\`)` en el callback `onSuccess`
de `login.mutate()`. El `Toaster` está montado en `providers.tsx` (root layout), por lo que el toast
persiste a través de la navegación cliente-side al dashboard.
`authHandler.login()` devuelve `AuthSession` con `user.name`, disponible directamente en el callback.

**Signed-out toast**: se añade `toast.info('Signed out')` en `use-logout-action.ts` antes de `router.push(routes.login)`.
Misma garantía de persistencia — el Toaster está en el root layout, no en el layout del dashboard.
Se descartó la técnica de query param `?goodbye=true` por complejidad innecesaria.

### Revisión transversal

Inconsistencias detectadas y resueltas:

| Inconsistencia | Archivo | Resolución |
|---|---|---|
| `analytics/error.tsx` usaba layout custom (`AlertTriangle` inline) | `analytics/error.tsx` | Reescrito con `EmptyState variant="error"` + `useRouter` |
| `analytics/loading.tsx` usaba raw Skeleton blobs para charts y KPIs | `analytics/loading.tsx` | Reescrito con `KpiCardSkeleton`, `ChartSkeleton`, `TableSkeleton` tipados |
| `(dashboard)/loading.tsx` (home) usaba raw blobs para charts y custom para KPIs | `loading.tsx` | Reescrito con `KpiCardSkeleton`, `ChartSkeleton`, `TableSkeleton`, `ListSkeleton` |

Sin inconsistencias en:
- Toasts en componentes (no en hooks) ✓
- Mensajes en pasado y concisos ✓
- Errores de validación inline (react-hook-form) ✓
- Errores de auth inline (login-form) ✓
- `aria-busy` en todos los skeletons tipados ✓
- `role="alert"` en ErrorState ✓
- `role="status"` en EmptyState ✓
- Dialog de confirmación antes de delete ✓
- Invalidación de queries en todas las mutations ✓

### Deuda técnica pospuesta (B5+)

- El `SettingsForm` simula la mutation con `sleep(500)` — no hay handler ni hook real para settings.
  Cuando se conecte la API, crear `settingsHandler.updateProfile()` + `useUpdateProfile()` siguiendo
  el patrón establecido. El toast ya está en el componente.
- `UserCardSkeleton` (avatar h-10 + texto pequeño) no coincide exactamente con el perfil xl del
  usuario en `users/[id]/page.tsx` (avatar xl + h2 + badges). Riesgo de CLS menor. Resolver
  creando un `UserProfileSkeleton` dedicado cuando haya ancho de banda.

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/components/forms/settings-form.tsx` | Toast.success/error en onSubmit |
| `src/app/(dashboard)/settings/loading.tsx` | FormSkeleton + skeletons específicos para Appearance |
| `src/app/(dashboard)/settings/error.tsx` | EmptyState variant="error" + useRouter |
| `src/components/forms/login-form.tsx` | Welcome toast en onSuccess de login |
| `src/hooks/use-logout-action.ts` | toast.info('Signed out') antes de router.push |
| `src/app/(dashboard)/analytics/error.tsx` | EmptyState variant="error" + useRouter (era custom inline) |
| `src/app/(dashboard)/analytics/loading.tsx` | KpiCardSkeleton + ChartSkeleton + TableSkeleton (eran blobs) |
| `src/app/(dashboard)/loading.tsx` | KpiCardSkeleton + ChartSkeleton + TableSkeleton + ListSkeleton (eran blobs) |

### Verificación

```
npm run lint  → 0 errores (2 warnings pre-existentes sin cambio)
npm run build → 20 páginas generadas, sin errores
```

---

## [B4d.2] Integración de feedback — Users + Reports — 2026-05-04

### Resumen ejecutivo

Se conectan los componentes de feedback con las páginas de Users (list, detail) y Reports
(overview). A diferencia de B4d.1, estas páginas tienen mutations de CRUD, por lo que se
integra el sistema de toasts en todas las acciones: create, update, delete. Se añade
confirmación de acciones destructivas (delete user) mediante Dialog. Se corrigen las
inconsistencias previas en loading/error de route-level.

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/app/(dashboard)/users/page.tsx` | TableSkeleton, ErrorState, EmptyState (search/default), delete confirmación con Dialog, toasts en create y delete. |
| `src/app/(dashboard)/users/[id]/page.tsx` | UserCardSkeleton + FormSkeleton en loading, EmptyState variant="error" en not-found, ErrorState para isError, toast en update. |
| `src/app/(dashboard)/reports/page.tsx` | TableSkeleton, ErrorState, handleDownload con toast.info + toast.success secuencial. |
| `src/app/(dashboard)/users/error.tsx` | Reescrito con EmptyState variant="error" + useRouter (estándar de route-level errors). |
| `src/app/(dashboard)/reports/error.tsx` | Reescrito con EmptyState variant="error" + useRouter. |
| `src/app/(dashboard)/users/loading.tsx` | TableSkeleton en lugar de raw Skeleton bars. |
| `src/app/(dashboard)/reports/loading.tsx` | TableSkeleton en lugar de raw Skeleton bars. |
| `src/components/feedback/skeleton/form-skeleton.tsx` | Añadido `aria-busy="true"` y `aria-label="Loading form"` (omitido en B4d.1). |
| `src/components/feedback/skeleton/user-card-skeleton.tsx` | Añadido `aria-busy="true"` y `aria-label="Loading user"` (omitido en B4d.1). |
| `docs/feedback.md` | Nueva sección "Mutations and toasts". |
| `.claude/rules/feedback.md` | Reglas de mutations y toasts. |

### Inconsistencias previas detectadas y corregidas

1. **Mutations sin feedback** — `deleteUser.mutate(row.id)` ejecutaba el delete silenciosamente. `createUser.mutateAsync(values)` y `updateUser.mutateAsync(...)` tampoco mostraban feedback. Todas las mutations tienen ahora toasts de éxito y error.

2. **Delete sin confirmación** — El botón Trash2 ejecutaba el delete directamente. Corregido: click en Trash2 → `setDeleteTarget(row)` → Dialog de confirmación con descripción del usuario → `confirmDelete()` con toast.

3. **Detail page con skeletons hardcodeados** — La página `/users/[id]` tenía un skeleton inline con `Skeleton` primitivos en lugar de `UserCardSkeleton` y `FormSkeleton`. Corregido.

4. **"User not found" con UI custom** — La página de detalle usaba un `<div>` custom en lugar de `EmptyState variant="error"`. Corregido.

5. **isError sin manejar en users y reports** — Si las queries fallaban, las páginas mostraban el estado de DataTable con datos vacíos (`data ?? []`). Corregido con `ErrorState` y `onRetry`.

6. **error.tsx con UI custom** — `users/error.tsx` y `reports/error.tsx` tenían inline icons y divs. Corregido con `EmptyState variant="error"` según el estándar del feedback.md.

7. **loading.tsx con raw Skeleton bars** — Ambos `loading.tsx` usaban `h-11 w-full` bars apiladas en lugar de `TableSkeleton`. Corregido.

8. **FormSkeleton y UserCardSkeleton sin aria-busy** — Omitido en B4d.1. Corregido en este bloque.

9. **Download button con onClick vacío** — `onClick={() => {}}`. Corregido con `handleDownload(row)` que dispara `toast.info` seguido de `toast.success` tras 1.5s.

### Decisiones técnicas

**Toast en componente, no en hook** — Los toasts viven en los componentes de página (`users/page.tsx`, `users/[id]/page.tsx`), no en `use-users.ts`. Esto permite que distintos consumidores del mismo hook usen mensajes diferentes. Los hooks solo gestionan `invalidateQueries` en `onSuccess`.

**mutateAsync + try/catch para create** — Al crear un usuario, el dialog debe cerrarse SOLO si la operación tiene éxito. Si falla, el dialog permanece abierto y el user puede reintentar. Por eso se usa `mutateAsync` con try/catch en lugar de `mutate` con callbacks.

**mutate + callbacks para delete** — El delete usa `mutate` con `onSuccess`/`onError` porque no hay estado de UI que preservar según el resultado (el dialog de confirmación se cierra en ambos casos).

**Download como mutation simulada** — Los reports usan mocks. El download se implementa con `toast.info` + `setTimeout(1500ms) + toast.success` para simular una operación async. Decisión: preferible a un link directo (que no tendría feedback) o a no implementarlo. Se documenta como patrón de demo.

**EmptyState variant="search" con clearFilters** — La página de users detecta `hasFilters = search || roleFilter || statusFilter` para distinguir entre "no users" y "no matches". `clearFilters()` resetea los tres filtros simultáneamente.

**No hay delete en detail page** — La página de detalle no tiene botón de delete. El delete se gestiona desde la lista. No se añade porque no existe en el diseño actual.

**UserCardSkeleton vs perfil real** — `UserCardSkeleton` está diseñado para filas de lista (avatar h-10, nombre h-4). El profile card real usa avatar xl (h-16), nombre h2, y múltiples badges/metadata. La tarea pide usar `UserCardSkeleton` — se usa, documentando que hay una discrepancia visual menor. El perfil de detalle podría tener su propio skeleton en el futuro si el CLS es relevante.

**Query invalidation verificada** — `useCreateUser`, `useUpdateUser`, y `useDeleteUser` ya tienen `invalidateQueries` en `onSuccess` en el hook. No se requirió modificación.

---

## [B4d.1] Integración de feedback — Dashboard home + Analytics — 2026-05-04

### Resumen ejecutivo

Se conectan los componentes de feedback (skeletons, ErrorState, EmptyState) con las páginas
`/dashboard` y `/analytics`. Todas las secciones con datos asíncronos implementan el patrón
estándar loading → error → empty → success. Se corrigen inconsistencias previas (texto
"Loading…" en charts) y se añaden atributos de accesibilidad a los componentes base.

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/app/(dashboard)/page.tsx` | Integración completa: skeleton, error y empty en todos los slots. |
| `src/app/(dashboard)/analytics/page.tsx` | Integración completa: skeleton, error y empty en todos los slots. |
| `src/components/feedback/error-state/error-state.tsx` | Añadido `role="alert"` en ambas variantes (default y compact). |
| `src/components/feedback/empty-state/empty-state.tsx` | Añadido `role="status"`. |
| `src/components/feedback/skeleton/kpi-card-skeleton.tsx` | Añadido `aria-busy="true"` y `aria-label="Loading metric"`. |
| `src/components/feedback/skeleton/chart-skeleton.tsx` | Añadido `aria-busy="true"` y `aria-label="Loading chart"` en ambas ramas (donut y resto). |
| `src/components/feedback/skeleton/table-skeleton.tsx` | Añadido `aria-busy="true"` y `aria-label="Loading table"`. |
| `src/components/feedback/skeleton/list-skeleton.tsx` | Añadido `aria-busy="true"` y `aria-label="Loading list"`. |
| `docs/feedback.md` | Nueva sección "Pattern of use" con patrón estándar y tabla de slot mapping. |
| `.claude/rules/feedback.md` | Reglas del patrón estándar al inicio del archivo. |

### Patrón estándar adoptado

Orden invariante: `isLoading` → `isError` → `!data?.length` → render real.

Cada sección gestiona sus tres estados localmente. Cuando múltiples slots comparten una
sola query (los 4 KPI de `useDashboardKPIs`, los 4 de `useAnalyticsMonthly`), el error se
muestra como un estado compartido que cubre todos los slots con `ErrorState size="compact"`
dentro de cada card — un error por query, no un error por KPI.

### Inconsistencias previas detectadas y corregidas

1. **Charts con "Loading…" en texto plano** — Dashboard y Analytics usaban `<div className="h-56 … text-sm">Loading…</div>` en lugar del skeleton tipado. Corregido: `ChartSkeleton type="area|bar|line|donut"`.

2. **`isError` ignorado en todas las queries** — Ninguna sección manejaba el estado de error. Queries fallidas producían secciones en blanco sin feedback. Corregido: todas las secciones muestran `ErrorState` con `onRetry`.

3. **`isError` en analytics KPIs mostraba valores falsos** — Si `useAnalyticsMonthly` fallaba, los KPI mostraban '—' con 0% de crecimiento (valores engañosos) en lugar de un estado de error. Corregido: error en monthly → 4 cards con `ErrorState compact`.

4. **DataTable con skeleton de barras horizontales en lugar de tabla** — El loading interno de `DataTable` mostraba `h-11` bars apiladas. En las páginas de Dashboard y Analytics, se reemplazó por `TableSkeleton` externo (que muestra estructura real de tabla con header y celdas). El prop `loading` de DataTable se mantiene disponible para otros usos.

5. **ActivityFeed sin estado vacío** — Si `activity` era un array vacío, `ActivityFeed` renderizaba un div vacío sin feedback. Corregido: `!activityLoading && !activity?.length` → `EmptyState variant="default" title="No recent activity yet"`.

6. **Accesibilidad ausente en componentes base** — Ningún skeleton tenía `aria-busy`, `ErrorState` no tenía `role="alert"`, `EmptyState` no tenía `role="status"`. Corregido en todos los componentes base.

### Decisiones técnicas

**Toasts en estas páginas** — No se añaden toasts para fallos de carga en páginas read-only. Razón: el `ErrorState` dentro de cada sección ya proporciona feedback visual contextual. Un toast adicional en el mismo momento sería redundante y ruidoso (el usuario ya ve el error state en el slot afectado). Los toasts de error se reservan para mutaciones y acciones explícitas del usuario (B4d.2).

**DataTable loading → TableSkeleton externo** — En lugar de modificar el loading interno de DataTable (que violaría la regla `components/ui/ → solo @lib/utils`), se controla el estado externamente: si `loading`, mostrar `TableSkeleton`; si no, renderizar `DataTable`. El prop `loading` de DataTable se omite en estos casos.

**EmptyState en tabla diaria de Analytics** — La tabla diaria usa el `emptyMessage` nativo de `DataTable` ("No data found.") para el estado vacío, ya que el componente ya incluye este comportamiento. Añadir `EmptyState` externo requeriría duplicar la lógica. Documentado como excepción válida en `.claude/rules/feedback.md`.

**Accesibilidad: role="alert" vs aria-live="polite"** — Se usa `role="alert"` en `ErrorState` (ambas variantes) porque los errores de carga son condiciones importantes que merecen anuncio inmediato por AT. El `role="status"` en `EmptyState` es polite porque un estado vacío no es urgente.

---

## [B4c.5 Refinement] Línea guía vertical + sección UI unificada — 2026-05-04

### Resumen ejecutivo

Refinamiento visual de los sub-items del sidebar (línea vertical guía en lugar de
punto) y reorganización de las secciones UI en una sola sección con grupos colapsables
`Components` y `Layout`.

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/components/layout/sidebar/sidebar-group.tsx` | Contenedor de hijos con `ml-[22px] border-l border-[var(--border-strong)]` como línea guía continua. |
| `src/components/layout/sidebar/sidebar-link.tsx` | Eliminado el dot indicator (`<span className="w-1 h-1 rounded-full …" />`). Eliminado `pl-8` de sub-items (la indentación la aporta el contenedor del grupo). |
| `src/components/layout/sidebar/sidebar.config.ts` | Secciones `ui-components`, `ui-layout`, `reference` eliminadas. Nueva sección única `ui` con link `Overview` + grupos `Components` y `Layout`. |
| `src/components/layout/breadcrumbs.tsx` | Inyección de segmento virtual entre `/ui` y sus sub-páginas: `Dashboard / UI / Components / Toasts`. El segmento de grupo es texto plano (sin ruta). |
| `src/app/(dashboard)/ui/sidebar/page.tsx` | Actualizado CONFIG_EXAMPLE, descripción de Tier 3 y sección UiSubnav. |
| `docs/architecture.md` | Nueva sección "Sections with mixed items" y "Sub-item visual hierarchy". |
| `.claude/rules/sidebar.md` | Añadidas reglas: mezcla de links/grupos en sección, línea guía como estándar. |

### Decisiones técnicas

**Línea guía vs dot** — La línea vertical continua (`border-l` en el contenedor de
hijos) ofrece una jerarquía visual más clara que el punto por ítem. Referencia: Linear,
Vercel, Notion usan este patrón. La línea está en `var(--border-strong)` (nunca en el
color accent) para que sea sutil y no compita con el estado activo del ítem.

**Implementación como border-l del contenedor** — En lugar de añadir un pseudo-elemento
o un `div` decorativo por ítem, el `border-l` en el div contenedor de hijos genera la
línea de una vez. Esto simplifica el DOM y garantiza que la línea es continua entre ítems.
El margen `ml-[22px]` alinea el borde con el centro del icono del grupo padre
(`px-3 = 12px + icon_center = 9px = 21px`).

**Estado activo vs línea guía** — El ítem activo muestra `bg-[var(--accent-muted)]` con
`rounded-lg`. La línea guía pasa detrás del background del ítem activo (visible en los
gaps entre ítems). Decisión: no interrumpir la línea — la continuidad es más premium que
el estilo "indicador lateral izquierdo con línea cortada". El background del ítem activo
ya es suficiente indicador visual sin necesidad de un marcador lateral adicional.

**Sub-items en modo colapsado (popover)** — El SidebarPopover renderiza sus propios links
sin pasar por el contenedor de hijos de `SidebarGroup`. Por tanto, la línea guía no
aparece en el popover, que tiene su propio estilo de navegación secundaria.

**Sección UI unificada** — Tres secciones separadas (`UI · Components`, `UI · Layout`,
`Reference`) se consolidan en una sola sección `UI` con link suelto `Overview` y dos
grupos colapsables `Components` (4 ítems) y `Layout` (1 ítem). El modelo de datos ya
soporta mezcla de links y grupos en una sección — no se requirió ningún cambio de tipos.

**Breadcrumbs con segmento virtual** — Los grupos `Components` y `Layout` no tienen ruta
propia (`/ui/components` no existe). El breadcrumb inyecta un segmento virtual no-linkable
entre `/ui` y la sub-página. Esto mantiene la trazabilidad sin crear rutas ficticias.
Implementado con un map `uiGroupLabel` y un `splice` post-procesado en el array de crumbs.
Solo aplica a paths con exactamente 2 segmentos donde el primero es `ui`.

**Iconos de grupos Components y Layout** — `Layers` (Components) y `PanelLeft` (Layout).
Ambos ya estaban disponibles en lucide-react y usados en `ui/page.tsx`. `Overview` reutiliza
`Sparkles` del anterior nodo Reference.

### Descartado

- **Interrumpir la línea guía en ítem activo**: requería estado adicional y CSS más complejo.
  El resultado visual con línea continua + background accent es más limpio.
- **Añadir un indicador lateral izquierdo (type left-bar)**: el background con `rounded-lg`
  es el estándar del design system; un indicador lateral añade inconsistencia.
- **Virtual route `/ui/components`**: crear una ruta vacía solo para el breadcrumb añade
  mantenimiento sin valor. El segmento inyectado como texto plano es suficiente.

---

## [B4c.5 Cleanup] Unificación de navegación UI — 2026-05-03

### Resumen ejecutivo

Se elimina el sub-sidebar interno de la sección `/ui` y se reemplaza con
secciones propias del sidebar principal (`UI · Components`, `UI · Layout`).
El patrón `UiSubnav` se conserva como documentación de alternativa.

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/components/layout/sidebar/sidebar.config.ts` | Añadidas secciones `ui-components` y `ui-layout` (sin iconos). Sección `template` renombrada a `reference`. |
| `src/components/layout/sidebar/sidebar-link.tsx` | Dot fallback en modo collapsed cuando el link no tiene icono. |
| `src/app/(dashboard)/ui/layout.tsx` | Eliminado — las páginas /ui usan el layout estándar del dashboard. |
| `src/app/(dashboard)/ui/sidebar/page.tsx` | Añadida sección "Alternative: in-page sub-navigation" con demo de UiSubnav. |

### Decisiones técnicas

**Secciones propias vs grupo único** — Se eligió separar los items de UI en
secciones propias (`UI · Components`, `UI · Layout`) en lugar de un único grupo
colapsable tipo "UI ▾". Razón: con 5 items en total no hay ganancia en colapsarlos,
y las secciones separadas son más escaneables visualmente.

**Sin iconos en secciones UI** — Los items de `UI · Components` y `UI · Layout`
no tienen icono. El contraste visual entre "Workspace" (iconos) y "UI sections"
(texto) diferencia navegación de producto de navegación de template. En modo
collapsed, los items sin icono muestran un pequeño punto (fallback añadido a
`sidebar-link.tsx`).

**Breadcrumbs sin cambio** — Los breadcrumbs se derivan naturalmente del path URL.
`/ui/toasts` → Dashboard / UI / Toasts. No se añade un nivel "Components"
intermedio porque añadiría complejidad especial que no refleja la URL real. La
jerarquía del sidebar (sección, ítem) es navegación visual, no jerárquica de URLs.

**UiSubnav conservado como patrón** — En lugar de eliminar el componente, se
documenta en `/ui/sidebar` como alternativa para secciones que no deben ocupar
espacio en el sidebar principal (e.g., sección admin avanzada en un producto real).
El demo renderiza el componente real (no una maqueta), con el ítem activo según la
ruta actual.

### Descartado

- **Grupo colapsable "UI ▾" en Template**: con solo 5 items y sin justificación
  de colapso, un grupo sería ruido. Las secciones planas son más directas.
- **Reinsertar el sub-sidebar en /ui**: su utilidad era cuando no existía el
  sidebar principal con secciones. Con el nuevo modelo, el sub-sidebar duplica
  información y consume espacio.

---

## [B4c.5] Sidebar avanzado — 2026-05-03

### Resumen ejecutivo

El sidebar pasa de un array hardcodeado a un modelo de datos declarativo. Soporta
secciones con título, links directos, y grupos colapsables con hasta 2 niveles.
La expansión de grupos es persistente y se combina con auto-expansión por ruta.
En modo colapsado, los grupos muestran un popover al hover en lugar de expandirse
inline.

### Archivos creados / modificados

| Archivo | Cambio |
|---|---|
| `src/config/constants.ts` | Añadido `SIDEBAR.STORAGE_KEY` |
| `src/config/routes.ts` | `reports` pasa de string a objeto `{overview, scheduled, archived}`. Añadida `ui.sidebar`. |
| `src/store/sidebar.store.ts` | Nuevo store: `expandedGroups: string[]`, `toggleGroup`, `setGroupExpanded`. Persiste en `nexdash-sidebar`. |
| `src/components/layout/sidebar/sidebar.types.ts` | Tipos: `SidebarBadge`, `SidebarLink`, `SidebarGroup`, `SidebarItem`, `SidebarSection`, `SidebarConfig`. |
| `src/components/layout/sidebar/sidebar.config.ts` | Config con secciones "Workspace" (con grupo "Reports") y "Template". |
| `src/components/layout/sidebar/use-expanded-groups.ts` | Hook: combina store + pathname activo para calcular el set efectivo de grupos abiertos. |
| `src/components/layout/sidebar/sidebar-link.tsx` | Link con soporte de badge, count, disabled, y modo child (indentado). |
| `src/components/layout/sidebar/sidebar-group.tsx` | Grupo colapsable: cabecera con chevron + animación `grid-template-rows`. En collapsed: delega a `SidebarPopover`. |
| `src/components/layout/sidebar/sidebar-popover.tsx` | Popover portalled a `document.body`, posicionado a la derecha del sidebar, hover+focus activado, Escape cierra. |
| `src/components/layout/sidebar/sidebar-section.tsx` | Sección con título opcional + renders de links y grupos. |
| `src/components/layout/sidebar/sidebar.tsx` | Componente principal refactorizado (orquestador). |
| `src/components/layout/sidebar/index.ts` | Barrel público. |
| `src/components/layout/sidebar.tsx` | Eliminado (reemplazado por el directorio). |
| `src/app/(dashboard)/reports/scheduled/page.tsx` | Placeholder para la nueva ruta. |
| `src/app/(dashboard)/reports/archived/page.tsx` | Placeholder para la nueva ruta. |
| `src/styles/components.css` | Añadidas animaciones: `.nx-sidebar-collapse` (grid-rows), `.nx-popover-in` (scale-in). |
| `src/components/layout/breadcrumbs.tsx` | Añadidas labels: `sidebar`, `scheduled`, `archived`. |
| `src/components/layout/topbar.tsx` | Añadidos titles: `/reports/scheduled`, `/reports/archived`. |
| `src/features/ui-showcase/components/ui-subnav.tsx` | Añadido ítem "Sidebar" en grupo "LAYOUT". |
| `src/app/(dashboard)/ui/sidebar/page.tsx` | Página de showcase: estructura, configuración, persistencia, collapsed mode, API tables. |
| `docs/architecture.md` | Añadida sección "Sidebar": estructura, dos señales, collapsed mode, cómo añadir un grupo. |
| `.claude/rules/sidebar.md` | Reglas para futuras sesiones. |

### Decisiones técnicas

**`grid-template-rows` para la animación de colapso** — Se eligió la técnica
moderna `grid-template-rows: 0fr → 1fr` en lugar de `max-height` calculado.
Ventajas: no requiere medir el contenido en JS, la transición es suave (sin
"snap" al llegar al final), y funciona con contenido dinámico. El único requisito
es `min-height: 0; overflow: hidden` en el elemento hijo. Compatible con React
Compiler (cero estado local en el componente de animación).

**Dos señales de expansión** — La persistencia combinada usa `expandedGroups` en
el store para la elección manual, y una llamada a `setGroupExpanded` en
`useEffect` dentro de `useExpandedGroups` para la auto-expansión por ruta. Al
navegar a la ruta activa, el grupo se guarda en el store. Al cerrar el grupo
manualmente (mientras se está en esa ruta), se elimina del store. Si se regresa
a esa ruta, el cambio de pathname dispara de nuevo la auto-expansión. Este
comportamiento es natural: "estás en un sitio → su sección aparece abierta".

**Profundidad máxima 2 niveles** — Grupos dentro de grupos crea UX confusa y
complica la lógica de expansión. Si un dominio tiene muchos sub-ítems, la señal
correcta es una página dedicada con sub-sidebar (patrón `/ui`). La regla está
documentada en `sidebar.config.ts` y en las reglas de Claude.

**Popover portalled** — El popover se renderiza en `document.body` para evitar
clipping por `overflow: hidden` del layout. Usa el mismo `createPortal` +
SSR-guard que el Toaster. El delay de 150ms para cerrar permite mover el cursor
del icono al popover sin que desaparezca.

**Config en archivo separado vs. inline** — Separar `sidebar.config.ts` del
componente permite: (1) cambiar el sidebar sin tocar ningún componente, (2) tipo-
checking de la config frente al schema, (3) reutilizar la config en la página de
showcase y tests futuros.

### Descartado

- **`max-height` con valor fijo**: `max-height: 500px` con transición es un hack
  (el timing no es lineal porque el CSS no sabe la altura real). Se descartó en
  favor de `grid-template-rows`.
- **Grupos recursivos**: se descartó permitir grupos dentro de grupos. El modelo
  de 2 niveles es suficiente para el 99% de los casos y es mucho más fácil de
  mantener y documentar.
- **Estado `userClosed` para la auto-expansión**: se consideró trackear si el
  usuario había cerrado explícitamente el grupo activo. Se simplificó: navegar a
  una ruta re-expande su grupo siempre. Este comportamiento es más predecible y
  coincide con lo que hacen Linear y Vercel.

---

## [B4c] Empty states + Error states + Skeletons — 2026-05-03

### Resumen ejecutivo

Tercer bloque del sistema de feedback visual. Tres familias de componentes que
cubren los estados de vacío, error y carga de cualquier sección de la UI.
Además: actualización del `error.tsx` de ruta, creación de `global-error.tsx`,
y tres páginas de showcase en `/ui/`.

### Archivos creados / modificados

| Archivo | Cambio |
|---|---|
| `src/components/feedback/empty-state/empty-state.types.ts` | Props de `EmptyState` |
| `src/components/feedback/empty-state/illustrations/empty-default.tsx` | SVG inline: documento + bandeja |
| `src/components/feedback/empty-state/illustrations/empty-search.tsx` | SVG inline: lupa |
| `src/components/feedback/empty-state/illustrations/empty-error.tsx` | SVG inline: triángulo de advertencia |
| `src/components/feedback/empty-state/illustrations/index.ts` | Barrel de ilustraciones |
| `src/components/feedback/empty-state/empty-state.tsx` | Componente `EmptyState` |
| `src/components/feedback/empty-state/index.ts` | Barrel público |
| `src/components/feedback/error-state/error-state.types.ts` | Props de `ErrorState` |
| `src/components/feedback/error-state/error-state.tsx` | Componente `ErrorState` (default + compact) |
| `src/components/feedback/error-state/index.ts` | Barrel público |
| `src/components/feedback/skeleton/skeleton-base.tsx` | Primitiva con 5 variantes |
| `src/components/feedback/skeleton/kpi-card-skeleton.tsx` | Placeholder de KpiCard |
| `src/components/feedback/skeleton/chart-skeleton.tsx` | Placeholder de gráficos (bar/line/area/donut) |
| `src/components/feedback/skeleton/table-skeleton.tsx` | Placeholder de DataTable |
| `src/components/feedback/skeleton/list-skeleton.tsx` | Placeholder de listas/feeds |
| `src/components/feedback/skeleton/form-skeleton.tsx` | Placeholder de formularios |
| `src/components/feedback/skeleton/user-card-skeleton.tsx` | Placeholder de filas de usuario |
| `src/components/feedback/skeleton/index.ts` | Barrel público |
| `src/app/(dashboard)/error.tsx` | Reemplazado con `EmptyState variant="error"` + `useRouter` |
| `src/app/global-error.tsx` | Creado: HTML inline sin dependencias del design system |
| `src/features/ui-showcase/components/ui-subnav.tsx` | Eliminado `disabled: true` de 3 items |
| `src/app/(dashboard)/ui/page.tsx` | Feedback count 1→4, descripción actualizada |
| `src/app/(dashboard)/ui/empty-states/page.tsx` | Página de showcase: variantes, acciones, ilustraciones, API |
| `src/app/(dashboard)/ui/error-states/page.tsx` | Página de showcase: default, compact, dev details, snippet error.tsx |
| `src/app/(dashboard)/ui/skeletons/page.tsx` | Página de showcase: primitivas, compuestos, toggle skeleton/real, 5 tablas API |
| `docs/feedback.md` | Añadidas secciones empty states, error states, skeletons |
| `.claude/rules/feedback.md` | Añadidas reglas para los nuevos componentes |

### Decisiones técnicas

**Ilustraciones inline vs PNG/SVG externo** — Se eligieron componentes React con
SVG inline. Ventaja: las ilustraciones usan `fill="var(--accent)"` y otros CSS
custom properties, adaptándose automáticamente a los 6 temas de acento y a
light/dark mode. Con SVG externo (como `<img>`) no sería posible.

**`EmptyState` vs `ErrorState` para error.tsx** — `error.tsx` usa `EmptyState variant="error"`
(no `ErrorState`) porque el error de ruta necesita botones de navegación ("Go home")
además de retry, y `EmptyState` es más flexible para eso. `ErrorState` es mejor
para errores inline dentro de secciones de datos.

**`global-error.tsx` con inline styles** — Next.js's global error boundary se
renderiza antes de que el árbol CSS esté disponible. Los CSS custom properties
de Tailwind v4 dependen del HTML raíz con sus atributos `data-theme` y `data-accent`.
En un error crítico de React, esas clases no existen. Por eso se usan inline
styles puros con valores hardcoded.

**Toggle skeleton/real en showcase** — La página de skeletons incluye un
componente `ToggleComparison` (`'use client'`) que permite alternar entre el
skeleton y una representación del componente real para verificar visualmente
que no hay CLS. La `'use client'` en toda la página es el coste de esta feature.

**`SkeletonBase` con presets** — Los 5 presets (text, title, avatar, btn, card)
cubren la mayoría de los casos ad-hoc. Para casos específicos se pasan `width`
y `height` directamente. Los skeletons compuestos (TableSkeleton, etc.) comparten
el mismo `<Skeleton>` primitivo de shadcn/ui para consistencia visual.

### Descartado

- **Shimmer direccional**: se consideró un shimmer de izquierda a derecha
  (como Facebook/LinkedIn) en lugar del `animate-pulse` de Tailwind. Se descartó
  porque `animate-pulse` ya está configurado en el design system y añadir un
  shimmer custom requiere un `::before` con `translateX` que no funciona bien
  con `border-radius` variable.
- **`ErrorState` para error.tsx**: ver nota arriba — `EmptyState variant="error"`
  es más adecuado para errores de página completa.

---

## [B4b] Shell sección UI + página Toasts — 2026-05-03

### Resumen ejecutivo

Se crea la sección `/ui` del dashboard como documentación viva del design
system. Cada componente nuevo que se construya en el proyecto tendrá su página
dedicada aquí. La primera página documentada es el sistema de toasts (B4a).

### Archivos creados / modificados

| Archivo | Cambio |
|---|---|
| `src/config/routes.ts` | Rutas `ui.*` con todos los paths futuros pre-registrados |
| `src/components/layout/breadcrumbs.tsx` | Labels para segmentos `ui`, `toasts`, etc. |
| `src/components/layout/topbar.tsx` | Título "UI" para rutas `/ui*` |
| `src/components/layout/sidebar.tsx` | Grupo "Template" con ítem "UI" (icono Sparkles) |
| `src/components/feedback/toast/toast.types.ts` | Añadido `ToastAction` y campo `action` |
| `src/components/feedback/toast/toast.tsx` | Render del botón de acción inline |
| `src/features/ui-showcase/types/showcase.types.ts` | Tipos `PropDoc`, `SubnavItem` |
| `src/features/ui-showcase/components/showcase-section.tsx` | Agrupador de demos con título + separador |
| `src/features/ui-showcase/components/showcase-demo.tsx` | Demo individual: preview + snippet + copy |
| `src/features/ui-showcase/components/showcase-grid.tsx` | Rejilla de variantes (1–3 cols) |
| `src/features/ui-showcase/components/props-table.tsx` | Tabla de props: Prop/Type/Default/Required/Description |
| `src/features/ui-showcase/components/ui-subnav.tsx` | Sub-navegación lateral con grupos y estados disabled |
| `src/features/ui-showcase/index.ts` | Barrel público |
| `src/app/(dashboard)/ui/layout.tsx` | Layout de la sección: sub-sidebar + contenido |
| `src/app/(dashboard)/ui/page.tsx` | Overview: grid de categorías con estado "Coming soon" |
| `src/app/(dashboard)/ui/toasts/page.tsx` | Página de referencia completa del sistema de toasts |
| `docs/architecture.md` | Menciona `/ui` y `ui-showcase` |

### Decisiones técnicas

**Sub-sidebar vs tabs** — Se eligió sub-sidebar (izquierda fija, 208px).
Razón: el número de items va a crecer (~10 categorías en B5). Los tabs
horizontales se quedan cortos en width. Es el patrón estándar en Storybook,
Radix docs, shadcn/ui docs. Permite grupos con encabezados ("COMPONENTS",
"FOUNDATIONS", etc.).

**Sin syntax highlighting** — Los code snippets usan `<pre><code>` plano sin
shiki/prism. Motivo: ~200 LOC de implementación ahorrados, 0 dependencias
añadidas. Si en el futuro se quiere highlighting, se cambia en un solo sitio
(`ShowcaseDemo`).

**`action` en toasts** — La primera página de documentación reveló que el
campo `action` (especificado en el diseño de B4b) faltaba en la implementación
B4a. Se añadió de forma no-breaking: `ToastOptions.action` es opcional.

**Sub-sidebar sticky** — Usa `position: sticky; top: 0; self-start` dentro de
`main` (el scrolling container). Como `main` tiene `overflow-y: auto`, el
sticky es relativo a él, quedando justo bajo la topbar al hacer scroll.

**Rutas pre-registradas** — Se añaden a `routes.ui` todas las rutas futuras
(`emptyStates`, `errorStates`, `skeletons`) aunque las páginas no existan.
Ventaja: cuando se creen en B4c, no hay que tocar `routes.ts` ni `UiSubnav`.

**Categorías "Coming soon" en el overview** — Las categorías sin páginas se
renderizan como `<div>` (no `<Link>`) con `opacity-60`. No se usa `disabled`
en nada — los elementos simplemente no son interactivos.

### Patrón de página de componente

Cada página de showcases sigue esta estructura:

1. **Header**: título, descripción, import statement copiable
2. **Variants** (ShowcaseSection + ShowcaseGrid): 2 columnas con las variantes del componente
3. **Secciones opcionales**: with description, with action, states especiales
4. **API** (PropsTable): tabla de opciones/props
5. **Methods** (tabla manual): métodos del singleton o API del componente

---

## [B4a] Sistema de toasts propio — 2026-05-03

### Resumen ejecutivo

Sistema de notificaciones (toasts) implementado desde cero sin dependencias
externas. API de singleton `toast.success/error/warning/info` invocable
desde cualquier punto del código (dentro y fuera de React).

### Archivos creados / modificados

| Archivo | Cambio |
|---|---|
| `src/components/feedback/toast/toast.types.ts` | Tipos: `ToastItem`, `ToastVariant`, `ToastOptions` |
| `src/components/feedback/toast/toast.store.ts` | Zustand store: add/remove/clear, cola FIFO limitada a MAX_VISIBLE |
| `src/components/feedback/toast/toast.api.ts` | Singleton `toast`: accede al store via `getState()` |
| `src/components/feedback/toast/toast.tsx` | Componente individual: icono, border-left, hover-pause timer |
| `src/components/feedback/toast/toaster.tsx` | Portal a `document.body`, gestiona `exitingIds` para animación de salida |
| `src/components/feedback/toast/use-toast.ts` | Hook `useToast()` → `{ toasts, toast }` |
| `src/components/feedback/toast/index.ts` | Barrel público |
| `src/config/constants.ts` | Añadido `TOAST`: `MAX_VISIBLE`, `EXIT_DURATION_MS`, `DURATION` per variant |
| `src/styles/components.css` | Keyframes `nx-toast-in` / `nx-toast-out` + clases con timing |
| `src/app/providers.tsx` | `<Toaster />` registrado globalmente |
| `docs/feedback.md` | Documentación del sistema de toasts |
| `.claude/rules/feedback.md` | Reglas para futuras sesiones |

### Decisiones técnicas

**Sin Sonner ni react-hot-toast** — Se implementó desde cero para mantener
coherencia total con el design system y evitar una dependencia para ~200 LOC.

**Singleton fuera de React** — `toast.api.ts` usa `useToastStore.getState()`,
que es un acceso directo al store de Zustand sin necesidad de hooks. Permite
llamar `toast.success(...)` desde handlers HTTP, callbacks de mutations, etc.

**`exitingIds` en Toaster** — El store solo sabe qué toasts existen. La lógica
de animación de salida vive en el Toaster: al querer eliminar un toast, primero
se añade su id a `exitingIds` (trigger de `nx-toast-out`), y 300ms después se
llama `removeFromStore`. Este tiempo debe coincidir con `TOAST.EXIT_DURATION_MS`.

**`useCallback` para timer** — React Compiler/`react-hooks/refs` prohíbe
`ref.current = value` en render body. Se solvió usando `useCallback` con deps
explícitas (`item.id`, `item.duration`, `onRemove`) en lugar del patrón
ref-sync. Como `onRemove` es `useCallback([stableZustandAction])` en Toaster,
todos los deps son estables y el efecto solo se ejecuta al montar.

**Animación de salida con colapso de altura** — `nx-toast-out` anima en dos
fases: 0–60% slide a la derecha + fade, 60–100% colapso de `max-height`. Esto
evita que los toasts restantes "salten" cuando uno desaparece.

### Descartado

- **Sonner**: librería excelente pero innecesaria para un template sin Framer
  Motion. Añadiría 15 KB y estilos que no siguen los tokens del proyecto.
- **`onAnimationEnd`**: se consideró usar el evento `animationend` del DOM para
  saber cuándo quitar el toast. Se descartó en favor del `setTimeout` fijo ya
  que es más predecible y no depende de eventos del DOM que podrían no dispararse
  si el tab está en segundo plano.
- **"Remaining time" en hover-pause**: calcular el tiempo restante exacto
  (pausar en t=2300ms, reanudar con 1700ms) añade complejidad sin beneficio
  real para un template. Al deshovear se reinicia el timer completo.

---

## [B3] Cierre del bloque de auth — 2026-05-03

### Resumen ejecutivo

En tres sub-bloques consecutivos (B3a→c), NexDash pasó de no tener
autenticación a tener un sistema completo con cookies HttpOnly, protección de
rutas, hidratación del store y UI funcional.

**Lo conseguido:**
1. **Mock backend completo** (B3a) — 3 route handlers (`login`, `logout`, `me`)
   con sesiones en memoria, cookie HttpOnly y validación Zod en frontera.
2. **Proxy + hidratación** (B3b) — `proxy.ts` protege rutas, `SessionProvider`
   sincroniza la sesión con el store global (Zustand) via TanStack Query.
3. **UI funcional** (B3c) — formulario de login con validación y manejo de
   errores, botones de logout en topbar y sidebar, interceptor 401, resolución
   del limbo de cookie inválida.

**Las 3 capas de protección (independientes y complementarias):**
- `proxy.ts` — sin cookie → redirect login (Edge Runtime, rápido)
- `SessionProvider` — cookie inválida (me=null) → redirect login (React)
- Interceptor 401 — sesión expirada mid-session → logout automático

### Limitaciones conocidas

- Sesiones en memoria: se pierden al reiniciar el dev server (solo en mock mode)
- Sin refresh tokens: la sesión expira a los 7 días cuando el browser descarta
  la cookie (sin opción de renovar)
- Sin protección contra ataques (rate limiting, CSRF, brute force): son
  responsabilidad del backend real, no del template
- El modo `USE_MOCKS=false` requiere que el backend respete el contrato de API
  documentado en `docs/auth.md`

### Estado al cerrar B3

- `npm run lint` → **0 errores**, 2 warnings (pre-existentes)
- `npm run build` → ✓ 11 rutas + Proxy
- Flujos 1-6 verificados

---

## [B3c] Login form + logout + interceptor 401 — 2026-05-03

Cierra el flujo end-to-end de auth: formulario funcional, logout en topbar y
sidebar, interceptor que detecta sesiones expiradas, y resolución del "limbo"
de cookie inválida pendiente de B3b.

### Login form funcional

`LoginForm` reemplaza el `sleep(600)` mock por `useLogin()` real. Cambios:
- Usa `useLogin()` de `@features/auth` para la mutación
- Mantiene `loginSchema` de `@lib/validators/auth.schema` para validación de
  formulario (mensajes UX: "required", "must be at least 6 chars")
- Errores de API mapeados a mensajes claros (401 → "Invalid email or password",
  status 0 → "Connection error", resto → "Something went wrong")
- Hint de cuentas demo visible solo cuando `USE_MOCKS=true` — desaparece
  automáticamente al conectar backend real sin cambio de código
- Se eliminó el texto "Enter any email and password" de `login/page.tsx`

### Logout funcional

`useLogoutAction()` en `src/hooks/` encapsula `useLogout()` + `router.push`.
Reutilizado en topbar y sidebar (2 usos actuales, preparado para settings page).
El `useLogout()` de features/auth ya llama a `queryClient.clear()` para limpiar
el cache de cualquier dato sensible.

### Interceptor 401

Registrado en `providers.tsx` via `addResponseInterceptor()`. Detecta respuestas
401 en cualquier ruta EXCEPTO:
- `/auth/me` — un 401 legítimo significa "no hay sesión", no "sesión expirada"
- `/auth/login` — un 401 es "credenciales incorrectas", no un problema de sesión

Cuando detecta un 401 inesperado, despacha `CustomEvent('nexdash:auth:logout')`.
`SessionProvider` escucha el evento y ejecuta: `setUser(null)` + `queryClient.clear()` + `router.push(routes.login)`.

Decisión: `CustomEvent` en lugar de `window.location.href` para preservar el
estado de React y evitar un full reload. El event bus desacopla el cliente HTTP
(fuera del árbol React) del `SessionProvider` (dentro de React).

### Resolución del limbo de cookie inválida (B3b pendiente)

`SessionProvider` detecta cuando `session === null` (cookie presente pero
session no encontrada en el store) y redirige a `/login`. Esto cubre el caso de
dev server reiniciado con cookies vivas en el navegador.

### Archivos creados/modificados

```
src/lib/auth-events.ts                     Constante AUTH_LOGOUT_EVENT compartida
src/hooks/use-logout-action.ts             Hook: useLogout + router.push encapsulados
src/components/forms/login-form.tsx        Conectado a useLogin, errores, mock hint
src/app/(auth)/login/page.tsx              Eliminado texto "any email and password"
src/app/providers.tsx                      Interceptor 401 registrado (AuthInterceptor)
src/components/auth/session-provider.tsx   Limbo resuelto + listener de logout forzado
src/components/layout/topbar.tsx           Logout conectado
src/components/layout/sidebar.tsx          Logout conectado
```

### Estado al cerrar el sub-bloque

- `npm run lint` → **0 errores**, 2 warnings (pre-existentes, 1 menos que en B3b)
- `npm run build` → ✓ 11 rutas + Proxy, sin warnings

---

## [B3b] Middleware + hidratación del store — 2026-05-03

Conecta la capa de auth de B3a con la app. La app redirige
correctamente según el estado de sesión, y sidebar/topbar muestran
los datos del usuario autenticado. No se ha tocado el formulario de
login ni el flujo de logout — eso es B3c.

### Estrategia del proxy (middleware)

`src/proxy.ts` (Next.js 16 renombró `middleware.ts` → `proxy.ts`)
comprueba únicamente la **presencia** de la cookie `nexdash_session`.
No valida que la sesión sea válida en el `sessionStore` porque:

1. El proxy corre en Edge Runtime, sin acceso a memoria del servidor.
2. La validación profunda la hace `GET /api/auth/me` cuando la app carga.
3. Si la cookie existe pero la sesión expiró, `/me` devuelve 401 → B3c se
   encargará del logout automático.

Flujo de redirección:
- Sin cookie + ruta protegida → 307 `/login`
- Con cookie + `/login` → 307 `/`
- Resto → `NextResponse.next()`

El matcher excluye `api/`, `_next/`, y archivos estáticos.

### Decisión: useSession ↔ user.store

Dos fuentes de verdad para la sesión:
- `useSession()` (TanStack Query) — fuente de verdad **en la red**. Fetch,
  refetch, invalidación. Solo se usa en `SessionProvider`.
- `useUserStore` (Zustand) — fuente de verdad **en la UI**. Síncrono, barato,
  sin suscripciones adicionales. Todos los componentes leen de aquí.

El `SessionProvider` hace de bridge: sincroniza `query.data → store` cuando la
query resuelve. Esto evita que cada componente llame a `useSession()` con sus
propias suscripciones. Un solo observer, propagación via store global.

### Política de skeleton vs hardcoded

Antes: sidebar y topbar mostraban `Aria Blackwood` hardcodeada (desde el store
persistido). Ahora:
- El store arranca con `user: null`.
- Mientras `/me` resuelve, sidebar y topbar muestran un skeleton animado
  (`animate-pulse`).
- Cuando la query resuelve (< 1s en local), el store se actualiza y los
  componentes re-renderizan con datos reales.
- No hay pantalla de carga bloqueante — la app se siente instantánea.

### Fix del user.store

El store tenía `persist()` lo que es incorrecto para estado de sesión (la
referencia en `state.md` ya lo documentaba como "No persistido"). Se eliminó
`persist`, se removió el usuario hardcodeado inicial, y se actualizó la
interfaz para usar `AuthUser` de `@features/auth`:

```
Antes: currentUser: CurrentUser | null  (hardcoded Aria Blackwood, persistido)
Ahora: user: AuthUser | null            (null inicial, no persistido)
```

Además: `setCurrentUser` → `setUser`, `logout()` eliminado (reemplazado por
`setUser(null)` que B3c usará).

### Fix de Next.js 16: middleware → proxy

Next.js 16 deprecó la convención `middleware.ts` en favor de `proxy.ts`. La
función se renombra de `export function middleware()` a `export function proxy()`.
El build emitía warning hasta aplicar el cambio.

### Archivos creados/modificados

```
src/proxy.ts                               Protección de rutas (presencia de cookie)
src/components/auth/session-provider.tsx   Bridge useSession → user.store
src/app/(dashboard)/layout.tsx             Monta SessionProvider
src/store/user.store.ts                    Removido persist, tipo AuthUser, user null inicial
src/components/layout/sidebar.tsx          Usa user del store, skeleton si null
src/components/layout/topbar.tsx           Usa user del store, skeleton avatar si null
src/components/forms/settings-form.tsx     Renombrado currentUser → user
```

### Limitación conocida

Cookie válida en navegador pero sesión expirada en `sessionStore` (p.ej. tras
reinicio del dev server): el proxy deja pasar al usuario (solo comprueba
presencia de cookie), `/me` devuelve 401, el store queda `null`, los slots de
usuario muestran skeleton indefinidamente. El usuario queda en "limbo" hasta
que B3c implemente el interceptor 401 y el logout automático.

### Verificación manual (6/6)

| # | Escenario | Resultado |
|---|---|---|
| 1 | Sin cookie → `/` | 307 → `/login` ✓ |
| 2 | Sin cookie → `/users` | 307 → `/login` ✓ |
| 3 | Con cookie válida → `/` | 200 ✓ |
| 4 | Con cookie válida → `/login` | 307 → `/` ✓ |
| 5 | Cookie borrada → `/` | 307 → `/login` ✓ |
| 6 | Cookie inválida → `/` | 200 (proxy deja pasar, `/me` → 401) ✓ |

### Estado al cerrar el sub-bloque

- `npm run lint` → **0 errores**, 3 warnings (pre-existentes)
- `npm run build` → ✓ 11 rutas + Proxy, sin warnings

---

## [B3a] Feature auth + mock backend — 2026-05-03

Capa de datos completa para autenticación. Crea `features/auth/` y los route
handlers `app/api/auth/*` que simulan el backend en modo `USE_MOCKS`. La UI
existente no se ha tocado. B3b (middleware + hidratación del store) y B3c
(login form conectado) son los siguientes sub-bloques.

### Decisión arquitectónica: cookies HttpOnly vía route handlers

El token de sesión vive exclusivamente en una cookie `HttpOnly`. El cliente JS
nunca lo lee ni lo almacena. En modo mock, los route handlers de Next.js actúan
como backend; en producción real se reemplaza flipeando `USE_MOCKS=false` y
apuntando `NEXT_PUBLIC_API_URL` al backend externo. El código del cliente (hooks,
handler) no cambia.

Alternativa descartada: JWT en localStorage. Descartada por seguridad (XSS) y
porque no aporta nada en un template — la cookie HttpOnly es el estándar de la
industria.

### Estructura creada

```
src/features/auth/
  schemas/auth.schemas.ts     LoginInputSchema, AuthUserSchema, AuthSessionSchema, LoginResponseSchema
  types/auth.types.ts         LoginInput, AuthUser, AuthSession (z.infer<>)
  api/_mock-data.ts           AuthUser[] sin contraseñas (documentación / referencia)
  api/auth.keys.ts            authKeys.session() — key factory interna
  api/auth.handler.ts         login / logout / me con USE_MOCKS branching
  api/use-auth.ts             useSession, useLogin, useLogout
  index.ts                    Barrel público (hooks + tipos)

src/app/api/auth/
  _mock-store.ts              sessionStore Map + credenciales mock + findMockUser()
  login/route.ts              POST: valida creds → sessionId → cookie → { session }
  logout/route.ts             POST: borra del Map → cookie maxAge=0
  me/route.ts                 GET: lee cookie → Map → { user, expiresAt } | 401
```

### Política de la cookie

| Atributo | Valor |
|---|---|
| Nombre | `nexdash_session` |
| Valor | UUID v4 (sessionId) |
| HttpOnly | `true` |
| Secure | `true` producción, `false` desarrollo |
| SameSite | `lax` |
| Path | `/` |
| MaxAge | 604800 (7 días) |

### Mock data: usuarios disponibles

| Email | Contraseña | Rol |
|---|---|---|
| `admin@nexdash.com` | `admin123` | `admin` |
| `user@nexdash.com` | `user123` | `user` |

### Limitación conocida

El `sessionStore` es un Map en memoria del proceso Node.js. **Todas las sesiones
se pierden al reiniciar el dev server.** Los usuarios verán un 401 en `/me` aunque
la cookie siga en el navegador. Comportamiento esperado — el middleware (B3b)
redirigirá al login automáticamente.

### Verificación manual

Con `npm run dev` corriendo:

```bash
# 1. Login → debe devolver 200 + session + cookie nexdash_session
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nexdash.com","password":"admin123"}' \
  -c /tmp/cookies.txt -v 2>&1 | grep -E 'HTTP|Set-Cookie|session'

# 2. /me con cookie → 200 + { user, expiresAt }
curl http://localhost:3000/api/auth/me -b /tmp/cookies.txt

# 3. Logout → 200 + cookie limpiada
curl -X POST http://localhost:3000/api/auth/logout -b /tmp/cookies.txt

# 4. /me sin cookie → 401 + { message, code }
curl http://localhost:3000/api/auth/me
```

### Fix colateral

`src/components/layout/theme-toggle.tsx` tenía el error de lint
`react-hooks/set-state-in-effect` (introducido por actualización de
`eslint-config-next`). El patrón `useEffect(() => setMounted(true), [])` es el
guard de hidratación canónico de Next.js. Se añadió `eslint-disable-next-line`
con comentario explicativo.

### Documentación creada

```
docs/auth.md               Flujo login→cookie, mock vs real, contrato API, limitaciones
.claude/rules/auth.md      Invariantes de auth para futuras sesiones de Claude
```

### Estado al cerrar el sub-bloque

- `npm run lint` → **0 errores**, 3 warnings (pre-existentes)
- `npm run build` → ✓ 11 rutas (9 anteriores + 3 nuevas API routes)
- Verificación manual 4/4 escenarios pasan
- La UI existente no se ha modificado (solo theme-toggle.tsx con lint disable)
- B3b (middleware + store hidration) puede arrancar

---

## [B2.5e] Documentación final y cierre del refactor — 2026-05-02

Consolidación de la arquitectura: documento maestro, auditoría de reglas y
README preliminar. Ningún comportamiento cambia en este sub-bloque.

### Auditoría de reglas (8/8 verde)

| Check | Resultado |
|---|---|
| `process.env` solo en `config/env.ts` | ✅ PASS |
| Sin strings de ruta hardcodeados | ⚠️ → FIX: `login-form.tsx` tenía `router.push('/')` → corregido a `routes.dashboard` |
| Cada feature tiene barrel y exporta solo lo público | ✅ PASS |
| Ningún feature importa de otro feature | ✅ PASS |
| Los hooks usan la query keys factory (no strings sueltos) | ✅ PASS |
| Los handlers validan con `validate()` en ambas ramas | ✅ PASS |
| `components/ui/` y `components/layout/` no importan de `@features/` | ✅ PASS |
| Convenciones de nombres (`use-*.ts`, `*.schemas.ts`, `*.keys.ts`, …) | ✅ PASS |

Violación corregida: `src/components/forms/login-form.tsx` usaba `router.push('/')` hardcodeado. Corregido a `routes.dashboard`.

### Documentación creada

```
docs/architecture.md        Documento maestro: overview, folder structure, layers,
                            features anatomy, decision log, recetas de extensión
docs/configuration.md       Cómo añadir env vars, constantes y rutas (B2.5d)
docs/data-layer.md          Patrón handler/hook/validate/keys (actualizado en B2.5c)

.claude/rules/architecture.md  Resumen ejecutable de la arquitectura para Claude Code
.claude/rules/conventions.md   Naming, imports, barrels — reglas accionables
.claude/rules/config.md        Reglas de config/env/routes (B2.5d)
.claude/rules/data-layer.md    Patrón de datos (actualizado en B2.5c)
```

### Estado al cerrar el sub-bloque

- `npm run lint` → **0 errores**, 3 warnings (pre-existentes, todos fuera de scope)
- `npm run build` → ✓ 9 rutas, sin cambios de comportamiento
- Auditoría 8/8 verde

---

## [B2.5] Cierre del refactor arquitectónico — 2026-05-02

### Resumen ejecutivo

En cinco sub-bloques consecutivos (B2.5a→e), NexDash pasó de una arquitectura
plana con `hooks/`, `mocks/` y `types/` distribuidos, a una arquitectura
**feature-based** con validación en frontera y configuración centralizada.

**Lo conseguido:**
1. **Features autocontenidos** — 4 features (`dashboard`, `analytics`, `reports`, `users`) con su propio handler, hook, schema Zod, key factory y barrel. Ninguno conoce la existencia de los otros.
2. **Schema como fuente de verdad** — Los tipos del API son `z.infer<typeof Schema>`. Schema y tipo nunca se desincronicen.
3. **Validación en frontera** — Todo response (mock y real) pasa por `validate(Schema, data)` antes de salir del handler. Falla pronto, mensaje tipado.
4. **Query keys tipadas** — 4 factorías de keys. Cero strings literales en `queryKey`. Invalidación granular y refactorizable.
5. **Configuración centralizada** — Un único punto de acceso a env vars (`@config/env`), constantes (`@config/constants`) y rutas (`@config/routes`). El build falla con mensaje claro si falta una env var obligatoria.

### Métricas

| Métrica | Antes | Después |
|---|---|---|
| Archivos en `src/mocks/` | 9 | 0 (eliminados) |
| Archivos en `src/hooks/` (feature) | 4 | 0 (migrados a features) |
| Archivos en `src/types/` | 4 | 1 (`api.types.ts`) |
| Archivos en `src/components/dashboard/` | 3 | 0 (migrados) |
| Features con schema Zod | 0 | 4 |
| Features con key factory | 0 | 4 |
| Usos de `process.env` fuera de config | varios | 0 |
| Strings de ruta hardcodeados en componentes | 7 | 0 |
| Documentos en `docs/` | 0 | 4 |
| Archivos en `.claude/rules/` | 5 (desactualizados) | 7 (al día) |

### Deuda técnica conocida

- `login-form.tsx` llama `router.push(routes.dashboard)` directamente — en B3 se moverá al middleware de auth
- `_data` sin usar en `login-form.tsx` y `settings-form.tsx` — los formularios aún no tienen lógica real (B3/B5)
- `<img>` en `avatar.tsx` en lugar de `next/image` — requiere configurar `images.remotePatterns` (B7)
- Tests: no hay suite configurada — se añade en B6 (Vitest + Testing Library)
- `DataTable` tiene paginación client-side limitada a las primeras 5 páginas — se ampliará según necesidad

### Estado del repo al cierre

- `npm run lint` → 0 errores, 3 warnings (pre-existentes, out-of-scope)
- `npm run build` → ✓ 9 rutas estáticas + 1 dinámica (`/users/[id]`)
- Sin tests configurados
- Listo para **B3** (autenticación con middleware y cookie)

---

## [B2.5d] Configuración centralizada — 2026-05-02

Centralizamos toda la configuración dispersa en `src/config/` con validación
estricta de env vars, constantes globales tipadas y rutas de la app en un único
lugar. El objetivo es que el template falle pronto y de forma legible cuando
alguien olvida configurar algo.

### Decisiones

| Tema | Decisión | Motivo |
|---|---|---|
| Validación de env vars | Zod + `safeParse` al importar el módulo, no lazy | Falla en el arranque del proceso Node.js, antes de que cualquier request llegue; el mensaje de error indica exactamente qué falta |
| `NEXT_PUBLIC_API_URL` | Opcional con `default('')` + `union([url(), literal('')])` | El template funciona sin backend (modo mock). Forzar la URL haría imposible el onboarding sin servidor |
| Separación client/server schemas | Dos schemas distintos en `env.ts` | Las `NEXT_PUBLIC_*` están disponibles en ambos entornos; las server-only solo en Node. Mantener la separación deja espacio para añadir secrets server-only en B3 |
| Un único punto de acceso | `import { env } from '@config/env'` | Ningún otro archivo llama a `process.env` directamente — el compilador de TypeScript fuerza pasar por el schema validado |
| `lib/api/config.ts` | Pasa a ser un thin re-export desde `@config/env` | Los handlers existentes no necesitan cambiar sus imports; `USE_MOCKS` y `API_BASE_URL` siguen exportándose desde la misma ruta |
| Constantes de UI | `THEME`, `QUERY`, `PAGINATION`, `API` en `constants.ts` | Elimina magic numbers en providers, stores y utils; cualquier cambio de configuración tiene un único lugar |
| Rutas tipadas | `routes` object con `as const` | Elimina string literals de ruta en componentes; una ruta mal escrita es error de TypeScript, no un 404 silencioso en runtime |
| Colores de accents | Se mantienen en `settings/page.tsx` como `accentColors` map | Son constantes visuales específicas del componente, no configuración global; `THEME.ACCENTS` aporta la lista canónica de nombres |
| App name en sidebar | `env.NEXT_PUBLIC_APP_NAME` | Permite renombrar el template sin tocar código — solo `.env.local` |

### Archivos nuevos

```
src/config/env.ts          validación Zod de env vars, export `env`
src/config/constants.ts    QUERY, API, PAGINATION, THEME
src/config/routes.ts       routes object tipado
src/config/index.ts        barrel re-export
docs/configuration.md      guía para añadir env vars, constantes y rutas
```

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/lib/api/config.ts` | Elimina `process.env` directo; importa de `@config/env` |
| `src/lib/utils.ts` | `randomDelay` usa `API.MOCK_DELAY_RANGE` |
| `src/app/providers.tsx` | `staleTime`, `retry`, `storageKey` usan constantes |
| `src/store/ui.store.ts` | `persist` key y `accent` default usan `THEME.*` |
| `src/components/layout/sidebar.tsx` | navItems usan `routes.*`; app name usa `env.NEXT_PUBLIC_APP_NAME` |
| `src/app/layout.tsx` | metadata usa `env.NEXT_PUBLIC_APP_NAME` |
| `src/app/(dashboard)/settings/page.tsx` | accent loop usa `THEME.ACCENTS` |
| `src/app/(dashboard)/users/page.tsx` | hrefs usan `routes.users.*` |
| `src/app/(dashboard)/users/[id]/page.tsx` | hrefs usan `routes.users.list` |
| `.env.example` | Refleja exactamente los campos que valida `env.ts` |

### Verificación del fallo ante env vars inválidas

Con `NEXT_PUBLIC_API_URL=not-a-url` el arranque produce:

```
❌ Invalid environment variables:
  - NEXT_PUBLIC_API_URL: Invalid URL
```

Y la app no arranca / el build falla.

### Estado al cerrar el sub-bloque

- `npm run lint` → **0 errores**, 3 warnings (pre-existentes)
- `npm run build` → ✓ 9 rutas, sin cambios de comportamiento
- Cero usos de `process.env` fuera de `src/config/env.ts`
- Cero strings de ruta hardcodeados en componentes

### Lo que queda fuera de B2.5d

- Variables de entorno server-only (secrets, DB URL) → B3 cuando aparezca la primera
- `.env.test` para tests → B6

---

## [B2.5c] Query keys factory + validación Zod — 2026-05-02

Añadimos dos patrones de robustez a la capa de datos sin cambiar estructura
ni comportamiento visible. Los types del API dejan de estar duplicados en tipos
manuales y pasan a ser la fuente única de verdad: el schema Zod.

### Decisiones

| Tema | Decisión | Motivo |
|---|---|---|
| Factoría de query keys | Un archivo `{feature}.keys.ts` por feature | Elimina strings literales dispersos en hooks y mutations; un cambio de key se propaga solo; el patrón estándar de TanStack Query |
| Scope de las keys | Las factorías son **internas** al feature, no se exportan en `index.ts` | Son un detalle de implementación de la capa de datos; los consumidores (pages) nunca deberían construir ni comparar query keys directamente |
| Niveles en la factoría | `all → lists/details → list(filters)/detail(id)` | Permite invalidar con granularidad: `userKeys.all` invalida todo lo de users; `userKeys.lists()` solo listas; `userKeys.detail(id)` solo un ítem concreto |
| Validación | `.safeParse()` vía helper `validate()` en `src/lib/api/validate.ts` | Falla rápido y de forma controlada; el error llega como `ApiError(status=0, code='VALIDATION_ERROR')` — tipado igual que el resto de errores de la capa |
| Dónde validar | Dentro del handler, en ambas ramas (mock y real API) | Los mocks también validan: si un mock data tiene un campo mal, lo detectamos en desarrollo antes de que llegue a un componente |
| `.parse()` vs `.safeParse()` | Se usa `safeParse` en el helper para convertir en `ApiError` en lugar de lanzar `ZodError` crudo | Mantiene la invariante de que la capa de datos solo lanza `ApiError` o `DOMException(AbortError)` |
| Tipos inferidos | `export type User = z.infer<typeof UserSchema>` en lugar de `interface User` | Schema y tipo nunca se desincronicen; un campo añadido al schema aparece automáticamente en el tipo |
| Tipos manuales restantes | `DateRange`, `UserRole`, `UserStatus` | `DateRange` es un filtro de UI, no viene del API. `UserRole`/`UserStatus` son re-exports derivados del schema (`User['role']`) para comodidad de import |
| Form schema en `@lib/validators/` | **No se toca** `user.schema.ts` | Es un schema de _input de formulario_ (subconjunto, con mensajes de validación UX). El API schema es más estricto (`.email()`) y sin mensajes de UX. Los dos tienen propósitos distintos |

### Archivos nuevos

```
src/lib/api/validate.ts                           helper validate<T>(schema, data)

src/features/dashboard/schemas/dashboard.schemas.ts   KPISummarySchema, ActivityItemSchema, CampaignSchema
src/features/dashboard/api/dashboard.keys.ts          dashboardKeys

src/features/analytics/schemas/analytics.schemas.ts   MonthlyMetricSchema, DailyMetricSchema, TrafficSourceSchema
src/features/analytics/api/analytics.keys.ts          analyticsKeys

src/features/reports/schemas/reports.schemas.ts       ReportSchema
src/features/reports/api/reports.keys.ts              reportsKeys

src/features/users/schemas/users.schemas.ts           UserSchema, CreateUserInputSchema, UpdateUserInputSchema
src/features/users/api/users.keys.ts                  userKeys
```

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `features/*/types/*.types.ts` | Tipos → `z.infer<typeof Schema>` |
| `features/*/api/*.handler.ts` | Responses envueltos en `validate()`, tipo `<unknown>` en `api.*` calls |
| `features/*/api/use-*.ts` | `queryKey` usa la factoría; `invalidateQueries` usa la factoría |

### Incidencias en validación de mocks

Ninguna. Los datos mock existentes cumplen todos los schemas sin modificaciones.

### Estado al cerrar el sub-bloque

- `npm run lint` → **0 errores**, 3 warnings (los mismos pre-existentes)
- `npm run build` → ✓ 9 rutas, sin cambios de comportamiento
- `src/lib/api/validate.ts` elimina los `.gitkeep` restantes de `schemas/`

### Lo que queda fuera de B2.5c

- Schemas de formulario integrados con react-hook-form para todos los features → B5/B7
- Paginación server-side ni wrappers de respuesta API — se añadirán si el backend los requiere

---

## [B2.5a] Cimientos del refactor arquitectónico — 2026-05-02

Preparación sin riesgo: solo se configuran aliases y se crean carpetas vacías.
**No se mueve ningún archivo en este sub-bloque.** Los imports actuales con `@/*`
siguen funcionando exactamente igual.

### Decisiones

| Tema | Decisión | Motivo |
|---|---|---|
| Aliases en `tsconfig.json` | Añadir 8 aliases específicos manteniendo `@/*` | `@/*` seguirá funcionando en código existente; los nuevos aliases como `@features/*` hacen explícita la intención del import en el código refactorizado de B2.5b en adelante |
| `next.config.ts` | Sin cambios | Next.js App Router lee `paths` de `tsconfig.json` directamente — no se necesita configuración adicional |
| Carpetas vacías | `.gitkeep` en cada directorio | Permite hacer commit de la estructura sin archivos de código; facilita ver el progreso del refactor en el historial de git |
| `features/auth/` y `features/settings/` | **No creadas** en este sub-bloque | Se crearán cuando toque (auth en B3, settings más adelante); crear huesos vacíos antes de tiempo añade ruido |

### Path aliases añadidos

```json
"@app/*":        "./src/app/*"
"@features/*":   "./src/features/*"
"@components/*": "./src/components/*"
"@lib/*":        "./src/lib/*"
"@config/*":     "./src/config/*"
"@store/*":      "./src/store/*"
"@types/*":      "./src/types/*"
"@styles/*":     "./src/styles/*"
```

### Estructura de carpetas creada

```
src/
  features/
    dashboard/ { api/, components/, types/, schemas/ }
    users/     { api/, components/, types/, schemas/ }
    analytics/ { api/, components/, types/, schemas/ }
    reports/   { api/, components/, types/, schemas/ }
  config/
  components/
    feedback/       ← toasts, empty states, error states (B4)
```

Cada directorio contiene un `.gitkeep`. El contenido real se moverá en B2.5b.

### Estado al cerrar el sub-bloque

- `npm run lint` → 0 errores, 3 warnings (pre-existentes)
- `npm run build` → ✓ 9 rutas, sin cambios de comportamiento
- Todos los imports `@/*` existentes siguen funcionando
- 23 archivos `.gitkeep` creados

### Lo que queda fuera de B2.5a

- Mover archivos existentes a la nueva estructura → **B2.5b**
- Actualizar imports — automáticamente cuando se muevan los archivos
- Crear código en las carpetas nuevas → B3 en adelante

---

## [B2.5b] Migración a arquitectura por features — 2026-05-02

Mover código existente a la estructura `src/features/` creada en B2.5a.
**Ningún comportamiento cambia** — los mismos datos, mismos componentes, misma UX.
Solo cambian las rutas de los archivos y los paths de los imports.

### Decisiones

| Tema | Decisión | Motivo |
|---|---|---|
| Regla de imports | `@features/*`, `@components/*`, `@lib/*`, `@store/*` en todo código nuevo | Hace explícita la capa de cada import; `@/*` queda como escape hatch para casos edge |
| `UserForm` | Movida a `src/features/users/components/` | Es un componente de dominio, no una primitive UI genérica |
| `KPICard` y `ActivityFeed` | Movidas a `src/features/dashboard/components/` | Son componentes de dominio del feature dashboard |
| `DataTable` | Movida a `src/components/ui/data-table.tsx` | Es una primitive UI genérica reutilizada por 4 features distintos |
| `Report` type | Estaba en `dashboard.types.ts`; movida a `src/features/reports/types/` | Pertenece al feature reports, no al dashboard |
| Barrel exports | `index.ts` por feature exporta hooks, tipos y componentes | Los pages importan desde `@features/dashboard` sin conocer la estructura interna |
| `src/mocks/` | Eliminado completamente | Los handlers están ahora en `src/features/{feature}/api/` como archivos separados |
| `src/hooks/use-*.ts` (feature) | Eliminados | Migrados a `src/features/{feature}/api/use-{feature}.ts` |
| `src/types/*.types.ts` | Eliminados (excepto `api.types.ts`) | Migrados a `src/features/{feature}/types/` |
| `src/components/dashboard/` | Eliminado | `kpi-card`, `activity-feed` → `@features/dashboard`; `data-table` → `@components/ui` |
| `src/components/forms/user-form.tsx` | Eliminado | Migrado a `@features/users` |
| Hooks transversales | `use-media-query.ts`, `use-sidebar.ts` permanecen en `src/hooks/` | No son de ningún feature en particular |
| `src/types/api.types.ts` | Permanece en `src/types/` | Tipos verdaderamente globales (`ApiError`, etc.) |

### Archivos creados / movidos

```
src/features/
  dashboard/
    api/          use-dashboard.ts   (ex src/hooks/use-dashboard.ts)
    types/        dashboard.types.ts  (ex src/types/dashboard.types.ts)
    components/   kpi-card.tsx, activity-feed.tsx  (ex src/components/dashboard/)
    index.ts      barrel: hooks + tipos + componentes
  users/
    api/          use-users.ts       (ex src/hooks/use-users.ts)
    types/        user.types.ts      (ex src/types/user.types.ts)
    components/   user-form.tsx      (ex src/components/forms/user-form.tsx)
    index.ts
  analytics/
    api/          use-analytics.ts   (ex src/hooks/use-analytics.ts)
    types/        analytics.types.ts (ex src/types/analytics.types.ts)
    index.ts
  reports/
    api/          use-reports.ts     (ex src/hooks/use-reports.ts)
    types/        reports.types.ts   (ex dashboard.types.ts → Report type)
    index.ts

src/components/ui/data-table.tsx     (ex src/components/dashboard/data-table.tsx)
```

### Archivos eliminados

```
src/mocks/                           (data/ + handlers/ + index.ts)
src/hooks/use-dashboard.ts
src/hooks/use-analytics.ts
src/hooks/use-users.ts
src/hooks/use-reports.ts
src/types/dashboard.types.ts
src/types/analytics.types.ts
src/types/user.types.ts
src/components/dashboard/           (kpi-card, activity-feed, data-table)
src/components/forms/user-form.tsx
```

### Estado al cerrar el sub-bloque

- `npm run lint` → **0 errores**, 3 warnings (los mismos pre-existentes de B1)
- `npm run build` → ✓ 9 rutas, sin cambios de comportamiento
- Todos los imports actualizados a `@features/*`, `@components/*`, `@lib/*`

### Lo que queda fuera de B2.5b

- Query keys factory + Zod schemas → **B2.5c**
- Handlers en `features/*/api/` no tienen archivo separado para el handler aún (hook y handler en el mismo fichero) — se puede separar en B2.5c si aplica

---

## [B1] Auditoría y limpieza — 2026-05-02

Punto de partida: el repo ya tenía implementados los Bloques 1–6 del plan
original, pero arrastraba deuda técnica que impedía considerarlo "boilerplate
listo para producción" — CSS de showcase contaminando el bundle, dos sistemas
de theming compitiendo, errores de lint de React 19 y archivos huérfanos.

### Decisiones

| Tema | Decisión | Motivo |
|---|---|---|
| Theming | Migrar a `next-themes` (ya estaba instalado pero sin uso) | Estándar de la comunidad, gestiona FOUC, persistencia y `useTheme()` sin reinventar |
| Convención de clases | Mantener `.theme-dark` / `.theme-light` en `<html>` | Toda la cascada de `tokens.css` y `components.css` ya las usa; reescribir a `[data-theme]` era cambio cosmético innecesario |
| Lint `react-hooks/set-state-in-effect` | Sustituir `useState + useEffect` por `useSyncExternalStore` | Es la primitiva oficial de React 19 para suscribirse a APIs del navegador y se lleva bien con React Compiler (`reactCompiler: true` en `next.config.ts`) |
| Detección de mounted | Eliminada — usar `resolvedTheme !== 'light'` como fallback | Sin `setState` en effect; SSR y primer render del cliente coinciden con el `defaultTheme="dark"` |

### Cambios

**Eliminados (residuos del design-system showcase y duplicidades):**
- `src/styles/page.css` (567 ln) — `body { background: #0A0A0F }` hardcoded sobreescribía los tokens
- `src/styles/screens.css` (414 ln) — clases `.scr-*` no referenciadas en JSX
- `src/contexts/theme-context.tsx` — reemplazado por `next-themes`
- `src/contexts/` — directorio vacío tras eliminar el archivo
- `src/hooks/use-theme.ts` — helper sobre el context custom, sin consumidores
- `src/components/ui/test.tsx` + `src/app/(dashboard)/test/page.tsx` — sandbox de tokens, fuera de un boilerplate

**Migrados a `next-themes`:**
- `src/app/providers.tsx` — `NextThemesProvider` con `value={{ light: 'theme-light', dark: 'theme-dark' }}` y `storageKey: 'nexdash-theme'` (compatible con el localStorage previo)
- `src/app/layout.tsx` — eliminado `themeInitScript` inline (`next-themes` inyecta el suyo y evita FOUC)
- `src/app/globals.css` — eliminados los `@import` de `page.css` y `screens.css`
- `src/components/layout/theme-toggle.tsx` — `useTheme` desde `next-themes`
- `src/app/(dashboard)/settings/page.tsx` — `useTheme` desde `next-themes`

**Refactor por lint de React 19:**
- `src/hooks/use-media-query.ts` — reescrito con `useSyncExternalStore`

**Cleanups menores:**
- `src/components/ui/card.tsx` y `src/components/ui/label.tsx` — `interface X extends Y {}` → `type X = Y` (regla `@typescript-eslint/no-empty-object-type`)
- `src/components/dashboard/data-table.tsx` — ternario como statement → `if/else`
- `src/app/(dashboard)/analytics/page.tsx` — eliminado `import { cn }` no usado
- `src/app/(dashboard)/users/page.tsx` — eliminado `UserStatus` no usado

### Estado al cerrar el bloque

- `npm run lint` → **0 errores**, 3 warnings (todos pre-existentes y fuera de scope de B1):
  - `login-form.tsx` y `settings-form.tsx`: `_data` no usado — los formularios aún no envían (lo cubren **B3** auth y **B4** UX)
  - `avatar.tsx`: `<img>` en lugar de `<Image />` — usa URL externa de `ui-avatars.com`, requiere configurar `images.remotePatterns` en `next.config.ts` (lo cubre **B7** pulido)
- `npm run build` → ✓ compila, 9 rutas (`/`, `/login`, `/analytics`, `/reports`, `/settings`, `/users`, `/users/[id]`, `/_not-found`)
- Total de archivos `.ts/.tsx/.css` en `src/`: 83 → 77 (-6)

### Lo que queda explícitamente fuera de B1

- Migración de mocks a un cliente HTTP swappable → **B2**
- Middleware de auth y flujo login/logout funcional → **B3**
- Toasts, empty states, error states globales → **B4**
- Configurar `images.remotePatterns` para `next/image` → **B7**

---

## [B2] Capa de datos swappable — 2026-05-02

Objetivo: que el cambio de mock → API real sea **una variable de entorno**.
Componentes y hooks no se tocan; solo los handlers internamente eligen ruta.

### Decisiones

| Tema | Decisión | Motivo |
|---|---|---|
| Forma del cliente | Singleton de funciones (`api.get`, `api.post`, …) en lugar de clase | Ergonomía: import directo desde `@/lib/api` sin instanciar. Tipado genérico por método (`api.get<User[]>('/users')`) |
| Branching mock/real | Dentro de cada método del handler (`if (USE_MOCKS) { … } return api.…`) | Mantiene la firma del handler invariante para hooks y tests; permite handlers parciales (algunos métodos mockeados, otros reales) |
| Flag `USE_MOCKS` | `process.env.NEXT_PUBLIC_USE_MOCKS !== 'false'` (default `true`) | Boilerplate funciona sin backend nada más clonarlo. Solo `"false"` flippea — cualquier otro valor (incluido undefined) se queda en mocks |
| `credentials: 'include'` | Activado por defecto en todas las peticiones | B3 va con cookies; tenerlo siempre evita que B3 deba refactorizar el cliente |
| Interceptors | Registry en arrays con `addRequest/ResponseInterceptor` que devuelven unsubscribe | Patrón clásico de Axios; permite registrar/limpiar desde providers o tests sin estado global mutable expuesto |
| `ApiError` | Clase con `status`, `code?`, `details?`, helper `ApiError.is()` | Subclase de `Error` para que `instanceof` y stack traces funcionen; `status === 0` reservado para fallos de transporte |
| Cancelación | `AbortSignal` opcional en cada método del handler, propagado al fetch y al `randomDelay` mock | TanStack Query inyecta signal automáticamente; los mocks también cancelan para que el comportamiento sea idéntico |

### Cambios

**Nuevos:**
- `src/lib/api/config.ts` — `API_BASE_URL`, `USE_MOCKS`
- `src/lib/api/errors.ts` — `ApiError`
- `src/lib/api/client.ts` — fetch wrapper con `api.{get,post,put,patch,delete}`, interceptors, `RequestOptions` con `signal`/`params`/`headers`
- `src/lib/api/index.ts` — barrel export
- `src/mocks/handlers/reports.handler.ts` — handler nuevo con `getAll` y `getById` (antes vivía como un método más en `dashboardHandler`)
- `.env.example` — documenta `NEXT_PUBLIC_API_URL` y `NEXT_PUBLIC_USE_MOCKS`
- `docs/data-layer.md` — arquitectura, recetas y tabla de URLs canónicas

**Modificados:**
- `src/mocks/handlers/dashboard.handler.ts` — branching `USE_MOCKS`; eliminado `getReports` (movido a `reports.handler.ts`)
- `src/mocks/handlers/users.handler.ts` — branching en los 5 métodos; rutas `/users`, `/users/:id`
- `src/mocks/handlers/analytics.handler.ts` — branching; `getDaily` pasa `range` como query param vía `RequestOptions.params`
- `src/mocks/index.ts` — exporta `reports.handler`
- `src/hooks/use-reports.ts` — apunta a `reportsHandler.getAll`, propaga `signal`
- `src/hooks/use-dashboard.ts`, `use-analytics.ts`, `use-users.ts` — los `queryFn` ahora reciben `{ signal }` y lo pasan al handler
- `src/lib/utils.ts` — `sleep` y `randomDelay` aceptan `AbortSignal` opcional y lanzan `AbortError` si se cancelan
- `.gitignore` — `!.env.example` para que el ejemplo sí entre al repo

### Estado al cerrar el bloque

- `npm run lint` → **0 errores**, 3 warnings (los mismos pre-existentes que en B1; siguen siendo scope de B3/B4/B7)
- `npm run build` → ✓ 9 rutas, sin cambios de tamaño relevantes
- Total de archivos `.ts/.tsx/.css` en `src/`: 77 → 82 (+5 nuevos en `lib/api/` y `mocks/handlers/`)
- Demostrado que el swap funciona: poniendo `NEXT_PUBLIC_USE_MOCKS=false` y un `NEXT_PUBLIC_API_URL`, todos los hooks pasarían por el cliente real sin tocar componentes (no probado contra backend real porque no hay; cubierto por la estructura de los handlers)

### Lo que queda explícitamente fuera de B2

- Interceptor de auth real (token o cookie + redirect en 401) → **B3**
- Toasts al fallar mutaciones; estados de error/empty consistentes → **B4**
- Tests de los handlers (mock branch + branch real con `fetch` mockeado) → **B6**
- Reintentos exponenciales / circuit breaker en el cliente → fuera de scope (TanStack Query ya cubre retry de queries con `retry: 1`)
- Streaming/SSE/WebSocket → fuera de scope
