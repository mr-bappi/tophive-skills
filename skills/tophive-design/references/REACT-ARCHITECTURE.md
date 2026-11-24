# React / Next.js Architecture — real applications, not one-file demos

Only load for React/Next or an authorized new app architecture. Respect existing router and framework versions. Next.js, RSC, React and bundler conventions are version-dependent: inspect package.json and official version-matched docs before writing APIs.

## Boundaries
```
src/
  app/ or routes/           # route entry; shallow composition
  features/<domain>/        # domain components, hooks, api, tests
  components/ui/            # accessible generic primitives
  lib/                      # shared clients, schemas, helpers
  styles/                   # owned tokens, globals and foundations
```
Do not copy this tree over an existing app. No 100-component monolith or giant centralized state file. Group by domain and behavior, not arbitrary UI screenshots.

**CSS ownership is mandatory:** use component/feature CSS Modules, scoped styles, or the established modular styled/utility system. Restrict global CSS to tokens, reset and intentionally shared base styles. Treat any generated CSS as build output, not a source-of-truth monolith. Apply `MODULAR-CSS-ARCHITECTURE.md` before creating new pages/components and preserve the existing project convention on refinements.

## Contracts
1. Model domain types, permissions, CRUD states, URL-backed query params and success/error responses before styling interactions.
2. Keep server data, URL navigation state and local ephemeral UI state distinct. Use a proven query/cache library if already present; optimistic changes must support rollback, retry and conflict handling.
3. Derive computed values; don't duplicate state. Use stable record IDs and predictable keys. Keep props narrow and validate API payloads at trust boundaries.
4. Use accessible component primitives for dialog, combobox, menu, tabs, tree and toast; verify focus trap, return focus, keyboard order and announcements. Don't recreate complex ARIA patterns without testing.
5. Code-split heavy routes, charts, editors and 3D. Avoid hydrating an entire static marketing page; watch bundle cost and re-renders before memoization.
6. Client-only DOM/WebGL/GSAP integrations initialize in effects/hooks and clean up on dependency changes/unmount; no window on server render. Use scoped refs instead of global selectors.
7. Treat demo backend as demo: no fake save-success, pretend payment, invented live analytics or silent mutations.
8. Use strict TypeScript, lint, typecheck, route-level error/loading/empty states, deterministic fixtures and focused behavior tests before visual polish.

## UI state matrix (test actual behavior)
For each meaningful feature: idle, loading, populated, empty, error, offline/stale if relevant, invalid, submitting, success, permission denial, undo/rollback, navigation and teardown. Demonstrate focus and live-region behavior when state changes.

## Responsive contract
On mobile preserve task affordances and hierarchy, not necessarily the desktop multi-panel layout. Inspector may switch to full-screen dialog; table can become scrollable or alternate list with all critical actions retained.

## Verify
Run existing project lint/typecheck/test/build commands; use browser at 390 and 1440 with real keyboard/task journey and runtime console checks. Don't claim passing on unrun tests. When client/server component split is required, test hydration and cleanup in strict development mode.
