/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind scanne ces fichiers pour générer les classes CSS
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Active le mode sombre basé sur une classe CSS
  darkMode: 'class',
  theme: {
    extend: {
      // Nos couleurs personnalisées SmartBay
      colors: {
        accent: '#667eea',
        'accent-dark': '#764ba2',
      },
      fontFamily: {
        audiowide: ['Audiowide', 'sans-serif'],
      },
    },
  },
  plugins: [],
}