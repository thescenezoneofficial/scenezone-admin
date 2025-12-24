"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Booking } from "./schema"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Copy, CreditCard } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

// Helper to copy IDs
const CopyId = ({ id, label }: { id: string, label: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className="font-mono text-[10px] text-muted-foreground cursor-pointer hover:text-primary flex items-center gap-1"
          onClick={() => navigator.clipboard.writeText(id)}
        >
          <span className="opacity-50">{label}:</span>
          {id.slice(-6).toUpperCase()}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Copy {label} ID</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "_id",
    header: "Transaction Ref",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
         <span className="font-mono text-xs font-medium">
            {row.original.razorpay_order_id || "N/A"}
         </span>
         <span className="text-[10px] text-muted-foreground">
            {row.original._id}
         </span>
      </div>
    ),
  },
  {
    accessorKey: "date_time",
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date_time"))
      return (
        <div className="flex flex-col">
          <span className="font-medium text-sm">
            {date.toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <span className="text-xs text-muted-foreground">
            {date.toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      )
    },
  },
  {
    header: "Entities",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <CopyId id={row.original.eventId} label="EVT" />
        <CopyId id={row.original.hostId} label="HST" />
        <CopyId id={row.original.artistId} label="ART" />
      </div>
    )
  },
  {
    accessorKey: "payment_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("payment_status") as string
      return (
        <Badge
          variant="outline"
          className={`capitalize ${
            status === "completed" 
              ? "border-green-500 text-green-600 bg-green-50" 
              : status === "failed"
              ? "border-red-500 text-red-600 bg-red-50"
              : "border-yellow-500 text-yellow-600 bg-yellow-50"
          }`}
        >
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "invoices.total",
    header: ({ column }) => (
        <div className="text-right">
            <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        </div>
    ),
    cell: ({ row }) => {
        const total = row.original.invoices.total
        const fees = row.original.invoices.platform_fees

        return (
            <div className="text-right font-medium">
                <div>{formatCurrency(total)}</div>
                {fees > 0 && (
                    <div className="text-[10px] text-muted-foreground">
                        Includes {formatCurrency(fees)} fees
                    </div>
                )}
            </div>
        )
    },
  },
]