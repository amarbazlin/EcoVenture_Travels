/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",   // scans all js and jsx files inside src
  ],
  darkMode: "class", // enables class-based dark mode (e.g. <html class="dark">)
  theme: {
    extend: {
      colors: {
        eco: "#2E8B57", // custom green color
      },
      fontFamily: {
        eco: ["Poppins", "sans-serif"], // custom font family
      },
    },
  },
  plugins: [],
};
