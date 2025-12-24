import { z } from "zod"

export const bookingSchema = z.object({
  _id: z.string(),
  artistId: z.string(),
  hostId: z.string(),
  eventId: z.string(),
  date_time: z.string(), // ISO String
  invoices: z.object({
    subtotal: z.number(),
    platform_fees: z.number(),
    taxes: z.number(),
    total: z.number(),
  }),
  payment_status: z.enum(["completed", "pending", "failed"]),
  razorpay_order_id: z.string().nullable().optional(),
  razorpay_payment_id: z.string().nullable().optional(),
  createdAt: z.string(),
})

export type Booking = z.infer<typeof bookingSchema>