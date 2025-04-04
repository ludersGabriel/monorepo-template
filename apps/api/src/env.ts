/* eslint-disable no-console */
import { config } from "dotenv"
import { expand } from "dotenv-expand"
import { z, ZodError } from "zod"

const stringBoolean = z.coerce
  .string()
  .transform((val) => {
    return val === "true"
  })
  .default("false")

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  DATABASE_URL: z.string(),
  DB_MIGRATING: stringBoolean,
  DB_SEEDING: stringBoolean,
  APP_SECRET: z.string(),
  S3_REGION: z.string(),
  S3_ENDPOINT: z.string(),
  S3_ACCESSKEY_USER: z.string(),
  S3_ACCESSKEY_PASS: z.string(),
  S3_BUCKET: z.string(),
})

// eslint-disable-next-line ts/no-redeclare
export type EnvSchema = z.infer<typeof EnvSchema>

expand(config())

try {
  // eslint-disable-next-line node/no-process-env
  EnvSchema.parse(process.env)
}
catch (error) {
  if (error instanceof ZodError) {
    let message = "Missing required values in .env:\n"
    error.issues.forEach((issue) => {
      message += `${issue.path[0]}\n`
    })

    const e = new Error(message)
    // eslint-disable-next-line node/no-process-env
    console.log(process.env)

    e.stack = ""
    throw e
  }
  else {
    console.log(error)
  }
}

// eslint-disable-next-line node/no-process-env
export default EnvSchema.parse(process.env)
