import type { DefaultSession } from "next-auth";
import type { Role } from "../lib/access";

// Augment NextAuth types so `session.user.role` / `.id` and the JWT are typed.
declare module "next-auth" {
  interface User {
    role?: Role;
  }
  interface Session {
    user: {
      id?: string;
      role?: Role;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
    role?: Role;
  }
}
