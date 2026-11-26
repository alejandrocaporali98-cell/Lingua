// Lingua lesson player (all UI in English). Each lesson defines window.CLASE and loads this file.
(function () {
  const C = window.CLASE, G = window.LINGUA, AB = "ABCD";
  // Five core sections, plus optional ones a lesson can bring (reading, grammar, spot the error, say it in English, talk about it)
  const QS = new URLSearchParams(location.search), EMB = !!G.embedded, ONLY = (QS.get("only") || "").split(",").filter(Boolean);
  // A debate lesson (C.debate) is all speaking: hot takes, a phrase toolkit, timed debate rounds, a lightning round and a verdict
  const DB = C.debate || null;
  // A studio lesson (C.studio) is a game: build a film with a budget, stage by stage, and defend every choice out loud
  const ST = C.studio || null;
  const ALL = ST ? ST.stages.map(x => ({ id: x.id, t: x.t, min: x.min || 10 })) : DB ? [
    ...(DB.hot && DB.hot.length ? [{ id: "hot", t: "Hot takes", min: 10 }] : []),
    ...(DB.kit && DB.kit.length ? [{ id: "kit", t: "Debate toolkit", min: 8 }] : []),
    ...DB.rounds.map((r, i) => ({ id: "r" + (i + 1), t: r.t, min: r.min || 20 })),
    ...(DB.lightning && DB.lightning.length ? [{ id: "light", t: "Lightning round", min: 12 }] : []),
    { id: "verdict", t: "The verdict", min: 10 }
  ] : [
    ...(C.warmup && C.warmup.questions && C.warmup.questions.length ? [{ id: "warmup", t: "Warm-up", min: 5 }] : []),
    { id: "flash", t: "Vocabulary", min: 10 },
    ...(C.read && C.read.text && C.read.text.length ? [{ id: "read", t: "Read", min: 12 }] : []),
    { id: "frases", t: "Sound natural", min: 10 },
    ...(C.grammar && (C.grammar.drill || C.grammar.sort) ? [{ id: "grammar", t: "Grammar", min: 12 }] : []),
    { id: "gaps", t: "Fill in the gaps", min: 10 },
    ...(C.errors && C.errors.items && C.errors.items.length ? [{ id: "errors", t: "Spot the error", min: 10 }] : []),
    ...(C.translate && C.translate.items && C.translate.items.length ? [{ id: "translate", t: C.translate.items.every(t => t.cue) ? "Say it naturally" : "Say it in English", min: 10 }] : []),
    { id: "rp", t: "Role‑play", min: 15 },
    ...(C.talk && C.talk.questions && C.talk.questions.length ? [{ id: "talk", t: "Over to you", min: 15 }] : []),
    { id: "final", t: "Final quiz", min: 15 }
  ];
  // Inside the trial class only some sections are shown (e.g. ?embed=1&only=read,grammar)
  const SECS = ONLY.length && ALL.some(s => ONLY.includes(s.id)) ? ALL.filter(s => ONLY.includes(s.id)) : ALL;
  const score = {};
  const tell = (msg) => { if (EMB && window.parent !== window) try { window.parent.postMessage({ lingua: "lesson", lesson: C.id, ...msg }, location.origin); } catch (e) {} };
  const st = { sec: G.store.get("sec." + C.id, 0), done: new Set(G.store.get("done." + C.id, [])) };
  // Progress is saved by section number: when a lesson gains sections, move what was done to the new numbers
  (function relayout() {
    if (EMB) return;
    const now = SECS.map(s => s.id), key = "secl." + C.id;
    const before = G.store.get(key, null) || now.filter(id => id !== "read" && id !== "grammar" && id !== "warmup");
    if (before.join() === now.join()) { if (!G.store.get(key, null)) G.store.set(key, now); return; }
    const map = i => now.indexOf(before[i]);
    st.done = new Set([...st.done].map(map).filter(i => i >= 0));
    st.sec = Math.max(0, map(st.sec));
    G.store.set("done." + C.id, [...st.done]); G.store.set("sec." + C.id, st.sec); G.store.set(key, now);
  })();
  const repKey = "repaso." + C.id;
  let quiz = null;
  // Opening a lesson shows its overview page first (not inside trial classes or when presenting)
  let over = !EMB && !QS.has("s") && QS.get("present") !== "1";

  document.body.innerHTML = `
  <header class="nav gutter">
    <div class="pbar">
      <a class="logo" href="../index.html" title="Back to My learning">${G.logo}</a>
      <span class="sep hide-sm"></span>
      <span class="ltitle hide-sm"><a href="../index.html" class="muted" style="text-decoration:none;font-weight:600">My learning</a> <span class="muted">/</span> Lesson ${C.id} · ${C.titulo}</span>
      <span class="spacer" style="flex:1"></span>
      <span class="ring hide-sm" id="ring"></span>
      <div class="tools">
        <button class="btn ghost sm hide-in-class" id="szDown" aria-label="Smaller text">A−</button>
        <button class="btn ghost sm hide-in-class" id="szUp" aria-label="Larger text">A+</button>
        <a class="btn sm" id="gamesBtn" aria-label="Games" href="../juegos.html?l=${encodeURIComponent(C.id)}" title="Class games built from this lesson"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3M16 11.5h.01M18 13.5h.01"/></svg><span class="gl">Games</span></a>
        <button class="toggle" id="classBtn" aria-pressed="false"><span class="sw"></span>Class mode <span class="kbd">C</span></button>
        <button class="btn sm hide-sm" id="presentBtn" title="Full screen for sharing your screen">Present <span class="kbd">P</span></button>
        <a class="avatar hide-in-class hide-sm" data-avatar href="../perfil.html" aria-label="Your profile" style="width:32px;height:32px"><svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="6.5" r="3.2"/><path d="M2.8 16c.9-3 3.4-4.6 6.2-4.6s5.3 1.6 6.2 4.6" stroke-linecap="round"/></svg></a>
      </div>
    </div>
  </header>
  <div class="player">
    <div class="stage gutter"><div class="stage-in" id="stage"></div></div>
    <aside class="side">
      <div class="side-in">
        <div class="side-cover">
          ${G.thumb({ id: C.id, titulo: C.titulo, nivel: C.nivel, color: C.color || "#2346d0", icono: C.icono || "helmet" }, "LESSON")}
          ${C.objetivos ? `<div style="display:grid;gap:8px"><span class="eyebrow">What you’ll learn</span><ul class="obj">${C.objetivos.map(o => `<li>${o}</li>`).join("")}</ul></div>` : ""}
        </div>
        <div class="planbox" id="planBox" hidden></div>
        <h3>Lesson content</h3>
        <button type="button" class="ov-link" id="ovBtn">Lesson overview</button>
        <ul class="toc" id="toc"></ul>
        <div class="side-extra">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
            <span class="eyebrow">To review</span>
            <button class="btn sm" id="copyRep">Copy</button>
          </div>
          <div class="flag-list" id="flags"></div>
        </div>
      </div>
    </aside>
  </div>`;
  const stage = document.getElementById("stage");

  // ── Shell ──
  // Class plan (teacher only): minutes for each section in today's class, and what's left for homework
  const TEACH = () => G.isTeacher || !!G.actingAs;
  const PLAN = C.plan && C.plan.steps ? C.plan : null;
  const planOf = id => PLAN && PLAN.steps.find(x => x.sec === id);
  function planBox() {
    const el = document.getElementById("planBox"); if (!el) return;
    if (!PLAN || !TEACH()) { el.hidden = true; return; }
    el.hidden = false;
    let t = 0;
    const rows = PLAN.steps.map(x => { const a = t; t += x.min; const s = SECS.find(y => y.id === x.sec); return `<li class="${SECS[st.sec] && SECS[st.sec].id === x.sec ? "on" : ""}"><span class="pm">${a}–${t}</span><span><b>${G.esc(x.label || (s ? s.t : x.sec))}</b>${x.tip ? `<small>${G.esc(x.tip)}</small>` : ""}</span></li>`; }).join("");
    el.innerHTML = `<div class="plan-h"><span class="eyebrow">Class plan · ${PLAN.min || t} min</span><span class="muted" style="font-size:.78em">teacher</span></div><ol class="plan-l">${rows}</ol>${PLAN.homework ? `<p class="plan-hw"><b>Homework:</b> ${G.esc(PLAN.homework)}</p>` : ""}`;
  }
  function drawToc() {
    document.getElementById("toc").innerHTML = SECS.map((s, i) => `
      <li><button class="${i === st.sec ? "active" : ""} ${st.done.has(i) ? "done" : ""}" data-i="${i}" aria-current="${i === st.sec ? "step" : "false"}">
        <span class="box"></span><span><span class="t">${i + 1}. ${s.t}</span><span class="m">${PLAN && TEACH() ? (planOf(s.id) ? planOf(s.id).min + " min in class" : "Homework") : s.min + " min"}</span></span>
      </button></li>`).join("");
    document.querySelectorAll("#toc button").forEach(b => b.onclick = () => go(+b.dataset.i));
    const n = st.done.size, pct = n / SECS.length * 100;
    document.getElementById("ring").innerHTML = `<span style="width:30px;height:30px;border-radius:50%;background:conic-gradient(var(--brand) ${pct}%, var(--line) 0);display:grid;place-items:center"><span style="width:22px;height:22px;border-radius:50%;background:var(--surface)"></span></span>${n} of ${SECS.length} complete`;
    drawFlags(); planBox();
  }
  function drawFlags() {
    const list = G.store.get(repKey, []);
    document.getElementById("flags").innerHTML = list.length ? list.map(x => `<div>${x}</div>`).join("")
      : `<p class="muted" style="font-size:.88em">Press <span class="kbd">M</span> on a question to save it here.</p>`;
  }
  function go(i) {
    over = false; document.body.classList.remove("ov");
    st.sec = Math.max(0, Math.min(SECS.length - 1, i));
    G.store.set("sec." + C.id, st.sec);
    drawToc(); draw(); window.scrollTo({ top: 0 });
    try { pt(); } catch (e) {}
  }
  function markDone(i) {
    const first = !st.done.has(i);
    st.done.add(i); G.store.set("done." + C.id, [...st.done]); drawToc();
    tell({ done: SECS[i].id, score: score[SECS[i].id] || null });
    if (first && G.game) { G.game.award(20, { once: "sec." + C.id + "." + i, label: "Section complete" }); G.sfx("pop"); }
  }
  function head(title, text) {
    return `<div class="sec-head"><span class="eyebrow">Section ${st.sec + 1} of ${SECS.length} · ${SECS[st.sec].min} min</span><h2>${title}</h2>${text ? `<p>${text}</p>` : ""}</div>`;
  }
  function pager() {
    const i = st.sec;
    return `<div class="pager">
      ${i > 0 ? `<button class="btn" data-prev>← ${SECS[i - 1].t}</button>` : EMB ? "<span></span>" : `<a class="btn" href="../index.html">← My learning</a>`}
      ${i < SECS.length - 1 ? `<button class="btn primary" data-next>Next: ${SECS[i + 1].t} →</button>` : EMB ? "" : `<a class="btn primary" href="../index.html">Finish lesson</a>`}
    </div>`;
  }
  function wirePager() {
    const p = stage.querySelector("[data-prev]"), n = stage.querySelector("[data-next]");
    if (p) p.onclick = () => go(st.sec - 1);
    if (n) n.onclick = () => { markDone(st.sec); go(st.sec + 1); };
  }
  function draw() {
    quiz = null; clearInterval(tick);
    const id = SECS[st.sec].id;
    if (ST) { drawStage(ST.stages.find(x => x.id === id)); wirePager(); return; }
    if (DB) { ({ hot: drawHot, kit: drawKit, light: drawLight, verdict: drawVerdict })[id] ? ({ hot: drawHot, kit: drawKit, light: drawLight, verdict: drawVerdict })[id]() : drawRound(+id.slice(1) - 1); wirePager(); return; }
    ({ warmup: drawWarmup, flash: drawFlash, read: drawRead, grammar: drawGrammar, frases: drawFrases, gaps: drawGaps, errors: drawErrors, translate: drawTranslate, rp: drawRP, talk: drawTalk, final: drawFinal })[SECS[st.sec].id]();
    wirePager();
  }

  // ── Overview: the lesson's course page (what you'll learn, content, vocabulary, grammar) ──
  function drawOverview() {
    over = true; quiz = null; document.body.classList.add("ov");
    const E = G.esc, mod = (G.modulos || []).find(m => m.lecciones.some(l => l.id === C.id));
    const cfg = (G.modulos || []).flatMap(m => m.lecciones).find(l => l.id === C.id), n = st.done.size, pct = Math.round(n / SECS.length * 100);
    const total = (PLAN && PLAN.min) || (cfg && cfg.min) || SECS.reduce((a, s) => a + s.min, 0), inPlan = id => PLAN && PLAN.steps.some(x => x.sec === id);
    const minOf = s => !PLAN ? s.min + " min" : inPlan(s.id) ? planOf(s.id).min + " min" : "Homework", hw = PLAN ? SECS.filter(s => !inPlan(s.id)).length : 0;
    const fl = C.flash || [], words = fl.map(f => f.en);
    const bold = s => E(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/~~(.+?)~~/g, "<s>$1</s>");
    const desc = {
      warmup: () => C.warmup.title.replace(/^Warm-up\s*·\s*/i, "") + " · " + C.warmup.questions.length + " questions",
      flash: () => fl.length + " cards: " + words.slice(0, 3).join(", ") + "…",
      read: () => "“" + C.read.title + "” · " + (C.read.questions || []).length + " questions",
      frases: () => (C.frases || []).length + " phrases that sound natural",
      grammar: () => C.grammar.title, gaps: () => C.gaps.title || "Complete the text",
      errors: () => C.errors.items.length + " sentences to fix", translate: () => C.translate.items.length + " situations to say out loud",
      rp: () => C.roleplay.title, talk: () => C.talk.questions.length + " questions to talk about",
      final: () => (C.final || []).length + " questions from the whole lesson",
      hot: () => DB.hot.length + " opinions to defend in 30 seconds", kit: () => "Phrases to open, rebut, concede and close",
      light: () => DB.lightning.length + " motions · 45 seconds each, no prep", verdict: () => "How it went, and what to try next time"
    };
    if (ST) ST.stages.forEach(x => { desc[x.id] = () => x.blurb || ""; });
    if (DB) DB.rounds.forEach((r, i) => { desc["r" + (i + 1)] = () => r.motions.length > 1 ? r.motions.length + " motions to choose from · " + r.kind : r.motions[0].m; });
    const ico = { words: '<path d="M4 6h16M4 12h10M4 18h13"/>', read: '<path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2z"/><path d="M8 7h6"/>', gram: '<path d="M12 5v14M5 12h14"/>',
      rp: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 11h5M16 15h4"/>', talk: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>', quiz: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 12l3 3 5-6"/>', game: '<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3"/>' };
    const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${ico[k]}</svg>`;
    const inc = ST ? [["game", (ST.name || "A film production game") + " · $" + ST.budget + "M budget"], ["talk", ST.stages.reduce((a, x) => a + (x.talk || []).length, 0) + " speaking tasks with timers"],
      ["rp", (ST.cardsText || "Hire writers, cast, crew and cameras") + " · " + ST.stages.reduce((a, x) => a + (x.slots || []).reduce((b, sl) => b + sl.options.length, 0), 0) + " cards"], ["quiz", "No quizzes: decisions and speaking"]] : DB ? [["talk", DB.rounds.length + " timed debates"], ["rp", (DB.rounds.reduce((a, r) => a + r.motions.length, 0) + (DB.lightning || []).length) + " motions to argue"],
      ["read", "Debate toolkit · " + DB.kit.reduce((a, g) => a + g.p.length, 0) + " phrases"], ["quiz", "No quizzes: 100% speaking"]] : [["words", fl.length + " words with audio"], C.read && C.read.text ? ["read", "1 reading with " + (C.read.questions || []).length + " questions"] : null,
      C.grammar ? ["gram", "Grammar: " + C.grammar.title] : null, C.roleplay ? ["rp", "Role-play: " + C.roleplay.title] : null,
      C.talk ? ["talk", C.talk.questions.length + " conversation questions"] : null, ["quiz", "Final quiz · " + (C.final || []).length + " questions"], ["game", "Class games"]].filter(Boolean);
    const gr = C.grammar, ex = gr && gr.examples || [];
    const status = !n ? `<span class="ov-new">New</span>` : n >= SECS.length ? `<span class="ov-done">Completed</span>` : `<span class="ov-prog">${pct}% complete</span>`;
    const cta = !n ? "Start lesson" : n >= SECS.length ? "Review lesson" : "Continue: " + SECS[st.sec].t;
    stage.innerHTML = `
      <section class="ov-hero">
        <nav class="ov-crumbs"><a href="../index.html">My learning</a><span>›</span>${mod ? `<span>${E(mod.titulo)}</span><span>›</span>` : ""}<span>Level ${E(C.nivel)}</span></nav>
        <h1>${E(C.id)} · ${E(C.titulo)}</h1>
        ${C.tema || (cfg && cfg.tema) ? `<p class="ov-tag">${E(C.tema || cfg.tema)}</p>` : ""}
        <div class="ov-meta">${status}<span class="ov-lvl">Level ${E(C.nivel)}</span><span>${total} min</span><span>${SECS.length} sections</span></div>
        <p class="ov-by">A <b>Lingua</b> lesson · English</p>
      </section>
      <div class="ov-body">
        <div class="ov-main">
          ${C.objetivos && C.objetivos.length ? `<section class="ov-learn"><h2>What you'll learn</h2><ul>${C.objetivos.map(o => `<li>${E(o)}</li>`).join("")}</ul></section>` : ""}
          <section><h2>Lesson content</h2><p class="ov-sub">${SECS.length} sections · ${total} min in class${hw ? ` · ${hw} for homework` : ""}</p>
            <ol class="ov-list">${SECS.map((s, i) => `<li><button type="button" data-ov="${i}"><span class="ov-chk ${st.done.has(i) ? "on" : ""}" aria-hidden="true"></span><span class="ov-t"><b>${E(s.t)}</b><small>${E((desc[s.id] || (() => ""))())}</small></span><span class="ov-m ${minOf(s) === "Homework" ? "hw" : ""}">${minOf(s)}</span></button></li>`).join("")}</ol></section>
          ${gr ? `<section class="ov-gr"><h2>Grammar of the lesson</h2><p class="ov-gt">${E(gr.title)}</p>${ex[0] ? `<p class="ov-big">${bold(ex[0])}</p>` : ""}
            <ul>${ex.slice(1, 3).map(x => `<li>${bold(x)}</li>`).join("")}${gr.wrong && gr.right ? `<li class="ov-watch">Watch out: ${bold(gr.wrong)} → ${bold(gr.right)}</li>` : ""}</ul></section>` : ""}
          ${ST && ST.how ? `<section><h2>How the game works</h2><ul class="ov-q">${ST.how.map(h => `<li>${E(h)}</li>`).join("")}</ul></section>` : ""}
          ${DB ? `<section><h2>Tonight’s motions</h2><ul class="ov-q">${DB.rounds.flatMap(r => r.motions.map(m => `<li>${E(m.m)}</li>`)).join("")}</ul></section>` : ""}
          ${C.talk && C.talk.questions ? `<section><h2>Let's talk about</h2><ul class="ov-q">${C.talk.questions.slice(0, 4).map(q => `<li>${E(q)}</li>`).join("")}</ul></section>` : ""}
        </div>
        <aside class="ov-side">
          <div class="ov-card">
            <button type="button" class="ov-tile" style="--c:${C.color || "#2346d0"}" data-start aria-label="${E(cta)}"><b>${E(C.id)}</b><span class="ov-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span></button>
            <div class="ov-cin">
              <p class="ov-sub"><b>${total} min · ${SECS.length} sections</b></p>
              <button type="button" class="btn primary ov-go" data-start>${E(cta)}</button>
              <div class="ov-inc"><b>This lesson includes:</b><ul>${inc.map(([k, txt]) => `<li>${svg(k)}<span>${E(txt)}</span></li>`).join("")}</ul></div>
            </div>
          </div>
          ${words.length ? `<section><h3>Lesson vocabulary</h3><div class="ov-pills">${words.map(w => `<span>${E(w)}</span>`).join("")}</div></section>` : ""}
          ${C.plan && C.plan.homework ? `<section><h3>Homework</h3><p class="ov-hw">${E(C.plan.homework)}</p></section>` : ""}
        </aside>
      </div>`;
    stage.querySelectorAll("[data-start]").forEach(b => b.onclick = () => go(st.sec));
    stage.querySelectorAll("[data-ov]").forEach(b => b.onclick = () => go(+b.dataset.ov));
    window.scrollTo({ top: 0 });
  }

  // ── 1 Vocabulario ──
  function drawFlash() {
    stage.innerHTML = head("Lesson vocabulary", "Read each word out loud and say what you think it means. Then scratch the card to check.") +
      `<div class="flash-grid">${C.flash.map((f, i) => `
        <div class="flash" data-i="${i}">
          <div class="ftop"><span class="chip">${f.tag}</span>${G.sayBtn(f.en, "Listen: " + f.en)}</div>
          ${f.img ? `<span class="fimg" aria-hidden="true">${f.img}</span>` : ""}
          <span class="word">${f.en}</span>
          <div class="fback"><span class="es">${f.def}</span><span class="ex">${f.ex}</span><div class="fbot">${G.sayBtn(f.ex, "Listen to the example")}</div></div>
        </div>`).join("")}</div>` + pager();
    stage.querySelectorAll(".flash").forEach(b => {
      G.fx.scratch(b.querySelector(".fback"), { label: "Reveal the meaning of " + b.querySelector(".word").textContent, onReveal: () => G.game && G.game.award(2, { once: "flip." + C.id + "." + b.dataset.i, silent: true }) });
    });
  }

  // ── Quiz engine ──
  function build(list) { return list.map((q, i) => { const p = i % 4, o = [...q.w]; o.splice(p, 0, q.a); return { ...q, opts: o, correct: p }; }); }
  function makeQuiz(el, list, o) {
    const qs = build(list), res = qs.map(() => null), flags = new Set();
    let i = 0, sel = null, shown = false, fin = false;
    const api = { key(k) {
      if (fin) return false;
      const n = "1234".indexOf(k);
      if (n >= 0 && !shown) { choose(n); return true; }
      if (k === " " || k === "enter") { if (!shown && sel != null) reveal(); else if (shown) next(); return true; }
      if (k === "m") { flag(); return true; }
      return false;
    }};
    const inClass = () => document.body.classList.contains("clase");
    function choose(n) { sel = n; if (!inClass()) reveal(); else paint(); }
    function reveal() { if (sel == null) return; shown = true; res[i] = sel === qs[i].correct; G.sfx(res[i] ? "ok" : "bad"); paint(); }
    function next() { if (i < qs.length - 1) { i++; sel = null; shown = false; paint(); } else { fin = true; summary(); } }
    function flag() {
      const q = qs[i], list = G.store.get(repKey, []), line = q.p.replace("___", q.a);
      if (flags.has(i)) { flags.delete(i); G.store.set(repKey, list.filter(x => x !== line)); G.review.remove(G.review.id(C.id, q.p)); toast("Removed from review"); }
      else { flags.add(i); if (!list.includes(line)) list.push(line); G.store.set(repKey, list); G.review.add(q, C.id, "saved"); toast("Saved for review"); }
      drawFlags(); paint();
    }
    function paint() {
      const q = qs[i];
      el.innerHTML = `<div class="panel q">
        <div class="q-head"><span class="eyebrow">Question ${i + 1} of ${qs.length}</span>
          <div class="steps" aria-hidden="true">${qs.map((_, k) => `<span class="${k === i ? "cur" : res[k] === true ? "ok" : res[k] === false ? "bad" : ""} ${flags.has(k) ? "flag" : ""}"></span>`).join("")}</div></div>
        <div class="q-title"><span>${q.p.replace("___", shown ? `<span class="gap filled">${q.a}</span>` : '<span class="gap">&nbsp;</span>')}</span>${G.sayBtn(shown ? q.p.replace("___", q.a) : q.p, "Listen to the question")}</div>
        <div class="opts" role="radiogroup">${q.opts.map((t, k) => {
          let c = ""; if (shown) { if (k === q.correct) c = "ok"; else if (k === sel) c = "bad"; } else if (k === sel) c = "sel";
          return `<button class="opt ${c}" data-k="${k}" role="radio" aria-checked="${k === sel}" ${shown ? "disabled" : ""}><span class="radio"></span><span>${t}</span><span class="letter">${k + 1}</span></button>`;
        }).join("")}</div>
        ${shown ? `<div class="feedback ${res[i] ? "ok" : "bad"}"><div><b>${res[i] ? "Correct!" : "Not quite."}</b>${q.why}</div>${G.sayBtn(/___/.test(q.p) ? q.p.replace("___", q.a) : q.a, "Listen to the right answer")}</div>` : ""}
        <div class="actions" style="justify-content:space-between">
          <button class="btn ghost sm" data-a="flag">${flags.has(i) ? "★ Saved for review" : "☆ Save for review"} <span class="kbd">M</span></button>
          ${!shown ? `<button class="btn primary" data-a="rev" ${sel == null ? "disabled" : ""}>Check <span class="kbd">Space</span></button>`
                   : `<button class="btn primary" data-a="next">${i < qs.length - 1 ? "Next question" : "See result"} <span class="kbd">Space</span></button>`}
        </div></div>`;
      el.querySelectorAll(".opt").forEach(b => b.onclick = () => choose(+b.dataset.k));
      const r = el.querySelector('[data-a="rev"]'), n = el.querySelector('[data-a="next"]');
      if (r) r.onclick = reveal; if (n) n.onclick = next;
      el.querySelector('[data-a="flag"]').onclick = flag;
    }
    function summary() {
      const ok = res.filter(Boolean).length, wrong = qs.filter((_, k) => !res[k]), p = Math.round(ok / qs.length * 100);
      wrong.forEach(q => G.review.add(q, C.id, "mistake"));
      const fresh = o.onDone ? o.onDone(ok, qs.length) : false;
      if (G.game && ok) G.game.award(ok * (o.badge ? 3 : 2), { label: o.label + " · " + ok + " right" });
      const msg = p >= 80 ? "Excellent! You’re ready for the next lesson." : p >= 50 ? "Good job! Review your mistakes and try again." : "Let’s review this together in the next class.";
      el.innerHTML = `<div class="panel" style="display:grid;gap:20px">
        <div class="result">
          <div class="score-ring" data-ring><div><span><b class="num"><span data-tk>0</span>/${qs.length}</b><br><span class="muted" style="font-size:.8em"><span data-tp>0</span>%</span></span></div></div>
          <div style="display:grid;gap:6px"><span class="eyebrow">${o.label}</span><h3 style="font-size:1.35em;font-weight:800">${msg}</h3>
            ${o.badge && p >= 80 ? `<div class="badge-earned"><svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="17" r="13" fill="#f5c518"/><circle cx="20" cy="17" r="9" fill="none" stroke="#3a2c00" stroke-width="1.6" stroke-dasharray="2 2.2"/><path d="M14.5 17.5l3.6 3.4 7.4-7.4" fill="none" stroke="#3a2c00" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 27l-3 9 5-2 3 4 2-8M27 27l3 9-5-2-3 4-2-8" fill="#2346d0"/></svg><span><b>Diploma unlocked</b><br><span class="muted">Lesson ${C.id} · ${C.titulo} · <a href="../diplomas.html#d${C.id}">View your diploma</a></span></span></div>` : ""}</div>
        </div>
        ${wrong.length ? `<div style="display:grid;gap:8px"><span class="eyebrow">Correct answers to review</span>${wrong.map(q => `<div class="feedback bad" style="padding:10px 14px"><div>${q.p.replace("___", "<b style='display:inline'>" + q.a + "</b>")}</div>${G.sayBtn(/___/.test(q.p) ? q.p.replace("___", q.a) : q.a)}</div>`).join("")}<p class="muted" style="font-size:.88em">We added ${wrong.length === 1 ? "this question" : "these " + wrong.length + " questions"} to your <a href="../review.html">Review</a> list.</p></div>` : ""}
        <div class="actions"><button class="btn" data-a="again">Try again</button>${wrong.length ? `<a class="btn ghost" href="../review.html">Practice my mistakes</a>` : ""}</div></div>`;
      G.fx.ring(el.querySelector("[data-ring]"), p, p >= 80 ? "var(--ok)" : "var(--brand)");
      G.fx.ticker(el.querySelector("[data-tk]"), ok); G.fx.ticker(el.querySelector("[data-tp]"), p);
      if (p >= 80 && !(o.badge && fresh)) setTimeout(() => { G.confetti(o.badge ? 90 : 50); G.sfx("win"); }, 650);
      el.querySelector('[data-a="again"]').onclick = () => { res.fill(null); i = 0; sel = null; shown = false; fin = false; paint(); };
    }
    paint(); return api;
  }

  // ── Read: an article with questions; each answer lights up its sentence in the text ──
  function drawRead() {
    const R = C.read, qs = R.questions || [], ans = qs.map(() => null), miss = new Set();
    const strip = w => w.toLowerCase().replace(/[.…!?,;:"“”]/g, "").replace(/^(to|a|an|the)\s+/, "").trim();
    const glossOf = w => { const g = R.gloss && (R.gloss[w] || R.gloss[w.toLowerCase()]); if (g) return { d: g }; const f = (C.flash || []).find(f => strip(f.en) === strip(w) || strip(w).startsWith(strip(f.en)) || strip(f.en).startsWith(strip(w))); return f ? { d: f.def, card: C.flash.indexOf(f) + 1 } : null; };
    const para = t => t.replace(/\[\[([^\]]+)\]\]/g, (m, w) => `<button type="button" class="rd-gl" data-w="${G.esc(w)}">${w}</button>`);
    const plain = R.text.map(t => t.replace(/\[\[([^\]]+)\]\]/g, "$1")).join(" ");
    stage.innerHTML = head("Read: " + (R.short || R.title), R.intro || "Read the text out loud, one paragraph each. Tap a dotted word to see what it means here. Then answer the questions.") + `
      ${R.before ? `<div class="panel rd-step"><span class="eyebrow">Before you read</span><p>${R.before}</p></div>` : ""}
      <div class="rd">
        <article class="panel rd-art">
          ${R.kicker ? `<div class="rd-kick"><span>${R.kicker}</span><span class="muted">· ${Math.max(1, Math.round(plain.split(/\s+/).length / 180))} min read · ${plain.split(/\s+/).length} words</span></div>` : ""}
          <h3 class="rd-title">${R.title}</h3>
          <div class="rd-listen">${G.sayBtn(plain, "Listen to the text")}<span class="muted">Listen while you read</span></div>
          <div class="rd-body">${R.text.map((t, i) => `<p data-p="${i}">${para(t)}</p>`).join("")}</div>
          <div class="rd-gloss" id="rdGloss" hidden></div>
        </article>
        <aside class="panel rd-qs">
          <div class="rd-qhead"><b>Check your understanding</b><span class="num muted" id="rdN">0 / ${qs.length}</span></div>
          ${qs.map((q, i) => { const o = [...(q.w || [])]; const p = q.pos != null ? q.pos : (i * 2 + 1) % (o.length + 1); o.splice(p, 0, q.a); return `<div class="rd-q" data-i="${i}" data-c="${p}"><b>${i + 1}. ${q.q}</b>${o.map((t, k) => `<button type="button" class="opt rd-opt" data-k="${k}"><span class="letter">${AB[k]}</span><span>${t}</span></button>`).join("")}<p class="rd-why" hidden></p></div>`; }).join("")}
        </aside>
      </div>
      ${R.after ? `<div class="panel rd-step"><span class="eyebrow">Talk about it</span><p>${R.after} ${G.sayBtn(R.after.replace(/<[^>]+>/g, ""), "Listen")}</p></div>` : ""}` + pager();
    stage.querySelectorAll(".rd-gl").forEach(b => b.onclick = () => {
      const w = b.dataset.w, g = glossOf(w), box = document.getElementById("rdGloss");
      stage.querySelectorAll(".rd-gl.on").forEach(x => x.classList.remove("on")); b.classList.add("on");
      box.hidden = false; box.innerHTML = `<span class="eyebrow">Tapped</span><span><b>${G.esc(w)}</b> — ${g ? g.d : "ask your teacher what it means here."}${g && g.card ? ` <span class="muted">· vocabulary card ${g.card}</span>` : ""}</span>`;
    });
    const mark = q => {
      stage.querySelectorAll(".rd-body mark").forEach(m => m.replaceWith(...m.childNodes));
      stage.querySelectorAll(".rd-body p").forEach(p => p.normalize());
      if (!q.ev) return;
      for (const p of stage.querySelectorAll(".rd-body p")) {
        const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT); let n;
        while ((n = walker.nextNode())) { const k = n.nodeValue.indexOf(q.ev); if (k >= 0) { const r = document.createRange(); r.setStart(n, k); r.setEnd(n, k + q.ev.length); const m = document.createElement("mark"); r.surroundContents(m); m.scrollIntoView({ block: "nearest", behavior: "smooth" }); return; } }
      }
      // the sentence crosses a tappable word: light up its whole paragraph instead
      const p = [...stage.querySelectorAll(".rd-body p")].find(p => p.textContent.includes(q.ev));
      if (p) { const m = document.createElement("mark"); while (p.firstChild) m.appendChild(p.firstChild); p.appendChild(m); m.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
    };
    stage.querySelectorAll(".rd-q").forEach(box => box.querySelectorAll(".rd-opt").forEach(b => b.onclick = () => {
      const i = +box.dataset.i, q = qs[i], ok = +b.dataset.k === +box.dataset.c;
      if (ans[i] === true) return;
      b.classList.add(ok ? "ok" : "bad"); G.sfx(ok ? "ok" : "bad");
      if (!ok) { ans[i] = ans[i] === null ? false : ans[i]; miss.add(i); setTimeout(() => b.classList.remove("bad"), 700); return; }
      ans[i] = true; box.classList.add("done"); box.querySelectorAll(".rd-opt").forEach(x => x.disabled = true);
      const why = box.querySelector(".rd-why"); if (q.why || q.ev) { why.hidden = false; why.innerHTML = q.why || "It’s highlighted in the text."; }
      mark(q);
      const n = ans.filter(x => x === true).length; document.getElementById("rdN").textContent = n + " / " + qs.length;
      G.game && G.game.award(2, { once: "rd." + C.id + "." + i, silent: true });
      if (n === qs.length) { score.read = { ok: ans.filter(x => x === true).length - miss.size, n: qs.length }; G.confetti(50); markDone(st.sec); }
    }));
  }

  // ── Grammar: a pattern card (or two forms side by side) and quick practice ──
  function drawGrammar() {
    const M = C.grammar, hi = t => String(t).replace(/\*\*([^*]+)\*\*/g, "<b class='hl'>$1</b>").replace(/~~([^~]+)~~/g, "<s>$1</s>");
    const clean = t => String(t).replace(/\*\*|~~/g, "");
    const tl = kind => kind === "span"
      ? `<svg class="tl" viewBox="0 0 320 64" role="img" aria-label="From the past until now"><line x1="10" y1="32" x2="300" y2="32" class="tl-l"/><rect x="60" y="26" width="240" height="12" rx="6" class="tl-span"/><line x1="300" y1="20" x2="300" y2="44" class="tl-now"/><text x="300" y="60" text-anchor="end">now</text></svg>`
      : kind === "point" ? `<svg class="tl" viewBox="0 0 320 64" role="img" aria-label="A finished moment in the past"><line x1="10" y1="32" x2="300" y2="32" class="tl-l"/><circle cx="120" cy="32" r="9" class="tl-pt"/><line x1="300" y1="20" x2="300" y2="44" class="tl-now"/><text x="300" y="60" text-anchor="end">now</text></svg>`
      : kind === "future" ? `<svg class="tl" viewBox="0 0 320 64" role="img" aria-label="Later, after now"><line x1="10" y1="32" x2="310" y2="32" class="tl-l"/><line x1="150" y1="20" x2="150" y2="44" class="tl-now"/><text x="150" y="60" text-anchor="middle">now</text><circle cx="250" cy="32" r="9" class="tl-pt"/></svg>` : "";
    let body = "";
    if (M.kind === "compare") {
      body = `<div class="gr-cols">${M.forms.map((f, i) => `<div class="panel gr-col c${i}"><b class="gr-name">${f.name}</b><span class="gr-form">${f.form}</span>${tl(f.tl)}<span class="muted">${f.use}</span>${(f.examples || []).map(e => `<div class="gr-ex">${hi(e)} ${G.sayBtn(clean(e), "Listen")}</div>`).join("")}</div>`).join("")}</div>`;
    } else {
      body = `<div class="panel gr-rule"><span class="eyebrow">The pattern</span>
        <div class="gr-chips">${M.pattern.map((p, i) => `${i ? `<span class="plus">+</span>` : ""}<span class="gr-chip ${p[0] === "+" ? "slot" : p[0] === "=" ? "rest" : ""}">${p.replace(/^[+=]/, "")}</span>`).join("")}</div>
        ${M.note ? `<p class="muted">${M.note}</p>` : ""}
        <div>${(M.examples || []).map(e => `<div class="gr-ex">${G.sayBtn(clean(e), "Listen")} <span>${hi(e)}</span></div>`).join("")}</div></div>
        ${M.wrong ? `<div class="gr-pair"><div class="panel gr-bad"><span class="eyebrow">✗ Sounds off</span><span>${hi(M.wrong)}</span></div><div class="panel gr-good"><span class="eyebrow">✓ Natural</span><span>${hi(M.right)} ${G.sayBtn(clean(M.right), "Listen")}</span></div></div>` : ""}`;
    }
    const items = M.kind === "compare" ? (M.sort || []) : (M.drill || []);
    const practice = M.kind === "compare"
      ? `<div class="panel gr-drill"><div class="rd-qhead"><b>${M.task || "Sort them · which form?"}</b><span class="num muted" id="grN">0 / ${items.length}</span></div>
          ${items.map((x, i) => `<div class="gr-sort" data-i="${i}"><span class="s">${hi(x.s).replace("___", `<span class="gap">___</span>`)}</span><span class="gr-btns">${M.forms.map((f, k) => `<button type="button" class="opt gr-b" data-k="${k}">${f.name}</button>`).join("")}</span></div>`).join("")}</div>`
      : `<div class="panel gr-drill"><div class="rd-qhead"><b>${M.task || "Your turn"}</b><span class="num muted" id="grN">0 / ${items.length}</span></div>
          ${items.map((x, i) => { const o = [...x.w]; const p = (i * 2 + 1) % (o.length + 1); o.splice(p, 0, x.a); return `<div class="gr-item" data-i="${i}" data-c="${p}"><span class="gr-p">${hi(x.p)}</span><span class="gr-btns">${o.map((t, k) => `<button type="button" class="opt gr-b" data-k="${k}">${t}</button>`).join("")}</span></div>`; }).join("")}
          ${M.say ? `<p class="gr-say">${M.say}</p>` : ""}</div>`;
    stage.innerHTML = head("Grammar: " + M.title, M.intro || "") + body + practice + pager();
    let n = 0; const miss = new Set();
    const done = (row, i) => { row.classList.add("done"); row.querySelectorAll(".gr-b").forEach(x => x.disabled = true); n++; document.getElementById("grN").textContent = n + " / " + items.length; G.game && G.game.award(2, { once: "gr." + C.id + "." + i, silent: true }); if (n === items.length) { score.grammar = { ok: items.length - miss.size, n: items.length }; G.confetti(50); G.sfx("win"); markDone(st.sec); } };
    stage.querySelectorAll(".gr-item, .gr-sort").forEach(row => row.querySelectorAll(".gr-b").forEach(b => b.onclick = () => {
      const i = +row.dataset.i, x = items[i], ok = M.kind === "compare" ? +b.dataset.k === x.f : +b.dataset.k === +row.dataset.c;
      b.classList.add(ok ? "ok" : "bad"); G.sfx(ok ? "ok" : "bad");
      if (!ok) { miss.add(i); setTimeout(() => b.classList.remove("bad"), 700); return; }
      if (M.kind === "compare" && x.answer) { const g = row.querySelector(".gap"); if (g) { g.textContent = x.answer; g.classList.add("filled"); } row.querySelector(".s").insertAdjacentHTML("beforeend", " " + G.sayBtn(clean(x.s).replace("___", x.answer), "Listen")); }
      done(row, i);
    }));
  }

  // ── 2 Suena natural ──
  function drawFrases() {
    stage.innerHTML = head("Sound natural", "These are very common mistakes. Choose what a native speaker would say.") + `<div id="qz"></div>` + pager();
    quiz = makeQuiz(stage.querySelector("#qz"), C.frases, { label: "Sound natural" });
  }

  // ── 3 Completa ──
  function drawGaps() {
    const it = C.gaps.items;
    stage.innerHTML = head(C.gaps.title, C.gaps.text) + `
      <div class="panel" style="display:grid;gap:16px">
        <div style="display:grid;gap:8px"><span class="eyebrow">Word bank</span><div class="bank">${C.gaps.bank.map(w => `<span>${w}</span>`).join("")}</div></div>
        <div class="gaps">${it.map((g, i) => `<div class="gap-row" data-i="${i}"><span class="n num">${i + 1}.</span><div><span class="s">${g.s.replace("___", `<input id="gap-${C.id}-${i}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Answer ${i + 1}">`)}</span><span class="fix"></span><span class="note"></span></div></div>`).join("")}</div>
        <div class="actions"><button class="btn primary" id="chk">Check all</button><button class="btn ghost" id="show">Show answers</button><span id="gs" class="num" style="font-weight:800"></span></div>
      </div>` + pager();
    const norm = s => s.trim().toLowerCase().replace(/[’`]/g, "'").replace(/\s+/g, " ");
    function check(all) {
      let ok = 0;
      stage.querySelectorAll(".gap-row").forEach(r => {
        const g = it[+r.dataset.i], v = norm(r.querySelector("input").value), good = g.a.some(a => norm(a) === v);
        r.classList.remove("ok", "bad");
        if (!v && !all) { r.querySelector(".fix").textContent = ""; r.querySelector(".note").textContent = ""; return; }
        r.classList.add(good ? "ok" : "bad"); if (good) ok++;
        r.querySelector(".fix").innerHTML = (good ? "✓" : "→ " + G.esc(g.a[0])) + G.sayBtn(g.s.replace("___", g.a[0]), "Listen to the sentence");
        r.querySelector(".note").textContent = good ? "" : g.note || "";
        if (good && G.game) G.game.award(2, { once: "gap." + C.id + "." + r.dataset.i, silent: true });
      });
      document.getElementById("gs").textContent = ok + " of " + it.length + " correct";
      const bad = stage.querySelectorAll(".gap-row.bad").length;
      if (!all) G.sfx(bad ? "bad" : ok === it.length ? "win" : "ok");
      if (!all && ok === it.length) G.confetti(70);
    }
    stage.querySelectorAll("input").forEach((inp, i, all) => inp.addEventListener("keydown", e => {
      if (e.key === "Enter") { e.preventDefault(); check(false); if (all[i + 1]) all[i + 1].focus(); }
    }));
    document.getElementById("chk").onclick = () => check(false);
    document.getElementById("show").onclick = () => check(true);
  }

  // ── 4 Role-play ──
  function drawRP() {
    const R = C.roleplay;
    stage.innerHTML = head(R.title, R.setup) + `<div class="panel chat">${R.lines.map((l, i) => l.you ? `
      <div class="msg you"><div class="bub"><div class="who">You</div><div class="cue">${l.cue}</div><div class="model" hidden id="m${i}">${l.model} ${G.sayBtn(l.model, "Listen to the example")} ${G.micBtn(l.model, "Say the example")}${l.tip ? `<p class="tip">${l.tip}</p>` : ""}</div>
        <button class="btn ghost sm" data-m="${i}" style="margin-top:6px;padding-left:0">Show example</button></div><span class="av">YOU</span></div>` : `
      <div class="msg"><span class="av">${l.who.slice(0, 2).toUpperCase()}</span><div class="bub"><div class="who">${l.who}</div>${l.t} ${G.sayBtn(l.t, "Listen")}</div></div>`).join("")}</div>
      ${R.extra ? `<div class="panel" style="display:grid;gap:6px;background:var(--brand-soft);border-color:transparent"><span class="eyebrow" style="color:var(--brand-dark)">Now switch roles</span><p>${R.extra}</p></div>` : ""}` + pager();
    stage.querySelectorAll("[data-m]").forEach(b => b.onclick = () => {
      const m = document.getElementById("m" + b.dataset.m); m.hidden = !m.hidden; b.textContent = m.hidden ? "Show example" : "Hide example";
    });
  }

  // ── Optional: spot the error ──
  function drawErrors() {
    const E = C.errors;
    stage.innerHTML = head(E.title || "Spot the error", E.text || "Tap the word that causes the problem.") + `<div class="panel errs">${E.items.map((e, i) => `
      <div class="err" data-i="${i}"><span class="n num">${i + 1}.</span><div style="display:grid;gap:8px;min-width:0">
        <div class="words">${e.sentence.split(/\s+/).map((w, k) => `<button type="button" class="w" data-k="${k}">${G.esc(w)}</button>`).join(" ")}</div>
        <div class="fixed" hidden><b>Better:</b> ${G.esc(e.fixed)} ${G.sayBtn(e.fixed, "Listen")}<p class="muted">${e.why || ""}</p></div></div></div>`).join("")}</div>` + pager();
    stage.querySelectorAll(".err").forEach(r => {
      const e = E.items[+r.dataset.i];
      r.querySelectorAll(".w").forEach(b => b.onclick = () => {
        if (r.classList.contains("solved")) return;
        const ok = +b.dataset.k === e.wrong;
        b.classList.add(ok ? "good" : "bad"); G.sfx(ok ? "ok" : "bad");
        if (ok) { r.classList.add("solved"); r.querySelector(".fixed").hidden = false; G.game && G.game.award(2, { once: "err." + C.id + "." + r.dataset.i, silent: true }); }
        else setTimeout(() => b.classList.remove("bad"), 600);
      });
    });
  }
  // ── Optional: say it in English ──
  function drawTranslate() {
    const T = C.translate;
    stage.innerHTML = head(T.title || "Say it in English", T.text || "Say each sentence in English out loud, then scratch to see the model.") + `<div class="panel trs">${T.items.map((t, i) => `
      <div class="tr" data-i="${i}"><span class="n num">${i + 1}.</span><div style="display:grid;gap:8px;min-width:0">
        ${t.cue ? `<p class="src">${G.esc(t.cue)}</p>` : `<p class="src" lang="es">${G.esc(t.es)}</p>`}
        <div class="model"><b>${G.esc(t.en)}</b> ${G.sayBtn(t.en, "Listen")} ${G.micBtn(t.en, "Say it")}${t.note ? `<p class="muted">${G.esc(t.note)}</p>` : ""}</div></div></div>`).join("")}</div>` + pager();
    stage.querySelectorAll(".tr").forEach(r => G.fx.scratch(r.querySelector(".model"), { label: "Show a natural version of sentence " + (+r.dataset.i + 1), hint: T.items[+r.dataset.i].cue ? "Scratch to see a natural version" : "Scratch to see the English", onReveal: () => G.game && G.game.award(1, { once: "tr." + C.id + "." + r.dataset.i, silent: true }) }));
  }
  // ── Optional: open conversation ──
  // ── Optional: warm-up (review the last lesson out loud) ──
  function drawWarmup() {
    const K = C.warmup;
    stage.innerHTML = head(K.title || "Warm-up", K.text || "Quick review before we start. Answer out loud.") + `
      <div class="panel" style="display:grid;gap:14px"><ol class="talkq">${K.questions.map(q => `<li><span>${G.esc(q)} ${G.sayBtn(q, "Listen")}</span></li>`).join("")}</ol></div>
      ${K.kit && K.kit.length ? `<div class="panel" style="display:grid;gap:10px"><span class="eyebrow">Remember</span><div class="bank">${K.kit.map(k => `<span>${G.esc(k)}</span>`).join("")}</div></div>` : ""}` + pager();
  }
  function drawTalk() {
    const K = C.talk, teacher = G.isTeacher || !!G.actingAs;
    stage.innerHTML = head(K.title || "Talk about it", K.text || "No right answers here. Speak freely and let your teacher correct as you go.") + `
      <div class="panel" style="display:grid;gap:14px">${G.voice && G.voice.ok ? `<p class="muted" style="font-size:.88em">Record your answers. Your teacher can listen to them later, and you’ll hear how much you improve.</p>` : ""}<ol class="talkq">${K.questions.map((q, i) => `<li><span>${G.esc(q)} ${G.sayBtn(q, "Listen")}</span>${G.voice && G.voice.ok ? `<div class="tq-rec" data-q="${i}"></div>` : ""}</li>`).join("")}</ol></div>
      ${K.kit && K.kit.length ? `<div class="panel" style="display:grid;gap:10px"><span class="eyebrow">Useful phrases</span><div class="bank">${K.kit.map(k => `<span>${G.esc(k)}</span>`).join("")}</div></div>` : ""}
      ${teacher && K.notes && K.notes.length ? `<div class="panel tnotes" style="display:grid;gap:8px"><span class="eyebrow">Teacher notes · only you see this</span><ul>${K.notes.map(n => `<li>${G.esc(n)}</li>`).join("")}</ul></div>` : ""}` + pager();
    stage.querySelectorAll(".tq-rec").forEach(box => {
      const q = K.questions[+box.dataset.q];
      G.recorder(box, { label: "Record your answer", max: 180, onDone: async (blob, secs, api) => {
        api.note("Saving…");
        try { const path = await G.voice.upload(blob, "lesson-" + C.id); await G.voice.save({ lesson_id: C.id, prompt: q.slice(0, 500), path, seconds: secs }); api.note("Saved for your teacher ✓"); G.game && G.game.award(3, { once: "rec." + C.id + "." + box.dataset.q, silent: true }); }
        catch (e) { api.note(/relation|schema|bucket|not found/i.test(e.message || "") ? "Recording works, but saving needs a quick setup from your teacher." : "Couldn’t save it. Check your internet and try again."); }
      } });
    });
  }

  // ── Debate lesson ──
  let tick = null;
  const dKey = k => "debate." + C.id + "." + k, dGet = (k, d) => G.store.get(dKey(k), d), dSet = (k, v) => G.store.set(dKey(k), v);
  const isTeacher = () => G.isTeacher || !!G.actingAs;
  const mmss = n => Math.floor(n / 60) + ":" + String(n % 60).padStart(2, "0");
  // A countdown with presets (prep, speech, rebuttal…). Big enough to share on screen.
  function timer(presets) {
    return `<div class="db-timer" data-left="${presets[0][1]}"><div class="db-clock" aria-live="off">${mmss(presets[0][1])}</div>
      <div class="db-pre">${presets.map(([l, n], i) => `<button type="button" class="${i ? "" : "on"}" data-t="${n}">${G.esc(l)} <small>${mmss(n)}</small></button>`).join("")}</div>
      <div class="db-ctl"><button type="button" class="btn primary sm" data-go>Start</button><button type="button" class="btn sm" data-reset>Reset</button></div></div>`;
  }
  function wireTimer(root) {
    const el = root.querySelector(".db-timer"); if (!el) return;
    const clock = el.querySelector(".db-clock"), go = el.querySelector("[data-go]");
    let full = +el.dataset.left, left = full, run = false;
    const paint = () => { clock.textContent = mmss(left); el.classList.toggle("low", run && left <= 10 && left > 0); el.classList.toggle("end", left === 0); };
    const stop = () => { run = false; clearInterval(tick); go.textContent = left ? "Start" : "Start"; };
    go.onclick = () => {
      if (run) { stop(); go.textContent = "Resume"; return; }
      if (!left) left = full;
      run = true; go.textContent = "Pause"; clearInterval(tick);
      tick = setInterval(() => { left = Math.max(0, left - 1); paint(); if (!left) { stop(); G.sfx && G.sfx("win"); } }, 1000);
      paint();
    };
    el.querySelector("[data-reset]").onclick = () => { stop(); left = full; paint(); };
    el.querySelectorAll("[data-t]").forEach(b => b.onclick = () => { stop(); full = left = +b.dataset.t; el.querySelectorAll("[data-t]").forEach(x => x.classList.toggle("on", x === b)); paint(); });
  }
  function recBox(box, prompt, key) {
    G.recorder(box, { label: "Record it", max: 180, onDone: async (blob, secs, api) => {
      api.note("Saving…");
      try { const path = await G.voice.upload(blob, "lesson-" + C.id); await G.voice.save({ lesson_id: C.id, prompt: prompt.slice(0, 500), path, seconds: secs }); api.note("Saved for your teacher ✓"); G.game && G.game.award(3, { once: "rec." + C.id + "." + key, silent: true }); }
      catch (e) { api.note("Couldn’t save it. Check your internet and try again."); }
    } });
  }
  // Hot takes: one statement at a time, agree or disagree, 30 seconds to say why
  function drawHot() {
    const H = DB.hot, seen = new Set(dGet("hot", []));
    let cur = dGet("hotCur", 0);
    stage.innerHTML = head("Hot takes", DB.hotText || "Agree or disagree, then give one reason and one example. Thirty seconds, no hedging.") + `
      <div class="db-hot"><div class="db-stmt" id="hotS"></div>
        <div class="db-row"><button type="button" class="btn sm" id="hotPrev">← Previous</button><button type="button" class="btn sm" id="hotRand">Surprise me</button><button type="button" class="btn primary sm" id="hotNext">Next take →</button></div></div>
      ${timer([["Answer", 30], ["Push back", 45]])}
      <div class="panel" style="display:grid;gap:10px"><span class="eyebrow">All the takes · tap one</span><ol class="db-list" id="hotL"></ol></div>` + pager();
    const show = () => {
      cur = (cur + H.length) % H.length; seen.add(cur); dSet("hotCur", cur); dSet("hot", [...seen]);
      stage.querySelector("#hotS").innerHTML = `<span class="eyebrow">Take ${cur + 1} of ${H.length}</span><p>${G.esc(H[cur])}</p>`;
      stage.querySelector("#hotL").innerHTML = H.map((h, i) => `<li><button type="button" data-h="${i}" class="${i === cur ? "on" : ""} ${seen.has(i) ? "seen" : ""}">${G.esc(h)}</button></li>`).join("");
      stage.querySelectorAll("[data-h]").forEach(b => b.onclick = () => { cur = +b.dataset.h; show(); });
    };
    stage.querySelector("#hotPrev").onclick = () => { cur--; show(); };
    stage.querySelector("#hotNext").onclick = () => { cur++; show(); };
    stage.querySelector("#hotRand").onclick = () => { const left = H.map((_, i) => i).filter(i => !seen.has(i) && i !== cur); cur = left.length ? left[Math.floor(Math.random() * left.length)] : Math.floor(Math.random() * H.length); show(); };
    show(); wireTimer(stage);
  }
  function drawKit() {
    stage.innerHTML = head("Debate toolkit", DB.kitText || "The phrases that make you sound like you've done this before. Pick two from each group and use them tonight.") + `
      <div class="db-kit">${DB.kit.map(g => `<section class="panel"><span class="eyebrow">${G.esc(g.t)}</span><ul>${g.p.map(x => `<li><span>${G.esc(x)}</span>${G.sayBtn ? G.sayBtn(x.replace(/…/g, "")) : ""}</li>`).join("")}</ul></section>`).join("")}</div>
      ${DB.kitTry ? `<div class="panel db-try"><span class="eyebrow">Try it now · 60 seconds</span><p>${G.esc(DB.kitTry)}</p>${timer([["Go", 60]])}</div>` : ""}` + pager();
    wireTimer(stage);
  }
  // A debate round: choose a motion, get a side, prepare, speak against the clock
  function drawRound(i) {
    const R = DB.rounds[i], k = "r" + i, teacher = isTeacher();
    let pick = Math.min(dGet(k + ".m", 0), R.motions.length - 1);
    stage.innerHTML = head(R.t, R.intro) + `
      <div class="db-format"><span class="eyebrow">Format · ${G.esc(R.kind)}</span><ol>${R.steps.map(([l, n, who]) => `<li><b>${G.esc(l)}</b><span>${mmss(n)}${who ? " · " + G.esc(who) : ""}</span></li>`).join("")}</ol></div>
      ${R.motions.length > 1 ? `<div class="db-tabs" role="tablist" aria-label="Choose a motion">${R.motions.map((m, j) => `<button type="button" role="tab" data-m="${j}">Motion ${"ABC"[j]}</button>`).join("")}</div>` : ""}
      <div id="mot"></div>
      ${timer(R.steps.map(([l, n]) => [l, n]).filter((x, j, a) => a.findIndex(y => y[0] === x[0]) === j))}
      <div class="panel" style="display:grid;gap:10px"><span class="eyebrow">Record your closing statement</span><p class="muted" style="margin:0;font-size:.92em">Say it again at home, cleaner and stronger. Your teacher will listen.</p><div class="db-rec"></div></div>` + pager();
    const paint = () => {
      const M = R.motions[pick], side = dGet(k + ".side." + pick, "");
      stage.querySelectorAll("[data-m]").forEach(b => { b.classList.toggle("on", +b.dataset.m === pick); b.setAttribute("aria-selected", +b.dataset.m === pick); });
      stage.querySelector("#mot").innerHTML = `<div class="db-motion"><span class="eyebrow">The motion</span><h3>${G.esc(M.m)}</h3>${M.ctx ? `<p>${G.esc(M.ctx)}</p>` : ""}</div>
        <div class="db-side">${R.swap
          ? `<p><b>First, in one sentence: what do you really think?</b> Then you argue the other side, as if you believed it.</p><div class="db-row"><button type="button" class="btn sm" data-s="against">I agree with it</button><button type="button" class="btn sm" data-s="for">I disagree with it</button></div>`
          : `<div class="db-row"><button type="button" class="btn sm" data-coin>Toss a coin for sides</button><button type="button" class="btn sm" data-s="for">I’ll argue for</button><button type="button" class="btn sm" data-s="against">I’ll argue against</button></div>`}
          ${side ? `<p class="db-you">You’re arguing <b>${side === "for" ? "FOR" : "AGAINST"}</b> the motion.${R.swap ? " Make it convincing." : ""}</p>` : ""}</div>
        <details class="db-ideas"><summary>Stuck? Starter ideas for both sides</summary><div class="db-cols"><div><b>For</b><ul>${M.for.map(x => `<li>${G.esc(x)}</li>`).join("")}</ul></div><div><b>Against</b><ul>${M.against.map(x => `<li>${G.esc(x)}</li>`).join("")}</ul></div></div></details>
        ${teacher && M.curve ? `<div class="panel tnotes" style="display:grid;gap:6px"><span class="eyebrow">Curveball · only you see this</span><p style="margin:0">${G.esc(M.curve)}</p>${(R.notes || []).length ? `<ul>${R.notes.map(n => `<li>${G.esc(n)}</li>`).join("")}</ul>` : ""}</div>` : ""}`;
      stage.querySelectorAll("[data-s]").forEach(b => b.onclick = () => { dSet(k + ".side." + pick, b.dataset.s); paint(); });
      const coin = stage.querySelector("[data-coin]"); if (coin) coin.onclick = () => { dSet(k + ".side." + pick, Math.random() < .5 ? "for" : "against"); paint(); };
    };
    stage.querySelectorAll("[data-m]").forEach(b => b.onclick = () => { pick = +b.dataset.m; dSet(k + ".m", pick); paint(); });
    paint(); wireTimer(stage);
    recBox(stage.querySelector(".db-rec"), "Closing statement: " + R.motions[pick].m, k);
  }
  function drawLight() {
    const Lt = DB.lightning; let cur = dGet("lightCur", 0);
    stage.innerHTML = head("Lightning round", DB.lightText || "Forty-five seconds, no preparation. Your teacher names the side, you start talking. Say “um” and you lose the point.") + `
      <div class="db-hot"><div class="db-stmt" id="ltS"></div>
        <div class="db-row"><button type="button" class="btn sm" data-side>Pick my side</button><button type="button" class="btn primary sm" id="ltNext">Next motion →</button></div><p class="db-you" id="ltSide" hidden></p></div>
      ${timer([["Speak", 45], ["Answer back", 30]])}
      <div class="panel" style="display:grid;gap:10px"><span class="eyebrow">All the motions · tap one</span><ol class="db-list" id="ltL"></ol></div>` + pager();
    const show = () => {
      cur = (cur + Lt.length) % Lt.length; dSet("lightCur", cur);
      stage.querySelector("#ltS").innerHTML = `<span class="eyebrow">Motion ${cur + 1} of ${Lt.length}</span><p>${G.esc(Lt[cur])}</p>`;
      stage.querySelector("#ltSide").hidden = true;
      stage.querySelector("#ltL").innerHTML = Lt.map((h, i) => `<li><button type="button" data-h="${i}" class="${i === cur ? "on" : ""}">${G.esc(h)}</button></li>`).join("");
      stage.querySelectorAll("#ltL [data-h]").forEach(b => b.onclick = () => { cur = +b.dataset.h; show(); });
    };
    stage.querySelector("#ltNext").onclick = () => { cur++; show(); };
    stage.querySelector("[data-side]").onclick = () => { const s = stage.querySelector("#ltSide"); s.hidden = false; s.innerHTML = `You’re arguing <b>${Math.random() < .5 ? "FOR" : "AGAINST"}</b>. Go!`; };
    show(); wireTimer(stage);
  }
  function drawVerdict() {
    const V = DB.verdict || {}, crit = V.criteria || ["Clarity", "Evidence", "Rebuttal", "Range of language"], sc = dGet("score", {});
    stage.innerHTML = head("The verdict", V.text || "Be honest. Score yourself from 1 to 5, then talk it through with your teacher.") + `
      <div class="panel db-rub">${crit.map((c, i) => `<div class="db-crit"><span><b>${G.esc(c)}</b>${V.hints && V.hints[i] ? `<small>${G.esc(V.hints[i])}</small>` : ""}</span><div class="db-sc" role="group" aria-label="${G.esc(c)}">${[1, 2, 3, 4, 5].map(n => `<button type="button" data-c="${i}" data-n="${n}" class="${sc[i] === n ? "on" : ""}" aria-pressed="${sc[i] === n}">${n}</button>`).join("")}</div></div>`).join("")}</div>
      ${(V.questions || []).length ? `<div class="panel" style="display:grid;gap:10px"><span class="eyebrow">Talk it through</span><ol class="db-qs">${V.questions.map(q => `<li>${G.esc(q)}</li>`).join("")}</ol></div>` : ""}
      ${C.plan && C.plan.homework ? `<div class="panel" style="display:grid;gap:6px"><span class="eyebrow">Homework</span><p style="margin:0">${G.esc(C.plan.homework)}</p></div>` : ""}
      <div class="db-row" style="justify-content:flex-end"><span class="muted" id="vOut"></span><button type="button" class="btn primary" id="vDone">${st.done.has(st.sec) ? "Class complete ✓" : "Finish the class"}</button></div>` + pager();
    stage.querySelectorAll("[data-c]").forEach(b => b.onclick = () => {
      const s = dGet("score", {}); s[b.dataset.c] = +b.dataset.n; dSet("score", s);
      stage.querySelectorAll(`[data-c="${b.dataset.c}"]`).forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b); });
    });
    stage.querySelector("#vDone").onclick = () => {
      G.store.set("debate." + C.id + ".at", new Date().toISOString());
      passLesson("Debate complete");
      stage.querySelector("#vDone").textContent = "Class complete ✓";
    };
  }

  // Finishing a game or a debate counts as passing the lesson: diploma, and the next car / horse / poster unlocks
  function passLesson(label) {
    SECS.forEach((_, i) => { if (!st.done.has(i)) markDone(i); });
    G.game && G.game.award(50, { once: "pass." + C.id, label });
    G.confetti && G.confetti(); G.sfx && G.sfx("win");
    if (G.store.get("diploma." + C.id, null)) return;
    G.store.set("diploma." + C.id, { ok: 1, n: 1, at: new Date().toISOString(), game: true });
    const CX = G.collection && G.style && G.style.reward === "garage" && G.collection.current(), got = CX && CX.byLesson(C.id);
    if (got) setTimeout(() => G.toast(`<b>New ${G.esc(CX.noun)} in your ${G.esc(CX.title.replace("Your ", ""))}: ${G.esc(got.name)}!</b><span><a href="${G.root || "../"}perfil.html#garage">Go to ${G.esc(CX.title.toLowerCase())}</a></span>`, "big"), 1600);
  }
  // ── Studio lesson: make a film with a budget ──
  const sKey = "studio." + C.id, M = n => "$" + (Math.round(n * 10) / 10).toLocaleString("en-US") + "M";
  const sState = () => Object.assign({ picks: {}, ev: {}, title: "", logline: "", tagline: "" }, G.store.get(sKey, {}) || {});
  const sSave = v => G.store.set(sKey, v);
  const sAll = () => { const m = {}; ST.stages.forEach(x => (x.slots || []).forEach(sl => sl.options.forEach(o => { m[sl.key + ":" + o.id] = Object.assign({ slot: sl.key }, o); }))); return m; };
  // Each game names its own stats and the card that gives the "fits" bonus (genre, team style…)
  const LB = () => Object.assign({ craft: "Craft", hype: "Star power", risk: "Risk", fit: "Fits your genre ✓", fitKey: "genre" }, ST.labels || {});
  const sEvents = () => (ST.stages.find(x => x.kind === "events") || { events: [] }).events;
  // A sequel remembers the first game: its title and its lead
  const prevOf = () => { if (!ST.prev) return null; const p = G.store.get("studio." + ST.prev.id, null); if (!p || !p.picks) return null;
    return { genreId: p.picks.genre || "", title: p.title || "", lead: (ST.prev.leads || {})[p.picks.lead] || "", genre: (ST.prev.genres || {})[p.picks.genre] || "" }; };
  const pick = (v, key) => { const o = sAll()[key + ":" + v.picks[key]] || null; if (!o || !o.ask) return o;
    const pv = o.ask === "leadName" ? (prevOf() || {}).lead : ""; return Object.assign({}, o, { name: (v[o.ask] || "").trim() || pv || o.name }); };
  function sCalc(v) {
    v = v || sState(); const all = sAll(), genre = v.picks[LB().fitKey];
    let cost = 0, craft = 0, hype = 0, risk = 0, fit = 0;
    for (const k in v.picks) {
      const o = all[k + ":" + v.picks[k]]; if (!o) continue;
      cost += o.cost || 0; craft += o.craft || 0; hype += o.hype || 0; risk += o.risk || 0;
      if (genre && (o.fit || []).includes(genre)) { craft += 1; fit++; }
    }
    sEvents().forEach(e => { const c = e.choices[v.ev[e.id]]; if (!c) return; cost += c.cost || 0; craft += c.craft || 0; hype += c.hype || 0; risk += c.risk || 0; });
    const B = ST.budget, over = Math.max(0, cost - B);
    const critics = Math.max(5, Math.min(98, Math.round(30 + craft * 2.2 - risk * 3 - over * 4)));
    const audience = Math.max(5, Math.min(98, Math.round(30 + hype * 4.5 + craft - risk * 1.5 - over * 2)));
    const box = Math.round(Math.max(1, cost) * (0.5 + audience / 38) * 10) / 10;
    return { cost: Math.round(cost * 10) / 10, left: Math.round((B - cost) * 10) / 10, craft, hype, risk, fit, over, critics, audience, box };
  }
  function budgetBar(r) {
    const pct = Math.min(100, r.cost / ST.budget * 100);
    return `<div class="gl-budget ${r.left < 0 ? "over" : ""}"><div class="gl-money"><span class="eyebrow">Budget left</span><b>${M(r.left)}</b><small>of ${M(ST.budget)} · spent ${M(r.cost)}</small></div>
      <i class="gl-bar" aria-hidden="true"><s style="width:${pct}%"></s></i>
      <div class="gl-stats"><span><b>${r.craft}</b>${LB().craft}</span><span><b>${r.hype}</b>${LB().hype}</span><span><b>${r.risk}</b>${LB().risk}</span></div></div>`;
  }
  const tagsOf = (o, genre) => { const l = LB(); return [o.craft ? `<i class="t-c">${l.craft} ${o.craft > 0 ? "+" : ""}${o.craft}</i>` : "", o.hype ? `<i class="t-h">${l.hype} ${o.hype > 0 ? "+" : ""}${o.hype}</i>` : "", o.risk ? `<i class="t-r">${l.risk} +${o.risk}</i>` : "",
    genre && (o.fit || []).includes(genre) ? `<i class="t-f">${l.fit}</i>` : ""].join(""); };
  function gCard(sl, o, v, r) {
    const on = v.picks[sl.key] === o.id, cur = sl.options.find(x => x.id === v.picks[sl.key]);
    const delta = (o.cost || 0) - (cur ? cur.cost || 0 : 0), ok = on || r.left - delta >= -0.001;
    return `<button type="button" class="gl-card${on ? " on" : ""}" data-slot="${sl.key}" data-opt="${o.id}" aria-pressed="${on}" ${ok ? "" : "disabled"}>
      <span class="gl-top"><b>${G.esc(o.name)}</b><span class="gl-cost${o.cost < 0 ? " pay" : ""}">${o.cost < 0 ? "+" + M(-o.cost) : o.cost ? M(o.cost) : "Free"}</span></span>
      ${o.role ? `<small class="gl-role">${G.esc(o.role)}</small>` : ""}<span class="gl-desc">${G.esc(o.desc)}</span>
      <span class="gl-tags">${tagsOf(o, sl.key === LB().fitKey ? "" : v.picks[LB().fitKey])}</span>${ok ? "" : `<span class="gl-no">Not enough budget: free up ${M(delta - r.left)}</span>`}${on ? `<span class="gl-on">Chosen ✓</span>` : ""}</button>`;
  }
  // Car designer (racing game): shape, two colours and the number, drawn live with the garage's cars
  const CAR0 = { shape: "f1", body: "#c8102e", accent: "#f5f5f5", num: "10" };
  const SW = ["#c8102e", "#ea580c", "#f5c518", "#0b5d3b", "#15803d", "#1d3f8f", "#0ea5e9", "#151515", "#f5f5f5", "#c0c6cc", "#c9a227", "#7c2d12"];
  const carOf = v => Object.assign({}, CAR0, v.design || {});
  function designer(v) {
    const d = carOf(v), shapes = G.garage ? Object.keys(G.garage.SHAPES) : [];
    const sw = k => `<div class="gd-sw" role="group" aria-label="${k === "body" ? "Main colour" : "Second colour"}">${SW.map(c => `<button type="button" data-c="${k}" data-v="${c}" class="${d[k] === c ? "on" : ""}" style="background:${c}" aria-label="${c}"></button>`).join("")}
      <label class="gd-pick" title="Any colour"><input type="color" data-cc="${k}" value="${d[k]}"><span>Any colour</span></label></div>`;
    return `<div class="panel gl-design"><span class="eyebrow">Design your car</span>
      <div class="gd-wrap"><div class="gd-prev" id="gdPrev">${G.garage ? G.garage.svg(d) : ""}</div>
        <div class="gd-ctl">
          <div><b>Shape</b><div class="gd-shapes">${shapes.map(k => `<button type="button" data-shape="${k}" class="${d.shape === k ? "on" : ""}">${k[0].toUpperCase() + k.slice(1)}</button>`).join("")}</div></div>
          <div><b>Main colour</b>${sw("body")}</div>
          <div><b>Second colour</b>${sw("accent")}</div>
          <label class="gd-num"><b>Number</b><input data-num inputmode="numeric" maxlength="2" value="${G.esc(d.num)}"></label>
        </div></div></div>`;
  }
  function wireDesigner() {
    const save = ch => { const w = sState(); w.design = Object.assign(carOf(w), ch); sSave(w); const pv = stage.querySelector("#gdPrev"); if (pv && G.garage) pv.innerHTML = G.garage.svg(w.design); return w.design; };
    stage.querySelectorAll("[data-shape]").forEach(b => b.onclick = () => { save({ shape: b.dataset.shape }); stage.querySelectorAll("[data-shape]").forEach(x => x.classList.toggle("on", x === b)); G.sfx && G.sfx("pop"); });
    stage.querySelectorAll("[data-c]").forEach(b => b.onclick = () => { save({ [b.dataset.c]: b.dataset.v }); stage.querySelectorAll(`[data-c="${b.dataset.c}"]`).forEach(x => x.classList.toggle("on", x === b)); const cc = stage.querySelector(`[data-cc="${b.dataset.c}"]`); if (cc) cc.value = b.dataset.v; });
    stage.querySelectorAll("[data-cc]").forEach(i => i.oninput = () => { save({ [i.dataset.cc]: i.value }); stage.querySelectorAll(`[data-c="${i.dataset.cc}"]`).forEach(x => x.classList.remove("on")); });
    const n = stage.querySelector("[data-num]"); if (n) n.oninput = () => { n.value = n.value.replace(/\D/g, "").slice(0, 2); save({ num: n.value || "0" }); };
  }
  function gTalk(x) {
    const t = isTeacher();
    return `<div class="panel gl-talk"><span class="eyebrow">Talk it through · ${G.esc(x.task || "Defend your choices to the producer")}</span><ol>${(x.talk || []).map(q => `<li>${G.esc(q)}</li>`).join("")}</ol>
      ${timer([["Pitch", 60], ["Defend", 90]])}
      ${t && (x.push || []).length ? `<div class="tnotes" style="display:grid;gap:6px"><span class="eyebrow">Producer’s pushback · only you see this</span><ul>${x.push.map(n => `<li>${G.esc(n)}</li>`).join("")}</ul></div>` : ""}</div>`;
  }
  const showIn = (i, v) => { if (!i.showIf) return true; const [k, val] = i.showIf.split("="); return !!v.picks[k] && (val === "*" || v.picks[k] === val); };
  function drawStage(x) {
    if (!x) return;
    const v = sState(), r = sCalc(v), y = window.scrollY;
    if (x.kind === "brief") return drawBrief(x, v, r);
    if (x.kind === "premiere") return ST.finale === "race" ? drawRace(x, v, r) : drawPremiere(x, v, r);
    stage.innerHTML = head(x.t, x.intro) + budgetBar(r) +
      (x.designer ? designer(v) : "") +
      ((x.inputs || []).filter(i => showIn(i, v)).length ? `<div class="panel gl-in">${x.inputs.filter(i => showIn(i, v)).map(i => `<label><span class="eyebrow">${G.esc(i.label)}</span>${i.long ? `<textarea data-in="${i.key}" maxlength="240" rows="2" placeholder="${G.esc(i.ph || "")}">${G.esc(v[i.key] || "")}</textarea>` : `<input data-in="${i.key}" maxlength="60" placeholder="${G.esc(i.ph || "")}" value="${G.esc(v[i.key] || (i.key === "leadName" && (prevOf() || {}).lead) || "")}">`}</label>`).join("")}</div>` : "") +
      (x.slots || []).map(sl => `<section class="gl-slot"><div class="gl-sh"><h3>${G.esc(sl.label)}</h3>${sl.hint ? `<small>${G.esc(sl.hint)}</small>` : ""}</div><div class="gl-grid">${sl.options.map(o => gCard(sl, o, v, r)).join("")}</div></section>`).join("") +
      (x.events || []).map(e => `<section class="gl-ev"><span class="eyebrow">${G.esc(e.when)}</span><h3>${G.esc(e.t)}</h3><p>${G.esc(e.text)}</p>
        <div class="gl-ch">${e.choices.map((c, i) => `<button type="button" class="gl-choice${v.ev[e.id] === i ? " on" : ""}" data-ev="${e.id}" data-i="${i}" aria-pressed="${v.ev[e.id] === i}"><b>${G.esc(c.t)}</b><span class="gl-tags">${c.cost ? `<i class="t-r">Costs ${M(c.cost)}</i>` : ""}${tagsOf(c, "")}</span></button>`).join("")}</div></section>`).join("") +
      gTalk(x) + pager();
    stage.querySelectorAll("[data-opt]").forEach(b => b.onclick = () => {
      const w = sState(); w.picks[b.dataset.slot] = w.picks[b.dataset.slot] === b.dataset.opt ? undefined : b.dataset.opt;
      if (!w.picks[b.dataset.slot]) delete w.picks[b.dataset.slot];
      sSave(w); G.sfx && G.sfx("pop"); drawStage(x); wirePager();
    });
    stage.querySelectorAll("[data-ev]").forEach(b => b.onclick = () => { const w = sState(); w.ev[b.dataset.ev] = +b.dataset.i; sSave(w); G.sfx && G.sfx("pop"); drawStage(x); wirePager(); });
    stage.querySelectorAll("[data-in]").forEach(i => i.oninput = () => { const w = sState(); w[i.dataset.in] = i.value.slice(0, 240); sSave(w); });
    if (x.designer) wireDesigner();
    wireTimer(stage); window.scrollTo(0, y);
  }
  function drawBrief(x, v, r) {
    stage.innerHTML = head(x.t, x.intro) + budgetBar(r) + `
      ${ST.prev ? (p => `<div class="panel gl-prev"><span class="eyebrow">Last time</span>${p && p.title ? `<p>You made <b>${G.esc(p.title)}</b>${p.genre ? ", a " + G.esc(p.genre.toLowerCase()) : ""}${p.lead ? `, starring <b>${G.esc(p.lead)}</b>` : ""}. It made money, and now the studio wants more.</p>` : `<p>${G.esc(ST.prev.none || "")}</p>`}</div>`)(prevOf()) : ""}
      <div class="panel gl-how"><span class="eyebrow">How it works</span><ol>${(ST.how || []).map(h => `<li>${G.esc(h)}</li>`).join("")}</ol></div>
      <div class="db-kit">${(ST.kit || []).map(g => `<section class="panel"><span class="eyebrow">${G.esc(g.t)}</span><ul>${g.p.map(p => `<li><span>${G.esc(p)}</span>${G.sayBtn ? G.sayBtn(p.replace(/…/g, "")) : ""}</li>`).join("")}</ul></section>`).join("")}</div>
      ${gTalk(x)}
      <div class="db-row" style="justify-content:flex-end"><button type="button" class="btn sm" id="glReset">Start a new film</button></div>` + pager();
    const rb = stage.querySelector("#glReset");
    rb.onclick = () => { if (!rb.dataset.sure) { rb.dataset.sure = "1"; rb.textContent = "Tap again to clear every choice"; return; } sSave({ picks: {}, ev: {}, title: "", logline: "", tagline: "" }); drawStage(x); wirePager(); };
    wireTimer(stage);
  }
  const firstName = () => String((G.actingAs && G.actingAs.name) || (G.profile && (G.profile.name || G.profile.nombre || G.profile.full_name)) || "").split(/\s+/)[0] || "";
  const SH = () => Object.assign({ cover: "poster", top: "{name} Pictures presents", topAnon: "A Lingua Pictures film", by: "Directed by {name}", byAnon: "A film by you",
    cast: ["lead", "support"], castLabel: "Starring", sub: ["genre", "setting"], nums: ["Critics", "Audiences", "Box office"],
    credits: [["writer", "Written by"], ["dp", "Cinematography"], ["editor", "Edited by"], ["music", "Music"], ["camera", "Shot on"], ["lens", "Lenses"], ["light", "Lighting"]],
    outlets: ["The Projector", "Frame by Frame", "The Lingua Review"], tagline: "Tagline for the poster", taglinePh: "One line that sells the film",
    verdicts: ["An instant classic", "The critics’ darling", "A box-office smash", "A flop", "A cult classic in the making", "A solid hit"],
    extra: ["A confident, grown-up film from a director to watch.", "There’s a good film in here somewhere. It just isn’t this cut.", "You won’t forget the last ten minutes."],
    done: ["Film finished ✓", "That’s a wrap: finish the class", "Film wrapped"], miss: "Go back and finish, or premiere it as it is." }, ST.show || {});
  function drawPremiere(x, v, r) {
    const nm = firstName(), S = SH(), prod = pick(v, "producer"), fill = t => t.replace("{name}", G.esc(nm)).replace("{producer}", prod ? G.esc(prod.name) : "you");
    const g = pick(v, LB().fitKey), cast = S.cast.map(k => pick(v, k)).filter(o => o && !String(o.id).startsWith("none")), lead = pick(v, S.cast[0]), sup = pick(v, S.cast[1] || "");
    const missing = ST.stages.flatMap(s => (s.slots || []).filter(sl => !v.picks[sl.key]).map(sl => sl.label)).concat(sEvents().filter(e => v.ev[e.id] == null).map(e => e.t));
    const profit = Math.round((r.box - r.cost) * 10) / 10, stars = Math.max(1, Math.round(r.critics / 20 * 2) / 2);
    const vd = S.verdicts, verdict = r.critics >= 80 && r.box >= r.cost * 2 ? vd[0] : r.critics >= 80 ? vd[1] : r.box >= r.cost * 2.5 ? vd[2] : r.critics < 50 && r.box < r.cost ? vd[3] : r.critics >= 65 && r.box < r.cost ? vd[4] : vd[5];
    // Reviews react to what was actually chosen
    const Q = [];
    (ST.reviews || []).forEach(q => { const k = q.if; let hit = false;
      if (k === "low") hit = r.critics < 50; else if (k === "high") hit = r.critics >= 80; else if (k === "risky") hit = r.risk >= 7; else if (k === "over") hit = r.left < 0; else if (k === "fit") hit = r.fit >= 5;
      else if (k.includes("=")) { const [a, b] = k.split("="); hit = a.startsWith("ev:") ? v.ev[a.slice(3)] === +b : v.picks[a] === b; }
      if (hit) Q.push(q.t.replace("{lead}", lead ? lead.name : "The lead").replace("{support}", sup ? sup.name : "the supporting cast").replace("{title}", v.title || "this record").replace("{feature}", (pick(v, "feature") || {}).name || "the guest").replace("{feature2}", (pick(v, "feature2") || {}).name || "the second guest")); });
    if (Q.length < 3) Q.push(r.critics >= 65 ? S.extra[0] : S.extra[1], S.extra[2]);
    const outlets = S.outlets;
    stage.innerHTML = head(x.t, x.intro) + (missing.length ? `<p class="gl-miss">Still to decide: ${missing.map(G.esc).join(", ")}. ${S.miss}</p>` : "") + `
      <div class="gl-prem${S.cover === "album" ? " sq" : ""}">
        <div class="${S.cover === "album" ? "gl-cover" : "gl-poster"} g-${(prevOf() || {}).genreId || (g ? g.id : "none")}"><span class="gp-k">${nm ? fill(S.top) : S.topAnon}</span><h2>${G.esc(v.title || "Untitled")}</h2>
          <p class="gp-tag">${G.esc(v.tagline || v.logline || "")}</p><p class="gp-cast">${cast.length ? S.castLabel + " " + cast.map(o => G.esc(o.name)).join(" · ") : ""}</p>
          <p class="gp-by">${nm || S.by.includes("{producer}") ? fill(S.by) : S.byAnon}</p><span class="gp-g">${S.sub.map(k => pick(v, k)).filter(Boolean).map(o => G.esc(o.name)).join(" · ")}</span></div>
        <div class="gl-score">
          <div class="gl-verd"><span class="eyebrow">The verdict</span><b>${verdict}</b></div>
          <div class="gl-nums"><div><b>${r.critics}%</b><span>${S.nums[0]}</span></div><div><b>${r.audience}%</b><span>${S.nums[1]}</span></div><div><b>${M(r.box)}</b><span>${S.nums[2]}</span></div><div><b class="${profit < 0 ? "neg" : ""}">${profit < 0 ? "−" : "+"}${M(Math.abs(profit))}</b><span>${profit < 0 ? "Loss" : "Profit"}</span></div></div>
          <dl class="gl-credits">${S.credits.map(([k, l]) => { const o = pick(v, k); return o ? `<div><dt>${l}</dt><dd>${G.esc(o.name)}</dd></div>` : ""; }).join("")}</dl>
          <div class="gl-revs">${Q.slice(0, 3).map((q, i) => `<blockquote><span class="gl-stars" aria-label="${stars} stars">${"★".repeat(Math.floor(stars))}${stars % 1 ? "½" : ""}</span><p>“${G.esc(q)}”</p><cite>${outlets[i]}</cite></blockquote>`).join("")}</div>
        </div>
      </div>
      <div class="panel gl-in"><label><span class="eyebrow">${S.tagline}</span><input data-in="tagline" maxlength="80" placeholder="${S.taglinePh}" value="${G.esc(v.tagline || "")}"></label></div>
      ${gTalk(x)}
      <div class="db-row" style="justify-content:flex-end"><button type="button" class="btn primary" id="glDone">${st.done.has(st.sec) ? S.done[0] : S.done[1]}</button></div>` + pager();
    const ti = stage.querySelector("[data-in='tagline']");
    ti.oninput = () => { const w = sState(); w.tagline = ti.value.slice(0, 80); sSave(w); stage.querySelector(".gp-tag").textContent = w.tagline || w.logline || ""; };
    stage.querySelector("#glDone").onclick = () => {
      passLesson(S.done[2]);
      stage.querySelector("#glDone").textContent = S.done[0];
    };
    wireTimer(stage);
  }

  // Race day: where your two drivers finish, points, fans and headlines
  function drawRace(x, v, r) {
    const F = ST.race, d1 = pick(v, "driver1"), d2 = pick(v, "driver2"), car0 = carOf(v), team = v.title || "Your team";
    const missing = ST.stages.flatMap(s => (s.slots || []).filter(sl => !v.picks[sl.key]).map(sl => sl.label)).concat(sEvents().filter(e => v.ev[e.id] == null).map(e => e.t));
    const p1 = Math.max(1, Math.min(18, Math.round(15 - r.craft * 0.85 + r.risk * 0.5 + Math.max(0, -r.left) * 1.5)));
    const dnf = r.risk >= 8;
    let p2 = Math.max(1, Math.min(19, p1 + 3 - ((d2 && d2.craft) || 0))); if (p2 === p1) p2++;
    const PTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1], pts = (PTS[p1 - 1] || 0) + (dnf ? 0 : PTS[p2 - 1] || 0);
    const verdict = p1 === 1 ? F.verdicts[0] : p1 <= 3 ? F.verdicts[1] : p1 <= 10 ? F.verdicts[2] : F.verdicts[3];
    const others = F.rivals.slice(), rows = [];
    for (let pos = 1; pos <= 12; pos++) {
      if (pos === p1) rows.push([pos, d1 ? d1.name : "Driver 1", team, true]);
      else if (pos === p2 && !dnf) rows.push([pos, d2 ? d2.name : "Driver 2", team, true]);
      else { const o = others.shift(); if (o) rows.push([pos, o[0], o[1], false]); }
    }
    const H = [];
    (ST.reviews || []).forEach(q => { const k = q.if; let hit = false;
      if (k === "win") hit = p1 === 1; else if (k === "podium") hit = p1 > 1 && p1 <= 3; else if (k === "low") hit = p1 > 10; else if (k === "dnf") hit = dnf; else if (k === "fans") hit = r.audience >= 75; else if (k === "over") hit = r.left < 0;
      else if (k.includes("=")) { const [a, b] = k.split("="); hit = a.startsWith("ev:") ? v.ev[a.slice(3)] === +b : v.picks[a] === b; }
      if (hit) H.push(q.t.replace("{d1}", d1 ? d1.name : "Your driver").replace("{d2}", d2 ? d2.name : "Your second driver").replace("{team}", team)); });
    if (H.length < 3) H.push(F.extra[0], F.extra[1]);
    const car = G.garage ? G.garage.svg(car0) : "";
    stage.innerHTML = head(x.t, x.intro) + (missing.length ? `<p class="gl-miss">Still to choose: ${missing.map(G.esc).join(", ")}. You can still race!</p>` : "") + `
      <div class="gl-prem">
        <div class="gl-team" style="--tb:${car0.body};--ta:${car0.accent}"><span class="gp-k">${G.esc(F.series)}</span><h2>${G.esc(team)}</h2><div class="gl-car">${car}</div>
          <p class="gp-cast">${[d1, d2].filter(Boolean).map(o => G.esc(o.name)).join(" · ")}</p><span class="gp-g">${G.esc(v.tagline || "")}</span></div>
        <div class="gl-score">
          <div class="gl-verd"><span class="eyebrow">${G.esc(F.track)}</span><b>${verdict}</b></div>
          <div class="gl-nums"><div><b>P${p1}</b><span>${G.esc(d1 ? d1.name.split(" ")[0] : "Driver 1")}</span></div><div><b>${dnf ? "Out" : "P" + p2}</b><span>${G.esc(d2 ? d2.name.split(" ")[0] : "Driver 2")}</span></div><div><b>${pts}</b><span>Points</span></div><div><b>${r.audience}%</b><span>Fans</span></div></div>
          <ol class="gl-res">${rows.map(([pos, n, t, me]) => `<li class="${me ? "me" : ""}"><b>${pos}</b><span>${G.esc(n)}</span><small>${G.esc(t)}</small></li>`).join("")}${dnf ? `<li class="me out"><b>–</b><span>${G.esc(d2 ? d2.name : "Driver 2")}</span><small>Out of the race</small></li>` : ""}</ol>
          <div class="gl-revs">${H.slice(0, 3).map((q, i) => `<blockquote><p>“${G.esc(q)}”</p><cite>${G.esc(F.outlets[i])}</cite></blockquote>`).join("")}</div>
        </div>
      </div>
      ${gTalk(x)}
      <div class="db-row" style="justify-content:flex-end"><button type="button" class="btn primary" id="glDone">${st.done.has(st.sec) ? "Race finished ✓" : "Finish the race and the class"}</button></div>` + pager();
    stage.querySelector("#glDone").onclick = () => {
      passLesson("Race finished");
      stage.querySelector("#glDone").textContent = "Race finished ✓";
    };
    wireTimer(stage);
  }

  // ── 5 Quiz final ──
  function drawFinal() {
    stage.innerHTML = head("Final quiz", `${C.final.length} questions from the whole lesson. Save the hard ones for review.`) + `<div id="qz"></div>` + pager();
    quiz = makeQuiz(stage.querySelector("#qz"), C.final, {
      label: "Final quiz result", badge: true,
      onDone: (ok, n) => {
        markDone(SECS.length - 1);
        const at = new Date().toISOString();
        G.store.set("score." + C.id, { ok, n, at });
        const tries = G.store.get("attempts." + C.id, []); tries.push({ ok, n, at }); G.store.set("attempts." + C.id, tries.slice(-50));
        const d = G.store.get("diploma." + C.id, null);
        if (ok / n >= .8) G.game && G.game.award(50, { once: "pass." + C.id, silent: true });
        if (ok / n >= .8 && !d) {
          G.store.set("diploma." + C.id, { ok, n, at }); setTimeout(() => { G.confetti(); G.sfx("win"); }, 650);
          const CX = G.collection && G.style.reward === "garage" && G.collection.current(), got = CX && CX.byLesson(C.id);
          if (got) setTimeout(() => G.toast(`<b>New ${G.esc(CX.noun)} in your ${G.esc(CX.title.replace("Your ", ""))}: ${G.esc(got.name)}!</b><span><a href="${G.root || "../"}perfil.html#garage">Go to ${G.esc(CX.title.toLowerCase())}</a></span>`, "big"), 1600);
          return true;
        }
        else if (d && ok > d.ok) G.store.set("diploma." + C.id, { ...d, ok, n });
        return false;
      }
    });
  }

  // ── Tools ──
  function toast(t) { G.toast(G.esc(t)); }
  function size(d) { const s = Math.max(.85, Math.min(1.4, +(G.store.get("textSize", 1) + d).toFixed(2))); G.store.set("textSize", s); document.documentElement.style.setProperty("--scale", s); }
  function toggleClass() {
    const on = document.body.classList.toggle("clase"), b = document.getElementById("classBtn");
    b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); G.store.set("modoClase", on);
  }
  document.getElementById("szUp").onclick = () => size(.1);
  document.getElementById("szDown").onclick = () => size(-.1);
  document.getElementById("classBtn").onclick = toggleClass;
  document.getElementById("copyRep").onclick = () => {
    const list = G.store.get(repKey, []);
    if (!list.length) { toast("Nothing saved yet"); return; }
    const txt = `Review · Lesson ${C.id} ${C.titulo}\n` + list.map(x => "• " + x).join("\n");
    navigator.clipboard.writeText(txt).then(() => toast("List copied"), () => toast("Couldn’t copy"));
  };
  if (G.store.get("modoClase", false)) toggleClass();
  // ── Present: clean full screen for sharing in class ──
  const pctl = document.createElement("div");
  pctl.className = "pctl"; pctl.innerHTML = `<button type="button" data-p="-1" aria-label="Previous section">←</button><span id="pctlT"></span><button type="button" data-p="1" aria-label="Next section">→</button><button type="button" data-p="x">Exit</button>`;
  document.body.appendChild(pctl);
  const pt = () => { const t = document.getElementById("pctlT"); if (t) t.textContent = (st.sec + 1) + " / " + SECS.length + " · " + SECS[st.sec].t; };
  function present(on) {
    document.body.classList.toggle("present", on);
    if (on && !document.body.classList.contains("clase")) toggleClass();
    try { if (on && document.documentElement.requestFullscreen && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {}); if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {}); } catch (e) {}
    pt(); window.scrollTo({ top: 0 });
  }
  document.getElementById("presentBtn").onclick = () => present(true);
  pctl.querySelectorAll("[data-p]").forEach(b => b.onclick = () => { if (b.dataset.p === "x") return present(false); if (over) { go(st.sec); return; } markDone(st.sec); go(st.sec + +b.dataset.p); pt(); });
  document.addEventListener("fullscreenchange", () => { if (!document.fullscreenElement && document.body.classList.contains("present")) present(false); });
  document.addEventListener("keydown", e => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT" || e.target.isContentEditable || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === "c") { toggleClass(); return; }
    if (k === "p") { present(!document.body.classList.contains("present")); return; }
    if (k === "escape" && document.body.classList.contains("present")) { present(false); return; }
    if (quiz && quiz.key(k)) { e.preventDefault(); return; }
    const pres = document.body.classList.contains("present");
    if ((e.shiftKey || pres) && k === "arrowright") { if (over) { go(st.sec); return; } markDone(st.sec); go(st.sec + 1); pt(); }
    if ((e.shiftKey || pres) && k === "arrowleft") { go(st.sec - 1); pt(); }
  });
  drawToc(); over ? drawOverview() : draw();
  document.getElementById("ovBtn").hidden = EMB;
  document.getElementById("ovBtn").onclick = () => { drawOverview(); document.querySelectorAll("#toc button").forEach(b => b.classList.remove("active")); };
  if (G.ready && G.ready.then) G.ready.then(() => drawToc()).catch(() => {});
  if (new URLSearchParams(location.search).get("present") === "1") setTimeout(() => present(true), 0);
  if (G.decorate) G.decorate();
  if (G.theme && G.theme.mount) G.theme.mount();
  if (G.menu && G.menu.mount) G.menu.mount();
})();
