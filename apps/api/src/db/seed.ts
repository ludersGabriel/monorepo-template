import type { Table } from "drizzle-orm"

import { getTableName, sql } from "drizzle-orm"

import { connection, db } from "@/api/db"
import * as schema from "@/api/db/schema"
import * as seeds from "@/api/db/seeds"
import env from "@/api/env"

if (!env.DB_SEEDING) {
  throw new Error("You must set DB_SEEDING to \"true\" when seeding")
}

// Drop table before seeding
async function resetTable(db: db, table: Table) {
  return db.execute(
    sql.raw(
      `TRUNCATE TABLE "${getTableName(table)}" RESTART IDENTITY CASCADE`,
    ),
  )
}

async function resetIndex(db: db, table: Table) {
  return await db.execute(
    sql`SELECT setval(
      pg_get_serial_sequence('${table}', 'id'),
      COALESCE((SELECT MAX("id") FROM ${table}), 1)
    )`,
  )
}

for await (const table of schema.tables) {
  if (table === schema.contentTable)
    continue

  await resetTable(db, table)
}

await seeds.branchSeed(db)
await seeds.userSeed(db)
await seeds.subscriptionSeed(db)
await seeds.userSubscriptionSeed(db)

for await (const table of schema.tables) {
  if (table === schema.contentTable)
    continue

  await resetIndex(db, table)
}

await connection.end()
