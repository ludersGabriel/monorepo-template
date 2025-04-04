import { zValidator } from "@hono/zod-validator"
import { bodyLimit } from "hono/body-limit"
import { HTTPException } from "hono/http-exception"
import { stream } from "hono/streaming"
import Container from "typedi"

import type { ContentDto, ContentInput, CoraxSuccess, FileFormatEnum } from "@/api/db/schema/types"

import { contentSchemas } from "@/api/db/schema/zod"
import { honoWithJwt } from "@/api/index"

import { HttpStatus } from "../error/error.service"
import ContentService from "./content.service"

const service = Container.get(ContentService)

// eslint-disable-next-line drizzle/enforce-delete-with-where
export const contentRouter = honoWithJwt()
  .post(
    "/upload",
    // zValidator("form", contentInput),
    bodyLimit({
      maxSize: 1024 * 1024 * 1024 * 2,
      onError: (c) => {
        return c.text("Request size too large, must be smaller than 2GiB", 413)
      },
    }),
    async (c) => {
      try {
        const context = await c.get("jwtPayload")

        const formData = await c.req.formData()
        const ifile = formData.get("file") as File | null
        const name = formData.get("name") as string
        const format = formData.get("format") as FileFormatEnum

        if (ifile instanceof File) {
          const input: ContentInput = {
            name,
            file: ifile,
            format,
          }

          const content = contentSchemas.dto.parse(
            await service.create(context, input),
          )

          return c.json<CoraxSuccess<ContentDto>>(
            {
              data: content,
              message: "Content created with success",
              success: true,
            },
            HttpStatus.CREATED,
          )
        }
      }
      catch (error) {
        console.error(error)
        throw new HTTPException(HttpStatus.INTERNAL_SERVER_ERROR, {
          message: "Failure while creating content",
        })
      }
    },
  )
  .get(
    "/download/:id",
    zValidator(
      "param",
      contentSchemas.model.pick({ id: true }),
    ),
    async (c) => {
      try {
        const { id } = await c.req.valid("param")

        const content = await service.download(id)

        // https://hono.dev/docs/helpers/streaming
        return stream(c, async (stream) => {
          stream.onAbort(() => {
            throw new HTTPException(HttpStatus.INTERNAL_SERVER_ERROR, {
              message: "Failure while downloading content",
            })
          })

          await stream.pipe(content)
        })
      }
      catch (error) {
        console.error(error)
        throw new HTTPException(HttpStatus.INTERNAL_SERVER_ERROR, {
          message: "Failure while downloading content",
        })
      }
    },
  )
  .delete(
    "/delete/:id",
    zValidator(
      "param",
      contentSchemas.model.pick({ id: true }),
    ),
    async (c) => {
      try {
        const context = await c.get("jwtPayload")
        const { id } = await c.req.valid("param")

        // eslint-disable-next-line drizzle/enforce-delete-with-where
        const content = await service.delete(context, id)

        return c.json<CoraxSuccess<ContentDto>>(
          {
            data: content,
            message: "Content deleted with success",
            success: true,
          },
          HttpStatus.CREATED,
        )
      }
      catch (error) {
        console.error(error)
        throw new HTTPException(HttpStatus.INTERNAL_SERVER_ERROR, {
          message: "Failure while deleting content",
        })
      }
    },
  )
  .get(
    "/list",
    async (c) => {
      try {
        const contents = await service.findMany()

        return c.json<CoraxSuccess<ContentDto[]>>(
          {
            data: contents,
            message: "Contents fetched with success",
            success: true,
          },
          HttpStatus.CREATED,
        )
      }
      catch (error) {
        console.error(error)
        throw new HTTPException(HttpStatus.INTERNAL_SERVER_ERROR, {
          message: "Failure while fetching contents",
        })
      }
    },
  )
