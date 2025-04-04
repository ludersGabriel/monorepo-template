import type { ContentModel } from "@corax-monorepo/api/types"

import { getLocalToken } from "../auth/auth.mutation"

export function getContentUrl(id: ContentModel["id"]) {
  const url = `/api/v1/content/download/${id}?token=${getLocalToken() ?? ""}`

  return url
}
