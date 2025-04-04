import { bodyLimit } from "hono/body-limit"
import { HTTPException } from "hono/http-exception"
import { validator } from "hono/validator"
import Container from "typedi"

import type { CoraxSuccess, PostDto, PostInput } from "@/api/db/schema/types"

import { postSchemas } from "@/api/db/schema/zod/post.zod"

import { honoWithJwt } from "../.."
import { HttpStatus } from "../error/error.service"
import { PostService } from "./post.service"

const service = Container.get(PostService)

export const postRouter = honoWithJwt()
  .post(
    "/",
    bodyLimit({
      maxSize: 1024 * 1024 * 1024 * 2,
      onError: (c) => {
        return c.text("Request size too large, must be smaller than 2GiB", 413)
      },
    }),

    validator("form", async (_value, c) => {
      const formData: FormData = await c.req.formData()
      const form: { [x: string]: string | File | null } = {}
      formData.forEach((v, key) => {
        form[key] = v as string | File
      })

      const parsed = postSchemas.input.omit({ owner: true, branchId: true }).safeParse(form)

      if (!parsed.success) {
        throw new HTTPException(HttpStatus.BAD_REQUEST, { message: "Formulário inválido" })
      }

      return parsed.data

      // ! this still breaks for very large files
      // const parsed = postSchemas.input.safeParse(value)

      // if (!parsed.success) {
      //   throw new HTTPException(HttpStatus.BAD_REQUEST, { message: "Invalid form" })
      // }

      // return parsed.data
    }),
    async (c) => {
      const context = await c.get("jwtPayload")
      const post: PostInput = {
        ...c.req.valid("form"),
        owner: context.userId,
        branchId: context.branchId,
      }

      const ret = postSchemas.dto.parse(await service.create(context, post))

      return c.json<CoraxSuccess<PostDto>>({
        data: ret,
        message: "Post created with success",
        success: true,
      })
    },
  )
  .get("/", async (c) => {
    const ret = postSchemas.dto.array().parse(await service.findMany())

    return c.json<CoraxSuccess<PostDto[]>>({
      data: ret,
      message: "Posts fetched with success",
      success: true,
    })
  })
