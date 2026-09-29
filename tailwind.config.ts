import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B2432",
        inkdeep: "#131A25",
        card: "#F1E8D6",
        cardsoft: "#E8DDC5",
        gold: "#D4A24C",
        goldbright: "#E4B96A",
        dauber: "#C0453A",
        teal: "#4E7C74",
        muted: "#9FA8B5",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        stamp: "0 2px 0 rgba(0,0,0,0.15)",
        card: "0 12px 30px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
