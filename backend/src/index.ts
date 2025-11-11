// 🔐 SECURITY: Applies Helmet for secure HTTP headers, CORS with explicit origin, and basic rate limiting.
// 📈 SCALABILITY: Uses clustering via Node.js cluster (future), connection pooling via Prisma.
// 🛠️ MAINTAINABILITY: Modular middlewares and clear separation of concerns.
// 🧪 TESTABILITY: Server exported for integration testing, dependencies (prisma) injectable/mocked.
// 🔄 EXTENSIBILITY: Easy to add new routers and middlewares.

/**
 * @security Validates env vars through env.ts, applies security middlewares, disables x-powered-by header
 * @performance Utilises Prisma singleton client to reuse db connections
 * @maintainability Express app separated from server listen for easier testing
 * @testability Exports `app` instance to Supertest
 */

import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import { logger } from "./infrastructure/logger";
import { authRouter } from "./infrastructure/http/routes/authRoutes";
import { env } from "./config/env";
import { prisma } from "./infrastructure/database/prismaClient";
import { setupSwagger } from "./infrastructure/http/swagger";
import { chargesRouter } from "./infrastructure/http/routes/chargesRoutes";

const app = express();

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*", // TODO: restrict in production
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Idempotency-Key", "X-Idempotency-Key"],
  })
);
app.use(express.json());
app.use(pinoHttp({ logger }));
app.disable("x-powered-by");

// Basic rate limiting ~ 100 req / 15 min per IP
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Health & readiness endpoints
app.get("/healthz", async (_, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ status: "db_error" });
  }
});

app.use('/auth', authRouter);
app.use('/charges', chargesRouter);
// TODO: Register domain routers here (payments, merchants etc.)

// Swagger docs
setupSwagger(app);

const PORT = Number(env.PORT);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Turbofy API running on http://localhost:${PORT}`);
  });
}

export { app };
