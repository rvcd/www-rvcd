// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  site: 'https://rvcd.github.io',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [svelte()],
  image: {
    domains: ['ik.imagekit.io'],
  }
});