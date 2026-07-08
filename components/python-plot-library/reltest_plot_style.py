from __future__ import annotations

from pathlib import Path
from typing import Iterable, Sequence


RELTEST_COLORS = {
    "ink": "#062d46",
    "muted": "#526f7c",
    "grid_major": "#9dbac8",
    "grid_minor": "#dce8ee",
    "data": "#139ccb",
    "accent": "#d82735",
    "support": "#6aa88f",
    "background": "#ffffff",
    "plot_background": "#fbfdfe",
}

FIGSIZE_16_9 = (12.8, 7.2)
DEFAULT_DPI = 180


def apply_reltest_style() -> None:
    import matplotlib.pyplot as plt

    plt.rcParams.update(
        {
            "figure.figsize": FIGSIZE_16_9,
            "figure.dpi": DEFAULT_DPI,
            "figure.facecolor": RELTEST_COLORS["background"],
            "savefig.facecolor": RELTEST_COLORS["background"],
            "savefig.edgecolor": "none",
            "axes.facecolor": RELTEST_COLORS["plot_background"],
            "axes.edgecolor": RELTEST_COLORS["ink"],
            "axes.labelcolor": RELTEST_COLORS["ink"],
            "axes.linewidth": 1.6,
            "axes.labelweight": "bold",
            "axes.titleweight": "bold",
            "axes.titlesize": 20,
            "axes.labelsize": 18,
            "xtick.color": RELTEST_COLORS["muted"],
            "ytick.color": RELTEST_COLORS["muted"],
            "xtick.labelsize": 13,
            "ytick.labelsize": 13,
            "grid.color": RELTEST_COLORS["grid_minor"],
            "grid.linewidth": 0.8,
            "grid.alpha": 0.75,
            "font.family": "DejaVu Sans",
            "font.sans-serif": ["DejaVu Sans", "Segoe UI", "Arial", "Inter", "sans-serif"],
            "font.size": 13,
            "legend.frameon": False,
            "legend.fontsize": 13,
            "legend.handlelength": 2.4,
            "legend.labelspacing": 0.55,
            "svg.fonttype": "none",
            "pdf.fonttype": 42,
        }
    )


def parse_float_list(value: str | Sequence[float] | None, default: Sequence[float]) -> list[float]:
    if value is None:
        return list(default)
    if isinstance(value, str):
        if not value.strip():
            return list(default)
        return [float(part.strip()) for part in value.split(",") if part.strip()]
    return [float(item) for item in value]


def parse_label_list(value: str | Sequence[str] | None, default: Sequence[str]) -> list[str]:
    if value is None:
        return list(default)
    if isinstance(value, str):
        if not value.strip():
            return list(default)
        return [part.strip() for part in value.split(",")]
    return [str(item) for item in value]


def ensure_same_length(*series: Iterable[object]) -> None:
    lengths = {len(list(items)) for items in series}
    if len(lengths) > 1:
        raise ValueError(f"Series lengths must match, got {sorted(lengths)}")


def style_axes(ax, xlabel: str, ylabel: str | None = None) -> None:
    ax.set_xlabel(xlabel, labelpad=12)
    if ylabel:
        ax.set_ylabel(ylabel, labelpad=12)
    ax.grid(True, which="major")
    ax.grid(True, which="minor", linewidth=0.45, alpha=0.45)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color(RELTEST_COLORS["ink"])
    ax.spines["bottom"].set_color(RELTEST_COLORS["ink"])
    ax.tick_params(axis="both", which="major", length=6, width=1.2)
    ax.tick_params(axis="both", which="minor", length=3.5, width=0.9)


def save_figure(fig, svg_path: str | Path) -> None:
    svg_path = Path(svg_path)
    svg_path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(svg_path, format="svg", bbox_inches="tight")
