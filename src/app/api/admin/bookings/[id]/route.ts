import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const patchSchema = z.object({
  status: z.enum(["confirmed", "cancelled", "completed"]).optional(),
  paidAtPickup: z.boolean().optional(),
});

/**
 * PATCH /api/admin/bookings/[id] — update status and/or paid-at-pickup.
 *
 * Role rules:
 *  - Any authenticated staff may toggle paidAtPickup and mark a booking
 *    `completed` (Workers finish visits at the desk).
 *  - Only Manager/Admin may set `cancelled` or `confirmed`.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  const role = session?.user?.role;
  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  }
  const { status, paidAtPickup } = parsed.data;

  // Enforce role limits on status transitions.
  const isManagerPlus = role === "MANAGER" || role === "ADMIN";
  if (status && status !== "completed" && !isManagerPlus) {
    return NextResponse.json(
      { error: "Your role can only mark bookings as completed." },
      { status: 403 },
    );
  }

  const existing = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.booking.update({
    where: { id: params.id },
    data: {
      ...(status ? { status } : {}),
      ...(paidAtPickup !== undefined ? { paidAtPickup } : {}),
    },
  });

  return NextResponse.json({
    id: updated.id,
    status: updated.status,
    paidAtPickup: updated.paidAtPickup,
  });
}
