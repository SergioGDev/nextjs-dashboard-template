# NexDash Boilerplate — Changelog

Registro de cambios por bloque de trabajo. Cada bloque deja el repo en verde
(`npm run lint` y `npm run build` sin errores). Documento pensado como apoyo
para el TFM: incluye **qué** se hizo, **por qué** y **qué se descartó**.

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
