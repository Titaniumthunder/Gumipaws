import type { Metadata } from "next";
import { Hanken_Grotesk, Manrope } from "next/font/google";
import "./globals.css";

// Headings: Manrope. Body: Hanken Grotesk. Exposed as CSS variables consumed by
// Tailwind's fontFamily config.
// Manrope replaces the Gloock serif for headings: a geometric sans set large
// and tightly tracked reads as calmer and more modern, which is the quality
// the review picked out. The pink and cream palette is unchanged.
const manrope = Manrope({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GumiPaws — The spa day your pup looks forward to",
  description:
    "GumiPaws is a boutique dog grooming spa in Los Angeles. Full grooms, tearless baths, gentle de-shedding, and puppy's first grooms. Honest, posted prices. Book a spa day.",
  openGraph: {
    title: "GumiPaws Dog Grooming Spa",
    description: "The spa day your pup looks forward to.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${hanken.variable}`}>
      <body>{children}</body>
    </html>
  );
}
