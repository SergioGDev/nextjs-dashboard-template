# Objetivo y alcance del proyecto

Qué es NexDash, qué se propone demostrar, y —tan importante como lo anterior— qué queda
deliberadamente fuera.

---

## Qué es

**Un template de dashboard analítico**, no un producto. La diferencia no es semántica: cambia
cada decisión de diseño.

Un producto resuelve el problema de sus usuarios. Un template resuelve el problema del siguiente
desarrollador: se clona, se configura y se extiende. Eso implica que el código debe ser legible
antes que astuto, que las convenciones deben estar documentadas y ser verificables, y que los
puntos de extensión importan más que las funcionalidades.

Funciona sin backend desde el primer `npm run dev`, y conectarlo a una API real es cambiar una
variable de entorno sin tocar un solo componente ni hook.

> **Demo en vivo**: https://tfm-master-desarrollo-ia.sergiogdev.com

---

## Contexto académico

Este repositorio es el entregable del Trabajo Fin de Máster del **Máster de desarrollo con IA**.

### El encargo

El requisito del máster es construir algo genuinamente útil **desarrollándolo íntegramente con
asistencia de inteligencia artificial**. No una demostración de que un modelo puede escribir
código, sino un proyecto real llevado hasta el final —arquitectura, tests, CI y despliegue en
producción— con ese método como forma de trabajo.

### El problema real que resuelve

La elección del proyecto no fue un pretexto. En la práctica totalidad de los proyectos que
emprendo, un requisito que aparece siempre es **tener un dashboard**: navegación, autenticación,
tablas, gráficas, formularios, estados de carga y error. Cada vez, esa base se rehace desde cero.

El objetivo, por tanto, es concreto y verificable: **construir un template de dashboard funcional
y real del que partir en los siguientes proyectos**. No una maqueta que se ve bien en una captura,
sino algo que se clona y se extiende sin tener que desmontarlo antes.

Ese objetivo es el que explica casi todas las decisiones de este documento. Un template cuyo único
usuario previsto es su propio autor en el proyecto siguiente no admite atajos cómodos: los que se
tomen los va a pagar quien lo herede, que es la misma persona.

### Por qué ambos objetivos encajan

Un template es un buen vehículo para evaluar desarrollo asistido por IA, precisamente porque su
calidad **no se mide por lo que hace, sino por lo bien que se puede extender**. Y eso obliga a
resolver lo que un proyecto de demostración puede permitirse ignorar: convenciones documentadas y
verificables, capas con fronteras explícitas, puntos de extensión reales, y un registro de
decisiones que explique no solo qué se hizo sino qué se descartó.

Dicho de otro modo: el criterio de éxito no es que la aplicación funcione —eso se ve en la demo—
sino que el siguiente proyecto pueda arrancar desde aquí sin arrepentirse.

### Las dos dimensiones evaluables

**El producto** — una aplicación completa y desplegada: arquitectura por features, capa de datos
intercambiable, autenticación con cookies HttpOnly, internacionalización real en dos idiomas,
sistema de diseño documentado, suite de tests, pipeline de CI y despliegue en producción con TLS.

**El proceso** — cómo se construyó. Es la dimensión específica de este máster y está documentada
por separado en [`methodology.md`](methodology.md): la separación arquitecto/ejecutor, la
disciplina de bloques con condiciones de cierre verificables, la verificación por mutación, y los
errores reales que el método detectó (y los que se le escaparon).

La segunda dimensión es la que no podría escribir cualquier otro proyecto.

---

## Qué se propone demostrar

1. **Que una arquitectura se puede documentar de forma que no se desfase.** Las convenciones no
   viven solo en prosa: hay reglas cargadas por path para los agentes, y un check ejecutable en CI
   que falla si la documentación cita rutas que ya no existen.

2. **Que la capa de datos puede ser genuinamente intercambiable.** `NEXT_PUBLIC_USE_MOCKS=false` y
   una URL de API bastan para repuntar toda la aplicación. Ningún componente sabe de dónde vienen
   los datos.

3. **Que un sistema de diseño se documenta a sí mismo.** La sección `/ui` es una referencia viva:
   cada primitiva tiene su página con anatomía, variantes, props y notas de accesibilidad,
   renderizando el componente real, no una captura.

4. **Que el desarrollo asistido por IA admite disciplina de ingeniería.** Condiciones de cierre
   explícitas, verificación independiente de cada entrega, y registro de decisiones con sus
   alternativas descartadas.

---

## Decisiones deliberadas

No son limitaciones: son elecciones con su razón. Las de arquitectura están en el
[decision log](architecture.md) con su alternativa descartada; estas son las de alcance.

| Decisión | Razón |
|---|---|
| **Datos mock por defecto** | El template debe funcionar sin infraestructura. Montar un backend para evaluarlo sería una barrera desproporcionada. |
| **Sesión en memoria (`globalThis`)** | Suficiente para demostrar el flujo completo de auth con cookies HttpOnly. Un backend de sesiones real no aportaría nada al objetivo y sí complejidad de despliegue. |
| **Una sola réplica** | Consecuencia directa de lo anterior, documentada y verificada explícitamente en producción. |
| **Animación en CSS, no Framer Motion** | La superficie de animación es pequeña y está cubierta por transiciones con duraciones y easings tokenizados. Una librería de runtime engordaría el bundle sin ganancia proporcional. |
| **`<select>` nativo** | Accesibilidad garantizada y soporte móvil sin JavaScript adicional. Un listbox custom queda documentado como extensión posible. |
| **Historial lineal sobre `main`** | Cada bloque deja el repositorio en verde y revisable paso a paso. Sin ramas largas ni estados intermedios rotos. |

---

## Qué queda fuera, y por qué

Declararlo importa tanto como declarar lo que sí está. Lo que sigue **no** es deuda por
descuido; es alcance excluido a conciencia.

- **Backend real y persistencia.** El objetivo es el frontend y su capa de intercambio, no
  construir una API.
- **Content-Security-Policy.** Una CSP estricta rompería los scripts inline de Next y el script
  bloqueante de `next-themes`, y el fallo solo se manifiesta en el navegador. Requiere análisis
  propio; está registrada como deuda con su razón en [`deployment.md`](deployment.md).
- **Tests end-to-end.** La suite cubre lógica pura y comportamiento de componentes. Un e2e con
  navegador real habría sido un bloque propio; se valoró y se dejó fuera por alcance.
- **Escalado horizontal.** Requiere sustituir el store de sesiones antes de tocar el número de
  réplicas.
- **Deuda técnica conocida y registrada.** Los audits [B6](B6-audit.md) y [B9](B9-audit.md) son
  snapshots históricos con los items pendientes identificados. Que estén documentados y no
  ocultos es parte del planteamiento.

---

## Cómo evaluar el resultado

Sugerencias para quien revise el trabajo, en orden de coste:

1. **Abrir la [demo](https://tfm-master-desarrollo-ia.sergiogdev.com)** y entrar con
   `admin@nexdash.com` / `admin123`. Recorrer el dashboard, cambiar idioma y tema, y visitar `/ui`.
2. **Clonar y arrancar** siguiendo [`getting-started.md`](getting-started.md). Debe funcionar sin
   configurar nada.
3. **Ejecutar las puertas de calidad**: `npm test`, `npm run typecheck`, `npm run lint`,
   `npm run check:docs`, `npm run build`.
4. **Comprobar que los tests detectan errores**, no solo que pasan: la sección de verificación por
   mutación de [`methodology.md`](methodology.md) incluye comandos concretos para romper el código
   a propósito y ver fallar los tests.
5. **Leer el [CHANGELOG](CHANGELOG.md)** — 63 bloques con qué se hizo, por qué, y qué se descartó.
