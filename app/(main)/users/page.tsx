import { columns } from './columns'
import { DataTable } from './data-table'
import { fetchApi } from '@/lib/api'
import { AppUser } from './schema'
import { cookies } from 'next/headers'

// Define the API response shape
interface UsersResponse {
  success: boolean
  message: string
  data: {
    total: number
    users: AppUser[]
  }
}

export default async function UsersPage() {
  let users: AppUser[] = []

  const cookieStore = await cookies()
  const token = cookieStore.get('accessToken')?.value

  try {
    const response = await fetchApi<UsersResponse>('/admin/get-all-users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    users = response.data.users
  } catch (error) {
    console.error('Failed to fetch users', error)
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            View and manage {users.length} registered users, hosts, and artists.
          </p>
        </div>
      </div>

      <DataTable columns={columns} data={users} />
    </div>
  )
}
