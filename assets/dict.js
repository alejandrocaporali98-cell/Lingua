// Lingua · class dictionary and translator (class mode only).
// Look up a word or phrase: meaning in English, pronunciation, examples and the translation,
// then add it to today's class notes with one tap. English → Spanish or Spanish → English.
// Sources: Free Dictionary API (dictionaryapi.dev) and MyMemory (translated.net). Only the searched text is sent.
(function () {
  const L = window.LINGUA;
  if (!L || L.dict) return;
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const DICT = "https://api.dictionaryapi.dev/api/v2/entries/en/", TR = "https://api.mymemory.translated.net/get";
  const LANG = { en: "English", es: "Spanish" };
  const cache = {};
  let el, dir = "en", manual = false, cur = null, seq = 0;

  async function get(url) {
    const k = url; if (cache[k]) return cache[k];
    const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 9000);
    try {
      const r = await fetch(url, { signal: ctl.signal, credentials: "omit", referrerPolicy: "no-referrer" });
      const out = { status: r.status, json: r.ok || r.status === 404 ? await r.json().catch(() => null) : null };
      if (r.ok || r.status === 404) cache[k] = out;
      return out;
    } finally { clearTimeout(t); }
  }
  const words = s => s.trim().split(/\s+/).length;
  const decode = s => { const t = document.createElement("textarea"); t.innerHTML = s; return t.value; };
  const norm = s => decode(String(s || "")).replace(/\s+/g, " ").replace(/^[\s"“”'¿¡]+|[\s"“”.!?¿¡]+$/g, "").trim();

  // English meaning: up to 4 senses (2 definitions each), the phonetic spelling and a few similar words
  async function define(w) {
    if (!w || words(w) > 4) return null;
    const r = await get(DICT + encodeURIComponent(w.toLowerCase()));
    if (r.status === 404 || !Array.isArray(r.json) || !r.json.length) return null;
    if (r.status !== 200) throw new Error("dictionary " + r.status);
    const senses = [], syn = new Set();
    let ph = "";
    for (const e of r.json) {
      ph = ph || e.phonetic || ((e.phonetics || []).find(p => p.text) || {}).text || "";
      for (const m of e.meanings || []) {
        (m.synonyms || []).forEach(x => syn.size < 6 && syn.add(x));
        const defs = (m.definitions || []).filter(d => d.definition).slice(0, 2).map(d => ({ d: d.definition, ex: d.example || "" }));
        (m.definitions || []).forEach(d => (d.synonyms || []).forEach(x => syn.size < 6 && syn.add(x)));
        if (defs.length && senses.length < 4) senses.push({ pos: m.partOfSpeech || "", defs });
      }
    }
    return senses.length ? { word: r.json[0].word || w, ph, senses, syn: [...syn].filter(x => x.toLowerCase() !== w.toLowerCase()).slice(0, 5) } : null;
  }

  // Translation: the best one plus a few alternatives people use
  async function translate(q, from, to) {
    const r = await get(`${TR}?q=${encodeURIComponent(q)}&langpair=${from}|${to}`);
    const j = r.json, main = j && j.responseData && norm(j.responseData.translatedText);
    if (!j || String(j.responseStatus) !== "200" || !main || /MYMEMORY WARNING|QUERY LENGTH|INVALID LANGUAGE/i.test(main)) throw new Error("translation unavailable");
    const low = q === q.toLowerCase(), fix = s => (low && words(s) <= 3 ? s.toLowerCase() : s);
    const seen = new Set(), list = [];
    const add = s => { s = fix(norm(s)); const k = s.toLowerCase(); if (s && !seen.has(k) && k !== q.toLowerCase() && s.length <= 120) { seen.add(k); list.push(s); } };
    add(main);
    (j.matches || []).filter(m => m.translation && norm(m.segment).toLowerCase() === norm(q).toLowerCase())
      .sort((a, b) => (+b.quality || 0) - (+a.quality || 0)).forEach(m => add(m.translation));
    if (!list.length) throw Object.assign(new Error("no translation"), { none: true });
    return list.slice(0, 5);
  }

  function build() {
    el = document.createElement("aside"); el.id = "cdict"; el.className = "cnotes cdict"; el.setAttribute("aria-label", "Dictionary"); el.hidden = true;
    el.innerHTML = `<div class="cn-head"><div><b>Dictionary</b><small>Look up a word, then add it to today’s notes</small></div><button type="button" class="cn-x" aria-label="Close dictionary">×</button></div>
      <div class="dx-wrap">
        <form class="dx-search" id="dxForm" autocomplete="off">
          <div class="dx-dir" role="group" aria-label="Translate from"><button type="button" data-dir="en" class="on">English → Spanish</button><button type="button" data-dir="es">Spanish → English</button></div>
          <div class="dx-row"><input id="dxQ" type="search" maxlength="200" placeholder="Type a word or phrase" aria-label="Word or phrase" enterkeyhint="search" spellcheck="false" autocapitalize="off"><button class="btn primary sm" id="dxGo">Look up</button></div>
        </form>
        <div class="dx-res" id="dxRes" aria-live="polite"><p class="cn-hint">Tip: select a word in the lesson and press <b>D</b> to look it up.</p></div>
        <div class="dx-foot" id="dxFoot" hidden>
          <label class="dx-lab" for="dxLine">Adds this line to today’s notes (you can edit it)</label>
          <textarea id="dxLine" rows="2" maxlength="400"></textarea>
          <div class="dx-acts"><button type="button" class="btn primary sm" id="dxAdd">Add to notes</button><span class="cn-hint" id="dxOut"></span></div>
        </div>
      </div>`;
    document.body.appendChild(el);
    el.querySelector(".cn-x").onclick = () => api.close();
    const q = el.querySelector("#dxQ");
    el.querySelector("#dxForm").onsubmit = e => { e.preventDefault(); look(q.value); };
    el.querySelectorAll("[data-dir]").forEach(b => b.onclick = () => { manual = true; setDir(b.dataset.dir); if (q.value.trim()) look(q.value); else q.focus(); });
    q.addEventListener("input", () => { if (!manual && /[áéíóúñü¿¡]/i.test(q.value)) setDir("es"); if (!q.value.trim()) manual = false; });
    el.querySelector("#dxAdd").onclick = add;
    el.querySelector("#dxRes").addEventListener("click", e => {
      const d = e.target.closest(".dx-def"), t = e.target.closest(".dx-chip"), s = e.target.closest(".dx-syn button");
      if (s) { q.value = s.textContent; setDir("en"); look(s.textContent); return; }
      if (!cur) return;
      if (d) { cur.def = +d.dataset.i; el.querySelectorAll(".dx-def").forEach(x => x.classList.toggle("on", x === d)); line(); }
      if (t) { cur.tr = +t.dataset.i; el.querySelectorAll(".dx-chip").forEach(x => x.classList.toggle("on", x === t)); line(); }
    });
  }
  function setDir(d) { dir = d; el.querySelectorAll("[data-dir]").forEach(b => { b.classList.toggle("on", b.dataset.dir === d); b.setAttribute("aria-pressed", b.dataset.dir === d); }); }

  async function look(raw) {
    const q = String(raw || "").replace(/\s+/g, " ").trim().slice(0, 200), res = el.querySelector("#dxRes"), foot = el.querySelector("#dxFoot");
    if (!q) return;
    const me = ++seq; cur = null; foot.hidden = true;
    res.innerHTML = `<p class="cn-hint">Looking up “${esc(q)}”…</p>`;
    let head = q, meaning = null, trs = null, okD = true, okT = true;
    if (dir === "en") {
      [meaning, trs] = await Promise.all([define(q).catch(() => { okD = false; return null; }), translate(q, "en", "es").catch(e => { okT = !!e.none; return null; })]);
      // Not English? Maybe it's a Spanish word: try the other way round
      if (!meaning && !trs && !manual) {
        const back = await translate(q, "es", "en").catch(() => null), m2 = back && await define(back[0]).catch(() => null);
        if (back && (m2 || back[0].toLowerCase() !== q.toLowerCase())) { setDir("es"); trs = back; head = back[0]; meaning = m2; okT = true; }
      }
    } else {
      trs = await translate(q, "es", "en").catch(e => { okT = !!e.none; return null; });
      if (trs) { head = trs[0]; meaning = await define(head).catch(() => { okD = false; return null; }); }
    }
    if (me !== seq) return;
    if (!meaning && !trs) {
      res.innerHTML = `<p class="cn-hint dx-bad">${okD && okT ? `No results for “${esc(q)}”. Check the spelling${dir === "en" ? ", or switch to Spanish → English" : ""}.` : "Couldn’t reach the dictionary. Check the internet connection and try again."}</p>`;
      return;
    }
    cur = { q, head: meaning && dir === "en" ? meaning.word : head, meaning, trs, def: 0, tr: 0 };
    const flat = meaning ? meaning.senses.flatMap(s => s.defs.map(d => ({ ...d, pos: s.pos }))) : [];
    cur.flat = flat;
    let i = 0;
    res.innerHTML = `<div class="dx-head"><b class="dx-w">${esc(cur.head)}</b>${meaning && meaning.ph ? `<span class="dx-ph">${esc(meaning.ph)}</span>` : ""}${L.sayBtn ? L.sayBtn(cur.head, "Listen") : ""}</div>
      ${dir === "es" ? `<p class="dx-from">${esc(q)} <span>· ${LANG.es}</span></p>` : ""}
      ${trs ? `<div class="dx-sec"><span class="eyebrow">${dir === "en" ? LANG.es : LANG.en}</span><div class="dx-chips">${trs.map((t, k) => `<button type="button" class="dx-chip${k ? "" : " on"}" data-i="${k}">${esc(t)}</button>`).join("")}</div></div>`
        : `<p class="cn-hint">The translation isn’t available right now.</p>`}
      ${meaning ? `<div class="dx-sec"><span class="eyebrow">Meaning</span>${meaning.senses.map(s => `<div class="dx-sense">${s.pos ? `<span class="dx-pos">${esc(s.pos)}</span>` : ""}${s.defs.map(d => { const k = i++; return `<button type="button" class="dx-def${k ? "" : " on"}" data-i="${k}"><span>${esc(d.d)}</span>${d.ex ? `<i>“${esc(d.ex)}”</i>` : ""}</button>`; }).join("")}</div>`).join("")}</div>
        ${meaning.syn.length ? `<div class="dx-syn"><span class="eyebrow">Similar</span><div>${meaning.syn.map(x => `<button type="button">${esc(x)}</button>`).join("")}</div></div>` : ""}`
        : `<p class="cn-hint">${okD ? "No dictionary entry. It may be a phrase or a name, so only the translation is shown." : "The dictionary isn’t available right now, so only the translation is shown."}</p>`}`;
    line(); foot.hidden = false; el.querySelector("#dxOut").textContent = "";
  }

  // The note line: word (part of speech) · translation — meaning
  function line() {
    if (!cur) return;
    const d = cur.flat[cur.def], t = cur.trs && cur.trs[cur.tr];
    const word = cur.head, tr = cur.trs ? (dir === "en" ? t : cur.q) : "";
    let s = word + (d && d.pos ? ` (${d.pos})` : "");
    if (tr && tr.toLowerCase() !== word.toLowerCase()) s += " · " + tr;
    if (d) s += " — " + d.d;
    el.querySelector("#dxLine").value = s;
  }

  async function add() {
    const b = el.querySelector("#dxAdd"), out = el.querySelector("#dxOut"), v = el.querySelector("#dxLine").value.replace(/\s+/g, " ").trim();
    if (!v) return;
    b.disabled = true; out.textContent = "Saving…";
    const r = L.classNotesAdd ? await L.classNotesAdd(v) : { ok: false, msg: "Notes aren’t available here." };
    b.disabled = false;
    if (r.ok) { out.innerHTML = `Added ✓ <button type="button" class="dx-link" id="dxSee">See notes</button>`; el.querySelector("#dxSee").onclick = () => L.classNotes && L.classNotes(true); }
    else out.textContent = r.noClass ? "There’s no class on the schedule today. Open Notes to add one, then try again." : r.msg;
  }

  const api = {
    isOpen: () => !!(el && !el.hidden),
    open(q) {
      if (!el) build();
      if (L.classNotesOpen && L.classNotesOpen() && L.classNotes) L.classNotes(false);
      el.hidden = false; document.body.classList.add("cn-open");
      const b = document.getElementById("dictBtn"); if (b) b.setAttribute("aria-expanded", "true");
      const inp = el.querySelector("#dxQ");
      if (q) { manual = false; setDir(/[áéíóúñü¿¡]/i.test(q) ? "es" : "en"); inp.value = q; look(q); }
      inp.focus(); if (!q) inp.select();
    },
    close() {
      if (!el || el.hidden) return;
      el.hidden = true;
      if (!(L.classNotesOpen && L.classNotesOpen())) document.body.classList.remove("cn-open");
      const b = document.getElementById("dictBtn"); if (b) { b.setAttribute("aria-expanded", "false"); b.focus(); }
    },
    toggle(q) { if (q) return api.open(q); api.isOpen() ? api.close() : api.open(); },
    look: q => { api.open(); el.querySelector("#dxQ").value = q; return look(q); }
  };
  L.dict = api;
})();
