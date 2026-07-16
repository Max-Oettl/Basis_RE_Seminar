#!/usr/bin/env python3
"""Generate final-style RE3_TEST_1 SVG slide proposals with animation manifests."""

from __future__ import annotations

import base64
import html
import json
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
MODULE_ID = "RE3_TEST_1"
OUT_ROOT = REPO_ROOT / "rebuild-proposals" / "svg" / MODULE_ID
REPORT_PATH = REPO_ROOT / "analysis" / "reports" / "RE3_TEST_1_final_svg_rebuild.md"
PLAN_PATH = REPO_ROOT / "analysis" / "rebuild-plans" / "RE3_TEST_1_final_svg_rebuild_plan.json"

PLOT_ASSETS = {
    "context": REPO_ROOT / "assets" / "plots" / MODULE_ID / "weibull_probability_context.svg",
    "parameter": REPO_ROOT / "assets" / "plots" / MODULE_ID / "weibull_parameter_plot.svg",
    "mechanism": REPO_ROOT / "assets" / "plots" / MODULE_ID / "weibull_mechanism_split_plot.svg",
    "confidence": REPO_ROOT / "assets" / "plots" / MODULE_ID / "weibull_confidence_bounds_animated.svg",
}

FORMULA_ASSETS = {
    "median_rank": REPO_ROOT / "assets" / "formulas" / MODULE_ID / "median_rank.svg",
    "weibull_parameter_t": REPO_ROOT / "assets" / "formulas" / MODULE_ID / "weibull_parameter_t.svg",
    "weibull_parameter_b": REPO_ROOT / "assets" / "formulas" / MODULE_ID / "weibull_parameter_b.svg",
    "weibull_function": REPO_ROOT / "assets" / "formulas" / MODULE_ID / "weibull_function.svg",
    "weibull_example_value": REPO_ROOT / "assets" / "formulas" / MODULE_ID / "weibull_example_value.svg",
}

PICTOGRAMS = {
    "tool": REPO_ROOT / "assets" / "scenes" / MODULE_ID / "pictograms" / "tool-transform-arrow.png",
    "graph": REPO_ROOT / "assets" / "scenes" / MODULE_ID / "pictograms" / "method-graph.png",
    "calculation": REPO_ROOT / "assets" / "scenes" / MODULE_ID / "pictograms" / "method-calculation-pictogram.png",
}


def esc(value: str) -> str:
    return html.escape(str(value), quote=True)


def data_uri(path: Path, mime: str) -> str:
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode('ascii')}"


PLOT_URIS = {key: data_uri(path, "image/svg+xml") for key, path in PLOT_ASSETS.items()}
FORMULA_URIS = {key: data_uri(path, "image/svg+xml") for key, path in FORMULA_ASSETS.items()}
PICTOGRAM_URIS = {key: data_uri(path, "image/png") for key, path in PICTOGRAMS.items()}


STYLE = """
  .bg { fill: #f7f9fb; }
  .surface { fill: #ffffff; stroke: #cfe0e8; stroke-width: 2; }
  .soft { fill: #e8f6fb; stroke: #9bd5e7; stroke-width: 2; }
  .note { fill: #fff7df; stroke: #efc86b; stroke-width: 2; }
  .muted-panel { fill: #f1f6f8; stroke: #d6e5ec; stroke-width: 2; }
  .ink { fill: #062d46; }
  .blue-fill { fill: #0c8fc1; }
  .red-fill { fill: #e11931; }
  .green-fill { fill: #24895a; }
  .text { font-family: Inter, "Segoe UI", Arial, sans-serif; fill: #062d46; letter-spacing: 0; }
  .eyebrow { font-size: 21px; font-weight: 780; fill: #0c8fc1; }
  .section { font-size: 31px; font-weight: 800; }
  .body { font-size: 24px; fill: #536979; }
  .small { font-size: 19px; fill: #536979; }
  .tiny { font-size: 16px; fill: #536979; }
  .axis-label { font-size: 20px; font-weight: 720; }
  .formula-label { font-size: 27px; font-weight: 760; }
  .axis { stroke: #062d46; stroke-width: 4; stroke-linecap: round; fill: none; }
  .thin { stroke: #062d46; stroke-width: 2.8; stroke-linecap: round; fill: none; }
  .grid { stroke: #d8e7ee; stroke-width: 1.8; fill: none; }
  .guide { stroke: #0c8fc1; stroke-width: 3; stroke-dasharray: 9 8; fill: none; }
  .guide-red { stroke: #e11931; stroke-width: 2.4; stroke-dasharray: 8 7; fill: none; }
  .line-blue { stroke: #0c8fc1; stroke-width: 5; stroke-linecap: round; fill: none; }
  .line-red { stroke: #e11931; stroke-width: 5; stroke-linecap: round; fill: none; }
  .line-green { stroke: #24895a; stroke-width: 5; stroke-linecap: round; fill: none; }
  .dash { stroke-dasharray: 10 8; }
  .failure { stroke: #e11931; stroke-width: 5; stroke-linecap: round; }
  .failure-blue { stroke: #0c8fc1; stroke-width: 5; stroke-linecap: round; }
  .marker-red { fill: #ffffff; stroke: #e11931; stroke-width: 4; }
  .marker-blue { fill: #ffffff; stroke: #0c8fc1; stroke-width: 4; }
  .chip { fill: #ffffff; stroke: #cfe0e8; stroke-width: 2; }
"""


DEFS = f"""
  <defs>
    <style>{STYLE}</style>
    <marker id="arrow_ink" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#062d46"/>
    </marker>
    <marker id="arrow_blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0c8fc1"/>
    </marker>
    <g id="symbol_failure_red">
      <line class="failure" x1="-13" y1="-13" x2="13" y2="13"/>
      <line class="failure" x1="-13" y1="13" x2="13" y2="-13"/>
    </g>
    <g id="symbol_failure_blue">
      <line class="failure-blue" x1="-13" y1="-13" x2="13" y2="13"/>
      <line class="failure-blue" x1="-13" y1="13" x2="13" y2="-13"/>
    </g>
    <g id="symbol_censored">
      <circle r="16" fill="#ffffff" stroke="#0c8fc1" stroke-width="4"/>
      <line class="failure-blue" x1="-8" y1="0" x2="8" y2="0"/>
    </g>
  </defs>
"""


def image_asset(kind: str, key: str, x: int, y: int, width: int, height: int) -> str:
    if kind == "plot":
        href = PLOT_URIS[key]
        rel = PLOT_ASSETS[key].relative_to(REPO_ROOT).as_posix()
        attr = "data-plot-asset"
    elif kind == "formula":
        href = FORMULA_URIS[key]
        rel = FORMULA_ASSETS[key].relative_to(REPO_ROOT).as_posix()
        attr = "data-formula-asset"
    else:
        href = PICTOGRAM_URIS[key]
        rel = PICTOGRAMS[key].relative_to(REPO_ROOT).as_posix()
        attr = "data-image-asset"
    return (
        f'<image href="{href}" {attr}="{rel}" x="{x}" y="{y}" '
        f'width="{width}" height="{height}" preserveAspectRatio="xMidYMid meet"/>'
    )


def text(x: int, y: int, value: str, klass: str = "body", anchor: str = "start") -> str:
    return f'<text class="text {klass}" x="{x}" y="{y}" text-anchor="{anchor}">{esc(value)}</text>'


def wrapped_text(x: int, y: int, lines: list[str], klass: str = "body", gap: int = 32) -> str:
    return "\n".join(text(x, y + index * gap, line, klass) for index, line in enumerate(lines))


def panel(x: int, y: int, width: int, height: int, klass: str = "surface", rx: int = 10) -> str:
    return f'<rect class="{klass}" x="{x}" y="{y}" width="{width}" height="{height}" rx="{rx}"/>'


def slide_header(slide: int, focus: str) -> str:
    return f"""
  <g id="slide_{slide:03d}_context" data-visible-title="omitted" data-focus="{esc(focus)}"/>
"""


def step_rail(active: int, max_step: int = 3, x: int = 112, y: int = 180) -> str:
    steps = [
        ("0", "Sammeln der", "Ausfalldaten"),
        ("1", "Berechnen von", "Ausfallwahrscheinlichkeiten"),
        ("2", "Ermittlung der", "Regressionsgeraden"),
        ("3", "Schätzung der", "Weibull-Parameter"),
    ][: max_step + 1]
    parts = [f'<g id="step_rail" transform="translate({x} {y})">']
    for index, (number, line1, line2) in enumerate(steps):
        yy = index * 126
        klass = "soft" if index == active else "muted-panel"
        fill = "#0c8fc1" if index <= active else "#ffffff"
        num_fill = "#ffffff" if index <= active else "#0c8fc1"
        parts.append(
            f"""
      <g id="step_{index}">
        {panel(0, yy, 438, 96, klass, 10)}
        <circle cx="42" cy="{yy + 48}" r="24" fill="{fill}" stroke="#0c8fc1" stroke-width="3"/>
        <text class="text" x="42" y="{yy + 56}" text-anchor="middle" style="font-size:22px;font-weight:850;fill:{num_fill}">{number}</text>
        {text(86, yy + 38, line1, "small")}
        {text(86, yy + 70, line2, "small")}
      </g>"""
        )
    parts.append("</g>")
    return "\n".join(parts)


def failure_cross(x: int, y: int, blue: bool = False) -> str:
    return f'<use href="#{"symbol_failure_blue" if blue else "symbol_failure_red"}" x="{x}" y="{y}"/>'


def time_axis(prefix: str, x: int, y: int, width: int, events: list[int], labels: bool = True, blue_events: set[int] | None = None) -> str:
    blue_events = blue_events or set()
    parts = [
        f'<g id="{prefix}_time_axis">',
        f'<line class="axis" x1="{x}" y1="{y}" x2="{x + width}" y2="{y}" marker-end="url(#arrow_ink)"/>',
        text(x + width + 34, y + 8, "t", "axis-label"),
    ]
    for index, offset in enumerate(events, start=1):
        xx = x + offset
        is_blue = index in blue_events
        parts.append(failure_cross(xx, y, is_blue))
        if labels:
            color = "#0c8fc1" if is_blue else "#e11931"
            parts.append(
                f'<text class="text tiny" x="{xx - 13}" y="{y + 48}" style="fill:{color};font-weight:760">t<tspan baseline-shift="sub" font-size="12">{index}</tspan></text>'
            )
    parts.append("</g>")
    return "\n".join(parts)


def median_formula(x: int, y: int, width: int = 430, height: int = 126) -> str:
    return image_asset("formula", "median_rank", x, y, width, height)


def cumulative_diagram(prefix: str, x: int, y: int, *, show_guides: bool, show_points: bool) -> str:
    times = [118, 230, 338, 450, 562, 674, 786]
    levels = [376, 336, 294, 252, 210, 168, 126]
    parts = [
        f'<g id="{prefix}_cumulative_diagram" transform="translate({x} {y})">',
        panel(0, 0, 930, 555, "surface", 10),
        '<line class="axis" x1="160" y1="438" x2="832" y2="438" marker-end="url(#arrow_ink)"/>',
        '<line class="axis" x1="160" y1="438" x2="160" y2="80" marker-end="url(#arrow_ink)"/>',
        text(702, 502, "Lebensdauer t", "axis-label"),
        '<text class="text axis-label" x="66" y="304" transform="rotate(-90 66 304)">Summe der ausgefallenen Teile</text>',
    ]
    if show_guides:
        for index, (tx, yy) in enumerate(zip(times, levels), start=1):
            xx = 160 + tx
            parts.append(f'<path class="guide-red" d="M 160 {yy} H {xx} V 438"/>')
            parts.append(
                f'<text class="text tiny" x="92" y="{yy + 5}" style="fill:#e11931;font-weight:760">F(t<tspan baseline-shift="sub" font-size="11">{index}</tspan>)</text>'
            )
    if show_points:
        for tx, yy in zip(times, levels):
            parts.append(failure_cross(160 + tx, yy))
    for index, tx in enumerate(times, start=1):
        parts.append(failure_cross(160 + tx, 438))
        parts.append(
            f'<text class="text tiny" x="{160 + tx - 10}" y="480" style="fill:#e11931;font-weight:760">t<tspan baseline-shift="sub" font-size="11">{index}</tspan></text>'
        )
    parts.append("</g>")
    return "\n".join(parts)


def mapping_table(x: int, y: int) -> str:
    rows = [("t₁", "10 %"), ("t₂", "22 %"), ("t₃", "36 %"), ("t₄", "50 %"), ("t₅", "64 %")]
    parts = [f'<g id="mapping_table" transform="translate({x} {y})">', panel(0, 0, 420, 270, "soft", 10)]
    parts.append(text(32, 54, "Wertepaare", "section"))
    parts.append(text(32, 98, "Aus jedem Ausfall wird ein Punkt:", "small"))
    parts.append(text(48, 148, "Zeit", "small"))
    parts.append(text(206, 148, "F(tᵢ)", "small"))
    for index, (time_value, prob) in enumerate(rows):
        yy = 186 + index * 22
        parts.append(text(54, yy, time_value, "tiny"))
        parts.append(text(210, yy, prob, "tiny"))
    parts.append("</g>")
    return "\n".join(parts)


def plot_panel(prefix: str, key: str, x: int, y: int, width: int, height: int) -> str:
    return f"""
  <g id="{prefix}_plot_asset">
    {panel(x, y, width, height, "surface", 10)}
    {image_asset("plot", key, x + 22, y + 24, width - 44, height - 48)}
  </g>
"""


def object_diagram(prefix: str, x: int, y: int, *, censored: bool) -> str:
    rows = [(1, 470), (2, 545), (3, 620), (4, 695)]
    fail_x = [535, 740, 920, 610]
    parts = [f'<g id="{prefix}_object_diagram" transform="translate({x} {y})">', panel(0, 0, 790, 520, "surface", 10)]
    parts.append(text(42, 60, "Objekt-Zeit-Diagramm", "section"))
    parts.append(text(42, 100, "Jede Zeile beschreibt ein Prüfling über der Zeit.", "small"))
    parts.append('<line class="axis" x1="180" y1="438" x2="700" y2="438" marker-end="url(#arrow_ink)"/>')
    parts.append(text(735, 446, "t", "axis-label"))
    for index, (row, yy) in enumerate(rows):
        local_y = yy - y
        parts.append(text(44, local_y + 8, f"Objekt {row}", "small"))
        parts.append(f'<line class="thin" x1="180" y1="{local_y}" x2="680" y2="{local_y}"/>')
        parts.append(failure_cross(fail_x[index] - x, local_y))
    if censored:
        parts.append('<use href="#symbol_censored" x="650" y="320"/>')
        parts.append('<path class="guide" d="M 650 225 V 438"/>')
        parts.append(text(476, 222, "zensierte Beobachtung", "small"))
        parts.append(text(476, 254, "bis hier kein Ausfall", "tiny"))
    parts.append("</g>")
    return "\n".join(parts)


def mechanism_timeline(x: int, y: int) -> str:
    return f"""
  <g id="mechanism_timeline">
    {time_axis("mechanism_all", x, y, 560, [46, 132, 218, 347, 425, 536], True, {2, 5})}
    {text(x, y - 82, "Ausfallmechanismus A", "small")}
    {text(x + 346, y - 82, "Ausfallmechanismus B", "small")}
    <path class="guide" d="M {x + 160} {y - 28} C {x + 185} {y - 84}, {x + 320} {y - 84}, {x + 350} {y - 28}"/>
  </g>
"""


def slide_001() -> tuple[str, list[str]]:
    body = f"""
{slide_header(1, "Ausfallzeiten werden gesammelt, sortiert und als Zeitachse lesbar gemacht.")}
  <g id="slide_001_process">
    {step_rail(0, 1)}
  </g>
  <g id="slide_001_main">
    {panel(640, 260, 1080, 390, "surface", 10)}
    {text(700, 332, "Beobachtete Ausfallzeiten", "section")}
    {text(700, 380, "Die Messwerte liegen zunächst nur als einzelne Lebensdauern vor.", "body")}
    {time_axis("slide_001_failures", 730, 510, 710, [54, 139, 232, 352, 486, 604, 676])}
  </g>
  <g id="slide_001_note">
    {panel(700, 736, 780, 116, "note", 10)}
    {text(740, 786, "Ziel des ersten Schritts", "section")}
    {text(740, 826, "Aus einer unsortierten Datensammlung entsteht eine geordnete Ausfallreihe.", "body")}
  </g>
"""
    return body, ["slide_001_context", "slide_001_process", "slide_001_main", "slide_001_note"]


def slide_002() -> tuple[str, list[str]]:
    body = f"""
{slide_header(2, "Die Zeitwerte bekommen über das Median-Rang-Verfahren eine geschätzte Ausfallwahrscheinlichkeit.")}
  <g id="slide_002_process">
    {step_rail(1, 1)}
  </g>
  <g id="slide_002_formula">
    {panel(626, 210, 580, 330, "surface", 10)}
    {text(678, 272, "Berechnung mit", "section")}
    {median_formula(676, 312, 450, 138)}
    {text(678, 488, "i: Rangnummer des Ausfalls", "small")}
    {text(678, 520, "n: Stichprobengröße", "small")}
  </g>
  <g id="slide_002_axis">
    {panel(1260, 210, 470, 520, "surface", 10)}
    {text(1310, 270, "Ausfallwahrscheinlichkeit", "section")}
    <line class="axis" x1="1374" y1="632" x2="1374" y2="348" marker-end="url(#arrow_ink)"/>
    <line class="axis" x1="1374" y1="632" x2="1648" y2="632" marker-end="url(#arrow_ink)"/>
    {text(1332, 338, "Summe", "small")}
    {text(1324, 366, "der Ausfälle", "small")}
    {time_axis("slide_002_sorted", 1398, 632, 214, [18, 47, 83, 132, 172, 204], True)}
  </g>
  <g id="slide_002_note">
    {panel(626, 610, 580, 132, "soft", 10)}
    {text(670, 665, "Zwischenergebnis", "section")}
    {text(670, 708, "Zu jedem tᵢ gehört nun ein F(tᵢ)-Wert.", "body")}
  </g>
"""
    return body, ["slide_002_context", "slide_002_process", "slide_002_formula", "slide_002_axis", "slide_002_note"]


def slide_003() -> tuple[str, list[str]]:
    body = f"""
{slide_header(3, "Die berechneten F(tᵢ)-Werte werden als Hilfslinien im Diagramm verortet.")}
  <g id="slide_003_process">
    {step_rail(1, 1)}
  </g>
  <g id="slide_003_formula">
    {panel(600, 176, 470, 210, "soft", 10)}
    {text(640, 232, "Berechnung bleibt sichtbar", "section")}
    {median_formula(636, 270, 374, 104)}
  </g>
  <g id="slide_003_main">
    {cumulative_diagram("slide_003", 575, 430, show_guides=True, show_points=False)}
  </g>
  <g id="slide_003_explanation">
    {panel(1540, 430, 270, 310, "note", 10)}
    {text(1572, 486, "Lesart", "section")}
    {wrapped_text(1572, 536, ["Jede rote Linie", "verknüpft einen", "Zeitpunkt tᵢ mit", "seinem F(tᵢ)."], "small", 30)}
  </g>
"""
    return body, ["slide_003_context", "slide_003_process", "slide_003_formula", "slide_003_main", "slide_003_explanation"]


def slide_004() -> tuple[str, list[str]]:
    body = f"""
{slide_header(4, "Aus tᵢ und F(tᵢ) entstehen Datenpunkte im Weibull-Wahrscheinlichkeitsnetz.")}
  <g id="slide_004_process">
    {step_rail(1, 1)}
  </g>
  <g id="slide_004_plot">
    {plot_panel("slide_004", "context", 610, 190, 850, 625)}
  </g>
  <g id="slide_004_values">
    {mapping_table(1490, 260)}
  </g>
  <g id="slide_004_note">
    {panel(650, 862, 940, 88, "note", 10)}
    {text(694, 916, "Die Punktwolke ist jetzt die Basis für Fit, Parameter und spätere Prognosen.", "body")}
  </g>
"""
    return body, ["slide_004_context", "slide_004_process", "slide_004_plot", "slide_004_values", "slide_004_note"]


def slide_005() -> tuple[str, list[str]]:
    body = f"""
{slide_header(5, "Durch die Punkte wird eine Ausgleichsgerade gelegt.")}
  <g id="slide_005_process">
    {step_rail(2, 2)}
  </g>
  <g id="slide_005_plot">
    {plot_panel("slide_005", "context", 600, 190, 920, 650)}
  </g>
  <g id="slide_005_callout">
    <path class="line-blue" d="M 1510 515 C 1580 500, 1608 450, 1650 392" marker-end="url(#arrow_blue)"/>
    {panel(1488, 610, 310, 152, "soft", 10)}
    {text(1528, 664, "Ausgleichsgerade", "section")}
    {text(1528, 706, "beschreibt den Trend", "body")}
    {text(1528, 742, "der Ausfalldaten.", "body")}
  </g>
"""
    return body, ["slide_005_context", "slide_005_process", "slide_005_plot", "slide_005_callout"]


def slide_006() -> tuple[str, list[str]]:
    body = f"""
{slide_header(6, "Aus der Geraden werden charakteristische Lebensdauer T und Formparameter b abgelesen.")}
  <g id="slide_006_process">
    {step_rail(3, 3)}
  </g>
  <g id="slide_006_plot">
    {plot_panel("slide_006", "parameter", 600, 180, 920, 660)}
  </g>
  <g id="slide_006_parameters">
    {panel(1510, 260, 292, 166, "note", 10)}
    {text(1550, 322, "T", "section")}
    {text(1592, 322, "bei 63,2 %", "body")}
    {text(1550, 364, "charakteristische", "small")}
    {text(1550, 394, "Lebensdauer", "small")}
    {panel(1510, 482, 292, 156, "soft", 10)}
    {text(1550, 544, "b", "section")}
    {text(1592, 544, "aus der Steigung", "body")}
    {text(1550, 586, "Formparameter", "small")}
  </g>
"""
    return body, ["slide_006_context", "slide_006_process", "slide_006_plot", "slide_006_parameters"]


def slide_007() -> tuple[str, list[str]]:
    body = f"""
{slide_header(7, "Die abgelesenen Parameter werden in die Weibull-Funktion eingesetzt.")}
  <g id="slide_007_input">
    {time_axis("slide_007_failures", 248, 238, 520, [42, 118, 203, 317, 428, 496], True)}
    {image_asset("image", "tool", 430, 350, 126, 126)}
  </g>
  <g id="slide_007_plot">
    {plot_panel("slide_007", "context", 190, 520, 700, 385)}
  </g>
  <g id="slide_007_formula">
    {panel(1020, 274, 710, 248, "soft", 10)}
    {text(1070, 334, "Parameter einsetzen", "section")}
    {image_asset("formula", "weibull_parameter_t", 1068, 370, 150, 58)}
    {image_asset("formula", "weibull_parameter_b", 1248, 370, 150, 58)}
    {image_asset("formula", "weibull_function", 1060, 444, 592, 82)}
    {panel(1020, 590, 710, 148, "note", 10)}
    {image_asset("formula", "weibull_example_value", 1064, 620, 330, 64)}
    {text(1070, 712, "Beispielwert aus der Funktion", "body")}
  </g>
"""
    return body, ["slide_007_context", "slide_007_input", "slide_007_plot", "slide_007_formula"]


def slide_008() -> tuple[str, list[str]]:
    body = f"""
{slide_header(8, "Die grafische Auswertung bleibt als Zwischenzustand sichtbar.")}
  <g id="slide_008_input">
    {time_axis("slide_008_failures", 248, 238, 520, [42, 118, 203, 317, 428, 496], True)}
    {image_asset("image", "tool", 430, 350, 126, 126)}
  </g>
  <g id="slide_008_plot">
    {plot_panel("slide_008", "context", 650, 300, 760, 520)}
  </g>
  <g id="slide_008_note">
    {panel(1450, 430, 300, 180, "soft", 10)}
    {text(1490, 492, "Ergebnis", "section")}
    {wrapped_text(1490, 538, ["Der Fit beschreibt", "das beobachtete", "Ausfallverhalten."], "body", 34)}
  </g>
"""
    return body, ["slide_008_context", "slide_008_input", "slide_008_plot", "slide_008_note"]


def slide_009() -> tuple[str, list[str]]:
    body = f"""
{slide_header(9, "Gemischte Ausfallereignisse werden nach Mechanismus A und B getrennt bewertet.")}
  <g id="slide_009_timeline">
    {mechanism_timeline(190, 228)}
  </g>
  <g id="slide_009_tool">
    {image_asset("image", "tool", 414, 360, 126, 126)}
  </g>
  <g id="slide_009_plot">
    {plot_panel("slide_009", "mechanism", 150, 540, 700, 390)}
  </g>
  <g id="slide_009_split">
    {panel(1000, 242, 720, 430, "surface", 10)}
    {text(1050, 304, "Getrennte Mechanismen", "section")}
    {time_axis("slide_009_mech_a", 1070, 390, 430, [54, 180, 344], True)}
    {text(1540, 398, "Mechanismus A", "small")}
    {time_axis("slide_009_mech_b", 1070, 542, 430, [112, 296], True, {1, 2})}
    {text(1540, 550, "Mechanismus B", "small")}
  </g>
  <g id="slide_009_note">
    {panel(1000, 730, 720, 118, "note", 10)}
    {text(1048, 786, "Ein gemeinsamer Fit kann die Physik verdecken.", "body")}
    {text(1048, 824, "Erst trennen, dann bewerten.", "body")}
  </g>
"""
    return body, ["slide_009_context", "slide_009_timeline", "slide_009_tool", "slide_009_plot", "slide_009_split", "slide_009_note"]


def slide_010() -> tuple[str, list[str]]:
    body = f"""
{slide_header(10, "Ausfallzeitpunkte werden einzelnen Objekten zugeordnet.")}
  <g id="slide_010_input">
    {time_axis("slide_010_failures", 210, 246, 520, [42, 114, 205, 324, 429, 498], True)}
    {image_asset("image", "tool", 426, 366, 124, 124)}
  </g>
  <g id="slide_010_plot">
    {plot_panel("slide_010", "context", 150, 565, 610, 340)}
  </g>
  <g id="slide_010_objects">
    {object_diagram("slide_010", 940, 264, censored=False)}
  </g>
"""
    return body, ["slide_010_context", "slide_010_input", "slide_010_plot", "slide_010_objects"]


def slide_011() -> tuple[str, list[str]]:
    body = f"""
{slide_header(11, "Nicht ausgefallene Prüflinge werden als zensierte Beobachtungen ergänzt.")}
  <g id="slide_011_input">
    {time_axis("slide_011_failures", 210, 246, 520, [42, 114, 205, 324, 429, 498], True, {4})}
    {image_asset("image", "tool", 426, 366, 124, 124)}
  </g>
  <g id="slide_011_plot">
    {plot_panel("slide_011", "context", 150, 565, 610, 340)}
  </g>
  <g id="slide_011_objects">
    {object_diagram("slide_011", 940, 264, censored=True)}
  </g>
  <g id="slide_011_note">
    {panel(1018, 820, 640, 86, "note", 10)}
    {text(1062, 874, "Zensierte Daten liefern Information, obwohl kein Ausfall beobachtet wurde.", "small")}
  </g>
"""
    return body, ["slide_011_context", "slide_011_input", "slide_011_plot", "slide_011_objects", "slide_011_note"]


def slide_012() -> tuple[str, list[str]]:
    body = f"""
{slide_header(12, "Die grafische Methode wird von rechnerischen Methoden abgegrenzt.")}
  <g id="slide_012_input">
    {time_axis("slide_012_failures", 238, 246, 520, [42, 114, 205, 324, 429, 498], True)}
    {image_asset("image", "tool", 452, 366, 124, 124)}
  </g>
  <g id="slide_012_methods">
    <path class="axis" d="M 790 470 H 935" marker-end="url(#arrow_ink)"/>
    {panel(1000, 268, 640, 190, "surface", 10)}
    {image_asset("image", "graph", 1042, 314, 92, 92)}
    {text(1170, 338, "Grafische Methode", "section")}
    {text(1170, 386, "Bewertung direkt im Wahrscheinlichkeitsnetz", "body")}
    {panel(1000, 560, 640, 220, "surface", 10)}
    {image_asset("image", "calculation", 1042, 616, 92, 92)}
    {text(1170, 636, "Berechnungsmethoden", "section")}
    {text(1170, 686, "MLS und MLE", "body")}
    {text(1170, 724, "rechnerische Parameterschätzung", "small")}
  </g>
"""
    return body, ["slide_012_context", "slide_012_input", "slide_012_methods"]


def slide_013() -> tuple[str, list[str]]:
    body = f"""
{slide_header(13, "Vertrauensgrenzen zeigen die Unsicherheit des Weibull-Fits.")}
  <g id="slide_013_input">
    {time_axis("slide_013_failures", 210, 206, 520, [42, 114, 205, 324, 429, 498], True)}
    {image_asset("image", "tool", 426, 318, 124, 124)}
  </g>
  <g id="slide_013_plot">
    {plot_panel("slide_013", "confidence", 210, 500, 980, 468)}
  </g>
  <g id="slide_013_explanation">
    {panel(1260, 392, 430, 250, "note", 10)}
    {text(1304, 456, "Vertrauensgrenzen", "section")}
    {wrapped_text(1304, 510, ["5 % und 95 %", "als nicht-parallele", "Bootstrap-Grenzkurven"], "body", 36)}
    {panel(1260, 708, 430, 124, "soft", 10)}
    {text(1304, 758, "Plot-Animation", "section")}
    {text(1304, 800, "Grenzkurven können zeitverzögert erscheinen.", "small")}
  </g>
"""
    return body, ["slide_013_context", "slide_013_input", "slide_013_plot", "slide_013_explanation"]


SLIDE_BUILDERS = {
    1: slide_001,
    2: slide_002,
    3: slide_003,
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

FOCUS = {
    1: "Ausfallzeiten sammeln und sortieren",
    2: "Median-Rang berechnen",
    3: "Hilfslinien vorbereiten",
    4: "Wertepaare in das Weibull-Netz übertragen",
    5: "Ausgleichsgerade bestimmen",
    6: "Weibull-Parameter ablesen",
    7: "Parameter in die Funktion einsetzen",
    8: "Grafische Auswertung halten",
    9: "Ausfallmechanismen trennen",
    10: "Objekt-Zeit-Diagramm aufbauen",
    11: "Zensierte Beobachtungen ergänzen",
    12: "Auswertemethoden einordnen",
    13: "Vertrauensgrenzen darstellen",
}


def svg_document(slide: int, body: str) -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" role="img" aria-labelledby="title desc" data-module="{MODULE_ID}" data-slide="{slide:03d}">
  <title id="title">RE3 Test 1 Folie {slide:02d}</title>
  <desc id="desc">{esc(FOCUS[slide])}</desc>
{DEFS}
  <rect id="slide_{slide:03d}_background" class="bg" width="1920" height="1080"/>
{body}
</svg>
"""


def manifest(slide: int, targets: list[str]) -> dict:
    manifest_targets = [
        {
            "targetId": target,
            "label": target.replace(f"slide_{slide:03d}_", "").replace("_", " "),
            "status": "animated" if target != f"slide_{slide:03d}_background" else "ignored",
            "confidence": "high",
        }
        for target in [f"slide_{slide:03d}_background", *targets]
    ]
    steps = [
        {
            "stepId": f"{slide:03d}_{index:02d}",
            "targetId": target,
            "action": "show",
            "sourceText": FOCUS[slide],
            "enterFrames": 16,
            "fromY": 10,
            "confidence": "medium",
        }
        for index, target in enumerate(targets, start=1)
    ]
    if slide == 13:
        steps.append(
            {
                "stepId": "013_plot_confidence_hint",
                "targetId": "slide_013_explanation",
                "action": "highlight",
                "sourceText": "Vertrauensgrenzen",
                "durFrames": 36,
                "confidence": "high",
            }
        )
    return {
        "schemaVersion": "svgAnimationManifest/v1",
        "svgPath": f"slide_{slide:03d}.svg",
        "defaults": {
            "enterFrames": 16,
            "highlightDurFrames": 28,
            "drawDurFrames": 32,
            "pauseMs": 450,
        },
        "targets": manifest_targets,
        "steps": steps,
    }


def write_outputs() -> None:
    OUT_ROOT.mkdir(parents=True, exist_ok=True)
    slides = []
    for slide in range(1, 14):
        body, targets = SLIDE_BUILDERS[slide]()
        slide_dir = OUT_ROOT / f"slide_{slide:03d}"
        slide_dir.mkdir(parents=True, exist_ok=True)
        svg_path = slide_dir / f"slide_{slide:03d}.svg"
        manifest_path = slide_dir / "scene.animation.v1.json"
        svg_path.write_text(svg_document(slide, body), encoding="utf-8")
        manifest_path.write_text(json.dumps(manifest(slide, targets), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        slides.append(
            {
                "slide": slide,
                "focus": FOCUS[slide],
                "svg": svg_path.relative_to(REPO_ROOT).as_posix(),
                "manifest": manifest_path.relative_to(REPO_ROOT).as_posix(),
            }
        )

    PLAN_PATH.parent.mkdir(parents=True, exist_ok=True)
    PLAN_PATH.write_text(
        json.dumps(
            {
                "schema": "finalSvgRebuildPlan/v1",
                "module_id": MODULE_ID,
                "output_root": OUT_ROOT.relative_to(REPO_ROOT).as_posix(),
                "principles": [
                    "13 regular individual slide SVGs, not an HTML comparison variant",
                    "true technical plots embedded from Python plot SVG assets",
                    "formulas embedded from LaTeX/Mathtext SVG assets",
                    "generic timelines and object-time diagrams built as native SVG",
                    "animations described in scene.animation.v1.json beside every SVG",
                ],
                "slides": slides,
            },
            indent=2,
            ensure_ascii=False,
        )
        + "\n",
        encoding="utf-8",
    )

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    rows = "\n".join(
        f"| {item['slide']:02d} | {item['focus']} | `{item['svg']}` | `{item['manifest']}` |"
        for item in slides
    )
    REPORT_PATH.write_text(
        f"""# RE3_TEST_1 Final SVG Rebuild

Die regulären SVG-Vorschläge wurden neu erzeugt. Die vorherigen Vorschlags-SVGs unter `rebuild-proposals/svg/RE3_TEST_1` wurden vor der Neuerstellung entfernt.

## Umsetzung

- Ein SVG pro Folie mit eigenem Animationsmanifest.
- Python-Plot-SVGs für echte technische Diagramme.
- LaTeX/Mathtext-SVGs für nicht-triviale Formeln.
- Native SVG-Layer für Zeitstrahlen, Hilfslinien, Objekt-Zeit-Diagramme und Erklärflächen.
- Keine sichtbaren PowerPoint-Folientitel in den SVGs.

## Folien

| Folie | Fokus | SVG | Animation |
|---|---|---|---|
{rows}
""",
        encoding="utf-8",
    )


if __name__ == "__main__":
    write_outputs()
    print(OUT_ROOT)
