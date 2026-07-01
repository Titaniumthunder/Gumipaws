import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const patchSchema = z.object({
  role: z.enum(["ADMIN", "MANAGER", "WORKER"]),
});

async function requireAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

/** Guard: never let the team drop below one Admin. */
async function wouldRemoveLastAdmin(targetId: string): Promise<boolean> {
  const admins = await prisma.staffUser.findMany({
    where: { role: "ADMIN" },
    select: { id: true },
  });
  return admins.length <= 1 && admins.some((a) => a.id === targetId);
}

/** PATCH — change a staff member's role. Admin only. */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Don't allow demoting the last remaining admin.
  if (parsed.data.role !== "ADMIN" && (await wouldRemoveLastAdmin(params.id))) {
    return NextResponse.json(
      { error: "You can't demote the last admin." },
      { status: 409 },
    );
  }

  const updated = await prisma.staffUser.update({
    where: { id: params.id },
    data: { role: parsed.data.role },
    select: { id: true, name: true, role: true },
  });
  return NextResponse.json(updated);
}

/** DELETE — remove a staff member. Admin only; can't remove the last admin. */
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (await wouldRemoveLastAdmin(params.id)) {
    return NextResponse.json(
      { error: "You can't remove the last admin." },
      { status: 409 },
    );
  }

  await prisma.staffUser.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
