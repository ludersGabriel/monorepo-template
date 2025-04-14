import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core"

const timestamps = {
  createdAt: timestamp({
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({
    withTimezone: true,
  })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  ...timestamps,
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  activeOrganizationId: text("active_organization_id"),
  ...timestamps,
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  ...timestamps,
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ...timestamps,
})

export const organization = pgTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  metadata: text("metadata"),
  ...timestamps,
})

export const member = pgTable("member", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organization.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  ...timestamps,
})

export const invitation = pgTable("invitation", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organization.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: text("inviter_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  ...timestamps,
})

// export const fileFormatEnum = pgEnum("file_format_enum", [
//   "png",
//   "jpg",
//   "jpeg",
//   "mp4",
// ])

// export const contentTable = pgTable("content", {
//   // Default uuid for psql is uuidv4, for uuidv7 (faster) install plugin from
//   // https://github.com/fboulnois/pg_uuidv7
//   id: uuid()
//     .primaryKey()
//     .default(sql`gen_random_uuid()`),
//   name: varchar({ length: 200 })
//     .notNull(),
//   size: bigint({ mode: "number" })
//     .notNull(),
//   format: fileFormatEnum()
//     .notNull(),
//   ...timestamps,
// })

// export const tables = [userTable, subscriptionTable, userSubscriptionTable, contentTable, postTable]
