/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#092328',    // Background
          card: '#12544F',    // Cards & Surfaces
          primary: '#2A835F', // Buttons & Primary Actions
          accent: '#8BBB92',  // Text highlights & Secondary
        }
      }
    },
  },
  plugins: [],
}