import type { CoraxError, PostForm } from "@corax-monorepo/api/types"

import { api } from ".."

export async function createPost(input: PostForm) {
  const res = await api.post.$post({
    form: input,
  })

  if (!res.ok) {
    const data = (await res.json()) as unknown as CoraxError
    return data
  }

  return await res.json()
}
