import type { FieldApi } from "@tanstack/react-form"

export function CoraxFieldInfo({
  field,
}: {
  field: FieldApi<any, any, any, any>
}) {
  return (
    <>
      {field.state.meta.errors.length > 0
        ? (
            <p className="text-[0.8rem] font-medium text-destructive">
              {field.state.meta.errors.join(", ")}
            </p>
          )
        : null}
    </>
  )
}
