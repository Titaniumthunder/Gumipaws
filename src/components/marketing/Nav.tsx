"use client";

import { useEffect, useState } from "react";
import { BUSINESS, CTA, LOGO, NAV_LINKS } from "@/content/site";

/**
 * Top navigation with a mobile drawer.
 *
 * Two looks. The default is the solid cream bar every inner page uses. With
 * `overlay` — the home page only — it floats transparent over the full-bleed
 * hero photo in white type, with the links on the left, the logo centred and
 * the booking button on the right, then turns into the solid bar once the
 * photo has scrolled out from under it.
 *
 * Overlay has to be opt-in: white type on a transparent bar is invisible over
 * a cream page, which is what every other page starts with.
 */
export default function Nav({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    if (!overlay) return;
    const hero = document.getElementById("top");
    // Solid once the hero's bottom edge rises past the bar, so the white type
    // is always over the dark photo and never over the cream below it.
    const sync = () => {
      const limit = hero ? hero.offsetHeight - 96 : 80;
      setPastHero(window.scrollY > limit);
    };
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [overlay]);

  // An open drawer needs a solid bar behind it to be readable.
  const clear = overlay && !pastHero && !open;

  const drawer = open && (
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
  );

  const menuButton = (extra: string) => (
    <button
      type="button"
      aria-label="Toggle menu"
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border lg:hidden ${extra}`}
    >
      {open ? "✕" : "☰"}
    </button>
  );

  if (overlay) {
    return (
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          clear
            ? "bg-transparent"
            : "border-b border-black/5 bg-cream/90 backdrop-blur"
        }`}
      >
        {/* Three columns with the logo in a fixed centre track, so it stays
            dead centre however long the links on either side get. */}
        <nav className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center">
            {menuButton(
              clear ? "border-white/40 text-white" : "border-black/10 text-brown",
            )}
            <ul
              className={`hidden items-center gap-8 text-base font-medium lg:flex ${
                clear ? "text-white/90" : "text-brown-soft"
              }`}
            >
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`transition ${
                      clear ? "hover:text-white" : "hover:text-brown"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <a href="/" className="flex items-center gap-2 sm:gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO}
              alt="GumiPaws logo"
              className={`h-11 w-11 shrink-0 rounded-full bg-cream-deep object-cover sm:h-14 sm:w-14 ${
                clear ? "ring-2 ring-white/40" : "ring-1 ring-black/5"
              }`}
            />
            <span
              className={`hidden font-heading text-xl font-medium min-[420px]:inline sm:text-2xl ${
                clear ? "text-white" : "text-brown"
              }`}
            >
              GumiPaws
            </span>
          </a>

          <div className="flex justify-end">
            <a
              href="/book"
              className={`whitespace-nowrap border border-gold px-3 py-2 text-sm font-medium transition sm:px-6 sm:py-3 sm:text-base ${
                clear
                  ? "text-white hover:bg-gold"
                  : "text-brown hover:bg-gold hover:text-white"
              }`}
            >
              <span className="sm:hidden">Book</span>
              <span className="hidden sm:inline">{CTA.primary}</span>
            </a>
          </div>
        </nav>
        {drawer}
      </header>
    );
  }

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
          {menuButton("border-black/10 text-brown")}
        </div>
      </nav>
      {drawer}
    </header>
  );
}
