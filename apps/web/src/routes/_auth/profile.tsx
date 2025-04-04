import IppoProfile from "@/web/assets/ippo2.jpg"
import { createFileRoute } from "@tanstack/react-router"

import { logout } from "@/web/api/auth/auth.mutation"
import { Page } from "@/web/components/Page/Page"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/web/components/ui/avatar"
import { Button } from "@/web/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/web/components/ui/card"
import { Input } from "@/web/components/ui/input"
import { Label } from "@/web/components/ui/label"

export const Route = createFileRoute("/_auth/profile")({
  component: ProfileComponent,
})

function ProfileComponent() {
  const { user } = Route.useRouteContext()

  return (
    <Page title="Perfil">
      <Card className="size-full border-none p-0 shadow-none">
        <CardHeader className="flex items-center justify-center p-0">
          <Avatar className="size-24 border-2 border-black">
            <AvatarImage src={IppoProfile} alt="profile pick" />
            <AvatarFallback>Profile Pick</AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent className="space-y-4 px-0">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-sm text-black">Nome</Label>
            <Input value={user.name} disabled className="border-black text-black disabled:opacity-100" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="name" className="text-sm text-black">Plano</Label>
            <Input value={user.subscription?.name} disabled className="border-black text-black disabled:opacity-100" />
          </div>
          <Button onClick={logout} className="w-full">Sair</Button>
        </CardContent>
      </Card>
    </Page>
  )
}
