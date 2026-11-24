# Three.js / React Three Fiber — deliberate spatial experiences

Load for 3D storytelling, configurators and interactive scenes, not to decorate a standard dashboard. Confirm user agent's actual stack, installed Three.js/R3F versions, GPU/browser support and content fallback before code.

## Scene contract
Define purpose of 3D, camera, focal object, color/light/material system, world scale, user controls, gesture/scroll interaction, depth ordering, responsive camera framing and reduced-motion/static fallback. Draw a visual-state storyboard for 390 and 1440 widths before making a giant canvas. A screenshot may be the visual fallback, but must be original/licensed.

## Performance responsibilities
- Budget geometry/triangles, draw calls, texture sizes, devicePixelRatio, video textures and post-processing. Profile the actual browser; avoid arbitrary numeric guarantees.
- Cache/reuse geometry/materials and dispose GPU resources on teardown; don't instantiate a texture per render or make every motion trigger a React rerender.
- Use `frameloop="demand"` when scene changes are event-based, continuous loops only if the artwork needs them. Consider `invalidate()` when external animation changes a demand-render scene.
- Prefer React Three Fiber's lifecycle and Canvas boundaries for a React app; use bare Three.js for minimal standalone project when no React need.
- Server rendering must not instantiate canvas/WebGL; lazy-load client scene and present a meaningful HTML fallback while loading or on unsupported devices.
- Preserve real HTML for navigation, focus, copy, commerce and forms. Canvas interactions require an alternate accessible semantic control path.
- Pause/disconnect observers, pointer handlers, animation loops and textures when hidden/unmounted. Recompute camera/viewport for responsive size without clipping the signature object.

## Spatial UX checks
Test scene/camera at 390, 768, 1440, browser resize, orientation, pointer and touch, keyboard equivalent, loading errors, WebGL context failure and reduced motion. Confirm the main subject stays inside the viewport and no blank hero under slow network.

## Integration risk
GSAP scroll and render loops must have one time owner, with predictable teardown; do not let scroll progress and uncontrolled `useFrame` fight camera position. See `GSAP-LENIS.md` when linked scrolling is genuinely required.

Official guidance: https://r3f.docs.pmnd.rs/advanced/scaling-performance ; https://threejs.org/manual/ (check current docs, don't assume version).
