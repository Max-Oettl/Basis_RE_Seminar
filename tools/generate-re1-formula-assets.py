#!/usr/bin/env python3
"""Generate every dedicated formula SVG used by the RE1 full-slide redesign."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
FORMULA_LIBRARY = REPO_ROOT / "components" / "formula-library"
OUTPUT_ROOT = REPO_ROOT / "rebuild-proposals" / "svg" / "RE1"

sys.path.insert(0, str(FORMULA_LIBRARY))

from render_formula_svg import render_formula_svg  # noqa: E402


DEEP = "#031334"
WHITE = "#FFFFFF"

# Formula notation remains in the slide-local data files.  This table only
# defines how each slide's source schema maps to output assets and nominal size.
SLIDE_SPECS = {
    33: {"data": "formulas.json", "kind": "assets", "sizes": {"cdf-integral.svg": 42, "cdf-derivative.svg": 42}},
    36: {
        "data": "formulas.json",
        "kind": "assets",
        "sizes": {"reliability-complement.svg": 40, "failure-area-integral.svg": 38, "reliability-area-integral.svg": 38},
        "colors": {"reliability-complement.svg": WHITE},
    },
    37: {"data": "formulas.json", "kind": "assets", "sizes": {"hazard-ratio.svg": 40}, "colors": {"hazard-ratio.svg": WHITE}},
    41: {"data": "location_measure.json", "kind": "formula_asset", "sizes": {"mean.svg": 38}},
    42: {"data": "location_measure.json", "kind": "formula_asset", "sizes": {"median.svg": 42}},
    43: {"data": "location_measure.json", "kind": "formula_asset", "sizes": {"mode.svg": 42}},
    46: {"data": "mttf.json", "kind": "formula_asset", "sizes": {"mttf.svg": 34}},
    52: {"data": "normal_formulas.json", "kind": "formulas", "sizes": {"*": 39}},
    55: {"data": "exponential_formulas.json", "kind": "formulas", "sizes": {"*": 42}},
    60: {"data": "weibull_formulas.json", "kind": "formulas", "sizes": {"*": 36}},
    61: {"data": "weibull_characteristic_life.json", "kind": "formulas", "sizes": {"*": 36}},
    62: {"data": "weibull_three_parameter.json", "kind": "formulas", "sizes": {"*": 33}},
    65: {"data": "nkw_weibull.json", "kind": "formula", "sizes": {"formula.svg": 38}},
    68: {"data": "lognormal_distribution.json", "kind": "transformation", "sizes": {"transformation.svg": 42}},
    70: {"data": "lognormal_formulas.json", "kind": "formulas", "sizes": {"*": 34}},
    75: {"data": "formulas.json", "kind": "assets", "sizes": {"hazard-ratio.svg": 40}, "colors": {"hazard-ratio.svg": WHITE}},
}


def slide_root(slide: int) -> Path:
    return OUTPUT_ROOT / f"slide_{slide:03d}"


def parse_slide_filter(value: str) -> set[int] | None:
    if not value:
        return None
    slides: set[int] = set()
    for item in value.split(","):
        item = item.strip()
        if not item:
            continue
        if "-" in item:
            start, end = (int(part) for part in item.split("-", 1))
            slides.update(range(min(start, end), max(start, end) + 1))
        else:
            slides.add(int(item))
    return slides


def extract_formulas(config: dict, kind: str) -> dict[str, str]:
    if kind == "assets":
        return {item["file"]: item["formula"] for item in config["assets"]}
    if kind == "formula_asset":
        item = config["formula_asset"]
        return {item["file"]: item["formula"]}
    if kind == "formulas":
        return {f"{name}.svg": formula for name, formula in config["formulas"].items()}
    if kind == "formula":
        return {"formula.svg": config["formula"]}
    if kind == "transformation":
        return {"transformation.svg": config["transformation"]}
    raise ValueError(f"Unsupported formula source kind: {kind}")


def configured_assets() -> set[Path]:
    assets: set[Path] = set()
    for slide, spec in SLIDE_SPECS.items():
        config = json.loads((slide_root(slide) / "data" / spec["data"]).read_text(encoding="utf-8"))
        for filename in extract_formulas(config, spec["kind"]):
            assets.add(slide_root(slide) / "formulas" / filename)
    return assets


def existing_assets() -> set[Path]:
    return set(OUTPUT_ROOT.glob("slide_*/formulas/*.svg"))


def validate_inventory() -> None:
    configured = configured_assets()
    existing = existing_assets()
    missing_specs = sorted(existing - configured)
    missing_files = sorted(configured - existing)
    if missing_specs or missing_files:
        details = []
        if missing_specs:
            details.append("assets without generator spec: " + ", ".join(str(path.relative_to(REPO_ROOT)) for path in missing_specs))
        if missing_files:
            details.append("configured assets not present yet: " + ", ".join(str(path.relative_to(REPO_ROOT)) for path in missing_files))
        raise RuntimeError("RE1 formula inventory mismatch; " + "; ".join(details))


def generate(slide_filter: set[int] | None = None) -> list[Path]:
    validate_inventory()
    outputs: list[Path] = []
    for slide, spec in sorted(SLIDE_SPECS.items()):
        if slide_filter is not None and slide not in slide_filter:
            continue
        root = slide_root(slide)
        config = json.loads((root / "data" / spec["data"]).read_text(encoding="utf-8"))
        formulas = extract_formulas(config, spec["kind"])
        for filename, formula in formulas.items():
            fontsize = spec["sizes"].get(filename, spec["sizes"].get("*"))
            if fontsize is None:
                raise RuntimeError(f"Missing nominal font size for slide {slide}, {filename}")
            color = spec.get("colors", {}).get(filename, DEEP)
            output = root / "formulas" / filename
            render_formula_svg(formula, output, fontsize=fontsize, color=color, fontset="stix")
            outputs.append(output)
    return outputs


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--slides", default="", help="Optional slide list/range, e.g. 33,36-46.")
    args = parser.parse_args()
    outputs = generate(parse_slide_filter(args.slides))
    print(f"Generated {len(outputs)} RE1 formula SVG asset(s) with STIX path glyphs.")


if __name__ == "__main__":
    main()
