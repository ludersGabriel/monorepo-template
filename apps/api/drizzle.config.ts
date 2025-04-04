import { type Config, defineConfig } from "drizzle-kit"

import env from "@/api/env"

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
  casing: "snake_case",
}) satisfies Config
