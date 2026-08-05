from __future__ import annotations

import argparse
import json
from pathlib import Path
import xml.etree.ElementTree as ET

from reltest_plot_style import RELTEST_COLORS, apply_reltest_style, save_figure, style_axes
from svg_animation_targets import prepare_svg_animation_targets


SVG_NAMESPACE = "http://www.w3.org/2000/svg"


def add_quality_metadata(svg_path: str | Path) -> None:
    ET.register_namespace("", SVG_NAMESPACE)
    tree = ET.parse(svg_path)
    root = tree.getroot()
    root.set("data-artifact-scope", "content-svg")
    root.set("data-embedding-target", "powerpoint-slide")
    root.set("data-brand-profile", "reltest-education")
    root.set("data-qc-group", "bathtub_curve_plot")
    root.set("data-qc-layer", "plot")

    metadata = ET.Element(
        f"{{{SVG_NAMESPACE}}}metadata",
        {
            "id": "slide-quality-metadata",
            "type": "application/json",
        },
    )
    metadata.text = json.dumps(
        {
            "artifactScope": "content-svg",
            "embeddingTarget": "powerpoint-slide",
            "slideType": "schematic-bathtub-curve-plot",
            "contentTitle": "Badewannenkurve",
            "layoutIntent": "wide-three-region-technical-plot",
            "takeaway": "Der Ausfallverlauf gliedert sich in Früh-, Zufalls- und Ermüdungsausfälle.",
            "audienceGoal": "Die drei Lebensphasen des Ausfallverlaufs unterscheiden.",
            "density": "normal",
            "contentMode": "transparent-content",
            "backgroundMode": "transparent",
            "brandProfile": "reltest-education",
            "brandVariant": "education-technical",
            "designException": "Das Plotasset ist bewusst breit, weil es als szenenlokales Teilasset eingebettet wird.",
        },
        ensure_ascii=False,
    )
    root.insert(0, metadata)

    for element in root.iter():
        if element.get("id") == "bathtub_curve_path":
            element.set("data-qc-role", "data-series")
            element.set("data-qc-layer", "data")
        if element.get("data-anim-target") == "true":
            element.set("data-qc-group", element.get("id", "plot_target"))
            element.set("data-qc-layer", "data")
            element.set("data-qc-allow-hidden", "true")

    tree.write(svg_path, encoding="utf-8", xml_declaration=True)


def build_plot(
    output: str | Path,
    variant: str = "reduction",
    xlabel: str = "Lebensdauer $t$",
    ylabel: str = r"Ausfallrate $\lambda(t)$",
) -> None:
    import matplotlib.pyplot as plt
    import numpy as np
    from matplotlib.collections import LineCollection, PatchCollection
    from matplotlib.patches import FancyArrow

    apply_reltest_style()
    x = np.linspace(0.08, 10, 600)
    early = 1.85 * np.exp(-1.45 * x)
    random = np.full_like(x, 0.22)
    wear = 0.035 * np.exp(1.0 * np.maximum(x - 7.0, 0))
    curve = early + random + wear
    reduced_curve = 0.42 * early + 0.84 * random + 0.52 * wear

    if variant == "source_aligned":
        fig, ax = plt.subplots(figsize=(15.8, 5.9))
        fig.patch.set_alpha(0)
        ax.set_facecolor("none")
        ax.set_xlim(0, 10)
        plot_max = curve.max() * 1.28
        ax.set_ylim(0, plot_max)
        ax.set_xticks([])
        ax.set_yticks([])
        ax.grid(False)
        for spine in ax.spines.values():
            spine.set_visible(False)

        line = ax.plot(
            x,
            curve,
            color=RELTEST_COLORS["ink"],
            linewidth=4.2,
            solid_capstyle="round",
            zorder=4,
        )[0]
        line.set_gid("bathtub_curve_path")

        ax.annotate(
            "",
            xy=(10.20, 0),
            xytext=(0, 0),
            arrowprops={
                "arrowstyle": "-|>",
                "color": RELTEST_COLORS["ink"],
                "linewidth": 2.6,
                "mutation_scale": 20,
                "shrinkA": 0,
                "shrinkB": 0,
            },
            annotation_clip=False,
            zorder=6,
        )
        ax.annotate(
            "",
            xy=(0, plot_max * 1.08),
            xytext=(0, 0),
            arrowprops={
                "arrowstyle": "-|>",
                "color": RELTEST_COLORS["ink"],
                "linewidth": 2.6,
                "mutation_scale": 20,
                "shrinkA": 0,
                "shrinkB": 0,
            },
            annotation_clip=False,
            zorder=6,
        )

        for position in (3.0, 7.0):
            ax.vlines(
                position,
                -plot_max * 0.055,
                plot_max * 1.10,
                color=RELTEST_COLORS["ink"],
                linewidth=2.0,
                clip_on=False,
                zorder=2,
            )

        label_y = plot_max * 1.22
        number_y = plot_max * 1.08
        for number, position, label in [
            (1, 1.5, "Frühausfälle"),
            (2, 5.0, "Zufallsausfälle"),
            (3, 8.5, "Ermüdungsausfälle"),
        ]:
            ax.text(
                position,
                label_y,
                label,
                ha="center",
                va="center",
                fontsize=24,
                weight="bold",
                color=RELTEST_COLORS["ink"],
                clip_on=False,
                zorder=7,
            )
            ax.text(
                position,
                number_y,
                str(number),
                ha="center",
                va="center",
                fontsize=18,
                weight="bold",
                color=RELTEST_COLORS["ink"],
                bbox={
                    "boxstyle": "circle,pad=0.34",
                    "facecolor": "#FFFFFF",
                    "edgecolor": RELTEST_COLORS["ink"],
                    "linewidth": 1.6,
                },
                clip_on=False,
                zorder=7,
            )

        ax.set_xlabel(xlabel, fontsize=22, weight="bold", labelpad=18)
        ax.set_ylabel(ylabel, fontsize=22, weight="bold", labelpad=20)
        ax.xaxis.set_label_coords(0.5, -0.10)
        ax.yaxis.set_label_coords(-0.055, 0.48)
        fig.subplots_adjust(left=0.075, right=0.975, bottom=0.15, top=0.76)
        save_figure(fig, output, transparent=True)
        plt.close(fig)
        prepare_svg_animation_targets(
            output,
            {"bathtub_curve_path": "Badewannenkurve mit drei Lebensphasen"},
        )
        add_quality_metadata(output)
        return

    fig, ax = plt.subplots(figsize=(15.8, 4.8))
    fig.patch.set_alpha(0)
    ax.set_facecolor("none")
    style_axes(ax, xlabel, ylabel)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, curve.max() * 1.34)
    ax.set_xticks([])
    ax.set_yticks([])

    early_span = ax.axvspan(0, 3.0, color=RELTEST_COLORS["accent"], alpha=0.08, zorder=0)
    early_span.set_gid("bathtub_early_span")
    random_span = ax.axvspan(3.0, 7.0, color=RELTEST_COLORS["support"], alpha=0.07, zorder=0)
    random_span.set_gid("bathtub_random_span")
    wear_span = ax.axvspan(7.0, 10.0, color=RELTEST_COLORS["warning"], alpha=0.09, zorder=0)
    wear_span.set_gid("bathtub_wear_span")
    line = ax.plot(x, curve, color=RELTEST_COLORS["ink"], linewidth=4.0, zorder=4)[0]
    line.set_gid("bathtub_curve_path")

    def reduction_effect(mask: np.ndarray, arrow_positions: tuple[float, ...], gid: str) -> None:
        curve_id = f"{gid}_curve"
        arrows_id = f"{gid}_arrows"
        collection = LineCollection(
            [np.column_stack((x[mask], reduced_curve[mask]))],
            colors=RELTEST_COLORS["data"],
            linewidths=3.2,
            capstyle="round",
            joinstyle="round",
            zorder=5,
        )
        collection.set_gid(curve_id)
        ax.add_collection(collection)

        arrows = []
        for position in arrow_positions:
            index = int(np.abs(x - position).argmin())
            top = curve[index] - 0.035
            bottom = reduced_curve[index] + 0.035
            arrows.append(
                FancyArrow(
                    position,
                    top,
                    0,
                    bottom - top,
                    width=0.055,
                    head_width=0.22,
                    head_length=0.105,
                    length_includes_head=True,
                )
            )
        arrow_collection = PatchCollection(
            arrows,
            facecolor=RELTEST_COLORS["data"],
            edgecolor=RELTEST_COLORS["data"],
            linewidth=0.8,
            zorder=6,
        )
        arrow_collection.set_gid(arrows_id)
        ax.add_collection(arrow_collection)
        reduction_groups.append((gid, "", [curve_id, arrows_id]))

    reduction_groups: list[tuple[str, str, list[str]]] = []
    if variant == "reduction":
        reduction_effect(x <= 7.05, (0.65, 1.20), "qualitative_plot_effect")
        reduction_effect(x >= 6.95, (9.30, 9.70), "quantitative_plot_effect")

    early_divider = ax.axvline(3.0, color=RELTEST_COLORS["muted"], linewidth=1.4, linestyle="--")
    early_divider.set_gid("bathtub_early_divider")
    random_divider = ax.axvline(7.0, color=RELTEST_COLORS["muted"], linewidth=1.4, linestyle="--")
    random_divider.set_gid("bathtub_random_divider")
    label_y = curve.max() * 0.96
    phase_colors = [RELTEST_COLORS["accent"], RELTEST_COLORS["support"], RELTEST_COLORS["warning"]]
    phase_specs = [
        ("early", 1, 1.5, "Frühausfälle", phase_colors[0]),
        ("random", 2, 5.0, "Zufallsausfälle", phase_colors[1]),
        ("wear", 3, 8.5, "Ermüdungsausfälle", phase_colors[2]),
    ]
    for key, number, position, label, color in phase_specs:
        number_text = ax.text(
            position,
            label_y,
            str(number),
            ha="center",
            va="center",
            fontsize=18,
            weight="bold",
            color=color,
            bbox={"boxstyle": "circle,pad=0.34", "facecolor": "#FFFFFF", "edgecolor": color, "linewidth": 1.5},
            zorder=7,
        )
        number_id = f"bathtub_{key}_number"
        number_text.set_gid(number_id)
        label_text = ax.text(position, curve.max() * 0.82, label, ha="center", fontsize=18, weight="bold", color=color)
        label_id = f"bathtub_{key}_label"
        label_text.set_gid(label_id)

    fig.tight_layout(pad=0.8)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    targets = {
        "bathtub_curve_path": "Ausgangsverlauf der Badewannenkurve",
        "bathtub_early_span": "Hintergrund der Frühausfallzone",
        "bathtub_early_divider": "Grenze der Frühausfallzone",
        "bathtub_early_number": "Nummer der Frühausfallzone",
        "bathtub_early_label": "Beschriftung der Frühausfallzone",
        "bathtub_random_span": "Hintergrund der Zufallsausfallzone",
        "bathtub_random_divider": "Grenze der Zufallsausfallzone",
        "bathtub_random_number": "Nummer der Zufallsausfallzone",
        "bathtub_random_label": "Beschriftung der Zufallsausfallzone",
        "bathtub_wear_span": "Hintergrund der Ermüdungsausfallzone",
        "bathtub_wear_number": "Nummer der Ermüdungsausfallzone",
        "bathtub_wear_label": "Beschriftung der Ermüdungsausfallzone",
    }
    if variant == "reduction":
        targets.update(
            {
                "qualitative_plot_effect": "Risikoreduktion im Frühausfallbereich",
                "quantitative_plot_effect": "Reduktion im Ermüdungsbereich",
            }
        )
    prepare_svg_animation_targets(output, targets, sibling_groups=reduction_groups)
    add_quality_metadata(output)


def main() -> None:
    parser = argparse.ArgumentParser(description="RelTest bathtub curve without a visible title.")
    parser.add_argument("--output", required=True)
    parser.add_argument("--variant", choices=("reduction", "standard", "source_aligned"), default="reduction")
    parser.add_argument("--xlabel", default="Lebensdauer $t$")
    parser.add_argument("--ylabel", default=r"Ausfallrate $\lambda(t)$")
    args = parser.parse_args()
    build_plot(args.output, variant=args.variant, xlabel=args.xlabel, ylabel=args.ylabel)


if __name__ == "__main__":
    main()
