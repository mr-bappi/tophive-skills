# TOPHIVE v2 — Visual principles

This is a compact portable synopsis of the canonical design library, **not** a replacement for its full Markdown rules. Each product must express its own personality rather than reproduce the teaching pages.

**Route scope:** This document chiefly illustrates **marketing website** composition. Hero typography, expressive serif accents, buyer-journey sections, 12/8/4 Grid Ruler demonstrations, bento patterns and large whitespace are **not default rules for admin dashboards**. For application UI load `UI-REVIEW.md` first and follow the product's real component system; only legibility, contrast and consistent spacing principles are shared.

## Typography

- Use a distinct display role, section-heading role, content-heading role, body role and utility/metadata role.
- Prefer a confident contemporary sans for functional text; an expressive serif accent or monospaced label only when that pairing improves the product's character.
- Suggested **starting** values (not mandatory project tokens): hero `clamp(2.75rem, 6.4vw, 6.5rem)`, H2 `clamp(2rem, 4vw, 3.75rem)`, H3 `clamp(1.5rem, 3vw, 2.25rem)`, body `1rem`, line-height `1.65`. Real font metrics and mobile wrapping determine final scale.
- Short readable measures for hero support; ~55–72 characters for longer paragraphs where appropriate.
- Maintain legibility: utility labels are secondary, not a place for tiny instructions.

## Grid and spatial rhythm

- Work from a consistent container and measured gutters, but change **composition**, not arbitrary styles, when a new section answers a new buyer question.
- Grid Ruler Studio teaches 12 / 8 / 4-column relationships at wide/tablet/mobile canvas widths; those are **teaching breakpoints**, not mandatory global templates.
- Split copy + genuine product preview when an explanation needs visual proof. Editorial asymmetry when one idea is dominant. Full-canvas real workflow for meaningful complex demonstration. Bento only when feature information density genuinely varies.
- Group related elements tightly; separate major concepts with more space. Avoid accidental tall dead zones and repeating three-card rows.
- Suggested token scale: `4, 8, 12, 16, 24, 32, 48, 64, 96px` and responsive section padding. Adapt to existing product tokens rather than creating duplicates.

## Product-led storytelling

- Within five seconds: what is this, who benefits, why it matters, what comes next.
- Build one visual focal point at a time. Sequence: **promise → mechanism → actual demonstration → trustworthy evidence → next action**.
- A UI mockup must demonstrate a real or clearly labeled conceptual mechanism. No decorative fake dashboards, graphs, testimonials, security certification or numeric success claims.
- Place captions and explanations near their relevant visuals. Buttons require meaningful destinations or visibly illustrative/demo-only treatment.

## Color, components and motion

- Starting direction: light/neutral canvas, readable dark typography, restrained product accent, consistent borders/radii and clear focus.
- Tokens for background, ink, muted, border, accent, display/body fonts, container, section gap and component states should live under the target product's ownership.
- Use motion to reveal relationships or transitions; avoid endless decorative loops. Provide keyboard focus, reduced-motion and no-JavaScript fallbacks where appropriate.
- Verify WCAG AA contrast (4.5:1 regular text; 3:1 large text) and responsive keyboard usability in the actual output.

## Reference pages in the master folder (Mac-only)

`examples/01-editorial-launch/` — restrained editorial launch.
`examples/02-cinematic-workspace/` — technical cinematic workspace.
`examples/03-automation-canvas/` — genuine connected workflow inspiration.
`examples/04-typography-spacing/` — pairing, fluid scaling and spacing lab.
`examples/05-layout-hierarchy/` — Grid Ruler Studio, section-to-section narrative anatomy.

Do not assume the links/images exist in the cloud skill. They are available **only** if attached or accessible through authorized tools.
