from __future__ import annotations

import argparse
import json
import math
from pathlib import Path

from reltest_plot_style import RELTEST_COLORS, apply_reltest_style, save_figure, style_axes
from svg_animation_targets import prepare_svg_animation_targets


CURVE_COLORS = [
    RELTEST_COLORS["data"],
    RELTEST_COLORS["warning"],
    RELTEST_COLORS["support"],
]
FAILURE_COLOR = RELTEST_COLORS["accent"]


def load_config(path: str | Path) -> dict:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def clean_figure(fig) -> None:
    fig.patch.set_alpha(0)
    for ax in fig.axes:
        ax.set_facecolor("none")


def normal_pdf(x, mean: float, sigma: float):
    import numpy as np

    return np.exp(-0.5 * ((x - mean) / sigma) ** 2) / (sigma * math.sqrt(2.0 * math.pi))


def normal_cdf(x, mean: float, sigma: float):
    import numpy as np

    erf = np.vectorize(math.erf)
    return 0.5 * (1.0 + erf((x - mean) / (sigma * math.sqrt(2.0))))


def normal_curve_config(config: dict):
    mean = float(config.get("mean", 2.5))
    sigmas = [float(value) for value in config.get("sigmas", [0.5, 1.0, 2.0])]
    return mean, sigmas


def exponential_curve_config(config: dict):
    return [float(value) for value in config.get("lambdas", [2.0, 1.0, 0.5])]


def add_curve_legend(ax, handles, labels, gid: str, location: str = "upper right") -> None:
    legend = ax.legend(handles, labels, loc=location, frameon=False, fontsize=15)
    legend.set_gid(gid)


def build_normal_density(config: dict, output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    mean, sigmas = normal_curve_config(config)
    x = np.linspace(float(config.get("x_min", 0.0)), float(config.get("x_max", 5.0)), 700)
    fig, ax = plt.subplots(figsize=(10.8, 6.2))
    clean_figure(fig)
    style_axes(ax, "Lebensdauer t", "Dichtefunktion f(t)")
    ax.set_xlim(x.min(), x.max())
    ax.set_ylim(0, float(config.get("density_y_max", 0.9)))

    handles = []
    child_ids = []
    for index, (sigma, color) in enumerate(zip(sigmas, CURVE_COLORS), start=1):
        line = ax.plot(x, normal_pdf(x, mean, sigma), color=color, linewidth=3.3)[0]
        line_id = f"normal_density_sigma_{index}"
        line.set_gid(line_id)
        handles.append(line)
        child_ids.append(line_id)
    add_curve_legend(ax, handles, [f"$\\sigma = {value:g}$".replace(".", ",") for value in sigmas], "normal_density_legend")
    child_ids.append("normal_density_legend")

    mean_line = ax.axvline(mean, color=RELTEST_COLORS["muted"], linewidth=2.2, linestyle="--")
    mean_line.set_gid("normal_mean_line")
    mean_label = ax.text(mean - 0.10, 0.84, "μ", color=RELTEST_COLORS["ink"], fontsize=19, weight="bold", ha="right")
    mean_label.set_gid("normal_mean_label")

    fig.subplots_adjust(left=0.14, right=0.97, top=0.94, bottom=0.17)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {
            "normal_density_curves": "Dichtekurven der Normalverteilung",
            "normal_mean_marker": "Lageparameter mü",
        },
        sibling_groups=[
            ("normal_density_curves", "Dichtekurven der Normalverteilung", child_ids),
            ("normal_mean_marker", "Lageparameter mü", ["normal_mean_line", "normal_mean_label"]),
        ],
    )


def build_normal_hazard(config: dict, output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    mean, sigmas = normal_curve_config(config)
    x = np.linspace(0.0, float(config.get("x_max", 5.0)), 700)
    fig, ax = plt.subplots(figsize=(8.7, 5.4))
    clean_figure(fig)
    style_axes(ax, "Lebensdauer t", r"Ausfallrate $\lambda(t)$")
    ax.set_xlim(0, x.max())
    ax.set_ylim(0, float(config.get("hazard_y_max", 6.0)))

    handles = []
    child_ids = []
    for index, (sigma, color) in enumerate(zip(sigmas, CURVE_COLORS), start=1):
        density = normal_pdf(x, mean, sigma)
        survival = np.maximum(1.0 - normal_cdf(x, mean, sigma), 1e-8)
        hazard = np.minimum(density / survival, ax.get_ylim()[1] * 1.08)
        line = ax.plot(x, hazard, color=color, linewidth=3.2)[0]
        line_id = f"normal_hazard_sigma_{index}"
        line.set_gid(line_id)
        handles.append(line)
        child_ids.append(line_id)
    add_curve_legend(ax, handles, [f"$\\sigma = {value:g}$".replace(".", ",") for value in sigmas], "normal_hazard_legend", "upper left")
    child_ids.append("normal_hazard_legend")
    annotation = ax.text(4.78, ax.get_ylim()[1] * 0.93, "kontinuierlich steigend", color=FAILURE_COLOR, fontsize=15, weight="bold", ha="right")
    annotation.set_gid("normal_hazard_annotation")
    child_ids.append("normal_hazard_annotation")

    fig.subplots_adjust(left=0.17, right=0.97, top=0.93, bottom=0.2)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {"normal_hazard_curves": "Steigende Ausfallrate der Normalverteilung"},
        sibling_groups=[("normal_hazard_curves", "Steigende Ausfallrate der Normalverteilung", child_ids)],
    )


def build_normal_cdf(config: dict, output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    mean, sigmas = normal_curve_config(config)
    x = np.linspace(float(config.get("cdf_x_min", -2.0)), float(config.get("x_max", 5.0)), 800)
    fig, ax = plt.subplots(figsize=(8.7, 5.4))
    clean_figure(fig)
    style_axes(ax, "Lebensdauer t", "Ausfallwahrscheinlichkeit F(t)")
    ax.set_xlim(x.min(), x.max())
    ax.set_ylim(0, 1.02)
    ax.set_yticks(np.linspace(0, 1, 6))

    handles = []
    curve_ids = []
    for index, (sigma, color) in enumerate(zip(sigmas, CURVE_COLORS), start=1):
        line = ax.plot(x, normal_cdf(x, mean, sigma), color=color, linewidth=3.2)[0]
        line_id = f"normal_cdf_sigma_{index}"
        line.set_gid(line_id)
        handles.append(line)
        curve_ids.append(line_id)
    add_curve_legend(ax, handles, [f"$\\sigma = {value:g}$".replace(".", ",") for value in sigmas], "normal_cdf_legend", "lower right")
    curve_ids.append("normal_cdf_legend")

    negative_region = ax.axvspan(x.min(), 0.0, color=FAILURE_COLOR, alpha=0.11)
    negative_region.set_gid("normal_negative_time_region")
    zero_line = ax.axvline(0.0, color=FAILURE_COLOR, linewidth=2.4, linestyle="--")
    zero_line.set_gid("normal_zero_line")
    zero_value = float(normal_cdf(np.asarray([0.0]), mean, sigmas[-1])[0])
    zero_point = ax.scatter([0.0], [zero_value], s=95, color=FAILURE_COLOR, edgecolor="#FFFFFF", linewidth=1.8, zorder=6)
    zero_point.set_gid("normal_zero_point")
    zero_label = ax.text(0.16, zero_value + 0.08, f"$F(0) = {zero_value * 100:.0f}\\,\\%$ bei $\\sigma = {sigmas[-1]:g}$".replace(".", ","), color=FAILURE_COLOR, fontsize=15, weight="bold")
    zero_label.set_gid("normal_zero_label")
    negative_label = ax.text(-1.86, 0.94, "negative Ausfallzeiten", color=FAILURE_COLOR, fontsize=14, weight="bold", ha="left")
    negative_label.set_gid("normal_negative_label")

    fig.subplots_adjust(left=0.17, right=0.97, top=0.93, bottom=0.2)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {
            "normal_cdf_curves": "Ausfallwahrscheinlichkeit der Normalverteilung",
            "normal_zero_problem": "Ausfälle bei und vor t gleich null",
        },
        sibling_groups=[
            ("normal_cdf_curves", "Ausfallwahrscheinlichkeit der Normalverteilung", curve_ids),
            ("normal_zero_problem", "Ausfälle bei und vor t gleich null", ["normal_negative_time_region", "normal_zero_line", "normal_zero_point", "normal_zero_label", "normal_negative_label"]),
        ],
    )


def build_exponential_density(config: dict, output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    lambdas = exponential_curve_config(config)
    x = np.linspace(0, float(config.get("x_max", 5.0)), 700)
    fig, ax = plt.subplots(figsize=(10.8, 6.2))
    clean_figure(fig)
    style_axes(ax, "Lebensdauer t", "Dichtefunktion f(t)")
    ax.set_xlim(0, x.max())
    ax.set_ylim(0, float(config.get("density_y_max", 2.15)))

    handles = []
    child_ids = []
    for index, (rate, color) in enumerate(zip(lambdas, CURVE_COLORS), start=1):
        line = ax.plot(x, rate * np.exp(-rate * x), color=color, linewidth=3.3)[0]
        line_id = f"exponential_density_lambda_{index}"
        line.set_gid(line_id)
        handles.append(line)
        child_ids.append(line_id)
    add_curve_legend(ax, handles, [f"$\\lambda = {value:g}$".replace(".", ",") for value in lambdas], "exponential_density_legend")
    child_ids.append("exponential_density_legend")

    fig.subplots_adjust(left=0.14, right=0.97, top=0.94, bottom=0.17)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {"exponential_density_curves": "Dichtekurven der Exponentialverteilung"},
        sibling_groups=[("exponential_density_curves", "Dichtekurven der Exponentialverteilung", child_ids)],
    )


def build_exponential_hazard(config: dict, output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    lambdas = exponential_curve_config(config)
    x = np.linspace(0, float(config.get("x_max", 5.0)), 120)
    fig, ax = plt.subplots(figsize=(8.7, 5.4))
    clean_figure(fig)
    style_axes(ax, "Lebensdauer t", r"Ausfallrate $\lambda(t)$")
    ax.set_xlim(0, x.max())
    ax.set_ylim(0, float(config.get("hazard_y_max", 2.35)))

    child_ids = []
    for index, (rate, color) in enumerate(zip(lambdas, CURVE_COLORS), start=1):
        line = ax.plot(x, np.full_like(x, rate), color=color, linewidth=3.3)[0]
        line_id = f"exponential_hazard_lambda_{index}"
        line.set_gid(line_id)
        child_ids.append(line_id)
        direct_label = ax.text(
            4.72,
            rate + 0.14,
            f"$\\lambda = {rate:g}$".replace(".", ","),
            color=color,
            fontsize=15,
            weight="bold",
            ha="right",
            bbox={"facecolor": "white", "edgecolor": "none", "alpha": 0.88, "pad": 2.0},
        )
        label_id = f"exponential_hazard_label_{index}"
        direct_label.set_gid(label_id)
        child_ids.append(label_id)
    annotation = ax.text(0.18, 2.18, "über die Lebensdauer konstant", color=FAILURE_COLOR, fontsize=15, weight="bold")
    annotation.set_gid("exponential_hazard_annotation")
    child_ids.append("exponential_hazard_annotation")

    fig.subplots_adjust(left=0.17, right=0.97, top=0.93, bottom=0.2)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {"exponential_hazard_curves": "Konstante Ausfallrate der Exponentialverteilung"},
        sibling_groups=[("exponential_hazard_curves", "Konstante Ausfallrate der Exponentialverteilung", child_ids)],
    )


def build_exponential_cdf(config: dict, output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    lambdas = exponential_curve_config(config)
    x = np.linspace(0, float(config.get("x_max", 5.0)), 700)
    fig, ax = plt.subplots(figsize=(8.7, 5.4))
    clean_figure(fig)
    style_axes(ax, "Lebensdauer t", "Ausfallwahrscheinlichkeit F(t)")
    ax.set_xlim(0, x.max())
    ax.set_ylim(0, 1.02)
    ax.set_yticks(np.linspace(0, 1, 6))

    handles = []
    curve_ids = []
    for index, (rate, color) in enumerate(zip(lambdas, CURVE_COLORS), start=1):
        line = ax.plot(x, 1.0 - np.exp(-rate * x), color=color, linewidth=3.2)[0]
        line_id = f"exponential_cdf_lambda_{index}"
        line.set_gid(line_id)
        handles.append(line)
        curve_ids.append(line_id)
    add_curve_legend(ax, handles, [f"$\\lambda = {value:g}$".replace(".", ",") for value in lambdas], "exponential_cdf_legend", "lower right")
    curve_ids.append("exponential_cdf_legend")

    zero_point = ax.scatter([0], [0], s=105, color=FAILURE_COLOR, edgecolor="#FFFFFF", linewidth=1.8, zorder=6)
    zero_point.set_gid("exponential_zero_point")
    zero_label = ax.text(0.48, 0.075, "$F(0) = 0$", color=FAILURE_COLOR, fontsize=16, weight="bold")
    zero_label.set_gid("exponential_zero_label")

    fig.subplots_adjust(left=0.17, right=0.97, top=0.93, bottom=0.2)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {
            "exponential_cdf_curves": "Ausfallwahrscheinlichkeit der Exponentialverteilung",
            "exponential_zero_start": "Start bei null Prozent Ausfallwahrscheinlichkeit",
        },
        sibling_groups=[
            ("exponential_cdf_curves", "Ausfallwahrscheinlichkeit der Exponentialverteilung", curve_ids),
            ("exponential_zero_start", "Start bei null Prozent Ausfallwahrscheinlichkeit", ["exponential_zero_point", "exponential_zero_label"]),
        ],
    )


BUILDERS = {
    "normal_density": build_normal_density,
    "normal_hazard": build_normal_hazard,
    "normal_cdf": build_normal_cdf,
    "exponential_density": build_exponential_density,
    "exponential_hazard": build_exponential_hazard,
    "exponential_cdf": build_exponential_cdf,
}


def main() -> None:
    parser = argparse.ArgumentParser(description="Normal- und Exponentialverteilungsplots für RelTest-Lernfolien.")
    parser.add_argument("--plot", required=True, choices=sorted(BUILDERS))
    parser.add_argument("--input", required=True, help="Folienspezifische JSON-Konfiguration.")
    parser.add_argument("--output", required=True, help="Ziel-SVG.")
    args = parser.parse_args()
    apply_reltest_style()
    BUILDERS[args.plot](load_config(args.input), args.output)


if __name__ == "__main__":
    main()
