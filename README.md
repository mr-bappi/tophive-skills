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
- `examples/` — public working Examples Gallery with FlowBridge, RoomFlow, OrbitDesk, MARGIN, SENTRIX and LITTLE FERN case studies, real downloadable standalone source and captured screenshot assets
- `styles.css` and `app.js` — plain CSS/JS (no CDN or framework)
- `skills/tophive-design/` — installable skill source
- `downloads/` — matching portable upload package
- `catalog.json` — real current catalog (1 skill and SHA256)
- `tests/site-smoke.cjs` — existing browser UX regression suite
- `tests/examples-smoke.cjs` — dedicated six-width Examples and interactive case preview smoke tests

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


## Public Examples Gallery

The new `/examples/` gallery belongs to **this public website repository**, not to the `design-lab` core repository. It showcases six fictional, front-end-only design examples: FlowBridge (landing page), RoomFlow (dashboard), OrbitDesk (creative-team landing page), MARGIN (editorial literary magazine), SENTRIX (cybersecurity SaaS) and LITTLE FERN (interactive science education). These are manual implementation/browsing trials, not certified installed-Skill invocation. Each case now has a product-first detail page: real live preview, recognizable **source-verified technology icons in the header**, an **always-visible recreation prompt with Copy**, verified feature benefits, and one working Free download action in a **truly sticky desktop card** (static on mobile). Actual ZIP contents are verified by the builder but public filenames/counts and the What's included section are deliberately omitted. Testing evidence remains in a compact disclosure; the prompt is no longer hidden (not guaranteed pixel-identical results). No public Pro/Coming later teasers appear. They are **not** verified automatic skill invocation and are excluded from the official 24-run benchmark.

The Design Lab remains the independent local source of design rules and internal evaluation records. The GitHub Pages Examples gallery is the **separate public publishing destination**. Public source archives are reviewed before each Git commit/push; adding folders under the local Design Lab archives does not itself publish anything.

For future Design Lab archive additions, run `python3 scripts/import-design-lab-examples.py --discover`, curate the real source in `examples/archive-imports.json`, then run `--import`, create the two screenshot assets with `tests/capture-example-full-pages.cjs <slug>`, and build with `scripts/build-examples.py`, `scripts/build-example-products.py`, `scripts/sync-site-header.py` and `scripts/sync-example-sitemap.py`. Never auto-publish an unreviewed archive, a private product source, an invented QA score, or files that differ from the archive. Category counts and static cards are generated automatically. The gallery is listing-only with no hero: previews use 3 desktop columns, 4 at very wide sizes, 2 on tablet and 1 on mobile; sorting is exposed from 7+ items and results load 9 at a time. New case pages use the canonical shared header without manual registration. Detailed instructions: `examples/README.md`.

Run `python3 scripts/build-examples.py --check`, `python3 scripts/build-example-products.py --check`, `NODE_PATH=<path-to-puppeteer-node-modules> node tests/examples-smoke.cjs`, `node tests/examples-marketplace.cjs`, `node tests/examples-downloads.cjs` and `node tests/examples-scale.cjs` with the same Puppeteer NODE_PATH. The latter uses 30 test-only in-memory cards, not published examples.

## One shared global Search component

The canonical Search input style lives in `site-search.css`, with shared `/` focus and Escape-clear behavior in `site-search.js`. The homepage Skills directory, `/library/` and `/examples/` all use `<label class="site-search" data-site-search-field>` and `<input data-site-search>`. Only their search terms, page-specific filtering logic, and **placement width** differ. Do **not** recreate border, focus, icon, spacing, height, or keyboard styles in page CSS. The one design uses a 44px field, 8px corner radius, single focus border/ring, and a consistent magnifier and `/` hint.

In Examples, the recommended collection toolbar keeps **category filters at the left and Search on the right** on wide screens; tablet/mobile stack categories above a full-width Search. This is a listing tool, not a hero section. Standalone fictional product demos inside `examples/previews/` retain their own independent interface styling and are not part of the website shell.

Run `NODE_PATH=<path-to-puppeteer> node tests/site-search-smoke.cjs` when editing Search: it checks 18 viewport/page combinations, visual tokens, shortcuts, filters and toolbar placement.

## One global listing header (Library & Examples)

`site-listing.css` is the canonical header/layout contract for both `/library/` and `/examples/`. Both pages use the same `site-listing-main`, `site-listing-container`, `site-listing-head`, `site-listing-title`, `site-listing-count`, `site-listing-toolbar`, `site-listing-filters`, `site-listing-actions`, `site-listing-summary`, and `site-listing-results` classes. The header is **compact Title + count**, then categories/search on a common toolbar, then a quiet result count. Do not add page-specific breadcrumbs, marketing copy, separate header margins, type scales, borders or toolbar patterns.

Page-specific code owns only the *content*: Skills uses its accessible data table and categories from the real skills catalog; Examples uses its image gallery and categories from the real examples catalog. Both reuse `site-search.css` and `site-search.js`. Count badges reflect total real items; filtered result summaries update independently. Category pills remain visible even with only one Skills category, matching Examples (`All skills 01` / `Design 01`). Counts and active states come from the real catalog. Without JavaScript, the first skill remains visible without nonfunctional filter buttons. On mobile, full-width Search sits below any active category filters. Footer navigation/content also matches across listing pages. The shared header partial for the whole site is unchanged.

Before reviewing/deploying, run `NODE_PATH=<path-to-puppeteer> node tests/site-listing-header.cjs`; this protects 7 viewport widths, exact header/toolbar alignment, active filter visual parity, and truthful dynamic badges. It does not force Docs, Skill details, or the homepage hero into a listing-page architecture.

## One shared global header

The canonical source is partials/site-header.html. Do not edit the generated page headers by hand.
After editing the shared header, run python3 scripts/sync-site-header.py.
Before deploying, run python3 scripts/sync-site-header.py --check.
GitHub Pages serves pre-generated static HTML so the navigation remains usable without JavaScript.
The approved homepage header style governs all pages.


## Docs and single skill page visual contract

content-pages.css holds only Docs and Skill Detail layout/density rules. Both use the same global header partial and the same structural grid as the approved homepage. Docs is a documentation page (compact title + TOC + readable sections), not another marketing landing page. Skill Detail prioritizes real scope, workflow distinctions, source inspection and install. No skill instructions or package contents are modified by these page-specific styles.


## Documentation design (October 2026)

The docs page is an install-first developer guide with two distinct paths (Skills CLI and ChatGPT portable ZIP), usage example, permission boundaries, and links to real published source. Design lives in docs-v2.css only; shared content-pages.css is limited to the Skill Detail page. The header remains the single global partial, and the Skills CLI command intentionally uses the actual GitHub owner mr-bappi. Rebrand display text separately from installation identifiers.
