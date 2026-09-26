// Migración única: _legacy/js/data.js  ->  src/content/perfumes/*.json + src/data/marcas.json
// Uso: node scripts/migrar-desde-legacy.mjs
// No modifica _legacy/. Se detiene si los conteos de origen y destino no cuadran.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, '_legacy/js/data.js');
const OUT_PERFUMES = path.join(ROOT, 'src/content/perfumes');
const OUT_MARCAS = path.join(ROOT, 'src/data/marcas.json');

// 1. Leer el catálogo antiguo sin tocarlo
const code = fs.readFileSync(SRC, 'utf8') + '\n;globalThis.__P = PERFUMES;';
const ctx = {}; vm.createContext(ctx); vm.runInContext(code, ctx);
const PERFUMES = ctx.__P;

// 2. Tablas de conversión
const slugify = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/&/g, 'y').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Slugs que conviene mejorar para URL/SEO (el sitio anterior no tenía URLs por perfume)
const RENOMBRAR = {
  'cdn-urban-man-elixir': 'club-de-nuit-urban-man-elixir',
  'eau-issey-pour-homme': 'l-eau-d-issey-pour-homme',
};

// Familias olfativas PROPUESTAS (no existían en el sitio anterior). Validar en la hoja de revisión.
const FAMILIAS = {
  'valentino-born-in-roma-intense': ['gourmand', 'aromatico'],
  'eau-issey-pour-homme': ['citrico', 'amaderado'],
  'khamrah-waha': ['gourmand', 'especiado'],
  '212-vip-black': ['aromatico', 'gourmand'],
  'tag-uomo-rosso': ['ambarado', 'especiado'],
  'amethyst': ['floral', 'amaderado'],
  'dynasty': ['aromatico', 'amaderado'],
  'hawas-verde': ['citrico', 'amaderado'],
  'yara': ['gourmand', 'frutal'],
  '9am-pour-femme': ['floral', 'citrico'],
  'bright-crystal': ['floral', 'frutal'],
  'arabians-tonka': ['ambarado', 'gourmand'],
  'eros-edp': ['aromatico', 'gourmand'],
  'bois-imperial': ['amaderado', 'aromatico'],
  'vulcan-feu': ['especiado', 'ambarado'],
  'hawas-kobra': ['ambarado', 'especiado'],
  'hawas-ice': ['acuatico', 'citrico'],
  'asad-elixir': ['especiado', 'ambarado'],
  'precieux': ['ambarado', 'amaderado'],
  '9pm-night-out': ['gourmand', 'ambarado'],
  'hawas-for-him': ['acuatico', 'frutal'],
  'his-confession': ['especiado', 'gourmand'],
  'le-male': ['aromatico', 'gourmand'],
  'le-beau-le-parfum': ['amaderado', 'ambarado'],
  'le-male-elixir': ['ambarado', 'gourmand'],
  'stallion-53': ['aromatico', 'amaderado'],
  'amber-oud-gold-edition': ['frutal', 'ambarado'],
  'odyssey-aqua': ['acuatico', 'citrico'],
  '9pm': ['gourmand', 'ambarado'],
  'supremacy-collector': ['frutal', 'amaderado'],
  'eclaire': ['gourmand'],
  'liquid-brun': ['gourmand', 'especiado'],
  'khamrah-qahwa': ['gourmand', 'especiado'],
  'sublime': ['frutal', 'floral'],
  'mandarin-sky-elixir': ['citrico', 'ambarado'],
  'odyssey-homme-white': ['citrico', 'acuatico'],
  'hawas-fire': ['especiado', 'amaderado'],
  'hawas-diva': ['floral', 'frutal'],
  'asad-bourbon': ['especiado', 'gourmand'],
  'art-of-universe': ['amaderado', 'floral'],
  'mandarin-sky': ['citrico', 'ambarado'],
  'cdn-urban-man-elixir': ['especiado', 'ambarado'],
  'hawas-malibu': ['frutal', 'ambarado'],
  'odyssey-mega': ['aromatico', 'citrico'],
  'amber-oud-aqua-dubai': ['frutal', 'citrico'],
};

// 3 ml solo para diseñador y nicho: precio PROVISIONAL = 60 % del de 5 ml, redondeado al mil
const precio3ml = p5 => Math.round((p5 * 0.6) / 1000) * 1000;

const lista = s => (s || '').split(',').map(x => x.trim()).filter(Boolean)
  .map(x => x.charAt(0).toUpperCase() + x.slice(1));

// 3. Convertir
fs.mkdirSync(OUT_PERFUMES, { recursive: true });
const marcas = new Map();
const vistos = new Set();
let nPrecios = 0, n3ml = 0;

for (const p of PERFUMES) {
  const slug = RENOMBRAR[p.id] || p.id;
  if (vistos.has(slug)) throw new Error(`Slug repetido: ${slug}`);
  vistos.add(slug);
  if (!FAMILIAS[p.id]) throw new Error(`Falta familia propuesta para ${p.id}`);

  const marcaSlug = slugify(p.brand);
  marcas.set(marcaSlug, { slug: marcaSlug, nombre: p.brand });

  const estado = p.stock === false ? 'agotado' : 'disponible';
  const variantes = [];
  if (p.category === 'disenador' || p.category === 'nicho') {
    variantes.push({ tamano: '3ml', precio: precio3ml(p.prices['5ml']), estado, provisional: true });
    n3ml++;
  }
  for (const [k, t] of [['5ml', '5ml'], ['10ml', '10ml'], ['full', 'frasco']]) {
    if (p.prices[k] == null) continue;
    variantes.push({ tamano: t, precio: p.prices[k], estado });
    nPrecios++;
  }

  const ext = path.extname(p.img);
  const doc = {
    nombre: p.name,
    marca: marcaSlug,
    genero: p.gender,
    tipo: p.category,
    familias: FAMILIAS[p.id],
    descripcion: p.desc,
    notas: { salida: lista(p.notes?.salida), corazon: lista(p.notes?.corazon), fondo: lista(p.notes?.fondo) },
    imagenes: [`../../assets/perfumes/${slug}${ext.toLowerCase()}`],
    variantes,
    etiquetas: p.isNew ? ['nuevo'] : [],
    activo: true,
    legado: { id: p.id, img: p.img },
  };
  fs.writeFileSync(path.join(OUT_PERFUMES, `${slug}.json`), JSON.stringify(doc, null, 2) + '\n');
}

const marcasArr = [...marcas.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
fs.mkdirSync(path.dirname(OUT_MARCAS), { recursive: true });
fs.writeFileSync(OUT_MARCAS, JSON.stringify(marcasArr, null, 2) + '\n');

// 4. Comprobación origen vs destino
const escritos = fs.readdirSync(OUT_PERFUMES).filter(f => f.endsWith('.json')).map(f =>
  JSON.parse(fs.readFileSync(path.join(OUT_PERFUMES, f), 'utf8')));
const origen = {
  perfumes: PERFUMES.length,
  precios: PERFUMES.reduce((s, p) => s + Object.values(p.prices).filter(v => v != null).length, 0),
  agotados: PERFUMES.filter(p => p.stock === false).length,
  nuevos: PERFUMES.filter(p => p.isNew).length,
  marcas: new Set(PERFUMES.map(p => p.brand)).size,
};
const destino = {
  perfumes: escritos.length,
  precios: escritos.reduce((s, d) => s + d.variantes.filter(v => !v.provisional).length, 0),
  agotados: escritos.filter(d => d.variantes.every(v => v.estado === 'agotado')).length,
  nuevos: escritos.filter(d => d.etiquetas.includes('nuevo')).length,
  marcas: marcasArr.length,
};
// Cada precio original debe aparecer igual en destino
for (const p of PERFUMES) {
  const d = escritos.find(e => e.legado.id === p.id);
  for (const [k, t] of [['5ml', '5ml'], ['10ml', '10ml'], ['full', 'frasco']]) {
    const v = d.variantes.find(x => x.tamano === t);
    if (p.prices[k] !== v?.precio) throw new Error(`Precio distinto en ${p.id} ${k}`);
  }
  if (d.descripcion !== p.desc || d.nombre !== p.name) throw new Error(`Texto distinto en ${p.id}`);
}
console.table({ origen, destino });
for (const k of Object.keys(origen)) if (origen[k] !== destino[k]) throw new Error(`No cuadra: ${k}`);
console.log(`OK · ${n3ml} perfumes con 3 ml provisional · ${nPrecios} precios originales verificados uno a uno`);
