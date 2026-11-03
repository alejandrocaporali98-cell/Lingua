# Lingua tests

They open the real pages in a headless Chrome, with a fake Supabase (`harness.py` + `mock_supabase.js`),
so nothing touches the real project or anyone's data.

```
pip install -r tests/requirements.txt && python -m playwright install chromium
python tests/run_all.py              # everything (~5 min)
python tests/run_all.py accounts     # one file
python tests/test_lessons.py 302     # one lesson
```

| File | What it checks |
| --- | --- |
| `test_lessons.py` | Every lesson: content is consistent (answers, evidence, gaps, English only), every section opens, reading / grammar / errors can be completed |
| `test_accounts.py` | Create, change password, archive (can't sign in, keeps history), restore, delete only archived |
| `test_teacher.py` | Every teacher view, class link in WhatsApp, error log, backup file, new-version notice |
| `test_billing.py` | Bank details, slips, payments with screenshots, receipts, phone layout |
| `test_security.py` | Names, notes and answers with HTML never run as code on any page |

GitHub runs all of them on every push (`.github/workflows/deploy.yml`) and only publishes the site when they pass.
Screenshots from the last run go to `tests/out/` (not saved in git).
