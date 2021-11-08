const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  purge: ['./public/**/*.html', './src/**/*.{astro,js,jsx,ts,tsx,vue,svelte}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      wine: '#941926',
      cobalt: '#223e4c',
      folage: '#559c3b',
      sky: '#56a5b9',
      mustard: '#d7972a',
    },
    extend: {
      fontFamily: {
        heading: ['Prata'],
        secondary: ['Glacial Indifference'],
      },
    },
  },
};
