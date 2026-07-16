#!/usr/bin/env python3
"""Generate RE3_TEST_1 Content-SVGs for slides 004-013."""

from __future__ import annotations

import base64
import html
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MODULE = "RE3_TEST_1"
OUT = ROOT / "rebuild-proposals" / "svg" / MODULE
PLANS = ROOT / "analysis" / "rebuild-plans"

PLOTS = {
    "points": ROOT / "assets" / "plots" / MODULE / "failure_probability_points_slide_004.svg",
    "weibull": ROOT / "assets" / "plots" / MODULE / "weibull_probability_context.svg",
    "parameter": ROOT / "assets" / "plots" / MODULE / "weibull_parameter_plot.svg",
    "mechanism": ROOT / "assets" / "plots" / MODULE / "weibull_mechanism_split_plot.svg",
    "confidence": ROOT / "assets" / "plots" / MODULE / "weibull_confidence_bounds_animated.svg",
    "object_failures": ROOT / "assets" / "plots" / MODULE / "object_time_failures_slide_010.svg",
    "object_censored": ROOT / "assets" / "plots" / MODULE / "object_time_censored_slide_011.svg",
}

PICTOGRAMS = {
    "tool": ROOT / "assets" / "scenes" / MODULE / "pictograms" / "tool-transform-screwdriver-wrench.png",
}


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def data_svg(path: Path) -> str:
    payload = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:image/svg+xml;base64,{payload}"


def data_png(path: Path) -> str:
    payload = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:image/png;base64,{payload}"


PLOT_DATA = {key: data_svg(path) for key, path in PLOTS.items()}
PICTOGRAM_DATA = {key: data_png(path) for key, path in PICTOGRAMS.items()}


def text(
    text_id: str,
    x: int,
    y: int,
    value: str,
    size: int = 30,
    weight: int = 650,
    fill: str = "#062D46",
    anchor: str = "start",
    extra: str = "",
) -> str:
    qc_role = "" if "data-qc-role=" in extra else 'data-qc-role="text"'
    font_family = "" if "font-family=" in extra else 'font-family="Inter, Segoe UI, Arial, sans-serif"'
    return (
        f'<text id="{text_id}" x="{x}" y="{y}" text-anchor="{anchor}" '
        f'font-size="{size}" font-weight="{weight}" fill="{fill}" '
        f'{font_family} '
        f'{qc_role} data-qc-layer="foreground" data-qc-important="true" {extra}>{esc(value)}</text>'
    )


def panel(panel_id: str, x: int, y: int, w: int, h: int, fill: str = "#FFFFFF", stroke: str = "#CBD5E1") -> str:
    d = f"M {x} {y} H {x + w} V {y + h} H {x} Z"
    return (
        f'<path id="{panel_id}" d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="2.5" '
        f'pointer-events="none" data-qc-layer="background"/>'
    )


def marker_defs() -> str:
    return """
  <defs>
    <style>
      .font { font-family: Inter, "Segoe UI", Arial, sans-serif; }
      .axis { stroke: #062D46; stroke-width: 5; stroke-linecap: round; fill: none; }
      .thin-axis { stroke: #062D46; stroke-width: 3.2; stroke-linecap: round; fill: none; }
      .guide { stroke: #139CCB; stroke-width: 3; stroke-dasharray: 8 7; fill: none; }
      .failure-red { stroke: #D1495B; stroke-width: 8; stroke-linecap: round; }
      .failure-blue { stroke: #139CCB; stroke-width: 8; stroke-linecap: round; }
      .fit-red { stroke: #D1495B; stroke-width: 5; stroke-linecap: round; fill: none; }
      .fit-blue { stroke: #139CCB; stroke-width: 5; stroke-linecap: round; fill: none; }
      .muted { fill: #6A7A86; }
      .ink { fill: #062D46; }
      .accent { fill: #139CCB; }
      .red { fill: #D1495B; }
    </style>
    <marker id="arrow_ink" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#062D46"/>
    </marker>
    <marker id="arrow_blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#139CCB"/>
    </marker>
    <g id="cross_red">
      <line class="failure-red" x1="0" y1="0" x2="28" y2="28" data-qc-allow-overlap="true"/>
      <line class="failure-red" x1="0" y1="28" x2="28" y2="0" data-qc-allow-overlap="true"/>
    </g>
    <g id="cross_blue">
      <line class="failure-blue" x1="0" y1="0" x2="28" y2="28" data-qc-allow-overlap="true"/>
      <line class="failure-blue" x1="0" y1="28" x2="28" y2="0" data-qc-allow-overlap="true"/>
    </g>
  </defs>
"""


def step_marker(step_id: str, number: str, x: int, y: int, active: bool, line1: str, line2: str | None = None) -> str:
    stroke = "#139CCB" if active else "#CBD5E1"
    fill = "#062D46" if active else "#6A7A86"
    lines = [
        f'<g id="{step_id}" aria-label="{esc(line1)}">',
        f'<circle id="{step_id}_circle" cx="{x}" cy="{y}" r="34" fill="#FFFFFF" stroke="{stroke}" stroke-width="5" data-qc-role="timeline-marker" data-qc-allow-overlap="true"/>',
        f'<text id="{step_id}_number" x="{x}" y="{y + 12}" text-anchor="middle" font-size="33" font-weight="800" fill="{fill}" font-family="Inter, Segoe UI, Arial, sans-serif" data-qc-role="text" data-qc-important="true" data-qc-allow-overlap="true">{number}</text>',
        text(f"{step_id}_text_1", x + 72, y - (12 if line2 else -12), line1, 34, 700 if active else 650, fill),
    ]
    if line2:
        lines.append(text(f"{step_id}_text_2", x + 72, y + 36, line2, 34, 700 if active else 650, fill))
    lines.append("</g>")
    return "\n".join(lines)


def workflow_steps(active: int, include_step3_detail: bool = False) -> str:
    parts = [
        '<g id="workflow_steps" class="font">',
        step_marker("step_0", "0", 206, 250, active >= 0, "Sammeln der Ausfalldaten"),
        step_marker("step_1", "1", 206, 382, active >= 1, "Berechnen von", "Ausfallwahrscheinlichkeiten"),
    ]
    if active >= 2:
        parts.append(step_marker("step_2", "2", 206, 540, active >= 2, "Ermittlung der", "Regressionsgeraden"))
    if active >= 3:
        parts.append(step_marker("step_3", "3", 206, 700, True, "Schätzung der", "Weibull-Parameter"))
        if include_step3_detail:
            parts.append(text("step_3_detail_b", 278, 820, "-> b = Steigung der Linie", 30, 600))
            parts.append(text("step_3_detail_t", 278, 868, "-> T = F⁻¹(0,632)", 30, 600))
    parts.append("</g>")
    return "\n".join(parts)


def failure_cross(x: int, y: int, color: str = "red") -> str:
    href = "#cross_blue" if color == "blue" else "#cross_red"
    return f'<use href="{href}" x="{x - 14}" y="{y - 14}" data-qc-role="cross-marker" data-qc-allow-overlap="true"/>'


def timeline(tid: str, x: int, y: int, w: int, positions: list[int], colors: list[str] | None = None, labels: list[str] | None = None) -> str:
    colors = colors or ["red"] * len(positions)
    labels = labels or [f"t{SUBS[i]}" for i in range(1, len(positions) + 1)]
    parts = [f'<g id="{tid}" aria-label="Ausfallzeitstrahl">']
    parts.append(f'<line id="{tid}_axis" class="axis" x1="{x}" y1="{y}" x2="{x + w}" y2="{y}" marker-end="url(#arrow_ink)" data-qc-role="axis-line"/>')
    for idx, pos in enumerate(positions):
        xx = x + pos
        parts.append(failure_cross(xx, y, colors[idx]))
        fill = "#139CCB" if colors[idx] == "blue" else "#D1495B"
        parts.append(text(f"{tid}_label_{idx+1}", xx, y + 52, labels[idx], 28, 650, fill, "middle", 'data-qc-role="timeline-label"'))
    parts.append(text(f"{tid}_axis_label", x + w + 46, y + 10, "t", 30, 650))
    parts.append("</g>")
    return "\n".join(parts)


SUBS = {1: "₁", 2: "₂", 3: "₃", 4: "₄", 5: "₅", 6: "₆", 7: "₇"}


def plot_image(plot_id: str, key: str, x: int, y: int, w: int, h: int) -> str:
    rel = PLOTS[key].relative_to(ROOT).as_posix()
    return (
        f'<g id="{plot_id}">'
        f'<image id="{plot_id}_asset" href="{PLOT_DATA[key]}" x="{x}" y="{y}" width="{w}" height="{h}" '
        f'preserveAspectRatio="xMidYMid meet" data-qc-role="plot" data-plot-asset="{rel}" data-plot-embedding="data-uri"/>'
        f'</g>'
    )


def pictogram_image(icon_id: str, key: str, x: int, y: int, w: int, h: int) -> str:
    rel = PICTOGRAMS[key].relative_to(ROOT).as_posix()
    return (
        f'<g id="{icon_id}">'
        f'<image id="{icon_id}_asset" href="{PICTOGRAM_DATA[key]}" x="{x}" y="{y}" width="{w}" height="{h}" '
        f'preserveAspectRatio="xMidYMid meet" data-qc-role="pictogram" data-image-asset="{rel}" data-image-embedding="data-uri"/>'
        f'</g>'
    )


def tool_icon(icon_id: str, x: int, y: int, scale: float = 1.0) -> str:
    s = scale
    return f"""
    <g id="{icon_id}" transform="translate({x} {y}) scale({s})" aria-label="Werkzeug-Symbol">
      <path d="M 0 30 L 56 30 L 56 0 L 110 55 L 56 110 L 56 80 L 0 80 Z" fill="#E7F6FB" stroke="#062D46" stroke-width="4"/>
      <line x1="42" y1="34" x2="76" y2="68" stroke="#062D46" stroke-width="7" stroke-linecap="round"/>
      <line x1="76" y1="34" x2="42" y2="68" stroke="#062D46" stroke-width="7" stroke-linecap="round"/>
    </g>
"""


def inline_weibull_formula(x: int, y: int) -> str:
    return f"""
    <g id="weibull_formula_inline" transform="translate({x} {y})" data-qc-role="formula" data-qc-allow-overlap="true">
      <text x="0" y="42" font-family="Cambria Math, Cambria, Times New Roman, serif" font-size="54" fill="#062D46" data-qc-allow-overlap="true">F(t) = 1 - e</text>
      <text x="266" y="10" font-family="Cambria Math, Cambria, Times New Roman, serif" font-size="31" fill="#062D46" data-qc-allow-overlap="true">-</text>
      <text x="292" y="10" font-family="Cambria Math, Cambria, Times New Roman, serif" font-size="31" fill="#062D46" data-qc-allow-overlap="true">(</text>
      <text x="312" y="-4" font-family="Cambria Math, Cambria, Times New Roman, serif" font-size="30" fill="#062D46" data-qc-allow-overlap="true">t</text>
      <line x1="302" y1="7" x2="348" y2="7" stroke="#062D46" stroke-width="2" data-qc-allow-overlap="true"/>
      <text x="310" y="38" font-family="Cambria Math, Cambria, Times New Roman, serif" font-size="30" fill="#062D46" data-qc-allow-overlap="true">8</text>
      <text x="354" y="10" font-family="Cambria Math, Cambria, Times New Roman, serif" font-size="31" fill="#062D46" data-qc-allow-overlap="true">)</text>
      <text x="376" y="0" font-family="Cambria Math, Cambria, Times New Roman, serif" font-size="30" fill="#062D46" data-qc-allow-overlap="true">3</text>
    </g>
"""


def simple_probability_plot(pid: str, x: int, y: int, w: int = 420, h: int = 340, two_lines: bool = False, confidence: bool = False) -> str:
    x0, y0 = x + 80, y + h - 72
    x1, y1 = x + w - 70, y + 60
    parts = [f'<g id="{pid}">', panel(pid + "_box", x, y, w, h)]
    parts.append(f'<line class="axis" x1="{x0}" y1="{y0}" x2="{x0}" y2="{y + 52}" marker-end="url(#arrow_ink)" data-qc-role="axis-line"/>')
    parts.append(f'<line class="axis" x1="{x0}" y1="{y0}" x2="{x + w - 52}" y2="{y0}" marker-end="url(#arrow_ink)" data-qc-role="axis-line"/>')
    parts.append(f'<path class="fit-red" d="M {x0 + 62} {y0 - 70} L {x1} {y1 + 44}"/>')
    if two_lines:
        parts.append(f'<path class="fit-blue" d="M {x0 + 92} {y0 - 50} L {x1 - 36} {y1 + 24}"/>')
    if confidence:
        parts.append(f'<path class="guide" d="M {x0 + 40} {y0 - 64} C {x0 + 118} {y0 - 132}, {x0 + 210} {y0 - 170}, {x1 + 24} {y1 + 18}"/>')
        parts.append(f'<path class="guide" d="M {x0 + 98} {y0 - 12} C {x0 + 170} {y0 - 72}, {x0 + 232} {y0 - 120}, {x1 + 44} {y1 + 76}"/>')
    parts.append(text(pid + "_ylabel", x + 40, y + 178, "Ausfallwahrscheinlichkeit", 24, 650, "#062D46", "middle", f'transform="rotate(-90 {x + 40} {y + 178})" data-qc-role="axis-label"'))
    parts.append(text(pid + "_xlabel", x + w - 158, y + h - 28, "Lebensdauer", 24, 650, "#062D46", "middle", 'data-qc-role="axis-label"'))
    parts.append("</g>")
    return "\n".join(parts)


def object_time_diagram(oid: str, x: int, y: int, censored: bool = False) -> str:
    rows = [("1", 365, 382), ("2", 465, 332), ("3", 625, 282), ("4", 682, 232), ("5", 498, 182), ("6", 555, 132)]
    parts = [f'<g id="{oid}">', panel(oid + "_box", x, y, 620, 430)]
    parts.append(f'<line class="axis" x1="{x + 112}" y1="{y + 356}" x2="{x + 548}" y2="{y + 356}" marker-end="url(#arrow_ink)" data-qc-role="axis-line"/>')
    parts.append(f'<line class="axis" x1="{x + 112}" y1="{y + 356}" x2="{x + 112}" y2="{y + 62}" marker-end="url(#arrow_ink)" data-qc-role="axis-line"/>')
    parts.append(text(oid + "_ylabel", x + 42, y + 212, "Objekt Nr.", 28, 650, "#062D46", "middle", f'transform="rotate(-90 {x + 42} {y + 212})" data-qc-role="axis-label"'))
    parts.append(text(oid + "_xlabel", x + 575, y + 392, "t", 28, 650, "#062D46", "middle", 'data-qc-role="axis-label"'))
    for nr, fail_x, yy in rows:
        parts.append(text(f"{oid}_row_{nr}", x + 88, y + yy + 9, nr, 26, 600, "#062D46", "end"))
        parts.append(f'<line class="thin-axis" x1="{x + 112}" y1="{y + yy}" x2="{x + 502}" y2="{y + yy}" data-qc-role="grid-line"/>')
        if censored and nr in {"3", "4"}:
            parts.append(f'<line x1="{x + 112}" y1="{y + yy}" x2="{x + 458}" y2="{y + yy}" stroke="#062D46" stroke-width="3.2"/>')
            parts.append(f'<line x1="{x + 458}" y1="{y + yy}" x2="{x + 506}" y2="{y + yy}" stroke="#139CCB" stroke-width="5" marker-end="url(#arrow_blue)"/>')
        else:
            parts.append(failure_cross(x + fail_x, y + yy))
    parts.append("</g>")
    return "\n".join(parts)


def svg(slide: int, desc: str, body: str) -> str:
    metadata = {
        "artifactScope": "content-svg",
        "embeddingTarget": "powerpoint-slide",
        "slideType": "transition-only" if "Übergang" in desc else "content-module",
        "contentTitle": desc,
        "layoutIntent": desc,
        "takeaway": "Transition state; carried by animation rather than a standalone content module." if "Übergang" in desc else desc,
        "density": "normal",
        "contentMode": "transparent-content",
        "backgroundMode": "transparent",
        "brandProfile": "reltest-academy",
        "brandVariant": "technical",
    }
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-labelledby="scene_title scene_desc">
  <title id="scene_title">{esc(desc)}</title>
  <desc id="scene_desc">Content-SVG ohne sichtbare PowerPoint-Masterelemente.</desc>
  <metadata id="slide-quality-metadata" type="application/json"><![CDATA[
{json.dumps(metadata, indent=2, ensure_ascii=False)}
  ]]></metadata>
{marker_defs()}
  <g id="scene_root" class="font">
{body}
  </g>
</svg>
"""


def animation_step(idx: int, target: str) -> dict[str, object]:
    step: dict[str, object] = {
        "stepId": f"{idx:02d}_{target}",
        "targetId": target,
        "action": "show",
        "trigger": "time_or_user",
        "enterFrames": 16,
        "fromY": 10,
        "confidence": "high",
    }
    if target == "confidence_note":
        step["afterInternalPlotDelayMs"] = 3300
        step["sourceText"] = "Die 5 %- und 95 %-Vertrauensgrenzen werden erst nach den Kurven im Python-Plot gezeigt."
    return step


def manifest(slide: int, targets: list[str]) -> str:
    return json.dumps(
        {
            "schemaVersion": "svgAnimationManifest/v1",
            "sceneId": f"{MODULE}_slide_{slide:03d}",
            "svgPath": f"slide_{slide:03d}.svg",
            "status": "draft",
            "defaults": {"enterFrames": 16, "drawDurFrames": 24, "highlightDurFrames": 24},
            "targets": [{"targetId": target, "label": target.replace("_", " "), "status": "animated", "confidence": "high"} for target in targets],
            "steps": [animation_step(idx, target) for idx, target in enumerate(targets, 1)],
            "notes": [
                "Static SVG preview keeps all layers visible; this manifest defines reveal targets for PowerPoint/video animation.",
                "When a Python plot contains internal SVG animation targets, scene-level callouts are placed after that plot in the reveal order.",
            ],
        },
        indent=2,
        ensure_ascii=False,
    ) + "\n"


def slide_004() -> tuple[str, str, list[str]]:
    body = workflow_steps(1) + plot_image("points_plot", "points", 790, 175, 980, 620)
    body += "\n" + text("slide_004_note", 830, 858, "F(tᵢ)-Werte erscheinen als Schnittpunkte.", 32, 650)
    return "Wertepaare als Punkte verorten", body, ["workflow_steps", "points_plot", "slide_004_note"]


def slide_005() -> tuple[str, str, list[str]]:
    body = workflow_steps(2) + plot_image("fit_plot", "weibull", 790, 168, 900, 650)
    body += "\n" + panel("fit_callout_box", 1320, 838, 370, 92, "#E7F6FB", "#CBD5E1")
    body += "\n" + text("fit_callout_text", 1362, 894, "Regressionsgerade", 28, 700)
    return "Regressionsgerade bestimmen", body, ["workflow_steps", "fit_plot", "fit_callout_box", "fit_callout_text"]


def slide_006() -> tuple[str, str, list[str]]:
    body = workflow_steps(3, True) + plot_image("parameter_plot", "parameter", 790, 168, 900, 650)
    body += "\n" + panel("parameter_note_t", 1345, 842, 190, 80, "#E7F6FB", "#CBD5E1")
    body += "\n" + text("parameter_note_t_text", 1382, 894, "T = 63,2 %", 26, 700)
    body += "\n" + panel("parameter_note_b", 1560, 842, 180, 80, "#E7F6FB", "#CBD5E1")
    body += "\n" + text("parameter_note_b_text", 1616, 894, "b", 30, 800)
    return "Weibull-Parameter ablesen", body, ["workflow_steps", "parameter_plot", "parameter_note_t", "parameter_note_b"]


def slide_007() -> tuple[str, str, list[str]]:
    body = timeline("input_timeline", 255, 220, 540, [50, 158, 258, 363, 440, 505], labels=["t₁", "t₂", "t₃", "t₄", "t₅", "t₆"])
    body += "\n" + pictogram_image("tool_transform", "tool", 540, 335, 180, 145)
    body += "\n" + f'<line class="axis" x1="630" y1="486" x2="630" y2="566" marker-end="url(#arrow_ink)" data-qc-role="axis-line"/>'
    body += "\n" + plot_image("weibull_context_plot", "weibull", 205, 560, 770, 360)
    body += "\n" + f'<line class="axis" x1="980" y1="724" x2="1070" y2="724" marker-end="url(#arrow_ink)" data-qc-role="axis-line"/>'
    body += "\n" + panel("formula_panel", 1095, 330, 600, 350, "#FFFFFF", "#CBD5E1")
    body += "\n" + text("parameter_t", 1160, 410, "T -> 8", 34, 700)
    body += "\n" + text("parameter_b", 1160, 462, "b -> 3", 34, 700)
    body += "\n" + inline_weibull_formula(1160, 530)
    body += "\n" + text("example_value", 1160, 790, "F(10) ≈ 85,8 %", 46, 650, "#062D46", "start", 'font-family="Cambria Math, Cambria, Times New Roman, serif"')
    return "Weibull-Funktion mit Beispielwert", body, ["input_timeline", "tool_transform", "weibull_context_plot", "formula_panel", "weibull_formula_inline", "example_value"]


def slide_008() -> tuple[str, str, list[str]]:
    body = '<g id="transition_only_state" opacity="0" data-transition-only="true" data-qc-role="transition-state"/>'
    return "Übergangszustand per Fade", body, ["transition_only_state"]


def slide_009() -> tuple[str, str, list[str]]:
    body = text("mech_a_label", 245, 155, "Ausfallmechanismus A", 28, 650, "#D1495B")
    body += "\n" + text("mech_b_label", 590, 155, "Ausfallmechanismus B", 28, 650, "#139CCB")
    body += "\n" + timeline("mixed_mechanisms", 280, 240, 540, [50, 158, 258, 363, 440, 505], ["red", "blue", "red", "blue", "blue", "red"], ["t₁", "t₂", "t₃", "t₄", "t₅", "t₆"])
    body += "\n" + f'<line id="split_arrow" class="axis" x1="890" y1="240" x2="1030" y2="240" marker-end="url(#arrow_ink)" data-qc-role="axis-line"/>'
    body += "\n" + '<g id="split_result">'
    body += "\n" + text("split_a_title", 1135, 138, "Ausfallmechanismus A", 28, 650, "#D1495B")
    body += "\n" + timeline("mechanism_a", 1240, 210, 360, [46, 165, 292], ["red", "red", "red"], ["t₁", "t₃", "t₆"])
    body += "\n" + text("split_b_title", 1135, 338, "Ausfallmechanismus B", 28, 650, "#139CCB")
    body += "\n" + timeline("mechanism_b", 1240, 410, 360, [70, 202, 274], ["blue", "blue", "blue"], ["t₂", "t₄", "t₅"])
    body += "\n" + "</g>"
    body += "\n" + plot_image("mechanism_plot", "mechanism", 440, 548, 1040, 390)
    return "Ausfallmechanismen trennen", body, ["mixed_mechanisms", "split_arrow", "split_result", "mechanism_plot"]


def slide_010() -> tuple[str, str, list[str]]:
    body = plot_image("weibull_context_plot", "weibull", 120, 175, 760, 565)
    body += "\n" + f'<line id="assignment_arrow" class="axis" x1="920" y1="455" x2="1015" y2="455" marker-end="url(#arrow_ink)" data-qc-role="axis-line"/>'
    body += "\n" + plot_image("object_time_plot", "object_failures", 1045, 170, 760, 570)
    body += "\n" + panel("assignment_note", 520, 805, 880, 92, "#E7F6FB", "#CBD5E1")
    body += "\n" + text("assignment_note_text", 570, 862, "Ausfallzeitpunkte werden den Objekt-Nummern zugeordnet.", 31, 650)
    return "Ausfälle Objekt-Nummern zuordnen", body, ["weibull_context_plot", "assignment_arrow", "object_time_plot", "assignment_note"]


def slide_011() -> tuple[str, str, list[str]]:
    body = plot_image("weibull_context_plot", "weibull", 120, 175, 760, 565)
    body += "\n" + f'<line id="censoring_arrow" class="axis" x1="920" y1="455" x2="1015" y2="455" marker-end="url(#arrow_ink)" data-qc-role="axis-line"/>'
    body += "\n" + plot_image("object_time_plot", "object_censored", 1045, 170, 760, 570)
    body += "\n" + panel("censoring_note", 520, 805, 880, 92, "#E7F6FB", "#CBD5E1")
    body += "\n" + text("censoring_note_text", 570, 862, "Zensierte Beobachtungen bleiben als laufende Prüfzeit sichtbar.", 31, 650)
    return "Zensierte Beobachtungen ergänzen", body, ["weibull_context_plot", "censoring_arrow", "object_time_plot", "censoring_note"]


def slide_012() -> tuple[str, str, list[str]]:
    body = plot_image("weibull_context_plot", "weibull", 170, 190, 780, 570)
    body += "\n" + f'<line id="methods_arrow" class="axis" x1="965" y1="485" x2="1065" y2="485" marker-end="url(#arrow_ink)" data-qc-role="axis-line"/>'
    body += "\n" + panel("methods_box", 1100, 300, 560, 420, "#FFFFFF", "#CBD5E1")
    body += "\n" + text("graphic_method", 1170, 398, "Grafische Methode", 36, 750)
    body += "\n" + text("calculation_methods", 1170, 498, "Berechnungs-Methoden", 36, 750)
    body += "\n" + f'<path class="guide" d="M 1300 540 L 1240 632" marker-end="url(#arrow_blue)"/>'
    body += "\n" + f'<path class="guide" d="M 1425 540 L 1500 632" marker-end="url(#arrow_blue)"/>'
    body += "\n" + text("mls_label", 1210, 704, "MLS", 34, 800)
    body += "\n" + text("mle_label", 1482, 704, "MLE", 34, 800)
    return "Methoden einordnen", body, ["weibull_context_plot", "methods_arrow", "methods_box"]


def slide_013() -> tuple[str, str, list[str]]:
    body = timeline("input_timeline", 250, 210, 560, [52, 164, 270, 372, 462, 520], labels=["t₁", "t₂", "t₃", "t₄", "t₅", "t₆"])
    body += "\n" + f'<line id="confidence_arrow" class="axis" x1="920" y1="210" x2="1045" y2="210" marker-end="url(#arrow_ink)" data-qc-role="axis-line"/>'
    body += "\n" + plot_image("confidence_plot", "confidence", 230, 460, 1030, 455)
    body += "\n" + panel("confidence_note", 1300, 535, 430, 190, "#E7F6FB", "#CBD5E1")
    body += "\n" + text("confidence_note_1", 1345, 596, "5 % / 95 %", 36, 780)
    body += "\n" + text("confidence_note_2", 1345, 648, "Vertrauensgrenzen", 34, 700)
    body += "\n" + text("confidence_note_3", 1345, 696, "als Kurven, nicht als Band", 28, 600)
    return "Weibull-Plot mit Vertrauensgrenzen", body, ["input_timeline", "confidence_arrow", "confidence_plot", "confidence_note"]


SLIDES = {
    4: slide_004,
    5: slide_005,
    6: slide_006,
    7: slide_007,
    8: slide_008,
    9: slide_009,
    10: slide_010,
    11: slide_011,
    12: slide_012,
    13: slide_013,
}


def scene_brief(slide: int, desc: str, targets: list[str]) -> str:
    return f"""# SVG Scene Brief

## Work Unit

- module_id: {MODULE}
- work_unit: slide_{slide:03d}
- sequence_plan: analysis/rebuild-plans/RE3_TEST_1_sequence_plan.md
- source_slides: {slide}
- output_svg: rebuild-proposals/svg/RE3_TEST_1/slide_{slide:03d}/slide_{slide:03d}.svg
- animation_manifest: rebuild-proposals/svg/RE3_TEST_1/slide_{slide:03d}/scene.animation.v1.json

## Content-SVG Decision

- production_scope: Content-SVG for PowerPoint embedding.
- visible PowerPoint title, footer, logo, slide number and frame: omitted.
- external local image references: avoided.
- Python plots: embedded as self-contained data URI when a true technical plot is shown.
- generic one-axis timelines and mechanism split timelines: native SVG.
- object-time diagrams with a y-axis/object rows: Python plot assets.
- transition-only source states: represented as animation/reveal metadata instead of invented standalone content.
- formulas: inline SVG text/geometry where shown, not external local image references.

## Visual Plan

- source state: {desc}
- targets: {", ".join(targets)}
- animation: all listed targets are available as scene-level reveal targets in `scene.animation.v1.json`.

## QA Focus

- No visible global slide title.
- No broken external formula or plot image reference.
- Text remains inside its visual container.
- Plot content is generated by Python where required.
- Timeline failure positions are intentionally irregular.
"""


def main() -> None:
    for slide, builder in SLIDES.items():
        desc, body, targets = builder()
        slide_dir = OUT / f"slide_{slide:03d}"
        slide_dir.mkdir(parents=True, exist_ok=True)
        (slide_dir / f"slide_{slide:03d}.svg").write_text(svg(slide, desc, body), encoding="utf-8")
        (slide_dir / "scene.animation.v1.json").write_text(manifest(slide, targets), encoding="utf-8")
        PLANS.mkdir(parents=True, exist_ok=True)
        (PLANS / f"RE3_TEST_1_slide_{slide:03d}_scene_brief.md").write_text(scene_brief(slide, desc, targets), encoding="utf-8")
    print(f"generated slides 004-013 in {OUT}")


if __name__ == "__main__":
    main()
