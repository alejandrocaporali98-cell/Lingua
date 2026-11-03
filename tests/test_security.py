"""Security: names, notes and answers that contain HTML must never run as code anywhere (teacher, office, student and family pages)."""
from harness import Env, check, run
import datetime as dt


def test():
    with Env() as env:
        T = env.teacher()
        ids = {}
        for n, u, typ in [("Emiliano Sánchez", "emiliano.sanchez", "student"), ("Derek Molina", "derek", "student"), ("Josefina Sánchez", "josefina", "admin")]:
            ids[u] = env.account(T, n, u, typ)
        jid = ids["josefina"]
        check(jid in env.DB["staff"] and jid not in env.DB["student_settings"], "office account is staff, not a student")
        env.fresh(T, "teacher.html#students", 900)
        check("Josefina" not in T.inner_text("#app"), "office account isn't listed as a student")
        missed = []
        X = '"\'><img src=x onerror="window.__x=(window.__x||[]).concat(location.hash||location.pathname)">'
        e, d = ids["emiliano.sanchez"], ids["derek"]
        now = dt.datetime.now(dt.timezone.utc); iso = lambda x: x.strftime("%Y-%m-%dT%H:%M:%S.000Z"); today = now.date().isoformat()
        # everything a student can write about themselves
        env.DB["profiles"][d].update({"display_name": "Derek " + X, "interests": [X, "music"], "age": 20})
        prog = {"attempts.216": [{"ok": 12, "n": 20, "at": iso(now)}], "score.216": {"ok": 12, "n": 20, "at": iso(now)}, "placement": {"nivel": X, "fecha": today, "secciones": [{"t": X, "ok": 1, "n": 2}], "r": X},
                "review": {"r1": {"id": "r1", "l": "216.final", "p": X + " ___", "a": X}}, "avatar": {"style": X, "shell": X, "number": X, "bg": X},
                "game": {"xp": 50, "days": {today: 10}, "best": 2}, "counters": {"spoken": 3}, "badges": {"first": {"at": iso(now), "t": X}}, "lap.216": {"t": 30, "at": iso(now)},
                "done.216": [0, 1], "diploma.216": {"ok": 18, "n": 20, "at": iso(now), "name": X}, "words": [X], "notes": X, "reviewLearned": 2}
        env.DB["progress"][d] = {"user_id": d, "updated_at": iso(now), "data": {k: {"v": v, "t": 1} for k, v in prog.items()}}
        env.DB["student_settings"][d] = {"student_id": d, "lessons": ["216", "301"], "theme": "cinema"}
        env.DB["homework"]["h1"] = {"id": "h1", "student_id": d, "title": "Write about a film", "due": today, "done_at": iso(now), "answer": X, "audio_path": d + "/hw/" + X, "submitted_at": iso(now), "created_at": iso(now)}
        env.DB["recordings"]["r1"] = {"id": "r1", "student_id": d, "lesson_id": X, "prompt": X, "path": d + "/talk/a.webm", "seconds": 4, "created_at": iso(now)}
        # what the teacher / office write (still should be escaped)
        env.DB["student_admin"][d] = {"student_id": d, "billing": "per_class", "rate": 250, "currency": "MXN", "notes": X, "phone": X, "parent_phone": "8112345678"}
        env.DB["classes"]["c1"] = {"id": "c1", "student_id": d, "starts_at": iso(now - dt.timedelta(days=1)), "status": "attended", "notes": X, "words": X, "title": X, "lesson_id": "216"}
        env.DB["classes"]["c2"] = {"id": "c2", "student_id": d, "starts_at": iso(now + dt.timedelta(days=1)), "status": "scheduled", "lesson_id": "216"}
        env.DB["payments"]["p1"] = {"id": "p1", "student_id": d, "month": now.strftime("%Y-%m"), "amount": 250, "paid_on": today, "method": "transfer", "reference": X, "note": X, "proof_path": d + "/" + X + ".png", "created_at": iso(now)}
        env.DB["charges"]["f1"] = {"id": "f1", "student_id": d, "month": now.strftime("%Y-%m"), "folio": "F-" + X[:20], "concept": X, "amount": 250, "note": X, "created_at": iso(now)}
        env.DB["billing_info"][1] = {"id": 1, "bank": X, "holder": X, "clabe": "012580001234567891", "send_to": X, "instructions": X}
        env.DB["client_errors"]["e1"] = {"id": "e1", "user_id": d, "created_at": iso(now), "page": X, "message": X, "detail": X, "agent": X, "build": X}
        env.DB["student_admin"][d]["meet_link"] = "https://teams.microsoft.com/" + X
        def fresh(pg, url): env.fresh(pg, url, 1100)
        hits = []
        def probe(pg, label):
            v = pg.evaluate("window.__x || null")
            if v: print("   WHERE", label, pg.evaluate("[...document.querySelectorAll('img[src=\"x\"]')].map(i => (i.parentElement.outerHTML || '').slice(0, 260))"))
            if v: hits.append((label, v))
        B = "teacher.html"; A = "admin.html"
        T.set_viewport_size({"width": 1366, "height": 900})
        views = ["#today", "#students", "#schedule", "#reports", f"#reports/{d}/30", "#billing", "#billing/payments/all", f"#billing/slips/{d}", "#billing/bank", "#accounts"] + [f"#s/{d}/{t}" for t in ["overview", "lessons", "classes", "homework", "voice", "billing", "reports"]]
        for v in views: fresh(T, B + v); probe(T, "teacher " + v)
        # open sheets / menus that render student data
        fresh(T, B + "#students"); 
        try: T.click("[data-more] >> visible=true", timeout=3000); T.wait_for_timeout(500); probe(T, "teacher student menu")
        except Exception as ex: missed.append("menu")
        fresh(T, B + "#billing")
        try: T.click(f'[data-pay="{d}"] >> visible=true', timeout=3000); T.wait_for_timeout(500); probe(T, "teacher pay sheet")
        except Exception as ex: missed.append("pay sheet")
        # report / receipt / slip links opened by families
        links = T.evaluate("[...document.querySelectorAll('a[href*=\"recibo.html\"], a[href*=\"ficha.html\"], a[href*=\"informe.html\"], a[href*=\"reporte.html\"]')].map(a => a.href)")
        fresh(T, B + "#billing/payments/all"); links += T.evaluate("[...document.querySelectorAll('a[href*=\"recibo.html\"]')].map(a => a.href)")
        fresh(T, B + f"#billing/slips/{d}"); links += T.evaluate("[...document.querySelectorAll('a[href*=\"ficha.html\"]')].map(a => a.href)")
        # office
        J = env.device("J", 1280, 900); env.login(J, "josefina", "Pass12345"); J.wait_for_url("**/admin.html**", timeout=15000); J.wait_for_timeout(800); probe(J, "office #inicio")
        for v in ["#alumnos", f"#a/{d}", "#agenda", "#pagos/todos", "#fichas", "#banco"]: fresh(J, A + v); probe(J, "office " + v)
        # student's own pages (self-XSS is less important but shows unescaped spots)
        S = env.device("S", 1280, 900); env.login(S, "derek", "Pass12345"); S.wait_for_timeout(1500)
        for pth in ["index.html", "perfil.html", "progress.html", "review.html", "diplomas.html", "grades.html", "plan.html", "notes.html", "words.html"]:
            fresh(S, pth); probe(S, "student " + pth)
        F = env.device("F", 900, 1100)
        links = [u for u in set(links) if u.startswith(env.url())]
        for u in links: F.goto("about:blank"); F.goto(u); F.wait_for_timeout(1100); probe(F, "public " + u.split("/")[-1][:30])
        check(len(set(links)) >= 2, f"family links found ({len(set(links))})")
        check(not missed, "menus opened: " + ", ".join(missed))
        check(not hits, "no injected HTML ran anywhere " + str(hits[:3]))
        check(not env.errs, "no page errors: " + "; ".join(env.errs[:3]))


if __name__ == "__main__":
    run(test)
