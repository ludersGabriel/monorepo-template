import { createInsertSchema, createSelectSchema } from "drizzle-zod"

import { branchTable } from ".."

const branchModelSchema = createSelectSchema(branchTable)

const branchDtoSchema = branchModelSchema

const branchInputSchema = createInsertSchema(branchTable)

const branchUpdateSchema = createInsertSchema(branchTable)
  .partial()
  .required({ id: true })

export const branchSchemas = {
  model: branchModelSchema,
  dto: branchDtoSchema,
  input: branchInputSchema,
  update: branchUpdateSchema,
}
