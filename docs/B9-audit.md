# B9.0 — Tech Debt Audit

Fecha: 2026-05-10
Estado del repo: HEAD 262fc313 (main — post-rebase sobre B8)

## Resumen ejecutivo

- Items auditados: 38
- ✅ Resueltos: 11
- ⏳ Pendientes: 20
- ⚠️ Parciales: 4
- ❓ Decisión requerida: 3

---

## Tabla por categoría

### Schemas (S-*)

| ID  | Item                                                          | Estado | Evidencia                                                                                                    | Sugerencia                                                   | Bucket |
| --- | ------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ | ------ |
| S-1 | `auth.schema.ts` coexiste con `features/auth/schemas/`        | ✅     | `lib/validators/auth.schema.ts` = factory de form con i18n (usado por `login-form.tsx`). `auth.schemas.ts` = validación de API (AuthSessionSchema, LoginResponseSchema). Propósitos distintos. | Mantener ambos — no son duplicados.                          | —      |
| S-2 | `user.schema.ts` en lib/ vs `features/users/schemas/`         | ✅     | `lib/validators/user.schema.ts` = factory de form con i18n (usado por `user-form.tsx`). `users.schemas.ts` = UserSchema API. Mismo patrón que S-1. | Mantener ambos.                                              | —      |
| S-3 | `settings.schema.ts`: no hay `features/settings/`             | ⚠️     | Ubicación correcta según `forms.md` (schemas de form en `lib/validators/`). Pero `notificationSettingsSchema` y `NotificationSettingsValues` (lines 31-37) están definidos y **nunca importados** en ningún archivo. | Eliminar tipos/schema de notificaciones no usados, o conectarlos a una sección de settings que los consuma. | B9.1   |

---

### Lint warnings (L-*)

| ID  | Item                                              | Estado | Evidencia                                                             | Sugerencia                                                   | Bucket |
| --- | ------------------------------------------------- | ------ | --------------------------------------------------------------------- | ------------------------------------------------------------ | ------ |
| L-1 | `_data` sin usar en `login-form.tsx`              | ✅     | `npm run lint` — 0 warnings para `login-form.tsx`. El form usa `data` directamente en `onSubmit`. | —                                                            | —      |
| L-2 | `_data` sin usar en `settings-form.tsx` y `forms-content.tsx` | ⏳ | `settings-form.tsx:39` + `forms-content.tsx:41,96,158` — `async function onSubmit(_data)` en 4 lugares. ESLint produce 4 warnings. El prefijo `_` no suprime `@typescript-eslint/no-unused-vars` en la config actual. | Añadir `argsIgnorePattern: '^_'` a la regla en `eslint.config.*` (fix global). O renombrar cada param a `_`. Cat A. | B9.1   |
| L-3 | `<img>` en `avatar.tsx` en lugar de `next/image`  | ⏳     | `avatar.tsx:33` — `<img src={src} ...>`. ESLint: `@next/next/no-img-element`. `next.config.ts` no tiene `images.remotePatterns`. | Añadir `remotePatterns` para el dominio de avatares (actualmente `ui-avatars.com`) en `next.config.ts`, y reemplazar `<img>` por `<Image>`. Cat B. | B9.1   |

---

### Inconsistencias visuales / CSS (V-*)

| ID  | Item                                              | Estado | Evidencia                                                             | Sugerencia                                                   | Bucket |
| --- | ------------------------------------------------- | ------ | --------------------------------------------------------------------- | ------------------------------------------------------------ | ------ |
| V-1 | Mezcla de radii en páginas `/ui`                  | ⏳     | Páginas showcase usan `rounded-xl`/`rounded-lg` (Tailwind utilities) y `style={{ borderRadius: 'var(--radius-md)' }}` sin consistencia. `--radius-lg: 12px` ≠ `rounded-lg` en Tailwind (8px). Los tokens no mapean 1:1 a las clases de Tailwind; `rounded-xl` (12px) sería el equivalente correcto de `--radius-lg`. | Establecer convención: o siempre CSS tokens (`var(--radius-*)`), o mapear tokens en `@theme` para usar `rounded-radius-lg`, etc. Cat B. | B9.2   |
| V-2 | TypeSpecimen `fontWeight` cast `as unknown as number` | ⚠️  | `foundations-content.tsx:523` — `fontWeight: w.value as unknown as number`. Otros lugares usan números directos (476, 489, 566, 750). El cast es TS-hacky. | Reemplazar `w.value` con el peso numérico directo en ese entry del array, igual que los otros. Cat A. | B9.1   |

---

### Componentes y props (C-*)

| ID   | Item                                              | Estado | Evidencia                                                              | Sugerencia                                                   | Bucket |
| ---- | ------------------------------------------------- | ------ | ---------------------------------------------------------------------- | ------------------------------------------------------------ | ------ |
| C-1  | `Avatar` usa `useState` sin `'use client'`        | ✅     | `avatar.tsx:1` — `'use client';` presente.                            | —                                                            | —      |
| C-2  | `Card` no expone prop `variant`                   | ✅     | `card.tsx:7` — `variant?: CardVariant` definido; líneas 15-16 aplican `nx-card--raised`/`--interactive`. | —                                                            | —      |
| C-3  | `KPICard` vive en `features/dashboard/`           | ⏳     | `src/features/dashboard/components/kpi-card.tsx` — no ha sido movido. No hay `src/components/dashboard/kpi-card.tsx`. | Mover a `components/dashboard/kpi-card.tsx` y actualizar imports. Bloquea documentación en `/ui`. Cat B. | B9.1   |
| C-4  | Checkbox, Switch, Label sin uso real              | ⚠️     | `label.tsx` fue **eliminado** en main (`forms.md` confirma: "El componente Label fue eliminado, 0 consumers, YAGNI"). Checkbox: solo en `ui/checkbox/checkbox-content.tsx` (showcase). Switch: solo en `ui/switch/switch-content.tsx` (showcase). Ninguno tiene uso en feature real. | Conectar Checkbox+Switch a feature real (ej. notification settings en Settings). Cat B. | B9.1   |
| C-5  | `Spinner` inlineado en `Button`                   | ✅     | `button.tsx:5` — `import { Spinner } from './spinner'`. `src/components/ui/spinner.tsx` existe con showcase propio. | —                                                            | —      |
| C-6  | `Tooltip` sin portal                              | ✅     | `tooltip.tsx:4,98` — `import { createPortal } from 'react-dom'` + `createPortal(...)` en el render. | —                                                            | —      |
| C-7  | `DropdownMenu` sin keyboard navigation            | ✅     | `dropdown-menu.tsx:129-145` — `ArrowDown`, `ArrowUp`, `Home`, `End`, `Escape` manejados en `handleMenuKeyDown`. | —                                                            | —      |
| C-8  | Charts API inconsistency (`color` vs `series[]`)  | ⏳     | `area-chart.tsx`/`bar-chart.tsx`: prop `color` + `yKey`. `line-chart.tsx`: prop `series: {key, color, label}[]`. `donut-chart.tsx`: color por datum en el array de data. Sin cambios desde B6-audit. | Normalizar API: proponer `series[]` unificado o añadir overloads sin romper consumidores existentes. Cat C. | B9.2   |
| C-9  | Native `<select>` vs design system "premium"      | ❓     | `select.tsx` usa `<select>` nativo. Showcase en `/ui/select` documenta como nativo intencional. | Confirmar si la decisión de nativo sigue vigente o si se planea un Select custom en el roadmap. | —      |
| C-10 | `.nx-kbd`/`.nx-divider`/`.nx-dot` solo CSS        | ⚠️     | `kbd.tsx` ✅ — componente React existe. `separator.tsx` ✅ — usa `.nx-separator` (`.nx-divider` ya no existe en CSS). `.nx-dot` ⏳ — solo CSS en `components.css:371`, sin componente React ni ningún consumidor React. | Si `.nx-dot` tiene caso de uso, crear componente trivial `Dot`; si no, evaluar eliminar la clase CSS huérfana. Cat A. | B9.2   |

---

### size="icon" legacy (B-*)

| ID  | Item                                              | Estado | Evidencia                                                             | Sugerencia | Bucket |
| --- | ------------------------------------------------- | ------ | --------------------------------------------------------------------- | ---------- | ------ |
| B-1 | `size="icon"` legacy vs `iconOnly`               | ✅     | `grep -rn 'size="icon"' src/` — 0 resultados en código de producción. Toda la UI usa `iconOnly`. | —          | —      |

---

### DataTable (D-*)

| ID  | Item                                              | Estado | Evidencia                                                             | Sugerencia                                                   | Bucket |
| --- | ------------------------------------------------- | ------ | --------------------------------------------------------------------- | ------------------------------------------------------------ | ------ |
| D-1 | Pagination no extraída como componente            | ⏳     | `data-table.tsx:165-205` — paginación totalmente embebida. No existe `src/components/ui/pagination.tsx`. | Extraer `Pagination` como componente standalone (`page`, `pageSize`, `totalItems`, `onChange`). Cat B. | B9.3   |
| D-2 | DataTable 258 LOC                                 | ⏳     | `wc -l data-table.tsx` → 258 líneas. Creció +50 desde B6-audit por la adición de `searchable` (filter + input de búsqueda). | Consecuencia directa de D-1; la extracción de Pagination + SearchInput externos reduciría ~60 líneas. No acción autónoma. | B9.3   |
| D-3 | DataTable sin keyboard navigation entre celdas   | ⏳     | `data-table.tsx` — sin eventos `onKeyDown`, sin `tabIndex` en celdas, sin comentario de "known limitation". | Añadir roving tabindex en celdas + ArrowUp/Down/Left/Right. Cat C (independiente). | B9.3   |
| D-4 | Pagination limitada a 5 botones visibles          | ⏳     | `data-table.tsx:180` — `Array.from({ length: Math.min(5, totalPages) })`. Páginas > 5 son inaccesibles directamente. | Al extraer Pagination (D-1), implementar "windowed" pages con `…` elipsis. Cat B. | B9.3   |
| D-5 | Filter actúa sobre valores crudos, no sobre `col.render` | ⏳ | `data-table.tsx:58-68` — filter implementado en main (prop `searchable`). Comentario en código: `"Filter — raw column values only (col.render returns ReactNode, not filterable)"`. Columns con `render` que transformen el valor no son buscables. | Normalizar filter para aplicar sobre valor formateado (extraer `getFilterableValue` del column). Cat B. | B9.3   |

---

### Skeleton (K-*)

| ID  | Item                                              | Estado | Evidencia                                                             | Sugerencia                                                   | Bucket |
| --- | ------------------------------------------------- | ------ | --------------------------------------------------------------------- | ------------------------------------------------------------ | ------ |
| K-1 | Skeleton aria-labels en EN (no localizados)       | ⏳     | `chart-skeleton.tsx:17` — `"Loading chart"`. `table-skeleton.tsx:14` — `"Loading table"`. Etc. Documentado como deuda aceptable en `i18n.md`. | Aceptar como deuda técnica conocida hasta decidir si los skeletons deben ser cliente (requeriría `useTranslations`). Low priority. | —      |
| K-2 | `UserCardSkeleton` dimensiones no coinciden con perfil xl | ⏳ | `user-card-skeleton.tsx:6` — avatar `h-10 w-10` (40px). `user-detail-content.tsx:115` usa `Avatar size="xl"` = 64×64px (ver `components.css:839`). Diferencia de 24px. CLS visible. | Cambiar `h-10 w-10` → `h-16 w-16` (64px) en UserCardSkeleton. Cat A. | B9.2   |

---

### Charts (CH-*)

| ID   | Item                                              | Estado | Evidencia                                                             | Sugerencia                                                   | Bucket |
| ---- | ------------------------------------------------- | ------ | --------------------------------------------------------------------- | ------------------------------------------------------------ | ------ |
| CH-1 | `DonutChart` hardcodea `${v}%` en tooltip formatter | ⏳   | `donut-chart.tsx:37` — `formatter={(v) => [\`${v}%\`]}`. Sin prop de customización. | Añadir prop `formatValue?: (v: number) => string` con default `(v) => \`${v}%\``. Cat A. | B9.2   |

---

### Topbar (T-*)

| ID  | Item                                              | Estado | Evidencia                                                             | Sugerencia                                                   | Bucket |
| --- | ------------------------------------------------- | ------ | --------------------------------------------------------------------- | ------------------------------------------------------------ | ------ |
| T-1 | Notification count hardcoded `3`                  | ⏳     | `topbar.tsx:63` — `<span ...>3</span>` (literalmente el número 3). Sin estado ni prop. | Conectar a un store o prop `notificationCount`. Cat B. | B9.2   |
| T-2 | Search input visible pero no funcional            | ⏳     | `topbar.tsx:45-50` — `<Input leftIcon={<Search>} placeholder={...} />` sin `value`/`onChange`. No hay handler. | Decisión: implementar búsqueda global o quitar el input del topbar hasta que exista la feature. Cat C. | B9.2   |
| T-3 | Profile/Settings menu items con `onClick={() => {}}` no-op | ⏳ | `topbar.tsx:93-94` — ambos `DropdownMenuItem` tienen handlers vacíos. La ruta `/settings` existe en `routes.ts`. | Settings → `router.push(routes.settings)` (Cat A, quick win). Profile → pendiente hasta que exista página de perfil. | B9.1   |

---

### Auth y rutas (A-*)

| ID  | Item                                              | Estado | Evidencia                                                             | Sugerencia | Bucket |
| --- | ------------------------------------------------- | ------ | --------------------------------------------------------------------- | ---------- | ------ |
| A-1 | `login-form.tsx` llama `router.push` directamente | ✅    | `login-form.tsx:46` — `router.push(routes.dashboard)` en `onSuccess`. `proxy.ts:48-51` — redirige al dashboard cuando hay sesión activa y el usuario intenta ir a `/login`. Propósitos distintos: form navega post-login, proxy guarda rutas. Coexistencia correcta. | —          | —      |

---

### Foundations residuals (F-*)

| ID  | Item                                              | Estado | Evidencia                                                             | Sugerencia                                                   | Bucket |
| --- | ------------------------------------------------- | ------ | --------------------------------------------------------------------- | ------------------------------------------------------------ | ------ |
| F-1 | TOC con anchors muertos en `/ui/foundations`      | ✅     | `foundations-content.tsx:36-45` — `TOC_IDS` tiene exactamente: `philosophy, colors, typography, spacing, radii, elevation, motion, iconography`. Cada uno tiene `<section id="...">` correspondiente. | —                                                            | —      |
| F-2 | TOC no extraída a componente reusable             | ⏳     | `foundations-content.tsx:83-115` — TOC completamente inline. No existe `FoundationsToc.tsx` ni componente reutilizable. | Extraer como `<FoundationsToc items={TOC_IDS} />` si se prevé reutilización en otras páginas largas. Cat A. | B9.2   |
| F-3 | `AccentScope` vs `data-accent` raíz               | ❓     | `foundations-content.tsx:27,71,118` — `AccentScope` envuelve la sección de color swatches. Decisión deliberada: las foundations muestran colores aislados del accent global. | Confirmar como decisión de arquitectura aceptada y documentar en el componente con comentario de por qué. | —      |
| F-4 | Replay grid flicker al re-mount                   | ⏳     | `foundations-content.tsx:948,1058` — `const [replayKey, setReplayKey] = useState(0)` + `<div key={replayKey}>`. Desmontaje completo de la grid. | Reemplazar con CSS `animation-play-state` reset via class toggle para evitar unmount. Cat A. | B9.2   |
| F-5 | `PRINCIPLE_KEYS` hardcodeadas en array            | ⏳     | `foundations-content.tsx:47-55` — 6 entradas hardcoded (`sharp_cards`, `pill_controls`, etc.). Sin lógica dinámica. | Aceptable: 6 principios son estables. Deuda mínima. Low priority. | —      |

---

### Forms / SettingsForm (FM-*)

| ID   | Item                                              | Estado | Evidencia                                                             | Sugerencia                                                   | Bucket |
| ---- | ------------------------------------------------- | ------ | --------------------------------------------------------------------- | ------------------------------------------------------------ | ------ |
| FM-1 | `SettingsForm` simula mutation con `sleep(500)`   | ⏳     | `settings-form.tsx:11,41` — `import { sleep }` + `await sleep(500)` en `onSubmit`. No existe hook `useUpdateProfile` ni endpoint. | Crear `src/features/auth/api/use-auth.ts` update o `features/settings/` feature con `useUpdateProfile`. Cat B. | B9.1   |

---

### Tests (TE-*)

| ID   | Item                                              | Estado | Evidencia                                                             | Sugerencia                                                   | Bucket |
| ---- | ------------------------------------------------- | ------ | --------------------------------------------------------------------- | ------------------------------------------------------------ | ------ |
| TE-1 | No hay suite de tests                             | ❓     | `package.json` — sin scripts `test`, `jest`, `vitest`, `playwright`, `cypress`. `CLAUDE.md` confirma: "No test suite is configured". | Decisión de fase: ¿Jest + RTL para unitarios, o Playwright para e2e, o ambos? No es un fix de B9; es una fase propia. | —      |

---

## Pendientes agrupados por bucket

### B9.1 — Architectural cleanup (~8 items)

Items de corrección directa con impacto en arquitectura o calidad de código. La mayoría Cat A–B.

- **S-3**: Eliminar `notificationSettingsSchema`/`NotificationSettingsValues` no usados de `settings.schema.ts`
- **L-2**: Fijar warning `_data` en `settings-form.tsx` (argsIgnorePattern o renombrar a `_`)
- **L-3**: Avatar `<img>` → `<Image>` + `images.remotePatterns` en `next.config.ts`
- **V-2**: Reemplazar `fontWeight: w.value as unknown as number` en `foundations-content.tsx:523` con número directo
- **C-3**: Mover `kpi-card.tsx` de `features/dashboard/components/` a `components/dashboard/`
- **C-4**: Conectar Checkbox/Switch a feature real (Label ya eliminado ✅)
- **T-3**: Wiring Settings menu item → `router.push(routes.settings)` (quick win ~5 min)
- **FM-1**: Implementar `useUpdateProfile` / endpoint mock real para SettingsForm

### B9.2 — Component refinements (~8 items)

Mejoras sin cambios arquitectónicos, en su mayoría Cat A–B. Algunos Cat C (T-2, C-8).

- **CH-1**: `DonutChart` — añadir prop `formatValue?` (default `${v}%`)
- **K-2**: `UserCardSkeleton` — corregir avatar `h-10/w-10` → `h-16/w-16` para coincidir con `Avatar xl`
- **C-10**: `.nx-dot` — crear componente `Dot` si tiene caso de uso, o eliminar la clase CSS huérfana
- **C-8**: Charts API — normalizar `color` vs `series[]` (Cat C — breaking change, requiere migrar consumidores)
- **V-1**: Radii — establecer convención única (CSS tokens vs Tailwind utilities) en páginas showcase
- **F-2**: Extraer TOC inline de `foundations-content.tsx` a componente reutilizable
- **F-4**: Replay grid — reemplazar unmount/remount con CSS animation reset
- **T-1**: Topbar notification count — conectar a store o prop en lugar de literal `3`
- **T-2**: Search topbar — decidir e implementar búsqueda global, o retirar input hasta que exista

### B9.3 — DataTable keyboard nav & pagination (~5 items)

Bloque independiente y autónomo. Recomendado como sub-bloque separado por su tamaño.

- **D-1**: Extraer `Pagination` como componente standalone
- **D-2**: DataTable LOC bajará consecuentemente con D-1 (actualmente 258)
- **D-3**: Keyboard navigation entre celdas (roving tabindex + arrow keys)
- **D-4**: Paginación windowed con elipsis (al implementar D-1)
- **D-5**: Filter sobre valores crudos — añadir `getFilterableValue` o `filterValue` al Column type

---

## Decisiones requeridas

Items con ❓ que necesitan input del arquitecto antes de actuar:

- **TE-1**: ¿Planeamos suite de tests como próxima fase? Si sí, ¿unitarios (Vitest/RTL), e2e (Playwright), o ambos? No acometible en B9.
- **C-9**: Confirmar que el `Select` nativo es la decisión final y documentarlo en el showcase como "intencional".
- **F-3**: Confirmar `AccentScope` en foundations como decisión de arquitectura aceptada (las foundations muestran colores aislados del accent global del usuario — no es un bug).
- **S-3** (notification schemas): ¿Se prevé una sección de Notification Settings en el settings page? Si sí, los tipos existentes en `settings.schema.ts` son la base. Si no, eliminarlos.

---

## Notas / Observaciones

Hallazgos detectados durante el audit que no estaban en la lista original:

1. **B6f/B6g/B6h SÍ se ejecutaron en main**: La auditoría se realizó inicialmente sobre el worktree (basado en B6e.1); tras el rebase a main, se confirmó que B7.1/B7.2 (charts) + commits intermedios (data-table, table) + B8 (layout) completaron los bloques. Showcase pages para area-chart, bar-chart, line-chart, donut-chart, data-table, table, topbar, breadcrumbs, theme-toggle existen en main.

2. **`label.tsx` eliminado correctamente en main**: `forms.md` confirma: "El componente Label fue eliminado (0 consumers, YAGNI)". C-4 actualizado a ⚠️ — solo Checkbox/Switch pendientes.

3. **`notificationSettingsSchema` en `settings.schema.ts`**: Dead code (types + schema definidos pero nunca referenciados por ningún hook, form o handler). Agrupado en S-3.

4. **`next.config.ts` sin `images.remotePatterns`**: El avatar usa `ui-avatars.com` como fuente de imágenes externas. Para migrar de `<img>` a `<Image>` (L-3), este dominio deberá añadirse.

5. **DataTable con `searchable` prop — filter implementado**: El filter existe (`data-table.tsx:58-68`) pero opera sobre valores crudos de columna. Columnas con `render` que transforman el valor quedan fuera del search. Esto coincide exactamente con el D-5 original. El audit map corregido clasifica D-5 como ⏳.

---

*Documento generado en B9.0 (read-only). Ningún código de producción fue modificado.*
