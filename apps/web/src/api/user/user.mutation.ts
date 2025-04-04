import type { CoraxError, UserInfoInput, UserInput, UserUpdate } from "@corax-monorepo/api/types"

import { api } from ".."

export async function createUser(input: UserInput) {
  const res = await api.user.$post({
    form: {
      ...input,
      branchId: input.branchId.toString(),
    },
  })

  if (!res.ok) {
    const data = (await res.json()) as unknown as CoraxError
    return data
  }

  return await res.json()
}

export async function updateUser(input: UserUpdate) {
  const res = await api.user.update.$post({
    json: input,
  })

  if (!res.ok) {
    const data = (await res.json()) as unknown as CoraxError
    return data
  }

  return await res.json()
}

export async function upsertUserInfo(input: UserInfoInput) {
  const res = await api.user["user-info"].$post({
    json: input,
  })

  if (!res.ok) {
    const data = (await res.json()) as unknown as CoraxError
    return data
  }

  return await res.json()
}
