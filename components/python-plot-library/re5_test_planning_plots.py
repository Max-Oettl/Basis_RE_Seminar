from __future__ import annotations

import argparse
import json
import math
import xml.etree.ElementTree as ET
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np

from reltest_plot_style import RELTEST_COLORS, apply_reltest_style, save_figure, style_axes


ANIM_LABELS = {
    "plot_curve_pa_80": "Kurve P_A = 80 %",
    "plot_curve_pa_90": "Kurve P_A = 90 %",
    "plot_curve_pa_95": "Kurve P_A = 95 %",
    "plot_target_90": "Nachweisziel R(t) = 90 %",
    "plot_degradation_paths": "Degradationspfade",
    "plot_eol_threshold": "End-of-Life-Kriterium",
    "plot_lifetime_estimates": "Geschätzte Lebensdauerenden",
    "field_distribution": "Feldverteilung",
    "test_distribution": "Versuchsverteilung",
    "acceleration_factor_measure": "Raffungsfaktor",
    "plot_load_life": "Last-Lebensdauer-Korrelation",
    "plot_load_levels": "Lasthorizonte",
    "plot_field_level": "Feldniveau",
    "plot_test_levels": "Versuchsniveaus",
    "plot_third_level": "Drittes Versuchsniveau",
    "plot_mechanism_limit": "Technisch maximale Raffungsgrenze",
    "plot_lower_level": "Unteres Versuchsniveau",
    "plot_allocation_distance": "Extrapolationsabstand",
    "plot_simulation_runs": "Monte-Carlo-Durchläufe",
    "plot_precision_envelope": "Prognoseunsicherheit",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--plot", required=True, choices=[
        "success_run_curves",
        "degradation_paths",
        "acceleration_factor",
        "load_life_correlation",
        "test_level_overview",
        "number_of_levels",
        "upper_test_level",
        "lower_test_level",
        "sample_allocation",
        "monte_carlo_precision",
    ])
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    return parser.parse_args()


def read_config(path_value: str) -> dict:
    return json.loads(Path(path_value).read_text(encoding="utf-8"))


def mark_animation_targets(svg_path: Path) -> None:
    ET.register_namespace("", "http://www.w3.org/2000/svg")
    tree = ET.parse(svg_path)
    root = tree.getroot()
    for node in root.iter():
        node_id = node.attrib.get("id", "")
        if node_id in ANIM_LABELS:
            node.set("data-anim-target", "true")
            node.set("data-anim-label", ANIM_LABELS[node_id])
            node.set("data-qc-group", node_id)
    root.set("data-diagram-type", "technical")
    root.set("data-generator", "re5_test_planning_plots.py")
    tree.write(svg_path, encoding="utf-8", xml_declaration=True)


def finish(fig, output: str) -> None:
    output_path = Path(output)
    fig.subplots_adjust(left=0.15, right=0.97, top=0.95, bottom=0.17)
    save_figure(fig, output_path, transparent=True)
    plt.close(fig)
    mark_animation_targets(output_path)


def success_run_curves(config: dict, output: str) -> None:
    n_max = int(config.get("n_max", 60))
    confidences = [float(value) for value in config.get("confidence_levels", [0.80, 0.90, 0.95])]
    n = np.arange(1, n_max + 1)
    colors = [RELTEST_COLORS["support"], RELTEST_COLORS["ink"], RELTEST_COLORS["data"]]
    fig, ax = plt.subplots()
    for confidence, color in zip(confidences, colors):
        reliability = np.power(1.0 - confidence, 1.0 / n) * 100.0
        line, = ax.plot(n, reliability, color=color, linewidth=3.5, label=f"P_A = {confidence * 100:.0f} %")
        line.set_gid(f"plot_curve_pa_{int(confidence * 100)}")
    target = ax.axhline(90, color=RELTEST_COLORS["warning"], linewidth=2.4, linestyle="--")
    target.set_gid("plot_target_90")
    ax.set_xlim(1, n_max)
    ax.set_ylim(45, 100)
    ax.set_xticks([1, 10, 20, 30, 40, 50, 60])
    ax.set_yticks([50, 60, 70, 80, 90, 100])
    style_axes(ax, "Stichprobenumfang n", "Mindestzuverlässigkeit R(t) [%]")
    ax.legend(loc="lower right")
    finish(fig, output)


def degradation_paths(config: dict, output: str) -> None:
    seed = int(config.get("seed", 42))
    threshold = float(config.get("threshold", 0.28))
    rng = np.random.default_rng(seed)
    time = np.linspace(0, 1.0, 180)
    fig, ax = plt.subplots()
    crossings = []
    lines = []
    for index in range(int(config.get("paths", 6))):
        slope = 0.55 + index * 0.045 + rng.normal(0, 0.018)
        curvature = 0.13 + rng.normal(0, 0.012)
        path_values = 0.93 - slope * time - curvature * time**2 + 0.018 * np.sin((index + 2) * math.pi * time)
        line, = ax.plot(time, path_values, color=RELTEST_COLORS["support"], linewidth=2.3, alpha=0.82)
        lines.append(line)
        crossing = np.argmax(path_values <= threshold)
        if crossing > 0:
            crossings.append(time[crossing])
    group = lines[0]
    group.set_gid("plot_degradation_paths")
    eol = ax.axhline(threshold, color=RELTEST_COLORS["accent"], linewidth=2.4, linestyle="--")
    eol.set_gid("plot_eol_threshold")
    if crossings:
        markers = ax.scatter(crossings, [threshold] * len(crossings), s=72, marker="x", linewidths=2.4, color=RELTEST_COLORS["accent"], zorder=8)
        markers.set_gid("plot_lifetime_estimates")
    ax.set_xlim(0, 1)
    ax.set_ylim(0.15, 1.02)
    ax.set_yticks([0.2, 0.4, 0.6, 0.8, 1.0])
    style_axes(ax, "Betriebszeit", "Degradationsmerkmal")
    ax.text(0.02, threshold + 0.035, "End-of-Life-Kriterium", color=RELTEST_COLORS["accent"], fontweight="bold")
    finish(fig, output)


def weibull_y(probability: np.ndarray | float) -> np.ndarray | float:
    return np.log(-np.log(1.0 - np.asarray(probability)))


def acceleration_factor(config: dict, output: str) -> None:
    beta = float(config.get("shape", 2.2))
    field_eta = float(config.get("field_eta", 80.0))
    test_eta = float(config.get("test_eta", 24.0))
    life = np.logspace(0, 2.25, 180)
    f_field = 1.0 - np.exp(-np.power(life / field_eta, beta))
    f_test = 1.0 - np.exp(-np.power(life / test_eta, beta))
    fig, ax = plt.subplots()
    field, = ax.plot(life, weibull_y(np.clip(f_field, 0.001, 0.999)), color=RELTEST_COLORS["ink"], linewidth=3.4, label="Feld")
    test, = ax.plot(life, weibull_y(np.clip(f_test, 0.001, 0.999)), color=RELTEST_COLORS["data"], linewidth=3.4, label="Versuch")
    field.set_gid("field_distribution")
    test.set_gid("test_distribution")
    p = 0.01
    t_field = field_eta * (-math.log(1 - p)) ** (1 / beta)
    t_test = test_eta * (-math.log(1 - p)) ** (1 / beta)
    y = float(weibull_y(p))
    measure, = ax.plot([t_test, t_field], [y, y], color=RELTEST_COLORS["warning"], linewidth=3.2)
    measure.set_gid("acceleration_factor_measure")
    ax.scatter([t_test, t_field], [y, y], color=RELTEST_COLORS["warning"], s=70, zorder=8)
    ax.annotate("Raffungsfaktor", xy=((t_test + t_field) / 2, y), xytext=(0, 18), textcoords="offset points", ha="center", color=RELTEST_COLORS["warning"], fontweight="bold")
    probs = np.array([0.001, 0.01, 0.1, 0.5, 0.9, 0.99])
    ax.set_yticks(weibull_y(probs), ["0,1", "1", "10", "50", "90", "99"])
    ax.set_xscale("log")
    ax.set_xlim(1, 170)
    style_axes(ax, "Lebensdauer t", "Ausfallwahrscheinlichkeit F(t) [%]")
    ax.legend(loc="lower right")
    finish(fig, output)


def base_load_life(config: dict):
    life = np.linspace(8, 100, 200)
    load = 1.04 - 0.19 * np.log(life)
    return life, load


def load_life_correlation(config: dict, output: str) -> None:
    life, load = base_load_life(config)
    fig, ax = plt.subplots()
    curve, = ax.plot(life, load, color=RELTEST_COLORS["accent"], linewidth=3.6)
    curve.set_gid("plot_load_life")
    levels = [0.62, 0.53, 0.45, 0.38]
    level_artists = []
    for index, level in enumerate(levels, start=1):
        x_value = float(np.interp(level, load[::-1], life[::-1]))
        artist = ax.hlines(level, 5, x_value, colors=RELTEST_COLORS["muted"], linestyles="--", linewidth=1.8)
        level_artists.append(artist)
        ax.vlines(x_value, 0.25, level, colors=RELTEST_COLORS["grid_major"], linestyles=":", linewidth=1.5)
        ax.scatter([x_value], [level], color=RELTEST_COLORS["accent"], s=54, zorder=7)
        ax.text(x_value + 2, level + 0.012, f"Lasthorizont {index}", color=RELTEST_COLORS["ink"], fontsize=15)
    level_artists[0].set_gid("plot_load_levels")
    ax.set_xlim(5, 105)
    ax.set_ylim(0.25, 0.75)
    ax.set_yticks([])
    style_axes(ax, "Lebensdauer t", "Belastung / Schädigungsgröße")
    finish(fig, output)


def level_axes(config: dict, output: str, mode: str) -> None:
    life, load = base_load_life(config)
    fig, ax = plt.subplots()
    curve, = ax.plot(life, load, color=RELTEST_COLORS["accent"], linewidth=3.4)
    curve.set_gid("plot_load_life")
    field = float(config.get("field_level", 0.36))
    upper = float(config.get("upper_level", 0.62))
    lower = float(config.get("lower_level", 0.47))
    limit = float(config.get("mechanism_limit", 0.68))
    field_line = ax.axhline(field, color=RELTEST_COLORS["muted"], linewidth=1.8, linestyle="--")
    field_line.set_gid("plot_field_level")
    test_lines = []
    for level, label in [(upper, "oberes Versuchsniveau"), (lower, "unteres Versuchsniveau")]:
        line = ax.axhline(level, color=RELTEST_COLORS["support"], linewidth=1.8, linestyle="--")
        test_lines.append(line)
        ax.text(102, level, label, ha="right", va="bottom", fontsize=14, color=RELTEST_COLORS["support"])
    test_lines[0].set_gid("plot_test_levels")
    if mode == "number_of_levels":
        points_x = [18, 45]
        points_y = np.interp(points_x, life, load)
        ax.scatter(points_x, points_y, color=RELTEST_COLORS["support"], s=76, zorder=7)
        third_x = 72
        third_y = float(np.interp(third_x, life, load))
        third = ax.scatter([third_x], [third_y], color=RELTEST_COLORS["data"], s=88, zorder=7)
        third.set_gid("plot_third_level")
    elif mode == "upper_test_level":
        limit_line = ax.axhline(limit, color=RELTEST_COLORS["warning"], linewidth=3.0)
        limit_line.set_gid("plot_mechanism_limit")
        ax.fill_between([5, 105], limit, 0.74, color=RELTEST_COLORS["warning"], alpha=0.12)
    elif mode == "lower_test_level":
        lower_line = ax.axhline(lower, color=RELTEST_COLORS["data"], linewidth=3.0)
        lower_line.set_gid("plot_lower_level")
        ax.fill_between([30, 100], lower - 0.05, lower + 0.05, color=RELTEST_COLORS["data"], alpha=0.12)
    elif mode == "sample_allocation":
        distance = ax.annotate("", xy=(42, upper), xytext=(42, lower), arrowprops=dict(arrowstyle="<->", color=RELTEST_COLORS["warning"], linewidth=2.5))
        distance.set_gid("plot_allocation_distance")
        ax.text(45, (upper + lower) / 2, "ξ", va="center", color=RELTEST_COLORS["warning"], fontweight="bold")
    elif mode == "test_level_overview":
        for level, count in [(upper, 5), (lower, 8)]:
            x_values = np.linspace(22, 72, count)
            ax.scatter(x_values, np.full_like(x_values, level), marker="|", s=200, linewidths=2.5, color=RELTEST_COLORS["accent"], zorder=8)
    ax.set_xlim(5, 105)
    ax.set_ylim(0.25, 0.74)
    ax.set_yticks([])
    style_axes(ax, "Lebensdauer t", "Belastung / Schädigungsgröße")
    finish(fig, output)


def monte_carlo_precision(config: dict, output: str) -> None:
    seed = int(config.get("seed", 20260821))
    rng = np.random.default_rng(seed)
    n = np.arange(4, 41)
    center = 1.0 + 0.02 * np.sin(n / 4)
    sigma = 0.38 / np.sqrt(n / 4)
    fig, ax = plt.subplots()
    run_group = None
    for index in range(14):
        values = center + rng.normal(0, sigma)
        line, = ax.plot(n, values, color=RELTEST_COLORS["support"], alpha=0.18, linewidth=1.4)
        if run_group is None:
            run_group = line
    run_group.set_gid("plot_simulation_runs")
    envelope = ax.fill_between(n, center - 1.96 * sigma, center + 1.96 * sigma, color=RELTEST_COLORS["data"], alpha=0.20)
    envelope.set_gid("plot_precision_envelope")
    ax.plot(n, center, color=RELTEST_COLORS["data"], linewidth=3.5)
    ax.axhline(1.0, color=RELTEST_COLORS["ink"], linewidth=1.6, linestyle="--")
    ax.set_xlim(4, 40)
    ax.set_ylim(0.35, 1.65)
    style_axes(ax, "Gesamtzahl der Prüflinge n", "Relative Feldprognose")
    finish(fig, output)


def main() -> None:
    args = parse_args()
    apply_reltest_style()
    config = read_config(args.input)
    if args.plot == "success_run_curves":
        success_run_curves(config, args.output)
    elif args.plot == "degradation_paths":
        degradation_paths(config, args.output)
    elif args.plot == "acceleration_factor":
        acceleration_factor(config, args.output)
    elif args.plot == "load_life_correlation":
        load_life_correlation(config, args.output)
    elif args.plot in {"test_level_overview", "number_of_levels", "upper_test_level", "lower_test_level", "sample_allocation"}:
        level_axes(config, args.output, args.plot)
    elif args.plot == "monte_carlo_precision":
        monte_carlo_precision(config, args.output)


if __name__ == "__main__":
    main()
