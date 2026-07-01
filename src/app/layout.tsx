import type { Metadata } from "next";
import { Gloock, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

// Headings: Gloock. Body: Hanken Grotesk. Exposed as CSS variables consumed by
// Tailwind's fontFamily config.
const gloock = Gloock({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gloock",
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
    <html lang="en" className={`${gloock.variable} ${hanken.variable}`}>
      <body>{children}</body>
    </html>
  );
}
