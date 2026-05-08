# Auth — Reglas

## Invariantes que no se rompen

- **Cookies HttpOnly siempre**: el token de sesión nunca es accesible al JS del cliente. El campo `nexdash_session` vive solo en el header `Cookie`, nunca en localStorage ni en el store de Zustand.
- **Validar en frontera**: toda respuesta de `/auth/*` pasa por `validate(AuthSessionSchema, data)` o `validate(LoginResponseSchema, data)` antes de salir del handler. Sin excepciones.
- **`useSession()` solo en `SessionProvider`**: para leer el usuario en la UI, usar `useUserStore(s => s.user)`. No llamar a `useSession()` en componentes — dispara suscripciones innecesarias.
- **`user.store` no se persiste**: el store de usuario no usa `persist()`. La sesión se hidratar en cada carga desde `/me`. Si se necesita persistir algo del usuario, hacerlo en un store separado.
- **Token opaco al cliente**: el sessionId es un UUID del servidor. El cliente no lo lee, no lo parsea, no lo inspecciona. Solo viaja en cookies.

## Patrón de uso

```ts
// ✅ correcto — consumir vía barrel
import { useSession, useLogin, useLogout } from '@features/auth';

// ❌ nunca — importar internos directamente
import { authHandler } from '@features/auth/api/auth.handler';
import { authKeys } from '@features/auth/api/auth.keys';
```

## Manejo de 401

El handler `authHandler.me()` convierte un 401 en `null` (no es un error de la aplicación — significa "no hay sesión"). Todos los demás errores se propagan como `ApiError`.

```ts
// ✅ correcto en el handler
if (ApiError.is(err) && err.status === 401) return null;
throw err;

// ❌ nunca — silenciar todos los errores
catch { return null; }
```

## Nuevos métodos de auth

Añadir en este orden:
1. Nuevo endpoint en `app/api/auth/` (reutilizar `sessionStore` de `_mock-store.ts`)
2. Nuevo método en `authHandler`
3. Nuevo hook en `use-auth.ts`
4. Exportar desde `index.ts` si es de uso público

No crear stores Zustand para sesión. No duplicar el cache de TanStack Query.

## Leer el usuario en componentes

```ts
// ✅ correcto — leer del store
import { useUserStore } from '@/store/user.store';
const user = useUserStore((s) => s.user);

// ❌ nunca en componentes — suscripción duplicada
import { useSession } from '@features/auth';
const { data: session } = useSession();
```

## Proxy (proxy.ts)

El proxy solo comprueba **presencia** de la cookie. No valida el sessionId contra el store.
Si la sesión está expirada, el proxy deja pasar. La validación real la hace `/me` en cliente.
No añadir lógica de fetch/DB al proxy — corre en Edge Runtime con restricciones severas.

## Mock vs real

La diferencia entre mock y API real es **solo la URL del path**:
- `USE_MOCKS=true` → `/api/auth/*` (route handlers de Next.js)
- `USE_MOCKS=false` → `/auth/*` (backend externo vía `API_BASE_URL`)

El cliente HTTP ya tiene `credentials: 'include'` — no hay que modificar nada más.

**Patrón globalThis para mock stores**: `sessionStore` en `_mock-store.ts` usa el patrón
singleton de `globalThis` (`g._nexdashSessionStore ??= new Map()`). Esto es necesario porque
Next.js 15 compila cada Route Handler como bundle webpack independiente; sin este patrón, cada
handler evalúa el módulo en su propia instancia y obtiene un `Map` diferente. La sesión creada
en `POST /login` sería invisible para `GET /me`. El singleton también sobrevive a HMR (hot module
reload durante desarrollo). Las sesiones se pierden solo con reinicio completo del servidor —
comportamiento esperado para un store mock.
