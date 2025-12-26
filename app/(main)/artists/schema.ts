import { z } from "zod"

// The video portfolio item
export const performanceSchema = z.object({
  _id: z.string(),
  venueName: z.string(),
  genre: z.string(),
  videoUrl: z.string().url(),
})

// The main Artist Profile
export const artistProfileSchema = z.object({
  _id: z.string(), // Profile ID
  artistId: z.object({
    _id: z.string(), // The actual User ID needed for verification
    fullName: z.string(),
    mobileNumber: z.string(),
    email: z.string().optional(), // Sometimes email is at root, sometimes undefined
    isVerified: z.boolean(),
    isProfileComplete: z.boolean(),
  }),
  profileImageUrl: z.string().url(),
  dob: z.string(),
  email: z.string(), // Email is here in your data
  address: z.string().nullable(),
  artistType: z.string(),
  artistSubType: z.string().nullable(),
  instrument: z.string().nullable(),
  budget: z.number(),
  isCrowdGuarantee: z.boolean(),
  performanceUrlId: z.array(performanceSchema),
  status: z.string().optional(),
})

export type ArtistProfile = z.infer<typeof artistProfileSchema>