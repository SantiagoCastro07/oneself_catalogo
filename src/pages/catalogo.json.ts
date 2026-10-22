// Precios, estados y miniaturas vigentes. Lo usan el carrito y la página de pedido
// para mostrar datos actuales aunque el navegador tenga guardada una versión vieja.
import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import { perfumesActivos, mapaMarcas } from '../lib/catalogo';
import { combosActivos } from '../lib/combos';

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
  // Combos: misma forma que un perfume; `t` es el texto del tamaño para el carrito y WhatsApp
  for (const c of await combosActivos()) {
    const img = await getImage({ src: c.combo.data.imagen, width: 128, format: 'webp' });
    datos[c.id] = {
      n: c.combo.data.nombre,
      m: c.marca || 'Combo',
      i: img.src,
      v: Object.fromEntries(c.opciones.map((o) => [o.tamano, [o.precio, o.estado]])),
      t: Object.fromEntries(c.opciones.map((o) => [o.tamano, o.texto])),
    };
  }
  return new Response(JSON.stringify(datos), { headers: { 'Content-Type': 'application/json' } });
};
