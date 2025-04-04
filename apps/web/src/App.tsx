import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import { Loader2Icon } from "lucide-react"

import { ErrorComponent } from "./components/CoraxError"
import CoraxNotFound from "./components/CoraxNotFound"
import { Toaster } from "./components/ui/sonner"
import { routeTree } from "./route-tree.gen"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})

// eslint-disable-next-line react-refresh/only-export-components
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: () => (
    <div className="mx-auto mt-8 flex flex-col items-center justify-center">
      <Loader2Icon className="animate-spin" />
      <p className="mt-2 text-sm">Loading...</p>
    </div>
  ),
  defaultNotFoundComponent: CoraxNotFound,
  defaultErrorComponent: ({ error }) => (
    <ErrorComponent error={error} />
  ),
  context: {
    queryClient,
  },
})

declare module "@tanstack/react-router" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
