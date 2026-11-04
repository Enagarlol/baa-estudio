"""Genera el logo BA como SVG vectorial (texto convertido a trazos)."""
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

OUT = sys.argv[1]

def load(path, wght):
    f = TTFont(path)
    return instantiateVariableFont(f, {"wght": wght}, inplace=False)

CORM_BIG = load("baa_fonts/corm.ttf", 300)
CORM_NAME = load("baa_fonts/corm.ttf", 400)
JOST = load("baa_fonts/jost.ttf", 450)

def run(font, text, size, x, y, tracking=0.0, kern=0):
    """Devuelve (d, ancho) del texto con origen en la línea base (x, y)."""
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    upm = font["head"].unitsPerEm
    s = size / upm
    pen = SVGPathPen(gs)
    cx = 0.0
    for i, ch in enumerate(text):
        g = cmap[ord(ch)]
        tp = TransformPen(pen, (s, 0, 0, -s, x + cx, y))
        gs[g].draw(tp)
        cx += gs[g].width * s
        if i < len(text) - 1:
            cx += tracking * size
    return pen.getCommands(), cx

def bounds(font, ch, size):
    gs = font.getGlyphSet()
    g = font.getBestCmap()[ord(ch)]
    bp = BoundsPen(gs)
    gs[g].draw(bp)
    s = size / font["head"].unitsPerEm
    xmin, ymin, xmax, ymax = bp.bounds
    return xmin * s, ymin * s, xmax * s, ymax * s, gs[g].width * s

def centered(font, text, size, cx, y, tracking):
    _, w = run(font, text, size, 0, 0, tracking)
    return run(font, text, size, cx - w / 2, y, tracking)[0], w

S = 360            # tamaño de las letras grandes
BASE = 330         # línea base
bx0, _, bx1, by1, _ = bounds(CORM_BIG, "B", S)
ax0, _, ax1, ay1, _ = bounds(CORM_BIG, "A", S)
cap = by1

B_X = 60 - bx0
A_X = B_X + bx1 - ax0 - 0.05 * S      # la A se monta sobre la panza de la B
d_B, _ = run(CORM_BIG, "B", S, B_X, BASE)
d_A, _ = run(CORM_BIG, "A", S, A_X, BASE)
left, right = B_X + bx0, A_X + ax1
mid = (left + right) / 2

NAME_SIZE = 30
name_y = BASE - cap * 0.47
d_name, name_w = centered(CORM_NAME, "BRISEYDA AGUILAR", NAME_SIZE, mid, name_y + NAME_SIZE * 0.32, 0.30)
band_h = NAME_SIZE * 1.05

TAG_SIZE = 19
tag_y = BASE + 62
d_tag, tag_w = centered(JOST, "DISEÑADORA DE IMAGEN", TAG_SIZE, mid, tag_y, 0.32)

pad = 40
vx0 = min(left, mid - name_w / 2, mid - tag_w / 2) - pad
vx1 = max(right, mid + name_w / 2, mid + tag_w / 2) + pad
vy0 = BASE - cap - pad
vy1 = tag_y + pad * 0.8
W, H = vx1 - vx0, vy1 - vy0

def logo(color, name_color=None, bg=None, tagline=True):
    nc = name_color or color
    h = vy1 - vy0 if tagline else (BASE + pad) - vy0
    bgr = f'<rect x="{vx0:.1f}" y="{vy0:.1f}" width="{W:.1f}" height="{h:.1f}" fill="{bg}"/>' if bg else ""
    tag = f'<path fill="{nc}" d="{d_tag}"/>' if tagline else ""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vx0:.1f} {vy0:.1f} {W:.1f} {h:.1f}" role="img" aria-label="Briseyda Aguilar, Diseñadora de Imagen">
<defs><mask id="corte" maskUnits="userSpaceOnUse" x="{vx0:.1f}" y="{vy0:.1f}" width="{W:.1f}" height="{h:.1f}">
<rect x="{vx0:.1f}" y="{vy0:.1f}" width="{W:.1f}" height="{h:.1f}" fill="#fff"/>
<rect x="{mid - name_w / 2 - 14:.1f}" y="{name_y - band_h / 2:.1f}" width="{name_w + 28:.1f}" height="{band_h:.1f}" fill="#000"/>
</mask></defs>{bgr}
<g mask="url(#corte)" fill="{color}"><path d="{d_B}"/><path d="{d_A}"/></g>
<path fill="{nc}" d="{d_name}"/>{tag}
</svg>
'''

def monogram(color, bg=None, size_pad=30):
    x0, y0 = left - size_pad, BASE - cap - size_pad
    w, h = right - left + 2 * size_pad, cap + 2 * size_pad
    side = max(w, h)
    x0 -= (side - w) / 2
    y0 -= (side - h) / 2
    bgr = f'<rect x="{x0:.1f}" y="{y0:.1f}" width="{side:.1f}" height="{side:.1f}" rx="{side * 0.18:.1f}" fill="{bg}"/>' if bg else ""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:.1f} {y0:.1f} {side:.1f} {side:.1f}">{bgr}
<g fill="{color}"><path d="{d_B}"/><path d="{d_A}"/></g></svg>
'''

GOLD = "#9A7638"
open(f"{OUT}/logo.svg", "w", encoding="utf-8").write(logo(GOLD))
open(f"{OUT}/logo-claro.svg", "w", encoding="utf-8").write(logo("#E9D3A6"))
open(f"{OUT}/logo-negro.svg", "w", encoding="utf-8").write(logo("#1E1A17"))
open(f"{OUT}/monograma.svg", "w", encoding="utf-8").write(monogram(GOLD))
open(f"{OUT}/favicon.svg", "w", encoding="utf-8").write(monogram("#E9D3A6", bg="#1E1A17", size_pad=50))
print("ok", round(W), round(H))
