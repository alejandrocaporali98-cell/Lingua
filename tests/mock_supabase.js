// Supabase stand-in for the tests (lists, insert, update, delete, rpc, functions, storage).
// The fake database lives in Python (tests/harness.py) and is reached through window.mockDB.
(function () {
  const call = (op, p) => window.mockDB(op, JSON.stringify(p || {})).then(r => JSON.parse(r));
  const uid = () => { const s = JSON.parse(localStorage.getItem("mock.session") || "null"); return s && s.user.id; };
  function query(table) {
    const st = { table, filters: {}, op: "select", row: null, single: false, ret: false };
    const q = {
      select() { if (st.op !== "select") st.ret = true; return q; },
      eq(c, v) { st.filters[c] = v; return q; },
      order() { return q; }, limit() { return q; }, range() { return q; }, gte() { return q; }, lte() { return q; }, lt() { return q; }, gt() { return q; }, is() { return q; }, in() { return q; }, neq() { return q; },
      single() { st.single = true; st.strict = true; return run(); },
      upsert(row) { st.op = "upsert"; st.row = row; return q; },
      insert(row) { st.op = "insert"; st.row = row; return q; },
      update(row) { st.op = "update"; st.row = row; return q; },
      delete() { st.op = "delete"; return q; },
      maybeSingle() { st.single = true; return run(); },
      then(res, rej) { return run().then(res, rej); }
    };
    const run = () => call("q", { ...st, uid: uid() });
    return q;
  }
  window.supabase = { createClient() { return {
    auth: {
      async getSession() { return { data: { session: JSON.parse(localStorage.getItem("mock.session") || "null") } }; },
      async signInWithPassword({ email, password }) {
        const r = await call("signin", { email, password });
        if (r.error) return { error: { message: r.message || "Invalid login credentials" } };
        localStorage.setItem("mock.session", JSON.stringify({ user: r.user })); return { data: r, error: null };
      },
      async signOut() { localStorage.removeItem("mock.session"); localStorage.removeItem("mock.aal"); return {}; },
      async refreshSession() { return { data: {}, error: null }; },
      // Two-step verification (TOTP): the right code is always 123456
      mfa: {
        _f() { return JSON.parse(localStorage.getItem("mock.mfa") || "null"); },
        async listFactors() { const f = this._f(); return { data: { all: f ? [f] : [], totp: f ? [f] : [] }, error: null }; },
        async enroll() { const f = { id: "f1", factor_type: "totp", status: "unverified" }; localStorage.setItem("mock.mfa", JSON.stringify(f)); return { data: { id: "f1", totp: { qr_code: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'/%3E", secret: "JBSWY3DPEHPK3PXP" } }, error: null }; },
        async challengeAndVerify({ code }) { if (code !== "123456") return { error: { message: "Invalid TOTP code entered" } }; const f = this._f(); f.status = "verified"; localStorage.setItem("mock.mfa", JSON.stringify(f)); localStorage.setItem("mock.aal", "aal2"); return { data: {}, error: null }; },
        async unenroll() { localStorage.removeItem("mock.mfa"); return { error: null }; },
        async getAuthenticatorAssuranceLevel() { const f = this._f(); return { data: { currentLevel: localStorage.getItem("mock.aal") || "aal1", nextLevel: f && f.status === "verified" ? "aal2" : "aal1" }, error: null }; }
      },
      async updateUser() { return { error: null }; }
    },
    from: query,
    storage: { from: (bucket) => ({
      upload: async (path, blob) => { const r = await call("storage", { op: "upload", bucket, path, size: blob.size, type: blob.type, uid: uid() }); return r.error ? { error: { message: r.error } } : { data: { path }, error: null }; },
      createSignedUrl: async (path) => ({ data: { signedUrl: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=" }, error: null }),
      remove: async (paths) => { await call("storage", { op: "remove", bucket, paths, uid: uid() }); return { error: null }; }
    }) },
    rpc: (fn) => call("rpc", { fn, uid: uid() }),
    functions: { invoke: async (name, opt) => { const r = await call("fn", { name, body: (opt || {}).body, uid: uid() }); return r.error ? { data: null, error: Object.assign(new Error(r.error), { context: { json: async () => ({ error: r.error }) } }) } : { data: r, error: null }; } }
  }; } };
})();
