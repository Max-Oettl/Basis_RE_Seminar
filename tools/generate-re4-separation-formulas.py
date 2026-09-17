#!/usr/bin/env python3
"""Generate the controlled formula assets for the two RE4 separation scenes."""

from __future__ import annotations

import sys
import json
import re
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
FORMULA_LIBRARY = REPO_ROOT / "components" / "formula-library"
OUTPUT_ROOT = REPO_ROOT / "rebuild-proposals" / "svg" / "RE4" / "slide_058" / "formulas"

sys.path.insert(0, str(FORMULA_LIBRARY))
from render_formula_svg import render_formula_svg  # noqa: E402


FORMULAS = (
    (
        "bridge-case-working.svg",
        r"$R_{\mathrm{I}} = R_5 \cdot \left[1-(1-R_1)(1-R_2)\right]\cdot\left[1-(1-R_3)(1-R_4)\right]$",
        30,
    ),
    (
        "bridge-case-failed.svg",
        r"$R_{\mathrm{II}} = (1-R_5)\cdot\left\{1-\left[1-R_1R_3\right]\left[1-R_2R_4\right]\right\}$",
        30,
    ),
    ("bridge-total.svg", r"$R_S = R_{\mathrm{I}} + R_{\mathrm{II}}$", 38),
    (
        "bridge-expanded-working.svg",
        r"$R_S = R_5\left[1-(1-R_1)(1-R_2)\right]\left[1-(1-R_3)(1-R_4)\right]$",
        26,
    ),
    (
        "bridge-expanded-failed.svg",
        r"$\quad + (1-R_5)\left\{1-\left[1-R_1R_3\right]\left[1-R_2R_4\right]\right\}$",
        26,
    ),
)


def main() -> None:
    for filename, formula, fontsize in FORMULAS:
        output = OUTPUT_ROOT / filename
        render_formula_svg(
            formula,
            output,
            fontsize=fontsize,
            color="#142452",
            fontset="stix",
        )
        quality = {
            "artifactScope": "content-svg",
            "embeddingTarget": "powerpoint-slide",
            "slideType": "formula-asset",
            "contentTitle": f"Formel · {output.stem}",
            "layoutIntent": f"re4-slide_058-{output.stem}-formula",
            "takeaway": formula.strip("$"),
            "density": "low",
            "contentMode": "transparent-content",
            "backgroundMode": "transparent",
            "brandProfile": "reltest-education",
            "brandVariant": "education-production",
        }
        source = output.read_text(encoding="utf-8")
        source = re.sub(
            r"<svg\b",
            '<svg data-artifact-scope="content-svg" data-embedding-target="powerpoint-slide" '
            'data-brand-profile="reltest-education" role="img"',
            source,
            count=1,
        )
        svg_start = source.index("<svg")
        root_end = source.index(">", svg_start) + 1
        metadata = (
            '<metadata id="slide_quality_metadata" type="application/json"><![CDATA['
            + json.dumps(quality, ensure_ascii=False, separators=(",", ":"))
            + "]]></metadata>"
        )
        source = source[:root_end] + metadata + source[root_end:]
        output.write_text(source, encoding="utf-8")
        print(f"generated {output}")


if __name__ == "__main__":
    main()
