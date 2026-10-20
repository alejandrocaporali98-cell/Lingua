// Lingua avatar: a customizable racing helmet (or a simple initial).
// Saved as the synced key "avatar": { style, shell, accent, design, visor, number, bg }
(function () {
  const L = window.LINGUA;
  const A = L.avatar = {};

  A.SHELLS = { white: "#f2f3f6", black: "#1b1f2a", red: "#d7263d", blue: "#2346d0", teal: "#0f766e", orange: "#f97316", yellow: "#f5c518", purple: "#6d3fd6", pink: "#e84a8a", green: "#15803d", silver: "#a3aab6", gold: "#c9a227" };
  A.BGS = { sky: "#dbe6ff", mint: "#d5f2e6", sand: "#fbe8cc", rose: "#fbdbe5", lilac: "#e7defb", fog: "#e6e9ef", night: "#1b1f2a", track: "#3a4150" };
  A.VISORS = {
    smoke: { a: "#2b313f", b: "#0d1017", label: "Smoke" },
    blue: { a: "#4fd1ff", b: "#2346d0", label: "Iridium blue" },
    gold: { a: "#ffe08a", b: "#c27c0e", label: "Gold" },
    fire: { a: "#ffb347", b: "#d7263d", label: "Fire" },
    clear: { a: "#e9f3ff", b: "#9fb3cc", label: "Clear" }
  };
  A.DESIGNS = { clean: "Clean", stripes: "Stripes", chevron: "Chevron", split: "Split", checker: "Checker", bolt: "Bolt", dots: "Dots", halo: "Halo" };
  A.DEFAULT = { style: "helmet", shell: "blue", accent: "yellow", design: "stripes", visor: "smoke", number: 7, bg: "sky" };

  // Locked parts (by level) are skipped by "Surprise me"
  const open = (kind, k) => !(L.game && L.game.needs(kind, k));
  const pick = (o, kind) => { const k = Object.keys(o).filter(x => !kind || open(kind, x)); return k[Math.floor(Math.random() * k.length)]; };
  A.random = () => {
    const shell = pick(A.SHELLS, "shell"); let accent = pick(A.SHELLS, "accent");
    while (accent === shell) accent = pick(A.SHELLS, "accent");
    return { style: "helmet", shell, accent, design: pick(A.DESIGNS, "design"), visor: pick(A.VISORS, "visor"), number: Math.floor(Math.random() * 99) + 1, bg: pick(A.BGS) };
  };
  A.get = () => ({ ...A.DEFAULT, ...(L.store.get("avatar", null) || {}) });
  A.has = () => !!L.store.get("avatar", null);

  // Readable ink for a fill color
  function ink(hex) {
    const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 160 ? "#1b1f2a" : "#ffffff";
  }
  let uid = 0;

  // Other avatar shapes (one per student style). Designs are drawn for the helmet (x 18–88, y 19–79)
  // and stretched onto each shape's own box, then clipped to its main shape.
  const fit = (x0, y0, x1, y1) => `translate(${x0} ${y0}) scale(${((x1 - x0) / 70).toFixed(3)} ${((y1 - y0) / 60).toFixed(3)}) translate(-18 -19)`;
  const defs = (c, main) => `<defs><clipPath id="${c.id}c"><path d="${main}"/></clipPath>
      <linearGradient id="${c.id}v" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.vis.a}"/><stop offset="1" stop-color="${c.vis.b}"/></linearGradient>
      <linearGradient id="${c.id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient></defs>`;
  const skin = (c, main, box) => `<path d="${main}" fill="${c.shell}"/><g clip-path="url(#${c.id}c)"><g transform="${fit(...box)}">${c.designs[c.cfg.design] || ""}</g><path d="${main}" fill="url(#${c.id}s)"/></g>`;
  const edge = main => `<path d="${main}" fill="none" stroke="#1b1f2a" stroke-opacity=".2" stroke-width="1.2"/>`;
  const FONT = 'font-family="Plus Jakarta Sans, Segoe UI, sans-serif" font-weight="800"';
  const OTHER = {
    guitar(c) {
      const body = "M30 45 C22 43 15 50 18 59 C20 64 17 69 19 75 C22 84 33 88 42 84 C48 81 52 84 58 82 C67 79 69 70 63 64 C59 60 61 54 57 50 C53 46 47 49 42 48 C37 47 35 46 30 45 Z";
      return `<circle cx="50" cy="50" r="50" fill="${c.bg}"/>${defs(c, body)}
        <ellipse cx="44" cy="90" rx="26" ry="3.5" fill="#000" opacity=".12"/>
        <path d="M47 58 L53 64 L85 26 L80 21 Z" fill="#8a5a2b"/><path d="M49 60 L52 63 L83 25 L80 22 Z" fill="#5b3a1a"/>
        ${[0, 1, 2, 3, 4].map(i => { const x = 56 + i * 5.4, y = 54 - i * 6.3; return `<path d="M${x - 2.4} ${y - 2.2} L${x + 2.4} ${y + 2.2}" stroke="#d9c7a0" stroke-width=".8"/>`; }).join("")}
        <path d="M79 22 L85 11 C87 8 91 8 92 11 L90 18 L84 27 Z" fill="#1b1f2a"/>
        ${[[85, 12], [87.5, 15], [89.5, 18]].map(([x, y]) => `<circle cx="${x + 3}" cy="${y - 2}" r="1.6" fill="#c9ccd3"/>`).join("")}
        ${skin(c, body, [15, 43, 69, 88])}
        <path d="M33 58 C28 62 28 71 33 75 C38 79 47 78 50 73 L45 63 C42 60 37 56 33 58 Z" fill="url(#${c.id}v)" opacity=".95"/>
        <rect x="40" y="60" width="13" height="3.6" rx="1" fill="#1b1f2a" transform="rotate(-48 46 62)"/>
        <rect x="34" y="66" width="13" height="3.6" rx="1" fill="#1b1f2a" transform="rotate(-48 40 68)"/>
        <rect x="30" y="74" width="12" height="3" rx="1" fill="#3a3f4b" transform="rotate(-48 36 75)"/>
        ${[-1.6, 0, 1.6].map(d => `<path d="M${35 + d} ${76 + d} L${83 + d} ${22 + d}" stroke="#fff" stroke-opacity=".7" stroke-width=".5"/>`).join("")}
        <circle cx="55" cy="76" r="2.4" fill="${c.acc}" stroke="#1b1f2a" stroke-opacity=".3"/><circle cx="60" cy="71" r="2.4" fill="${c.acc}" stroke="#1b1f2a" stroke-opacity=".3"/>
        ${edge(body)}`;
    },
    clapper(c) {
      const board = "M22 46 H78 Q82 46 82 50 V80 Q82 84 78 84 H22 Q18 84 18 80 V50 Q18 46 22 46 Z";
      const stripes = (y) => [0, 1, 2, 3, 4].map(i => `<path d="M${22 + i * 13} ${y} L${30 + i * 13} ${y} L${26 + i * 13} ${y + 8} L${18 + i * 13} ${y + 8} Z" fill="${c.acc}"/>`).join("");
      return `<circle cx="50" cy="50" r="50" fill="${c.bg}"/>${defs(c, board)}
        <ellipse cx="50" cy="90" rx="30" ry="3.5" fill="#000" opacity=".12"/>
        <g transform="rotate(-14 19 37)"><rect x="18" y="29" width="64" height="8" rx="1.5" fill="#1b1f2a"/>${stripes(29)}</g>
        <rect x="18" y="38" width="64" height="8" rx="1.5" fill="#1b1f2a"/>${stripes(38)}
        <circle cx="20.5" cy="38.5" r="2.4" fill="#c9ccd3" stroke="#1b1f2a" stroke-opacity=".4"/>
        ${skin(c, board, [18, 46, 82, 84])}
        <path d="M18 60 H82 M50 60 V84 M18 71 H82" stroke="#fff" stroke-opacity=".65" stroke-width="1"/>
        <text x="22" y="56" ${FONT} font-size="5.5" fill="${ink(c.shell)}" opacity=".85">SCENE</text>
        <text x="24" y="67.5" ${FONT} font-size="6" fill="${ink(c.shell)}" opacity=".8">ROLL</text>
        <text x="54" y="67.5" ${FONT} font-size="6" fill="${ink(c.shell)}" opacity=".8">TAKE</text>
        <text x="66" y="81" text-anchor="middle" ${FONT} font-size="11" fill="${ink(c.shell)}">${c.num}</text>
        <text x="34" y="81" text-anchor="middle" ${FONT} font-size="11" fill="${ink(c.shell)}">1</text>
        ${edge(board)}`;
    },
    riding(c) {
      const dome = "M20 64 C18 40 34 24 54 24 C74 24 86 40 86 60 C86 64 84 66 80 66 L24 66 C21 66 20 65 20 64 Z";
      return `<circle cx="50" cy="50" r="50" fill="${c.bg}"/>${defs(c, dome)}
        <ellipse cx="54" cy="88" rx="30" ry="3.5" fill="#000" opacity=".12"/>
        <path d="M30 65 C29 74 33 81 41 84" fill="none" stroke="#1b1f2a" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M56 65 C56 74 50 81 41 84" fill="none" stroke="#1b1f2a" stroke-width="2.4" stroke-linecap="round"/>
        <rect x="38" y="81" width="6" height="5" rx="1.2" fill="#c9ccd3" stroke="#1b1f2a" stroke-opacity=".4"/>
        ${skin(c, dome, [18, 24, 86, 66])}
        <path d="M34 34 C42 28 52 26 62 27" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/>
        <rect x="20" y="61" width="66" height="5" rx="2" fill="#1b1f2a" opacity=".85"/>
        <path d="M72 60 C80 59 91 60 96 65 C92 68 83 68 74 66 Z" fill="#1b1f2a"/>
        <circle cx="54" cy="24.5" r="3.2" fill="${c.acc}" stroke="#1b1f2a" stroke-opacity=".25"/>
        ${c.cfg.number != null ? `<circle cx="36" cy="49" r="8" fill="#fff" stroke="#1b1f2a" stroke-opacity=".15"/><text x="36" y="49" dy=".36em" text-anchor="middle" ${FONT} font-size="${c.num.length > 1 ? 8.5 : 10}" fill="#1b1f2a">${c.num}</text>` : ""}
        ${edge(dome)}`;
    },
    briefcase(c) {
      const body = "M22 38 H78 Q84 38 84 44 V76 Q84 82 78 82 H22 Q16 82 16 76 V44 Q16 38 22 38 Z";
      return `<circle cx="50" cy="50" r="50" fill="${c.bg}"/>${defs(c, body)}
        <ellipse cx="50" cy="88" rx="32" ry="3.5" fill="#000" opacity=".12"/>
        <path d="M38 38 V31 Q38 26 43 26 H57 Q62 26 62 31 V38" fill="none" stroke="#1b1f2a" stroke-width="4.5" stroke-linejoin="round"/>
        ${skin(c, body, [16, 38, 84, 82])}
        <path d="M16 54 H84" stroke="#000" stroke-opacity=".22" stroke-width="1.4"/>
        <rect x="20.5" y="42.5" width="59" height="35" rx="3.5" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width=".9" stroke-dasharray="2 2"/>
        <rect x="43" y="49" width="14" height="10" rx="2.2" fill="url(#${c.id}v)" stroke="#1b1f2a" stroke-opacity=".35"/>
        <circle cx="50" cy="54" r="1.4" fill="#1b1f2a" opacity=".7"/>
        <rect x="24" y="78" width="8" height="5" rx="1.5" fill="#1b1f2a" opacity=".7"/><rect x="68" y="78" width="8" height="5" rx="1.5" fill="#1b1f2a" opacity=".7"/>
        ${edge(body)}`;
    }
  };

  // Helmet in profile, facing right. viewBox 0 0 100 100.
  A.svg = function (cfg, size, opts) {
    cfg = { ...A.DEFAULT, ...(cfg || {}) };
    opts = opts || {};
    const id = "hv" + (++uid) + Math.random().toString(36).slice(2, 6);
    const bg = A.BGS[cfg.bg] || A.BGS.sky, shell = A.SHELLS[cfg.shell] || A.SHELLS.blue, acc = A.SHELLS[cfg.accent] || A.SHELLS.yellow;
    const vis = A.VISORS[cfg.visor] || A.VISORS.smoke;
    const num = String(Math.max(0, Math.min(99, parseInt(cfg.number, 10) || 0)));
    const shellPath = "M18 63 C16 37 34 19 57 19 C76 19 87 33 88 50 L88 61 C88 67 84 71 78 71 L67 71 L63 79 L30 79 C23 79 18 73 18 63 Z";
    const designs = {
      clean: "",
      stripes: `<rect x="10" y="33" width="90" height="5" fill="${acc}"/><rect x="10" y="41" width="90" height="2.6" fill="${acc}"/>`,
      chevron: `<path d="M8 30 L46 52 L8 74 L8 64 L30 52 L8 40 Z" fill="${acc}"/>`,
      split: `<path d="M8 8 L100 8 L100 44 C70 40 40 48 8 62 Z" fill="${acc}"/>`,
      checker: (() => { let s = ""; for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) if ((r + c) % 2 === 0) s += `<rect x="${20 + c * 7}" y="${18 + r * 7}" width="7" height="7" fill="${acc}"/>`; return s; })(),
      bolt: `<path d="M44 20 L30 50 L42 50 L34 76 L60 42 L47 42 L56 20 Z" fill="${acc}"/>`,
      dots: [[30, 34], [40, 28], [26, 46], [38, 44], [50, 36], [32, 58], [46, 56]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 2.6 : 3.6}" fill="${acc}"/>`).join(""),
      halo: `<path d="M14 58 C18 30 40 16 62 18 L66 24 C44 24 28 36 24 60 Z" fill="${acc}"/>`
    };
    const numInk = ink(shell === acc ? shell : shell);
    const kind = opts.kind || (L.style && L.style.avatar) || "helmet";
    if (cfg.style !== "initial" && kind !== "helmet" && OTHER[kind]) {
      const o = OTHER[kind]({ id, bg, shell, acc, vis, num, designs, cfg });
      return `<svg class="av-svg" width="${size}" height="${size}" viewBox="0 0 100 100" role="img" aria-label="${opts.label || "Avatar"}" style="display:block;border-radius:50%">${o}</svg>`;
    }
    const body = cfg.style === "initial"
      ? `<circle cx="50" cy="50" r="50" fill="${opts.initialBg || bg}"/><text x="50" y="50" dy=".35em" text-anchor="middle" font-family="Plus Jakarta Sans, Segoe UI, sans-serif" font-weight="800" font-size="46" fill="${ink(opts.initialBg || bg)}">${(opts.initial || "?").toUpperCase()}</text>`
      : `<circle cx="50" cy="50" r="50" fill="${bg}"/>
        <defs>
          <clipPath id="${id}c"><path d="${shellPath}"/></clipPath>
          <linearGradient id="${id}v" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${vis.a}"/><stop offset="1" stop-color="${vis.b}"/></linearGradient>
          <linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>
        </defs>
        <ellipse cx="52" cy="84" rx="30" ry="4" fill="#000" opacity=".12"/>
        <path d="${shellPath}" fill="${shell}"/>
        <g clip-path="url(#${id}c)">${designs[cfg.design] || ""}<path d="${shellPath}" fill="url(#${id}s)"/></g>
        <path d="M51 38 L86 38 C88 43 88 50 87 55 L57 55 C52 55 49 51 49 46 C49 41 49 38 51 38 Z" fill="url(#${id}v)"/>
        <path d="M58 41 L80 41" stroke="#fff" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>
        <rect x="30" y="72" width="34" height="5" rx="2" fill="#1b1f2a" opacity=".8"/>
        <circle cx="31" cy="60" r="8.5" fill="#fff" stroke="#1b1f2a" stroke-opacity=".15"/>
        <text x="31" y="60" dy=".36em" text-anchor="middle" font-family="Plus Jakarta Sans, Segoe UI, sans-serif" font-weight="800" font-size="${num.length > 1 ? 9 : 10.5}" fill="#1b1f2a">${num}</text>
        <path d="${shellPath}" fill="none" stroke="#1b1f2a" stroke-opacity=".18" stroke-width="1.2"/>`;
    return `<svg class="av-svg" width="${size}" height="${size}" viewBox="0 0 100 100" role="img" aria-label="${opts.label || "Avatar"}" style="display:block;border-radius:50%">${body}</svg>`;
  };

  // Avatar for the current student (helmet if they made one, else their initial)
  A.mine = function (size) {
    const p = L.profile || L.store.get("profileLocal", {}) || {};
    const name = (p.display_name || "").trim();
    if (A.has()) {
      const cfg = A.get();
      return A.svg(cfg, size, { initial: name[0] || "?", initialBg: p.avatar_color, label: name ? name + "’s avatar" : "Your avatar" });
    }
    return null;
  };
})();
