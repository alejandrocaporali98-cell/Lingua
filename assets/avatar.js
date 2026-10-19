// Lingua avatar: a customizable racing helmet (or a simple initial).
// Saved as the synced key "avatar": { style, shell, accent, design, visor, number, bg }
(function () {
  const L = window.LINGUA;
  const A = L.avatar = {};

  A.SHELLS = { white: "#f2f3f6", black: "#1b1f2a", red: "#d7263d", blue: "#2346d0", teal: "#0f766e", orange: "#f97316", yellow: "#f5c518", purple: "#6d3fd6", pink: "#e84a8a", green: "#15803d", silver: "#a3aab6" };
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

  const pick = (o) => { const k = Object.keys(o); return k[Math.floor(Math.random() * k.length)]; };
  A.random = () => {
    const shell = pick(A.SHELLS); let accent = pick(A.SHELLS);
    while (accent === shell) accent = pick(A.SHELLS);
    return { style: "helmet", shell, accent, design: pick(A.DESIGNS), visor: pick(A.VISORS), number: Math.floor(Math.random() * 99) + 1, bg: pick(A.BGS) };
  };
  A.get = () => ({ ...A.DEFAULT, ...(L.store.get("avatar", null) || {}) });
  A.has = () => !!L.store.get("avatar", null);

  // Readable ink for a fill color
  function ink(hex) {
    const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 160 ? "#1b1f2a" : "#ffffff";
  }
  let uid = 0;

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
