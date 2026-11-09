"""Test harness for Lingua.

Serves a copy of the site on localhost and replaces Supabase with a small fake that lives in Python,
so the tests can sign in, create accounts, record payments… without touching the real project.
Nothing here talks to the internet.

    from harness import Env, check
    with Env() as env:
        T = env.teacher()                 # signed-in teacher page
        ids = env.account(T, "Ada Canavati", "ada")
"""
import json, os, re, shutil, socket, subprocess, sys, tempfile, time, uuid, datetime as dt
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out")          # screenshots (ignored by git)
MOCK = open(os.path.join(HERE, "mock_supabase.js")).read()
DOMAIN = "student.lingua.app"

KEY = {"profiles": "id", "progress": "user_id", "homework": "id", "classes": "id", "lessons": "id", "student_settings": "student_id",
       "class_rules": "id", "student_admin": "student_id", "payments": "id", "recordings": "id", "cal_tokens": "owner", "staff": "user_id",
       "teachers": "user_id", "charges": "id", "billing_info": "id", "student_notes": "student_id", "trials": "id",
       "client_errors": "id", "teacher_meta": "key", "shared_docs": "id"}
# column that says whose row it is (students can read their own rows)
OWNER = {"recordings": "student_id", "cal_tokens": "owner", "student_settings": "student_id", "profiles": "id", "progress": "user_id",
         "homework": "student_id", "classes": "student_id"}
ADMIN_READ = {"profiles", "student_settings", "classes", "class_rules", "student_admin", "payments", "staff", "teachers", "charges", "billing_info"}
ADMIN_WRITE = {"classes", "class_rules", "student_admin", "payments", "charges", "billing_info"}
TEACHER_ONLY = {"client_errors", "teacher_meta", "student_notes", "trials", "shared_docs"}


class Fail(AssertionError):
    pass


def check(cond, msg):
    if not cond:
        raise Fail(msg)
    print("  ok ·", msg)


def now_iso(delta=None):
    t = dt.datetime.now(dt.timezone.utc) + (delta or dt.timedelta())
    return t.strftime("%Y-%m-%dT%H:%M:%S.000Z")


def free_port():
    s = socket.socket(); s.bind(("127.0.0.1", 0)); p = s.getsockname()[1]; s.close(); return p


class Env:
    def __init__(self, offline=False):
        """offline=True serves the site with Supabase turned off (lessons work from the browser only)."""
        self.offline = offline
        self.DB = {t: {} for t in KEY}
        self.USERS = {}            # email -> [id, password]
        self.BANNED = set()
        self.TEACHERS = set()
        self.RPC_DOWN = False
        self.errs = []

    # ── site + browser ──
    def __enter__(self):
        self.site = tempfile.mkdtemp(prefix="lingua-site-")
        shutil.copytree(ROOT, self.site, dirs_exist_ok=True, ignore=shutil.ignore_patterns(".git", "tests", "node_modules"))
        if self.offline:
            p = os.path.join(self.site, "assets", "config.js"); c = open(p).read()
            c = re.sub(r'url: "https://[^"]+",', 'url: "",', c); c = re.sub(r'key: "sb_[^"]+",', 'key: "",', c)
            open(p, "w").write(c)
        self.port = free_port()
        self.srv = subprocess.Popen([sys.executable, "-m", "http.server", str(self.port), "--bind", "127.0.0.1"], cwd=self.site,
                                    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for _ in range(50):
            try: socket.create_connection(("127.0.0.1", self.port), timeout=.2).close(); break
            except OSError: time.sleep(.1)
        os.makedirs(OUT, exist_ok=True)
        self.pw = sync_playwright().start()
        self.browser = self.pw.chromium.launch()
        return self

    def __exit__(self, *a):
        try: self.browser.close(); self.pw.stop()
        finally:
            self.srv.terminate(); shutil.rmtree(self.site, ignore_errors=True)

    def url(self, path=""):
        return f"http://127.0.0.1:{self.port}/{path}"

    def device(self, name, w=1366, h=900):
        c = self.browser.new_context(viewport={"width": w, "height": h}, accept_downloads=True)
        c.route(re.compile(r"^https?://(?!127\.0\.0\.1).*"), lambda r: r.abort())   # no internet (fonts, CDNs); later routes win
        if not self.offline:
            c.expose_binding("mockDB", self.mockdb)
            c.route("**/assets/vendor/supabase.js", lambda r: r.fulfill(body=MOCK, content_type="application/javascript"))
            c.route("**/rest/v1/rpc/**", self.rpc_route)
        pg = c.new_page()
        pg.on("dialog", lambda d: d.accept())
        pg.on("pageerror", lambda e: self.errs.append(f"{name}: {e}"))
        pg.on("console", lambda m: m.type == "error" and not re.search(r"net::|Failed to load resource|ERR_", m.text) and self.errs.append(f"{name} console: {m.text}"))
        return pg

    def fresh(self, pg, path, wait=1000):
        pg.goto("about:blank"); pg.goto(self.url(path)); pg.wait_for_timeout(wait)

    def login(self, pg, user, password):
        pg.goto(self.url("index.html")); pg.wait_for_url("**/login.html**")
        pg.fill("#user", user); pg.fill("#pass", password); pg.click("#go")

    def teacher(self, name="Alejandro Caporali"):
        """A signed-in teacher with a profile, on the teacher panel."""
        tid = "t-1"
        self.USERS["alejandro@" + DOMAIN] = [tid, "Teach1234"]; self.TEACHERS.add(tid); self.DB["teachers"][tid] = {"user_id": tid}
        T = self.device("T"); self.login(T, "alejandro", "Teach1234"); T.wait_for_url("**/perfil.html?setup=1")
        T.fill("#dn", name); T.click("#psave"); T.wait_for_timeout(1200)
        return T

    def account(self, T, name, user, kind="student", password="Pass12345"):
        """Create an account from the teacher panel (Accounts) and return its id."""
        self.fresh(T, "teacher.html#accounts", 300); T.wait_for_selector("#accForm")
        T.fill("#aN", name); T.fill("#aU", user); T.fill("#aP", password); T.select_option("#aR", kind); T.click("#aSave")
        for _ in range(40):
            if (user + "@" + DOMAIN) in self.USERS: break
            T.wait_for_timeout(100)
        T.wait_for_timeout(600)
        return self.USERS[user + "@" + DOMAIN][0]

    # ── fake Supabase ──
    def admins(self):
        return set(self.DB["staff"])

    def fam_names(self, sid):
        fam = (self.DB["student_admin"].get(sid) or {}).get("family")
        ids = [sid] + [x for x, r in self.DB["student_admin"].items() if fam and r.get("family") == fam and x != sid]
        return sorted(self.DB["profiles"][i]["display_name"] for i in ids if i in self.DB["profiles"])

    def rpc_route(self, route):
        DB = self.DB
        if self.RPC_DOWN: return route.abort()
        req = route.request; fn = req.url.split("/rpc/")[1].split("?")[0]
        if not req.headers.get("apikey"): return route.fulfill(status=401, body="{}")
        body = json.loads(req.post_data or "{}"); t = body.get("t"); out = None
        if fn == "trial_get":
            r = next((x for x in DB["trials"].values() if x.get("token") == t), None)
            if r: out = {"name": r.get("name"), "starts_at": r.get("starts_at"), "adult": r.get("adult"), "interests": r.get("interests"), "other": r.get("other"),
                         "goal": r.get("goal"), "sent": bool(r.get("intake_at")), "closed": bool(r.get("report_at"))}
        elif fn == "trial_intake":
            r = next((x for x in DB["trials"].values() if x.get("token") == t and not x.get("report_at")), None)
            out = bool(r and (body.get("p_name") or "").strip())
            if out: r.update({"name": body["p_name"].strip(), "adult": body["p_adult"], "interests": body["p_interests"], "other": body.get("p_other") or None,
                              "goal": body["p_goal"], "intake_at": now_iso()})
        elif fn == "trial_report":
            r = next((x for x in DB["trials"].values() if x.get("token") == t and x.get("report_at")), None)
            if r: out = {**r["report"], "sent_at": r["report_at"]}
        elif fn == "slip_check":
            c = next((c for c in DB["charges"].values() if c.get("token") == t), None)
            if c:
                b = DB["billing_info"].get(1, {})
                out = {"folio": c["folio"], "concept": c.get("concept"), "amount": c["amount"], "month": c["month"], "week": c.get("week"), "created": c["created_at"],
                       "currency": "MXN", "names": self.fam_names(c["student_id"]),
                       "bank": {"bank": b.get("bank"), "holder": b.get("holder"), "clabe": b.get("clabe"), "account": b.get("account"), "card": b.get("card"),
                                "to": b.get("send_to"), "ins": b.get("instructions")}}
        elif fn == "doc_get":
            r = DB["shared_docs"].get(t)
            if r and not r.get("revoked_at"): out = {"page": r.get("page"), "d": r.get("d")}
        elif fn == "trial_consent":
            r = next((x for x in DB["trials"].values() if x.get("token") == t), None)
            if r: r.setdefault("consent_at", now_iso()); out = True
        elif fn == "receipt_check":
            p_ = next((x for x in DB["payments"].values() if x.get("token") == t), None)
            if p_: out = {"amount": p_["amount"], "paid_on": p_["paid_on"], "month": p_["month"], "week": p_.get("week"), "method": p_.get("method"),
                          "reference": p_.get("reference"), "currency": "MXN", "names": self.fam_names(p_["student_id"])}
        route.fulfill(status=200, content_type="application/json", body=json.dumps(out))

    def admin_fn(self, me, body):
        """The admin-users Edge Function."""
        DB, USERS = self.DB, self.USERS
        if me not in self.TEACHERS: return {"error": "Only teachers can do this."}
        a = body.get("action"); uid = body.get("user_id")
        if a == "list":
            return {"users": [{"id": v[0], "email": k, "created_at": "2026-10-01T00:00:00Z", "last_sign_in_at": None,
                               "banned_until": "2126-01-01T00:00:00Z" if v[0] in self.BANNED else None} for k, v in USERS.items()]}
        if a == "create":
            email = body["username"] + "@" + body["domain"]
            if email in USERS: return {"error": "A user with this email address has already been registered"}
            nid = "u-" + str(len(USERS) + 1); USERS[email] = [nid, body["password"]]
            DB["profiles"][nid] = {"id": nid, "display_name": body.get("display_name")}
            DB["student_settings"][nid] = {"student_id": nid, "lessons": [], "theme": body.get("theme")}
            return {"user": {"id": nid, "email": email}}
        if a == "password":
            for v in USERS.values():
                if v[0] == uid: v[1] = body["password"]
            return {"ok": True}
        if a in ("archive", "restore"):
            if uid in self.TEACHERS: return {"error": "Teacher accounts can't be archived here."}
            row = DB["student_admin"].setdefault(uid, {"student_id": uid})
            row["archived_at"] = now_iso() if a == "archive" else None
            (self.BANNED.add if a == "archive" else self.BANNED.discard)(uid)
            return {"ok": True}
        if a == "delete":
            if not (DB["student_admin"].get(uid) or {}).get("archived_at"): return {"error": "Archive the account first. Only archived accounts can be deleted."}
            for k in [k for k, v in USERS.items() if v[0] == uid]: del USERS[k]
            for t in DB:
                for key in [key for key, r in DB[t].items() if uid in (r.get("student_id"), r.get("id"), r.get("user_id"))]: del DB[t][key]
            self.BANNED.discard(uid)
            return {"ok": True}
        return {"error": "Unknown action"}

    def mockdb(self, src, op, payload):
        DB = self.DB; p = json.loads(payload)
        if op == "signin":
            u = self.USERS.get(p["email"])
            if not u or u[1] != p["password"]: return json.dumps({"error": "bad"})
            if u[0] in self.BANNED: return json.dumps({"error": "banned", "message": "User is banned"})
            return json.dumps({"user": {"id": u[0], "email": p["email"], "created_at": "2026-10-01T00:00:00Z"}})
        if op == "rpc":
            if p["fn"] == "is_admin": return json.dumps({"data": p["uid"] in self.admins(), "error": None})
            return json.dumps({"data": p["uid"] in self.TEACHERS, "error": None})
        if op == "fn":
            return json.dumps(self.admin_fn(p["uid"], p["body"] or {}))
        if op == "storage":
            staff = p["uid"] in self.TEACHERS or p["uid"] in self.admins()
            if p["bucket"] == "comprobantes" and not staff: return json.dumps({"error": "storage RLS"})
            return json.dumps({"ok": True})
        t, me = p["table"], p["uid"]
        if t not in KEY: return json.dumps({"data": None, "error": {"message": f'relation "public.{t}" does not exist'}})
        teacher = me in self.TEACHERS; admin = me in self.admins(); own = OWNER.get(t)
        def can_read(r):
            if teacher: return True
            if t in TEACHER_ONLY: return False
            return (admin and t in ADMIN_READ) or (own and r.get(own) == me) or (t == "lessons" and r.get("published"))
        can_write = teacher or (admin and t in ADMIN_WRITE)
        if t in ("progress", "homework", "recordings") and admin and not teacher: visible = [r for r in DB[t].values() if r.get(own) == me]
        else: visible = [r for r in DB[t].values() if can_read(r)]
        match = lambda r: all(r.get(k) == v for k, v in p["filters"].items())
        rows_in = lambda: p["row"] if isinstance(p["row"], list) else [p["row"]]
        err = lambda m: json.dumps({"data": None, "error": {"message": m}})
        if p["op"] == "select":
            res = [r for r in visible if match(r)]
            return json.dumps({"data": (res[0] if res else None) if p["single"] else res, "error": None})
        if p["op"] == "upsert":
            row = p["row"]
            if t in ("progress", "profiles", "cal_tokens"):
                if row.get(own) != me and not (teacher and t == "progress"): return err("RLS")
            elif not can_write: return err("RLS " + t)
            k = row[KEY[t]]; DB[t][k] = {**DB[t].get(k, {}), **row}; return json.dumps({"data": DB[t][k], "error": None})
        if p["op"] == "insert":
            out = []
            for r0 in rows_in():
                if t == "client_errors":
                    if r0.get("user_id") != me: return err("RLS client_errors")
                elif t == "staff":
                    if not teacher: return err("RLS staff")
                elif not can_write: return err("RLS: " + t)
                if t == "payments" and r0.get("method") not in (None, "transfer", "cash", "deposit", "card", "other"): return err("check method")
                row = {**({"status": "scheduled"} if t == "classes" else {}), **({"active": True, "minutes": 60} if t == "class_rules" else {}),
                       **({"paid_on": time.strftime("%Y-%m-%d")} if t == "payments" else {}), **r0, "created_at": now_iso()}
                if KEY[t] == "id": row["id"] = str(uuid.uuid4())
                if t in ("payments", "charges", "trials"): row.setdefault("token", str(uuid.uuid4()))
                DB[t][row[KEY[t]]] = row; out.append(row)
            return json.dumps({"data": (out[0] if out else None) if p.get("single") else out, "error": None})
        if p["op"] == "update":
            if t == "profiles": hit = [r for r in visible if match(r) and (teacher or r["id"] == me)]
            elif not can_write: return err("RLS update " + t)
            else: hit = [r for r in visible if match(r)]
            for r in hit: r.update(p["row"])
            return json.dumps({"data": (hit[0] if hit else None) if p.get("single") else hit, "error": None})
        if p["op"] == "delete":
            if not can_write: return err("RLS")
            for r in [r for r in visible if match(r)]: del DB[t][r[KEY[t]]]
            return json.dumps({"data": None, "error": None})
        return err("unknown op")


def run(fn):
    """Run one test function and report pass / fail (used by every test file)."""
    name = fn.__module__ if fn.__module__ != "__main__" else os.path.basename(sys.argv[0])
    print(f"▶ {name}")
    t0 = time.time()
    try:
        fn()
    except Exception as e:
        print(f"✗ {name} FAILED after {time.time() - t0:.0f}s: {e}")
        sys.exit(1)
    print(f"✓ {name} passed in {time.time() - t0:.0f}s")
