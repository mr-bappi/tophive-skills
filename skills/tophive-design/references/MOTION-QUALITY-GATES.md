# Motion & Typography Quality Gates — executable evidence contract

Motion and type are first-class design decisions. They are not mandatory flashy decorations.

| Gate | PASS evidence | FAIL example | Honest boundary |
|---|---|---|---|
| MT0 adaptive direction | Evidence-informed STATIC/QUIET/EXPRESSIVE/IMMERSIVE decision, consistent with product brief; no forced effect count | "Premium requires scroll reveals" or copied motion preset regardless of product | A deliberate STATIC result is PASS without animated elements; rationale can remain internal |
| MT1 meaningful motion | Named trigger/object/feedback tied to user or brand job, observed in runtime | purely generic stagger/fade copied everywhere | static-only project may mark deliberate NOT APPLICABLE with rationale |
| MT2 interaction accessibility | keyboard/touch equivalent for meaningful transitions, operable controls | hover-only controls, focus trapped | automated checks don't replace real assistive tech |
| MT3 reduced motion | same content and state at `prefers-reduced-motion: reduce`; transitions off/subdued | invisible content or infinite loop | test two modes if browser available |
| MT4 stability/performance | no new root overflow, layout shift, JS errors, loading regression | transforms clip CTA, parallax hijacks scroll | FPS/perf needs instruments, otherwise NOT TESTED |
| MT5 typography personality | distinct roles, evidence-led font stack, brand/job fit | unrelated brands all same geometric sans+italic-serif regardless of product | existing shared brand may intentionally repeat |
| MT6 fallback/readability | real mobile/desktop wrap, keyboard focus, zoom and font fallback | 8px essential copy, clipped headlines, unlicensed font | cross-browser comparisons need actual browsers |

## Practical browser proof
- First check MT0: decide whether motion serves the design; never fail a deliberate static experience just because nothing animates.
- **Only if motion is implemented:** screenshot keyframe state at load, then interact and capture changed state; inspect two computed style samples or screenshot frames to verify the object actually changes. For scroll-linked work, capture beginning, mid-scroll, end-scroll and reverse if applicable.
- Check hover and focus-visible/tap behavior where relevant.
- Emulate reduced motion and verify computed transition/animation duration is suppressed (or immediately settles) and content remains visible.
- Validate at mobile, tablet, desktop, keyboard and browser zoom. No horizontal overflow or console errors.
- If libraries are unavailable, use DOM/CSS and manual checks but label animation timing/performance **NOT TESTED**, not PASS.
- Never score a site lower solely for deliberate minimal motion in operational, reading, accessibility-sensitive or existing-brand applications.
- Treat basic `transition: color` as an affordance, NOT proof of a full product-specific signature motion.
