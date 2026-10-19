// Lingua lesson player (all UI in English). Each lesson defines window.CLASE and loads this file.
(function () {
  const C = window.CLASE, G = window.LINGUA, AB = "ABCD";
  const SECS = [
    { id: "flash", t: "Vocabulary", min: 10 },
    { id: "frases", t: "Sound natural", min: 10 },
    { id: "gaps", t: "Fill in the gaps", min: 10 },
    { id: "rp", t: "Role‑play", min: 15 },
    { id: "final", t: "Final quiz", min: 15 }
  ];
  const st = { sec: G.store.get("sec." + C.id, 0), done: new Set(G.store.get("done." + C.id, [])) };
  const repKey = "repaso." + C.id;
  let quiz = null;

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
        <button class="toggle" id="classBtn" aria-pressed="false"><span class="sw"></span>Class mode <span class="kbd">C</span></button>
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
          <div class="instructor"><span class="in">${G.maestro[0]}</span><span style="font-size:.88em"><span class="muted">Instructor</span><br><b>${G.maestro}</b></span></div>
        </div>
        <h3>Lesson content</h3>
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
  function drawToc() {
    document.getElementById("toc").innerHTML = SECS.map((s, i) => `
      <li><button class="${i === st.sec ? "active" : ""} ${st.done.has(i) ? "done" : ""}" data-i="${i}" aria-current="${i === st.sec ? "step" : "false"}">
        <span class="box"></span><span><span class="t">${i + 1}. ${s.t}</span><span class="m">${s.min} min</span></span>
      </button></li>`).join("");
    document.querySelectorAll("#toc button").forEach(b => b.onclick = () => go(+b.dataset.i));
    const n = st.done.size, pct = n / SECS.length * 100;
    document.getElementById("ring").innerHTML = `<span style="width:30px;height:30px;border-radius:50%;background:conic-gradient(var(--brand) ${pct}%, var(--line) 0);display:grid;place-items:center"><span style="width:22px;height:22px;border-radius:50%;background:var(--surface)"></span></span>${n} of ${SECS.length} complete`;
    drawFlags();
  }
  function drawFlags() {
    const list = G.store.get(repKey, []);
    document.getElementById("flags").innerHTML = list.length ? list.map(x => `<div>${x}</div>`).join("")
      : `<p class="muted" style="font-size:.88em">Press <span class="kbd">M</span> on a question to save it here.</p>`;
  }
  function go(i) {
    st.sec = Math.max(0, Math.min(SECS.length - 1, i));
    G.store.set("sec." + C.id, st.sec);
    drawToc(); draw(); window.scrollTo({ top: 0 });
  }
  function markDone(i) { st.done.add(i); G.store.set("done." + C.id, [...st.done]); drawToc(); }
  function head(title, text) {
    return `<div class="sec-head"><span class="eyebrow">Section ${st.sec + 1} of ${SECS.length} · ${SECS[st.sec].min} min</span><h2>${title}</h2>${text ? `<p>${text}</p>` : ""}</div>`;
  }
  function pager() {
    const i = st.sec;
    return `<div class="pager">
      ${i > 0 ? `<button class="btn" data-prev>← ${SECS[i - 1].t}</button>` : `<a class="btn" href="../index.html">← My learning</a>`}
      ${i < SECS.length - 1 ? `<button class="btn primary" data-next>Next: ${SECS[i + 1].t} →</button>` : `<a class="btn primary" href="../index.html">Finish lesson</a>`}
    </div>`;
  }
  function wirePager() {
    const p = stage.querySelector("[data-prev]"), n = stage.querySelector("[data-next]");
    if (p) p.onclick = () => go(st.sec - 1);
    if (n) n.onclick = () => { markDone(st.sec); go(st.sec + 1); };
  }
  function draw() {
    quiz = null;
    ({ flash: drawFlash, frases: drawFrases, gaps: drawGaps, rp: drawRP, final: drawFinal })[SECS[st.sec].id]();
    wirePager();
  }

  // ── 1 Vocabulario ──
  function drawFlash() {
    stage.innerHTML = head("Lesson vocabulary", "Read each word out loud and say what you think it means. Click a card to see the answer.") +
      `<div class="flash-grid">${C.flash.map(f => `
        <button class="flash" aria-label="${f.en}"><div class="in">
          <div class="face"><span class="chip" style="align-self:flex-start">${f.tag}</span><span class="word">${f.en}</span><span class="tap">Click to flip</span></div>
          <div class="face back"><span class="es">${f.def}</span><span class="ex">${f.ex}</span></div>
        </div></button>`).join("")}</div>` + pager();
    stage.querySelectorAll(".flash").forEach(b => b.onclick = () => b.classList.toggle("flip"));
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
    function reveal() { if (sel == null) return; shown = true; res[i] = sel === qs[i].correct; paint(); }
    function next() { if (i < qs.length - 1) { i++; sel = null; shown = false; paint(); } else { fin = true; summary(); } }
    function flag() {
      const q = qs[i], list = G.store.get(repKey, []), line = q.p.replace("___", q.a);
      if (flags.has(i)) { flags.delete(i); G.store.set(repKey, list.filter(x => x !== line)); toast("Removed from review"); }
      else { flags.add(i); if (!list.includes(line)) list.push(line); G.store.set(repKey, list); toast("Saved for review"); }
      drawFlags(); paint();
    }
    function paint() {
      const q = qs[i];
      el.innerHTML = `<div class="panel q">
        <div class="q-head"><span class="eyebrow">Question ${i + 1} of ${qs.length}</span>
          <div class="steps" aria-hidden="true">${qs.map((_, k) => `<span class="${k === i ? "cur" : res[k] === true ? "ok" : res[k] === false ? "bad" : ""} ${flags.has(k) ? "flag" : ""}"></span>`).join("")}</div></div>
        <div class="q-title">${q.p.replace("___", '<span class="gap">&nbsp;</span>')}</div>
        <div class="opts" role="radiogroup">${q.opts.map((t, k) => {
          let c = ""; if (shown) { if (k === q.correct) c = "ok"; else if (k === sel) c = "bad"; } else if (k === sel) c = "sel";
          return `<button class="opt ${c}" data-k="${k}" role="radio" aria-checked="${k === sel}" ${shown ? "disabled" : ""}><span class="radio"></span><span>${t}</span><span class="letter">${k + 1}</span></button>`;
        }).join("")}</div>
        ${shown ? `<div class="feedback ${res[i] ? "ok" : "bad"}"><div><b>${res[i] ? "Correct!" : "Not quite."}</b>${q.why}</div></div>` : ""}
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
      if (o.onDone) o.onDone(ok, qs.length);
      const msg = p >= 80 ? "Excellent! You’re ready for the next lesson." : p >= 50 ? "Good job! Review your mistakes and try again." : "Let’s review this together in the next class.";
      el.innerHTML = `<div class="panel" style="display:grid;gap:20px">
        <div class="result">
          <div class="score-ring" style="background:conic-gradient(${p >= 80 ? "var(--ok)" : "var(--brand)"} ${p}%, var(--line) 0)"><div><span><b class="num">${ok}/${qs.length}</b><br><span class="muted" style="font-size:.8em">${p}%</span></span></div></div>
          <div style="display:grid;gap:6px"><span class="eyebrow">${o.label}</span><h3 style="font-size:1.35em;font-weight:800">${msg}</h3>
            ${o.badge && p >= 80 ? `<div class="badge-earned"><svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="17" r="13" fill="#f5c518"/><circle cx="20" cy="17" r="9" fill="none" stroke="#3a2c00" stroke-width="1.6" stroke-dasharray="2 2.2"/><path d="M14.5 17.5l3.6 3.4 7.4-7.4" fill="none" stroke="#3a2c00" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 27l-3 9 5-2 3 4 2-8M27 27l3 9-5-2-3 4-2-8" fill="#2346d0"/></svg><span><b>Badge unlocked</b><br><span class="muted">Lesson ${C.id} · ${C.titulo}</span></span></div>` : ""}</div>
        </div>
        ${wrong.length ? `<div style="display:grid;gap:8px"><span class="eyebrow">Correct answers to review</span>${wrong.map(q => `<div class="feedback bad" style="padding:10px 14px"><div>${q.p.replace("___", "<b style='display:inline'>" + q.a + "</b>")}</div></div>`).join("")}</div>` : ""}
        <div class="actions"><button class="btn" data-a="again">Try again</button></div></div>`;
      el.querySelector('[data-a="again"]').onclick = () => { res.fill(null); i = 0; sel = null; shown = false; fin = false; paint(); };
    }
    paint(); return api;
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
        r.querySelector(".fix").textContent = good ? "✓" : "→ " + g.a[0];
        r.querySelector(".note").textContent = good ? "" : g.note || "";
      });
      document.getElementById("gs").textContent = ok + " of " + it.length + " correct";
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
      <div class="msg you"><div class="bub"><div class="who">You</div><div class="cue">${l.cue}</div><div class="model" hidden id="m${i}">${l.model}</div>
        <button class="btn ghost sm" data-m="${i}" style="margin-top:6px;padding-left:0">Show example</button></div><span class="av">YOU</span></div>` : `
      <div class="msg"><span class="av">${l.who.slice(0, 2).toUpperCase()}</span><div class="bub"><div class="who">${l.who}</div>${l.t}</div></div>`).join("")}</div>
      ${R.extra ? `<div class="panel" style="display:grid;gap:6px;background:var(--brand-soft);border-color:transparent"><span class="eyebrow" style="color:var(--brand-dark)">Now switch roles</span><p>${R.extra}</p></div>` : ""}` + pager();
    stage.querySelectorAll("[data-m]").forEach(b => b.onclick = () => {
      const m = document.getElementById("m" + b.dataset.m); m.hidden = !m.hidden; b.textContent = m.hidden ? "Show example" : "Hide example";
    });
  }

  // ── 5 Quiz final ──
  function drawFinal() {
    stage.innerHTML = head("Final quiz", `${C.final.length} questions from the whole lesson. Save the hard ones for review.`) + `<div id="qz"></div>` + pager();
    quiz = makeQuiz(stage.querySelector("#qz"), C.final, {
      label: "Final quiz result", badge: true,
      onDone: (ok, n) => { markDone(4); G.store.set("score." + C.id, { ok, n }); }
    });
  }

  // ── Tools ──
  function toast(t) { const d = document.createElement("div"); d.className = "toast"; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 1600); }
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
  document.addEventListener("keydown", e => {
    if (e.target.tagName === "INPUT" || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === "c") { toggleClass(); return; }
    if (quiz && quiz.key(k)) { e.preventDefault(); return; }
    if (e.shiftKey && k === "arrowright") go(st.sec + 1);
    if (e.shiftKey && k === "arrowleft") go(st.sec - 1);
  });
  drawToc(); draw();
  if (G.decorate) G.decorate();
  if (G.theme && G.theme.mount) G.theme.mount();
})();
