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

        # class dictionary: next to Notes in class mode; look up, translate, add to today's notes
        env.DB["classes"]["cnow"] = {"id": "cnow", "student_id": ada, "starts_at": now_iso(), "status": "scheduled", "minutes": 60, "notes": "Good warm-up"}
        DICT = [{"word": "overtake", "phonetic": "/ˌəʊvəˈteɪk/", "meanings": [{"partOfSpeech": "verb", "synonyms": ["pass"], "definitions": [
            {"definition": "To pass a more slowly moving vehicle.", "example": "He overtook the red car on the straight."}, {"definition": "To become greater than something.", "example": ""}]}]}]
        TRS = {("overtake", "en|es"): ["adelantar", [("adelantar", "80"), ("rebasar", "74")]], ("rebasar", "es|en"): ["overtake", [("overtake", "70")]]}
        hits = []
        def fake_dict(route):
            hits.append(route.request.url); w = up.unquote(route.request.url.rsplit("/", 1)[1])
            route.fulfill(status=200 if w == "overtake" else 404, headers={"Access-Control-Allow-Origin": "*"}, content_type="application/json",
                          body=json.dumps(DICT if w == "overtake" else {"title": "No Definitions Found"}))
        def fake_tr(route):
            qs = up.parse_qs(up.urlparse(route.request.url).query); key = (qs["q"][0], qs["langpair"][0]); hits.append(route.request.url)
            main, alts = TRS.get(key, [qs["q"][0], []])
            route.fulfill(status=200, headers={"Access-Control-Allow-Origin": "*"}, content_type="application/json",
                          body=json.dumps({"responseData": {"translatedText": main, "match": 1}, "responseStatus": 200,
                                           "matches": [{"segment": key[0], "translation": t, "quality": q} for t, q in alts]}))
        T.context.route("https://api.dictionaryapi.dev/**", fake_dict); T.context.route("https://api.mymemory.translated.net/**", fake_tr)
        env.fresh(T, "teacher.html#today", 800)
        T.evaluate(f"LINGUA.actAs({{ id: '{ada}', name: 'Ada Canavati' }}, 'clases/leccion-07.html')"); T.wait_for_selector("#classBar #dictBtn", timeout=8000)
        btns = T.locator("#classBar .btn").all_inner_texts()
        check([b.split()[0] for b in btns][:4] == ["Correction", "Dictionary", "Notes", "End"], f"class mode shows Correction and Dictionary right next to Notes ({btns})")
        T.click("#dictBtn"); T.wait_for_selector("#cdict #dxQ")
        T.fill("#dxQ", "overtake"); T.press("#dxQ", "Enter"); T.wait_for_selector("#cdict .dx-def", timeout=5000)
        txt = T.inner_text("#cdict")
        check("To pass a more slowly moving vehicle." in txt and "adelantar" in txt and "rebasar" in txt and "/ˌəʊvəˈteɪk/" in txt, "a word shows its meaning, pronunciation and translations")
        check(T.input_value("#dxLine") == "overtake (verb) · adelantar — To pass a more slowly moving vehicle.", "the note line is ready to add")
        T.click(".dx-chip:has-text('rebasar')")
        check("rebasar" in T.input_value("#dxLine"), "choosing another translation changes the note line")
        check(T.is_checked("#dxWords") and "Ada’s words" in T.inner_text("#dxFoot"), "adding to the student's words is on by default")
        T.click("#dxAdd"); T.wait_for_timeout(800)
        cw = T.evaluate("LINGUA.store.get('classWords', {})"); rv = [q for q in T.evaluate("LINGUA.review.list()") if q["l"] == "words"]
        check(cw.get("overtake", {}).get("tr") == "rebasar" and cw["overtake"]["def"] == "To pass a more slowly moving vehicle.", "the word is saved to the student's words with its translation and meaning")
        check(len(rv) == 1 and rv[0]["a"] == "overtake" and "To pass a more slowly moving vehicle" in rv[0]["p"] and len(rv[0]["w"]) == 3 and "overtake" not in rv[0]["w"],
              f"and becomes a Review question with 3 wrong options ({rv[:1]})")
        check(env.DB["classes"]["cnow"].get("notes") == "Good warm-up\novertake (verb) · rebasar — To pass a more slowly moving vehicle." and "Added" in T.inner_text("#dxOut"),
              "Add to notes adds the word to today's class notes, after what was there")
        T.screenshot(path=os.path.join(OUT, "dictionary.png"))
        T.fill("#dxQ", "rebasar"); T.press("#dxQ", "Enter"); T.wait_for_timeout(800)
        check(T.locator("[data-dir='es'].on").count() == 1 and T.inner_text("#cdict .dx-w") == "overtake" and "rebasar" in T.inner_text("#cdict .dx-from"),
              "Spanish → English finds the English word and its meaning")
        T.fill("#dxQ", "xqzt"); T.click("[data-dir='en']"); T.wait_for_timeout(800)
        check("No results" in T.inner_text("#dxRes"), "a word that doesn't exist says so")
        T.click("#notesBtn"); T.wait_for_selector("#cnText")
        check(T.locator("#cdict").is_hidden() and "rebasar" in T.input_value("#cnText"), "Notes opens in its place and shows the added word")
        # correction: what they said → the better way
        T.click("#fixBtn"); T.wait_for_selector("#cfix #fxWrong")
        check(T.locator("#cnotes").is_hidden() and T.locator("#cdict").is_hidden(), "only one drawer is open at a time")
        T.fill("#fxWrong", "I can drives very fast."); T.press("#fxWrong", "Enter")
        check(T.input_value("#fxRight") == "I can drives very fast.", "Better starts as a copy of what they said")
        T.fill("#fxRight", "I can drive very fast."); T.press("#fxRight", "Enter"); T.fill("#fxWhy", "can + verb, no -s"); T.press("#fxWhy", "Enter"); T.wait_for_timeout(800)
        notes = env.DB["classes"]["cnow"]["notes"]
        check(notes.endswith("Correction: “I can drives very fast.” → “I can drive very fast.” (can + verb, no -s)") and "Saved" in T.inner_text("#fxOut"), "the correction goes to today's notes")
        fq = [q for q in T.evaluate("LINGUA.review.list()") if q["l"] == "fixes"]
        check(len(fq) == 1 and fq[0]["p"] == "I can ___ very fast." and fq[0]["a"] == "drive" and fq[0]["w"] == ["drives"] and "You said" in fq[0]["why"],
              f"and becomes a gap question in Review ({fq[:1]})")
        check(T.input_value("#fxWrong") == "" and "I can drive very fast." in T.inner_text("#fxList"), "the form clears and today's corrections are listed")
        T.fill("#fxWrong", "Yesterday I go to the cinema with my friends and we eat popcorn."); T.press("#fxWrong", "Enter")
        T.fill("#fxRight", "Yesterday I went to the cinema with my friends and we ate popcorn."); T.click("#fxSave"); T.wait_for_timeout(600)
        fq = [q for q in T.evaluate("LINGUA.review.list()") if q["l"] == "fixes"]
        check(any(q["p"] == "Choose the correct sentence." and q["a"].startswith("Yesterday I went") for q in fq), "a longer correction becomes 'choose the correct sentence'")
        T.click("#fxList [data-rm] >> nth=0"); T.wait_for_timeout(300)
        check(len(T.evaluate("LINGUA.fixes.list()")) == 1 and len([q for q in T.evaluate("LINGUA.review.list()") if q["l"] == "fixes"]) == 1, "a correction can be removed")
        T.fill("#fxWrong", "Yesterday I go to the cinema with my friends and we eat popcorn."); T.press("#fxWrong", "Enter")
        T.fill("#fxRight", "Yesterday I went to the cinema with my friends and we ate popcorn."); T.click("#fxSave"); T.wait_for_timeout(600)
        T.set_viewport_size({"width": 390, "height": 844}); T.wait_for_timeout(300); T.screenshot(path=os.path.join(OUT, "correction_phone.png"))
        T.set_viewport_size({"width": 1366, "height": 900}); T.wait_for_timeout(200); T.screenshot(path=os.path.join(OUT, "correction.png"))
        T.keyboard.press("Escape"); T.locator("h1").first.click(); T.keyboard.press("f"); T.wait_for_timeout(300)
        check(T.locator("#cfix").is_visible(), "the F key opens Correction")
        T.keyboard.press("Escape"); T.locator("h1").first.click(); T.keyboard.press("d"); T.wait_for_timeout(300)
        check(T.locator("#cdict").is_visible(), "the D key opens the dictionary")
        T.set_viewport_size({"width": 390, "height": 844}); T.fill("#dxQ", "overtake"); T.press("#dxQ", "Enter"); T.wait_for_timeout(600)
        T.screenshot(path=os.path.join(OUT, "dictionary_phone.png"))
        check(T.evaluate("document.querySelector('#cdict').getBoundingClientRect().width") <= 390, "the dictionary fits a phone")
        T.set_viewport_size({"width": 1366, "height": 900}); T.wait_for_timeout(200)
        check(all("api." in h for h in hits) and not any("ada" in h.lower() for h in hits), "only the searched words are sent, never the student's name")
        T.keyboard.press("Escape"); T.set_viewport_size({"width": 390, "height": 844}); T.wait_for_timeout(300); T.screenshot(path=os.path.join(OUT, "classbar_phone.png"))
        sw = T.evaluate("document.documentElement.scrollWidth"); check(sw <= 392, f"the class bar with four buttons fits a phone (width {sw})")
        T.set_viewport_size({"width": 1366, "height": 900})
        T.wait_for_timeout(2500)
        T.evaluate("LINGUA.actAs(null)"); T.wait_for_url("**/teacher.html**"); T.wait_for_timeout(800)
        del env.DB["classes"]["cnow"]
        # the student sees them in My words and Review
        env.fresh(S, "words.html", 2500)
        S.wait_for_selector("#grid", timeout=10000)
        check(S.locator("[data-f='class']").count() == 1 and "rebasar" in S.inner_text("#grid") and "from class" in S.inner_text("#grid").lower(), "My words shows the word from class first")
        S.screenshot(path=os.path.join(OUT, "words_from_class.png"))
        env.fresh(S, "review.html", 2000)
        body = S.inner_text("#app")
        check("Words from your classes" in body and "Corrections from your classes" in body and "My mistakes" in body and "I can drive very fast." in body, "Review shows class words, corrections and My mistakes")
        S.screenshot(path=os.path.join(OUT, "review_from_class.png"), full_page=True)
        S.click("#go"); S.wait_for_selector(".q")
        seen = set()
        for _ in range(12):
            if not S.locator(".q").count(): break
            seen.add(S.text_content(".q .eyebrow"))
            S.click(".opt >> nth=0"); S.click("#next")
        check({"Words from your classes", "Corrections from your classes"} <= seen, f"a review round includes them ({seen})")

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
