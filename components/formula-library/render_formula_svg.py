#!/usr/bin/env python3
"""Render a LaTeX/Mathtext formula to a transparent SVG asset."""

from __future__ import annotations

import argparse
from pathlib import Path


def render_formula_svg(
    formula: str,
    output: Path,
    *,
    fontsize: float = 34,
    color: str = "#062d46",
    fontset: str = "dejavusans",
    pad_inches: float = 0.025,
) -> None:
    import matplotlib

    matplotlib.use("Agg")

    import matplotlib.pyplot as plt
    from matplotlib import rcParams

    rcParams.update(
        {
            "font.family": "DejaVu Sans",
            "mathtext.fontset": fontset,
            "svg.fonttype": "none",
            "figure.facecolor": "none",
            "savefig.facecolor": "none",
        }
    )

    measure_fig = plt.figure(figsize=(0.1, 0.1), dpi=100)
    measure_fig.patch.set_alpha(0)
    measure_text = measure_fig.text(0, 0, formula, fontsize=fontsize, color=color)
    measure_fig.canvas.draw()
    bbox = measure_text.get_window_extent(renderer=measure_fig.canvas.get_renderer())
    width_in = max((bbox.width / measure_fig.dpi) + 0.18, 0.4)
    height_in = max((bbox.height / measure_fig.dpi) + 0.14, 0.24)
    plt.close(measure_fig)

    fig = plt.figure(figsize=(width_in, height_in), dpi=100)
    fig.patch.set_alpha(0)
    fig.text(0.5, 0.5, formula, fontsize=fontsize, color=color, ha="center", va="center")
    output.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(output, format="svg", transparent=True, bbox_inches="tight", pad_inches=pad_inches)
    plt.close(fig)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--formula", required=True, help="Mathtext formula, usually wrapped in $...$.")
    parser.add_argument("--output", required=True, type=Path, help="Target SVG file.")
    parser.add_argument("--fontsize", type=float, default=34)
    parser.add_argument("--color", default="#062d46")
    parser.add_argument("--fontset", default="dejavusans")
    parser.add_argument("--pad-inches", type=float, default=0.025)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    render_formula_svg(
        args.formula,
        args.output,
        fontsize=args.fontsize,
        color=args.color,
        fontset=args.fontset,
        pad_inches=args.pad_inches,
    )


if __name__ == "__main__":
    main()
