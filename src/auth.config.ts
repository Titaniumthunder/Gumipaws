import type { NextAuthConfig } from "next-auth";
import type { Role } from "./lib/access";

/**
 * Edge-safe auth config. Contains NO database or bcrypt imports so it can run
 * inside middleware on the edge runtime. The Credentials provider (which queries
 * the DB) lives in `auth.ts`. Role-based route gating lives in `middleware.ts`.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // Persist the staff member's id + role onto the JWT at sign-in.
    jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = user.role;
        token.name = user.name ?? token.name;
      }
      return token;
    },
    // Expose id + role on the session for server components and middleware.
    // (token fields are cast: v5 sources JWT typing from @auth/core/jwt.)
    session({ session, token }) {
      if (session.user) {
        if (typeof token.uid === "string") session.user.id = token.uid;
        if (token.role) session.user.role = token.role as Role;
      }
      return session;
    },
  },
  providers: [], // Real provider added in auth.ts.
} satisfies NextAuthConfig;
