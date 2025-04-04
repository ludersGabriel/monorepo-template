import type { AuthInput, CoraxError } from "@corax-monorepo/api/types"

import { api } from ".."

export const getLocalToken = () => localStorage.getItem("corax-token")
export const setLocalToken = (token: string) =>
  localStorage.setItem("corax-token", token)

export async function postLogin(input: AuthInput) {
  const resp = await api.auth.$post({ form: input })

  if (!resp.ok)
    return (await resp.json()) as unknown as CoraxError

  const ret = await resp.json()

  setLocalToken(ret.data.token)

  return ret
}

export async function logout() {
  setLocalToken("")
  window.location.reload()
}
