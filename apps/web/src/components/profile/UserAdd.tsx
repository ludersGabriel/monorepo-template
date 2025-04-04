import { UserPlus } from "lucide-react"
import { useState } from "react"

import { Button } from "@/web/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/web/components/ui/dialog"

import { UserAddForm } from "../user/UserAddForm"

export function UserAdd() {
  const [open, setOpen] = useState(false)

  const toggleOpen = () => setOpen(prev => !prev)

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus />
          add
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[80%] max-w-[90%] overflow-auto"
      >
        <DialogHeader>
          <DialogTitle>Adicionar aluno</DialogTitle>
          <DialogDescription>
            Adicione um novo aluno ao sistema por aqui. Preencha os
            campos e clique em adicionar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <UserAddForm toggleDialog={toggleOpen} />
      </DialogContent>
    </Dialog>
  )
}
