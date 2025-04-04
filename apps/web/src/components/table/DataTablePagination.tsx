import type { Table } from "@tanstack/react-table"

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/web/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/web/components/ui/select"

type DataTablePaginationProps<TData> = {
  table: Table<TData>
  hasSelection?: boolean
}

export function DataTablePagination<TData>({
  table,
  hasSelection = false,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2">
      {hasSelection && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm font-medium">Selecionados</p>
          <p className="text-sm font-medium">
            {table.getFilteredSelectedRowModel().rows.length}
            {" "}
            de
            {" "}
            {table.getFilteredRowModel().rows.length}
          </p>
        </div>
      )}
      <Select
        value={`${table.getState().pagination.pageSize}`}
        onValueChange={(value) => {
          table.setPageSize(Number(value))
        }}
      >
        <SelectTrigger className="w-[60px]">
          <SelectValue
            placeholder={table.getState().pagination.pageSize}
          />
        </SelectTrigger>
        <SelectContent side="top">
          {[5, 8, 10, 15, 20, 25, 30, 40, 50].map(pageSize => (
            <SelectItem key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex flex-col items-center justify-center">
        <p className="text-sm font-medium">Página</p>
        <p className="text-sm font-medium">
          {table.getState().pagination.pageIndex + 1}
          {" "}
          de
          {" "}
          {table.getPageCount()}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          className="size-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Primeira página</span>
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          className="size-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Página anterior</span>
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          className="size-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Próxima página</span>
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          className=" size-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Última página</span>
          <ChevronsRight />
        </Button>
      </div>
    </div>
  )
}
