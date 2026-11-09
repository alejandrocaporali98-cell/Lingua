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
        for v in ["#today", "#students", "#schedule", "#reports", "#billing", "#billing/payments/all", "#billing/bank", "#plan", "#trials", "#accounts"] + \
                 [f"#s/{ada}/{t}" for t in ["overview", "lessons", "classes", "homework", "voice", "billing", "reports"]]:
            env.fresh(T, "teacher.html" + v, 900)
        check(not env.errs, "all teacher views open without errors " + "; ".join(env.errs[:3]))

        # lesson plan: the next lessons per student, Ready once built, next class date on the first planned one
        env.fresh(T, "teacher.html#plan", 900)
        cards = T.locator(".rm-card").count(); planned = T.locator(".rm-card .chip.rm-new").count()
        check(cards >= 16 and planned >= 1, f"lesson plan shows {cards} lessons, {planned} still to build")
        check(T.locator(".rm-card .rm-when").count() >= 1 and "For " in T.inner_text(".rm-card .rm-when"), "the next planned lesson shows the date of the next class")
        T.screenshot(path=os.path.join(OUT, "lesson_plan.png"), full_page=True)

        # trial-class form: the privacy notice must be accepted, and the consent is recorded
        env.DB["trials"]["tr1"] = {"id": "tr1", "token": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee", "created_at": now_iso()}
        M = env.device("M", 420, 900); M.goto(env.url("muestra.html?t=aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee")); M.wait_for_selector("#fName")
        M.fill("#fName", "Sofía Ruiz"); M.click('[data-a="0"]'); M.locator(".chip-t").first.click(); M.locator(".opt-r").first.click(); M.click("#fGo"); M.wait_for_timeout(300)
        check("aviso de privacidad" in M.inner_text("#fErr") and not env.DB["trials"]["tr1"].get("intake_at"), "the trial form asks to accept the privacy notice first")
        M.check("#fOk"); M.click("#fGo"); M.wait_for_timeout(1200)
        check(env.DB["trials"]["tr1"].get("intake_at") and env.DB["trials"]["tr1"].get("consent_at"), "with the notice accepted, the form is sent and the consent is saved")

        # two-step verification: turn on with the app code, then signing in asks for it
        env.fresh(T, "teacher.html#accounts", 1200); T.wait_for_selector("#mfaOn", timeout=5000)
        T.click("#mfaOn"); T.wait_for_selector("#mfaCode")
        check(T.locator(".mfa-qr").count() == 1 and "JBSWY3DPEHPK3PXP" in T.inner_text("#mfaBox"), "turning on two-step shows a QR code and a key")
        T.fill("#mfaCode", "000000"); T.click("#mfaVerify"); T.wait_for_timeout(300)
        check(T.locator("#mfaBad").is_visible(), "a wrong code is refused")
        T.fill("#mfaCode", "123456"); T.click("#mfaVerify"); T.wait_for_selector("#mfaOff", timeout=5000)
        check("is on" in T.inner_text("#mfaBox"), "the right code turns two-step verification on")
        T.evaluate("localStorage.setItem('mock.aal', 'aal1')")   # a new sign-in with only the password
        env.fresh(T, "teacher.html#today", 1500)
        check("login" in T.url and T.locator("#code").count() == 1, "a session with only the password is sent back for the code")
        T.fill("#code", "123456"); T.click("#codeGo"); T.wait_for_timeout(1500)
        check("teacher" in T.url, "with the code the teacher gets back to the panel")
        env.fresh(T, "teacher.html#accounts", 1200); T.wait_for_selector("#mfaOff"); T.click("#mfaOff"); T.wait_for_selector("#mfaOn", timeout=5000)
        check(True, "two-step verification can be turned off")

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

        # privacy notice: a student who joined before it accepts it once on the home page
        env.DB["profiles"][ada]["privacy_at"] = None
        env.fresh(S, "index.html", 2000)
        check(S.locator("#pvNote").count() == 1, "a student who hasn't accepted the privacy notice is asked on the home page")
        S.check("#pvOk"); S.click("#pvSave"); S.wait_for_timeout(1000)
        check(env.DB["profiles"][ada].get("privacy_at") and S.locator("#pvNote").count() == 0, "accepting saves it and the note goes away")
        env.fresh(T, f"teacher.html#s/{ada}", 1500)
        check("Privacy notice: accepted" in T.inner_text("body"), "the teacher sees that the notice was accepted")

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
