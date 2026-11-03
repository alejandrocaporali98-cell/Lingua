"""Billing: bank details, payment slips (fichas), recording a payment with a screenshot, receipts, deleting, and the phone layout."""
from harness import Env, check, run, now_iso, OUT
import base64, datetime as dt, os

PNG = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==")


def test():
    with Env() as env:
        T = env.teacher()
        e = env.account(T, "Emiliano Sánchez", "emiliano.sanchez")
        d = env.account(T, "Derek Molina", "derek")
        env.DB["student_admin"][e] = {"student_id": e, "billing": "per_class", "rate": 250, "currency": "MXN", "parent_phone": "8112345678"}
        env.DB["student_admin"][d] = {"student_id": d, "billing": "monthly", "rate": 2000, "currency": "MXN"}
        now = dt.datetime.now(dt.timezone.utc); first = now.replace(day=1, hour=17, minute=0)
        for k, (sid, off, st) in enumerate([(e, 0, "attended"), (e, 1, "attended"), (e, 2, "missed"), (d, 0, "attended"), (d, 1, "attended")]):
            env.DB["classes"][f"c{k}"] = {"id": f"c{k}", "student_id": sid, "starts_at": (first + dt.timedelta(hours=off)).strftime("%Y-%m-%dT%H:%M:%S.000Z"), "status": st}
        proof = os.path.join(OUT, "proof.png"); open(proof, "wb").write(PNG)

        # bank details
        env.fresh(T, "teacher.html#billing/bank"); T.wait_for_selector("#bkForm")
        T.fill("#bkB", "BBVA"); T.fill("#bkH", "Alejandro Caporali"); T.fill("#bkC", "0125800012345678"); T.click("#bkForm button[type=submit]"); T.wait_for_timeout(400)
        check(T.inner_text("#bkMsg").strip() and not env.DB["billing_info"], "a CLABE with the wrong length is refused")
        T.fill("#bkC", "012580001234567891"); T.fill("#bkT", "WhatsApp 81 1111 2222"); T.click("#bkForm button[type=submit]"); T.wait_for_timeout(900)
        check(env.DB["billing_info"].get(1, {}).get("clabe") == "012580001234567891", "bank details are saved")

        # payment slip (ficha) and the page families open
        env.fresh(T, f"teacher.html#billing/slips/{e}"); T.wait_for_selector("#fSave"); T.wait_for_timeout(300)
        T.click("#fSave"); T.wait_for_selector(".okbox"); T.wait_for_timeout(300)
        check(len(env.DB["charges"]) == 1, "a slip is created")
        link = T.get_attribute(".okbox a.btn:not(.primary)", "href")
        F = env.device("F", 900, 1100); F.goto(link); F.wait_for_selector(".bank")
        check("BBVA" in F.inner_text(".bank"), "the slip shows the bank details to the family")
        T.keyboard.press("Escape")

        # record a payment from the overview, with a transfer screenshot
        env.fresh(T, "teacher.html#billing"); T.wait_for_selector("[data-pay] >> visible=true")
        T.click(f'[data-pay="{e}"] >> visible=true'); T.wait_for_selector("#pySave"); T.wait_for_timeout(200)
        T.fill("#pyA", "750"); T.select_option("#pyW", "transfer"); T.fill("#pyR", "SPEI-9988"); T.set_input_files("#pyF", proof); T.wait_for_timeout(300)
        T.click("#pySave"); T.wait_for_selector(".okbox", timeout=10000); T.wait_for_timeout(300)
        pay = list(env.DB["payments"].values())[-1]
        check(pay.get("amount") in (750, "750") and pay.get("method") == "transfer" and pay.get("reference") == "SPEI-9988" and pay.get("proof_path"), "payment is recorded with its screenshot")
        F.goto(T.get_attribute("#okR", "href")); F.wait_for_timeout(600)
        check("SPEI-9988" in F.inner_text("body"), "the receipt shows the transfer reference")

        # payments list, proof viewer, student file
        env.fresh(T, "teacher.html#billing/payments/all"); T.wait_for_selector("[data-pf]"); T.click("[data-pf]")
        T.wait_for_selector(".proofimg, .sh-body .alert", timeout=5000); check(True, "the screenshot viewer opens"); T.keyboard.press("Escape")
        env.fresh(T, f"teacher.html#s/{e}/billing"); T.wait_for_selector(".li")
        check(T.locator(".li").count() > 0 and T.locator("[data-copy]").count() == 1, "the student's billing tab lists weeks and the slip")

        # delete a payment (two taps)
        n0 = len(env.DB["payments"]); env.fresh(T, "teacher.html#billing/payments/all"); T.wait_for_selector("[data-pdel]")
        T.click("[data-pdel]"); T.click("[data-pdel]"); T.wait_for_timeout(800)
        check(len(env.DB["payments"]) == n0 - 1, "a payment can be deleted with a double tap")

        # phone layout: nothing wider than the screen
        T.set_viewport_size({"width": 390, "height": 844}); wide = []
        for v in ["billing", "billing/payments/all", "billing/slips", "billing/bank", f"s/{e}/billing", "today", "students", "accounts"]:
            env.fresh(T, "teacher.html#" + v, 900); w = T.evaluate("document.documentElement.scrollWidth")
            if w > 392: wide.append(f"{v} ({w}px)")
        check(not wide, "teacher views fit a phone " + ", ".join(wide))
        check(not env.errs, "no page errors: " + "; ".join(env.errs[:3]))


if __name__ == "__main__":
    run(test)
