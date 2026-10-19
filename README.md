# Lingua

English learning platform for one-to-one online classes. Static site (HTML, CSS and JavaScript, no build step), ready for Netlify or GitHub Pages.

## Pages

| File | What it is |
|---|---|
| `index.html` | **My learning**: continue card, current level, course modules and lessons |
| `examen.html` | **Placement test**: 4 written sections (A1 → B2, 8 questions each, pass = 5/8) + speaking scored by the teacher |
| `reporte.html` | **Placement report**: section and skill-area charts, speaking, strengths, focus areas, plan and question review. EN / ES toggle for parents |
| `clases/leccion-01.html` | **Lesson 01 · Driver Profile** (A1–A2) |

## Structure

```
assets/
  config.js          course settings: teacher, modules, lessons (edit this to add lessons)
  placement-data.js  placement test question bank + skill areas
  lingua.css         shared styles
  leccion.css        lesson player styles
  leccion.js         lesson player engine
  favicon.svg
clases/
  leccion-01.html    one file per lesson (data only; the engine renders it)
```

## Add a new lesson

1. Copy `clases/leccion-01.html` to `clases/leccion-02.html` and replace the `window.CLASE` data.
2. In `assets/config.js`, set that lesson's `archivo` and change `estado` from `"pronto"` to `"lista"`.

Each lesson has 5 sections: vocabulary, sound natural, fill in the gaps, role-play and a 20-question final quiz. Correct answers rotate A, B, C, D.

## Class mode (live, screen-shared)

- `C` toggles class mode (larger text, no sidebar, answers revealed only when checked)
- `1`–`4` choose an answer, `Space` check / next, `M` save for review
- `Shift` + `←` / `→` previous / next section

## Sharing the placement report

Progress and results are stored in the browser (`localStorage`). On the deployed site, the report's **Copy share link** button creates a link with the results inside it (`reporte.html?r=…`), so anyone can open the full report on their own device.

## Deploy

- **Netlify:** connect this repo (no build command, publish directory `/`), or drag the folder into Netlify.
- **GitHub Pages:** Settings → Pages → Deploy from branch → `main` / root.
