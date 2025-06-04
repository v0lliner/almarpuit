/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#ecf1ec',
          100: '#d0dbd0',
          200: '#b3c5b3',
          300: '#95af95',
          400: '#779e77',
          500: '#5a8d5d',
          600: '#416a43',
          700: '#2f4f33',
          800: '#1a331c',
          900: '#051a08',
        },
        amber: {
          50: '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#ffc107',
          600: '#ffb300',
          700: '#ffa000',
          800: '#ff8f00',
          900: '#ff6f00',
        },
        wood: {
          100: '#f8f4e8',
          200: '#e8d9b5',
          300: '#d4ba84',
          400: '#b3965e',
          500: '#8B4513',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('/images/hero-bg.jpg')",
        'wood-texture': "url('/images/wood-texture.jpg')",
      }
    },
  },
  plugins: [],
};