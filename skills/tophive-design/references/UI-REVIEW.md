# Visual and product-UI review — evidence → severity → fix → retest

Use for screenshot/URL critiques, audit of existing dashboard, plugin settings, component, and targeted refine work. For constructing an entire new application load `DASHBOARD-WORKFLOW.md` instead.

## Evidence discipline

Describe observed pixels and verified behavior before making a diagnosis. Separate **visible** (clipping, inconsistent padding, misalignment, inappropriate scale, repeated cards) from **hypothesized cause** (CSS override, grid track sizing, stale generated styles, cache, unhandled state). Do not invent runtime errors or source-level causes from a screenshot. Mark NOT TESTED for inaccessible behavior.

## Review and prioritization

1. Intended user job and top task; existing navigation, forms, tables, toolbars and actual data.
2. Hierarchy/density: Does the workspace communicate priority without marketing typography or decorative cards? Is there adequate scanning density and legibility?
3. Component system: consistent spacing, borders, radii, content alignment, state styling and focus; shared components should behave consistently across compatible screens.
4. Interaction: real control states, selection, filtering, keyboard semantics, loading/empty/error, permissions, undo/destructive confirmation.
5. Responsive: no unexpected body-level horizontal scroll, clipping, tiny targets, unusable data tables or floating inspector conflicts.
6. Visual/accessibility: contrast, reading order, proper labels, motion preferences, 200% zoom where applicable.

Report severity by impact (blocker, major, minor) and identify **one root-cause fix** where possible rather than accumulating overrides. Preserve approved design and unrelated code.

## Repair loop

When user asks "fix": inspect file ownership, CSS cascade/specificity, rendered before state, relevant markup, responsive breakpoints and tests. Apply minimal scoped edit; confirm desktop/mobile actual after state; test interactions. If browser unavailable report NOT TESTED and provide reproduction steps. Never claim pixel-perfect matching without side-by-side comparison.

## Quick audit checklist

- User can complete core job and understand primary next action.
- Visual signature fits actual product; product UI isn't a landing-page template.
- UI copy/labels describe real actions; placeholders clearly marked.
- Touch controls, focus, visible error/state, actual navigation.
- No clipped content, unintended overflow, contrast failures, decorative perpetual motion.
- Validation evidence and remaining limitations explicitly stated.
