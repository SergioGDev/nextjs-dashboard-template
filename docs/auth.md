# Auth Architecture

## Flujo completo de auth (secuencia)

```
Usuario ingresa credenciales en /login
  ↓
LoginForm.onSubmit → useLogin() → authHandler.login()
  ↓ POST /api/auth/login
Route handler: valida creds → sessionStore.set(uuid, {user, expiresAt})
  ↓ Set-Cookie: nexdash_session=<uuid>; HttpOnly
Response: { session: { user, expiresAt } }
  ↓
useLogin.onSuccess → router.push('/')
  ↓
proxy.ts: cookie presente → NextResponse.next()
  ↓
(dashboard)/layout.tsx renderiza → SessionProvider monta
  ↓
useSession() → GET /api/auth/me (cookie viaja automáticamente)
  ↓
Route handler: lee cookie → sessionStore.get(uuid) → { user, expiresAt }
  ↓
SessionProvider.useEffect: setUser(session.user)
  ↓
user.store.user = AuthUser → sidebar y topbar re-renderizan con datos reales
```

## Las 3 capas de protección

Cada capa cubre un escenario distinto. Las tres son necesarias:

| Capa | Dónde | Cuándo actúa | Qué hace |
|---|---|---|---|
| `proxy.ts` | Edge Runtime | Sin cookie + ruta protegida | 307 → `/login` |
| `SessionProvider` | React (dashboard layout) | Cookie inválida, `/me` devuelve null | `router.push('/login')` |
| Interceptor 401 | Cliente HTTP | Sesión expirada mid-session | `CustomEvent` → SessionProvider → redirect |

**Por qué las 3 son necesarias:**
- El proxy no puede validar el sessionId (Edge Runtime sin acceso a memoria del servidor)
- El SessionProvider no puede actuar antes del primer render (no puede hacer lo que hace el proxy)
- El interceptor solo actúa cuando hay requests en vuelo, no en navegación directa

## Flujo general

```
Browser
  │
  ├─ POST /api/auth/login  ──► route handler (mock backend)
  │   • valida credenciales
  │   • genera sessionId (crypto.randomUUID)
  │   • guarda { user, expiresAt } en sessionStore Map
  │   • Set-Cookie: nexdash_session=<sessionId>; HttpOnly
  │   • returns { session: { user, expiresAt } }
  │
  ├─ GET /api/auth/me  ──► lee cookie → sessionStore → { user, expiresAt }
  │
  └─ POST /api/auth/logout  ──► borra de sessionStore + maxAge=0
```

```
features/auth/
  authHandler.me()     →  /api/auth/me  (o /auth/me en real)
  authHandler.login()  →  /api/auth/login
  authHandler.logout() →  /api/auth/logout

  useSession()  ──► authHandler.me()  (staleTime: 5min)
  useLogin()    ──► authHandler.login() + invalidate session
  useLogout()   ──► authHandler.logout() + queryClient.clear()
```

## Mock vs API real

| Aspecto | USE_MOCKS=true | USE_MOCKS=false |
|---|---|---|
| Endpoints | `/api/auth/*` (route handlers de Next.js) | `/auth/*` (backend externo) |
| Sesiones | Map en memoria del proceso Node | Base de datos del backend |
| Cookies | Set por Next.js route handlers | Set por backend externo |
| Credenciales | `_mock-store.ts` hardcoded | Backend gestiona contraseñas |
| Expiración | Cookie maxAge=7d; Map vive hasta restart | Persistida en BD |

### Cambiar a backend real

1. Crear `.env.local`:
   ```
   NEXT_PUBLIC_USE_MOCKS=false
   NEXT_PUBLIC_API_URL=https://api.tudominio.com
   ```
2. Reiniciar dev server.
3. El backend debe aceptar `credentials: 'include'` — responder con `Access-Control-Allow-Credentials: true` y el origen correcto.
4. Las rutas del backend deben seguir el contrato: `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`.
5. Los route handlers en `app/api/auth/` quedan inactivos (no se llaman).

**Nada de la UI ni los hooks cambia al hacer el switch.**

## Contrato de la API

### POST /auth/login

Request body:
```json
{ "email": "string", "password": "string" }
```

Response 200:
```json
{
  "session": {
    "user": { "id": "string", "name": "string", "email": "string", "role": "admin|user", "avatar": "string" },
    "expiresAt": "ISO date string"
  }
}
```

Response 401:
```json
{ "message": "Invalid email or password", "code": "INVALID_CREDENTIALS" }
```

### GET /auth/me

Response 200 (misma forma que `AuthSessionSchema`):
```json
{
  "user": { "id": "string", "name": "string", "email": "string", "role": "admin|user", "avatar": "string" },
  "expiresAt": "ISO date string"
}
```

Response 401:
```json
{ "message": "Not authenticated", "code": "UNAUTHORIZED" }
```

### POST /auth/logout

Response 200: `{}`

## Política de la cookie

| Atributo | Valor |
|---|---|
| Nombre | `nexdash_session` |
| Valor | UUID v4 (sessionId) |
| HttpOnly | `true` |
| Secure | `true` en producción, `false` en desarrollo |
| SameSite | `lax` |
| Path | `/` |
| MaxAge | 604800 (7 días) |

## Flujo de hidratación (B3b)

Orden de eventos desde la request inicial hasta la UI con datos:

```
1. Browser navega a /dashboard
2. proxy.ts: cookie presente? No → redirect /login  |  Sí → continúa
3. Next.js renderiza (dashboard)/layout.tsx (server component)
4. Browser recibe HTML con SessionProvider montado
5. SessionProvider llama a useSession() → fetch /api/auth/me
6. user.store: user = null → sidebar/topbar muestran skeleton
7. /api/auth/me responde con { user, expiresAt }
8. TanStack Query: session = AuthSession
9. SessionProvider useEffect: setUser(session.user)
10. user.store: user = AuthUser → sidebar/topbar re-renderizan con datos reales
```

El paso 6→10 ocurre en < 100ms en local. El skeleton es apenas visible pero
evita mostrar datos incorrectos durante el hydration.

## Proxy (middleware)

`src/proxy.ts` corre en Edge Runtime delante de todas las requests.

**Qué hace**: comprueba presencia de la cookie `nexdash_session`.
- Sin cookie + ruta no-auth → 307 `/login`
- Con cookie + `/login` → 307 `/`

**Qué NO hace**: no valida que el sessionId esté en el `sessionStore`. Edge
Runtime no tiene acceso a la memoria del proceso Node.js donde vive el Map. La
validación profunda la hace `/api/auth/me` en el cliente.

**Consecuencia resuelta en B3c**: cuando `/me` devuelve null, `SessionProvider`
detecta `session === null` y redirige a `/login` automáticamente. El interceptor
401 cubre el caso complementario: sesiones que expiran mientras hay requests en
vuelo (mid-session).

## useSession vs user.store

| | `useSession()` | `useUserStore` |
|---|---|---|
| Tipo | TanStack Query | Zustand |
| Propósito | Fetch/refetch/invalidar la sesión en la red | Estado global de UI |
| Quién lo usa | Solo `SessionProvider` | Todos los componentes |
| Coste | Suscripción + re-render por cambio de query | Síncrono, sin overhead |
| Cuándo actualiza | Cuando `/me` resuelve o se invalida | Cuando `setUser()` es llamado |

**Regla**: los componentes de UI leen `useUserStore(s => s.user)`, no llaman a
`useSession()`. Esto evita N suscripciones y N re-renders. El `SessionProvider`
es el único consumer de `useSession()`.

## Limitaciones conocidas (mock mode)

- **Sesiones en memoria**: el `sessionStore` Map vive en el proceso Node.js. Al reiniciar el dev server todas las sesiones se pierden. Los usuarios tendrán que hacer login de nuevo.
- **Sin refresco de token**: no hay lógica de refresh. La sesión expira cuando el browser descarta la cookie (7 días).
- **Sin persistencia**: si el servidor se reinicia con `USE_MOCKS=true`, las sesiones activas dejan de ser válidas aunque la cookie siga en el navegador. El middleware (B3b) devolverá 401 y el usuario será redirigido al login.

## Cómo añadir OAuth / magic link

1. Crear los nuevos route handlers en `app/api/auth/`:
   - `oauth/callback/route.ts` — intercambia code por token, crea sesión
   - `magic-link/send/route.ts` — genera token de un solo uso
   - `magic-link/verify/route.ts` — valida token, crea sesión
2. Todos usan el mismo `sessionStore` y política de cookie.
3. Añadir método al `authHandler` si la UI necesita iniciar el flujo.
4. El `useSession()` y `useLogout()` no cambian — solo leen/destruyen la sesión.

## Archivos clave (B3a + B3b + B3c)

| Archivo | Propósito |
|---|---|
| `src/features/auth/schemas/auth.schemas.ts` | Contratos Zod (LoginInput, AuthSession, AuthUser) |
| `src/features/auth/api/auth.handler.ts` | Lógica de cliente: llama a los endpoints |
| `src/features/auth/api/use-auth.ts` | Hooks: useSession, useLogin, useLogout |
| `src/features/auth/index.ts` | Barrel público |
| `src/app/api/auth/_mock-store.ts` | SessionStore Map + credenciales mock |
| `src/app/api/auth/login/route.ts` | Mock backend: valida creds, setea cookie |
| `src/app/api/auth/logout/route.ts` | Mock backend: limpia sesión y cookie |
| `src/app/api/auth/me/route.ts` | Mock backend: lee sesión activa |
| `src/proxy.ts` | Edge proxy: protege rutas según presencia de cookie |
| `src/components/auth/session-provider.tsx` | Bridge: useSession → user.store |
| `src/store/user.store.ts` | Estado global del usuario autenticado |
| `src/lib/auth-events.ts` | Constante del CustomEvent de logout forzado |
| `src/hooks/use-logout-action.ts` | useLogout + router.push encapsulados |
| `src/components/forms/login-form.tsx` | Formulario funcional con validación y errores |
| `src/app/providers.tsx` | Interceptor 401 registrado globalmente |
