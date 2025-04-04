import type {
  CheckinInput,
  CoraxError,
  SubscriptionInput,
} from "@corax-monorepo/api/types"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { api } from ".."

export async function createSubscription(input: SubscriptionInput) {
  const res = await api.subscription.$post({
    json: input,
  })

  if (!res.ok) {
    const data = (await res.json()) as unknown as CoraxError
    return data
  }

  return await res.json()
}

export function useCheckin() {
  const qc = useQueryClient()

  return useMutation({
    mutationKey: ["checkin"],
    mutationFn: async (input: CheckinInput["subscriptionId"]) => {
      const res = await api.subscription[":id"].checkin.$post({
        param: {
          id: input.toString(),
        },
      })

      if (!res.ok) {
        const data = (await res.json()) as unknown as CoraxError

        throw new Error(data.error)
      }

      return await res.json()
    },
    onSuccess: () => {
      toast.success("Checkin realizado com sucesso!")

      qc.invalidateQueries({
        queryKey: ["checkin"],
      })
    },
    onError: (error) => {
      toast.error("Falha ao realizar checkin", {
        description: error.message,
      })
    },
  })
}
