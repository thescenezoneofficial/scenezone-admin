import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address."),
  password: z
    .string()
    .min(1, "Password is required."),
})

export type LoginFormState = {
  values?: z.infer<typeof loginSchema>
  errors?: {
    email?: string[]
    password?: string[]
    root?: string[] // For general API errors (e.g., "Invalid credentials")
  } | null
  success?: boolean
}