import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatUSD, summarizeSelections } from "@/lib/pricing";
import AdminHeader from "@/components/admin/AdminHeader";
import PaidToggle from "@/components/admin/PaidToggle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Search = {
  when?: string; // upcoming | past | all
  status?: string; // confirmed | cancelled | completed | all
  sort?: string; // asc | desc (by date)
};

function todayISO(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

function statusBadge(status: string): string {
  switch (status) {
    case "confirmed":
      return "bg-blush-light text-brown";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-cream-deep text-brown";
  }
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Search;
}) {
  const session = await auth();

  const when = searchParams.when ?? "upcoming";
  const status = searchParams.status ?? "all";
  const sort = searchParams.sort === "desc" ? "desc" : "asc";
  const today = todayISO();

  const where: Prisma.BookingWhereInput = {};
  if (when === "upcoming") where.date = { gte: today };
  else if (when === "past") where.date = { lt: today };
  if (status !== "all") {
    where.status = status as Prisma.BookingWhereInput["status"];
  }

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: [{ date: sort }, { time: sort }],
  });

  const hasSyncIssue = (b: (typeof bookings)[number]) =>
    Boolean(b.calendarSyncError || b.emailSyncError);

  // Helpers to build filter links preserving other params.
  const link = (patch: Partial<Search>) => {
    const params = new URLSearchParams({ when, status, sort, ...patch });
    return `/admin?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-cream">
      <AdminHeader name={session?.user?.name} role={session?.user?.role} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl text-brown">Bookings</h1>
            <p className="text-sm text-brown-soft">
              {bookings.length} booking{bookings.length === 1 ? "" : "s"}
            </p>
          </div>
          <Link
            href={link({ sort: sort === "asc" ? "desc" : "asc" })}
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-brown hover:bg-card"
          >
            Date {sort === "asc" ? "↑ oldest first" : "↓ newest first"}
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <FilterGroup
            label="When"
            options={[
              { key: "upcoming", label: "Upcoming" },
              { key: "past", label: "Past" },
              { key: "all", label: "All" },
            ]}
            active={when}
            hrefFor={(k) => link({ when: k })}
          />
          <FilterGroup
            label="Status"
            options={[
              { key: "all", label: "All" },
              { key: "confirmed", label: "Confirmed" },
              { key: "completed", label: "Completed" },
              { key: "cancelled", label: "Cancelled" },
            ]}
            active={status}
            hrefFor={(k) => link({ status: k })}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-3xl border border-black/5 bg-card shadow-card">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-black/5 text-xs uppercase tracking-wide text-brown-soft">
              <tr>
                <th className="px-4 py-3">Date / time</th>
                <th className="px-4 py-3">Pet</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Package &amp; add-ons</th>
                <th className="px-4 py-3">Est. total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Paid</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {bookings.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-brown-soft"
                  >
                    No bookings match these filters.
                  </td>
                </tr>
              )}
              {bookings.map((b) => (
                <tr key={b.id} className="align-middle hover:bg-cream/50">
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="font-medium text-brown">{b.date}</div>
                    <div className="text-brown-soft">{b.time}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-brown">{b.petName}</div>
                    <div className="text-xs text-brown-soft">
                      {b.size} · {b.breed}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-brown">{b.ownerName}</div>
                    <div className="text-xs text-brown-soft">{b.phone}</div>
                  </td>
                  <td className="max-w-[220px] px-4 py-3 text-brown-soft">
                    {summarizeSelections(b.package, b.addOns)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-brown">
                    {formatUSD(Number(b.estimatedTotal))}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(
                        b.status,
                      )}`}
                    >
                      {b.status}
                    </span>
                    {hasSyncIssue(b) && (
                      <span
                        title="Calendar or email sync failed"
                        className="ml-1 text-amber-600"
                      >
                        ⚠
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <PaidToggle id={b.id} initial={b.paidAtPickup} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="font-semibold text-blush hover:underline"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function FilterGroup({
  label,
  options,
  active,
  hrefFor,
}: {
  label: string;
  options: { key: string; label: string }[];
  active: string;
  hrefFor: (key: string) => string;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-brown-soft">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <Link
            key={o.key}
            href={hrefFor(o.key)}
            className={[
              "rounded-full px-3 py-1.5 text-sm font-medium transition",
              active === o.key
                ? "bg-blush text-white shadow-card"
                : "bg-card text-brown hover:bg-cream-deep",
            ].join(" ")}
          >
            {o.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
