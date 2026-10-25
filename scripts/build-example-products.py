#!/usr/bin/env python3
"""Build truthful marketplace-style detail pages from verified local Examples packages.

Never introduces fake testimonials, integrations, paid checkouts or licensing claims.
Generated HTML is static and works without JavaScript; preview and free ZIP are real.
"""
from __future__ import annotations
import argparse
import html
import json
import re
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXAMPLES = ROOT / "examples"
CATALOG = json.loads((EXAMPLES / "catalog.json").read_text())["examples"]
PRODUCTS = json.loads((EXAMPLES / "product-details.json").read_text())
E = lambda value: html.escape(str(value), quote=True)

def require(ok: bool, message: str) -> None:
    if not ok:
        raise ValueError(message)

def get_one(pattern: str, source: str, label: str) -> str:
    match = re.search(pattern, source, flags=re.S)
    require(match is not None, f"Cannot locate {label}")
    return match.group(0)

def strip_tags(text: str) -> str:
    return html.unescape(re.sub(r"<[^>]+>", " ", text)).strip()

def feature_html(items: list[dict[str, str]]) -> str:
    return "\n".join(
        f'<article class="examples-feature"><span class="examples-feature-mark" aria-hidden="true">✳</span>'
        f'<div><h3>{E(item["title"])}</h3><p>{E(item["description"])}</p></div></article>'
        for item in items
    )

# Self-hosted iconography: no external fonts, tracking endpoints or packages.
# These are abstract technology marks, not a claim of official vendor branding.
TECH_MARKS = {
    "HTML": ('html', '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#E44D26" d="M3 2h18l-1.65 18.3L12 22.5l-7.35-2.2L3 2z"/><path fill="#fff" d="M7 6.1h10l-.2 2.3h-7l.15 1.8h6.65l-.52 6-4.08 1.2-4.1-1.2-.28-3h2.3l.12 1.25 1.96.52 1.97-.52.16-2H7.86L7 6.1z"/></svg>'),
    "CSS": ('css', '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#1572B6" d="M3 2h18l-1.65 18.3L12 22.5l-7.35-2.2L3 2z"/><path fill="#fff" d="M7.1 6.1h9.8l-.21 2.3H9.4l.17 1.8h6.93l-.53 6-3.97 1.2-4.07-1.2-.26-2.9h2.32l.1 1.1 1.91.55 1.96-.55.18-2.83H7.47L7.1 6.1z"/></svg>'),
    "JavaScript": ('js', '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="1" width="22" height="22" rx="3" fill="#F7DF1E"/><path fill="#262816" d="M9 7h2v10c0 2.5-1.4 3.5-3.6 3.5-1.5 0-2.6-.7-3.1-1.8l1.7-1c.33.6.7.9 1.35.9.95 0 1.65-.38 1.65-1.65V7zm5.8 10.6c.53.88 1.2 1.25 2.2 1.25.93 0 1.53-.46 1.53-1.1 0-.8-.65-1.08-1.78-1.57l-.58-.25c-1.7-.72-2.82-1.65-2.82-3.56 0-1.76 1.35-3.1 3.45-3.1 1.5 0 2.55.51 3.34 1.91l-1.72 1.1c-.4-.71-.83-1-1.62-1-.73 0-1.2.47-1.2 1.08 0 .75.47 1.06 1.6 1.55l.57.25c2 .86 3.14 1.73 3.14 3.65 0 2.08-1.64 3.33-3.84 3.33-2.15 0-3.55-1.02-4.24-2.37z"/></svg>'),
    "SVG": ('svg', '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" fill="#F3A437"/><path d="M5 18.5C9 6 12.5 5 19 7M5 18.5l7-3 7-8.5" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/><circle cx="5" cy="18.5" r="2" fill="#fff"/><circle cx="19" cy="7" r="2" fill="#fff"/></svg>')
}

def tech_html(labels: list[str]) -> str:
    entries = []
    for label in labels:
        require(label in TECH_MARKS, f"Unsupported/unknown displayed technology: {label}")
        key, symbol = TECH_MARKS[label]
        entries.append(
            f'<li class="examples-tech-pill examples-tech-{key}">'
            f'<span class="examples-tech-icon">{symbol}</span>'
            f'<span>{E(label)}</span></li>'
        )
    return "\n".join(entries)

def build(slug: str, catalog: dict, metadata: dict, original: str) -> str:
    original_prompt = get_one(
        r'<textarea\b(?=[^>]*\bid="example-prompt")[^>]*>.*?</textarea>',
        original, f"{slug} recreation prompt"
    )
    # field-sizing:content is progressive enhancement; rows keeps the original
    # prompt readable in browsers without that CSS support.
    if not re.search(r'<textarea[^>]*\brows=', original_prompt):
        original_prompt = original_prompt.replace('<textarea ', '<textarea rows="7" ', 1)
    # First build migrates the existing QA; later builds recover it from the
    # disclosure without flattening nested <dl>/<div> markup. Both are lossless.
    if "<!-- EXAMPLE:PRODUCT:START -->" in original:
        found = re.search(
            r'<div class="examples-testing-content">(.*?)</div>\s*<p><strong>Product boundary:',
            original, flags=re.S
        )
        require(found is not None, f"Cannot recover stored QA for {slug}")
        evidence_body = found.group(1)
        notes = get_one(r'<p class="examples-disclosure-note">.*?</p>', original,
                        f"{slug} preserved QA provenance")
    else:
        original_evidence = get_one(r'<section id="evidence">.*?</section>', original, f"{slug} verified QA")
        original_footnote = get_one(r'<p class="examples-case-footnote">.*?</p>', original, f"{slug} QA provenance")
        evidence_body = re.sub(r'^<section id="evidence"[^>]*>', "", original_evidence)
        evidence_body = re.sub(r'</section>$', "", evidence_body)
        evidence_body = re.sub(r'<span class="examples-overline">.*?</span>', "", evidence_body, count=1)
        evidence_body = re.sub(r'<h2>Built\. Checked\. Documented\.</h2>', "", evidence_body, count=1)
        notes = re.sub(r'^<p class="examples-case-footnote">', '<p class="examples-disclosure-note">', original_footnote)

    free = PRODUCTS["defaults"]["free"]
    pro = PRODUCTS["defaults"]["pro"]
    require(free["available"] and free["price"] == 0, "Current products must remain free")
    require(pro["status"] == "planned" and pro["checkoutUrl"] is None and pro["price"] is None,
            "Do not generate hypothetical paid checkout or pricing")
    zip_path = EXAMPLES / "downloads" / f"{slug}-source.zip"
    require(zip_path.is_file(), f"Missing real downloadable ZIP for {slug}")
    with zipfile.ZipFile(zip_path) as package:
        require(package.testzip() is None, f"Invalid ZIP for {slug}")
        archived = set(package.namelist())
    for item in metadata["files"]:
        require(item["path"] in archived, f"{slug}: claimed file absent from ZIP: {item['path']}")
    require(len(metadata["features"]) >= 4, f"{slug}: insufficient verified features")

    checkout = f"../downloads/{slug}-source.zip"
    preview = f"../previews/{slug}/"
    chips = tech_html(metadata["stack"])
    highlights = " ".join(f'<span><span aria-hidden="true">✓</span> {E(item)}</span>'
                          for item in metadata["highlights"])
    use_cases = " ".join(f'<span>{E(item)}</span>' for item in metadata["useCases"])

    product_markup = f'''<!-- EXAMPLE:PRODUCT:START -->
<div class="examples-case-actions">
  <a href="{E(preview)}" target="_blank" rel="noopener noreferrer" class="examples-link-secondary">Open full-page preview <span aria-hidden="true">↗</span></a>
  <span class="examples-preview-caption">Real interactive front-end · Switch desktop / mobile above</span>
</div>
</div></section>
<div class="wrap">
  <div class="examples-market-grid">
    <div class="examples-market-content">
      <section id="recreate" class="examples-prompt-showcase" aria-labelledby="prompt-heading">
        <div class="examples-prompt-top">
          <div>
            <span class="examples-overline">START WITH A PROMPT</span>
            <h2 id="prompt-heading">Make your own version<span class="examples-period">.</span></h2>
          </div>
          <button type="button" class="examples-copy-button" data-ex-copy aria-label="Copy recreation prompt">Copy prompt <span aria-hidden="true">↗</span></button>
        </div>
        <p class="examples-prompt-description">Use the original idea with your AI design assistant. Copy, adapt and explore your own direction.</p>
        <label for="example-prompt" class="examples-prompt-label">RECREATION PROMPT</label>
        {original_prompt}
        <p class="examples-prompt-note">The prompt is a starting point, not a guarantee of the exact design. Download the source for the actual implementation.</p>
      </section>
      <section class="examples-overview" aria-labelledby="about-heading">
        <div class="examples-overline">ABOUT THIS TEMPLATE</div>
        <h2 id="about-heading">Designed for exploration.</h2>
        <p>{E(metadata["intro"])}</p>
        <div class="examples-highlights">{highlights}</div>
        <div class="examples-useful-for"><span class="examples-overline">IDEAL FOR</span><div class="examples-use-cases">{use_cases}</div></div>
      </section>
      <section id="features" class="examples-market-section" aria-labelledby="features-heading">
        <div class="examples-section-top"><div>
          <span class="examples-overline">WHAT IT DOES</span>
          <h2 id="features-heading">Key features<span class="examples-period">.</span></h2>
        </div><span class="examples-section-count">{len(metadata["features"]):02} FEATURES</span></div>
        <div class="examples-feature-grid">{feature_html(metadata["features"])}</div>
      </section>
      <details id="testing" class="examples-market-accordion">
        <summary><span><strong>Testing &amp; limitations</strong><small>Browser checks, source provenance and prototype boundaries</small></span><span class="examples-accordion-plus" aria-hidden="true">+</span></summary>
        <div class="examples-accordion-body">
          <div class="examples-testing-content">{evidence_body}</div>
          <p><strong>Product boundary:</strong> {E(metadata["limitation"])}</p>
          {notes}
        </div>
      </details>
    </div>
    <aside class="examples-market-aside" data-ex-product-id="{E(slug)}" aria-label="Download this template">
      <div class="examples-purchase-card">
        <div class="examples-offer-top"><span class="examples-offer-free">FREE EDITION</span><span class="examples-offer-instock"><span aria-hidden="true">●</span> Available</span></div>
        <div class="examples-offer-price">Free <span>$0</span></div>
        <p class="examples-offer-subtitle">Download the actual editable source files. No sign-up required.</p>
        <a class="examples-free-button" href="{E(checkout)}" download>Download free <span aria-hidden="true">↓</span></a>
        <a class="examples-preview-button" href="{E(preview)}" target="_blank" rel="noopener noreferrer">Live preview <span aria-hidden="true">↗</span></a>
        <div class="examples-buy-contents" aria-label="Template benefits">
          <p><span aria-hidden="true">✓</span> Editable template source</p>
          <p><span aria-hidden="true">✓</span> Responsive front-end design</p>
          <p><span aria-hidden="true">✓</span> Working interactive preview</p>
        </div>
        <p class="examples-license-note">Free to download. A separate usage/license document is not included in the current ZIP—do not assume redistribution rights.</p>
      </div>
    </aside>
  </div>
</div>
<!-- EXAMPLE:PRODUCT:END -->
</main>'''
    # Replace content only after the working iframe; preserve canonical page header/footer.
    if "<!-- EXAMPLE:PRODUCT:START -->" in original:
        start = original.index("<!-- EXAMPLE:PRODUCT:START -->")
    else:
        start = original.index('<div class="examples-case-actions">')
    end = original.index("</main>", start) + len("</main>")
    result = original[:start] + product_markup + original[end:]

    # Product header stays intentionally minimal: title, description and preview.
    # One real Free download CTA lives in the card below the preview. Future paid
    # products can change that card to an authorized checkout flow, not a teaser.
    result = re.sub(r'\n?<div class="examples-intro-pills">.*?</div>', "",
                    result, count=1, flags=re.S)
    result = re.sub(r'\n?<div class="examples-header-action">.*?</div>', "",
                    result, count=1, flags=re.S)

    # A single concise tech row sits in the actual product header. Rebuilds
    # replace it in place instead of appending duplicates.
    result = re.sub(r'\s*<div class="examples-tech-row">.*?</div>', "",
                    result, count=1, flags=re.S)
    lead = re.search(r'<p class="examples-case-lead">.*?</p>', result, flags=re.S)
    require(lead is not None, f"Missing heading description in {slug}")
    tech_row = (
        '<div class="examples-tech-row"><span class="examples-tech-label">BUILT WITH</span>'
        '<ul class="examples-tech-list">' + chips + '</ul></div>'
    )
    result = result[:lead.end()] + "\n" + tech_row + result[lead.end():]

    meta = re.search(r'<meta name="description" content="[^"]*">', result)
    require(meta is not None, f"Missing description meta for {slug}")
    desc = f"Preview and download {catalog['name']}, a free editable {catalog['typeLabel'].lower()} built in HTML, CSS and JavaScript. Features, source contents and live demo."
    result = result[:meta.start()] + f'<meta name="description" content="{E(desc)}">' + result[meta.end():]
    return result

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    catalog_slugs = [item["slug"] for item in CATALOG]
    require(set(catalog_slugs) == set(PRODUCTS["items"]),
            "Every real catalog item needs a product metadata record; no synthetic entries")
    changed = []
    for item in CATALOG:
        slug = item["slug"]
        file = EXAMPLES / slug / "index.html"
        original = file.read_text(encoding="utf-8")
        updated = build(slug, item, PRODUCTS["items"][slug], original)
        if original != updated:
            changed.append(slug)
            if not args.check:
                file.write_text(updated, encoding="utf-8")
    if args.check:
        require(not changed, "Marketplace detail HTML differs from metadata: "+", ".join(changed))
    print(f"PASS product pages: {len(CATALOG)} real free products; "+("in sync" if not changed else "updated "+", ".join(changed)))

if __name__ == "__main__":
    main()
