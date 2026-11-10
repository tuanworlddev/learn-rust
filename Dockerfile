# syntax=docker/dockerfile:1

FROM node:24-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci --registry=https://registry.npmjs.org --no-audit --no-fund

FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build:local

FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Standalone output omits public assets; ship them explicitly.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/scripts/check-config.mjs ./scripts/check-config.mjs
COPY --from=builder --chown=node:node /app/scripts/check-supabase.mjs ./scripts/check-supabase.mjs
COPY --from=builder --chown=node:node /app/scripts/check-course-content.mjs ./scripts/check-course-content.mjs
COPY --from=builder --chown=node:node /app/lib/content ./lib/content
COPY --from=builder --chown=node:node /app/lib/supabase/config.mjs ./lib/supabase/config.mjs
RUN mkdir -p .next/cache && chown node:node .next/cache

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/health', {signal: AbortSignal.timeout(4000)}).then(r => { if (!r.ok) process.exit(1); }).catch(() => process.exit(1))"]

CMD ["sh", "-c", "node scripts/check-config.mjs --production && exec node server.js"]
