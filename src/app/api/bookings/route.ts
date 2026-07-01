import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createBookingSchema } from "@/lib/booking-schema";
import { computeEstimate } from "@/lib/pricing";
import { runBookingIntegrations } from "@/lib/booking-integrations";

// This route talks to the DB and third-party APIs — always run on Node.
export const runtime = "nodejs";

/**
 * POST /api/bookings
 * 1. Validate the payload.
 * 2. Recompute the estimated total server-side (never trust the client).
 * 3. Create the booking with status "confirmed".
 * 4. Kick off Calendar + email integrations (failures don't block the customer).
 * 5. Return the created booking id.
 */
export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = createBookingSchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Invalid booking data.";
    return NextResponse.json({ error: first }, { status: 400 });
  }
  const data = parsed.data;

  // Server-side pricing — the source of truth.
  const { total } = computeEstimate(data.services, data.size);

  const booking = await prisma.booking.create({
    data: {
      services: data.services,
      groomerName: data.groomerName,
      petName: data.petName,
      size: data.size,
      breed: data.breed,
      date: data.date,
      time: data.time,
      ownerName: data.ownerName,
      phone: data.phone,
      email: data.email,
      notes: data.notes || null,
      estimatedTotal: total,
      status: "confirmed",
      // Unguessable token backing the customer self-cancel link.
      cancellationToken: randomUUID(),
    },
  });

  // Best-effort integrations. Awaited so the record reflects sync status by the
  // time we respond, but any failure is captured on the booking, not thrown.
  try {
    await runBookingIntegrations(booking);
  } catch (err) {
    // Extremely defensive: never fail the customer's booking on integration bugs.
    console.error(`[booking ${booking.id}] integration runner threw:`, err);
  }

  return NextResponse.json(
    { id: booking.id, estimatedTotal: total },
    { status: 201 },
  );
}
