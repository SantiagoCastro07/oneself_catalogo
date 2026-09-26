// Cálculo del envío según ciudad y contenido del pedido. Las reglas viven en tienda.json.
export interface ReglasEnvio {
  local: { nombre: string; departamento: string; ciudades: Record<string, number>; gratisDesde: number };
  nacional: { nombre: string; precio: number; gratisDesde: number };
  frascoIncluyeEnvio: boolean;
}
/** true si el precio aún depende de la ciudad (entrega local sin ciudad definida). */
export const precioPendiente = (o: { id: string; nombre: string; precio: number }) => o.id === 'local' && o.precio > 0 && !o.nombre.includes('(');
export interface LineaEnvio { tamano: string; precio: number; cantidad: number }
export interface OpcionEnvio {
  id: 'local' | 'nacional';
  nombre: string;       // "Entrega local (Los Patios)"
  detalle: string;      // texto de apoyo bajo el nombre
  precioBase: number;   // tarifa sin descuento
  precio: number;       // lo que se cobra (0 = gratis)
  motivo?: string;      // por qué es gratis
  faltante?: number;    // cuánto falta en decants para envío gratis
  disponible: boolean;  // false = la dirección no permite este método
}

const normal = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();

/** Ciudad local que coincide con lo escrito (acepta "cucuta", "San José de Cúcuta", etc.). */
export function ciudadLocal(r: ReglasEnvio, departamento: string, ciudad: string): string | null {
  if (departamento && normal(departamento) !== normal(r.local.departamento)) return null;
  const c = normal(ciudad);
  if (!c) return null;
  return Object.keys(r.local.ciudades).find((k) => c === normal(k) || c.includes(normal(k))) || null;
}

/** Las dos opciones siempre, con su precio actual según ciudad y pedido. */
export function opcionesEnvio(r: ReglasEnvio, departamento: string, ciudad: string, lineas: LineaEnvio[]) {
  const decants = lineas.filter((l) => l.tamano !== 'frasco').reduce((s, l) => s + l.precio * l.cantidad, 0);
  const hayFrasco = lineas.some((l) => l.tamano === 'frasco');
  const local = ciudadLocal(r, departamento, ciudad);
  const ciudades = Object.keys(r.local.ciudades);
  const depLocal = !departamento || normal(departamento) === normal(r.local.departamento);
  const ciudadEscrita = normal(ciudad).length > 2;

  const aplicar = (o: OpcionEnvio, umbral: number) => {
    if (hayFrasco && r.frascoIncluyeEnvio) { o.precio = 0; o.motivo = 'Incluido con el frasco completo'; }
    else if (decants >= umbral) { o.precio = 0; o.motivo = `Por pedido de decants desde $${umbral.toLocaleString('es-CO')}`; }
    else o.faltante = umbral - decants;
    return o;
  };
  const baseLocal = local ? r.local.ciudades[local] : Math.max(...Object.values(r.local.ciudades));
  const tarifasLocal = ciudades.map((c) => `${c} $${r.local.ciudades[c].toLocaleString('es-CO')}`).join(' · ');
  const opLocal = aplicar({
    id: 'local',
    nombre: local ? `${r.local.nombre} (${local})` : r.local.nombre,
    detalle: local ? 'Entrega en tu dirección' : tarifasLocal,
    precioBase: baseLocal, precio: baseLocal,
    // Mientras escribe ("Los Pat…") sigue disponible; se apaga si la ciudad no es local
    disponible: depLocal && (!ciudadEscrita || !!local || ciudades.some((k) => normal(k).startsWith(normal(ciudad)))),
  }, r.local.gratisDesde);
  const opNacional = aplicar({
    id: 'nacional',
    nombre: r.nacional.nombre,
    detalle: 'Transportadora a todo el país',
    precioBase: r.nacional.precio, precio: r.nacional.precio,
    disponible: !local,
  }, r.nacional.gratisDesde);
  // Método sugerido: local si la ciudad es local; nacional en cualquier otro caso
  const sugerido: OpcionEnvio['id'] = local ? 'local' : 'nacional';
  return { opciones: [opLocal, opNacional], sugerido, local };
}
