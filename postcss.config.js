// postcss.config.js
export default {
  plugins: {
    // Usamos el conector oficial de la versión 4
    "@tailwindcss/postcss": {}, 
    // Añade prefijos para que se vea bien en todos los navegadores (Safari, Chrome, etc.)
    "autoprefixer": {},
  },
}