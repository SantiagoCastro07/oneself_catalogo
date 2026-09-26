// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Cambiar por el dominio propio cuando esté comprado (fase 5).
const SITE = 'https://oneselfcatalogo.vercel.app';

// ONESELF_BASE permite compilar una copia para revisar localmente en
// http://127.0.0.1:5500/vista-previa/ (Live Server). En Vercel no se usa.
const BASE = process.env.ONESELF_BASE || '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
});
