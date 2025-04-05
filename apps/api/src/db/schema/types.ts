/* eslint-disable ts/no-empty-object-type */

export type CoraxSuccess<T = void> = {
  success: true
  message: string
} & (T extends void ? {} : { data: T })

export type CoraxError = {
  success: false
  error: string
  isFormError?: boolean
}
