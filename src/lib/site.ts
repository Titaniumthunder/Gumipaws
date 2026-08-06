/** Static marketing content & business info for the public site. */

export const BUSINESS = {
  name: "GumiPaws",
  phone: "(310) 555-0192",
  phoneHref: "tel:+13105550192",
  email: "hello@gumipaws.com",
  address: "123 Marina Way, Los Angeles, CA 90000",
  hours: "Tue–Sun 8am–4pm · Mon closed",
};

export const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Full Groom", href: "#full-groom" },
  { label: "Pricing", href: "#pricing" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Gallery", href: "#gallery" },
  { label: "Visit", href: "#visit" },
];

export const MARQUEE_ITEMS = [
  "Hand-finished cuts",
  "Tearless shampoos",
  "Gentle de-shedding",
  "Puppy's first groom",
  "Boutique treats",
  "Honest, posted prices",
];

/** 8 cards for the services grid. `accent` flags the gradient boutique card. */
export const SERVICE_CARDS = [
  {
    title: "Full Groom Package",
    price: "$109+",
    badge: "MOST LOVED",
    blurb: "Bath, haircut, style, nails, ears, and a spritz of finish.",
  },
  {
    title: "Bath & Brush",
    price: "$50+",
    blurb: "Warm hydro-bath, tearless shampoo, blow-out, and brush.",
  },
  {
    title: "Puppy's First Groom",
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

export const FULL_GROOM_SIZE_PRICING = [
  { size: "Toy", price: "$109+" },
  { size: "Small", price: "$124+" },
  { size: "Medium", price: "$149+" },
  { size: "Large", price: "$159+" },
  { size: "X-Large", price: "$179+" },
];

/** Three-column pricing table by size. */
export const PRICING_COLUMNS = [
  {
    name: "Bath",
    popular: false,
    note: "short / long hair",
    rows: [
      { size: "Toy", price: "$50+ / $60+" },
      { size: "Small", price: "$60+ / $70+" },
      { size: "Medium", price: "$75+ / $95+" },
      { size: "Large", price: "$90+ / $109+" },
      { size: "X-Large", price: "$110+ / $134+" },
    ],
  },
  {
    name: "Full Groom",
    popular: true,
    note: "all-inclusive",
    rows: [
      { size: "Toy", price: "$109+" },
      { size: "Small", price: "$124+" },
      { size: "Medium", price: "$149+" },
      { size: "Large", price: "$159+" },
      { size: "X-Large", price: "$179+" },
    ],
  },
  {
    name: "Poodles & Oodles",
    popular: false,
    note: "curly & doodle coats",
    rows: [
      { size: "Toy", price: "$139+" },
      { size: "Small", price: "$159+" },
      { size: "Medium", price: "$179+" },
      { size: "Large", price: "$209+" },
      { size: "X-Large", price: "$249+" },
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

export const SIZE_FOOTNOTE =
  "Sizes by weight: Toy <15 lb · Small 16–25 lb · Medium 26–45 lb · Large 46–75 lb · X-Large 76 lb+. Final price may vary with coat condition and matting.";

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
 * The GumiPaws logo, served from `public/gumipaws-hero.png` (see README).
 * It used to be the hero image; the hero now leads with a before/after
 * comparison, so the mark lives in the nav bar instead.
 */
export const LOGO = "/gumipaws-hero.png";

/**
 * One dog's photos. `before` is optional: entries that have both render as a
 * drag-to-compare slider, entries with only an `after` render as a plain photo.
 */
export type GalleryPhoto = {
  dogName: string;
  /** Pre-groom shot. Omit until there actually is one. */
  before?: string;
  after: string;
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
 * 1. Drop the files into `public/gallery/`.
 * 2. Reference them by the path *after* `public`, so
 *    `public/gallery/jojo-after.jpg` is written `/gallery/jojo-after.jpg`.
 * 3. Add or edit an entry in GALLERY_ITEMS below. Three shapes are supported:
 *
 *      // both shots -> drag-to-compare slider
 *      { dogName: "Jojo", before: "/gallery/jojo-before.jpg",
 *                          after: "/gallery/jojo-after.jpg" }
 *
 *      // only one shot -> ordinary photo, no slider UI
 *      { dogName: "Milo", after: "/gallery/milo-after.jpg" }
 *
 *      // a clip -> video player
 *      { dogName: "Luna", video: "/gallery/luna.mp4",
 *                         poster: "/gallery/luna-poster.jpg" }
 *
 * Order in this array is the order in the grid. The first, fourth and last
 * cells are the large ones, so put your best shots there. Adding a seventh
 * entry is fine — it just flows into a normal-sized cell.
 *
 * No rebuild-time image processing happens, so resize before adding: roughly
 * 1600px wide for photos and keep clips short and under ~10MB, or the page
 * gets heavy.
 * ------------------------------------------------------------------------ */

/**
 * PLACEHOLDER PHOTOS — stock dogs, not GumiPaws clients, and the "before"/
 * "after" shots are unrelated images rather than a real pair. Swap every URL
 * below for real client photos (e.g. `/gallery/jojo-before.jpg`) as they come in.
 */
export const HERO_BEFORE_AFTER: GalleryPhoto = {
  dogName: "Biscuit",
  before:
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1000&q=80",
  after:
    "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=80",
};

/**
 * Gallery entries, in grid order. Also PLACEHOLDER photos — see the note above.
 * A mix on purpose: three have a before shot and render as sliders, three are
 * plain photos, which is what the real library will look like for a while.
 */
export const GALLERY_ITEMS: GalleryEntry[] = [
  {
    dogName: "Jojo",
    before:
      "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?auto=format&fit=crop&w=800&q=80",
    after:
      "https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=800&q=80",
  },
  {
    dogName: "Milo",
    after:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
  },
  {
    dogName: "Poppy",
    after:
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80",
  },
  {
    dogName: "Bear",
    before:
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=80",
    after:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
  },
  {
    dogName: "Nori",
    after:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
  },
  {
    dogName: "Mochi",
    before:
      "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=800&q=80",
    after:
      "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=800&q=80",
  },

  // The video slot. Drop a clip into `public/gallery/`, then uncomment and
  // point this at it. Left commented out because an entry pointing at a file
  // that isn't there yet renders an empty player.
  // {
  //   dogName: "Luna",
  //   video: "/gallery/luna.mp4",
  //   poster: "/gallery/luna-poster.jpg",
  // },
];
