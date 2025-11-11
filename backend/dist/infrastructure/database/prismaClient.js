"use strict";
// 🔐 SECURITY: Centralizing Prisma client prevents leaking multiple DB connections and allows setting up safe connection options
// 📈 SCALABILITY: Re-uses a single PrismaClient instance to avoid exhausting database connections under load
// 🛠️ MAINTAINABILITY: Encapsulates Prisma initialization, easing future swap or config tweaks
// 🧪 TESTABILITY: Can be mocked in tests by jest.mock()
// 🔄 EXTENSIBILITY: Additional middlewares (e.g., logging, tracing) can be plugged here
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
/**
 * @security Uses environment variable validation (see env.ts) to retrieve DATABASE_URL securely
 * @performance Ensures a single global PrismaClient to leverage connection pooling
 * @maintainability Isolated in infrastructure layer respecting Hexagonal Architecture
 * @testability Exported instance can be stubbed during unit tests
 */
const client_1 = require("@prisma/client");
const prisma = global.prisma || new client_1.PrismaClient({
    log: ["error", "warn"],
});
exports.prisma = prisma;
if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}
