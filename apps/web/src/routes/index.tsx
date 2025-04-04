import type { AuthInput } from "@corax-monorepo/api/types"
import type { ZodValidator } from "@tanstack/zod-form-adapter"

import {
  authInputSchema,
} from "@corax-monorepo/api/schemas"
import {
  standardSchemaValidator,
  useForm,
} from "@tanstack/react-form"
import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router"
import { toast } from "sonner"

import { postLogin } from "@/web/api/auth/auth.mutation"
import { userQueryOptions } from "@/web/api/user/user.query"
import { CoraxFieldInfo } from "@/web/components/CoraxFieldInfo"
import { Button } from "@/web/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/web/components/ui/card"
import { Input } from "@/web/components/ui/input"
import { Label } from "@/web/components/ui/label"

import logo from "../assets/escola/logo.svg"

export const Route = createFileRoute("/")({
  component: Home,
  beforeLoad: async ({ context }) => {
    const client = context.queryClient

    const data = await client.ensureQueryData(userQueryOptions)

    if (data) {
      throw redirect({
        to: "/dashboard",
      })
    }
  },
})

function Home() {
  const navigate = useNavigate()
  const router = useRouter()
  const { queryClient } = Route.useRouteContext()

  const form = useForm<AuthInput, ZodValidator>({
    defaultValues: {
      username: "",
      password: "",
    },
    validatorAdapter: standardSchemaValidator(),
    validators: {
      onSubmit: authInputSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await postLogin(value)

      if (res.success) {
        await queryClient.invalidateQueries({
          queryKey: userQueryOptions.queryKey,
          type: "all",
        })

        await router.invalidate()

        await navigate({ to: "/dashboard" })
        toast.success("Login realizado com sucesso")
        return null
      }
      else {
        if (!res.isFormError) {
          toast.error("Falha ao realizar login", {
            description: res.error,
          })
        }
        form.setErrorMap({
          onSubmit: res.isFormError ? res.error : "Unexpected error",
        })
      }
    },
  })

  return (
    <div className="flex size-full items-center justify-center ">
      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <CardHeader>
            <CardTitle className="flex flex-col items-center align-middle">
              <img src={logo} alt="logo" className="size-60" />
              <h1 className="self-start text-2xl ">Login</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <form.Field
                name="username"
                children={field => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Matrícula</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      autoCapitalize="off"
                      onChange={e =>
                        field.handleChange(e.target.value)}
                      placeholder="Matrícula"
                    />
                    <CoraxFieldInfo field={field} />
                  </div>
                )}
              />

              <form.Field
                name="password"
                children={field => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Senha</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e =>
                        field.handleChange(e.target.value)}
                      type="password"
                      placeholder="Senha"
                    />
                    <CoraxFieldInfo field={field} />
                  </div>
                )}
              />

              <form.Subscribe
                selector={state => [state.errorMap]}
                children={([errorMap]) =>
                  errorMap.onSubmit
                    ? (
                        <p className="text-[0.8rem] font-medium text-destructive">
                          {errorMap.onSubmit?.toString()}
                        </p>
                      )
                    : null}
              />

              <form.Subscribe
                selector={state => [
                  state.canSubmit,
                  state.isSubmitting,
                ]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full"
                  >
                    {isSubmitting ? "..." : "Logar"}
                  </Button>
                )}
              />
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
