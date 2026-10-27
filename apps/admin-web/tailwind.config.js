/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#8b5cf6', // Violet/Purple for Platform Administration
          600: '#7c3aed',
          700: '#6d28d9',
        },
        moto: {
          500: '#f97316',
        },
      },
    },
  },
  plugins: [],
};
