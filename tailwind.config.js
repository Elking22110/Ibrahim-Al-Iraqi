/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        'gold-light': '#F4DF4E',
        'light-bg': '#f5f5f0',
        'charcoal': '#1a1a1a',
        'card-bg': '#ffffff',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
        bold: ['Oswald', 'sans-serif'],
        bold: ['Oswald', 'sans-serif'],
        script: ['Allura', 'cursive'],
        'great-vibes': ['Great Vibes', 'cursive'],
        'bodoni': ['Bodoni Moda', 'serif'],
        'pinyon': ['Pinyon Script', 'cursive'],
        'amiri': ['Amiri', 'serif'],
        'cairo': ['Cairo', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
