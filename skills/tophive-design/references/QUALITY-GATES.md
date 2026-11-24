# Quality gates — actual rendering and evidence, not optimism

This is the finish gate for BUILD/REFINE. **Do not declare visually complete merely because source compiles or screenshots exist.** No browser/tool access means a clearly reported NOT TESTED result.

## Required inspection

| Gate | What to verify | Evidence |
|---|---|---|
| G0 Product fidelity | deliverable type and verified features/CTAs are correct | source/brief ledger |
| G1 Layout/responsive | 360, 390, 768, 1024, 1440, 1920 if available; wide/tall; no unintended overflow/clipping | browser viewport evidence |
| G2 Visual craft | legible typography, grid alignment, sensible density, distinct product signature, section rhythm | screenshots & critique |
| G2a Creative decision (new websites) | three materially different internal candidates compared by visitor job, genuine proof and feasibility; chosen first render challenged for full-page coherence, asset roles and type monotony | concise decision record + real rendered critique, never a fabricated AI score |
| G3 Interactions | nav, tabs, filters, buttons and form states; links target real destinations or are labeled demo | actual interaction |
| G4 Accessibility | semantic structure, focus-visible, keyboard access, contrast, reduced motion, target sizes | browser/manual checks; automated audits optional |
| G5 Engineering | framework build/lint/tests, no console/page errors, no brittle global CSS collision, no broken assets | commands/logs |
| G5a Modular CSS source (when custom CSS is authored) | new frontend builds use owner-scoped readable modules, central tokens, no hand-maintained giant stylesheet, deterministic CSS build/import graph and no unlisted/dead style modules; existing edits preserve current approved architecture | `MODULAR-CSS-ARCHITECTURE.md` + file structure + build/check command; missing evidence = NOT TESTED |
| G6 Scope/security | local vs production boundary, no unrelated diffs, no invented proof/data | Git diff/contract review |
| G7 Distinctiveness | new unrelated brands not interchangeable by changing logo/palette; preserve approved brand consistency | independent screenshot/source comparison when available, else NOT TESTED / NOT APPLICABLE |
| G8 Application craft (dashboards only) | one-job screen hierarchy, no repeated header fluff or filler cards, real data-derived insights, connected CRUD/filter journeys | screen ledger, task journey, desktop/mobile screenshots and information-budget veto per `APPLICATION-CRAFT-GATE.md` |
| G8a Application visual craft (dashboards only) | separate visual craftsmanship acceptance: product-specific composition, refined component states, hierarchy, distinctive but usable interface identity and meaningful interaction polish | actual desktop/mobile populated and active-state captures; application visual-craft veto from `APPLICATION-VISUAL-CRAFT.md`, independently reviewed when claiming superiority |
| G10 Sparse-brief product fit | source-backed or explicitly provisional audience, product job, truthful CTA and authentic proof; no invented positioning or namesake confusion | `SHORT-PROMPT-INTELLIGENCE.md` five-slot evidence tags + confidence/ambiguity decision + independent short-prompt evaluation evidence |
| G9 First-pass reliability | explicit scroll ownership, no header/hydration jump, sticky/overlay stability, valid grid/inspector behavior, real image/print assets and zero phantom UI | applicable U01–U15 from `UX-RELIABILITY-REGRESSIONS.md`, measured before/after browser states and project-local regression evidence |

## Loop

Run base tests and inspect screenshots; find the highest-impact issue; identify root CSS/markup/state problem; edit only scoped source; re-render and test regressions. Repeat until blockers resolved or tools/time limit reached. Don't hide failures. For exact-reference requests, compare target/actual side by side at same dimensions and identify deviations; don't claim 1:1 based on text description.

## Acceptance rubric (used by local eval harness)

Score six dimensions 0–5: product_fidelity, visual_craft, ux_functionality, responsive, accessibility, maintainability. A **critical** fabricated claim, wrong mode/artifact, broken primary task or unauthorized production change fails regardless of average. For release candidate aim at >=4/5 in each dimension across multiple independent real tasks; no critical fails. Scores require real generated artifacts and reviewer/browser evidence, not AI self-confidence.

## Reporting

Label each check PASS, FAIL or NOT TESTED. Attach actual artifact path/URL and clear commands/captures when available. Static schema, ZIP, deterministic build and keyword tests prove packaging only—not that an AI used this skill correctly. Real ChatGPT/Codex invocation and actual generated source are independent validation stages.


## Optional executable browser smoke

For authorized local preview pages, if Puppeteer and Chrome are available:

```sh
NODE_PATH=/path/to/node_modules node <skill-root>/scripts/visual-smoke.cjs \
  --url http://127.0.0.1:8765/ --out ./qa/visual-captures
```

Captures six PNGs and `results.json`; exits nonzero for actual unintended horizontal overflow, broken images and page/runtime errors. This **does not** perform a full color contrast, accessible-technology, visual craft or production audit: those remain manual checks or NOT TESTED. If Puppeteer unavailable, the script reports NOT TESTED; never install a dependency without authorization.

For full new-product builds, include MT1–MT6 from `MOTION-QUALITY-GATES.md`. This is a targeted checklist, not a claim that all sites must animate; see deliberate NOT APPLICABLE rationale.
