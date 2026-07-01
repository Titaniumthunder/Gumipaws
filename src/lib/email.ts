import { Resend } from "resend";
import type { Booking } from "@prisma/client";
import { formatUSD, PRICE_DISCLAIMER } from "./pricing";

/**
 * Transactional email via Resend. Sends a confirmation to the customer and a
 * notification to the business inbox. Throws on failure so the caller can log it.
 */

const FROM =
  process.env.EMAIL_FROM || "GumiPaws <onboarding@resend.dev>";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/** Absolute base URL for links in emails (falls back to localhost in dev). */
function baseUrl(): string {
  return (
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

function summaryRows(booking: Booking): string {
  const rows: [string, string][] = [
    ["Pet", `${booking.petName} · ${booking.size} · ${booking.breed}`],
    ["Services", booking.services.join(", ")],
    ["Groomer", booking.groomerName],
    ["Date & time", `${booking.date} at ${booking.time}`],
    ["Owner", booking.ownerName],
    ["Phone", booking.phone],
    ["Estimated total", `${formatUSD(Number(booking.estimatedTotal))} (pay at pickup)`],
  ];
  if (booking.notes) rows.push(["Notes", booking.notes]);
  return rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#5B4A3A;font-weight:600;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:6px 0;color:#4A3B2E">${escapeHtml(
          v,
        )}</td></tr>`,
    )
    .join("");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function shell(
  title: string,
  intro: string,
  booking: Booking,
  extraHtml = "",
): string {
  return `
  <div style="font-family:Helvetica,Arial,sans-serif;background:#F6F0E6;padding:24px">
    <div style="max-width:560px;margin:0 auto;background:#FCFAF5;border-radius:20px;padding:28px">
      <h1 style="font-family:Georgia,serif;color:#4A3B2E;margin:0 0 4px">🐾 GumiPaws</h1>
      <h2 style="color:#4A3B2E;margin:12px 0">${title}</h2>
      <p style="color:#5B4A3A;line-height:1.5">${intro}</p>
      <table style="border-collapse:collapse;margin:16px 0;font-size:14px">${summaryRows(
        booking,
      )}</table>
      <p style="color:#8a7a68;font-size:12px;line-height:1.5">${PRICE_DISCLAIMER}</p>
      ${extraHtml}
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0" />
      <p style="color:#8a7a68;font-size:12px">123 Marina Way, Los Angeles, CA 90000 · (310) 555-0192 · Booking #${booking.id}</p>
    </div>
  </div>`;
}

/** "Cancel this booking" call-to-action for the customer email. */
function cancelCta(booking: Booking): string {
  const url = `${baseUrl()}/booking/manage/${booking.cancellationToken}`;
  return `
    <div style="margin-top:16px">
      <a href="${url}" style="color:#B4894F;font-size:13px;text-decoration:underline">Need to cancel this booking?</a>
      <p style="color:#8a7a68;font-size:12px;margin-top:4px">Need to reschedule instead? Call us at (310) 555-0192.</p>
    </div>`;
}

/** Send both the customer and business emails. Throws if either send fails. */
export async function sendBookingEmails(booking: Booking): Promise<void> {
  if (!isEmailConfigured()) {
    throw new Error("Resend is not configured (missing RESEND_API_KEY).");
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Customer confirmation.
  const customer = await resend.emails.send({
    from: FROM,
    to: booking.email,
    subject: `Your GumiPaws spa day for ${booking.petName} is confirmed 🐾`,
    html: shell(
      "Booking confirmed!",
      `Hi ${escapeHtml(booking.ownerName)}, we can't wait to pamper ${escapeHtml(
        booking.petName,
      )}. Here are your details — no deposit needed, just pay in person at pickup.`,
      booking,
      cancelCta(booking), // customer copy gets the self-cancel link
    ),
  });
  if (customer.error) {
    throw new Error(`Customer email failed: ${customer.error.message}`);
  }

  // Business notification (best-effort, but still throws so admin sees it).
  const businessInbox = process.env.BUSINESS_NOTIFICATION_EMAIL;
  if (businessInbox) {
    const biz = await resend.emails.send({
      from: FROM,
      to: businessInbox,
      subject: `New booking: ${booking.petName} on ${booking.date} at ${booking.time}`,
      html: shell(
        "New booking received",
        `A new booking just came in via the website.`,
        booking,
      ),
    });
    if (biz.error) {
      throw new Error(`Business email failed: ${biz.error.message}`);
    }
  }
}

/**
 * Short "your booking is cancelled" email to the customer. Best-effort — the
 * cancel action succeeds even if this send fails (error is swallowed by caller).
 */
export async function sendCancellationEmail(booking: Booking): Promise<void> {
  if (!isEmailConfigured()) {
    throw new Error("Resend is not configured (missing RESEND_API_KEY).");
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const res = await resend.emails.send({
    from: FROM,
    to: booking.email,
    subject: `Your GumiPaws booking for ${booking.petName} is cancelled`,
    html: shell(
      "Booking cancelled",
      `Hi ${escapeHtml(booking.ownerName)}, your appointment for ${escapeHtml(
        booking.petName,
      )} on ${booking.date} at ${booking.time} has been cancelled. We hope to see you another time — call (310) 555-0192 to rebook.`,
      booking,
    ),
  });
  if (res.error) {
    throw new Error(`Cancellation email failed: ${res.error.message}`);
  }
}
