import { z } from "zod"

import type { CoraxSuccess } from "../db/schema/types"

export const numberParamSchema = z.object({
  id: z.string().pipe(z.coerce.number()),
})

export const stringParamSchema = z.object({
  id: z.string(),
})

export type PaginatedResponse<T> = {
  pagination: {
    page: number
    totalPages: number
  }
  data: T
} & Omit<CoraxSuccess, "data">
