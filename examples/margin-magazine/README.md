# MARGIN — editorial landing-page prototype

A complete responsive, front-end-only literary magazine website. Original typography-led visual direction and custom SVG editorial artwork. Fictional publication and fictional contributor names; all sample stories, illustrations and claims are demonstrative.

## Run locally

Open `index.html` directly in a current browser, or run `python3 -m http.server 8080` inside the folder and visit `http://localhost:8080`.

## Functional interactions

- Accessible desktop navigation and collapsible mobile menu
- Filter magazine pieces by genre; accessible pressed states and live count
- Open each of four original sample stories in a native reading dialog; keyboard Escape and close controls
- Submission information opens a clearly labeled prototype dialog
- Newsletter form validates the address locally and explicitly does not send or store data
- Reduced-motion handling, keyboard focus indicators and skip navigation

## Verify responsive behavior

`python tests/qa.py` runs the actual Chromium/Playwright layout and interaction tests at six viewport widths when `playwright` and Chromium are installed. See `QA.md` for verified results and limits.

## What is NOT implemented

This is not a live magazine. No content management system, account, backend, submission portal, real newsletter signup, analytics, or publishing pipeline is connected. The apparent issue number and sample reading times are editorial demo labels, not real publication metrics. The artwork is original SVG art shipped locally; there are no remote fonts, images, or runtime libraries.
