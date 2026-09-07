"use client";

import { useRef, useState } from "react";
import { SERVICE_MENU } from "@/content/site";

/**
 * The services menu: pick a service, read its prices.
 *
 * Laid out after the reference site's services page — a narrow centred column,
 * the service names as plain text across the top with the current one
 * underlined, and the prices as flat rows with air between them. No cards, no
 * rules, no boxes: on a page that is only a list of numbers, the numbers are
 * the design, and every border drawn around them is one more thing competing
 * with the price for attention.
 *
 * Built to the ARIA tabs pattern: one tab in the tab order, arrow keys to move
 * between them, Home/End to the ends. Every panel stays mounted and is hidden
 * with `hidden`, so find-in-page still finds a price on a tab you are not
 * looking at, and the figures are all in the server HTML.
 */
export default function ServiceMenu() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const count = SERVICE_MENU.length;

  /** Moving focus selects, per the pattern for automatically-activated tabs. */
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
    <div className="px-4 sm:px-6">
      <div
        role="tablist"
        aria-label="Services"
        onKeyDown={onKeyDown}
        className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-5 gap-y-2"
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
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`py-2 text-base transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-4 focus-visible:ring-offset-cream ${
                selected
                  ? "font-semibold text-brown underline decoration-blush decoration-2 underline-offset-8"
                  : "text-brown-soft hover:text-brown"
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
          className="mx-auto mt-12 max-w-xl focus:outline-none"
        >
          <p className="text-center leading-relaxed text-brown-soft">
            {tab.blurb}
          </p>

          {tab.groups.map((group, g) => (
            <div key={group.name ?? g} className="mt-12">
              {group.name && (
                <h3 className="mb-6 font-heading text-lg text-brown">
                  {group.name}
                </h3>
              )}
              <ul>
                {group.tiers.map((tier) => (
                  <li
                    key={tier.name}
                    className="flex items-baseline justify-between gap-6 pb-8"
                  >
                    <div>
                      <p className="font-heading text-brown">{tier.name}</p>
                      {tier.detail && (
                        <p className="mt-1 text-sm text-brown-soft">
                          {tier.detail}
                        </p>
                      )}
                    </div>
                    {/* Prices are stored as "$50+"; spelled out here so the
                        row reads as a sentence rather than a symbol. */}
                    <p className="shrink-0 whitespace-nowrap text-brown-soft">
                      Starting at {tier.price.replace(/\+$/, "")}
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
