#!/usr/bin/env python3
"""Build/check the single shared header used by static GitHub Pages.
The partial is the authoring source; generated HTML remains usable without JS.
Usage: python3 scripts/sync-site-header.py [--check]
"""
from pathlib import Path
import argparse
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
PARTIAL = ROOT / "partials/site-header.html"
PAGES = {
    "index.html": ("./", ""),
    "library/index.html": ("../", "library"),
    "examples/index.html": ("../", "examples"),
    "docs/index.html": ("../", "docs"),
    "skills/tophive-design/index.html": ("../../", ""),
}
for detail in sorted((ROOT / "examples").glob("*/index.html")):
    PAGES[str(detail.relative_to(ROOT))] = ("../../", "examples")

HEADER_RE = re.compile(r'<header class="site-header"(?:\s[^>]*)?>.*?</header>', re.S)


def render(template: str, root: str, active: str) -> str:
    result = template
    for key, value in {
        "ROOT": root,
        "ACTIVE_LIBRARY": ' aria-current="page"' if active == "library" else "",
        "ACTIVE_EXAMPLES": ' aria-current="page"' if active == "examples" else "",
        "ACTIVE_DOCS": ' aria-current="page"' if active == "docs" else "",
    }.items():
        result = result.replace("{{" + key + "}}", value)
    if "{{" in result or "}}" in result:
        raise ValueError("Unknown or unexpanded header placeholder")
    return result.rstrip()


def sync(check: bool) -> int:
    template = PARTIAL.read_text(encoding="utf-8")
    assert template.count('<header class="site-header"') == 1
    failures = []
    for name, (root, active) in PAGES.items():
        path = ROOT / name
        html = path.read_text(encoding="utf-8")
        matches = list(HEADER_RE.finditer(html))
        if len(matches) != 1:
            raise ValueError(f"{name}: expected one <header class=site-header>, found {len(matches)}")
        rendered = render(template, root, active)
        current = matches[0].group()
        if check:
            if current != rendered:
                failures.append(name)
        elif current != rendered:
            new_html = html[:matches[0].start()] + rendered + html[matches[0].end():]
            path.write_text(new_html, encoding="utf-8")
            print("UPDATED", name)
    if failures:
        print("DRIFT:", ", ".join(failures))
        return 1
    print("PASS shared header across", len(PAGES), "pages" if check else "pages (synchronized)")
    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail if a static page differs from the shared source")
    args = parser.parse_args()
    sys.exit(sync(args.check))
