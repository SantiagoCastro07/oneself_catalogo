// Construye enlaces internos respetando la base (/ en Vercel, /vista-previa/ en local).
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

export function url(ruta = ''): string {
  const limpia = ruta.replace(/^\/+|\/+$/g, '');
  const [camino, query] = limpia.split('?');
  const conBarra = camino ? `${BASE}/${camino}/` : `${BASE}/`;
  return query ? `${conBarra}?${query}` : conBarra;
}

export const whatsappUrl = (numero: string, texto?: string) =>
  `https://wa.me/${numero}` + (texto ? `?text=${encodeURIComponent(texto)}` : '');

export const telefonoLegible = (n: string) =>
  n.replace(/^57(\d{3})(\d{3})(\d{4})$/, '+57 $1 $2 $3');
