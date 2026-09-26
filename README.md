# OneSelf · sitio web

Tienda de perfumes originales en decants. Sitio estático con [Astro](https://astro.build), publicado en Vercel.
Los pedidos se cierran por WhatsApp: no hay cuentas, pagos en línea ni base de datos.

## Dónde está cada cosa

| Qué | Archivo |
| --- | --- |
| Un perfume | `src/content/perfumes/<slug>.json` |
| Fotos de perfumes | `src/assets/perfumes/<slug>.png` |
| Marcas | `src/data/marcas.json` |
| WhatsApp, redes, textos generales, rendimiento, medios de pago | `src/data/tienda.json` |
| Preguntas frecuentes | `src/data/preguntas.json` |
| Reglas de validación del catálogo | `src/content.config.ts` |

## Tareas comunes

- **Agotar un tamaño:** en el JSON del perfume, cambia `"estado": "disponible"` por `"agotado"` en esa variante.
  Otros estados: `"ultimas"` (muestra "Últimas unidades") y `"bajo_pedido"`.
- **Agregar un perfume:** copia un JSON existente, cambia los datos y agrega la foto con el mismo nombre.
  Aparece solo en catálogo, filtros, marca, búsqueda y sitemap.
- **Retirar un perfume:** `"activo": false`.
- **Destacar en la home:** agrega `"destacado"` a `etiquetas`. `"nuevo"` lo muestra en Lo nuevo.

Si un dato está mal escrito, la compilación falla y dice qué perfume y qué campo revisar.

## Páginas

`/` · `/catalogo/` · `/catalogo/{hombre,mujer,unisex,arabes,disenador,nicho,nuevos}/` · `/marcas/` ·
`/marcas/<marca>/` · `/perfume/<slug>/` (acepta `?tam=10ml`) · `/pedido/` · `/como-funciona/` · `/nosotros/`

## Comandos

```
npm install
npm run dev       # desarrollo en http://localhost:4321
npm run build     # compila a dist/ (lo que hace Vercel)
npm run vista     # compila una copia en ../vista-previa para verla con Live Server
```

## Historial

El sitio anterior (una sola página) está en `_legacy/` y en la etiqueta de Git `v1-catalogo-original`.
`scripts/migrar-desde-legacy.mjs` convirtió sus datos al formato actual.
