import { createFileRoute, redirect } from "@tanstack/react-router"

import { LoginForm } from "../components/auth/login-form"

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    const { session, user } = context

    if (session || user) {
      throw redirect({
        to: "/dashboard",
      })
    }
  },
  component: Home,
})

function Home() {
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <LoginForm />
    </div>
  )
}
