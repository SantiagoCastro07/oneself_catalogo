// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Cambiar por el dominio propio cuando esté comprado (fase 5).
const SITE = 'https://oneselfcatalogo.vercel.app';

export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  integrations: [sitemap()],
});
