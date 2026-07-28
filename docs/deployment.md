# Deployment

NexDash ships as a multi-stage Docker image (`Dockerfile`, repo root) producing a minimal,
non-root runtime image via Next's `output: 'standalone'`. This document covers how the image is
built, why it's built that way, and the traps that produce confusing failures if skipped.

**Scope of B12.1**: build and validate the image entirely in local Docker. CI (GitHub Actions) is
B12.2; deploying to the VPS via Dokploy is B12.3. Nothing here has touched the VPS.

---

## Building and running locally

```bash
docker build -t nexdash:test .
docker run -d -p 3001:3000 --name nexdash-test nexdash:test
curl -i localhost:3001/api/health   # → 200 { "status": "ok" }
docker rm -f nexdash-test
```

To build in real-API mode instead of the demo/mocks mode:

```bash
docker build \
  --build-arg NEXT_PUBLIC_USE_MOCKS=false \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com \
  -t nexdash:prod .
```

---

## Why `NEXT_PUBLIC_*` are build args, not runtime env vars

`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_USE_MOCKS`, and `NEXT_PUBLIC_APP_NAME` (declared in
`src/config/env.ts`) are inlined into the client JavaScript bundle **at `next build` time** — this
is standard Next.js behavior for any env var prefixed `NEXT_PUBLIC_`. By the time `docker run`
starts a container, the bundle is already compiled and those values are frozen inside it.

Setting `-e NEXT_PUBLIC_USE_MOCKS=false` on `docker run` does **nothing**: the app starts fine,
reads its baked-in value, and silently ignores the environment variable. There is no error — which
is exactly what makes this trap dangerous. The Dockerfile declares all three as `ARG` in the
**builder** stage, promotes them to `ENV` before `RUN npm run build`, and defaults
`NEXT_PUBLIC_USE_MOCKS=true` so the image works standalone, no backend required. To change any of
them, rebuild the image with `--build-arg`.

---

## Why `node:22.16-slim`, not `alpine`

`next/image`'s optimizer depends on `sharp`, which ships prebuilt native binaries linked against
glibc. Alpine uses musl instead. Running `sharp` on musl either fails to install or breaks the
first time an image is actually requested — a runtime failure on `/_next/image`, not a build
failure, which makes it far more likely to reach the VPS undetected than a local dev machine (dev
mode never calls the optimizer the same way production does). `slim` (Debian) costs roughly 80 MB
more than `alpine` but removes this failure mode entirely. The tag pins the minor version
(`22.16`, matching the local dev Node version) rather than floating on `node:22`, so a Node point
release can't silently change the build.

---

## Single replica — session store lives in `globalThis`

`sessionStore` (`src/app/api/auth/_mock-store.ts`) is a `Map` attached to `globalThis`, scoped to
one Node process. This is **not** a shared cache (no Redis, no DB) — it only works because every
request in a single container hits the same process.

Consequences:
- **One replica only.** Running 2+ containers behind a load balancer means a session created by
  container A is invisible to container B — `GET /me` returns 401 depending on which replica
  serves the request. Not addressed here; tracked as known debt, consistent with `auth.md`'s
  description of the store as a mock.
- **Sessions do not survive a redeploy.** Restarting the container resets `globalThis`, clearing
  `sessionStore`. Every logged-in user gets logged out on every deploy. Acceptable for a
  demo/template; would need a real session backend (Redis, DB-backed sessions) before this could
  run with more than one replica or zero-downtime deploys.

---

## Dockerfile traps and their symptoms

### Trap: copying only `.next/standalone`

`output: 'standalone'` traces the server and the exact `node_modules` it needs into
`.next/standalone/`, but it does **not** copy static assets or `public/`. Skipping the extra
`COPY` lines produces a page that **loads with no CSS or JS** — the HTML renders, but every
`<link>`/`<script>` to `/_next/static/...` 404s, and images/favicons under `public/` do too. Fix:
copy `.next/standalone`, `.next/static`, and `public/` separately into the runner stage (see the
`runner` stage in `Dockerfile`).

### Trap: server listening on localhost

The standalone `server.js` defaults to binding `localhost`, which is unreachable from outside its
own network namespace — the container starts, healthchecks from *inside* it might even pass, but
nothing outside the container (including `docker run -p`) can reach it. Fix: `ENV HOSTNAME=0.0.0.0`
in the runner stage (already set in `Dockerfile`).

### Trap: `/api/health` behind the i18n/auth gate

`src/proxy.ts`'s matcher (`/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)`)
already excludes anything under `/api`, and the function body also early-returns on
`pathname.startsWith('/api')`. So `/api/health` never runs through `next-intl`'s locale redirect or
the session-cookie check — it was already safe by construction. **No proxy change was needed for
B12.1.** This was verified explicitly (see Verification below) rather than assumed, because a
307 here would put Dokploy's healthcheck into a restart loop.

### Trap: incomplete `package-lock.json` for optional native binaries (found in B12.1)

This one is not a Dockerfile trap but blocks `npm ci` on Linux entirely, so it's documented here.

Several dependencies ship OS/CPU-specific native binaries as second-level optional dependencies —
declared inside a dependency's own `package.json`, not the project's root `package.json`:
`sharp` → `@img/sharp-*`, `next-intl` → `@parcel/watcher-*` and (nested) `@swc/core-*`,
`tailwindcss` → `@tailwindcss/oxide-*`, `lightningcss` → `lightningcss-*`, and (dev-only, affects
`npm test`/`npm run lint` under Linux, e.g. future CI) `vitest`'s `rolldown` → `@rolldown/binding-*`
and ESLint's `unrs-resolver` → `@unrs/resolver-binding-*`.

npm only writes a full lockfile entry (with `resolved`/`integrity`) for these nested optional
platform packages **for the platform the lockfile was last generated on** — unlike direct
optionalDependencies of the root's own dependencies (e.g. `next` → `@next/swc-*`), which npm always
expands to all platforms. Before B12.1, this repo's `package-lock.json` only had darwin-arm64
entries for all of the packages above. `npm ci` on Linux would then silently skip installing them
(it doesn't error — `npm ci` just doesn't install what the lock doesn't list), and the failure only
surfaces later when something `require()`s the missing native binary: first symptom was `next
build` crashing while loading `next.config.ts` (`@parcel/watcher`), then again compiling CSS
(`lightningcss` via Tailwind v4).

**Fix applied**: added the missing Linux (and other-platform) stub entries to `package-lock.json`
for all six families above, using the real registry metadata (`resolved` URL + `integrity`) for
each platform variant, without changing any already-resolved version — verified via `npm audit`
before/after (still 7 known vulnerabilities, same list) and a full local re-run of
`npm test` / `npm run lint` / `npm run typecheck` / `npm run build`, all green. `sharp` was also
promoted from an implicit transitive optional dependency (via `next`) to an explicit direct
dependency in `package.json` — the fix Next's own docs recommend for `output: 'standalone'`
deployments, since it guarantees `sharp` is resolved and installed regardless of what else changes
in the dependency tree.

**Implication for future dependency upgrades**: bumping `sharp`, `next-intl`, `tailwindcss`,
`lightningcss`, `vitest`, or `eslint`-related tooling in a way that changes those *specific*
packages' resolved versions may reintroduce this gap (a plain `npm install <pkg>` only expands
optional platform stubs for the current host's platform). If a future Docker build fails with
`Cannot find module '<name>-linux-...'` or `No prebuild or local build of <pkg> found`, this is the
same class of issue — check `npm ci` on Linux (or inside the `deps` build stage) rather than
assuming the Dockerfile broke.

---

## `sharp` in the runner stage

Because `output: 'standalone'`'s file tracing includes whatever's actually resolvable in
`node_modules` at build time, and `sharp` is now correctly resolved for `linux-x64`/`linux-arm64`
glibc (see above), it ships inside `.next/standalone/node_modules` automatically — no extra `COPY`
needed in the runner stage. Verified in local testing (step 8 below): `/_next/image` returns a
real re-encoded PNG, not a 500.

---

## Verification performed (B12.1, local only)

All 10 steps below were run against `nexdash:test` built from this Dockerfile, on Docker
29.2.1 / Apple Silicon (`linux/arm64` target):

1. `docker build -t nexdash:test .` — completes without error.
2. `docker run -d -p 3001:3000 --name nexdash-test nexdash:test` — container starts and stays up.
3. `curl -i localhost:3001/en/login` — `200`.
4. `curl -i localhost:3001/api/health` — `200 { "status": "ok" }`, **not** a `307` (proxy gate
   confirmed not to intercept it — see Traps above).
5. `curl -i localhost:3001/en/users` with no cookie — `307` to `/en/login` (auth gate alive inside
   the container).
6. Full login flow inside the container: `POST /api/auth/login` with
   `admin@nexdash.com` / `admin123` → `200` + `Set-Cookie: nexdash_session=...`; `GET
   /api/auth/me` with that cookie → `200` with the user; `GET /en/users` with the cookie → `200`,
   no redirect. This also validates the `globalThis` session singleton survives in the production
   build (see the single-replica caveat above).
7. Static assets: the `/en/login` HTML references `/_next/static/...`, and fetching one such file
   returns `200`.
8. `sharp`/image optimization:
   `curl -i "localhost:3001/_next/image?url=https%3A%2F%2Fui-avatars.com%2Fapi%2F%3Fname%3DTest&w=64&q=75"`
   → `200`, `Content-Type: image/png`.
9. Image size: `docker images nexdash:test` → **308 MB**.
10. Cleanup: `docker rm -f nexdash-test`.

`npm test`, `npm run typecheck`, `npm run lint`, and `npm run build` were also run on the host
after the `package-lock.json` fix above, all green, to rule out regressions from the lockfile
surgery before trusting the Docker build.

---

## What's explicitly out of scope here

- GitHub Actions CI (build + push the image on push/PR) → **B12.2**
- Dokploy service definition, healthcheck wiring, domain/TLS, actual VPS deploy → **B12.3**
- A real session backend to support >1 replica → not planned; would be a breaking architecture
  change to the auth mock, tracked as known debt (see the single-replica note above)
