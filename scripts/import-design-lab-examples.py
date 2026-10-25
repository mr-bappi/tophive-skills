#!/usr/bin/env python3
"""Review-gated Design Lab archive importer for TOPHIVE Skills Examples.

Reads immutable Design Lab archives + approved source ZIPs. Never modifies the
archive, and does NOT commit, push or publish. Only explicitly curated records
from examples/archive-imports.json may become public Example listings.

Usage:
  python3 scripts/import-design-lab-examples.py --discover
  python3 scripts/import-design-lab-examples.py --import
  python3 scripts/import-design-lab-examples.py --check
"""
from __future__ import annotations
import argparse
import hashlib
import html
import json
from pathlib import Path
import re
import shutil
import stat
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
EXAMPLES = ROOT / "examples"
ARCHIVE_SPECS = EXAMPLES / "archive-imports.json"
CATALOG = EXAMPLES / "catalog.json"
PRODUCT = EXAMPLES / "product-details.json"
SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def fail(message: str):
    raise ValueError(message)


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def put_json(path: Path, data: dict):
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def rooted(source: Path, relative: str) -> Path:
    if not relative or Path(relative).is_absolute() or ".." in Path(relative).parts:
        fail(f"Unsafe relative path {relative!r}")
    candidate = source.joinpath(relative).resolve()
    if not candidate.is_relative_to(source.resolve()):
        fail(f"Outside approved archive: {relative!r}")
    if not candidate.is_file() or candidate.is_symlink():
        fail(f"Missing or symlinked source file: {relative!r}")
    return candidate


def paths(record: dict, archive_root: Path) -> tuple[Path, Path]:
    source = archive_root / record["source"]
    if source.is_symlink() or not source.is_dir():
        fail(f"Missing or symlinked archive folder {record['source']}")
    origin = Path(record["sourceZip"]).expanduser()
    if not origin.is_file():
        fail(f"Missing actual downloadable source package {origin}")
    return source, origin


def runtime_files(source: Path, runtime: str) -> list[tuple[Path, Path]]:
    inside = source / runtime if runtime else source
    required = [inside / "index.html", inside / "styles.css"]
    js = [inside / "app.js", inside / "script.js"]
    required.append(next((f for f in js if f.exists()), js[0]))
    for file in required:
        if not file.is_file() or file.is_symlink() or not file.resolve().is_relative_to(source.resolve()):
            fail(f"Runtime file not found or unsafe: {file}")
    result: list[tuple[Path, Path]] = []
    for file in sorted(inside.rglob("*")):
        if file.is_dir():
            continue
        if file.is_symlink() or not file.resolve().is_relative_to(source.resolve()):
            fail(f"Unexpected symlink or path escape: {file}")
        # The archive root also contains QA, reports and local development
        # documents. Only public runtime assets belong in the live preview.
        if not runtime and file.relative_to(inside).parts[0] not in {
            "index.html", "styles.css", "app.js", "script.js", "assets"
        }:
            continue
        if file.suffix.lower() not in {".html", ".css", ".js", ".svg", ".png", ".jpg", ".jpeg", ".webp", ".woff2"}:
            fail(f"Unapproved runtime asset: {file}")
        relative = file.relative_to(inside)
        result.append((file, relative))
    if len(result) > 70:
        fail(f"Too many files in single runtime: {len(result)}")
    return result


def verify_zip(src: Path, zip_path: Path, prefix: str):
    if not prefix.endswith("/"):
        fail("ZIP must have a single prefixed source folder")
    with zipfile.ZipFile(zip_path) as z:
        if z.testzip() is not None:
            fail(f"Corrupt source ZIP {zip_path}")
        for item in z.infolist():
            name = item.filename
            if not name.startswith(prefix):
                fail(f"ZIP entry outside approved root: {name}")
            if name.startswith("/") or ".." in Path(name).parts or "\\" in name:
                fail(f"Unsafe ZIP file {name}")
            if stat.S_ISLNK((item.external_attr >> 16) & 0xFFFF):
                fail(f"Symlink in source ZIP: {name}")
            if item.is_dir():
                continue
            if item.file_size > 10_000_000:
                fail(f"Oversized asset in source ZIP: {name}")
            relative = name[len(prefix):]
            local = rooted(src, relative)
            if hashlib.sha256(z.read(item)).digest() != hashlib.sha256(local.read_bytes()).digest():
                fail(f"Archive/ZIP source mismatch: {name}")


def validate_record(record: dict, archive_root: Path):
    slug = record["slug"]
    if not SLUG.fullmatch(slug):
        fail(f"Unsafe slug: {slug!r}")
    source, zip_src = paths(record, archive_root)
    files = runtime_files(source, record.get("runtime", ""))
    verify_zip(source, zip_src, record["zipPrefix"])
    if record["source"] != slug:
        fail("Archive slug/path must match in reviewed public imports")
    if len(record["features"]) < 4:
        fail("Review at least 4 demonstrable features")
    for entry in record["files"]:
        file = rooted(source, entry["path"].removeprefix(record["zipPrefix"]))
        if not file.is_file():
            fail("Claimed file not supplied")
    if len(record["prompt"]) < 210:
        fail("Copyable prompt is too short")
    if not record.get("qa") or not record.get("provenance"):
        fail("QA source and limitations are mandatory")
    for fragment in (record["qa"], record["provenance"]):
        if re.search(r"<script|onerror\s*=|onclick\s*=|javascript:", fragment, re.I):
            fail("Untrusted active HTML in QA markup")
    return source, zip_src, files


def initial_page(record: dict) -> str:
    template = (EXAMPLES / "margin-magazine" / "index.html").read_text(encoding="utf-8")
    start, footer = template.split("<main id=\"main\">", 1)
    footer = footer.split("</main>", 1)[1]
    slug, name = record["slug"], record["name"]
    title = html.escape(name, quote=True)
    canonical = f"https://skills.tophive.dev/examples/{slug}/"
    start = re.sub(r"<title>.*?</title>", f"<title>{title} — TOPHIVE Skills Examples</title>", start, count=1)
    start = re.sub(r'<meta name="description" content="[^"]*">',
                   f'<meta name="description" content="{html.escape(record["description"], quote=True)}">',
                   start, count=1)
    start = re.sub(r'<link rel="canonical" href="[^"]*">',
                   f'<link rel="canonical" href="{canonical}">', start, count=1)
    prompt = html.escape(record["prompt"], quote=False)
    lead = html.escape(record["hero"], quote=False)
    label = html.escape(record["kicker"], quote=False)
    detail = html.escape(name, quote=False)
    qa = record["qa"]
    provenance = html.escape(record["provenance"], quote=False)
    body = f'''<main id="main">
<section class="examples-case-hero"><div class="wrap">
<div class="examples-case-path"><a href="../"><span aria-hidden="true">←</span> All examples</a><span class="examples-case-category">{label}</span></div>
<div class="examples-case-grid"><div class="examples-case-intro">
<h1 class="examples-case-heading">{detail}<em>.</em></h1>
<p class="examples-case-lead">{lead}</p>
</div></div>
<div class="examples-preview">
<div class="examples-preview-top"><span class="examples-preview-label"><span class="examples-live-dot" aria-hidden="true"></span> Interactive preview</span>
<div class="examples-preview-switch" role="group" aria-label="Preview viewport"><button type="button" data-ex-size="desktop" aria-pressed="true">Desktop</button><button type="button" data-ex-size="mobile" aria-pressed="false">Mobile</button></div></div>
<div class="examples-preview-canvas" data-ex-preview data-preview-size="desktop"><iframe src="../previews/{slug}/index.html" title="{title} interactive example preview" loading="eager"></iframe></div>
</div>
<div class="examples-case-actions"><a href="../previews/{slug}/" target="_blank" rel="noopener noreferrer" class="examples-link-secondary">Open full-page preview ↗</a></div>
</div></section>
<div class="wrap">
<section id="evidence">
<h2>Built. Checked. Documented.</h2>
{qa}
</section>
<section id="recreate">
<label for="example-prompt">Recreation prompt</label>
<textarea rows="7" id="example-prompt" readonly data-ex-prompt spellcheck="false">{prompt}</textarea>
</section>
<p class="examples-case-footnote"><strong>Skill provenance:</strong> {provenance}</p>
</div>
</main>'''
    return start + body + footer


def import_new(spec: dict, archive_root: Path, catalog: dict, products: dict) -> bool:
    slug = spec["slug"]
    source, zip_src, files = validate_record(spec, archive_root)
    existing = {e["slug"] for e in catalog["examples"]}
    if slug in existing:
        # Idempotent, but make sure the existing archive is truly published and in sync.
        if slug not in products["items"] or not (EXAMPLES / slug / "index.html").is_file():
            fail(f"Partially imported archive: {slug}")
        return False
    dest = EXAMPLES / "previews" / slug
    dest.mkdir(parents=True, exist_ok=False)
    for src_file, relative in files:
        target = dest / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src_file, target)
    zip_dest = EXAMPLES / "downloads" / f"{slug}-source.zip"
    if zip_dest.exists():
        fail(f"Public ZIP already exists: {zip_dest}")
    shutil.copy2(zip_src, zip_dest)
    case = EXAMPLES / slug
    case.mkdir(parents=True, exist_ok=False)
    (case / "index.html").write_text(initial_page(spec), encoding="utf-8")
    (case / "ARCHIVE-SOURCE.sha256").write_text(
        hashlib.sha256(zip_src.read_bytes()).hexdigest() + "  " + zip_src.name + "\n",
        encoding="utf-8",
    )
    next_rank = max((e["featuredOrder"] for e in catalog["examples"]), default=0) + 1
    catalog["examples"].append({
        k: spec[k] for k in ("slug", "name", "category", "categoryLabel",
                           "typeLabel", "description", "statusLabel", "keywords")
    } | {
        "cover": f"media/{slug}-poster.webp",
        "preview": f"previews/{slug}/",
        "featuredOrder": next_rank,
    })
    products["items"][slug] = {
        k: spec[k] for k in ("kicker", "intro", "highlights", "features",
                           "stack", "files", "useCases", "limitation")
    } | {
        "quickStart": ("Unzip the original source package and open its standalone "
                       "HTML entry point locally, or serve the folder with a static HTTP server.")
    }
    print(f"IMPORTED {slug}: {len(files)} working frontend files, source ZIP and draft case")
    return True


def main():
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--discover", action="store_true")
    group.add_argument("--import", dest="do_import", action="store_true")
    group.add_argument("--check", action="store_true")
    args = parser.parse_args()
    specs = load_json(ARCHIVE_SPECS)
    archive_root = Path(specs.get("archiveRoot", "~/Documents/design-lab/archives")).expanduser()
    catalog = load_json(CATALOG)
    products = load_json(PRODUCT)
    listed = {item["slug"] for item in catalog["examples"]}
    reviewed = {item["slug"]: item for item in specs["entries"]}
    if args.discover:
        for source in sorted(archive_root.iterdir()):
            if not source.is_dir() or source.name.startswith("."):
                continue
            if not ((source / "index.html").exists() or (source / "dist/index.html").exists()):
                continue
            status = ("PUBLISHED SOURCE" if source.name in listed else
                      "CURATED READY" if source.name in reviewed else "NEEDS REVIEW")
            print(f"{source.name:24} {status}")
        return
    if args.check:
        for slug, record in reviewed.items():
            src, zip_src, files = validate_record(record, archive_root)
            if slug not in listed:
                fail(f"Curated source not imported: {slug}")
            if hashlib.sha256((EXAMPLES / "downloads" / f"{slug}-source.zip").read_bytes()).digest() != hashlib.sha256(zip_src.read_bytes()).digest():
                fail(f"Published ZIP is not identical to archived source: {slug}")
            for path, relative in files:
                target = EXAMPLES / "previews" / slug / relative
                if not target.is_file() or hashlib.sha256(target.read_bytes()).digest() != hashlib.sha256(path.read_bytes()).digest():
                    fail(f"Public preview modified from original archive: {slug}/{relative}")
        print(f"PASS {len(reviewed)} curated archive imports, ZIP byte identity and runtime source")
        return
    changed = []
    for entry in specs["entries"]:
        if import_new(entry, archive_root, catalog, products):
            changed.append(entry["slug"])
    if changed:
        put_json(CATALOG, catalog)
        put_json(PRODUCT, products)
    print("Newly imported: " + (", ".join(changed) or "(none, already in catalog)"))
    print("NEXT: capture screenshots, build examples, build product pages, review browser tests.")
    print("No git commit, push, or deployment was performed.")


if __name__ == "__main__":
    main()
