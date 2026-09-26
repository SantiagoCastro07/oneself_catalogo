"""Normaliza las fotos del sitio anterior para el nuevo catálogo.

- Recorta el espacio transparente sobrante alrededor del frasco.
- Centra el frasco en un lienzo cuadrado transparente con margen uniforme
  (el frasco ocupa el 84 % del lado mayor), sin agrandar la foto original.
- Guarda como PNG con el nombre del slug en src/assets/perfumes/.
Los originales en _legacy/assets/ no se modifican.
Uso: python3 scripts/normalizar-imagenes.py
"""
import json, os, glob
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, '_legacy')
OUT = os.path.join(ROOT, 'src', 'assets', 'perfumes')
OCUPACION = 0.84
MAX_LADO = 1000
os.makedirs(OUT, exist_ok=True)

n = 0
for f in sorted(glob.glob(os.path.join(ROOT, 'src/content/perfumes/*.json'))):
    d = json.load(open(f, encoding='utf-8'))
    slug = os.path.splitext(os.path.basename(f))[0]
    im = Image.open(os.path.join(SRC, d['legado']['img'])).convert('RGBA')
    bbox = im.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
    im = im.crop(bbox)
    w, h = im.size
    lado = min(MAX_LADO, round(max(w, h) / OCUPACION))
    escala = min(1.0, (lado * OCUPACION) / max(w, h))
    if escala < 1:
        im = im.resize((round(w * escala), round(h * escala)), Image.LANCZOS)
        w, h = im.size
    lienzo = Image.new('RGBA', (lado, lado), (0, 0, 0, 0))
    lienzo.paste(im, ((lado - w) // 2, (lado - h) // 2), im)
    destino = os.path.join(OUT, f'{slug}.png')
    lienzo.save(destino, optimize=True)
    n += 1
    print(f'{slug:36s} {w}x{h} -> {lado}x{lado}  {os.path.getsize(destino)//1024} KB')
print(f'OK · {n} imágenes')
