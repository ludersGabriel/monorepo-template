import type {
  LinkProps,
} from "@tanstack/react-router"

import homeIcon from "@/web/assets/iago/avisos.svg?react"
import pinIcon from "@/web/assets/iago/check-in.svg?react"
import menuIcon from "@/web/assets/iago/menu.svg?react"
import profileIcon from "@/web/assets/iago/perfil.svg?react"
import subscriptionIcon from "@/web/assets/iago/plan.svg?react"
import { NavigationMenuLink } from "@radix-ui/react-navigation-menu"
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router"
import React from "react"

import { userQueryOptions } from "@/web/api/user/user.query"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/web/components/ui/navigation-menu"
import { cn } from "@/web/lib/utils"

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
  beforeLoad: async ({ context, location }) => {
    const client = context.queryClient

    const data = await client.ensureQueryData(userQueryOptions)

    if (!data) {
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      })
    }

    return { user: data.data }
  },
})

const menu: {
  label: string
  url?: LinkProps["to"]
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}[] = [
  { label: "Início", url: "/dashboard", icon: homeIcon },
  { label: "Checkin", url: "/checkin", icon: pinIcon },
  { label: "Planos", url: "/plans", icon: subscriptionIcon },
  { label: "Perfil", url: "/profile", icon: profileIcon },
  { label: "Menu", url: "/admin-menu", icon: menuIcon },
  // { label: "Avaliação", url: undefined, icon: clipboardIcon },
  // { label: "Avisos", url: undefined, icon: bellIcon },
]

function AuthLayout() {
  const { pathname } = useLocation()
  const basePath = `/${pathname.split("/")[1]}`
  const { user } = Route.useRouteContext()

  return (
    <div className="grid size-full grid-rows-[1fr_auto]">
      <div className="overflow-auto p-6">
        <Outlet />
      </div>
      <NavigationMenu>
        <NavigationMenuList>
          {menu.map((item) => {
            if (user.role !== "admin" && (item.label === "Menu" || item.label === "Planos")) {
              return null
            }

            return (
              <NavigationMenuItem
                key={item.label}
              >
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "flex flex-col justify-center items-center p-2",
                  )}
                  asChild
                >
                  <Link to={item.url} className="space-y-1" preload="viewport">
                    <item.icon className={`size-7 ${item.url && basePath.includes(item.url) ? "fill-red-600" : "fill-primary"}`} />
                    <h4 className={`text-xs font-bold ${item.url && basePath.includes(item.url) ? "text-red-600" : "text-primary"}`}>
                      {item.label.toUpperCase()}
                    </h4>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
