# eneskelestemur.github.io

Personal site — research, projects, and writing.
Built with React + Vite + Mantine, deployed to GitHub Pages.

**Live:** https://eneskelestemur.github.io

## Develop

```bash
npm install
npm run dev          # http://localhost:5173
npm run lint         # CI runs this; a failure blocks the deploy
npm run build
npm run fetch-stats  # refresh GitHub star/fork counts
```

## Content

All content is data — no code changes needed to publish.

| What | Where |
|---|---|
| Blog post | `src/data/notebooks/<slug>.md` + an entry in `metadata.json` |
| Post figures | `src/data/notebooks/artifacts/` — `![alt](artifacts/fig.png)` |
| Publications | `src/data/publications.json` |
| Projects | `src/data/projects.json` |
| About page | `src/data/about.json` |
| Home "current focus" | `src/data/currentFocus.json` |

Posts must not start with a `# Title` — the title comes from `metadata.json`.
Star/fork counts are fetched at build time into `githubStats.json`; don't edit
them by hand.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml` (lint → fetch stats →
build → publish). A daily cron refreshes the GitHub counts.
