import { Inject, Service } from "typedi"

import type { AuthSchema, PostInput } from "@/api/db/schema/types"

import { adminOrOwner } from "@/api/lib/utils"

// eslint-disable-next-line ts/consistent-type-imports
import { PostRepo } from "./post.repo"

@Service()
export class PostService {
  @Inject()
  private readonly postRepo: PostRepo

  async create(context: AuthSchema, input: PostInput) {
    adminOrOwner(context)

    return this.postRepo.create(input)
  }

  async findMany() {
    return this.postRepo.findMany()
  }
}
