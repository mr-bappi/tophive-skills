# Motion Intelligence — product-specific, purposeful interaction

Load for website BUILD and interaction-heavy product UI. Motion is an expression of the product's actual behavior, **not** a universal fade-in/scroll-effects checklist. Honor approved brand motion tokens and reduced-motion settings.

## Adaptive motion decision — required assessment, optional animation
Before implementing a new website, independently decide whether motion would improve its particular story, usability or visual identity. **No animation, scroll effect, entry reveal, parallax, signature object or library is required by default.** Do not equate "premium" with more animation. The AI, not a site-category preset, makes the final creative call.

Consider the user's explicit brief and approved direction, the page's purpose, audience, reading density, affordances, product demonstration, brand tone, device capabilities, performance constraints and motion sensitivity. Choose a defensible direction, not a prescribed number of effects:
- **STATIC:** intentional stillness; instant content and stable composition are the experience.
- **QUIET:** only purposeful feedback or occasional gentle transitions; scroll may stay entirely static.
- **EXPRESSIVE:** selected compositional, product-specific or editorial movements serve the narrative; vary motion language by section rather than repeating generic reveal effects.
- **IMMERSIVE:** genuinely justified scroll-linked storytelling, spatial transitions or interactive scenes; higher engineering, fallback and QA burden.

These are decision labels, **not rules based on industry**. A museum may warrant stillness; a financial interface may benefit from a carefully animated state change. On REFINE, preserve an approved motion direction unless the user requests otherwise. Make the decision in an internal motion brief; share the rationale succinctly when relevant. A deliberate STATIC selection must be accepted as a successful design outcome, not failed because an animation counter is zero.

If motion is chosen, specify the precise trigger → object → transformation → narrative/functional purpose → resting state → reduced-motion equivalent. Scroll effects may include progressive text or image transitions, spatial continuity or section choreography **only when they improve the result**; a generic repeated fade is not a substitute for art direction. Select native CSS/IntersectionObserver/GSAP by the actual orchestration requirements, never by trend or mandate. The implemented behavior must be observed in a browser before claiming it works.

## Motion direction brief (internally before coding)
- User task and context; target platform/performance constraints.
- **Functional motions:** show interaction state, response, affordance, spatial continuity (highest priority).
- **Signature motion:** one specific visual object or metaphor justified by the product and story, if useful and technically feasible.
- **Narrative motions:** limited scroll-entry choreography only if it improves wayfinding, no obstruction to reading.
- **Atmosphere:** optional and never vital for meaning; many dashboards, high-stakes forms and reading surfaces should have minimal ambient movement.
- Animation budget: list meaningful animated objects, trigger, state, duration, cancellation, reduced-motion alternate, test plan. A planned *static* choice is valid if justified.

## Trigger and behavior contract
| Trigger | Good use | Avoid |
|---|---|---|
| Initial entry | short finite hero object reveal with stable final position | obscuring above-the-fold content pending JS |
| Hover | lightweight affordance on genuine clickable media | hover-only interaction or wobbling paragraphs |
| Focus-visible | analogous state for keyboard | pointer-only affordance |
| Click/select | actual stage, tab, card, progress, overlay response | motion that falsely implies an executed backend action |
| Scroll | one-time reveal, restrained sequencing | scroll hijack, parallax required for comprehension |
| Data update | maintain object continuity; loading/success/invalid feedback | invented counters, infinite skeletons |
| Reduced motion | immediate or subdued state change preserving meaning | hidden/blank content when motion is disabled |

## Signature object guidelines
Start with something authentic: an editorial illustration's frame, a developer tool's command step, a collaboration handoff, a booking selection, a physical publication's page turn. One memorable but relevant object is better than fifty moving decorations.
- **Hero mark:** finite intro rotation/scale or brief interactive response; resting state stable, not constant spin.
- **Illustration:** reveal layer(s) without sacrificing illustration meaning; depth/parallax only if subtle and accessible.
- **Connected diagram:** animate relationship only when a real stage changes.
- **Media/card:** hover/focus crop or arrow feedback; touch must reveal same function through tap.
- **Dashboard:** prioritize state transitions, toasts, inline validation and reordering feedback; minimal theatrical effects.

## Implementation defaults (adapt, never hardcode as brand)
- Short interaction 120–220ms; meaningful state 180–350ms; editorial reveal 350–700ms. Timing depends on distance, density and input.
- Prefer transform/opacity rather than layout-affecting left/top/width; no unnecessary heavy libraries for basic transitions.
- Use CSS transitions/keyframes for simple cases. JS only for real state and orchestration. No unbounded setInterval/rAF visual loop.
- Respect `prefers-reduced-motion: reduce` on initial render **and changes**. Do not rely solely on applying classes after delayed JS.
- Do not animate headings into invisibility when no JS runs. Default content visible; enhancement opt-in only.
- Avoid repeatedly restarting scroll animations; do not autoscroll or force focus without user intent.
- Transforms must not change hit target geometry or clip content. Reserve sizes, test mobile 360–390 and 200% zoom.
- Keep performance reasonable on low-power devices. Limit simultaneous blur/shadow/filter/multi-layer animations.
- Pausable control required for substantial automated/looped activity; otherwise remove loop.
- Keyboard hover parity where appropriate and adequate touch interaction.

## Acceptance and reporting
Document each significant object's **trigger → visual feedback → accessibility alternative → actual observation**. When browser tools exist, test baseline static state, active interaction, reduced-motion state and at least one touch viewport; verify no overflow/layout shift and no console errors. If screenshots only show static output, motion itself is **NOT TESTED**. Do not claim motion is tested because keyframes exist.
