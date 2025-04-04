import { createInsertSchema, createSelectSchema } from "drizzle-zod"

import { checkinTable } from ".."

const checkinModelSchema = createSelectSchema(checkinTable)

const checkinDtoSchema = checkinModelSchema

const checkinInputSchema = createInsertSchema(checkinTable)

const checkinUpdateSchema = checkinModelSchema.partial().required({
  id: true,
})

export const checkinSchemas = {
  model: checkinModelSchema,
  dto: checkinDtoSchema,
  input: checkinInputSchema,
  update: checkinUpdateSchema,
}
