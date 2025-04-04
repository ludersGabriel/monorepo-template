import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "@/api/db/schema"
import env from "@/api/env"

// PostgreSQL connection
export const connection = postgres(env.DATABASE_URL, {
  max: env.DB_MIGRATING || env.DB_SEEDING ? 1 : undefined,
  onnotice: env.DB_SEEDING ? () => {} : undefined,
  ssl: env.DATABASE_URL.includes("localhost")
    ? false
    : { rejectUnauthorized: false },
})

// Drizzle psql encapsulation
export const db = drizzle(connection, { schema, logger: true, casing: "snake_case" })

// eslint-disable-next-line ts/no-redeclare
export type db = typeof db

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

export default db
