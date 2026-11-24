# Mandatory modular CSS architecture — new builds and scoped refinements

**MUST for every new website, template, theme, dashboard, or frontend application that authors custom CSS.** Structure styles by ownership from the first implementation; do not build an enormous single handwritten stylesheet and promise to refactor later. Scale the number of modules to the project—do **not** create 33 empty files for a landing page. This is a code architecture gate, not a prescribed visual aesthetic.

## Required decisions before styling

1. Inspect existing style conventions, framework, design tokens, routes, build pipeline, Git changes and the target repo's rules. **Respect an existing sound modular system**; do not replace CSS Modules, scoped styles, SCSS partials, Tailwind conventions or a theme's native CSS architecture just to match an example directory.
2. Assign a **single primary owner** for each selector or style block: foundation/tokens, site layout, reusable component, feature/page, or component-owned responsive rule. Shared primitives must not be redefined in individual pages. Avoid broad global selectors beyond resets/tokens.
3. Decide the module loading order / dependency boundaries before writing styles. Keep tokens centralized, name styles predictably, and make responsive behavior live next to the owner or in a deliberately ordered responsive module. No cascade hacks or repeated override appendices.
4. Establish a **runtime entrypoint**: use the project's existing bundler/import graph to emit the required CSS, or use an explicit ordered manifest + reproducible build command for static sites. Preserve the desired count of browser CSS requests; a generated `styles.css` is a delivery artifact, not the editable source.

## Static HTML/CSS/JS or multipage template example

Use only directories the design needs:

```text
assets/
  css/
    foundation/       # variables, reset, typography
    layout/           # header, footer, navigation, containers
    components/       # buttons, cards, menus, product gallery
    pages/            # homepage, catalog, product, account
    responsive/       # only if responsive rules are not co-located
    manifest.json     # ordered source list, if needed
  styles.css          # GENERATED browser bundle, never manually append rules
tools/
  build_css.py        # or package.json script for selected tooling
```

For a one-page build, 3–5 focused files may suffice; for a larger storefront split by owned surface. Use the smallest practical structure that stays maintainable. A token file is mandatory when custom visual tokens exist; do not hard-code repeated colors, radii, spacing or typography in page components.

When using an ordered manifest, validate that every listed source exists, that there are no unlisted CSS modules or duplicates, that source order is deterministic, and that the emitted stylesheet matches the manifest. Provide both `build` and `check` modes. HTML loads the generated CSS, not every source module via a request waterfall. Prefer the existing project bundler where available; do not impose Python on React/WordPress projects.

## React, Next, Vue, WordPress, WooCommerce and Tailwind

- React/Next: use component/feature CSS Modules, existing styled system or a modular global entry for tokens/layout. Co-locate component styles; do not accumulate all pages in `globals.css`.
- Vue: use scoped styles or feature-owned modules plus global tokens; no giant global CSS file.
- WordPress/WooCommerce: use theme/module partials for base, layout, WooCommerce components and page templates; compile/enqueue only intended assets. Honor editor and RTL styles and the installed theme's tooling.
- Tailwind/utility-first: centralize tokens/config/theme, compose reusable components and avoid huge `@apply` or arbitrary-value dumps masquerading as modules.
- Existing project edit: keep approved architecture; modify the owning file and refactor only the affected CSS unless a broader migration is explicitly authorized.

## Module size, formatting, and anti-patterns

- Format selectors and declarations for human review (readable multiline CSS). **Target <=300 formatted lines per module**; exceeding this requires a clear cohesion reason or a further split. Never use a 1000+ line editable stylesheet.
- Split by responsibility, not mechanically by line number. Modules must contain coherent functional ownership; avoid tiny fragmented files with no purpose.
- Centralize design tokens and component variants. No scattered `!important` patches, selector-specificity arms races, dead declarations, duplicate breakpoint forests, or inline CSS overrides as the default.
- Preserve intentional cascade ordering and document any required later overrides. Do not move a rule across scopes without checking which selector wins.
- Maintain stable asset references, WCAG focus visibility, reduced motion, fluid sizing, scrollbar behavior and responsive ownership.
- A one-file **generated production bundle is allowed**. A one-file **hand-maintained source monolith is not**.

## Mandatory acceptance for BUILD / REFINE with custom styling

**Architecture:** the real source modules exist, are owner-scoped and formatted; a reproducible build/check works; the runtime CSS matches the source; no unreferenced stylesheets or dead CSS left behind within the approved scope.

**Rendering:** run the framework's build/lint/test gates when available. Inspect real mobile/tablet/desktop layouts and interactions; check browser errors, missing styles, overflow, keyboard focus, reduced-motion. For existing designs, compare same-size pre/post rendered screenshots and meaningful computed styles; a green build alone does not prove unchanged UI.

**Handoff:** state source entrypoint, owner modules, exact build/check commands, tests actually run and outcomes. Mark missing runtime evidence NOT TESTED; do not say "production deployed" or "installed in ChatGPT" without independent confirmation.

## Generic migration recipe (existing monolith)

1. Preserve a clean baseline of existing CSS and critical screenshots before changes.
2. Inventory selectors, media queries, tokens, JS class names and relative asset URLs; identify semantic ownership.
3. Split rules into owner modules while keeping **effective cascade order**; if legacy order must be maintained, use an ordered manifest and progressively remove accidental overrides only with visual proof.
4. Format source, build runtime output, run CSS parse/static checks, then compare desktop/mobile screenshots, interaction behavior and computed CSS.
5. Delete redundant/dead styles only when code references and browser evidence justify removal. Do not change the visual design merely to satisfy folder organization.

This is a general architecture policy. Product-specific gallery designs, fictional product assets, local URLs, pricing, brands or project counts are **not** reusable requirements.
