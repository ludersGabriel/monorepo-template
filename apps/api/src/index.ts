import "reflect-metadata"
import { Hono } from "hono"
import { serveStatic } from "hono/bun"
import { HTTPException } from "hono/http-exception"
import { jwt } from "hono/jwt"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"
import { createServer } from "node:http2"

import type { AuthSchema, CoraxError, CoraxSuccess } from "./db/schema/types"

import { authRouter } from "./components/auth/auth.route"
import { contentRouter } from "./components/content/content.routes"
import { HttpStatus } from "./components/error/error.service"
import { postRouter } from "./components/post/post.route"
import { subscriptionRouter } from "./components/subscription/subscription.route"
import { userRouter } from "./components/user/user.routes"
import env from "./env"

const basePath = "/api/v1"
const app = new Hono()

app.use("*", logger())
  .use("*", prettyJSON())

app.onError((err, c) => {
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

// eslint-disable-next-line unused-imports/no-unused-vars
const apiRoutes = app.basePath(basePath)
  .use("*", (c, next) => {
    if (c.req.path.startsWith(`${basePath}/auth`)) {
      return next()
    }

    const token = c.req.header("Authorization")

    if (!token) {
      const queryToken = c.req.query("token")

      if (queryToken) {
        c.req.raw.headers.set("Authorization", `Bearer ${queryToken}`)
      }
    }

    return jwt({
      secret: env.APP_SECRET,
    })(c, next)
  })
  .get("/", c =>
    c.json<CoraxSuccess<{ hello: string }>>({
      data: {
        hello: `core api running on ${basePath}`,
      },
      message: "Welcome to Core API",
      success: true,
    }))
  .route("/auth", authRouter)
  .route("/user", userRouter)
  .route("/subscription", subscriptionRouter)
  .route("/post", postRouter)
  .route("/content", contentRouter)

app.get("*", serveStatic({
  root: "./public",
})).get("*", serveStatic({
  path: "./public/index.html",
}))

export type AppType = typeof apiRoutes

export function honoWithJwt() {
  return new Hono<{
    Variables: {
      jwtPayload: AuthSchema
    }
  }>()
}

export default {
  createServer,
  fetch: app.fetch,
  // https://hono.dev/docs/middleware/builtin/body-limit
  // 2GiB
  maxRequestBodySize: 1024 * 1024 * 1024 * 2,
}
