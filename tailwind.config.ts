import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette — market dynamics
        bull: "#10B981",
        bear: "#EF4444",
        deep: "#0F172A",
        // Secondary palette — technology & speed
        volt: "#06B6D4",
        plat: "#E5E7EB",
        alert: "#F59E0B",
        neon: "#8B5CF6",
        // Panel layering (deep space surfaces)
        surface: {
          950: "#020617",
          900: "#0B1220",
          850: "#0F172A",
          800: "#131C2E",
          700: "#1E293B",
          600: "#334155",
        },
        border: "rgba(148, 163, 184, 0.14)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "SF Mono",
          "Menlo",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 12px 32px -18px rgba(0,0,0,0.9)",
        "glow-volt": "0 0 0 1px rgba(6,182,212,0.35), 0 0 24px -6px rgba(6,182,212,0.45)",
        "glow-bull": "0 0 22px -8px rgba(16,185,129,0.7)",
        "glow-bear": "0 0 22px -8px rgba(239,68,68,0.7)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(rgba(148,163,184,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.055) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(ellipse 80% 55% at 50% -10%, rgba(6,182,212,0.16), transparent), radial-gradient(ellipse 60% 45% at 85% 10%, rgba(139,92,246,0.10), transparent)",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.35", transform: "scale(0.82)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "flash-up": {
          "0%": { backgroundColor: "rgba(16,185,129,0.28)" },
          "100%": { backgroundColor: "transparent" },
        },
        "flash-down": {
          "0%": { backgroundColor: "rgba(239,68,68,0.28)" },
          "100%": { backgroundColor: "transparent" },
        },
        "scan-x": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(4px)" },
        },
        "float-a": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(34px, 30px, 0) scale(1.14)" },
        },
        "float-b": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(-30px, 24px, 0) scale(1.1)" },
        },
        "grid-pan": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 34px" },
        },
      },
      animation: {
        ticker: "ticker 46s linear infinite",
        "pulse-dot": "pulse-dot 1.6s ease-in-out infinite",
        shimmer: "shimmer 2.2s linear infinite",
        "flash-up": "flash-up 0.7s ease-out",
        "flash-down": "flash-down 0.7s ease-out",
        "float-a": "float-a 17s ease-in-out infinite",
        "float-b": "float-b 21s ease-in-out infinite",
        "grid-pan": "grid-pan 7s linear infinite",
      },
      transitionTimingFunction: {
        terminal: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [animate],
};

export default config;
