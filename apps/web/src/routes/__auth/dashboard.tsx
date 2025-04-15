import { useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { toast } from "sonner"

import { authClient } from "@/web/api/auth-client"
import { Button } from "@/web/components/ui/button"

export const Route = createFileRoute("/__auth/dashboard")({
  component: RouteComponent,

})

function LogoutButton() {
  const router = useRouter()
  const qc = useQueryClient()

  return (
    <Button onClick={async () => {
      const { error } = await authClient.signOut()

      if (error) {
        toast.error("Falha ao fazer logout")
        return
      }

      await qc.invalidateQueries({ queryKey: ["session"], type: "all" })
      await router.invalidate()
      await router.navigate({ to: "/" })
      toast.success("Logout realizado com sucesso!")
    }}
    >
      Logout
    </Button>
  )
}

function RouteComponent() {
  const { user } = Route.useRouteContext()

  return (
    <div>
      <div>
        Hello, buddy
        {" "}
        {user.name}
        {" "}
        with id
        {" "}
        {user.id}
      </div>
      <LogoutButton />
    </div>
  )
}
