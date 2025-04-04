import { isCEP, isCPF, isPhone } from "brazilian-values"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import { userInfoTable } from ".."

const userInfoModelSchema = createSelectSchema(userInfoTable)

const userInfoDtoSchema = userInfoModelSchema

const userInputSchema = createInsertSchema(userInfoTable, {
  cpf: z.string().refine(isCPF, { message: "CPF inválido" }).nullable().optional(),
  email: z.string().email({ message: "Email inválido" }).nullable().optional(),
  phone: z.string().refine(isPhone, { message: "Telefone inválido" }).nullable().optional(),
  cep: z.string().refine(isCEP, { message: "CEP inválido" }).nullable().optional(),
  number: z.coerce.number().nullable().optional(),
})

const userUpdateSchema = userInfoModelSchema.partial().required({ id: true })

export const userInfoSchemas = {
  model: userInfoModelSchema,
  dto: userInfoDtoSchema,
  input: userInputSchema,
  update: userUpdateSchema,
}
