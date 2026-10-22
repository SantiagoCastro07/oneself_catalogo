// Combos de decants: resuelve perfumes, disponibilidad y ahorro a partir de los datos.
import { getCollection, getEntries, type CollectionEntry } from 'astro:content';
import { ESTADOS } from '../content.config';
import { ETIQUETA_TAMANO, mapaMarcas, formatoPrecio, type Perfume } from './catalogo';

export type Combo = CollectionEntry<'combos'>;
type Estado = (typeof ESTADOS)[number];

export interface OpcionCombo {
  tamano: '3ml' | '5ml' | '10ml';
  precio: number;
  estado: Estado;
  individual: number; // lo que costarían los mismos decants por separado
  ahorro: number;
  texto: string;      // "3 decants de 3 ml: Le Beau…, Le Male…" (carrito y mensaje de WhatsApp)
}

export interface ComboResuelto {
  combo: Combo;
  id: string;         // id en el carrito y en catalogo.json
  perfumes: Perfume[];
  marca?: string;
  opciones: OpcionCombo[];
  agotado: boolean;
}

/** El carrito distingue combos de perfumes por este prefijo. */
export const idCarrito = (c: Combo) => `combo-${c.id}`;
export const esCombo = (slug: string) => slug.startsWith('combo-');
export const rutaCombo = (slug: string) => `combos/${slug.replace(/^combo-/, '')}`;

// Del mejor al peor: el combo hereda el peor estado de sus perfumes.
const PEOR = ['disponible', 'ultimas', 'bajo_pedido', 'agotado'] as const;

function opcion(c: Combo, perfumes: Perfume[], o: Combo['data']['opciones'][number]): OpcionCombo {
  const vs = perfumes.map((p) => (p.data.activo ? p.data.variantes.find((v) => v.tamano === o.tamano) : undefined));
  const estado: Estado = vs.some((v) => !v) ? 'agotado' : PEOR[Math.max(...vs.map((v) => PEOR.indexOf(v!.estado)))];
  const individual = vs.reduce((s, v) => s + (v?.precio ?? 0), 0);
  const nombres = perfumes.map((p) => p.data.nombre).join(', ');
  return {
    tamano: o.tamano, precio: o.precio, estado, individual,
    ahorro: Math.max(0, individual - o.precio),
    texto: `${perfumes.length} decants de ${ETIQUETA_TAMANO[o.tamano]}: ${nombres}`,
  };
}

export async function combosActivos(): Promise<ComboResuelto[]> {
  const marcas = await mapaMarcas();
  const lista = await getCollection('combos', (c) => c.data.activo);
  const resueltos = await Promise.all(lista.map(async (combo) => {
    const perfumes = (await getEntries(combo.data.perfumes)) as Perfume[];
    const opciones = [...combo.data.opciones]
      .sort((a, b) => parseInt(a.tamano) - parseInt(b.tamano))
      .map((o) => opcion(combo, perfumes, o));
    return {
      combo, id: idCarrito(combo), perfumes,
      marca: combo.data.marca ? marcas[combo.data.marca.id] : undefined,
      opciones, agotado: opciones.every((o) => o.estado === 'agotado'),
    };
  }));
  return resueltos.sort((a, b) => Number(a.agotado) - Number(b.agotado) || a.combo.data.nombre.localeCompare(b.combo.data.nombre, 'es'));
}

/** Menor precio entre las opciones que se pueden pedir. */
export const precioDesdeCombo = (c: ComboResuelto) => {
  const o = c.opciones.filter((x) => x.estado !== 'agotado');
  return Math.min(...(o.length ? o : c.opciones).map((x) => x.precio));
};

export const ahorroMaximo = (c: ComboResuelto) => Math.max(0, ...c.opciones.filter((o) => o.estado !== 'agotado').map((o) => o.ahorro));
export { formatoPrecio };
