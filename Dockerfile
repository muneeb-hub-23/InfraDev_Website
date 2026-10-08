# ─── InfraDev Website (Next.js + Prisma/SQLite) ────────────────────────────
FROM node:22-bookworm-slim AS base
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates tzdata \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# ── Build ───────────────────────────────────────────────────────────────────
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
RUN npm run build
# keep only production deps and regenerate the Prisma client for them
RUN npm prune --omit=dev && npx prisma generate

# ── Runtime ─────────────────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    CHECKPOINT_DISABLE=1 \
    TZ=Asia/Karachi \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    DATA_DIR=/app/storage \
    DATABASE_URL=file:/app/storage/infradev.db

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.mjs ./next.config.mjs
# first-run assets imported into the settings by prisma/seed.mjs
COPY --from=builder /app/data/logo.png /app/data/favicon.ico /app/data/stamp.png ./data/
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh \
    && mkdir -p /app/storage \
    && chown -R node:node /app/storage /app/.next

USER node
VOLUME ["/app/storage"]
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "node_modules/next/dist/bin/next", "start"]
