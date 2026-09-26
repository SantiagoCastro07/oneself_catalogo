// Mensajes de WhatsApp. Sin dependencias de Astro: se usa en servidor y navegador.
export interface LineaPedido {
  nombre: string;
  marca: string;
  tamano: string;     // '3ml' | '5ml' | '10ml' | 'frasco'
  precio: number;     // precio unitario
  cantidad: number;
  bajoPedido?: boolean;
}

export const TAMANO_TEXTO: Record<string, string> = { '3ml': '3 ml', '5ml': '5 ml', '10ml': '10 ml', frasco: 'Frasco completo' };
export const pesos = (n: number) => '$' + n.toLocaleString('es-CO');

export function mensajePedido(lineas: LineaPedido[], ciudad = ''): string {
  const total = lineas.reduce((s, l) => s + l.precio * l.cantidad, 0);
  const cuerpo = lineas.map((l) =>
    `• ${l.nombre} (${l.marca})\n  Tamaño: ${TAMANO_TEXTO[l.tamano] || l.tamano} · Cantidad: ${l.cantidad} · ${pesos(l.precio * l.cantidad)}` +
    (l.bajoPedido ? '\n  (bajo pedido)' : ''));
  return [
    'Hola OneSelf, quiero hacer este pedido:',
    '',
    ...cuerpo,
    '',
    `Subtotal: ${pesos(total)} (sin envío)`,
    ...(ciudad.trim() ? [`Ciudad de envío: ${ciudad.trim()}`] : []),
  ].join('\n');
}

export const mensajeAviso = (nombre: string, marca: string, tamano?: string) =>
  `Hola OneSelf, ¿me avisan cuando llegue ${nombre} (${marca})${tamano ? ` en ${TAMANO_TEXTO[tamano] || tamano}` : ''}?`;

export const enlaceWhatsapp = (numero: string, texto: string) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

export interface DatosEnvio {
  nombre: string; apellidos: string; cedula?: string; telefono: string; correo?: string;
  departamento: string; ciudad: string; direccion: string; detalle?: string; barrio?: string;
  pago?: string; notas?: string;
  envio?: { nombre: string; precio: number; motivo?: string };
}

/** Pedido completo con datos de envío, listo para despachar sin volver a preguntar. */
export function mensajeCompleto(lineas: LineaPedido[], d: DatosEnvio): string {
  const total = lineas.reduce((s, l) => s + l.precio * l.cantidad, 0);
  const n = lineas.reduce((s, l) => s + l.cantidad, 0);
  const fila = (k: string, v?: string) => (v && v.trim() ? [`${k}: ${v.trim()}`] : []);
  return [
    'Hola OneSelf, quiero hacer este pedido:',
    '',
    '*PEDIDO*',
    ...lineas.map((l) => `• ${l.nombre} (${l.marca}) · ${TAMANO_TEXTO[l.tamano] || l.tamano} × ${l.cantidad} · ${pesos(l.precio * l.cantidad)}${l.bajoPedido ? ' (bajo pedido)' : ''}`),
    `Subtotal (${n} ${n === 1 ? 'artículo' : 'artículos'}): ${pesos(total)}`,
    ...(d.envio
      ? [`${d.envio.nombre}: ${d.envio.precio ? pesos(d.envio.precio) : `gratis${d.envio.motivo ? ` (${d.envio.motivo.charAt(0).toLowerCase() + d.envio.motivo.slice(1)})` : ''}`}`,
         `*Total: ${pesos(total + d.envio.precio)}*`]
      : ['Envío: por confirmar']),
    '',
    '*DATOS DE ENVÍO*',
    `Nombre: ${d.nombre.trim()} ${d.apellidos.trim()}`,
    ...fila('Cédula', d.cedula),
    `Teléfono: ${d.telefono.trim()}`,
    ...fila('Correo', d.correo),
    `Dirección: ${d.direccion.trim()}${d.detalle?.trim() ? `, ${d.detalle.trim()}` : ''}`,
    ...fila('Barrio', d.barrio),
    `Ciudad: ${d.ciudad.trim()}, ${d.departamento}`,
    ...(d.pago ? ['', `Pago: ${d.pago}`] : []),
    ...(d.notas?.trim() ? ['', `Notas: ${d.notas.trim()}`] : []),
  ].join('\n');
}
