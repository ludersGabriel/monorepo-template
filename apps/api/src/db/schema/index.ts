/* eslint-disable ts/no-use-before-define */
import { relations, sql } from "drizzle-orm"
import { bigint, boolean, date, decimal, integer, pgEnum, pgTable, serial, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core"

const timestamps = {
  createdAt: timestamp({
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .$onUpdate(() => sql`current_timestamp`)
    .notNull(),
}

export const branchTable = pgTable("branch", {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  ...timestamps,
})

export const branchRelations = relations(branchTable, ({ many }) => ({
  user: many(userTable),
}))

export const userRoleEnum = pgEnum("user_role_enum", ["admin", "user", "trainer"])

export const userTable = pgTable("user", {
  id: serial().primaryKey(),
  role: userRoleEnum().default("user").notNull(),
  name: varchar({ length: 100 }).notNull(),
  branchId: integer().references(() => branchTable.id).notNull(),
  username: varchar({ length: 50 }).unique().notNull(),
  password: varchar({ length: 118 }).notNull(),

  ...timestamps,
})

export const userRelations = relations(userTable, ({ one }) => ({
  userSubscription: one(userSubscriptionTable, {
    fields: [userTable.id],
    references: [userSubscriptionTable.userId],
  }),
  branch: one(branchTable, {
    fields: [userTable.branchId],
    references: [branchTable.id],
  }),
  userInfo: one(userInfoTable, {
    fields: [userTable.id],
    references: [userInfoTable.userId],
  }),
}))

export const userInfoTable = pgTable("user_info", {
  id: serial().primaryKey(),
  userId: integer().references(() => userTable.id).unique().notNull(),

  cpf: varchar({ length: 11 }).unique(),
  email: varchar({ length: 100 }).unique(),
  phone: varchar({ length: 11 }),

  cep: varchar({ length: 8 }),
  street: varchar({ length: 100 }),
  number: integer(),
  complement: varchar({ length: 100 }),
  neighborhood: varchar({ length: 100 }),
  city: varchar({ length: 100 }),
  state: varchar({ length: 2 }),

  ...timestamps,
})

export const userInfoRelations = relations(userInfoTable, ({ one }) => ({
  user: one(userTable, {
    fields: [userInfoTable.userId],
    references: [userTable.id],
  }),
}))

export const subscriptionTable = pgTable("subscription", {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  branchId: integer().references(() => branchTable.id).notNull(),
  benefits: text().notNull(),
  price: decimal({ scale: 2 }).notNull(),
  trimestralPrice: decimal({ scale: 2 }),
  semestralPrice: decimal({ scale: 2 }),
  anualPrice: decimal({ scale: 2 }),
  monthlyClasses: integer().notNull(),
  ...timestamps,
})

export const userSubscriptionTable = pgTable("user_subscription", {
  id: serial().primaryKey(),
  userId: integer().references(() => userTable.id).unique().notNull(),
  subscriptionId: integer().references(() => subscriptionTable.id).notNull(),
  startDate: date({
    mode: "string",
  }).defaultNow().notNull(),
  active: boolean().default(true).notNull(),
  ...timestamps,
}, t => [
  uniqueIndex("user_subscription_idx").on(t.userId, t.subscriptionId),
  uniqueIndex("user_idx").on(t.userId),
])

export const userSubscriptionRelations = relations(userSubscriptionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [userSubscriptionTable.userId],
    references: [userTable.id],
  }),
  subscription: one(subscriptionTable, {
    fields: [userSubscriptionTable.subscriptionId],
    references: [subscriptionTable.id],
  }),
}))

export const checkinTable = pgTable("checkin", {
  id: serial().primaryKey(),
  userId: integer().references(() => userTable.id).notNull(),
  subscriptionId: integer().references(() => subscriptionTable.id).notNull(),
  ...timestamps,
})

export const fileFormatEnum = pgEnum("file_format_enum", [
  "png",
  "jpg",
  "jpeg",
  "mp4",
])

export const contentTable = pgTable("content", {
  // Default uuid for psql is uuidv4, for uuidv7 (faster) install plugin from
  // https://github.com/fboulnois/pg_uuidv7
  id: uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar({ length: 200 })
    .notNull(),
  size: bigint({ mode: "number" })
    .notNull(),
  format: fileFormatEnum()
    .notNull(),
  ...timestamps,
})

export const postTable = pgTable("post", {
  id: serial().primaryKey(),
  owner: integer().references(() => userTable.id).notNull(),
  branchId: integer().references(() => branchTable.id).notNull(),
  image: uuid().references(() => contentTable.id),
  title: varchar({ length: 100 }).notNull(),
  body: text().notNull(),
  ...timestamps,
})

export const tables = [userTable, subscriptionTable, userSubscriptionTable, contentTable, postTable]
