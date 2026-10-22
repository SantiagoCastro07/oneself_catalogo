// Junta las fotos de varios perfumes en una sola imagen para un combo.
//   node scripts/componer-combo.mjs src/assets/combos/jpg.png le-beau-le-parfum le-male le-male-elixir
// La imagen sale horizontal (1200×900). Las fotos salen de src/assets/perfumes/<slug>.png (con fondo transparente). El del medio va al frente y un poco más grande.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const [salida, ...slugs] = process.argv.slice(2);
if (!salida || slugs.length < 2) {
  console.error('Uso: node scripts/componer-combo.mjs <salida.png> <slug> <slug> [<slug>…]');
  process.exit(1);
}

const ANCHO_IMG = 1200;   // imagen horizontal 4:3 (tres productos en fila)
const ALTO_IMG = 900;
const ALTO = 660;        // alto base de cada producto
const SOLAPE = 0.1;      // cuánto se montan los productos vecinos
const centro = Math.floor(slugs.length / 2);

const piezas = [];
for (const [i, slug] of slugs.entries()) {
  const archivo = path.join('src/assets/perfumes', `${slug}.png`);
  if (!fs.existsSync(archivo)) throw new Error(`No existe la foto ${archivo}`);
  const recorte = await sharp(archivo).trim().toBuffer();   // quita el margen transparente
  const alto = Math.round(ALTO * (i === centro ? 1.14 : 1));
  const buf = await sharp(recorte).resize({ height: alto }).toBuffer();
  const { width } = await sharp(buf).metadata();
  piezas.push({ buf, ancho: width, alto });
}

// Posiciones: en fila, montadas un poco; el grupo se centra y se apoya en la misma línea base
const ancho = piezas.reduce((s, p, i) => s + p.ancho * (i ? 1 - SOLAPE : 1), 0);
const escala = Math.min(1, (ANCHO_IMG * 0.95) / ancho);
let x = (ANCHO_IMG - ancho * escala) / 2;
const base = ALTO_IMG / 2 + (Math.max(...piezas.map((p) => p.alto)) * escala) / 2;
const capas = [];
for (const [i, p] of piezas.entries()) {
  const buf = escala < 1 ? await sharp(p.buf).resize({ height: Math.round(p.alto * escala) }).toBuffer() : p.buf;
  const { width, height } = await sharp(buf).metadata();
  if (i) x -= width * SOLAPE;
  capas.push({ input: buf, left: Math.round(x), top: Math.round(base - height), z: i === centro ? 1 : 0 });
  x += width;
}
capas.sort((a, b) => a.z - b.z);

fs.mkdirSync(path.dirname(salida), { recursive: true });
await sharp({ create: { width: ANCHO_IMG, height: ALTO_IMG, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite(capas.map(({ input, left, top }) => ({ input, left, top })))
  .png({ compressionLevel: 9 })
  .toFile(salida);
console.log(`Listo: ${salida} (${ANCHO_IMG}×${ALTO_IMG}, ${slugs.length} productos)`);
