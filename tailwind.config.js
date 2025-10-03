/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-green-dark': '#2D4A3E',
        'brand-green-darker': '#243b31',
        lightGray: '#e2e2e2',
      },
    },
  },
  plugins: [],
};

