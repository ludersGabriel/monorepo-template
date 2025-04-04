import { createFileRoute } from "@tanstack/react-router"

import { subscriptionsQueryOptions, useSubscriptions } from "@/web/api/subscription/subscription.query"
import { Page } from "@/web/components/Page/Page"

export const Route = createFileRoute("/_auth/_admin/admin-menu/manage-plans")({
  component: ManagePlans,
  beforeLoad: async ({ context }) => {
    const qc = context.queryClient

    qc.ensureQueryData(subscriptionsQueryOptions)
  },
})

function ManagePlans() {
  const { data } = useSubscriptions()

  return (
    <Page title="Gerenciar planos" goBack="/admin-menu">
      {data.data.map(plan => (
        <div key={plan.id} className="border-2 border-black p-2">
          <h1 className="text-sm font-bold">{plan.name}</h1>
          <p>{plan.benefits}</p>
        </div>
      ))}
    </Page>
  )
}
