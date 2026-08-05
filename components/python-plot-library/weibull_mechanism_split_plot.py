from __future__ import annotations

import argparse
import math
from pathlib import Path

from reltest_plot_style import (
    RELTEST_COLORS,
    apply_reltest_style,
    parse_float_list,
    save_figure,
    style_axes,
)
from svg_animation_targets import prepare_svg_animation_targets
from weibull_probability_plot import (
    PROBABILITY_TICKS,
    linear_fit,
    logspace,
    median_ranks,
    weibull_y,
)


MECHANISM_B_COLOR = RELTEST_COLORS["support"]


def fit_series(times: list[float]) -> tuple[list[float], list[float], float, float]:
    sorted_times = sorted(times)
    probs = median_ranks(len(sorted_times))
    x_values = [math.log10(time) for time in sorted_times]
    y_values = [weibull_y(probability) for probability in probs]
    slope, intercept = linear_fit(x_values, y_values)
    return sorted_times, y_values, slope, intercept


def build_plot(
    times_a: list[float],
    times_b: list[float],
    output: str | Path,
    xlabel: str = "Lebensdauer t",
    ylabel: str = "Ausfallwahrscheinlichkeit F(t) [%]",
) -> None:
    import matplotlib.pyplot as plt

    if len(times_a) < 3 or len(times_b) < 3:
        raise ValueError("Use at least three failure times per mechanism.")
    if any(time <= 0 for time in [*times_a, *times_b]):
        raise ValueError("Weibull failure times must be positive.")

    sorted_a, y_a, slope_a, intercept_a = fit_series(times_a)
    sorted_b, y_b, slope_b, intercept_b = fit_series(times_b)
    all_times = sorted([*sorted_a, *sorted_b])
    line_times = logspace(min(all_times) * 0.72, max(all_times) * 1.28, 140)
    line_a = [intercept_a + slope_a * math.log10(time) for time in line_times]
    line_b = [intercept_b + slope_b * math.log10(time) for time in line_times]

    apply_reltest_style()
    fig, ax = plt.subplots()

    ax.set_xscale("log")
    line_a_artist = ax.plot(line_times, line_a, color=RELTEST_COLORS["accent"], linewidth=2.6, label="Mechanismus A")[0]
    line_b_artist = ax.plot(line_times, line_b, color=MECHANISM_B_COLOR, linewidth=2.6, label="Mechanismus B")[0]
    line_a_artist.set_gid("plot_mechanism_a_fit")
    line_b_artist.set_gid("plot_mechanism_b_fit")

    points_a = ax.scatter(
        sorted_a,
        y_a,
        s=66,
        facecolor="white",
        edgecolor=RELTEST_COLORS["accent"],
        linewidth=2.0,
        zorder=3,
    )
    points_b = ax.scatter(
        sorted_b,
        y_b,
        s=66,
        facecolor="white",
        edgecolor=MECHANISM_B_COLOR,
        linewidth=2.0,
        zorder=3,
    )
    points_a.set_gid("plot_mechanism_a_points")
    points_b.set_gid("plot_mechanism_b_points")

    y_ticks = [weibull_y(value) for value in PROBABILITY_TICKS]
    y_labels = [f"{int(value * 100)}" for value in PROBABILITY_TICKS]
    ax.set_yticks(y_ticks)
    ax.set_yticklabels(y_labels)
    ax.set_ylim(weibull_y(0.01), weibull_y(0.99))
    ax.set_xlim(min(line_times), max(line_times))

    style_axes(ax, xlabel, ylabel)
    ax.legend(loc="lower right")
    fig.tight_layout()
    save_figure(fig, output)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {
            "plot_mechanism_a_points": "Ausfalldaten Mechanismus A",
            "plot_mechanism_a_fit": "Fit Mechanismus A",
            "plot_mechanism_b_points": "Ausfalldaten Mechanismus B",
            "plot_mechanism_b_fit": "Fit Mechanismus B",
        },
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Create a Reltest-style Weibull plot with two separated failure mechanisms.")
    parser.add_argument("--times-a", default="12,18,27,44")
    parser.add_argument("--times-b", default="38,65,105,170")
    parser.add_argument("--xlabel", default="Lebensdauer t")
    parser.add_argument("--ylabel", default="Ausfallwahrscheinlichkeit F(t) [%]")
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    build_plot(
        times_a=parse_float_list(args.times_a, []),
        times_b=parse_float_list(args.times_b, []),
        xlabel=args.xlabel,
        ylabel=args.ylabel,
        output=args.output,
    )


if __name__ == "__main__":
    main()
