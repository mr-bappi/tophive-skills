# Intent router — artifact-first decisions

## Classify without hijacking the deliverable

Priority: user's current explicit request > approved prior direction > target repository contract > examples/reference wording. Detect **mode** and **domain** separately.

- BUILD: "create/build/design a [landing page/dashboard/app]", "make it working", "implement this reference", "one prompt" → finish the specified artifact in the current task when tools permit. Designing a site is not the same as writing a product description or editing an existing published URL.
- EXPLORE: "concepts/options/directions/which direction" → 2–3 visually distinct possibilities with meaningful differences in buyer story, layout, typography and demo, then recommend one. Do not fake a finished implementation.
- REVIEW: "review/audit/rate" → evidence-led observations and ranked fixes; do not edit unless separately requested.
- REFINE: "fix padding/align/spacing", "make it 1:1" → inspect old source first, preserve accepted art direction, compare after repair. Change only the requested area.
- CONTENT/SEO: explicitly requesting Gutenberg blocks, Rank Math, SEO description/meta title → honor that workflow; this skill must not replace it with a landing page.
- An attached reference screenshot is a design target only where authorized; never promise a 1:1 result without verifying side-by-side details.

## Short or ambiguous project prompts

For a short new BUILD prompt, load `SHORT-PROMPT-INTELLIGENCE.md` before art direction: identify the product from user-approved context, actual accessible repo/docs and reliable sources; distinguish evidence, category inference and illustrative content. **No evidence that a named project is a specific product** is not permission to assign it an arbitrary category. Ask one essential product-job question only if correctness otherwise cannot be established; use reversible defaults for ordinary design decisions.

## BUILD requires an artifact, not an intermediate approval

For user intent "build me a complete landing page" do not stop at art-direction proposals; evaluate several approaches privately and execute the strongest defensible option, documenting assumptions. An established approved direction is locked. Explicit "show three options first" remains EXPLORE, not BUILD.

When no filesystem/browser tools are accessible, deliver an honest in-chat implementation/spec or suitable code rather than pretending to have built on disk. Never ask questions merely because branding is broad; choose coherent reversible defaults. Seek input only for critical factual/authorization blockers (e.g. missing required data, private credentials, production action).

## Source evidence gate

Classify proposed factual statements: VERIFIED by actual source; USER-APPROVED; ILLUSTRATIVE demo-only; UNKNOWN/TBD. Never make invented measurements, capabilities, prices, security/compliance claims or reviews look verified. User's target project's AGENTS.md wins. Respect tool availability, prior changes, locked production and "local only" constraints.

## Output acceptance

Before responding ask: Did we deliver what user requested (actual working code vs visual directions vs audit)? Was its domain correct (marketing site vs operational app)? Is the implementation accessible and scoped? If not, do not mark task complete.
