'use server'

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { fetchApi } from "@/lib/api"

export async function updateUserAction(formData: FormData) {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value

  const userId = formData.get("userId") as string
  const rawData = {
    fullName: formData.get("fullName"),
    mobileNumber: formData.get("mobileNumber"),
    // Add other fields if your API supports them
  }

  if (!token) return { error: "Unauthorized" }

  try {
    await fetchApi(`/admin/update-user/${userId}`, { // Adjust endpoint
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rawData),
    })

    revalidatePath("/users") // Refreshes the table data
    return { success: true, message: "User updated successfully" }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { error: error.message || "Failed to update user" }
  }
}

// 2. DELETE USER ACTION
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