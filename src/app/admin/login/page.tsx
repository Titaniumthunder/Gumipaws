"use client";

import { useCallback, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { ROLE_HOME, type Role } from "@/lib/auth/access";

const PIN_MAX = 10;

export default function AdminLoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);

  // Reflect server-side lockout state (per IP).
  const refreshStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/login-status", { cache: "no-store" });
      if (!res.ok) return;
      const s = await res.json();
      setLocked(Boolean(s.locked));
      if (s.locked) {
        const mins = Math.ceil((s.retryAfterSeconds ?? 0) / 60);
        setError(`Too many attempts. Try again in about ${mins} minute${mins === 1 ? "" : "s"}.`);
      }
    } catch {
      /* non-fatal */
    }
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const press = (digit: string) =>
    setPin((p) => (p.length >= PIN_MAX ? p : p + digit));
  const backspace = () => setPin((p) => p.slice(0, -1));
  const clear = () => setPin("");

  async function submit() {
    if (pin.length < 3) {
      setError("Enter your PIN.");
      return;
    }
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", { pin, redirect: false });

    if (res?.error) {
      setPin("");
      setLoading(false);
      await refreshStatus();
      if (!locked) setError("Incorrect PIN. Please try again.");
      return;
    }

    // Resolve role to route to the right home (Worker → today, else dashboard).
    try {
      const session = await fetch("/api/auth/session", {
        cache: "no-store",
      }).then((r) => r.json());
      const role = session?.user?.role as Role | undefined;
      window.location.href = role ? ROLE_HOME[role] : "/admin/today";
    } catch {
      window.location.href = "/admin/today";
    }
  }

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <main className="grid min-h-screen place-items-center bg-cream px-4">
      <div className="w-full max-w-xs">
        <div className="mb-6 text-center">
          <span
            aria-hidden
            className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-blush text-xl text-white"
          >
            🐾
          </span>
          <h1 className="mt-3 font-heading text-2xl text-brown">
            GumiPaws staff
          </h1>
          <p className="text-sm text-brown-soft">Enter your PIN</p>
        </div>

        {/* PIN dots */}
        <div
          className="mb-5 flex justify-center gap-2"
          aria-label={`PIN, ${pin.length} digits entered`}
        >
          {Array.from({ length: Math.max(4, pin.length) }).map((_, i) => (
            <span
              key={i}
              className={`h-3 w-3 rounded-full ${
                i < pin.length ? "bg-blush" : "bg-cream-deep"
              }`}
            />
          ))}
        </div>

        {error && (
          <p role="alert" className="mb-4 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3">
          {keys.map((k) => (
            <KeypadButton key={k} onClick={() => press(k)} disabled={locked}>
              {k}
            </KeypadButton>
          ))}
          <KeypadButton onClick={clear} disabled={locked} subtle>
            Clear
          </KeypadButton>
          <KeypadButton onClick={() => press("0")} disabled={locked}>
            0
          </KeypadButton>
          <KeypadButton onClick={backspace} disabled={locked} subtle>
            ⌫
          </KeypadButton>
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={loading || locked || pin.length < 3}
          className="mt-5 w-full rounded-full bg-blush px-6 py-3 font-semibold text-white shadow-card transition hover:bg-blush/90 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </div>
    </main>
  );
}

function KeypadButton({
  children,
  onClick,
  disabled,
  subtle,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  subtle?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "grid h-16 place-items-center rounded-2xl text-xl font-semibold shadow-card transition active:scale-95 disabled:opacity-40",
        subtle
          ? "bg-cream-deep text-brown-soft"
          : "bg-card text-brown hover:bg-white",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
