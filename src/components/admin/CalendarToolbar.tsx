"use client";

import { useRouter } from "next/navigation";

/**
 * Date navigation for the admin calendar: view toggle, prev/today/next,
 * month picker, jump-to-date, and a clickable strip of the week's days with
 * per-day booking counts — so staff can jump straight to a date instead of
 * paging with prev/next.
 */
export default function CalendarToolbar({
  view,
  date,
  today,
  prev,
  next,
  weekDays,
  counts,
}: {
  view: "week" | "day";
  date: string;
  today: string;
  prev: string;
  next: string;
  weekDays: string[];
  counts: Record<string, number>;
}) {
  const router = useRouter();
  const go = (v: string, d: string) =>
    router.push(`/admin/calendar?view=${v}&date=${d}`);

  // Month options: 2 back, 10 forward from today.
  const [ty, tm] = today.split("-").map(Number);
  const months = Array.from({ length: 13 }, (_, i) => {
    const idx = ty * 12 + (tm - 1) + (i - 2);
    const y = Math.floor(idx / 12);
    const m = idx % 12;
    const iso = `${y}-${String(m + 1).padStart(2, "0")}-01`;
    const label = new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
    return { iso, label };
  });
  const currentMonth = `${date.slice(0, 7)}-01`;

  const navBtn =
    "rounded-full border border-black/10 bg-card px-3 py-1.5 text-sm font-medium text-brown transition hover:border-blush/50";
  const toggleBtn = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-sm font-medium transition ${
      active ? "bg-brown text-cream" : "bg-card text-brown-soft hover:text-brown"
    }`;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-full bg-cream-deep p-1">
          <button type="button" onClick={() => go("week", date)} className={toggleBtn(view === "week")}>
            Week
          </button>
          <button type="button" onClick={() => go("day", date)} className={toggleBtn(view === "day")}>
            Day
          </button>
        </div>

        <button type="button" onClick={() => go(view, prev)} className={navBtn} aria-label="Previous">
          ‹
        </button>
        <button type="button" onClick={() => go(view, today)} className={navBtn}>
          Today
        </button>
        <button type="button" onClick={() => go(view, next)} className={navBtn} aria-label="Next">
          ›
        </button>

        <select
          value={months.some((m) => m.iso === currentMonth) ? currentMonth : ""}
          onChange={(e) => e.target.value && go(view, e.target.value)}
          className="rounded-full border border-black/10 bg-card px-3 py-1.5 text-sm font-medium text-brown outline-none transition hover:border-blush/50 focus:border-blush"
          aria-label="Jump to month"
        >
          {!months.some((m) => m.iso === currentMonth) && (
            <option value="">{date.slice(0, 7)}</option>
          )}
          {months.map((m) => (
            <option key={m.iso} value={m.iso}>
              {m.label}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => e.target.value && go(view, e.target.value)}
          className="rounded-full border border-black/10 bg-card px-3 py-1 text-sm font-medium text-brown outline-none transition hover:border-blush/50 focus:border-blush"
          aria-label="Jump to date"
        />
      </div>

      {/* Day strip — the week at a glance, with booking counts */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {weekDays.map((d) => {
          const dt = new Date(`${d}T00:00:00Z`);
          const active = view === "day" && d === date;
          const isToday = d === today;
          const n = counts[d] ?? 0;
          return (
            <button
              key={d}
              type="button"
              onClick={() => go("day", d)}
              className={[
                "flex min-w-[76px] flex-col items-center rounded-2xl border px-3 py-2 transition",
                active
                  ? "border-brown bg-brown text-cream"
                  : isToday
                    ? "border-blush/60 bg-blush/15 text-brown hover:border-blush"
                    : "border-black/10 bg-card text-brown hover:border-blush/50",
              ].join(" ")}
            >
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider ${
                  active ? "text-cream/70" : "text-brown-soft"
                }`}
              >
                {dt.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" })}
              </span>
              <span className="font-heading text-lg leading-tight">
                {dt.getUTCDate()}
              </span>
              <span
                className={`text-[10px] ${
                  active
                    ? "text-cream/80"
                    : n > 0
                      ? "font-semibold text-blush"
                      : "text-brown-soft/60"
                }`}
              >
                {n > 0 ? `${n} appt${n === 1 ? "" : "s"}` : "free"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
