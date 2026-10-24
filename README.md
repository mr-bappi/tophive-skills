# TOPHIVE Skills

A compact, original static skills directory for publishing TOPHIVE agent skills with verifiable source and install instructions. Inspired by the usefulness of [skills.sh](https://skills.sh/), **not a copy** of their design, content, leaderboard, code or trademark.

## Current published skill

**Web & UI Design v1.2.0** — responsive product websites, operational dashboard UI, admin component systems and visual review. Website and dashboard references are applied separately to prevent clutter. The portable skill contains exactly 7 files with a self-contained SKILL.md, references, metadata and icons.

The public skill lives under `skills/tophive-design/`. Use its source for open review and install:

```sh
npx skills add mr-bappi/tophive-skills -g
```

Website: `https://skills.tophive.dev/` (GitHub Pages live and public).

Download: `downloads/tophive-design-skill.zip`.

For eligible ChatGPT Skills upload, download the ZIP. ChatGPT Skills upload and local Skills CLI install are distinct account workflows.

## Structure

- `index.html` — responsive homepage with a curated skill preview
- `library/index.html`, `library/library.css`, `library/library.js` — searchable All Skills page with catalog-driven filters
- `skills/tophive-design/index.html` — skill detail with verified scope
- `docs/index.html` — installation/usage/security guide
- `styles.css` and `app.js` — plain CSS/JS (no CDN or framework)
- `skills/tophive-design/` — installable skill source
- `downloads/` — matching portable upload package
- `catalog.json` — real current catalog (1 skill and SHA256)
- `tests/site-smoke.cjs` — browser UX smoke test

## Local preview

```sh
python3 -m http.server 8080
```

Visit `http://localhost:8080`.

## QA

On a Mac with Puppeteer available:

```sh
NODE_PATH=<path-to-puppeteer-node_modules> node tests/site-smoke.cjs
```

Browser tests cover 360/390/768/1024/1440/1920px for all three pages, no horizontal overflow, search/modes, mobile navigation, error-free JS and screenshots. External platform/agent installation must be verified separately.

## Hosting

Static GitHub Pages deploys from `main` repository root to **https://skills.tophive.dev/**. The `CNAME` file pins the configured custom domain; DNS is managed separately and was not changed by this repository commit.

This directory deliberately contains **no fake skill installation counts** or user-submitted publishing backend. To add skills, include authentic SKILL.md and update catalog/listing sources after review.


## All Skills Library

Visit https://skills.tophive.dev/library/ to browse the published catalog. Category filters and skill cards are progressively enhanced from `catalog.json`; a first-skill fallback remains usable without JavaScript or when network requests fail. Only verified published skills are listed, no fabricated counts.


## One shared global header

The canonical source is partials/site-header.html. Do not edit the generated page headers by hand.
After editing the shared header, run python3 scripts/sync-site-header.py.
Before deploying, run python3 scripts/sync-site-header.py --check.
GitHub Pages serves pre-generated static HTML so the navigation remains usable without JavaScript.
The approved homepage header style governs all pages.


## Docs and single skill page visual contract

content-pages.css holds only Docs and Skill Detail layout/density rules. Both use the same global header partial and the same structural grid as the approved homepage. Docs is a documentation page (compact title + TOC + readable sections), not another marketing landing page. Skill Detail prioritizes real scope, workflow distinctions, source inspection and install. No skill instructions or package contents are modified by these page-specific styles.
