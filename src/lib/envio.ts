// Cálculo del envío según ciudad y contenido del pedido. Las reglas viven en tienda.json.
export interface ReglasEnvio {
  local: { nombre: string; departamento: string; ciudades: Record<string, number>; gratisDesde: number };
  nacional: { nombre: string; precio: number; gratisDesde: number };
  frascoIncluyeEnvio: boolean;
}
export interface LineaEnvio { tamano: string; precio: number; cantidad: number }
export interface OpcionEnvio {
  id: 'local' | 'nacional';
  nombre: string;       // "Entrega local (Los Patios)"
  precioBase: number;   // tarifa sin descuento
  precio: number;       // lo que se cobra (0 = gratis)
  motivo?: string;      // por qué es gratis
  faltante?: number;    // cuánto falta en decants para envío gratis
}

const normal = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();

/** Ciudad local que coincide con lo escrito (acepta "cucuta", "San José de Cúcuta", etc.). */
export function ciudadLocal(r: ReglasEnvio, departamento: string, ciudad: string): string | null {
  if (normal(departamento) !== normal(r.local.departamento)) return null;
  const c = normal(ciudad);
  if (!c) return null;
  return Object.keys(r.local.ciudades).find((k) => c === normal(k) || c.includes(normal(k))) || null;
}

export function calcularEnvio(r: ReglasEnvio, departamento: string, ciudad: string, lineas: LineaEnvio[]): OpcionEnvio | null {
  if (!departamento || !ciudad.trim() || !lineas.length) return null;
  const decants = lineas.filter((l) => l.tamano !== 'frasco').reduce((s, l) => s + l.precio * l.cantidad, 0);
  const hayFrasco = lineas.some((l) => l.tamano === 'frasco');
  const local = ciudadLocal(r, departamento, ciudad);
  const base = local ? r.local.ciudades[local] : r.nacional.precio;
  const umbral = local ? r.local.gratisDesde : r.nacional.gratisDesde;
  const opcion: OpcionEnvio = {
    id: local ? 'local' : 'nacional',
    nombre: local ? `${r.local.nombre} (${local})` : r.nacional.nombre,
    precioBase: base,
    precio: base,
  };
  if (hayFrasco && r.frascoIncluyeEnvio) {
    opcion.precio = 0; opcion.motivo = 'Incluido con el frasco completo';
  } else if (decants >= umbral) {
    opcion.precio = 0; opcion.motivo = `Por pedido de decants desde $${umbral.toLocaleString("es-CO")}`;
  } else {
    opcion.faltante = umbral - decants;
  }
  return opcion;
}
