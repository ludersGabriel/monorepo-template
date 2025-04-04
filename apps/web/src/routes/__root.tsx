import type { QueryClient } from "@tanstack/react-query"

import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import {
  createRootRouteWithContext,
  Outlet,
} from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"

type RouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
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
