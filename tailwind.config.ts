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
        cyber: {
          dark: "#0b1120",
          navy: "#0f172a",
          slate: "#1e293b",
          border: "#334155",
          accent: "#38bdf8",
        },
        risk: {
          critical: "#dc2626",
          criticalBg: "#fef2f2",
          criticalBorder: "#fecaca",
          high: "#ea580c",
          highBg: "#fff7ed",
          highBorder: "#fed7aa",
          medium: "#f59e0b",
          mediumBg: "#fffbeb",
          mediumBorder: "#fde68a",
          low: "#10b981",
          lowBg: "#ecfdf5",
          lowBorder: "#a7f3d0",
          info: "#0284c7",
          infoBg: "#f0f9ff",
          infoBorder: "#bae6fd",
        }
      },
    },
  },
  plugins: [],
};
export default config;
