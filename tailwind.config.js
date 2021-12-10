const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './public/**/*.html',
    './src/**/*.{astro,js,jsx,ts,tsx,vue,svelte}',
  ],
  theme: {
    extend: {
      colors: {
        gray: colors.neutral,
        wine: '#941926',
        cobalt: '#223e4c',
        folage: '#559c3b',
        sky: '#56a5b9',
        mustard: '#d7972a',
      },
      fontFamily: {
        heading: ['Prata'],
        secondary: ['Glacial Indifference'],
      },
    },
  },
};
