"use strict";
// 🔐 SECURITY: Applies Helmet for secure HTTP headers, CORS with explicit origin, and basic rate limiting.
// 📈 SCALABILITY: Uses clustering via Node.js cluster (future), connection pooling via Prisma.
// 🛠️ MAINTAINABILITY: Modular middlewares and clear separation of concerns.
// 🧪 TESTABILITY: Server exported for integration testing, dependencies (prisma) injectable/mocked.
// 🔄 EXTENSIBILITY: Easy to add new routers and middlewares.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
/**
 * @security Validates env vars through env.ts, applies security middlewares, disables x-powered-by header
 * @performance Utilises Prisma singleton client to reuse db connections
 * @maintainability Express app separated from server listen for easier testing
 * @testability Exports `app` instance to Supertest
 */
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const pino_http_1 = __importDefault(require("pino-http"));
const logger_1 = require("./infrastructure/logger");
const authRoutes_1 = require("./infrastructure/http/routes/authRoutes");
const env_1 = require("./config/env");
const prismaClient_1 = require("./infrastructure/database/prismaClient");
const swagger_1 = require("./infrastructure/http/swagger");
const chargesRoutes_1 = require("./infrastructure/http/routes/chargesRoutes");
const app = (0, express_1.default)();
exports.app = app;
// Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || "*", // TODO: restrict in production
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Idempotency-Key", "X-Idempotency-Key"],
}));
app.use(express_1.default.json());
app.use((0, pino_http_1.default)({ logger: logger_1.logger }));
app.disable("x-powered-by");
// Basic rate limiting ~ 100 req / 15 min per IP
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
}));
// Health & readiness endpoints
app.get("/healthz", async (_, res) => {
    try {
        await prismaClient_1.prisma.$queryRaw `SELECT 1`;
        res.status(200).json({ status: "ok" });
    }
    catch (err) {
        res.status(500).json({ status: "db_error" });
    }
});
app.use('/auth', authRoutes_1.authRouter);
app.use('/charges', chargesRoutes_1.chargesRouter);
// TODO: Register domain routers here (payments, merchants etc.)
// Swagger docs
(0, swagger_1.setupSwagger)(app);
const PORT = Number(env_1.env.PORT);
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`🚀 Turbofy API running on http://localhost:${PORT}`);
    });
}
