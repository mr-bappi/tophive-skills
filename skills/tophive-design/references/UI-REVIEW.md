# Product UI & review — design quality gates

## Admin dashboard / Product UI workflow

**Read this file first for dashboards, SaaS control planes, WordPress/plugin admin, workflow editors and developer consoles.** Do not start from the website creative-direction workflow.

1. **Study the real app.** Inspect existing screens, user roles and workflows, locked AGENTS.md, design tokens, actual interactions and source ownership. Mark unknown features or mocked data clearly.
2. **Map operational structure.** Preserve existing navigation, sidebar/topbar, tab context, toolbars, workspace zones, table columns, filters, bulk actions, forms and detail panels. Do not invent a new information architecture from a marketing template.
3. **Use task-appropriate density.** Existing type/spacing tokens take precedence; maintain readable body/control labels, aligned controls and efficient table rows. Do not import enormous marketing headings, decorative serif pairing, expansive section padding, repeated SaaS cards or mandatory 12-column hero grids.
4. **Model real states.** Show applicable default, hover, keyboard focus, selected, loading, empty, error, validation, success, disabled, unsaved, destructive confirmation and permission-restricted behavior. No invented backend functionality or fake analytics.
5. **Respect responsiveness.** Test 360, 390, 768, 1024, 1440 and 1920 when possible. Reflow sidebar and inspector, preserve table usability (scroll or deliberate alternate layout), and keep interaction targets large enough—not tiny cards or horizontal overflow.
6. **Motion should clarify state.** Subtle transitions, stable panel sizing and optional canvas relation animations; honor reduced motion. No decorative endless animations or scroll storytelling inside an admin workspace.
7. **Make scoped, reversible changes.** Respect WordPress/native/React patterns, existing CSS/module boundaries, user-approved UX and pre-existing Git changes. Do not rewrite the whole dashboard when only one component is requested.
8. **Verify.** Inspect the actual app or screenshots; test keyboard navigation, contrast, overflow, aligned controls and working interaction states. Mark PASS / FAIL / NOT TESTED truthfully.

### Mandatory route boundary

**Admin dashboard requests should produce an operational interface, not a landing page in dashboard clothes.** Three marketing art directions, conversion CTAs, billboard typography, huge empty spaces, decorative KPIs and invented charts are inappropriate by default.

Examples:
- “Redesign AnyLicense license-management dashboard” → actual license table, license status controls, activation review, roles/permission states, nav and responsive data density. No editorial hero.
- “Design AnyLicense landing page” → verified buyer narrative and distinct website compositions, without recreating admin navigation as an entire site.
- “Polish WordPress settings UI” → preserve native platform components and accessible field states.

## Visual review workflow

- **Observed:** What is visible in actual screenshot/render? Text clipped? Spacing inconsistent? Layout overfull? Unclear state? Accessible focus missing?
- **Impact:** What question is not answered? Which action is obscured?
- **Fix:** Highest-priority concrete change; preserve good existing work.
- **Validation:** Before/after render/screenshots where possible; evidence-backed PASS/FAIL/NOT TESTED.

## Practical checklist

- [ ] Product, intended audience and primary action clear
- [ ] One relevant focal point in each section/viewport
- [ ] Responsive type scale, body measure and contrast appropriate
- [ ] Consistent grid, container alignment and spacing vocabulary
- [ ] No invented product proof or decorative fake UI
- [ ] Real destinations/state behavior and keyboard focus
- [ ] Mobile at 360/390, tablet 768, desktop 1024/1440/1920 checked as available
- [ ] No clipped text, unwanted horizontal scroll or decorative perpetual motion
- [ ] Reduced-motion behavior and meaningful animation fallbacks
- [ ] Truthful reports: **PASS / FAIL / NOT TESTED** with evidence
