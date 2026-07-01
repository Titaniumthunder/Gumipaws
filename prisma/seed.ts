import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

/**
 * Seeds the initial ADMIN staff member from ADMIN_NAME / ADMIN_PIN.
 * Run with: `npx prisma db seed`
 *
 * Idempotent-ish: if an admin with the same name already exists, its PIN/role
 * are refreshed; otherwise a new admin is created. (Staff have no unique login
 * field other than the PIN, so we key on name here for the seed only.)
 */
const prisma = new PrismaClient();

async function main() {
  const name = process.env.ADMIN_NAME?.trim();
  const pin = process.env.ADMIN_PIN?.trim();

  if (!name || !pin) {
    throw new Error(
      "ADMIN_NAME and ADMIN_PIN must be set in the environment to seed the initial admin.",
    );
  }
  if (!/^\d{3,10}$/.test(pin)) {
    throw new Error("ADMIN_PIN must be 3–10 digits.");
  }

  const pinHash = await bcrypt.hash(pin, 12);

  const existing = await prisma.staffUser.findFirst({ where: { name } });
  if (existing) {
    await prisma.staffUser.update({
      where: { id: existing.id },
      data: { pinHash, role: "ADMIN" },
    });
    console.log(`✓ Updated existing admin: ${name}`);
  } else {
    await prisma.staffUser.create({
      data: { name, pinHash, role: "ADMIN" },
    });
    console.log(`✓ Seeded admin: ${name}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
