import apiClient from "@corax-monorepo/api-client"

import { getLocalToken } from "./auth/auth.mutation"

const client = apiClient("", {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => {
    const token = getLocalToken()
    const headers = new Headers(init?.headers)

    if (
      init?.body
      && !(init.body instanceof FormData || init.body instanceof URLSearchParams)
      && !headers.has("Content-Type")
    ) {
      headers.set("Content-Type", "application/json")
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }

    return fetch(input, {
      ...init,
      headers,
    })
  },
})

const api = client.api.v1

export { api, client }
