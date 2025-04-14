import "reflect-metadata"
import { Hono } from "hono"
import { serveStatic } from "hono/bun"
import { cors } from "hono/cors"
import { HTTPException } from "hono/http-exception"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"
import { createServer } from "node:http2"

import type { CoraxError, CoraxSuccess } from "./db/schema/types"

import { HttpStatus } from "./components/error/error.service"
import env from "./env"
import { auth } from "./lib/auth"
import { BASE_PATH } from "./lib/constants"

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
  }
}>()

app.use("*", logger())
  .use("*", prettyJSON())

app.onError((err, c) => {
  console.error(`--> ERROR ${c.req.path}`, err)

  if (err instanceof HTTPException) {
    const errResponse
      = err.res
        ?? c.json<CoraxError>(
          {
            success: false,
            error: err.message,
            isFormError:
            err.cause
            && typeof err.cause === "object"
            && "form" in err.cause
              ? err.cause.form === true
              : false,
          },
          err.status,
        )

    return errResponse
  }

  return c.json<CoraxError>(
    {
      success: false,
      error:
        env.NODE_ENV === "production"
          ? "Internal Server Error"
          : (err.stack ?? err.message),
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
})

if (env.NODE_ENV !== "production") {
  app.use(
    "*",
    cors({
      origin: "https://local.drizzle.studio",
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
  )
}

app.on(["POST", "GET"], `${BASE_PATH}/auth/*`, c => auth.handler(c.req.raw))

// eslint-disable-next-line unused-imports/no-unused-vars
const apiRoutes = app.basePath(BASE_PATH)
  .use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })

    if (c.req.path.startsWith(`${BASE_PATH}/auth`)) {
      return next()
    }

    if (!session) {
      return c.json<CoraxError>({
        success: false,
        error: "Unauthorized",
      }, HttpStatus.UNAUTHORIZED)
    }

    c.set("user", session.user)
    c.set("session", session.session)
    return next()
  })
  .get("/", c =>
    c.json<CoraxSuccess<{ hello: string }>>({
      data: {
        hello: `core api running on ${BASE_PATH}`,
      },
      message: "Welcome to Core API",
      success: true,
    }))

app.get("*", serveStatic({
  root: "./public",
})).get("*", serveStatic({
  path: "./public/index.html",
}))

export type AppType = typeof apiRoutes

export default {
  createServer,
  fetch: app.fetch,
  // https://hono.dev/docs/middleware/builtin/body-limit
  // 2GiB
  maxRequestBodySize: 1024 * 1024 * 1024 * 2,
  port: env.PORT,
}
