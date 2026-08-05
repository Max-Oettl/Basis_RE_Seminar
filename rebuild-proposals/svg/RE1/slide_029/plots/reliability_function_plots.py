from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from reltest_plot_style import RELTEST_COLORS, apply_reltest_style, save_figure, style_axes
from svg_animation_targets import prepare_svg_animation_targets


FUNCTION_COLORS = {
    "density": "#007EA7",
    "failure_probability": "#4F78A8",
    "reliability": "#2F6F55",
    "hazard": "#D1495B",
    "secondary": "#B7791F",
}


def read_data(path: str | Path | None) -> dict[str, Any]:
    if not path:
        return {}
    return json.loads(Path(path).read_text(encoding="utf-8"))


def normal_pdf(x, mean: float, sigma: float):
    import numpy as np

    return np.exp(-0.5 * ((x - mean) / sigma) ** 2) / (sigma * np.sqrt(2 * np.pi))


def logistic_cdf(x, location: float, scale: float):
    import numpy as np

    return 1.0 / (1.0 + np.exp(-(x - location) / scale))


def logistic_pdf(x, location: float, scale: float):
    cdf = logistic_cdf(x, location, scale)
    return cdf * (1.0 - cdf) / scale


def clean_figure(fig) -> None:
    fig.patch.set_alpha(0)
    for ax in fig.axes:
        ax.set_facecolor("none")


def target_svg(
    output: str | Path,
    targets: dict[str, str],
    sibling_groups: list[tuple[str, str, list[str]]] | None = None,
) -> None:
    prepare_svg_animation_targets(output, targets, sibling_groups=sibling_groups)


def build_woehler(output: str | Path, data: dict[str, Any]) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    life = np.asarray(data.get("life_cycles_thousand", [8.6, 9.2, 9.8, 10.3, 11.0, 11.8, 27, 29, 31, 33, 35, 37, 54, 57, 60, 64, 68, 74, 112, 120, 130, 141, 155, 180]), dtype=float)
    stress = np.asarray(data.get("stress_n_mm2", [760, 760, 760, 760, 760, 760, 640, 640, 640, 640, 640, 640, 540, 540, 540, 540, 540, 540, 450, 450, 450, 450, 450, 450]), dtype=float)
    selected = np.asarray(data.get("selected_indices", [6, 7, 8, 9, 10, 11]), dtype=int)

    fig, ax = plt.subplots(figsize=(11.7, 6.4))
    clean_figure(fig)
    style_axes(ax, "Lastwechsel $n_{LW}$ · $10^3$", r"Zahnfußbiegespannung $\sigma$ [N/mm²]")
    ax.set_xscale("log")
    ax.set_xlim(5, 500)
    ax.set_ylim(200, 1000)
    ax.set_xticks([5, 10, 50, 100, 500])
    ax.get_xaxis().set_major_formatter(plt.ScalarFormatter())
    ax.set_yticks([200, 400, 600, 640, 800, 1000])

    fit_x = np.geomspace(7.5, 410, 240)
    fit_y = 1045 - 275 * np.log10(fit_x)
    fit = ax.plot(fit_x, fit_y, color=RELTEST_COLORS["ink"], linewidth=3.2, zorder=3)[0]
    fit.set_gid("woehler_curve")
    points = ax.scatter(life, stress, s=58, facecolors="#FFFFFF", edgecolors=RELTEST_COLORS["ink"], linewidths=1.8, zorder=4)
    points.set_gid("woehler_data")
    selected_points = ax.scatter(life[selected], stress[selected], s=76, facecolors="#FFFFFF", edgecolors=FUNCTION_COLORS["hazard"], linewidths=2.6, zorder=5)
    selected_points.set_gid("selected_load_level")
    ax.axhline(640, color=FUNCTION_COLORS["hazard"], linewidth=1.5, linestyle="--", alpha=0.75)
    ax.text(5.4, 658, "640 N/mm²", color=FUNCTION_COLORS["hazard"], weight="bold", fontsize=14)
    ax.text(45, 690, "Wöhlerkurve", color=RELTEST_COLORS["ink"], weight="bold", fontsize=15)

    fig.tight_layout(pad=0.7)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    target_svg(output, {
        "woehler_curve": "Wöhlerkurve",
        "woehler_data": "Versuchsdaten auf mehreren Lastniveaus",
        "selected_load_level": "Stichprobe bei 640 N/mm²",
    })


def build_histogram_density(output: str | Path, data: dict[str, Any]) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    failures = np.asarray(data.get("failure_cycles", [25000, 27000, 28200, 29000, 29800, 30200, 30600, 31100, 31800, 32500, 33300, 34100, 35200, 36600, 38200, 40000]), dtype=float)
    bins = np.asarray(data.get("bin_edges", [23000, 26000, 29000, 32000, 35000, 38000, 41000, 44000]), dtype=float)
    x = np.linspace(22000, 45500, 500)
    bandwidth = float(data.get("bandwidth", 2600.0))
    density = np.mean(np.exp(-0.5 * ((x[:, None] - failures[None, :]) / bandwidth) ** 2), axis=1)
    density /= density.max()

    fig, (ax_histogram, ax_density) = plt.subplots(1, 2, figsize=(13.4, 5.2), sharex=True)
    clean_figure(fig)
    style_axes(ax_histogram, "Lastwechsel $n_{LW}$", "Relative Häufigkeit")
    style_axes(ax_density, "Lastwechsel $n_{LW}$", "Relative Dichte")
    for axis in (ax_histogram, ax_density):
        axis.set_xlim(22000, 45500)
        axis.set_xticks([23000, 30000, 38000, 45000], ["23.000", "30.000", "38.000", "45.000"])
    ax_histogram.set_ylim(0, 0.34)
    ax_density.set_ylim(0, 1.08)
    weights = np.ones_like(failures) / failures.size
    histogram_title = ax_histogram.set_title("Stichprobe · Histogrammklassen", color=RELTEST_COLORS["ink"], fontsize=17, weight="bold", pad=12)
    histogram_title.set_gid("histogram_title")
    density_title = ax_density.set_title("Grundgesamtheit · Dichtefunktion", color=FUNCTION_COLORS["reliability"], fontsize=17, weight="bold", pad=12)
    density_title.set_gid("density_title")
    bars = ax_histogram.hist(failures, bins=bins, weights=weights, color=FUNCTION_COLORS["density"], alpha=0.34, edgecolor=FUNCTION_COLORS["density"], linewidth=2.0)
    for index, patch in enumerate(bars[2]):
        patch.set_gid(f"histogram_bar_{index}")
    line = ax_density.plot(x, density, color=FUNCTION_COLORS["hazard"], linewidth=4.0, zorder=4)[0]
    line.set_gid("density_curve_path")
    for value in (23000, 45000):
        ax_density.axvline(value, color=RELTEST_COLORS["muted"], linestyle="--", linewidth=1.4)

    fig.subplots_adjust(left=0.075, right=0.985, bottom=0.18, top=0.965, wspace=0.24)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    bar_ids = [f"histogram_bar_{index}" for index in range(len(bins) - 1)]
    target_svg(
        output,
        {
            "histogram_bars": "Histogrammklassen der Stichprobe",
            "density_curve": "Glatte Dichtefunktion der Grundgesamtheit",
        },
        sibling_groups=[
            ("histogram_bars", "Histogrammklassen der Stichprobe", [*bar_ids, "histogram_title"]),
            ("density_curve", "Glatte Dichtefunktion der Grundgesamtheit", ["density_curve_path", "density_title"]),
        ],
    )


def build_woehler_3d(output: str | Path, data: dict[str, Any]) -> None:
    import matplotlib.pyplot as plt
    import numpy as np
    from mpl_toolkits.mplot3d import proj3d

    stresses = np.asarray(data.get("stress_levels", [420, 460, 500, 540, 580, 620, 660, 700, 740]), dtype=float)
    stress_grid = np.linspace(float(stresses.min() - 20), float(stresses.max() + 10), 40)
    x = np.geomspace(5000, 1_000_000, 110)
    log_x = np.log10(x)
    x_mesh, stress_mesh = np.meshgrid(log_x, stress_grid)
    mean_log = 6.08 - (stress_mesh - 400.0) / 180.0
    sigma = 0.13 + (750.0 - stress_mesh) / 2600.0
    density = np.exp(-0.5 * ((x_mesh - mean_log) / sigma) ** 2)
    stress_fraction = (stress_mesh - stress_grid.min()) / (stress_grid.max() - stress_grid.min())
    low_stress_span = float(data.get("low_stress_peak_span", 1.0))
    high_stress_span = float(data.get("high_stress_peak_span", 2.0))
    peak_span = low_stress_span + stress_fraction * (high_stress_span - low_stress_span)
    log_density = -6.0 + peak_span * density

    peak_stress = np.linspace(float(stresses.min()), float(stresses.max()), 80)
    peak_life = 6.08 - (peak_stress - 400.0) / 180.0
    peak_log_density = np.full_like(peak_stress, -5.94)

    fig = plt.figure(figsize=(11.7, 6.5))
    clean_figure(fig)
    ax = fig.add_subplot(111, projection="3d")
    ax.set_facecolor("none")
    ridges = ax.plot_wireframe(
        x_mesh,
        stress_mesh,
        log_density,
        rstride=2,
        cstride=5,
        color=RELTEST_COLORS["ink"],
        linewidth=0.72,
        alpha=0.72,
    )
    ridges.set_gid("density_ridges")
    line = ax.plot(peak_life, peak_stress, peak_log_density, color=FUNCTION_COLORS["hazard"], linewidth=4.2, zorder=8)[0]
    line.set_gid("woehler_peak_line_path")
    ax.set_xlim(np.log10(5000), np.log10(1_000_000))
    ax.set_ylim(float(stress_grid.min()), float(stress_grid.max()))
    ax.set_zlim(-6.05, -3.9)
    ax.set_xticks(np.log10([5000, 10_000, 100_000, 1_000_000]))
    ax.set_xticklabels(["5.000", "10.000", "100.000", "1.000.000"])
    ax.set_yticks([400, 500, 600, 700])
    ax.set_zticks([-6, -5, -4])
    ax.set_xlabel("Laufzeit", labelpad=12)
    ax.set_ylabel("Spannung σ [N/mm²]", labelpad=12)
    ax.set_zlabel("log (Ausfalldichte)", labelpad=10)
    ax.set_box_aspect((1.65, 1.2, 0.82))
    ax.view_init(elev=float(data.get("view_elev", 27)), azim=float(data.get("view_azim", -105)))
    ax.set_proj_type("persp", focal_length=0.9)
    ax.grid(False)
    ax.tick_params(axis="x", labelsize=10, pad=1)
    ax.get_xticklabels()[0].set_ha("left")
    for axis in (ax.xaxis, ax.yaxis, ax.zaxis):
        axis.pane.set_facecolor((1.0, 1.0, 1.0, 0.0))
        axis.pane.set_edgecolor((0.40, 0.50, 0.60, 0.32))
    fig.canvas.draw()
    label_stress = 510.0
    label_life = 6.08 - (label_stress - 400.0) / 180.0
    label_x, label_y, _ = proj3d.proj_transform(label_life, label_stress, -5.94, ax.get_proj())
    line_label = ax.annotate(
        "Wöhlerlinie",
        xy=(label_x, label_y),
        xytext=(108, -96),
        xycoords=ax.transData,
        textcoords="offset points",
        color=FUNCTION_COLORS["hazard"],
        fontsize=16,
        weight="bold",
        arrowprops={"arrowstyle": "-", "color": FUNCTION_COLORS["hazard"], "linewidth": 1.8},
    )
    line_label.set_gid("woehler_peak_label")
    if line_label.arrow_patch is not None:
        line_label.arrow_patch.set_gid("woehler_peak_leader")

    fig.subplots_adjust(left=0.02, right=0.98, bottom=0.04, top=0.98)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    target_svg(
        output,
        {
            "density_ridges": "Dichtefunktionen der Spannungsniveaus",
            "woehler_peak_line": "Wöhlerlinie über den Dichtemaxima",
        },
        sibling_groups=[
            (
                "woehler_peak_line",
                "Wöhlerlinie über den Dichtemaxima",
                ["woehler_peak_line_path", "woehler_peak_leader", "woehler_peak_label"],
            ),
        ],
    )


def build_nkw_density(output: str | Path, data: dict[str, Any]) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    x = np.linspace(0, 3.0, 500)
    scale = float(data.get("scale", 0.58))
    shape = float(data.get("shape", 1.45))
    density = (x + 0.04) ** (shape - 1.0) * np.exp(-x / scale)
    density /= density.max()
    desired = normal_pdf(x, float(data.get("desired_mean", 1.75)), float(data.get("desired_sigma", 0.38)))
    desired /= desired.max()

    fig, ax = plt.subplots(figsize=(11.7, 6.4))
    clean_figure(fig)
    style_axes(ax, "Normierte Lebensdauer $t/T$", "Ausfalldichte $f(t)$")
    ax.set_xlim(0, 3)
    ax.set_ylim(0, 1.08)
    observed = ax.plot(x, density, color=FUNCTION_COLORS["density"], linewidth=4.0)[0]
    observed.set_gid("observed_density_path")
    observed_label = ax.text(0.53, 0.88, "IST", color=FUNCTION_COLORS["density"], fontsize=15, weight="bold")
    observed_label.set_gid("observed_density_label")
    desired_line = ax.plot(x, desired, color=FUNCTION_COLORS["reliability"], linewidth=3.0, linestyle="--")[0]
    desired_line.set_gid("desired_density_path")
    desired_label = ax.text(2.08, 0.83, "ZIEL", color=FUNCTION_COLORS["reliability"], fontsize=15, weight="bold")
    desired_label.set_gid("desired_density_label")
    fig.tight_layout(pad=0.7)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    target_svg(
        output,
        {
            "observed_density": "Rechtsschiefe Ausfalldichte",
            "desired_density": "Gewünschte nach rechts verschobene Dichte",
        },
        sibling_groups=[
            ("observed_density", "Rechtsschiefe Ausfalldichte", ["observed_density_path", "observed_density_label"]),
            ("desired_density", "Gewünschte nach rechts verschobene Dichte", ["desired_density_path", "desired_density_label"]),
        ],
    )


def build_human_density(output: str | Path, data: dict[str, Any]) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    age = np.linspace(0, 100, 500)
    men_location = float(data.get("men_peak_age", 78.0))
    women_location = float(data.get("women_peak_age", 87.0))
    men = logistic_pdf(age, men_location, float(data.get("men_scale", 7.5)))
    women = logistic_pdf(age, women_location, float(data.get("women_scale", 6.8)))
    men = men / men.max()
    women = women / women.max()

    fig, ax = plt.subplots(figsize=(11.7, 6.4))
    clean_figure(fig)
    style_axes(ax, "Sterbealter [Jahre]", "Relative Dichte $f(t)$")
    ax.set_xlim(0, 108)
    ax.set_xticks([0, 20, 40, 60, 80, 100])
    ax.set_ylim(0, 1.08)
    men_line = ax.plot(age, men, color="#244A7C", linewidth=4.0)[0]
    men_line.set_gid("men_density_path")
    women_line = ax.plot(age, women, color=FUNCTION_COLORS["hazard"], linewidth=4.0, linestyle="--")[0]
    women_line.set_gid("women_density_path")
    men_marker = ax.scatter([men_location], [1.0], s=100, color="#244A7C", edgecolor="#FFFFFF", linewidth=2.0, zorder=5)
    men_marker.set_gid("men_peak_marker")
    men_peak_label = ax.annotate("Männer · 78 Jahre", xy=(men_location, 1.0), xytext=(67, 0.76), color="#244A7C", fontsize=14, weight="bold", ha="right", arrowprops={"arrowstyle": "-", "color": "#244A7C", "linewidth": 1.8})
    men_peak_label.set_gid("men_peak_label")
    women_marker = ax.scatter([women_location], [1.0], s=100, color=FUNCTION_COLORS["hazard"], edgecolor="#FFFFFF", linewidth=2.0, zorder=5)
    women_marker.set_gid("women_peak_marker")
    women_peak_label = ax.annotate("Frauen · 87 Jahre", xy=(women_location, 1.0), xytext=(106, 0.86), color=FUNCTION_COLORS["hazard"], fontsize=14, weight="bold", ha="right", arrowprops={"arrowstyle": "-", "color": FUNCTION_COLORS["hazard"], "linewidth": 1.8})
    women_peak_label.set_gid("women_peak_label")

    fig.tight_layout(pad=0.7)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    target_svg(
        output,
        {
            "men_density": "Dichtefunktion Männer",
            "women_density": "Dichtefunktion Frauen",
            "men_peak": "Maximum Männer bei etwa 78 Jahren",
            "women_peak": "Maximum Frauen bei etwa 87 Jahren",
        },
        sibling_groups=[
            ("men_density", "Dichtefunktion Männer", ["men_density_path"]),
            ("women_density", "Dichtefunktion Frauen", ["women_density_path"]),
            ("men_peak", "Maximum Männer bei etwa 78 Jahren", ["men_peak_marker", "men_peak_label"]),
            ("women_peak", "Maximum Frauen bei etwa 87 Jahren", ["women_peak_marker", "women_peak_label"]),
        ],
    )


def build_empirical_cdf(output: str | Path, data: dict[str, Any]) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    counts = np.asarray(data.get("class_counts", [1, 5, 3, 2, 1]), dtype=float)
    centers = np.asarray(data.get("class_centers", [260, 290, 320, 350, 380]), dtype=float)
    width = float(data.get("class_width", 28))
    cumulative = np.cumsum(counts)
    cumulative_percent = cumulative / cumulative[-1] * 100

    fig, axes = plt.subplots(1, 2, figsize=(12.5, 6.0), gridspec_kw={"wspace": 0.30})
    clean_figure(fig)
    left, right = axes
    left.set_gid("frequency_histogram")
    right.set_gid("cumulative_histogram")
    style_axes(left, "Lastwechsel $n_{LW}$ · $10^2$", "Ausfälle je Klasse")
    style_axes(right, "Lastwechsel $n_{LW}$ · $10^2$", "Summe der Ausfälle [%]")
    left_bars = left.bar(centers, counts, width=width, color=FUNCTION_COLORS["density"], alpha=0.34, edgecolor=FUNCTION_COLORS["density"], linewidth=2.0)
    right_bars = right.bar(centers, cumulative_percent, width=width, color=FUNCTION_COLORS["failure_probability"], alpha=0.22, edgecolor=FUNCTION_COLORS["failure_probability"], linewidth=2.0)
    for bar, value in zip(left_bars, counts):
        left.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.14, f"{int(value)}", ha="center", va="bottom", color=RELTEST_COLORS["ink"], fontsize=13, weight="bold")
    for bar, value, total in zip(right_bars, cumulative_percent, cumulative):
        right.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 2.2, f"{int(total)}", ha="center", va="bottom", color=FUNCTION_COLORS["failure_probability"], fontsize=13, weight="bold")
    empirical = right.step(centers, cumulative_percent, where="mid", color=FUNCTION_COLORS["hazard"], linewidth=3.5)[0]
    empirical.set_gid("empirical_distribution")
    for ax in axes:
        ax.set_xlim(230, 410)
    left.set_ylim(0, max(counts) + 1.2)
    right.set_ylim(0, 112)

    fig.subplots_adjust(left=0.09, right=0.98, bottom=0.15, top=0.98, wspace=0.30)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    target_svg(output, {
        "frequency_histogram": "Histogramm der Einzelhäufigkeiten",
        "cumulative_histogram": "Histogramm der Summenhäufigkeit",
        "empirical_distribution": "Empirische Verteilungsfunktion F Stern von t",
    })


def smooth_cdf_values(data: dict[str, Any]):
    import numpy as np

    x = np.linspace(float(data.get("x_min", 200)), float(data.get("x_max", 450)), 500)
    cdf = logistic_cdf(x, float(data.get("location", 295)), float(data.get("scale", 24))) * 100
    return x, cdf


def build_smooth_cdf(output: str | Path, data: dict[str, Any]) -> None:
    import matplotlib.pyplot as plt

    x, cdf = smooth_cdf_values(data)
    fig, ax = plt.subplots(figsize=(11.7, 6.4))
    clean_figure(fig)
    style_axes(ax, "Lastwechsel $n_{LW}$ · $10^2$", "Ausfallwahrscheinlichkeit $F(t)$ [%]")
    ax.set_xlim(x.min(), x.max())
    ax.set_ylim(0, 100)
    line = ax.plot(x, cdf, color=FUNCTION_COLORS["failure_probability"], linewidth=4.2)[0]
    line.set_gid("smooth_distribution")
    stems = ax.vlines(x[::12], 0, cdf[::12], color=FUNCTION_COLORS["failure_probability"], linewidth=0.75, alpha=0.30)
    stems.set_gid("population_stems")
    ax.scatter([x.min(), x.max()], [0, 100], s=76, color=[FUNCTION_COLORS["failure_probability"], FUNCTION_COLORS["hazard"]], zorder=5)
    ax.annotate("0 %", xy=(x.min(), 0), xytext=(x.min() + 14, 8), color=FUNCTION_COLORS["failure_probability"], fontsize=14, weight="bold", arrowprops={"arrowstyle": "-", "color": FUNCTION_COLORS["failure_probability"], "linewidth": 1.4})
    ax.annotate("100 %", xy=(x.max(), 100), xytext=(x.max() - 24, 90), color=FUNCTION_COLORS["hazard"], fontsize=14, weight="bold", arrowprops={"arrowstyle": "-", "color": FUNCTION_COLORS["hazard"], "linewidth": 1.4})

    fig.tight_layout(pad=0.7)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    target_svg(output, {
        "smooth_distribution": "Glatte Verteilungsfunktion F von t",
        "population_stems": "Kumulierte Einheiten der Grundgesamtheit",
    })


def build_nkw_cdf(output: str | Path, data: dict[str, Any]) -> None:
    import matplotlib.pyplot as plt
    import numpy as np
    from matplotlib.collections import LineCollection

    x = np.linspace(0, float(data.get("x_max", 2.5)), 600)
    shape = float(data.get("shape", 1.6191388220705358))
    scale = float(data.get("scale", 1.0035664522976226))
    cdf = (1.0 - np.exp(-((x / scale) ** shape))) * 100
    t_at_10 = scale * (-np.log(0.9)) ** (1.0 / shape)
    f_at_1 = float((1.0 - np.exp(-((1.0 / scale) ** shape))) * 100)

    fig, ax = plt.subplots(figsize=(11.7, 6.4))
    clean_figure(fig)
    style_axes(ax, "Normierte Lebensdauer $t/T$", "Ausfallwahrscheinlichkeit $F(t)$ [%]")
    ax.set_xlim(0, x.max())
    ax.set_ylim(0, 100)
    curve = ax.plot(x, cdf, color=FUNCTION_COLORS["failure_probability"], linewidth=4.2)[0]
    curve.set_gid("nkw_distribution")
    guide_10 = LineCollection([[(0, 10), (t_at_10, 10)], [(t_at_10, 0), (t_at_10, 10)]], colors=FUNCTION_COLORS["hazard"], linewidths=2.6, linestyles="--")
    guide_10.set_gid("ten_percent_guide")
    ax.add_collection(guide_10)
    guide_t1 = LineCollection([[(1, 0), (1, f_at_1)], [(0, f_at_1), (1, f_at_1)]], colors=FUNCTION_COLORS["secondary"], linewidths=2.6, linestyles="--")
    guide_t1.set_gid("time_one_guide")
    ax.add_collection(guide_t1)
    ten_dot = ax.scatter([t_at_10], [10], s=96, color=FUNCTION_COLORS["hazard"], edgecolor="#FFFFFF", linewidth=1.8, zorder=6)
    ten_dot.set_gid("ten_percent_dot")
    ten_label = ax.text(t_at_10 + 0.06, 14, "10 % → t ≈ 0,25", color=FUNCTION_COLORS["hazard"], fontsize=14, weight="bold")
    ten_label.set_gid("ten_percent_label")
    one_dot = ax.scatter([1], [f_at_1], s=96, color=FUNCTION_COLORS["secondary"], edgecolor="#FFFFFF", linewidth=1.8, zorder=6)
    one_dot.set_gid("time_one_dot")
    one_label = ax.text(1.06, f_at_1 + 2, "t = 1 → F(t) = 63 %", color=FUNCTION_COLORS["secondary"], fontsize=14, weight="bold")
    one_label.set_gid("time_one_label")

    fig.tight_layout(pad=0.7)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    target_svg(
        output,
        {
            "nkw_distribution": "Ausfallwahrscheinlichkeit des Getriebes",
            "ten_percent_readout": "Ablesen des Zeitpunkts bei zehn Prozent",
            "time_one_readout": "Ablesen der Ausfallwahrscheinlichkeit bei t gleich eins",
        },
        sibling_groups=[
            ("ten_percent_readout", "Ablesen des Zeitpunkts bei zehn Prozent", ["ten_percent_guide", "ten_percent_dot", "ten_percent_label"]),
            ("time_one_readout", "Ablesen der Ausfallwahrscheinlichkeit bei t gleich eins", ["time_one_guide", "time_one_dot", "time_one_label"]),
        ],
    )


def build_human_cdf(output: str | Path, data: dict[str, Any]) -> None:
    import matplotlib.pyplot as plt
    import numpy as np
    from matplotlib.collections import LineCollection

    age = np.linspace(0, 100, 500)
    men = logistic_cdf(age, float(data.get("men_location", 75.9)), float(data.get("men_scale", 8.0))) * 100
    women = logistic_cdf(age, float(data.get("women_location", 84.0)), float(data.get("women_scale", 7.0))) * 100

    fig, ax = plt.subplots(figsize=(11.7, 6.4))
    clean_figure(fig)
    style_axes(ax, "Sterbealter [Jahre]", "Ausfallwahrscheinlichkeit $F(t)$ [%]")
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    men_line = ax.plot(age, men, color="#244A7C", linewidth=4.0)[0]
    men_line.set_gid("men_distribution_path")
    men_label = ax.text(68, 43, "Männer", color="#244A7C", fontsize=14, weight="bold")
    men_label.set_gid("men_distribution_label")
    women_line = ax.plot(age, women, color=FUNCTION_COLORS["hazard"], linewidth=4.0, linestyle="--")[0]
    women_line.set_gid("women_distribution_path")
    women_label = ax.text(91, 72, "Frauen", color=FUNCTION_COLORS["hazard"], fontsize=14, weight="bold")
    women_label.set_gid("women_distribution_label")
    age_80 = LineCollection([[(80, 0), (80, 62)], [(0, 62), (80, 62)], [(0, 36), (80, 36)]], colors=[RELTEST_COLORS["muted"], "#244A7C", FUNCTION_COLORS["hazard"]], linewidths=[2.0, 2.4, 2.4], linestyles="--")
    age_80.set_gid("age_80_guides")
    ax.add_collection(age_80)
    readout_dots = ax.scatter([80, 80], [62, 36], s=100, color=["#244A7C", FUNCTION_COLORS["hazard"]], edgecolor="#FFFFFF", linewidth=2.0, zorder=6)
    readout_dots.set_gid("age_80_dots")
    men_value = ax.text(82, 63.5, "62 %", color="#244A7C", fontsize=15, weight="bold")
    men_value.set_gid("age_80_men_value")
    women_value = ax.text(82, 34.5, "36 %", color=FUNCTION_COLORS["hazard"], fontsize=15, weight="bold")
    women_value.set_gid("age_80_women_value")
    bracket = LineCollection([[(86, 36), (86, 62)], [(85.4, 36), (86.6, 36)], [(85.4, 62), (86.6, 62)]], colors=FUNCTION_COLORS["secondary"], linewidths=2.2)
    bracket.set_gid("age_80_difference_bracket")
    ax.add_collection(bracket)
    difference = ax.text(88, 49, "26 Prozentpunkte", color=FUNCTION_COLORS["secondary"], fontsize=13, weight="bold", rotation=90, va="center")
    difference.set_gid("age_80_difference_label")

    fig.tight_layout(pad=0.7)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    target_svg(
        output,
        {
            "men_distribution": "Ausfallwahrscheinlichkeit Männer",
            "women_distribution": "Ausfallwahrscheinlichkeit Frauen",
            "age_80_readout": "Ablesung bei achtzig Jahren",
        },
        sibling_groups=[
            ("men_distribution", "Ausfallwahrscheinlichkeit Männer", ["men_distribution_path", "men_distribution_label"]),
            ("women_distribution", "Ausfallwahrscheinlichkeit Frauen", ["women_distribution_path", "women_distribution_label"]),
            ("age_80_readout", "Ablesung bei achtzig Jahren", ["age_80_guides", "age_80_dots", "age_80_men_value", "age_80_women_value", "age_80_difference_bracket", "age_80_difference_label"]),
        ],
    )


def build_reliability_partition(output: str | Path, data: dict[str, Any]) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    x = np.linspace(0, 10, 600)
    density = normal_pdf(x, float(data.get("mean", 5.2)), float(data.get("sigma", 1.35)))
    tx = float(data.get("tx", 4.4))

    fig, ax = plt.subplots(figsize=(11.7, 5.8))
    clean_figure(fig)
    style_axes(ax, "Ausfallzeit $t$", "Dichtefunktion $f(t)$")
    ax.set_xlim(0, 10)
    ax.set_ylim(0, density.max() * 1.16)
    line = ax.plot(x, density, color=RELTEST_COLORS["ink"], linewidth=3.4)[0]
    line.set_gid("density_reference")
    failed = ax.fill_between(x, 0, density, where=x <= tx, color=FUNCTION_COLORS["failure_probability"], alpha=0.34)
    failed.set_gid("failure_probability_shape")
    failed_label = ax.text(2.15, density.max() * 0.34, "bis $t_x$ ausgefallen", color=FUNCTION_COLORS["failure_probability"], fontsize=14, weight="bold", ha="center")
    failed_label.set_gid("failure_probability_label")
    reliable = ax.fill_between(x, 0, density, where=x >= tx, color=FUNCTION_COLORS["reliability"], alpha=0.34)
    reliable.set_gid("reliability_shape")
    reliability_label = ax.text(7.2, density.max() * 0.34, "nach $t_x$ intakt", color=FUNCTION_COLORS["reliability"], fontsize=14, weight="bold", ha="center")
    reliability_label.set_gid("reliability_label")
    tx_line = ax.axvline(tx, color=FUNCTION_COLORS["hazard"], linewidth=2.0, linestyle="--")
    tx_line.set_gid("tx_reference_line")
    tx_label = ax.text(tx, density.max() * 1.06, "$t_x$", color=FUNCTION_COLORS["hazard"], fontsize=16, weight="bold", ha="center")
    tx_label.set_gid("tx_reference_label")

    fig.tight_layout(pad=0.7)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    target_svg(
        output,
        {
            "density_reference": "Dichtefunktion als Bezugsverteilung",
            "tx_reference": "Bezugszeitpunkt tx",
            "failure_probability_area": "Fläche der bis tx ausgefallenen Einheiten",
            "reliability_area": "Fläche der nach tx intakten Einheiten",
        },
        sibling_groups=[
            ("tx_reference", "Bezugszeitpunkt tx", ["tx_reference_line", "tx_reference_label"]),
            ("failure_probability_area", "Fläche der bis tx ausgefallenen Einheiten", ["failure_probability_shape", "failure_probability_label"]),
            ("reliability_area", "Fläche der nach tx intakten Einheiten", ["reliability_shape", "reliability_label"]),
        ],
    )


def build_human_hazard(output: str | Path, data: dict[str, Any]) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    age = np.linspace(0, 100, 500)
    early = 0.11 * np.exp(-age / 5.5)
    baseline = 0.018 + 0.004 * np.exp(-((age - 30) / 14) ** 2)
    men = early + baseline + 0.00075 * np.exp(np.maximum(age - 58, 0) / 9.3)
    women = 0.82 * early + 0.78 * baseline + 0.00062 * np.exp(np.maximum(age - 64, 0) / 9.5)
    normalization = men.max()
    men /= normalization
    women /= normalization

    fig, ax = plt.subplots(figsize=(11.7, 6.4))
    clean_figure(fig)
    style_axes(ax, "Sterbealter [Jahre]", r"Relative Ausfallrate $\lambda(t)$")
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 1.08)
    ax.axvspan(0, 12, color=FUNCTION_COLORS["hazard"], alpha=0.08)
    ax.axvspan(12, 60, color=FUNCTION_COLORS["density"], alpha=0.06)
    ax.axvspan(60, 100, color=FUNCTION_COLORS["secondary"], alpha=0.08)
    men_line = ax.plot(age, men, color="#244A7C", linewidth=4.0)[0]
    men_line.set_gid("men_hazard_path")
    men_label = ax.text(83, 0.33, "Männer", color="#244A7C", fontsize=14, weight="bold")
    men_label.set_gid("men_hazard_label")
    women_line = ax.plot(age, women, color=FUNCTION_COLORS["hazard"], linewidth=4.0, linestyle="--")[0]
    women_line.set_gid("women_hazard_path")
    women_label = ax.text(88, 0.17, "Frauen", color=FUNCTION_COLORS["hazard"], fontsize=14, weight="bold")
    women_label.set_gid("women_hazard_label")
    ax.text(6, 0.98, "früh", ha="center", weight="bold", color=FUNCTION_COLORS["hazard"])
    ax.text(36, 0.98, "nahezu konstant", ha="center", weight="bold", color=FUNCTION_COLORS["density"])
    ax.text(80, 0.98, "altersbedingt", ha="center", weight="bold", color=FUNCTION_COLORS["secondary"])

    fig.tight_layout(pad=0.7)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    target_svg(
        output,
        {
            "men_hazard": "Ausfallrate Männer",
            "women_hazard": "Ausfallrate Frauen",
        },
        sibling_groups=[
            ("men_hazard", "Ausfallrate Männer", ["men_hazard_path", "men_hazard_label"]),
            ("women_hazard", "Ausfallrate Frauen", ["women_hazard_path", "women_hazard_label"]),
        ],
    )


def build_nkw_hazard(output: str | Path, data: dict[str, Any]) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    x = np.linspace(0, 5, 500)
    hazard = 0.30 + 1.08 * np.sqrt(x)

    fig, ax = plt.subplots(figsize=(11.7, 6.4))
    clean_figure(fig)
    style_axes(ax, "Normierte Lebensdauer $t/T$", r"Ausfallrate $\lambda(t)$")
    ax.set_xlim(0, 5)
    ax.set_ylim(0, 3.0)
    line = ax.plot(x, hazard, color=FUNCTION_COLORS["hazard"], linewidth=4.2)[0]
    line.set_gid("nkw_hazard_curve")
    area = ax.fill_between(x, 0, hazard, color=FUNCTION_COLORS["hazard"], alpha=0.11)
    area.set_gid("wearout_area_shape")
    mechanism_label = ax.text(3.0, 2.05, "Verschleiß und Ermüdung", color=FUNCTION_COLORS["hazard"], fontsize=15, weight="bold")
    mechanism_label.set_gid("wearout_area_label")

    fig.tight_layout(pad=0.7)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    target_svg(
        output,
        {
            "nkw_hazard_curve": "Kontinuierlich steigende Ausfallrate",
            "wearout_area": "Verschleiß- und Ermüdungsbereich",
        },
        sibling_groups=[
            ("wearout_area", "Verschleiß- und Ermüdungsbereich", ["wearout_area_shape", "wearout_area_label"]),
        ],
    )


BUILDERS = {
    "woehler": build_woehler,
    "histogram_density": build_histogram_density,
    "woehler_3d": build_woehler_3d,
    "nkw_density": build_nkw_density,
    "human_density": build_human_density,
    "empirical_cdf": build_empirical_cdf,
    "smooth_cdf": build_smooth_cdf,
    "nkw_cdf": build_nkw_cdf,
    "human_cdf": build_human_cdf,
    "reliability_partition": build_reliability_partition,
    "human_hazard": build_human_hazard,
    "nkw_hazard": build_nkw_hazard,
}


def main() -> None:
    parser = argparse.ArgumentParser(description="RelTest reliability-function plots without visible titles.")
    parser.add_argument("--plot", required=True, choices=sorted(BUILDERS))
    parser.add_argument("--output", required=True)
    parser.add_argument("--data")
    args = parser.parse_args()

    apply_reltest_style()
    BUILDERS[args.plot](args.output, read_data(args.data))


if __name__ == "__main__":
    main()
