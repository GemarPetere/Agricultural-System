module.exports = {
  content: ["*.{html,js}", "components/*.{html,js}", "pages/*.{html,js} "],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
