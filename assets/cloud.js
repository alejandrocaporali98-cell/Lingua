// Lingua accounts + cloud sync (Supabase).
// - Pages need a signed-in student (except login.html and a shared report link).
// - Progress lives in localStorage while you use the site and is synced to the
//   "progress" table: on page load (pull + merge) and a moment after every change (push).
// - Each saved key carries its change time, so the newest value always wins.
(function () {
  const L = window.LINGUA, cfg = L.cloud || {};
  const LOCAL_ONLY = ["textSize", "modoClase", "reportLang"];
  const root = /\/clases\//.test(location.pathname) ? "../" : "";
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const qs = new URLSearchParams(location.search);
  const isLogin = page === "login.html";
  const isPublicReport = page === "reporte.html" && qs.has("r");

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
  function clearLocal() {
    const kill = [];
    for (let i = 0; i < localStorage.length; i++) {
      const full = localStorage.key(i);
      if (full && full.indexOf("lingua.") === 0 && LOCAL_ONLY.indexOf(full.slice(7)) < 0) kill.push(full);
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
      if (name) { el.textContent = name[0].toUpperCase(); el.style.background = p.avatar_color || "var(--ink)"; el.classList.add("has-name"); }
    });
    if (first) document.querySelectorAll("[data-greet]").forEach(el => el.textContent = "Welcome back, " + first);
  }
  L.decorate = decorate;

  if (!L.cloudEnabled) {
    L.ready = Promise.resolve(null);
    show();
    document.addEventListener("DOMContentLoaded", decorate);
    return;
  }

  const sb = window.supabase.createClient(cfg.url, cfg.key, { auth: { persistSession: true, autoRefreshToken: true, storageKey: "lingua.__auth" } });
  L.sb = sb;
  setTimeout(show, 10000); // never leave a blank page if the network is very slow

  let uid = null, timer = null, pushing = false, again = false;
  async function push() {
    if (!uid) return;
    if (pushing) { again = true; return; }
    pushing = true;
    try {
      const { error } = await sb.from("progress").upsert({ user_id: uid, data: collectLocal(), updated_at: new Date().toISOString() });
      L.lastSync = error ? { ok: false, error: error.message, at: Date.now() } : { ok: true, at: Date.now() };
      document.dispatchEvent(new CustomEvent("lingua:sync", { detail: L.lastSync }));
    } catch (e) { L.lastSync = { ok: false, error: String(e), at: Date.now() }; }
    pushing = false;
    if (again) { again = false; push(); }
  }
  L.syncNow = push;
  L.onSet = (k) => { if (!uid || !synced(k)) return; clearTimeout(timer); timer = setTimeout(push, 700); };
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden" && timer) { clearTimeout(timer); timer = null; push(); } });

  async function pull() {
    const { data, error } = await sb.from("progress").select("data").eq("user_id", uid).maybeSingle();
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
    const { data } = await sb.from("profiles").select("*").eq("id", uid).maybeSingle();
    L.profile = data || { id: uid };
    lsSet("__profile", L.profile);
    return L.profile;
  }
  L.saveProfile = async (fields) => {
    const row = { ...fields, id: uid, updated_at: new Date().toISOString() };
    const { data, error } = await sb.from("profiles").upsert(row).select().maybeSingle();
    if (error) throw error;
    L.profile = data || row; lsSet("__profile", L.profile); decorate();
    return L.profile;
  };
  L.signOut = async () => {
    if (timer) { clearTimeout(timer); await push(); }
    await sb.auth.signOut();
    clearLocal();
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
    if (lsGet("__uid") && lsGet("__uid") !== uid) clearLocal();
    lsSet("__uid", uid);
    L.user = session.user;
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
    if (!(L.profile && L.profile.display_name) && page !== "perfil.html") { location.replace(root + "perfil.html?setup=1"); return null; }
    decorate(); show();
    return session.user;
  })();
  document.addEventListener("DOMContentLoaded", () => { if (L.profile) decorate(); });
})();
