import { createFileRoute } from "@tanstack/react-router"

import {
  usersQueryOptions,
  useUsers,
} from "@/web/api/user/user.query"
import { Page } from "@/web/components/Page/Page"
import { UserTable } from "@/web/components/user/UserTable"

export const Route = createFileRoute("/_auth/_admin/admin-menu/manage-users/")({
  component: ManageUsers,
  beforeLoad: async ({ context }) => {
    const qc = context.queryClient

    qc.ensureQueryData(usersQueryOptions)
  },
})

function ManageUsers() {
  const { data } = useUsers()

  return (
    <Page title="Gerenciar usuários" goBack="/admin-menu">
      <UserTable users={data.data} />
    </Page>
  )
}
