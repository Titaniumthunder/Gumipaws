import type { Booking } from "@prisma/client";
import { prisma } from "./prisma";
import { upsertCalendarEvent, isCalendarConfigured } from "./google-calendar";
import { sendBookingEmails, isEmailConfigured } from "./email";

/**
 * Run the two third-party integrations (Google Calendar + email) for a booking
 * and record the outcome on the booking row.
 *
 * These are best-effort: a failure of either NEVER blocks the customer's
 * confirmation. Instead we persist an error message so the admin dashboard can
 * flag the booking for manual follow-up and offer a "retry sync" button.
 *
 * Returns the updated booking.
 */
export async function runBookingIntegrations(
  booking: Booking,
): Promise<Booking> {
  let googleCalendarEventId = booking.googleCalendarEventId;
  let calendarSyncError: string | null = null;
  let emailSyncError: string | null = null;

  // --- Google Calendar ---
  if (isCalendarConfigured()) {
    try {
      googleCalendarEventId = await upsertCalendarEvent(booking);
    } catch (err) {
      calendarSyncError = err instanceof Error ? err.message : String(err);
      console.error(`[booking ${booking.id}] calendar sync failed:`, err);
    }
  } else {
    calendarSyncError = "Skipped: Google Calendar not configured.";
  }

  // --- Email (Azure Communication Services) ---
  if (isEmailConfigured()) {
    try {
      await sendBookingEmails(booking);
    } catch (err) {
      emailSyncError = err instanceof Error ? err.message : String(err);
      console.error(`[booking ${booking.id}] email send failed:`, err);
    }
  } else {
    emailSyncError = "Skipped: email (Azure Communication Services) not configured.";
  }

  return prisma.booking.update({
    where: { id: booking.id },
    data: { googleCalendarEventId, calendarSyncError, emailSyncError },
  });
}
