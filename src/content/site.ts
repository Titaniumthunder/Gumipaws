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
 * The hero slideshow — one transformation at a time, fading to the next every
 * few seconds so a visitor sees several different dogs without touching
 * anything.
 *
 * Each image is a before/after pair side by side with its labels printed in,
 * which is why they are `fit: "contain"`: cropping one to fill the frame would
 * cut off the half that makes the point.
 *
 * Keep the strongest first — it shows before any rotation happens, and it is
 * the only one a visitor who prefers reduced motion ever sees.
 */
export const HERO_SLIDESHOW: GalleryPhoto[] = [
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
];

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
    alt: "Jojo, freshly groomed and smiling, riding home from GumiPaws",
  },
  {
    dogName: "Jojo",
    after: "/gallery/jojo-car-portrait.jpg",
    alt: "Jojo sitting up in the car, coat brushed out after a groom",
  },
  {
    dogName: "Jojo",
    after: "/gallery/jojo-lawn-alert.jpg",
    alt: "Jojo resting on the lawn by the flowerbeds",
  },
  {
    dogName: "Jojo",
    after: "/gallery/jojo-car-sit.jpg",
    alt: "Jojo in the back seat, freshly bathed and blow-dried",
  },
  {
    dogName: "Jojo",
    after: "/gallery/jojo-blanket.jpg",
    alt: "Jojo stretched out on a blanket with a favourite toy",
  },
  {
    dogName: "Jojo",
    after: "/gallery/jojo-lawn-rest.jpg",
    alt: "Jojo lying in the sun on the back lawn",
  },
  {
    dogName: "Jojo",
    after: "/gallery/jojo-nap.jpg",
    alt: "Jojo fast asleep among soft toys after a long spa day",
  },
];
