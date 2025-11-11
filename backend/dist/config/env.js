"use strict";
// 🔐 SECURITY: Centralized, strict validation of environment variables prevents runtime with missing or malformed secrets
// 📈 SCALABILITY: Explicit env contract makes deployment across environments predictable
// 🛠️ MAINTAINABILITY: Single source of truth for configuration values
// 🧪 TESTABILITY: Schema can be reused in tests to mock envs safely
// 🔄 EXTENSIBILITY: Add new variables by extending the schema
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
/**
 * @security Ensures required secrets (e.g., DATABASE_URL, JWT_SECRET) exist and meet format constraints
 * @performance Fails fast at boot time, avoiding expensive debugging later
 * @maintainability Strongly typed config accessible across project
 * @testability Allows easy stubbing of `process.env` in unit tests
 */
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    PORT: zod_1.z.string().regex(/^\d+$/).default("3000"),
    DATABASE_URL: zod_1.z.string().url(),
    RABBITMQ_URI: zod_1.z.string().nonempty(),
    JWT_SECRET: zod_1.z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    SMTP_HOST: zod_1.z.string().nonempty(),
    SMTP_PORT: zod_1.z.string().regex(/^\d+$/).transform(Number),
    SMTP_USERNAME: zod_1.z.string().nonempty(),
    SMTP_PASSWORD: zod_1.z.string().nonempty(),
    SMTP_SENDER_EMAIL: zod_1.z.string().nonempty(),
    SMTP_AUTH_DISABLED: zod_1.z.string().default('false').transform((v) => v === 'true'),
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.error("❌ Invalid environment variables: ", _env.error.format());
    // eslint-disable-next-line no-console
    process.exit(1);
}
exports.env = _env.data;
