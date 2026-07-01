"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Inline "paid at pickup" checkbox for the admin table. Optimistically flips,
 * PATCHes the booking, and reverts on error.
 */
export default function PaidToggle({
  id,
  initial,
}: {
  id: string;
  initial: boolean;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    const next = !checked;
    setChecked(next);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paidAtPickup: next }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setChecked(!next); // revert
    } finally {
      setBusy(false);
    }
  }

  return (
    <input
      type="checkbox"
      checked={checked}
      disabled={busy}
      onChange={toggle}
      aria-label="Paid at pickup"
      className="h-4 w-4 cursor-pointer accent-blush disabled:opacity-50"
    />
  );
}
