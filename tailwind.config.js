const { url } = require('inspector');
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['"Inter"', 'sans-serif'],
    },
    colors: {
      white: colors.white,
      black: colors.black,
      gray: colors.gray,
      blue: colors.blue,
      indigo: colors.indigo,
      red: colors.red,
      orange: colors.orange,
      green: colors.green,
    },
    extend: {
      scale: {
        97: '.97',
        98: '.98',
        99: '.99',
      },
      ringWidth: {
        5: '5px',
        6: '6px',
      },
      aspectRatio: {
        '16/9': '16 / 9',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
