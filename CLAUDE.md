# ONESELF

Catálogo de perfumes en decants. Astro estático, desplegado en Vercel (oneselfparfums.com). Los pedidos se cierran por WhatsApp: sin cuentas, pagos ni base de datos. Ver `README.md` para el mapa de archivos y tareas comunes.

## Comandos

- `npm run dev` — desarrollo en http://localhost:4321
- `npm run build` — compila a `dist/` (lo que hace Vercel). Falla si un JSON de perfume no cumple `src/content.config.ts`.
- `npm run vista` — compila una copia en `../vista-previa` (carpeta hermana, fuera del repo) para Live Server. Funciona en cmd, PowerShell y Git Bash.

## Cuidados

- El proyecto vive en `oneself-unified/`; `vista-previa/` y los respaldos están un nivel arriba y **no** son parte del repo.
- `vista-previa/` es salida generada: si el build la deja a medias, se puede borrar entera y recompilar.
- No ejecutar `ONESELF_BASE=... astro build` desde Git Bash: convierte `/vista-previa` en una ruta de Windows y rompe el build. Usar `npm run vista`.
- La fuente `sunny-bella-cute-font/` es de uso personal con licencia: está en `.gitignore`, no subirla.

## Datos

- Precios en pesos colombianos, enteros sin separadores (`245000`).
- Cada perfume tiene variantes `5ml`, `10ml` y `frasco` (frasco completo). Estados: `disponible`, `ultimas`, `agotado`, `bajo_pedido`.
- Un cambio de precio o estado es solo editar el JSON en `src/content/perfumes/`.

## Flujo de trabajo

- Cambios de datos (precio, foto, perfume nuevo): se hacen directo, se compila la vista previa para verificar, commit y push a `main`.
- Mensajes de commit cortos y concretos, en español (ej. "Hawas Ice 5ml a 25.000").
- Después de un cambio, verificar en `vista-previa/perfume/<slug>/index.html` que el dato nuevo aparece antes de dar la tarea por terminada.
