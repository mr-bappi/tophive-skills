# TOPHIVE Skills Examples — maintenance

The public gallery lives in this `tophive-skills/examples/` folder. The separate `design-lab` repository remains the core design brain and evaluation workspace.

## Importing completed Design Lab site archives

The canonical local source is `~/Documents/design-lab/archives/`. Public Examples belong to this independent GitHub Pages repository, not the Design Lab core.

Run `python3 scripts/import-design-lab-examples.py --discover` to identify which archive directories are already listed, explicitly reviewed, or **NEEDS REVIEW**. Only reviewed records in `examples/archive-imports.json` may be imported. The importer verifies original ZIP contents byte-for-byte against the archived files, copies only runtime assets into the preview, and creates the case-page draft; it does **not** modify Design Lab, commit or push. For a new verified archive, add its accurate description, QA limits, real source package and feature metadata to the registry, then run:

```sh
python3 scripts/import-design-lab-examples.py --import
python3 scripts/import-design-lab-examples.py --check
NODE_PATH=<path-to-puppeteer> node tests/capture-example-full-pages.cjs <new-slug>
python3 scripts/build-examples.py
python3 scripts/build-example-products.py
python3 scripts/sync-site-header.py
python3 scripts/sync-example-sitemap.py
```

Follow with browser tests and visual QA; Git commit/push requires explicit owner approval. GitHub Pages subsequently deploys from main. This workflow is **on-demand, not a background archive watcher**. Adding an archive to a local Mac folder cannot automatically update the public website without executing the importer, verification and approved publishing workflow. AnyLicense is an earlier, real-product concept archive that is intentionally not auto-listed as a fictional free template without independent commercial review.

## Adding genuine examples manually

1. Create the case study at `examples/<slug>/index.html`, a runnable preview at `examples/previews/<slug>/`, and matching source ZIP at `examples/downloads/<slug>-source.zip`. The project may have its own original desktop/mobile screenshots, but gallery poster assets are generated from the preview.
2. Add a **verified real** entry to `examples/catalog.json` and a corresponding `examples/product-details.json` record. List only features observed in working code and files truly inside the source ZIP. Never add synthetic items, fake commercial claims, or invented framework support.
3. With the localhost site running, execute `NODE_PATH=<path-to-puppeteer> node tests/capture-example-full-pages.cjs` (requires local Python/Pillow). This takes ONE 1440px browser capture of each working frontend and writes both `examples/media/<slug>-poster.webp` (the top crop) and `examples/media/<slug>-full.webp` (the entire page) at WebP quality 96. The generator validates that both exist. Always recapture both assets together after changes to a prototype.
4. Run `python3 scripts/build-examples.py` to generate static layered cards, category filters and counts. Initial posters are compressed and lazy-loaded. Full-page WebP loads only on desktop hover and pans top-to-bottom. Both images originate from the exact same browser capture, with matched width and top framing, so the transition has no jump or zoom. No numbered/category overlay is placed on the thumbnails; type remains beneath the title.
5. Run `python3 scripts/build-example-products.py` to build each product page: verified feature benefits, colorful self-contained HTML/CSS/JS/SVG technology icons next to the header, a **visible recreation prompt with Copy action** directly below the preview, relevant use cases and one real Free download button in the sticky product card. ZIP contents are verified internally but **filenames, file count and the What's included section are not publicly shown**. First-time case pages must contain a real interactive preview, original QA evidence and recreation prompt. Later rebuilds preserve the source prompt and QA evidence automatically.
6. Run `python3 scripts/sync-site-header.py` to synchronize canonical navigation across pages.
7. Run the checks below, review real HTTP desktop/mobile screenshots and request separate publication approval.

## UX scaling

- Image-first, taller, full-bleed cards prioritize the actual prototype: 3 columns on standard desktop, 4 at 1640px+, 2 on tablet, 1 on mobile. All use the website's canonical 1240px alignment rails; the layout is not determined by the number of items.
- The page uses the exact same `site-listing.css` shell as `/library/`: matching heading/count badge geometry, shared filter/search toolbar, and results summary. The page contains only a compact Examples heading, collection controls and item grid; no hero or promotional sections. On wide desktop, categories are left and Search is right; on smaller screens Search stacks below categories. Search visuals come **only** from the global `site-search.css` / `site-search.js`, never page CSS.
- Category filters are retained in the toolbar because they scale to 20–30+ examples. No duplicate number/category overlay is shown on cards; the type label beneath the name is enough. Search, accurate counts and featured/name sort remain.
- With 7+ total items, sorting becomes visible.
- Progressive "Load more" reveals 9 cards per click. Changing search/filter/sort resets the batch.
- All content is static HTML generated at build time. Cards and links remain readable without JS.
- All covers use lazy-loaded local real screenshots, no external runtime needed. Full-page WebP images are requested **only on desktop hover**; touch, keyboard navigation and reduced-motion users retain a static, clickable card. The gentle pan reaches the bottom and reverses while hovering.
- Each individual case page is a **marketplace-ready Free product page**: compact heading with actual technology icons, working preview, prominent **always-visible recreation prompt and copy control**, concise verified features/use cases, plus a download card. The card sticks 22px from the desktop viewport top through its content grid (its sidebar is stretched deliberately to enable true CSS stickiness). On mobile the card comes after the preview and before the prompt/features; it is not sticky. Technical QA remains in a collapsed disclosure; neither actual file names nor unverified business figures appear in public selling content.

## Free / Pro commerce boundary

All four downloads are **truly free**, direct ZIP links with no signup or payment flow. Each page shows exactly one download action in its product card; no header download duplication and no public Pro, Coming later or Future offering sections. `examples/product-details.json` holds source-grounded marketing copy and internal Free ($0) / Pro (planned) metadata; `scripts/build-example-products.py` validates actual ZIP contents and rejects phantom paid prices or checkout URLs. When an actual paid offer is implemented, the *same card CTA* can switch from `Download free` to `Add to cart` only after checkout, entitlements and licensing are ready. Never display fake payment actions.

No private download entitlement, payment processor, license generator, tax invoice, paid access or ecommerce backend has been implemented. Before selling anything: specify and publish actual Free/Pro license terms (current ZIP archives do not contain a dedicated license file), make a product-level pricing/availability schema, use provider-hosted verified checkout, process signed webhooks server-side, protect paid archives, implement download entitlement and account/receipt handling, then test refunds, taxes and security. Never publish paid ZIPs to a public static downloads directory.

## Future verified analytics (not active)

The product download card carries a stable `data-ex-product-id` matching its catalog slug. `examples/analytics.schema.json` defines an optional **future** provider-sourced aggregate payload: reporting window, provenance, refresh date, and optional verified page views/download counts. It currently has **no connected source**, no tracking, no visible counters, and no fake seed data. Before displaying metrics: connect a real privacy-reviewed analytics pipeline, define events (e.g. download started vs successful delivery), validate source/time range and schema server-side, consider consent/regulatory requirements, and only then show accurate dated aggregates. Analytics should not change the current card layout when absent.

## Checks

```sh
python3 scripts/build-example-products.py --check
python3 scripts/build-examples.py --check
python3 scripts/sync-site-header.py --check
NODE_PATH=<path-to-puppeteer> node tests/design-lab-archive-interactions.cjs
NODE_PATH=<path-to-puppeteer> node tests/examples-smoke.cjs
NODE_PATH=<path-to-puppeteer> node tests/examples-marketplace.cjs
NODE_PATH=<path-to-puppeteer> node tests/examples-sticky-scroll.cjs
NODE_PATH=<path-to-puppeteer> node tests/examples-downloads.cjs
NODE_PATH=<path-to-puppeteer> node tests/site-search-smoke.cjs
NODE_PATH=<path-to-puppeteer> node tests/site-listing-header.cjs
NODE_PATH=<path-to-puppeteer> node tests/examples-hover-pan.cjs
NODE_PATH=<path-to-puppeteer> node tests/examples-hover-stability.cjs
NODE_PATH=<path-to-puppeteer> node tests/margin-magazine-interactions.cjs
NODE_PATH=<path-to-puppeteer> node tests/examples-grid-alignment.cjs
NODE_PATH=<path-to-puppeteer> node tests/examples-scale.cjs
NODE_PATH=<path-to-puppeteer> node tests/site-smoke.cjs
```

The 30-item stress test uses *in-memory, test-only* synthetic cards on loopback. They are never published. FlowBridge, RoomFlow, OrbitDesk, MARGIN, SENTRIX and LITTLE FERN are manual artifact trials, not official installed-Skill invocation results. OrbitDesk and MARGIN were imported from completed Downloads prototypes; their original source files remain unchanged. MARGIN additionally has independently rerun local HTTP/Chromium QA, but the originally requested v1.4.0-specific Skill activation cannot be confirmed from the source QA report.
