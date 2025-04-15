import { useHealthCheck } from "../health"
import { sessionQueryOptions, useSession } from "./auth/auth.query"

export const API = {
  health: {
    query: {
      useHealthCheck,
    },
  },
  session: {
    query: {
      useSession,
    },
    options: {
      sessionQueryOptions,
    },
  },
}
