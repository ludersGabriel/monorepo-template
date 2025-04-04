import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import { userSubscriptionTable } from ".."

const userSubscriptionModelSchema = createSelectSchema(userSubscriptionTable)

const userSubscriptionDtoSchema = userSubscriptionModelSchema

const userSubscriptionInputSchema = createInsertSchema(
  userSubscriptionTable,
  {
    userId: z.number().int().positive({
      message: "userId deve ser um número inteiro positivo",
    }),
    subscriptionId: z.number().int().positive({
      message: "subscriptionId deve ser um número inteiro positivo",
    }),
  },
)
  .omit({
    id: true,
  })

const userSubscriptionUpdateSchema = createInsertSchema(userSubscriptionTable).required({
  id: true,
}).omit({
  createdAt: true,
  updatedAt: true,
})

export const userSubscriptionSchemas = {
  model: userSubscriptionModelSchema,
  dto: userSubscriptionDtoSchema,
  input: userSubscriptionInputSchema,
  update: userSubscriptionUpdateSchema,
}
