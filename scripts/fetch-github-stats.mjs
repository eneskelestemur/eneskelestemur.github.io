#!/usr/bin/env node
/**
 * Fetches star/fork counts for every project in src/data/projects.json and
 * writes them to src/data/githubStats.json, which ProjectCard reads at build
 * time. Run before `npm run build` (the deploy workflow does this).
 *
 * Build-time rather than client-side: GitHub allows 60 unauthenticated
 * requests/hour per IP, so fetching in the browser would fail for visitors on
 * shared networks. In CI the Actions GITHUB_TOKEN raises that to 5,000/hour and
 * the numbers ship as static data.
 *
 * Failures are non-fatal: an unreachable repo keeps its previously known value
 * rather than being reset to zero, so a flaky API never wipes real counts.
 */
import { readFile, writeFile } from 'node:fs/promises';

const PROJECTS = new URL('../src/data/projects.json', import.meta.url);
const OUTPUT = new URL('../src/data/githubStats.json', import.meta.url);

/** github.com/owner/name[.git|/] -> "owner/name" */
function repoSlug(url) {
  const m = /github\.com\/([^/]+)\/([^/#?]+)/.exec(url ?? '');
  return m ? `${m[1]}/${m[2].replace(/\.git$/, '')}` : null;
}

async function main() {
  const { projects } = JSON.parse(await readFile(PROJECTS, 'utf8'));

  let previous = {};
  try {
    previous = JSON.parse(await readFile(OUTPUT, 'utf8'));
  } catch {
    // First run — no previous values to preserve.
  }

  const token = process.env.GITHUB_TOKEN;
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-build-script',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  console.log(token ? 'Using GITHUB_TOKEN (5000 req/hr)' : 'No token — 60 req/hr limit');

  const slugs = [...new Set(projects.map((p) => repoSlug(p.repo)).filter(Boolean))];
  const stats = { ...previous };
  let updated = 0;
  let kept = 0;

  for (const slug of slugs) {
    try {
      const res = await fetch(`https://api.github.com/repos/${slug}`, { headers });
      if (!res.ok) {
        console.warn(`  ${slug}: HTTP ${res.status} — keeping previous value`);
        kept++;
        continue;
      }
      const repo = await res.json();
      stats[slug] = {
        stars: repo.stargazers_count ?? 0,
        forks: repo.forks_count ?? 0,
      };
      console.log(`  ${slug}: ${stats[slug].stars} stars, ${stats[slug].forks} forks`);
      updated++;
    } catch (err) {
      console.warn(`  ${slug}: ${err.message} — keeping previous value`);
      kept++;
    }
  }

  // Drop entries for repos no longer listed in projects.json
  for (const key of Object.keys(stats)) {
    if (!slugs.includes(key)) delete stats[key];
  }

  await writeFile(OUTPUT, JSON.stringify(stats, null, 2) + '\n');
  console.log(`\nWrote ${OUTPUT.pathname.split('/').pop()} — ${updated} updated, ${kept} kept`);
}

main().catch((err) => {
  // Never fail the build over stats: the site is fine without them.
  console.error('Stats fetch failed:', err.message);
  process.exit(0);
});
