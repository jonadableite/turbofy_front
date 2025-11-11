FROM node:20-bookworm-slim AS builder
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
COPY next.config.ts tsconfig.json ./
COPY public ./public
COPY src ./src
RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM gcr.io/distroless/nodejs20-debian12:nonroot AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY docker/healthcheck.js ./healthcheck.js
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD ["node", "/app/healthcheck.js"]
CMD ["node", "server.js"]