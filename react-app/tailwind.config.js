const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      body: ["-apple-system", "BlinkMacSystemFont", "sans-serif"],
    },
    extend: {
      colors: {
        pasha: "#ad2218",
        green: colors.green,
      },
    },
  },
  variants: {},
  plugins: [],
};
