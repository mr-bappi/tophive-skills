# Application Visual Craft — contemporary product interfaces without template bias

Use for new dashboards, admin workspaces, operational consoles and substantial product-UI redesigns, alongside `DASHBOARD-WORKFLOW.md`, `APPLICATION-CRAFT-GATE.md` and `DASHBOARD-COMPONENTS.md`. A functional, readable app is the **floor**, not proof of exceptional visual craftsmanship. This is a decision-and-rendering workflow, **not** a default visual style, fixed component library or trend checklist.

## 1. Select an operational composition, not a dashboard starter template

First state the operator's first decision, highest-frequency action, primary entities and actual data relationships. Internally compare **three materially different screen organizations** (not three colorways) before committing to a greenfield architecture. They might prioritize exceptions and next actions, a browsable entity workspace with a persistent inspector, a live system map, or another justified information structure. **None is mandatory.**

Compare the options on time-to-answer, task completion, visual comprehension, interaction cost, density, responsive transformation and truthful data availability. Reject the easiest “sidebar + four KPI cards + generic line chart + repeated rounded panels” merely when it fails to express the product's specific work. A familiar sidebar or chart is acceptable when genuinely the strongest choice.

Give the primary workspace a real center of gravity. Size panels by information and action importance, not symmetrical card-filling. Avoid a full page where every dataset is trapped in an interchangeable box and the largest visual occupies the most space only because it was easiest to implement. Use purposeful edge alignment, dividers, grouping, typography and surface changes to encode hierarchy.

## 2. Design a distinctive but usable product language

Define an internally coherent identity using **roles**, not fashionable tokens: navigation/shell, work surface, data emphasis, risk/priority semantics, interactive affordances, typography for numerals versus labels, icon stroke/geometry, spacing density, shape and elevation. Articulate how the identity communicates the product's job even when the logo is hidden.

Precision is craft: typography weight and optical alignment, row heights and hit areas, restrained border contrast, icon consistency, clear hover/focus/selected/disabled/processing treatments, contextual actions and toolbar proportions. Distinctive does **not** mean maximal decoration, glassmorphism, gradient, neon or oversized headings. Conversely, “low-noise” and “quiet” do **not** mean generic, motionless, monochrome or visually underdeveloped.

A serious financial/operations product can have beautiful surfaces, color, charts and responsive movement without sacrificing readability. Let the actual product decide STATIC/QUIET/EXPRESSIVE/IMMERSIVE via `MOTION-INTELLIGENCE.md`; never impose GSAP, animation quotas or marketing scroll theatrics on operational work.

## 3. Give each component a contemporary, complete interaction design

Before implementation, specify what happens **at rest, hover, keyboard focus, selection, loading, empty, error, success and disabled** for key components. Test components as a family, not isolated rectangles:

- **Navigation/command:** current location, compact but clear icon+label rhythm, fast search/command feedback, workspace switching and mobile affordance.
- **Filters and controls:** clear selected segments, informative controls, well-sized icons, reset behavior, unobtrusive counts; avoid raw browser widgets presented as a finished custom product.
- **Data tables and inspectors:** useful density, meaningful columns, type and numeric alignment, contextual row actions, selected-row continuity, frozen/sticky boundaries only if needed, layered inspector behavior and mobile detail route.
- **Charts and numeric summaries:** grounded axis, range, unit, meaning and interaction; priority semantics visible without inventing historical numbers. A sparkline needs more than a decorative stroke to justify its footprint.
- **Status and actions:** understandable severity and next steps, accessible colors, coherent badges, confirmation/undo/feedback, touch/keyboard parity and state transitions.

Use modern implementation primitives when they improve quality, but do not assume a specific framework or import a UI kit merely to claim polish. Centralize tokens, shared states and layering instead of applying one-off CSS to each panel.

## 4. Render-based application beauty veto

At desktop and mobile inspect an initial screenshot, at least one populated list/detail view and one active interaction state. When available, compare to verified high-quality product UI patterns **for principles only**; never clone branded layouts or assume another product's UI is accessible.

Ask:
1. If the logo and accent are changed, is this still an anonymous admin starter UI? What authentic task/data relationship gives it identity?
2. Does a first-time operator immediately see **what happened, why it matters and what to do**? Are priority actions designed as controls rather than plain text links scattered across panels?
3. Are surfaces, buttons, inputs, tabs, badges, tables, toolbars and charts a consistent crafted system, not browser-default fragments?
4. Do information density, whitespace, typographic rhythm and panel proportions reflect actual jobs? Is any single card huge without corresponding decision value?
5. Do critical interactions feel responsive and understandable? If motion is chosen, is it visible and intentional? Does reduced-motion remain complete?
6. Does the mobile version change interaction structure intelligently rather than just stacking the desktop cards?

Name the **highest-impact observable visual/UX defect**, repair its root cause (often composition, type, component model or information allocation), re-render and compare. Do not sign off merely because source builds, all routes render or the CSS has transitions. Also do not force changes when a well-supported, deliberately quiet composition already serves the task.

## 5. Honest acceptance

Record **operational task correctness** and **visual craftsmanship** separately. A passing search/filter/CRUD smoke test cannot automatically satisfy creative visual QA. A source-level checklist or agent self-score cannot prove a redesign is better than a previous version. Judge improvements using actual browser captures, interacted states and, for Skill-level claims, independent same-prompt blind comparisons. Report NOT TESTED for any missing browser/user evidence.
