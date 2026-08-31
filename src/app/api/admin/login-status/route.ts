import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { checkRateLimit, ipFromHeaders } from "@/lib/auth/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/login-status — lets the PIN pad show a lockout / remaining-
 * attempts hint. Reports the rate-limit state for the caller's IP.
 */
export async function GET() {
  const ip = ipFromHeaders(headers());
  return NextResponse.json(checkRateLimit(ip));
}
