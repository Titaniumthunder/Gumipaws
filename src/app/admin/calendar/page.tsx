import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { summarizeSelections } from "@/lib/pricing";
import { GROOMERS } from "@/lib/booking-constants";
import {
  listCalendarEvents,
  type ExternalCalendarEvent,
} from "@/lib/google-calendar";
import AdminHeader from "@/components/admin/AdminHeader";
import CalendarToolbar from "@/components/admin/CalendarToolbar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Scheduling calendar (Google Calendar-style time grid).
 *  - Week view: day columns; Day view: groomer columns (MoeGo-style).
 *  - Bookings come from the DB; the same window is also read from the business
 *    Google Calendar so manually-added events (blocks, vacations, personal
 *    appointments) appear alongside bookings. Synced booking events are
 *    deduplicated via booking.googleCalendarEventId.
 *  - Concurrent appointments are expected (different groomers) — overlapping
 *    cards share the column via lane layout.
 */

const TIME_ZONE = process.env.BUSINESS_TIME_ZONE || "America/Los_Angeles";
/** Grid window: 8:00am – 5:30pm (bookings run 9:00–4:30). */
const GRID_START = 8 * 60;
const GRID_END = 17.5 * 60;
const GRID_SPAN = GRID_END - GRID_START;
/** Appointments block 90 minutes (mirrors google-calendar.ts). */
const APPOINTMENT_MINUTES = 90;
const GRID_HEIGHT_PX = 780;

/* ------------------------------------------------------------- date utils */

function todayISO(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Monday-start week containing the given date. */
function weekOf(iso: string): string[] {
  const d = new Date(`${iso}T00:00:00Z`);
  const dow = (d.getUTCDay() + 6) % 7;
  const monday = addDays(iso, -dow);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

function dayLabel(iso: string): { weekday: string; day: string } {
  const d = new Date(`${iso}T00:00:00Z`);
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
    day: d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
  };
}

/** "9:00am" → minutes since midnight. */
function slotToMinutes(label: string): number {
  const m = label.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (!m) return GRID_START;
  let h = parseInt(m[1], 10);
  if (m[3].toLowerCase() === "pm" && h !== 12) h += 12;
  if (m[3].toLowerCase() === "am" && h === 12) h = 0;
  return h * 60 + parseInt(m[2], 10);
}

function minutesToLabel(mins: number): string {
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const suffix = h24 < 12 ? "am" : "pm";
  return m === 0 ? `${h12}${suffix}` : `${h12}:${String(m).padStart(2, "0")}${suffix}`;
}

/** Current { date, minutes } in the business timezone (for the "now" line). */
function nowInBusinessTZ(): { date: string; minutes: number } {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const p = Object.fromEntries(fmt.formatToParts(new Date()).map((x) => [x.type, x.value]));
  const hour = p.hour === "24" ? 0 : parseInt(p.hour, 10);
  return {
    date: `${p.year}-${p.month}-${p.day}`,
    minutes: hour * 60 + parseInt(p.minute, 10),
  };
}

/* ----------------------------------------------------------- grid entries */

interface GridEntry {
  key: string;
  title: string;
  /** Extra detail lines under the time range (services, groomer, …). */
  lines: string[];
  startMinutes: number;
  endMinutes: number;
  /** Internal link (booking detail) — rendered with <Link>. */
  href?: string;
  /** External link (Google Calendar) — rendered with <a target="_blank">. */
  externalHref?: string;
  groomer?: string;
  cancelled?: boolean;
  paid?: boolean;
  external?: boolean;
  lane?: number;
  lanes?: number;
}

/** Greedy lane assignment so overlapping entries sit side by side. */
function layoutLanes(entries: GridEntry[]): GridEntry[] {
  const sorted = [...entries].sort(
    (a, b) => a.startMinutes - b.startMinutes || a.endMinutes - b.endMinutes,
  );
  const laneEnds: number[] = [];
  for (const e of sorted) {
    let lane = laneEnds.findIndex((end) => end <= e.startMinutes);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(0);
    }
    laneEnds[lane] = e.endMinutes;
    e.lane = lane;
  }
  for (const e of sorted) {
    const overlapping = sorted.filter(
      (o) => o.startMinutes < e.endMinutes && o.endMinutes > e.startMinutes,
    );
    e.lanes = Math.max(...overlapping.map((o) => (o.lane ?? 0) + 1));
  }
  return sorted;
}

const GROOMER_COLORS: Record<string, string> = {
  Maria: "border-blush/50 bg-blush/15 hover:bg-blush/25",
  Sam: "border-gold/50 bg-gold/15 hover:bg-gold/25",
  Jordan: "border-sky-300 bg-sky-100 hover:bg-sky-200",
  Nicole: "border-emerald-300 bg-emerald-100 hover:bg-emerald-200",
  Donna: "border-violet-300 bg-violet-100 hover:bg-violet-200",
  "Any available": "border-black/15 bg-cream-deep hover:bg-cream",
};

function entryClasses(e: GridEntry): string {
  if (e.external) return "border-black/10 bg-white/80 hover:bg-white";
  if (e.cancelled) return "border-black/10 bg-white/60 opacity-50";
  return GROOMER_COLORS[e.groomer ?? ""] ?? "border-black/15 bg-cream-deep";
}

/* ------------------------------------------------------------- components */

function EntryCard({ e }: { e: GridEntry }) {
  const top = ((Math.max(e.startMinutes, GRID_START) - GRID_START) / GRID_SPAN) * 100;
  const height =
    ((Math.min(e.endMinutes, GRID_END) - Math.max(e.startMinutes, GRID_START)) /
      GRID_SPAN) *
    100;
  const lanes = e.lanes ?? 1;
  const width = 100 / lanes;
  const style = {
    top: `${top}%`,
    height: `calc(${Math.max(height, 4)}% - 2px)`,
    left: `${(e.lane ?? 0) * width}%`,
    width: `calc(${width}% - 3px)`,
  };
  const tooltip = [
    e.title,
    `${minutesToLabel(e.startMinutes)}–${minutesToLabel(e.endMinutes)}`,
    ...e.lines,
  ].join("\n");
  const inner = (
    <>
      <div className="truncate text-xs font-bold leading-snug text-brown">
        {e.cancelled ? <s>{e.title}</s> : e.title}
        {e.paid && (
          <span title="Paid" className="ml-1 text-emerald-600">
            ✓
          </span>
        )}
      </div>
      <div className="truncate text-[10px] leading-snug text-brown-soft">
        {minutesToLabel(e.startMinutes)}–{minutesToLabel(e.endMinutes)}
      </div>
      {e.lines.map((line, i) => (
        <div key={i} className="truncate text-[10px] leading-snug text-brown-soft">
          {line}
        </div>
      ))}
    </>
  );
  const cls = `absolute overflow-hidden rounded-lg border px-1.5 py-1 shadow-sm transition ${entryClasses(e)}`;
  if (e.href) {
    return (
      <Link href={e.href} className={cls} style={style} title={tooltip}>
        {inner}
      </Link>
    );
  }
  if (e.externalHref) {
    return (
      <a
        href={e.externalHref}
        target="_blank"
        rel="noreferrer"
        className={cls}
        style={style}
        title={`${tooltip}\n(opens Google Calendar)`}
      >
        {inner}
      </a>
    );
  }
  return (
    <div className={cls} style={style} title={tooltip}>
      {inner}
    </div>
  );
}

function GridColumn({
  entries,
  isToday,
  nowMinutes,
}: {
  entries: GridEntry[];
  isToday: boolean;
  nowMinutes: number;
}) {
  const hours: number[] = [];
  for (let m = GRID_START; m <= GRID_END; m += 60) hours.push(m);
  return (
    <div
      className={`relative rounded-xl ${isToday ? "bg-blush/5" : "bg-cream/40"}`}
      style={{ height: GRID_HEIGHT_PX }}
    >
      {hours.map((m) => (
        <div
          key={m}
          aria-hidden
          className="absolute left-0 right-0 border-t border-dashed border-black/5"
          style={{ top: `${((m - GRID_START) / GRID_SPAN) * 100}%` }}
        />
      ))}
      {isToday && nowMinutes >= GRID_START && nowMinutes <= GRID_END && (
        <div
          aria-hidden
          className="absolute left-0 right-0 z-20 border-t-2 border-red-400"
          style={{ top: `${((nowMinutes - GRID_START) / GRID_SPAN) * 100}%` }}
        >
          <span className="absolute -left-1 -top-[5px] h-2 w-2 rounded-full bg-red-400" />
        </div>
      )}
      <div className="absolute inset-x-1 inset-y-0 z-10">
        {entries.map((e) => (
          <EntryCard key={e.key} e={e} />
        ))}
      </div>
    </div>
  );
}

function HourGutter() {
  const hours: number[] = [];
  for (let m = GRID_START; m <= GRID_END; m += 60) hours.push(m);
  return (
    <div className="relative w-14 shrink-0" style={{ height: GRID_HEIGHT_PX }}>
      {hours.map((m) => (
        <span
          key={m}
          className="absolute right-2 -translate-y-1/2 text-[11px] font-medium text-brown-soft"
          style={{ top: `${((m - GRID_START) / GRID_SPAN) * 100}%` }}
        >
          {minutesToLabel(m)}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------- page */

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: { date?: string; view?: string };
}) {
  const session = await auth();
  const today = todayISO();
  const date = /^\d{4}-\d{2}-\d{2}$/.test(searchParams.date ?? "")
    ? searchParams.date!
    : today;
  const view = searchParams.view === "day" ? "day" : "week";
  const weekDays = weekOf(date);
  const gridDays = view === "week" ? weekDays : [date];
  const now = nowInBusinessTZ();

  // Always fetch the whole week — the day strip shows per-day counts.
  const bookings = await prisma.booking.findMany({
    where: { date: { in: weekDays } },
    orderBy: { time: "asc" },
  });
  const counts: Record<string, number> = {};
  for (const b of bookings) {
    if (b.status !== "cancelled") counts[b.date] = (counts[b.date] ?? 0) + 1;
  }

  // Read the same window from Google Calendar (best-effort).
  let external: ExternalCalendarEvent[] = [];
  let calendarError: string | null = null;
  try {
    external = await listCalendarEvents(weekDays[0], weekDays[6]);
  } catch (err) {
    calendarError = err instanceof Error ? err.message : String(err);
  }
  const syncedIds = new Set(
    bookings.map((b) => b.googleCalendarEventId).filter(Boolean),
  );
  const extraEvents = external.filter(
    (e) => !syncedIds.has(e.id.split(":")[0]),
  );
  const allDayByDate = new Map<string, ExternalCalendarEvent[]>();
  for (const e of extraEvents.filter((e) => e.allDay)) {
    allDayByDate.set(e.date, [...(allDayByDate.get(e.date) ?? []), e]);
  }

  const bookingEntry = (
    b: (typeof bookings)[number],
    { withGroomer }: { withGroomer: boolean },
  ): GridEntry => {
    const start = slotToMinutes(b.time);
    const lines = [summarizeSelections(b.package, b.addOns)];
    if (withGroomer) lines.push(`with ${b.groomerName}`);
    return {
      key: b.id,
      title: b.petName,
      lines,
      startMinutes: start,
      endMinutes: start + APPOINTMENT_MINUTES,
      href: `/admin/bookings/${b.id}`,
      groomer: b.groomerName,
      cancelled: b.status === "cancelled",
      paid: b.paidAtPickup,
    };
  };
  const externalEntry = (e: ExternalCalendarEvent): GridEntry => ({
    key: e.id,
    title: e.title,
    lines: ["Google Calendar"],
    startMinutes: e.startMinutes,
    endMinutes: Math.max(e.endMinutes, e.startMinutes + 30),
    externalHref: e.htmlLink,
    external: true,
  });

  const prev = view === "week" ? addDays(weekDays[0], -7) : addDays(date, -1);
  const next = view === "week" ? addDays(weekDays[0], 7) : addDays(date, 1);
  const rangeLabel =
    view === "week"
      ? `${dayLabel(weekDays[0]).day} – ${dayLabel(weekDays[6]).day}`
      : new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          timeZone: "UTC",
        });

  const groomerCols = GROOMERS.filter(
    (g) =>
      g !== "Any available" ||
      bookings.some((b) => b.groomerName === "Any available" && b.date === date),
  );
  const dayExtra = extraEvents.filter((e) => !e.allDay && e.date === date);

  return (
    <div className="min-h-screen bg-cream">
      <AdminHeader name={session?.user?.name} role={session?.user?.role} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-heading text-3xl text-brown">Calendar</h1>
            <p className="text-sm text-brown-soft">
              {rangeLabel} · {bookings.filter((b) => gridDays.includes(b.date)).length}{" "}
              booking
              {bookings.filter((b) => gridDays.includes(b.date)).length === 1 ? "" : "s"}
              {extraEvents.length > 0 &&
                ` · ${extraEvents.length} Google Calendar event${
                  extraEvents.length === 1 ? "" : "s"
                }`}
            </p>
          </div>
        </div>

        <div className="mb-5">
          <CalendarToolbar
            view={view}
            date={date}
            today={today}
            prev={prev}
            next={next}
            weekDays={weekDays}
            counts={counts}
          />
        </div>

        {calendarError && (
          <p className="mb-4 rounded-xl bg-amber-50 px-4 py-2 text-xs text-amber-800">
            Google Calendar events unavailable right now ({calendarError}) —
            showing website bookings only.
          </p>
        )}

        {/* Grid */}
        <div className="overflow-x-auto rounded-3xl bg-card p-4 shadow-card">
          {view === "week" ? (
            <div className="min-w-[1080px]">
              <div className="mb-1 flex gap-1 pl-14">
                {weekDays.map((d) => {
                  const { weekday, day } = dayLabel(d);
                  const isToday = d === now.date;
                  const allDay = allDayByDate.get(d) ?? [];
                  return (
                    <div key={d} className="min-w-0 flex-1">
                      <Link
                        href={`/admin/calendar?view=day&date=${d}`}
                        className={`block rounded-xl px-2 py-1.5 text-center transition hover:bg-cream-deep ${
                          isToday ? "bg-blush/15" : ""
                        }`}
                      >
                        <span className="text-xs uppercase tracking-wide text-brown-soft">
                          {weekday}
                        </span>{" "}
                        <span
                          className={`font-heading text-lg ${
                            isToday ? "text-blush" : "text-brown"
                          }`}
                        >
                          {day}
                        </span>
                      </Link>
                      {allDay.map((e) =>
                        e.htmlLink ? (
                          <a
                            key={e.id}
                            href={e.htmlLink}
                            target="_blank"
                            rel="noreferrer"
                            title={`${e.title} (opens Google Calendar)`}
                            className="mt-1 block truncate rounded-md border border-black/10 bg-white/80 px-1.5 py-0.5 text-center text-[10px] text-brown-soft hover:bg-white"
                          >
                            {e.title}
                          </a>
                        ) : (
                          <div
                            key={e.id}
                            title={e.title}
                            className="mt-1 truncate rounded-md border border-black/10 bg-white/80 px-1.5 py-0.5 text-center text-[10px] text-brown-soft"
                          >
                            {e.title}
                          </div>
                        ),
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-1">
                <HourGutter />
                {weekDays.map((d) => {
                  const entries = layoutLanes([
                    ...bookings
                      .filter((b) => b.date === d)
                      .map((b) => bookingEntry(b, { withGroomer: true })),
                    ...extraEvents
                      .filter((e) => !e.allDay && e.date === d)
                      .map(externalEntry),
                  ]);
                  return (
                    <div key={d} className="min-w-0 flex-1">
                      <GridColumn
                        entries={entries}
                        isToday={d === now.date}
                        nowMinutes={now.minutes}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="min-w-[900px]">
              {(allDayByDate.get(date) ?? []).length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2 pl-14">
                  {(allDayByDate.get(date) ?? []).map((e) => (
                    <span
                      key={e.id}
                      className="rounded-md border border-black/10 bg-white/80 px-2 py-1 text-xs text-brown-soft"
                    >
                      {e.title} · all day
                    </span>
                  ))}
                </div>
              )}
              <div className="mb-1 flex gap-1 pl-14">
                {groomerCols.map((g) => (
                  <div
                    key={g}
                    className={`min-w-0 flex-1 rounded-xl border px-2 py-1.5 text-center font-heading text-brown ${
                      GROOMER_COLORS[g] ?? "border-black/10 bg-cream-deep"
                    }`}
                  >
                    {g}
                  </div>
                ))}
                {dayExtra.length > 0 && (
                  <div className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white/70 px-2 py-1.5 text-center font-heading text-brown-soft">
                    Google Calendar
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <HourGutter />
                {groomerCols.map((g) => {
                  const entries = layoutLanes(
                    bookings
                      .filter((b) => b.date === date && b.groomerName === g)
                      .map((b) => bookingEntry(b, { withGroomer: false })),
                  );
                  return (
                    <div key={g} className="min-w-0 flex-1">
                      <GridColumn
                        entries={entries}
                        isToday={date === now.date}
                        nowMinutes={now.minutes}
                      />
                    </div>
                  );
                })}
                {dayExtra.length > 0 && (
                  <div className="min-w-0 flex-1">
                    <GridColumn
                      entries={layoutLanes(dayExtra.map(externalEntry))}
                      isToday={date === now.date}
                      nowMinutes={now.minutes}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-brown-soft">
          {groomerCols.map((g) => (
            <span key={g} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className={`inline-block h-3 w-3 rounded-full border ${
                  GROOMER_COLORS[g] ?? "border-black/10 bg-cream-deep"
                }`}
              />
              {g}
            </span>
          ))}
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="inline-block h-3 w-3 rounded-full border border-black/10 bg-white"
            />
            Google Calendar event
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-600">✓</span> paid
          </span>
          <span className="flex items-center gap-1.5">
            <span className="line-through">name</span> cancelled
          </span>
        </div>
      </main>
    </div>
  );
}
