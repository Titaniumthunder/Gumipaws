import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { summarizeSelections } from "@/lib/booking/pricing";
import AdminHeader from "@/components/admin/AdminHeader";
import TodayCard from "@/components/admin/TodayCard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function todayISO(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export default async function TodayPage() {
  const session = await auth();
  const today = todayISO();

  const bookings = await prisma.booking.findMany({
    where: { date: today },
    orderBy: { time: "asc" },
  });

  return (
    <div className="min-h-screen bg-cream">
      <AdminHeader name={session?.user?.name} role={session?.user?.role} />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="font-heading text-3xl text-brown">Today</h1>
          <p className="text-sm text-brown-soft">
            {today} · {bookings.length} booking
            {bookings.length === 1 ? "" : "s"}
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-3xl bg-card p-10 text-center text-brown-soft shadow-card">
            No bookings scheduled for today. 🐾
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {bookings.map((b) => (
              <TodayCard
                key={b.id}
                id={b.id}
                time={b.time}
                petName={b.petName}
                size={b.size}
                breed={b.breed}
                ownerName={b.ownerName}
                selections={summarizeSelections(b.package, b.addOns)}
                status={b.status}
                paidAtPickup={b.paidAtPickup}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
