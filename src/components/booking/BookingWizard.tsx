"use client";

import { useMemo, useState } from "react";
import {
  SERVICES,
  computeEstimate,
  formatUSD,
  isValidSize,
  PRICE_DISCLAIMER,
  type Size,
} from "@/lib/pricing";
import {
  BREEDS,
  GROOMERS,
  SIZE_OPTIONS,
  TIME_SLOTS,
} from "@/lib/booking-constants";

type FormState = {
  services: string[];
  petName: string;
  size: string;
  breed: string;
  groomerName: string;
  date: string;
  time: string;
  ownerName: string;
  phone: string;
  email: string;
  notes: string;
};

const EMPTY: FormState = {
  services: [],
  petName: "",
  size: "",
  breed: "",
  groomerName: "Any available",
  date: "",
  time: "",
  ownerName: "",
  phone: "",
  email: "",
  notes: "",
};

const STEP_LABELS = ["Services", "Pet", "Groomer & time", "Contact", "Review"];

/** Local YYYY-MM-DD for the date input's `min` (today). */
function todayISO(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export default function BookingWizard() {
  const [step, setStep] = useState(0); // 0..4
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleService = (id: string) =>
    setForm((f) => ({
      ...f,
      services: f.services.includes(id)
        ? f.services.filter((s) => s !== id)
        : [...f.services, id],
    }));

  // Live estimate for the Review step (and a running subtotal hint).
  const breakdown = useMemo(() => {
    if (!isValidSize(form.size)) return null;
    return computeEstimate(form.services, form.size as Size);
  }, [form.services, form.size]);

  /** Returns an error string if the current step is invalid, else null. */
  function validateStep(s: number): string | null {
    switch (s) {
      case 0:
        return form.services.length >= 1
          ? null
          : "Please select at least one service.";
      case 1:
        if (!form.petName.trim()) return "Please enter your pet's name.";
        if (!form.size) return "Please choose a size.";
        if (!form.breed) return "Please choose a breed.";
        return null;
      case 2:
        if (!form.date) return "Please choose a date.";
        if (!form.time) return "Please choose a time.";
        return null;
      case 3:
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
    // Validate all steps defensively before submitting.
    for (let s = 0; s <= 3; s++) {
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
          services: form.services,
          petName: form.petName,
          size: form.size,
          breed: form.breed,
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
      // Success — go to the DB-backed confirmation page.
      window.location.href = `/booking/success?id=${data.id}`;
    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  const progress = ((step + 1) / STEP_LABELS.length) * 100;

  return (
    <div className="rounded-4xl bg-card p-6 shadow-soft sm:p-8">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-brown">
            Step {step + 1} of {STEP_LABELS.length}
          </span>
          <span className="text-brown-soft">{STEP_LABELS[step]}</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-cream-deep">
          <div
            className="h-full rounded-full bg-blush transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      {step === 0 && (
        <Step title="Which services?" hint="Select one or more.">
          <div className="grid gap-3 sm:grid-cols-2">
            {SERVICES.map((svc) => {
              const active = form.services.includes(svc.id);
              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => toggleService(svc.id)}
                  aria-pressed={active}
                  className={chip(active, "justify-between")}
                >
                  <span className="font-medium">{svc.label}</span>
                  <span className={active ? "text-white/90" : "text-brown-soft"}>
                    {svc.priceLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </Step>
      )}

      {step === 1 && (
        <Step title="Tell us about your pup">
          <Field label="Pet name" required>
            <input
              className={input}
              value={form.petName}
              onChange={(e) => set("petName", e.target.value)}
              placeholder="e.g. Biscuit"
            />
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
                </button>
              ))}
            </div>
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
        </Step>
      )}

      {step === 2 && (
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

      {step === 3 && (
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

      {step === 4 && (
        <Step title="Review & confirm">
          <dl className="divide-y divide-black/5 rounded-2xl bg-cream/60 p-4 text-sm">
            <Row label="Services">
              {form.services
                .map((id) => SERVICES.find((s) => s.id === id)?.label ?? id)
                .join(", ")}
            </Row>
            <Row label="Pet">
              {form.petName} · {form.size} · {form.breed}
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

          {/* Estimate */}
          {breakdown && (
            <div className="mt-4 rounded-2xl border border-blush/40 bg-blush-light/50 p-4">
              <ul className="space-y-1 text-sm">
                {breakdown.lineItems.map((li) => (
                  <li key={li.id} className="flex justify-between">
                    <span className="text-brown-soft">
                      {li.label}
                      {li.isBase ? "" : " (add-on)"}
                    </span>
                    <span className="font-medium text-brown">
                      {formatUSD(li.amount)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between border-t border-blush/40 pt-3">
                <span className="font-heading text-lg text-brown">
                  Estimated total
                </span>
                <span className="font-heading text-xl text-brown">
                  {formatUSD(breakdown.total)}
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
