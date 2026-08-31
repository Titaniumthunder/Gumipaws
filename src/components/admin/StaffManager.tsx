"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/auth/access";

type Staff = { id: string; name: string; role: Role };

const ROLES: Role[] = ["ADMIN", "MANAGER", "WORKER"];

export default function StaffManager({ initial }: { initial: Staff[] }) {
  const router = useRouter();
  const [staff, setStaff] = useState<Staff[]>(initial);
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("WORKER");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // The one-time PIN shown right after creating a staff member.
  const [newPin, setNewPin] = useState<{ name: string; pin: string } | null>(
    null,
  );

  async function addStaff(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    setNewPin(null);
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error);
      setStaff((s) => [...s, { id: data.id, name: data.name, role: data.role }]);
      setNewPin({ name: data.name, pin: data.pin });
      setName("");
      setRole("WORKER");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add staff.");
    } finally {
      setBusy(false);
    }
  }

  async function changeRole(id: string, nextRole: Role) {
    setError(null);
    const prev = staff;
    setStaff((s) => s.map((m) => (m.id === id ? { ...m, role: nextRole } : m)));
    try {
      const res = await fetch(`/api/admin/staff/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: nextRole }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error);
      }
      router.refresh();
    } catch (err) {
      setStaff(prev); // revert
      setError(err instanceof Error ? err.message : "Could not change role.");
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this staff member? Their PIN will stop working.")) {
      return;
    }
    setError(null);
    try {
      const res = await fetch(`/api/admin/staff/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error);
      }
      setStaff((s) => s.filter((m) => m.id !== id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove staff.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Newly-created PIN banner (shown once) */}
      {newPin && (
        <div className="rounded-2xl border border-gold/40 bg-blush-light/60 p-4">
          <p className="text-sm text-brown">
            <span className="font-semibold">{newPin.name}</span>&apos;s PIN is{" "}
            <span className="font-heading text-xl tracking-widest text-brown">
              {newPin.pin}
            </span>
          </p>
          <p className="mt-1 text-xs text-brown-soft">
            Write it down and hand it over now — for security it won&apos;t be
            shown again.
          </p>
        </div>
      )}

      {/* Add staff */}
      <form
        onSubmit={addStaff}
        className="rounded-3xl bg-card p-5 shadow-card sm:flex sm:items-end sm:gap-3"
      >
        <label className="block flex-1 space-y-1.5">
          <span className="text-sm font-medium text-brown">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Maria"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 outline-none focus:border-blush focus:ring-2 focus:ring-blush/30"
          />
        </label>
        <label className="mt-3 block space-y-1.5 sm:mt-0">
          <span className="text-sm font-medium text-brown">Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 outline-none focus:border-blush focus:ring-2 focus:ring-blush/30"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0) + r.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={busy}
          className="mt-3 w-full rounded-full bg-blush px-6 py-2.5 font-semibold text-white shadow-card transition hover:bg-blush/90 disabled:opacity-70 sm:mt-0 sm:w-auto"
        >
          {busy ? "Adding…" : "Add staff"}
        </button>
      </form>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Staff list */}
      <div className="overflow-hidden rounded-3xl border border-black/5 bg-card shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/5 text-xs uppercase tracking-wide text-brown-soft">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {staff.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-3 font-medium text-brown">{m.name}</td>
                <td className="px-4 py-3">
                  <select
                    value={m.role}
                    onChange={(e) => changeRole(m.id, e.target.value as Role)}
                    className="rounded-lg border border-black/10 bg-white px-2 py-1.5 text-sm outline-none focus:border-blush"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r.charAt(0) + r.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => remove(m.id)}
                    className="text-sm font-semibold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
