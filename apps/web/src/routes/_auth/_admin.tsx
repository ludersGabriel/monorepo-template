import {
  createFileRoute,
  Outlet,
  redirect,
} from "@tanstack/react-router"
import { toast } from "sonner"

export const Route = createFileRoute("/_auth/_admin")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.user.role !== "admin") {
      toast.error("Você não tem permissão para acessar essa página")

      throw redirect({
        to: "/dashboard",
      })
    }
  },
})

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  )
}
