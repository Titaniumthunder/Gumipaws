import { handlers } from "@/auth";

// NextAuth route handlers for sign-in / sign-out / session / callback.
export const runtime = "nodejs";
export const { GET, POST } = handlers;
