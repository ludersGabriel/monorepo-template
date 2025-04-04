import type { CoraxError, SubscriptionModel } from "@corax-monorepo/api/types"

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

import { api } from ".."

export const subscriptionsQueryOptions = queryOptions({
  queryKey: ["subscriptions"],
  queryFn: getSubscriptions,
})

export function useSubscriptions() {
  return useSuspenseQuery(subscriptionsQueryOptions)
}

export async function getSubscriptions() {
  const resp = await api.subscription.$get()

  const data = await resp.json()

  if (!resp.ok) {
    throw new Error((data as unknown as CoraxError).error)
  }

  return data
}

export const checkinQueryOptions = (id: SubscriptionModel["id"]) => queryOptions({
  queryKey: ["checkin", id],
  queryFn: () => getCheckin(id),
})

export function useGetCheckin(id: SubscriptionModel["id"]) {
  return useSuspenseQuery(checkinQueryOptions(id))
}

export async function getCheckin(subscriptionId: number) {
  const resp = await api.subscription[":id"].checkin.$get({
    param: {
      id: subscriptionId.toString(),
    },
  })

  const data = await resp.json()

  if (!resp.ok) {
    throw new Error((data as unknown as CoraxError).error)
  }

  return data
}
