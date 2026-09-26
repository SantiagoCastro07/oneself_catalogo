// Esquema del catálogo. Si un perfume tiene un dato mal escrito (tamaño, estado,
// marca inexistente, precio vacío…), la publicación falla con un mensaje claro
// en lugar de romper la página.
import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

export const TAMANOS = ['3ml', '5ml', '10ml', 'frasco'] as const;
export const ESTADOS = ['disponible', 'ultimas', 'agotado', 'bajo_pedido'] as const;
export const GENEROS = ['hombre', 'mujer', 'unisex'] as const;
export const TIPOS = ['arabe', 'disenador', 'nicho'] as const;
export const FAMILIAS = [
  'citrico', 'acuatico', 'aromatico', 'floral', 'frutal',
  'gourmand', 'ambarado', 'amaderado', 'especiado',
] as const;
export const ETIQUETAS = ['nuevo', 'destacado'] as const;

const marcas = defineCollection({
  loader: file('src/data/marcas.json', { parser: (t) => JSON.parse(t).map((m: { slug: string }) => ({ id: m.slug, ...m })) }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    nombre: z.string().min(1),
  }),
});

const perfumes = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/perfumes' }),
  schema: ({ image }) =>
    z.object({
      nombre: z.string().min(1),
      marca: reference('marcas'),
      genero: z.enum(GENEROS),
      tipo: z.enum(TIPOS),
      familias: z.array(z.enum(FAMILIAS)).max(3).default([]),
      concentracion: z.enum(['EDT', 'EDP', 'Parfum', 'Extrait', 'Elixir']).optional(),
      descripcion: z.string().min(1),
      notas: z.object({
        salida: z.array(z.string()).default([]),
        corazon: z.array(z.string()).default([]),
        fondo: z.array(z.string()).default([]),
      }),
      imagenes: z.array(image()).min(1, 'Cada perfume necesita al menos una imagen'),
      variantes: z
        .array(
          z.object({
            tamano: z.enum(TAMANOS),
            precio: z.number().int().positive(),
            estado: z.enum(ESTADOS),
            ml: z.number().positive().optional(), // ml del frasco completo
            provisional: z.boolean().optional(), // precio pendiente de confirmar
          }),
        )
        .min(1)
        .refine((v) => new Set(v.map((x) => x.tamano)).size === v.length, 'Hay un tamaño repetido'),
      etiquetas: z.array(z.enum(ETIQUETAS)).default([]),
      activo: z.boolean().default(true),
      legado: z.object({ id: z.string(), img: z.string() }).optional(),
    }),
});

export const collections = { marcas, perfumes };
