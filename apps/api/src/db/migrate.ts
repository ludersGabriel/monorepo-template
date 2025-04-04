import { migrate } from "drizzle-orm/postgres-js/migrator"

import config from "@/api/../drizzle.config"
import { connection, db } from "@/api/db"
import env from "@/api/env"

if (!env.DB_MIGRATING) {
  throw new Error(
    "You must set DB_MIGRATING to \"true\" when migrating",
  )
}

await migrate(db, { migrationsFolder: config.out! })

await connection.end()
