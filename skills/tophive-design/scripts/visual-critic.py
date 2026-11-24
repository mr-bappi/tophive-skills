#!/usr/bin/env python3
"""Human-reviewed visual QA record gate. Completeness != aesthetic quality."""
from __future__ import annotations
import argparse
import json
import struct
from pathlib import Path

def image_dimensions(path):
    if not isinstance(path, str) or not path.strip():
        return None
    f = Path(path).expanduser()
    if not f.is_file():
        return None
    data = f.read_bytes()
    if len(data) < 24:
        return None
    if data.startswith(bytes.fromhex("89504e470d0a1a0a")) and data[12:16] == b"IHDR":
        return struct.unpack(">II", data[16:24])
    if data[:2] == bytes.fromhex("ffd8"):
        # Recognize JPEG, but skip dimensions validation when not cheaply available.
        return (1, 1)
    return None

def template():
    return {
        "kind": "human_visual_review_v1",
        "candidate": "",
        "artifact": "",
        "reviewer": "",
        "screenshots": {"desktop": "", "mobile": ""},
        "interaction_proof": "",
        "state_test_notes": "",
        "structural_issues": [],
        "blockers": [],
        "repair": {
            "needed": None,
            "before": "",
            "after": "",
            "structural_axes": [],
            "change_summary": ""
        },
        "desktop_notes": "",
        "mobile_notes": "",
        "truth_accessibility_notes": "",
        "final_decision": "NOT_TESTED"
    }

def validate(d):
    failures = []
    if d.get("kind") != "human_visual_review_v1":
        failures.append("incorrect schema")
    for field in ("candidate","reviewer","artifact","desktop_notes","mobile_notes","truth_accessibility_notes","state_test_notes"):
        if not isinstance(d.get(field),str) or len(d[field].strip()) < (20 if field.endswith("_notes") else 3):
            failures.append("missing " + field)
    if not isinstance(d.get("artifact"), str) or not Path(d["artifact"]).expanduser().exists():
        failures.append("artifact does not exist")
    imgs = d.get("screenshots",{})
    if not isinstance(imgs,dict):
        imgs = {}
    desktop = image_dimensions(imgs.get("desktop"))
    mobile = image_dimensions(imgs.get("mobile"))
    if not desktop or desktop[0] < 1100:
        failures.append("desktop capture missing or unexpectedly narrow")
    if not mobile or not 320 <= mobile[0] <= 480:
        failures.append("mobile 320-480px capture missing")
    if not isinstance(d.get("interaction_proof"),str) or not Path(d["interaction_proof"]).expanduser().is_file():
        failures.append("linked interaction/state evidence missing")
    for field in ("structural_issues","blockers"):
        if not isinstance(d.get(field),list):
            failures.append("invalid "+field)
    repair=d.get("repair",{})
    if not isinstance(repair,dict) or type(repair.get("needed")) is not bool:
        failures.append("repair decision not recorded")
    elif repair["needed"]:
        before,after=image_dimensions(repair.get("before")),image_dimensions(repair.get("after"))
        if not before or not after:
            failures.append("repair before and after screenshot evidence missing")
        elif Path(repair["before"]).read_bytes() == Path(repair["after"]).read_bytes():
            failures.append("repair captures are byte identical")
        if len(set(repair.get("structural_axes",[])) & {"story","composition","proof","interaction","typography"}) < 1:
            failures.append("repair must identify a structural axis")
        if len(str(repair.get("change_summary","")).strip()) < 25:
            failures.append("repair summary missing")
    if d.get("blockers"):
        failures.append("unresolved blockers")
    if d.get("final_decision") != "PASS":
        failures.append("review not marked PASS")
    return failures

def main():
    cli=argparse.ArgumentParser(description=__doc__)
    cli.add_argument("action",choices=("init","check"))
    cli.add_argument("--file",required=True)
    args=cli.parse_args()
    out=Path(args.file).expanduser()
    if args.action=="init":
        if out.exists():
            cli.error("refusing to overwrite an existing review")
        out.parent.mkdir(parents=True,exist_ok=True)
        out.write_text(json.dumps(template(),indent=2)+"\n")
        print("CREATED NOT_TESTED review:",out)
        return 0
    errors=validate(json.loads(out.read_text()))
    for error in errors:
        print("FAIL",error)
    if errors:
        print("REVIEW NOT VERIFIED: visual merit and independent approval are never inferred")
        return 1
    print("REVIEW RECORD COMPLETE; human aesthetic judgment not automated")
    return 0

if __name__=="__main__":
    raise SystemExit(main())
