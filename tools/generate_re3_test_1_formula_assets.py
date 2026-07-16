#!/usr/bin/env python3
"""Generate formula SVG assets for the RE3_TEST_1 comparison workflow."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
REGISTRY_PATH = REPO_ROOT / "components" / "formula-library" / "formula-registry.json"
RENDERER_PATH = REPO_ROOT / "components" / "formula-library" / "render_formula_svg.py"


def load_renderer():
    spec = importlib.util.spec_from_file_location("render_formula_svg", RENDERER_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Could not load renderer from {RENDERER_PATH}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.render_formula_svg


def main() -> None:
    registry = json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))
    defaults = registry["default_style"]
    module = registry["modules"]["RE3_TEST_1"]
    asset_root = REPO_ROOT / module["asset_root"]
    render_formula_svg = load_renderer()

    for key, item in module["formulas"].items():
        output = asset_root / item["asset"]
        render_formula_svg(
            item["formula"],
            output,
            fontsize=item.get("fontsize", defaults["fontsize"]),
            color=item.get("color", defaults["color"]),
            fontset=item.get("fontset", defaults["fontset"]),
        )
        print(f"{key}: {output.relative_to(REPO_ROOT).as_posix()}")


if __name__ == "__main__":
    main()
