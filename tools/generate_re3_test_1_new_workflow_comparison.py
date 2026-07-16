#!/usr/bin/env python3
"""Generate a fresh RE3_TEST_1 SVG comparison set from the layered workflow."""

from __future__ import annotations

import base64
import html
import json
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
OUT_ROOT = REPO_ROOT / "rebuild-proposals" / "workflow-comparison" / "RE3_TEST_1" / "new-workflow"
INDEX_PATH = OUT_ROOT.parent / "comparison_index.html"
REPORT_PATH = REPO_ROOT / "analysis" / "reports" / "RE3_TEST_1_new_workflow_comparison.md"
PLAN_PATH = REPO_ROOT / "analysis" / "rebuild-plans" / "RE3_TEST_1_new_workflow_comparison_plan.json"

PLOT_ASSETS = {
    "parameter": REPO_ROOT / "assets" / "plots" / "RE3_TEST_1" / "weibull_parameter_plot.svg",
    "context": REPO_ROOT / "assets" / "plots" / "RE3_TEST_1" / "weibull_probability_context.svg",
    "mechanism": REPO_ROOT / "assets" / "plots" / "RE3_TEST_1" / "weibull_mechanism_split_plot.svg",
    "confidence": REPO_ROOT / "assets" / "plots" / "RE3_TEST_1" / "weibull_confidence_bounds_animated.svg",
}

PICTOGRAMS = {
    "graph": REPO_ROOT / "assets" / "scenes" / "RE3_TEST_1" / "pictograms" / "method-graph.png",
    "calculation": REPO_ROOT / "assets" / "scenes" / "RE3_TEST_1" / "pictograms" / "method-calculation-pictogram.png",
}

FORMULA_ASSETS = {
    "median_rank": REPO_ROOT / "assets" / "formulas" / "RE3_TEST_1" / "median_rank.svg",
    "weibull_parameter_t": REPO_ROOT / "assets" / "formulas" / "RE3_TEST_1" / "weibull_parameter_t.svg",
    "weibull_parameter_b": REPO_ROOT / "assets" / "formulas" / "RE3_TEST_1" / "weibull_parameter_b.svg",
    "weibull_function": REPO_ROOT / "assets" / "formulas" / "RE3_TEST_1" / "weibull_function.svg",
    "weibull_example_value": REPO_ROOT / "assets" / "formulas" / "RE3_TEST_1" / "weibull_example_value.svg",
}


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def data_uri(path: Path, mime: str) -> str:
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


PLOT_URIS = {key: data_uri(path, "image/svg+xml") for key, path in PLOT_ASSETS.items()}
PICTOGRAM_URIS = {key: data_uri(path, "image/png") for key, path in PICTOGRAMS.items() if path.exists()}
FORMULA_URIS = {key: data_uri(path, "image/svg+xml") for key, path in FORMULA_ASSETS.items()}


STYLE = """
    .bg { fill: #f6f8f9; }
    .panel { fill: #ffffff; stroke: #cfe0e8; stroke-width: 2; }
    .soft { fill: #e8f6fb; stroke: #9bd5e7; stroke-width: 2; }
    .accent { fill: #fff6df; stroke: #f0c96b; stroke-width: 2; }
    .ink { fill: #062d46; }
    .muted { fill: #5d7080; }
    .text { font-family: Inter, "Segoe UI", Arial, sans-serif; fill: #062d46; }
    .caption { font-size: 22px; fill: #5d7080; }
    .kicker { font-size: 23px; font-weight: 760; fill: #0c8fc1; }
    .headline { font-size: 40px; font-weight: 820; }
    .subhead { font-size: 28px; font-weight: 760; }
    .body { font-size: 24px; fill: #5d7080; }
    .small { font-size: 20px; fill: #5d7080; }
    .formula { font-size: 38px; font-weight: 650; }
    .formula-small { font-size: 28px; font-weight: 650; }
    .axis { stroke: #062d46; stroke-width: 4; stroke-linecap: round; fill: none; }
    .thin-axis { stroke: #062d46; stroke-width: 3; stroke-linecap: round; fill: none; }
    .line { stroke: #062d46; stroke-width: 3; stroke-linecap: round; fill: none; }
    .blue { stroke: #0c8fc1; stroke-width: 5; stroke-linecap: round; fill: none; }
    .red { stroke: #e11931; stroke-width: 5; stroke-linecap: round; fill: none; }
    .green { stroke: #2c8f5b; stroke-width: 5; stroke-linecap: round; fill: none; }
    .dash { stroke-dasharray: 10 9; }
    .grid { stroke: #d7e6ed; stroke-width: 2; fill: none; }
    .plot-frame { fill: #ffffff; stroke: #d7e6ed; stroke-width: 2; }
"""


DEFS = f"""
  <defs>
    <style>
{STYLE}
    </style>
    <marker id="arrow-ink" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#062d46" />
    </marker>
    <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0c8fc1" />
    </marker>
    <g id="failure-cross">
      <line class="red" x1="-13" y1="-13" x2="13" y2="13" />
      <line class="red" x1="-13" y1="13" x2="13" y2="-13" />
    </g>
    <g id="censor-mark">
      <circle r="15" fill="#ffffff" stroke="#0c8fc1" stroke-width="4" />
      <path class="blue" d="M -7 0 L 7 0" />
    </g>
  </defs>
"""


def text_lines(x: int, y: int, lines: list[str], klass: str = "body", gap: int = 34, anchor: str = "start") -> str:
    return "\n".join(
        f'    <text class="text {klass}" x="{x}" y="{y + index * gap}" text-anchor="{anchor}">{esc(line)}</text>'
        for index, line in enumerate(lines)
    )


def header(slide: int, title: str, focus: str) -> str:
    return f"""
  <g id="slide_{slide:03d}_layer_01_context" data-anim-label="Kontext und Ziel">
    <text class="text kicker" x="120" y="100">RE3_TEST_1 · Folie {slide:02d} · neuer Workflow-Vergleich</text>
    <text class="text headline" x="120" y="152">{esc(title)}</text>
    <text class="text caption" x="120" y="194">{esc(focus)}</text>
  </g>
"""


def footer(slide: int, strategies: list[str]) -> str:
    joined = " · ".join(strategies)
    return f"""
  <g id="slide_{slide:03d}_layer_04_workflow_note" data-anim-label="Workflow-Notiz">
    <rect class="soft" x="120" y="958" width="1680" height="68" rx="8" />
    <text class="text small" x="152" y="1000">Neuer Workflow: {esc(joined)}</text>
  </g>
"""


def time_axis(x: int, y: int, width: int, crosses: list[int], censors: list[int] | None = None) -> str:
    censors = censors or []
    marks = [
        f'    <use href="#failure-cross" x="{x + offset}" y="{y}" />'
        for offset in crosses
    ] + [
        f'    <use href="#censor-mark" x="{x + offset}" y="{y}" />'
        for offset in censors
    ]
    return f"""
    <line class="axis" x1="{x}" y1="{y}" x2="{x + width}" y2="{y}" marker-end="url(#arrow-ink)" />
    <text class="text body" x="{x + width + 38}" y="{y + 8}">t</text>
{chr(10).join(marks)}
"""


def plot_image(key: str, x: int, y: int, width: int, height: int) -> str:
    asset_rel = PLOT_ASSETS[key].relative_to(REPO_ROOT).as_posix()
    return (
        f'    <image href="{PLOT_URIS[key]}" data-plot-asset="{asset_rel}" '
        f'x="{x}" y="{y}" width="{width}" height="{height}" preserveAspectRatio="xMidYMid meet" />'
    )


def icon_image(key: str, x: int, y: int, size: int) -> str:
    path = PICTOGRAMS[key]
    asset_rel = path.relative_to(REPO_ROOT).as_posix()
    return (
        f'    <image href="{PICTOGRAM_URIS[key]}" data-image-asset="{asset_rel}" '
        f'x="{x}" y="{y}" width="{size}" height="{size}" preserveAspectRatio="xMidYMid meet" />'
    )


def formula_image(key: str, x: int, y: int, width: int, height: int) -> str:
    asset_rel = FORMULA_ASSETS[key].relative_to(REPO_ROOT).as_posix()
    return (
        f'    <image href="{FORMULA_URIS[key]}" data-formula-asset="{asset_rel}" '
        f'x="{x}" y="{y}" width="{width}" height="{height}" preserveAspectRatio="xMidYMid meet" />'
    )


def formula_fraction(x: int, y: int) -> str:
    return formula_image("median_rank", x, y - 92, 420, 132)


def object_timeline(slide: int, censored: bool) -> str:
    censor_layer = ""
    legend_extra = ""
    if censored:
        censor_layer = """
      <use href="#censor-mark" x="1170" y="620" />
      <line class="blue dash" x1="1170" y1="480" x2="1170" y2="700" />
      <text class="text body" x="1220" y="628">zensiert: bis hierhin nicht ausgefallen</text>
"""
        legend_extra = """
      <use href="#censor-mark" x="1214" y="820" />
      <text class="text body" x="1254" y="828">zensierte Beobachtung</text>
"""
    return f"""
  <g id="slide_{slide:03d}_layer_02_main_visual" data-anim-label="Objekt-Zeit-Diagramm">
    <rect class="panel" x="190" y="300" width="1480" height="610" rx="8" />
    <text class="text subhead" x="250" y="370">Objekte über der Prüfzeit</text>
    <text class="text body" x="250" y="420">Jede Zeile ist ein Objekt; rote Kreuze sind beobachtete Ausfälle.</text>
    <line class="axis" x1="460" y1="720" x2="1390" y2="720" marker-end="url(#arrow-ink)" />
    <text class="text body" x="1426" y="728">t</text>
    <text class="text body" x="250" y="510">Objekt 1</text>
    <text class="text body" x="250" y="590">Objekt 2</text>
    <text class="text body" x="250" y="670">Objekt 3</text>
    <line class="thin-axis" x1="460" y1="500" x2="1360" y2="500" />
    <line class="thin-axis" x1="460" y1="580" x2="1360" y2="580" />
    <line class="thin-axis" x1="460" y1="660" x2="1360" y2="660" />
    <use href="#failure-cross" x="690" y="500" />
    <use href="#failure-cross" x="910" y="580" />
    <use href="#failure-cross" x="1050" y="660" />
{censor_layer}
    <rect class="soft" x="520" y="775" width="1000" height="88" rx="8" />
    <use href="#failure-cross" x="570" y="820" />
    <text class="text body" x="610" y="828">Ausfall beobachtet</text>
{legend_extra}
  </g>
"""


SLIDES = [
    {
        "slide": 1,
        "title": "Ausfalldaten sammeln",
        "focus": "Ausfallzeiten werden entlang der Lebensdauerachse sortiert.",
        "strategies": ["Timeline: SVG", "kein Plot", "Quelle: Folie 1"],
        "body": lambda s: f"""
  <g id="slide_{s:03d}_layer_02_main_visual" data-anim-label="Sortierte Ausfallzeiten">
    <rect class="panel" x="190" y="310" width="1480" height="430" rx="8" />
    <text class="text subhead" x="250" y="390">Sammeln der Ausfalldaten</text>
    <text class="text body" x="250" y="438">Ausfälle werden als Ereignisse auf der Lebensdauerachse sichtbar.</text>
{time_axis(330, 580, 1030, [90, 190, 330, 520, 730, 910])}
  </g>
  <g id="slide_{s:03d}_layer_03_didactic_note" data-anim-label="Didaktischer Hinweis">
    <rect class="accent" x="260" y="790" width="1360" height="104" rx="8" />
    <text class="text subhead" x="310" y="850">Startpunkt: reale Ausfallzeiten, noch ohne Wahrscheinlichkeitsrechnung</text>
  </g>
""",
    },
    {
        "slide": 2,
        "title": "Median-Rang einführen",
        "focus": "Ausfallzeiten bekommen geschätzte Ausfallwahrscheinlichkeiten.",
        "strategies": ["Formel: LaTeX-SVG", "Timeline: SVG", "Quelle: Folie 2"],
        "body": lambda s: f"""
  <g id="slide_{s:03d}_layer_02_main_visual" data-anim-label="Median-Rang-Formel">
    <rect class="panel" x="190" y="300" width="680" height="500" rx="8" />
    <text class="text subhead" x="250" y="370">Median-Rang-Verfahren</text>
{formula_fraction(250, 500)}
    <text class="text body" x="250" y="640">i = Rang der sortierten Ausfallzeit</text>
    <text class="text body" x="250" y="680">n = Anzahl der Ausfälle</text>
    <rect class="soft" x="980" y="300" width="690" height="500" rx="8" />
    <text class="text subhead" x="1040" y="370">Vom Zeitpunkt zum Wertepaar</text>
    <text class="text body" x="1040" y="440">tᵢ  →  F(tᵢ)</text>
    <text class="text body" x="1040" y="500">Aus jedem Ausfall entsteht ein Punkt.</text>
{time_axis(1040, 620, 450, [70, 150, 260, 390])}
  </g>
""",
    },
    {
        "slide": 3,
        "title": "Hilfslinien vorbereiten",
        "focus": "Berechnete F(tᵢ)-Werte werden im Diagramm verortet.",
        "strategies": ["Formelzeichen: SVG-Text", "Hilfslinien: SVG", "Quelle: Folie 3"],
        "body": lambda s: f"""
  <g id="slide_{s:03d}_layer_02_main_visual" data-anim-label="Hilfslinien">
    <rect class="plot-frame" x="250" y="270" width="1120" height="620" rx="8" />
    <line class="axis" x1="350" y1="790" x2="1250" y2="790" marker-end="url(#arrow-ink)" />
    <line class="axis" x1="350" y1="790" x2="350" y2="360" marker-end="url(#arrow-ink)" />
    <text class="text body" x="730" y="850">Lebensdauer t</text>
    <text class="text body" x="206" y="590" transform="rotate(-90 206 590)">Ausfallwahrscheinlichkeit F(t)</text>
    <path class="grid" d="M 350 690 H 1250 M 350 590 H 1250 M 350 490 H 1250 M 550 360 V 790 M 750 360 V 790 M 950 360 V 790" />
    <path class="blue dash" d="M 350 690 H 610 V 790" />
    <path class="blue dash" d="M 350 590 H 760 V 790" />
    <path class="blue dash" d="M 350 490 H 940 V 790" />
    <text class="text body" x="1420" y="430">Hilfslinien zeigen:</text>
    <text class="text body" x="1420" y="472">Wo liegt F(tᵢ)</text>
    <text class="text body" x="1420" y="514">zur Ausfallzeit tᵢ?</text>
  </g>
""",
    },
    {
        "slide": 4,
        "title": "Punkte ins Weibull-Papier",
        "focus": "Aus tᵢ und F(tᵢ) werden Datenpunkte im Wahrscheinlichkeitsnetz.",
        "strategies": ["Diagramm: Python-Plot", "Plot-Asset: Weibull-Kontext", "Quelle: Folie 4"],
        "body": lambda s: f"""
  <g id="slide_{s:03d}_layer_02_main_visual" data-anim-label="Weibull-Punkte">
    <rect class="plot-frame" x="210" y="250" width="1160" height="650" rx="8" />
{plot_image("context", 235, 278, 1110, 596)}
    <rect class="soft" x="1420" y="390" width="320" height="210" rx="8" />
    <text class="text subhead" x="1460" y="450">Wertepaare</text>
    <text class="text body" x="1460" y="505">tᵢ und F(tᵢ)</text>
    <text class="text body" x="1460" y="548">werden sichtbar.</text>
  </g>
""",
    },
    {
        "slide": 5,
        "title": "Ausgleichsgerade bestimmen",
        "focus": "Die Punktwolke wird durch einen Weibull-Fit beschrieben.",
        "strategies": ["Diagramm: Python-Plot", "Fit sichtbar im Plot", "Quelle: Folie 5"],
        "body": lambda s: f"""
  <g id="slide_{s:03d}_layer_02_main_visual" data-anim-label="Weibull-Fit">
    <rect class="plot-frame" x="210" y="250" width="1160" height="650" rx="8" />
{plot_image("context", 235, 278, 1110, 596)}
    <path class="blue" d="M 1390 590 C 1450 570, 1490 520, 1540 470" marker-end="url(#arrow-blue)" />
    <rect class="accent" x="1440" y="620" width="340" height="116" rx="8" />
    <text class="text subhead" x="1480" y="674">Ausgleichsgerade</text>
    <text class="text body" x="1480" y="714">bestimmt den Weibull-Fit</text>
  </g>
""",
    },
    {
        "slide": 6,
        "title": "Weibull-Parameter ablesen",
        "focus": "T wird bei 63,2 % abgelesen, b ergibt sich aus der Steigung.",
        "strategies": ["Diagramm: Python-Plot", "Parameter-Callouts", "Quelle: Folie 6"],
        "body": lambda s: f"""
  <g id="slide_{s:03d}_layer_02_main_visual" data-anim-label="Parameter T und b">
    <rect class="plot-frame" x="210" y="230" width="1160" height="650" rx="8" />
{plot_image("parameter", 235, 258, 1110, 596)}
    <rect class="accent" x="1410" y="360" width="340" height="120" rx="8" />
    <text class="text subhead" x="1450" y="412">T</text>
    <text class="text body" x="1490" y="412">bei 63,2 %</text>
    <text class="text small" x="1450" y="450">charakteristische Lebensdauer</text>
    <rect class="accent" x="1410" y="520" width="340" height="120" rx="8" />
    <text class="text subhead" x="1450" y="572">b</text>
    <text class="text body" x="1490" y="572">aus der Steigung</text>
    <text class="text small" x="1450" y="610">Formparameter</text>
  </g>
""",
    },
    {
        "slide": 7,
        "title": "Von Parametern zur Funktion",
        "focus": "T und b werden in die Weibull-Funktion eingesetzt.",
        "strategies": ["Diagramm: Python-Plot", "Formel: LaTeX-SVG", "Quelle: Folie 7"],
        "body": lambda s: f"""
  <g id="slide_{s:03d}_layer_02_main_visual" data-anim-label="Weibull-Funktion">
    <rect class="plot-frame" x="150" y="275" width="790" height="570" rx="8" />
{plot_image("context", 172, 302, 746, 510)}
    <rect class="soft" x="1010" y="285" width="720" height="250" rx="8" />
    <text class="text subhead" x="1060" y="350">Parameter einsetzen</text>
{formula_image("weibull_parameter_t", 1056, 388, 150, 56)}
{formula_image("weibull_parameter_b", 1240, 388, 150, 56)}
{formula_image("weibull_function", 1046, 452, 620, 82)}
    <rect class="accent" x="1010" y="600" width="720" height="150" rx="8" />
{formula_image("weibull_example_value", 1050, 620, 330, 64)}
    <text class="text body" x="1060" y="718">Beispielwert aus der Funktion</text>
  </g>
""",
    },
    {
        "slide": 8,
        "title": "Grafische Auswertung sichtbar halten",
        "focus": "Der Zwischenzustand zeigt den grafischen Kontext ohne Formelblock.",
        "strategies": ["Diagramm: Python-Plot", "Zwischenzustand", "Quelle: Folie 8"],
        "body": lambda s: f"""
  <g id="slide_{s:03d}_layer_02_main_visual" data-anim-label="Grafischer Kontext">
    <rect class="plot-frame" x="250" y="250" width="1160" height="650" rx="8" />
{plot_image("context", 275, 278, 1110, 596)}
    <rect class="soft" x="1420" y="440" width="320" height="150" rx="8" />
    <text class="text subhead" x="1460" y="500">Kontextfolie</text>
    <text class="text body" x="1460" y="542">Diagramm bleibt führend</text>
  </g>
""",
    },
    {
        "slide": 9,
        "title": "Ausfallmechanismen trennen",
        "focus": "Gemischte Ausfälle werden nach Mechanismus A und B getrennt betrachtet.",
        "strategies": ["Diagramm: Python-Plot", "Timeline: SVG", "Quelle: Folie 9"],
        "body": lambda s: f"""
  <g id="slide_{s:03d}_layer_02_main_visual" data-anim-label="Mechanismen A und B">
    <rect class="plot-frame" x="820" y="230" width="900" height="650" rx="8" />
{plot_image("mechanism", 845, 258, 850, 596)}
    <rect class="panel" x="170" y="300" width="560" height="360" rx="8" />
    <text class="text subhead" x="220" y="365">Gemischte Zeitreihe</text>
{time_axis(230, 480, 360, [48, 150, 288], [100, 230])}
    <text class="text body" x="220" y="585">Nach Ursache trennen,</text>
    <text class="text body" x="220" y="625">bevor ein Fit bewertet wird.</text>
  </g>
""",
    },
    {
        "slide": 10,
        "title": "Objekt-Zeit-Diagramm aufbauen",
        "focus": "Ausfallzeitpunkte werden den einzelnen Objekten zugeordnet.",
        "strategies": ["Timeline: SVG", "Objektachsen", "Quelle: Folie 10"],
        "body": lambda s: object_timeline(s, censored=False),
    },
    {
        "slide": 11,
        "title": "Zensierte Beobachtungen ergänzen",
        "focus": "Nicht ausgefallene Objekte werden als zensierte Beobachtungen sichtbar.",
        "strategies": ["Timeline: SVG", "Zensierung: SVG", "Quelle: Folie 11"],
        "body": lambda s: object_timeline(s, censored=True),
    },
    {
        "slide": 12,
        "title": "Methoden einordnen",
        "focus": "Grafische Methode und Berechnungsmethoden werden als zwei Wege dargestellt.",
        "strategies": ["Diagramm: Python-Plot", "Piktogramme: PNG", "Quelle: Folie 12"],
        "body": lambda s: f"""
  <g id="slide_{s:03d}_layer_02_main_visual" data-anim-label="Methodenauswahl">
    <rect class="plot-frame" x="130" y="260" width="710" height="430" rx="8" />
{plot_image("context", 150, 286, 670, 372)}
    <path class="blue" d="M 870 475 C 960 475, 1010 475, 1090 475" marker-end="url(#arrow-blue)" />
    <rect class="panel" x="1130" y="250" width="560" height="210" rx="8" />
{icon_image("graph", 1170, 298, 96)}
    <text class="text subhead" x="1300" y="330">Grafische Methode</text>
    <text class="text body" x="1300" y="375">Plausibilität im Diagramm</text>
    <rect class="panel" x="1130" y="560" width="560" height="230" rx="8" />
{icon_image("calculation", 1170, 610, 96)}
    <text class="text subhead" x="1300" y="642">Berechnungsmethoden</text>
    <text class="text body" x="1300" y="690">MLS und MLE</text>
    <text class="text small" x="1300" y="730">rechnerische Parameterschätzung</text>
  </g>
""",
    },
    {
        "slide": 13,
        "title": "Vertrauensgrenzen zeigen",
        "focus": "5 %- und 95 %-Grenzkurven machen die Unsicherheit der Schätzung sichtbar.",
        "strategies": ["Diagramm: Python-Plot", "Vertrauensgrenzen: Bootstrap", "Quelle: Folie 13"],
        "body": lambda s: f"""
  <g id="slide_{s:03d}_layer_02_main_visual" data-anim-label="Weibull-Vertrauensgrenzen">
    <rect class="plot-frame" x="160" y="220" width="1180" height="700" rx="8" />
{plot_image("confidence", 186, 248, 1128, 644)}
    <rect class="accent" x="1400" y="330" width="340" height="220" rx="8" />
    <text class="text subhead" x="1440" y="390">Vertrauensgrenzen</text>
    <text class="text body" x="1440" y="442">5 % und 95 %</text>
    <text class="text body" x="1440" y="484">als Kurven, nicht als</text>
    <text class="text body" x="1440" y="526">parallele Hilfslinien</text>
    <rect class="soft" x="1400" y="610" width="340" height="130" rx="8" />
    <text class="text body" x="1440" y="665">Plot kann Grenzen</text>
    <text class="text body" x="1440" y="705">nach 3 s einblenden.</text>
  </g>
""",
    },
]


OLD_SVG_BY_SLIDE = {
    1: "../../svg/RE3_TEST_1/g01_basic_weibull_workflow.svg",
    2: "../../svg/RE3_TEST_1/g01_basic_weibull_workflow.svg",
    3: "../../svg/RE3_TEST_1/g01_basic_weibull_workflow.svg",
    4: "../../svg/RE3_TEST_1/g01_basic_weibull_workflow.svg",
    5: "../../svg/RE3_TEST_1/g01_basic_weibull_workflow.svg",
    6: "../../svg/RE3_TEST_1/g01_basic_weibull_workflow.svg",
    7: "../../svg/RE3_TEST_1/g02_weibull_function_formula/g02_weibull_function_formula_007.svg",
    8: "../../svg/RE3_TEST_1/g02_weibull_function_formula/g02_weibull_function_formula_007.svg",
    9: "../../svg/RE3_TEST_1/g03_failure_mechanism_split/g03_failure_mechanism_split_009.svg",
    10: "../../svg/RE3_TEST_1/g04_censored_observations/g04_censored_observations_010.svg",
    11: "../../svg/RE3_TEST_1/g04_censored_observations/g04_censored_observations_010.svg",
    12: "../../svg/RE3_TEST_1/g05_method_selection/g05_method_selection_012.svg",
    13: "../../svg/RE3_TEST_1/g06_confidence_bounds/g06_confidence_bounds_013.svg",
}


def svg_document(slide: dict) -> str:
    slide_no = slide["slide"]
    body = slide["body"](slide_no)
    strategies = slide["strategies"]
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" role="img" aria-labelledby="title desc">
  <title id="title">RE3_TEST_1 new workflow comparison slide {slide_no:03d}</title>
  <desc id="desc">{esc(slide["focus"])}</desc>
  <metadata>
    module_id: RE3_TEST_1
    comparison_variant: new-layered-workflow
    source_slide: {slide_no}
    old_workflow_reference: rebuild-proposals/svg/RE3_TEST_1
    generated_by: tools/generate_re3_test_1_new_workflow_comparison.py
  </metadata>
{DEFS}
  <rect class="bg" width="1920" height="1080" />
{header(slide_no, slide["title"], slide["focus"])}
{body}
{footer(slide_no, strategies)}
</svg>
"""


def manifest(slide: dict) -> dict:
    slide_no = slide["slide"]
    return {
        "schemaVersion": "svgAnimationManifest/v1",
        "svgPath": f"slide_{slide_no:03d}.svg",
        "defaults": {"pauseMs": 1600, "enterFrames": 16, "drawFrames": 20},
        "targets": [
            {
                "targetId": f"slide_{slide_no:03d}_layer_01_context",
                "label": "Kontext und Ziel",
                "status": "animated",
            },
            {
                "targetId": f"slide_{slide_no:03d}_layer_02_main_visual",
                "label": "Hauptvisual",
                "status": "animated",
            },
            {
                "targetId": f"slide_{slide_no:03d}_layer_04_workflow_note",
                "label": "Workflow-Notiz",
                "status": "animated",
            },
        ],
        "steps": [
            {
                "stepId": f"slide_{slide_no:03d}_step_01",
                "targetId": f"slide_{slide_no:03d}_layer_01_context",
                "action": "show",
            },
            {
                "stepId": f"slide_{slide_no:03d}_step_02",
                "targetId": f"slide_{slide_no:03d}_layer_02_main_visual",
                "action": "show",
            },
            {
                "stepId": f"slide_{slide_no:03d}_step_03",
                "targetId": f"slide_{slide_no:03d}_layer_04_workflow_note",
                "action": "show",
            },
        ],
    }


def write_outputs() -> None:
    OUT_ROOT.mkdir(parents=True, exist_ok=True)
    for slide in SLIDES:
        slide_no = slide["slide"]
        slide_dir = OUT_ROOT / f"slide_{slide_no:03d}"
        slide_dir.mkdir(parents=True, exist_ok=True)
        (slide_dir / f"slide_{slide_no:03d}.svg").write_text(svg_document(slide), encoding="utf-8")
        (slide_dir / "scene.animation.v1.json").write_text(
            json.dumps(manifest(slide), indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )

    PLAN_PATH.parent.mkdir(parents=True, exist_ok=True)
    plan = {
        "schema": "workflowComparisonPlan/v1",
        "module_id": "RE3_TEST_1",
        "purpose": "Fresh per-slide SVG derivation using the layered workflow to compare against the existing master-sequence implementation.",
        "old_workflow_reference": "rebuild-proposals/svg/RE3_TEST_1",
        "new_workflow_output": OUT_ROOT.relative_to(REPO_ROOT).as_posix(),
        "slide_count": len(SLIDES),
        "strategy": [
            "13 individual SVGs for direct per-slide review",
            "true diagrams embedded from Python plot SVG assets",
            "non-trivial formulas embedded from LaTeX/Mathtext SVG assets",
            "simple formula labels built as native SVG text where sufficient",
            "existing PNG pictograms embedded as data URI where semantically required",
            "no visible PowerPoint title in SVG graphics",
        ],
        "slides": [
            {
                "slide": slide["slide"],
                "title": slide["title"],
                "focus": slide["focus"],
                "strategies": slide["strategies"],
                "svg": f"{OUT_ROOT.relative_to(REPO_ROOT).as_posix()}/slide_{slide['slide']:03d}/slide_{slide['slide']:03d}.svg",
                "manifest": f"{OUT_ROOT.relative_to(REPO_ROOT).as_posix()}/slide_{slide['slide']:03d}/scene.animation.v1.json",
            }
            for slide in SLIDES
        ],
    }
    PLAN_PATH.write_text(json.dumps(plan, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    rows = "\n".join(
        f"| {slide['slide']:02d} | {slide['title']} | {', '.join(slide['strategies'])} | `slide_{slide['slide']:03d}/slide_{slide['slide']:03d}.svg` |"
        for slide in SLIDES
    )
    report = f"""# RE3_TEST_1 New Workflow Comparison

Purpose: compare the existing grouped SVG implementation with a freshly derived per-slide variant from the layered workflow.

## References

- Existing workflow output: `rebuild-proposals/svg/RE3_TEST_1`
- New workflow output: `{OUT_ROOT.relative_to(REPO_ROOT).as_posix()}`
- Plan: `{PLAN_PATH.relative_to(REPO_ROOT).as_posix()}`

## Method

- One SVG per source slide for direct comparison.
- Real technical diagrams are embedded from Python plot SVG assets.
- Generic timelines and object-time axes are native SVG compositions.
- Non-trivial formulas are embedded from LaTeX/Mathtext SVG assets.
- Simple formula labels remain native SVG text where that is sufficient.
- The source PowerPoint title is omitted from the SVG graphics.

## Slide Outputs

| Slide | New workflow focus | Strategies | SVG |
|---|---|---|---|
{rows}

## Review Notes

This comparison set is intentionally separate from the accepted proposal folder, so no existing RE3_TEST_1 SVGs were overwritten.
"""
    REPORT_PATH.write_text(report, encoding="utf-8")

    cards = []
    for slide in SLIDES:
        slide_no = slide["slide"]
        source_png = f"../../../source-materials/basis-seminar/png/Modul_3_RE3_Test_1_PNG/Folie{slide_no}.PNG"
        old_svg = OLD_SVG_BY_SLIDE[slide_no]
        new_svg = f"new-workflow/slide_{slide_no:03d}/slide_{slide_no:03d}.svg"
        cards.append(
            f"""
      <section class="slide-row">
        <header>
          <span>Folie {slide_no:02d}</span>
          <strong>{esc(slide["title"])}</strong>
          <em>{esc(slide["focus"])}</em>
        </header>
        <div class="compare-grid">
          <figure>
            <figcaption>Quelle</figcaption>
            <img src="{source_png}" alt="Source slide {slide_no:02d}">
          </figure>
          <figure>
            <figcaption>Bisherige Umsetzung</figcaption>
            <img src="{old_svg}" alt="Old workflow SVG for slide {slide_no:02d}">
          </figure>
          <figure>
            <figcaption>Neue Workflow-Variante</figcaption>
            <img src="{new_svg}" alt="New workflow SVG for slide {slide_no:02d}">
          </figure>
        </div>
      </section>
"""
        )
    html_doc = f"""<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>RE3_TEST_1 Workflow-Vergleich</title>
  <style>
    body {{
      margin: 0;
      font-family: Inter, "Segoe UI", Arial, sans-serif;
      color: #062d46;
      background: #f6f8f9;
    }}
    main {{
      max-width: 1680px;
      margin: 0 auto;
      padding: 34px 28px 60px;
    }}
    h1 {{
      margin: 0 0 8px;
      font-size: 32px;
    }}
    .lead {{
      margin: 0 0 26px;
      color: #5d7080;
      font-size: 16px;
    }}
    .slide-row {{
      background: white;
      border: 1px solid #cfe0e8;
      border-radius: 8px;
      margin: 0 0 24px;
      overflow: hidden;
    }}
    .slide-row header {{
      display: grid;
      grid-template-columns: 90px 280px 1fr;
      gap: 18px;
      align-items: center;
      padding: 18px 22px;
      border-bottom: 1px solid #d7e6ed;
      background: #e8f6fb;
    }}
    .slide-row span {{
      font-weight: 800;
      color: #0c8fc1;
    }}
    .slide-row strong {{
      font-size: 18px;
    }}
    .slide-row em {{
      color: #5d7080;
      font-style: normal;
    }}
    .compare-grid {{
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      padding: 16px;
    }}
    figure {{
      margin: 0;
      border: 1px solid #d7e6ed;
      border-radius: 6px;
      background: #fbfdfe;
      overflow: hidden;
    }}
    figcaption {{
      padding: 10px 12px;
      font-weight: 760;
      color: #062d46;
      border-bottom: 1px solid #d7e6ed;
    }}
    img {{
      display: block;
      width: 100%;
      aspect-ratio: 16 / 9;
      object-fit: contain;
      background: #f7fafc;
    }}
  </style>
</head>
<body>
  <main>
    <h1>RE3_TEST_1: Workflow-Vergleich</h1>
    <p class="lead">Quelle, bisherige gruppierte Umsetzung und neue per-Folie abgeleitete Workflow-Variante.</p>
    {"".join(cards)}
  </main>
</body>
</html>
"""
    INDEX_PATH.write_text(html_doc, encoding="utf-8")

    print(OUT_ROOT)


if __name__ == "__main__":
    write_outputs()
