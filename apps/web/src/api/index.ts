import apiClient from "@corax-monorepo/api-client"

const client = apiClient("", {
  fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
    // const token = getLocalToken()
    const headers = new Headers(init?.headers)

    if (
      init?.body
      && !(init.body instanceof FormData || init.body instanceof URLSearchParams)
      && !headers.has("Content-Type")
    ) {
      headers.set("Content-Type", "application/json")
    }

    return fetch(input, {
      ...init,
      headers,
      credentials: "include",
    })
  },
})

const api = client.api.v1

export { api, client }
