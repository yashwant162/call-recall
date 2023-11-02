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
        fifth: "#101927",
        sixth: "bg-primary bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black"
      }
    },
  },
  plugins: [],
}

