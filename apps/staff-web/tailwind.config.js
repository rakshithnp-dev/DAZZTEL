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
          500: '#3b82f6', // Professional blue for operations
          600: '#2563eb',
          700: '#1d4ed8',
        },
        moto: {
          500: '#f97316',
        },
      },
    },
  },
  plugins: [],
};
