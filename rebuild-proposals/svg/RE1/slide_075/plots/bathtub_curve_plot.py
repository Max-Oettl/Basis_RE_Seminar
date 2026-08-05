from __future__ import annotations

import argparse
from pathlib import Path

from reltest_plot_style import RELTEST_COLORS, apply_reltest_style, save_figure, style_axes
from svg_animation_targets import prepare_svg_animation_targets


def build_plot(output: str | Path, variant: str = "reduction") -> None:
    import matplotlib.pyplot as plt
    import numpy as np
    from matplotlib.collections import LineCollection

    apply_reltest_style()
    x = np.linspace(0.08, 10, 600)
    early = 1.85 * np.exp(-1.45 * x)
    random = np.full_like(x, 0.22)
    wear = 0.035 * np.exp(1.0 * np.maximum(x - 7.0, 0))
    curve = early + random + wear
    reduced_curve = 0.42 * early + 0.84 * random + 0.52 * wear

    fig, ax = plt.subplots(figsize=(12.6, 5.8))
    fig.patch.set_alpha(0)
    ax.set_facecolor("none")
    style_axes(ax, "Lebensdauer $t$", r"Ausfallrate $\lambda(t)$")
    ax.set_xlim(0, 10)
    ax.set_ylim(0, curve.max() * 1.14)
    ax.set_xticks([])
    ax.set_yticks([])

    ax.axvspan(0, 3.0, color="#D1495B", alpha=0.08, zorder=0)
    ax.axvspan(3.0, 7.0, color="#007EA7", alpha=0.07, zorder=0)
    ax.axvspan(7.0, 10.0, color="#B7791F", alpha=0.09, zorder=0)
    line = ax.plot(x, curve, color=RELTEST_COLORS["ink"], linewidth=4.0, zorder=4)[0]
    line.set_gid("bathtub_curve_path")

    def reduction_effect(mask: np.ndarray, arrow_positions: tuple[float, ...], gid: str) -> None:
        segments: list[np.ndarray] = [np.column_stack((x[mask], reduced_curve[mask]))]
        for position in arrow_positions:
            index = int(np.abs(x - position).argmin())
            top = curve[index] - 0.04
            bottom = reduced_curve[index] + 0.05
            head_width = 0.10
            head_height = 0.08
            segments.extend(
                [
                    np.array([[position, top], [position, bottom]]),
                    np.array([[position, bottom], [position - head_width, bottom + head_height]]),
                    np.array([[position, bottom], [position + head_width, bottom + head_height]]),
                ]
            )
        collection = LineCollection(
            segments,
            colors=RELTEST_COLORS["data"],
            linewidths=3.2,
            capstyle="round",
            joinstyle="round",
            zorder=5,
        )
        collection.set_gid(gid)
        ax.add_collection(collection)

    if variant == "reduction":
        reduction_effect(x <= 7.05, (0.75, 1.55, 2.35), "qualitative_plot_effect")
        reduction_effect(x >= 6.95, (8.05, 8.75, 9.35), "quantitative_plot_effect")

    ax.axvline(3.0, color=RELTEST_COLORS["muted"], linewidth=1.4, linestyle="--")
    ax.axvline(7.0, color=RELTEST_COLORS["muted"], linewidth=1.4, linestyle="--")
    label_y = curve.max() * 0.96
    for number, position, color in [(1, 1.5, "#9F3443"), (2, 5.0, "#00698A"), (3, 8.5, "#8A5A17")]:
        ax.text(
            position,
            label_y,
            str(number),
            ha="center",
            va="center",
            weight="bold",
            color=color,
            bbox={"boxstyle": "circle,pad=0.34", "facecolor": "#FFFFFF", "edgecolor": color, "linewidth": 1.5},
            zorder=7,
        )
    ax.text(1.5, 0.075, "Frühausfälle", ha="center", weight="bold", color="#9F3443")
    ax.text(5.0, 0.075, "Zufallsausfälle", ha="center", weight="bold", color="#00698A")
    ax.text(8.5, 0.075, "Ermüdungsausfälle", ha="center", weight="bold", color="#8A5A17")

    fig.tight_layout(pad=0.8)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    targets = {"bathtub_curve_path": "Ausgangsverlauf der Badewannenkurve"}
    if variant == "reduction":
        targets.update(
            {
                "qualitative_plot_effect": "Risikoreduktion im Frühausfallbereich",
                "quantitative_plot_effect": "Reduktion im Ermüdungsbereich",
            }
        )
    prepare_svg_animation_targets(output, targets)


def main() -> None:
    parser = argparse.ArgumentParser(description="RelTest bathtub curve without a visible title.")
    parser.add_argument("--output", required=True)
    parser.add_argument("--variant", choices=("reduction", "standard"), default="reduction")
    args = parser.parse_args()
    build_plot(args.output, variant=args.variant)


if __name__ == "__main__":
    main()
