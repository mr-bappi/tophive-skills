# Dashboard Component Systems — enterprise workspace design

Load with `DASHBOARD-WORKFLOW.md` and `APPLICATION-VISUAL-CRAFT.md` for heavy operational products. Visual richness must never substitute for correct task flows, but a correct task flow alone is not a finished, polished interface.

## Build a feature/component inventory before code
- Global shell: primary nav, workspace switcher, breadcrumbs, command/search, profile, status and responsive navigation.
- Data surfaces: filter bar, saved views, column menu, sort, bulk actions, tables, detail view, chart, timeline and empty/error states.
- Editing: forms, validation, inline edit, autosave/dirty tracking, confirmation, permission boundary, undo, upload and background job state.
- Overlays: drawer/inspector, modal, menu, tooltip, toast, non-blocking progress; define stacking/focus/escape/outside-dismiss rules.
- Reusable primitives: Button, Field, Select/Combobox, Tabs, Badge, TableCell, Skeleton, Alert, IconButton and focus patterns with single token source.
- Model a 5-second glance: one unambiguous page job, primary action, important exceptions, relevant entities and next step visible without reading every card.

## Interaction contract
For each component define: owner, input/output, data source, permissions, keyboard affordances, state transitions, density, mobile mode, a11y and test. Two components performing the same job should share behavior, not just looks.

## Shell layout contract
- Support dense and comfortable modes only if the user needs them; keep column alignment and rhythm consistent.
- Sidebar/resizable inspector must have stable sizes, minimums, scroll ownership and accessible resizing controls or fallback.
- Sticky headers/columns require measured offsets/z-index and checked clipping; don't overlay row actions, dropdowns, toasts or inspector.
- Keep action column visible when valuable; distinguish click-row vs checkbox/select vs context menu; no hidden actions that touch users cannot reach.
- On narrow viewports, preserve filters, row actions and record context; use a responsive list/detail route rather than compressing 12 columns to illegibility.

## Stateful acceptance journeys
1. User searches, filters, sorts and opens item; the visible item is the same record.
2. User edits, sees validation, retries on failure and retains unsaved input; actual success state reflects the data source.
3. User selects rows, bulk action confirms and failed members are reported without lying about results.
4. User changes density/columns, reloads/navigates and saved preference scope behaves as specified.
5. Keyboard-only user opens and closes inspector; focus returns to triggering row, Escape does not destroy unsaved work.
6. Permission denied and stale data states display safe recovery paths.

## Engineering
Use `REACT-ARCHITECTURE.md` or established host framework for state and modules; read `DATA-GRID-ENGINE.md` for large table mechanics. No invented business metrics; label example data as such. Gate accessibility and runtime behavior with explicit evidence instead of screenshots alone.
