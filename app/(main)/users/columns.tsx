'use client'

import { ColumnDef } from '@tanstack/react-table'
import { AppUser } from './schema'
import { Badge } from '@/components/ui/badge'
import { ArrowUpDown, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserActions } from './user-actions'

export const columns: ColumnDef<AppUser>[] = [
  {
    accessorKey: 'fullName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-medium ml-4">{row.getValue('fullName')}</div>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as string
      return (
        <Badge
          variant={role === 'admin' ? 'destructive' : 'secondary'}
          className={`capitalize ${
            role === 'host'
              ? 'bg-orange-100 text-orange-700 hover:bg-orange-100/80'
              : role === 'artist'
              ? 'bg-purple-100 text-purple-700 hover:bg-purple-100/80'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-100/80'
          }`}
        >
          {role}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'mobileNumber',
    header: 'Mobile',
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Phone className="h-3 w-3" />
        <span>{row.getValue('mobileNumber')}</span>
      </div>
    ),
  },
  {
    id: 'location',
    header: 'Location',
    accessorFn: (row) => row.address || row.location || 'N/A',
    cell: ({ row }) => {
      const loc = row.original.address || row.original.location

      if (!loc)
        return <span className="text-muted-foreground/50 text-sm">-</span>

      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate max-w-[200px]">{loc}</span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <UserActions user={row.original} />,
  },
]
