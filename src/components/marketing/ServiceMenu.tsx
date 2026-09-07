"use client";

import { useRef, useState } from "react";
import { SERVICE_MENU } from "@/content/site";

/**
 * The services menu: pick a service, read its prices.
 *
 * This replaced a three-column table. A table asks you to scan across two
 * services you are not buying to reach the one you are; tabs ask which service
 * first, which is the question a visitor has already answered before arriving.
 *
 * Built to the ARIA tabs pattern rather than with links or radios: one tab in
 * the tab order, arrow keys to move between them, Home/End to jump to the ends.
 * Every panel stays mounted and is hidden with `hidden`, so browser find-in-page
 * still turns up a price on a tab you are not looking at.
 */
export default function ServiceMenu() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const count = SERVICE_MENU.length;

  /** Moving focus is what selects, per the ARIA pattern for automatic tabs. */
  const focusTab = (i: number) => {
    setActive(i);
    tabRefs.current[i]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    let next: number;
    switch (event.key) {
      case "ArrowRight":
        next = (active + 1) % count;
        break;
      case "ArrowLeft":
        next = (active - 1 + count) % count;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = count - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    focusTab(next);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <div
        role="tablist"
        aria-label="Services"
        onKeyDown={onKeyDown}
        className="flex flex-wrap justify-center gap-2 sm:gap-3"
      >
        {SERVICE_MENU.map((tab, i) => {
          const selected = i === active;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              // Only the selected tab is tabbable; arrows move within the set.
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:px-6 sm:text-base ${
                selected
                  ? "bg-brown text-cream shadow-card"
                  : "bg-card text-brown-soft hover:bg-cream-deep hover:text-brown"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {SERVICE_MENU.map((tab, i) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={i !== active}
          tabIndex={0}
          className="mt-10 focus:outline-none"
        >
          <p className="mx-auto max-w-2xl text-center text-brown-soft">
            {tab.blurb}
          </p>

          {tab.groups.map((group, g) => (
            <div key={group.name ?? g} className="mt-8">
              {group.name && (
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
                  {group.name}
                </h3>
              )}
              <ul className="divide-y divide-black/5 overflow-hidden rounded-3xl bg-card shadow-card">
                {group.tiers.map((tier) => (
                  <li
                    key={tier.name}
                    className="flex items-baseline justify-between gap-4 px-5 py-4 sm:px-7 sm:py-5"
                  >
                    <div>
                      <p className="font-heading text-lg text-brown">
                        {tier.name}
                      </p>
                      {tier.detail && (
                        <p className="mt-0.5 text-sm text-brown-soft">
                          {tier.detail}
                        </p>
                      )}
                    </div>
                    <p className="shrink-0 whitespace-nowrap font-heading text-xl text-brown">
                      {tier.price}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
