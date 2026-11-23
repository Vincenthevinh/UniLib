#!/usr/bin/env python3
"""Scope-limited consistency audit for Quan's PA2 delivery.

Checks authored documents and the frozen registry; does not require app runtime.
"""
from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[3]
PA2 = ROOT / "docs" / "pa2"
REGISTRY = ROOT / "pa" / "PA2" / "00-id-registry.md"

OWNED = [
    "README.md",
    "06-non-functional-requirements.md",
    "09-use-case-model.md",
    "10-use-case-specifications.md",
    "diagrams/use-case.puml",
    "diagrams/use-case.svg",
    "diagrams/state-transitions.md",
    "notes/quan-feasibility-review.md",
    "uc/UC-02.md",
    "uc/UC-04.md",
    "uc/UC-07.md",
    "uc/UC-08.md",
    "uc/UC-09.md",
]

PATTERNS = {
    "FR": r"\bFR-F\d{2}-\d{2}\b",
    "NFR": r"\bNFR-\d{2}\b",
    "BR": r"\bBR-\d{2}\b",
    "UC": r"\bUC-\d{2}\b",
    "SCR": r"\bSCR-\d{2}\b",
    "AC": r"\bAC-F\d{2}-\d{2}\b",
}

errors = []
warnings = []

if not REGISTRY.is_file():
    errors.append("Missing frozen registry")
else:
    baseline = REGISTRY.read_text(encoding="utf-8")
    registry_ids = {
        category: set(re.findall(pattern, baseline))
        for category, pattern in PATTERNS.items()
    }
    print("Frozen registry unique IDs:", ", ".join(
        f"{category}={len(ids)}" for category, ids in registry_ids.items()
    ))

    if len(registry_ids["FR"]) != 28:
        warnings.append(
            f"Registry narrative says 28 FR, but unique FR IDs count is {len(registry_ids['FR'])}"
        )
    if len(registry_ids["AC"]) != 19:
        warnings.append(
            f"Registry narrative says 19 AC, but unique AC IDs count is {len(registry_ids['AC'])}"
        )

    for relative_path in OWNED:
        path = PA2 / relative_path
        if not path.is_file():
            errors.append(f"Missing Quân deliverable: {relative_path}")
            continue
        if path.suffix not in (".md", ".puml"):
            continue
        body = path.read_text(encoding="utf-8")
        for category, pattern in PATTERNS.items():
            found = set(re.findall(pattern, body))
            unknown = found - registry_ids[category]
            if unknown:
                errors.append(
                    f"{relative_path}: unregistered {category} IDs {sorted(unknown)}"
                )
        if "[TBD" in body or "[TODO" in body:
            errors.append(f"{relative_path}: unresolved template placeholder")

    nfr = (PA2 / "06-non-functional-requirements.md").read_text(encoding="utf-8")
    for n in range(1, 9):
        if not re.search(rf"\|\s*\*\*NFR-{n:02}\*\*\s*\|", nfr):
            errors.append(f"NFR-{n:02} is missing a requirement table row")

    usecase = (PA2 / "diagrams" / "use-case.puml").read_text(encoding="utf-8")
    for n in range(1, 13):
        if f"UC-{n:02}" not in usecase:
            errors.append(f"PlantUML missing UC-{n:02}")
    if "@startuml" not in usecase or "@enduml" not in usecase:
        errors.append("PlantUML missing boundary tokens")

    for uc in (2, 4, 7, 8, 9):
        path = PA2 / "uc" / f"UC-{uc:02}.md"
        if not path.exists():
            continue
        body = path.read_text(encoding="utf-8")
        for section in ("## Main success scenario", "## Alternate and exception flows",
                        "## Trigger, preconditions and guarantees",
                        "## Acceptance and verification"):
            if section not in body and not (
                section == "## Acceptance and verification"
                and "## Traceability and verification" in body
            ):
                errors.append(f"UC-{uc:02} missing section: {section}")

    transitions = (PA2 / "diagrams" / "state-transitions.md").read_text(encoding="utf-8")
    if transitions.count("~~~mermaid") != 3:
        errors.append("Expected three Mermaid state diagrams")

    svg_path = PA2 / "diagrams" / "use-case.svg"
    try:
        svg_text = svg_path.read_text(encoding="utf-8")
        root = ET.fromstring(svg_text)
        if not root.tag.endswith("svg"):
            errors.append("Diagram render is not SVG")
        if "Syntax Error" in svg_text:
            errors.append("PlantUML generated syntax-error diagram")
        if "UC-12" not in svg_text:
            errors.append("SVG missing UC-12 label")
    except (OSError, ET.ParseError) as exc:
        errors.append(f"SVG XML invalid: {exc}")

print("Quân files checked:", len(OWNED))
for message in warnings:
    print("WARNING:", message)
for message in errors:
    print("ERROR:", message)
if errors:
    print("RESULT: FAIL")
    sys.exit(1)
print("RESULT: PASS (document/ID checks only; peer review and runtime tests pending)")
