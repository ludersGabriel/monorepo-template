import { and, eq, gte, lte } from "drizzle-orm"
import { HTTPException } from "hono/http-exception"
import { Service } from "typedi"
import { z } from "zod"

import type { Transaction } from "@/api/db"
import type { CheckinInput, SubscriptionInput, SubscriptionModel, SubscriptionUpdate } from "@/api/db/schema/types"

import db from "@/api/db"
import { checkinTable, subscriptionTable, userSubscriptionTable } from "@/api/db/schema"
import { subscriptionSchemas } from "@/api/db/schema/zod"
import { isoDateCoerce, removeTime } from "@/api/lib/utils"

import { HttpStatus } from "../error/error.service"

@Service()
export class SubscriptionRepo {
  async create(subscription: SubscriptionInput, tx?: Transaction) {
    const repo = tx ?? db

    const [ret] = await repo
      .insert(subscriptionTable)
      .values(subscription)
      .returning()

    return subscriptionSchemas.model.parse(ret)
  }

  async update(subscription: SubscriptionUpdate, tx?: Transaction) {
    const repo = tx ?? db

    const [ret] = await repo
      .update(subscriptionTable)
      .set(subscription)
      .where(eq(subscriptionTable.id, subscription.id))
      .returning()

    return subscriptionSchemas.model.parse(ret)
  }

  async delete(id: SubscriptionModel["id"], tx?: Transaction) {
    const repo = tx ?? db

    const [ret] = await repo
      .delete(subscriptionTable)
      .where(eq(subscriptionTable.id, id))
      .returning()

    return subscriptionSchemas.model.parse(ret)
  }

  async findMany(branchId: number) {
    return z.array(subscriptionSchemas.model).parse(
      await db.query.subscriptionTable.findMany({
        where: eq(subscriptionTable.branchId, branchId),
      }),
    )
  }

  async getCheckins(input: CheckinInput, tx?: Transaction) {
    const repo = tx ?? db

    const userSub = await repo.query.userSubscriptionTable.findFirst({
      where: and(
        eq(userSubscriptionTable.subscriptionId, input.subscriptionId),
        eq(userSubscriptionTable.userId, input.userId),
      ),
    })

    if (!userSub) {
      throw new HTTPException(HttpStatus.NOT_FOUND, {
        message: "Inscrição não encontrada para o usuário",
      })
    }

    const endDate = new Date(new Date(userSub.startDate).getTime() + 30 * 24 * 60 * 60 * 1000)

    return repo.$count(checkinTable, and(eq(checkinTable.userId, input.userId), eq(checkinTable.subscriptionId, input.subscriptionId), gte(checkinTable.createdAt, isoDateCoerce.parse(userSub.startDate)), lte(checkinTable.createdAt, isoDateCoerce.parse(endDate))))
  }

  async checkin(input: CheckinInput, tx?: Transaction) {
    const repo = tx ?? db

    return repo.transaction(async (tx) => {
      const sub = await tx.query.subscriptionTable.findFirst({
        where: eq(subscriptionTable.id, input.subscriptionId),
      })

      if (!sub) {
        throw new HTTPException(HttpStatus.NOT_FOUND, {
          message: "Inscrição não encontrada",
        })
      }

      const userSub = await tx.query.userSubscriptionTable.findFirst({
        where: and(
          eq(userSubscriptionTable.subscriptionId, input.subscriptionId),
          eq(userSubscriptionTable.userId, input.userId),
        ),
      })

      if (!userSub) {
        throw new HTTPException(HttpStatus.NOT_FOUND, {
          message: "Inscrição não encontrada para o usuário",
        })
      }

      const today = removeTime(new Date())
      const startDate = removeTime(new Date(userSub.startDate))
      const endDate = removeTime(new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000))

      if (userSub.active === false) {
        throw new HTTPException(HttpStatus.BAD_REQUEST, {
          message: "Inscrição inativa. Fale com o administrador",
        })
      }

      if (today > endDate || today < startDate) {
        throw new HTTPException(HttpStatus.BAD_REQUEST, {
          message: "Fora do período válido para checkin",
        })
      }

      const checkinCount = await tx.$count(checkinTable, and(eq(checkinTable.userId, input.userId), eq(checkinTable.subscriptionId, input.subscriptionId), gte(checkinTable.createdAt, isoDateCoerce.parse(startDate)), lte(checkinTable.createdAt, isoDateCoerce.parse(endDate))))

      if (checkinCount >= sub.monthlyClasses) {
        throw new HTTPException(HttpStatus.BAD_REQUEST, {
          message: "Limite de checkins excedido",
        })
      }

      const [ret] = await tx.insert(checkinTable).values(input).returning()

      return ret
    })
  }
}
