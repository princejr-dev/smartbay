/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: '#667eea',
        'accent-dark': '#764ba2',
      },
      fontFamily: {
        audiowide: ['Audiowide', 'sans-serif'],
      },
      // Ajoute ceci
      keyframes: {
        'slide-in': {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease',
      },
    },
  },
  plugins: [],
}