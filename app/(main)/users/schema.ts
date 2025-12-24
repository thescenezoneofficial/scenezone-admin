import { z } from "zod"

// Matches your API response
export const userSchema = z.object({
  _id: z.string(),
  fullName: z.string(),
  mobileNumber: z.string(),
  role: z.enum(["user", "artist", "host", "admin"]),
  address: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
})

export type AppUser = z.infer<typeof userSchema>