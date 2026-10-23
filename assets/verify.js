// Lingua · checks a payment slip or a receipt against the database before showing it.
// The link carries a secret code; the database answers with the real folio, amount, names and
// bank details, so a link someone edits (or makes up) shows a warning instead of a fake slip.
(function () {
  const cfg = () => (window.LINGUA && window.LINGUA.cloud) || {};
  window.linguaVerify = async function (kind, token) {
    const c = cfg();
    if (!c.url || !c.key) return { state: "off" }; // site running without accounts (only on a test copy)
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token || "")) return { state: "invalid" };
    try {
      const r = await fetch(c.url + "/rest/v1/rpc/" + (kind === "slip" ? "slip_check" : "receipt_check"), {
        method: "POST", cache: "no-store",
        headers: { apikey: c.key, "Content-Type": "application/json" },
        body: JSON.stringify({ t: token })
      });
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
      const r = await fetch(c.url + "/rest/v1/rpc/" + name, {
        method: "POST", cache: "no-store",
        headers: { apikey: c.key, "Content-Type": "application/json" },
        body: JSON.stringify(args || {})
      });
      if (!r.ok) return { state: "error", status: r.status };
      const data = await r.json();
      return { state: "ok", data };
    } catch (e) { return { state: "error" }; }
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
