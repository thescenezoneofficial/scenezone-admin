"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { loginSchema, LoginFormState } from "./schema"

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const values = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  // 1. Client-side input validation
  const validatedFields = loginSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      values, // Return values so the form doesn't wipe
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    }
  }

  // 2. Call your backend API
  try {
    // Replace with your actual Backend URL env variable
    const BACKEND_URL = process.env.NEXT_BACKEND_API_URL || "http://localhost:3000/api" 
    
    const response = await fetch(`${BACKEND_URL}/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedFields.data),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      return {
        values,
        errors: {
          root: [data.message || "Invalid credentials"],
        },
        success: false,
      }
    }

    // 3. Set Session Cookie
    const cookieStore = await cookies()
    cookieStore.set("accessToken", data.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

  } catch (error) {
    console.error("Login error:", error)
    return {
      values,
      errors: { root: ["Failed to connect to the server. Please try again."] },
      success: false,
    }
  }

  // 4. Redirect on success (must be outside try/catch)
  redirect("/dashboard")
}