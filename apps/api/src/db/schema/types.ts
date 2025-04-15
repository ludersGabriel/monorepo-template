/* eslint-disable ts/no-empty-object-type */

import type { z } from "zod"

import type { userSchemas } from "./zod/user.zod"

export type CoraxSuccess<T = void> = {
  success: true
  message: string
} & (T extends void ? {} : { data: T })

export type CoraxError = {
  success: false
  error: string
  isFormError?: boolean
}

export type UserModel = z.infer<typeof userSchemas.model>
export type UserDto = z.infer<typeof userSchemas.dto>
export type UserInput = z.infer<typeof userSchemas.input>
export type UserUpdate = z.infer<typeof userSchemas.update>
