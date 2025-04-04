import type { Column } from "@tanstack/react-table"

import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  EyeOff,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/web/components/ui/dropdown-menu"
import { cn } from "@/web/lib/utils"

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>
  title: string
} & React.HTMLAttributes<HTMLDivElement>

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  const handleSort = (sort: "asc" | "desc") => {
    const current = column.getIsSorted()
    const shouldSort = sort !== "asc"

    if (current === sort) {
      return column.clearSorting()
    }

    column.toggleSorting(shouldSort)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="grid w-full min-w-28 grid-cols-[auto_auto] items-center justify-start gap-1 text-left hover:bg-transparent hover:text-primary hover:shadow-none data-[state=open]:text-primary [&>[role=checkbox]]:min-w-0">
        {title}
        {column.getIsSorted() === "desc"
          ? (
              <ArrowDown size={16} />
            )
          : column.getIsSorted() === "asc"
            ? (
                <ArrowUp size={16} />
              )
            : (
                <ChevronsUpDown size={16} />
              )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => handleSort("asc")}>
          <ArrowUp className="size-3.5 text-muted-foreground/70" />
          Cresc
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSort("desc")}>
          <ArrowDown className="size-3.5 text-muted-foreground/70" />
          Decr
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => column.toggleVisibility(false)}
        >
          <EyeOff className="size-3.5 text-muted-foreground/70" />
          Esconder
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
