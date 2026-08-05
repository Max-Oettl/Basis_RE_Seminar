from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable, Sequence


REPO_ROOT = Path(__file__).resolve().parents[2]
BRAND_TOKEN_PATH = REPO_ROOT / "brand" / "reltest-education-slide-design-tokens.json"
BRAND_TOKENS = json.loads(BRAND_TOKEN_PATH.read_text(encoding="utf-8"))
BRAND_COLORS = BRAND_TOKENS["colors"]

RELTEST_COLORS = {
    "ink": BRAND_COLORS["navy"],
    "muted": BRAND_COLORS["educationGraphiteBlue"],
    "grid_major": BRAND_COLORS["navy20"],
    "grid_minor": BRAND_COLORS["navy10"],
    "data": BRAND_COLORS["educationGreen"],
    "data_80": BRAND_COLORS["educationGreen80"],
    "data_60": BRAND_COLORS["educationGreen60"],
    "data_40": BRAND_COLORS["educationGreen40"],
    "data_20": BRAND_COLORS["educationGreen20"],
    "accent": BRAND_COLORS["educationCoral"],
    "support": BRAND_COLORS["educationSteelCyan"],
    "warning": BRAND_COLORS["educationGold"],
    "background": BRAND_COLORS["surface"],
    "plot_background": BRAND_COLORS["surfaceSoft"],
}

FIGSIZE_16_9 = (12.8, 7.2)
DEFAULT_DPI = 180
FONT_FILES = [
    REPO_ROOT / "brand" / "fonts" / "archivo" / "Archivo-wdth-wght.ttf",
    REPO_ROOT / "brand" / "fonts" / "archivo" / "Archivo-Italic-wdth-wght.ttf",
    REPO_ROOT / "brand" / "fonts" / "oxanium" / "Oxanium-wght.ttf",
]


def apply_reltest_style() -> None:
    import matplotlib.pyplot as plt
    from matplotlib import font_manager

    for font_path in FONT_FILES:
        if font_path.exists():
            font_manager.fontManager.addfont(font_path)

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
            "xtick.labelsize": 18,
            "ytick.labelsize": 18,
            "grid.color": RELTEST_COLORS["grid_minor"],
            "grid.linewidth": 0.8,
            "grid.alpha": 0.75,
            "font.family": "Archivo",
            "font.sans-serif": ["Archivo", "Arial", "Helvetica", "sans-serif"],
            "font.size": 18,
            "legend.frameon": False,
            "legend.fontsize": 18,
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


def save_figure(fig, svg_path: str | Path, transparent: bool = False) -> None:
    svg_path = Path(svg_path)
    svg_path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(svg_path, format="svg", bbox_inches="tight", transparent=transparent)
