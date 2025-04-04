import type { PostForm } from "@corax-monorepo/api/types"

import { useForm } from "@tanstack/react-form"
import { useQueryClient } from "@tanstack/react-query"
import { ImagePlus, Loader2Icon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { createPost } from "@/web/api/post/post.mutation"
import { downscaleImageToFile } from "@/web/lib/utils"

import { postSchemas } from "../../../../api/src/db/schema/zod/post.zod"
import { CoraxFieldInfo } from "../CoraxFieldInfo"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"

const defaultValues: PostForm = {
  title: "",
  body: "",
  content: new File([], "placeholder"),
}

type Props = {
  onSuccessfulSubmit?: () => void
}

export function PostFormComponent({ onSuccessfulSubmit }: Props) {
  const qc = useQueryClient()
  const [imgPreview, setImgPreview] = useState<string | null>(null)

  const form = useForm<PostForm>({
    defaultValues,
    validators: {
      onSubmit: postSchemas.form,
    },
    onSubmit: async ({ value }) => {
      if (value.content.size === 0) {
        toast.error("Falha ao criar post", {
          description: "Imagem não pode ser vazia",
        })

        return
      }

      const res = await createPost(value)

      if (!res.success) {
        if (!res.isFormError) {
          toast.error("Falha ao criar post", {
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
      setImgPreview(null)
      qc.invalidateQueries({
        queryKey: ["posts"],
      })

      if (onSuccessfulSubmit)
        onSuccessfulSubmit()

      toast.success("Post criado com sucesso")
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="mb-4 flex flex-col space-y-4"
    >

      <div className="flex items-center justify-center space-x-4 ">
        <form.Field
          name="title"
          children={fieldProps => (
            <div className="grow">

              <Input
                id="title"
                name="title"
                onChange={e => fieldProps.handleChange(e.target.value)}
                value={fieldProps.state.value}
                onBlur={fieldProps.handleBlur}
                type="text"
                placeholder="Título"
              />
            </div>
          )}
        />

        <form.Field
          name="content"
          children={fieldProps => (
            <div className="shrink-0">
              <Input
                id="picture"
                type="file"
                className="sr-only"
                accept=".png, .jpg, .jpeg"
                onChange={async (e) => {
                  const file = e.target.files?.[0]

                  if (!file)
                    return

                  const { preview, file: downscaledImage } = await downscaleImageToFile(file, 500, 500)

                  setImgPreview(preview)

                  return fieldProps.handleChange(downscaledImage)
                }}
              />
              <Label
                htmlFor="picture"
                className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <ImagePlus className="size-5" />
              </Label>
              <CoraxFieldInfo field={fieldProps} />
            </div>
          )}
        />
      </div>

      {imgPreview && (
        <img src={imgPreview || "/placeholder.svg"} alt="Preview" className="max-w-full rounded-md" />
      )}

      <form.Field
        name="body"
        children={fieldProps => (
          <Textarea
            id="body"
            name="body"
            value={fieldProps.state.value}
            onChange={e => fieldProps.handleChange(e.target.value)}
            onBlur={fieldProps.handleBlur}
            placeholder="Corpo"
            rows={10}
          />
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
        selector={state => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit}>
            {isSubmitting ? <Loader2Icon className="animate-spin" /> : "Postar"}
          </Button>
        )}
      />
    </form>
  )
}
