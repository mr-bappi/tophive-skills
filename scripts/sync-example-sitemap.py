#!/usr/bin/env python3
"""Keep GitHub Pages sitemap example detail URLs in sync with curated catalog."""
import argparse
import json
import re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
CATALOG=json.loads((ROOT/"examples/catalog.json").read_text(encoding="utf-8"))["examples"]
FILE=ROOT/"sitemap.xml"
BASE="https://skills.tophive.dev/examples/"
def create(source: str) -> str:
    # Keep the existing site-level non-example URLs and root listing unchanged.
    result=re.sub(r'<url><loc>'+re.escape(BASE)+r'[^<]+/</loc></url>',"",source)
    # Re-add only verified examples from the catalog. Root /examples/ is retained.
    root_listing=f"<url><loc>{BASE}</loc></url>"
    if root_listing not in result:
        raise ValueError("Missing Examples collection URL")
    details="".join(f"<url><loc>{BASE}{item['slug']}/</loc></url>" for item in CATALOG)
    return result.replace("</urlset>",details+"</urlset>",1)
def main():
    p=argparse.ArgumentParser();p.add_argument("--check",action="store_true");args=p.parse_args()
    source=FILE.read_text(encoding="utf-8")
    updated=create(source)
    if args.check:
        if source!=updated:raise ValueError("Sitemap not synchronized")
        print("PASS public sitemap",len(CATALOG),"verified case-study URLs")
    else:
        FILE.write_text(updated,encoding="utf-8")
        print("Updated public sitemap with",len(CATALOG),"example case studies")
if __name__=="__main__":main()
