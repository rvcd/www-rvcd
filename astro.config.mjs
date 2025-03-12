// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import svelte from '@astrojs/svelte';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://rainiervalleycreativedistrict.com',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [svelte()],

  image: {
    domains: ['ik.imagekit.io'],
  },

  adapter: netlify()
});