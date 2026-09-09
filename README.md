# OneSelf · Perfumes en Decants

Sitio web de una sola página para **OneSelf**, una tienda de perfumes originales vendidos en decants (fraccionados desde 5 ml) y botellas completas, con envíos a toda Colombia. Combina una landing de marca con un catálogo filtrable y un carrito de compras que genera el pedido final por WhatsApp — no hay backend ni pasarela de pago: todo el flujo de checkout termina en un mensaje pre-armado a WhatsApp.

## Demo / Stack

Sitio 100% estático: HTML + CSS + JavaScript vanilla (sin frameworks, sin build step, sin dependencias de npm). Las únicas dependencias externas son las fuentes de Google Fonts (`Marcellus` para títulos, `Jost` para texto).

## Estructura del proyecto

```
oneself-unified/
├── index.html        # Landing + catálogo + modal de producto + carrito (todo en una página)
├── css/
│   └── styles.css     # Estilos (tema oscuro, variables CSS, diseño responsive)
├── js/
│   ├── data.js        # Catálogo de perfumes (fuente de datos)
│   ├── cart.js         # Lógica del carrito (localStorage + generación del mensaje de WhatsApp)
│   └── app.js           # Render de la UI, filtros, buscador, modal, interacciones
└── assets/            # Logo + imágenes de cada perfume (PNG)
```

## Funcionalidades

- **Hero / landing**: presentación de la marca con enlaces directos a WhatsApp, TikTok e Instagram.
- **Catálogo dinámico**: las tarjetas de producto se generan a partir de `js/data.js`, sin necesidad de tocar el HTML.
- **Estante "Lo Nuevo"**: carrusel automático con los perfumes marcados como `isNew: true`.
- **Filtros y búsqueda**: por género (hombre/mujer/unisex), categoría (árabe/diseñador/nicho) y por texto (nombre o marca), combinables entre sí.
- **Modal de detalle**: muestra descripción, pirámide olfativa (salida, corazón, fondo) y precios por tamaño.
- **Manejo de stock**: los perfumes con `stock: false` se muestran como "Agotado" y no se pueden agregar al carrito.
- **Carrito persistente**: guardado en `localStorage`, permite agregar varios perfumes/tamaños, ajustar cantidades y ver el total estimado.
- **Checkout por WhatsApp**: tanto la "Compra ya" individual como el checkout del carrito arman automáticamente un mensaje de WhatsApp con el detalle del pedido y el total.

## Gestión del catálogo

Todo el inventario vive en `js/data.js` como un arreglo de objetos `PERFUMES`. Para agregar, editar o quitar un perfume basta con modificar ese archivo — la UI (tarjetas, filtros, modal, carrito) se genera automáticamente a partir de sus datos.

Campos de cada perfume:

| Campo | Descripción |
|---|---|
| `id` | Identificador único (slug), usado por el carrito para agrupar ítems |
| `name`, `brand` | Nombre y marca del perfume |
| `category` | `"arabe"` \| `"disenador"` \| `"nicho"` |
| `gender` | `"hombre"` \| `"mujer"` \| `"unisex"` |
| `img` | Ruta a la imagen en `assets/` |
| `desc` | Descripción corta mostrada en tarjeta y modal |
| `stock` | `true`/`false` — controla si se puede pedir |
| `isNew` | (opcional) `true` para aparecer en el estante "Lo Nuevo" |
| `prices` | Objeto con precios por tamaño: `"5ml"`, `"10ml"`, `"full"` |
| `notes` | Pirámide olfativa: `{ salida, corazon, fondo }` |

## Configuración de WhatsApp

El número de contacto para pedidos está centralizado en `js/cart.js`:

```js
const WHATSAPP_PHONE = "573227747150";
```

Cámbialo ahí para actualizar tanto el botón "Comprar ya" del modal como el checkout del carrito.

## Cómo correrlo localmente

Al ser un sitio estático, alcanza con abrir `index.html` en el navegador, o servirlo con cualquier servidor local, por ejemplo:

```bash
npx serve .
# o
python -m http.server 8000
```

## Despliegue

Al no requerir backend ni build, el proyecto puede publicarse directamente en cualquier hosting estático (GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.) apuntando a la raíz del repositorio.
