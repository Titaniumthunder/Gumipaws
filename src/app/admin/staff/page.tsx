import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AdminHeader from "@/components/admin/AdminHeader";
import StaffManager from "@/components/admin/StaffManager";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const session = await auth();

  const staff = await prisma.staffUser.findMany({
    select: { id: true, name: true, role: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="min-h-screen bg-cream">
      <AdminHeader name={session?.user?.name} role={session?.user?.role} />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="font-heading text-3xl text-brown">Staff</h1>
          <p className="text-sm text-brown-soft">
            Add or remove staff and set roles. New staff get an auto-generated
            4-digit PIN, shown once.
          </p>
        </div>

        <StaffManager initial={staff} />
      </main>
    </div>
  );
}
