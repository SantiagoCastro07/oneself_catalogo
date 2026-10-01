// Precios, estados y miniaturas vigentes. Lo usan el carrito y la página de pedido
// para mostrar datos actuales aunque el navegador tenga guardada una versión vieja.
import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import { perfumesActivos, mapaMarcas } from '../lib/catalogo';

export const GET: APIRoute = async () => {
  const perfumes = await perfumesActivos();
  const marcas = await mapaMarcas();
  const datos: Record<string, unknown> = {};
  for (const p of perfumes) {
    const img = await getImage({ src: p.data.imagenes[0], width: 128, height: 128, format: 'webp' });
    datos[p.id] = {
      n: p.data.nombre,
      m: marcas[p.data.marca.id],
      i: img.src,
      v: Object.fromEntries(p.data.variantes.map((v) => [v.tamano, [v.precio, v.estado]])),
    };
  }
  return new Response(JSON.stringify(datos), { headers: { 'Content-Type': 'application/json' } });
};
