import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatUSD, packageLabel, summarizeSelections } from "@/lib/pricing";
import CancelBooking from "@/components/booking/CancelBooking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-cream px-4 py-16">
      <div className="mx-auto max-w-lg">
        <div className="rounded-4xl bg-card p-8 shadow-soft">{children}</div>
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-brown-soft hover:text-brown">
            ← Back to GumiPaws
          </Link>
        </p>
      </div>
    </main>
  );
}

export default async function ManageBookingPage({
  params,
}: {
  params: { token: string };
}) {
  // Look up strictly by the unguessable token.
  const booking = await prisma.booking.findUnique({
    where: { cancellationToken: params.token },
  });

  // Generic not-found — don't reveal whether a token almost matched.
  if (!booking) {
    return (
      <Shell>
        <h1 className="font-heading text-2xl text-brown">
          Booking not found
        </h1>
        <p className="mt-2 text-brown-soft">
          We couldn&apos;t find a booking for this link. If you think this is a
          mistake, please call us at (310) 555-0192.
        </p>
      </Shell>
    );
  }

  const rows: [string, string][] = [
    ["Pet", `${booking.petName} · ${booking.size} · ${booking.breed}`],
    ["Package", packageLabel(booking.package)],
    ["Add-ons", summarizeSelections(null, booking.addOns)],
    ["Groomer", booking.groomerName],
    ["Date & time", `${booking.date} at ${booking.time}`],
    ["Name", booking.ownerName],
    ["Estimated total", formatUSD(Number(booking.estimatedTotal))],
  ];

  const isCancellable = booking.status === "confirmed";

  return (
    <Shell>
      <div className="text-center">
        <h1 className="font-heading text-3xl text-brown">
          Manage your booking
        </h1>
        <p className="mt-1 text-brown-soft">
          {booking.petName}&apos;s spa day
        </p>
      </div>

      <dl className="mt-6 divide-y divide-black/5 rounded-2xl bg-cream/60 p-4 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-2">
            <dt className="shrink-0 font-medium text-brown-soft">{k}</dt>
            <dd className="text-right text-brown">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        {isCancellable ? (
          <CancelBooking
            bookingId={booking.id}
            token={booking.cancellationToken}
          />
        ) : (
          <div
            className={`rounded-2xl p-4 text-center text-sm ${
              booking.status === "cancelled"
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-800"
            }`}
          >
            This booking is{" "}
            <span className="font-semibold">{booking.status}</span>.
            {booking.status === "completed" &&
              " Thanks for visiting GumiPaws!"}
            {booking.status === "cancelled" &&
              " Call (310) 555-0192 if you'd like to rebook."}
          </div>
        )}
      </div>
    </Shell>
  );
}
