"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-brown transition hover:bg-cream-deep"
    >
      Sign out
    </button>
  );
}
