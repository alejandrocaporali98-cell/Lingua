// Lingua progress report: computes a student's analytics (teacher panel) and renders the report
// (teacher preview and the public informe.html page). Strings in English and Spanish.
(function () {
  const R = window.LinguaReport = {};
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const pad = n => String(n).padStart(2, "0");
  const dkey = d => { const x = new Date(d); return x.getFullYear() + "-" + pad(x.getMonth() + 1) + "-" + pad(x.getDate()); };
  const monday = d => { const x = new Date(d); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
  const pct = a => Math.round(a.ok / a.n * 100);

  // ── Period ──
  R.periods = ["30", "90", "month", "prev", "all"];
  R.range = function (p, now) {
    now = now || new Date(); const to = new Date(now); to.setHours(23, 59, 59, 999);
    let from;
    if (p === "month") from = new Date(now.getFullYear(), now.getMonth(), 1);
    else if (p === "prev") { from = new Date(now.getFullYear(), now.getMonth() - 1, 1); to.setTime(new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999).getTime()); }
    else if (p === "all") from = new Date(2020, 0, 1);
    else { from = new Date(now); from.setDate(from.getDate() - (+p || 30) + 1); from.setHours(0, 0, 0, 0); }
    return { from, to };
  };

  // ── Compute (teacher side). s = student from the panel; ctx = { classes, homework, areas, analyzePlacement } ──
  R.compute = function (s, period, ctx) {
    const { from, to } = R.range(period), inP = d => { if (!d) return false; const t = new Date(d); return t >= from && t <= to; };
    const span = to - from, prevFrom = new Date(from - span), prevIn = d => { const t = new Date(d); return t >= prevFrom && t < from; };
    const get = s.get, g = get("game", null) || { days: {} }, days = g.days || {};
    const attempts = s.rows.flatMap(r => (get("attempts." + r.l.id, []) || []).filter(a => a && a.at).map(a => ({ ...a, l: r.l })));
    const inAtt = attempts.filter(a => inP(a.at)).sort((a, b) => a.at.localeCompare(b.at));
    const avg = list => list.length ? Math.round(list.reduce((t, a) => t + a.ok / a.n, 0) / list.length * 100) : null;
    const practice = Object.keys(days).filter(k => days[k] > 0 && inP(k + "T12:00")), prevPractice = Object.keys(days).filter(k => days[k] > 0 && prevIn(k + "T12:00"));
    const xp = Object.keys(days).filter(k => inP(k + "T12:00")).reduce((t, k) => t + days[k], 0);
    const cls = (ctx.classes || []).filter(c => c.student_id === s.p.id && inP(c.starts_at));
    const hw = (ctx.homework || []).filter(h => h.student_id === s.p.id && (inP(h.created_at) || inP(h.done_at)));
    const passedIn = s.rows.filter(r => { const d = get("diploma." + r.l.id, null); return d && inP(d.at); });
    const counters = get("counters", {}) || {};
    // trend: average score second half vs first half of the period's attempts
    const half = Math.floor(inAtt.length / 2), tr = inAtt.length >= 4 ? avg(inAtt.slice(half)) - avg(inAtt.slice(0, half)) : null;
    // weekly XP (last 12 weeks of the period)
    const wk = []; let w = monday(to); for (let i = 0; i < 12; i++) { const ws = new Date(w); if (ws < monday(from) && period !== "all") break; let t = 0; for (let k = 0; k < 7; k++) { const d = new Date(ws); d.setDate(ws.getDate() + k); t += days[dkey(d)] || 0; } wk.unshift([dkey(ws).slice(5), t]); w.setDate(w.getDate() - 7); }
    // attendance by month
    const am = {}; cls.forEach(c => { const m = dkey(c.starts_at).slice(0, 7); am[m] = am[m] || [0, 0]; if (c.status === "attended") am[m][0]++; if (c.status === "missed") am[m][1]++; });
    const att = Object.keys(am).sort().slice(-6).map(m => [m, am[m][0], am[m][1]]);
    // topics: lessons touched
    const tp = s.rows.filter(r => r.done || r.tries).map(r => { const d = get("diploma." + r.l.id, null); return [r.l.id, r.l.titulo, r.done, r.l.secs || 5, r.best ? pct(r.best) : null, d ? dkey(d.at) : null]; });
    // review queue by lesson
    const rv = {}; s.review.forEach(q => { const id = String(q.l || "").split(".")[0]; (rv[id] = rv[id] || []).push(q); });
    const titleOf = id => { const r = s.rows.find(x => x.l.id === id); return r ? r.l.titulo : "Lesson " + id; };
    // placement areas
    const pl = s.placement, A = pl && pl.r && ctx.analyzePlacement ? ctx.analyzePlacement(pl.r) : null;
    const st = [], op = [];
    s.rows.filter(r => r.best && pct(r.best) >= 90).sort((a, b) => pct(b.best) - pct(a.best)).slice(0, 4).forEach(r => st.push(["lesson", r.l.titulo, pct(r.best)]));
    if (A) A.strengths.slice(0, 3).forEach(a => st.push(["area", a.key, a.pct]));
    if ((counters.spoken || 0) >= 5) st.push(["spoken", counters.spoken]);
    if ((counters.dictation || 0) >= 5) st.push(["dict", counters.dictation]);
    if (practice.length >= 8) st.push(["habit", practice.length]);
    s.rows.filter(r => r.last && pct(r.last) < 80 && !(r.best && pct(r.best) >= 80)).forEach(r => op.push(["lesson", r.l.titulo, pct(r.last)]));
    Object.keys(rv).sort((a, b) => rv[b].length - rv[a].length).slice(0, 3).forEach(id => op.push(["review", titleOf(id), rv[id].length, String(rv[id][0].p || "").replace("___", "…" + (rv[id][0].a || "") + "…").slice(0, 110)]));
    if (A) A.focus.slice(0, 3).forEach(a => op.push(["area", a.key, a.pct]));
    const weeks = Math.max(1, Math.round((to - from) / (7 * 864e5)));
    if (period !== "all" && practice.length < weeks * 2) op.push(["habit", practice.length, weeks]);
    const overdue = (ctx.homework || []).filter(h => h.student_id === s.p.id && !h.done_at && h.due && h.due < dkey(new Date())).length;
    if (overdue) op.push(["hw", overdue]);
    const nt = cls.filter(c => c.status === "attended" && (c.notes || c.words)).sort((a, b) => a.starts_at.localeCompare(b.starts_at)).slice(-8).map(c => [dkey(c.starts_at), (c.notes || "").slice(0, 220), (c.words || "").slice(0, 140)]);
    const words = cls.reduce((t, c) => t + (c.words ? c.words.split(",").filter(x => x.trim()).length : 0), 0);
    return {
      v: 1, n: s.p.display_name || "Student", g: new Date().toISOString(), p: period, f: dkey(from), t: dkey(to), lv: pl ? pl.nivel : null,
      k: { cls: [cls.filter(c => c.status === "attended").length, cls.filter(c => c.status === "missed").length], days: practice.length, pdays: prevPractice.length,
        passed: passedIn.length, lessons: s.rows.length, done: s.rows.filter(r => r.best && pct(r.best) >= 80).length, avg: avg(inAtt), xp,
        hw: [hw.filter(h => h.done_at).length, hw.length], words, spoken: counters.spoken || 0, dict: counters.dictation || 0, rv: s.review.length },
      tr, sc: inAtt.slice(-40).map(a => [dkey(a.at), pct(a), a.l.id]), wk, att, tp, st, op, nt
    };
  };


  // Placement test analysis (same rules as reporte.html): strengths and focus areas by grammar area
  R.analyzePlacement = function (code) {
    if (!code || !window.SEGMENTS || !window.ALLQ) return null;
    try {
      const { SEGMENTS, PASS, AREAS, LEVELS, ALLQ } = window, lvlOrder = ["A1", "A2", "B1", "B2"];
      const status = p => p >= 80 ? "good" : p >= 50 ? "dev" : "bad";

      const [qs, sp] = code.split("-");
      const ans = [...qs].map(c => c === "x" ? null : c === "s" ? -1 : +c);
      const radio = [...(sp || "xxxx")].map(c => c === "x" ? null : +c);
      const segs = SEGMENTS.map((s, si) => {
        const items = s.qs.map(q => ({ q, a: ans[q.g] }));
        const taken = items.every(x => x.a !== null);
        return { s, si, taken, score: taken ? items.filter(x => x.a === x.q.correct).length : 0 };
      });
      let p = 0; for (const sg of segs) { if (sg.taken && sg.score >= PASS) p++; else break; }
      const takenQ = ALLQ.filter(q => ans[q.g] !== null);
      const ok = takenQ.filter(q => ans[q.g] === q.correct).length;
      const areas = {};
      takenQ.forEach(q => {
        const a = areas[q.ar] || (areas[q.ar] = { key: q.ar, ...AREAS[q.ar], n: 0, ok: 0, minLvl: 9 });
        a.n++; if (ans[q.g] === q.correct) a.ok++;
        a.minLvl = Math.min(a.minLvl, lvlOrder.indexOf(SEGMENTS.find(s => s.qs.includes(q)).lvl));
      });
      const list = Object.values(areas).map(a => ({ ...a, pct: Math.round(a.ok / a.n * 100) })).map(a => ({ ...a, st: status(a.pct) }));
      const strengths = list.filter(a => a.st === "good").sort((x, y) => y.pct - x.pct || y.n - x.n);
      const focus = list.filter(a => a.pct < 70).sort((x, y) => x.minLvl - y.minLvl || x.pct - y.pct).slice(0, 4);
      const spTotal = radio.reduce((s, v) => s + (v || 0), 0);
      return { ans, radio, segs, p, level: LEVELS[p], takenQ, ok, acc: takenQ.length ? Math.round(ok / takenQ.length * 100) : 0, list, strengths, focus, spTotal };
    } catch (e) { return null; }
  };

  // ── Strings ──
  const T = {
    en: { title: "Progress report", period: { "30": "Last 30 days", "90": "Last 3 months", month: "This month", prev: "Last month", all: "All time" },
      teacher: "Instructor", level: "Level", gen: "Generated on", summary: "Summary", classes: "Classes attended", missed: "Missed", practice: "Practice days", lessons: "Lessons passed", avg: "Average quiz score",
      xp: "Points earned", hw: "Homework done", trendUp: "Quiz scores are going up", trendDown: "Quiz scores went down", trendFlat: "Quiz scores are steady", vsPrev: "vs previous period",
      scores: "Quiz scores over time", scoresNote: "Each dot is a final quiz. The dashed line is the pass mark (80%).", weekly: "Weekly practice (points)", attendance: "Attendance by month", attended: "Attended",
      topics: "Topics covered", lesson: "Lesson", sections: "Sections", best: "Best", passedOn: "Passed", inProgress: "In progress", strengths: "Strengths", opps: "Areas of opportunity",
      notes: "Class notes", words: "new words", none: "Nothing yet in this period.", noStrength: "Strengths will show up as quizzes are completed.", noOpp: "No areas of concern right now.",
      s_lesson: (t, p) => `<b>${t}</b>: best score ${p}%`, s_area: (a, p) => `<b>${a}</b> in the placement test (${p}%)`, s_spoken: n => `Speaking practice: <b>${n}</b> sentences said correctly`,
      s_dict: n => `Listening: <b>${n}</b> dictations written correctly`, s_habit: n => `Consistent practice: <b>${n}</b> days`,
      o_lesson: (t, p) => `<b>${t}</b>: last quiz ${p}%, needs another try`, o_review: (t, n, ex) => `<b>${t}</b>: ${n} question${n === 1 ? "" : "s"} to review${ex ? ` · e.g. “${ex}”` : ""}`,
      o_area: (a, p) => `<b>${a}</b> (${p}% in the placement test)`, o_habit: (d, w) => `Practice more often: ${d} days in ${w} week${w === 1 ? "" : "s"} (goal: 2 or more a week)`, o_hw: n => `${n} homework task${n === 1 ? "" : "s"} overdue`,
      comment: "Teacher’s comment", print: "Print or save as PDF", months: "en-US", missedN: n => n + " missed" },
    es: { title: "Reporte de avance", period: { "30": "Últimos 30 días", "90": "Últimos 3 meses", month: "Este mes", prev: "Mes pasado", all: "Desde el inicio" },
      teacher: "Instructor", level: "Nivel", gen: "Generado el", summary: "Resumen", classes: "Clases tomadas", missed: "Faltó", practice: "Días de práctica", lessons: "Lecciones aprobadas", avg: "Promedio en quizzes",
      xp: "Puntos ganados", hw: "Tareas entregadas", trendUp: "Sus calificaciones van subiendo", trendDown: "Sus calificaciones bajaron", trendFlat: "Sus calificaciones se mantienen", vsPrev: "vs periodo anterior",
      scores: "Calificaciones en el tiempo", scoresNote: "Cada punto es un quiz final. La línea punteada es la calificación aprobatoria (80%).", weekly: "Práctica por semana (puntos)", attendance: "Asistencia por mes", attended: "Asistió",
      topics: "Temas vistos", lesson: "Lección", sections: "Secciones", best: "Mejor", passedOn: "Aprobada", inProgress: "En curso", strengths: "Fortalezas", opps: "Áreas de oportunidad",
      notes: "Notas de clase", words: "palabras nuevas", none: "Todavía no hay datos en este periodo.", noStrength: "Las fortalezas aparecerán conforme complete quizzes.", noOpp: "Por ahora no hay áreas que preocupen.",
      s_lesson: (t, p) => `<b>${t}</b>: mejor calificación ${p}%`, s_area: (a, p) => `<b>${a}</b> en el examen de colocación (${p}%)`, s_spoken: n => `Pronunciación: <b>${n}</b> frases dichas correctamente`,
      s_dict: n => `Comprensión auditiva: <b>${n}</b> dictados correctos`, s_habit: n => `Práctica constante: <b>${n}</b> días`,
      o_lesson: (t, p) => `<b>${t}</b>: último quiz ${p}%, conviene repetirlo`, o_review: (t, n, ex) => `<b>${t}</b>: ${n} pregunta${n === 1 ? "" : "s"} por repasar${ex ? ` · p. ej. “${ex}”` : ""}`,
      o_area: (a, p) => `<b>${a}</b> (${p}% en el examen de colocación)`, o_habit: (d, w) => `Practicar más seguido: ${d} días en ${w} semana${w === 1 ? "" : "s"} (meta: 2 o más por semana)`, o_hw: n => `${n} tarea${n === 1 ? "" : "s"} vencida${n === 1 ? "" : "s"}`,
      comment: "Comentario del instructor", print: "Imprimir o guardar PDF", months: "es-MX", missedN: n => n + (n === 1 ? " falta" : " faltas") }
  };
  R.T = T;
  const areaName = (k, lang) => { const A = window.AREAS && window.AREAS[k]; return A ? (lang === "es" ? A.es : A.en) : k; };

  // ── Charts (SVG, single color + labels, native tooltips) ──
  const BLUE = "var(--rp-blue, #2346d0)", AMBER = "var(--rp-amber, #d39a00)";
  function scoresChart(sc, t) {
    const W = 640, H = 220, L = 34, Rr = 12, Tp = 14, B = 26, n = sc.length;
    if (!n) return `<p class="rp-empty">${t.none}</p>`;
    const x = i => n === 1 ? (L + W - Rr) / 2 : L + i * (W - L - Rr) / (n - 1), y = v => Tp + (100 - v) * (H - Tp - B) / 100;
    const pts = sc.map((p, i) => [x(i), y(p[1])]), d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
    const fmt = s => new Date(s + "T12:00").toLocaleDateString(t.months, { month: "short", day: "numeric" });
    const ticks = n <= 1 ? [0] : [0, Math.floor((n - 1) / 2), n - 1];
    return `<svg class="rp-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${t.scores}">
      ${[0, 50, 100].map(v => `<line x1="${L}" x2="${W - Rr}" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="${L - 6}" y="${y(v) + 4}" class="ax" text-anchor="end">${v}%</text>`).join("")}
      <line x1="${L}" x2="${W - Rr}" y1="${y(80)}" y2="${y(80)}" class="pass"/>
      <path d="${d}" fill="none" stroke="${BLUE}" stroke-width="2" stroke-linejoin="round"/>
      ${pts.map((p, i) => `<g><circle cx="${p[0]}" cy="${p[1]}" r="9" fill="transparent"/><circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="${BLUE}" stroke="var(--rp-bg, #fff)" stroke-width="2"/><title>${fmt(sc[i][0])} · ${t.lesson} ${esc(sc[i][2])} · ${sc[i][1]}%</title></g>`).join("")}
      ${ticks.map(i => `<text x="${x(i)}" y="${H - 6}" class="ax" text-anchor="${n === 1 ? "middle" : i === 0 ? "start" : i === n - 1 ? "end" : "middle"}">${fmt(sc[i][0])}</text>`).join("")}
      <text x="${pts[n - 1][0]}" y="${pts[n - 1][1] - 10}" class="lbl" text-anchor="end">${sc[n - 1][1]}%</text>
    </svg>`;
  }
  function barsChart(wk, t) {
    const W = 640, H = 180, L = 8, B = 24, Tp = 18, n = wk.length, max = Math.max(1, ...wk.map(w => w[1]));
    if (!n || !wk.some(w => w[1])) return `<p class="rp-empty">${t.none}</p>`;
    const bw = (W - L * 2) / n, top = i => Tp + (H - Tp - B) * (1 - wk[i][1] / max);
    const mi = wk.reduce((b, w, i) => w[1] > wk[b][1] ? i : b, 0);
    return `<svg class="rp-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${t.weekly}">
      <line x1="${L}" x2="${W - L}" y1="${H - B}" y2="${H - B}" class="grid"/>
      ${wk.map((w, i) => { const x = L + i * bw + 3, h = Math.max(w[1] ? 3 : 0, H - B - top(i)); return `<g><rect x="${x}" y="${H - B - h}" width="${bw - 6}" height="${h}" rx="4" fill="${BLUE}"/><rect x="${L + i * bw}" y="${Tp}" width="${bw}" height="${H - Tp - B}" fill="transparent"/><title>${w[0]} · ${w[1]}</title>
        ${i === mi || i === n - 1 ? `<text x="${x + (bw - 6) / 2}" y="${H - B - h - 5}" class="lbl" text-anchor="middle">${w[1]}</text>` : ""}
        ${i % 2 === (n - 1) % 2 ? `<text x="${x + (bw - 6) / 2}" y="${H - 7}" class="ax" text-anchor="middle">${w[0].replace("-", "/")}</text>` : ""}</g>`; }).join("")}
    </svg>`;
  }
  function attChart(att, t) {
    if (!att.length) return `<p class="rp-empty">${t.none}</p>`;
    const max = Math.max(1, ...att.map(a => a[1] + a[2]));
    return `<div class="rp-att">${att.map(a => `<div class="r"><span class="m">${new Date(a[0] + "-15").toLocaleDateString(t.months, { month: "short", year: "2-digit" })}</span>
      <span class="b"><i style="width:${a[1] / max * 100}%;background:${BLUE}"></i><i style="width:${a[2] / max * 100}%;background:${AMBER}"></i></span><span class="v">${a[1]}${a[2] ? ` · ${t.missedN(a[2])}` : ""}</span></div>`).join("")}
      <div class="rp-legend"><span><i style="background:${BLUE}"></i>${t.attended}</span><span><i style="background:${AMBER}"></i>${t.missed}</span></div></div>`;
  }

  // ── Render ──
  R.render = function (D, lang, opts) {
    const t = T[lang] || T.en, o = opts || {}, k = D.k, fd = s => new Date(s + "T12:00").toLocaleDateString(t.months, { year: "numeric", month: "long", day: "numeric" });
    const kpi = (v, l, sub) => `<div class="rp-k"><b>${v}</b><span>${l}</span>${sub ? `<small>${sub}</small>` : ""}</div>`;
    const dDays = k.days - k.pdays;
    const trend = D.tr == null ? "" : `<p class="rp-trend ${D.tr > 3 ? "up" : D.tr < -3 ? "down" : ""}">${D.tr > 3 ? "▲ " + t.trendUp : D.tr < -3 ? "▼ " + t.trendDown : "● " + t.trendFlat} (${D.tr > 0 ? "+" : ""}${D.tr} pts)</p>`;
    const sItem = x => x[0] === "lesson" ? t.s_lesson(esc(x[1]), x[2]) : x[0] === "area" ? t.s_area(esc(areaName(x[1], lang)), x[2]) : x[0] === "spoken" ? t.s_spoken(x[1]) : x[0] === "dict" ? t.s_dict(x[1]) : t.s_habit(x[1]);
    const oItem = x => x[0] === "lesson" ? t.o_lesson(esc(x[1]), x[2]) : x[0] === "review" ? t.o_review(esc(x[1]), x[2], esc(x[3])) : x[0] === "area" ? t.o_area(esc(areaName(x[1], lang)), x[2]) : x[0] === "habit" ? t.o_habit(x[1], x[2]) : t.o_hw(x[1]);
    return `<div class="rp">
      ${o.head === false ? "" : `<div class="rp-head"><div><span class="rp-kick">${t.title}</span><h1>${esc(D.n)}</h1>
        <p>${t.period[D.p] || ""} · ${fd(D.f)} – ${fd(D.t)}${D.lv ? ` · ${t.level} ${esc(D.lv)}` : ""}${o.teacher ? ` · ${t.teacher}: ${esc(o.teacher)}` : ""}</p></div>${o.tools || ""}</div>`}
      <section class="rp-sec"><h2>${t.summary}</h2>
        <div class="rp-kpis">
          ${kpi(k.cls[0], t.classes, k.cls[1] ? t.missedN(k.cls[1]) : "")}
          ${kpi(k.days, t.practice, D.p !== "all" ? `${dDays > 0 ? "+" : ""}${dDays} ${t.vsPrev}` : "")}
          ${kpi(k.passed, t.lessons, `${k.done}/${k.lessons}`)}
          ${kpi(k.avg == null ? "—" : k.avg + "%", t.avg)}
          ${kpi(k.xp, t.xp)}
          ${kpi(k.hw[1] ? k.hw[0] + "/" + k.hw[1] : "—", t.hw)}
        </div>${trend}</section>
      <section class="rp-sec"><h2>${t.scores}</h2>${scoresChart(D.sc, t)}<p class="rp-note">${t.scoresNote}</p></section>
      <div class="rp-2">
        <section class="rp-sec"><h2>${t.weekly}</h2>${barsChart(D.wk, t)}</section>
        <section class="rp-sec"><h2>${t.attendance}</h2>${attChart(D.att, t)}</section>
      </div>
      <div class="rp-2">
        <section class="rp-sec"><h2>${t.strengths}</h2>${D.st.length ? `<ul class="rp-list good">${D.st.map(x => `<li>${sItem(x)}</li>`).join("")}</ul>` : `<p class="rp-empty">${t.noStrength}</p>`}</section>
        <section class="rp-sec"><h2>${t.opps}</h2>${D.op.length ? `<ul class="rp-list opp">${D.op.map(x => `<li>${oItem(x)}</li>`).join("")}</ul>` : `<p class="rp-empty">${t.noOpp}</p>`}</section>
      </div>
      <section class="rp-sec"><h2>${t.topics}</h2>${D.tp.length ? `<table class="rp-t"><thead><tr><th>${t.lesson}</th><th>${t.sections}</th><th class="r">${t.best}</th><th></th></tr></thead><tbody>
        ${D.tp.map(r => `<tr><td><b>${esc(r[0])}</b> · ${esc(r[1])}</td><td><span class="rp-bar"><i style="width:${Math.min(100, r[2] / r[3] * 100)}%"></i></span> ${r[2]}/${r[3]}</td><td class="r">${r[4] == null ? "—" : r[4] + "%"}</td><td>${r[5] ? `<span class="rp-tag good">${t.passedOn} ${new Date(r[5] + "T12:00").toLocaleDateString(t.months, { month: "short", day: "numeric" })}</span>` : `<span class="rp-tag">${t.inProgress}</span>`}</td></tr>`).join("")}
        </tbody></table>` : `<p class="rp-empty">${t.none}</p>`}</section>
      ${D.nt && D.nt.length ? `<section class="rp-sec"><h2>${t.notes}${k.words ? ` <small>· ${k.words} ${t.words}</small>` : ""}</h2><div class="rp-notes">${D.nt.map(n => `<div><b>${new Date(n[0] + "T12:00").toLocaleDateString(t.months, { month: "short", day: "numeric" })}</b><span>${esc(n[1])}${n[2] ? `<small>${esc(n[2])}</small>` : ""}</span></div>`).join("")}</div></section>` : ""}
      ${D.c ? `<section class="rp-sec"><h2>${t.comment}</h2><p class="rp-comment">${esc(D.c)}</p></section>` : ""}
      <p class="rp-foot">${t.gen} ${fd(dkey(D.g))} · Lingua</p>
    </div>`;
  };
})();
