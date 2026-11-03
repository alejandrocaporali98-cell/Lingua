"""Accounts: create, change password, archive (can't sign in, leaves the lists, keeps history), restore, delete."""
from harness import Env, check, run, now_iso, DOMAIN
import datetime as dt


def test():
    with Env() as env:
        T = env.teacher()
        ada = env.account(T, "Ada Canavati", "ada")
        dom = env.account(T, "Domeniko Rios", "domeniko")
        check(f"ada@{DOMAIN}" in env.USERS and f"domeniko@{DOMAIN}" in env.USERS, "teacher creates two student accounts")

        # password
        env.fresh(T, "teacher.html#accounts"); T.fill(f'[data-pwfor="{ada}"]', "NewPass999"); T.click(f'[data-pw="{ada}"]'); T.wait_for_timeout(500)
        check(env.USERS[f"ada@{DOMAIN}"][1] == "NewPass999", "password change reaches the account")

        # history that must survive archiving
        env.DB["classes"]["c-old"] = {"id": "c-old", "student_id": dom, "starts_at": now_iso(dt.timedelta(days=-7)), "status": "attended", "notes": "Good class"}
        env.DB["classes"]["c-next"] = {"id": "c-next", "student_id": dom, "starts_at": now_iso(dt.timedelta(days=2)), "status": "scheduled"}
        env.DB["class_rules"]["r1"] = {"id": "r1", "student_id": dom, "weekday": 3, "time": "18:00", "minutes": 60, "active": True}
        env.DB["payments"]["p1"] = {"id": "p1", "student_id": dom, "month": "2026-10", "amount": 250, "paid_on": "2026-10-10", "token": "tk"}

        # archive (no "Delete" for active accounts any more)
        env.fresh(T, "teacher.html#accounts")
        check(T.locator(f'[data-del="{dom}"]').count() == 0, "active accounts offer Archive, not Delete")
        T.click(f'[data-arc="{dom}"]'); T.wait_for_selector("#arGo")
        txt = T.inner_text("#sheet"); print("   sheet:", txt.replace("\n", " / ")[:300])
        check("1 weekly class will be paused and" in txt and "upcoming classes removed" in txt, "archive sheet explains what happens to classes")
        T.click("#arGo"); T.wait_for_timeout(1500)
        check(dom in env.BANNED and env.DB["student_admin"][dom].get("archived_at"), "archive pauses sign-in and marks the student")
        check("c-old" in env.DB["classes"] and "p1" in env.DB["payments"], "archive keeps past classes and payments")
        future = [c for c in env.DB["classes"].values() if c["student_id"] == dom and c["status"] == "scheduled"]
        check(not future and env.DB["class_rules"]["r1"]["active"] is False, "archive removes upcoming classes and pauses weekly ones")
        env.fresh(T, "teacher.html#students")
        check("Domeniko" not in T.inner_text("#app") and "Ada" in T.inner_text("#app"), "archived student leaves the Students list")
        env.fresh(T, "teacher.html#accounts")
        check(T.locator(f'.is-archived [data-res="{dom}"]').count() == 1, "archived account shows under Archived with Restore")

        # archived student can't sign in
        S = env.device("S"); env.login(S, "domeniko", "Pass12345"); S.wait_for_timeout(900)
        check("paused" in S.inner_text("body").lower(), "archived student sees 'account is paused' at sign-in")

        # restore
        T.click(f'[data-res="{dom}"]'); T.wait_for_timeout(1200)
        check(dom not in env.BANNED and not env.DB["student_admin"][dom].get("archived_at"), "restore turns sign-in back on")
        env.fresh(T, "teacher.html#students")
        check("Domeniko" in T.inner_text("#app"), "restored student is back in the list")

        # delete is only for archived accounts, needs the username typed
        check(env.admin_fn("t-1", {"action": "delete", "user_id": dom}).get("error"), "server refuses to delete an account that isn't archived")
        env.fresh(T, "teacher.html#accounts"); T.click(f'[data-arc="{dom}"]'); T.wait_for_selector("#arGo"); T.click("#arGo"); T.wait_for_timeout(1500)
        T.click(f'[data-del="{dom}"]'); T.wait_for_selector("#dlGo")
        check(T.is_disabled("#dlGo"), "delete button starts disabled")
        T.fill("#dlC", "domenik"); check(T.is_disabled("#dlGo"), "partial username keeps it disabled")
        T.fill("#dlC", "Domeniko"); check(not T.is_disabled("#dlGo"), "exact username (any case) enables it")
        T.click("#dlGo"); T.wait_for_timeout(1500)
        check(f"domeniko@{DOMAIN}" not in env.USERS and "p1" not in env.DB["payments"], "delete removes the account and its records")
        check(f"ada@{DOMAIN}" in env.USERS, "other accounts are untouched")
        check(not env.errs, "no page errors: " + "; ".join(env.errs[:3]))


if __name__ == "__main__":
    run(test)
