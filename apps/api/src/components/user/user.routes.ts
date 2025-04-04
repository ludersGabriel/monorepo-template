import { zValidator } from "@hono/zod-validator"
import { HTTPException } from "hono/http-exception"
import postgres from "postgres"
import { Container } from "typedi"

import type { CoraxSuccess, UserDto, UserInfoDto } from "@/api/db/schema/types"

import {
  HttpStatus,
} from "@/api/components/error/error.service"
import { UserService } from "@/api/components/user/user.service"
import { userInfoSchemas, userSchemas } from "@/api/db/schema/zod"
import { honoWithJwt } from "@/api/index"

import { numberParamSchema } from "../util"

const service = Container.get(UserService)

export const userRouter = honoWithJwt()
  .post("/", zValidator("form", userSchemas.input), async (c) => {
    try {
      const context = await c.get("jwtPayload")
      const input = await c.req.valid("form")

      const user = userSchemas.dto.parse(
        await service.create(context, input),
      )

      return c.json<CoraxSuccess<UserDto>>(
        {
          data: user,
          message: "Usuário criado",
          success: true,
        },
        HttpStatus.CREATED,
      )
    }
    catch (e) {
      if (e instanceof postgres.PostgresError && e.code === "23505") {
        throw new HTTPException(HttpStatus.CONFLICT, {
          message:
            "Aluno já adicionado! Cheque se o usuário já existe",
          cause: { form: true },
        })
      }

      throw new HTTPException(HttpStatus.INTERNAL_SERVER_ERROR, {
        message: "Falha ao criar usuário",
      })
    }
  })
  .get("/many", async (c) => {
    const context = await c.get("jwtPayload")

    const users = userSchemas.dto
      .array()
      .parse(await service.findMany(context))

    return c.json<CoraxSuccess<UserDto[]>>(
      {
        data: users,
        message: "Users found",
        success: true,
      },
      HttpStatus.OK,
    )
  })
  .get("/", async (c) => {
    const context = await c.get("jwtPayload")
    const user = userSchemas.dto.parse(await service.me(context))

    return c.json<CoraxSuccess<UserDto>>(
      {
        data: user,
        message: "Me found",
        success: true,
      },
      HttpStatus.OK,
    )
  })
  .post("/update", zValidator("json", userSchemas.update), async (c) => {
    const context = await c.get("jwtPayload")
    const input = await c.req.valid("json")

    const user = userSchemas.dto.parse(
      await service.update(context, input),
    )

    return c.json<CoraxSuccess<UserDto>>(
      {
        data: user,
        message: "User updated",
        success: true,
      },
      HttpStatus.OK,
    )
  })
  .post("/user-info", zValidator("json", userInfoSchemas.input), async (c) => {
    const context = await c.get("jwtPayload")
    const input = await c.req.valid("json")

    const userInfo = userInfoSchemas.dto.parse(
      await service.userInfoUpsert(context, input),
    )

    return c.json<CoraxSuccess<UserInfoDto>>(
      {
        data: userInfo,
        message: "User info updated",
        success: true,
      },
      HttpStatus.OK,
    )
  })
  .get("/:id", zValidator("param", numberParamSchema), async (c) => {
    const context = await c.get("jwtPayload")
    const { id } = await c.req.valid("param")

    const user = userSchemas.dto.parse(
      await service.find(context, id),
    )

    return c.json<CoraxSuccess<UserDto>>(
      {
        data: user,
        message: "User found",
        success: true,
      },
      HttpStatus.OK,
    )
  })
