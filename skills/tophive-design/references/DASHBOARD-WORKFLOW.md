# Dashboard engine — operational UX, greenfield + redesign

Load first for new admin dashboards, SaaS workspaces, developer tools, data consoles, visual builders, WordPress settings, plugin admin and existing product interfaces. **Not** a marketing site workflow.

**Required for substantial dashboard builds/refines:** Also load `APPLICATION-CRAFT-GATE.md` and `APPLICATION-VISUAL-CRAFT.md` before building. Together they require an operational screen ledger, strong composition/interaction decisions, cross-view data truth and a real screenshot quality veto. **Functional correctness alone does not pass visual craft**, nor does a decorative shell pass functionality.

## Route: new app vs existing UI

- **Greenfield BUILD:** Identify user roles, job-to-be-done, primary objects/entities and relationships, top recurring actions, information hierarchy, navigation and permissions. Define a plausible information architecture and front-end state model with illustrative data labeled demo-only. Build the requested operational surface, not disconnected decorative metrics.
- **Existing REFINE/REBUILD:** Inspect actual screen and code, local design tokens/components, routes, data contracts, active/empty/error states and approved UI before touching source. Preserve critical navigation, form fields, workflows, information density and supported actions unless the user approves a restructure. Prefer targeted reversible patches and regression coverage.
- **REVIEW:** Read `UI-REVIEW.md` and produce evidence-ranked findings; no silent edits.

For a greenfield **branded** operations app, use the application-specific creative selection and visual-art-direction process in `APPLICATION-VISUAL-CRAFT.md`; consult `CREATIVE-DIVERSITY.md` selectively, never importing landing-page styling by default. Create a distinct identity without compromising task-first hierarchy. Existing operational UI and approved design tokens must not be restyled for novelty.

For operational motion use `MOTION-INTELLIGENCE.md` to prioritize meaningful state/feedback. For actual font selection and legibility inspect `TYPOGRAPHY-INTELLIGENCE.md`, not the marketing examples.

## Operational layout decisions

Choose navigation by task frequency and depth (sidebar, tabs, contextual subnav). Separate global navigation from workspace content and inspector. Establish toolbar hierarchy, search/filter/sort, bulk actions, table columns, row selection, keyboard behavior, form labels, inline validation, contextual help, notifications and accessible confirmation. Establish type sizes and spacing for dense but readable tables/forms, no obligatory oversized hero.

Design responsive behavior deliberately: at narrow widths, nav moves to menu/drawer as appropriate; tables scroll with stable headers or switch to task-preserving alternate layouts; inspectors become sheets/secondary views; all controls remain usable and focusable. Avoid pretending all desktop panels can fit 360px.

## States must represent work

Model applicable default, hover, focus-visible, active/selected, loading, empty, error, validation, success, disabled, unsaved changes, destructive confirmation, role restriction, permission denial and stale-data/async state. Buttons must have clear consequence. Do not suggest backend operations are real when only client-side demo logic exists. Label mock metrics and records illustrative.

## Implementation quality

Respect WordPress admin conventions/Gutenberg UX, React/Next patterns or existing native framework rather than imposing another stack. Maintain shared tokens without accidentally duplicating component CSS. Use semantic forms/tables/dialog semantics, descriptive status messages and keyboard flows. No decorative KPIs, fabricated chart axes, celebratory gradients, huge landing-section padding or giant serif title in a production operations view.

## Verification

Test the core task journey (select/filter/edit/save/error/retry or task-specific alternative), keyboard navigation and focus, appropriate table overflow, responsive nav, validation, loading/empty/error and permission states, no accidental destructive action, visual alignment. Inspect runtime/screenshot where tools permit and record PASS/FAIL/NOT TESTED.
