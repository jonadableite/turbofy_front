FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable
RUN corepack prepare pnpm@10.22.0 --activate
COPY package.json pnpm-lock.yaml ./
COPY next.config.ts tsconfig.json ./
COPY public ./public
COPY src ./src
RUN pnpm install --no-frozen-lockfile
RUN pnpm build --webpack

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3131
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"

# Copiar arquivos standalone
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copiar healthcheck
COPY docker/healthcheck.js ./healthcheck.js

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3131

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD ["node", "/app/healthcheck.js"]

ENTRYPOINT ["node"]
CMD ["server.js"]