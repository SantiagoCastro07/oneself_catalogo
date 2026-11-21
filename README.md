# OneSelf · sitio web

Tienda de perfumes originales en decants. Sitio estático con [Astro](https://astro.build), publicado en Vercel.
Los pedidos se cierran por WhatsApp: no hay cuentas, pagos en línea ni base de datos.

## Dónde está cada cosa

| Qué | Archivo |
| --- | --- |
| Perfumes, precios, estados, fotos, marcas y combos | **OneSelf Manager → Productos** (se descargan al compilar; ver abajo) |
| WhatsApp, redes, textos generales, rendimiento, medios de pago, tarifas de envío | `src/data/tienda.json` |
| Preguntas frecuentes | `src/data/preguntas.json` |
| Reglas de validación del catálogo | `src/content.config.ts` |
| Pixeles de anuncios (Meta, TikTok) | IDs en `tienda.json` → `pixeles`; código en `src/components/Pixeles.astro` |

## Tareas comunes

- **Perfumes, precios, estados, fotos, marcas y combos:** se editan en **OneSelf Manager → Productos**. Al guardar, el Manager le pide a Vercel recompilar la web (Deploy Hook) y el cambio aparece en un par de minutos.
- **Fotos de combo:** `node scripts/componer-combo.mjs <salida.png> <perfume> <perfume> <perfume>` arma la imagen; después se sube en el combo desde el Manager.
- **Cambiar tarifas de envío:** edita `envios` en `tienda.json` (el pedido y Cómo funciona se actualizan solos) y ajusta a mano la pregunta de envíos en `preguntas.json` y el anuncio de envío gratis.

### Catálogo desde el Manager

`npm run build` (y `dev` y `vista`) corre primero `scripts/descargar-catalogo.mjs`. Ese script descarga de `https://manager.oneselfparfums.com/api/public/catalogo` (o de `MANAGER_URL`) y genera `src/data/marcas.json`, `src/content/perfumes/`, `src/content/combos/` y las fotos en `src/assets/perfumes|combos/`. Son archivos generados: están en `.gitignore` y no se editan a mano. Si el Manager no responde, la compilación falla y Vercel deja en línea la versión anterior.

Si un dato está mal escrito, la compilación falla y dice qué perfume y qué campo revisar. El Manager valida lo mismo al guardar.

## Páginas

`/` · `/catalogo/` · `/catalogo/{hombre,mujer,unisex,arabes,disenador,nicho,nuevos}/` · `/marcas/` ·
`/marcas/<marca>/` · `/perfume/<slug>/` (acepta `?tam=10ml`) · `/combos/` · `/combos/<slug>/` · `/pedido/` · `/como-funciona/` · `/nosotros/`

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
