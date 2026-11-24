# Composition Intelligence — architecture before decoration

For a new website, do this before setting colors or choosing fonts. This is a decision engine, not a fixed template library. Respect existing brands, real content, accessibility and product truth before novelty.

## 1 — Information job and composition territory

Write a five-line PRIVATE composition brief:
- Visitor arrival: what concrete question or decision must be answered in five seconds?
- Proof: what authentic artifact, action or reading experience can answer it?
- Consumption: scan, browse, compare, read deeply, explore spatially or operate?
- Constraints: content length, asset fidelity, viewport, accessibility, performance and stack.
- Anti-pattern: which convenient composition would erase this product's identity?

Choose a primary territory from the *job*, never from industry stereotypes:
- **Typographic thesis:** argument/content itself is the artifact; hierarchy, interruption and line lengths carry story.
- **Object stage:** one genuine physical/digital object dominates; context and details orbit it.
- **Index and exploration:** many equally credible entries, with navigation, labels, search or filters as the protagonist.
- **Interaction instrument:** the user's manipulable mechanism, cause/effect and state are the visual signature.
- **Evidence-first technical:** architecture, timeline, audit trail or product UI starts the argument, not a vague claim.
- **Sequential narrative:** revelation across purposeful scroll states; each state adds information.
- **Comparison field:** meaningful alternatives presented in a decision-support structure.
- **Reading room:** content discovery followed by comfortable sustained reading; ornament yields to type.
- **Operational workspace:** dashboard layout is dictated by primary jobs, data shape and frequency.

These are compositional *territories*, not reusable page skeletons. Two brands may legitimately share territory yet differ in reading path and topology.

## 2 — Generate and reject three silent alternatives

Before implementation propose three internal candidates with meaningfully different:
1. **Attention route:** where does the eye land first, second, third? (diagonal, centered, edge-led, serpentine, modular)
2. **Spatial topology:** one field, split, sidebar index, overlapping zones, staggered modules, nested framed stage or full-bleed canvas.
3. **Proof placement:** first screen, embedded in headline, progressive reveal, browseable collection or interactive control.
4. **Section grammar:** unique question → content density → representation → next action, not repetitive eyebrow/headline/cards/CTA.
5. **Responsive transformation:** meaning retained at 390px; do not simply stack desktop split and keep everything oversized.

Reject any candidate if (a) a logo/color swap makes it interchangeable with another product, (b) proof is decorative or fabricated, (c) it harms the user's task, (d) it relies on fake/low-legibility screenshots, (e) it cannot adapt to mobile/reduced motion. Select one on user-value and craft, not eccentricity.

## 2A — Creative selection: compare *outcomes*, not visual fashion

The first coherent idea is a **candidate**, never proof of the best result. For the same verified brief, construct three short internal routes that genuinely differ in **visitor journey + proof representation**, not only typography, color or hero split. For each route record: the user's first five-second understanding; principal proof artifact; reading/browsing/action journey; strongest visual decision; mobile adaptation; and biggest risk. Do not sketch three fully coded websites or ask for a new approval in direct BUILD mode.

Use a **comparative veto**, not a fabricated numeric score:
- **Relevance:** Which candidate shows the actual subject, job, content or product evidence most unmistakably? Is any beauty disconnected from utility?
- **Editorial/functional clarity:** Can someone discover, read, compare or act without deciphering the composition? Does the page have a true destination beyond decorative cards?
- **Specificity and coherence:** Which direction has a memorable, ownable visual or interaction logic sustained across the full page without excessive repetition?
- **Feasibility:** Can imagery, fonts, data and interactions be implemented honestly, responsively and within the available stack? Does it work with reduced motion or no JS when relevant?

Reject any candidate whose attraction depends on imaginary proof, inaccessible typography, repeated placeholder imagery, decorative-only controls, unjustified visual complexity or resemblance to an unrelated brand. Select the strongest **defensible tradeoff**, not automatically the loudest, most animated or most editorial option. A restrained/static layout may win. If two candidates tie, prefer the one that explains the real user job with less unnecessary complexity.

## 3 — Grid Ruler Studio, not a 12-column mandate

Define a grid per surface from constraints:
- Canvas: outer edge, reading measure, safe area, gutters, inner grid, intentional breaks.
- Relationships: align baseline, image edge, label, control and focal point; annotate why each breakpoint changes the information flow.
- Dynamic units: account for longest real heading, product screenshot readability and content density.
- Primary composition may use 3, 5, 6, 8, 12 or nonuniform tracks as dictated by content. Never default to the same max-width/card dimensions across unrelated work.
- For screen UI, prioritize actual 14px+ legibility where possible; avoid shrinking dense demos until their labels are fiction. Offer separate detail/zoom view.

Use the portable COMPOSITION-ATLAS.html for topological studies (not templates). Its diagrams intentionally contain NO production-brand identity. Do not copy its dummy layouts unchanged.

## 4 — Section topology contract

For every proposed section, require four answered facts:
- Different question: what does this add that prior content did not?
- Unique representation: text, annotation, actual product UI, object, index, comparison, illustrated explanation or live state.
- Interaction: if any, how does it change comprehension or support a task?
- Exit logic: why should the next section follow?

If two adjacent sections both follow label → oversized headline → short body → equal cards, merge or change a structural axis. Repetition is valid only for content navigation, true comparable entities or deliberate publication rhythm.

## 5 — Layout collision test before coding

Compare candidate with known unrelated outputs when genuinely accessible; otherwise check canonical anti-patterns: left-copy/right-image hero, 3x equal features, numbered steps, full-width colored CTA, gratuitous uppercased labels and FAQs by default. None is forbidden. An entire page composed of them without product-specific rationale must be redesigned.

Structural delta must affect **at least two** of narrative route, section order, dominant object, grid topology, proof mechanism or interaction behavior. Token or font replacement alone does not qualify. Do not force novelty on an approved existing design system.

## 6 — The design system is the RESULT

After choosing architecture, derive typography roles, palette/material, shape language, breakpoints, movement and components from that route. Never first select a trendy palette and then attach arbitrary section types. Verify at mobile and wide desktop after rendering, not only by reading CSS.
