from __future__ import annotations

import argparse
import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np

from reltest_plot_style import BRAND_COLORS, apply_reltest_style, save_figure


def build_plot(output: Path, data_output: Path) -> None:
    apply_reltest_style()
    time = np.linspace(0.55, 2.35, 5)
    probability = np.linspace(0.0, 100.0, 280)
    medians = (1.0 - np.exp(-((time / 1.45) ** 2.15))) * 100.0
    sigma = 8.5

    fig = plt.figure(figsize=(12.8, 7.2))
    ax = fig.add_subplot(111, projection="3d")
    ax.set_facecolor(BRAND_COLORS["surfaceSoft"])
    for index, (time_value, median) in enumerate(zip(time, medians, strict=True)):
        density = np.exp(-0.5 * ((probability - median) / sigma) ** 2)
        density = density / density.max() * 6.5
        ridge, = ax.plot(
            np.full_like(probability, time_value),
            probability,
            density,
            color=BRAND_COLORS["navy80"],
            linewidth=2.6,
        )
        ridge.set_gid(f"plot_density_ridge_{index + 1}")
        ax.plot(
            [time_value, time_value],
            [median, median],
            [0.0, 6.5],
            color=BRAND_COLORS["navy60"],
            linewidth=1.2,
            alpha=0.7,
        )
    median_line, = ax.plot(
        time,
        medians,
        np.zeros_like(time),
        color=BRAND_COLORS["educationSteelCyan"],
        linewidth=3.0,
        marker="o",
        markersize=5,
    )
    median_line.set_gid("plot_weibull_median_line")
    ax.set_xlabel("Lebensdauer t", labelpad=14)
    ax.set_ylabel("Ausfallwahrscheinlichkeit F(t) [%]", labelpad=14)
    ax.set_zlabel("Dichte", labelpad=12)
    ax.set_ylim(0, 100)
    ax.set_zlim(0, 7)
    ax.view_init(elev=25, azim=-54)
    ax.tick_params(labelsize=13)
    ax.xaxis.pane.set_facecolor(BRAND_COLORS["surface"])
    ax.yaxis.pane.set_facecolor(BRAND_COLORS["surface"])
    ax.zaxis.pane.set_facecolor(BRAND_COLORS["surface"])
    ax.grid(True, alpha=0.45)
    fig.subplots_adjust(left=0.02, right=0.95, bottom=0.06, top=0.98)
    save_figure(fig, output)
    plt.close(fig)

    data_output.parent.mkdir(parents=True, exist_ok=True)
    data_output.write_text(
        json.dumps(
            {
                "schema_version": "reltestPlotData/v1",
                "diagram_type": "failure_probability_surface_plot",
                "time": [round(float(value), 5) for value in time],
                "median_failure_probability_percent": [round(float(value), 5) for value in medians],
                "density_sigma_percent": sigma,
                "model": "F(t)=1-exp(-(t/1.45)^2.15); Gaussian didactic density around each median",
                "note": "Didaktische Darstellung der Dichte plausibler Ausfallwahrscheinlichkeiten je Zeitpunkt; keine Messdaten.",
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--data-output", type=Path, required=True)
    args = parser.parse_args()
    build_plot(args.output, args.data_output)


if __name__ == "__main__":
    main()
