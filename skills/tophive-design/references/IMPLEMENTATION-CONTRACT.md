# Implementation contract — scoped, compatible, maintainable

The requested artifact and target project's engineering contract override demonstration templates. Browser/UI skill provides guidance, not authority to access tools, commit or deploy.

## Scope and stack

- Inspect target repo, root `AGENTS.md`, package manifest, framework and routes, shared tokens, existing style/component conventions, actual environment and Git changes *when accessible*.
- No user stack specified and no existing repo? Default to a portable isolated HTML/CSS/JS prototype with semantic accessible controls; do not invent backend data access.
- User requests React/Next/Vue/WordPress/native components? Implement in the requested platform, preserve its conventions (e.g. React component boundaries, state, JSX; Next client/server and routing boundaries; WordPress editor styles and block architecture) without silently converting technology.
- Do not delete/replace an entire site for a section-level request. Avoid broad global selector collisions, duplicate CSS tokens, style regressions and cumulative specificity overrides.
- Never import example-site global CSS wholesale into the target app. Existing brand/engineering design tokens take precedence. Extract reusable primitives only when justified.
- **Mandatory modular styles:** Before writing new frontend CSS load `MODULAR-CSS-ARCHITECTURE.md`. New projects must use editable, owned style modules with centralized tokens and a deterministic CSS build/import entry. Never ship a large hand-edited `styles.css`/`globals.css` dumping ground. For existing apps follow the approved existing modular convention and edit only the owning area; do not perform sweeping migration without authorization.

## File and interaction quality

- Semantic heading hierarchy, landmarks, actual `button` for actions, `a` for navigation, accessible label associations, keyboard support and visible focus. Do not use static decorations as fake interactive controls.
- Implement meaningful local states: tabs, menus, search/filter, submission validation, feedback, disabled/loading/error, visual workflow per route. A static demo may simulate only front-end states, clearly labeled; no invented database/API connection.
- Code should be organized, readable, with scoped classes/components, coherent breakpoints, no duplicate handlers, no unnecessary dependencies. Small responsive utilities acceptable.
- Preserve working links and data bindings. Use actual endpoints/assets only if verified. Lazy load imagery when appropriate, set dimensions to prevent layout shift, respect reduced motion and fluid wrapping. Responsive includes ultra-narrow and wide monitors, zoom and keyboard focus.

## Verify before delivery

1. Verify the modular style source, CSS build/import graph and stale-output check from `MODULAR-CSS-ARCHITECTURE.md`, then build/lint/test per target stack if available.
2. Open actual page/app in authorized browser or screenshot capture, check mobile/tablet/wide.
3. Inspect console errors, overflow, clipped headings, CSS/spacing drift, nav/CTA functionality, focus and reduced motion.
4. For edits, rerun old regression checks and compare before/after accepted UI.
5. Document PASS, FAIL, NOT TESTED and real artifacts. Do not claim "deployed", "committed", "tested" without evidence.

## Permissions and safety

Local prototype does not authorize production modification. Separate approvals needed for commit/push/deploy, changing shared components across applications, data deletion, third-party accounts and new installs. Respect developer/target repo instructions and secrets.
