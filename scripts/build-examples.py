#!/usr/bin/env python3
"""Build the static Examples gallery from the verified local catalog.

Generated output is between named markers in examples/index.html. The catalog
is the single source of truth for items, category counts and featured order.
Works on GitHub Pages with no runtime fetch. Cards remain readable without JS.

Usage:
  python3 scripts/build-examples.py
  python3 scripts/build-examples.py --check
"""
from __future__ import annotations

import argparse
from collections import Counter
from html import escape
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
GALLERY = ROOT / "examples"
CATALOG = GALLERY / "catalog.json"
PAGE = GALLERY / "index.html"
SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def escaped(value: str) -> str:
    return escape(value, quote=True)


def safe_local(relative: str, expected_suffix: str | None = None) -> Path:
    if not relative or relative.startswith("/") or "://" in relative:
        raise ValueError(f"Unsafe relative path: {relative!r}")
    full = (GALLERY / relative).resolve()
    if not full.is_relative_to(GALLERY.resolve()):
        raise ValueError(f"Path escapes Examples folder: {relative}")
    if expected_suffix and full.suffix != expected_suffix:
        raise ValueError(f"Expected {expected_suffix} for {relative}")
    if not full.is_file():
        raise ValueError(f"Missing example asset: {relative}")
    return full


def validate(source: dict) -> list[dict]:
    if source.get("version") != 1:
        raise ValueError("Expected catalog schema version 1")
    size = source.get("pageSize")
    if type(size) is not int or not 3 <= size <= 30:
        raise ValueError("pageSize must be an integer from 3 to 30")
    examples = source.get("examples")
    if not isinstance(examples, list) or not examples:
        raise ValueError("Catalog must contain at least one real example")
    seen = set()
    for item in examples:
        fields = ("slug", "name", "category", "categoryLabel", "typeLabel",
                  "description", "cover", "preview",
                  "statusLabel", "keywords", "featuredOrder")
        for field in fields:
            if field not in item:
                raise ValueError(f"Missing {field} in catalog item")
        slug = item["slug"]
        category = item["category"]
        if not isinstance(slug, str) or not SLUG.fullmatch(slug):
            raise ValueError(f"Unsafe slug: {slug!r}")
        if slug in seen:
            raise ValueError(f"Duplicate example slug: {slug}")
        seen.add(slug)
        if not isinstance(category, str) or not SLUG.fullmatch(category):
            raise ValueError(f"Unsafe category: {category!r}")
        if not isinstance(item["featuredOrder"], int):
            raise ValueError(f"Invalid featured order: {slug}")
        if not isinstance(item["keywords"], list) or not all(isinstance(k, str) for k in item["keywords"]):
            raise ValueError(f"Invalid keywords: {slug}")
        for field in ("name", "categoryLabel", "typeLabel", "description", "statusLabel"):
            if not isinstance(item[field], str) or not item[field].strip():
                raise ValueError(f"Invalid {field}: {slug}")
        if item["cover"] != f"media/{slug}-poster.webp":
            raise ValueError(f"Cover path must follow media/<slug>-poster.webp: {slug}")
        if item["preview"] != f"previews/{slug}/":
            raise ValueError(f"Preview path must follow previews/<slug>/: {slug}")
        safe_local(item["cover"], ".webp")
        safe_local(f"media/{slug}-full.webp", ".webp")
        safe_local(f"{slug}/index.html", ".html")
        safe_local(item["preview"] + "index.html", ".html")
        safe_local(f"downloads/{slug}-source.zip", ".zip")
    return sorted(examples, key=lambda e: (e["featuredOrder"], e["name"].casefold()))


def filter_markup(examples: list[dict]) -> str:
    counts = Counter(item["category"] for item in examples)
    labels = {}
    for item in examples:
        category, label = item["category"], item["categoryLabel"]
        if category in labels and labels[category] != label:
            raise ValueError(f"Conflicting category labels for {category}")
        labels[category] = label
    out = [f'<button type="button" data-ex-filter="all" aria-pressed="true">All examples <span>{len(examples):02d}</span></button>']
    for category in labels:
        out.append(
            f'<button type="button" data-ex-filter="{escaped(category)}" aria-pressed="false">'
            f'{escaped(labels[category])} <span>{counts[category]:02d}</span></button>'
        )
    return "\n".join(out)


def card_markup(item: dict) -> str:
    slug = escaped(item["slug"])
    name = escaped(item["name"])
    category = escaped(item["category"])
    terms = " ".join([item["name"], item["categoryLabel"], item["typeLabel"], item["description"]] + item["keywords"]).lower()
    tone = "dashboard" if item["category"] == "dashboards" else "website"
    return f'''<article class="ex-card" data-ex-item data-category="{category}" data-ex-name="{name}" data-ex-rank="{item["featuredOrder"]}" data-ex-terms="{escaped(terms)}">
<a class="ex-card-art" data-ex-tone="{tone}" href="{slug}/" aria-label="Explore {name} case study">
<span class="ex-card-screen">
<img class="ex-card-thumb" src="{escaped(item["cover"])}" alt="Actual {name} desktop interface screenshot" loading="lazy" decoding="async">
<img class="ex-card-full" data-ex-full-src="media/{slug}-full.webp" alt="" aria-hidden="true" decoding="async">
</span>
</a>
<div class="ex-card-bottom">
<div class="ex-card-info"><h3><a href="{slug}/">{name}</a></h3><p>{escaped(item["typeLabel"])}</p></div>
<a class="ex-card-open" href="{escaped(item["preview"])}" aria-label="Open {name} live preview in a new tab" target="_blank" rel="noopener noreferrer" title="Open live preview">↗</a>
</div></article>'''


def between(html: str, key: str, replacement: str) -> str:
    start = f"<!-- EXAMPLES:{key}:START -->"
    end = f"<!-- EXAMPLES:{key}:END -->"
    if html.count(start) != 1 or html.count(end) != 1:
        raise ValueError(f"Exactly one pair of {key} markers is required")
    prefix, rest = html.split(start, 1)
    _, suffix = rest.split(end, 1)
    return f"{prefix}{start}\n{replacement}\n{end}{suffix}"


def generate(html: str, source: dict) -> str:
    examples = validate(source)
    html = between(html, "COUNT", f"{len(examples):02d} EXAMPLES")
    html = between(html, "FILTERS", filter_markup(examples))
    html = between(html, "CARDS", "\n".join(card_markup(item) for item in examples))
    attrs = f'<div class="ex-grid site-listing-results" data-ex-list data-ex-page-size="{source["pageSize"]}"'
    if len(examples) > 6:
        attrs += ' data-ex-layout="dense"'
    attrs += ">"
    original = re.compile(r'<div class="ex-grid site-listing-results" data-ex-list(?: data-ex-page-size="\d+")?(?: data-ex-layout="dense")?>')
    html, n = original.subn(attrs, html)
    if n != 1:
        raise ValueError("Expected one gallery card container")
    return html


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail if generated HTML is stale")
    args = parser.parse_args()
    source = json.loads(CATALOG.read_text(encoding="utf-8"))
    before = PAGE.read_text(encoding="utf-8")
    after = generate(before, source)
    if args.check:
        if before != after:
            print("FAIL Examples gallery out of sync with catalog")
            return 1
        print(f"PASS Examples catalog: {len(source['examples'])} real cards, generated HTML current")
    else:
        if after != before:
            PAGE.write_text(after, encoding="utf-8")
        print(f"PASS Examples gallery generated: {len(source['examples'])} real cards")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (ValueError, OSError, json.JSONDecodeError) as exc:
        print(f"FAIL Examples catalog: {exc}", file=sys.stderr)
        sys.exit(1)
