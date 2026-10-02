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
          950: "rgb(var(--ink-950) / <alpha-value>)",
          900: "rgb(var(--ink-900) / <alpha-value>)",
          850: "rgb(var(--ink-850) / <alpha-value>)",
          800: "rgb(var(--ink-800) / <alpha-value>)",
          700: "rgb(var(--ink-700) / <alpha-value>)",
        },
        line: "rgb(var(--line) / var(--line-a))",
        fog: {
          hi: "rgb(var(--fog-hi) / <alpha-value>)",
          mid: "rgb(var(--fog-mid) / <alpha-value>)",
          low: "rgb(var(--fog-low) / <alpha-value>)",
        },
        acc: "rgb(var(--acc) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
        float: "var(--shadow-float)",
      },
    },
  },
  plugins: [],
};

export default config;
