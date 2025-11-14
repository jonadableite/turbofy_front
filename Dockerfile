FROM node:20-alpine AS builder
WORKDIR /app

# Habilitar corepack e preparar pnpm em uma única camada
RUN corepack enable && corepack prepare pnpm@10.22.0 --activate

# Copiar apenas arquivos de dependências primeiro (melhor cache)
COPY package.json pnpm-lock.yaml ./

# Instalar dependências (cache esta camada se package.json não mudar)
# Usar --no-frozen-lockfile temporariamente até lockfile ser atualizado
RUN pnpm install --no-frozen-lockfile

# Copiar arquivos de configuração e código
COPY next.config.ts tsconfig.json ./
COPY public ./public
COPY src ./src

# Build da aplicação
RUN pnpm build --webpack

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3131
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"

# Copiar arquivos standalone
COPY --from=builder /app/.next/standalone ./
# Copiar arquivos estáticos para o caminho correto dentro do standalone
COPY --from=builder /app/.next/static ./.next/static
# Copiar pasta public
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