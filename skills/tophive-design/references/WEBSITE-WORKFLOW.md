# Website design — task contract

## Inputs

Required facts: actual product job, buyer, product/feature boundaries, brand assets, verified CTA and target website scope. Use the user's instructions and accessible repository/docs. Missing facts are **TBD**, not permission to invent them.

A link such as `tophive.dev/products/anylicense/` can inform verified facts. It is **not** a request to update that existing page.

## Creative-direction stage

Unless previously approved, propose **3 materially different** options:

1. Art direction and intended market perception.
2. Hero composition, typography pairing/scale, container/grid approach.
3. Product demonstration format (real screenshot, workflow, interaction, or clearly labeled concept).
4. Section hierarchy and changing layouts.
5. Purposeful micro-interaction/motion and mobile rules.
6. Tradeoffs, accessibility/performance implications, recommendation.

Do **not** deliver a generic SaaS template and re-label its accent color three times. Preserve previously accepted design direction; don't waste cycles re-asking settled questions.

## Build stage

When the user requests a prototype or has approved a direction:

- Build original responsive HTML/CSS/JS in an isolated workspace unless a different stack was authorized.
- Product source/contract wins over illustrative creative examples.
- Real functional nav/CTAs, clear focus-visible and reduced-motion fallbacks.
- Hero, problem/mechanism, product experience, support/proof (only verified), decision/action. Section identities may differ by product.
- Review the actual browser capture before reporting success. Mark tool-inaccessible checks `NOT TESTED`. Don't claim production readiness from a static render.

## AnyLicense regression guard

Input: "Design a brand-new standalone premium AnyLicense SaaS landing page; here is our current product URL."
Expected: **Website design.** First verified facts, then genuinely different art directions (unless approved), page story and eventual standalone prototype.
Forbidden output: Rank Math settings, product SEO description, Gutenberg markup, buyer package for an existing WordPress product page.

Input: "Write an AnyLicense Gutenberg product description and Rank Math metadata."
Expected: **Content/SEO** because that was explicitly requested; this skill must not hijack it into landing-page design.

## Product/source evidence ledger

Before publishing buyer-facing facts, mark each item `VERIFIED`, `APPROVED`, `PROPOSED`, or `TBD`. Don't infer "secure", "certified", "marketplace-ready", "live", SDK support or price from a brand name or concept.
