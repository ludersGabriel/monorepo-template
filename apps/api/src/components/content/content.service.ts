import { Inject, Service } from "typedi"

import type { AuthSchema, ContentInput, ContentModel, ContentUpdate } from "@/api/db/schema/types"

import { adminOrOwner } from "@/api/lib/utils"

// eslint-disable-next-line ts/consistent-type-imports
import ContentRepo from "./content.repo"

@Service()
export default class ContentService {
  @Inject()
  private readonly repo: ContentRepo

  async create(
    context: AuthSchema,
    contentInput: ContentInput,
  ): Promise<ContentModel> {
    adminOrOwner(context)
    return this.repo.create(contentInput)
  }

  async update(
    context: AuthSchema,
    contentUpdate: ContentUpdate,
  ): Promise<ContentModel> {
    adminOrOwner(context)
    return this.repo.update(contentUpdate)
  }

  async delete(
    context: AuthSchema,
    id: ContentModel["id"],
  ): Promise<ContentModel> {
    adminOrOwner(context)
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    return this.repo.delete(id)
  }

  async find(
    id: ContentModel["id"],
  ): Promise<ContentModel | undefined> {
    return this.repo.find(id)
  }

  async findMany(): Promise<ContentModel[]> {
    return this.repo.findMany()
  }

  async download(
    id: ContentModel["id"],
  ): Promise<ReadableStream> {
    return this.repo.download(id)
  }
}
