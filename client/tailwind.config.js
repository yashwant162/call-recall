/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A1A1D",
        secondary: "#950740",
        ternary: "#4E4E50",
        fourth: "#C38D93",
        fifth: "#E8A87C"
      }
    },
  },
  plugins: [],
}

