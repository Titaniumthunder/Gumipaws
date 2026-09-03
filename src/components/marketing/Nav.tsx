"use client";

import { useState } from "react";
import { BUSINESS, CTA, LOGO, NAV_LINKS } from "@/content/site";

/** Sticky top navigation with a mobile drawer. */
export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-cream/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5">
        {/* Wordmark */}
        <a href="/" className="flex items-center gap-2 sm:gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO}
            alt="GumiPaws logo"
            className="h-11 w-11 shrink-0 rounded-full bg-cream-deep object-cover ring-1 ring-black/5 sm:h-14 sm:w-14"
          />
          <span className="hidden font-heading text-xl text-brown min-[400px]:inline sm:text-2xl lg:text-3xl">
            GumiPaws
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 text-base font-medium text-brown-soft lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition hover:text-brown">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={BUSINESS.phoneHref}
            className="hidden font-semibold text-brown sm:inline sm:text-base"
          >
            {BUSINESS.phone}
          </a>
          <a
            href="/book"
            className="whitespace-nowrap rounded-full bg-blush px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-blush/90 sm:px-6 sm:py-3 sm:text-base"
          >
            {CTA.primary}
          </a>
          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-black/10 text-brown lg:hidden"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-black/5 bg-cream lg:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-2 text-brown-soft hover:bg-cream-deep"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={BUSINESS.phoneHref}
                className="block rounded-lg px-2 py-2 font-semibold text-brown"
              >
                {BUSINESS.phone}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
