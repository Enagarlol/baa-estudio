const $ = (s) => document.querySelector(s);
const pesos = (n) => (n == null ? "Cotizar" : `$${n.toLocaleString("es-MX")}`);
const categorias = [...new Set(SERVICIOS.map((s) => s.cat))];

// ---- Servicios por categoría ----
function pintarServicios(cat) {
  document.querySelectorAll("#categorias button").forEach((b) =>
    b.setAttribute("aria-selected", b.dataset.cat === cat));
  $("#listaServicios").innerHTML = SERVICIOS.filter((s) => s.cat === cat)
    .map((s) => `
      <article class="servicio">
        <h3>${s.nombre}</h3>
        <span class="servicio__puntos"></span>
        <span class="servicio__precio${s.precio == null ? " servicio__precio--cotizar" : ""}">${pesos(s.precio)}</span>
        <button class="servicio__agendar" data-servicio="${s.nombre}" aria-label="Agendar ${s.nombre}">Agendar →</button>
      </article>`).join("");
}
$("#categorias").innerHTML = categorias
  .map((c) => `<button role="tab" data-cat="${c}">${c}</button>`).join("");
$("#categorias").addEventListener("click", (e) => {
  if (e.target.dataset.cat) pintarServicios(e.target.dataset.cat);
});
pintarServicios(categorias[0]);

// ---- Galería con filtros ----
const catsGaleria = ["Todo", ...new Set(TRABAJOS.map((t) => t.cat))];
function pintarGaleria(cat) {
  document.querySelectorAll("#filtrosGaleria button").forEach((b) =>
    b.classList.toggle("activo", b.dataset.cat === cat));
  $("#galeria").innerHTML = TRABAJOS
    .map((t, i) => ({ ...t, i }))
    .filter((t) => cat === "Todo" || t.cat === cat)
    .map((t) => `
      <button class="foto" data-i="${t.i}">
        <img src="img/galeria/${t.foto}.jpg" alt="${t.titulo}" loading="lazy">
        <span class="foto__etiqueta"><small>${t.cat}</small>${t.titulo}</span>
      </button>`).join("");
}
$("#filtrosGaleria").innerHTML = catsGaleria
  .map((c) => `<button data-cat="${c}">${c}</button>`).join("");
$("#filtrosGaleria").addEventListener("click", (e) => {
  if (e.target.dataset.cat) pintarGaleria(e.target.dataset.cat);
});
pintarGaleria("Todo");

// ---- Visor de fotos ----
const visor = $("#visor");
$("#galeria").addEventListener("click", (e) => {
  const b = e.target.closest(".foto");
  if (!b) return;
  const t = TRABAJOS[b.dataset.i];
  const s = SERVICIOS.find((x) => x.nombre === t.servicio);
  $("#visorImg").src = `img/galeria/${t.foto}.jpg`;
  $("#visorImg").alt = t.titulo;
  $("#visorCat").textContent = t.cat;
  $("#visorTitulo").textContent = t.titulo;
  $("#visorDesc").textContent = t.desc;
  $("#visorPrecio").textContent = s ? (s.precio == null ? "Precio a cotizar" : `Desde ${pesos(s.precio)}`) : "";
  $("#visorAgendar").dataset.servicio = t.servicio;
  visor.showModal();
});
$("#cerrarVisor").addEventListener("click", () => visor.close());
visor.addEventListener("click", (e) => { if (e.target === visor) visor.close(); });

// ---- Agendar por WhatsApp ----
const sel = $("#selServicio");
sel.innerHTML = `<option value="">Elige un servicio…</option>` + categorias.map((c) =>
  `<optgroup label="${c}">${SERVICIOS.filter((s) => s.cat === c)
    .map((s) => `<option>${s.nombre}</option>`).join("")}</optgroup>`).join("");

function elegirServicio(nombre) {
  sel.value = nombre;
  visor.close();
  $("#agendar").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => $("#formCita [name=nombre]").focus({ preventScroll: true }), 600);
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-servicio]");
  if (b) { e.preventDefault(); elegirServicio(b.dataset.servicio); }
});

const hoy = new Date();
$("#fechaCita").min = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);

$("#formCita").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const fecha = new Date(f.get("fecha") + "T12:00").toLocaleDateString("es-MX",
    { weekday: "long", day: "numeric", month: "long" });
  if (new Date(f.get("fecha") + "T12:00").getDay() === 0) {
    alert("Los domingos el estudio está cerrado. Elige otro día, por favor.");
    return;
  }
  const s = SERVICIOS.find((x) => x.nombre === f.get("servicio"));
  const msg = [
    `¡Hola Briseyda! Soy ${f.get("nombre")} y quiero agendar una cita.`,
    `• Servicio: ${f.get("servicio")}${s && s.precio != null ? ` (${pesos(s.precio)})` : ""}`,
    `• Día: ${fecha}`,
    `• Horario: ${f.get("horario")}`,
    f.get("nota") ? `• Nota: ${f.get("nota")}` : "",
  ].filter(Boolean).join("\n");
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
});

// ---- Menú móvil y barra ----
const abrir = $("#abrirMenu");
abrir.addEventListener("click", () => {
  const abierto = document.body.classList.toggle("menu-abierto");
  abrir.setAttribute("aria-expanded", abierto);
});
$("#menu").addEventListener("click", () => document.body.classList.remove("menu-abierto"));
const barra = $("#barra");
addEventListener("scroll", () => barra.classList.toggle("con-sombra", scrollY > 10), { passive: true });

// ---- Aparición suave al hacer scroll ----
const obs = new IntersectionObserver((entradas) => entradas.forEach((en) => {
  if (en.isIntersecting) { en.target.classList.add("visible"); obs.unobserve(en.target); }
}), { threshold: 0.12 });
document.querySelectorAll(".seccion__titulo, .servicios, .reglas li, .sobre__foto, .sobre__texto, .valores > div")
  .forEach((el) => { el.classList.add("aparece"); obs.observe(el); });

$("#anio").textContent = hoy.getFullYear();
