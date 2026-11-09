"""Hosting: the site also works on hosts that hide ".html" (Cloudflare Pages turns /login.html into /login).
Uses tests/pages_server.py, a small server that redirects and serves pages the same way."""
from harness import Env, check, run, MOCK, free_port
import os, re, socket, subprocess, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))


def serve(site):
    port = free_port()
    srv = subprocess.Popen([sys.executable, os.path.join(HERE, "pages_server.py"), site, str(port)])
    for _ in range(50):
        try: socket.create_connection(("127.0.0.1", port), timeout=.2).close(); break
        except OSError: time.sleep(.1)
    return srv, port


def test():
    # 1) Accounts: sign in as a student and as the teacher, no redirect loops, links built without ".html"
    with Env() as env:
        T = env.teacher(); sid = env.account(T, "Ada Canavati", "ada")
        env.DB["student_settings"][sid]["lessons"] = ["122", "123"]
        srv, port = serve(env.site); host = f"http://127.0.0.1:{port}"
        try:
            def dev():
                c = env.browser.new_context(viewport={"width": 1280, "height": 860})
                c.route(re.compile(r"^https?://(?!127\.0\.0\.1).*"), lambda r: r.abort())
                c.expose_binding("mockDB", env.mockdb)
                c.route("**/assets/vendor/supabase.js", lambda r: r.fulfill(body=MOCK, content_type="application/javascript"))
                c.route("**/rest/v1/rpc/**", env.rpc_route)
                pg = c.new_page(); pg.on("pageerror", lambda e: env.errs.append(str(e))); return pg
            S = dev(); S.goto(host + "/"); S.wait_for_timeout(1200)
            check(re.search(r"/login\?next=index\.html$", S.url), f"opening the site goes to sign-in once ({S.url.replace(host, '')})")
            S.fill("#user", "ada"); S.fill("#pass", "Pass12345"); S.click("#go"); S.wait_for_timeout(2500)
            check(S.title() == "Lingua · My learning", "a student signs in and lands on My learning")
            S.goto(host + "/clases/leccion-123.html"); S.wait_for_timeout(1500)
            check(S.url.endswith("/clases/leccion-123") and S.locator(".ov-hero h1").count() == 1, "lessons open at their clean address")
            P = dev(); P.goto(host + "/login.html"); P.wait_for_timeout(1000)
            P.fill("#user", "alejandro"); P.fill("#pass", "Teach1234"); P.click("#go"); P.wait_for_timeout(2500)
            check(P.title() == "Lingua · Teacher panel", "the teacher signs in and lands on the panel")
            check(P.evaluate("SITE()") == host + "/", "links for families (reports, receipts) use the site folder, not the page name")
            # Security headers: every page works under the Content-Security-Policy in _headers
            for pg in (S, P): pg.add_init_script("window.__csp = []; document.addEventListener('securitypolicyviolation', e => window.__csp.push(e.violatedDirective + ' ' + (e.blockedURI || '')))")
            seen = []
            for path in ["/index.html", "/perfil.html", "/practice.html", "/juegos.html?l=123", "/review.html", "/words.html", "/notes.html", "/grades.html", "/diplomas.html", "/clases/leccion-123.html", "/conoce.html", "/privacidad.html", "/terminos.html", "/missing-page"]:
                S.goto(host + path); S.wait_for_timeout(700); seen += [path + ": " + v for v in S.evaluate("window.__csp || []")]
            for h in ["#today", "#students", f"#s/{sid}/overview", "#schedule", "#reports", "#billing", "#plan", "#trials", "#accounts"]:
                P.goto(host + "/teacher.html" + h); P.wait_for_timeout(800); seen += [h + ": " + v for v in P.evaluate("window.__csp || []")]
            hdr = S.request.get(host + "/conoce.html").headers
            check("content-security-policy" in hdr and hdr.get("x-frame-options") == "SAMEORIGIN" and "microphone=(self)" in hdr.get("permissions-policy", ""), "security headers are sent")
            check(not seen, "no page breaks the security policy " + "; ".join(seen[:5]))
            check(not env.errs, "no page errors " + "; ".join(env.errs[:3]))
        finally:
            srv.terminate()

    # 2) Offline mode (service worker) on the same kind of host: pages still load with or without ".html"
    with Env(offline=True) as env:
        gp = os.path.join(env.site, "assets", "game.js"); g = open(gp).read()
        open(gp, "w").write(g.replace("|localhost|127\\.0\\.0\\.1", ""))   # let the service worker run on this test host
        srv, port = serve(env.site); host = f"http://localhost:{port}"
        try:
            c = env.browser.new_context(); pg = c.new_page(); pg.on("pageerror", lambda e: env.errs.append(str(e)))
            pg.goto(host + "/index.html"); pg.wait_for_timeout(2000)
            pg.goto(host + "/index.html"); pg.wait_for_timeout(800)
            check(pg.evaluate("!!(navigator.serviceWorker && navigator.serviceWorker.controller)"), "the service worker is active")
            ok = []
            for path, title in [("/perfil.html", "Lingua · Profile"), ("/perfil", "Lingua · Profile"), ("/clases/leccion-05.html", "Lesson 05 · Matchday"), ("/conoce.html", "Lingua · Clases de inglés personalizadas")]:
                pg.goto(host + path, timeout=8000); pg.wait_for_timeout(600); ok.append(pg.title() == title)
            check(all(ok), f"with the service worker, pages load from old and clean addresses {ok}")
            check(not env.errs, "no page errors " + "; ".join(env.errs[:3]))
        finally:
            srv.terminate()


if __name__ == "__main__":
    run(test)
