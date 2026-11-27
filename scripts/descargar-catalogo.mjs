// Descarga el catálogo desde OneSelf Manager (la fuente de verdad) antes de compilar.
// Escribe src/data/marcas.json, src/content/perfumes/*.json, src/content/combos/*.json y las fotos
// en src/assets/perfumes|combos/. Esos archivos son generados: están en .gitignore y no se editan a mano.
// Para cambiar precios, estados, fotos o perfumes: Manager → Productos.
//
// MANAGER_URL cambia el origen (por defecto el Manager en producción).
// Si el Manager no responde, falla y la publicación se cancela: Vercel deja la versión anterior en línea.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANAGER = (process.env.MANAGER_URL || 'https://manager.oneselfparfums.com').replace(/\/$/, '');
const src = (...p) => path.join(raiz, 'src', ...p);

async function pedir(url, tipo = 'json') {
  for (let intento = 1; ; intento++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(30_000) });
      if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      return tipo === 'json' ? await r.json() : Buffer.from(await r.arrayBuffer());
    } catch (e) {
      if (intento >= 3) throw new Error(`No se pudo leer ${url}: ${e.message}`);
      await new Promise((r) => setTimeout(r, 1000 * intento));
    }
  }
}

const catalogo = await pedir(`${MANAGER}/api/public/catalogo`);
const nPerfumes = Object.keys(catalogo.perfumes || {}).length;
if (!Array.isArray(catalogo.marcas) || !nPerfumes) throw new Error('El Manager devolvió un catálogo vacío o con otro formato; no se publica.');

// Carpetas generadas: se vacían para que un perfume borrado en el Manager desaparezca de la web.
for (const d of [src('content', 'perfumes'), src('content', 'combos'), src('assets', 'perfumes'), src('assets', 'combos')]) {
  fs.rmSync(d, { recursive: true, force: true });
  fs.mkdirSync(d, { recursive: true });
}

const fotos = new Set();
const ruta = (nombre) => { fotos.add(nombre); return `../../assets/${nombre}`; };
const escribir = (archivo, datos) => fs.writeFileSync(archivo, JSON.stringify(datos, null, 2) + '\n');

escribir(src('data', 'marcas.json'), catalogo.marcas);

// Descuento general de la promo (tienda.json → promo.descuentoCatalogo, ej. 0.09). Se aplica solo en la web
// al compilar, si la promo no ha terminado: el Manager conserva el precio normal y al recompilar después
// de promo.hasta todo vuelve solo. El precio normal queda en `antes` para mostrarlo tachado.
const tienda = JSON.parse(fs.readFileSync(src('data', 'tienda.json'), 'utf8'));
const dto = Number(tienda.promo?.descuentoCatalogo) || 0;
const promoVigente = dto > 0 && tienda.promo?.hasta && Date.now() < Date.parse(tienda.promo.hasta);
const conDescuento = (p) => !promoVigente ? p : {
  ...p,
  variantes: p.variantes.map((v) => ({ ...v, antes: v.precio, precio: Math.floor((v.precio * (1 - dto)) / 100) * 100 })),
};
if (promoVigente) console.log(`Promo vigente: ${Math.round(dto * 100)}% de descuento en el catálogo hasta ${tienda.promo.hasta}.`);
for (const [slug, p] of Object.entries(catalogo.perfumes)) escribir(src('content', 'perfumes', `${slug}.json`), { ...conDescuento(p), imagenes: p.imagenes.map(ruta) });
for (const [slug, c] of Object.entries(catalogo.combos || {})) escribir(src('content', 'combos', `${slug}.json`), { ...c, imagen: ruta(c.imagen) });

// Fotos: de a 8 a la vez
const lista = [...fotos];
let i = 0;
await Promise.all(Array.from({ length: 8 }, async () => {
  while (i < lista.length) {
    const nombre = lista[i++];
    if (!/^(perfumes|combos)\/[\w.-]+$/.test(nombre)) throw new Error(`Nombre de foto inválido: ${nombre}`);
    fs.writeFileSync(src('assets', ...nombre.split('/')), await pedir(`${MANAGER}/api/public/media/${nombre}`, 'bin'));
  }
}));

console.log(`Catálogo del Manager: ${catalogo.marcas.length} marcas, ${nPerfumes} perfumes, ${Object.keys(catalogo.combos || {}).length} combos, ${lista.length} fotos.`);
