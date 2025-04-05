import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"

import { authClient } from "../api/auth-client"
import { useHealthCheck } from "../api/health"
import { LoginForm } from "../components/login-form"
import { ModeToggle } from "../components/mode-toggle"

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  const { data: session } = authClient.useSession()
  const { data: healthCheck } = useHealthCheck()

  useEffect(() => {
    console.log(session)
    console.log(healthCheck)
  }, [session, healthCheck])

  return (
    <div className="flex size-full items-center flex-col justify-center gap-2">
      <div className="flex items-center gap-2">
        <div>change theme</div>
        <ModeToggle />
      </div>

      <LoginForm />
    </div>
  )
}
