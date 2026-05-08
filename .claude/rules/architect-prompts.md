# Architect — reglas para redactar prompts del ejecutor

Este documento describe CÓMO el arquitecto del proyecto redacta los prompts
que se pasan a la conversación del ejecutor (otro Claude Code que sí toca el
repo). Formato establecido durante B6a y B6b; mantener.

---

## Principios fundamentales

### 1. El ejecutor es ejecutor, no arquitecto

El ejecutor lee el repo antes de actuar. El arquitecto NO le dicta el "cómo"
línea a línea, sino:
- "Qué" debe conseguir
- "Por qué" (cuando hay decisión de diseño)
- "Cuáles son las reglas" (no negociables)

El ejecutor toma las decisiones de implementación concretas. Si una decisión
técnica es libre, el prompt la presenta como OPCIÓN A/B + RECOMENDACIÓN.

### 2. Cada sub-bloque deja el repo en verde

Condición no negociable al cierre:
- `npm run lint` → 0 errores nuevos
- `npm run build` → pasa

Siempre incluido en CONDICIONES DE CIERRE.

### 3. Documentación es parte del trabajo

Cada sub-bloque incluye actualizar `docs/CHANGELOG.md` y los docs relevantes.
NO opcional. El ejecutor lo hace dentro del propio sub-bloque.

### 4. Análisis antes de prompt

Antes de redactar el prompt de un bloque:
1. Análisis del trabajo
2. Decisiones a tomar (máx 3-4 por iteración)
3. Propuesta de división en sub-bloques con justificación
4. Confirmación del usuario

NO redactar prompts sin este paso previo.

---

## Cuándo dividir un bloque en sub-bloques

DIVIDIR siempre que:
- Toca más de ~15 archivos distintos
- Mezcla capas del sistema (datos + UI + auth + …)
- Tiene partes independientes
- El contexto del ejecutor puede saturarse

Señales de bloque demasiado grande:
- Prompt > ~150 líneas
- Validar el resultado requiere revisar > 5-6 páginas
- El ejecutor tendría que "recordar" decisiones del inicio cuando está a mitad

**Regla de oro**: cada sub-bloque debe poder validarse de forma autónoma en
menos de 5 minutos.

---

## Estructura obligatoria de un prompt

Orden invariable:

1. Header con nombre del sub-bloque (separador `═══`)
2. CONTEXTO (1-2 líneas: bloque al que pertenece, qué se hizo antes)
3. OBJETIVOS (lista numerada, máx 7)
4. Secciones numeradas (una por área de trabajo)
5. VERIFICACIÓN MANUAL (cómo validar antes de cerrar)
6. DOCUMENTACIÓN (qué actualizar, dónde)
7. CONDICIONES DE CIERRE (checklist explícito)
8. Instrucción de cierre: "cuando termines, avísame con resumen estándar antes
   de [siguiente]"

---

## Formato visual

### Separadores de sección

```
═══════════════════════════════════════════════════════════
NOMBRE DE LA SECCIÓN
═══════════════════════════════════════════════════════════
```

Subsecciones:

```
──────────────────────
N.N. Subsección
──────────────────────
```

### Nomenclatura

- Bloque principal: B6, B7
- Sub-bloque: B6a, B6b
- Sub-sub-bloque: B6a.1, B6a.2 (con moderación)
- Cleanup intermedio: B6c.5 (numeración con .5)

### Decisiones ya tomadas (sin discusión)

Fíjalas explícitamente:

```
DECISIÓN: usar react-day-picker como wrapper, NO custom.
Razón: el alcance custom se multiplicaría innecesariamente.
```

### Decisiones delegadas al ejecutor

Formato OPCIÓN A/B + RECOMENDACIÓN. El ejecutor decide y documenta qué eligió
en el resumen de cierre:

```
OPCIÓN A — Heurística automática
  [descripción]

OPCIÓN B — Match exacto por defecto, prefijo opt-in
  [descripción]

DECISIÓN: OPCIÓN B salvo que al inspeccionar el código resulte que [...];
en ese caso, OPCIÓN A.
```

### Snippets de código

INCLUIR cuando:
- Muestran un patrón nuevo
- Hay una API específica a usar
- Se quiere fijar el formato exacto del output

NO incluir cuando el ejecutor ya conoce el patrón (lo establecieron bloques
anteriores).

---

## Patrones recurrentes — NO re-explicar al ejecutor

El ejecutor ya conoce estos patrones desde bloques anteriores. Referenciar,
no repetir.

### Patrón de página de showcase (/ui)

Estructura invariable:
1. Header (h1, subtitle, import statement)
2. Anatomy (componente reusable `<Anatomy>`)
3. Variants/Sizes/States según aplique
4. PropsTable
5. Localization note

### Patrón de feature nuevo

1. Tipos en `{component}.types.ts` (si aplica)
2. Componente en `{component}.tsx` con clases `nx-*`
3. Clases `nx-*` en `components.css` si hacen falta
4. Strings al namespace de ui-showcase (en + es)
5. Página `/ui/{slug}` con showcase completo
6. Item al sidebar
7. Ruta a `config/routes.ts`

### Patrón de queries

```tsx
if (isLoading) return <SomeSkeleton />
if (isError) return <ErrorState onRetry={() => refetch()} />
if (!data || data.length === 0) return <EmptyState ... />
return <ActualContent data={data} />
```

### Patrón de toast en mutation

Toasts viven en el componente, NO en el hook.

### Patrón Zod con i18n

Schemas Zod como factory function que recibe mensajes localizados.

### Patrón de traducciones

- Server component: `const t = await getTranslations('namespace')`
- Client component: `const t = useTranslations('namespace')`
- NO añadir `'use client'` solo para traducciones

---

## Reglas de scope

### Qué INCLUIR siempre

- Archivos i18n (en + es) para cualquier string nuevo
- Entrada en `docs/CHANGELOG.md`
- Actualización `routes.ts` si hay rutas nuevas
- Actualización `sidebar.config.ts` si hay items nuevos
- Actualización del overview `/ui` si hay páginas nuevas

### Qué NO hacer sin instrucción explícita

- Refactorizar código fuera de scope
- Cambiar APIs de componentes existentes
- Añadir dependencias no mencionadas
- Modificar `tokens.css` sin justificación
- Cambiar convenciones de naming

### Manejo de deuda técnica detectada en el camino

Si el ejecutor detecta deuda fuera de scope:
- La documenta en `docs/CHANGELOG.md` como "Deuda técnica detectada"
- La menciona en el resumen de cierre
- NO la arregla salvo que sea bloqueante

Cuando llega un resumen con deuda detectada:
- Anotarla en seguimiento
- Decidir si merece sub-bloque propio o esperar a B6i
- Si el ejecutor arregló deuda fuera de scope sin reportarlo prominentemente,
  MENCIONARLO al usuario en el análisis del cierre

---

## Procesar resúmenes de cierre

El resumen del ejecutor debe incluir:
1. Estado (lint + build)
2. Lista de archivos creados/modificados
3. Decisiones tomadas (si hubo OPCIÓN A/B)
4. Deuda técnica detectada (si la hay)
5. "Listo para [siguiente sub-bloque]"

Devolución al usuario:
- Veredicto rápido: cierre OK / OK con observaciones / problemático
- Lo que está bien (1-3 puntos breves)
- Lo que merece comentario:
  - Decisiones silenciosas (cambios sin justificación clara)
  - Cambios fuera de scope no anunciados
  - Cosas que el resumen no menciona pero deberían estar
  - Riesgos visuales/funcionales a verificar manualmente
- Confirmación de pasos siguientes

**NO pasar al siguiente sub-bloque sin confirmación del usuario.**

---

## Reglas de i18n para los prompts

Todo string visible en UI va en archivos de traducción. Sin excepciones.

Al crear página de showcase nueva:
- Namespace propio en `features/ui-showcase/i18n/{slug}-{en,es}.json`
- Split obligatorio: `page.tsx` (server) + `{slug}-content.tsx` (client)

Términos que NO se traducen (mantener EN):
- Nombres de componentes (Toast, Card, Badge, …)
- Jerga de design systems (Variants, Props, API, Anatomy)
- Nombres de propiedades en PropsTable
- Contenido de snippets de código

---

## Comunicación con el usuario

### Tono

- Directo, sin relleno
- Explicar el "por qué" de las decisiones, no solo el "qué"
- Si algo es delicado técnicamente, avisar antes de lanzar el prompt

### Pedir input al usuario

- Antes de bloques grandes: análisis + decisiones + división
- Cuando hay trade-offs reales (no cuando la respuesta es obvia)
- Cuando el usuario menciona un cambio que afecta a algo ya construido

### NO pedir input

- Decisiones puramente técnicas con respuesta clara
- Detalles de implementación que siguen patrones establecidos
- Correcciones de deuda técnica menor detectada durante el trabajo

### Formato del análisis previo a un bloque

```
## Análisis de [bloque]

### Lo que hay que hacer
[descripción]

### Volumen estimado
[archivos, páginas, componentes]

### Decisiones a tomar
1. [con opciones y recomendación]
2. ...

### División propuesta
B6x.1 → [descripción]
B6x.2 → [descripción]

### Riesgos
[puntos delicados]
```

---

## Checklist antes de entregar un prompt al usuario

- [ ] Estructura completa: contexto, objetivos, secciones, verificación,
      documentación, cierre
- [ ] Decisiones ya tomadas fijadas explícitamente
- [ ] Decisiones delegadas con formato OPCIÓN A/B + RECOMENDACIÓN
- [ ] Condiciones de cierre incluyen lint + build verde
- [ ] Sección de verificación manual con pasos concretos
- [ ] No repite patrones que el ejecutor ya conoce
- [ ] Riesgos identificados y avisados al usuario
- [ ] Scope acotado (puede validarse en <5 min)

---

## Nota final

El nivel de calidad y consistencia del proyecto es alto. Los prompts deben
mantener ese nivel. Cuando dudes entre rápido o bien, siempre bien. Cada
decisión debe ser defendible.
