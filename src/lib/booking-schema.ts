import { z } from "zod";
import { SERVICE_BY_ID, SIZES } from "./pricing";
import { GROOMERS, TIME_SLOTS } from "./booking-constants";

/**
 * Validation for the POST /api/bookings payload. The server re-derives the
 * price from these fields, so no price is accepted from the client.
 */
export const createBookingSchema = z.object({
  services: z
    .array(z.string())
    .min(1, "Select at least one service.")
    .refine(
      (ids) => ids.every((id) => id in SERVICE_BY_ID),
      "One or more selected services are invalid.",
    ),
  petName: z.string().trim().min(1, "Pet name is required."),
  size: z.enum(SIZES),
  breed: z.string().trim().min(1, "Breed is required."),
  groomerName: z.enum(GROOMERS),
  // ISO date "YYYY-MM-DD".
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "A valid date is required.")
    .refine((d) => !Number.isNaN(Date.parse(d)), "A valid date is required.")
    .refine((d) => {
      // Not in the past (compare date-only, local).
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const chosen = new Date(`${d}T00:00:00`);
      return chosen.getTime() >= today.getTime();
    }, "Please choose today or a future date."),
  time: z.enum(TIME_SLOTS),
  ownerName: z.string().trim().min(1, "Your name is required."),
  phone: z.string().trim().min(7, "A valid phone number is required."),
  email: z.string().trim().email("A valid email is required."),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
