import type { UserDto, UserInfoInput } from "@corax-monorepo/api/types"

import { userInfoSchemas } from "@corax-monorepo/api/schemas"
import { useForm } from "@tanstack/react-form"
import { useQueryClient } from "@tanstack/react-query"
import { formatToCPF } from "brazilian-values"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"

import { upsertUserInfo } from "@/web/api/user/user.mutation"

import { Button } from "../ui/button"
import { DialogClose } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

type Props = {
  user: UserDto
  toggleModal: () => void
}

export function UserInfoForm({ user, toggleModal }: Props) {
  const qc = useQueryClient()
  const personalInfo = user.userInfo

  const form = useForm<UserInfoInput>({
    defaultValues: {
      ...personalInfo,
      userId: user.id,
    },
    validators: {
      onSubmit: userInfoSchemas.input,
    },
    onSubmit: async ({ value }) => {
      const res = await upsertUserInfo(value)

      if (!res.success) {
        if (res.isFormError) {
          toast.error("Erro ao atualizar informações", {
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

      qc.invalidateQueries({
        queryKey: ["user", user.id],
      })

      toggleModal()
      toast.success("Informações atualizadas com sucesso")
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
          name="cpf"
          children={fieldProps => (
            <div className="grid gap-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id={fieldProps.name}
                name={fieldProps.name}
                value={fieldProps.state.value ? formatToCPF(fieldProps.state.value) : ""}
                onBlur={fieldProps.handleBlur}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, "") // Remove non-numeric characters
                  fieldProps.handleChange(rawValue) // Store the raw value in the form state
                }}
              />
            </div>
          )}
        />

        <form.Field
          name="city"
          children={fieldProps => (
            <div className="grid gap-2">
              <Label htmlFor="city">Cidade</Label>
              <Select onValueChange={fieldProps.handleChange} value={fieldProps.state.value ?? ""} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Curitiba">Curitiba</SelectItem>
                  <SelectItem value="Ponta Grossa">Ponta Grossa</SelectItem>
                  <SelectItem value="Matinhos">Matinhos</SelectItem>
                </SelectContent>
              </Select>
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
