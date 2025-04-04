import { HTTPException } from "hono/http-exception"
import { z } from "zod"

import { HttpStatus } from "@/api/components/error/error.service"

import type { AuthSchema } from "../db/schema/types"

export const isoDateCoerce = z
  .preprocess((value) => {
    if (value instanceof Date)
      return value.toISOString()
    if (typeof value === "string")
      return new Date(value).toISOString()
    return value
  }, z.string().datetime())
  .brand<"ISODate">()

export const psqlDateCoerce = z
  .preprocess((value) => {
    // Handle Date objects
    if (value instanceof Date) {
      return value.toISOString().split("T")[0]
    }

    // Handle strings
    if (typeof value === "string") {
      const date = new Date(value)
      if (!Number.isNaN(date.getTime())) { // Check if valid date
        return date.toISOString().split("T")[0]
      }
    }

    return value
  }, z.string())
  .brand<"PSQLDate">()

export function adminOrOwner(context: AuthSchema, ownerId?: number) {
  const check = !ownerId
    ? context.role !== "admin"
    : context.role !== "admin" && context.userId !== ownerId

  if (check) {
    throw new HTTPException(HttpStatus.UNAUTHORIZED, {
      message: "Missing permissions",
    })
  }
}

export const removeTime = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
