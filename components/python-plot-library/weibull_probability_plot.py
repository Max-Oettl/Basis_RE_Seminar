from __future__ import annotations

import argparse
import math
from pathlib import Path

from basis_seminar_plot_data import DEFAULT_FAILURE_TIMES_CSV, weibull_x_limits
from reltest_plot_style import (
    RELTEST_COLORS,
    apply_reltest_style,
    parse_float_list,
    save_figure,
    style_axes,
)
from svg_animation_targets import prepare_svg_animation_targets


PROBABILITY_TICKS = [0.01, 0.02, 0.05, 0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 0.95, 0.98, 0.99]


def weibull_y(probability: float) -> float:
    if probability <= 0 or probability >= 1:
        raise ValueError("Weibull probabilities must be between 0 and 1.")
    return math.log(-math.log(1.0 - probability))


def median_ranks(sample_size: int) -> list[float]:
    return [(rank - 0.3) / (sample_size + 0.4) for rank in range(1, sample_size + 1)]


def linear_fit(x_values: list[float], y_values: list[float]) -> tuple[float, float]:
    if len(x_values) != len(y_values):
        raise ValueError("x_values and y_values must have the same length.")
    x_mean = sum(x_values) / len(x_values)
    y_mean = sum(y_values) / len(y_values)
    numerator = sum((x - x_mean) * (y - y_mean) for x, y in zip(x_values, y_values))
    denominator = sum((x - x_mean) ** 2 for x in x_values)
    if denominator == 0:
        raise ValueError("Cannot fit line when all x values are equal.")
    slope = numerator / denominator
    intercept = y_mean - slope * x_mean
    return slope, intercept


def logspace(min_value: float, max_value: float, count: int) -> list[float]:
    log_min = math.log10(min_value)
    log_max = math.log10(max_value)
    return [10 ** (log_min + (log_max - log_min) * index / (count - 1)) for index in range(count)]


def normalize_probabilities(probabilities: list[float]) -> list[float]:
    if any(value > 1 for value in probabilities):
        return [value / 100.0 for value in probabilities]
    return probabilities


def build_plot(
    times: list[float],
    output: str | Path,
    probabilities: list[float] | None = None,
    xlabel: str = "Lebensdauer t",
    ylabel: str = "Ausfallwahrscheinlichkeit F(t) [%]",
) -> None:
    import matplotlib.pyplot as plt

    if not times:
        raise ValueError("At least one failure time is required.")
    if any(time <= 0 for time in times):
        raise ValueError("Weibull failure times must be positive.")

    sorted_times = sorted(times)
    probs = normalize_probabilities(probabilities) if probabilities else median_ranks(len(sorted_times))
    if len(sorted_times) != len(probs):
        raise ValueError("times and probabilities must have the same length.")

    x_fit = [math.log10(time) for time in sorted_times]
    y_fit = [weibull_y(probability) for probability in probs]
    slope, intercept = linear_fit(x_fit, y_fit)

    x_min, x_max = weibull_x_limits(sorted_times)
    line_times = logspace(x_min, x_max, 120)
    line_y = [intercept + slope * math.log10(time) for time in line_times]

    apply_reltest_style()
    fig, ax = plt.subplots()

    ax.set_xscale("log")
    fit_line = ax.plot(line_times, line_y, color=RELTEST_COLORS["data"], linewidth=2.5, label="Weibull-Fit")[0]
    fit_line.set_gid("plot_weibull_fit")

    scatter = ax.scatter(
        sorted_times,
        y_fit,
        s=58,
        facecolor="white",
        edgecolor=RELTEST_COLORS["accent"],
        linewidth=1.8,
        zorder=3,
        label="Ausfalldaten",
    )
    scatter.set_gid("plot_data_points")

    y_ticks = [weibull_y(value) for value in PROBABILITY_TICKS]
    y_labels = [f"{int(value * 100)}" for value in PROBABILITY_TICKS]
    ax.set_yticks(y_ticks)
    ax.set_yticklabels(y_labels)
    ax.set_ylim(weibull_y(0.01), weibull_y(0.99))
    ax.set_xlim(x_min, x_max)

    style_axes(ax, xlabel, ylabel)
    legend = ax.legend(loc="lower right")
    legend.set_gid("plot_legend")
    fig.tight_layout()
    save_figure(fig, output)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {
            "plot_data_points": "Ausfalldaten",
            "plot_weibull_fit": "Weibull-Fit",
        },
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Create a Reltest-style Weibull probability plot without a visible plot title.")
    parser.add_argument("--times", default=DEFAULT_FAILURE_TIMES_CSV)
    parser.add_argument(
        "--probabilities",
        help="Optional failure probabilities as fractions or percent values. If omitted, median ranks are used.",
    )
    parser.add_argument("--xlabel", default="Lebensdauer t")
    parser.add_argument("--ylabel", default="Ausfallwahrscheinlichkeit F(t) [%]")
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    build_plot(
        times=parse_float_list(args.times, []),
        probabilities=parse_float_list(args.probabilities, []) if args.probabilities else None,
        xlabel=args.xlabel,
        ylabel=args.ylabel,
        output=args.output,
    )


if __name__ == "__main__":
    main()
