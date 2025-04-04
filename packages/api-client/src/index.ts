import type { AppType } from "@corax-monorepo/api/routes"

import { hc } from "hono/client"

// create instance to inline type in build
// https://hono.dev/docs/guides/rpc#compile-your-code-before-using-it-recommended
// eslint-disable-next-line unused-imports/no-unused-vars
const client = hc<AppType>("")
export type Client = typeof client

export default (...args: Parameters<typeof hc>): Client =>
  hc<AppType>(...args)
