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

- `index.html` — responsive home and skill directory
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
