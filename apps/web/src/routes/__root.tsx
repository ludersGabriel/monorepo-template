import type { QueryClient } from "@tanstack/react-query"

import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import {
  createRootRouteWithContext,
  Outlet,
} from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

import { API } from "../api/routes"

type RouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }) => {
    const { queryClient } = context

    // Preload the session data
    const data = await queryClient.ensureQueryData(API.session.options.sessionQueryOptions)

    return {
      session: data.data?.session ?? null,
      user: data.data?.user ?? null,
    }
  },
  component: RootComponent,
})

function RootComponent() {
  const isDev = false
  return (
    <>
      <main className="h-screen w-screen">
        <Outlet />
      </main>
      {isDev && (
        <>
          <TanStackRouterDevtools
            position="bottom-left"
            initialIsOpen={false}
          />
          <ReactQueryDevtools />
        </>
      )}
    </>
  )
}
