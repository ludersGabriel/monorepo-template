import { createFileRoute, useRouter } from "@tanstack/react-router"
import { toast } from "sonner"

import { authClient } from "@/web/api/auth-client"
import { Button } from "@/web/components/ui/button"

export const Route = createFileRoute("/__auth/dashboard")({
  component: RouteComponent,

})

function LogoutButton() {
  const router = useRouter()

  return (
    <Button onClick={async () => {
      await authClient.signOut()
      await router.navigate({ to: "/" })
      await router.invalidate()
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
