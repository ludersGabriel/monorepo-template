/* eslint-disable ts/no-empty-object-type */

import type { z } from "zod"

import type { authInputSchema, authSchema, checkinSchemas, contentSchemas, loginSchema, subscriptionSchemas, userInfoSchemas, userSchemas, userSubscriptionSchemas } from "../schema/zod"
import type { branchSchemas } from "./zod/branch.zod"
import type { fileFormatEnumSchema } from "./zod/enum/fileFormat.enum"
import type { postSchemas } from "./zod/post.zod"

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
export type UserSignup = z.infer<typeof userSchemas.signup>

export type LoginModel = z.infer<typeof loginSchema>

export type AuthSchema = z.infer<typeof authSchema>
export type AuthInput = z.infer<typeof authInputSchema>

export type SubscriptionModel = z.infer<
  typeof subscriptionSchemas.model
>

export type SubscriptionDto = z.infer<typeof subscriptionSchemas.dto>
export type SubscriptionInput = z.infer<
  typeof subscriptionSchemas.input
>
export type SubscriptionUpdate = z.infer<
  typeof subscriptionSchemas.update
>

export type UserSubscriptionModel = z.infer<typeof userSubscriptionSchemas.model>
export type UserSubscriptionDto = z.infer<typeof userSubscriptionSchemas.dto>
export type UserSubscriptionInput = z.infer<typeof userSubscriptionSchemas.input>
export type UserSubscriptionUpdate = z.infer<typeof userSubscriptionSchemas.update>

export type CheckinModel = z.infer<typeof checkinSchemas.model>
export type CheckinDto = z.infer<typeof checkinSchemas.dto>
export type CheckinInput = z.infer<typeof checkinSchemas.input>
export type CheckinUpdate = z.infer<typeof checkinSchemas.update>

export type ContentModel = z.infer<typeof contentSchemas.model>
export type ContentDto = z.infer<typeof contentSchemas.dto>
export type ContentInput = z.infer<typeof contentSchemas.input>
export type ContentUpdate = z.infer<typeof contentSchemas.update>

export type FileFormatEnum = z.infer<typeof fileFormatEnumSchema>

export type PostModel = z.infer<typeof postSchemas.model>
export type PostDto = z.infer<typeof postSchemas.dto>
export type PostInput = z.infer<typeof postSchemas.input>
export type PostUpdate = z.infer<typeof postSchemas.update>
export type PostForm = z.infer<typeof postSchemas.form>

export type BranchModel = z.infer<typeof branchSchemas.model>
export type BranchDto = z.infer<typeof branchSchemas.dto>
export type BranchInput = z.infer<typeof branchSchemas.input>
export type BranchUpdate = z.infer<typeof branchSchemas.update>

export type UserInfoModel = z.infer<typeof userInfoSchemas.model>
export type UserInfoDto = z.infer<typeof userInfoSchemas.dto>
export type UserInfoInput = z.infer<typeof userInfoSchemas.input>
export type UserInfoUpdate = z.infer<typeof userInfoSchemas.update>
