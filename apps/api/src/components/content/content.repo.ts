import type { S3File } from "bun"

import { S3Client } from "bun"
import { eq } from "drizzle-orm"
import { HTTPException } from "hono/http-exception"
import { Service } from "typedi"

import type { Transaction } from "@/api/db"
import type { ContentInput, ContentModel, ContentUpdate } from "@/api/db/schema/types"

import db from "@/api/db"
import { contentTable } from "@/api/db/schema"
import { contentSchemas } from "@/api/db/schema/zod"
import env from "@/api/env"

import { HttpStatus } from "../error/error.service"

const s3storage = new S3Client({
  accessKeyId: env.S3_ACCESSKEY_USER,
  secretAccessKey: env.S3_ACCESSKEY_PASS,
  bucket: env.S3_BUCKET,
  endpoint: env.S3_ENDPOINT,
})

@Service()
export default class ContentRepo {
  async create(
    input: ContentInput,
    tx?: Transaction,
  ): Promise<ContentModel> {
    const repo = tx ?? db

    return repo.transaction(async (tx) => {
      // Create content entry

      const [created] = await tx.insert(contentTable)
        .values({
          name: input.name,
          format: input.format,
          size: input.file.size,
        })
        .returning()

      if (!created) {
        throw new HTTPException(HttpStatus.INTERNAL_SERVER_ERROR, {
          message: "Failure while creating content",
        })
      }

      // Upload file to S3
      // https://bun.sh/docs/api/s3
      try {
        const s3file: S3File = s3storage.file(created.id)

        // TODO: Test and discuss queue and chunk size
        const writer = s3file.writer({
          retry: 3,
          queueSize: 10,
          partSize: 5 * 1024 * 1024,
        })

        const inpStream = input.file.stream() as unknown as AsyncIterable<Uint8Array>

        for await (const chunk of inpStream) {
          await writer.write(chunk)
        }
        await writer.end()
      }
      catch {
        throw new HTTPException(HttpStatus.INTERNAL_SERVER_ERROR, {
          message: "Failure while creating content",
        })
      }

      return contentSchemas.model.parse(created)
    })
  }

  async update(classUpdate: ContentUpdate): Promise<ContentModel> {
    const [ret] = await db
      .update(contentTable)
      .set(classUpdate)
      .where(eq(contentTable.id, classUpdate.id))
      .returning()

    return ret
  }

  async delete(
    id: ContentModel["id"],
    tx?: Transaction,
  ): Promise<ContentModel> {
    const repo = tx ?? db

    return repo.transaction(async (tx) => {
      // Create content entry

      const [deleted] = await tx.delete(contentTable)
        .where(eq(contentTable.id, id))
        .returning()

      if (!deleted) {
        throw new HTTPException(HttpStatus.INTERNAL_SERVER_ERROR, {
          message: "Failure while deleting content",
        })
      }

      // Delete file from S3
      // https://bun.sh/docs/api/s3
      try {
        const s3file: S3File = s3storage.file(id)

        // eslint-disable-next-line drizzle/enforce-delete-with-where
        await s3file.delete()
      }
      catch {
        throw new HTTPException(HttpStatus.INTERNAL_SERVER_ERROR, {
          message: "Failure while deleting content",
        })
      }

      return contentSchemas.model.parse(deleted)
    })
  }

  async find(
    id: ContentModel["id"],
  ): Promise<ContentModel | undefined> {
    const [ret] = await db
      .select()
      .from(contentTable)
      .where(eq(contentTable.id, id))

    return ret ? contentSchemas.model.parse(ret) : undefined
  }

  async findMany(): Promise<ContentModel[]> {
    return contentSchemas.model.array().parse(
      await db.query.contentTable.findMany(),
    )
  }

  async download(
    id: ContentModel["id"],
  ): Promise<ReadableStream> {
    try {
      const s3file: S3File = s3storage.file(id)
      return s3file.stream()
    }
    catch {
      throw new HTTPException(HttpStatus.INTERNAL_SERVER_ERROR, {
        message: "Failure while downloading content",
      })
    }
  }
}
