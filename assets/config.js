// ─────────────────────────────────────────────
//  CONFIGURACIÓN DEL CURSO — edita solo esto
// ─────────────────────────────────────────────
window.LINGUA = {
  curso: "English with the things you love",
  maestro: "Alejandro",

  // Cada lección nueva se agrega aquí. estado: "lista" o "pronto"
  modulos: [
    { titulo: "Module 1 · The basics", lecciones: [
      { id: "01", archivo: "clases/leccion-01.html", titulo: "Driver Profile", tema: "Introduce yourself: your name, age, where you’re from and what you like.", nivel: "A1–A2", min: 60, icono: "helmet", color: "#2346d0", estado: "lista" },
      { id: "02", titulo: "My Garage", tema: "Describe things with have / has, colors and big numbers.", nivel: "A1–A2", min: 60, icono: "car", color: "#0f766e", estado: "pronto" },
      { id: "03", titulo: "Race Day", tema: "Your daily routine and telling the time with the present simple.", nivel: "A2", min: 60, icono: "clock", color: "#b45309", estado: "pronto" }
    ]},
    { titulo: "Module 2 · Tell and compare", lecciones: [
      { id: "04", titulo: "Anime Night", tema: "Give your opinion: I love, I can't stand, because…", nivel: "A2", min: 60, icono: "chat", color: "#6d3fd6", estado: "pronto" },
      { id: "05", titulo: "Matchday", tema: "Tell the story of a match with the past simple.", nivel: "A2", min: 60, icono: "ball", color: "#15803d", estado: "pronto" },
      { id: "06", titulo: "Level Up", tema: "Compare games and cars: faster, better, the best.", nivel: "A2–B1", min: 60, icono: "pad", color: "#be123c", estado: "pronto" }
    ]}
  ],

  // ── Cuentas (Supabase) ──
  // Pega aquí el Project URL y la Publishable key (Settings → API Keys).
  // Si se dejan vacíos, la plataforma funciona sin cuentas y guarda solo en el navegador.
  cloud: {
    url: "",
    key: "",
    // Si el alumno escribe un usuario sin "@", se convierte en usuario@este-dominio
    usernameDomain: "student.lingua.app"
  }
};

// ── Helpers compartidos (no hace falta tocarlos) ──
// Cada valor guardado lleva su hora de cambio en "lingua.__meta" para sincronizar sin perder avances.
window.LINGUA.store = {
  get(k, d) { try { const v = localStorage.getItem("lingua." + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) {
    try {
      localStorage.setItem("lingua." + k, JSON.stringify(v));
      if (k.indexOf("__") !== 0) {
        const m = JSON.parse(localStorage.getItem("lingua.__meta") || "{}"); m[k] = Date.now();
        localStorage.setItem("lingua.__meta", JSON.stringify(m));
      }
    } catch (e) {}
    if (window.LINGUA.onSet) window.LINGUA.onSet(k);
  }
};
window.LINGUA.icons = {
  helmet: '<path d="M8 34c0-12 9-22 21-22 9 0 17 6 19 15l2 9H30a4 4 0 0 0-4 4v4H12a4 4 0 0 1-4-4z"/><path d="M30 27h18"/>',
  car: '<path d="M8 34l4-11c1-3 3-5 7-5h18c4 0 6 2 7 5l4 11"/><rect x="6" y="34" width="44" height="9" rx="3"/><circle cx="16" cy="45" r="3"/><circle cx="40" cy="45" r="3"/>',
  clock: '<circle cx="28" cy="30" r="16"/><path d="M28 21v9l6 4"/><path d="M23 9h10M28 9v5"/>',
  chat: '<path d="M10 14h36a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H24l-9 7v-7h-5a3 3 0 0 1-3-3V17a3 3 0 0 1 3-3z"/><path d="M18 24h20M18 30h12"/>',
  ball: '<circle cx="28" cy="28" r="17"/><path d="M28 19l8 6-3 9h-10l-3-9z"/><path d="M28 11v8M44 23l-8 2M39 42l-6-8M17 42l6-8M12 23l8 2"/>',
  pad: '<path d="M14 20h28c5 0 8 4 9 9l1 7c1 5-4 8-8 4l-5-5H17l-5 5c-4 4-9 1-8-4l1-7c1-5 4-9 9-9z"/><path d="M17 26v6M14 29h6"/><circle cx="38" cy="27" r="1.5"/><circle cx="42" cy="31" r="1.5"/>'
};
// Portada de lección: misma serie para todas (color, textura, título, ícono recortado)
window.LINGUA.thumb = function (l, label) {
  return `<div class="thumb" style="--c:${l.color}">` +
    `<svg class="ico-bg" viewBox="0 0 56 56" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${window.LINGUA.icons[l.icono] || ""}</svg>` +
    `<span class="lno">${label || "LESSON"} ${l.id}</span><span class="tt">${l.titulo}</span><span class="lv">${l.nivel}</span></div>`;
};
window.LINGUA.mark = function (s) {
  s = s || 30;
  return `<svg class="mark" width="${s}" height="${s}" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#2346d0"/><path d="M8.5 9h15a2.5 2.5 0 0 1 2.5 2.5v7.5a2.5 2.5 0 0 1-2.5 2.5H16l-4.5 4v-4h-3A2.5 2.5 0 0 1 6 19v-7.5A2.5 2.5 0 0 1 8.5 9z" fill="#fff"/><circle cx="20.5" cy="15.25" r="2.4" fill="#f5c518"/></svg>`;
};
window.LINGUA.logo = window.LINGUA.mark(30) + '<span class="wordmark">lingua</span>';
document.documentElement.style.setProperty("--scale", window.LINGUA.store.get("textSize", 1));
