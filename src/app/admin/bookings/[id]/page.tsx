import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  formatUSDPlus,
  packageLabel,
  summarizeSelections,
  totalPriceVaries,
} from "@/lib/booking/pricing";
import AdminHeader from "@/components/admin/AdminHeader";
import BookingControls from "@/components/admin/BookingControls";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function BookingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
  });
  if (!booking) notFound();

  const rows: [string, string][] = [
    ["Pet", `${booking.petName} · ${booking.size} · ${booking.breed}`],
    ["Package", packageLabel(booking.package)],
    ["Add-ons", summarizeSelections(null, booking.addOns)],
    ["Groomer", booking.groomerName],
    ["Date & time", `${booking.date} at ${booking.time}`],
    ["Owner", booking.ownerName],
    ["Phone", booking.phone],
    ["Email", booking.email],
    [
      "Estimated total",
      formatUSDPlus(
        Number(booking.estimatedTotal),
        totalPriceVaries(booking.package),
      ),
    ],
    ["Notes", booking.notes || "—"],
    ["Created", booking.createdAt.toLocaleString()],
  ];

  const hasSyncError = Boolean(
    booking.calendarSyncError || booking.emailSyncError,
  );

  return (
    <div className="min-h-screen bg-cream">
      <AdminHeader name={session?.user?.name} role={session?.user?.role} />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Link
          href="/admin"
          className="text-sm font-semibold text-brown-soft hover:text-brown"
        >
          ← Back to bookings
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-heading text-3xl text-brown">
            {booking.petName}&apos;s spa day
          </h1>
          <span className="text-sm text-brown-soft">#{booking.id}</span>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_300px]">
          {/* Details */}
          <div className="rounded-3xl bg-card p-6 shadow-card">
            <dl className="divide-y divide-black/5 text-sm">
              {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-3">
                  <dt className="shrink-0 font-medium text-brown-soft">{k}</dt>
                  <dd className="text-right text-brown">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Controls + sync status */}
          <aside className="space-y-6">
            <div className="rounded-3xl bg-card p-6 shadow-card">
              <h2 className="mb-4 font-heading text-lg text-brown">Manage</h2>
              <BookingControls
                id={booking.id}
                initialStatus={booking.status}
                initialPaid={booking.paidAtPickup}
                hasSyncError={hasSyncError}
                canRetry={session?.user?.role === "ADMIN"}
              />
            </div>

            {/* Integration health */}
            <div className="rounded-3xl bg-card p-6 shadow-card">
              <h2 className="mb-3 font-heading text-lg text-brown">
                Integrations
              </h2>
              <SyncLine
                label="Google Calendar"
                ok={!booking.calendarSyncError}
                detail={
                  booking.calendarSyncError ||
                  (booking.googleCalendarEventId
                    ? `Event ${booking.googleCalendarEventId.slice(0, 12)}…`
                    : "Synced")
                }
              />
              <SyncLine
                label="Confirmation email"
                ok={!booking.emailSyncError}
                detail={booking.emailSyncError || "Sent"}
              />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function SyncLine({
  label,
  ok,
  detail,
}: {
  label: string;
  ok: boolean;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-2 py-1.5 text-sm">
      <span aria-hidden className={ok ? "text-green-600" : "text-amber-600"}>
        {ok ? "✓" : "⚠"}
      </span>
      <div>
        <div className="font-medium text-brown">{label}</div>
        <div className="text-xs text-brown-soft">{detail}</div>
      </div>
    </div>
  );
}
