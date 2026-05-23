/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#534AB7',
        'primary-dark': '#3C3489',
        'primary-light': '#EEEDFE',
        secondary: '#EF9F27',
        'secondary-light': '#FAEEDA',
        success: '#0F6E56',
        danger: '#993C1D',
      },
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
        serif: ['Amiri', 'serif'],
      }
    },
  },
  plugins: [],
}