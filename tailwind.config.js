/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed'
      }
    },
    fontSize: {
          sm: '0.95rem',
          base: '1.1rem', // 👈 this is the new default
          lg: '1.25rem',
          xl: '1.5rem',
  },
  },
  plugins: []
}


