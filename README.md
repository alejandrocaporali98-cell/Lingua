# Lingua

English learning platform for one-to-one online classes. Static site (HTML, CSS and JavaScript, no build step), ready for Netlify or GitHub Pages.

## Pages

| File | What it is |
|---|---|
| `index.html` | **My learning**: continue card, current level, course modules and lessons |
| `examen.html` | **Placement test**: 4 written sections (A1 → B2, 8 questions each, pass = 5/8) + speaking scored by the teacher |
| `reporte.html` | **Placement report**: section and skill-area charts, speaking, strengths, focus areas, plan and question review. EN / ES toggle for parents |
| `clases/leccion-01.html` … `leccion-06.html` | **Lessons**: 01 Driver Profile · 02 My Garage · 03 Race Day · 04 Anime Night · 05 Matchday · 06 Level Up |
| `login.html` | **Sign in** with username and password |
| `perfil.html` | **Profile**: helmet avatar builder, name, age, interests, settings (`#settings`: text size, dark mode), change password, sign out |
| `grades.html` | **Grades**: final quiz results per lesson (best, last, attempts, history) and the placement level |
| `diplomas.html` | **Diplomas**: one certificate per lesson passed with 80% or more; `#d01` opens it ready to print or save as PDF |
| `resources.html` | **Study resources**: free websites to practice between classes, grouped by skill |

| `review.html` | **Review**: quiz mistakes and saved questions; two right answers in a row and a question leaves the list |
| `words.html` | **My words**: every flashcard from every lesson, with search, audio and a "hide meanings" self-test |
| `teacher.html` | **Teacher panel** (teachers only): every student's progress, homework, classes (schedule, attendance, notes), monthly parent report and student accounts |
| `builder.html` | **Lesson builder** (teachers only): make new lessons without code; they appear as "Module 3" and play in `clases/custom.html?id=07` |
| `practice.html` | **Practice games**: dictation (listen and write), speaking with the microphone, speed match against the clock |
| `notes.html` | **Class notes**: the student's classes, attendance, notes and new words |
| `progress.html` | **Monthly parent report** (opens from a link, no sign-in, Spanish/English) |

Every page has a **menu** (☰, left of the logo) with links to all of the above, a dark mode switch, "Install the app" and sign out.

## Practice features

- **Pronunciation**: 🔊 buttons on words, examples, questions, answers and role-play lines (the browser's own voices; US or UK accent and speed in Settings).
- **XP, levels, streak and weekly goal** (`assets/game.js`): +2 XP per new flashcard or gap, +20 per section, +2/+3 per right quiz answer, +50 for passing a lesson, +15 per homework, +50 weekly bonus for practicing 4 days. Levels go from Rookie to Legend (10 levels) and unlock helmet designs, visors and the gold helmet.
- **Celebrations**: confetti and sounds for diplomas, level ups, perfect gap fills and weekly goals (sounds can be turned off in Settings; no animation with reduced motion).
- **Homework**: the teacher adds it in the teacher panel; the student sees it on My learning and ticks it off.
- **Speaking**: 🎤 buttons (role-play, My words, Practice games) use the browser's speech recognition (Chrome, Safari on iPhone) and show which words were clear.
- **Badges**: 16 badges (streaks, diplomas, perfect quiz, speaking, dictation, speed match, homework…) in Profile → Badges.
- **Your season**: the course as a race track on My learning; passing a lesson moves the helmet forward.
- **Install as an app**: `manifest.webmanifest` + `sw.js` (network first, offline fallback). Icons in `assets/icons/`.
- **Share preview**: `assets/og.png` and Open Graph tags on every page. If the Netlify address changes, update the `og:image` URL in the pages.

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
  game.js            audio, sounds, confetti, XP / streak / levels, review list, install
  lessons/           lesson content (01.js … 06.js), used by the lesson pages and My words
  icons/, og.png     app icons and share image
  vendor/            Supabase browser client (bundled, v2.45.4)
  favicon.svg
supabase/
  setup.sql          tables + row-level security (run once)
clases/
  leccion-01.html    one file per lesson (data only; the engine renders it)
```

## Add a new lesson

1. Copy `assets/lessons/06.js` to `assets/lessons/07.js` and write the new content (`img` is the emoji on each flashcard).
   Copy `clases/leccion-06.html` to `clases/leccion-07.html` and change `lessons/06.js` to `lessons/07.js` and the title.
2. In `assets/config.js`, add the lesson with its `archivo` and `estado: "lista"`.

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

## Teacher panel setup (once)

1. Run the latest `supabase/setup.sql` in Supabase → SQL Editor (safe to run again). It adds the `teachers` and `homework` tables.
2. Sign in to Lingua with your own account and open `teacher.html`. It shows one line of SQL with your account's email: run it in the SQL Editor and reload.

### Accounts helper (create students and change passwords from the panel)

1. Supabase → **Edge Functions** → **Deploy a new function** → **Via Editor**.
2. Name it `admin-users` and paste `supabase/functions/admin-users/index.ts`. Deploy.
3. In the function's settings, turn **off** "Verify JWT" (the function checks that the caller is a teacher itself).

The function reads Supabase's own secret key from its server environment. The secret key is never in the site or in this repo.
