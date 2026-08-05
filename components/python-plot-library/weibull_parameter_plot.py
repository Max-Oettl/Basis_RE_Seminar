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
from weibull_probability_plot import (
    PROBABILITY_TICKS,
    linear_fit,
    logspace,
    median_ranks,
    normalize_probabilities,
    weibull_y,
)


def fit_weibull_parameters_from_line(slope: float, intercept: float) -> tuple[float, float]:
    beta = slope / math.log(10.0)
    if beta <= 0:
        raise ValueError("The fitted Weibull shape parameter must be positive.")
    eta = math.exp(-intercept / beta)
    return beta, eta


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
    beta, eta = fit_weibull_parameters_from_line(slope, intercept)

    min_time, max_time = weibull_x_limits(sorted_times)
    line_times = logspace(min_time, max_time, 140)
    line_y = [intercept + slope * math.log10(time) for time in line_times]
    t_probability = 0.632
    t_y = weibull_y(t_probability)

    triangle_x1 = sorted_times[max(1, len(sorted_times) // 3)]
    triangle_x2 = min(triangle_x1 * 1.75, max_time * 0.82)
    triangle_y1 = intercept + slope * math.log10(triangle_x1)
    triangle_y2 = intercept + slope * math.log10(triangle_x2)

    apply_reltest_style()
    fig, ax = plt.subplots()

    ax.set_xscale("log")
    fit_line = ax.plot(line_times, line_y, color=RELTEST_COLORS["data"], linewidth=2.6, label="Weibull-Fit")[0]
    fit_line.set_gid("plot_weibull_fit")
    points = ax.scatter(
        sorted_times,
        y_fit,
        s=68,
        facecolor="white",
        edgecolor=RELTEST_COLORS["accent"],
        linewidth=2.0,
        zorder=3,
        label="Ausfalldaten",
    )
    points.set_gid("plot_data_points")

    parameter_t_horizontal = ax.hlines(
        t_y,
        xmin=min_time,
        xmax=eta,
        color=RELTEST_COLORS["muted"],
        linewidth=1.5,
        linestyles="--",
    )
    parameter_t_horizontal.set_gid("plot_parameter_t_horizontal")
    parameter_t_vertical = ax.vlines(
        eta,
        ymin=weibull_y(0.01),
        ymax=t_y,
        color=RELTEST_COLORS["muted"],
        linewidth=1.5,
        linestyles="--",
    )
    parameter_t_vertical.set_gid("plot_parameter_t_vertical")
    parameter_t_label = ax.text(eta, weibull_y(0.012), "T", ha="center", va="bottom", color=RELTEST_COLORS["ink"], fontsize=15, fontweight="bold")
    parameter_t_label.set_gid("plot_parameter_t_label")
    parameter_t_probability = ax.text(min_time * 1.06, t_y, "63,2 %", ha="left", va="bottom", color=RELTEST_COLORS["muted"], fontsize=12)
    parameter_t_probability.set_gid("plot_parameter_t_probability")

    parameter_b_horizontal = ax.plot([triangle_x1, triangle_x2], [triangle_y1, triangle_y1], color=RELTEST_COLORS["muted"], linewidth=1.8)[0]
    parameter_b_vertical = ax.plot([triangle_x2, triangle_x2], [triangle_y1, triangle_y2], color=RELTEST_COLORS["muted"], linewidth=1.8)[0]
    parameter_b_horizontal.set_gid("plot_parameter_b_horizontal")
    parameter_b_vertical.set_gid("plot_parameter_b_vertical")
    parameter_b_label = ax.text(triangle_x2 * 1.05, (triangle_y1 + triangle_y2) / 2, "b", ha="left", va="center", color=RELTEST_COLORS["ink"], fontsize=15, fontweight="bold")
    parameter_b_label.set_gid("plot_parameter_b_label")

    y_ticks = [weibull_y(value) for value in PROBABILITY_TICKS]
    y_labels = [f"{int(value * 100)}" for value in PROBABILITY_TICKS]
    ax.set_yticks(y_ticks)
    ax.set_yticklabels(y_labels)
    ax.set_ylim(weibull_y(0.01), weibull_y(0.99))
    ax.set_xlim(min_time, max_time)

    style_axes(ax, xlabel, ylabel)
    ax.legend(loc="lower right")
    fig.tight_layout()
    save_figure(fig, output)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {
            "plot_data_points": "Ausfalldaten",
            "plot_weibull_fit": "Weibull-Fit",
            "plot_parameter_t_horizontal": "Hilfslinie T waagerecht",
            "plot_parameter_t_vertical": "Hilfslinie T senkrecht",
            "plot_parameter_t_label": "Parameter T",
            "plot_parameter_t_probability": "Ausfallwahrscheinlichkeit 63,2 %",
            "plot_parameter_b_horizontal": "Steigungsdreieck b waagerecht",
            "plot_parameter_b_vertical": "Steigungsdreieck b senkrecht",
            "plot_parameter_b_label": "Parameter b",
        },
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Create a Reltest-style Weibull probability plot with T and b readout helpers.")
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
