/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Esto le dice a Tailwind: "Mira dentro de la carpeta src"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}