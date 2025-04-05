import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

import db from "../db"
import { BASE_PATH } from "./constants"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  basePath: `${BASE_PATH}/auth`,
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:3000",
  ],
})
