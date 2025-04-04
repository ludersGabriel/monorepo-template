import { zValidator } from "@hono/zod-validator"
import { HTTPException } from "hono/http-exception"
import Container from "typedi"

import type { CheckinDto, CoraxSuccess, SubscriptionDto } from "@/api/db/schema/types"

import { checkinSchemas, subscriptionSchemas } from "@/api/db/schema/zod"
import { honoWithJwt } from "@/api/index"

import { HttpStatus } from "../error/error.service"
import { numberParamSchema } from "../util"
import { SubscriptionService } from "./subscription.service"

const service = Container.get(SubscriptionService)

export const subscriptionRouter = honoWithJwt()
  .post(
    "/",
    zValidator("json", subscriptionSchemas.input),
    async (c) => {
      try {
        const context = await c.get("jwtPayload")
        const input = await c.req.valid("json")

        const subscription = subscriptionSchemas.dto.parse(
          await service.create(context, input),
        )

        return c.json<CoraxSuccess<SubscriptionDto>>(
          {
            data: subscription,
            message: "Inscrição criada",
            success: true,
          },
          HttpStatus.CREATED,
        )
      }
      catch {
        throw new HTTPException(HttpStatus.INTERNAL_SERVER_ERROR, {
          message: "Falha ao criar inscrição",
        })
      }
    },
  )
  .get("/", async (c) => {
    const context = await c.get("jwtPayload")

    const data = await service.findMany(context.branchId)

    return c.json<CoraxSuccess<SubscriptionDto[]>>({
      data,
      message: "Inscrições encontradas",
      success: true,
    })
  })
  .get("/:id/checkin", zValidator("param", numberParamSchema), async (c) => {
    const context = await c.get("jwtPayload")
    const { id } = await c.req.valid("param")

    return c.json<CoraxSuccess<number>>({
      data: await service.getCheckins(context, {
        subscriptionId: id,
        userId: context.userId,
      }),
      message: "Subscriptions found",
      success: true,
    })
  })
  .post("/:id/checkin", zValidator("param", numberParamSchema), async (c) => {
    const context = await c.get("jwtPayload")
    const { id } = await c.req.valid("param")

    return c.json<CoraxSuccess<CheckinDto>>({
      data: checkinSchemas.dto.parse(await service.checkin(context, {
        subscriptionId: id,
        userId: context.userId,
      })),
      message: "Checkin created",
      success: true,
    })
  })
