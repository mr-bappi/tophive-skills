# UX Reliability & First-Pass Regression Gate

**Purpose:** prevent recurring high-cost UI rework before calling an authorized BUILD/REFINE complete. Apply to the relevant controls and layouts, not to every page indiscriminately. This is a **preflight + implementation + live evidence** contract, not a fixed style or guaranteed one-shot outcome. Keep project names, sample logos, palette and real business data out of this portable file.

## 0. One request, multiple internal checks

A one-shot user request may need several *internal* build → capture → inspect → repair → retest cycles. Don't ask the user to identify obvious issues that a local browser can catch. If a browser is unavailable, report NOT TESTED; do not claim a finished visual review. Treat first-pass as the **first delivered artifact after internal QA**, not the first uninspected render.

Before writing code, produce a short internal **screen risk contract** for each critical route: job, target object and dataset scale, primary/secondary action, route and URL/reload behavior, global-shell owner, scroll owner, selected/expanded states, loading/empty/error/filled states, mobile layout, and relevant permission or demo boundaries. Reuse approved decisions; don't manufacture new feature scope.

## 1. Structural gates — decide before components

| Gate | Preventive design decision | Observed acceptance (browser or truthful NOT TESTED) |
| --- | --- | --- |
| U01 Product-shaped layout | Classify marketing page, directory, operational workspace, graph canvas, commerce or media tool first; set information density and proof structure to the user's job | Dashboard is not a landing page; canvas not squashed by low-use panels; content not generic filler |
| U02 Global shell | One owned header/nav/account/CTA component; clear route state and prepaint/async loading strategy | No duplicate actions, rogue glyphs, active-menu jump or CLS on hard reload/deferred app load |
| U03 Scroll topology | Name exactly which surface owns vertical page/table/aside scroll at desktop and mobile. Use `overflow`, `scrollbar-gutter` and body lock deliberately, not incidental stacking | No dual visible vertical rails on same task; no unexplained empty rail on short page; no content-width or scrollY jump on open/close/route change |
| U04 Inspector vs modal | Choose persistent side inspector for frequent row-to-row comparison; modal/drawer only for interrupting workflows | Inspect A→B→C without closing when comparison is the job; table selection/filter and scroll position survive; focus/close/ESC behavior correct |
| U05 Sticky geometry | Define stacking contexts, sticky offsets, header height, collapse thresholds and state preservation before animations | Tab/filter remains compact when switched while scrolled; no overlap or empty sticky band; row/card is immediately visible |
| U06 Data grid scalability | Define columns, pinned boundaries, last-cell alignment, sort/filter/pagination semantics and representative record size | At 1/10/500+ records as relevant: headers/pins/actions align; no clipped row actions; filters/paging correct; browser performance measured if claimed |
| U07 Visual component discipline | Central icon size/optical alignment, select-chevron inset, border/radius tokens, action hierarchy, hover/focus states | +/−/close/arrow centered in real buttons; select arrow never touches edge; no doubled borders, dead selectors, mystery whitespace or two primary CTAs |
| U08 Copy and identity | Limit labels/helper text to task need; use authentic assets and consistent type roles, real data relationships | No repetitive heading stacks or design-lab filler; recognizable product and status at a glance; images appear without pending placeholders in delivery |

## 2. Runtime and output gates — exercise real states

| Gate | Required transition | Pass evidence |
| --- | --- | --- |
| U09 Hydration/route parity | Direct deep link, hard reload, back/forward, slow script/data load if possible | No fallback route, active-state flashing, duplicated account icon, CTA width jump or missing first paint |
| U10 Interaction matrix | At least default, hover, keyboard focus, selection, disabled, empty, filled, validation/error and successful outcome for primary paths | Controls respond honestly; pointer can cross dropdown gap; touch doesn't rely on hover; ESC and focus restoration work |
| U11 Layout transition | Open/close drawer or panel, switch tabs, edit/save data, switch active row while page is scrolled | No flicker, unintended recenter, extra scrollbars, CSS transition from wrong initial state, lost data or table reset |
| U12 Cross-view truth | Search → select → edit → save → other view → back/reload, destructive undo where relevant | Metrics and counts reflect actual demo data; user input persists per declared contract; no pretend live integration |
| U13 Media/motion | Image loaded/error states, intrinsic ratio, hover/reduced-motion, long page captures | No blank thumbnails, stretching, clipped hero, motion that hijacks scroll or disabled motion fallback |
| U14 Print/export | Where receipt/PDF/CSV is required, isolate print root, page size, labels and generated data | Printer preview includes ONLY intended content on appropriate paper/pages; not surrounding app chrome |
| U15 CSS/source hygiene | Inspect changed CSS ownership, duplicate selectors, source formatting, console/network failures | No cascading last-minute overrides without cleanup; no inactive controls or fake interactive icons; no broken file/link/images |

## 3. Minimum QA matrix and stop rules

- For critical routes: try **360, 390, 768, 1024, 1440, 1920 CSS px**, both a short and long content state. Include at least one real mobile pointer/keyboard path when supported.
- For global shell and sticky controls capture **initial paint, loaded, after reload, after scroll, after filtering/route change**. Compare bounding boxes of affected controls (`left`, `right`, `top`, `height`) within **1 CSS pixel where layout should remain fixed**; document intentional breakpoint changes separately.
- For scroll/layout compare `documentElement.clientWidth`, `innerWidth`, `scrollWidth`, `scrollY`, owning container `scrollTop`, visible rails and docked panel position before/after. A scrollable table or drawer is not a failure by itself; **two competing owners and layout shift** are.
- For stateful product UI use realistic seed fixtures; include no-results, exactly-one, few and a larger catalog sample where scaling is relevant. Confirm last row, last column, and bottom-of-page interactions.
- Browser smoke is a starting gate, not a finish certificate. Require **human screenshot critique** of hierarchy, content density, spacing, typographic optical balance, crop quality and brand distinctiveness. Confirm actual icon/border alignment with visual evidence, not only source CSS.
- **Stop delivery** on a broken primary journey, misleading data, invisible required artwork, cut-off action, duplicated/phantom control, navigation flash, unintended page width shift, or inaccessible critical operation. Fix root cause and rerun affected tests. If tools prevent verification, mark that gate NOT TESTED and state the remaining risk.

## 4. Evidence sheet and learning loop

Write a project-local acceptance record with: screen + state + viewport, expected invariant, observed evidence path/log, PASS/FAIL/NOT TESTED, root cause and regression test. Group repeated issues by failure **type**, not by screenshot or product-specific CSS selector. After fixes, promote only the general rule to this reference; keep project data and executable tests in the owning repo. Never claim the Skill is superior or reliably one-shot without blinded same-task baseline runs and an independent evaluator.
