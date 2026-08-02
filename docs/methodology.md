# Metodología de desarrollo asistido por IA

Cómo se construyó NexDash. No es una guía de "cómo usar un asistente de código", sino el
registro de un método concreto —con sus aciertos y sus fallos— aplicado a un proyecto real
durante tres meses.

**Cifras**: 48 commits, 63 bloques documentados, ~20.000 líneas en `src/`, 56 tests.
Del 3 de mayo al 2 de agosto de 2026.

---

## El problema de partida

Un asistente de IA con acceso al repositorio puede escribir mucho código muy rápido. El cuello
de botella deja de ser la producción y pasa a ser **la verificación**: cómo saber que lo
generado hace lo que dice, sin releerlo entero.

Este proyecto adopta un método que ataca ese cuello de botella en tres frentes: separar quien
decide de quien ejecuta, acotar el trabajo en unidades verificables, y no aceptar ninguna
afirmación que no se pueda comprobar.

---

## 1. Separación arquitecto / ejecutor

El trabajo se reparte entre **dos conversaciones distintas** con roles asimétricos:

| | **Arquitecto** | **Ejecutor** |
|---|---|---|
| Decide | qué hay que conseguir y por qué | cómo implementarlo |
| Toca el repo | no | sí |
| Contexto | el proyecto entero, el roadmap | un sub-bloque |
| Entrega | un prompt | código + resumen de cierre |

El arquitecto redacta un prompt con estructura fija (contexto, objetivos, secciones, verificación
manual, documentación, condiciones de cierre). El ejecutor lo aplica y devuelve un resumen. El
arquitecto **verifica ese resumen de forma independiente** antes de dar el bloque por cerrado.

Las convenciones exactas de redacción están en [`.claude/rules/architect-prompts.md`](../.claude/rules/architect-prompts.md).

### Por qué funciona

**El contexto no se satura.** El ejecutor arranca limpio en cada sub-bloque. No arrastra las
decisiones de hace veinte bloques ni las confunde con las actuales.

**Las decisiones quedan trazadas.** Cada prompt distingue explícitamente entre:

- *Decisiones ya tomadas* — fijadas con su razón, no reabribles. Ejemplo: «base `node:22.16-slim`,
  no alpine, porque `sharp` usa binarios contra glibc y un fallo suyo aparece en runtime en el VPS,
  no en build».
- *Decisiones delegadas* — presentadas como OPCIÓN A / OPCIÓN B + RECOMENDACIÓN. El ejecutor
  elige y **justifica su elección en el resumen**.

Esa distinción evita las dos patologías opuestas: un prompt que microgestiona cada línea, y uno
tan vago que el ejecutor improvisa arquitectura.

**Los hallazgos se pasan como hechos, no como pistas.** Si el arquitecto ya verificó que
`src/app/providers.tsx` instancia el `QueryClient` a nivel de módulo, el prompt lo afirma. Sin
eso, el ejecutor gasta contexto redescubriéndolo y puede llegar a otra conclusión.

---

## 2. Disciplina de bloques

El trabajo se divide en bloques numerados (B1, B2…), subdivididos cuando hace falta (B12.1,
B12.2, B12.3). Cada uno tiene **condiciones de cierre explícitas** y no negociables:

```
[ ] npm test        → verde
[ ] npm run lint    → 0 errores
[ ] npm run build   → pasa
[ ] documentación actualizada
```

Reglas que se demostraron útiles:

**Dividir cuando el bloque mezcla capas.** B13 juntaba deuda de UI y hardening de despliegue: se
verifican de formas distintas (navegador vs. `curl` contra la URL pública), así que se partió.

**Aislar lo arriesgado.** B11 se dividió en arnés de tests (B11.1) y tests (B11.2). Si el arnés
falla, es un problema acotado; mezclado con 25 tests, es imposible distinguir si lo que rompe es
el setup o el test.

**Cada bloque deja el repo desplegable.** No hay ramas largas ni estados intermedios rotos. Los
48 commits son lineales sobre `main`.

**La documentación es parte del bloque, no un extra.** Cada uno actualiza `docs/CHANGELOG.md`
con *qué* se hizo, *por qué*, y *qué se descartó*. El CHANGELOG es el registro histórico y es
inmutable: las entradas pasadas no se editan nunca, aunque hayan quedado desfasadas — describen
correctamente el estado del momento.

---

## 3. Verificación: por qué «los tests pasan» no basta

Es la parte menos obvia del método y la que más errores reales detectó.

### Verificación por mutación

Un suite verde puede estar lleno de tests tautológicos. La comprobación es **romper el código a
propósito y confirmar que los tests fallan**:

```bash
# Invertir la regla que hace que /reports muestre el label del grupo
sed -i '' 's/linkHref === groupHref/linkHref !== groupHref/' src/lib/route-info.ts
npm test   # → debe salir: 1 failed
git checkout -- src/lib/route-info.ts
```

Aplicado a cuatro capas distintas (lógica pura, mapeo de errores del handler, interacción de
componente), cada mutación produjo **exactamente un fallo**: cobertura precisa, sin solapamiento.

Un test que no puede fallar no es cobertura, es decoración.

### Convertir afirmaciones en asserts ejecutables

La documentación afirma cosas sobre el código, y ninguna herramienta la lee. Seis desfases
aparecieron en cinco bloques sin que lint, build ni 56 tests detectaran ninguno.

La respuesta fue [`scripts/check-doc-paths.mjs`](../scripts/check-doc-paths.mjs): extrae cada ruta
citada en la documentación viva y falla si no existe en disco. Convierte «¿está la doc al día?»
en un check binario, integrado en CI.

Tiene exclusiones deliberadas —ficheros históricos, contraejemplos marcados con `✗`, plantillas
con `{placeholder}`— y esas exclusiones también se verifican: desactivar el filtro `✗` debe hacer
que el check vuelva a reportar el contraejemplo. Un check con exclusiones demasiado amplias pasa
siempre.

### Verificar el resultado, no el procedimiento

El despliegue en producción se validó lanzando la batería completa contra la URL pública: TLS,
gate de auth, flujo de login, estáticos, optimización de imágenes. Más una comprobación específica
del invariante de réplica única —12 llamadas consecutivas a `/me` con la misma cookie— porque con
dos contenedores el store de sesiones en memoria no se comparte y algunas habrían devuelto 401.

---

## 4. Lo que salió mal

La parte más instructiva. Todos estos casos son reales y están trazados en el CHANGELOG.

### El agente se equivocó en un diagnóstico, y era importante

Al dockerizar, el build imprimía `Found lockfile missing swc dependencies`. El ejecutor lo
investigó y concluyó que era un falso positivo. **No lo era**: faltaban los binarios `@next/swc-*`
de las demás plataformas. Sin ellos, `npm ci` dentro de la imagen Docker no habría instalado el
binario de swc para Linux.

Habría fallado en el VPS y no en la máquina de desarrollo, que es la peor forma de descubrirlo.
Se detectó porque el arquitecto reprodujo el build en vez de aceptar el resumen.

### Checks que verificaban lo que no puede fallar

Tres veces apareció el mismo patrón:

1. El assert de CI sobre `/api/version` comprobaba el campo `version`, que sale de `package.json`
   y **nunca puede estar vacío**. Si el paso que escribe el sello de build fallara en silencio, el
   check pasaría igual.
2. Un test llamado «muestra todas las páginas cuando `totalPages <= 7`» probaba con **5**, dejando
   el límite sin cubrir — justo el valor que tiene la vista de usuarios.
3. Otro comprobaba que tres recuentos de slots fueran iguales entre sí, pero no *cuál* era. Alterar
   el cálculo no rompía nada.

Los tres se detectaron por mutación y se reforzaron.

### Errores de acotación del arquitecto

Dos veces el mismo fallo, y ambas mías. B10 existía para realinear documentación desfasada, pero
lo acoté a versiones y estado del roadmap: se me escapó que `CLAUDE.md` seguía describiendo un
directorio de mocks centralizado que el refactor B2.5 había eliminado meses antes, sustituyéndolo
por la capa de datos dentro de cada feature. B11.6 corrigió eso, pero lo acoté a `CLAUDE.md` y las
reglas, sin incluir la carpeta `docs/`: quedaron seis ficheros citando rutas sin el segmento de
locale.

Los detectó el check automático en su primera ejecución. La lección no es «acota mejor» —eso ya
falló dos veces— sino **convertir el criterio en una comprobación que no dependa de acotar bien**.

### Un prompt con requisitos contradictorios

Se pidió ampliar el dataset a ~70 usuarios (7 páginas) *y* que la paginación mostrara todas las
páginas sin elipsis hasta 7. Ambas cosas juntas significan que la vista de usuarios nunca enseña
la elipsis. El ejecutor cumplió las dos reglas y **avisó de la contradicción** en vez de resolverla
por su cuenta. Ese es el comportamiento correcto.

### Código correcto con salida absurda

Un generador determinista de datos mock producía 70 nombres únicos, pero avanzaba el apellido cada
10 entradas — exactamente el tamaño de página. La primera página mostraba diez personas apellidadas
Blackwood. El comentario del código describía el comportamiento (*"last advances every 10 entries"*)
sin notar la consecuencia.

Ningún test lo habría detectado: los datos eran válidos. Lo detectó mirar la salida.

---

## 5. Qué transferiría a otro proyecto

1. **Separar quien decide de quien ejecuta.** El valor no está en que el agente escriba código,
   sino en que alguien con el contexto completo verifique lo que escribió.
2. **Distinguir decisiones fijadas de decisiones delegadas**, y exigir justificación de las
   segundas.
3. **Pasar los hallazgos ya verificados como hechos** en el prompt. Redescubrir cuesta contexto y
   puede llegar a otra conclusión.
4. **Instruir "para y repórtalo" en vez de "arréglalo"** para la deuda fuera de alcance. Un agente
   que arregla lo que encuentra convierte cada bloque en un refactor sin fronteras.
5. **Mutar el código para validar los tests.** Es la única forma de distinguir cobertura de
   decoración.
6. **Convertir en asserts ejecutables toda afirmación que se repita.** Lo que no se comprueba
   automáticamente, se desfasa — y la documentación se desfasa sin que ningún build se queje.
7. **Verificar el resultado, no el resumen.** Los resúmenes de cierre fueron mayoritariamente
   precisos, pero los tres errores que llegaron más lejos venían de afirmaciones plausibles que
   nadie había reproducido.

---

## Trazabilidad

- [`docs/CHANGELOG.md`](CHANGELOG.md) — registro bloque a bloque con el *qué*, el *porqué* y lo descartado
- [`.claude/rules/architect-prompts.md`](../.claude/rules/architect-prompts.md) — convenciones de redacción de prompts
- [`docs/B6-audit.md`](B6-audit.md) y [`docs/B9-audit.md`](B9-audit.md) — auditorías, snapshots históricos
- [`docs/architecture.md#decision-log`](architecture.md) — decisiones de arquitectura con su alternativa descartada
