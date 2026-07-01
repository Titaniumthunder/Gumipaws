import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";
import { requiredRoles } from "./lib/access";

// Edge middleware uses the DB-free config; it only reads the JWT cookie.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // The login page is always reachable.
  if (pathname === "/admin/login") return NextResponse.next();

  const user = req.auth?.user;

  // Unauthenticated → redirect to login, preserving where they were headed.
  if (!user) {
    const url = new URL("/admin/login", req.nextUrl);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Authenticated but wrong role → 403 (not a redirect, so the mismatch is clear).
  const roles = requiredRoles(pathname);
  if (roles && !(user.role && roles.includes(user.role))) {
    return new NextResponse(
      "403 — You don't have access to this page.",
      { status: 403, headers: { "content-type": "text/plain" } },
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
