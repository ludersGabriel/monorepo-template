import ProfileIcon from "@/web/assets/iago/perfil.svg?react"
import SubscriptionIcon from "@/web/assets/iago/plan.svg?react"
import { createFileRoute, Link } from "@tanstack/react-router"

import { buttonVariants } from "@/web/components/ui/button"
import { Card, CardContent } from "@/web/components/ui/card"
import { cn } from "@/web/lib/utils"

export const Route = createFileRoute("/_auth/_admin/admin-menu/")({
  component: AdminMenu,
})

function AdminCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="">
      <CardContent className="p-0">
        {children}
      </CardContent>
    </Card>
  )
}

const linkClass = cn(buttonVariants({ variant: "ghost" }), "flex size-full items-center justify-normal gap-2 [&_svg]:size-6 border-2 border-black rounded-md")

function AdminMenu() {
  return (
    <div className="flex size-full flex-col space-y-2">
      <h1 className="text-base font-bold">MENU DE ADMINISTRAÇÃO</h1>
      <ul className="flex flex-col gap-4">
        <li>
          <AdminCard>
            <Link to="/admin-menu/manage-users" className={linkClass} preload="viewport">
              <ProfileIcon className="fill-primary" />
              <h1 className="text-sm font-bold">GERENCIAR USUÁRIOS</h1>
            </Link>
          </AdminCard>
        </li>
        <li>
          <AdminCard>
            <Link to="/admin-menu/manage-plans" className={linkClass} preload="viewport">
              <SubscriptionIcon className="fill-primary" />
              <h1 className="text-sm font-bold">GERENCIAR PLANOS</h1>
            </Link>
          </AdminCard>
        </li>
      </ul>
    </div>
  )
}
