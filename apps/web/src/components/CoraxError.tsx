import { AccordionContent } from "@radix-ui/react-accordion"
import { useQueryErrorResetBoundary } from "@tanstack/react-query"
import { Link, useRouter } from "@tanstack/react-router"
import { AlertTriangleIcon } from "lucide-react"
import { useEffect } from "react"

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Button } from "./ui/button"

export function ErrorComponent({ error }: { error: Error }) {
  const router = useRouter()
  const queryClientErrorBoundary = useQueryErrorResetBoundary()
  // eslint-disable-next-line node/no-process-env
  const isDev = process.env.NODE_ENV !== "production"

  useEffect(() => {
    queryClientErrorBoundary.reset()
  }, [queryClientErrorBoundary])

  return (
    <div className="mt-8 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Alert variant="destructive">
          <AlertTriangleIcon className="size-4" />
          <AlertTitle>Oops! Something went wrong..</AlertTitle>
          <AlertDescription>
            Sorry! But an unexpected error occurred. Please try again
            later.
          </AlertDescription>
        </Alert>
        <div className="mt-4 space-y-4">
          <Button
            className="w-full"
            onClick={() => router.invalidate()}
          >
            Try again!
          </Button>
          <Button asChild className="w-full" variant="outline">
            <Link to="/">Go to home page!</Link>
          </Button>
          {isDev
            ? (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="error-details">
                    <AccordionTrigger>
                      View error details
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="rounded-md bg-muted p-4">
                        <h3 className="mb-2 font-semibold">
                          Error message:
                        </h3>
                        <p className="mb-4 text-sm">{error.message}</p>
                        <h3 className="mb-2 font-semibold">
                          Stack trace:
                        </h3>
                        <pre className="overflow-x-auto whitespace-pre-wrap text-xs">
                          {error.stack}
                        </pre>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )
            : null}
        </div>
      </div>
    </div>
  )
}
