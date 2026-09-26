// Utilidades del catálogo: todo lo que la interfaz necesita se deriva de los datos.
import { getCollection, type CollectionEntry } from 'astro:content';
import { TAMANOS } from '../content.config';

export type Perfume = CollectionEntry<'perfumes'>;
export type Variante = Perfume['data']['variantes'][number];

export const ETIQUETA_TAMANO: Record<Variante['tamano'], string> = {
  '3ml': '3 ml', '5ml': '5 ml', '10ml': '10 ml', frasco: 'Frasco',
};

export const ordenarVariantes = (v: Variante[]) =>
  [...v].sort((a, b) => TAMANOS.indexOf(a.tamano) - TAMANOS.indexOf(b.tamano));

export const pedible = (v: Variante) => v.estado !== 'agotado';

export const agotado = (p: Perfume) => p.data.variantes.every((v) => !pedible(v));

/** Menor precio entre las variantes que se pueden pedir (o entre todas si está agotado). */
export const precioDesde = (p: Perfume) => {
  const vs = p.data.variantes.filter(pedible);
  return Math.min(...(vs.length ? vs : p.data.variantes).map((v) => v.precio));
};

export const formatoPrecio = (n: number) => '$' + n.toLocaleString('es-CO');

export async function perfumesActivos() {
  const todos = await getCollection('perfumes', (p) => p.data.activo);
  // Disponibles primero, luego nuevos, luego por nombre
  return todos.sort(
    (a, b) =>
      Number(agotado(a)) - Number(agotado(b)) ||
      Number(b.data.etiquetas.includes('nuevo')) - Number(a.data.etiquetas.includes('nuevo')) ||
      a.data.nombre.localeCompare(b.data.nombre, 'es'),
  );
}

/** Nombre visible de cada marca, por slug. */
export async function mapaMarcas() {
  const { getCollection } = await import('astro:content');
  const marcas = await getCollection('marcas');
  return Object.fromEntries(marcas.map((m) => [m.id, m.data.nombre])) as Record<string, string>;
}

/** Datos compartidos por el layout (menú y footer). */
export async function datosNavegacion() {
  const perfumes = await perfumesActivos();
  const marcas = await mapaMarcas();
  const conteoMarca = new Map<string, number>();
  for (const p of perfumes) conteoMarca.set(p.data.marca.id, (conteoMarca.get(p.data.marca.id) || 0) + 1);
  const marcasTop = [...conteoMarca.entries()]
    .sort((a, b) => b[1] - a[1] || marcas[a[0]].localeCompare(marcas[b[0]], 'es'))
    .map(([slug, n]) => ({ slug, nombre: marcas[slug], n }));
  return { perfumes, marcas, marcasTop };
}
