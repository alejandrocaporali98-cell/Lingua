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
  const STYLE = () => L.style || { titles: ["Rookie", "Karting", "Formula 4", "Formula 3", "Formula 2", "F1 Driver", "Podium", "Race Winner", "World Champion", "Legend"], part: "helmet", badges: {} };
  const TITLES = STYLE().titles;
  const pad = n => String(n).padStart(2, "0");
  const dkey = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const today = () => dkey(new Date());
  function monday(d) { const x = new Date(d); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; }
  const WEEK_GOAL = 4;

  // Works on any reader (this browser, or a student's synced data in the teacher panel)
  function stats(get, themeKey) {
    const titles = themeKey && L.themeOf ? L.themeOf(themeKey).titles : TITLES;
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
    return { xp, level: lv, title: titles[lv - 1], floor, ceil, pct: ceil ? Math.round((xp - floor) / (ceil - floor) * 100) : 100,
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
      L.toast(`<b>Level up! Level ${after.level} · ${after.title}</b>${un.length ? `<span>New for your ${STYLE().part}: ${un.join(", ")}</span>` : ""}`, "big");
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
    const out = [], names = { design: "design", visor: (STYLE().visor || "visor").toLowerCase(), shell: "color", accent: "accent" };
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

  // ── Counters (for badges) ──
  L.count = (k, n) => { const c = S.get("counters", {}) || {}; c[k] = (c[k] || 0) + (n || 1); S.set("counters", c); L.badges && L.badges.check(); return c[k]; };

  // ── Speaking: the browser's speech recognition ──
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  L.canListen = !!SR;
  const CONTR = { "i'm": "i am", "you're": "you are", "he's": "he is", "she's": "she is", "it's": "it is", "we're": "we are", "they're": "they are",
    "don't": "do not", "doesn't": "does not", "didn't": "did not", "can't": "cannot", "can not": "cannot", "isn't": "is not", "aren't": "are not",
    "wasn't": "was not", "weren't": "were not", "what's": "what is", "that's": "that is", "there's": "there is", "let's": "let us", "i've": "i have", "i'll": "i will" };
  const NUM = { "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine", "10": "ten", "11": "eleven", "12": "twelve", "13": "thirteen", "14": "fourteen", "15": "fifteen", "16": "sixteen", "17": "seventeen", "18": "eighteen", "19": "nineteen", "20": "twenty" };
  const words = t => {
    let x = " " + String(t || "").toLowerCase().replace(/[’`]/g, "'").replace(/\([^)]*\)/g, " ").replace(/[^a-z0-9' ]+/g, " ") + " ";
    Object.keys(CONTR).forEach(k => { x = x.split(" " + k + " ").join(" " + CONTR[k] + " "); });
    return x.trim().split(/\s+/).filter(Boolean).map(w => NUM[w] || w.replace(/^'+|'+$/g, ""));
  };
  // Which words of the target did we hear (in order)? Longest common subsequence.
  L.compare = function (target, heard) {
    const raw = String(target).replace(/\([^)]*\)/g, " ").trim().split(/\s+/).filter(Boolean);
    const tw = raw.map(w => words(w)), flat = [], owner = [];
    tw.forEach((ws, i) => ws.forEach(w => { flat.push(w); owner.push(i); }));
    const hw = words(heard), n = flat.length, m = hw.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = flat[i] === hw[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const hit = new Array(n).fill(false);
    for (let i = 0, j = 0; i < n && j < m;) { if (flat[i] === hw[j]) { hit[i] = true; i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++; }
    const okWord = raw.map((_, i) => owner.every((o, k) => o !== i || hit[k]));
    const pct = n ? Math.round(hit.filter(Boolean).length / n * 100) : 0;
    return { words: raw.map((w, i) => ({ w, ok: okWord[i] })), pct };
  };
  L.listen = function (opt) {
    const r = new SR(); let final = "", done = false;
    r.lang = S.get("voice", "en-US"); r.interimResults = true; r.continuous = false; r.maxAlternatives = 3;
    r.onresult = e => {
      let interim = ""; final = "";
      for (const res of e.results) { if (res.isFinal) final += res[0].transcript + " "; else interim += res[0].transcript + " "; }
      opt.onText && opt.onText((final + interim).trim());
    };
    r.onerror = e => { if (!done) { done = true; opt.onError && opt.onError(e.error); } };
    r.onend = () => { if (!done) { done = true; opt.onEnd && opt.onEnd(final.trim()); } };
    try { if (synth) synth.cancel(); r.start(); } catch (e) { done = true; opt.onError && opt.onError("start"); }
    return { stop: () => { try { r.stop(); } catch (e) {} } };
  };
  const MIC = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
  L.micIcon = MIC;
  L.micBtn = (text, label) => L.canListen ? `<button type="button" class="say mic" data-listen="${esc(text)}" aria-label="${esc(label || "Say it")}" title="Say it">${MIC}</button>` : "";
  // "Say it" sheet: listen, then show which words were understood
  L.speak = function (target, done) {
    document.querySelectorAll(".sheet").forEach(x => x.remove());
    const el = document.createElement("div"); el.className = "sheet"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Say it");
    el.innerHTML = `<div class="sheet-scrim"></div><div class="sheet-card"><span class="eyebrow">Say it out loud</span>
      <div class="sheet-target">${esc(target)} ${L.sayBtn(target, "Listen first")}</div>
      <div class="sheet-heard" aria-live="polite"></div>
      <div class="sheet-act"><button type="button" class="btn ghost" data-x>Close</button><button type="button" class="btn primary" data-go>${MIC} Start</button></div></div>`;
    document.body.appendChild(el);
    const heard = el.querySelector(".sheet-heard"), go = el.querySelector("[data-go]");
    let rec = null;
    const close = () => { if (rec) rec.stop(); el.remove(); };
    el.querySelector("[data-x]").onclick = close; el.querySelector(".sheet-scrim").onclick = close;
    el.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    function start() {
      go.disabled = true; go.innerHTML = `<span class="rec-dot"></span> Listening…`;
      heard.innerHTML = `<span class="muted">Speak now…</span>`;
      rec = L.listen({
        onText: t => { heard.innerHTML = `<span class="muted">${esc(t)}</span>`; },
        onError: err => {
          go.disabled = false; go.innerHTML = `${MIC} Try again`;
          heard.innerHTML = `<span class="sheet-bad">${err === "not-allowed" || err === "service-not-allowed" ? "Allow the microphone for this site to use speaking practice." : err === "no-speech" ? "We didn’t hear anything. Try again a little louder." : "The microphone isn’t available right now."}</span>`;
        },
        onEnd: t => {
          go.disabled = false; go.innerHTML = `${MIC} Try again`;
          if (!t) { heard.innerHTML = `<span class="sheet-bad">We didn’t hear anything. Try again.</span>`; return; }
          const r = L.compare(target, t), good = r.pct >= 80;
          heard.innerHTML = `<div class="sheet-words">${r.words.map(w => `<span class="${w.ok ? "ok" : "miss"}">${esc(w.w)}</span>`).join(" ")}</div>
            <div class="sheet-score ${good ? "good" : ""}"><b>${r.pct}%</b> ${r.pct === 100 ? "Perfect!" : good ? "Great! Very clear." : r.pct >= 50 ? "Almost. Listen and try again." : "Listen first, then try again."}</div>
            <div class="muted" style="font-size:.85em">We heard: “${esc(t)}”</div>`;
          L.sfx(good ? "ok" : "bad");
          if (good) { L.count("spoken"); L.game.award(5, { once: "speak." + L.review.id("s", target) + "." + L.game.today(), label: "Clear voice" }); }
          done && done(r);
        }
      });
    }
    go.onclick = start; go.focus();
  };
  document.addEventListener("click", e => {
    const b = e.target.closest && e.target.closest("[data-listen]");
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    L.speak(b.getAttribute("data-listen"));
  }, true);

  // ── Badges ──
  const lessonsReady = () => L.modulos.flatMap(m => m.lecciones).filter(l => l.estado === "lista");
  const BADGES = [
    { id: "first", e: "🏁", t: "First lap", d: "Finish your first lesson section.", ok: c => c.sections >= 1 },
    { id: "placement", e: "🧭", t: "Know your level", d: "Finish a section of the placement test.", ok: c => !!c.placement },
    { id: "diploma1", e: "🎓", t: "First diploma", d: "Pass a lesson with 80% or more.", ok: c => c.diplomas >= 1 },
    { id: "podium", e: "🏆", t: "Podium", d: "Get 3 diplomas.", ok: c => c.diplomas >= 3 },
    { id: "champion", e: "👑", t: "World champion", d: "Get a diploma in every lesson.", ok: c => c.diplomas >= c.ready && c.ready > 0 },
    { id: "perfect", e: "💯", t: "Perfect lap", d: "Get 20 out of 20 in a final quiz.", ok: c => c.perfect },
    { id: "streak3", e: "🔥", t: "On fire", d: "Practice 3 days in a row.", ok: c => c.g.best >= 3 },
    { id: "streak7", e: "⚡", t: "Full week", d: "Practice 7 days in a row.", ok: c => c.g.best >= 7 },
    { id: "streak14", e: "🌟", t: "Unstoppable", d: "Practice 14 days in a row.", ok: c => c.g.best >= 14 },
    { id: "weekly", e: "📅", t: "Weekly goal", d: "Practice 4 days in one week.", ok: c => c.weekly },
    { id: "mechanic", e: "🔧", t: "Mechanic", d: "Fix 10 questions in Review.", ok: c => c.learned >= 10 },
    { id: "voice", e: "🎤", t: "Clear voice", d: "Say 20 sentences right with the microphone.", ok: c => (c.n.spoken || 0) >= 20 },
    { id: "ears", e: "🎧", t: "Sharp ears", d: "Write 20 dictations right.", ok: c => (c.n.dictation || 0) >= 20 },
    { id: "pole", e: "⏱️", t: "Pole position", d: "Finish a speed match in under 30 seconds.", ok: c => c.bestLap && c.bestLap < 30 },
    { id: "homework", e: "📝", t: "On time", d: "Finish 5 homework tasks.", ok: c => (c.n.homework || 0) >= 5 },
    { id: "level5", e: "🏎️", t: "Formula 2", d: "Reach level 5.", ok: c => c.g.level >= 5 }
  ];
  // Names (and a couple of icons) follow the student's style
  (function () {
    const st = STYLE(), names = st.badges || {};
    const EMO = { music: { first: "🎸", level5: "🎤", mechanic: "🎛️" }, cinema: { first: "🎬", level5: "🎞️", mechanic: "✂️" }, riding: { first: "🐴", level5: "🏇", mechanic: "🪮" }, career: { first: "💼", level5: "📈", mechanic: "🧩" } };
    const key = Object.keys(L.THEMES || {}).find(k => L.THEMES[k] === st), emo = EMO[key] || {};
    BADGES.forEach(b => { b.t0 = b.t; if (names[b.id]) b.t = names[b.id]; if (emo[b.id]) b.e = emo[b.id]; });
  })();
  function context(get) {
    const ready = lessonsReady(), g = stats(get), once = (get("game", null) || {}).once || {};
    const laps = ready.map(l => get("lap." + l.id, null)).concat(get("lap.all", null)).filter(Boolean);
    return {
      g, ready: ready.length, n: get("counters", {}) || {}, placement: get("placement", null), learned: get("reviewLearned", 0),
      sections: ready.reduce((a, l) => a + (get("done." + l.id, []) || []).length, 0),
      diplomas: ready.filter(l => get("diploma." + l.id, null)).length,
      perfect: ready.some(l => (get("attempts." + l.id, []) || []).concat(get("score." + l.id, null) || []).some(t => t && t.ok === t.n && t.n >= 20)),
      weekly: Object.keys(once).some(k => k.indexOf("week.") === 0), bestLap: laps.length ? Math.min(...laps) : null
    };
  }
  L.badges = {
    list: BADGES,
    // theme: name the badges for another student's style (the teacher panel passes each student's theme)
    earned: (get, theme) => { get = get || ((k, d) => S.get(k, d)); const c = context(get), have = get("badges", {}) || {}, nm = theme && L.themeOf ? (L.themeOf(theme).badges || {}) : null;
      return BADGES.map(b => ({ ...b, t: nm ? (nm[b.id] || b.t0 || b.t) : b.t, at: have[b.id] || null, now: b.ok(c) })); },
    check() {
      if (L.badges._busy) return; L.badges._busy = true;
      try {
        const have = S.get("badges", {}) || {}, c = context((k, d) => S.get(k, d)), fresh = BADGES.filter(b => !have[b.id] && b.ok(c));
        if (fresh.length) {
          fresh.forEach(b => have[b.id] = new Date().toISOString()); S.set("badges", have);
          setTimeout(() => { L.confetti(70); L.sfx("win"); L.toast(`<b>${fresh[0].e} New badge: ${esc(fresh[0].t)}</b><span>${esc(fresh[0].d)}${fresh.length > 1 ? ` · +${fresh.length - 1} more` : ""}</span>`, "big"); }, 900);
        }
      } finally { L.badges._busy = false; }
    }
  };
  document.addEventListener("lingua:xp", () => L.badges.check());
  document.addEventListener("DOMContentLoaded", () => { if (L.ready) L.ready.then(u => { if (u || !L.cloudEnabled) setTimeout(() => L.badges.check(), 600); }); });

  // ── Lesson content (built-in files or lessons made in the lesson builder) ──
  let chain = Promise.resolve();
  L.lessonData = function (id) {
    const custom = (S.get("__lessons", []) || []).find(x => x.id === id);
    if (custom) return Promise.resolve({ ...custom.data, id });
    return (chain = chain.then(() => new Promise(res => {
      const s = document.createElement("script");
      s.src = (L.root || (/\/clases\//.test(location.pathname) ? "../" : "")) + "assets/lessons/" + id + ".js";
      s.onload = () => res(window.CLASE && window.CLASE.id === id ? window.CLASE : null);
      s.onerror = () => res(null);
      document.head.appendChild(s);
    })));
  };

  // ── Effects: number ticker, progress ring, scratch to reveal, morphing text ──
  L.fx = {
    // count a number up (or down) inside an element
    ticker(el, to, opt) {
      opt = opt || {}; if (!el) return;
      const from = opt.from != null ? opt.from : 0, fmt = opt.fmt || (n => Math.round(n).toLocaleString("en-US")), dur = opt.dur || 900;
      if (reduced() || from === to) { el.textContent = fmt(to); return; }
      const t0 = performance.now(), ease = t => 1 - Math.pow(1 - t, 3);
      el.textContent = fmt(from);
      (function step(t) { const k = Math.min(1, (t - t0) / dur); el.textContent = fmt(from + (to - from) * ease(k)); if (k < 1) requestAnimationFrame(step); })(t0);
    },
    // fill a conic-gradient ring from 0 to pct
    ring(el, pct, color, opt) {
      opt = opt || {}; if (!el) return;
      const paint = p => { el.style.background = `conic-gradient(${color} ${p}%, var(--line) 0)`; };
      if (reduced()) { paint(pct); return; }
      const t0 = performance.now(), dur = opt.dur || 1000, ease = t => 1 - Math.pow(1 - t, 3);
      paint(0);
      (function step(t) { const k = Math.min(1, (t - t0) / dur); paint(pct * ease(k)); if (k < 1) requestAnimationFrame(step); })(t0);
    },
    // cover a box with a layer the student scratches off; Enter/Space or the reveal link uncovers it at once
    scratch(zone, opt) {
      opt = opt || {}; if (!zone || zone.dataset.scr) return; zone.dataset.scr = "1";
      zone.classList.add("scr-zone");
      const cover = document.createElement("button");
      cover.type = "button"; cover.className = "scr-cover"; cover.setAttribute("aria-label", opt.label || "Reveal the answer");
      const cv = document.createElement("canvas"), hint = document.createElement("span");
      hint.className = "scr-hint"; hint.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20c3-1 4-4 7-5s5 1 9-3M6 12c2-1 3-3 6-4s4 0 7-2"/></svg>${opt.hint || "Scratch to reveal"}`;
      cover.appendChild(cv); cover.appendChild(hint); zone.appendChild(cover);
      const x = cv.getContext("2d"); let w = 0, h = 0, dpr = 1, done = false, moves = 0, last = null, drawn = false;
      function paint() {
        const r = zone.getBoundingClientRect(); if (!r.width || !r.height) return;
        w = r.width; h = r.height; dpr = Math.min(2, window.devicePixelRatio || 1);
        cv.width = w * dpr; cv.height = h * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
        const cs = getComputedStyle(document.documentElement), c1 = cs.getPropertyValue("--fill-brand").trim() || "#2346d0", c2 = cs.getPropertyValue("--brand-dark").trim() || "#1a36a6";
        x.globalCompositeOperation = "source-over"; x.fillStyle = c1; x.fillRect(0, 0, w, h);
        x.fillStyle = c2; for (let i = -h; i < w; i += 14) { x.beginPath(); x.moveTo(i, h); x.lineTo(i + h, 0); x.lineTo(i + h + 5, 0); x.lineTo(i + 5, h); x.fill(); }
        drawn = true;
      }
      const ro = window.ResizeObserver ? new ResizeObserver(() => { if (!done && !drawn) paint(); }) : null; ro ? ro.observe(zone) : setTimeout(paint, 60);
      function reveal() {
        if (done) return; done = true; ro && ro.disconnect();
        cover.classList.add("gone"); setTimeout(() => cover.remove(), reduced() ? 0 : 350);
        zone.classList.add("scr-done"); opt.onReveal && opt.onReveal();
      }
      function cleared() {
        try { const d = x.getImageData(0, 0, cv.width, cv.height).data; let n = 0, t = 0; for (let i = 3; i < d.length; i += 4 * 24) { t++; if (d[i] < 40) n++; } return n / t; } catch (e) { return 1; }
      }
      function rub(e) {
        if (done) return; if (!drawn) paint();
        const r = cv.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
        x.globalCompositeOperation = "destination-out"; x.lineCap = "round"; x.lineJoin = "round"; x.lineWidth = 34;
        x.beginPath(); if (last) { x.moveTo(last[0], last[1]); x.lineTo(px, py); x.stroke(); } else { x.arc(px, py, 17, 0, 7); x.fill(); }
        last = [px, py]; hint.style.opacity = "0";
        if (++moves % 8 === 0 && cleared() > .5) reveal();
      }
      cv.addEventListener("pointerdown", e => { e.preventDefault(); last = null; cv.setPointerCapture && cv.setPointerCapture(e.pointerId); rub(e); cv.onpointermove = rub; });
      const up = () => { cv.onpointermove = null; last = null; if (!done && moves > 3 && cleared() > .38) reveal(); };
      cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
      cover.addEventListener("click", e => { if (e.detail === 0 || e.detail >= 2) reveal(); });
      return { reveal };
    },
    // cycle the words inside an element with a soft blur crossfade
    morph(el, words, ms) {
      if (!el || !words || words.length < 2 || reduced()) return;
      let i = 0; el.classList.add("morph");
      setInterval(() => {
        if (document.hidden) return;
        el.classList.add("out");
        setTimeout(() => { i = (i + 1) % words.length; el.textContent = words[i]; el.classList.remove("out"); }, 380);
      }, ms || 2800);
    }
  };

  // ── Voice recorder: record, listen back, record again ──
  L.recorder = function (box, opt) {
    opt = opt || {}; const max = opt.max || 180;
    const can = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
    let rec = null, chunks = [], t0 = 0, tick = null, stream = null, blob = null, secs = 0, url = null;
    const MIC = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
    const api = { get blob() { return blob; }, get seconds() { return secs; }, reset() { blob = null; draw(); }, note(html) { const n = box.querySelector(".rec-note"); if (n) n.innerHTML = html; } };
    function draw(state) {
      if (!can) { box.innerHTML = `<p class="rec-note muted">Voice recording isn’t available in this browser.</p>`; return; }
      box.innerHTML = state === "rec"
        ? `<button type="button" class="btn rec on" data-r="stop" aria-label="Stop recording"><i class="rdot" aria-hidden="true"></i>Stop · <span class="num" data-t>0:00</span></button><span class="rec-note"></span>`
        : blob ? `<div class="rec-done"><audio controls preload="metadata" src="${url}"></audio>${opt.again === false ? "" : `<button type="button" class="btn ghost sm" data-r="again">Record again</button>`}</div><span class="rec-note"></span>`
        : `<button type="button" class="btn rec" data-r="start">${MIC}${opt.label || "Record"}</button><span class="rec-note"></span>`;
      const b = box.querySelector("[data-r]"); if (!b) return;
      b.onclick = () => b.dataset.r === "stop" ? stop() : start();
    }
    async function start() {
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
      catch (e) { L.toast("<b>Microphone blocked</b><span>Allow the microphone for this site to record.</span>"); return; }
      const type = ["audio/webm;codecs=opus", "audio/mp4", "audio/webm", "audio/ogg"].find(t => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) || "";
      try { rec = new MediaRecorder(stream, type ? { mimeType: type } : undefined); } catch (e) { rec = new MediaRecorder(stream); }
      chunks = [];
      rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
      rec.onstop = () => {
        stream.getTracks().forEach(t => t.stop()); clearInterval(tick);
        secs = Math.max(1, Math.round((Date.now() - t0) / 1000));
        blob = new Blob(chunks, { type: (rec.mimeType || type || "audio/webm") });
        if (url) URL.revokeObjectURL(url); url = URL.createObjectURL(blob); draw();
        opt.onDone && opt.onDone(blob, secs, api);
      };
      rec.start(250); t0 = Date.now(); draw("rec");
      tick = setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000), el = box.querySelector("[data-t]"); if (el) el.textContent = Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); if (s >= max) stop(); }, 250);
    }
    function stop() { clearInterval(tick); if (rec && rec.state !== "inactive") rec.stop(); }
    draw(); return api;
  };

  // ── Sheet: a panel from the bottom on phones, a centered dialog on wide screens ──
  L.sheet = function (html, opt) {
    opt = opt || {}; L.sheet.close();
    const opener = document.activeElement, w = document.createElement("div");
    w.className = "lsheet-wrap"; w.innerHTML = `<div class="lsheet-scrim" data-x></div><div class="lsheet" role="dialog" aria-modal="true" aria-label="${esc(opt.label || "Details")}"><i class="lsheet-grab" aria-hidden="true"></i><button type="button" class="lsheet-x" data-x aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="lsheet-body">${html}</div></div>`;
    document.body.appendChild(w); document.body.classList.add("lsheet-open");
    requestAnimationFrame(() => w.classList.add("in"));
    const close = () => { L.sheet.close(); opener && opener.focus && opener.focus(); };
    w.querySelectorAll("[data-x]").forEach(x => x.onclick = close);
    w.onkeydown = e => {
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      if (e.key !== "Tab") return;
      const fs = [...w.querySelectorAll(".lsheet button, .lsheet a, .lsheet input, .lsheet textarea, .lsheet audio")].filter(x => !x.disabled); const a = fs[0], z = fs[fs.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    const f = w.querySelector(".lsheet-body [autofocus], .lsheet-body button, .lsheet-body a, .lsheet-body textarea"); (f || w.querySelector(".lsheet-x")).focus();
    return w.querySelector(".lsheet-body");
  };
  L.sheet.close = () => { const w = document.querySelector(".lsheet-wrap"); if (w) w.remove(); document.body.classList.remove("lsheet-open"); };

  // ── Calendar link sheet (teacher or student) ──
  L.calendarSheet = async function () {
    if (!L.calendar) { L.toast("Sign in to get your calendar link."); return; }
    let links; try { links = await L.calendar.link(); } catch (e) { L.toast("<b>Calendar link isn’t ready</b><span>Your teacher needs to finish a quick setup.</span>"); return; }
    const body = L.sheet(`<h2 class="lsheet-t">Add classes to your calendar</h2>
      <p class="muted" style="font-size:.92em">Your classes show up in your calendar and update by themselves when the schedule changes.</p>
      <div class="lsheet-acts">
        <a class="btn primary" href="${links.webcal}">iPhone, iPad or Mac</a>
        <a class="btn" href="${links.google}" target="_blank" rel="noopener">Google Calendar</a>
        <a class="btn" href="https://outlook.office.com/calendar/0/addfromweb?url=${encodeURIComponent(links.https)}&name=${encodeURIComponent("Lingua classes")}" target="_blank" rel="noopener">Outlook (work or school)</a>
        <a class="btn" href="https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(links.https)}&name=${encodeURIComponent("Lingua classes")}" target="_blank" rel="noopener">Outlook.com</a>
        <button type="button" class="btn ghost" id="calCopy">Copy link</button>
      </div><p class="muted" id="calMsg" style="font-size:.85em"></p>`, { label: "Calendar" });
    body.querySelector("#calCopy").onclick = () => navigator.clipboard.writeText(links.https).then(() => L.toast("Link copied"), () => window.prompt("Copy this link:", links.https));
    fetch(links.https).then(r => r.text()).then(t => { if (!/BEGIN:VCALENDAR/.test(t)) body.querySelector("#calMsg").textContent = "The calendar helper isn’t installed yet, so the link won’t work until it is."; }).catch(() => {});
  };

  // ── Install as an app (PWA) ──
  L.install = { prompt: null, ios: /iphone|ipad|ipod/i.test(navigator.userAgent), standalone: (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true };
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); L.install.prompt = e; document.dispatchEvent(new CustomEvent("lingua:installable")); });
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol) && !/claude\.ai|claudeusercontent|localhost|127\.0\.0\.1/.test(location.hostname)) {
    window.addEventListener("load", () => navigator.serviceWorker.register((L.root || (/\/clases\//.test(location.pathname) ? "../" : "")) + "sw.js").catch(() => {}));
  }
})();
