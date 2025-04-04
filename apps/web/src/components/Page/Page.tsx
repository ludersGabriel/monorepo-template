import type { LinkProps } from "@tanstack/react-router"

import VoltarIcon from "@/web/assets/iago/seta-voltar.svg?react"
import { Link } from "@tanstack/react-router"

import { Button } from "../ui/button"

type Props = {
  children: React.ReactNode
  title: string
  goBack?: LinkProps["to"]
}

export function Page({ children, title, goBack }: Props) {
  return (
    <div className="grid size-full grid-rows-[auto_1fr] space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-bold">{title.toUpperCase()}</h1>
        {goBack && (
          <Button variant="outline" asChild>
            <Link
              to={goBack}
            >
              <VoltarIcon className="size-6 fill-primary" />
            </Link>
          </Button>
        )}
      </div>
      <div className="size-full">
        {children}
      </div>
    </div>
  )
}
