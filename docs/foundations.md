# Foundations

Página `/ui/foundations` que documenta los tokens y decisiones base del design system NexDash. Es la primera entrada del bloque B6 (UI Showcase) y la referencia visual para todos los demás bloques.

Implementación:

- Página: `src/app/[locale]/(dashboard)/ui/foundations/page.tsx` (server, expone `generateMetadata`).
- Contenido: `foundations-content.tsx` (client, todo el árbol porque depende de `AccentScope`).
- Animaciones de Motion: `foundations-content.module.css` (CSS module local).

## Estructura

Una sola página dividida en 8 secciones internas con TOC sticky a la derecha en `lg+`:

- **Design philosophy** — 6 principios visuales del rediseño Mercury (sharp cards, pill controls, tracking positivo, weight ceiling 530, layering vs shadow, accent monocromo).
- **Colors** — surfaces, text, borders, semantic, accent. La subsección Accent incluye un picker interactivo.
- **Typography** — Inter + JetBrains Mono. 4 subsecciones: families (cards lado a lado), scale (7 specimens descendentes), weights (4 cards "Aa" con clamp visible en 530), tracking (tabla con previews aplicando cada `letter-spacing`).
- **Spacing** — 11 tokens (`--space-0` a `--space-16`) en tabla con barras de ancho proporcional al px del token.
- **Radii** — 2 paneles de "firma Mercury" (Cards are sharp / Controls are pills) + 7 tokens en tabla con previews adaptados (cuadrados pequeños, pills, círculo).
- **Elevation** — torre de 4 superficies anidadas + 2 cards de box-shadow (`--shadow-card`, `--shadow-pop`) con notas explicativas.
- **Motion** — durations (3 tokens con pulse infinito), easings (2 tokens con cuadrados rebotando), demo grid 3×2 con botón "Replay all" que reinicia las 6 combinaciones a la vez.
- **Iconography** — card de librería con import statement y rejilla de 12 iconos a 20px + tabla de 4 tamaños canónicos (14, 16, 20, 24).

## Componentes auxiliares

Todos en `src/features/ui-showcase/components/` y reutilizables por las páginas posteriores de B6:

- **`TokenSwatch`** — bloque de color + label + descripción + var name. Tres tamaños y patrón cuadriculado opcional para mostrar transparencias.
- **`TokenRow`** — fila de tabla `[var name | value | preview | label]`. Para listados densos de tokens (spacing, radii, motion, tracking).
- **`TypeSpecimen`** — sample tipográfico + columna lateral de specs. Soporta familia mono.
- **`AccentScope` + `AccentPicker`** — wrapper que muta `data-accent` en su subárbol y picker que comparte estado vía Context. Solo afecta a sus descendientes, nunca al accent global.
- **`PhilosophyCard`** — card con icon tinted accent, título y descripción para listas de principios.

## i18n

Namespace `foundations` separado del resto del showcase, cargado en `src/i18n/request.ts` desde `features/ui-showcase/i18n/foundations-{en,es}.json`.

Política híbrida aplicada en todo el árbol:

- **Se traduce**: prosa descriptiva (titles, subtitles, descriptions, notes).
- **No se traduce**: nombres de tokens (`--xxx`), valores (px, rem, em, ms), nombres de fonts (Inter, JetBrains Mono), nombres de easings (cubic-bezier), nombres de accents (indigo, violet…), pangrams ("The quick brown fox").

## AccentScope: scope local

El `AccentPicker` de la página Foundations muta `data-accent` SOLO dentro del wrapper `<AccentScope>` de la página. No afecta al accent global del usuario gestionado por `ui.store`. Es educativo, no funcional. Para cambiar el accent global, ir a `/settings`.

Si el usuario tiene un accent global activo (p. ej. `cyan`) y abre Foundations, los swatches y el botón demo arrancan con `cyan` (heredado del root `<html>`). Al pulsar otro accent en el picker, el subárbol cambia pero el resto de la app (sidebar, topbar) mantiene `cyan`. Al salir de la página, el override se pierde — el siguiente render arranca otra vez con el accent global.

## Animaciones de Motion

Los keyframes y clases viven en `foundations-content.module.css` (CSS module local). Ningún cambio en `tokens.css` ni en `components.css`. Las clases:

- `pulseFast` / `pulseBase` / `pulseSlow` — opacity 0.3 ↔ 1, infinito, con la duración del token.
- `easeOutLoop` / `easeInOutLoop` — slide 0 → 64px, infinito, alternate, 1500ms, con el easing del token.
- `cellFastOut` / `cellBaseOut` / `cellSlowOut` / `cellFastInOut` / `cellBaseInOut` / `cellSlowInOut` — slide 0 → 64px, una sola vez, fill-mode forwards, con la combinación duración × easing.

El botón "Replay all" incrementa una `key` en el contenedor de la rejilla, lo que fuerza re-mount y reinicia las 6 animaciones simultáneamente.

## Cuándo actualizar esta página

- **Tokens nuevos**: añadirlos a la sección correspondiente (color → Colors, espaciado → Spacing, etc.).
- **Nuevos principios de diseño**: añadirlos a `philosophy.principles` en el namespace + nuevo entry en `PRINCIPLE_KEYS` y `PRINCIPLE_ICONS`.
- **Cambios en font-family o stack tipográfico**: actualizar Typography → Families (sample + stack literal en font-mono).
- **Nuevo easing o duración**: añadir a `MOTION_EASINGS` / `MOTION_DURATIONS` y crear la clase correspondiente en el CSS module.
- **Nueva categoría de iconos por tamaño**: añadir entry a `ICON_SIZES` y nueva clave i18n bajo `iconography.sizes.*`.

## Integración

- **Sidebar `/ui`**: Foundations es la primera entrada de contenido del grupo UI, después de Overview (`sidebar.config.ts`). Icono: `Palette` (Lucide).
- **Overview `/ui`**: Foundations es la primera card del grid (`/ui/page.tsx`), con `count: 8` y `unit: 'sections'` (introducido específicamente para esta categoría — el resto sigue usando `unit: 'components'` por defecto).
