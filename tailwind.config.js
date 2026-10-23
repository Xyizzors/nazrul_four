/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { bn: ["Hind Siliguri", "Noto Serif Bengali", "Nirmala UI", "sans-serif"] },
      colors: {
        green: { 950: "#0F241E", 900: "#16302A", 800: "#1F4B3F", 700: "#2A5F4F", 100: "#DCE7E0" },
        cream: { 50: "#FBF7EC", 100: "#F6EFDD", 200: "#EFE4C8" },
        red: { 700: "#9C3B2E", 800: "#832F24" },
        charcoal: { 900: "#231F1B", 700: "#4A443C", 500: "#756B5E" },
        gold: { 500: "#B98A2E", 300: "#D7B36A" },
      },
    },
  },
};
