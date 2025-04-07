import { Button } from "../ui/button"
import { useFormContext } from "./contexts"

export function SubmitButton({ label }: { label: string }) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={state => state.isSubmitting}>
      {isSubmitting => <Button type="submit" disabled={isSubmitting}>{label}</Button>}
    </form.Subscribe>
  )
}
