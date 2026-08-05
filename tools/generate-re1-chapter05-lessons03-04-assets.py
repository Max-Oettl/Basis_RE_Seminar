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

from advanced_distribution_plots import BUILDERS, load_config  # noqa: E402
from reltest_plot_style import apply_reltest_style  # noqa: E402
from render_formula_svg import render_formula_svg  # noqa: E402


PLOTS = [
    (56, "weibull_density", "weibull_distribution.json", "weibull_density.svg"),
    (57, "weibull_hazard", "weibull_hazard.json", "weibull_hazard.svg"),
    (58, "weibull_hazard", "weibull_hazard.json", "weibull_hazard.svg"),
    (59, "weibull_cdf", "weibull_cdf.json", "weibull_cdf.svg"),
    (63, "weibull_shift", "weibull_shift.json", "weibull_shift.svg"),
    (64, "weibull_paper", "weibull_paper.json", "weibull_paper.svg"),
    (65, "nkw_cdf", "nkw_weibull.json", "nkw_cdf.svg"),
    (66, "nkw_probability", "nkw_weibull.json", "nkw_probability.svg"),
    (67, "weibull_mechanisms", "weibull_mechanisms.json", "weibull_mechanisms.svg"),
    (68, "lognormal_density", "lognormal_distribution.json", "lognormal_density.svg"),
    (69, "lognormal_density", "lognormal_distribution.json", "lognormal_density.svg"),
    (69, "lognormal_hazard", "lognormal_distribution.json", "lognormal_hazard.svg"),
    (69, "lognormal_probability_pair", "lognormal_distribution.json", "lognormal_probability_pair.svg"),
]

FORMULA_SPECS = {
    60: ("weibull_formulas.json", {"density": 36, "failure_probability": 36, "reliability": 36, "hazard": 36}),
    61: ("weibull_characteristic_life.json", {"substitution": 36, "unit_ratio": 36, "independent_of_b": 36, "failure_result": 36, "reliability_result": 36}),
    62: ("weibull_three_parameter.json", {"density": 33, "failure_probability": 33, "reliability": 33, "hazard": 33}),
    65: ("nkw_weibull.json", {"formula": 38}),
    68: ("lognormal_distribution.json", {"transformation": 42}),
    70: ("lognormal_formulas.json", {"density": 34, "failure_probability": 34, "reliability": 34, "hazard": 34, "median": 34}),
}


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


def formula_values(config: dict) -> dict[str, str]:
    if "formulas" in config:
        return config["formulas"]
    values = {}
    if "formula" in config:
        values["formula"] = config["formula"]
    if "transformation" in config:
        values["transformation"] = config["transformation"]
    return values


def generate_formulas() -> None:
    for slide_number, (input_name, font_sizes) in FORMULA_SPECS.items():
        root = slide_root(slide_number)
        config = json.loads((root / "data" / input_name).read_text(encoding="utf-8"))
        formula_dir = root / "formulas"
        formula_dir.mkdir(parents=True, exist_ok=True)
        for formula_id, formula in formula_values(config).items():
            render_formula_svg(
                formula=formula,
                output=formula_dir / f"{formula_id}.svg",
                fontsize=font_sizes[formula_id],
                color="#102A43",
                fontset="dejavusans",
            )


def main() -> None:
    generate_plots()
    generate_formulas()
    print("Generated RE1 chapter 5 lesson 3-4 plot and formula SVG assets.")


if __name__ == "__main__":
    main()
