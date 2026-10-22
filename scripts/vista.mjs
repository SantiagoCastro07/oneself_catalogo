// Compila una copia del sitio en ../vista-previa para verla con Live Server.
// Reemplaza `ONESELF_BASE=... astro build`, que no funciona en cmd/PowerShell.
import { spawnSync } from 'node:child_process';

const r = spawnSync('npx', ['astro', 'build', '--outDir', '../vista-previa'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, ONESELF_BASE: '/vista-previa' },
});

process.exit(r.status ?? 1);
