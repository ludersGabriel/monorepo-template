/* eslint-disable drizzle/enforce-delete-with-where */
import { Inject, Service } from "typedi"

import type { AuthSchema, CheckinInput, SubscriptionInput, SubscriptionUpdate } from "@/api/db/schema/types"

import { adminOrOwner } from "@/api/lib/utils"

// eslint-disable-next-line ts/consistent-type-imports
import { SubscriptionRepo } from "./subscription.repo"

@Service()
export class SubscriptionService {
  @Inject()
  private readonly repo: SubscriptionRepo

  async create(context: AuthSchema, subscription: SubscriptionInput) {
    adminOrOwner(context)

    return this.repo.create(subscription)
  }

  async update(
    context: AuthSchema,
    subscription: SubscriptionUpdate,
  ) {
    adminOrOwner(context)

    return this.repo.update(subscription)
  }

  async delete(context: AuthSchema, id: number) {
    adminOrOwner(context)

    return this.repo.delete(id)
  }

  async findMany(branchId: number) {
    return this.repo.findMany(branchId)
  }

  async getCheckins(context: AuthSchema, input: CheckinInput) {
    adminOrOwner(context, input.userId)

    return this.repo.getCheckins(input)
  }

  async checkin(context: AuthSchema, input: CheckinInput) {
    adminOrOwner(context, input.userId)

    return this.repo.checkin(input)
  }
}
