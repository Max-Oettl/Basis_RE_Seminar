from __future__ import annotations

import argparse
import json
import math
from pathlib import Path

from reltest_plot_style import RELTEST_COLORS, apply_reltest_style, save_figure, style_axes
from svg_animation_targets import prepare_svg_animation_targets


EARLY = RELTEST_COLORS["data"]
RANDOM = RELTEST_COLORS["support"]
WEAR = RELTEST_COLORS["accent"]
AMBER = RELTEST_COLORS["warning"]
PURPLE = RELTEST_COLORS["muted"]
MUTED = RELTEST_COLORS["muted"]


def load_config(path: str | Path) -> dict:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def clean_figure(fig) -> None:
    fig.patch.set_alpha(0)
    for ax in fig.axes:
        ax.set_facecolor("none")


def weibull_pdf(x, beta: float, eta: float = 1.0, t0: float = 0.0):
    import numpy as np

    shifted = np.maximum(x - t0, 0.0)
    result = np.zeros_like(x, dtype=float)
    mask = shifted > 0
    ratio = shifted[mask] / max(eta - t0, 1e-9)
    result[mask] = (
        beta
        / max(eta - t0, 1e-9)
        * np.power(ratio, beta - 1.0)
        * np.exp(-np.power(ratio, beta))
    )
    return result


def weibull_cdf(x, beta: float, eta: float = 1.0, t0: float = 0.0):
    import numpy as np

    shifted = np.maximum(x - t0, 0.0)
    ratio = shifted / max(eta - t0, 1e-9)
    return 1.0 - np.exp(-np.power(ratio, beta))


def weibull_hazard(x, beta: float, eta: float = 1.0):
    import numpy as np

    return beta / eta * np.power(np.maximum(x, 1e-6) / eta, beta - 1.0)


def probability_y(probability):
    import numpy as np

    clipped = np.clip(probability, 1e-7, 1.0 - 1e-7)
    return np.log(-np.log(1.0 - clipped))


def normal_cdf(values):
    import numpy as np

    erf = np.vectorize(math.erf)
    return 0.5 * (1.0 + erf(values / math.sqrt(2.0)))


def lognormal_pdf(x, mu: float, sigma: float):
    import numpy as np

    return np.exp(-0.5 * ((np.log(x) - mu) / sigma) ** 2) / (
        x * sigma * math.sqrt(2.0 * math.pi)
    )


def lognormal_cdf(x, mu: float, sigma: float):
    import numpy as np

    return normal_cdf((np.log(x) - mu) / sigma)


def direct_label(ax, x, y, text, color, gid, size=15, ha="left") -> None:
    label = ax.text(
        x,
        y,
        text,
        color=color,
        fontsize=size,
        weight="bold",
        ha=ha,
        va="center",
        bbox={"facecolor": "white", "edgecolor": "none", "alpha": 0.9, "pad": 1.8},
    )
    label.set_gid(gid)


def build_weibull_density(config: dict, output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    betas = [float(value) for value in config.get("betas", [0.5, 1.0, 2.0, 3.5])]
    eta = float(config.get("eta", 1.0))
    x = np.linspace(float(config.get("x_min", 0.04)), float(config.get("x_max", 2.5)), 800)
    colors = [EARLY, RANDOM, AMBER, WEAR]
    fig, ax = plt.subplots(figsize=(10.8, 6.2))
    clean_figure(fig)
    style_axes(ax, "Lebensdauer t", "Dichtefunktion f(t)")
    ax.set_xlim(x.min(), x.max())
    ax.set_ylim(0, float(config.get("y_max", 2.15)))

    children = []
    label_x = [0.19, 2.15, 1.74, 1.29]
    for index, (beta, color, position) in enumerate(zip(betas, colors, label_x), start=1):
        values = weibull_pdf(x, beta, eta)
        line = ax.plot(x, values, color=color, linewidth=3.2)[0]
        line_id = f"weibull_density_beta_{index}"
        line.set_gid(line_id)
        y = float(np.interp(position, x, values))
        label_id = f"weibull_density_label_{index}"
        direct_label(ax, position, y + 0.07, f"$b = {beta:g}$".replace(".", ","), color, label_id)
        children.extend([line_id, label_id])

    eta_line = ax.axvline(eta, color=MUTED, linewidth=2.2, linestyle="--")
    eta_line.set_gid("weibull_density_eta_line")
    eta_label = ax.text(eta, 2.02, "$T = 1$", color=RELTEST_COLORS["ink"], fontsize=17, weight="bold", ha="center")
    eta_label.set_gid("weibull_density_eta_label")

    fig.subplots_adjust(left=0.14, right=0.97, top=0.94, bottom=0.17)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {
            "weibull_density_curves": "Dichtekurven der Weibullverteilung",
            "weibull_density_eta": "Charakteristische Lebensdauer",
        },
        sibling_groups=[
            ("weibull_density_curves", "Dichtekurven der Weibullverteilung", children),
            (
                "weibull_density_eta",
                "Charakteristische Lebensdauer",
                ["weibull_density_eta_line", "weibull_density_eta_label"],
            ),
        ],
    )


def build_weibull_hazard(config: dict, output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    eta = float(config.get("eta", 1.0))
    x = np.linspace(0.06, float(config.get("x_max", 2.5)), 600)
    cases = [
        (0.5, EARLY, "weibull_hazard_early", "$b < 1$ · sinkend"),
        (1.0, RANDOM, "weibull_hazard_random", "$b = 1$ · konstant"),
        (2.0, WEAR, "weibull_hazard_wear", "$b > 1$ · steigend"),
    ]
    fig, ax = plt.subplots(figsize=(10.8, 6.2))
    clean_figure(fig)
    style_axes(ax, "Lebensdauer t", r"Ausfallrate $\lambda(t)$")
    ax.set_xlim(0, x.max())
    ax.set_ylim(0, float(config.get("y_max", 4.8)))

    positions = [1.95, 1.82, 1.62]
    for (beta, color, group_id, label), position in zip(cases, positions):
        values = weibull_hazard(x, beta, eta)
        line = ax.plot(x, values, color=color, linewidth=3.6)[0]
        line_id = f"{group_id}_line"
        line.set_gid(line_id)
        y = float(np.interp(position, x, values))
        label_id = f"{group_id}_label"
        direct_label(ax, position, y + 0.12, label, color, label_id)

    fig.subplots_adjust(left=0.14, right=0.97, top=0.94, bottom=0.17)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {
            "weibull_hazard_early": "Sinkende Ausfallrate bei b kleiner eins",
            "weibull_hazard_random": "Konstante Ausfallrate bei b gleich eins",
            "weibull_hazard_wear": "Steigende Ausfallrate bei b größer eins",
        },
        sibling_groups=[
            ("weibull_hazard_early", "Sinkende Ausfallrate bei b kleiner eins", ["weibull_hazard_early_line", "weibull_hazard_early_label"]),
            ("weibull_hazard_random", "Konstante Ausfallrate bei b gleich eins", ["weibull_hazard_random_line", "weibull_hazard_random_label"]),
            ("weibull_hazard_wear", "Steigende Ausfallrate bei b größer eins", ["weibull_hazard_wear_line", "weibull_hazard_wear_label"]),
        ],
    )


def build_weibull_cdf(config: dict, output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    betas = [float(value) for value in config.get("betas", [0.5, 1.0, 2.0, 3.5])]
    eta = float(config.get("eta", 1.0))
    x = np.linspace(0.0, float(config.get("x_max", 2.5)), 800)
    colors = [EARLY, RANDOM, AMBER, WEAR]
    fig, ax = plt.subplots(figsize=(10.8, 6.2))
    clean_figure(fig)
    style_axes(ax, "Lebensdauer t", "Ausfallwahrscheinlichkeit F(t)")
    ax.set_xlim(0, x.max())
    ax.set_ylim(0, 1.02)
    ax.set_yticks(np.linspace(0, 1, 6))

    children = []
    label_x = [2.17, 2.06, 1.77, 1.54]
    for index, (beta, color, position) in enumerate(zip(betas, colors, label_x), start=1):
        values = weibull_cdf(x, beta, eta)
        line = ax.plot(x, values, color=color, linewidth=3.2)[0]
        line_id = f"weibull_cdf_beta_{index}"
        line.set_gid(line_id)
        label_id = f"weibull_cdf_label_{index}"
        direct_label(ax, position, float(np.interp(position, x, values)), f"$b = {beta:g}$".replace(".", ","), color, label_id)
        children.extend([line_id, label_id])

    probability = 1.0 - math.exp(-1.0)
    vertical = ax.vlines(eta, 0, probability, color=WEAR, linewidth=2.5, linestyle="--")
    vertical.set_gid("weibull_common_vertical")
    horizontal = ax.hlines(probability, 0, eta, color=WEAR, linewidth=2.5, linestyle="--")
    horizontal.set_gid("weibull_common_horizontal")
    point = ax.scatter([eta], [probability], s=115, color=WEAR, edgecolor="#FFFFFF", linewidth=2.0, zorder=8)
    point.set_gid("weibull_common_point_marker")
    label = ax.text(eta + 0.08, probability - 0.11, r"$F(T) = 63{,}2\,\%$", color=WEAR, fontsize=17, weight="bold")
    label.set_gid("weibull_common_point_label")

    fig.subplots_adjust(left=0.14, right=0.97, top=0.94, bottom=0.17)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {
            "weibull_cdf_curves": "Ausfallwahrscheinlichkeiten der Weibullverteilung",
            "weibull_common_point": "Gemeinsamer Punkt bei 63,2 Prozent",
        },
        sibling_groups=[
            ("weibull_cdf_curves", "Ausfallwahrscheinlichkeiten der Weibullverteilung", children),
            (
                "weibull_common_point",
                "Gemeinsamer Punkt bei 63,2 Prozent",
                ["weibull_common_vertical", "weibull_common_horizontal", "weibull_common_point_marker", "weibull_common_point_label"],
            ),
        ],
    )


def build_weibull_shift(config: dict, output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    beta = float(config.get("beta", 2.0))
    eta = float(config.get("eta", 2.2))
    t0 = float(config.get("t0", 0.7))
    x = np.linspace(0, float(config.get("x_max", 5.0)), 800)
    fig, ax = plt.subplots(figsize=(10.8, 6.2))
    clean_figure(fig)
    style_axes(ax, "Ausfallzeit t", "Dichtefunktion f(t)")
    ax.set_xlim(0, x.max())
    ax.set_ylim(0, float(config.get("y_max", 0.95)))

    base_values = weibull_pdf(x, beta, eta, 0.0)
    shifted_x = x[x >= t0]
    shifted_values = weibull_pdf(shifted_x, beta, eta, t0)
    base = ax.plot(x, base_values, color=MUTED, linewidth=3.0, linestyle="--")[0]
    base.set_gid("weibull_shift_base_curve")
    base_label = ax.text(1.12, 0.77, "2 Parameter", color=MUTED, fontsize=16, weight="bold")
    base_label.set_gid("weibull_shift_base_label")
    shifted = ax.plot(shifted_x, shifted_values, color=WEAR, linewidth=3.8)[0]
    shifted.set_gid("weibull_shifted_curve_line")
    shifted_label = ax.text(2.92, 0.69, "3 Parameter", color=WEAR, fontsize=16, weight="bold")
    shifted_label.set_gid("weibull_shifted_curve_label")
    t0_line = ax.vlines(t0, 0, 0.25, color=WEAR, linewidth=2.5)
    t0_line.set_gid("weibull_shift_t0_line")
    t0_label = ax.text(t0, 0.29, "$t_0$", color=WEAR, fontsize=19, weight="bold", ha="center")
    t0_label.set_gid("weibull_shift_t0_label")

    fig.subplots_adjust(left=0.14, right=0.97, top=0.94, bottom=0.17)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {
            "weibull_shift_base": "Zweiparametrige Ausgangsverteilung",
            "weibull_shifted_curve": "Nach rechts verschobene dreiparametrige Verteilung",
            "weibull_shift_t0": "Ausfallfreie Zeit",
        },
        sibling_groups=[
            ("weibull_shift_base", "Zweiparametrige Ausgangsverteilung", ["weibull_shift_base_curve", "weibull_shift_base_label"]),
            ("weibull_shifted_curve", "Nach rechts verschobene dreiparametrige Verteilung", ["weibull_shifted_curve_line", "weibull_shifted_curve_label"]),
            ("weibull_shift_t0", "Ausfallfreie Zeit", ["weibull_shift_t0_line", "weibull_shift_t0_label"]),
        ],
    )


def setup_probability_axes(ax, x_min=0.1, x_max=100.0) -> None:
    import numpy as np

    style_axes(ax, "Lebensdauer t", "Ausfallwahrscheinlichkeit F(t)")
    ax.set_xscale("log")
    ax.set_xlim(x_min, x_max)
    probabilities = np.asarray([0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.3, 0.5, 0.632, 0.8, 0.9, 0.95, 0.99])
    ax.set_ylim(probability_y(0.001), probability_y(0.99))
    ax.set_yticks(probability_y(probabilities))
    ax.set_yticklabels([str(value).replace(".", ",") for value in [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 30, 50, 63.2, 80, 90, 95, 99]])


def build_weibull_paper(config: dict, output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    x = np.logspace(-1, 2, 500)
    pole_x = float(config.get("pole_x", 10.0))
    example_eta = float(config.get("example_eta", 3.0))
    beta = float(config.get("beta", 1.25))
    fig, ax = plt.subplots(figsize=(10.8, 6.2))
    clean_figure(fig)
    setup_probability_axes(ax)

    reference_children = []
    for index, (value, color) in enumerate([(0.5, EARLY), (1.0, RANDOM), (2.0, AMBER), (3.5, PURPLE)], start=1):
        line = ax.plot(x, value * np.log(x / pole_x), color=color, linewidth=2.0, alpha=0.78)[0]
        line_id = f"weibull_paper_reference_{index}"
        line.set_gid(line_id)
        reference_children.append(line_id)
    example = ax.plot(x, beta * np.log(x / example_eta), color=WEAR, linewidth=3.6)[0]
    example.set_gid("weibull_paper_example_line")
    example_label = ax.text(0.18, probability_y(0.72), "ermittelte Weibull-Gerade", color=WEAR, fontsize=15, weight="bold")
    example_label.set_gid("weibull_paper_example_label")
    parallel = ax.plot(x, beta * np.log(x / pole_x), color=WEAR, linewidth=2.7, linestyle="--")[0]
    parallel.set_gid("weibull_paper_parallel_line")
    pole = ax.scatter([pole_x], [probability_y(0.0012)], s=105, color=RELTEST_COLORS["ink"], zorder=8)
    pole.set_gid("weibull_paper_pole")
    pole_label = ax.text(pole_x, probability_y(0.0017), "Pol", fontsize=15, weight="bold", ha="center", color=RELTEST_COLORS["ink"])
    pole_label.set_gid("weibull_paper_pole_label")
    beta_label = ax.text(74, probability_y(0.028), "$b = 1{,}25$", color=WEAR, fontsize=17, weight="bold", ha="right")
    beta_label.set_gid("weibull_paper_beta")

    fig.subplots_adjust(left=0.16, right=0.97, top=0.94, bottom=0.18)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {
            "weibull_paper_reference": "Referenzgeraden des Weibullpapiers",
            "weibull_paper_example": "Ermittelte Weibull-Gerade",
            "weibull_paper_parallel": "Parallele Verschiebung zum Pol",
            "weibull_paper_beta": "Abgelesener Formparameter",
        },
        sibling_groups=[
            ("weibull_paper_reference", "Referenzgeraden des Weibullpapiers", reference_children),
            ("weibull_paper_example", "Ermittelte Weibull-Gerade", ["weibull_paper_example_line", "weibull_paper_example_label"]),
            ("weibull_paper_parallel", "Parallele Verschiebung zum Pol", ["weibull_paper_parallel_line", "weibull_paper_pole", "weibull_paper_pole_label"]),
        ],
    )


def build_nkw_cdf(config: dict, output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    beta = float(config.get("beta", 1.4))
    x = np.linspace(0, float(config.get("x_max", 3.7)), 500)
    probabilities = weibull_cdf(x, beta, 1.0)
    point_x = np.linspace(0.08, 3.35, 28)
    point_y = weibull_cdf(point_x, beta, 1.0)
    fig, ax = plt.subplots(figsize=(10.8, 6.2))
    clean_figure(fig)
    style_axes(ax, "Normierte Lebensdauer $t/T$", "Ausfallwahrscheinlichkeit $F(t)$")
    ax.set_xlim(0, x.max())
    ax.set_ylim(0, 1.02)
    ax.set_yticks(np.linspace(0, 1, 6))
    curve = ax.plot(x, probabilities, color=EARLY, linewidth=3.5)[0]
    curve.set_gid("nkw_cdf_curve_line")
    points = ax.scatter(point_x, point_y, marker="x", s=42, color=EARLY, linewidth=1.5)
    points.set_gid("nkw_cdf_points")
    label = ax.text(2.77, 0.72, "$b = 1{,}4$", color=EARLY, fontsize=18, weight="bold")
    label.set_gid("nkw_cdf_beta_label")

    fig.subplots_adjust(left=0.14, right=0.97, top=0.94, bottom=0.17)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {"nkw_cdf_curve": "S-förmige Ausfallwahrscheinlichkeit", "nkw_cdf_data": "Ausfalldaten und Formparameter"},
        sibling_groups=[
            ("nkw_cdf_curve", "S-förmige Ausfallwahrscheinlichkeit", ["nkw_cdf_curve_line"]),
            ("nkw_cdf_data", "Ausfalldaten und Formparameter", ["nkw_cdf_points", "nkw_cdf_beta_label"]),
        ],
    )


def build_nkw_probability(config: dict, output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    beta = float(config.get("beta", 1.4))
    x = np.logspace(math.log10(0.03), math.log10(4.0), 400)
    point_x = np.geomspace(0.04, 3.55, 28)
    fig, ax = plt.subplots(figsize=(10.8, 6.2))
    clean_figure(fig)
    setup_probability_axes(ax, 0.03, 4.0)
    line = ax.plot(x, beta * np.log(x), color=EARLY, linewidth=3.5)[0]
    line.set_gid("nkw_probability_fit")
    points = ax.scatter(point_x, beta * np.log(point_x), marker="x", s=44, color=EARLY, linewidth=1.5)
    points.set_gid("nkw_probability_points")
    label = ax.text(0.075, probability_y(0.12), "$b = 1{,}4$", color=EARLY, fontsize=18, weight="bold")
    label.set_gid("nkw_probability_beta")

    fig.subplots_adjust(left=0.16, right=0.97, top=0.94, bottom=0.18)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {"nkw_probability_data": "Transformierte Ausfalldaten", "nkw_probability_line": "Geradenförmiger Weibull-Fit"},
        sibling_groups=[
            ("nkw_probability_data", "Transformierte Ausfalldaten", ["nkw_probability_points"]),
            ("nkw_probability_line", "Geradenförmiger Weibull-Fit", ["nkw_probability_fit", "nkw_probability_beta"]),
        ],
    )


def build_weibull_mechanisms(config: dict, output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    fig, ax = plt.subplots(figsize=(10.8, 6.2))
    clean_figure(fig)
    setup_probability_axes(ax, 0.1, 100)
    knots_x = [0.1, 1.0, 10.0, 100.0]
    knots_y = [probability_y(0.002), probability_y(0.005), probability_y(0.10), probability_y(0.99)]
    segments = [
        (knots_x[0], knots_x[1], knots_y[0], knots_y[1], EARLY, "mechanism_early", "$b < 1$: Frühausfälle", 0.28),
        (knots_x[1], knots_x[2], knots_y[1], knots_y[2], RANDOM, "mechanism_random", "$b = 1$: Zufallsausfälle", 3.0),
        (knots_x[2], knots_x[3], knots_y[2], knots_y[3], WEAR, "mechanism_wear", "$b > 1$: Verschleiß", 29.0),
    ]
    for x_start, x_end, y_start, y_end, color, group_id, label, label_x in segments:
        x = np.logspace(math.log10(x_start), math.log10(x_end), 90)
        fraction = (np.log10(x) - math.log10(x_start)) / (math.log10(x_end) - math.log10(x_start))
        y = y_start + fraction * (y_end - y_start)
        line = ax.plot(x, y, color=color, linewidth=3.8)[0]
        line_id = f"{group_id}_line"
        line.set_gid(line_id)
        label_id = f"{group_id}_label"
        label_fraction = (math.log10(label_x) - math.log10(x_start)) / (math.log10(x_end) - math.log10(x_start))
        label_y = y_start + label_fraction * (y_end - y_start)
        direct_label(ax, label_x, float(label_y + 0.24), label, color, label_id)
    warning_markers = ax.scatter(
        [knots_x[1], knots_x[2]],
        [knots_y[1], knots_y[2]],
        s=105,
        facecolor="#FFFFFF",
        edgecolor=WEAR,
        linewidth=2.4,
        zorder=8,
    )
    warning_markers.set_gid("mechanism_kink_markers")
    warning = ax.text(
        3.2,
        probability_y(0.19),
        "Knick = Mechanismenwechsel",
        color=WEAR,
        fontsize=16,
        weight="bold",
        ha="center",
    )
    warning.set_gid("mechanism_kink_label")

    fig.subplots_adjust(left=0.16, right=0.97, top=0.94, bottom=0.18)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {
            "mechanism_early": "Frühausfallmechanismus",
            "mechanism_random": "Zufallsausfallmechanismus",
            "mechanism_wear": "Verschleißmechanismus",
            "mechanism_kink_warning": "Knick als Warnsignal für mehrere Mechanismen",
        },
        sibling_groups=[
            ("mechanism_early", "Frühausfallmechanismus", ["mechanism_early_line", "mechanism_early_label"]),
            ("mechanism_random", "Zufallsausfallmechanismus", ["mechanism_random_line", "mechanism_random_label"]),
            ("mechanism_wear", "Verschleißmechanismus", ["mechanism_wear_line", "mechanism_wear_label"]),
            ("mechanism_kink_warning", "Knick als Warnsignal für mehrere Mechanismen", ["mechanism_kink_markers", "mechanism_kink_label"]),
        ],
    )


def build_weibull_bathtub_network(config: dict, output: str | Path) -> None:
    """Couple the bathtub curve and Weibull-paper mechanism slopes on one time axis."""
    import matplotlib.pyplot as plt
    import numpy as np

    fig = plt.figure(figsize=(11.8, 7.0))
    grid = fig.add_gridspec(2, 1, height_ratios=(0.78, 1.72), hspace=0.08)
    bathtub_ax = fig.add_subplot(grid[0])
    weibull_ax = fig.add_subplot(grid[1], sharex=bathtub_ax)
    clean_figure(fig)

    x = np.logspace(-1, 2, 700)
    log_time = np.log10(x)
    bathtub = (
        0.22
        + 1.55 * np.exp(-3.4 * (log_time + 1.0))
        + 1.28 * np.exp(3.1 * (log_time - 2.0))
    )
    phase_spans = [
        (0.1, 1.0, EARLY, "Frühausfälle"),
        (1.0, 10.0, RANDOM, "Zufallsausfälle"),
        (10.0, 100.0, WEAR, "Ermüdung / Verschleiß"),
    ]

    for axis in (bathtub_ax, weibull_ax):
        axis.set_xscale("log")
        axis.set_xlim(0.1, 100.0)
        for start, end, color, _ in phase_spans:
            axis.axvspan(start, end, color=color, alpha=0.075, zorder=0)
        for boundary in (1.0, 10.0):
            axis.axvline(boundary, color=MUTED, linewidth=1.3, linestyle="--", zorder=1)

    style_axes(bathtub_ax, "", r"Ausfallrate $\lambda(t)$")
    bathtub_ax.set_ylim(0.0, 2.05)
    bathtub_ax.set_yticks([])
    bathtub_ax.tick_params(axis="x", which="both", bottom=False, labelbottom=False)
    bathtub_ax.grid(False)
    curve = bathtub_ax.plot(x, bathtub, color=RELTEST_COLORS["ink"], linewidth=3.7, zorder=5)[0]
    curve.set_gid("weibull_bathtub_curve_line")
    phase_centers = [math.sqrt(start * end) for start, end, _, _ in phase_spans]
    context_children = ["weibull_bathtub_curve_line"]
    for index, ((_, _, color, label), center) in enumerate(zip(phase_spans, phase_centers), start=1):
        phase_label = bathtub_ax.text(
            center,
            1.88,
            f"Bereich {index} · {label}",
            color=color,
            fontsize=13.5,
            weight="bold",
            ha="center",
            va="top",
        )
        phase_label_id = f"weibull_bathtub_phase_{index}_label"
        phase_label.set_gid(phase_label_id)
        context_children.append(phase_label_id)

    setup_probability_axes(weibull_ax, 0.1, 100.0)
    knots_x = [0.1, 1.0, 10.0, 100.0]
    knots_y = [probability_y(0.002), probability_y(0.005), probability_y(0.10), probability_y(0.99)]
    segments = [
        (knots_x[0], knots_x[1], knots_y[0], knots_y[1], EARLY, "weibull_bathtub_early", "$b < 1$: Frühausfälle", 0.22),
        (knots_x[1], knots_x[2], knots_y[1], knots_y[2], RANDOM, "weibull_bathtub_random", "$b = 1$: Zufallsausfälle", 2.35),
        (knots_x[2], knots_x[3], knots_y[2], knots_y[3], WEAR, "weibull_bathtub_wear", "$b > 1$: Ermüdung / Verschleiß", 25.0),
    ]
    targets: dict[str, str] = {"weibull_bathtub_curve": "Badewannenkurve und Lebenszyklusbereiche"}
    sibling_groups = [
        (
            "weibull_bathtub_curve",
            "Badewannenkurve und Lebenszyklusbereiche",
            context_children,
        )
    ]
    for x_start, x_end, y_start, y_end, color, group_id, label, label_x in segments:
        segment_x = np.logspace(math.log10(x_start), math.log10(x_end), 100)
        fraction = (np.log10(segment_x) - math.log10(x_start)) / (math.log10(x_end) - math.log10(x_start))
        segment_y = y_start + fraction * (y_end - y_start)
        line = weibull_ax.plot(segment_x, segment_y, color=color, linewidth=3.8, zorder=5)[0]
        line_id = f"{group_id}_line"
        line.set_gid(line_id)
        label_fraction = (math.log10(label_x) - math.log10(x_start)) / (math.log10(x_end) - math.log10(x_start))
        label_y = y_start + label_fraction * (y_end - y_start)
        label_id = f"{group_id}_label"
        direct_label(weibull_ax, label_x, float(label_y + 0.22), label, color, label_id, size=14)
        targets[group_id] = label.replace("$", "")
        sibling_groups.append((group_id, label.replace("$", ""), [line_id, label_id]))

    kink_markers = weibull_ax.scatter(
        [1.0, 10.0],
        [knots_y[1], knots_y[2]],
        s=82,
        facecolor="#FFFFFF",
        edgecolor=WEAR,
        linewidth=2.2,
        zorder=8,
    )
    kink_markers.set_gid("weibull_bathtub_kink_markers")
    weibull_ax.text(
        3.2,
        probability_y(0.22),
        "Knick = Wechsel des Ausfallmechanismus",
        color=WEAR,
        fontsize=14,
        weight="bold",
        ha="center",
    ).set_gid("weibull_bathtub_kink_label")

    # The kink is only meaningful once the third mechanism completes the
    # segmented Weibull line. Keep markers and annotation in that same
    # semantic animation group so the diagnosis never appears in advance.
    sibling_groups = [
        (
            group_id,
            label,
            children + ["weibull_bathtub_kink_markers", "weibull_bathtub_kink_label"]
            if group_id == "weibull_bathtub_wear"
            else children,
        )
        for group_id, label, children in sibling_groups
    ]

    fig.subplots_adjust(left=0.14, right=0.975, top=0.98, bottom=0.14)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(output, targets, sibling_groups=sibling_groups)


def build_lognormal_density(config: dict, output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    mu = float(config.get("mu", 0.9))
    sigmas = [float(value) for value in config.get("sigmas", [0.25, 0.5, 1.0])]
    x = np.linspace(0.03, float(config.get("x_max", 5.0)), 800)
    colors = [RANDOM, AMBER, EARLY]
    fig, ax = plt.subplots(figsize=(10.8, 6.2))
    clean_figure(fig)
    style_axes(ax, "Lebensdauer t", "Dichtefunktion f(t)")
    ax.set_xlim(0, x.max())
    ax.set_ylim(0, float(config.get("y_max", 0.82)))
    children = []
    positions = [2.95, 3.45, 4.15]
    for index, (sigma, color, position) in enumerate(zip(sigmas, colors, positions), start=1):
        values = lognormal_pdf(x, mu, sigma)
        line = ax.plot(x, values, color=color, linewidth=3.3)[0]
        line_id = f"lognormal_density_sigma_{index}"
        line.set_gid(line_id)
        label_id = f"lognormal_density_label_{index}"
        direct_label(ax, position, float(np.interp(position, x, values)) + 0.035, rf"$\sigma = {sigma:g}$".replace(".", ","), color, label_id)
        children.extend([line_id, label_id])

    fig.subplots_adjust(left=0.14, right=0.97, top=0.94, bottom=0.17)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {"lognormal_density_curves": "Dichtekurven der Lognormalverteilung"},
        sibling_groups=[("lognormal_density_curves", "Dichtekurven der Lognormalverteilung", children)],
    )


def build_lognormal_hazard(config: dict, output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    mu = float(config.get("mu", 0.9))
    sigmas = [float(value) for value in config.get("sigmas", [0.25, 0.5, 1.0])]
    x = np.linspace(0.05, float(config.get("x_max", 8.0)), 1000)
    colors = [RANDOM, AMBER, EARLY]
    fig, ax = plt.subplots(figsize=(10.8, 6.2))
    clean_figure(fig)
    style_axes(ax, "Lebensdauer t", r"Ausfallrate $\lambda(t)$")
    ax.set_xlim(0, x.max())
    ax.set_ylim(0, float(config.get("y_max", 3.2)))
    children = []
    focus_curve = None
    for index, (sigma, color) in enumerate(zip(sigmas, colors), start=1):
        density = lognormal_pdf(x, mu, sigma)
        survival = np.maximum(1.0 - lognormal_cdf(x, mu, sigma), 1e-10)
        values = density / survival
        values = np.minimum(values, ax.get_ylim()[1] * 1.05)
        line = ax.plot(x, values, color=color, linewidth=3.3)[0]
        line_id = f"lognormal_hazard_sigma_{index}"
        line.set_gid(line_id)
        children.append(line_id)
        if index == 1:
            focus_curve = values
    max_index = int(np.argmax(focus_curve))
    max_x = float(x[max_index])
    max_y = float(focus_curve[max_index])
    marker = ax.scatter([max_x], [max_y], s=115, color=WEAR, edgecolor="#FFFFFF", linewidth=2.0, zorder=8)
    marker.set_gid("lognormal_hazard_max_marker")
    label = ax.text(max_x - 0.2, max_y - 0.36, "Maximum, danach Abfall", color=WEAR, fontsize=16, weight="bold", ha="right")
    label.set_gid("lognormal_hazard_max_label")

    fig.subplots_adjust(left=0.14, right=0.97, top=0.94, bottom=0.17)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {
            "lognormal_hazard_curves": "Ausfallraten der Lognormalverteilung",
            "lognormal_hazard_limit": "Maximum und anschließender Abfall",
        },
        sibling_groups=[
            ("lognormal_hazard_curves", "Ausfallraten der Lognormalverteilung", children),
            ("lognormal_hazard_limit", "Maximum und anschließender Abfall", ["lognormal_hazard_max_marker", "lognormal_hazard_max_label"]),
        ],
    )


def build_lognormal_probability_pair(config: dict, output: str | Path) -> None:
    import matplotlib.pyplot as plt
    import numpy as np

    mu = float(config.get("mu", 0.9))
    sigma = float(config.get("sigma", 0.5))
    x = np.linspace(0.03, float(config.get("x_max", 6.0)), 800)
    failure = lognormal_cdf(x, mu, sigma)
    reliability = 1.0 - failure
    fig, ax = plt.subplots(figsize=(8.0, 4.8))
    clean_figure(fig)
    style_axes(ax, "Lebensdauer t", "Wahrscheinlichkeit")
    ax.set_xlim(0, x.max())
    ax.set_ylim(0, 1.02)
    ax.set_yticks(np.linspace(0, 1, 6))
    failure_line = ax.plot(x, failure, color=WEAR, linewidth=3.2)[0]
    failure_line.set_gid("lognormal_failure_line")
    reliability_line = ax.plot(x, reliability, color=EARLY, linewidth=3.2)[0]
    reliability_line.set_gid("lognormal_reliability_line")
    failure_label = ax.text(4.7, 0.91, "$F(t)$", color=WEAR, fontsize=17, weight="bold")
    failure_label.set_gid("lognormal_failure_label")
    reliability_label = ax.text(4.7, 0.09, "$R(t)$", color=EARLY, fontsize=17, weight="bold")
    reliability_label.set_gid("lognormal_reliability_label")

    fig.subplots_adjust(left=0.17, right=0.96, top=0.92, bottom=0.2)
    save_figure(fig, output, transparent=True)
    plt.close(fig)
    prepare_svg_animation_targets(
        output,
        {"lognormal_probability_pair": "Ausfall- und Überlebenswahrscheinlichkeit"},
        sibling_groups=[
            (
                "lognormal_probability_pair",
                "Ausfall- und Überlebenswahrscheinlichkeit",
                ["lognormal_failure_line", "lognormal_reliability_line", "lognormal_failure_label", "lognormal_reliability_label"],
            )
        ],
    )


BUILDERS = {
    "weibull_density": build_weibull_density,
    "weibull_hazard": build_weibull_hazard,
    "weibull_cdf": build_weibull_cdf,
    "weibull_shift": build_weibull_shift,
    "weibull_paper": build_weibull_paper,
    "nkw_cdf": build_nkw_cdf,
    "nkw_probability": build_nkw_probability,
    "weibull_mechanisms": build_weibull_mechanisms,
    "weibull_bathtub_network": build_weibull_bathtub_network,
    "lognormal_density": build_lognormal_density,
    "lognormal_hazard": build_lognormal_hazard,
    "lognormal_probability_pair": build_lognormal_probability_pair,
}


def main() -> None:
    parser = argparse.ArgumentParser(description="Erweiterte Weibull- und Lognormalplots für RelTest-Lernfolien.")
    parser.add_argument("--plot", required=True, choices=sorted(BUILDERS))
    parser.add_argument("--input", required=True, help="Folienspezifische JSON-Konfiguration.")
    parser.add_argument("--output", required=True, help="Ziel-SVG.")
    args = parser.parse_args()
    apply_reltest_style()
    BUILDERS[args.plot](load_config(args.input), args.output)


if __name__ == "__main__":
    main()
