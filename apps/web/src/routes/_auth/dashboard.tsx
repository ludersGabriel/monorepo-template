import {
  createFileRoute,
} from "@tanstack/react-router"
import { useState } from "react"

import { postQueryOptions, usePosts } from "@/web/api/post/post.query"
import { FloatingAddButton } from "@/web/components/FloatingAddButton"
import { Page } from "@/web/components/Page/Page"
import { Post } from "@/web/components/post/Post"
import { PostFormComponent } from "@/web/components/post/PostForm"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/web/components/ui/dialog"

export const Route = createFileRoute("/_auth/dashboard")({
  component: Dashboard,
  beforeLoad: async ({ context }) => {
    const { queryClient } = context

    queryClient.ensureQueryData(postQueryOptions)
  },
})

export default function Dashboard() {
  const { user } = Route.useRouteContext()
  const { data } = usePosts()
  const [open, setOpen] = useState(false)

  const toggleDialog = () => setOpen(!open)

  return (
    <Page title="Feed de notícias">

      {user.role === "admin" && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <FloatingAddButton />
          </DialogTrigger>
          <DialogContent
            className="max-h-[80%] max-w-[90%] overflow-y-auto rounded-md"
            aria-describedby={undefined}

          >
            <DialogHeader>
              <DialogTitle className="text-left">Adicionar Post</DialogTitle>
            </DialogHeader>
            <PostFormComponent onSuccessfulSubmit={toggleDialog} />
          </DialogContent>
        </Dialog>
      )}

      {
        data?.data.length === 0 && (
          <h1 className="text-center text-sm font-bold">
            Não há posts disponíveis no momento.
          </h1>
        )
      }

      <div className="flex flex-col items-center space-y-4">
        {data?.data.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </Page>
  )
}
