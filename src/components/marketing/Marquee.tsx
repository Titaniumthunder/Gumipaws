import { MARQUEE_ITEMS } from "@/content/site";

/** Infinite scrolling marquee. The list is duplicated so the loop is seamless. */
export default function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="overflow-hidden border-y border-black/5 bg-blush-light py-3">
      <div className="flex w-max animate-marquee gap-8 pr-8 will-change-transform">
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-8 whitespace-nowrap text-sm font-medium text-brown"
          >
            {item}
            <span aria-hidden className="text-blush">
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
