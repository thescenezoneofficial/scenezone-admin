"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { loginSchema, LoginFormState } from "./schema"
import { fetchApi } from "@/lib/api"
import { ApiError } from "@/lib/exceptions"
import { LoginResponse } from "@/constants"

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const values = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  // 1. Validate Input
  const validated = loginSchema.safeParse(values)
  if (!validated.success) {
    return {
      values,
      errors: validated.error.flatten().fieldErrors,
    }
  }

  try {
    // 2. Call API
    // fetchApi returns the parsed JSON object directly
    const response = await fetchApi<LoginResponse>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(validated.data),
    })

    // 3. Set Cookie
    const cookieStore = await cookies()
    cookieStore.set("accessToken", response.data.token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    })

  } catch (error) {
    console.error("Login Action Error:", error)
    
    // Return specific backend error message if available
    if (error instanceof ApiError) {
      return {
        values,
        errors: { root: [error.message] },
      }
    }

    return {
      values,
      errors: { root: ["Something went wrong. Please try again."] },
    }
  }

  // 4. Redirect (must be outside try/catch)
  redirect("/users")
}