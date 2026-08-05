from __future__ import annotations

import argparse
import json
from pathlib import Path

from reltest_plot_style import RELTEST_COLORS, apply_reltest_style, save_figure, style_axes
from svg_animation_targets import prepare_svg_animation_targets


def normal_density(x, mean: float, sigma: float):
    import numpy as np

    return np.exp(-0.5 * ((x - mean) / sigma) ** 2) / (sigma * np.sqrt(2 * np.pi))


def build_plot(config_path: str | Path, output: str | Path) -> None:
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    import numpy as np

    config = json.loads(Path(config_path).read_text(encoding="utf-8"))
    x = np.linspace(config.get("x_min", 0), config.get("x_max", 12), 500)
    stress = normal_density(x, config["stress_mean"], config["stress_sigma"])
    strength = normal_density(x, config["strength_mean"], config["strength_sigma"])
    visible_support_sigma = float(config.get("visible_support_sigma", 2.6))

    def visible_support(mean: float, sigma: float):
        left = mean - visible_support_sigma * sigma
        right = mean + visible_support_sigma * sigma
        return (x >= left) & (x <= right)

    # Complete Gaussian tails meet the baseline continuously. The support masks
    # are used only to define the didactic overlap interval.
    stress_visible = stress
    strength_visible = strength
    stress_support = visible_support(config["stress_mean"], config["stress_sigma"])
    strength_support = visible_support(config["strength_mean"], config["strength_sigma"])

    overlap_support = stress_support & strength_support
    overlap_indices = np.flatnonzero(overlap_support)
    if overlap_indices.size < 2:
        raise ValueError("Stress and strength distributions do not have a visible overlap interval.")
    overlap_left = x[overlap_indices[0]]
    overlap_right = x[overlap_indices[-1]]
    overlap_width = overlap_right - overlap_left

    reference_strength_mean = float(config.get("previous_strength_mean", config["strength_mean"]))
    reference_strength_sigma = float(config.get("strength_sigma", config["stress_sigma"]))
    reference_left = max(
        config["stress_mean"] - visible_support_sigma * config["stress_sigma"],
        reference_strength_mean - visible_support_sigma * reference_strength_sigma,
    )
    reference_right = min(
        config["stress_mean"] + visible_support_sigma * config["stress_sigma"],
        reference_strength_mean + visible_support_sigma * reference_strength_sigma,
    )
    reference_overlap_width = max(reference_right - reference_left, overlap_width)

    failure_mean = (overlap_left + overlap_right) / 2
    # The source uses a classic bell-shaped failure distribution. A complete
    # Gaussian preserves that silhouette and lets both tails meet the baseline
    # naturally, without hard clipping or compact-support shoulders.
    failure_sigma = max(overlap_width / (2 * visible_support_sigma), np.finfo(float).eps)
    failure_distribution = normal_density(x, failure_mean, failure_sigma)
    failure_peak_ratio = float(config.get("failure_peak_ratio", 0.3))
    width_ratio = min(1.0, overlap_width / reference_overlap_width)
    failure_peak = min(stress.max(), strength.max()) * failure_peak_ratio * width_ratio
    if failure_distribution.max() > 0:
        failure_distribution *= failure_peak / failure_distribution.max()

    apply_reltest_style()
    fig, ax = plt.subplots(figsize=(11.8, 6.2))
    fig.patch.set_alpha(0)
    ax.set_facecolor("none")
    style_axes(ax, "Belastung / Belastbarkeit", "Relative Häufigkeit")
    ax.set_xlim(x.min(), x.max())
    ax.set_ylim(0, max(stress_visible.max(), strength_visible.max()) * 1.22)
    ax.set_yticklabels([])
    ax.spines["left"].set_visible(False)
    ax.spines["bottom"].set_visible(False)
    axis_arrow = {
        "arrowstyle": "-|>",
        "color": RELTEST_COLORS["ink"],
        "linewidth": 1.8,
        "mutation_scale": 16,
        "shrinkA": 0,
        "shrinkB": 0,
    }
    x_axis_arrow = ax.annotate(
        "",
        xy=(1.015, 0),
        xytext=(0, 0),
        xycoords="axes fraction",
        arrowprops=axis_arrow,
        annotation_clip=False,
    )
    x_axis_arrow.set_gid("x_axis_arrow")
    y_axis_arrow = ax.annotate(
        "",
        xy=(0, 1.025),
        xytext=(0, 0),
        xycoords="axes fraction",
        arrowprops=axis_arrow,
        annotation_clip=False,
    )
    y_axis_arrow.set_gid("y_axis_arrow")

    stress_fill = ax.fill_between(
        x,
        0,
        stress_visible,
        color=RELTEST_COLORS["data_20"],
        alpha=0.72,
        zorder=2,
    )
    stress_fill.set_gid("stress_fill")
    stress_line = ax.plot(x, stress_visible, color=RELTEST_COLORS["data"], linewidth=3.4, zorder=4)[0]
    stress_line.set_gid("stress_line")

    strength_fill = ax.fill_between(x, 0, strength_visible, color=RELTEST_COLORS["ink"], alpha=0.12, zorder=2)
    strength_fill.set_gid("strength_fill")
    strength_line = ax.plot(x, strength_visible, color=RELTEST_COLORS["ink"], linewidth=3.4, zorder=4)[0]
    strength_line.set_gid("strength_line")

    overlap_fill = ax.fill_between(
        x,
        0,
        failure_distribution,
        color=RELTEST_COLORS["accent"],
        alpha=0.52,
        zorder=5,
    )
    overlap_fill.set_gid("failure_distribution_fill")
    overlap_line = ax.plot(
        x,
        failure_distribution,
        color=RELTEST_COLORS["accent"],
        linewidth=2.4,
        zorder=6,
    )[0]
    overlap_line.set_gid("failure_distribution_line")

    available_targets = {
        "stress_distribution": "Belastungsverteilung",
        "strength_distribution": "Belastbarkeitsverteilung",
        "failure_overlap": "Ausfallverteilung im Überlappungsbereich",
    }
    available_groups = {
        "stress_distribution": ("stress_distribution", "Belastungsverteilung", ["stress_fill", "stress_line"]),
        "strength_distribution": ("strength_distribution", "Belastbarkeitsverteilung", ["strength_fill", "strength_line"]),
        "failure_overlap": (
            "failure_overlap",
            "Ausfallverteilung im Überlappungsbereich",
            [
                "failure_distribution_fill",
                "failure_distribution_line",
                "failure_overlap_leader",
                "failure_overlap_label",
            ],
        ),
    }

    if "previous_strength_mean" in config:
        previous = normal_density(x, config["previous_strength_mean"], config["strength_sigma"])
        previous_visible = previous
        previous_line = ax.plot(
            x,
            previous_visible,
            color=RELTEST_COLORS["muted"],
            linewidth=2.0,
            linestyle="--",
            zorder=3,
        )[0]
        previous_line.set_gid("previous_strength_curve")
        strength_line.set_gid("shifted_strength_curve")
        strength_fill.set_gid("shifted_strength_fill")
        available_targets.pop("strength_distribution")
        available_groups.pop("strength_distribution")
        available_targets["shifted_strength_distribution"] = "Erhöhte Belastbarkeit"
        available_targets["previous_strength_curve"] = "Ausgangslage der Belastbarkeit"
        available_groups["shifted_strength_distribution"] = (
            "shifted_strength_distribution",
            "Erhöhte Belastbarkeit",
            ["shifted_strength_fill", "shifted_strength_curve"],
        )
    else:
        previous = None

    stress_label = ax.text(config["stress_mean"], stress.max() * 1.06, "Belastung", ha="center", color=RELTEST_COLORS["data"], weight="bold")
    stress_label.set_gid("stress_label")
    strength_label = ax.text(config["strength_mean"], strength.max() * 1.06, "Belastbarkeit", ha="center", color=RELTEST_COLORS["ink"], weight="bold")
    strength_label.set_gid("strength_label")
    failure_anchor_x = float(config.get("failure_label_anchor_x", failure_mean))
    failure_anchor_y = float(np.interp(failure_anchor_x, x, failure_distribution))
    main_peak = min(stress.max(), strength.max())
    failure_label_x = float(config.get("failure_label_x", config["strength_mean"] + 2.2))
    failure_label_y = main_peak * float(config.get("failure_label_y_ratio", 0.24))
    failure_label = ax.annotate(
        "Ausfälle",
        xy=(failure_anchor_x, failure_anchor_y),
        xytext=(failure_label_x, failure_label_y),
        ha="left",
        va="center",
        color=RELTEST_COLORS["accent"],
        weight="bold",
        bbox={"facecolor": "white", "edgecolor": "none", "alpha": 0.9, "pad": 1.5},
        arrowprops={
            "arrowstyle": "-",
            "color": RELTEST_COLORS["accent"],
            "linewidth": 1.4,
            "shrinkA": 4,
            "shrinkB": 2,
            "connectionstyle": "arc3,rad=-0.08",
        },
        zorder=8,
    )
    failure_label.set_gid("failure_overlap_label")
    if failure_label.arrow_patch is not None:
        failure_label.arrow_patch.set_gid("failure_overlap_leader")

    target_attributes = {}
    if previous is not None and config.get("include_initial_strength_distribution", False):
        initial_fill = ax.fill_between(x, 0, previous_visible, color=RELTEST_COLORS["ink"], alpha=0.12, zorder=2)
        initial_fill.set_gid("initial_strength_fill")
        initial_line = ax.plot(x, previous_visible, color=RELTEST_COLORS["ink"], linewidth=3.4, zorder=4)[0]
        initial_line.set_gid("initial_strength_curve")
        initial_label = ax.text(
            config["previous_strength_mean"],
            previous_visible.max() * 1.06,
            "Belastbarkeit",
            ha="center",
            color=RELTEST_COLORS["ink"],
            weight="bold",
        )
        initial_label.set_gid("initial_strength_label")
        available_targets["initial_strength_distribution"] = "Ausgangslage der Belastbarkeit"
        available_groups["initial_strength_distribution"] = (
            "initial_strength_distribution",
            "Ausgangslage der Belastbarkeit",
            ["initial_strength_fill", "initial_strength_curve", "initial_strength_label"],
        )
        target_attributes["initial_strength_distribution"] = {
            "style": "visibility: hidden; opacity: 0",
            "data-anim-role": "transient-start-state",
        }
    available_groups["stress_distribution"][2].append("stress_label")
    if "shifted_strength_distribution" in available_groups:
        available_groups["shifted_strength_distribution"][2].append("strength_label")
    else:
        available_groups["strength_distribution"][2].append("strength_label")

    fig.tight_layout(pad=0.8)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    requested_targets = config.get("animation_targets", list(available_targets))
    target_labels = {target_id: available_targets[target_id] for target_id in requested_targets}
    sibling_groups = [available_groups[target_id] for target_id in requested_targets if target_id in available_groups]
    prepare_svg_animation_targets(
        output,
        target_labels,
        sibling_groups=sibling_groups,
        target_attributes=target_attributes,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="RelTest stress-strength interference plot without a visible title.")
    parser.add_argument("--config", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    build_plot(args.config, args.output)


if __name__ == "__main__":
    main()
