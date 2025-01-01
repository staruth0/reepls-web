/** @type {import('tailwindcss').Config} */
export default {
  content: ['./pages/**/*.{html,js,ts,tsx}', './components/**/*.{html,js,ts,tsx}', './src/**/*.{html,js,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f9fff5',
          100: '#f2ffeb',
          200: '#aefd7d',
          300: '#7ef038',
          400: '#57c016',
          500: '#408415',
          600: '#aefd7d',
          700: '#effff5',
          800: '#f9fff5',
        },
        secondary: {
          50: '#534109',
          100: '#796215',
          200: '#ae8a13',
          300: '#e9b50c',
          400: '#ffcd29',
          500: '#ffd95c',
          600: '#ffe58f',
          700: '#fffc12',
          800: '#fff5d6',
        },
        neutral: {
          50: '#474747',
          100: '#737373',
          200: '#adadad',
          300: '#bdbdbd',
          400: '#c7c7c7',
          500: '#d9d9d9',
          600: '#e8e8e8',
          700: '#f5f5f5',
          800: '#fafafa',
        },
        main: {
          green: '#57c016',
          yellow: '#e9b50c',
        },
        background: '#fefefe',
        plain: {
          a: '#242424',
          b: '#fefefe',
        },
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        instrumentSerif: ['Instrument Serif', 'serif'],
      },
    },
  },
  plugins: [],
};
