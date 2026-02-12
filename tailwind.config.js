/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ramadan: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        gold: {
          50: '#fbf7eb',
          100: '#f5ebd1',
          200: '#ebd5a3',
          300: '#e0bb70',
          400: '#d6a345',
          500: '#cc8e26',
          600: '#ae701e',
          700: '#8c531b',
          800: '#73431b',
          900: '#60391a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        golden: '0 10px 30px rgba(217, 119, 6, 0.15)',
        glow: '0 0 20px rgba(217, 119, 6, 0.3)',
      },
      animation: {
        slideInDown: 'slideInDown 0.5s ease',
        fadeIn: 'fadeIn 0.5s ease',
        slideInUp: 'slideInUp 0.5s ease',
      },
      keyframes: {
        slideInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
