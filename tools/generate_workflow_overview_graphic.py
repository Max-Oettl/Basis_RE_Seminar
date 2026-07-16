#!/usr/bin/env python3
"""Generate a PNG overview of the current Basis Seminar workflow."""

from __future__ import annotations

from pathlib import Path
from textwrap import wrap

import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch, Polygon


REPO_ROOT = Path(__file__).resolve().parents[1]
OUTPUT = REPO_ROOT / "analysis" / "workflow-preview" / "basis_rebuild_workflow_overview.png"


COLORS = {
    "bg": "#f6f8f9",
    "ink": "#062d46",
    "muted": "#5d7080",
    "router": "#0c8fc1",
    "analysis": "#2c8f5b",
    "svg": "#6b5bd2",
    "plot": "#d94b4b",
    "special": "#f0b429",
    "qa": "#263238",
    "white": "#ffffff",
    "line": "#8ba6b3",
}


def add_box(ax, xy, wh, title, body="", color="#0c8fc1", fontsize=12, body_size=9.5):
    x, y = xy
    w, h = wh
    patch = FancyBboxPatch(
        (x, y),
        w,
        h,
        boxstyle="round,pad=0.012,rounding_size=0.018",
        linewidth=1.8,
        edgecolor=color,
        facecolor=COLORS["white"],
        zorder=2,
    )
    ax.add_patch(patch)
    ax.text(
        x + w / 2,
        y + h * 0.68,
        title,
        ha="center",
        va="center",
        fontsize=fontsize,
        fontweight="bold",
        color=COLORS["ink"],
        zorder=3,
    )
    if body:
        lines = []
        for paragraph in body.split("\n"):
            lines.extend(wrap(paragraph, width=max(24, int(w * 160))))
        ax.text(
            x + w / 2,
            y + h * 0.32,
            "\n".join(lines),
            ha="center",
            va="center",
            fontsize=body_size,
            color=COLORS["muted"],
            linespacing=1.08,
            zorder=3,
        )
    return (x + w / 2, y + h / 2)


def add_diamond(ax, center, wh, title, body="", color="#f0b429", fontsize=11):
    cx, cy = center
    w, h = wh
    points = [(cx, cy + h / 2), (cx + w / 2, cy), (cx, cy - h / 2), (cx - w / 2, cy)]
    patch = Polygon(points, closed=True, edgecolor=color, facecolor=COLORS["white"], linewidth=1.8, zorder=2)
    ax.add_patch(patch)
    text = title if not body else f"{title}\n{body}"
    ax.text(
        cx,
        cy,
        text,
        ha="center",
        va="center",
        fontsize=fontsize,
        fontweight="bold",
        color=COLORS["ink"],
        linespacing=1.12,
        zorder=3,
    )
    return center


def arrow(ax, start, end, color=COLORS["line"], label="", rad=0.0, lw=1.8):
    patch = FancyArrowPatch(
        start,
        end,
        arrowstyle="-|>",
        mutation_scale=16,
        linewidth=lw,
        color=color,
        connectionstyle=f"arc3,rad={rad}",
        shrinkA=8,
        shrinkB=8,
        zorder=1,
    )
    ax.add_patch(patch)
    if label:
        mx = (start[0] + end[0]) / 2
        my = (start[1] + end[1]) / 2
        ax.text(
            mx,
            my + 0.012,
            label,
            ha="center",
            va="center",
            fontsize=8.5,
            color=color,
            fontweight="bold",
            bbox={"boxstyle": "round,pad=0.18", "facecolor": COLORS["bg"], "edgecolor": "none"},
            zorder=4,
        )


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    fig, ax = plt.subplots(figsize=(20, 13), dpi=180)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")
    fig.patch.set_facecolor(COLORS["bg"])
    ax.set_facecolor(COLORS["bg"])

    ax.text(
        0.5,
        0.985,
        "Basis Seminar Rebuild: aktueller Codex-Workflow",
        ha="center",
        va="top",
        fontsize=25,
        fontweight="bold",
        color=COLORS["ink"],
    )
    ax.text(
        0.5,
        0.938,
        "Progressive Offenlegung: zuerst Router laden, dann nur die Detailregeln des aktuellen Arbeitsschritts.",
        ha="center",
        va="top",
        fontsize=12.5,
        color=COLORS["muted"],
    )

    router = add_box(
        ax,
        (0.30, 0.845),
        (0.40, 0.078),
        "Pflicht-Start",
        "AGENT.md -> workflow/README.md -> context-loading-map.md",
        COLORS["router"],
        fontsize=13,
        body_size=9.8,
    )
    request = add_diamond(ax, (0.5, 0.735), (0.18, 0.078), "Auftragstyp?", "", COLORS["special"], fontsize=12)
    arrow(ax, router, request, COLORS["router"])

    analysis = add_box(
        ax,
        (0.045, 0.60),
        (0.25, 0.10),
        "A: Folienanalyse",
        "10-source-analysis\nRebuild-JSON und Report",
        COLORS["analysis"],
        fontsize=12,
        body_size=9,
    )
    svg_start = add_box(
        ax,
        (0.375, 0.60),
        (0.25, 0.10),
        "B: SVG-Auftrag",
        "20-scene-planning\nSzenenbrief und Zielzustand",
        COLORS["svg"],
        fontsize=12,
        body_size=9,
    )
    legacy = add_box(
        ax,
        (0.705, 0.60),
        (0.25, 0.10),
        "C: Sonderpfad",
        "70-integration / 80-storyboard-legacy\nnur explizit",
        COLORS["special"],
        fontsize=12,
        body_size=9,
    )
    arrow(ax, request, analysis, COLORS["analysis"])
    arrow(ax, request, svg_start, COLORS["svg"])
    arrow(ax, request, legacy, COLORS["special"])

    source = add_box(
        ax,
        (0.045, 0.455),
        (0.25, 0.105),
        "Quellenrangfolge",
        "Sprechertext -> PNG -> PDF -> PPTX\nAbweichungen dokumentieren",
        COLORS["analysis"],
        fontsize=12,
        body_size=9,
    )
    analysis_out = add_box(
        ax,
        (0.045, 0.315),
        (0.25, 0.105),
        "Analyse-Output",
        "analysis/slides oder modules\nplus Modulreport",
        COLORS["analysis"],
        fontsize=12,
        body_size=9,
    )
    arrow(ax, analysis, source, COLORS["analysis"])
    arrow(ax, source, analysis_out, COLORS["analysis"])

    visual_decision = add_box(
        ax,
        (0.375, 0.455),
        (0.25, 0.105),
        "Visual Decision Gate",
        "30-visual-decision\nElementtyp vor dem Zeichnen",
        COLORS["svg"],
        fontsize=12,
        body_size=9,
    )
    element_type = add_diamond(ax, (0.50, 0.365), (0.18, 0.075), "Elementtyp?", "", COLORS["special"], fontsize=12)
    arrow(ax, svg_start, visual_decision, COLORS["svg"])
    arrow(ax, visual_decision, element_type, COLORS["svg"])

    asset = add_box(
        ax,
        (0.05, 0.225),
        (0.205, 0.095),
        "Piktogramm/Bild",
        "PNG, Extrakt, Nutzerasset\noder einfache SVG",
        COLORS["special"],
        fontsize=11.5,
        body_size=8.3,
    )
    plot = add_box(
        ax,
        (0.285, 0.225),
        (0.205, 0.095),
        "Diagramm",
        "31-python-plots\nRegistry? Ja nutzen, nein neu",
        COLORS["plot"],
        fontsize=11.5,
        body_size=8.3,
    )
    timeline = add_box(
        ax,
        (0.52, 0.225),
        (0.205, 0.095),
        "Timeline",
        "33-timelines\nSVG-Komposition, kein Plot",
        COLORS["svg"],
        fontsize=11.5,
        body_size=8.3,
    )
    formula = add_box(
        ax,
        (0.755, 0.225),
        (0.205, 0.095),
        "Formel",
        "32-formulas\nText/Tspan, fachlich pruefen",
        COLORS["svg"],
        fontsize=11.5,
        body_size=8.3,
    )
    arrow(ax, element_type, asset, COLORS["special"])
    arrow(ax, element_type, plot, COLORS["plot"])
    arrow(ax, element_type, timeline, COLORS["svg"])
    arrow(ax, element_type, formula, COLORS["svg"])

    compose = add_box(
        ax,
        (0.375, 0.105),
        (0.25, 0.09),
        "SVG-Komposition",
        "40-svg-production\n1 Folie oder Sequenzgruppe",
        COLORS["svg"],
        fontsize=12,
        body_size=9,
    )
    arrow(ax, asset, compose, COLORS["special"], rad=-0.08)
    arrow(ax, plot, compose, COLORS["plot"], rad=-0.03)
    arrow(ax, timeline, compose, COLORS["svg"], rad=0.03)
    arrow(ax, formula, compose, COLORS["svg"], rad=0.08)

    animation = add_box(
        ax,
        (0.675, 0.105),
        (0.135, 0.09),
        "Animation",
        "50-animation\nLayer, Manifest,\nPlot-Zeittrigger",
        COLORS["router"],
        fontsize=11.5,
        body_size=8,
    )
    qa = add_box(
        ax,
        (0.84, 0.105),
        (0.135, 0.09),
        "Freigabe",
        "60-quality\nXML, IDs,\nsvg-rebuild-qa",
        COLORS["qa"],
        fontsize=11.5,
        body_size=8,
    )
    arrow(ax, compose, animation, COLORS["router"])
    arrow(ax, animation, qa, COLORS["qa"])

    feedback = add_box(
        ax,
        (0.045, 0.085),
        (0.25, 0.09),
        "Feedback-Schleife",
        "Ebene bestimmen und passenden\nDetailpfad erneut laden",
        "#64748b",
        fontsize=11.5,
        body_size=8.5,
    )
    arrow(ax, qa, feedback, "#64748b", "", rad=-0.40, lw=1.5)
    arrow(ax, feedback, visual_decision, "#64748b", "", rad=-0.34, lw=1.5)

    ax.text(
        0.5,
        0.015,
        "Kernprinzip: alte Folie bleibt Inhaltsanker; Detailregeln werden nur bei Bedarf geladen. Alte workflow/*.md-Pfade bleiben als Redirects erhalten.",
        ha="center",
        va="bottom",
        fontsize=10.5,
        color=COLORS["muted"],
    )

    fig.savefig(OUTPUT, dpi=180, facecolor=COLORS["bg"], bbox_inches="tight", pad_inches=0.18)
    plt.close(fig)
    print(OUTPUT)


if __name__ == "__main__":
    main()
