import * as crypto from "node:crypto"
import { Inject, Service } from "typedi"

import type { Transaction } from "@/api/db"
import type { ContentInput, PostInput } from "@/api/db/schema/types"

import db from "@/api/db"
import { postTable } from "@/api/db/schema"
import { fileFormatEnumSchema } from "@/api/db/schema/zod/enum/fileFormat.enum"
import { postSchemas } from "@/api/db/schema/zod/post.zod"

// eslint-disable-next-line ts/consistent-type-imports
import ContentRepo from "../content/content.repo"

@Service()
export class PostRepo {
  @Inject()
  private readonly contentRepo: ContentRepo

  async create(input: PostInput, tx?: Transaction) {
    const repo = tx ?? db

    return repo.transaction(async (tx) => {
      if (input.content) {
        const format = fileFormatEnumSchema.parse(input.content.type.split("/")[1])

        const contentInput: ContentInput = {
          file: input.content,
          name: crypto.randomBytes(20).toString("hex"),
          format,
        }

        input.image = (await this.contentRepo.create(contentInput, tx)).id
      }

      const [ret] = await tx.insert(postTable).values(input).returning()

      return postSchemas.model.parse(
        ret,
      )
    })
  }

  async findMany() {
    const ret = await db.query.postTable.findMany({
      orderBy: (postTable, { desc }) => [desc(postTable.createdAt)],
    })

    return postSchemas.model.array().parse(ret)
  }
}
