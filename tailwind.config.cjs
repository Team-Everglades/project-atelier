/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html",
    "./src/**/*.jsx"],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"), require('tailwind-scrollbar-hide')],
}
