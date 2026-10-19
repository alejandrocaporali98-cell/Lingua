// Lingua side menu: a ☰ button beside the logo opens a drawer with every section.
(function () {
  const L = window.LINGUA;
  const ICON = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    home: '<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
    test: '<path d="M9 4h6v3H9z"/><path d="M7 5H5v15h14V5h-2"/><path d="M8.5 13l2 2 4-4"/>',
    report: '<path d="M5 20V10M10 20V4M15 20v-7M20 20v-4"/>',
    grades: '<path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h5"/>',
    diploma: '<circle cx="12" cy="9" r="5"/><path d="M9 13.5L7.5 21l4.5-2.5 4.5 2.5L15 13.5"/>',
    book: '<path d="M2 5h6a4 4 0 0 1 4 4v11a3 3 0 0 0-3-3H2z"/><path d="M22 5h-6a4 4 0 0 0-4 4v11a3 3 0 0 1 3-3h7z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    out: '<path d="M15 4h4v16h-4"/><path d="M10 8l-4 4 4 4M6 12h10"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    hw: '<path d="M8 4h8l3 3v13H5V4z"/><path d="M9 12l2 2 4-4"/>',
    review: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M4 20v-5h5"/>',
    words: '<path d="M4 6h16M4 12h10M4 18h7"/><circle cx="18" cy="17" r="3"/>',
    teacher: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    game: '<path d="M7 10h4M9 8v4"/><circle cx="15.5" cy="10.5" r="1"/><circle cx="17.5" cy="12.5" r="1"/><path d="M6.5 6h11a4 4 0 0 1 4 4.4l-.6 5.2a2.5 2.5 0 0 1-4.3 1.4L14.5 15h-5l-2.1 2a2.5 2.5 0 0 1-4.3-1.4l-.6-5.2A4 4 0 0 1 6.5 6z"/>',
    notes: '<path d="M6 3h9l4 4v14H6z"/><path d="M9 11h7M9 15h7M9 7h3"/>',
    badge: '<circle cx="12" cy="9" r="6"/><path d="M12 6l1 2 2 .3-1.5 1.4.4 2.1-1.9-1-1.9 1 .4-2.1L9 8.3l2-.3z"/><path d="M8.5 14.5L7 22l5-3 5 3-1.5-7.5"/>',
    build: '<path d="M14 6l4 4M4 20l4-1 11-11-3-3L5 16z"/>'
  };
  const ico = (n, s) => `<svg width="${s || 20}" height="${s || 20}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;
  const LV = { A1: "Beginner", A2: "Elementary", B1: "Intermediate", B2: "Upper intermediate", "B2+": "Upper intermediate +" };
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  function diplomasCount() {
    return L.modulos.flatMap(m => m.lecciones).filter(l => L.store.get("diploma." + l.id, null)).length;
  }

  function build() {
    if (document.getElementById("lgMenu")) return document.getElementById("lgMenu");
    const r = L.root || "";
    const items = [
      ["Learn", [["home", "My learning", "index.html"], ...(L.cloudEnabled ? [["hw", "Homework", "index.html#todo", "hw"], ["notes", "Class notes", "notes.html"]] : []), ["test", "Placement test", "examen.html"], ["report", "Placement report", "reporte.html"]]],
      ["Practice", [["review", "Review", "review.html", "rev"], ["game", "Practice games", "practice.html"], ["words", "My words", "words.html"], ["book", "Study resources", "resources.html"]]],
      ["Progress", [["grades", "Grades", "grades.html"], ["diploma", "Diplomas", "diplomas.html", "dip"], ["badge", "Badges", "perfil.html#badges", "bdg"]]],
      ...(L.isTeacher ? [["Teacher", [["teacher", "Teacher panel", "teacher.html"], ["build", "Lesson builder", "builder.html"]]]] : []),
      ["Account", [["user", "Profile & avatar", "perfil.html"], ["gear", "Settings", "perfil.html#settings"]]]
    ];
    const el = document.createElement("div");
    el.id = "lgMenu"; el.className = "lg-menu"; el.hidden = true;
    el.innerHTML = `
      <div class="lg-scrim" data-close></div>
      <aside class="lg-drawer" role="dialog" aria-modal="true" aria-label="Menu">
        <div class="lg-top">
          <a class="logo" href="${r}index.html">${L.logo}</a>
          <button type="button" class="lg-x" data-close aria-label="Close menu">${ico("close")}</button>
        </div>
        <a class="lg-me" href="${r}perfil.html" id="lgMe"></a>
        <nav class="lg-nav">${items.map(([h, links]) => `<div class="lg-sec"><span class="eyebrow">${h}</span>${links.map(([i, t, href, badge]) => {
          const on = href.split("#")[0] === page && !href.includes("#");
          return `<a href="${r}${href}" class="${on ? "on" : ""}" ${on ? 'aria-current="page"' : ""}>${ico(i)}<span>${t}</span>${badge ? `<span class="lg-badge" data-badge="${badge}"></span>` : ""}</a>`;
        }).join("")}</div>`).join("")}
          <div class="lg-sec">
            <button type="button" class="lg-row" id="lgTheme">${ico("moon")}<span>Dark mode</span><span class="sw" aria-hidden="true"></span></button>
            <button type="button" class="lg-row" id="lgInstall" hidden>${ico("phone")}<span>Install the app</span></button>
            ${L.cloudEnabled ? `<button type="button" class="lg-row" id="lgOut">${ico("out")}<span>Sign out</span></button>` : ""}
          </div>
        </nav>
        <div class="lg-foot muted">Lingua · Instructor: ${L.maestro}</div>
      </aside>`;
    document.body.appendChild(el);
    el.querySelectorAll("[data-close]").forEach(x => x.onclick = close);
    el.querySelector("#lgTheme").onclick = () => { L.theme && L.theme.toggle(); paint(); };
    const out = el.querySelector("#lgOut"); if (out) out.onclick = () => L.signOut && L.signOut();
    el.querySelector("#lgInstall").onclick = async () => {
      const I = L.install || {};
      if (I.prompt) { I.prompt.prompt(); try { await I.prompt.userChoice; } catch (e) {} I.prompt = null; paint(); }
      else location.href = r + "perfil.html#install";
    };
    el.addEventListener("keydown", e => {
      if (e.key === "Escape") { e.stopPropagation(); close(); }
      if (e.key === "Tab") { // keep focus inside the drawer
        const f = [...el.querySelectorAll("a, button")].filter(x => x.offsetParent !== null);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
    return el;
  }
  function paint() {
    const el = document.getElementById("lgMenu"); if (!el) return;
    const p = L.profile || L.store.get("profileLocal", {}) || {}, name = (p.display_name || "").trim();
    const pl = L.store.get("placement", null);
    const av = (L.avatar && L.avatar.mine(48)) || `<span class="avatar" style="width:48px;height:48px;font-size:1.2em">${name ? name[0].toUpperCase() : ico("user", 22)}</span>`;
    el.querySelector("#lgMe").innerHTML = `${av}<span style="min-width:0"><b>${name ? name.replace(/[<>&]/g, "") : "Your profile"}</b><span class="muted">${pl ? "Level " + pl.nivel + " · " + (LV[pl.nivel] || "") : "Level not tested yet"}</span></span>`;
    const badge = (k, n) => { const b = el.querySelector('[data-badge="' + k + '"]'); if (b) { b.textContent = n; b.hidden = !n; } };
    badge("dip", diplomasCount());
    badge("bdg", L.badges ? L.badges.earned().filter(b => b.at).length : 0);
    badge("rev", L.review ? L.review.count() : 0);
    badge("hw", L.homework ? L.homework.cached().filter(h => !h.done_at).length : 0);
    const I = L.install || {}, inst = el.querySelector("#lgInstall");
    inst.hidden = !!I.standalone || !(I.prompt || I.ios);
    const dark = L.theme ? L.theme.isDark() : false, t = el.querySelector("#lgTheme");
    t.classList.toggle("on", dark); t.setAttribute("aria-pressed", dark);
  }
  let lastFocus = null;
  function open() {
    const el = build(); paint();
    lastFocus = document.activeElement;
    el.hidden = false; document.documentElement.classList.add("lg-lock");
    requestAnimationFrame(() => el.classList.add("open"));
    setTimeout(() => { const f = el.querySelector(".lg-nav a.on") || el.querySelector(".lg-nav a"); f && f.focus(); }, 60);
  }
  function close() {
    const el = document.getElementById("lgMenu"); if (!el) return;
    el.classList.remove("open"); document.documentElement.classList.remove("lg-lock");
    setTimeout(() => { el.hidden = true; }, 220);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  L.menu = {
    open, close,
    mount() {
      document.querySelectorAll(".nav-in, .pbar").forEach(bar => {
        if (bar.querySelector(".menu-btn")) return;
        const b = document.createElement("button");
        b.type = "button"; b.className = "menu-btn"; b.setAttribute("aria-label", "Open menu"); b.setAttribute("aria-haspopup", "dialog");
        b.innerHTML = ico("menu", 22); b.onclick = open;
        bar.insertBefore(b, bar.firstChild);
      });
    }
  };
  document.addEventListener("DOMContentLoaded", L.menu.mount);
  document.addEventListener("lingua:theme", paint);
  document.addEventListener("lingua:homework", paint);
  document.addEventListener("lingua:installable", paint);
})();
