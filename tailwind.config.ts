import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
      },
      colors: {
        border: "rgba(255,255,255,0.08)",
        input: "rgba(255,255,255,0.15)",
        ring: "rgba(124,58,237,0.5)",
        background: "#0A0A0B",
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#7C3AED",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "rgba(255,255,255,0.06)",
          foreground: "#AFAFB8",
        },
        destructive: {
          DEFAULT: "#FCA5A5",
          foreground: "#0A0A0B",
        },
        muted: {
          DEFAULT: "#18181C",
          foreground: "#AFAFB8",
        },
        accent: {
          DEFAULT: "#E8D5FF",
          foreground: "#0A0A0B",
        },
        popover: {
          DEFAULT: "#18181C",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#222228",
          foreground: "#FFFFFF",
        },
        ink: {
          100: "#0A0A0B",
          90: "#111114",
          80: "#18181C",
          70: "#222228",
          60: "#2C2C34",
          50: "#3A3A44",
        },
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px",
        xl: "24px",
        "2xl": "32px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        pulseFull: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.12)' },
        },
        "slide-in-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-top": {
          from: { transform: "translateY(-20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-full": "pulseFull 1.2s ease-in-out infinite",
        "slide-in-bottom": "slide-in-bottom 0.4s cubic-bezier(0.25, 1.0, 0.5, 1)",
        "fade-in": "fade-in 0.3s ease-out forwards",
        "slide-in-top": "slide-in-top 0.4s cubic-bezier(0.25, 1.0, 0.5, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
