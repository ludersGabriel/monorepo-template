import { createFormHook } from "@tanstack/react-form"

import { fieldContext, formContext } from "./contexts"
import { PasswordField } from "./password-field"
import { SubmitButton } from "./submit-button"
import { TextField } from "./text-field"

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, PasswordField },
  formComponents: { SubmitButton },
})

export const useCoraxForm = useAppForm
