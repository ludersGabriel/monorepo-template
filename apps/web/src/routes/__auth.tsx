import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { toast } from "sonner"

import { authClient } from "../api/auth-client"

export const Route = createFileRoute("/__auth")({
  component: RouteComponent,
  beforeLoad: async () => {
    const resp = await authClient.getSession()

    if (resp.error || !resp.data) {
      toast.error("Não autorizado!", {
        description: "Você precisa fazer login para acessar essa página.",
      })

      throw redirect({
        to: "/",
      })
    }

    return {
      session: resp.data.session,
      user: resp.data.user,
    }
  },
})

function RouteComponent() {
  return (
    <div className="bg-red-500">
      <div>teste</div>
      <Outlet />
    </div>
  )
}
