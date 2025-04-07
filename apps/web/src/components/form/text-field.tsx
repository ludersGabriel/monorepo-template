import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useFieldContext } from "./contexts"

export function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>()

  return (
    <div className="grid gap-3">
      <Label htmlFor={label.toLowerCase()}>{label}</Label>
      <Input name={field.name} value={field.state.value} onBlur={field.handleBlur} type="text" placeholder={label.toLowerCase()} required onChange={e => field.handleChange(e.target.value)} />
    </div>
  )
}
