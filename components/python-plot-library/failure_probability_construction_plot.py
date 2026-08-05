from __future__ import annotations

import argparse
from pathlib import Path

from basis_seminar_plot_data import DEFAULT_FAILURE_TIMES_CSV
from reltest_plot_style import RELTEST_COLORS, apply_reltest_style, parse_float_list, save_figure
from svg_animation_targets import prepare_svg_animation_targets


SUBSCRIPT_DIGITS = {
    "0": "₀",
    "1": "₁",
    "2": "₂",
    "3": "₃",
    "4": "₄",
    "5": "₅",
    "6": "₆",
    "7": "₇",
    "8": "₈",
    "9": "₉",
}


def subscript_number(number: int) -> str:
    return "".join(SUBSCRIPT_DIGITS[digit] for digit in str(number))


def build_plot(
    times: list[float],
    output: str | Path,
    xlabel: str = "Lebensdauer t",
    ylabel: str = "Summe der\nausgefallenen Teile",
    show_intersections: bool = False,
) -> None:
    import matplotlib.pyplot as plt

    if not times:
        raise ValueError("At least one failure time is required.")
    if any(time <= 0 for time in times):
        raise ValueError("Failure times must be positive.")

    sorted_times = sorted(times)
    ranks = list(range(1, len(sorted_times) + 1))
    xmax = max(sorted_times) * 1.18
    ymax = len(sorted_times) + 1.15

    apply_reltest_style()
    fig, ax = plt.subplots(figsize=(10.8, 6.2))
    fig.patch.set_alpha(0)
    ax.set_facecolor("none")

    ax.set_xlim(0, xmax)
    ax.set_ylim(-0.72, ymax)
    ax.set_xticks([])
    ax.set_yticks([])

    for spine in ax.spines.values():
        spine.set_visible(False)

    # Draw source-like arrow axes explicitly so the construction remains didactic.
    x_axis = ax.annotate(
        "",
        xy=(xmax, 0),
        xytext=(0, 0),
        arrowprops=dict(arrowstyle="-|>", color=RELTEST_COLORS["ink"], linewidth=2.2, shrinkA=0, shrinkB=0),
        clip_on=False,
    )
    x_axis.arrow_patch.set_gid("plot_axis_x")
    y_axis = ax.annotate(
        "",
        xy=(0, ymax),
        xytext=(0, 0),
        arrowprops=dict(arrowstyle="-|>", color=RELTEST_COLORS["ink"], linewidth=2.2, shrinkA=0, shrinkB=0),
        clip_on=False,
    )
    y_axis.arrow_patch.set_gid("plot_axis_y")

    helper_artists = []
    marker_artists = []
    label_artists = []
    animation_targets: dict[str, str] = {}
    for rank, time_value in zip(ranks, sorted_times):
        label_suffix = subscript_number(rank)
        horizontal = ax.plot(
            [0, time_value],
            [rank, rank],
            color=RELTEST_COLORS["accent"],
            linewidth=1.25,
            alpha=0.92,
            linestyle="-",
            zorder=2,
        )[0]
        horizontal_id = f"plot_helper_horizontal_t{rank}"
        horizontal.set_gid(horizontal_id)
        animation_targets[horizontal_id] = f"Waagerechte Hilfslinie t{rank}"
        vertical = ax.plot(
            [time_value, time_value],
            [0, rank],
            color=RELTEST_COLORS["accent"],
            linewidth=1.25,
            alpha=0.92,
            linestyle="-",
            zorder=2,
        )[0]
        vertical_id = f"plot_helper_vertical_t{rank}"
        vertical.set_gid(vertical_id)
        animation_targets[vertical_id] = f"Senkrechte Hilfslinie t{rank}"
        helper_artists.extend([horizontal, vertical])

        marker = ax.scatter(
            [time_value],
            [0],
            marker="x",
            s=72,
            color=RELTEST_COLORS["accent"],
            linewidths=2.2,
            zorder=4,
            clip_on=False,
        )
        marker_id = f"plot_failure_marker_t{rank}"
        marker.set_gid(marker_id)
        animation_targets[marker_id] = f"Ausfallzeitpunkt t{rank}"
        marker_artists.append(marker)

        if show_intersections:
            point = ax.scatter(
                [time_value],
                [rank],
                marker="x",
                s=72,
                color=RELTEST_COLORS["accent"],
                linewidths=2.2,
                zorder=5,
                clip_on=False,
            )
            point_id = f"plot_mapped_point_t{rank}"
            point.set_gid(point_id)
            animation_targets[point_id] = f"Datenpunkt F(t{rank})"
            marker_artists.append(point)

        f_label = ax.text(
            -xmax * 0.035,
            rank,
            f"F(t{label_suffix})",
            ha="right",
            va="center",
            color=RELTEST_COLORS["accent"],
            fontsize=13.5,
            fontstyle="italic",
            clip_on=False,
        )
        probability_label_id = f"plot_probability_label_t{rank}"
        f_label.set_gid(probability_label_id)
        animation_targets[probability_label_id] = f"Beschriftung F(t{rank})"
        label_artists.append(f_label)

        t_label = ax.text(
            time_value,
            -0.38,
            f"t{label_suffix}",
            ha="center",
            va="top",
            color=RELTEST_COLORS["accent"],
            fontsize=13.5,
            fontstyle="italic",
            clip_on=False,
        )
        time_label_id = f"plot_time_label_t{rank}"
        t_label.set_gid(time_label_id)
        animation_targets[time_label_id] = f"Beschriftung t{rank}"
        label_artists.append(t_label)

    ax.text(
        xmax * 0.9,
        -0.7,
        xlabel,
        ha="center",
        va="top",
        color=RELTEST_COLORS["ink"],
        fontsize=15,
        fontweight="bold",
        clip_on=False,
    ).set_gid("plot_axis_label_x")
    ax.text(
        0,
        ymax + 0.36,
        ylabel,
        ha="center",
        va="bottom",
        color=RELTEST_COLORS["ink"],
        fontsize=14.5,
        fontweight="bold",
        linespacing=1.28,
        clip_on=False,
    ).set_gid("plot_axis_label_y")

    fig.subplots_adjust(left=0.16, right=0.96, bottom=0.18, top=0.82)
    save_figure(fig, output)
    plt.close(fig)
    prepare_svg_animation_targets(output, animation_targets)


def main() -> None:
    parser = argparse.ArgumentParser(description="Create a didactic failure-probability construction plot without a visible title.")
    parser.add_argument("--times", default=DEFAULT_FAILURE_TIMES_CSV)
    parser.add_argument("--xlabel", default="Lebensdauer t")
    parser.add_argument("--ylabel", default="Summe der\nausgefallenen Teile")
    parser.add_argument("--show-intersections", action="store_true", help="Draw mapped point markers at each F(t_i)/t_i intersection.")
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    build_plot(
        times=parse_float_list(args.times, []),
        xlabel=args.xlabel,
        ylabel=args.ylabel,
        show_intersections=args.show_intersections,
        output=args.output,
    )


if __name__ == "__main__":
    main()
