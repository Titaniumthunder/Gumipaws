import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { deleteCalendarEvent } from "@/lib/google-calendar";
import { sendCancellationEmail, isEmailConfigured } from "@/lib/email";

export const runtime = "nodejs";

const bodySchema = z.object({ token: z.string().min(1) });

/**
 * POST /api/bookings/[id]/cancel — customer self-service cancellation.
 *
 * Public but token-gated: the caller must supply the booking's
 * `cancellationToken`. We NEVER trust the id alone. On success we set the
 * status to `cancelled`, remove the Google Calendar event, and send a
 * cancellation email (best-effort). Only `confirmed` bookings can be cancelled.
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing token." }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({ where: { id: params.id } });

  // Generic failure — never reveal whether the id or token specifically matched.
  if (!booking || booking.cancellationToken !== parsed.data.token) {
    return NextResponse.json(
      { error: "We couldn't find that booking." },
      { status: 404 },
    );
  }

  if (booking.status !== "confirmed") {
    return NextResponse.json(
      { error: `This booking is already ${booking.status}.`, status: booking.status },
      { status: 409 },
    );
  }

  const cancelled = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "cancelled" },
  });

  // Remove the calendar event (best-effort — never block the cancellation).
  try {
    await deleteCalendarEvent(cancelled);
  } catch (err) {
    console.error(`[booking ${cancelled.id}] calendar delete failed:`, err);
  }

  // Notify the customer (best-effort).
  if (isEmailConfigured()) {
    try {
      await sendCancellationEmail(cancelled);
    } catch (err) {
      console.error(`[booking ${cancelled.id}] cancel email failed:`, err);
    }
  }

  return NextResponse.json({ status: "cancelled" });
}
