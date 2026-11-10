// Lingua garage: in the racing style, passing a lesson (80%+) unlocks a car.
// Each car's spec card is written with the English of the lesson that unlocks it.
// Cars are original designs (no real brands or models). To add one, add an entry to CARS
// with the lesson id; the profile shows it as soon as that lesson is assigned.
(function () {
  const L = window.LINGUA;

  // Side-view shapes, drawn in a 320 × 120 box with the ground at y = 100.
  const SHAPES = {
    hatch: {
      wheels: [[92, 88, 17], [226, 88, 17]],
      body: "M50 86 L50 74 Q51 65 64 63 L118 57 L150 35 Q154 32 160 32 L222 31 Q234 31 239 38 L260 62 Q265 66 265 74 L265 82 Q265 89 257 89 L57 89 Q50 89 50 86 Z",
      glass: ["M124 57 L152 38 L184 37 L184 57 Z", "M190 37 L221 36 Q229 36 233 42 L246 57 L190 57 Z"],
      stripe: "M40 71 L280 69 L280 75 L40 77 Z",
      lines: "M187 37 L187 86 M248 60 L250 84",
      head: "M51 68 L66 66 L66 71 L51 72 Z", tail: "M258 64 L265 66 L265 74 L259 74 Z",
      extra: ""
    },
    coupe: {
      wheels: [[82, 89, 18], [244, 89, 18]],
      body: "M30 86 L30 76 Q32 68 46 66 L122 60 Q150 42 178 37 L214 36 Q240 38 262 55 L286 61 Q292 63 292 71 L292 86 Q292 92 284 92 L36 92 Q30 92 30 86 Z",
      glass: ["M134 59 Q156 44 178 40 L196 40 L196 59 Z", "M202 40 L214 40 Q234 42 250 59 L202 59 Z"],
      stripe: "M32 74 L290 70 L290 74 L32 78 Z",
      lines: "M199 40 L199 88",
      head: "M31 70 L52 68 L52 72 L31 74 Z", tail: "M284 62 L292 64 L292 70 L285 70 Z",
      extra: "M268 56 L292 52 L292 58 L270 60 Z"
    },
    rally: {
      wheels: [[90, 88, 19], [234, 88, 19]],
      body: "M42 82 L42 70 Q44 60 60 58 L116 52 L148 30 Q152 28 158 28 L222 27 Q236 27 242 35 L266 58 Q270 62 270 70 L270 80 Q270 86 262 86 L48 86 Q42 86 42 82 Z",
      glass: ["M122 52 L150 33 L184 32 L184 52 Z", "M190 32 L221 31 Q229 31 234 37 L248 52 L190 52 Z"],
      stripe: "M44 64 L268 60 L268 68 L44 72 Z",
      lines: "M187 32 L187 84",
      head: "M43 64 L58 62 L58 67 L43 68 Z", tail: "M262 58 L270 61 L270 68 L263 68 Z",
      extra: "M244 29 L274 26 L274 32 L246 35 Z M258 33 L258 40 M166 27 L190 27 L188 22 L170 22 Z M108 86 L114 86 L114 100 L108 100 Z M252 86 L258 86 L258 100 L252 100 Z",
      lamps: [[62, 54, 4.5], [74, 53, 4.5], [86, 52, 4.5]], pod: "M56 58 L92 55"
    },
    drift: {
      wheels: [[80, 89, 18], [246, 89, 18]],
      body: "M26 84 L26 74 Q28 66 42 64 L114 60 L148 39 Q152 37 158 37 L208 36 Q214 36 218 40 L238 54 L282 58 Q292 60 292 68 L292 84 Q292 90 284 90 L32 90 Q26 90 26 84 Z",
      glass: ["M122 60 L150 41 L178 40 L178 60 Z", "M184 40 L206 40 L228 57 L184 57 Z"],
      stripe: "M0 0 L130 0 L118 120 L0 120 Z",
      lines: "M181 40 L181 86",
      head: "M27 69 L44 67 L44 71 L27 72 Z", tail: "M284 59 L292 61 L292 67 L285 67 Z",
      extra: "M244 36 L294 31 L294 38 L246 42 Z M258 41 L256 57 M282 38 L282 58 M24 86 L44 86 L44 90 L24 90 Z"
    },
    classic: {
      wheels: [[78, 88, 17], [240, 88, 17]],
      body: "M24 84 L24 72 Q26 58 48 56 Q90 52 128 52 Q150 34 176 32 L204 32 Q226 34 244 50 Q276 54 292 62 Q296 70 294 84 Q292 90 284 90 L30 90 Q24 90 24 84 Z",
      glass: ["M136 52 Q154 38 174 36 L184 36 L184 52 Z", "M190 36 L204 36 Q220 38 234 52 L190 52 Z"],
      stripe: "M0 0 L56 0 L56 120 L0 120 Z",
      lines: "M187 36 L187 86",
      head: "", tail: "M284 62 L293 66 L293 72 L286 72 Z",
      extra: "", roundel: [152, 70, 12], headlamp: [34, 63, 6]
    },
    hyper: {
      wheels: [[80, 89, 18], [238, 89, 18]],
      body: "M22 86 L24 78 Q28 70 52 68 L118 62 Q148 42 178 38 L210 39 Q234 43 254 56 L290 60 Q298 62 298 72 L296 86 Q294 91 286 91 L28 91 Q22 91 22 86 Z",
      glass: ["M130 61 Q154 44 178 41 L200 42 Q186 52 176 61 Z"],
      stripe: "M24 82 L296 80 L296 91 L24 91 Z",
      lines: "M200 42 L254 55", vent: "M190 64 Q210 60 222 70 L196 72 Z",
      head: "M25 75 L54 70 L54 73 L26 78 Z", tail: "M288 62 L298 64 L298 68 L289 68 Z",
      extra: "M262 50 L300 46 L300 52 L264 55 Z M272 53 L272 60 M290 51 L290 61"
    }
  };

  // Spec cards are at Emiliano's level and use each lesson's grammar.
  const CARS = {
    "01": { name: "Street Hatch", kind: "Hatchback", shape: "hatch", body: "#f3f3f1", accent: "#d32f2f", num: "01",
      hp: 120, top: 190, zero: 9.5, about: "Hi! This is my first car. It's a small hatchback. It's white and red, and it's from Japan.",
      learned: "Introduce yourself" },
    "02": { name: "Turbo Coupe", kind: "Sports coupe", shape: "coupe", body: "#1f3b6e", accent: "#c9ced6", num: "02",
      hp: 280, top: 250, zero: 5.6, about: "My coupe has a turbo engine. It has two doors and 280 horsepower. It's dark blue with a silver stripe.",
      learned: "have / has · colors · big numbers" },
    "03": { name: "Rally Car", kind: "Rally car", shape: "rally", body: "#f5f5f2", accent: "#e86a10", num: "03",
      hp: 380, top: 200, zero: 3.9, about: "The rally starts at seven o'clock. Every morning, the team checks the tyres. This car drives on dirt, gravel and snow.",
      learned: "Daily routine · telling the time" },
    "04": { name: "Drift Car", kind: "Drift car", shape: "drift", body: "#f2b705", accent: "#1b1d22", num: "04",
      hp: 400, top: 240, zero: 4.5, about: "I love this car because it drifts like in my favourite anime. I can't stand slow corners!",
      learned: "Giving your opinion" },
    "05": { name: "Classic Racer", kind: "Classic race car", shape: "classic", body: "#1f5a3d", accent: "#f3f1ea", num: "05",
      hp: 300, top: 270, zero: 6.0, about: "This car raced in 1968. It won three races, and it finished second in a 24-hour race.",
      learned: "The past simple" },
    "06": { name: "Hypercar", kind: "Hypercar", shape: "hyper", body: "#e8590c", accent: "#17191d", num: "06",
      hp: 1000, top: 350, zero: 2.4, about: "It's faster than the rally car and lighter than the classic racer. It's the fastest car in my garage!",
      learned: "Comparing: faster, the fastest" },
    "07": { name: "GT Racer", kind: "GT race car", shape: "coupe", body: "#c2410c", accent: "#f5f5f2", num: "07",
      hp: 550, top: 290, zero: 3.2, about: "It can go 290 km/h, and its crew can change four tyres in seconds. But it can't go fast in the pit lane!",
      learned: "can / can't" }
  };
  const MAX = { hp: 1000, top: 350 };

  function wheel([x, y, r], sil) {
    if (sil) return `<circle cx="${x}" cy="${y}" r="${r + 3}" fill="currentColor"/>`;
    const sp = [0, 72, 144, 216, 288].map(a => { const t = a * Math.PI / 180; return `M${x} ${y} L${(x + Math.cos(t) * r * .58).toFixed(1)} ${(y + Math.sin(t) * r * .58).toFixed(1)}`; }).join(" ");
    return `<circle cx="${x}" cy="${y}" r="${r + 3}" fill="#0e0f12"/><circle cx="${x}" cy="${y}" r="${r}" fill="#1d1f24"/>` +
      `<circle cx="${x}" cy="${y}" r="${r * .66}" fill="#b9bfc8"/><path d="${sp}" stroke="#6b717b" stroke-width="2.6" stroke-linecap="round"/>` +
      `<circle cx="${x}" cy="${y}" r="${r * .18}" fill="#4a4f57"/>`;
  }

  // opts.locked draws a silhouette in currentColor
  function svg(car, opts) {
    opts = opts || {};
    const s = SHAPES[car.shape], sil = !!opts.locked, id = "g" + car.num + (sil ? "s" : "") + Math.random().toString(36).slice(2, 6);
    const shadow = `<ellipse cx="160" cy="104" rx="${sil ? 120 : 132}" ry="6" fill="#000" opacity="${sil ? .18 : .32}"/>`;
    if (sil) return `<svg viewBox="0 0 320 112" class="car-svg" role="img" aria-label="Locked car">${shadow}<path d="${s.body}" fill="currentColor"/>${s.extra ? `<path d="${s.extra}" fill="currentColor" stroke="currentColor" stroke-width="3"/>` : ""}${s.wheels.map(w => wheel(w, true)).join("")}</svg>`;
    return `<svg viewBox="0 0 320 112" class="car-svg" role="img" aria-label="${L.esc(car.name)}">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient></defs>
      ${shadow}
      ${s.extra ? `<path d="${s.extra}" fill="${car.accent}" stroke="${car.accent}" stroke-width="3" stroke-linejoin="round"/>` : ""}
      <clipPath id="${id}c"><path d="${s.body}"/></clipPath>
      <path d="${s.body}" fill="${car.body}"/>
      <g clip-path="url(#${id}c)"><path d="${s.stripe}" fill="${car.accent}"/><rect x="0" y="${s.wheels[0][1] - 1}" width="320" height="20" fill="#16181c" opacity=".85"/>
        ${s.vent ? `<path d="${s.vent}" fill="#16181c"/>` : ""}</g>
      <path d="${s.body}" fill="url(#${id})"/>
      ${s.glass.map(g => `<path d="${g}" fill="#20262f"/><path d="${g}" fill="#9fb3c8" opacity=".22"/>`).join("")}
      <path d="${s.lines}" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="1.4"/>
      ${s.head ? `<path d="${s.head}" fill="#fff7d6"/>` : ""}${s.tail ? `<path d="${s.tail}" fill="#d0202a"/>` : ""}
      ${s.headlamp ? `<circle cx="${s.headlamp[0]}" cy="${s.headlamp[1]}" r="${s.headlamp[2]}" fill="#fff7d6" stroke="#000" stroke-opacity=".3"/>` : ""}
      ${s.pod ? `<path d="${s.pod}" stroke="#1b1d22" stroke-width="3"/>` : ""}
      ${s.lamps ? s.lamps.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff7d6" stroke="#1b1d22" stroke-width="1.6"/>`).join("") : ""}
      ${s.roundel ? `<circle cx="${s.roundel[0]}" cy="${s.roundel[1]}" r="${s.roundel[2]}" fill="${car.accent}"/><text x="${s.roundel[0]}" y="${s.roundel[1] + 4.5}" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="800" font-size="13" fill="#1b1d22">${car.num}</text>` : ""}
      ${car.shape === "rally" || car.shape === "drift" ? `<rect x="138" y="${car.shape === "rally" ? 70 : 72}" width="30" height="14" rx="3" fill="#fff"/><text x="153" y="${car.shape === "rally" ? 81 : 83}" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="800" font-size="11" fill="#1b1d22">${car.num}</text>` : ""}
      ${s.wheels.map(w => wheel(w)).join("")}
    </svg>`;
  }

  // Lessons this student can see that have a car, in order
  function list() {
    const ls = L.modulos.flatMap(m => m.lecciones).filter(l => CARS[l.id] && l.estado === "lista");
    return ls.map(l => ({ ...CARS[l.id], lesson: l, unlocked: !!L.store.get("diploma." + l.id, null), at: (L.store.get("diploma." + l.id, null) || {}).at }));
  }
  const seen = () => L.store.get("garage.seen", []) || [];
  const markSeen = id => { const s = seen(); if (!s.includes(id)) { s.push(id); L.store.set("garage.seen", s); } };
  const on = () => (L.style && L.style.reward) === "garage";

  L.garage = { CARS, SHAPES, MAX, svg, list, seen, markSeen, on, car: id => CARS[id] || null };
})();
