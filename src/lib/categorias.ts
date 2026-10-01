// Páginas de catálogo. Se derivan de los datos: no hay listas que mantener a mano.
import type { Perfume } from './catalogo';

export interface Categoria {
  slug: string;
  corto: string;        // texto del menú y de los chips
  titulo: string;       // H1 de la página
  descripcion: string;  // meta description
  grupo: 'genero' | 'tipo' | 'especial';
  filtro: (p: Perfume) => boolean;
}

export const CATEGORIAS: Categoria[] = [
  { slug: 'hombre', corto: 'Hombre', titulo: 'Perfumes para hombre', grupo: 'genero',
    descripcion: 'Perfumes originales para hombre en decants de 3, 5 y 10 ml. Árabes, de diseñador y nicho. Envíos a toda Colombia.',
    filtro: (p) => p.data.genero === 'hombre' },
  { slug: 'mujer', corto: 'Mujer', titulo: 'Perfumes para mujer', grupo: 'genero',
    descripcion: 'Perfumes originales para mujer en decants de 3, 5 y 10 ml. Envíos a toda Colombia, pedidos por WhatsApp.',
    filtro: (p) => p.data.genero === 'mujer' },
  { slug: 'unisex', corto: 'Unisex', titulo: 'Perfumes unisex', grupo: 'genero',
    descripcion: 'Perfumes unisex originales en decants de 3, 5 y 10 ml. Envíos a toda Colombia.',
    filtro: (p) => p.data.genero === 'unisex' },
  { slug: 'arabes', corto: 'Árabes', titulo: 'Perfumes árabes', grupo: 'tipo',
    descripcion: 'Perfumes árabes originales en decants: Lattafa, Armaf, Rasasi, Afnan y más. Envíos a toda Colombia.',
    filtro: (p) => p.data.tipo === 'arabe' },
  { slug: 'disenador', corto: 'Diseñador', titulo: 'Perfumes de diseñador', grupo: 'tipo',
    descripcion: 'Perfumes de diseñador originales en decants de 3, 5 y 10 ml. Envíos a toda Colombia.',
    filtro: (p) => p.data.tipo === 'disenador' },
  { slug: 'nicho', corto: 'Nicho', titulo: 'Perfumes nicho', grupo: 'tipo',
    descripcion: 'Perfumes nicho originales en decants de 3, 5 y 10 ml. Envíos a toda Colombia.',
    filtro: (p) => p.data.tipo === 'nicho' },
  { slug: 'nuevos', corto: 'Nuevos', titulo: 'Lo nuevo', grupo: 'especial',
    descripcion: 'Los perfumes que acaban de llegar a OneSelf, en decants de 3, 5 y 10 ml.',
    filtro: (p) => p.data.etiquetas.includes('nuevo') },
];

/** Una categoría aparece en el menú solo si tiene suficientes perfumes. */
export const MINIMO_EN_MENU = 4;

export const FAMILIA_ETIQUETA: Record<string, string> = {
  citrico: 'Cítrico', acuatico: 'Acuático', aromatico: 'Aromático', floral: 'Floral', frutal: 'Frutal',
  gourmand: 'Gourmand', ambarado: 'Ambarado', amaderado: 'Amaderado', especiado: 'Especiado',
};
export const TIPO_ETIQUETA: Record<string, string> = { arabe: 'Árabe', disenador: 'Diseñador', nicho: 'Nicho' };
export const GENERO_ETIQUETA: Record<string, string> = { hombre: 'Hombre', mujer: 'Mujer', unisex: 'Unisex' };
