import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import { postTable } from ".."

const postModel = createSelectSchema(postTable)

const postDto = postModel

const postInput = createInsertSchema(postTable, {
  owner: z.coerce.number(),
  branchId: z.coerce.number(),
}).extend({
  content: z.instanceof(File),
})

const postForm = createInsertSchema(postTable, {
  title: z.string().nonempty({ message: "Título do post não pode ser vazio" }),
  body: z.string().nonempty({ message: "Corpo do post não pode ser vazio" }),
}).extend({
  content: z.instanceof(File),
}).omit({ id: true, branchId: true, createdAt: true, updatedAt: true, image: true, owner: true })

const postUpdate = postModel.partial().required({ id: true })

export const postSchemas = {
  model: postModel,
  dto: postDto,
  input: postInput,
  update: postUpdate,
  form: postForm,
}
