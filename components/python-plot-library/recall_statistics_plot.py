from __future__ import annotations

import argparse
import json
from pathlib import Path

from reltest_plot_style import RELTEST_COLORS, apply_reltest_style, save_figure
from svg_animation_targets import prepare_svg_animation_targets


def build_plot(config_path: str | Path, output: str | Path) -> None:
    import matplotlib.pyplot as plt

    config = json.loads(Path(config_path).read_text(encoding="utf-8"))
    years = config["years"]
    recalls = config["recall_actions"]
    vehicles = config["affected_vehicles_million"]

    apply_reltest_style()
    fig, ax = plt.subplots(figsize=(13.2, 5.6))
    fig.patch.set_alpha(0)
    ax.set_facecolor("none")

    bars = ax.bar(
        years,
        recalls,
        width=0.72,
        color=RELTEST_COLORS["data"],
        alpha=0.9,
        zorder=2,
        label="Rückrufaktionen",
    )
    bar_ids = []
    for year, bar in zip(years, bars):
        bar_id = f"recall_bar_{year}"
        bar.set_gid(bar_id)
        bar_ids.append(bar_id)

    ax.set_ylabel("Anzahl Rückrufaktionen")
    ax.set_ylim(0, max(recalls) * 1.18)
    ax.set_xticks(years)
    ax.tick_params(axis="x", rotation=0)
    ax.grid(True, axis="y", which="major", alpha=0.6)
    ax.grid(False, axis="x")
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

    ax2 = ax.twinx()
    line = ax2.plot(
        years,
        vehicles,
        color=RELTEST_COLORS["ink"],
        linewidth=3.0,
        marker="o",
        markersize=7,
        markerfacecolor="white",
        markeredgewidth=2.2,
        zorder=4,
        label="Betroffene Fahrzeuge",
    )[0]
    line.set_gid("affected_vehicles_series")
    ax2.set_ylabel("Betroffene Fahrzeuge [Mio.]")
    ax2.set_ylim(0, max(vehicles) * 1.18)
    ax2.spines["top"].set_visible(False)

    handles = [bars, line]
    labels = ["Rückrufaktionen", "Betroffene Fahrzeuge [Mio.]" ]
    ax.legend(handles, labels, loc="upper left", ncol=2)
    fig.tight_layout(pad=1.0)
    save_figure(fig, output, transparent=True)
    plt.close(fig)

    prepare_svg_animation_targets(
        output,
        {
            "recall_actions_series": "Rückrufaktionen 2009 bis 2019",
            "affected_vehicles_series": "Betroffene Fahrzeuge 2009 bis 2019",
        },
        sibling_groups=[
            ("recall_actions_series", "Rückrufaktionen 2009 bis 2019", bar_ids),
        ],
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="RelTest recall statistics plot without a visible title.")
    parser.add_argument("--config", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    build_plot(args.config, args.output)


if __name__ == "__main__":
    main()

