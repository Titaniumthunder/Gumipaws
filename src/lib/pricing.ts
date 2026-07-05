/**
 * GumiPaws pricing engine.
 *
 * Single source of truth for prices. The booking wizard uses it to *display* a
 * live estimate; the `/api/bookings` route uses it to *recompute* the total
 * server-side (client-sent prices are never trusted).
 *
 * Model:
 *  - A booking has at most ONE package (Bath, or the coat-appropriate full
 *    service) plus any number of flat add-ons.
 *  - The full-service package depends on the breed's coat type:
 *      standard coat → "Full Groom", curly/doodle coat → "Poodles & Oodles".
 *    These are alternatives, never both offered at once.
 *  - estimatedTotal = package price (0 if skipped) + sum of add-ons.
 *
 * Bath's posted price varies by coat length; the wizard doesn't ask, so the
 * estimate uses the short-hair column (the "from" price). Final price is
 * confirmed in person — see PRICE_DISCLAIMER.
 */

export const SIZES = ["Toy", "Small", "Medium", "Large", "X-Large"] as const;
export type Size = (typeof SIZES)[number];

export type CoatType = "standard" | "curly";

export const PRICE_DISCLAIMER =
  "This is an estimate. Final price may vary slightly with coat condition and matting. Payment is due in person at pickup.";

/* ---------------------------------------------------------------- coat type */

/**
 * Curly/doodle breeds route to the "Poodles & Oodles" full-service package.
 * Everything else (including Mixed/Other) is treated as a standard coat.
 */
const CURLY_BREEDS = new Set<string>([
  "Poodle",
  "Goldendoodle",
  "Labradoodle",
  "Bernedoodle",
  "Cockapoo",
  "Sheepadoodle",
  "Shih Tzu",
  "Bichon Frise",
  "Cavapoo",
  "Maltipoo",
]);

export function coatTypeForBreed(breed: string): CoatType {
  return CURLY_BREEDS.has(breed) ? "curly" : "standard";
}

/* ----------------------------------------------------------------- packages */

export type PackageId = "bath" | "full-groom" | "poodles-oodles";

interface PackageDef {
  id: PackageId;
  label: string;
  description: string;
  /** Which coat types may pick this package. */
  coats: CoatType[];
  bySize: Record<Size, number>;
}

const PACKAGES: Record<PackageId, PackageDef> = {
  bath: {
    id: "bath",
    label: "Bath & Brush",
    description: "Warm hydro-bath, tearless shampoo, blow-out & brush.",
    coats: ["standard", "curly"],
    bySize: { Toy: 50, Small: 60, Medium: 75, Large: 90, "X-Large": 110 },
  },
  "full-groom": {
    id: "full-groom",
    label: "Full Groom",
    description: "Bath, full haircut, style, nails, ears — the works.",
    coats: ["standard"],
    bySize: { Toy: 109, Small: 124, Medium: 149, Large: 159, "X-Large": 179 },
  },
  "poodles-oodles": {
    id: "poodles-oodles",
    label: "Poodles & Oodles",
    description: "Full groom tuned for curly & doodle coats.",
    coats: ["curly"],
    bySize: { Toy: 139, Small: 159, Medium: 179, Large: 209, "X-Large": 249 },
  },
};

/** The full-service package offered for a coat type (not Bath). */
export function fullServiceIdForCoat(coat: CoatType): PackageId {
  return coat === "curly" ? "poodles-oodles" : "full-groom";
}

export function packagePrice(packageId: string | null, size: Size): number {
  if (!packageId) return 0;
  return PACKAGES[packageId as PackageId]?.bySize[size] ?? 0;
}

export function packageLabel(packageId: string | null): string {
  if (!packageId) return "No package (add-ons only)";
  return PACKAGES[packageId as PackageId]?.label ?? packageId;
}

export interface PackageOption {
  id: PackageId;
  label: string;
  description: string;
  price: number;
}

/**
 * The two selectable packages for a given size + coat: Bath and the coat's
 * full-service option. ("Skip" is handled by the UI, not listed here.)
 */
export function packageOptions(size: Size, coat: CoatType): PackageOption[] {
  const ids: PackageId[] = ["bath", fullServiceIdForCoat(coat)];
  return ids.map((id) => {
    const def = PACKAGES[id];
    return {
      id: def.id,
      label: def.label,
      description: def.description,
      price: def.bySize[size],
    };
  });
}

/** Is this package id valid for the given coat type? (server-side guard) */
export function isPackageAllowed(packageId: string, coat: CoatType): boolean {
  const def = PACKAGES[packageId as PackageId];
  return Boolean(def && def.coats.includes(coat));
}

/* ------------------------------------------------------------------ add-ons */

export interface AddOnDef {
  id: string;
  label: string;
  price: number;
}

/** The 10 flat add-ons, independent of the chosen package. */
export const ADD_ONS: AddOnDef[] = [
  { id: "de-shedding", label: "De-shedding", price: 20 },
  { id: "mat-removal", label: "Mat removal", price: 15 },
  { id: "ear-cleaning", label: "Ear cleaning", price: 10 },
  { id: "blueberry-facial", label: "Blueberry facial", price: 10 },
  { id: "flea-tick", label: "Flea & tick shampoo", price: 15 },
  { id: "nail-trim", label: "Nail trim & buff", price: 15 },
  { id: "teeth-brushing", label: "Teeth brushing", price: 12 },
  { id: "anal-gland", label: "Anal gland expression", price: 12 },
  { id: "paw-balm", label: "Paw balm & pad trim", price: 8 },
  { id: "bandana", label: "Bow, bandana or cologne", price: 5 },
];

export const ADD_ON_BY_ID: Record<string, AddOnDef> = Object.fromEntries(
  ADD_ONS.map((a) => [a.id, a]),
);

export function addOnLabels(ids: string[]): string[] {
  return ids.map((id) => ADD_ON_BY_ID[id]?.label ?? id);
}

/* --------------------------------------------------------------- estimate */

export function isValidSize(value: string): value is Size {
  return (SIZES as readonly string[]).includes(value);
}

export interface PriceLineItem {
  id: string;
  label: string;
  amount: number;
  /** True for the package line, false for add-ons. */
  isPackage: boolean;
}

export interface PriceBreakdown {
  lineItems: PriceLineItem[];
  total: number;
}

/**
 * Compute the estimate for a package (or null) + selected add-ons at a size.
 * Unknown ids are ignored defensively.
 */
export function computeEstimate(
  packageId: string | null,
  addOnIds: string[],
  size: Size,
): PriceBreakdown {
  const lineItems: PriceLineItem[] = [];

  if (packageId && PACKAGES[packageId as PackageId]) {
    lineItems.push({
      id: packageId,
      label: packageLabel(packageId),
      amount: packagePrice(packageId, size),
      isPackage: true,
    });
  }

  for (const id of addOnIds) {
    const addon = ADD_ON_BY_ID[id];
    if (addon) {
      lineItems.push({
        id: addon.id,
        label: addon.label,
        amount: addon.price,
        isPackage: false,
      });
    }
  }

  const total = lineItems.reduce((sum, li) => sum + li.amount, 0);
  return { lineItems, total };
}

/** One-line human summary of a booking's selections, e.g. for emails/tables. */
export function summarizeSelections(
  packageId: string | null,
  addOnIds: string[],
): string {
  const parts: string[] = [];
  if (packageId) parts.push(packageLabel(packageId));
  parts.push(...addOnLabels(addOnIds));
  return parts.length ? parts.join(", ") : "—";
}

/** Format a number as a whole-dollar (or cents) USD string. */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}
