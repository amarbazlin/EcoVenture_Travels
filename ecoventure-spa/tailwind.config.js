/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        eco: "#2E8B57",//custom color
      },
      fontFamily: {
        eco: ["Poppins","sans-serif"],//custom font
      },
    },
  },
  plugins: [],
};
