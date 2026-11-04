# BAA Estudio de Imagen · Briseyda Aguilar

Sitio de perfil profesional para Briseyda Aguilar, diseñadora de imagen en Tapachula, Chiapas.

Sitio estático (HTML + CSS + JS, sin dependencias): se abre directo en el navegador y se publica gratis en GitHub Pages, Netlify o Vercel.

## Estructura

```
index.html          Página principal (todas las secciones)
css/estilos.css     Paleta, tipografía y diseño responsivo
js/datos.js         ← Precios, servicios y fotos del catálogo (editar aquí)
js/main.js          Pestañas, galería, visor y formulario de WhatsApp
img/marca/          Logo vectorial (SVG) en dorado, claro y negro + favicon
img/galeria/        Fotos extraídas del catálogo
herramientas/       Script que genera el logo SVG
```

## Ver en local

```bash
python -m http.server 5173
```

Abrir http://localhost:5173

## Cambiar precios o servicios

Edita `js/datos.js`. Cada servicio tiene `cat`, `nombre`, `precio` (número, o `null` para "Cotizar") y opcionalmente `foto`.

## Paleta

| Nombre      | Color     | Uso                      |
|-------------|-----------|--------------------------|
| Marfil      | `#FAF6F0` | Fondo principal          |
| Lino        | `#F2EAE1` | Secciones alternas       |
| Rubor       | `#EBD6CC` | Acentos suaves           |
| Oro         | `#9A7638` | Logo, títulos en cursiva |
| Oro claro   | `#E9D3A6` | Logo sobre fondo oscuro  |
| Tinta       | `#1E1A17` | Texto, botones           |

Tipografías: **Cormorant Garamond** (títulos) y **Jost** (texto), de Google Fonts.

## Pendientes por confirmar

- Dirección exacta (el pin de Maps apunta a “Barbería Vikings Land”, ¿el estudio está ahí?)
- Instagram / TikTok
- Horario normal (el de lunes a sábado 9:30–8:00 viene del flyer de diciembre)
- Precios de uñas, maquillaje y alisados
