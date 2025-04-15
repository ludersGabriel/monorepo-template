import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import { user } from ".."
import { accountSchemas } from "./account.zod"

const model = createSelectSchema(user, {
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

const dto = model

const input = createInsertSchema(user)

const update = input.partial().required({ id: true })

const login = model.pick({
  email: true,
}).extend({
  password: accountSchemas.model.shape.password,
})

export const userSchemas = {
  model,
  dto,
  input,
  update,
  login,
}
