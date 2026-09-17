from __future__ import annotations

import argparse
import json
import math
from pathlib import Path

from reltest_plot_style import RELTEST_COLORS, apply_reltest_style, save_figure, style_axes


PROBABILITY_TICKS = [
    0.001,
    0.002,
    0.003,
    0.005,
    0.01,
    0.02,
    0.03,
    0.05,
    0.10,
    0.20,
    0.30,
    0.50,
    0.632,
    0.90,
    0.999,
]


def probability_y(probability: float) -> float:
    clipped = min(max(probability, 1e-7), 1.0 - 1e-7)
    return math.log(-math.log(1.0 - clipped))


def probability_label(probability: float) -> str:
    value = probability * 100.0
    if value < 1 or abs(value - 63.2) < 1e-6 or value > 99:
        return f"{value:.1f}".replace(".", ",")
    return f"{value:.0f}"


def load_config(path: str | Path) -> dict:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def setup_probability_axes(ax, x_min: float, x_max: float, xlabel: str) -> None:
    ax.set_xscale("log")
    ax.set_xlim(x_min, x_max)
    ax.set_ylim(probability_y(PROBABILITY_TICKS[0]), probability_y(PROBABILITY_TICKS[-1]))
    ax.set_yticks([probability_y(value) for value in PROBABILITY_TICKS])
    ax.set_yticklabels([probability_label(value) for value in PROBABILITY_TICKS])
    style_axes(ax, xlabel, "Ausfallwahrscheinlichkeit F(t) [%]")
    ax.spines["top"].set_visible(True)
    ax.spines["right"].set_visible(True)
    ax.grid(True, which="both", linewidth=0.75, alpha=0.72)


def clean_figure(fig) -> None:
    fig.patch.set_alpha(0)
    for axis in fig.axes:
        axis.set_facecolor("white")


def linear_fit(x_values: list[float], y_values: list[float]) -> tuple[float, float]:
    count = len(x_values)
    mean_x = sum(x_values) / count
    mean_y = sum(y_values) / count
    variance = sum((value - mean_x) ** 2 for value in x_values)
    covariance = sum((x - mean_x) * (y - mean_y) for x, y in zip(x_values, y_values))
    slope = covariance / variance
    return slope, mean_y - slope * mean_x


def build_three_parameter(config: dict, output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    probabilities = [float(value) for value in config["probabilities"]]
    t0 = float(config["plot_model"]["t0"])
    eta = float(config["plot_model"]["eta"])
    beta = float(config["plot_model"]["beta"])
    jitter = [float(value) for value in config.get("relative_time_jitter", [0.0] * len(probabilities))]
    times = [
        (t0 + eta * (-math.log(1.0 - probability)) ** (1.0 / beta)) * (1.0 + offset)
        for probability, offset in zip(probabilities, jitter)
    ]

    curve_probabilities = np.geomspace(0.0012, 0.997, 500)
    curve_times = t0 + eta * np.power(-np.log(1.0 - curve_probabilities), 1.0 / beta)
    curve_y = np.log(-np.log(1.0 - curve_probabilities))

    apply_reltest_style()
    fig, ax = plt.subplots(figsize=(10.8, 7.0))
    clean_figure(fig)
    setup_probability_axes(ax, 1.0, 100.0, "Lebensdauer t · 10⁶ LW")

    solid = curve_probabilities >= min(probabilities)
    ax.plot(
        curve_times[~solid],
        curve_y[~solid],
        color=RELTEST_COLORS["ink"],
        linewidth=2.8,
        linestyle="--",
        zorder=2,
    )
    ax.plot(
        curve_times[solid],
        curve_y[solid],
        color=RELTEST_COLORS["ink"],
        linewidth=3.4,
        zorder=2,
    )
    ax.scatter(
        times,
        [probability_y(value) for value in probabilities],
        marker="s",
        s=58,
        facecolor="white",
        edgecolor=RELTEST_COLORS["muted"],
        linewidth=1.9,
        zorder=4,
    )
    ax.scatter(
        [t0],
        [probability_y(PROBABILITY_TICKS[0])],
        s=82,
        color=RELTEST_COLORS["ink"],
        zorder=5,
        clip_on=False,
    )
    ax.text(
        t0,
        probability_y(0.00155),
        "Pol",
        color=RELTEST_COLORS["ink"],
        fontsize=15,
        weight="bold",
        ha="center",
        va="bottom",
    )

    fig.subplots_adjust(left=0.17, right=0.97, top=0.96, bottom=0.18)
    save_figure(fig, output, transparent=True)
    plt.close(fig)


def mechanism_series(config: dict) -> tuple[list[float], list[float], list[float], list[float]]:
    early = config["mechanism_b"]
    late = config["mechanism_a"]
    return (
        [float(value) for value in early["times"]],
        [float(value) for value in early["probabilities"]],
        [float(value) for value in late["times"]],
        [float(value) for value in late["probabilities"]],
    )


def fit_line(times: list[float], probabilities: list[float], lower: float, upper: float):
    import numpy as np

    slope, intercept = linear_fit(
        [math.log10(value) for value in times],
        [probability_y(value) for value in probabilities],
    )
    line_times = np.geomspace(lower, upper, 180)
    return line_times, intercept + slope * np.log10(line_times)


def build_mechanisms(config: dict, output: str | Path, split: bool) -> None:
    import matplotlib.pyplot as plt

    times_b, probabilities_b, times_a, probabilities_a = mechanism_series(config)
    all_times = [*times_b, *times_a]
    all_probabilities = [*probabilities_b, *probabilities_a]

    apply_reltest_style()
    fig, ax = plt.subplots(figsize=(10.8, 7.0))
    clean_figure(fig)
    setup_probability_axes(ax, 1.0, 100.0, "Lebensdauer t · 10⁶ LW")

    if split:
        line_b_x, line_b_y = fit_line(times_b, probabilities_b, 1.3, 38.0)
        line_a_x, line_a_y = fit_line(times_a, probabilities_a, 6.0, 42.0)
        ax.plot(line_b_x, line_b_y, color=RELTEST_COLORS["data"], linewidth=3.4, zorder=2)
        ax.plot(line_a_x, line_a_y, color=RELTEST_COLORS["support"], linewidth=3.4, zorder=2)
        ax.scatter(
            times_b,
            [probability_y(value) for value in probabilities_b],
            marker="s",
            s=62,
            color=RELTEST_COLORS["data"],
            edgecolor="white",
            linewidth=1.2,
            zorder=4,
        )
        ax.scatter(
            times_a,
            [probability_y(value) for value in probabilities_a],
            marker="s",
            s=62,
            color=RELTEST_COLORS["support"],
            edgecolor="white",
            linewidth=1.2,
            zorder=4,
        )
        ax.text(
            24.0,
            probability_y(0.86),
            "Ausfallmechanismus A",
            color=RELTEST_COLORS["support"],
            fontsize=16,
            weight="bold",
            ha="left",
            bbox={"facecolor": "white", "edgecolor": RELTEST_COLORS["support"], "pad": 4},
        )
        ax.text(
            1.35,
            probability_y(0.42),
            "Ausfallmechanismus B",
            color=RELTEST_COLORS["data"],
            fontsize=16,
            weight="bold",
            ha="left",
            bbox={"facecolor": "white", "edgecolor": RELTEST_COLORS["data"], "pad": 4},
        )
    else:
        common_x, common_y = fit_line(all_times, all_probabilities, 1.2, 80.0)
        ax.plot(
            common_x,
            common_y,
            color=RELTEST_COLORS["warning"],
            linewidth=3.4,
            linestyle=(0, (7, 5)),
            zorder=2,
        )
        ax.scatter(
            all_times,
            [probability_y(value) for value in all_probabilities],
            marker="s",
            s=62,
            color=RELTEST_COLORS["accent"],
            edgecolor="white",
            linewidth=1.2,
            zorder=4,
        )

    fig.subplots_adjust(left=0.17, right=0.97, top=0.96, bottom=0.18)
    save_figure(fig, output, transparent=True)
    plt.close(fig)


BUILDERS = {
    "three_parameter": lambda config, output: build_three_parameter(config, output),
    "mechanisms_joint": lambda config, output: build_mechanisms(config, output, split=False),
    "mechanisms_split": lambda config, output: build_mechanisms(config, output, split=True),
}


def main() -> None:
    parser = argparse.ArgumentParser(description="Create the RE3 chapter-five Weibull special-case plots.")
    parser.add_argument("--plot", choices=sorted(BUILDERS), required=True)
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    BUILDERS[args.plot](load_config(args.input), args.output)


if __name__ == "__main__":
    main()
