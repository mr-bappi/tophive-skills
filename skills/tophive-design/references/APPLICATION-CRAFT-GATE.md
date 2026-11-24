# Application Craft Gate — low-noise, high-utility SaaS workspaces

Load with `DASHBOARD-WORKFLOW.md` for all substantial admin, CRM, ERP, analytics and developer-console BUILD/REFINE tasks. This is an acceptance contract, not a mandatory look-and-feel template.

## 1. Design for a job before styling

Define one primary user job per screen, the key object, the next action and the decision a person should make within five seconds. Create a **screen ledger**: route, primary job, core data, primary action, secondary actions, empty state, error state, permissions, mobile behavior, interaction result and verification evidence. Complete the core task journey before designing decoration. Data changes must propagate between connected surfaces (for example, changing an opportunity stage also updates pipeline, filtered lists and reports).

## 2. Information budget and text economy

- Prefer **one H1 title and one clear primary action** per operational page. An eyebrow + H1 + repeated tagline is an anti-pattern unless both extra strings provide verifiable task context. Breadcrumbs, nav labels, title and card headings must not repeat the same information four times.
- Every label, caption, helper text, status badge and description must help a decision, disambiguate state, explain an irreversible action or meet accessibility needs. Otherwise delete it.
- Do not place demo/legal/implementation disclaimers inside a large content card. Show one unobtrusive persistent demo indicator, with a concise explanation in a suitable settings/info surface. Never misrepresent capabilities.
- Card test: a card must contain useful data, state or action. If its entire purpose is explanatory prose, reframe as inline help, tooltip, compact notice or remove it.
- Do not fill empty grid cells with fake charts, slogans, "insights", motivational copy or decorative icons. Allow deliberate whitespace rather than inventing content.
- Avoid duplicated count labels and metadata; do not show '3 outstanding' beside a Completed tab unless explicitly clarifying cross-filter context.

## 3. Layout and brand signature

- Design a density rhythm, not a repeated card formula. Choose layout topology from user tasks: dense grid for records, split pane for conversations, kanban for stages, single-column groups for tasks, compact comparison for reporting.
- Derive spacing, control sizing, surfaces, radii and density from task and visual direction; keep relationships internally consistent rather than hardcoding 4/8px as a visual signature. Use legible typography, careful optical alignment and well-designed states; check actual contents rather than enforcing equal panel heights.
- Avoid default 'four KPIs + two charts + promotional card' across unrelated apps. If an existing UI needs no chart, do not add one.
- Build a distinct, purposeful product mark or letterform; random four-tile symbols, unrelated sparks, stock illustrations and generic colored boxes are not an identity. Test mark at 20–40px and in monochrome. The mark must remain recognisable without a subtitle.
- A premium application is not a landing page: no oversized editorial hero, three-line headings, persistent promo panel, ornamental motion or unnecessary full-bleed art inside the working shell.

## 4. Functional truth and interaction coverage

- Represent real underlying local/server data; never invent calendar histories, trends, conversion claims or axes from arbitrary values. If intentionally illustrative, clearly label once and avoid implying dynamic analytics.
- Filters, tabs, sort and bulk selection show accurate counts for the **current scope**. Drill-down actions must open the corresponding filtered records and preserve navigation context. Empty filters should have a useful recovery action.
- Every editable object must have a meaningful edit/save or status-change path, accessible validation, confirmation for destructive actions, feedback and persistence at the promised scope.
- Test the full workflow: navigate → search/filter → open → edit → save → verify in another connected view → restore/reopen → keyboard/mobile → empty/error case.
- For touch and keyboard, never rely solely on hover or drag and drop; provide a detail-panel or select fallback for stage changes.

## 5. Screenshot veto and repair loop

Before accepting the page, inspect at least desktop and mobile:
1. **Noise veto:** remove nonessential subtitles, eyebrows, redundant badges, repeating descriptions, meaningless decoration and dead-space explanation cards.
2. **Structure veto:** does every section fit the user's actual job? Is empty space intentional? Is there more than one equally dominant action?
3. **Truth veto:** are numbers, charts, summary counts and labels backed by the current fixture or live data contract?
4. **Interaction veto:** did the core journey actually work, including filters, modal save, error, keyboard, responsive navigation and cross-screen synchronization?
5. **Brand veto:** could this page become a random other SaaS by swapping the logo and accent? If yes, change the composition or interaction model, not merely the color.

Record PASS / FAIL / NOT TESTED with real browser evidence. Source compilation alone does not pass visual craft or interaction gates. A quiet application can be exceptionally polished; **quiet must not become an excuse for visually generic starter UI**. Compare functionality and craftsmanship separately using `APPLICATION-VISUAL-CRAFT.md`; reject empty decorative complexity without rejecting distinctive identity.
