import { randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const createSchema = z.object({
  name: z.string().trim().min(1).max(80),
  role: z.enum(["ADMIN", "MANAGER", "WORKER"]),
});

async function requireAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

/** Generate a random 4-digit PIN not already in use by any staff member. */
async function generateUniquePin(
  existingHashes: string[],
): Promise<{ pin: string; pinHash: string }> {
  for (let attempt = 0; attempt < 50; attempt++) {
    const pin = String(randomInt(0, 10000)).padStart(4, "0");
    // Ensure no existing staff already has this PIN (can't index bcrypt hashes).
    let clash = false;
    for (const hash of existingHashes) {
      if (await bcrypt.compare(pin, hash)) {
        clash = true;
        break;
      }
    }
    if (!clash) {
      const pinHash = await bcrypt.hash(pin, 12);
      return { pin, pinHash };
    }
  }
  throw new Error("Could not allocate a unique PIN. Remove unused staff.");
}

/** GET — list staff (no hashes). Admin only. */
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const staff = await prisma.staffUser.findMany({
    select: { id: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ staff });
}

/**
 * POST — create a staff member with an auto-generated 4-digit PIN.
 * The plaintext PIN is returned ONCE so the admin can hand it over.
 */
export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Name and role are required." },
      { status: 400 },
    );
  }

  const existing = await prisma.staffUser.findMany({ select: { pinHash: true } });
  const { pin, pinHash } = await generateUniquePin(
    existing.map((s) => s.pinHash),
  );

  const created = await prisma.staffUser.create({
    data: { name: parsed.data.name, role: parsed.data.role, pinHash },
    select: { id: true, name: true, role: true },
  });

  // `pin` is included exactly once; it is never retrievable again.
  return NextResponse.json({ ...created, pin }, { status: 201 });
}
