/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#111111",
        accent: "#D4AF37",
        ivory: "#F8F5F2",
        border: "#ECECEC",
        graysoft: "#707070",
      },
      fontFamily: {
        playfair: ["'Playfair Display'", "serif"],
        poppins: ["'Poppins'", "sans-serif"],
      }
    },
  },
  plugins: [],
}
