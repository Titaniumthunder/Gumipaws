"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "confirmed" | "cancelled" | "completed";

/**
 * Admin controls on the booking detail page: change status, toggle
 * paid-at-pickup, and retry a failed Calendar/email sync.
 */
export default function BookingControls({
  id,
  initialStatus,
  initialPaid,
  hasSyncError,
  canRetry,
}: {
  id: string;
  initialStatus: Status;
  initialPaid: boolean;
  hasSyncError: boolean;
  /** Only Admins may retry third-party sync. */
  canRetry: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [paid, setPaid] = useState(initialPaid);
  const [saving, setSaving] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function patch(body: Record<string, unknown>) {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      setMessage("Saved.");
      router.refresh();
    } catch {
      setMessage("Could not save — please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function retrySync() {
    setRetrying(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/bookings/${id}/retry-sync`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      const stillFailing = data.calendarSyncError || data.emailSyncError;
      setMessage(
        stillFailing
          ? "Retry ran, but some syncs still failed. See details above."
          : "Sync succeeded! 🎉",
      );
      router.refresh();
    } catch {
      setMessage("Retry failed — please try again.");
    } finally {
      setRetrying(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Status */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-brown">
          Status
        </label>
        <select
          value={status}
          disabled={saving}
          onChange={(e) => {
            const next = e.target.value as Status;
            setStatus(next);
            patch({ status: next });
          }}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 outline-none focus:border-blush focus:ring-2 focus:ring-blush/30"
        >
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Paid at pickup */}
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={paid}
          disabled={saving}
          onChange={(e) => {
            setPaid(e.target.checked);
            patch({ paidAtPickup: e.target.checked });
          }}
          className="h-5 w-5 cursor-pointer accent-blush"
        />
        <span className="text-sm font-medium text-brown">
          Paid at pickup
        </span>
      </label>

      {/* Retry sync (Admin only) */}
      {hasSyncError && canRetry && (
        <button
          type="button"
          onClick={retrySync}
          disabled={retrying}
          className="w-full rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-70"
        >
          {retrying ? "Retrying…" : "Retry calendar / email sync"}
        </button>
      )}

      {message && <p className="text-sm text-brown-soft">{message}</p>}
    </div>
  );
}
