from __future__ import annotations

import argparse
import math
from pathlib import Path
import xml.etree.ElementTree as ET

import numpy as np

from reltest_plot_style import (
    RELTEST_COLORS,
    apply_reltest_style,
    parse_float_list,
    save_figure,
    style_axes,
)
from weibull_probability_plot import (
    PROBABILITY_TICKS,
    linear_fit,
    logspace,
    median_ranks,
    normalize_probabilities,
    weibull_y,
)


SVG_NAMESPACE = "http://www.w3.org/2000/svg"


def fit_weibull_parameters_from_line(slope: float, intercept: float) -> tuple[float, float]:
    beta = slope / math.log(10.0)
    if beta <= 0:
        raise ValueError("The fitted Weibull shape parameter must be positive.")
    eta = math.exp(-intercept / beta)
    return beta, eta


def bootstrap_confidence_limits(
    failure_count: int,
    beta: float,
    eta: float,
    slope: float,
    intercept: float,
    line_x: np.ndarray,
    lower_bound: float,
    upper_bound: float,
    samples: int,
    seed: int,
) -> tuple[np.ndarray, np.ndarray]:
    if failure_count < 3:
        raise ValueError("At least three data points are required for confidence limits.")
    if not 0.0 < lower_bound < upper_bound < 1.0:
        raise ValueError("Use bounds in the form 0 < lower_bound < upper_bound < 1.")
    if samples < 500:
        raise ValueError("Use at least 500 bootstrap samples for stable confidence limits.")

    rng = np.random.default_rng(seed)
    boot_lines = np.empty((samples + 1, len(line_x)), dtype=float)
    boot_lines[0, :] = intercept + slope * line_x

    for index in range(1, samples + 1):
        sample_times = np.sort(eta * rng.weibull(beta, size=failure_count))
        sample_probs = median_ranks(failure_count)
        sample_x = [math.log10(time) for time in sample_times]
        sample_y = [weibull_y(probability) for probability in sample_probs]
        boot_slope, boot_intercept = linear_fit(sample_x, sample_y)
        boot_lines[index, :] = boot_intercept + boot_slope * line_x

    lower = np.percentile(boot_lines, lower_bound * 100.0, axis=0)
    upper = np.percentile(boot_lines, upper_bound * 100.0, axis=0)
    return lower, upper


def bound_label(bound: float) -> str:
    percent = bound * 100.0
    if abs(percent - round(percent)) < 0.01:
        return f"{int(round(percent))} %-Vertrauensgrenze"
    return f"{percent:.1f} %-Vertrauensgrenze"


def add_time_triggered_fade_in(
    svg_path: str | Path,
    child_ids: list[str],
    group_id: str,
    trigger_at_seconds: float,
    duration_seconds: float = 0.45,
    additional_target_ids: list[str] | None = None,
) -> None:
    if trigger_at_seconds < 0:
        raise ValueError("Animation trigger time must not be negative.")
    if duration_seconds <= 0:
        raise ValueError("Animation duration must be positive.")

    ET.register_namespace("", SVG_NAMESPACE)
    tree = ET.parse(svg_path)
    root = tree.getroot()
    parent_map = {child: parent for parent in root.iter() for child in parent}

    elements = []
    for child_id in child_ids:
        element = next((candidate for candidate in root.iter() if candidate.get("id") == child_id), None)
        if element is None:
            raise ValueError(f"Cannot find SVG element with id '{child_id}'.")
        elements.append(element)

    parents = {parent_map[element] for element in elements}
    if len(parents) != 1:
        raise ValueError("Animated SVG elements must share the same parent group.")

    parent = parents.pop()
    parent_children = list(parent)
    ordered_elements = sorted(elements, key=parent_children.index)
    insert_index = min(parent_children.index(element) for element in ordered_elements)

    group = ET.Element(
        f"{{{SVG_NAMESPACE}}}g",
        {
            "id": group_id,
            "opacity": "0",
            "data-animation-trigger-type": "time",
            "data-animation-trigger-at-seconds": f"{trigger_at_seconds:g}",
            "data-animation-action": "show",
        },
    )
    add_fade_animation(group, trigger_at_seconds, duration_seconds)

    for element in ordered_elements:
        parent.remove(element)
        group.append(element)
    parent.insert(insert_index, group)

    for target_id in additional_target_ids or []:
        element = next((candidate for candidate in root.iter() if candidate.get("id") == target_id), None)
        if element is None:
            raise ValueError(f"Cannot find SVG element with id '{target_id}'.")
        element.set("opacity", "0")
        element.set("data-animation-trigger-type", "time")
        element.set("data-animation-trigger-at-seconds", f"{trigger_at_seconds:g}")
        element.set("data-animation-action", "show")
        add_fade_animation(element, trigger_at_seconds, duration_seconds)

    tree.write(svg_path, encoding="utf-8", xml_declaration=True)


def add_fade_animation(element: ET.Element, trigger_at_seconds: float, duration_seconds: float) -> None:
    ET.SubElement(
        element,
        f"{{{SVG_NAMESPACE}}}animate",
        {
            "attributeName": "opacity",
            "from": "0",
            "to": "1",
            "begin": f"{trigger_at_seconds:g}s",
            "dur": f"{duration_seconds:g}s",
            "fill": "freeze",
        },
    )


def build_plot(
    times: list[float],
    output: str | Path,
    probabilities: list[float] | None = None,
    lower_bound: float = 0.05,
    upper_bound: float = 0.95,
    bootstrap_samples: int = 5000,
    seed: int = 42,
    xlabel: str = "Prüfzeit t / Lastwechsel",
    ylabel: str = "Ausfallwahrscheinlichkeit F(t) [%]",
    confidence_trigger_at_seconds: float | None = None,
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

    line_times = logspace(min(sorted_times) * 0.75, max(sorted_times) * 1.25, 160)
    line_x = np.asarray([math.log10(time) for time in line_times], dtype=float)
    line_y = intercept + slope * line_x
    lower, upper = bootstrap_confidence_limits(
        failure_count=len(sorted_times),
        beta=beta,
        eta=eta,
        slope=slope,
        intercept=intercept,
        line_x=line_x,
        lower_bound=lower_bound,
        upper_bound=upper_bound,
        samples=bootstrap_samples,
        seed=seed,
    )

    apply_reltest_style()
    fig, ax = plt.subplots()
    ax.set_gid("plot-axes")

    ax.set_xscale("log")
    lower_line = ax.plot(
        line_times,
        lower,
        color=RELTEST_COLORS["muted"],
        linewidth=1.7,
        linestyle="--",
        label=bound_label(lower_bound),
    )[0]
    lower_line.set_gid("plot-confidence-lower-limit")
    upper_line = ax.plot(
        line_times,
        upper,
        color=RELTEST_COLORS["muted"],
        linewidth=1.7,
        linestyle="--",
        label=bound_label(upper_bound),
    )[0]
    upper_line.set_gid("plot-confidence-upper-limit")
    fit_line = ax.plot(line_times, line_y, color=RELTEST_COLORS["data"], linewidth=2.5, label="Weibull-Fit")[0]
    fit_line.set_gid("plot-weibull-fit")
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
    scatter.set_gid("plot-data-points")

    y_ticks = [weibull_y(value) for value in PROBABILITY_TICKS]
    y_labels = [f"{int(value * 100)}" for value in PROBABILITY_TICKS]
    ax.set_yticks(y_ticks)
    ax.set_yticklabels(y_labels)
    ax.set_ylim(weibull_y(0.01), weibull_y(0.99))
    ax.set_xlim(min(line_times), max(line_times))

    style_axes(ax, xlabel, ylabel)
    legend = ax.legend(loc="lower right")
    legend.set_gid("plot-legend")
    legend_handles = getattr(legend, "legend_handles", None) or getattr(legend, "legendHandles", [])
    legend_texts = legend.get_texts()
    if len(legend_handles) >= 2 and len(legend_texts) >= 2:
        legend_handles[0].set_gid("plot-confidence-lower-legend-handle")
        legend_handles[1].set_gid("plot-confidence-upper-legend-handle")
        legend_texts[0].set_gid("plot-confidence-lower-legend-label")
        legend_texts[1].set_gid("plot-confidence-upper-legend-label")
    fig.tight_layout()
    save_figure(fig, output)
    plt.close(fig)

    if confidence_trigger_at_seconds is not None:
        add_time_triggered_fade_in(
            svg_path=output,
            child_ids=["plot-confidence-lower-limit", "plot-confidence-upper-limit"],
            group_id="plot-confidence-limits",
            trigger_at_seconds=confidence_trigger_at_seconds,
            additional_target_ids=[
                "plot-confidence-lower-legend-handle",
                "plot-confidence-upper-legend-handle",
                "plot-confidence-lower-legend-label",
                "plot-confidence-upper-legend-label",
            ],
        )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Create a Reltest-style Weibull probability plot with reproducible 5 % and 95 % bootstrap confidence limit curves and without a visible plot title."
    )
    parser.add_argument("--times", default="12,18,27,44,68,105,160")
    parser.add_argument(
        "--probabilities",
        help="Optional failure probabilities as fractions or percent values. If omitted, median ranks are used.",
    )
    parser.add_argument("--lower-bound", type=float, default=0.05)
    parser.add_argument("--upper-bound", type=float, default=0.95)
    parser.add_argument("--bootstrap-samples", type=int, default=5000)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--xlabel", default="Prüfzeit t / Lastwechsel")
    parser.add_argument("--ylabel", default="Ausfallwahrscheinlichkeit F(t) [%]")
    parser.add_argument(
        "--confidence-trigger-at-seconds",
        type=float,
        help="Optional provisional SVG time trigger: fade in confidence limits after this many seconds.",
    )
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    build_plot(
        times=parse_float_list(args.times, []),
        probabilities=parse_float_list(args.probabilities, []) if args.probabilities else None,
        lower_bound=args.lower_bound,
        upper_bound=args.upper_bound,
        bootstrap_samples=args.bootstrap_samples,
        seed=args.seed,
        xlabel=args.xlabel,
        ylabel=args.ylabel,
        confidence_trigger_at_seconds=args.confidence_trigger_at_seconds,
        output=args.output,
    )


if __name__ == "__main__":
    main()
