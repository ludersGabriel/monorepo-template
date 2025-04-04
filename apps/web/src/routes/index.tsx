import { createFileRoute } from "@tanstack/react-router"

import { ModeToggle } from "../components/mode-toggle"

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  return (
    <div className="flex size-full items-center justify-center gap-2">
      <div>change theme</div>
      <ModeToggle />
    </div>
  )
}
