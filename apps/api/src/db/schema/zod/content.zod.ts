import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import { contentTable } from ".."

const contentModelSchema = createSelectSchema(contentTable)
const contentDtoSchema = contentModelSchema
const contentInputSchema = createInsertSchema(
  contentTable,
  { name: z.string().max(200, "name too big, limit is 200") },
)
  .pick({ name: true, format: true })
  .extend({ file: z.instanceof(File) })

const contentUpdateSchema = createInsertSchema(
  contentTable,
  { name: z.string().max(200, "name too big, limit is 200") },
)
  .partial()
  .required({ id: true })

export const contentSchemas = {
  model: contentModelSchema,
  dto: contentDtoSchema,
  input: contentInputSchema,
  update: contentUpdateSchema,
}
