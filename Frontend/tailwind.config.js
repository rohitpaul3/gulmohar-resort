/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gulmohar: {
          50: '#f7fdf7',
          100: '#edfcec',
          200: '#d3f7d1',
          300: '#abeea6',
          400: '#7ade73',
          500: '#4fcc49',
          600: '#3ba237',
          700: '#32802f',
          800: '#2c6529',
          900: '#275426',
        }
      },
    },
  },
  plugins: [],
}
