import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import { subscriptionTable } from ".."

const subscriptionModelSchema = createSelectSchema(subscriptionTable)

const subscriptionDtoSchema = subscriptionModelSchema

const subscriptionInputSchema = createInsertSchema(
  subscriptionTable,
  {
    name: z.string().min(3, {
      message: "Nome deve ter no mínimo 3 caracteres",
    }).max(100, {
      message: "Nome deve ter no máximo 100 caracteres",
    }),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
      message: "Preço deve ser um número decimal",
    }),
  },
)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })

const subscriptionUpdateSchema = createInsertSchema(subscriptionTable)
  .partial()
  .required({ id: true })

export const subscriptionSchemas = {
  model: subscriptionModelSchema,
  dto: subscriptionDtoSchema,
  input: subscriptionInputSchema,
  update: subscriptionUpdateSchema,
}
