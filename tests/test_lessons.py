"""Every lesson: the content is consistent, every section opens, and the reading, grammar and error exercises can be completed.
Run for some lessons only: python tests/test_lessons.py 301 302"""
from harness import Env, check, run, ROOT
import glob, json, os, re, subprocess, sys

IDS = sys.argv[1:] or sorted(os.path.basename(p)[:-3] for p in glob.glob(os.path.join(ROOT, "assets", "lessons", "*.js")))


def load(lid):
    out = subprocess.run(["node", "-e", "global.window={};require(process.argv[1]);process.stdout.write(JSON.stringify(window.CLASE))",
                          os.path.join(ROOT, "assets", "lessons", lid + ".js")], capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def content_problems(c):
    """Mistakes that are easy to make when writing a lesson by hand."""
    bad = []
    for e in (c.get("errors") or {}).get("items", []):
        if not 0 <= e["wrong"] < len(e["sentence"].split()): bad.append(f"errors: word {e['wrong']} doesn't exist in “{e['sentence']}”")
    r = c.get("read") or {}
    plain = " ".join(re.sub(r"\[\[([^\]]+)\]\]", r"\1", t) for t in r.get("text", []))
    if "[[" in plain or "]]" in plain: bad.append("read: broken [[ ]] mark")
    for q in r.get("questions", []):
        if q["ev"] not in plain: bad.append(f"read: the evidence “{q['ev'][:40]}” isn't in the text")
    for q in (c.get("frases") or []) + (c.get("final") or []):
        if q["a"] in q.get("w", []): bad.append(f"the answer “{q['a']}” is also a wrong option")
    for x in (c.get("grammar") or {}).get("drill", []):
        if x["a"] in x.get("w", []): bad.append(f"grammar: the answer “{x['a']}” is also a wrong option")
    for g in (c.get("gaps") or {}).get("items", []):
        if g["s"].count("___") != 1: bad.append(f"gaps: “{g['s'][:40]}” needs exactly one ___")
    # Classes are English only
    for t in (c.get("translate") or {}).get("items", []):
        if t.get("es"): bad.append("translate: Spanish prompt found (use cue in English)")
    return bad


def test():
    cfg = open(os.path.join(ROOT, "assets", "config.js")).read()
    problems = []
    for lid in IDS:
        c = load(lid)
        problems += [f"{lid}: {p}" for p in content_problems(c)]
        if f'"id": "{lid}"' not in cfg and f'id: "{lid}"' not in cfg: problems.append(f"{lid}: not listed in assets/config.js")
        if not os.path.exists(os.path.join(ROOT, "clases", f"leccion-{lid}.html")): problems.append(f"{lid}: clases/leccion-{lid}.html is missing")
    check(not problems, f"content of {len(IDS)} lessons is consistent " + " | ".join(problems[:6]))

    # No personal name anywhere on the site (pages sign as Lingua); the repo address is the only exception
    named = []
    for f in glob.glob(os.path.join(ROOT, "**", "*.*"), recursive=True):
        if "/tests/" in f or "/.git/" in f or not f.endswith((".html", ".js", ".css", ".json", ".webmanifest")): continue
        txt = re.sub(r"alejandrocaporali98-cell", "", open(f, encoding="utf-8", errors="ignore").read())
        if re.search(r"alejandro|caporali", txt, re.I): named.append(os.path.relpath(f, ROOT))
    check(not named, "no personal name on the site " + ", ".join(named[:5]))
    emo = re.compile("[\U0001F000-\U0001FAFF\u2600-\u2604\u2607-\u26FF\u2B50\u23E9-\u23FA\u2700-\u2712\u2714\u2716\u2718-\u27BF]")  # \u2713 \u2717 \u2715 \u2605 \u2606 are fine
    with_emoji = []
    for f in glob.glob(os.path.join(ROOT, "**", "*.*"), recursive=True):
        if "/tests/" in f or "/.git/" in f or not f.endswith((".html", ".js", ".css")): continue
        src = open(f, encoding="utf-8", errors="ignore").read().replace("\\u{1F000}-\\u{1FAFF}☀-➿", "")
        if emo.search(src): with_emoji.append(os.path.relpath(f, ROOT) + " " + emo.search(src).group(0))
    check(not with_emoji, "no emojis on the site (line icons instead) " + ", ".join(with_emoji[:6]))

    # Each student's lessons appear in number order, across all their modules
    order, owner, messy = {}, None, []
    for line in cfg[:cfg.index("// ── Cuentas")].splitlines():
        m = re.search(r'owner: "([^"]+)"', line)
        if m: owner = m.group(1); continue
        m = re.search(r'"?id"?: "(\d+)"', line)
        if m and owner: order.setdefault(owner, []).append(int(m.group(1)))
    messy = [f"{o}: {ids}" for o, ids in order.items() if ids != sorted(ids)]
    check(not messy, "every student's lessons are listed in number order " + " | ".join(messy))

    with Env(offline=True) as env:
        pg = env.device("L")
        broken = []
        for lid in IDS:
            before = len(env.errs)
            env.fresh(pg, f"clases/leccion-{lid}.html", 500)
            names = [t.split(". ", 1)[-1] for t in pg.eval_on_selector_all(".toc button .t", "e => e.map(x => x.textContent.trim())")]
            if not names: broken.append(f"{lid}: no sections"); continue
            for i in range(len(names)):                       # every section opens
                pg.locator(".toc button").nth(i).dispatch_event("click"); pg.wait_for_timeout(80)
            if "Read" in names:
                pg.locator(".toc button").nth(names.index("Read")).dispatch_event("click"); pg.wait_for_timeout(150)
                for q in range(pg.locator(".rd-q").count()):
                    box = pg.locator(".rd-q").nth(q); box.locator(".rd-opt").nth(int(box.get_attribute("data-c"))).dispatch_event("click"); pg.wait_for_timeout(30)
                rd = pg.inner_text("#rdN").split(" / ")
                if rd[0] != rd[1]: broken.append(f"{lid}: reading not completable ({'/'.join(rd)})")
            if "Grammar" in names:
                pg.locator(".toc button").nth(names.index("Grammar")).dispatch_event("click"); pg.wait_for_timeout(150)
                rows = pg.locator(".gr-item, .gr-sort")
                for k in range(rows.count()):
                    row = rows.nth(k)
                    if row.get_attribute("data-c") is not None: row.locator(".gr-b").nth(int(row.get_attribute("data-c"))).dispatch_event("click")
                    else:
                        for j in range(row.locator(".gr-b").count()):
                            row.locator(".gr-b").nth(j).dispatch_event("click"); pg.wait_for_timeout(20)
                            if "done" in (row.get_attribute("class") or ""): break
                gr = pg.inner_text("#grN").split(" / ")
                if gr[0] != gr[1]: broken.append(f"{lid}: grammar not completable ({'/'.join(gr)})")
            if pg.locator(".err").count() == 0 and "Spot the error" in names:
                pg.locator(".toc button").nth(names.index("Spot the error")).dispatch_event("click"); pg.wait_for_timeout(150)
            n = pg.locator(".err").count()
            for k in range(n):
                wi = pg.evaluate(f"window.CLASE.errors.items[{k}].wrong"); pg.locator(f'.err[data-i="{k}"] .w[data-k="{wi}"]').dispatch_event("click")
            if n and pg.locator(".err.solved").count() != n: broken.append(f"{lid}: errors not solvable")
            if len(env.errs) > before: broken.append(f"{lid}: {env.errs[before]}")
        check(not broken, f"all {len(IDS)} lessons open and can be completed " + " | ".join(broken[:6]))

        # Overview: a lesson opens on its course page; Start goes to the first section and the overview can be reopened
        lid = IDS[-1]
        env.fresh(pg, f"clases/leccion-{lid}.html", 600)
        ok = pg.locator(".ov-hero h1").count() == 1 and pg.locator(".ov-list button").count() == pg.locator(".toc button").count() and pg.locator(".ov-go").count() == 1
        check(ok, f"lesson {lid} opens on its overview with every section listed")
        pg.click(".ov-go"); pg.wait_for_timeout(250)
        check(pg.locator(".sec-head").count() == 1 and pg.locator(".ov-hero").count() == 0, "Start lesson opens the first section")
        pg.click("#ovBtn"); pg.wait_for_timeout(200)
        check(pg.locator(".ov-hero").count() == 1, "the overview can be reopened from the side panel")
        pg.locator(".ov-list button").nth(1).click(); pg.wait_for_timeout(200)
        check(pg.locator(".toc button.active").get_attribute("data-i") == "1", "a row in Lesson content opens that section")
        env.fresh(pg, f"clases/leccion-{lid}.html?s=1", 500)
        check(pg.locator(".ov-hero").count() == 0, "with ?s= the lesson opens straight on a section")

        # Garage (racing style): one car per Emiliano lesson, unlocked by passing it
        env.fresh(pg, "perfil.html", 300)
        gx = pg.evaluate("window.LINGUA.garage ? Object.keys(LINGUA.garage.CARS) : []")
        racing = [l for l in ["01", "02", "03", "04", "05", "06", "07"] if l in gx and '"../assets/garage.js"' in open(os.path.join(ROOT, "clases", f"leccion-{l}.html")).read()]
        check(len(racing) == 7, f"each racing lesson has a car and loads the garage ({len(racing)}/7)")
        pg.evaluate("""() => { const s = (k, v) => localStorage.setItem('lingua.' + k, JSON.stringify(v));
          s('__settings', { lessons: ['01','02','03','04','05','06'], theme: 'racing' });
          ['01','02'].forEach(id => s('diploma.' + id, { ok: 15, n: 15, at: '2026-11-01T12:00:00Z' })); }""")
        env.fresh(pg, "perfil.html", 700)
        check(pg.locator("#garage").count() == 1 and "2 / 6 cars" in pg.inner_text("#garage .gx-count"), "the profile shows the garage with 2 of 6 cars (only assigned lessons)")
        check("Turbo Coupe" in pg.inner_text("#garage .gx-info"), "the newest car is shown first")
        pg.locator('[data-car="05"]').click(); pg.wait_for_timeout(150)
        check("Mystery car" in pg.inner_text("#garage .gx-info") and pg.locator("#garage .gx-info a[href*='leccion-05']").count() == 1, "a locked car links to its lesson")
        check(pg.locator("#avKind").count() == 1 and pg.locator("#builder .locked").count() == 0, "in the racing style every helmet design is open")
        pg.evaluate("LINGUA.menu.open()"); pg.wait_for_timeout(150)
        check(pg.locator("#lgMenu a[href$='perfil.html#garage']").count() == 1, "the menu has a garage link")
        pg.evaluate("LINGUA.menu.close()")
        # Other styles collect horses, instruments and posters: the Nth lesson passed unlocks the Nth item
        for theme, ids, title, first in [("riding", ["101", "102", "103"], "Your stable", "Biscuit"), ("music", ["311", "312", "313"], "Your studio", "Parlor Acoustic"), ("cinema", ["301", "302", "303"], "Your poster wall", "Night Falls on Harbor Street")]:
            pg.evaluate("""([th, ids]) => { localStorage.clear(); const s = (k, v) => localStorage.setItem('lingua.' + k, JSON.stringify(v));
              s('__settings', { lessons: ids, theme: th }); s('diploma.' + ids[1], { ok: 15, n: 15, at: '2026-11-02T12:00:00Z' }); }""", [theme, ids])
            env.fresh(pg, "perfil.html", 600)
            ok = pg.locator("#garage").count() == 1 and title in pg.inner_text("#garage h2") and first in pg.inner_text("#garage .gx-info") and pg.locator("#garage .gx-bay:not(.locked)").count() == 1
            check(ok and f"Lesson {ids[1]}" in pg.inner_text("#garage .gx-info"), f"{theme}: one lesson passed unlocks the first item ({title})")
        check(not [e for e in env.errs if "perfil" in e or "collection" in e], "no errors on the collection pages")

        # Public page (Spanish): loads, fits a phone, WhatsApp buttons appear only once a number is set
        ph = env.device("P", 390, 844); env.fresh(ph, "conoce.html", 700)
        check(ph.evaluate("document.documentElement.scrollWidth") <= 392 and ph.locator("h1").count() == 1, "the public page fits a phone")
        check(ph.locator("[data-wa]:visible").count() == 0, "without a number the WhatsApp buttons stay hidden")
        ph.route("**/conoce.html", lambda r: r.fulfill(body=open(os.path.join(env.site, "conoce.html")).read().replace('whatsapp: ""', 'whatsapp: "5218100000000"'), content_type="text/html"))
        env.fresh(ph, "conoce.html", 500)
        hrefs = ph.eval_on_selector_all("[data-wa]", "e => e.map(x => x.href)")
        check(hrefs and all(h.startswith("https://wa.me/5218100000000?text=") for h in hrefs), "with a number the buttons open a WhatsApp chat")
        env.fresh(ph, "login.html", 500)
        check(ph.locator('a[href="conoce.html"]').count() >= 1, "the sign-in page links to the public page")


if __name__ == "__main__":
    run(test)
