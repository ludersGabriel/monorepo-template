import { createFileRoute, redirect } from "@tanstack/react-router"

import { RegisterForm } from "../components/auth/register-form"

export const Route = createFileRoute("/signup")({
  beforeLoad: async ({ context }) => {
    const { session, user } = context

    if (session || user) {
      throw redirect({
        to: "/dashboard",
      })
    }
  },
  component: SignupComponent,
})

function SignupComponent() {
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <RegisterForm />
    </div>
  )
}
