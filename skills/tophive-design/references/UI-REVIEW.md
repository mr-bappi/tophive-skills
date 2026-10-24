# Product UI & review — design quality gates

## Product UI workflow

1. Inspect actual screen, functional states and platform conventions (WordPress/Gutenberg, React, macOS or other real app).
2. Identify information priority, user action, access/state boundaries and component ownership before changing visuals.
3. Design focused improvements for hierarchy, spacing, typography, alignments, micro-interactions, loading/error/empty/disabled/success states, focus and real CTA behavior.
4. Do not borrow marketing hero/bento components into admin UI by default. Respect the target's existing CSS architecture, TypeScript/module constraints and locked `AGENTS.md` contract.
5. If code is in scope, implement with authorized tools and inspect changed output.

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
