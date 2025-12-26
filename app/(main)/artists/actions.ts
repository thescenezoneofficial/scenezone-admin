'use server'

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { fetchApi } from "@/lib/api"

// VERIFY ARTIST
export async function verifyArtistAction(artistAuthId: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value

  if (!token) return { error: "Unauthorized" }

  try {
    await fetchApi(`/artist/verify-artist/${artistAuthId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })

    revalidatePath("/artists")
    return { success: true, message: "Artist verified successfully" }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { error: error.message || "Failed to verify artist" }
  }
}

// DELETE ARTIST (Assuming a standard delete endpoint exists)
export async function deleteArtistAction(profileId: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value

  if (!token) return { error: "Unauthorized" }

  try {
    await fetchApi(`/artist/delete-artist/${profileId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })

    revalidatePath("/artists")
    return { success: true, message: "Artist deleted successfully" }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { error: error.message || "Failed to delete artist" }
  }
}