import { type Config } from "tailwindcss";
import theme from "./theme.json";

export default {
  content: ["./client/**/*.{js,ts,jsx,tsx}"],
  theme: {
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
        sans: theme.font.sans,
      },
      spacing: theme.spacing,
      borderRadius: theme.borderRadius,
      boxShadow: theme.shadows,
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
    require("tailwindcss-rtl")
  ],
} satisfies Config;
