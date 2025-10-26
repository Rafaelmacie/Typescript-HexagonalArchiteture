import { z } from "zod";

// Esquema de validação
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  PORT: z.coerce.number().default(3000),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(5432),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASS: z.string(),
});

// Validação
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables.");
}

export const env = _env.data;

// Variáveis auxiliares
export const isDev = env.NODE_ENV === "development";
export const isProd = env.NODE_ENV === "production";