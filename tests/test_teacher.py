"""Teacher panel: every view opens, class link in WhatsApp, backup file, error log, new-version notice."""
from harness import Env, check, run, now_iso, OUT
import datetime as dt, json, os, re, urllib.parse as up


def test():
    with Env() as env:
        # a site built by the deploy: version "abc1234" is open, "def5678" is online
        p = os.path.join(env.site, "assets", "config.js"); c = open(p).read()
        open(p, "w").write(c.replace('window.LINGUA.build = "dev";', 'window.LINGUA.build = "abc1234";'))
        open(os.path.join(env.site, "version.json"), "w").write('{"build": "abc1234"}')

        T = env.teacher()
        ada = env.account(T, "Ada Canavati", "ada")
        env.DB["student_settings"][ada]["lessons"] = ["122", "101"]
        env.DB["classes"]["c1"] = {"id": "c1", "student_id": ada, "starts_at": now_iso(dt.timedelta(hours=2)), "status": "scheduled", "minutes": 60}

        # every view opens without errors
        for v in ["#today", "#students", "#schedule", "#reports", "#billing", "#billing/payments/all", "#billing/bank", "#trials", "#accounts"] + \
                 [f"#s/{ada}/{t}" for t in ["overview", "lessons", "classes", "homework", "voice", "billing", "reports"]]:
            env.fresh(T, "teacher.html" + v, 900)
        check(not env.errs, "all teacher views open without errors " + "; ".join(env.errs[:3]))

        # class link → WhatsApp invitation
        env.fresh(T, f"teacher.html#s/{ada}"); T.wait_for_selector("#ctL")
        T.fill("#ctP", "81 1234 5678"); T.fill("#ctL", "teams.microsoft.com/l/x"); T.click("#ctForm button"); T.wait_for_timeout(500)
        check(not env.DB["student_admin"].get(ada, {}).get("meet_link"), "a link without https:// is refused")
        LINK = "https://teams.microsoft.com/l/meetup-join/abc"
        T.fill("#ctL", LINK); T.click("#ctForm button"); T.wait_for_timeout(1200)
        check(env.DB["student_admin"][ada].get("meet_link") == LINK, "class link is saved")
        env.fresh(T, "teacher.html#today", 1500)
        msgs = [up.unquote(h.split("text=")[1]) for h in T.eval_on_selector_all('a[href^="https://wa.me"]', "e => e.map(x => x.href)")]
        check(any(m.startswith("Hola qué tal muy") and "Te comparto el link de la clase del día de hoy!" in m and m.endswith(LINK) for m in msgs), "WhatsApp button sends the invitation with the link")

        # error log: a student's screen breaks → teacher sees it (noise is ignored)
        S = env.device("S"); env.login(S, "ada", "Pass12345"); S.wait_for_timeout(1500)
        S.evaluate("setTimeout(() => { throw new Error('Boom in a lesson'); })"); S.wait_for_timeout(200)
        S.evaluate("setTimeout(() => { throw new Error('Boom in a lesson'); })"); S.wait_for_timeout(200)
        S.evaluate("() => { Promise.reject(new TypeError('Failed to fetch')); }"); S.wait_for_timeout(800)
        errs = list(env.DB["client_errors"].values()); print("   logged:", [(e["message"], e["user_id"], e.get("build"), e.get("page")) for e in errs], env.errs[-3:])
        check(len(errs) == 1 and errs[0]["message"] == "Error: Boom in a lesson" and errs[0]["user_id"] == ada and errs[0]["build"] == "abc1234",
              "a real error is saved once; connection errors are ignored")
        env.errs = [e for e in env.errs if "Boom in a lesson" not in e and "Failed to fetch" not in e]
        env.fresh(T, "teacher.html#today", 1500)
        check("1 problem on screens this week" in T.inner_text("#app"), "Today shows the new problem")
        T.click('a[href="#accounts/errors"]'); T.wait_for_timeout(900)
        check("Boom in a lesson" in T.inner_text("#errLog") and "Ada Canavati" in T.inner_text("#errLog"), "error log shows what broke and for whom")
        T.click("#errClear"); T.wait_for_timeout(800)
        check(not env.DB["client_errors"] and "Nothing has broken lately" in T.inner_text("#errLog"), "Clear all empties the log")

        # backup
        env.fresh(T, "teacher.html#today", 1200)
        check("No backup yet" in T.inner_text("#app"), "Today reminds to make the first backup")
        env.fresh(T, "teacher.html#accounts/backup")
        with T.expect_download() as dl:
            T.click("#bkGo")
        f = dl.value; path = os.path.join(OUT, f.suggested_filename); f.save_as(path)
        data = json.load(open(path))
        check(re.match(r"lingua-backup-\d{4}-\d{2}-\d{2}\.json$", f.suggested_filename), "backup file is named with today's date")
        check(data["app"] == "Lingua" and data["counts"]["profiles"] >= 2 and data["counts"]["classes"] >= 1 and
              any(r.get("meet_link") == LINK for r in data["tables"]["student_admin"]), "backup holds every table, including the new data")
        check("cal_tokens" not in data["tables"], "backup leaves out the secret calendar links")
        T.wait_for_timeout(500)
        check(env.DB["teacher_meta"].get("last_backup", {}).get("value", {}).get("at"), "backup date is remembered")
        env.fresh(T, "teacher.html#today", 1200)
        check("No backup yet" not in T.inner_text("#app"), "reminder goes away after a backup")

        # new version notice
        open(os.path.join(env.site, "version.json"), "w").write('{"build": "def5678"}')
        env.fresh(T, "teacher.html#today", 5200)
        check(T.locator("#newVersion").count() == 1, "an open page notices the new version")
        T.click("#newVersion button"); T.wait_for_timeout(1500)
        check("v=def5678" in T.url, "Update reloads the page fresh")
        T.set_viewport_size({"width": 390, "height": 844}); T.wait_for_timeout(300)
        sw = T.evaluate("document.documentElement.scrollWidth")
        check(sw <= 392, f"notice fits on a phone (width {sw})")
        T.screenshot(path=os.path.join(OUT, "new_version_phone.png"))
        check(not env.errs, "no page errors: " + "; ".join(env.errs[:3]))


if __name__ == "__main__":
    run(test)
