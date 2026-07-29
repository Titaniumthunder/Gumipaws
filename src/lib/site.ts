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
 * Hero image — the GumiPaws logo. Served from `public/gumipaws-hero.png`.
 * Save the provided logo file at that path (see README).
 */
export const HERO_PHOTO = "/gumipaws-hero.png";

export const GALLERY_PHOTOS = [
  "https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=800&q=80",
];
