import type { CoraxError } from "@corax-monorepo/api/types"

import {
  queryOptions,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"

import { api } from ".."
import { getLocalToken } from "../auth/auth.mutation"

export const userQueryOptions = queryOptions({
  queryKey: ["user"],
  queryFn: me,
  staleTime: Infinity,
})

export function useUser() {
  useQueryClient()
  const token = getLocalToken()

  return useQuery({
    ...userQueryOptions,
    enabled: !!token,
  })
}

async function me() {
  const resp = await api.user.$get()

  if (!resp.ok)
    return null

  return await resp.json()
}

export const usersQueryOptions = queryOptions({
  queryKey: ["users"],
  queryFn: getUsers,
})

export function useUsers() {
  return useSuspenseQuery(usersQueryOptions)
}

export async function getUsers() {
  const resp = await api.user.many.$get()

  const data = await resp.json()

  if (!resp.ok) {
    throw new Error((data as unknown as CoraxError).error)
  }

  return data
}
