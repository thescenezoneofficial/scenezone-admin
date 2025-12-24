import { cookies } from "next/headers"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { fetchApi } from "@/lib/api"
import { Booking } from "./schema"

// Define response shape based on your provided JSON
interface BookingsResponse {
  success: boolean
  data: Booking[]
}

export default async function BookingsPage() {
  let bookings: Booking[] = []

  // 1. Get Token
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value

  try {
    // 2. Fetch Data
    const response = await fetchApi<BookingsResponse>('/bookings/get-all-bookings', {
      headers: {
        "Authorization": `Bearer ${token}` 
      },
      // Since it's a financial table, we usually don't want to cache strictly
      cache: 'no-store' 
    })
    
    bookings = response.data
  } catch (error) {
    console.error("Failed to fetch bookings", error)
  }

  // Calculate Total Revenue for a quick summary card
  const totalRevenue = bookings
    .filter(b => b.payment_status === 'completed')
    .reduce((acc, curr) => acc + curr.invoices.total, 0)

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">
            Monitor real-time bookings and financial status.
          </p>
        </div>
        
        {/* Simple Summary Card */}
        <div className="bg-muted/50 p-4 rounded-lg border flex flex-col items-end min-w-[200px]">
            <span className="text-xs text-muted-foreground uppercase font-bold">Total Revenue</span>
            <span className="text-2xl font-bold">
                {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(totalRevenue)}
            </span>
        </div>
      </div>
      
      <DataTable columns={columns} data={bookings} />
    </div>
  )
}