# Typography Intelligence — product-specific type selection and validation

Load for a new brand/marketing design or typography-heavy application. This is a **selection method**, not a universal requirement to pair a bold geometric sans with italic serif. Existing brand fonts and tokens override new exploration.

## Font roles before specific families
1. **Publication/readability:** text-centered products may use editorial serif for display AND sustained reading; body/utility roles follow reading density.
2. **Precise technical:** modern sans for interface; mono ONLY for code, IDs and values where alignment matters.
3. **Expressive creative:** distinctive display behavior chosen for brand personality, balanced by functional body.
4. **Operational dashboard:** efficient body/UI hierarchy, stable metrics, legible data, tabular numerals; expressive title used sparingly.
5. **Public service/high-stakes:** readable accessible forms and content; legibility and clarity outrank style.
These are directional questions, not category lock-ins. An authentic brand may depart from examples.

## Selection matrix
For candidate font/fallback assess: tone, small-size readability, x-height, width, character coverage (including Bangla if requested), numeral legibility, real license/redistribution, variable/static availability, network/privacy cost, layout shift, OS support and whether an available font is actually usable in this runtime.

Do not use one generic font combination across unrelated products by habit. Also do not use unusual typography merely for novelty. If no verified hosted or licensed font exists, choose local fallback stacks and disclose OS-specific variation. Never bundle third-party font files without explicit rights.

## Type system build
- Explicit roles: display / H2 / H3 / reading body / UI body / labels / code/data.
- Verify real `font-family` and computed `font-size`/line-height across browser widths, not just CSS declarations.
- Fit headline breaks at 360,390,768,1024,1440,1920, including longest realistic word; avoid overflow or clipping.
- Reading measure (~45–75 characters where appropriate), logical line-height and typographic color. Distinguish footnotes vs actions.
- Tiny uppercase labels are never the only route to critical information; technical UI labels still need readable contrast and zoom.
- Correct responsive optical tracking, font-weight and italic metrics, especially different fallback fonts. Avoid fake bold/italic when poor rendering.
- Evaluate digits, currency, identifiers, punctuation, quotes, hyphenation and international writing systems as relevant.
- Stable font loading strategy; avoid flash/layout shifts if loading remote fonts is authorized.
- Record why display/body pairing fits THIS product, and what alternatives were rejected due to content or reliability.

## Blind diversity checks
Compare unrelated designs on hierarchy, genre, display behavior, reading structure, type interaction with geometry. A different font file while using the same hero silhouette and size is not meaningful variation. Do not force differences for the SAME design system/brand.

## Typography QA
Inspect screenshots desktop/mobile and 200% browser zoom when available; check rendered font support, graceful fallback, body text readability, semantic heading order, reading dialog styles, input/button label sizes and contrast. Report actual tested browsers and remaining compatibility unknowns.
