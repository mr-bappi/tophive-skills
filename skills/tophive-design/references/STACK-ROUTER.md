# Stack Router — choose the smallest credible implementation

Read this first for a frontend BUILD or meaningful redesign. **Do not force React, GSAP, Lenis or Three.js into every artifact.** Product repo, user stack and verified constraints outrank preferences here.

## Decision matrix
| Job | Default | Escalate only when |
| --- | --- | --- |
| Content/landing/editorial | Semantic HTML + modern CSS + minimal JS | React is required by existing app, complex state or reuse |
| Stateful SaaS/workspace | Existing framework; for greenfield React + TypeScript is a candidate | Next.js only for routing/data/server needs, not aesthetics |
| Dense operations/grid | Accessible components + data model + table state | Virtualize when measured row/column scale requires it |
| Editorial timeline/motion | CSS transitions or Web Animations API | GSAP for intricate sequencing, pinned scrub or coordinated scroll |
| Smooth scroll | Browser native | Lenis when justified by experience, tested against anchor, touch and accessibility |
| 3D interactive scene | Static image/canvas fallback | Three.js / React Three Fiber only if spatial interaction is essential |
| Motion graphics/video | Optimized video and semantic controls | Lottie/Rive interactive vectors, Remotion for programmatic rendering |

## Before picking dependencies
1. Inspect actual package manager, installed versions, build system, browser targets, deployment and licence constraints. Reuse existing dependencies; never invent an installed package or silently switch stacks.
2. Record **chosen stack, rejected alternatives, bundle/perf budget, supported browsers, progressive fallback and local verification commands** in the implementation handoff.
3. Keep content/navigational controls accessible without JavaScript where reasonable. Provide a no-WebGL and no-motion equivalent for essential meaning.
4. Use server rendering only where compatible with target infra. Browser/WebGL/GSAP DOM code must run client-side with clean teardown; do not reference window/document during server evaluation.
5. For WordPress themes/Gutenberg, preserve existing PHP/templates and WordPress integration contracts rather than installing a standalone Next app.

## Escalation questions
- Does the page have long-lived state, server data and interacting forms? Then read `REACT-ARCHITECTURE.md`.
- Does it have a dense table, live data, permissions or multiple linked inspectors? Read `DASHBOARD-COMPONENTS.md` and `DATA-GRID-ENGINE.md`.
- Does motion meaningfully convey timeline/interaction? Read `GSAP-LENIS.md`.
- Does visual depth carry meaning and need user input? Read `THREE-R3F.md`.
- Does content include timed video clips or export? Read `VIDEO-MOTION.md`.
- For all new builds read `MODERN-CSS.md` and existing general QA contracts.

## Anti-patterns
No default infinite scroll-jacking, all-canvas websites that hide accessible content, unnecessary animation frameworks for a button, decorative fake dashboards, huge single-file applications, invented product claims or imported unreviewed third-party visual assets.
