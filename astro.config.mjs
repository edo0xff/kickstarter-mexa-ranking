// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://edo0xff.github.io',
  base: '/kickstarter-mexa-ranking',
  output: 'static',
  integrations: [sitemap()],
});

