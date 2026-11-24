# Short-Prompt Intelligence Engine — evidence-led autonomous design briefs

**Use for:** a new BUILD/EXPLORE request with sparse product/brand details, for example "build a landing page for my project", "make a modern site for [product]", or "design a premium CRM". Never use this as authorization to overwrite an existing project, rebrand an approved identity, publish, or deploy. The user's explicit request and approved decisions still win.

**Goal:** turn a few trustworthy facts into the *smallest sufficient internal design brief* and a product-specific deliverable. Autonomy is not license to invent product facts; the engine must be decisive about **design**, calibrated about **business evidence**, and cautious about destructive or production changes.

## 1. Resolve identity and evidence in priority order

Perform a targeted, bounded search rather than a repo-wide or web-wide fishing expedition:

1. **Current explicit request**: target artifact, named product, user words, references, desired platform, permitted scope, aesthetic constraints.
2. **Accessible approved project context**: user-provided specs and prior approved decisions; target repo AGENTS.md / README / PRD / design tokens / screenshots / real code and assets, *only if accessible and pertinent*. Respect locked design.
3. **External product evidence, if browsing is available and useful**: official product description/docs before third-party mentions; verify the exact name and domain so a namesake is not mistaken for the user's private product. External public pages do not override a user's own project's confirmed facts.
4. **Stable category knowledge**: product category and buyer-job conventions may guide reversible page structure, never substitute for real product claims.
5. **Illustrative concept**: clearly flag hypothetical content and demo behavior; keep unique product features, prices, reviews, logos, metrics, integrations, security/compliance claims, customer lists and screenshots unknown until evidenced.

**Source tags per important decision or claim:** USER-CONFIRMED, SOURCE-VERIFIED, CATEGORY-INFERRED, CONCEPT/DEMO, UNKNOWN. A plausible product fact is not verified merely because it sounds conventional. Do not imply that private tools, files, accounts or web pages were accessed if they were not.

**Name collision check:** If a named brand matches multiple products, keep identity UNKNOWN and do not import the wrong site's brand, features or assets. An inaccessible localhost URL is not proof of what a page contains.

## 2. Five-question internal brief, no form by default

Record internally, in no more than a few lines:

| Slot | Decision | Source / uncertainty |
| --- | --- | --- |
| Who | Primary visitor / decision-maker and buying or usage context | Evidence tag |
| Why | One specific problem, alternative and desired outcome | Evidence tag |
| What | Actual product/job and one authentic proof object | Evidence tag |
| Next | A truthful primary CTA and its destination/availability | Evidence tag |
| Feel | Appropriate tone, typography, palette, composition, image direction and motion rationale | Evidence tag |

If a specific target audience is not evidenced, choose a *provisional audience hypothesis* from the known category and keep claims generic. Avoid making it a factual assertion about the real product.

**Confidence states for the brief** (not invented numeric probabilities):
- **Grounded**: product/category + primary job + target action evidenced → build product-specific narrative.
- **Provisional**: category and primary job reasonably inferred, but positioning/branding unconfirmed → build a reversible, labeled concept; do not assert competitive differentiation, customers or performance.
- **Unresolved**: only a label/name with no verifiable product type or user job → search accessible context first. If still unresolved and a correct product-specific build depends on it, ask **one essential question**, e.g. "What does XYZ do?". Don't silently transform a private project name into an unrelated SaaS.
- **Blocked**: essential permission, source, system access or legally sensitive factual assertion missing → stop that action, not necessarily the entire design; complete only truthful safe parts and report unverified items.

Ask multiple questions only if several independent facts are truly necessary and no useful reversible work is possible. For design choices (colors/layout/typography), infer sensible defaults rather than requiring an approval interview. If the user requests a draft/provisional experiment regardless of product identity, make one clearly labeled as a concept.

## 3. Compete internally on *product story*, not template recoloring

For a new BUILD with sufficient context, compare **three different page narratives privately**: (a) mechanism/proof first, (b) audience/use-case first, (c) editorial/emotional benefit first. These are candidate strategies, **not mandatory page templates**; add alternatives when the domain requires them (e.g. booking/gallery/commerce).

Score qualitatively on:
- **Relevance**: first viewport states what product does for whom, with a concrete outcome.
- **Proof**: the hero/near-hero can show a genuine source-backed product artifact or an explicitly labeled demo.
- **Conversion**: useful next action exists and its destination is real; if unknown use honest "Request details"/"Explore concept", not fake signup.
- **Distinctiveness**: content, composition, font roles, visual assets and interaction flow derive from the job rather than a recycled hero+three-cards package.
- **Feasibility**: assets/data/stack exist, mobile and reduced-motion work, and claims are supportable.

Reject any candidate requiring fabricated features, screenshots, reviews, revenue, efficacy, compliance or integrations. Prefer the best defensible candidate, not the most dramatic. In EXPLORE mode present meaningfully different options only if requested.

## 4. Convert strategy to an implementable first-pass brief

Before UI code, specify internally:
- **One-sentence value proposition** (evidence-backed or clearly labeled proposed), primary visitor, decisive CTA.
- **Visitor question sequence** and only the sections that answer a new question. Typical roles (not a fixed section list): first five-second answer, product mechanism, tangible proof/interaction, fitting use cases, justified trust, next step.
- **Design direction**: typographic roles, palette with accessible contrast, image/material strategy, asymmetric or restrained grid where justified, rhythm/spacing, interaction/motion signature and why they fit this product. Reuse approved identity without stylistic drift.
- **Real artifact/proof**: project screenshot, workflow, visual product demo, functional calculator or honest static diagram. If no evidence/working backend exists, no fictional KPI/dashboard represented as production.
- **Interaction contract**: navigation, primary CTA, one meaningful transition, mobile fallback, default/hover/focus/loading/empty/error/filled/reduced-motion states as applicable.
- **Technical fit**: existing project stack wins; if independent greenfield, choose the smallest suitable technology rather than React/3D/GSAP by reflex. Do not replace project structure without authorization.
- **Risk contract**: header and scroll ownership, sticky/overlay state, image availability, responsiveness and output verification; follow `UX-RELIABILITY-REGRESSIONS.md`.

## 5. Delivery behavior for terse BUILD requests

1. Read the request as **BUILD**, not permission to give only a prompt/spec, unless the user requested planning.
2. Recover relevant context with targeted accessible tools; if access unavailable, make limitations explicit.
3. Resolve brief confidence. Ask a single blocking identity/job question only when necessary; otherwise proceed with reversible design assumptions.
4. Pick one internally evaluated art direction; implement a real working artifact using available authorized tools. Do not require the user to pick among three mockups.
5. Run private *build → browser capture → critique → repair → retest* cycles before handoff. The first delivered artifact should be reviewed, not the initial screenshot. Apply U01–U15 relevant gates; mark inaccessible checks NOT TESTED.
6. In the handoff, summarize what was built and **material** assumptions in 1–3 short sentences; disclose fictional/demo content and untested limitations. Never present hypotheticals as product facts or claim superior one-shot outcomes without real A/B tests.

### Conditional examples (decision tests, not approved creative templates)

| Prompt | Correct behavior | Incorrect behavior |
| --- | --- | --- |
| "Build a landing page for my XYZ app" and product context is available | Retrieve approved source, preserve brand, implement product-specific narrative | Invent XYZ as an AI agent, reuse generic SaaS claims |
| "Premium landing page for a task scheduling SaaS" with no repo | Category-known **provisional** direction, working concept/demo with honest placeholder CTAs | Pretend it has integrations, testimonials or paid subscriptions |
| "Build for Obsidian" with no owner/context | Resolve what exactly is meant and whether the user means an existing brand; do not copy trademarks/assets blindly | Assume this is the famous product or an unrelated gemstone shop |
| "Build for Project Quill" with no context/identity and no source | Ask one question about its purpose, unless the user explicitly wants a hypothetical concept | Invent a fintech product and claim verification |
| "Use our existing brand tokens and product repo" | Inspect only accessible targets and reuse locked choices; say if inaccessible | Generate an unrelated new design system |
| "Show three directions for this idea" | EXPLORE and compare real compositional differences | Implement one irreversible direction without permission |
| "Build a medical claims website" without clinical evidence | Make neutral, truthful informational concept and leave claims TBD | Fabricate efficacy, approvals, experts, patient outcomes |

## 6. First-pass evaluation and learning

The local Skill package can verify these instructions exist; it cannot prove an AI will obey them. Evaluate identical terse prompts **with and without** the candidate Skill under matched model/tool budget; blind reviewers assess product fit, factuality, original art direction, conversion clarity, usability and tested implementation. Track question frequency, wrong-product assumptions, fictional claims presented as facts, first-delivery defects and correction turns. Real scores are NOT TESTED until trials have run.

**Transfer rule:** generalize repeated failures as decision or verification invariants, not project-specific palettes/components or branded examples. This reference must remain portable.
