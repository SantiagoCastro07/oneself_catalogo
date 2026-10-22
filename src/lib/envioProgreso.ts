// Aviso de "envío gratis": cambia con lo que falta para el mínimo y muestra una barra de progreso.
// Lo usan el carrito y la página de pedido, así se ve y se comporta igual en los dos.
import { precioPendiente, type OpcionEnvio } from './envio';
import { pesos } from './whatsapp';

export interface ProgresoEnvio {
  texto: string;
  pct: number;        // 0–100 hacia el mínimo de envío gratis
  logrado: boolean;
  cerca: boolean;     // a un paso: se resalta
}

/**
 * @param minDecant precio del decant más barato disponible: si lo que falta es menos, se avisa
 *                  que "con un decant más lo logras".
 */
export function progresoEnvio(o: OpcionEnvio, minDecant = 0): ProgresoEnvio | null {
  if (o.precio === 0 && o.faltante === undefined) {
    return { texto: `¡Tienes envío gratis! ${o.motivo ?? ''}`.trim(), pct: 100, logrado: true, cerca: false };
  }
  if (!o.faltante || !o.umbral) return null;

  const pct = Math.min(99, Math.max(0, Math.round(((o.acumulado ?? 0) / o.umbral) * 100)));
  const ahorro = precioPendiente(o) ? '' : ` (ahorras ${pesos(o.precioBase)})`;
  const un = minDecant > 0 && o.faltante <= minDecant ? ' Con un decant más lo logras.' : '';
  const texto =
    pct >= 80 ? `¡Casi lo logras! Solo ${pesos(o.faltante)} más y tu envío es gratis${ahorro}.${un}`
    : pct >= 50 ? `¡Vas muy bien! Te faltan ${pesos(o.faltante)} en decants para el envío gratis${ahorro}.${un}`
    : `Agrega ${pesos(o.faltante)} en decants y tu envío es gratis${ahorro}.${un}`;
  return { texto, pct, logrado: false, cerca: pct >= 80 };
}

/** Pinta el progreso en un bloque `.envgratis` (texto, barra y enlace). `null` lo oculta. */
export function pintarProgresoEnvio(caja: HTMLElement, p: ProgresoEnvio | null, opts: { contexto?: string; enlace?: string | null } = {}) {
  caja.hidden = !p;
  if (!p) return;
  caja.classList.toggle('is-logrado', p.logrado);
  caja.classList.toggle('is-cerca', p.cerca);
  const ctx = caja.querySelector<HTMLElement>('[data-envgratis-ctx]');
  if (ctx) { ctx.textContent = opts.contexto || ''; ctx.hidden = !opts.contexto; }
  caja.querySelector<HTMLElement>('[data-envgratis-txt]')!.textContent = p.texto;
  const barra = caja.querySelector<HTMLElement>('.envgratis__barra')!;
  barra.setAttribute('aria-valuenow', String(p.pct));
  (barra.firstElementChild as HTMLElement).style.width = `${p.pct}%`;
  const cta = caja.querySelector<HTMLAnchorElement>('[data-envgratis-cta]');
  if (cta) {
    cta.hidden = p.logrado || !opts.enlace;
    if (opts.enlace) cta.href = opts.enlace;
  }
}

/** Decant más barato que se puede pedir (en los datos de catalogo.json); los combos no cuentan. */
export function decantMasBarato(datos: Record<string, { v?: Record<string, [number, string]> }>): number {
  let min = Infinity;
  for (const [slug, p] of Object.entries(datos)) {
    if (slug.startsWith('combo-')) continue;
    for (const t of ['3ml', '5ml', '10ml']) {
      const v = p.v?.[t];
      if (v && v[1] !== 'agotado' && v[0] < min) min = v[0];
    }
  }
  return Number.isFinite(min) ? min : 0;
}
