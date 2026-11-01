import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        humaira: {
          pink: "#FADADD",
          pinkLight: "#FFF0F3",
          pinkHover: "#F6C1C7",
          pinkDark: "#C76D7E",
          cream: "#FFF8F0",
          creamDark: "#F7ECE1",
          gold: "#D4AF37",
          goldLight: "#FBF3DC",
          goldDark: "#AA8518",
          sage: "#8A9A86",
          sageLight: "#EBF1EA",
          sageDark: "#60705C",
          plum: "#2E2429",
          plumMuted: "#6F5C65",
          plumLight: "#EFE6E9",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(212, 175, 55, 0.08), 0 2px 6px -1px rgba(199, 109, 126, 0.06)",
        card: "0 10px 30px -5px rgba(200, 140, 160, 0.12)",
        glow: "0 0 25px rgba(212, 175, 55, 0.35)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
