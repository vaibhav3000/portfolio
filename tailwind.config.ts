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
          950: "#F4F2EE",
          900: "#FBFAF8",
          850: "#F1EFE9",
          800: "#E7E4DC",
          700: "#D8D4C9",
        },
        line: "rgba(26,25,19,0.10)",
        fog: {
          hi: "#1A1913",
          mid: "#52504A",
          low: "#6E6B63",
        },
        acc: "#1A1913",
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
        glow: "0 2px 16px rgba(26,25,19,0.14)",
        float: "0 12px 40px rgba(26,25,19,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
