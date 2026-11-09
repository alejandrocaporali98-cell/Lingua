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


if __name__ == "__main__":
    run(test)
