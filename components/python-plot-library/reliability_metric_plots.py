from __future__ import annotations

import argparse
from pathlib import Path

from reltest_plot_style import RELTEST_COLORS, apply_reltest_style, save_figure, style_axes
from svg_animation_targets import prepare_svg_animation_targets


COLORS = {
    "mean": RELTEST_COLORS["warning"],
    "failure": RELTEST_COLORS["accent"],
    "reliability": RELTEST_COLORS["data"],
    "curve": RELTEST_COLORS["support"],
}


def clean_figure(fig) -> None:
    fig.patch.set_alpha(0)
    for ax in fig.axes:
        ax.set_facecolor("none")


def build_mttf(output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    failures = np.asarray([52.0, 92.0, 111.0, 151.0])
    mttf = float(failures.mean())
    x = np.linspace(0, 190, 600)
    sigma = 34.0
    density = np.exp(-0.5 * ((x - mttf) / sigma) ** 2)
    density /= density.max()

    fig, ax = plt.subplots(figsize=(14.4, 3.4))
    clean_figure(fig)
    style_axes(ax, "Laufleistung [km]")
    ax.set_xlim(0, 190)
    ax.set_ylim(0, 1.16)
    ax.set_xticks([0, 50, 100, 150])
    ax.set_xticklabels(["0", "50.000", "100.000", "150.000"])
    ax.set_yticks([])
    ax.grid(False)
    ax.spines["left"].set_visible(False)

    density_line = ax.plot(x, density, color=COLORS["curve"], linewidth=3.4)[0]
    density_line.set_gid("mttf_density_curve")
    density_fill = ax.fill_between(x, 0, density, color=COLORS["curve"], alpha=0.10)
    density_fill.set_gid("mttf_density_fill")
    density_label = ax.text(158, 0.86, "Dichtefunktion $f(t)$", color=COLORS["curve"], fontsize=18, weight="bold", ha="right")
    density_label.set_gid("mttf_density_label")

    mean_line = ax.axvline(mttf, color=COLORS["mean"], linewidth=3.2, linestyle="--")
    mean_line.set_gid("mttf_mean_line")
    mean_label = ax.text(mttf - 4, 0.96, f"MTTF = {mttf * 1000:,.0f} km".replace(",", "."), color=COLORS["mean"], fontsize=18, weight="bold", ha="right")
    mean_label.set_gid("mttf_mean_label")

    fig.tight_layout(pad=0.7)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {
            "mttf_density": "Dichtefunktion der Lebensdauer",
            "mttf_marker": "Mittlere Lebensdauer MTTF",
        },
        sibling_groups=[
            ("mttf_density", "Dichtefunktion der Lebensdauer", ["mttf_density_fill", "mttf_density_curve", "mttf_density_label"]),
            ("mttf_marker", "Mittlere Lebensdauer MTTF", ["mttf_mean_line", "mttf_mean_label"]),
        ],
    )


def monotone_curve(x_nodes, y_nodes, samples_per_interval: int = 90):
    import numpy as np

    x_nodes = np.asarray(x_nodes, dtype=float)
    y_nodes = np.asarray(y_nodes, dtype=float)
    delta = np.diff(y_nodes) / np.diff(x_nodes)
    slopes = np.empty_like(y_nodes)
    slopes[0] = delta[0]
    slopes[-1] = delta[-1]
    for index in range(1, len(y_nodes) - 1):
        if delta[index - 1] * delta[index] <= 0:
            slopes[index] = 0
        else:
            slopes[index] = 2 / (1 / delta[index - 1] + 1 / delta[index])
    xs = []
    ys = []
    for index in range(len(x_nodes) - 1):
        left = x_nodes[index]
        right = x_nodes[index + 1]
        width = right - left
        u = np.linspace(0, 1, samples_per_interval, endpoint=index == len(x_nodes) - 2)
        h00 = 2 * u**3 - 3 * u**2 + 1
        h10 = u**3 - 2 * u**2 + u
        h01 = -2 * u**3 + 3 * u**2
        h11 = u**3 - u**2
        xs.append(left + u * width)
        ys.append(h00 * y_nodes[index] + h10 * width * slopes[index] + h01 * y_nodes[index + 1] + h11 * width * slopes[index + 1])
    return np.concatenate(xs), np.concatenate(ys)


def build_bq_life(output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np
    from matplotlib.collections import LineCollection

    lifetimes = np.asarray([100, 250, 700, 1200], dtype=float)
    probabilities = np.asarray([5, 10, 20, 50], dtype=float)
    positions = np.arange(1, 5, dtype=float)
    line_positions = np.linspace(0.62, 4.38, 240)

    fig, ax = plt.subplots(figsize=(11.8, 6.1))
    clean_figure(fig)
    style_axes(ax, "Laufleistung [km]", "Ausfallwahrscheinlichkeit $F(t)$ [%]")
    ax.set_xlim(0.5, 4.5)
    ax.set_ylim(0.5, 4.5)
    ax.set_xticks(positions)
    ax.set_xticklabels(["100.000", "250.000", "700.000", "1.200.000"])
    ax.set_yticks(positions)
    ax.set_yticklabels(["5", "10", "20", "50"])
    ax.grid(True, which="major")

    curve = ax.plot(line_positions, line_positions, color=COLORS["curve"], linewidth=4.0)[0]
    curve.set_gid("bq_distribution_curve")
    curve_label = ax.text(2.86, 4.2, "Verteilungsgerade", color=COLORS["curve"], fontsize=18, weight="bold")
    curve_label.set_gid("bq_distribution_label")

    b5_guides = LineCollection([[(0.5, 1), (1, 1)], [(1, 0.5), (1, 1)]], colors=COLORS["failure"], linewidths=2.5, linestyles="--")
    b5_guides.set_gid("b5_guides")
    ax.add_collection(b5_guides)
    b5_point = ax.scatter([1], [1], s=150, color=COLORS["failure"], edgecolor="#FFFFFF", linewidth=2.0, zorder=6)
    b5_point.set_gid("b5_point")
    b5_label = ax.text(-0.01, -0.22, "$B_5 = 100.000$ km", transform=ax.transAxes, clip_on=False, color=COLORS["failure"], fontsize=18, weight="bold", ha="left")
    b5_label.set_gid("b5_label")
    b5_failed = ax.text(0.43, -0.30, "5 % ausgefallen", transform=ax.transAxes, clip_on=False, color=COLORS["failure"], fontsize=18, weight="bold", ha="right")
    b5_failed.set_gid("b5_failed_label")
    b5_separator = ax.text(0.45, -0.30, "|", transform=ax.transAxes, clip_on=False, color=RELTEST_COLORS["muted"], fontsize=18, weight="bold", ha="center")
    b5_separator.set_gid("b5_separator")
    b5_intact = ax.text(0.47, -0.30, "95 % intakt", transform=ax.transAxes, clip_on=False, color=COLORS["reliability"], fontsize=18, weight="bold", ha="left")
    b5_intact.set_gid("b5_intact_label")

    other_segments = []
    for position in positions[1:]:
        other_segments.extend([[(0.5, position), (position, position)], [(position, 0.5), (position, position)]])
    other_guides = LineCollection(other_segments, colors=RELTEST_COLORS["muted"], linewidths=1.5, linestyles="--", alpha=0.75)
    other_guides.set_gid("other_bq_guides")
    ax.add_collection(other_guides)
    other_points = ax.scatter(positions[1:], positions[1:], s=105, color=COLORS["reliability"], edgecolor="#FFFFFF", linewidth=1.8, zorder=6)
    other_points.set_gid("other_bq_points")
    labels = []
    for position, probability in zip(positions[1:], probabilities[1:]):
        item = ax.text(position, position + 0.18, f"$B_{{{int(probability)}}}$", color=COLORS["reliability"], fontsize=18, weight="bold", ha="center")
        item.set_gid(f"bq_label_{int(probability)}")
        labels.append(f"bq_label_{int(probability)}")

    fig.subplots_adjust(left=0.12, right=0.98, top=0.92, bottom=0.30)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {
            "bq_distribution": "Verteilungskurve der Ausfallwahrscheinlichkeit",
            "b5_example": "B5-Lebensdauer bei 100.000 Kilometern",
            "other_bq_markers": "Weitere Bq-Lebensdauern",
        },
        sibling_groups=[
            ("bq_distribution", "Verteilungskurve der Ausfallwahrscheinlichkeit", ["bq_distribution_curve", "bq_distribution_label"]),
            ("b5_example", "B5-Lebensdauer bei 100.000 Kilometern", ["b5_guides", "b5_point", "b5_label", "b5_failed_label", "b5_separator", "b5_intact_label"]),
            ("other_bq_markers", "Weitere Bq-Lebensdauern", ["other_bq_guides", "other_bq_points", *labels]),
        ],
    )


BUILDERS = {
    "mttf": build_mttf,
    "bq_life": build_bq_life,
}


def main() -> None:
    parser = argparse.ArgumentParser(description="RelTest Zuverlässigkeitskennzahlen-Plots ohne sichtbare Titel.")
    parser.add_argument("--plot", required=True, choices=sorted(BUILDERS))
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    apply_reltest_style()
    BUILDERS[args.plot](args.output)


if __name__ == "__main__":
    main()
