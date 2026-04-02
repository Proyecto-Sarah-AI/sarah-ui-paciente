/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aquí podrías agregar los colores exactos de la clínica si quieres ser pro
        primary: "#004a99", 
        secondary: "#009999",
      }
    },
  },
  plugins: [],
}