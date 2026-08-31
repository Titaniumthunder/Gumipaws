import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  formatUSDPlus,
  packageLabel,
  PRICE_DISCLAIMER,
  summarizeSelections,
  totalPriceVaries,
} from "@/lib/booking/pricing";

export const runtime = "nodejs";
// Always read fresh from the DB (survives refresh, not cached).
export const dynamic = "force-dynamic";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const id = searchParams.id;
  if (!id) notFound();

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) notFound();

  const rows: [string, string][] = [
    ["Pet", `${booking.petName} · ${booking.size} · ${booking.breed}`],
    ["Package", packageLabel(booking.package)],
    ["Add-ons", summarizeSelections(null, booking.addOns)],
    ["Groomer", booking.groomerName],
    ["Date & time", `${booking.date} at ${booking.time}`],
    ["Name", booking.ownerName],
    ["Phone", booking.phone],
    ["Email", booking.email],
  ];
  if (booking.notes) rows.push(["Notes", booking.notes]);

  return (
    <main className="min-h-screen bg-cream px-4 py-16">
      <div className="mx-auto max-w-lg">
        <div className="rounded-4xl bg-card p-8 shadow-soft">
          <div className="text-center">
            <span
              aria-hidden
              className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blush text-2xl text-white"
            >
              ✓
            </span>
            <h1 className="mt-4 font-heading text-3xl text-brown">
              You&apos;re booked!
            </h1>
            <p className="mt-2 text-brown-soft">
              A confirmation is on its way to {booking.email}. We can&apos;t wait
              to pamper {booking.petName}.
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

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-blush/40 bg-blush-light/50 p-4">
            <span className="font-heading text-lg text-brown">
              Estimated total
            </span>
            <span className="font-heading text-xl text-brown">
              {formatUSDPlus(
                Number(booking.estimatedTotal),
                totalPriceVaries(booking.package),
              )}
            </span>
          </div>
          <p className="mt-2 text-xs text-brown-soft">{PRICE_DISCLAIMER}</p>

          <Link
            href="/"
            className="mt-6 block rounded-full bg-blush px-6 py-3 text-center font-semibold text-white shadow-card transition hover:bg-blush/90"
          >
            Back to home
          </Link>
          <Link
            href={`/booking/manage/${booking.cancellationToken}`}
            className="mt-3 block text-center text-sm text-brown-soft underline-offset-4 hover:text-brown hover:underline"
          >
            Need to cancel this booking?
          </Link>
        </div>
      </div>
    </main>
  );
}
