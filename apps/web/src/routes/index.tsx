import { createFileRoute, redirect } from "@tanstack/react-router"

import { authClient } from "../api/auth-client"
import { LoginForm } from "../components/auth/login-form"

export const Route = createFileRoute("/")({
  component: Home,
  beforeLoad: async () => {
    const { data, error } = await authClient.getSession()

    if (data?.user || data?.session || error) {
      throw redirect({
        to: "/dashboard",
      })
    }
  },
})

function Home() {
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <LoginForm />
    </div>
  )
}
