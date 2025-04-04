import { z } from "zod"

import type { UserInput, UserSubscriptionInput } from "../db/schema/types"

import { userSchemas, userSubscriptionSchemas } from "../db/schema/zod"

const users: UserInput[] = []
const userPlans: UserSubscriptionInput[] = []

const filePontagrossa = await Bun.file("./nomes-pontagrossa.csv").text()
const fileMatinhos = await Bun.file("./nomes-matinhos.csv").text()

const files = [
  filePontagrossa,
  fileMatinhos,
]

let counter: number = 1

const line = z.object({
  acadNumber: z.coerce.number(),
  acadName: z.string(),
})

for (const file of files) {
  for (const lineStr of file.split("\n")) {
    try {
      const values = lineStr.split(",")
      const parsed = line.parse({
        acadNumber: values[0],
        acadName: values[1],
      })

      const firstName = parsed.acadName.split(" ")[0].toLowerCase()

      const user: UserInput = {
        branchId: 1,
        name: parsed.acadName,
        username: firstName + counter,
        role: "user",
        password: `${firstName + counter}@mudar`,
      }

      const userPlan: UserSubscriptionInput = {
        subscriptionId: 1,
        userId: counter,
      }

      users.push(user)
      userPlans.push(userPlan)
      counter = counter + 1
    }
    catch (e) {
      console.error(e)
    }
  }
}

userSchemas.input.array().parse(users)
userSubscriptionSchemas.input.array().parse(userPlans)

const json = JSON.stringify(users, null, 2)
const file = Bun.file("./users.json")
await file.write(json)

const jsonPlans = JSON.stringify(userPlans, null, 2)
const filePlans = Bun.file("./user-plans.json")
await filePlans.write(jsonPlans)
