import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import { userTable } from ".."
import { subscriptionSchemas } from "./subscription.zod"
import { userInfoSchemas } from "./userInfo.zod"
import { userSubscriptionSchemas } from "./userSubscription.zod"

const userModelSchema = createSelectSchema(userTable)
  .extend({
    subscription: subscriptionSchemas.model.nullable().optional(),
    userSubscription: userSubscriptionSchemas.model.nullable().optional(),
    userInfo: userInfoSchemas.model.nullable().optional(),
  })

const userDtoSchema = userModelSchema
  .omit({ password: true })
  .extend({
    subscription: subscriptionSchemas.dto.nullable().optional(),
    userSubscription: userSubscriptionSchemas.dto.nullable().optional(),
    userInfo: userInfoSchemas.dto.nullable().optional(),
  })

const userInputSchema = createInsertSchema(userTable, {
  username: z
    .string()
    .min(3, {
      message: "Usuário deve ter no mínimo 3 caracteres",
    })
    .max(50, {
      message: "Usuário deve ter no máximo 50 caracteres",
    }),
  password: z
    .string()
    .min(8, {
      message: "Senha deve ter no mínimo 8 caracteres",
    })
    .max(118, {
      message: "Senha deve ter no máximo 118 caracteres",
    }),

  name: z
    .string()
    .min(3, { message: "Nome deve ter no mínimo 3 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  branchId: z.coerce.number(),
}).omit({ id: true, createdAt: true, updatedAt: true })

const userSignupSchema = userInputSchema.pick({
  username: true,
  password: true,
})

const userUpdateSchema = userModelSchema
  .partial()
  .required({ id: true })
  .omit({ createdAt: true, updatedAt: true })

export const userSchemas = {
  model: userModelSchema,
  dto: userDtoSchema,
  input: userInputSchema,
  update: userUpdateSchema,
  signup: userSignupSchema,
}

export const loginSchema = userModelSchema.pick({
  username: true,
  password: true,
})

export const authSchema = userSchemas.model
  .pick({
    role: true,
    username: true,
  })
  .extend({
    userId: z.coerce.number(),
    branchId: z.coerce.number(),
  })

export const authInputSchema = loginSchema
