from __future__ import annotations

import json
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
PLOT_LIBRARY = REPO_ROOT / "components" / "python-plot-library"
FORMULA_LIBRARY = REPO_ROOT / "components" / "formula-library"
OUTPUT_ROOT = REPO_ROOT / "rebuild-proposals" / "svg" / "RE1"

sys.path.insert(0, str(PLOT_LIBRARY))
sys.path.insert(0, str(FORMULA_LIBRARY))

from distribution_model_plots import BUILDERS, load_config  # noqa: E402
from reltest_plot_style import apply_reltest_style  # noqa: E402
from render_formula_svg import render_formula_svg  # noqa: E402


PLOTS = [
    (50, "normal_density", "normal_distribution.json", "normal_density.svg"),
    (51, "normal_hazard", "normal_distribution.json", "normal_hazard.svg"),
    (51, "normal_cdf", "normal_distribution.json", "normal_cdf.svg"),
    (53, "exponential_density", "exponential_distribution.json", "exponential_density.svg"),
    (54, "exponential_hazard", "exponential_distribution.json", "exponential_hazard.svg"),
    (54, "exponential_cdf", "exponential_distribution.json", "exponential_cdf.svg"),
]

FORMULA_SETS = [
    (52, "normal_formulas.json", 39),
    (55, "exponential_formulas.json", 42),
]


def slide_root(number: int) -> Path:
    return OUTPUT_ROOT / f"slide_{number:03d}"


def generate_plots() -> None:
    apply_reltest_style()
    for slide_number, plot_name, input_name, output_name in PLOTS:
        root = slide_root(slide_number)
        config = load_config(root / "data" / input_name)
        output = root / "plots" / output_name
        output.parent.mkdir(parents=True, exist_ok=True)
        BUILDERS[plot_name](config, output)


def generate_formulas() -> None:
    for slide_number, input_name, fontsize in FORMULA_SETS:
        root = slide_root(slide_number)
        config = json.loads((root / "data" / input_name).read_text(encoding="utf-8"))
        formula_dir = root / "formulas"
        formula_dir.mkdir(parents=True, exist_ok=True)
        for formula_id, formula in config["formulas"].items():
            render_formula_svg(
                formula=formula,
                output=formula_dir / f"{formula_id}.svg",
                fontsize=fontsize,
                color="#102A43",
                fontset="dejavusans",
            )


def main() -> None:
    generate_plots()
    generate_formulas()
    print("Generated RE1 chapter 5 lesson 1-2 plot and formula SVG assets.")


if __name__ == "__main__":
    main()
