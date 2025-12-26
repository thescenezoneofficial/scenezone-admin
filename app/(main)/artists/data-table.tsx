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
import { Filter, Search } from "lucide-react"

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
        sorting: [] 
    }
  })

  // --- SAFE HELPER ---
  // We search the array manually to avoid triggering the console error
  const getColumnSafe = (colId: string) => {
    return table.getAllColumns().find((c) => c.id === colId)
  }

  return (
    <div className="w-full space-y-4">
      {/* --- TOOLBAR --- */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center space-x-2">
            
            {/* 1. Generic Search: Checks if _id OR fullName exists */}
            {getColumnSafe("_id") && (
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search ID..."
                        value={(getColumnSafe("_id")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            getColumnSafe("_id")?.setFilterValue(event.target.value)
                        }
                        className="pl-8 h-8 w-[200px] lg:w-[300px]"
                    />
                </div>
            )}
            
            {/* Fallback Search for Name */}
            {getColumnSafe("fullName") && (
                <div className="relative">
                     <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search Name..."
                        value={(getColumnSafe("fullName")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            getColumnSafe("fullName")?.setFilterValue(event.target.value)
                        }
                        className="pl-8 h-8 w-[200px] lg:w-[300px]"
                    />
                </div>
            )}
            
            {/* 2. Status Filter: Only renders if 'payment_status' column actually exists */}
            {getColumnSafe("payment_status") && (
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
                                checked={(getColumnSafe("payment_status")?.getFilterValue() as string[])?.includes(status)}
                                onCheckedChange={(checked) => {
                                    const column = getColumnSafe("payment_status")
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
                            checked={!(getColumnSafe("payment_status")?.getFilterValue() as string[])?.length}
                            onCheckedChange={() => getColumnSafe("payment_status")?.setFilterValue(undefined)}
                            className="text-muted-foreground italic"
                        >
                            Clear Filter
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
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
                  No results found.
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