import type { Config } from "tailwindcss";

/**
 * GumiPaws brand tokens. Colors and fonts mirror the design spec so component
 * markup can use semantic classes (e.g. `bg-cream`, `text-brown`) instead of
 * raw hex values.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: "#F6F0E6", deep: "#EFE7DA" },
        brown: { DEFAULT: "#4A3B2E", soft: "#5B4A3A" },
        blush: { DEFAULT: "#D8949A", mid: "#E9AEB2", light: "#F3D9DB" },
        gold: "#B4894F",
        card: "#FCFAF5",
      },
      fontFamily: {
        // Wired up via next/font in layout.tsx (CSS variables).
        heading: ["var(--font-manrope)", "system-ui", "sans-serif"],
        body: ["var(--font-hanken)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(74, 59, 46, 0.25)",
        card: "0 4px 20px -8px rgba(74, 59, 46, 0.18)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
