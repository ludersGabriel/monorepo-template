import type db from ".."
import type { BranchInput } from "../schema/types"

import { branchTable } from "../schema"
import { branchSchemas } from "../schema/zod/branch.zod"

export default async function seed(db: db) {
  await db
    .insert(branchTable)
    // eslint-disable-next-line ts/no-use-before-define
    .values(branchSchemas.input.array().parse(branchData))
}

const branchData: BranchInput[] = [
  {
    id: 1,
    name: "Escola de boxe Matinhos",
  },
  {
    id: 2,
    name: "Escola de boxe Curitiba",
  },
  {
    id: 3,
    name: "Escola de boxe Ponta Grossa",
  },
]
