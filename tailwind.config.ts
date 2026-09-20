import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#060709",
          900: "#0a0c10",
          850: "#0d1016",
          800: "#12151c",
          700: "#1a1f28",
        },
        line: "rgba(148,163,184,0.10)",
        fog: {
          hi: "#eef1f5",
          mid: "#9aa4b2",
          low: "#5d6878",
        },
        acc: {
          green: "#45e0a0",
          cyan: "#67e8f9",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(69,224,160,0.14)",
        "glow-cyan": "0 0 32px rgba(103,232,249,0.10)",
        card: "inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
