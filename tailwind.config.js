const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        cyan: colors.cyan,
        teal: colors.teal,
        warmGray: colors.warmGray,
        coolGray: colors.coolGray,
      },
      animation: {
        beat: "beat 1s ease-out infinite",
      },
      keyframes: {
        beat: {
          "0%, 100%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.1)" },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
