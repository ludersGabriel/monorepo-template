import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/__auth")({
  beforeLoad: async ({ context }) => {
    const { session, user } = context

    if (!session || !user) {
      throw redirect({
        to: "/",
      })
    }

    return {
      session,
      user,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-red-500">
      <div>teste</div>
      <Outlet />
    </div>
  )
}
