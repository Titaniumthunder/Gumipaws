"use client";

import { useMemo, useState } from "react";
import {
  ADD_ONS,
  coatTypeForBreed,
  computeEstimate,
  ESTIMATED_TAX_RATE,
  formatUSD,
  formatUSDPlus,
  isValidSize,
  packageOptions,
  packagePrice,
  PRICE_DISCLAIMER,
  summarizeSelections,
  type Size,
} from "@/lib/booking/pricing";
import {
  BREEDS,
  GROOMERS,
  SIZE_OPTIONS,
  TIME_SLOTS,
} from "@/lib/booking/constants";

type FormState = {
  petName: string;
  breed: string;
  size: string;
  // null = not chosen yet, "skip" = add-ons only, otherwise a package id.
  packageChoice: string | null;
  addOns: string[];
  groomerName: string;
  date: string;
  time: string;
  ownerName: string;
  phone: string;
  email: string;
  notes: string;
};

const EMPTY: FormState = {
  petName: "",
  breed: "",
  size: "",
  packageChoice: null,
  addOns: [],
  groomerName: "Any available",
  date: "",
  time: "",
  ownerName: "",
  phone: "",
  email: "",
  notes: "",
};

const STEP_LABELS = [
  "Breed & size",
  "Package",
  "Add-ons",
  "Groomer & time",
  "Contact",
  "Review",
];

/** Local YYYY-MM-DD for the date input's `min` (today). */
function todayISO(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

/** Map the wizard's package choice to what we send/price (skip → null). */
function resolvePackage(choice: string | null): string | null {
  return choice && choice !== "skip" ? choice : null;
}

export default function BookingWizard() {
  const [step, setStep] = useState(0); // 0..5
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Package ids whose "What's included" list is expanded.
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggleExpanded = (id: string) =>
    setExpanded((e) =>
      e.includes(id) ? e.filter((x) => x !== id) : [...e, id],
    );

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleAddOn = (id: string) =>
    setForm((f) => ({
      ...f,
      addOns: f.addOns.includes(id)
        ? f.addOns.filter((a) => a !== id)
        : [...f.addOns, id],
    }));

  const sizeValid = isValidSize(form.size);
  const coat = form.breed ? coatTypeForBreed(form.breed) : "standard";

  // Live estimate (needs a valid size). Shown from step 2 (index 1) onward.
  const breakdown = useMemo(() => {
    if (!sizeValid) return null;
    return computeEstimate(
      resolvePackage(form.packageChoice),
      form.addOns,
      form.size as Size,
    );
  }, [form.packageChoice, form.addOns, form.size, sizeValid]);

  const liveTotal = breakdown?.total ?? 0;
  const showTotal = step >= 1 && sizeValid;

  function validateStep(s: number): string | null {
    switch (s) {
      case 0:
        if (!form.petName.trim()) return "Please enter your pet's name.";
        if (!form.breed) return "Please choose a breed.";
        if (!form.size) return "Please choose a size.";
        return null;
      case 1:
        // A choice is required, but "skip" is a valid choice.
        return form.packageChoice === null
          ? "Please choose a package, or select “Skip”."
          : null;
      case 2:
        return null; // add-ons optional
      case 3:
        if (!form.date) return "Please choose a date.";
        if (!form.time) return "Please choose a time.";
        return null;
      case 4:
        if (!form.ownerName.trim()) return "Please enter your name.";
        if (!form.phone.trim()) return "Please enter your phone number.";
        if (!/^\S+@\S+\.\S+$/.test(form.email))
          return "Please enter a valid email.";
        return null;
      default:
        return null;
    }
  }

  function next() {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    for (let s = 0; s <= 4; s++) {
      const err = validateStep(s);
      if (err) {
        setError(err);
        setStep(s);
        return;
      }
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petName: form.petName,
          breed: form.breed,
          size: form.size,
          package: resolvePackage(form.packageChoice),
          addOns: form.addOns,
          groomerName: form.groomerName,
          date: form.date,
          time: form.time,
          ownerName: form.ownerName,
          phone: form.phone,
          email: form.email,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      window.location.href = `/booking/success?id=${data.id}`;
    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  const progress = ((step + 1) / STEP_LABELS.length) * 100;

  return (
    <div className="rounded-4xl bg-card p-6 shadow-soft sm:p-8">
      {/* Progress — numbered steps with the current label */}
      <div className="mb-5">
        <ol className="flex items-center gap-1.5 sm:gap-2">
          {STEP_LABELS.map((label, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <li key={label} className="flex flex-1 items-center gap-1.5 sm:gap-2">
                <span
                  aria-current={current ? "step" : undefined}
                  title={label}
                  className={[
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition",
                    done && "bg-blush text-white",
                    current && "bg-brown text-cream ring-2 ring-blush/40",
                    !done && !current && "bg-cream-deep text-brown-soft",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {done ? "✓" : i + 1}
                </span>
                {i < STEP_LABELS.length - 1 && (
                  <span
                    aria-hidden
                    className={`h-0.5 flex-1 rounded-full ${
                      done ? "bg-blush" : "bg-cream-deep"
                    }`}
                  />
                )}
              </li>
            );
          })}
        </ol>
        <p className="mt-2 text-sm text-brown-soft">
          Step {step + 1} of {STEP_LABELS.length} ·{" "}
          <span className="font-semibold text-brown">{STEP_LABELS[step]}</span>
        </p>
      </div>

      {/* Live running total (from step 2 onward) */}
      {showTotal && (
        <div className="sticky top-16 z-20 mb-5 flex items-center justify-between rounded-2xl bg-brown px-4 py-3 text-cream shadow-card">
          <span className="text-sm">
            Estimated total{" "}
            <span className="text-xs text-cream/70">incl. est. tax</span>
            {breakdown?.totalVaries && (
              <span className="block text-xs text-cream/70">
                starting price — confirmed at drop-off
              </span>
            )}
          </span>
          <span className="font-heading text-xl">
            {formatUSDPlus(liveTotal, breakdown?.totalVaries ?? false)}
          </span>
        </div>
      )}

      {/* Step 1 — Breed & size */}
      {step === 0 && (
        <Step title="Tell us about your pup">
          <Field label="Pet name" required>
            <input
              className={input}
              value={form.petName}
              onChange={(e) => set("petName", e.target.value)}
              placeholder="e.g. Biscuit"
            />
          </Field>

          <Field label="Breed" required>
            <select
              className={input}
              value={form.breed}
              onChange={(e) => set("breed", e.target.value)}
            >
              <option value="">Select a breed…</option>
              {BREEDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Size" required>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set("size", opt.value)}
                  aria-pressed={form.size === opt.value}
                  className={chip(form.size === opt.value, "flex-col !py-2")}
                >
                  <span className="font-medium">{opt.value}</span>
                  <span
                    className={
                      form.size === opt.value
                        ? "text-xs text-white/80"
                        : "text-xs text-brown-soft"
                    }
                  >
                    {opt.hint}
                  </span>
                  <span
                    className={
                      form.size === opt.value
                        ? "text-xs font-semibold text-white/90"
                        : "text-xs font-semibold text-blush"
                    }
                  >
                    from{" "}
                    {formatUSDPlus(
                      packagePrice("bath", opt.value as Size),
                      true,
                    )}
                  </span>
                </button>
              ))}
            </div>
          </Field>

          {/* Price preview for the chosen breed + size */}
          {sizeValid && form.breed && (
            <div className="rounded-2xl bg-cream/60 px-4 py-3 text-sm">
              <span className="font-medium text-brown">
                Prices for a {form.size.toLowerCase()} {form.breed}:{" "}
              </span>
              <span className="text-brown-soft">
                {packageOptions(form.size as Size, coat)
                  .map(
                    (o) =>
                      `${o.label} ${formatUSDPlus(o.price, o.priceVaries)}`,
                  )
                  .join(" · ")}
              </span>
            </div>
          )}
        </Step>
      )}

      {/* Step 2 — Package */}
      {step === 1 && (
        <Step
          title="Choose a package"
          hint="Prices shown for your dog's size. Pick one, or skip to add-ons only."
        >
          <div className="space-y-3">
            {sizeValid &&
              packageOptions(form.size as Size, coat).map((opt) => {
                const active = form.packageChoice === opt.id;
                const isOpen = expanded.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => set("packageChoice", opt.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        set("packageChoice", opt.id);
                      }
                    }}
                    aria-pressed={active}
                    className={`${packageCard(active)} cursor-pointer`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-heading text-lg">{opt.label}</div>
                        <div
                          className={`mt-1 text-sm ${
                            active ? "text-white/85" : "text-brown-soft"
                          }`}
                        >
                          {opt.description}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="font-heading text-xl">
                          {formatUSDPlus(opt.price, opt.priceVaries)}
                        </div>
                        {opt.priceVaries && (
                          <div
                            className={`text-[11px] ${
                              active ? "text-white/70" : "text-brown-soft"
                            }`}
                          >
                            starting price
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expandable "what's included" (Healthy Spot-style More/Less) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpanded(opt.id);
                      }}
                      aria-expanded={isOpen}
                      className={`mt-2 text-sm font-semibold underline underline-offset-2 ${
                        active
                          ? "text-white/90 hover:text-white"
                          : "text-blush hover:text-blush/80"
                      }`}
                    >
                      {isOpen ? "Hide details ▴" : "What's included ▾"}
                    </button>
                    {isOpen && (
                      <ul
                        className={`mt-2 space-y-1.5 text-sm ${
                          active ? "text-white/85" : "text-brown-soft"
                        }`}
                      >
                        {opt.includes.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span aria-hidden className="mt-0.5">
                              ✓
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}

            {/* Skip option */}
            <button
              type="button"
              onClick={() => set("packageChoice", "skip")}
              aria-pressed={form.packageChoice === "skip"}
              className={packageCard(form.packageChoice === "skip")}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-heading text-lg">Skip — add-ons only</div>
                  <div
                    className={`mt-1 text-sm ${
                      form.packageChoice === "skip"
                        ? "text-white/85"
                        : "text-brown-soft"
                    }`}
                  >
                    No bath or groom — just pick from the add-ons next.
                  </div>
                </div>
                <div className="shrink-0 font-heading text-xl">$0</div>
              </div>
            </button>
          </div>
        </Step>
      )}

      {/* Step 3 — Add-ons */}
      {step === 2 && (
        <Step title="Add-ons" hint="Optional — pick any you'd like.">
          <div className="grid gap-2 sm:grid-cols-2">
            {ADD_ONS.map((a) => {
              const active = form.addOns.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggleAddOn(a.id)}
                  aria-pressed={active}
                  className={chip(active, "!items-start flex-col !gap-1 text-left")}
                >
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="flex items-center gap-2 font-medium">
                      <span
                        aria-hidden
                        className={`grid h-4 w-4 shrink-0 place-items-center rounded border text-[10px] ${
                          active
                            ? "border-white bg-white/20 text-white"
                            : "border-black/20 text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                      {a.label}
                    </span>
                    <span
                      className={active ? "text-white/90" : "text-brown-soft"}
                    >
                      {formatUSDPlus(a.price, true)}
                    </span>
                  </span>
                  <span
                    className={`pl-6 text-xs leading-snug ${
                      active ? "text-white/75" : "text-brown-soft"
                    }`}
                  >
                    {a.description}
                  </span>
                </button>
              );
            })}
          </div>
        </Step>
      )}

      {/* Step 4 — Groomer & time */}
      {step === 3 && (
        <Step title="Groomer & time">
          <Field label="Preferred groomer">
            <div className="flex flex-wrap gap-2">
              {GROOMERS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => set("groomerName", g)}
                  aria-pressed={form.groomerName === g}
                  className={chip(form.groomerName === g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Date" required>
            <input
              type="date"
              className={input}
              min={todayISO()}
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </Field>

          <Field label="Time" required>
            <div className="flex flex-wrap gap-2">
              {TIME_SLOTS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("time", t)}
                  aria-pressed={form.time === t}
                  className={chip(form.time === t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>
        </Step>
      )}

      {/* Step 5 — Contact */}
      {step === 4 && (
        <Step title="Your contact details">
          <Field label="Your name" required>
            <input
              className={input}
              value={form.ownerName}
              onChange={(e) => set("ownerName", e.target.value)}
              placeholder="Full name"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone" required>
              <input
                type="tel"
                className={input}
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="(310) 555-0192"
              />
            </Field>
            <Field label="Email" required>
              <input
                type="email"
                className={input}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
              />
            </Field>
          </div>
          <Field label="Notes (optional)">
            <textarea
              className={`${input} min-h-[90px]`}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Anything we should know — sensitivities, matting, style preferences…"
            />
          </Field>
        </Step>
      )}

      {/* Step 6 — Review */}
      {step === 5 && (
        <Step title="Review & confirm">
          <dl className="divide-y divide-black/5 rounded-2xl bg-cream/60 p-4 text-sm">
            <Row label="Pet">
              {form.petName} · {form.breed} · {form.size}
            </Row>
            <Row label="Package">
              {resolvePackage(form.packageChoice)
                ? summarizeSelections(resolvePackage(form.packageChoice), [])
                : "None (add-ons only)"}
            </Row>
            <Row label="Add-ons">
              {form.addOns.length
                ? summarizeSelections(null, form.addOns)
                : "None"}
            </Row>
            <Row label="Groomer">{form.groomerName}</Row>
            <Row label="When">
              {form.date} at {form.time}
            </Row>
            <Row label="Contact">
              {form.ownerName} · {form.phone} · {form.email}
            </Row>
            {form.notes && <Row label="Notes">{form.notes}</Row>}
          </dl>

          {breakdown && (
            <div className="mt-4 rounded-2xl border border-blush/40 bg-blush-light/50 p-4">
              {breakdown.lineItems.length === 0 ? (
                <p className="text-sm text-brown-soft">
                  No package or add-ons selected.
                </p>
              ) : (
                <ul className="space-y-1 text-sm">
                  {breakdown.lineItems.map((li) => (
                    <li key={li.id} className="flex justify-between">
                      <span className="text-brown-soft">
                        {li.label}
                        {li.isPackage ? "" : " (add-on)"}
                      </span>
                      <span className="font-medium text-brown">
                        {formatUSDPlus(li.amount, li.varies)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {breakdown.lineItems.length > 0 && (
                <div className="mt-3 space-y-1 border-t border-blush/40 pt-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-brown-soft">Subtotal</span>
                    <span className="font-medium text-brown">
                      {formatUSDPlus(breakdown.subtotal, breakdown.totalVaries)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brown-soft">
                      Estimated tax ({(ESTIMATED_TAX_RATE * 100).toFixed(2).replace(/\.?0+$/, "")}%)
                    </span>
                    <span className="font-medium text-brown">
                      {formatUSD(breakdown.tax)}
                    </span>
                  </div>
                </div>
              )}
              <div className="mt-3 flex items-center justify-between border-t border-blush/40 pt-3">
                <span className="font-heading text-lg text-brown">
                  Estimated total
                </span>
                <span className="font-heading text-xl text-brown">
                  {formatUSDPlus(breakdown.total, breakdown.totalVaries)}
                </span>
              </div>
              <p className="mt-2 text-xs text-brown-soft">{PRICE_DISCLAIMER}</p>
            </div>
          )}
        </Step>
      )}

      {/* Error */}
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={back}
          disabled={step === 0 || submitting}
          className="rounded-full px-5 py-2.5 font-semibold text-brown-soft transition hover:bg-cream-deep disabled:opacity-0"
        >
          ← Back
        </button>

        {step < STEP_LABELS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="rounded-full bg-blush px-6 py-2.5 font-semibold text-white shadow-card transition hover:bg-blush/90"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="rounded-full bg-blush px-6 py-2.5 font-semibold text-white shadow-card transition hover:bg-blush/90 disabled:opacity-70"
          >
            {submitting ? "Confirming…" : "Confirm booking"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- small presentational helpers ---------- */

const input =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-brown outline-none transition focus:border-blush focus:ring-2 focus:ring-blush/30";

function chip(active: boolean, extra = "") {
  return [
    "flex items-center gap-1 rounded-xl border px-4 py-3 text-sm transition",
    active
      ? "border-blush bg-blush text-white shadow-card"
      : "border-black/10 bg-white text-brown hover:border-blush/50",
    extra,
  ].join(" ");
}

function packageCard(active: boolean) {
  return [
    "w-full rounded-2xl border p-4 text-left transition",
    active
      ? "border-blush bg-blush text-white shadow-card"
      : "border-black/10 bg-white text-brown hover:border-blush/50",
  ].join(" ");
}

function Step({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading text-2xl text-brown">{title}</h3>
        {hint && <p className="text-sm text-brown-soft">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-brown">
        {label}
        {required && <span className="text-blush"> *</span>}
      </span>
      {children}
    </label>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between gap-4 py-2">
      <dt className="shrink-0 font-medium text-brown-soft">{label}</dt>
      <dd className="text-right text-brown">{children}</dd>
    </div>
  );
}
