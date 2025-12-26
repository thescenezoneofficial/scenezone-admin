import { cookies } from "next/headers"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { fetchApi } from "@/lib/api"
import { ArtistProfile } from "./schema"

interface ArtistResponse {
  success: boolean
  message: string
  data: ArtistProfile[]
}

export default async function ArtistsPage() {
  let artists: ArtistProfile[] = []
  
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value

  try {
    const response = await fetchApi<ArtistResponse>('/artist/get-all-artists', {
        headers: { "Authorization": `Bearer ${token}` },
        cache: 'no-store' // Ensure we see latest verification status
    })
    artists = response.data
  } catch (error) {
    console.error("Fetch artists error:", error)
  }

  return (
    <div className="container mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Artist Requests</h2>
            <p className="text-muted-foreground">
                Review portfolios and verify artist profiles.
            </p>
        </div>
        <div className="bg-muted px-4 py-2 rounded-lg text-sm">
            Total Profiles: <strong>{artists.length}</strong>
        </div>
      </div>

      {/* Reuse your existing DataTable component */}
      <DataTable columns={columns} data={artists} />
    </div>
  )
}