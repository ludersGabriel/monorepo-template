import type {
  UserInput,
} from "@corax-monorepo/api/types"
import type { ZodValidator } from "@tanstack/zod-form-adapter"

import { userSchemas } from "@corax-monorepo/api/schemas"
import {
  standardSchemaValidator,
  useForm,
} from "@tanstack/react-form"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"

import { createUser } from "@/web/api/user/user.mutation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/web/components/ui/select"

import { userRoleEnum } from "../../../../api/src/db/schema"
import { CoraxFieldInfo } from "../CoraxFieldInfo"
import { Button } from "../ui/button"
import { DialogClose } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

const roleTranslate = {
  admin: "Administrador",
  user: "Aluno",
  trainer: "Treinador",
}

const defaultValues: UserInput = {
  username: "",
  password: "",
  name: "",
  branchId: 1,
  role: "user",
}

type Field = {
  name: keyof UserInput
  label: string
  type: string
  placeholder: string
}

const fields: Field[] = [
  { name: "name", label: "Nome", type: "text", placeholder: "Nome" },
  {
    name: "username",
    label: "Usuário",
    type: "text",
    placeholder: "Usuário",
  },
  {
    name: "password",
    label: "Senha",
    type: "password",
    placeholder: "Senha",
  },
  {
    name: "role",
    label: "Função do usuário",
    type: "select",
    placeholder: "Selecione a função do usuário",
  },
]

type Props = {
  toggleDialog: () => void
}

export function UserAddForm({ toggleDialog }: Props) {
  const qc = useQueryClient()

  const form = useForm<UserInput, ZodValidator>({
    defaultValues,
    validatorAdapter: standardSchemaValidator(),
    validators: {
      onSubmit: userSchemas.input,
    },
    onSubmit: async ({ value }) => {
      const res = await createUser(value)

      if (!res.success) {
        if (res.isFormError) {
          toast.error("Falha ao cadastrar usuário", {
            description: res.error,
          })
          return
        }

        form.setErrorMap({
          onSubmit: res.error,
        })

        return
      }

      form.reset()
      qc.invalidateQueries({
        queryKey: ["users"],
      })

      toggleDialog()
      toast.success("Usuário cadastrado com sucesso")
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <div className="grid gap-4">
        {fields.map(field => (
          <form.Field
            key={field.name}
            name={field.name}
            children={(fieldProps) => {
              if (field.name === "role") {
                return (
                  <div className="grid gap-2">
                    <Label htmlFor={fieldProps.name}>{field.label}</Label>
                    <Select onValueChange={fieldProps.handleChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder={field.placeholder} />
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
                )
              }

              return (
                <div className="grid gap-2">
                  <Label htmlFor={fieldProps.name}>{field.label}</Label>
                  <Input
                    id={fieldProps.name}
                    name={fieldProps.name}
                    value={fieldProps.state.value}
                    onBlur={fieldProps.handleBlur}
                    onChange={e =>
                      fieldProps.handleChange(
                        field.type === "number"
                          ? Number(e.target.value)
                          : e.target.value,
                      )}
                    type={field.type}
                    placeholder={field.placeholder}
                  />
                  <CoraxFieldInfo field={fieldProps} />
                </div>
              )
            }}
          />
        ))}

        <form.Subscribe
          selector={state => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <div className="grid grid-cols-2 gap-4 ">
              <DialogClose asChild>
                <Button variant="destructive">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? <Loader2Icon /> : "Adicionar"}
              </Button>
            </div>
          )}
        />
      </div>
    </form>
  )
}
