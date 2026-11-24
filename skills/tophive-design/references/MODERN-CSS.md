# Modern CSS — progressive, measured, scoped

Use CSS as the primary layout, typography and simple-interaction engine. Don't treat experimental browser features as universal.

**Required source architecture:** For all frontend builds with custom styling, first apply `MODULAR-CSS-ARCHITECTURE.md` (owner-scoped source modules, token ownership, build/check contract and regression). The CSS techniques below do not justify an unstructured all-in-one stylesheet.

## Composition foundations
- Use content-first semantic markup, container max-width with fluid gutters, Grid for overall layout and Flexbox for one-dimensional alignment; prefer responsive `minmax()`, `clamp()`, `min()`/`max()` and logical properties over brittle hardcoded breakpoints.
- Use `@container` for component responsiveness (give its parent `container: workspace / inline-size` when using a named workspace query), `subgrid` only when actual column/row coordination benefits, `:has()` only for meaningful parent state.
- Define design tokens once: type roles, spacing scale, elevations, borders, motion durations and focus ring; scope feature CSS under component ownership to avoid global selector collisions.
- Optimize actual type metrics and line length; allow language growth, 200% zoom, safe-area insets and forced colors.

## Progressive enhancement pattern
```css
.workspace { container: workspace / inline-size; }
.panel-grid { display: grid; grid-template-columns: 1fr; gap: clamp(1rem, 2vw, 1.5rem); }
@container workspace (min-width: 54rem) {
  .panel-grid { grid-template-columns: minmax(0, 1.5fr) minmax(18rem, 1fr); }
}
.motion-object { opacity: 1; transform: none; }
@media (prefers-reduced-motion: no-preference) {
  .motion-object[data-ready="true"] { transition: transform 220ms ease; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; }
}
```
Never hide vital content initially awaiting JavaScript. Feature-detect newer APIs with `@supports`; keep a readable baseline.

## Appropriate advanced APIs
- View Transitions: enhance route/detail continuity, fall back to immediate navigation when unsupported; don't block navigation on animation.
- Scroll-driven Animations: use for decorative, nonessential signals with fallback; avoid concealing reading content or tying accessibility to scroll ranges.
- Native CSS nesting, `color-mix()`, custom properties: use only as supported by the deployment baseline; verify both intended output and fallback.
- `content-visibility`: apply carefully to far-offscreen blocks; avoid unexpected find-in-page/accessibility behavior and reserve intrinsic size to minimize layout jumps.

## Acceptance
Test 360/390/768/1024/1440 (1920 when relevant), touch, zoom, RTL/long labels when relevant, dark/light/forced-colors, keyboard focus, reduced motion, overflow and no-JS baseline where practical. Log PASS/FAIL/NOT TESTED with actual browser evidence.
