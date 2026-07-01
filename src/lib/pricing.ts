/**
 * GumiPaws pricing engine.
 *
 * This module is the single source of truth for prices. The booking wizard uses
 * it to *display* an estimate, and the `/api/bookings` route uses it to
 * *recompute* the total server-side (client-sent prices are never trusted).
 *
 * Pricing rules (from the posted price list):
 *  - Bath, Full Groom, Poodles & Oodles are priced by dog size ("base" services).
 *  - Puppy's First Groom is a flat-rate base groom ($40).
 *  - De-shedding / Nail Trim & Buff / Teeth Brushing are flat add-ons.
 *
 * Combination rule: a visit has ONE main groom. If several base services are
 * selected together, we charge the highest-priced one as the base (we don't
 * double-count two grooms) and add the flat add-ons on top.
 *
 * Bath note: the posted Bath price varies by coat length (short/long). The
 * booking wizard doesn't ask for coat length, so the estimate uses the
 * short-hair column (the lower "from" price). Final price is confirmed in
 * person — see PRICE_DISCLAIMER.
 */

export const SIZES = ["Toy", "Small", "Medium", "Large", "X-Large"] as const;
export type Size = (typeof SIZES)[number];

export const PRICE_DISCLAIMER =
  "This is an estimate. Final price may vary slightly with coat condition and matting. Payment is due in person at pickup.";

/** Size → price for the base (size-tiered) services. */
const BATH_SHORT: Record<Size, number> = {
  Toy: 50,
  Small: 60,
  Medium: 75,
  Large: 90,
  "X-Large": 110,
};
const BATH_LONG: Record<Size, number> = {
  Toy: 60,
  Small: 70,
  Medium: 95,
  Large: 109,
  "X-Large": 134,
};
const FULL_GROOM: Record<Size, number> = {
  Toy: 109,
  Small: 124,
  Medium: 149,
  Large: 159,
  "X-Large": 179,
};
const POODLES_OODLES: Record<Size, number> = {
  Toy: 139,
  Small: 159,
  Medium: 179,
  Large: 209,
  "X-Large": 249,
};

export type ServiceKind = "base" | "addon";

export interface ServiceDef {
  /** Stable identifier persisted on the booking and sent by the client. */
  id: string;
  /** Human-readable label shown in the UI and emails. */
  label: string;
  kind: ServiceKind;
  /** "From" price shown on service chips, e.g. "$109+" or "$20". */
  priceLabel: string;
  /** Compute the price for a given size. Flat services ignore size. */
  price: (size: Size) => number;
}

/**
 * The services offered in the booking wizard. Keyed order matters for display.
 * `id` values are what get stored in Booking.services and echoed back.
 */
export const SERVICES: ServiceDef[] = [
  {
    id: "full-groom",
    label: "Full Groom",
    kind: "base",
    priceLabel: "$109+",
    price: (s) => FULL_GROOM[s],
  },
  {
    id: "bath",
    label: "Bath & Brush",
    kind: "base",
    priceLabel: "$50+",
    price: (s) => BATH_SHORT[s],
  },
  {
    id: "poodles-oodles",
    label: "Poodles & Oodles",
    kind: "base",
    priceLabel: "$139+",
    price: (s) => POODLES_OODLES[s],
  },
  {
    id: "puppys-first",
    label: "Puppy's First Groom",
    kind: "base",
    priceLabel: "$40",
    price: () => 40,
  },
  {
    id: "de-shedding",
    label: "De-shedding",
    kind: "addon",
    priceLabel: "$20",
    price: () => 20,
  },
  {
    id: "nail-trim",
    label: "Nail Trim & Buff",
    kind: "addon",
    priceLabel: "$15",
    price: () => 15,
  },
  {
    id: "teeth-brushing",
    label: "Teeth Brushing",
    kind: "addon",
    priceLabel: "$12",
    price: () => 12,
  },
];

export const SERVICE_BY_ID: Record<string, ServiceDef> = Object.fromEntries(
  SERVICES.map((s) => [s.id, s]),
);

export function isValidSize(value: string): value is Size {
  return (SIZES as readonly string[]).includes(value);
}

export interface PriceLineItem {
  id: string;
  label: string;
  amount: number;
  /** True for the chosen base groom; false for add-ons. */
  isBase: boolean;
}

export interface PriceBreakdown {
  lineItems: PriceLineItem[];
  total: number;
}

/**
 * Compute the estimated total for a set of selected service ids at a given size.
 *
 * - Picks the single highest-priced base service as the groom base.
 * - Adds every selected add-on.
 * - Ignores unknown ids defensively.
 */
export function computeEstimate(
  serviceIds: string[],
  size: Size,
): PriceBreakdown {
  const selected = serviceIds
    .map((id) => SERVICE_BY_ID[id])
    .filter((s): s is ServiceDef => Boolean(s));

  const bases = selected.filter((s) => s.kind === "base");
  const addons = selected.filter((s) => s.kind === "addon");

  const lineItems: PriceLineItem[] = [];

  // One base groom: the most expensive selected base service.
  if (bases.length > 0) {
    const base = bases.reduce((best, s) =>
      s.price(size) > best.price(size) ? s : best,
    );
    lineItems.push({
      id: base.id,
      label: base.label,
      amount: base.price(size),
      isBase: true,
    });
  }

  // Every add-on stacks on top.
  for (const addon of addons) {
    lineItems.push({
      id: addon.id,
      label: addon.label,
      amount: addon.price(size),
      isBase: false,
    });
  }

  const total = lineItems.reduce((sum, li) => sum + li.amount, 0);
  return { lineItems, total };
}

/** Format a number as a whole-dollar (or cents) USD string. */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}
