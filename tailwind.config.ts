import type { Config } from "tailwindcss";

// Brand colours, fonts and animations live in app/page.tsx (BRAND_CSS),
// so the design renders correctly even if this file isn't picked up.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};

export default config;
