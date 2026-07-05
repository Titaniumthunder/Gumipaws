import { google } from "googleapis";
import type { Booking } from "@prisma/client";
import { TIME_SLOTS } from "./booking-constants";
import { formatUSD, summarizeSelections } from "./pricing";

/**
 * Google Calendar integration via a service account (no per-user OAuth).
 * Share one business calendar with GOOGLE_SERVICE_ACCOUNT_EMAIL ("Make changes
 * to events") and set GOOGLE_CALENDAR_ID to that calendar's id.
 */

// Business timezone. All slots are interpreted in this zone.
const TIME_ZONE = process.env.BUSINESS_TIME_ZONE || "America/Los_Angeles";
// Each appointment blocks this many minutes on the calendar.
const APPOINTMENT_MINUTES = 90;

export function isCalendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY &&
      process.env.GOOGLE_CALENDAR_ID,
  );
}

/** Convert a slot label like "10:30am" to { hours, minutes } in 24h. */
function parseSlot(label: string): { hours: number; minutes: number } {
  const m = label.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (!m) throw new Error(`Unrecognized time slot: ${label}`);
  let hours = parseInt(m[1], 10);
  const minutes = parseInt(m[2], 10);
  const meridiem = m[3].toLowerCase();
  if (meridiem === "pm" && hours !== 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;
  return { hours, minutes };
}

/**
 * Build an RFC3339 timestamp *without* a zone offset and pair it with the
 * `timeZone` field — Google then interprets the local wall-clock time in that
 * zone. This avoids server-timezone drift.
 */
function localDateTime(dateISO: string, slot: string): string {
  const { hours, minutes } = parseSlot(slot);
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  return `${dateISO}T${hh}:${mm}:00`;
}

function addMinutes(dateTime: string, minutes: number): string {
  const [datePart, timePart] = dateTime.split("T");
  const [h, m] = timePart.split(":").map(Number);
  const total = h * 60 + m + minutes;
  // Same-day only (slots + duration never cross midnight for this spa).
  const nh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const nm = String(total % 60).padStart(2, "0");
  return `${datePart}T${nh}:${nm}:00`;
}

function calendarClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    // Support keys stored with literal "\n" (common on Vercel/Netlify).
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar.events"],
  });
  return google.calendar({ version: "v3", auth });
}

/**
 * Create (or, if eventId is passed, update) the calendar event for a booking.
 * Returns the Google event id. Throws on failure — the caller records the error.
 */
export async function upsertCalendarEvent(booking: Booking): Promise<string> {
  if (!isCalendarConfigured()) {
    throw new Error("Google Calendar is not configured (missing env vars).");
  }
  if (!(TIME_SLOTS as readonly string[]).includes(booking.time)) {
    throw new Error(`Booking time "${booking.time}" is not a known slot.`);
  }

  const calendar = calendarClient();
  const calendarId = process.env.GOOGLE_CALENDAR_ID!;
  const start = localDateTime(booking.date, booking.time);
  const end = addMinutes(start, APPOINTMENT_MINUTES);

  const selections = summarizeSelections(booking.package, booking.addOns);
  const requestBody = {
    summary: `🐾 ${booking.petName} — ${selections}`,
    description: [
      `Pet: ${booking.petName} (${booking.size}, ${booking.breed})`,
      `Services: ${selections}`,
      `Groomer: ${booking.groomerName}`,
      `Owner: ${booking.ownerName}`,
      `Phone: ${booking.phone}`,
      `Email: ${booking.email}`,
      `Estimated total: ${formatUSD(Number(booking.estimatedTotal))} (pay at pickup)`,
      booking.notes ? `Notes: ${booking.notes}` : null,
      ``,
      `Booking ID: ${booking.id}`,
    ]
      .filter(Boolean)
      .join("\n"),
    start: { dateTime: start, timeZone: TIME_ZONE },
    end: { dateTime: end, timeZone: TIME_ZONE },
  };

  if (booking.googleCalendarEventId) {
    const res = await calendar.events.update({
      calendarId,
      eventId: booking.googleCalendarEventId,
      requestBody,
    });
    return res.data.id ?? booking.googleCalendarEventId;
  }

  const res = await calendar.events.insert({ calendarId, requestBody });
  if (!res.data.id) throw new Error("Calendar event created without an id.");
  return res.data.id;
}

/**
 * Delete a booking's calendar event. No-ops if Calendar isn't configured or the
 * booking has no event id. Treats an already-deleted event (410/404) as success.
 */
export async function deleteCalendarEvent(booking: Booking): Promise<void> {
  if (!isCalendarConfigured() || !booking.googleCalendarEventId) return;

  const calendar = calendarClient();
  const calendarId = process.env.GOOGLE_CALENDAR_ID!;
  try {
    await calendar.events.delete({
      calendarId,
      eventId: booking.googleCalendarEventId,
    });
  } catch (err: unknown) {
    const status =
      typeof err === "object" && err !== null && "code" in err
        ? (err as { code?: number }).code
        : undefined;
    // Already gone — that's fine.
    if (status === 404 || status === 410) return;
    throw err;
  }
}
