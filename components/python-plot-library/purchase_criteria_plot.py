from __future__ import annotations

import argparse
import json
from pathlib import Path

from reltest_plot_style import RELTEST_COLORS, apply_reltest_style, save_figure
from svg_animation_targets import prepare_svg_animation_targets


SERIES_COLORS = [
    RELTEST_COLORS["data"],
    RELTEST_COLORS["data_80"],
    RELTEST_COLORS["data_60"],
    RELTEST_COLORS["data_40"],
]


def build_plot(config_path: str | Path, output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    config = json.loads(Path(config_path).read_text(encoding="utf-8"))
    categories = config["categories"]
    if any("\n" in category for category in categories):
        raise ValueError("category labels must stay on one line")
    years = [str(year) for year in config["years"]]
    values = np.asarray(config["values"], dtype=float)
    if values.shape != (len(years), len(categories)):
        raise ValueError("values must have one row per year and one column per category")

    apply_reltest_style()
    fig, ax = plt.subplots(figsize=(16.0, 6.4))
    fig.patch.set_alpha(0)
    ax.set_facecolor("none")
    y = np.arange(len(categories))
    bar_height = 0.17

    ax.axhspan(-0.48, 1.48, color=RELTEST_COLORS["data_20"], alpha=0.42, zorder=0)

    for index, (year, color) in enumerate(zip(years, SERIES_COLORS)):
        offset = (index - (len(years) - 1) / 2) * bar_height
        ax.barh(
            y + offset,
            values[index],
            height=bar_height * 0.9,
            color=color,
            label=year,
            zorder=2,
        )

    ax.set_yticks(y, categories, fontsize=14)
    ax.invert_yaxis()
    ax.set_xlim(0, 100)
    ax.set_xlabel("Anteil der Befragten [%]")
    ax.xaxis.set_major_locator(plt.MultipleLocator(10))
    ax.grid(True, axis="x", which="major", alpha=0.55)
    ax.grid(False, axis="y")
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.legend(
        loc="lower center",
        bbox_to_anchor=(0.5, 1.015),
        ncol=4,
        borderaxespad=0,
        columnspacing=1.8,
    )
    fig.subplots_adjust(left=0.235, right=0.99, top=0.86, bottom=0.15)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(output, {})


def main() -> None:
    parser = argparse.ArgumentParser(description="RelTest purchase-criteria comparison without a visible title.")
    parser.add_argument("--config", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    build_plot(args.config, args.output)


if __name__ == "__main__":
    main()
