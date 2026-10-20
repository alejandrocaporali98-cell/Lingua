// ─────────────────────────────────────────────
//  CONFIGURACIÓN DEL CURSO — edita solo esto
// ─────────────────────────────────────────────
window.LINGUA = {
  curso: "English with the things you love",
  maestro: "Alejandro",
  maestroNombre: "Alejandro Caporali",   // nombre que firma los diplomas

  // Cada lección nueva se agrega aquí. estado: "lista" o "pronto"
  modulos: [
    { titulo: "Module 1 · The basics", lecciones: [
      { id: "01", archivo: "clases/leccion-01.html", titulo: "Driver Profile", tema: "Introduce yourself: your name, age, where you’re from and what you like.", nivel: "A1–A2", min: 60, icono: "helmet", color: "#2346d0", estado: "lista" },
      { id: "02", archivo: "clases/leccion-02.html", titulo: "My Garage", tema: "Describe things with have / has, colors and big numbers.", nivel: "A1–A2", min: 60, icono: "car", color: "#0f766e", estado: "lista" },
      { id: "03", archivo: "clases/leccion-03.html", titulo: "Race Day", tema: "Your daily routine and telling the time with the present simple.", nivel: "A2", min: 60, icono: "clock", color: "#b45309", estado: "lista" }
    ]},
    { titulo: "Module 2 · Tell and compare", lecciones: [
      { id: "04", archivo: "clases/leccion-04.html", titulo: "Anime Night", tema: "Give your opinion: I love, I can't stand, because…", nivel: "A2", min: 60, icono: "chat", color: "#6d3fd6", estado: "lista" },
      { id: "05", archivo: "clases/leccion-05.html", titulo: "Matchday", tema: "Tell the story of a match with the past simple.", nivel: "A2", min: 60, icono: "ball", color: "#15803d", estado: "lista" },
      { id: "06", archivo: "clases/leccion-06.html", titulo: "Level Up", tema: "Compare games and cars: faster, better, the best.", nivel: "A2–B1", min: 60, icono: "pad", color: "#be123c", estado: "lista" }
    ]}
  ],

  // ── Cuentas (Supabase) ──
  // Pega aquí el Project URL y la Publishable key (Settings → API Keys).
  // Si se dejan vacíos, la plataforma funciona sin cuentas y guarda solo en el navegador.
  cloud: {
    url: "https://vtvfltiadubdphkunshr.supabase.co",
    key: "sb_publishable_5O3MsX0-tvWFq2M65wTUEQ_veRijaYN",
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
  pad: '<path d="M14 20h28c5 0 8 4 9 9l1 7c1 5-4 8-8 4l-5-5H17l-5 5c-4 4-9 1-8-4l1-7c1-5 4-9 9-9z"/><path d="M17 26v6M14 29h6"/><circle cx="38" cy="27" r="1.5"/><circle cx="42" cy="31" r="1.5"/>',
  film: '<rect x="8" y="22" width="40" height="24" rx="3"/><path d="M8 22l38-9 2 7"/><path d="M17 20l5-8M28 17l5-8M39 14l4-7"/><path d="M8 30h40"/>',
  music: '<path d="M22 40V14l22-5v26"/><circle cx="16" cy="40" r="6"/><circle cx="38" cy="35" r="6"/><path d="M22 21l22-5"/>',
  guitar: '<path d="M33 23l11-11M40 8l8 8"/><path d="M30 26c-3-3-9-2-11 2-1 2-1 4-3 5-5 1-8 5-6 10 2 4 6 6 10 6 5 0 8-3 9-8 1-2 3-2 5-3 4-2 5-8 2-11z"/><circle cx="24" cy="38" r="3"/>',
  book: '<path d="M10 12h14a4 4 0 0 1 4 4v28a3 3 0 0 0-3-3H10z"/><path d="M46 12H32a4 4 0 0 0-4 4v28a3 3 0 0 1 3-3h15z"/>',
  plane: '<path d="M8 32l40-18-12 32-8-12z"/><path d="M28 34l20-20"/>',
  food: '<path d="M10 30h36a18 18 0 0 1-36 0z"/><path d="M22 22c0-4 3-4 3-8M30 22c0-4 3-4 3-8"/><path d="M14 48h28"/>'
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

// Lessons made in the lesson builder (saved in Supabase, cached here) join the course as a new module
(function () {
  const L = window.LINGUA, rows = (L.store.get("__lessons", []) || []).filter(r => r.published && r.data);
  if (!rows.length) return;
  const known = new Set(L.modulos.flatMap(m => m.lecciones).map(l => l.id));
  const extra = rows.filter(r => !known.has(r.id)).sort((a, b) => a.id.localeCompare(b.id)).map(r => ({
    id: r.id, archivo: "clases/custom.html?id=" + r.id, titulo: r.data.titulo || "Lesson " + r.id, tema: r.data.tema || "",
    nivel: r.data.nivel || "A2", min: 60, icono: r.data.icono || "chat", color: r.data.color || "#2346d0", estado: "lista", custom: true
  }));
  if (!extra.length) return;
  // Group by the module name set in the builder, in the order they first appear
  const byMod = {};
  extra.forEach(l => { const r = rows.find(x => x.id === l.id), m = (r.data.modulo || "").trim() || "Module 3 · More lessons"; (byMod[m] = byMod[m] || []).push(l); });
  Object.keys(byMod).forEach(m => L.modulos.push({ titulo: m, lecciones: byMod[m] }));
})();

// Each student sees only the lessons the teacher assigned (lessons: null = every lesson)
(function () {
  const L = window.LINGUA, st = L.store.get("__settings", null);
  L.settings = st || { lessons: null, theme: "racing" };
  if (!st || !Array.isArray(st.lessons) || (L.store.get("__teacher", false) && !L.store.get("__actas", null))) return;
  const ok = new Set(st.lessons);
  L.modulos = L.modulos.map(m => ({ ...m, lecciones: m.lecciones.filter(l => ok.has(l.id)) })).filter(m => m.lecciones.length);
})();

// ── Theme: "system" (follows the device), "light" or "dark". Saved per device. ──
(function () {
  const L = window.LINGUA, root = document.documentElement;
  const mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const SUN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  const T = L.theme = {
    get: () => L.store.get("theme", "system"),
    isDark: () => { const v = T.get(); return v === "dark" || (v === "system" && !!(mq && mq.matches)); },
    set: (v) => { L.store.set("theme", v); apply(); },
    toggle: () => T.set(T.isDark() ? "light" : "dark")
  };
  function apply() {
    const v = T.get();
    if (v === "system") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", v);
    document.querySelectorAll(".theme-btn").forEach(b => {
      const d = T.isDark();
      b.innerHTML = d ? SUN : MOON;
      b.setAttribute("aria-label", d ? "Switch to light mode" : "Switch to dark mode");
      b.title = d ? "Light mode" : "Dark mode";
    });
    document.dispatchEvent(new CustomEvent("lingua:theme"));
  }
  apply();
  if (mq && mq.addEventListener) mq.addEventListener("change", () => { if (T.get() === "system") apply(); });
  // Add the sun / moon button next to the profile avatar in every top bar
  T.mount = () => {
    document.querySelectorAll(".nav-in, .pbar .tools").forEach(bar => {
      if (bar.querySelector(".theme-btn")) return;
      const b = document.createElement("button");
      b.type = "button"; b.className = "theme-btn";
      b.onclick = T.toggle;
      let ref = bar.querySelector("[data-avatar]");
      while (ref && ref.parentElement !== bar) ref = ref.parentElement;
      if (ref) bar.insertBefore(b, ref); else bar.appendChild(b);
    });
    apply();
  };
  document.addEventListener("DOMContentLoaded", T.mount);
})();

// ── Student styles: each student gets an avatar, level names and wording that match what they love ──
(function () {
  const L = window.LINGUA;
  L.THEMES = {
    racing: { label: "Racing (F1)", avatar: "helmet", part: "helmet", number: "Racing number", visor: "Visor",
      titles: ["Rookie", "Karting", "Formula 4", "Formula 3", "Formula 2", "F1 Driver", "Podium", "Race Winner", "World Champion", "Legend"],
      editor: "Design your own racing helmet, or use your initial. Level up to unlock more designs.",
      season: { title: "Your season", aria: "the course as a race track", move: "Pass a lesson (80%+) to move your helmet forward.", done: "Season complete!", unit: "checkpoints" },
      lap: { first: "Your first lap time!", again: "Race again" },
      badges: { first: "First lap", perfect: "Perfect lap", podium: "Podium", champion: "World champion", pole: "Pole position", mechanic: "Mechanic", level5: "Formula 2" } },
    music: { label: "Music (guitar)", avatar: "guitar", part: "guitar", number: null, visor: "Pickguard",
      titles: ["Bedroom Player", "Busker", "Open Mic", "Garage Band", "Opening Act", "Club Gig", "Studio Session", "Headliner", "Arena Tour", "Legend"],
      editor: "Design your own guitar, or use your initial. Level up to unlock more designs.",
      season: { title: "Your tour", aria: "the course as a concert tour", move: "Pass a lesson (80%+) to play the next show.", done: "Tour complete!", unit: "shows" },
      lap: { first: "Your first record!", again: "Play again" },
      badges: { first: "Sound check", perfect: "Perfect pitch", podium: "Top 3 hits", champion: "Platinum album", pole: "Fast fingers", mechanic: "Tuned up", level5: "Opening act" } },
    cinema: { label: "Cinema (film)", avatar: "clapper", part: "clapperboard", number: "Take number", visor: null,
      titles: ["Film Buff", "Extra", "Script Reader", "Camera Assistant", "Editor", "Screenwriter", "Cinematographer", "Director", "Festival Winner", "Auteur"],
      editor: "Design your own clapperboard, or use your initial. Level up to unlock more designs.",
      season: { title: "Your filmography", aria: "the course as a film shoot", move: "Pass a lesson (80%+) to wrap the next scene.", done: "That’s a wrap!", unit: "scenes" },
      lap: { first: "Your first take!", again: "Another take" },
      badges: { first: "Action!", perfect: "Perfect take", podium: "Trilogy", champion: "Best picture", pole: "Quick cut", mechanic: "Final cut", level5: "In the editing room" } },
    riding: { label: "Horse riding", avatar: "riding", part: "riding helmet", number: "Competitor number", visor: null,
      titles: ["Groom", "Walk", "Trot", "Canter", "Gallop", "Cross-country", "Show Jumper", "Dressage Rider", "Grand Prix", "Champion"],
      editor: "Design your own riding helmet, or use your initial. Level up to unlock more designs.",
      season: { title: "Your course", aria: "the course as a show-jumping course", move: "Pass a lesson (80%+) to clear the next jump.", done: "Clear round!", unit: "jumps" },
      lap: { first: "Your first round!", again: "Ride again" },
      badges: { first: "First ride", perfect: "Clear round", podium: "Three ribbons", champion: "Grand Prix", pole: "Fastest round", mechanic: "Well groomed", level5: "Gallop" } },
    career: { label: "Social & career", avatar: "briefcase", part: "briefcase", number: null, visor: "Clasp",
      titles: ["Newcomer", "Intern", "Junior", "Associate", "Analyst", "Specialist", "Senior", "Team Lead", "Manager", "Director"],
      editor: "Design your own briefcase, or use your initial. Level up to unlock more designs.",
      season: { title: "Your career path", aria: "the course as a career path", move: "Pass a lesson (80%+) to reach the next milestone.", done: "Path complete!", unit: "milestones" },
      lap: { first: "Your first time!", again: "Try again" },
      badges: { first: "First day", perfect: "Flawless", podium: "Three wins", champion: "Promotion", pole: "Fast learner", mechanic: "Problem solver", level5: "Analyst" } }
  };
  L.themeOf = key => L.THEMES[key] || L.THEMES.racing;
  L.style = L.themeOf(L.settings && L.settings.theme);
})();
