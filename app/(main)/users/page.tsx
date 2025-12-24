import { Metadata } from 'next'
import data from './users.json'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const metadata: Metadata = {
  title: 'Users | Dashboard',
  description: 'Manage your users, hosts, and artists.',
}

type UserRole = 'user' | 'host' | 'artist'

interface User {
  _id: string
  fullName: string
  mobileNumber: string
  role: UserRole
  address?: string | null
  location?: string | null
}

// 2. Helper to get Badge colors based on role
const getRoleBadgeColor = (role: UserRole) => {
  switch (role) {
    case 'user':
      return 'default' // Black/Primary
    case 'host':
      return 'secondary' // Gray/Secondary
    case 'artist':
      return 'outline' // White/Outline
    default:
      return 'default'
  }
}

export default function UsersPage() {
  const users = data.users as User[]

  return (
    <div className="flex-1 space-y-4 px-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total}</div>
            <p className="text-xs text-muted-foreground">Across all roles</p>
          </CardContent>
        </Card>
        {/* You can add more summary cards here (e.g., Active Artists) */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            A list of all registered users, hosts, and artists.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Avatar className="h-9 w-9">
                      {/* <AvatarImage src={`/avatars/${user._id}.png`} alt={user.fullName} /> */}
                      <AvatarFallback>
                        {user.fullName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.mobileNumber}</TableCell>
                  <TableCell>
                    {user.address || user.location || (
                      <span className="text-muted-foreground italic">N/A</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
