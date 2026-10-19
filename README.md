# Lingua

English learning platform for one-to-one online classes. Static site (HTML, CSS and JavaScript, no build step), ready for Netlify or GitHub Pages.

## Pages

| File | What it is |
|---|---|
| `index.html` | **My learning**: continue card, current level, course modules and lessons |
| `examen.html` | **Placement test**: 4 written sections (A1 → B2, 8 questions each, pass = 5/8) + speaking scored by the teacher |
| `reporte.html` | **Placement report**: section and skill-area charts, speaking, strengths, focus areas, plan and question review. EN / ES toggle for parents |
| `clases/leccion-01.html` | **Lesson 01 · Driver Profile** (A1–A2) |
| `login.html` | **Sign in** with username and password |
| `perfil.html` | **Profile**: helmet avatar builder, name, age, interests, settings (`#settings`: text size, dark mode), change password, sign out |
| `grades.html` | **Grades**: final quiz results per lesson (best, last, attempts, history) and the placement level |
| `diplomas.html` | **Diplomas**: one certificate per lesson passed with 80% or more; `#d01` opens it ready to print or save as PDF |
| `resources.html` | **Study resources**: free websites to practice between classes, grouped by skill |

Every page has a **menu** (☰, left of the logo) with links to all of the above, a dark mode switch and sign out.

## Structure

```
assets/
  config.js          course settings: teacher, modules, lessons (edit this to add lessons)
  placement-data.js  placement test question bank + skill areas
  lingua.css         shared styles
  leccion.css        lesson player styles
  leccion.js         lesson player engine
  cloud.js           accounts + sync (Supabase)
  avatar.js          helmet avatar builder and renderer
  menu.js            side menu (☰)
  vendor/            Supabase browser client (bundled, v2.45.4)
  favicon.svg
supabase/
  setup.sql          tables + row-level security (run once)
clases/
  leccion-01.html    one file per lesson (data only; the engine renders it)
```

## Add a new lesson

1. Copy `clases/leccion-01.html` to `clases/leccion-02.html` and replace the `window.CLASE` data.
2. In `assets/config.js`, set that lesson's `archivo` and change `estado` from `"pronto"` to `"lista"`.

Each lesson has 5 sections: vocabulary, sound natural, fill in the gaps, role-play and a 20-question final quiz. Correct answers rotate A, B, C, D. Every final quiz attempt is saved for **Grades**, and a score of 80% or more unlocks the lesson's **diploma** (signed with `maestroNombre` from `config.js`).

## Class mode (live, screen-shared)

- `C` toggles class mode (larger text, no sidebar, answers revealed only when checked)
- `1`–`4` choose an answer, `Space` check / next, `M` save for review
- `Shift` + `←` / `→` previous / next section

## Accounts and cloud saving (Supabase)

Without settings, the site works in **local mode** (progress saved only in the browser). With Supabase connected:

- Every page asks the student to sign in (except a shared report link).
- First sign-in opens profile setup.
- Progress (placement result, lessons, scores, review list) syncs to the account a moment after each change and on every page load, so it follows the student between devices. Each saved value carries its change time; the newest wins.

**Setup (once):**

1. Create a free project at [supabase.com](https://supabase.com).
2. **SQL Editor** → paste `supabase/setup.sql` → **Run**.
3. **Authentication → Sign In / Providers → Email**: keep Email on, and turn **off** "Allow new users to sign up" (only the teacher creates accounts).
4. **Authentication → Users → Add user → Create new user**: email `username@student.lingua.app` (e.g. `diego@student.lingua.app`), a password, and **Auto Confirm User** on. The student signs in with just `diego` and that password.
5. **Settings → API Keys**: copy the Project URL and the **publishable** key into `cloud` in `assets/config.js`. Never use the secret / service_role key here.

Reset a forgotten password from **Authentication → Users**.

## Sharing the placement report

Progress and results are stored in the browser (`localStorage`). On the deployed site, the report's **Copy share link** button creates a link with the results inside it (`reporte.html?r=…`), so anyone can open the full report on their own device.

## Deploy

- **Netlify:** connect this repo (no build command, publish directory `/`), or drag the folder into Netlify.
- **GitHub Pages:** Settings → Pages → Deploy from branch → `main` / root.
