import Link from "next/link";
import type { Role } from "@/lib/access";
import SignOutButton from "./SignOutButton";

/** Top bar for authenticated admin pages, with role-aware navigation. */
export default function AdminHeader({
  name,
  role,
}: {
  name?: string | null;
  role?: Role;
}) {
  const links: { href: string; label: string }[] = [
    { href: "/admin/today", label: "Today" },
    { href: "/admin/calendar", label: "Calendar" },
  ];
  if (role === "MANAGER" || role === "ADMIN") {
    links.push({ href: "/admin", label: "All bookings" });
  }
  if (role === "ADMIN") {
    links.push({ href: "/admin/staff", label: "Staff" });
  }

  return (
    <header className="border-b border-black/5 bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/today" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gumipaws-hero.png"
              alt="GumiPaws logo"
              className="h-8 w-8 rounded-full bg-cream-deep object-cover ring-1 ring-black/5"
            />
            <span className="font-heading text-lg text-brown">
              GumiPaws
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-brown-soft transition hover:bg-cream-deep hover:text-brown"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {name && (
            <span className="hidden text-sm text-brown-soft sm:inline">
              {name}
              {role && (
                <span className="ml-1 rounded-full bg-cream-deep px-2 py-0.5 text-xs font-semibold uppercase text-brown">
                  {role.toLowerCase()}
                </span>
              )}
            </span>
          )}
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
