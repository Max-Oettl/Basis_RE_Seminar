from __future__ import annotations

import json
import shutil
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
PLOT_LIBRARY = REPO_ROOT / "components" / "python-plot-library"
OUTPUT_ROOT = REPO_ROOT / "rebuild-proposals" / "svg" / "RE1"

sys.path.insert(0, str(PLOT_LIBRARY))

from reliability_function_plots import build_reliability_function_summary  # noqa: E402
from advanced_distribution_plots import build_weibull_bathtub_network  # noqa: E402
from reltest_plot_style import apply_reltest_style  # noqa: E402
from svg_animation_targets import prepare_svg_animation_targets  # noqa: E402


def write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def copy_asset(source: Path, destination: Path) -> None:
    if not source.exists():
        raise FileNotFoundError(f"Required reusable asset is missing: {source}")
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)


def group_bathtub_summary_targets(svg_path: Path) -> None:
    """Collapse the detailed plot parts into three teachable summary groups."""
    child_ids = {
        "bathtub_early_span",
        "bathtub_early_divider",
        "bathtub_early_number",
        "bathtub_early_label",
        "bathtub_random_span",
        "bathtub_random_divider",
        "bathtub_random_number",
        "bathtub_random_label",
        "bathtub_wear_span",
        "bathtub_wear_number",
        "bathtub_wear_label",
    }
    tree = ET.parse(svg_path)
    root = tree.getroot()
    for element in root.iter():
        if element.get("id") in child_ids:
            element.attrib.pop("data-anim-target", None)
            element.attrib.pop("data-anim-label", None)
    tree.write(svg_path, encoding="utf-8", xml_declaration=True)
    prepare_svg_animation_targets(
        svg_path,
        {
            "bathtub_curve_path": "Badewannenkurve",
            "bathtub_early_zone": "Frühausfallzone",
            "bathtub_random_zone": "Zufallsausfallzone",
            "bathtub_wear_zone": "Ermüdungsausfallzone",
        },
        sibling_groups=[
            ("bathtub_early_zone", "Frühausfallzone", ["bathtub_early_span", "bathtub_early_divider", "bathtub_early_number", "bathtub_early_label"]),
            ("bathtub_random_zone", "Zufallsausfallzone", ["bathtub_random_span", "bathtub_random_divider", "bathtub_random_number", "bathtub_random_label"]),
            ("bathtub_wear_zone", "Ermüdungsausfallzone", ["bathtub_wear_span", "bathtub_wear_number", "bathtub_wear_label"]),
        ],
    )


def main() -> None:
    apply_reltest_style()

    summary_data = {
        "schema_version": "reltestReliabilityFunctionSummary/v1",
        "distribution": "weibull",
        "characteristic_life": 1.0,
        "shape": 2.0,
        "time_max": 2.4,
        "shared_time_axis": True,
        "functions": ["density", "failure_probability", "hazard", "reliability"],
    }
    summary_data_path = OUTPUT_ROOT / "slide_074" / "data" / "reliability_functions.json"
    write_json(summary_data_path, summary_data)
    plot_path = OUTPUT_ROOT / "slide_074" / "plots" / "reliability_function_summary.svg"
    plot_path.parent.mkdir(parents=True, exist_ok=True)
    build_reliability_function_summary(plot_path, summary_data)

    network_data = {
        "schema_version": "reltestWeibullBathtubNetwork/v1",
        "time_axis": {"minimum": 0.1, "maximum": 100.0, "scale": "logarithmic"},
        "phase_boundaries": [1.0, 10.0],
        "phase_order": ["early", "random", "wear"],
        "weibull_shape_classes": ["b < 1", "b = 1", "b > 1"],
        "schematic": True,
    }
    network_data_path = OUTPUT_ROOT / "slide_077" / "data" / "weibull_bathtub_network.json"
    write_json(network_data_path, network_data)
    network_plot_path = OUTPUT_ROOT / "slide_077" / "plots" / "weibull_bathtub_network.svg"
    network_plot_path.parent.mkdir(parents=True, exist_ok=True)
    build_weibull_bathtub_network(network_data, network_plot_path)

    reusable_assets = [
        ("slide_037/plots/bathtub_curve.svg", "slide_075/plots/bathtub_curve.svg"),
        ("slide_037/plots/bathtub_curve_plot.py", "slide_075/plots/bathtub_curve_plot.py"),
        ("slide_037/formulas/hazard-ratio.svg", "slide_075/formulas/hazard-ratio.svg"),
        ("slide_037/data/plot-data.json", "slide_075/data/plot-data.json"),
        ("slide_037/data/formulas.json", "slide_075/data/formulas.json"),
        ("slide_056/plots/weibull_density.svg", "slide_076/plots/weibull_density.svg"),
        ("slide_056/data/weibull_distribution.json", "slide_076/data/weibull_distribution.json"),
    ]
    for source_relative, target_relative in reusable_assets:
        copy_asset(OUTPUT_ROOT / source_relative, OUTPUT_ROOT / target_relative)

    group_bathtub_summary_targets(OUTPUT_ROOT / "slide_075" / "plots" / "bathtub_curve.svg")

    write_json(
        OUTPUT_ROOT / "slide_075" / "data" / "reuse.json",
        {
            "schema_version": "reltestSceneAssetReuse/v1",
            "source_scene": 37,
            "reused_assets": ["plots/bathtub_curve.svg", "formulas/hazard-ratio.svg"],
            "reason": "Identische Definition, Dreizonenlogik und Badewannenkurve im Zusammenfassungskapitel.",
        },
    )
    write_json(
        OUTPUT_ROOT / "slide_076" / "data" / "reuse.json",
        {
            "schema_version": "reltestSceneAssetReuse/v1",
            "source_scene": 56,
            "reused_assets": ["plots/weibull_density.svg"],
            "generator": "components/python-plot-library/advanced_distribution_plots.py",
            "reason": "Identische Weibull-Kurvenfamilie und Parameterbedeutung.",
        },
    )
    write_json(
        OUTPUT_ROOT / "slide_077" / "data" / "reuse.json",
        {
            "schema_version": "reltestSceneAssetReuse/v1",
            "source_scenes": [37, 67],
            "reused_assets": ["Badewannenkurvenmodell", "segmentierte Weibullnetz-Mechanismen"],
            "generated_asset": "plots/weibull_bathtub_network.svg",
            "generator": "components/python-plot-library/advanced_distribution_plots.py",
            "reason": "Die Zusammenfassung koppelt die bereits verwendete Badewannenkurve aus Szene 37 mit der Mechanismenlogik im Weibullnetz aus Szene 67.",
        },
    )

    print("Generated and reused local assets for RE1 chapter 6 scenes 074-077.")


if __name__ == "__main__":
    main()
