import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import Container from "typedi"

import type { CoraxSuccess } from "@/api/db/schema/types"

import {
  HttpStatus,
} from "@/api/components/error/error.service"
import { authInputSchema } from "@/api/db/schema/zod"

import { AuthService } from "./auth.service"

const service = Container.get(AuthService)

export const authRouter = new Hono().post(
  "/",
  zValidator("form", authInputSchema),
  async (c) => {
    const input = await c.req.valid("form")

    const token = await service.login(input)

    return c.json<CoraxSuccess<{ token: string }>>(
      {
        data: { token },
        message: "Login successful",
        success: true,
      },
      HttpStatus.OK,
    )
  },
)
