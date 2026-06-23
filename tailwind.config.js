/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medico: {
          50: '#f0f4f7',
          100: '#d4e2e8',
          200: '#a8bfd4',
          300: '#7aa2bc',
          400: '#5279a6',
          500: '#2b518b',
          600: '#183b6f',
          700: '#102d52',
          800: '#0a1f3a',
          900: '#040f1f',
        }
      }
    },
  },
  plugins: [],
} 