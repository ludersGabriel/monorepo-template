import { PlusCircleIcon } from "lucide-react"

import { Button } from "./ui/button"

export function FloatingAddButton({ ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      className="fixed bottom-24 right-4 h-fit rounded-full p-1 [&_svg]:size-8"
      aria-label="Add Post"
      variant="ghost"
      {...props}
    >
      <PlusCircleIcon />
    </Button>
  )
}
