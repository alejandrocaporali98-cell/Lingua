// Lingua engine: pronunciation audio, sounds, confetti, toasts, XP / streak / weekly goal,
// avatar unlocks and the review list. Loaded on every page after config.js.
(function () {
  const L = window.LINGUA, S = L.store;
  const reduced = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  L.esc = esc;

  // ── Pronunciation (the browser's own voices) ──
  const synth = window.speechSynthesis;
  L.canSpeak = !!(synth && window.SpeechSynthesisUtterance);
  function pickVoice() {
    if (!L.canSpeak) return null;
    const want = S.get("voice", "en-US"), vs = synth.getVoices();
    const lang = v => (v.lang || "").replace("_", "-");
    const fav = ["Samantha", "Google US English", "Microsoft Aria", "Microsoft Jenny", "Daniel", "Google UK English Female", "Microsoft Sonia"];
    const same = vs.filter(v => lang(v) === want);
    return same.find(v => fav.some(f => v.name.indexOf(f) >= 0)) || same.find(v => v.localService) || same[0]
      || vs.find(v => lang(v).indexOf("en") === 0) || null;
  }
  L.say = function (text) {
    if (!L.canSpeak || !text) return;
    const t = String(text).replace(/<[^>]+>/g, " ").replace(/_{2,}/g, " … ").replace(/[\u{1F000}-\u{1FAFF}☀-➿]/gu, "").replace(/\s+/g, " ").trim();
    synth.cancel();
    const u = new SpeechSynthesisUtterance(t);
    const v = pickVoice(); if (v) u.voice = v;
    u.lang = (v && v.lang) || S.get("voice", "en-US");
    u.rate = S.get("voiceRate", 0.92);
    synth.speak(u);
  };
  if (L.canSpeak && synth.onvoiceschanged !== undefined) synth.onvoiceschanged = () => {};
  const SPK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
  L.sayBtn = (text, label) => L.canSpeak ? `<button type="button" class="say" data-say="${esc(text)}" aria-label="${esc(label || "Listen")}" title="Listen">${SPK}</button>` : "";
  document.addEventListener("click", e => {
    const b = e.target.closest && e.target.closest("[data-say]");
    if (!b) return;
    e.preventDefault();
    L.say(b.getAttribute("data-say"));
    b.classList.remove("talk"); void b.offsetWidth; b.classList.add("talk");
  });

  // ── Sounds (generated, no files) ──
  let ac = null;
  function tone(freq, start, dur, type, vol) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(freq, ac.currentTime + start);
    g.gain.setValueAtTime(0.0001, ac.currentTime + start);
    g.gain.exponentialRampToValueAtTime(vol || 0.08, ac.currentTime + start + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
    o.connect(g).connect(ac.destination); o.start(ac.currentTime + start); o.stop(ac.currentTime + start + dur + 0.02);
  }
  L.sfx = function (kind) {
    if (!S.get("sounds", true)) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === "suspended") ac.resume();
      if (kind === "ok") { tone(660, 0, .1); tone(990, .08, .16); }
      else if (kind === "bad") { tone(240, 0, .18, "triangle", .07); tone(190, .1, .22, "triangle", .06); }
      else if (kind === "pop") { tone(880, 0, .08, "sine", .05); }
      else if (kind === "win") { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * .09, .22, "triangle", .07)); }
      else if (kind === "level") { [392, 523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * .08, .26, "triangle", .07)); }
    } catch (e) {}
  };

  // ── Toasts and confetti ──
  L.toast = function (html, kind) {
    const d = document.createElement("div");
    d.className = "toast pop" + (kind ? " " + kind : ""); d.setAttribute("role", "status"); d.innerHTML = html;
    document.querySelectorAll(".toast").forEach(t => t.remove());
    document.body.appendChild(d); setTimeout(() => d.remove(), kind === "big" ? 3200 : 1800);
  };
  L.confetti = function (amount) {
    if (reduced()) return;
    const c = document.createElement("canvas"), x = c.getContext("2d"), dpr = Math.min(2, window.devicePixelRatio || 1);
    c.className = "confetti"; c.width = innerWidth * dpr; c.height = innerHeight * dpr; document.body.appendChild(c);
    x.scale(dpr, dpr);
    const colors = ["#2346d0", "#f5c518", "#12754a", "#d7263d", "#6d3fd6", "#4fd1ff"];
    const n = amount || 140, ps = [];
    for (let i = 0; i < n; i++) {
      const side = i % 2 ? 1 : -1;
      ps.push({ x: side > 0 ? innerWidth * .15 : innerWidth * .85, y: innerHeight * .75, vx: -side * (3 + Math.random() * 7), vy: -(9 + Math.random() * 9),
        s: 5 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .35, c: colors[i % colors.length], shape: i % 3 });
    }
    const t0 = performance.now();
    (function frame(t) {
      const age = t - t0; x.clearRect(0, 0, innerWidth, innerHeight);
      ps.forEach(p => {
        p.vy += .32; p.vx *= .992; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.globalAlpha = Math.max(0, 1 - age / 2600); x.fillStyle = p.c;
        if (p.shape === 0) x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); else if (p.shape === 1) { x.beginPath(); x.arc(0, 0, p.s / 2.6, 0, 7); x.fill(); } else x.fillRect(-p.s / 3, -p.s / 3, p.s / 1.5, p.s / 1.5);
        x.restore();
      });
      if (age < 2600) requestAnimationFrame(frame); else c.remove();
    })(t0);
  };

  // ── XP, levels, streak, weekly goal ──
  const LEVELS = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200];
  const TITLES = ["Rookie", "Karting", "Formula 4", "Formula 3", "Formula 2", "F1 Driver", "Podium", "Race Winner", "World Champion", "Legend"];
  const pad = n => String(n).padStart(2, "0");
  const dkey = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const today = () => dkey(new Date());
  function monday(d) { const x = new Date(d); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; }
  const WEEK_GOAL = 4;

  // Works on any reader (this browser, or a student's synced data in the teacher panel)
  function stats(get) {
    const g = get("game", null) || { xp: 0, days: {} }, xp = g.xp || 0, days = g.days || {};
    let lv = 1; for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i]) lv = i + 1;
    const floor = LEVELS[lv - 1], ceil = LEVELS[lv] || null;
    // streak: consecutive days with practice, ending today (or yesterday if not yet today)
    let streak = 0; const d = new Date(); d.setHours(12, 0, 0, 0);
    if (!days[dkey(d)]) d.setDate(d.getDate() - 1);
    while (days[dkey(d)]) { streak++; d.setDate(d.getDate() - 1); }
    const m = monday(new Date()), week = [];
    for (let i = 0; i < 7; i++) { const x = new Date(m); x.setDate(m.getDate() + i); week.push({ key: dkey(x), xp: days[dkey(x)] || 0, label: "MTWTFSS"[i], today: dkey(x) === today() }); }
    const best = Math.max(streak, g.best || 0);
    let last = null; Object.keys(days).forEach(k => { if (days[k] && (!last || k > last)) last = k; });
    return { xp, level: lv, title: TITLES[lv - 1], floor, ceil, pct: ceil ? Math.round((xp - floor) / (ceil - floor) * 100) : 100,
      streak, best, week, weekDays: week.filter(w => w.xp > 0).length, goal: WEEK_GOAL, todayXp: days[today()] || 0, last };
  }
  const mine = () => stats((k, d) => S.get(k, d));

  function award(n, opt) {
    opt = opt || {};
    const g = S.get("game", null) || { xp: 0, days: {}, once: {} };
    g.days = g.days || {}; g.once = g.once || {};
    if (opt.once) { if (g.once[opt.once]) return 0; g.once[opt.once] = 1; }
    const before = stats(() => g);
    g.xp = (g.xp || 0) + n; const k = today(); g.days[k] = (g.days[k] || 0) + n;
    // keep the day log small: last 120 days
    const ks = Object.keys(g.days).sort(); while (ks.length > 120) delete g.days[ks.shift()];
    const after = stats(() => g); g.best = Math.max(g.best || 0, after.streak);
    S.set("game", g);
    if (!opt.silent && opt.label) L.toast(`<b>+${n} XP</b> ${esc(opt.label)}`, "xp");
    if (after.level > before.level) setTimeout(() => {
      L.confetti(); L.sfx("level");
      const un = unlockedAt(after.level);
      L.toast(`<b>Level up! Level ${after.level} · ${after.title}</b>${un.length ? `<span>New for your helmet: ${un.join(", ")}</span>` : ""}`, "big");
    }, opt.label ? 700 : 0);
    // weekly goal bonus, once per week
    const wk = "week." + dkey(monday(new Date()));
    if (after.weekDays >= WEEK_GOAL && !g.once[wk]) setTimeout(() => {
      award(50, { once: wk, silent: true }); L.confetti(90); L.sfx("win");
      L.toast(`<b>Weekly goal done! +50 XP</b><span>You practiced ${WEEK_GOAL} days this week.</span>`, "big");
    }, 1200);
    document.dispatchEvent(new CustomEvent("lingua:xp", { detail: after }));
    return n;
  }

  // Helmet parts unlocked by level (anything already saved on the helmet stays usable)
  const UNLOCK = {
    design: { chevron: 2, split: 3, dots: 4, checker: 5, bolt: 6, halo: 7 },
    visor: { blue: 3, fire: 5, gold: 8 },
    shell: { gold: 9 }, accent: { gold: 9 }
  };
  function unlockedAt(lv) {
    const out = [], names = { design: "design", visor: "visor", shell: "helmet color", accent: "accent" };
    Object.keys(UNLOCK).forEach(kind => Object.keys(UNLOCK[kind]).forEach(k => { if (UNLOCK[kind][k] === lv && kind !== "accent") out.push(cap(k) + " " + names[kind]); }));
    return out;
  }
  const cap = s => s[0].toUpperCase() + s.slice(1);
  function needs(kind, key) {
    const lv = (UNLOCK[kind] || {})[key] || 0;
    if (!lv) return 0;
    const av = S.get("avatar", null);
    if (av && av[kind] === key) return 0; // already on the helmet
    return mine().level >= lv ? 0 : lv;
  }

  L.game = { stats, mine, award, needs, UNLOCK, LEVELS, TITLES, today, WEEK_GOAL };

  // ── Review list: questions saved with M plus quiz mistakes ──
  function qid(lesson, p) { let h = 0; for (const ch of lesson + p) h = (h * 31 + ch.charCodeAt(0)) | 0; return lesson + "." + (h >>> 0).toString(36); }
  L.review = {
    all: () => S.get("review", {}) || {},
    list: () => Object.values(L.review.all()).sort((a, b) => (a.l + a.at).localeCompare(b.l + b.at)),
    count: () => Object.keys(L.review.all()).length,
    id: qid,
    add(q, lesson, src) {
      const all = L.review.all(), id = qid(lesson, q.p);
      const prev = all[id];
      all[id] = { id, l: lesson, p: q.p, a: q.a, w: q.w, why: q.why, src: prev && prev.src === "saved" ? "saved" : src, right: 0, at: (prev && prev.at) || new Date().toISOString() };
      S.set("review", all); return id;
    },
    remove(id) { const all = L.review.all(); delete all[id]; S.set("review", all); },
    has: (lesson, p) => !!L.review.all()[qid(lesson, p)],
    // two right answers in a row in Review = learned
    answer(id, ok) {
      const all = L.review.all(), it = all[id]; if (!it) return false;
      if (ok) { it.right = (it.right || 0) + 1; if (it.right >= 2) { delete all[id]; S.set("review", all); return true; } }
      else it.right = 0;
      S.set("review", all); return false;
    }
  };

  // ── Install as an app (PWA) ──
  L.install = { prompt: null, ios: /iphone|ipad|ipod/i.test(navigator.userAgent), standalone: (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true };
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); L.install.prompt = e; document.dispatchEvent(new CustomEvent("lingua:installable")); });
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol) && !/claude\.ai|claudeusercontent|localhost|127\.0\.0\.1/.test(location.hostname)) {
    window.addEventListener("load", () => navigator.serviceWorker.register((L.root || (/\/clases\//.test(location.pathname) ? "../" : "")) + "sw.js").catch(() => {}));
  }
})();
