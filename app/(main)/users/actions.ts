'use server'

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { fetchApi } from "@/lib/api"

export async function deleteUserAction(userId: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value

  if (!token) return { error: "Unauthorized" }

  try {
    await fetchApi(`/admin/delete-user/${userId}`, { // Adjust endpoint
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })

    revalidatePath("/users")
    return { success: true, message: "User deleted successfully" }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { error: error.message || "Failed to delete user" }
  }
}