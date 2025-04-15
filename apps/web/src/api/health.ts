import type { CoraxError } from "@corax-monorepo/api/types"

import { useQuery } from "@tanstack/react-query"

import { api } from "."

export function useHealthCheck() {
  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const resp = await api.$get()

      const data = await resp.json()

      if (!resp.ok) {
        throw new Error((data as unknown as CoraxError).error)
      }

      return data
    },
    refetchOnWindowFocus: false,
    retry: false,
  })
}
