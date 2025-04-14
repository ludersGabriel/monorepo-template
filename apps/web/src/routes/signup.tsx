import { createFileRoute, redirect } from "@tanstack/react-router"

import { authClient } from "../api/auth-client"
import { RegisterForm } from "../components/auth/register-form"

export const Route = createFileRoute("/signup")({
  component: SignupComponent,
  beforeLoad: async () => {
    const { data } = await authClient.getSession()

    if (data?.user || data?.session) {
      throw redirect({
        to: "/dashboard",
      })
    }
  },
})

function SignupComponent() {
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <RegisterForm />
    </div>
  )
}
