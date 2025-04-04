import type { CoraxError } from "@corax-monorepo/api/types"

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

import { api } from ".."

export const postQueryOptions = queryOptions({
  queryKey: ["posts"],
  queryFn: getPosts,
})

export function usePosts() {
  return useSuspenseQuery(postQueryOptions)
}

export async function getPosts() {
  const resp = await api.post.$get()

  const data = await resp.json()

  if (!resp.ok) {
    throw new Error((data as unknown as CoraxError).error)
  }

  return data
}
