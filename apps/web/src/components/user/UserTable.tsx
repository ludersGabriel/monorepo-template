"use client"

import type { UserDto } from "@corax-monorepo/api/types"
import type {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { formatToCPF } from "brazilian-values"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"

import { UserAdd } from "../profile/UserAdd"
import { DataTableColumnHeader } from "../table/ColumnHeader"
import { DataTableViewOptions } from "../table/DataTableColumnToggle"
import { DataTablePagination } from "../table/DataTablePagination"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Input } from "../ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { UserInfoForm } from "./PersonalInfo"
import { UserEditForm } from "./UserEditForm"

type Props = {
  users: UserDto[]
}

const roleTranslate = {
  admin: "Administrador",
  user: "Aluno",
  trainer: "Treinador",
}

const userColumns: ColumnDef<UserDto>[] = [
  {
    id: "nome",
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Nome" />
    },
  },
  {
    id: "usuário",
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Usuário" />
    ),
  },
  {
    id: "função",
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Função" />
    ),
    cell: ({ cell }) => {
      return roleTranslate[
        cell.getValue<string>() as keyof typeof roleTranslate
      ]
    },
  },
  {
    id: "cidade",
    accessorFn: row => row.userInfo?.city ?? "-",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Cidade" />
    },
  },
  {
    id: "cpf",
    accessorFn: row => row.userInfo?.cpf ?? "-",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="CPF" />
    },
    cell: ({ cell }) => {
      return formatToCPF(cell.getValue<string>()) ?? "-"
    },
  },
  {
    id: "matricula",
    accessorFn: row => row.subscription?.name ?? "-",
    accessorKey: "subscription.name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Matrícula" />
    },
    cell: ({ cell }) => {
      return cell.getValue<string>() ?? "-"
    },
  },
  {
    id: "matriculado",
    accessorFn: row => row.userSubscription?.startDate ?? "-",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Início da Matrícula" />
    },
    cell: ({ cell }) => {
      const dateStr = cell.getValue<string>()
      if (dateStr === "-")
        return "-"

      // Extract YYYY, MM, DD manually
      const [year, month, day] = dateStr.split("-").map(Number)

      // Create a Date object using local timezone (months are 0-based)
      const date = new Date(year, month - 1, day)

      return date.toLocaleDateString("pt-BR")
    },
  },
  {
    id: "cadastrado",
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Cadastrado em" />
      )
    },
    cell: ({ cell }) =>
      new Date(cell.getValue<string>()).toLocaleDateString("pt-BR"),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <PersonalInfoModal row={row} />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

function PersonalInfoModal({ row }: { row: Row<UserDto> }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleModal = () => setIsOpen(!isOpen)

  return (
    <Dialog open={isOpen} onOpenChange={toggleModal}>
      <DialogTrigger asChild>
        <DropdownMenuItem className="cursor-pointer" onSelect={e => e.preventDefault()}>
          Informações pessoais
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-h-[80%] max-w-[90%] overflow-y-auto rounded-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {row.original.name}
          </DialogTitle>
        </DialogHeader>
        <UserInfoForm toggleModal={toggleModal} user={row.original} />
      </DialogContent>
    </Dialog>

  )
}

function EditModal({ row }: { row: Row<UserDto> }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleModal = () => setIsOpen(!isOpen)

  return (
    <Dialog open={isOpen} onOpenChange={toggleModal}>
      <DialogTrigger asChild>
        <TableRow
          data-state={row.getIsSelected() && "selected"}
          className="cursor-pointer"
        >
          {row.getVisibleCells().map(cell => (
            <TableCell key={cell.id}>
              {flexRender(
                cell.column.columnDef.cell,
                cell.getContext(),
              )}
            </TableCell>
          ))}
        </TableRow>
      </DialogTrigger>
      <DialogContent
        className="max-h-[80%] max-w-[90%] overflow-y-auto rounded-md"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>
            Editar Usuário
          </DialogTitle>
          <DialogDescription>
            Mude as informações e clique em salvar para aplicar
          </DialogDescription>
        </DialogHeader>
        <UserEditForm toggleModal={toggleModal} user={row.original} />
      </DialogContent>
    </Dialog>
  )
}

export function UserTable({ users }: Props) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters]
    = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility]
    = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable<UserDto>({
    data: users,
    columns: userColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="grid size-full grid-rows-[auto_1fr_auto] gap-3 overflow-y-hidden">
      <div className="flex items-center justify-between gap-3">
        <Input
          placeholder="Procurar nome..."
          value={
            (table.getColumn("nome")?.getFilterValue() as string)
            ?? ""
          }
          onChange={event =>
            table
              .getColumn("nome")
              ?.setFilterValue(event.target.value)}
          className="border-primary/30"
        />
        <UserAdd />
        <DataTableViewOptions table={table} />
      </div>

      <div className="size-full  overflow-auto rounded-md border border-primary/30">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length
              ? (
                  table.getRowModel().rows.map(row => (
                    <EditModal key={row.id} row={row} />
                  ))
                )
              : (
                  <TableRow>
                    <TableCell
                      colSpan={userColumns.length}
                      className="h-24 text-center"
                    >
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
