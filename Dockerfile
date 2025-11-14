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

FROM gcr.io/distroless/nodejs20-debian12:nonroot AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3131
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY docker/healthcheck.js ./healthcheck.js
EXPOSE 3131
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD ["node", "/app/healthcheck.js"]
ENTRYPOINT ["node"]
CMD ["server.js"]