from __future__ import annotations

import argparse
from pathlib import Path

from reltest_plot_style import (
    RELTEST_COLORS,
    apply_reltest_style,
    parse_float_list,
    save_figure,
    style_axes,
)
from svg_animation_targets import prepare_svg_animation_targets


def build_plot(
    xlabel: str,
    ylabel: str,
    x_values: list[float],
    y_values: list[float],
    output: str | Path,
    connect: bool = True,
) -> None:
    import matplotlib.pyplot as plt

    if len(x_values) != len(y_values):
        raise ValueError("x-values and y-values must have the same length.")

    apply_reltest_style()
    fig, ax = plt.subplots()

    if connect:
        data_artist = ax.plot(
            x_values,
            y_values,
            color=RELTEST_COLORS["data"],
            linewidth=2.5,
            marker="o",
            markersize=6,
            markerfacecolor="white",
            markeredgewidth=1.8,
            markeredgecolor=RELTEST_COLORS["accent"],
        )[0]
    else:
        data_artist = ax.scatter(
            x_values,
            y_values,
            s=58,
            facecolor="white",
            edgecolor=RELTEST_COLORS["accent"],
            linewidth=1.8,
            zorder=3,
        )
    data_artist.set_gid("plot_data_series")

    style_axes(ax, xlabel, ylabel)
    ax.margins(x=0.08, y=0.12)
    fig.tight_layout()
    save_figure(fig, output)
    plt.close(fig)
    prepare_svg_animation_targets(output, {"plot_data_series": "Datenreihe"})


def main() -> None:
    parser = argparse.ArgumentParser(description="Create a Reltest-style x/y plot without a visible plot title.")
    parser.add_argument("--xlabel", default="x")
    parser.add_argument("--ylabel", default="y")
    parser.add_argument("--x", default="1,2,3,4")
    parser.add_argument("--y", default="1.1,2.4,2.9,4.2")
    parser.add_argument("--output", required=True)
    parser.add_argument("--no-connect", action="store_true")
    args = parser.parse_args()

    build_plot(
        xlabel=args.xlabel,
        ylabel=args.ylabel,
        x_values=parse_float_list(args.x, []),
        y_values=parse_float_list(args.y, []),
        output=args.output,
        connect=not args.no_connect,
    )


if __name__ == "__main__":
    main()
