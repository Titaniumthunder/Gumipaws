"use client";

import { useState } from "react";

/**
 * Two-step cancel control for the public manage page. The first click reveals a
 * confirmation ("Yes, cancel" / "Keep booking") so a booking is never cancelled
 * on a single tap. Calls the token-gated cancel API.
 */
export default function CancelBooking({
  bookingId,
  token,
}: {
  bookingId: string;
  token: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cancel() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please call us.");
        setBusy(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please try again or call us.");
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-green-50 p-4 text-center text-sm text-green-800">
        Your booking has been cancelled. A confirmation email is on its way.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="w-full rounded-full border border-red-300 px-6 py-3 font-semibold text-red-700 transition hover:bg-red-50"
        >
          Cancel booking
        </button>
      ) : (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">
            Are you sure you want to cancel this booking?
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={cancel}
              disabled={busy}
              className="flex-1 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-70"
            >
              {busy ? "Cancelling…" : "Yes, cancel"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={busy}
              className="flex-1 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-brown transition hover:bg-cream-deep"
            >
              Keep booking
            </button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <p className="text-center text-xs text-brown-soft">
        Need to reschedule instead? Call us at (310) 555-0192
      </p>
    </div>
  );
}
