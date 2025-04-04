import type db from ".."
import type { SubscriptionInput } from "../schema/types"

import { subscriptionTable } from "../schema"
import { subscriptionSchemas } from "../schema/zod"

export default async function seed(db: db) {
  await db
    .insert(subscriptionTable)
    // eslint-disable-next-line ts/no-use-before-define
    .values(subscriptionSchemas.input.array().parse(subscriptionData))
}

const subscriptionData: SubscriptionInput[] = [
  {
    name: "Padrão",
    branchId: 1,
    benefits: "Acesso padrão",
    price: "9.99",
    monthlyClasses: 30,
  },
]
