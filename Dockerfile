# syntax=docker/dockerfile:1

# ─────────────────────────────────────────────────────────────────────────────
# NexDash — multi-stage build (deps → builder → runner)
#
# Base: node:22.16-slim (Debian/glibc), NOT alpine. `sharp` (next/image's
# optimizer) ships precompiled binaries built against glibc; on musl (alpine)
# it either fails to install or breaks at runtime the first time an image is
# requested — a failure mode that only shows up serving an avatar, not at
# build time. See docs/deployment.md for the full reasoning.
# ─────────────────────────────────────────────────────────────────────────────

# ── deps ── install once, reused by the builder layer ─────────────────────────
FROM node:22.16-slim AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ── builder ── compile the app; NEXT_PUBLIC_* must be present at build time ──
FROM node:22.16-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are inlined into the client bundle by `next build`.
# They CANNOT be changed by setting environment variables on `docker run` —
# by the time the container starts, the values are already baked into the
# compiled JS. Rebuild the image with different --build-arg values instead.
ARG NEXT_PUBLIC_API_URL=""
ARG NEXT_PUBLIC_USE_MOCKS=true
ARG NEXT_PUBLIC_APP_NAME=NexDash
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_USE_MOCKS=$NEXT_PUBLIC_USE_MOCKS \
    NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME \
    NEXT_TELEMETRY_DISABLED=1

# Build metadata for GET /api/version (docs/deployment.md#known-gaps). COMMIT_SHA
# is an optional ARG — Dokploy today builds with no --build-arg set at all, so this
# defaults to "unknown" and the endpoint still works with zero configuration.
# `src/generated/build-info.json` is imported by the route handler as a plain JSON
# module, so Next inlines its value into the compiled output at `npm run build`
# time below — no file to read, no env var to wire up at runtime.
#
# This RUN sits after `COPY . .`, so Docker's layer cache only re-executes it (and
# only then does the timestamp change) when the source actually changed. Same code
# → cached layer → same value, which is correct: the image IS the same build.
ARG COMMIT_SHA=unknown
RUN printf '{"timestamp":"%s","commitSha":"%s"}\n' \
      "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$COMMIT_SHA" \
      > src/generated/build-info.json

RUN npm run build

# ── runner ── minimal runtime image, non-root, standalone output only ────────
FROM node:22.16-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

# `output: 'standalone'` traces only the server + the node_modules it actually
# needs — it does NOT include static assets or the public/ folder. Both have
# to be copied by hand, or the app serves a page with no CSS/JS (missing
# .next/static) and no favicon/images (missing public/).
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# HOSTNAME=0.0.0.0 above is required — the standalone server.js defaults to
# localhost, which is unreachable from outside the container.
CMD ["node", "server.js"]
