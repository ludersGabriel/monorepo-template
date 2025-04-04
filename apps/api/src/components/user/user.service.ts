/* eslint-disable drizzle/enforce-delete-with-where */
import { Inject, Service } from "typedi"

import type { AuthSchema, UserInfoInput, UserInput, UserModel, UserUpdate } from "@/api/db/schema/types"

import { adminOrOwner } from "@/api/lib/utils"

import { hashPassword } from "../auth/auth.repo"
// eslint-disable-next-line ts/consistent-type-imports
import { UserRepo } from "./user.repo"

@Service()
export class UserService {
  @Inject()
  private readonly repo: UserRepo

  async create(context: AuthSchema, user: UserInput) {
    adminOrOwner(context)

    user.password = hashPassword(user.password)

    return this.repo.create(user)
  }

  async update(context: AuthSchema, user: UserUpdate) {
    adminOrOwner(context, user.id)

    if (user.password) {
      user.password = hashPassword(user.password)
    }

    return this.repo.update(user)
  }

  async delete(context: AuthSchema, id: UserModel["id"]) {
    adminOrOwner(context, id)

    return this.repo.delete(id)
  }

  async find(context: AuthSchema, id: UserModel["id"]) {
    adminOrOwner(context, id)

    return this.repo.find(id)
  }

  // ! used in the auth service only
  async findByUsername(username: UserModel["username"]) {
    return this.repo.findByUsername(username)
  }

  async me(context: AuthSchema) {
    return this.repo.find(context.userId)
  }

  async findMany(context: AuthSchema) {
    adminOrOwner(context)

    return this.repo.findMany()
  }

  async userInfoUpsert(context: AuthSchema, userInfo: UserInfoInput) {
    adminOrOwner(context, userInfo.userId)

    return this.repo.userInfoUpsert(userInfo)
  }
}
