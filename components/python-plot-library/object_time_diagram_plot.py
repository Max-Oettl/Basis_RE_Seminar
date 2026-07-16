from __future__ import annotations

import argparse
from pathlib import Path

from reltest_plot_style import RELTEST_COLORS, apply_reltest_style, parse_float_list, save_figure


def build_plot(
    output: str | Path,
    failure_times: list[float],
    observation_ends: list[float] | None = None,
    censored_indices: list[int] | None = None,
    xlabel: str = "Prüfzeit t",
    ylabel: str = "Objekt Nr.",
) -> None:
    import matplotlib.pyplot as plt

    if not failure_times:
        raise ValueError("At least one object row is required.")
    if any(time <= 0 for time in failure_times):
        raise ValueError("Failure or observation times must be positive.")

    object_count = len(failure_times)
    ends = observation_ends or failure_times
    if len(ends) != object_count:
        raise ValueError("observation_ends must match failure_times length.")

    censored = {index for index in (censored_indices or []) if 1 <= index <= object_count}
    max_time = max([*failure_times, *ends]) * 1.12

    apply_reltest_style()
    fig, ax = plt.subplots(figsize=(9.6, 5.4))
    ax.set_gid("plot-object-time-axes")

    ax.set_xlim(0, max_time)
    ax.set_ylim(0.35, object_count + 0.75)
    ax.set_yticks(range(1, object_count + 1))
    ax.set_yticklabels([str(index) for index in range(1, object_count + 1)])
    ax.set_xticks([])
    ax.grid(False)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color(RELTEST_COLORS["ink"])
    ax.spines["bottom"].set_color(RELTEST_COLORS["ink"])

    for index, (failure_time, end_time) in enumerate(zip(failure_times, ends), start=1):
        is_censored = index in censored
        y = index
        runtime_line = ax.plot(
            [0, end_time],
            [y, y],
            color=RELTEST_COLORS["ink"],
            linewidth=1.7,
            solid_capstyle="round",
            zorder=1,
        )[0]
        runtime_line.set_gid(f"plot-object-{index}-runtime")

        if is_censored:
            ax.scatter(
                [end_time],
                [y],
                marker=">",
                s=94,
                facecolor=RELTEST_COLORS["data"],
                edgecolor=RELTEST_COLORS["data"],
                linewidth=1.5,
                zorder=3,
                clip_on=False,
            ).set_gid(f"plot-object-{index}-censored")
        else:
            ax.scatter(
                [failure_time],
                [y],
                marker="x",
                s=104,
                color=RELTEST_COLORS["accent"],
                linewidths=2.4,
                zorder=3,
                clip_on=False,
            ).set_gid(f"plot-object-{index}-failure")

    ax.set_xlabel(xlabel, labelpad=12)
    ax.set_ylabel(ylabel, labelpad=12)
    ax.tick_params(axis="y", which="major", length=0)
    ax.tick_params(axis="x", which="both", length=0)

    fig.tight_layout()
    save_figure(fig, output)
    plt.close(fig)


def main() -> None:
    parser = argparse.ArgumentParser(description="Create a Reltest-style object-time diagram as SVG without a visible title.")
    parser.add_argument("--failure-times", default="42,57,74,91,118,135")
    parser.add_argument("--observation-ends", default="")
    parser.add_argument("--censored-indices", default="")
    parser.add_argument("--xlabel", default="Prüfzeit t")
    parser.add_argument("--ylabel", default="Objekt Nr.")
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    failure_times = parse_float_list(args.failure_times, [])
    observation_ends = parse_float_list(args.observation_ends, []) if args.observation_ends else None
    censored_indices = [int(value) for value in parse_float_list(args.censored_indices, [])] if args.censored_indices else []
    build_plot(
        output=args.output,
        failure_times=failure_times,
        observation_ends=observation_ends,
        censored_indices=censored_indices,
        xlabel=args.xlabel,
        ylabel=args.ylabel,
    )


if __name__ == "__main__":
    main()
