/** Static marketing content & business info for the public site. */

export const BUSINESS = {
  name: "GumiPaws",
  phone: "(310) 555-0192",
  phoneHref: "tel:+13105550192",
  email: "hello@gumipaws.com",
  address: "123 Marina Way, Los Angeles, CA 90000",
  hours: "Tue–Sun 8am–4pm · Mon closed",
};

/**
 * The site is a handful of short pages rather than one long homepage, so these
 * are routes, not fragments. Four items, deliberately: every extra one is
 * another decision at the top of every page.
 */
export const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

/**
 * The About page's story. Deliberately claims nothing the business has not
 * already said elsewhere on the site — no invented credentials, awards, staff
 * count or years in business. Replace with the real story when you have it.
 */
export const ABOUT = {
  lead: "GumiPaws is a boutique grooming spa for dogs who would rather be anywhere else — and leave wishing they could stay.",
  body: [
    "Every groom starts with a conversation. We ask about coat goals, sensitivities, and what your dog is like on a bad day, because a haircut is easier when nobody is frightened.",
    "Then the work itself: a warm hydro-bath sized to the coat, a tearless shampoo matched to the skin, a hand-finished cut, and the small things that are easy to skip — ears, nails, paw pads, a finishing spritz.",
    "Prices are posted in full, and the final figure is confirmed at drop-off before anything begins. No deposit, and you pay in person at pickup.",
  ],
};

/** Short, factual promises. Used on the About page. */
export const PROMISES = [
  {
    title: "Posted prices",
    blurb: "Every price is on the site. We confirm the final figure at drop-off, before any work starts.",
  },
  {
    title: "One groomer, start to finish",
    blurb: "The person who greets your dog is the person who finishes them, so nothing gets lost in a handover.",
  },
  {
    title: "No deposit",
    blurb: "Book online in a couple of minutes and pay in person at pickup.",
  },
];

export const MARQUEE_ITEMS = [
  "Hand-finished cuts",
  "Tearless shampoos",
  "Gentle de-shedding",
  "Puppy's first groom",
  "Boutique treats",
  "Honest, posted prices",
];

/**
 * Every call to action on the site draws its wording from here, so the same
 * action always reads the same way. Before this, one journey could offer "Book
 * a spa day", "Book this", "Book the full groom" and "Start booking" for the
 * identical destination, which made them look like four different things.
 */
export const CTA = {
  /** The one primary action. Anything that leads to /book uses this. */
  primary: "Book an Appointment",
  /** The secondary action, for people not ready to book yet. */
  secondary: "View Pricing",
  /** Service cards: name the service so the choice is explicit. */
  choose: (service: string) => `Choose ${service}`,
};

/**
 * The services grid. `accent` flags the gradient boutique card.
 *
 * `featured` marks the four services shown as cards on the homepage. The rest
 * stay in the list — they still fill the footer and the "more services"
 * dropdown — but eight cards in a row read as clutter, especially stacked on a
 * phone.
 */
export const SERVICE_CARDS = [
  {
    title: "Full Groom Package",
    featured: true,
    price: "$109+",
    badge: "MOST LOVED",
    blurb: "Bath, haircut, style, nails, ears, and a spritz of finish.",
  },
  {
    title: "Bath & Brush",
    featured: true,
    price: "$50+",
    blurb: "Warm hydro-bath, tearless shampoo, blow-out, and brush.",
  },
  {
    title: "Puppy's First Groom",
    featured: true,
    price: "$40+",
    blurb: "A gentle intro to the spa for pups under six months.",
  },
  {
    title: "De-shedding",
    price: "$20+",
    blurb: "Loosen and lift the undercoat so your home stays fluff-free.",
  },
  {
    title: "Mat Removal",
    price: "$15+",
    blurb: "Careful de-matting to keep skin comfortable and healthy.",
  },
  {
    title: "Nail Trim & Buff",
    price: "$15+",
    blurb: "Trimmed, smoothed, and buffed for happy paws.",
  },
  {
    title: "Teeth Brushing",
    price: "$12+",
    blurb: "Fresh breath and a healthy smile between vet visits.",
  },
  {
    title: "Add-ons",
    featured: true,
    price: "$5+",
    blurb:
      "De-shedding, nail trims, teeth brushing, a blueberry facial and more — add any to a groom.",
    /** Add-ons are chosen inside the booking flow, so this card points at the
        posted add-on list rather than starting a booking. */
    href: "/services",
  },
  {
    title: "The Boutique",
    price: null,
    accent: true,
    blurb: "Bows, bandanas, colognes, and boutique treats to finish the look.",
  },
];

export const FULL_GROOM_CHECKLIST = [
  "Warm hydro-bath with tearless, coat-matched shampoo",
  "Full haircut & hand-finished style",
  "Blow-out and de-shed",
  "Nail trim, buff & paw-pad tidy",
  "Ear cleaning & sanitary trim",
  "Finishing spritz, bow or bandana",
];

/**
 * Weight bands. Named once here because they appear against every price on the
 * services page, and a size that means one thing in the bath list and another
 * in the full-groom list would be worse than not saying it at all.
 */
const SIZE_BANDS = [
  { name: "Toy", detail: "Under 15 lb" },
  { name: "Small", detail: "16–25 lb" },
  { name: "Medium", detail: "26–45 lb" },
  { name: "Large", detail: "46–75 lb" },
  { name: "X-Large", detail: "76 lb and over" },
];

/** One priced line: what it costs, what it is, and who it is for. */
export type ServiceTier = {
  price: string;
  name: string;
  detail?: string;
};

/** A set of tiers under an optional sub-heading, e.g. "Short hair". */
export type ServiceGroup = { name?: string; tiers: ServiceTier[] };

/** One tab on the services page. */
export type ServiceTab = {
  id: string;
  label: string;
  blurb: string;
  groups: ServiceGroup[];
};

/** Pair a run of prices with the size bands, in order. */
const bySize = (prices: string[]): ServiceTier[] =>
  SIZE_BANDS.map((band, i) => ({
    price: prices[i],
    name: band.name,
    detail: band.detail,
  }));

/**
 * The services menu, as tabs.
 *
 * This replaced a three-column table that asked a visitor to read across
 * columns they did not care about to find the one price they did. Picking the
 * service first and then reading a short list is the way people actually
 * arrive at this page: they know they want a bath, not a comparison.
 *
 * Add-ons reuse ADD_ONS below rather than restating the list, so the menu and
 * the booking flow cannot drift apart.
 */
export const SERVICE_MENU: ServiceTab[] = [
  {
    id: "bath",
    label: "Bath & Brush",
    blurb:
      "Warm hydro-bath, tearless shampoo matched to the skin, blow-out and brush. Priced by size, and by how much coat there is to dry.",
    groups: [
      { name: "Short hair", tiers: bySize(["$50+", "$60+", "$75+", "$90+", "$110+"]) },
      { name: "Long hair", tiers: bySize(["$60+", "$70+", "$95+", "$109+", "$134+"]) },
    ],
  },
  {
    id: "full-groom",
    label: "Full Groom",
    blurb:
      "Everything in the bath, plus a hand-finished haircut, nails, ears, sanitary trim and a finishing spritz. Our most-booked service.",
    groups: [
      { tiers: bySize(["$109+", "$124+", "$149+", "$159+", "$179+"]) },
    ],
  },
  {
    id: "puppy",
    label: "Puppy's First Groom",
    blurb:
      "A short, gentle introduction to the salon for pups under six months — handling, water, clippers and dryer, at whatever pace they can take.",
    groups: [
      {
        tiers: [
          {
            price: "$40+",
            name: "Puppy's First Groom",
            detail: "Under six months",
          },
        ],
      },
    ],
  },
  {
    id: "poodles",
    label: "Poodles & Oodles",
    blurb:
      "Curly and doodle coats take longer to brush out, dry and shape, so they are priced on their own rather than hidden as a surcharge.",
    groups: [
      { tiers: bySize(["$139+", "$159+", "$179+", "$209+", "$249+"]) },
    ],
  },
];

/** 10 add-ons listed below the pricing table. */
export const ADD_ONS = [
  { name: "De-shedding treatment", price: "$20+" },
  { name: "Nail trim & buff", price: "$15+" },
  { name: "Mat removal", price: "$15+" },
  { name: "Teeth brushing", price: "$12+" },
  { name: "Ear cleaning", price: "$10+" },
  { name: "Anal gland expression", price: "$12+" },
  { name: "Blueberry facial", price: "$10+" },
  { name: "Paw balm & pad trim", price: "$8+" },
  { name: "Flea & tick shampoo", price: "$15+" },
  { name: "Bow, bandana or cologne", price: "$5+" },
];

/**
 * The add-ons tab, appended here because it reads from ADD_ONS above. One list,
 * so the services page and the booking flow cannot disagree about the menu.
 */
SERVICE_MENU.push({
  id: "add-ons",
  label: "Add-ons",
  blurb:
    "Add any of these to a bath or a groom. Chosen during booking, and priced the same whichever service they go with.",
  groups: [{ tiers: ADD_ONS.map((a) => ({ price: a.price, name: a.name })) }],
});

/**
 * The caveat under the services menu. It used to spell out the weight bands
 * too, but every priced line now carries its own band, so all that remained
 * was saying it twice.
 */
export const SIZE_FOOTNOTE =
  "Every price is a starting price. The final figure depends on coat condition and matting, and we confirm it with you at drop-off before any work begins.";

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Welcome & chat",
    blurb: "We greet your pup, talk coat goals, and note any sensitivities.",
  },
  {
    step: 2,
    title: "Warm hydro-bath",
    blurb: "A gentle, tearless wash sized to your dog's coat and skin.",
  },
  {
    step: 3,
    title: "Cut & style",
    blurb: "Hand-finished haircut, nails, ears, and the details that matter.",
  },
  {
    step: 4,
    title: "Fluff & home",
    blurb: "Blow-out, a boutique finish, and a text when they're ready.",
  },
];

/**
 * The GumiPaws logo, shown in the nav on every page (public, booking, admin).
 *
 * `public/brand/gumipaws-logo.png` is a 256px copy — it renders at 32–40px, so
 * anything larger is bytes every visitor downloads for nothing. The full-size
 * master is kept at `assets/brand/gumipaws-logo-original.png`, which is outside
 * `public/` and therefore never served. Re-export from the master if you ever
 * need the mark bigger.
 */
export const LOGO = "/brand/gumipaws-logo.png";

/**
 * One photo in the hero rotation or the gallery.
 *
 * There is no `before` field: the drag-to-compare slider was removed in favour
 * of showing each transformation whole. The collage images already put the two
 * states side by side with their own printed labels, which is what the slider
 * was reconstructing — badly, since its badges fought the printed ones.
 */
export type GalleryPhoto = {
  dogName: string;
  /** Path under `public`, so `public/gallery/x.jpg` is written `/gallery/x.jpg`. */
  after: string;
  /**
   * Describes the picture for screen readers, and shows if the image fails to
   * load. Say what is actually pictured.
   */
  alt?: string;
  /**
   * How the photo fills its frame. "cover" crops to fill and suits a single
   * portrait subject; "contain" fits the whole image in, letterboxed against
   * the card background — needed for the side-by-side collages, where cropping
   * would cut off half the story. Defaults to "cover".
   */
  fit?: "cover" | "contain";
};

/** One dog's video clip. Renders a player in the grid instead of photos. */
export type GalleryClip = {
  dogName: string;
  /** Video file, e.g. "/gallery/luna.mp4". MP4 (H.264) plays everywhere. */
  video: string;
  /** Still frame shown before playback. Worth adding — without it the cell
   *  is blank until the browser fetches enough of the video to draw a frame. */
  poster?: string;
};

/** A gallery cell is either photos or a video clip. */
export type GalleryEntry = GalleryPhoto | GalleryClip;

/* ---------------------------------------------------------------------------
 * ADDING YOUR OWN PHOTOS AND VIDEOS
 *
 * 1. Drop the files into `public/gallery/`. Resize first — `scripts/prep-photos.sh`
 *    does it, or any export around 1600px wide is fine. Full-size phone photos
 *    are several megabytes each and make the page crawl on mobile.
 * 2. Reference them by the path *after* `public`, so
 *    `public/gallery/rosie.jpg` is written `/gallery/rosie.jpg`.
 * 3. Add an entry to GALLERY_ITEMS below. Two shapes are supported:
 *
 *      // a photo
 *      { dogName: "Rosie", after: "/gallery/rosie.jpg",
 *        alt: "Rosie after her groom" }
 *
 *      // a clip -> video player
 *      { dogName: "Luna", video: "/gallery/luna.mp4",
 *                         poster: "/gallery/luna-poster.jpg" }
 *
 * Add `fit: "contain"` to any picture that must be seen whole — a before/after
 * collage, or anything wider than it is tall. Without it the photo is cropped
 * to fill its frame, which suits a single dog but would slice a collage in half.
 * ------------------------------------------------------------------------ */

/**
 * The home page hero: one full-bleed photo with the headline set over it.
 *
 * The photo is black and white on purpose. White type needs a dark picture
 * behind it to stay readable, and a colour image would have to be dimmed so
 * far to get there that it would lose what made it worth using.
 *
 * It is a styled studio image rather than a client groom, which is why it lives
 * here and not in GALLERY_ITEMS — the gallery promises real dogs.
 */
export const HOME_HERO = {
  image: "/brand/hero-spa-bw.jpg",
  alt: "Two fluffy black-and-white doodles sitting side by side in a quiet grooming studio",
  headline: "The spa day your pup looks forward to.",
  subline: "Boutique grooming · Honest, posted prices",
};

/**
 * Gallery entries, in the order shown. These render one at a time in a sliding
 * carousel (GalleryCarousel.tsx), so the list can grow as long as you like.
 *
 * The four transformations lead because they are the strongest work; Jojo — the
 * GumiPaws dog, and the reason the logo looks the way it does — follows.
 *
 * The transformations are `fit: "contain"` so both halves stay visible. Jojo's
 * portraits are left on the default "cover", which fills the frame.
 */
export const GALLERY_ITEMS: GalleryEntry[] = [
  {
    dogName: "Transformation 2",
    after: "/gallery/transformation-2.jpg",
    alt: "An apricot poodle before and after grooming: shaggy and uneven, then trimmed into a rounded, fluffy style",
    fit: "contain",
  },
  {
    dogName: "Transformation 4",
    after: "/gallery/transformation-4.jpg",
    alt: "A golden doodle before and after grooming: flat, tangled coat, then brushed out and evenly shaped",
    fit: "contain",
  },
  {
    dogName: "Transformation 3",
    after: "/gallery/transformation-3.jpg",
    alt: "A small white dog before and after grooming: damp and scruffy in a towel, then dry and neatly rounded",
    fit: "contain",
  },
  {
    dogName: "Transformation 1",
    after: "/gallery/transformation-1.jpg",
    alt: "A brown wire-haired doodle before and after grooming from two angles: matted and unkempt, then soft and full",
    fit: "contain",
  },

  {
    dogName: "Jojo",
    after: "/gallery/jojo-fresh-groom.jpg",
    fit: "contain",
    alt: "Jojo, freshly groomed and smiling, riding home from GumiPaws",
  },
  {
    dogName: "Jojo",
    after: "/gallery/jojo-car-portrait.jpg",
    fit: "contain",
    alt: "Jojo sitting up in the car, coat brushed out after a groom",
  },
  {
    dogName: "Jojo",
    after: "/gallery/jojo-lawn-alert.jpg",
    fit: "contain",
    alt: "Jojo resting on the lawn by the flowerbeds",
  },
  {
    dogName: "Jojo",
    after: "/gallery/jojo-car-sit.jpg",
    fit: "contain",
    alt: "Jojo in the back seat, freshly bathed and blow-dried",
  },
  {
    dogName: "Jojo",
    after: "/gallery/jojo-blanket.jpg",
    fit: "contain",
    alt: "Jojo stretched out on a blanket with a favourite toy",
  },
  {
    dogName: "Jojo",
    after: "/gallery/jojo-lawn-rest.jpg",
    fit: "contain",
    alt: "Jojo lying in the sun on the back lawn",
  },
  {
    dogName: "Jojo",
    after: "/gallery/jojo-nap.jpg",
    fit: "contain",
    alt: "Jojo fast asleep among soft toys after a long spa day",
  },
];
