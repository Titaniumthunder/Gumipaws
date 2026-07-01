import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { runBookingIntegrations } from "@/lib/booking-integrations";

export const runtime = "nodejs";

/**
 * POST /api/admin/bookings/[id]/retry-sync — re-run the Google Calendar and
 * email integrations for a booking whose earlier sync failed. Admin-only.
 */
export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  const role = session?.user?.role;
  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Retrying third-party sync is an Admin-only action.
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const booking = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await runBookingIntegrations(booking);

  return NextResponse.json({
    id: updated.id,
    calendarSyncError: updated.calendarSyncError,
    emailSyncError: updated.emailSyncError,
    googleCalendarEventId: updated.googleCalendarEventId,
  });
}
