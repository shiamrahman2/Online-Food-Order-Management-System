/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1D1420',
        plum: '#2B1B2E',
        cream: '#FFF8F0',
        mango: {
          DEFAULT: '#FF8A00',
          dark: '#E67600',
          light: '#FFB347',
        },
        chili: {
          DEFAULT: '#E4572E',
          dark: '#C7431E',
        },
        basil: '#3A7D44',
        sand: '#F4E9DA',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        ticket: '18px',
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(29,20,32,0.18)',
        card: '0 4px 20px -4px rgba(29,20,32,0.12)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(120% 120% at 10% 0%, #FFB347 0%, #FF8A00 35%, #E4572E 75%, #C7431E 100%)',
      },
    },
  },
  daisyui: {
    themes: [
      {
        foodhub: {
          primary: '#FF8A00',
          secondary: '#E4572E',
          accent: '#3A7D44',
          neutral: '#1D1420',
          'base-100': '#FFF8F0',
          info: '#3ABFF8',
          success: '#3A7D44',
          warning: '#FBBD23',
          error: '#E4572E',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
}
