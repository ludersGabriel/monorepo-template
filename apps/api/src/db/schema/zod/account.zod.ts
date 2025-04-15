import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import { account } from ".."

const model = createSelectSchema(account, {
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

const dto = model

const input = createInsertSchema(account)

const update = input.partial().required({ id: true })

export const accountSchemas = {
  model,
  dto,
  input,
  update,
}
