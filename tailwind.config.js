/** @type {import('tailwindcss').Config} */
export default {
  // Aquí le decimos a Tailwind en qué archivos debe buscar las clases
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        brand: {
          background: "#f5f8fd",
          surface: "#dfe2e8",
          primary: "#1f293b",
          secondary: "#67778c",
          accent: "#0db17f",
          hover: "#17785a",
          dark: {
            background: "#1f273a",
            surface: "#1c2436",
            primary: "#f1f6fa",
            secondary: "#90a1b2",
            accent: "#35b498",
            hover: "#12956c",
          }
        }
      },
    },
  },
  plugins: [],
}