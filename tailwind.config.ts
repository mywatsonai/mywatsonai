import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wave: {
          "50%": { height: "20%" },
          "100%": { height: "100%" },
        },
        stop: {
          "0%": { height: "40%" },
          "100%": { height: "40%" },
        },
      },
      animation: {
        wave: "wave 0.8s linear infinite",
        stop: "stop 1s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
