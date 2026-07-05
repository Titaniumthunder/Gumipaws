"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "confirmed" | "cancelled" | "completed";

/**
 * Big, touch-friendly booking card for the shop tablet. Any staff role can mark
 * a booking completed and toggle "paid at pickup".
 */
export default function TodayCard({
  id,
  time,
  petName,
  size,
  breed,
  ownerName,
  selections,
  status,
  paidAtPickup,
}: {
  id: string;
  time: string;
  petName: string;
  size: string;
  breed: string;
  ownerName: string;
  selections: string;
  status: Status;
  paidAtPickup: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [localStatus, setLocalStatus] = useState<Status>(status);
  const [paid, setPaid] = useState(paidAtPickup);

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      // revert optimistic UI on failure
      setLocalStatus(status);
      setPaid(paidAtPickup);
    } finally {
      setBusy(false);
    }
  }

  const done = localStatus === "completed";
  const cancelled = localStatus === "cancelled";

  return (
    <div
      className={`rounded-3xl border p-5 shadow-card transition ${
        cancelled
          ? "border-red-200 bg-red-50/50 opacity-70"
          : "border-black/5 bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-heading text-2xl text-brown">{time}</div>
          <div className="mt-1 text-lg font-semibold text-brown">
            {petName}
          </div>
          <div className="text-sm text-brown-soft">
            {size} · {breed} · {ownerName}
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            done
              ? "bg-green-100 text-green-800"
              : cancelled
                ? "bg-red-100 text-red-700"
                : "bg-blush-light text-brown"
          }`}
        >
          {localStatus}
        </span>
      </div>

      <p className="mt-3 text-sm text-brown-soft">{selections}</p>

      {!cancelled && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy || done}
            onClick={() => {
              setLocalStatus("completed");
              patch({ status: "completed" });
            }}
            className="flex-1 rounded-2xl bg-brown px-4 py-3 text-sm font-semibold text-cream transition hover:bg-brown-soft disabled:opacity-40"
          >
            {done ? "✓ Completed" : "Mark completed"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              const next = !paid;
              setPaid(next);
              patch({ paidAtPickup: next });
            }}
            className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:opacity-40 ${
              paid
                ? "bg-green-600 text-white hover:bg-green-700"
                : "border border-black/10 bg-white text-brown hover:bg-cream-deep"
            }`}
          >
            {paid ? "✓ Paid" : "Mark paid"}
          </button>
        </div>
      )}
    </div>
  );
}
