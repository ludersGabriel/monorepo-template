import type { PostDto } from "@corax-monorepo/api/types"

import { getContentUrl } from "@/web/api/content/content.query"
import {
  Card,
  CardContent,
} from "@/web/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/web/components/ui/dialog"
import { datetimeToLocale, truncateString } from "@/web/lib/utils"

type Props = {
  post: PostDto
}

function PostTrigger({ post, ...props }: Props & React.HTMLAttributes<HTMLDivElement>) {
  const downloadUrl = getContentUrl(post.image || "")

  return (
    <div {...props}>
      <img
        loading="lazy"
        src={downloadUrl}
        alt="Happy New Year with eucalyptus leaves"
        className="h-44 w-full cursor-pointer object-cover"
      />

      <div className="space-y-2 p-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          {truncateString(post.title, 20)}
        </h2>
        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
          {truncateString(post.body, 40)}
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          {datetimeToLocale(post.createdAt)}
        </p>
      </div>
    </div>
  )
}

export function Post({ post }: Props) {
  const downloadUrl = getContentUrl(post.image || "")

  return (
    <Card className="group w-full max-w-lg overflow-hidden">
      <CardContent className="p-0">
        <Dialog>
          <DialogTrigger asChild>
            <PostTrigger post={post} />
          </DialogTrigger>
          <DialogContent aria-describedby={undefined} className="flex max-h-[80%] w-[90%] flex-col overflow-auto rounded-md">
            <DialogHeader>
              <DialogTitle className="mb-2 text-left">{post.title}</DialogTitle>
              <img
                src={downloadUrl}
                alt="Expanded view"
                className="rounded-md"
              />
            </DialogHeader>
            <div className="space-y-2">
              <h1 className="font-bold">
                {datetimeToLocale(post.createdAt)}
              </h1>
              <p className="whitespace-pre-wrap text-left text-sm text-muted-foreground">
                {post.body}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
