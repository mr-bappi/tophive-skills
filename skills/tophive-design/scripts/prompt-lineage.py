#!/usr/bin/env python3
"""Fail-closed provenance bookkeeping for TopHive design project prompts.

This tool never generates a prompt from a website and never guesses the creator's
words. It only stores exact supplied bytes, approved change summaries, and
digests of independently authored final recreation briefs.

Examples:
 python3 prompt-lineage.py init --project /path/to/archive
 python3 prompt-lineage.py capture --project /path/to/archive \
   --file /path/to/original.txt --source "creator-supplied attachment"
 python3 prompt-lineage.py record --project /path/to/archive \
   --decision "Use a catalog-backed cart" --source "approved revision"
 python3 prompt-lineage.py finalize --project /path/to/archive
 python3 prompt-lineage.py verify --project /path/to/archive
"""
from __future__ import annotations

import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

SCHEMA_VERSION = 1
ORIGINAL_NAME = "01-original.md"
FINAL_NAME = "04-final-recreation.md"
REVISION_NAME = "03-revision-history.md"
MANIFEST_NAME = "manifest.json"


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def read_manifest(folder: Path) -> dict:
    target = folder / MANIFEST_NAME
    if not target.is_file():
        return {"schemaVersion": SCHEMA_VERSION, "original": None, "final": None}
    data = json.loads(target.read_text(encoding="utf-8"))
    if data.get("schemaVersion") != SCHEMA_VERSION:
        raise ValueError("Unknown prompt manifest schema: do not silently migrate")
    return data


def save_manifest(folder: Path, data: dict) -> None:
    path = folder / MANIFEST_NAME
    # Atomic replacement within the prompt folder; no project-wide write.
    tmp = folder / ".manifest.tmp"
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    tmp.replace(path)


def project_folder(project: Path) -> Path:
    if not project.is_dir():
        raise ValueError("Project directory must already exist")
    folder = project / "prompts"
    folder.mkdir(exist_ok=True)
    if folder.is_symlink():
        raise ValueError("Refusing symlinked prompt folder")
    return folder


def initialize(folder: Path) -> None:
    """Establish explicit unknown provenance without inventing original text."""
    target = folder / MANIFEST_NAME
    if not target.is_file():
        save_manifest(folder, read_manifest(folder))
    print("PROMPT LINEAGE INITIALIZED", target)


def capture(folder: Path, source_file: Path, source: str) -> None:
    if not source.strip():
        raise ValueError("Exact prompt source identifier is required")
    if not source_file.is_file() or source_file.is_symlink():
        raise ValueError("Source must be a regular, local file")
    payload = source_file.read_bytes()
    if not payload or len(payload) > 512_000:
        raise ValueError("Original prompt must be nonempty and <= 512 kB")
    payload.decode("utf-8")  # preserve exactly; don't change line endings
    destination = folder / ORIGINAL_NAME
    manifest = read_manifest(folder)
    prior = manifest.get("original")
    if destination.exists():
        if destination.read_bytes() != payload:
            raise ValueError("Original prompt already exists with different content; refusing overwrite")
        if prior and prior.get("sha256") != digest(payload):
            raise ValueError("Existing original digest differs from the source; refusing overwrite")
    else:
        if prior:
            raise ValueError("Manifest records an original but file is missing; refusing overwrite")
        destination.write_bytes(payload)
    manifest["original"] = prior or {
        "status": "verbatim",
        "origin": "creator-supplied",
        "file": ORIGINAL_NAME,
        "source": source.strip(),
        "sha256": digest(payload),
        "capturedAt": now(),
    }
    save_manifest(folder, manifest)
    print("ORIGINAL SAVED", destination, manifest["original"]["sha256"])


def record(folder: Path, decision: str, source: str) -> None:
    if not decision.strip() or not source.strip():
        raise ValueError("Decision and explicit provenance source are both required")
    if "\n" in source or len(source) > 300:
        raise ValueError("Source identifier must fit on one line")
    target = folder / REVISION_NAME
    if not target.exists():
        target.write_text("# Approved revision history\n\n", encoding="utf-8")
    with target.open("a", encoding="utf-8") as f:
        f.write(f"## {now()} — approved change\n\n"
                f"Source: {source.strip()}\n\n"
                f"Decision (summary, not a verbatim quote): {decision.strip()}\n\n")
    print("REVISION RECORDED", target)


def finalize(folder: Path) -> None:
    path = folder / FINAL_NAME
    if not path.is_file():
        raise ValueError("Author the evidenced final recreation prompt first; not auto-generated")
    payload = path.read_bytes()
    text = payload.decode("utf-8")
    if len(text.strip()) < 210:
        raise ValueError("Final recreation prompt is too short to be useful")
    manifest = read_manifest(folder)
    manifest["final"] = {
        "status": "reconstructed",
        "origin": "implemented-and-verified-design",
        "file": FINAL_NAME,
        "sha256": digest(payload),
        "recordedAt": now(),
        "note": "Recreation instructions; not creator's original words and not a pixel-perfect guarantee.",
    }
    save_manifest(folder, manifest)
    print("RECREATION SNAPSHOT RECORDED", path, manifest["final"]["sha256"])


def verify(folder: Path) -> None:
    manifest = read_manifest(folder)
    if not manifest.get("original") and not manifest.get("final"):
        raise ValueError("No original or final prompt provenance recorded")
    for key, expected_file, status in (
        ("original", ORIGINAL_NAME, "verbatim"),
        ("final", FINAL_NAME, "reconstructed"),
    ):
        item = manifest.get(key)
        if not item:
            continue
        if item.get("file") != expected_file or item.get("status") != status:
            raise ValueError(f"Invalid {key} provenance status or filename")
        path = folder / expected_file
        if not path.is_file() or path.is_symlink():
            raise ValueError(f"Missing or linked {key} file")
        if digest(path.read_bytes()) != item.get("sha256"):
            raise ValueError(f"{key} content changed: digest mismatch")
    print("PROMPT PROVENANCE VERIFIED", folder)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    capture_cmd = sub.add_parser("capture", help="Copy the creator's exact original text, never overwrite")
    capture_cmd.add_argument("--project", required=True, type=Path)
    capture_cmd.add_argument("--file", required=True, type=Path)
    capture_cmd.add_argument("--source", required=True)
    record_cmd = sub.add_parser("record", help="Append an approved decision, with a source")
    record_cmd.add_argument("--project", required=True, type=Path)
    record_cmd.add_argument("--decision", required=True)
    record_cmd.add_argument("--source", required=True)
    for name in ("init", "finalize", "verify"):
        command = sub.add_parser(name)
        command.add_argument("--project", required=True, type=Path)
    args = parser.parse_args()
    folder = project_folder(args.project)
    if args.command == "init":
        initialize(folder)
    elif args.command == "capture":
        capture(folder, args.file, args.source)
    elif args.command == "record":
        record(folder, args.decision, args.source)
    elif args.command == "finalize":
        finalize(folder)
    elif args.command == "verify":
        verify(folder)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
