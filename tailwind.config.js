/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        width: {
          '0%': { width: '0' },
          '100%': { width: '8rem' }, // w-32
        },
      },
      animation: {
        slideUp: 'slideUp 0.5s ease-out',
        fadeIn: 'fadeIn 1s ease-out',
        width: 'width 2s ease-in-out',
      },
    },
  },
  plugins: [],
}

