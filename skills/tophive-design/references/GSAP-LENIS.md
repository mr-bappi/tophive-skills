# GSAP + Lenis — scroll choreography without scroll hijack

Load only for justified advanced sequencing, not ordinary fades. Read `MOTION-INTELLIGENCE.md` and `MOTION-QUALITY-GATES.md` first. Check installed GSAP, ScrollTrigger, @gsap/react and `lenis` versions; don't assume deprecated package names or plugins.

## Choreography design
Storyboard each scene with entry/exit positions, object count, trigger (time/scroll/input), start/end states, pin duration, overlay layers, semantic reading order, asset budgets and what remains when JS/WebGL is unavailable. Hero copy and controls must remain visible when animation fails. Design meaningful signature motion, not endless floating shapes.

## Implementation responsibilities
- Prefer `transform`/`opacity` for smoothness. Keep transform/opacity ownership clear: don't have CSS and GSAP fight for the same property.
- In React use `useGSAP` or `gsap.context` scoped to a ref; revert/kill animations and ScrollTriggers on unmount/route change, and clean event listeners.
- Sync ScrollTrigger refresh to layout/font/image/media changes. Do not pin inside incompatible overflow/transform ancestors blindly.
- If Lenis is essential, have exactly one scroll loop. When GSAP ticker drives Lenis, time passed by GSAP is **seconds** and Lenis `raf` expects **milliseconds**. Don't simultaneously use Lenis autoRaf and custom RAF. Unsubscribe scroll handlers, remove ticker and destroy Lenis on cleanup.
- Preserve native anchor/focus navigation and browser history; scroll locking for dialogs must not break keyboard, touch or nested scrollers. Native scroll fallback is the default for reduced motion, coarse/touch devices when appropriate and known unsupported contexts.
- Motion work must provide pause/stop when it loops meaningfully or user action requires it. No essential action depends on hover or on scroll position.

## Integration sketch (adapt to actual docs)
```js
const lenis = new Lenis({ autoRaf: false });
const onScroll = () => ScrollTrigger.update();
const tick = (seconds) => lenis.raf(seconds * 1000);
lenis.on('scroll', onScroll);
gsap.ticker.add(tick);
// teardown
gsap.ticker.remove(tick);
lenis.off('scroll', onScroll);
lenis.destroy();
```
This sketch does NOT include registration, layout refresh, reduced motion, conditional initialization or React lifecycle; those must be handled in working code.

## Motion acceptance
Capture actual initial, active and final states plus **reduced-motion**, fast scroll, reverse scroll, browser back, resize/orientation, touch, low-power and no-JS alternatives. Verify no stuck pins/blank sections, focus loss, keyboard trap, scroll lock, clipped scene, duplicated RAF or runtime errors. Static images alone are not motion proof.

Canonical docs: https://gsap.com/docs/v3/GSAP/gsap.context()/ and https://github.com/darkroomengineering/lenis (verify current API before coding).
