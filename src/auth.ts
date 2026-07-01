import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { prisma } from "./lib/prisma";
import {
  getClientIp,
  checkRateLimit,
  recordFailure,
  resetRateLimit,
} from "./lib/rate-limit";

/**
 * Staff authenticate with a short numeric PIN only (no email/username). The PIN
 * is bcrypt-compared against every StaffUser (small team) to resolve identity
 * and role. Login is IP rate-limited to blunt brute-forcing of short PINs.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        pin: { label: "PIN", type: "password" },
      },
      async authorize(credentials, request) {
        const pin =
          typeof credentials?.pin === "string" ? credentials.pin.trim() : "";
        // PINs are 3–10 digits; reject anything else without touching the DB.
        if (!/^\d{3,10}$/.test(pin)) return null;

        const ip = getClientIp(request);
        if (checkRateLimit(ip).locked) {
          // Too many recent failures — refuse without checking the PIN.
          return null;
        }

        const staff = await prisma.staffUser.findMany();
        for (const member of staff) {
          if (await bcrypt.compare(pin, member.pinHash)) {
            resetRateLimit(ip);
            return { id: member.id, name: member.name, role: member.role };
          }
        }

        // Wrong PIN — count it toward the lockout threshold.
        recordFailure(ip);
        return null;
      },
    }),
  ],
});
