// 🔐 SECURITY: Centralized, strict validation of environment variables prevents runtime with missing or malformed secrets
// 📈 SCALABILITY: Explicit env contract makes deployment across environments predictable
// 🛠️ MAINTAINABILITY: Single source of truth for configuration values
// 🧪 TESTABILITY: Schema can be reused in tests to mock envs safely
// 🔄 EXTENSIBILITY: Add new variables by extending the schema

/**
 * @security Ensures required secrets (e.g., DATABASE_URL, JWT_SECRET) exist and meet format constraints
 * @performance Fails fast at boot time, avoiding expensive debugging later
 * @maintainability Strongly typed config accessible across project
 * @testability Allows easy stubbing of `process.env` in unit tests
 */

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().regex(/^\d+$/).default("3000"),
  DATABASE_URL: z.string().url(),
  RABBITMQ_URI: z.string().nonempty(),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  SMTP_HOST: z.string().nonempty(),
  SMTP_PORT: z.string().regex(/^\d+$/).transform(Number),
  SMTP_USERNAME: z.string().nonempty(),
  SMTP_PASSWORD: z.string().nonempty(),
  SMTP_SENDER_EMAIL: z.string().nonempty(),
  SMTP_AUTH_DISABLED: z.string().default('false').transform((v) => v === 'true'),
  RECAPTCHA_SECRET_KEY: z.string().optional(), // Opcional para desenvolvimento
  FRONTEND_URL: z.string().url().default("http://localhost:3001"), // URL do frontend para links de email
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables: ", _env.error.format());
  // eslint-disable-next-line no-console
  process.exit(1);
}

export const env = _env.data;