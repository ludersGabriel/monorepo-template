import { desc, eq, getTableColumns } from "drizzle-orm"
import { HTTPException } from "hono/http-exception"
import { Service } from "typedi"
import { z } from "zod"

import type { Transaction } from "@/api/db"
import type { UserInfoInput, UserInput, UserModel, UserUpdate } from "@/api/db/schema/types"

import db from "@/api/db"
import { subscriptionTable, userInfoTable, userSubscriptionTable, userTable } from "@/api/db/schema"
import { userInfoSchemas, userSchemas } from "@/api/db/schema/zod"

import { HttpStatus } from "../error/error.service"

@Service()
export class UserRepo {
  async create(user: UserInput, tx?: Transaction) {
    const repo = tx ?? db

    return await repo.transaction(async (tx) => {
      const [ret] = await tx
        .insert(userTable)
        .values(user)
        .returning()

      await tx.insert(userSubscriptionTable).values({
        userId: ret.id,
        subscriptionId: 1,
      })

      return userSchemas.model.parse(ret)
    })
  }

  async update(user: UserUpdate) {
    return db.transaction(async (tx) => {
      const [u] = await tx
        .update(userTable)
        .set(user)
        .where(eq(userTable.id, user.id))
        .returning()

      if (user.userSubscription) {
        await tx
          .update(userSubscriptionTable)
          .set(user.userSubscription)
          .where(eq(userSubscriptionTable.userId, user.id))
      }

      return userSchemas.model.parse(u)
    })
  }

  async delete(id: UserModel["id"]) {
    const [ret] = await db
      .delete(userTable)
      .where(eq(userTable.id, id))
      .returning()

    return userSchemas.model.parse(ret)
  }

  async find(id: UserModel["id"]) {
    const [ret] = await db
      .select({
        ...getTableColumns(userTable),
        subscription: getTableColumns(subscriptionTable),
        userSubscription: getTableColumns(userSubscriptionTable),
        userInfo: getTableColumns(userInfoTable),
      })
      .from(userTable)
      .where(eq(userTable.id, id))
      .leftJoin(userSubscriptionTable, eq(userTable.id, userSubscriptionTable.userId))
      .leftJoin(subscriptionTable, eq(subscriptionTable.id, userSubscriptionTable.subscriptionId))
      .leftJoin(userInfoTable, eq(userTable.id, userInfoTable.userId))

    if (!ret) {
      throw new HTTPException(HttpStatus.NOT_FOUND, {
        message: "Matrícula não encontrada",
      })
    }

    return userSchemas.model.parse(ret)
  }

  async findByUsername(username: UserModel["username"]) {
    const [ret] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.username, username))

    if (!ret) {
      throw new HTTPException(HttpStatus.NOT_FOUND, {
        message: "Usuário não encontrado",
        cause: { form: true },
      })
    }

    return userSchemas.model.parse(ret)
  }

  async findMany() {
    const ret = await db
      .select({
        ...getTableColumns(userTable),
        subscription: getTableColumns(subscriptionTable),
        userSubscription: getTableColumns(userSubscriptionTable),
        userInfo: getTableColumns(userInfoTable),
      })
      .from(userTable)
      .leftJoin(userSubscriptionTable, eq(userTable.id, userSubscriptionTable.userId))
      .leftJoin(subscriptionTable, eq(subscriptionTable.id, userSubscriptionTable.subscriptionId))
      .leftJoin(userInfoTable, eq(userTable.id, userInfoTable.userId))
      .orderBy(desc(userTable.updatedAt))

    return z.array(userSchemas.model).parse(
      ret,
    )
  }

  async userInfoUpsert(input: UserInfoInput) {
    const [ret] = await db
      .insert(userInfoTable)
      .values(input)
      .onConflictDoUpdate({
        target: [userInfoTable.userId],
        set: {
          ...input,
        },
      })
      .returning()

    return userInfoSchemas.model.parse(ret)
  }
}
