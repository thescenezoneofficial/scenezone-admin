"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
        pagination: { pageSize: 10 },
        // Sort by newest date by default (assuming date_time is the key)
        sorting: [{ id: "date_time", desc: true }]
    }
  })

  return (
    <div className="w-full space-y-4">
      {/* --- TOOLBAR --- */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center space-x-2">
            <Input
                placeholder="Search Order ID..."
                value={(table.getColumn("_id")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("_id")?.setFilterValue(event.target.value)
                }
                className="h-8 w-[200px] lg:w-[300px]"
            />
            
            {/* Status Filter */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 border-dashed">
                        <Filter className="mr-2 h-4 w-4" />
                        Status
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    {["completed", "pending", "failed"].map((status) => (
                         <DropdownMenuCheckboxItem
                            key={status}
                            checked={(table.getColumn("payment_status")?.getFilterValue() as string[])?.includes(status)}
                            onCheckedChange={(checked) => {
                                const column = table.getColumn("payment_status")
                                const filterValue = (column?.getFilterValue() as string[]) || []
                                if (checked) {
                                    column?.setFilterValue([...filterValue, status])
                                } else {
                                    column?.setFilterValue(filterValue.filter((val) => val !== status))
                                }
                            }}
                            className="capitalize"
                         >
                            {status}
                         </DropdownMenuCheckboxItem>
                    ))}
                    <DropdownMenuCheckboxItem
                        checked={!(table.getColumn("payment_status")?.getFilterValue() as string[])?.length}
                        onCheckedChange={() => table.getColumn("payment_status")?.setFilterValue(undefined)}
                        className="text-muted-foreground italic"
                    >
                        Clear Filter
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- PAGINATION --- */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
        >
            Previous
        </Button>
        <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
        >
            Next
        </Button>
      </div>
    </div>
  )
}