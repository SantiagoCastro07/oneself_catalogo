// Promoción vigente (tienda.json → promo) y decant de regalo por compra (tienda.json → regalo).
// Todo se decide con la hora del navegador, así la regla cambia sola al terminar la promo sin recompilar.
import tienda from '../data/tienda.json';
import { pesos } from './whatsapp';
import type { ProgresoEnvio } from './envioProgreso';

interface Promo { titulo: string; codigo?: string; desde?: string; hasta: string }
interface Regalo { texto: string; desde: number; promoDesde?: number }
const promo = (tienda as { promo?: Promo }).promo;
const regalo = (tienda as { regalo?: Regalo }).regalo;

export function promoActiva(ahora = Date.now()): boolean {
  if (!promo?.hasta) return false;
  const desde = promo.desde ? Date.parse(promo.desde) : 0;
  return ahora >= desde && ahora < Date.parse(promo.hasta);
}

/** Código que se escribe en el mensaje de WhatsApp mientras la promo está vigente. */
export const codigoPromo = () => (promoActiva() && promo?.codigo) || '';

/** Monto del pedido (en pesos) desde el que se regala el decant; 0 = sin regalo. */
export function umbralRegalo(): number {
  if (!regalo) return 0;
  return promoActiva() && regalo.promoDesde ? regalo.promoDesde : regalo.desde;
}

/** El regalo aplica sobre el subtotal de productos (decants, combos y frascos), sin envío. */
export const ganaRegalo = (subtotal: number) => umbralRegalo() > 0 && subtotal >= umbralRegalo();
export const textoRegalo = () => regalo?.texto || '';

export function progresoRegalo(subtotal: number): ProgresoEnvio | null {
  const u = umbralRegalo();
  if (!u || subtotal <= 0) return null;
  if (subtotal >= u) return { texto: `¡Te ganaste ${regalo!.texto}! Va de regalo con tu pedido.`, pct: 100, logrado: true, cerca: false };
  const falta = u - subtotal;
  const pct = Math.min(99, Math.round((subtotal / u) * 100));
  const texto = pct >= 80
    ? `¡Casi! Solo ${pesos(falta)} más y te regalamos ${regalo!.texto}.`
    : `Agrega ${pesos(falta)} y te regalamos ${regalo!.texto} (pedidos desde ${pesos(u)}).`;
  return { texto, pct, logrado: false, cerca: pct >= 80 };
}

interface BeneficiosFrasco { siempre?: boolean; regalo?: string; probaste?: string }
const benef = (tienda as { beneficiosFrasco?: BeneficiosFrasco }).beneficiosFrasco;
/** Beneficios del frasco completo vigentes ahora (vacío si no aplican). */
export function beneficiosFrasco(): { regalo: string; probaste: string } {
  if (!benef || !(benef.siempre || promoActiva())) return { regalo: '', probaste: '' };
  return { regalo: benef.regalo || '', probaste: benef.probaste || '' };
}

/** Rótulo pequeño sobre la barra del regalo. */
export const contextoRegalo = () => (promoActiva() && regalo?.promoDesde ? `Regalo · ${promo!.titulo}` : 'Regalo por compra');
