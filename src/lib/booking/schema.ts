import { z } from "zod";
import { ADD_ON_BY_ID, coatTypeForBreed, isPackageAllowed, SIZES } from "./pricing";
import { GROOMERS, TIME_SLOTS } from "./constants";

/**
 * Validation for the POST /api/bookings payload. The server re-derives the
 * price from these fields, so no price is accepted from the client.
 *
 * A booking has an optional `package` (null = "skip, add-ons only") and any
 * number of `addOns`. The package must be valid for the breed's coat type.
 */
export const createBookingSchema = z
  .object({
    petName: z.string().trim().min(1, "Pet name is required."),
    breed: z.string().trim().min(1, "Breed is required."),
    size: z.enum(SIZES),
    // null is a valid choice ("Skip — add-ons only"). `.nullable()` requires the
    // key be present so the client always makes an explicit choice.
    package: z.string().nullable(),
    addOns: z
      .array(z.string())
      .default([])
      .refine(
        (ids) => ids.every((id) => id in ADD_ON_BY_ID),
        "One or more selected add-ons are invalid.",
      ),
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
  })
  .superRefine((data, ctx) => {
    // If a package was chosen, it must be valid for the breed's coat type
    // (prevents a curly dog being priced with the cheaper "Full Groom", etc.).
    if (data.package) {
      const coat = coatTypeForBreed(data.breed);
      if (!isPackageAllowed(data.package, coat)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["package"],
          message: "That package isn't available for the selected breed.",
        });
      }
    }
  });

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
