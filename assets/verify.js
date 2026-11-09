// Lingua · checks a payment slip or a receipt against the database before showing it.
// The link carries a secret code; the database answers with the real folio, amount, names and
// bank details, so a link someone edits (or makes up) shows a warning instead of a fake slip.
(function () {
  const cfg = () => (window.LINGUA && window.LINGUA.cloud) || {};
  // POST with a time limit (a stuck connection or a privacy blocker never leaves the page waiting forever)
  // and one automatic retry for network hiccups.
  async function post(url, key, body, tries) {
    for (let i = 0; i < (tries || 2); i++) {
      const ctl = typeof AbortController === "function" ? new AbortController() : null, timer = ctl && setTimeout(() => ctl.abort(), 12000);
      try {
        const r = await fetch(url, { method: "POST", cache: "no-store", headers: { apikey: key, "Content-Type": "application/json" }, body: JSON.stringify(body), signal: ctl ? ctl.signal : undefined });
        clearTimeout(timer); return r;
      } catch (e) { clearTimeout(timer); if (i === (tries || 2) - 1) throw e; await new Promise(res => setTimeout(res, 1200)); }
    }
  }
  window.linguaVerify = async function (kind, token) {
    const c = cfg();
    if (!c.url || !c.key) return { state: "off" }; // site running without accounts (only on a test copy)
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token || "")) return { state: "invalid" };
    try {
      const r = await post(c.url + "/rest/v1/rpc/" + (kind === "slip" ? "slip_check" : "receipt_check"), c.key, { t: token });
      if (!r.ok) return { state: "error" };
      const data = await r.json();
      return data && typeof data === "object" ? { state: "ok", data } : { state: "invalid" };
    } catch (e) { return { state: "error" }; }
  };
  // Any public database function (trial class form and report). Only the publishable key is sent.
  window.linguaRpc = async function (name, args) {
    const c = cfg();
    if (!c.url || !c.key) return { state: "off" };
    try {
      const r = await post(c.url + "/rest/v1/rpc/" + name, c.key, args || {});
      if (!r.ok) return { state: "error", status: r.status };
      const data = await r.json();
      return { state: "ok", data };
    } catch (e) { return { state: "error" }; }
  };
  // Pages opened from a private link (?t=CODE) get their document from the database before they draw
  window.linguaShared = function (run) {
    const qp = new URLSearchParams(location.search), t = qp.get("t");
    if (!t || qp.get("d")) return run();
    const fail = (es, en) => { document.body.innerHTML = `<div style="max-width:440px;margin:18vh auto;padding:0 20px;font-family:'Plus Jakarta Sans',system-ui,sans-serif;text-align:center;display:grid;gap:10px;color:#1c1d1f"><b style="font-size:1.3em">${es}</b><span style="color:#6a6f73">${en}</span></div>`; };
    if (!window.linguaUuid(t)) return fail("Este enlace no es válido", "This link isn't valid.");
    window.linguaRpc("doc_get", { t }).then(r => {
      if (r.state === "ok" && r.data && r.data.d) { window.__sharedD = r.data.d; return run(); }
      if (r.state === "ok") return fail("Este enlace ya no está disponible", "This link has expired or was turned off. Ask your teacher for a new one.");
      fail("No pudimos abrir el documento", "Check your internet connection and open the link again.");
    });
  };
  window.linguaUuid = s => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s || "");
  // "Derek y Erick Molina" · "Ana Pérez y Luis Gómez"
  window.linguaNames = function (list) {
    const n = (list || []).map(x => String(x || "").trim()).filter(Boolean);
    if (n.length < 2) return n[0] || "";
    const join = a => a.slice(0, -1).join(", ") + " y " + a[a.length - 1];
    const last = n.map(x => x.split(/\s+/).slice(1).join(" "));
    return last[0] && last.every(l => l === last[0]) ? join(n.map(x => x.split(/\s+/)[0])) + " " + last[0] : join(n);
  };
  window.linguaDay = d => { const x = new Date(d); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); };
})();
