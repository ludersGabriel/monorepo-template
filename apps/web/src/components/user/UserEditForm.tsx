import type { UserDto, UserUpdate } from "@corax-monorepo/api/types"

import { userSchemas } from "@corax-monorepo/api/schemas"
import { useForm } from "@tanstack/react-form"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"

import { updateUser } from "@/web/api/user/user.mutation"

import { userRoleEnum } from "../../../../api/src/db/schema"
import { Button } from "../ui/button"
import { DialogClose } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const roleTranslate = {
  admin: "Administrador",
  user: "Aluno",
  trainer: "Treinador",
}

type Props = {
  user: UserDto
  toggleModal: () => void
}

export function UserEditForm({ user, toggleModal }: Props) {
  const qc = useQueryClient()

  const form = useForm<UserUpdate>({
    defaultValues: user,
    validators: {
      onSubmit: userSchemas.update,
    },
    onSubmit: async ({ value }) => {
      const res = await updateUser(value)

      if (!res.success) {
        if (res.isFormError) {
          toast.error("Erro ao atualizar usuário", {
            description: res.error,
          })
          return
        }

        form.setErrorMap({
          onSubmit: res.error,
        })

        return
      }

      qc.invalidateQueries({
        queryKey: ["users"],
      })
      toggleModal()
      toast.success("Usuário atualizado com sucesso")
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <div className="grid size-full gap-4">
        <form.Field
          name="name"
          children={fieldProps => (
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input id={fieldProps.name} name={fieldProps.name} value={fieldProps.state.value} onBlur={fieldProps.handleBlur} onChange={e => fieldProps.handleChange(e.target.value)} />
            </div>
          )}
        />

        <form.Field
          name="username"
          children={fieldProps => (
            <div className="grid gap-2">
              <Label htmlFor="name">Usuário</Label>
              <Input id={fieldProps.name} name={fieldProps.name} value={fieldProps.state.value} onBlur={fieldProps.handleBlur} onChange={e => fieldProps.handleChange(e.target.value)} />
            </div>
          )}
        />

        <form.Field
          name="role"
          children={fieldProps => (
            <div className="grid gap-2">
              <Label htmlFor="name">Função</Label>
              <Select onValueChange={v => fieldProps.handleChange(v as "user" | "trainer" | "admin")} value={fieldProps.state.value} required>
                <SelectTrigger>
                  <SelectValue defaultChecked defaultValue={user.role} />
                </SelectTrigger>
                <SelectContent>
                  {userRoleEnum.enumValues.map(role => (
                    <SelectItem key={role} value={role}>
                      {roleTranslate[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />

        <form.Field
          name="userSubscription.startDate"
          children={fieldProps => (
            <div className="grid gap-2">
              <Label htmlFor="name">Inicio da Matricula</Label>
              <Input
                id={fieldProps.name}
                name={fieldProps.name}
                type="date"
                value={fieldProps.state.value ?? ""}
                onBlur={fieldProps.handleBlur}
                onChange={e => fieldProps.handleChange(e.target.value)}
              />
            </div>
          )}
        />

        <form.Subscribe
          selector={state => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <div className="grid grid-cols-2 gap-4 ">
              <DialogClose asChild>
                <Button variant="destructive">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? <Loader2Icon /> : "Salvar"}
              </Button>
            </div>
          )}
        />
      </div>
    </form>
  )
}
