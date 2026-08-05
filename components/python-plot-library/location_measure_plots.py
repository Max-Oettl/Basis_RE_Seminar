from __future__ import annotations

import argparse
from pathlib import Path

from reltest_plot_style import RELTEST_COLORS, apply_reltest_style, save_figure, style_axes
from svg_animation_targets import prepare_svg_animation_targets


COLORS = {
    "mean": RELTEST_COLORS["warning"],
    "median": RELTEST_COLORS["data"],
    "mode": RELTEST_COLORS["support"],
    "failure": RELTEST_COLORS["accent"],
}


def clean_figure(fig) -> None:
    fig.patch.set_alpha(0)
    for ax in fig.axes:
        ax.set_facecolor("none")


def lognormal_pdf(x, mu: float = 1.32, sigma: float = 0.48):
    import numpy as np

    result = np.zeros_like(x, dtype=float)
    positive = x > 0
    result[positive] = np.exp(-((np.log(x[positive]) - mu) ** 2) / (2 * sigma**2)) / (
        x[positive] * sigma * np.sqrt(2 * np.pi)
    )
    return result


def build_mean_balance(output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np
    from matplotlib.collections import LineCollection

    times = np.asarray([12, 18, 23, 29, 34, 42, 48], dtype=float)
    mean = float(times.mean())
    outlier = 82.0
    shifted_mean = float(np.append(times, outlier).mean())

    fig, ax = plt.subplots(figsize=(14.4, 4.6))
    clean_figure(fig)
    style_axes(ax, "Ausfallzeit t")
    ax.set_xlim(6, 90)
    ax.set_ylim(0, 1.08)
    ax.set_yticks([])
    ax.grid(False)
    ax.spines["left"].set_visible(False)

    baseline = ax.hlines(0.72, 9, 52, color=RELTEST_COLORS["ink"], linewidth=2.2)
    baseline.set_gid("mass_baseline")
    points = ax.scatter(times, np.full_like(times, 0.72), s=145, color=RELTEST_COLORS["data"], edgecolor="#FFFFFF", linewidth=2.2, zorder=5)
    points.set_gid("mass_point_symbols")
    mass_label = ax.text(9, 0.98, "Ausfallzeiten als Massenpunkte", color=RELTEST_COLORS["ink"], fontsize=18, weight="bold", ha="left")
    mass_label.set_gid("mass_points_label")

    mean_line = ax.vlines(mean, 0.53, 0.78, color=COLORS["mean"], linewidth=3.2)
    mean_line.set_gid("mean_line")
    mean_symbol = ax.scatter([mean], [0.53], s=190, marker="^", color=COLORS["mean"], edgecolor="#FFFFFF", linewidth=2.0, zorder=6)
    mean_symbol.set_gid("mean_symbol")
    mean_label = ax.text(mean, 0.49, f"Mittelwert = Schwerpunkt   t_m = {mean:.0f}", color=COLORS["mean"], fontsize=18, weight="bold", ha="center")
    mean_label.set_gid("mean_label")

    comparison_baseline = ax.hlines(0.20, 9, 86, color=RELTEST_COLORS["ink"], linewidth=2.2)
    comparison_baseline.set_gid("outlier_baseline")
    comparison_points = ax.scatter(times, np.full_like(times, 0.20), s=118, color=RELTEST_COLORS["data"], edgecolor="#FFFFFF", linewidth=2.0, zorder=5)
    comparison_points.set_gid("outlier_original_points")
    outlier_point = ax.scatter([outlier], [0.20], s=155, color=COLORS["failure"], edgecolor="#FFFFFF", linewidth=2.2, zorder=6)
    outlier_point.set_gid("outlier_point")
    old_mean_line = ax.vlines(mean, 0.10, 0.30, color=COLORS["mean"], linewidth=2.0, linestyle="--", alpha=0.65)
    old_mean_line.set_gid("old_mean_reference")
    shifted_line = ax.vlines(shifted_mean, 0.06, 0.28, color=COLORS["failure"], linewidth=3.0)
    shifted_line.set_gid("shifted_mean_line")
    shifted_symbol = ax.scatter([shifted_mean], [0.06], s=180, marker="^", color=COLORS["failure"], edgecolor="#FFFFFF", linewidth=2.0, zorder=6)
    shifted_symbol.set_gid("shifted_mean_symbol")
    shift_line = LineCollection([[(mean, 0.31), (shifted_mean, 0.31)]], colors=COLORS["failure"], linewidths=2.8)
    shift_line.set_gid("mean_shift_line")
    ax.add_collection(shift_line)
    shift_head = ax.scatter([shifted_mean], [0.31], s=105, marker=">", color=COLORS["failure"], zorder=6)
    shift_head.set_gid("mean_shift_head")
    outlier_label = ax.text(9, 0.40, "Mit Ausreißer", color=COLORS["failure"], fontsize=18, weight="bold", ha="left")
    outlier_label.set_gid("outlier_effect_label")
    shifted_label = ax.text(shifted_mean + 2.2, 0.04, f"verschobener Mittelwert  t_m = {shifted_mean:.0f}", color=COLORS["failure"], fontsize=17, weight="bold", ha="left")
    shifted_label.set_gid("shifted_mean_label")
    outlier_caption = ax.text(outlier, 0.38, "Ausreißer", color=COLORS["failure"], fontsize=18, weight="bold", ha="center")
    outlier_caption.set_gid("outlier_caption")

    fig.tight_layout(pad=0.7)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {
            "mass_points": "Ausfallzeiten als Massenpunkte",
            "mean_centroid": "Mittelwert als Schwerpunkt",
            "outlier_effect": "Einfluss eines Ausreißers auf den Mittelwert",
        },
        sibling_groups=[
            ("mass_points", "Ausfallzeiten als Massenpunkte", ["mass_baseline", "mass_point_symbols", "mass_points_label"]),
            ("mean_centroid", "Mittelwert als Schwerpunkt", ["mean_line", "mean_symbol", "mean_label"]),
            ("outlier_effect", "Einfluss eines Ausreißers auf den Mittelwert", ["outlier_baseline", "outlier_original_points", "outlier_point", "old_mean_reference", "shifted_mean_line", "shifted_mean_symbol", "mean_shift_line", "mean_shift_head", "outlier_effect_label", "shifted_mean_label", "outlier_caption"]),
        ],
    )


def _distribution_axes():
    import matplotlib.pyplot as plt
    import numpy as np

    x = np.linspace(0.05, 10.0, 800)
    density = lognormal_pdf(x)
    density[-1] = 0.0
    fig, ax = plt.subplots(figsize=(11.2, 5.7))
    clean_figure(fig)
    style_axes(ax, "Ausfallzeit t", "Dichtefunktion f(t)")
    ax.set_xlim(0, 10)
    ax.set_ylim(0, density.max() * 1.18)
    ax.set_yticks([])
    ax.grid(False)
    return fig, ax, x, density


def build_median_split(output: str | Path) -> None:
    import matplotlib.pyplot as plt

    fig, ax, x, density = _distribution_axes()
    median = 2.718281828459045**1.32
    curve = ax.plot(x, density, color=RELTEST_COLORS["ink"], linewidth=3.7)[0]
    curve.set_gid("median_density")
    left = ax.fill_between(x, 0, density, where=x <= median, color=COLORS["median"], alpha=0.34)
    left.set_gid("median_left_half")
    right = ax.fill_between(x, 0, density, where=x >= median, color=RELTEST_COLORS["data"], alpha=0.24)
    right.set_gid("median_right_half")
    line = ax.axvline(median, color=COLORS["median"], linewidth=3.0)
    line.set_gid("median_line")
    marker = ax.scatter([median], [0], s=110, marker="D", color=COLORS["median"], edgecolor="#FFFFFF", linewidth=1.8, zorder=6)
    marker.set_gid("median_marker")
    label = ax.text(median + 0.28, density.max() * 1.07, "t_Median", color=COLORS["median"], fontsize=18, weight="bold", ha="left")
    label.set_gid("median_label")
    left_label = ax.text(median * 0.58, density.max() * 0.32, "50 %", color=COLORS["median"], fontsize=18, weight="bold", ha="center")
    left_label.set_gid("median_left_label")
    right_label = ax.text(median + 1.65, density.max() * 0.25, "50 %", color=RELTEST_COLORS["data"], fontsize=18, weight="bold", ha="center")
    right_label.set_gid("median_right_label")

    fig.tight_layout(pad=0.7)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {
            "median_density": "Dichtefunktion für die Medianerklärung",
            "median_equal_halves": "Median teilt die Dichtefläche in zwei Hälften",
        },
        sibling_groups=[
            ("median_equal_halves", "Median teilt die Dichtefläche in zwei Hälften", ["median_left_half", "median_right_half", "median_line", "median_marker", "median_label", "median_left_label", "median_right_label"]),
        ],
    )


def build_mode_peak(output: str | Path) -> None:
    import matplotlib.pyplot as plt

    fig, ax, x, density = _distribution_axes()
    mode = 2.718281828459045 ** (1.32 - 0.48**2)
    mode_y = float(lognormal_pdf(__import__("numpy").asarray([mode]))[0])
    curve = ax.plot(x, density, color=RELTEST_COLORS["ink"], linewidth=3.7)[0]
    curve.set_gid("mode_density_curve")
    line = ax.axvline(mode, ymax=mode_y / (density.max() * 1.18), color=COLORS["mode"], linewidth=3.0)
    line.set_gid("mode_peak_line")
    point = ax.scatter([mode], [mode_y], s=145, color=COLORS["mode"], edgecolor="#FFFFFF", linewidth=2.2, zorder=6)
    point.set_gid("mode_peak_point")
    label = ax.text(mode, density.max() * 1.08, "t_modal = Maximum", color=COLORS["mode"], fontsize=18, weight="bold", ha="center")
    label.set_gid("mode_peak_label")

    fig.tight_layout(pad=0.7)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {
            "mode_density_curve": "Dichtefunktion für den Modalwert",
            "mode_peak": "Maximum der Dichtefunktion",
        },
        sibling_groups=[
            ("mode_peak", "Maximum der Dichtefunktion", ["mode_peak_line", "mode_peak_point", "mode_peak_label"]),
        ],
    )


def build_right_skew_compare(output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np
    from matplotlib.collections import LineCollection

    fig, ax, x, density = _distribution_axes()
    mu = 1.32
    sigma = 0.48
    mode = float(np.exp(mu - sigma**2))
    median = float(np.exp(mu))
    mean = float(np.exp(mu + sigma**2 / 2))
    curve = ax.plot(x, density, color=RELTEST_COLORS["ink"], linewidth=4.0)[0]
    curve.set_gid("skew_distribution_curve")

    specifications = [
        ("mode_marker", mode, COLORS["mode"], "t_modal", -0.18, 1.08),
        ("median_marker", median, COLORS["median"], "t_Median", 0.62, 0.99),
        ("mean_marker", mean, COLORS["mean"], "t_m", 0.66, 0.67),
    ]
    sibling_groups = []
    for target_id, value, color, marker_label, label_offset_x, label_height in specifications:
        line_id = f"{target_id}_line"
        point_id = f"{target_id}_point"
        connector_id = f"{target_id}_connector"
        label_id = f"{target_id}_label"
        y_value = float(lognormal_pdf(np.asarray([value]))[0])
        label_x = value + label_offset_x
        label_y = density.max() * label_height
        line = ax.axvline(value, ymax=y_value / (density.max() * 1.18), color=color, linewidth=3.0)
        line.set_gid(line_id)
        point = ax.scatter([value], [y_value], s=118, color=color, edgecolor="#FFFFFF", linewidth=1.8, zorder=6)
        point.set_gid(point_id)
        connector = LineCollection([[(value, y_value), (label_x, label_y - density.max() * 0.035)]], colors=color, linewidths=1.8)
        connector.set_gid(connector_id)
        ax.add_collection(connector)
        label = ax.text(label_x, label_y, marker_label, color=color, fontsize=18, weight="bold", ha="center")
        label.set_gid(label_id)
        sibling_groups.append((target_id, marker_label, [line_id, point_id, connector_id, label_id]))

    fig.tight_layout(pad=0.7)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {
            "skew_distribution_curve": "Rechtsschiefe Dichtefunktion",
            "mode_marker": "Modalwert am Maximum",
            "median_marker": "Median als Flächenteiler",
            "mean_marker": "Mittelwert unter Ausreißereinfluss",
        },
        sibling_groups=sibling_groups,
    )


BUILDERS = {
    "mean_balance": build_mean_balance,
    "median_split": build_median_split,
    "mode_peak": build_mode_peak,
    "right_skew_compare": build_right_skew_compare,
}


def main() -> None:
    parser = argparse.ArgumentParser(description="RelTest Lageparameter-Plots ohne sichtbare Titel.")
    parser.add_argument("--plot", required=True, choices=sorted(BUILDERS))
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    apply_reltest_style()
    BUILDERS[args.plot](args.output)


if __name__ == "__main__":
    main()
