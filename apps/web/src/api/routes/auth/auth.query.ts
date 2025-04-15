import { queryOptions, useQuery } from "@tanstack/react-query"

import { authClient } from "../../auth-client"

export const sessionQueryOptions = queryOptions({
  queryKey: ["session"],
  queryFn: getSession,
})

function getSession() {
  return authClient.getSession()
}

export const useSession = () => {
  return useQuery(sessionQueryOptions)
}
