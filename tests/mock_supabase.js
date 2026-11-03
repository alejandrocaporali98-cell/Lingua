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
      async signOut() { localStorage.removeItem("mock.session"); return {}; },
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
