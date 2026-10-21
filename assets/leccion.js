// Lingua lesson player (all UI in English). Each lesson defines window.CLASE and loads this file.
(function () {
  const C = window.CLASE, G = window.LINGUA, AB = "ABCD";
  // Five core sections, plus optional ones a lesson can bring (spot the error, say it in English, talk about it)
  const SECS = [
    { id: "flash", t: "Vocabulary", min: 10 },
    { id: "frases", t: "Sound natural", min: 10 },
    { id: "gaps", t: "Fill in the gaps", min: 10 },
    ...(C.errors && C.errors.items && C.errors.items.length ? [{ id: "errors", t: "Spot the error", min: 10 }] : []),
    ...(C.translate && C.translate.items && C.translate.items.length ? [{ id: "translate", t: "Say it in English", min: 10 }] : []),
    { id: "rp", t: "Role‑play", min: 15 },
    ...(C.talk && C.talk.questions && C.talk.questions.length ? [{ id: "talk", t: "Over to you", min: 15 }] : []),
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
    try { pt(); } catch (e) {}
  }
  function markDone(i) {
    const first = !st.done.has(i);
    st.done.add(i); G.store.set("done." + C.id, [...st.done]); drawToc();
    if (first && G.game) { G.game.award(20, { once: "sec." + C.id + "." + i, label: "Section complete" }); G.sfx("pop"); }
  }
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
    ({ flash: drawFlash, frases: drawFrases, gaps: drawGaps, errors: drawErrors, translate: drawTranslate, rp: drawRP, talk: drawTalk, final: drawFinal })[SECS[st.sec].id]();
    wirePager();
  }

  // ── 1 Vocabulario ──
  function drawFlash() {
    stage.innerHTML = head("Lesson vocabulary", "Read each word out loud and say what you think it means. Click a card to see the answer.") +
      `<div class="flash-grid">${C.flash.map((f, i) => `
        <div class="flash" role="button" tabindex="0" aria-label="${G.esc(f.en)}. Flip card" data-i="${i}"><div class="in">
          <div class="face"><div class="ftop"><span class="chip">${f.tag}</span>${G.sayBtn(f.en, "Listen: " + f.en)}</div>${f.img ? `<span class="fimg" aria-hidden="true">${f.img}</span>` : ""}<span class="word">${f.en}</span><span class="tap">Tap to flip</span></div>
          <div class="face back"><span class="es">${f.def}</span><span class="ex">${f.ex}</span><div class="fbot">${G.sayBtn(f.ex, "Listen to the example")}</div></div>
        </div></div>`).join("")}</div>` + pager();
    stage.querySelectorAll(".flash").forEach(b => {
      const flip = () => { b.classList.toggle("flip"); G.game && G.game.award(2, { once: "flip." + C.id + "." + b.dataset.i, silent: true }); };
      b.onclick = e => { if (!e.target.closest("[data-say]")) flip(); };
      b.onkeydown = e => { if ((e.key === "Enter" || e.key === " ") && !e.target.closest("[data-say]")) { e.preventDefault(); flip(); } };
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
      if (o.onDone) o.onDone(ok, qs.length);
      if (G.game && ok) G.game.award(ok * (o.badge ? 3 : 2), { label: o.label + " · " + ok + " right" });
      const msg = p >= 80 ? "Excellent! You’re ready for the next lesson." : p >= 50 ? "Good job! Review your mistakes and try again." : "Let’s review this together in the next class.";
      el.innerHTML = `<div class="panel" style="display:grid;gap:20px">
        <div class="result">
          <div class="score-ring" style="background:conic-gradient(${p >= 80 ? "var(--ok)" : "var(--brand)"} ${p}%, var(--line) 0)"><div><span><b class="num">${ok}/${qs.length}</b><br><span class="muted" style="font-size:.8em">${p}%</span></span></div></div>
          <div style="display:grid;gap:6px"><span class="eyebrow">${o.label}</span><h3 style="font-size:1.35em;font-weight:800">${msg}</h3>
            ${o.badge && p >= 80 ? `<div class="badge-earned"><svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="17" r="13" fill="#f5c518"/><circle cx="20" cy="17" r="9" fill="none" stroke="#3a2c00" stroke-width="1.6" stroke-dasharray="2 2.2"/><path d="M14.5 17.5l3.6 3.4 7.4-7.4" fill="none" stroke="#3a2c00" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 27l-3 9 5-2 3 4 2-8M27 27l3 9-5-2-3 4-2-8" fill="#2346d0"/></svg><span><b>Diploma unlocked</b><br><span class="muted">Lesson ${C.id} · ${C.titulo} · <a href="../diplomas.html#d${C.id}">View your diploma</a></span></span></div>` : ""}</div>
        </div>
        ${wrong.length ? `<div style="display:grid;gap:8px"><span class="eyebrow">Correct answers to review</span>${wrong.map(q => `<div class="feedback bad" style="padding:10px 14px"><div>${q.p.replace("___", "<b style='display:inline'>" + q.a + "</b>")}</div>${G.sayBtn(/___/.test(q.p) ? q.p.replace("___", q.a) : q.a)}</div>`).join("")}<p class="muted" style="font-size:.88em">We added ${wrong.length === 1 ? "this question" : "these " + wrong.length + " questions"} to your <a href="../review.html">Review</a> list.</p></div>` : ""}
        <div class="actions"><button class="btn" data-a="again">Try again</button>${wrong.length ? `<a class="btn ghost" href="../review.html">Practice my mistakes</a>` : ""}</div></div>`;
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
    stage.innerHTML = head(T.title || "Say it in English", T.text || "Say each sentence in English out loud, then show the model.") + `<div class="panel trs">${T.items.map((t, i) => `
      <div class="tr" data-i="${i}"><span class="n num">${i + 1}.</span><div style="display:grid;gap:8px;min-width:0">
        <p class="src" lang="es">${G.esc(t.es)}</p>
        <div class="model" hidden><b>${G.esc(t.en)}</b> ${G.sayBtn(t.en, "Listen")} ${G.micBtn(t.en, "Say it")}${t.note ? `<p class="muted">${G.esc(t.note)}</p>` : ""}</div>
        <button type="button" class="btn ghost sm" data-show style="justify-self:start;padding-left:0">Show the English</button></div></div>`).join("")}</div>` + pager();
    stage.querySelectorAll(".tr").forEach(r => r.querySelector("[data-show]").onclick = (ev) => {
      const m = r.querySelector(".model"); m.hidden = !m.hidden; ev.target.textContent = m.hidden ? "Show the English" : "Hide";
      if (!m.hidden) G.game && G.game.award(1, { once: "tr." + C.id + "." + r.dataset.i, silent: true });
    });
  }
  // ── Optional: open conversation ──
  function drawTalk() {
    const K = C.talk, teacher = G.isTeacher || !!G.actingAs;
    stage.innerHTML = head(K.title || "Talk about it", K.text || "No right answers here. Speak freely and let your teacher correct as you go.") + `
      <div class="panel" style="display:grid;gap:14px"><ol class="talkq">${K.questions.map(q => `<li>${G.esc(q)} ${G.sayBtn(q, "Listen")}</li>`).join("")}</ol></div>
      ${K.kit && K.kit.length ? `<div class="panel" style="display:grid;gap:10px"><span class="eyebrow">Useful phrases</span><div class="bank">${K.kit.map(k => `<span>${G.esc(k)}</span>`).join("")}</div></div>` : ""}
      ${teacher && K.notes && K.notes.length ? `<div class="panel tnotes" style="display:grid;gap:8px"><span class="eyebrow">Teacher notes · only you see this</span><ul>${K.notes.map(n => `<li>${G.esc(n)}</li>`).join("")}</ul></div>` : ""}` + pager();
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
        if (ok / n >= .8 && !d) { G.store.set("diploma." + C.id, { ok, n, at }); setTimeout(() => { G.confetti(); G.sfx("win"); }, 250); }
        else if (d && ok > d.ok) G.store.set("diploma." + C.id, { ...d, ok, n });
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
  pctl.querySelectorAll("[data-p]").forEach(b => b.onclick = () => { if (b.dataset.p === "x") return present(false); markDone(st.sec); go(st.sec + +b.dataset.p); pt(); });
  document.addEventListener("fullscreenchange", () => { if (!document.fullscreenElement && document.body.classList.contains("present")) present(false); });
  document.addEventListener("keydown", e => {
    if (e.target.tagName === "INPUT" || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === "c") { toggleClass(); return; }
    if (k === "p") { present(!document.body.classList.contains("present")); return; }
    if (k === "escape" && document.body.classList.contains("present")) { present(false); return; }
    if (quiz && quiz.key(k)) { e.preventDefault(); return; }
    const pres = document.body.classList.contains("present");
    if ((e.shiftKey || pres) && k === "arrowright") { markDone(st.sec); go(st.sec + 1); pt(); }
    if ((e.shiftKey || pres) && k === "arrowleft") { go(st.sec - 1); pt(); }
  });
  drawToc(); draw();
  if (new URLSearchParams(location.search).get("present") === "1") setTimeout(() => present(true), 0);
  if (G.decorate) G.decorate();
  if (G.theme && G.theme.mount) G.theme.mount();
  if (G.menu && G.menu.mount) G.menu.mount();
})();
