from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


os.environ.setdefault("MPLBACKEND", "Agg")


ROOT = Path(__file__).resolve().parents[1]
PLOT_ROOT = ROOT / "components" / "python-plot-library"
FORMULA_ROOT = ROOT / "components" / "formula-library"
SVG_NS = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG_NS)


FORMULAS = {
    21: {
        "group_survival": r"$P(0\ \mathrm{Ausfälle})=R(t)^n$",
        "alpha_relation": r"$\alpha=R(t)^n$",
        "success_run": r"$P_A=1-\alpha=1-R(t)^n$",
    },
    22: {
        "sample_size": r"$n=\frac{\ln(1-P_A)}{\ln(R(t))}$",
        "sample_size_example": r"$n=\frac{\ln(1-0{,}95)}{\ln(0{,}90)}=28{,}43\Rightarrow29$",
    },
    34: {"duration_ratio": r"$L_V=\frac{t_p}{t}$"},
    36: {"survival_ratio": r"$\frac{\ln(R(t_p))}{\ln(R(t))}=\left(\frac{t_p}{t}\right)^b=L_V^b$"},
    37: {"duration_adjusted_success_run": r"$R(t)=\left(1-P_A\right)^{\frac{1}{L_V^b\cdot n}}$"},
    51: {"acceleration_factor": r"$RF=\frac{t_{\mathrm{Feld}}}{t_{\mathrm{Versuch}}}$"},
    68: {
        "extrapolation_factor": r"$\xi=\frac{x_1-x_0}{x_1-x_2}$",
        "allocation_share": r"$p=\frac{\xi^2}{2\xi^2-1}$",
    },
    71: {
        "extrapolation_example": r"$\xi=\frac{260-180}{260-220}=2$",
        "allocation_example": r"$p=\frac{2^2}{2\cdot2^2-1}\approx67\,\%$",
    },
}


PLOTS = {
    8: ("weibull_confidence", "weibull_confidence_plot.py"),
    10: ("weibull_confidence", "weibull_confidence_plot.py"),
    15: ("weibull_confidence", "weibull_confidence_plot.py"),
    19: ("weibull_confidence", "weibull_confidence_plot.py"),
    29: ("success_run_curves", "re5_test_planning_plots.py"),
    36: ("weibull_probability", "weibull_probability_plot.py"),
    41: ("weibull_confidence", "weibull_confidence_plot.py"),
    49: ("degradation_paths", "re5_test_planning_plots.py"),
    51: ("acceleration_factor", "re5_test_planning_plots.py"),
    54: ("load_life_correlation", "re5_test_planning_plots.py"),
    55: ("test_level_overview", "re5_test_planning_plots.py"),
    62: ("number_of_levels", "re5_test_planning_plots.py"),
    63: ("upper_test_level", "re5_test_planning_plots.py"),
    65: ("lower_test_level", "re5_test_planning_plots.py"),
    68: ("sample_allocation", "re5_test_planning_plots.py"),
    71: ("sample_allocation", "re5_test_planning_plots.py"),
    72: ("monte_carlo_precision", "re5_test_planning_plots.py"),
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--slide", required=True, help="Source/output slide number or 'all'.")
    return parser.parse_args()


def slide_root(slide: int) -> Path:
    return ROOT / "rebuild-proposals" / "svg" / "RE5" / f"slide_{slide:03d}"


def normalize_svg_asset(asset_path: Path, slide: int, asset_kind: str, asset_name: str) -> None:
    tree = ET.parse(asset_path)
    root = tree.getroot()
    root.set("data-qc-role", "plot" if asset_kind == "plot" else "formula")
    root.set("data-qc-group", f"{asset_kind}_asset")
    root.set("data-qc-allow-overlap", "true")
    root.set("data-qc-allow-hidden", "true")
    root.set("data-artifact-scope", "content-svg")
    root.set("data-embedding-target", "powerpoint-slide")
    quality = {
        "artifactScope": "content-svg",
        "embeddingTarget": "powerpoint-slide",
        "slideType": f"technical-{asset_kind}",
        "contentTitle": f"RE5 {asset_name}",
        "layoutIntent": f"re5-slide-{slide:03d}-{asset_name}-{asset_kind}",
        "takeaway": f"Lokales {asset_kind}-Asset für RE5 Szene {slide}.",
        "density": "dense" if asset_kind == "plot" else "low",
        "contentMode": "transparent-content",
        "backgroundMode": "transparent",
        "brandProfile": "reltest-education",
        "brandVariant": "education-production",
    }
    for child in list(root):
        if child.tag == f"{{{SVG_NS}}}metadata" and child.attrib.get("id") == "slide_quality_metadata":
            root.remove(child)
    metadata = ET.Element(f"{{{SVG_NS}}}metadata", {"id": "slide_quality_metadata", "type": "application/json"})
    metadata.text = json.dumps(quality, ensure_ascii=False)
    root.insert(0, metadata)
    shape_tags = {"path", "line", "polyline", "polygon", "rect", "circle", "ellipse", "use", "image"}
    for node in root.iter():
        local = node.tag.rsplit("}", 1)[-1]
        if local == "text":
            node.set("font-family", "Archivo, Arial, Helvetica, sans-serif")
            node.set("font-size", str(max(18, int(float(node.attrib.get("font-size", "18").replace("px", "") or 18)))))
            if "style" in node.attrib:
                node.set("style", re.sub(
                    r"font-size:\s*([0-9.]+)px",
                    lambda match: f"font-size: {max(18.0, float(match.group(1))):g}px",
                    node.attrib["style"],
                ))
            node.set("data-qc-role", "text")
        elif local in shape_tags:
            node.set("data-qc-role", "plot-mark" if asset_kind == "plot" else "formula-stroke")
            node.set("data-role", "diagram-element" if asset_kind == "plot" else "formula-element")
    tree.write(asset_path, encoding="utf-8", xml_declaration=True)


def render_formulas(slide: int) -> None:
    if slide not in FORMULAS:
        return
    sys.path.insert(0, str(FORMULA_ROOT))
    from render_formula_svg import render_formula_svg

    target = slide_root(slide) / "formulas"
    for name, formula in FORMULAS[slide].items():
        asset_path = target / f"{name}.svg"
        render_formula_svg(formula, asset_path, fontsize=38, color="#142452")
        normalize_svg_asset(asset_path, slide, "formula", name)


def plot_config(slide: int, plot_name: str) -> dict:
    common = {"module": "RE5", "source_slides": [slide], "plot": plot_name}
    if plot_name == "success_run_curves":
        return {**common, "confidence_levels": [0.80, 0.90, 0.95], "n_max": 60}
    if plot_name == "degradation_paths":
        return {**common, "seed": 42, "paths": 6, "threshold": 0.28}
    if plot_name == "acceleration_factor":
        return {**common, "shape": 2.2, "field_eta": 80.0, "test_eta": 24.0}
    if plot_name == "monte_carlo_precision":
        return {**common, "seed": 20260821, "sample_sizes": [4, 40]}
    if plot_name in {"test_level_overview", "number_of_levels", "upper_test_level", "lower_test_level", "sample_allocation"}:
        return {**common, "field_level": 0.36, "upper_level": 0.62, "lower_level": 0.47, "mechanism_limit": 0.68}
    if plot_name == "weibull_confidence":
        return {**common, "times": [12, 18, 27, 44, 68, 105, 160], "lower_bound": 0.05, "upper_bound": 0.95, "bootstrap_samples": 1800, "seed": 42}
    if plot_name == "weibull_probability":
        return {**common, "times": [12, 18, 27, 44, 68, 105, 160]}
    return common


def render_plot(slide: int) -> None:
    if slide not in PLOTS:
        return
    plot_name, generator = PLOTS[slide]
    target = slide_root(slide)
    data_dir = target / "data"
    plot_dir = target / "plots"
    data_dir.mkdir(parents=True, exist_ok=True)
    plot_dir.mkdir(parents=True, exist_ok=True)
    config_path = data_dir / f"{plot_name}.json"
    output_path = plot_dir / f"{plot_name}.svg"
    config = plot_config(slide, plot_name)
    config["source_slides"] = {
        8: [8, 9], 10: [10, 11, 12, 13, 14], 15: [15, 16, 17, 18],
        19: [19, 20], 41: [41, 42, 43],
    }.get(slide, [slide])
    config_path.write_text(json.dumps(config, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if generator == "re5_test_planning_plots.py":
        command = [sys.executable, str(PLOT_ROOT / generator), "--plot", plot_name, "--input", str(config_path), "--output", str(output_path)]
    elif generator == "weibull_confidence_plot.py":
        command = [
            sys.executable, str(PLOT_ROOT / generator),
            "--xlabel", "Lebensdauer t", "--ylabel", "Ausfallwahrscheinlichkeit F(t) [%]",
            "--times", ",".join(map(str, config["times"])),
            "--lower-bound", str(config["lower_bound"]), "--upper-bound", str(config["upper_bound"]),
            "--bootstrap-samples", str(config["bootstrap_samples"]), "--seed", str(config["seed"]),
            "--output", str(output_path),
        ]
    else:
        command = [
            sys.executable, str(PLOT_ROOT / generator),
            "--xlabel", "Lebensdauer t", "--ylabel", "Ausfallwahrscheinlichkeit F(t) [%]",
            "--times", ",".join(map(str, config["times"])), "--output", str(output_path),
        ]
    subprocess.run(command, cwd=ROOT, check=True)
    normalize_svg_asset(output_path, slide, "plot", plot_name)


def main() -> None:
    args = parse_args()
    slides = sorted(set(FORMULAS) | set(PLOTS)) if args.slide == "all" else [int(args.slide)]
    for slide in slides:
        render_formulas(slide)
        render_plot(slide)
        print(f"RE5 assets ready for slide_{slide:03d}")


if __name__ == "__main__":
    main()
