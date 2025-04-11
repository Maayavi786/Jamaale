import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import theme from "../theme.json";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: theme.colors.background,
        foreground: theme.colors.foreground,
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        accent: theme.colors.accent,
        muted: theme.colors.muted,
        card: theme.colors.card,
        popover: theme.colors.popover,
        border: theme.colors.border,
        input: theme.colors.input,
        ring: theme.colors.ring,
        destructive: theme.colors.destructive,
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
      spacing: theme.spacing,
      borderRadius: theme.borderRadius,
      boxShadow: theme.shadows,
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config; 