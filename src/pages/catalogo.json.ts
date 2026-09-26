// Precios y estados vigentes, para que la bolsa guardada en el navegador
// se actualice si un precio cambia o un tamaño se agota.
import type { APIRoute } from 'astro';
import { perfumesActivos, mapaMarcas } from '../lib/catalogo';

export const GET: APIRoute = async () => {
  const perfumes = await perfumesActivos();
  const marcas = await mapaMarcas();
  const datos = Object.fromEntries(perfumes.map((p) => [p.id, {
    n: p.data.nombre,
    m: marcas[p.data.marca.id],
    v: Object.fromEntries(p.data.variantes.map((v) => [v.tamano, [v.precio, v.estado]])),
  }]));
  return new Response(JSON.stringify(datos), { headers: { 'Content-Type': 'application/json' } });
};
