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
