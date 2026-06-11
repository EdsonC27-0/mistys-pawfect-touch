import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // #FFFFFF — pure white: page background, card fill, text-on-dark
        cream: "#FFFFFF",
        lilac: {
          // #FFC0CB — baby pink: tinted section backgrounds, footer, nav hover
          50: "#FFC0CB",
          // #F3CFC6 — blush: card borders, section dividers
          100: "#F3CFC6",
          // #FAA0A0 — light coral: input borders, deeper dividers
          200: "#FAA0A0",
        },
        lavender: {
          // #FFC0CB — baby pink: focus rings, ghost-button borders
          DEFAULT: "#FFC0CB",
          // #F88379 — coral: deeper accent borders
          deep: "#F88379",
        },
        plum: {
          // #FF69B4 — hot pink: headings, primary button, key brand moments
          DEFAULT: "#FF69B4",
          // #F88379 — coral: eyebrows, secondary gradient end, hover accents
          mid: "#F88379",
          // #FAA0A0 — light coral: soft variant, subtle highlights
          soft: "#FAA0A0",
        },
        // #0D0D0D — near-black: all body copy, maximum legibility
        inkgrey: "#0D0D0D",
        // #F88379 — coral: paw icons, star ratings, price labels
        gold: "#F88379",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px -12px rgba(255,105,180,0.20)",
        lift: "0 16px 50px -16px rgba(255,105,180,0.32)",
      },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
};
export default config;
