// Lingua accounts + cloud sync (Supabase).
// - Pages need a signed-in student (except login.html and a shared report link).
// - Progress lives in localStorage while you use the site and is synced to the
//   "progress" table: on page load (pull + merge) and a moment after every change (push).
// - Each saved key carries its change time, so the newest value always wins.
(function () {
  const L = window.LINGUA, cfg = L.cloud || {};
  const LOCAL_ONLY = ["textSize", "modoClase", "reportLang", "theme", "sounds", "voice", "voiceRate"];
  const root = /\/clases\//.test(location.pathname) ? "../" : "";
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const qs = new URLSearchParams(location.search);
  const isLogin = page === "login.html";
  const isPublicReport = (page === "reporte.html" && qs.has("r")) || ((page === "progress.html" || page === "plan.html") && qs.has("d"));

  const show = () => document.documentElement.classList.remove("auth-pending");
  const lsGet = (k) => { try { return JSON.parse(localStorage.getItem("lingua." + k)); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem("lingua." + k, JSON.stringify(v)); } catch (e) {} };
  const synced = (k) => k.indexOf("__") !== 0 && LOCAL_ONLY.indexOf(k) < 0;

  L.cloudEnabled = !!(cfg.url && cfg.key && window.supabase && window.supabase.createClient);
  L.root = root;
  L.toEmail = (u) => { u = (u || "").trim().toLowerCase(); return u.indexOf("@") > 0 ? u : u + "@" + (cfg.usernameDomain || "student.lingua.app"); };
  L.profile = lsGet("__profile") || lsGet("profileLocal");

  function collectLocal() {
    const meta = lsGet("__meta") || {}, out = {};
    for (let i = 0; i < localStorage.length; i++) {
      const full = localStorage.key(i);
      if (!full || full.indexOf("lingua.") !== 0) continue;
      const k = full.slice(7);
      if (!synced(k)) continue;
      try { out[k] = { v: JSON.parse(localStorage.getItem(full)), t: meta[k] || 0 }; } catch (e) {}
    }
    return out;
  }
  const KEEP = ["__auth", "__actas"];
  function clearLocal() {
    const kill = [];
    for (let i = 0; i < localStorage.length; i++) {
      const full = localStorage.key(i);
      if (full && full.indexOf("lingua.") === 0 && LOCAL_ONLY.indexOf(full.slice(7)) < 0 && KEEP.indexOf(full.slice(7)) < 0) kill.push(full);
    }
    kill.forEach(k => localStorage.removeItem(k));
  }
  L.clearLocal = clearLocal;

  // Fill the nav avatar and greeting from the profile
  function decorate() {
    const p = L.profile || {}, name = (p.display_name || "").trim(), first = name.split(/\s+/)[0];
    document.querySelectorAll("[data-avatar]").forEach(el => {
      el.setAttribute("href", root + "perfil.html");
      el.setAttribute("aria-label", "Your profile");
      const svg = L.avatar && L.avatar.mine(el.getAttribute("data-avatar") ? +el.getAttribute("data-avatar") : 36);
      if (svg) { el.innerHTML = svg; el.style.background = "transparent"; el.classList.add("has-avatar"); el.hidden = false; }
      else if (name) { el.textContent = name[0].toUpperCase(); el.style.background = p.avatar_color || "var(--ink)"; el.classList.add("has-name"); el.hidden = false; }
    });
    if (first) document.querySelectorAll("[data-greet]").forEach(el => el.textContent = "Welcome back, " + first);
  }
  L.decorate = decorate;

  L.isTeacher = lsGet("__teacher") === true;
  if (!L.cloudEnabled) {
    L.homework = { cached: () => [], list: async () => [], setDone: async () => {} };
    L.classes = { cached: () => [], list: async () => [] };
    L.voice = { ok: false }; L.calendar = null;
    L.ready = Promise.resolve(null);
    show();
    document.addEventListener("DOMContentLoaded", decorate);
    return;
  }

  const sb = window.supabase.createClient(cfg.url, cfg.key, { auth: { persistSession: true, autoRefreshToken: true, storageKey: "lingua.__auth" } });
  L.sb = sb;
  setTimeout(show, 10000); // never leave a blank page if the network is very slow

  // uid = who is signed in; tid = whose progress we read and write (the student, in class mode)
  let uid = null, tid = null, timer = null, pushing = false, again = false;
  async function push() {
    if (!tid) return;
    if (pushing) { again = true; return; }
    pushing = true;
    try {
      const cur = await sb.from("progress").select("data").eq("user_id", tid).maybeSingle();
      const remote = (cur.data && cur.data.data) || {}, local = collectLocal(), merged = { ...remote };
      Object.keys(local).forEach(k => { if (!remote[k] || (local[k].t || 0) >= (remote[k].t || 0)) merged[k] = local[k]; });
      const { error } = await sb.from("progress").upsert({ user_id: tid, data: merged, updated_at: new Date().toISOString() });
      L.lastSync = error ? { ok: false, error: error.message, at: Date.now() } : { ok: true, at: Date.now() };
      document.dispatchEvent(new CustomEvent("lingua:sync", { detail: L.lastSync }));
    } catch (e) { L.lastSync = { ok: false, error: String(e), at: Date.now() }; }
    pushing = false;
    if (again) { again = false; push(); }
  }
  L.syncNow = push;
  L.onSet = (k) => { if (!tid || !synced(k)) return; clearTimeout(timer); timer = setTimeout(push, 700); };
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden" && timer) { clearTimeout(timer); timer = null; push(); } });

  async function pull() {
    const { data, error } = await sb.from("progress").select("data").eq("user_id", tid).maybeSingle();
    if (error) throw error;
    const remote = (data && data.data) || {}, local = collectLocal(), meta = lsGet("__meta") || {};
    let changedLocal = false, needPush = false;
    new Set([...Object.keys(remote), ...Object.keys(local)]).forEach(k => {
      const r = remote[k], l = local[k];
      if (r && (!l || r.t > l.t)) {
        if (!l || JSON.stringify(l.v) !== JSON.stringify(r.v)) changedLocal = true;
        try { localStorage.setItem("lingua." + k, JSON.stringify(r.v)); } catch (e) {}
        meta[k] = r.t;
      } else if (l && (!r || l.t > r.t)) needPush = true;
    });
    lsSet("__meta", meta);
    if (needPush) await push();
    return changedLocal;
  }

  async function loadProfile() {
    const { data } = await sb.from("profiles").select("*").eq("id", tid).maybeSingle();
    L.profile = data || { id: tid };
    lsSet("__profile", L.profile);
    return L.profile;
  }
  L.saveProfile = async (fields) => {
    const row = { ...fields, id: tid, updated_at: new Date().toISOString() };
    const { data, error } = await sb.from("profiles").upsert(row).select().maybeSingle();
    if (error) throw error;
    L.profile = data || row; lsSet("__profile", L.profile); decorate();
    return L.profile;
  };
  // Homework the teacher leaves between classes (table "homework")
  L.homework = {
    cached: () => lsGet("__homework") || [],
    async list() {
      if (!tid) return L.homework.cached();
      const { data, error } = await sb.from("homework").select("*").eq("student_id", tid).order("created_at", { ascending: false });
      if (error) return L.homework.cached();
      lsSet("__homework", data || []); document.dispatchEvent(new CustomEvent("lingua:homework"));
      return data || [];
    },
    async setDone(id, done) {
      const { error } = await sb.from("homework").update({ done_at: done ? new Date().toISOString() : null }).eq("id", id);
      if (error) throw error;
      lsSet("__homework", L.homework.cached().map(h => h.id === id ? { ...h, done_at: done ? new Date().toISOString() : null } : h));
      document.dispatchEvent(new CustomEvent("lingua:homework"));
    }
  };
  // Answer a homework task (text and/or a voice note); it also counts as done
  L.homework.submit = async (id, fields) => {
    const row = { ...fields, submitted_at: new Date().toISOString(), done_at: new Date().toISOString() };
    const { error } = await sb.from("homework").update(row).eq("id", id);
    if (error) throw error;
    lsSet("__homework", L.homework.cached().map(h => h.id === id ? { ...h, ...row } : h));
    document.dispatchEvent(new CustomEvent("lingua:homework"));
  };
  // Voice notes: private files in the "voice" bucket, inside the student's own folder
  L.voice = {
    get ok() { return !!tid; },
    async upload(blob, kind) {
      const type = (blob.type || "audio/webm").split(";")[0], ext = /mp4|m4a|aac/.test(type) ? "m4a" : /ogg/.test(type) ? "ogg" : /mpeg/.test(type) ? "mp3" : /wav/.test(type) ? "wav" : "webm";
      const path = `${tid}/${kind || "voice"}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
      const { error } = await sb.storage.from("voice").upload(path, blob, { contentType: /m4a/.test(ext) ? "audio/mp4" : type, upsert: false });
      if (error) throw error;
      return path;
    },
    async url(path) { const { data, error } = await sb.storage.from("voice").createSignedUrl(path, 3600); if (error) throw error; return data.signedUrl; },
    async save(row) { const { data, error } = await sb.from("recordings").insert({ ...row, student_id: tid }).select(); if (error) throw error; return data && data[0]; },
    async mine(lessonId) { let q = sb.from("recordings").select("*").eq("student_id", tid).order("created_at", { ascending: false }); if (lessonId) q = q.eq("lesson_id", lessonId); const { data, error } = await q; if (error) throw error; return data || []; },
    async of(studentId) { const { data, error } = await sb.from("recordings").select("*").eq("student_id", studentId).order("created_at", { ascending: false }); if (error) throw error; return data || []; },
    async remove(rec) { await sb.storage.from("voice").remove([rec.path]); const { error } = await sb.from("recordings").delete().eq("id", rec.id); if (error) throw error; }
  };
  // Calendar: a private link that calendar apps keep in sync (see the "calendar" Edge Function)
  L.calendar = {
    async link() {
      const me = uid; let { data, error } = await sb.from("cal_tokens").select("token").eq("owner", me).maybeSingle();
      if (error) throw error;
      if (!data) { const r = await sb.from("cal_tokens").insert({ owner: me }).select("token").single(); if (r.error) throw r.error; data = r.data; }
      const https = cfg.url.replace(/\/$/, "") + "/functions/v1/calendar?t=" + data.token;
      return { https, webcal: https.replace(/^https:/, "webcal:"), google: "https://calendar.google.com/calendar/r?cid=" + encodeURIComponent(https.replace(/^https:/, "webcal:")) };
    }
  };
  // Classes: schedule, attendance and notes (the teacher writes them, the student reads their own)
  L.classes = {
    cached: () => lsGet("__classes") || [],
    async list() {
      if (!tid) return L.classes.cached();
      const { data, error } = await sb.from("classes").select("*").eq("student_id", tid).order("starts_at", { ascending: false });
      if (error) return L.classes.cached();
      lsSet("__classes", data || []); document.dispatchEvent(new CustomEvent("lingua:classes"));
      return data || [];
    }
  };
  // Lessons made in the lesson builder
  async function syncLessons() {
    const { data, error } = await sb.from("lessons").select("id, data, published, updated_at").order("id");
    if (error) return false;
    const before = JSON.stringify(lsGet("__lessons") || []), rows = (data || []).filter(r => r.published || (L.isTeacher && !L.actingAs));
    lsSet("__lessons", rows);
    return before !== JSON.stringify(rows);
  }
  // Lessons assigned to this student and their style. null = table not installed (show everything)
  async function syncSettings() {
    const { data, error } = await sb.from("student_settings").select("lessons, theme").eq("student_id", tid).maybeSingle();
    const now = error ? null : (data || { lessons: [], theme: "racing" });
    const before = JSON.stringify(lsGet("__settings") || null);
    lsSet("__settings", now);
    return before !== JSON.stringify(now);
  }
  L.lessons = {
    async all() { const { data, error } = await sb.from("lessons").select("*").order("id"); if (error) throw error; return data || []; },
    async save(row) { const { data, error } = await sb.from("lessons").upsert({ ...row, updated_at: new Date().toISOString() }).select(); if (error) throw error; await syncLessons(); return data; },
    async remove(id) { const { error } = await sb.from("lessons").delete().eq("id", id); if (error) throw error; await syncLessons(); },
    sync: syncLessons
  };
  // Accounts (create students, change passwords) through the "admin-users" Edge Function
  L.admin = async (action, payload) => {
    const { data, error } = await sb.functions.invoke("admin-users", { body: { action, domain: cfg.usernameDomain, ...(payload || {}) } });
    if (error) {
      let msg = error.message || String(error);
      try { const b = await error.context.json(); if (b && b.error) msg = b.error; } catch (e) {}
      const missing = /not found|404|Failed to send|FunctionsFetchError|FunctionsRelayError/i.test(msg + " " + (error.name || ""));
      const err = new Error(missing ? "The accounts helper isn’t installed yet." : msg); err.missing = missing; throw err;
    }
    if (data && data.error) throw new Error(data.error);
    return data;
  };
  // Teacher panel: read every student (allowed only for accounts in the "teachers" table)
  L.teacher = {
    async load() {
      const [p, g, h, c, st, ru, ad, pa] = await Promise.all([sb.from("profiles").select("*"), sb.from("progress").select("*"), sb.from("homework").select("*").order("created_at", { ascending: false }),
        sb.from("classes").select("*").order("starts_at", { ascending: false }), sb.from("student_settings").select("*"),
        sb.from("class_rules").select("*"), sb.from("student_admin").select("*"), sb.from("payments").select("*").order("paid_on", { ascending: false })]);
      const err = p.error || g.error || h.error; if (err) throw err;
      return { profiles: p.data || [], progress: g.data || [], homework: h.data || [], classes: c.error ? null : (c.data || []), settings: st.error ? null : (st.data || []),
        rules: ru.error ? null : (ru.data || []), admin: ad.error ? null : (ad.data || []), payments: pa.error ? null : (pa.data || []) };
    },
    async addHomework(row) { const { data, error } = await sb.from("homework").insert(row).select(); if (error) throw error; return data; },
    async deleteHomework(id) { const { error } = await sb.from("homework").delete().eq("id", id); if (error) throw error; },
    async saveClass(row) { const q = row.id ? sb.from("classes").update(row).eq("id", row.id) : sb.from("classes").insert(row); const { error } = await q; if (error) throw error; },
    async insert(table, rows) { const { error } = await sb.from(table).insert(rows); if (error) throw error; },
    async upsert(table, row) { const { error } = await sb.from(table).upsert(row); if (error) throw error; },
    async update(table, id, row) { const { error } = await sb.from(table).update(row).eq("id", id); if (error) throw error; },
    async remove(table, id) { const { error } = await sb.from(table).delete().eq("id", id); if (error) throw error; },
    async saveSettings(row) { const { error } = await sb.from("student_settings").upsert({ ...row, updated_at: new Date().toISOString() }); if (error) throw error; },
    async deleteClass(id) { const { error } = await sb.from("classes").delete().eq("id", id); if (error) throw error; }
  };
  // Class mode: the teacher runs a class on the student's account, so everything saves for the student
  L.actAs = async (s, go) => {
    if (timer) { clearTimeout(timer); timer = null; }
    try { await push(); } catch (e) {}
    clearLocal();
    if (s) lsSet("__actas", { id: s.id, name: s.name }); else localStorage.removeItem("lingua.__actas");
    lsSet("__teacher", true);
    sessionStorage.removeItem("lingua.reloaded"); sessionStorage.removeItem("lingua.reloadedL");
    location.href = root + (go || (s ? "index.html" : "teacher.html"));
  };
  function classBar() {
    if (!L.actingAs || document.getElementById("classBar")) return;
    const first = (L.actingAs.name || "your student").split(/\s+/)[0];
    const bar = document.createElement("div");
    bar.id = "classBar"; bar.className = "classbar";
    bar.innerHTML = `<span class="dot" aria-hidden="true"></span><span><b>Class mode</b> · You’re teaching ${L.esc ? L.esc(first) : first}. Everything saves to ${L.esc ? L.esc(first) : first}’s account.</span><button type="button" class="btn sm" id="endClass">End class</button>`;
    bar.querySelector("#endClass").onclick = () => L.actAs(null);
    const put = () => { if (!bar.isConnected || document.body.firstElementChild !== bar) document.body.prepend(bar); };
    put();
    new MutationObserver(put).observe(document.body, { childList: true });
  }
  L.signOut = async () => {
    if (timer) { clearTimeout(timer); await push(); }
    await sb.auth.signOut();
    clearLocal(); localStorage.removeItem("lingua.__actas");
    location.replace(root + "login.html");
  };

  L.ready = (async () => {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) {
      if (isLogin || isPublicReport) { show(); return null; }
      location.replace(root + "login.html?next=" + encodeURIComponent((root ? "clases/" : "") + page + location.search));
      return null;
    }
    if (isLogin) { location.replace(root + (qs.get("next") || "index.html")); return null; }
    uid = session.user.id;
    L.user = session.user;
    try { const r = await sb.rpc("is_teacher"); L.isTeacher = !r.error && r.data === true; } catch (e) { L.isTeacher = !!lsGet("__teacher"); }
    const act = lsGet("__actas");
    if (act && act.id && L.isTeacher) L.actingAs = act; else if (act) localStorage.removeItem("lingua.__actas");
    tid = L.actingAs ? L.actingAs.id : uid;
    if (lsGet("__uid") && lsGet("__uid") !== tid) clearLocal();
    lsSet("__uid", tid);
    lsSet("__teacher", L.isTeacher);
    try {
      await loadProfile();
      const changed = await pull();
      if (changed && !sessionStorage.getItem("lingua.reloaded")) { sessionStorage.setItem("lingua.reloaded", "1"); location.reload(); return null; }
      sessionStorage.removeItem("lingua.reloaded");
      L.lastSync = { ok: true, at: Date.now() };
    } catch (e) {
      L.lastSync = { ok: false, error: e.message || String(e), at: Date.now() };
      console.warn("Lingua sync failed:", e);
    }
    try { const c1 = await syncLessons(), c2 = await syncSettings().catch(() => false); if ((c1 || c2) && !sessionStorage.getItem("lingua.reloadedL")) { sessionStorage.setItem("lingua.reloadedL", "1"); location.reload(); return null; } } catch (e) {}
    sessionStorage.removeItem("lingua.reloadedL");
    if (L.isTeacher && !L.actingAs && page === "index.html" && !qs.has("preview")) { location.replace(root + "teacher.html"); return null; }
    if (!L.actingAs && !(L.profile && L.profile.display_name) && page !== "perfil.html") { location.replace(root + "perfil.html?setup=1"); return null; }
    decorate(); classBar(); show();
    L.homework.list().catch(() => {});
    L.classes.list().catch(() => {});
    return session.user;
  })();
  document.addEventListener("DOMContentLoaded", () => { if (L.profile) decorate(); });
})();
