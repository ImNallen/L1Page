import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://l1software.app',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
