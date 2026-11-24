# Website engine — complete, verifiable, product-led builds

Load this for new/reworked websites, marketing pages, SaaS landing pages and web sections. Pair with `CREATIVE-DIRECTION.md`, `CREATIVE-DIVERSITY.md` and `DISTINCTIVENESS-GATE.md`; choose typography and motion via `TYPOGRAPHY-INTELLIGENCE.md` and `MOTION-INTELLIGENCE.md`; check `MOTION-QUALITY-GATES.md`; for BUILD also read `ONE-SHOT-EXECUTION.md`, `IMPLEMENTATION-CONTRACT.md` and `QUALITY-GATES.md`.

New builds: load COMPOSITION-ENGINE.md and PRODUCT-EXPERIENCE-ENGINE.md and conduct VISUAL-CRITIC-LOOP.md after real rendering. Product interaction matters more than generic section count.

For terse new landing-page BUILD prompts, first apply `SHORT-PROMPT-INTELLIGENCE.md` to establish a minimal, source-tagged product brief. This is a decision rule, not a generic section checklist; if the named project's purpose is truly unknown and cannot be recovered, do not invent features, audience or a fake brand story.

## Evidence and positioning

Extract product job, target visitor, pain/alternative, verified capabilities, brand assets, differentiators, primary CTA and user-requested artifact. A provided old product URL is a *reference*, not automatic permission to edit. Label each claim VERIFIED, USER-APPROVED, ILLUSTRATIVE or TBD; avoid claims of compliance, pricing, customer counts, integrations and reviews not supported by sources.

## Narrative architecture

Decide the conversion sequence from the product truth, not a fixed template. Typical jobs: (1) decisive answer in hero—what, for whom, outcome; (2) mechanism or workflow; (3) authentic product proof; (4) significant benefits or use cases; (5) trust/evidence only when real; (6) next step. Design real structure appropriate to the content; omit filler and change section compositions when information needs change.

Define a **visual signature** in layout, typography, interaction or genuine UI demonstration; write a short anti-generic decision. Prefer varied content density and rhythm over repeated three-card rows. Distinct visual identity ≠ excessive visual decoration.

## Actual build

- Honor existing stack, route structure, component library, SEO constraints, assets and approved direction. For independent static prototype, provide semantic HTML/CSS/JS with working links, menus, mobile behavior, copy actions and meaningful interactive demos as requested.
- **Mandatory:** organize new site/theme CSS as readable, owned source modules from day one. Follow `MODULAR-CSS-ARCHITECTURE.md` for tokens/layout/components/pages/responsive ownership and a verifiable single runtime CSS entry or framework-native import graph; never accumulate one massive editable global stylesheet.
- Design hero with a strong content hierarchy, readable type, responsive wrapping, purposeful product representation, real CTA and natural mobile composition.
- Each major section gets clear question/answer hierarchy. Reuse shared tokens/components consistently but not identical card layouts everywhere. Sections should not rely on invented metrics or fake screenshot content.
- Respect image aspect ratio, alt text and licensing. If actual screenshot unavailable, show a clearly labeled concept rather than representing illustration as product functionality.
- Motion should clarify scroll or interaction meaning; support `prefers-reduced-motion`. Avoid inaccessible scroll hijacking or continuous decorative loops.
- Working nav/CTA state, meaningful copy, footer, metadata, semantic landmarks and accessibility matter more than extra glossy mock visuals.
- When "build" is explicit, finish implementation and validation without pausing for art direction approval, unless the user explicitly asks to compare options first.

## Acceptance gate

Actual browser at 360/390/768/1024/1440/1920 when available; no unwanted horizontal overflow, clipping or huge dead zones; real links/actions; no console errors; keyboard/focus and reduced motion; font contrast; hero answers product in five seconds; full narrative stays clear on mobile. Run an appropriate build/test command for the target stack. Record unrun gates NOT TESTED.

## Routing regression examples (not product-specific)

"Build a standalone SaaS landing page; here is the existing product URL" → BUILD website in an isolated project, not SEO, Gutenberg or changing the existing live product page. "Write Gutenberg product copy and Rank Math metadata" → content task, not website. "Review this landing screenshot" → REVIEW, not new code unless requested.
