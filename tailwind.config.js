/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#FFFDF8',
          100: '#FDF8EE',
          200: '#F7EBD4',
          300: '#EDD7B0',
        },
        poster: {
          orange: '#EA580C',
          orangeLight: '#FB923C',
          amber: '#F59E0B',
          cyan: '#0284C7',
          red: '#DC2626',
          green: '#4D7C0F',
          brown: '#5C3A21',
        }
      },
      fontFamily: {
        display: ['"Baloo 2"', 'cursive', 'sans-serif'],
        serif: ['"Lora"', '"Playfair Display"', 'Georgia', 'serif'],
        script: ['"Dancing Script"', 'cursive'],
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};

