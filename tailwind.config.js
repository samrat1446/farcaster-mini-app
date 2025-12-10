/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base: {
          blue: '#0052FF',
          'blue-dark': '#0041CC',
          'blue-light': '#3377FF',
          background: '#FFFFFF',
          surface: '#F5F5F5',
          text: '#1A1A1A',
          'text-secondary': '#666666',
        },
      },
    },
  },
  plugins: [],
}
