import { SIZES } from "./pricing";

/** Groomer options shown in the wizard. "Any available" lets the spa assign. */
export const GROOMERS = ["Any available", "Maria", "Sam", "Jordan"] as const;

/** Fixed appointment slots offered by the spa. */
export const TIME_SLOTS = [
  "9:00am",
  "10:30am",
  "12:00pm",
  "1:30pm",
  "3:00pm",
] as const;

/** ~19 common breeds plus a catch-all. */
export const BREEDS = [
  "Labrador Retriever",
  "Golden Retriever",
  "French Bulldog",
  "Poodle",
  "Goldendoodle",
  "Labradoodle",
  "German Shepherd",
  "Bulldog",
  "Beagle",
  "Dachshund",
  "Yorkshire Terrier",
  "Shih Tzu",
  "Maltese",
  "Pomeranian",
  "Cavalier King Charles Spaniel",
  "Cocker Spaniel",
  "Border Collie",
  "Australian Shepherd",
  "Corgi",
  "Mixed / Other",
] as const;

/** Size chips with the weight guidance shown under each. */
export const SIZE_OPTIONS: { value: (typeof SIZES)[number]; hint: string }[] = [
  { value: "Toy", hint: "<15 lb" },
  { value: "Small", hint: "16–25 lb" },
  { value: "Medium", hint: "26–45 lb" },
  { value: "Large", hint: "46–75 lb" },
  { value: "X-Large", hint: "76 lb+" },
];
