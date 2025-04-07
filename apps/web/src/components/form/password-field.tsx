import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useFieldContext } from "./contexts"

export function PasswordField({ label, showForgot = false }: { label: string, showForgot?: boolean }) {
  const field = useFieldContext<string>()

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <Label htmlFor={label.toLowerCase()}>{label}</Label>
        {showForgot && (
          <a
            href="#"
            className="ml-auto text-sm underline-offset-2 hover:underline"
          >
            Esqueceu a senha?
          </a>
        )}
      </div>
      <Input name={field.name} value={field.state.value} onBlur={field.handleBlur} type="password" placeholder="*******" required onChange={e => field.handleChange(e.target.value)} />
    </div>
  )
}
