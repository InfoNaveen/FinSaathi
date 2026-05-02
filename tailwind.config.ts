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
        navy: {
          DEFAULT: "#0A1628",
          mid: "#112040",
          light: "#1A2F52",
        },
        amber: {
          DEFAULT: "#F0A500",
          dim: "#C47F00",
        },
        "off-white": "#F4F6FA",
        slate: {
          DEFAULT: "#8B9BB4",
          light: "#C5CEDB",
        },
        risk: {
          critical: "#E03131",
          high: "#D4730A",
          medium: "#2563EB",
          low: "#16A34A",
        },
      },
      fontFamily: {
        serif: ["DM Serif Display", "Georgia", "serif"],
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
        vernacular: ["Noto Sans", "sans-serif"],
      },
      borderRadius: {
        card: "5px",
        pill: "999px",
      },
      maxWidth: {
        landing: "1100px",
        analyze: "1240px",
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "16": "64px",
        "20": "80px",
        "24": "96px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "benchmark-fill": {
          "0%": { width: "0%" },
          "100%": { width: "var(--fill-width)" },
        },
        "progress-bar": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "dots": {
          "0%, 80%, 100%": { transform: "scale(0)", opacity: "0" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
        "crossfade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "crossfade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pulse-amber": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(240,165,0,0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(240,165,0,0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease forwards",
        "slide-up": "slide-up 0.5s ease forwards",
        "progress-bar": "progress-bar 15s linear forwards",
        "dots": "dots 1.4s ease-in-out infinite",
        "spin-slow": "spin-slow 2s linear infinite",
        "pulse-amber": "pulse-amber 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
