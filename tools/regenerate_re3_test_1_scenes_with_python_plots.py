#!/usr/bin/env python3
"""Regenerate the implemented RE3_TEST_1 SVG scenes with Python plot assets."""

import base64
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
SCENE_ROOT = REPO_ROOT / "rebuild-proposals" / "svg" / "RE3_TEST_1"


BASE_STYLE = """
    .bg { fill: #f7fafc; }
    .panel { fill: #ffffff; stroke: #cfe0e8; stroke-width: 2; }
    .soft { fill: #e8f6fb; stroke: #9bd5e7; stroke-width: 2; }
    .accent-panel { fill: #fff6df; stroke: #f0c96b; stroke-width: 2; }
    .ink { fill: #062d46; }
    .muted { fill: #5d7080; }
    .blue-fill { fill: #0c8fc1; }
    .red-fill { fill: #e11931; }
    .green-fill { fill: #2c8f5b; }
    .text { font-family: Inter, "Segoe UI", Arial, sans-serif; fill: #062d46; }
    .headline { font-size: 34px; font-weight: 800; }
    .subhead { font-size: 24px; fill: #5d7080; }
    .label { font-size: 24px; fill: #5d7080; }
    .small { font-size: 21px; fill: #5d7080; }
    .tiny { font-size: 18px; fill: #5d7080; }
    .step-no { font-size: 24px; font-weight: 800; fill: #0c8fc1; }
    .step-title { font-size: 25px; font-weight: 780; }
    .formula { font-size: 32px; font-weight: 650; }
    .formula-small { font-size: 22px; fill: #5d7080; }
    .pill-text { font-size: 21px; font-weight: 760; fill: #062d46; }
    .axis { stroke: #062d46; stroke-width: 4; stroke-linecap: round; fill: none; }
    .thin-axis { stroke: #062d46; stroke-width: 3; stroke-linecap: round; fill: none; }
    .line { stroke: #062d46; stroke-width: 3; stroke-linecap: round; fill: none; }
    .blue-line { stroke: #0c8fc1; stroke-width: 5; stroke-linecap: round; fill: none; }
    .red-line { stroke: #e11931; stroke-width: 5; stroke-linecap: round; fill: none; }
    .green-line { stroke: #2c8f5b; stroke-width: 5; stroke-linecap: round; fill: none; }
    .dash { stroke-dasharray: 10 9; }
    .arrow { stroke: #0c8fc1; stroke-width: 5; stroke-linecap: round; fill: none; }
    .plot-frame { fill: #ffffff; stroke: #d7e6ed; stroke-width: 2; }
"""


DEFS = f"""
  <defs>
    <style>
{BASE_STYLE}
    </style>
    <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0c8fc1" />
    </marker>
    <marker id="arrow-ink" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#062d46" />
    </marker>
    <g id="failure-cross">
      <line class="red-line" x1="-13" y1="-13" x2="13" y2="13" />
      <line class="red-line" x1="-13" y1="13" x2="13" y2="-13" />
    </g>
    <g id="censor-mark">
      <circle r="15" fill="#ffffff" stroke="#0c8fc1" stroke-width="4" />
      <path class="blue-line" d="M -7 0 L 7 0" />
    </g>
  </defs>
"""


def write_svg(path: Path, title: str, desc: str, metadata: str, body: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" role="img" aria-labelledby="title desc">
  <title id="title">{title}</title>
  <desc id="desc">{desc}</desc>
  <metadata>
{metadata}
    rebuilt_with: tools/regenerate_re3_test_1_scenes_with_python_plots.py
    diagram_workflow: python_plot_asset_first
  </metadata>
{DEFS}
  <rect class="bg" width="1920" height="1080" />
{body}
</svg>
"""
    path.write_text(svg, encoding="utf-8")


def plot_image(asset_rel: str, x: int, y: int, width: int, height: int) -> str:
    asset_path = REPO_ROOT / asset_rel
    encoded = base64.b64encode(asset_path.read_bytes()).decode("ascii")
    return (
        f'<image href="data:image/svg+xml;base64,{encoded}" '
        f'data-plot-asset="{asset_rel}" x="{x}" y="{y}" width="{width}" height="{height}" '
        'preserveAspectRatio="xMidYMid meet" />'
    )


def time_axis(x: int, y: int, width: int, crosses: list[int], label: str = "t") -> str:
    marks = [
        f'      <use href="#failure-cross" x="{x + offset}" y="{y}" />'
        for offset in crosses
    ]
    return f"""
    <line class="axis" x1="{x}" y1="{y}" x2="{x + width}" y2="{y}" marker-end="url(#arrow-ink)" />
    <text class="text label" x="{x + width + 34}" y="{y + 9}">{label}</text>
{chr(10).join(marks)}
"""


def workflow_step(number: int, x: int, y: int, title: str, subtitle: str = "") -> str:
    subtitle_node = f'<text class="text small" x="{x + 66}" y="{y + 36}">{subtitle}</text>' if subtitle else ""
    return f"""
    <circle cx="{x + 24}" cy="{y}" r="25" fill="none" stroke="#0c8fc1" stroke-width="4" />
    <text class="text step-no" x="{x + 17}" y="{y + 8}">{number}</text>
    <text class="text step-title" x="{x + 66}" y="{y + 8}">{title}</text>
    {subtitle_node}
"""


def g01() -> None:
    body = f"""
  <g id="g01_layer_01_failure_times" data-anim-label="Ausfallzeiten sammeln und sortieren">
    {workflow_step(0, 92, 126, "Ausfalldaten sortieren", "unterschiedliche Lebensdauerwerte")}
    <rect class="panel" x="96" y="190" width="530" height="132" rx="8" />
    <text class="text label" x="130" y="232">Beobachtete Ausfallzeiten</text>
    {time_axis(150, 278, 390, [38, 86, 145, 216, 292, 350])}
  </g>

  <g id="g01_layer_02_median_rank" data-anim-label="Ausfallwahrscheinlichkeiten berechnen">
    {workflow_step(1, 92, 392, "Median-Rang berechnen", "F(t_i) je Ausfallzeit")}
    <rect class="soft" x="96" y="456" width="530" height="154" rx="8" />
    <text class="text formula-small" x="130" y="498">Median-Rang-N&#228;herung</text>
    <text class="text formula" x="130" y="558">F(t_i) =</text>
    <text class="text formula" x="300" y="536">i - 0,3</text>
    <line x1="286" y1="556" x2="448" y2="556" stroke="#062d46" stroke-width="3" />
    <text class="text formula" x="304" y="600">n + 0,4</text>
  </g>

  <g id="g01_layer_03_point_pairs" data-anim-label="Wertepaare bilden">
    {workflow_step(2, 92, 682, "Wertepaare bilden", "t_i und F(t_i)")}
    <rect class="panel" x="96" y="746" width="530" height="168" rx="8" />
    <text class="text pill-text" x="132" y="790">t_i</text>
    <text class="text pill-text" x="302" y="790">12</text>
    <text class="text pill-text" x="382" y="790">18</text>
    <text class="text pill-text" x="462" y="790">27</text>
    <line x1="126" y1="812" x2="580" y2="812" stroke="#d7e6ed" stroke-width="2" />
    <text class="text pill-text" x="132" y="852">F(t_i)</text>
    <text class="text pill-text" x="302" y="852">10 %</text>
    <text class="text pill-text" x="382" y="852">22 %</text>
    <text class="text pill-text" x="462" y="852">36 %</text>
  </g>

  <g id="g01_layer_04_plot_frame" data-anim-label="Weibull-Wahrscheinlichkeits-Papier zeigen">
    <rect class="plot-frame" x="720" y="108" width="1068" height="744" rx="8" />
    {plot_image("assets/plots/RE3_TEST_1/weibull_parameter_plot.svg", 746, 132, 1016, 696)}
    <text class="text tiny" x="746" y="890">Python-Plot-Asset: Weibull-Wahrscheinlichkeitspapier mit T und b</text>
  </g>

  <g id="g01_layer_05_failure_points" data-anim-label="Punkte eintragen">
    <path class="arrow" d="M 622 828 C 670 812, 690 750, 735 690" marker-end="url(#arrow-blue)" />
    <rect class="soft" x="1220" y="858" width="316" height="82" rx="8" />
    <text class="text pill-text" x="1250" y="908">Ausfalldaten als Punkte</text>
  </g>

  <g id="g01_layer_06_regression_line" data-anim-label="Ausgleichsgerade festlegen">
    <rect class="panel" x="1488" y="858" width="300" height="82" rx="8" />
    <line class="blue-line" x1="1518" y1="900" x2="1608" y2="900" />
    <text class="text pill-text" x="1628" y="908">Weibull-Fit</text>
  </g>

  <g id="g01_layer_07_parameter_T" data-anim-label="T bei 63,2 Prozent ablesen">
    <rect class="accent-panel" x="720" y="892" width="214" height="84" rx="8" />
    <text class="text pill-text" x="752" y="925">T</text>
    <text class="text small" x="790" y="925">bei 63,2 %</text>
    <text class="text tiny" x="752" y="954">charakteristische Lebensdauer</text>
  </g>

  <g id="g01_layer_08_parameter_b" data-anim-label="b aus der Steigung bestimmen">
    <rect class="accent-panel" x="958" y="892" width="214" height="84" rx="8" />
    <text class="text pill-text" x="990" y="925">b</text>
    <text class="text small" x="1028" y="925">aus Steigung</text>
    <text class="text tiny" x="990" y="954">Formparameter</text>
  </g>

  <g id="g01_layer_09_result" data-anim-label="Parameter als Ergebnis sichern">
    <rect class="soft" x="1210" y="892" width="578" height="84" rx="8" />
    <text class="text pill-text" x="1244" y="925">Ergebnis der grafischen Auswertung</text>
    <text class="text small" x="1244" y="956">Parameter T und b beschreiben die Weibull-Verteilung.</text>
  </g>
"""
    write_svg(
        SCENE_ROOT / "g01_basic_weibull_workflow.svg",
        "Basic seminar Weibull workflow graphic",
        "Regenerated master SVG for RE3_TEST_1 slides 1-6 with a Python-generated Weibull plot asset.",
        "    source_plan: analysis/rebuild-plans/RE3_TEST_1_g01_scene_plan.md\n    source_slides: 1-6\n    visible_powerpoint_title: omitted",
        body,
    )


def g02() -> None:
    body = f"""
  <g id="g02_layer_01_failure_times" data-anim-label="Sortierte Ausfallzeiten als Eingang">
    <rect class="panel" x="110" y="128" width="462" height="188" rx="8" />
    <text class="text headline" x="146" y="184">Ausfalldaten</text>
    <text class="text small" x="146" y="222">sortieren und in F(t_i) umrechnen</text>
    {time_axis(154, 270, 322, [28, 67, 118, 178, 246, 292])}
  </g>

  <g id="g02_layer_02_plot" data-anim-label="Weibull-Gerade als grafische Auswertung">
    <rect class="plot-frame" x="112" y="380" width="786" height="552" rx="8" />
    {plot_image("assets/plots/RE3_TEST_1/weibull_probability_context.svg", 132, 402, 746, 508)}
  </g>

  <g id="g02_layer_03_transfer" data-anim-label="Transfer von Grafik zu Parametern">
    <path class="arrow" d="M 930 650 C 1014 640, 1074 606, 1138 552" marker-end="url(#arrow-blue)" />
    <rect class="soft" x="1014" y="676" width="330" height="94" rx="8" />
    <text class="text pill-text" x="1048" y="716">Aus Grafik werden</text>
    <text class="text small" x="1048" y="748">Parameter f&#252;r die Funktion.</text>
  </g>

  <g id="g02_layer_04_parameters" data-anim-label="T und b als Parameter einsetzen">
    <rect class="panel" x="1228" y="134" width="546" height="202" rx="8" />
    <text class="text headline" x="1264" y="190">Parameter</text>
    <text class="text formula" x="1264" y="252">T = 62,5</text>
    <text class="text formula" x="1498" y="252">b = 1,38</text>
    <text class="text small" x="1264" y="298">aus Weibull-Papier oder Regressionsrechnung</text>
  </g>

  <g id="g02_layer_05_function" data-anim-label="Weibull-Funktion aufstellen">
    <rect class="soft" x="1112" y="400" width="662" height="230" rx="8" />
    <text class="text headline" x="1152" y="456">Weibull-Funktion</text>
    <text class="text formula" x="1152" y="536">F(t) = 1 - exp[-(t/T)^b]</text>
    <text class="text small" x="1152" y="586">T skaliert die Lebensdauer, b beschreibt die Steigung.</text>
  </g>

  <g id="g02_layer_06_example" data-anim-label="Beispielwert F(10) berechnen">
    <rect class="accent-panel" x="1112" y="700" width="662" height="166" rx="8" />
    <image href="../../../../assets/scenes/RE3_TEST_1/pictograms/tool-transform-screwdriver-wrench.png" x="1142" y="730" width="96" height="96" preserveAspectRatio="xMidYMid meet" />
    <text class="text headline" x="1260" y="760">Beispiel</text>
    <text class="text formula-small" x="1260" y="810">F(10) = 1 - exp[-(10 / 62,5)^1,38]</text>
    <text class="text small" x="1260" y="846">Damit wird aus einem Zeitpunkt eine Ausfallwahrscheinlichkeit.</text>
  </g>
"""
    write_svg(
        SCENE_ROOT / "g02_weibull_function_formula" / "g02_weibull_function_formula_007.svg",
        "Weibull function from graphical parameters",
        "Regenerated SVG for RE3_TEST_1 slide 7 using a Python-generated Weibull probability plot.",
        "    source_plan: analysis/rebuild-plans/RE3_TEST_1_g02_scene_plan.md\n    source_slides: 7\n    visible_powerpoint_title: omitted",
        body,
    )


def g03() -> None:
    body = f"""
  <g id="g03_layer_01_mixed_timeline" data-anim-label="Gemischte Ausfallzeiten erkennen">
    <rect class="panel" x="102" y="116" width="620" height="222" rx="8" />
    <text class="text headline" x="140" y="174">Gemischte Ausfallursachen</text>
    <text class="text small" x="140" y="212">Eine Zeitreihe kann mehrere Mechanismen enthalten.</text>
    <line class="axis" x1="152" y1="282" x2="618" y2="282" marker-end="url(#arrow-ink)" />
    <text class="text label" x="648" y="290">t</text>
    <use href="#failure-cross" x="204" y="282" />
    <circle cx="278" cy="282" r="15" fill="#ffffff" stroke="#0c8fc1" stroke-width="4" />
    <use href="#failure-cross" x="350" y="282" />
    <circle cx="436" cy="282" r="15" fill="#ffffff" stroke="#0c8fc1" stroke-width="4" />
    <use href="#failure-cross" x="526" y="282" />
  </g>

  <g id="g03_layer_02_two_trends" data-anim-label="Zwei Trends im Weibull-Papier">
    <rect class="plot-frame" x="800" y="112" width="922" height="628" rx="8" />
    {plot_image("assets/plots/RE3_TEST_1/weibull_mechanism_split_plot.svg", 822, 136, 878, 580)}
  </g>

  <g id="g03_layer_03_split_arrow" data-anim-label="Nach Ursache trennen">
    <path class="arrow" d="M 708 282 C 742 332, 756 394, 780 468" marker-end="url(#arrow-blue)" />
    <rect class="soft" x="500" y="414" width="264" height="94" rx="8" />
    <text class="text pill-text" x="532" y="454">nach Ursache</text>
    <text class="text small" x="532" y="486">getrennt auswerten</text>
  </g>

  <g id="g03_layer_04_separated_timelines" data-anim-label="Getrennte Zeitachsen fuer A und B">
    <rect class="panel" x="102" y="586" width="620" height="246" rx="8" />
    <text class="text headline" x="140" y="644">Getrennte Stichproben</text>
    <text class="text label" x="142" y="714">Mechanismus A</text>
    <line class="thin-axis" x1="334" y1="706" x2="630" y2="706" marker-end="url(#arrow-ink)" />
    <use href="#failure-cross" x="382" y="706" />
    <use href="#failure-cross" x="454" y="706" />
    <use href="#failure-cross" x="558" y="706" />
    <text class="text label" x="142" y="784">Mechanismus B</text>
    <line class="thin-axis" x1="334" y1="776" x2="630" y2="776" marker-end="url(#arrow-ink)" />
    <circle cx="404" cy="776" r="15" fill="#ffffff" stroke="#0c8fc1" stroke-width="4" />
    <circle cx="508" cy="776" r="15" fill="#ffffff" stroke="#0c8fc1" stroke-width="4" />
    <circle cx="590" cy="776" r="15" fill="#ffffff" stroke="#0c8fc1" stroke-width="4" />
  </g>

  <g id="g03_layer_05_caution" data-anim-label="Hinweis zur getrennten Auswertung">
    <rect class="accent-panel" x="802" y="790" width="920" height="116" rx="8" />
    <text class="text headline" x="842" y="842">Wichtig f&#252;r die Auswertung</text>
    <text class="text small" x="842" y="880">Ein gemeinsamer Fit kann scheinbar plausibel sein, aber die Mechanismen fachlich vermischen.</text>
  </g>
"""
    write_svg(
        SCENE_ROOT / "g03_failure_mechanism_split" / "g03_failure_mechanism_split_009.svg",
        "Failure mechanisms separated in Weibull analysis",
        "Regenerated SVG for RE3_TEST_1 slide 9 using a Python plot for the two mechanism Weibull diagram.",
        "    source_plan: analysis/rebuild-plans/RE3_TEST_1_g03_scene_plan.md\n    source_slides: 9\n    visible_powerpoint_title: omitted",
        body,
    )


def g04() -> None:
    body = f"""
  <g id="g04_layer_01_time_axis" data-anim-label="Ausfallzeiten und Beobachtungsende">
    <rect class="panel" x="104" y="118" width="742" height="172" rx="8" />
    <text class="text headline" x="144" y="176">Beobachtung endet vor jedem Ausfall?</text>
    <text class="text small" x="144" y="214">Dann entstehen zensierte Beobachtungen.</text>
    <line class="axis" x1="144" y1="258" x2="690" y2="258" marker-end="url(#arrow-ink)" />
    <line class="red-line dash" x1="584" y1="224" x2="584" y2="292" />
    <text class="text tiny" x="604" y="236">Beobachtungsende</text>
    <use href="#failure-cross" x="232" y="258" />
    <use href="#failure-cross" x="352" y="258" />
    <use href="#censor-mark" x="520" y="258" />
  </g>

  <g id="g04_layer_02_weibull_context" data-anim-label="Weibull-Kontext bleibt sichtbar">
    <rect class="plot-frame" x="1012" y="112" width="760" height="540" rx="8" />
    {plot_image("assets/plots/RE3_TEST_1/weibull_probability_context.svg", 1032, 136, 720, 492)}
  </g>

  <g id="g04_layer_03_object_frame" data-anim-label="Objekte einzeln betrachten">
    <rect class="panel" x="104" y="388" width="742" height="370" rx="8" />
    <text class="text headline" x="144" y="446">Objekte einzeln betrachten</text>
    <text class="text small" x="144" y="480">Nicht jedes Objekt hat bis zum Stichtag versagt.</text>
    <text class="text label" x="144" y="554">Objekt 1</text>
    <text class="text label" x="144" y="624">Objekt 2</text>
    <text class="text label" x="144" y="694">Objekt 3</text>
    <line class="thin-axis" x1="292" y1="546" x2="752" y2="546" />
    <line class="thin-axis" x1="292" y1="616" x2="752" y2="616" />
    <line class="thin-axis" x1="292" y1="686" x2="752" y2="686" />
    <line class="red-line dash" x1="658" y1="516" x2="658" y2="714" />
  </g>

  <g id="g04_layer_04_failures" data-anim-label="Ausfaelle als rote Kreuze">
    <use href="#failure-cross" x="418" y="546" />
    <use href="#failure-cross" x="548" y="616" />
  </g>

  <g id="g04_layer_05_censored" data-anim-label="Zensierte Beobachtungen ergaenzen">
    <use href="#censor-mark" x="658" y="686" />
    <path class="arrow" d="M 720 688 C 796 706, 884 722, 980 742" marker-end="url(#arrow-blue)" />
    <rect class="soft" x="1012" y="702" width="760" height="96" rx="8" />
    <text class="text headline" x="1052" y="752">Zensiert hei&#223;t: bis hierhin nicht ausgefallen</text>
  </g>

  <g id="g04_layer_06_legend" data-anim-label="Legende zu Ausfall und Zensierung">
    <rect class="panel" x="1012" y="838" width="760" height="104" rx="8" />
    <use href="#failure-cross" x="1062" y="890" />
    <text class="text label" x="1098" y="898">Ausfall beobachtet</text>
    <use href="#censor-mark" x="1372" y="890" />
    <text class="text label" x="1410" y="898">rechtszensierte Beobachtung</text>
  </g>
"""
    write_svg(
        SCENE_ROOT / "g04_censored_observations" / "g04_censored_observations_010.svg",
        "Censored observations in reliability testing",
        "Regenerated SVG for RE3_TEST_1 slide 10 with a Python plot as Weibull context and hand-built observation timelines.",
        "    source_plan: analysis/rebuild-plans/RE3_TEST_1_g04_scene_plan.md\n    source_slides: 10\n    visible_powerpoint_title: omitted",
        body,
    )


def g05() -> None:
    body = f"""
  <g id="g05_layer_01_context" data-anim-label="Daten und Weibull-Diagramm als Kontext">
    <rect class="panel" x="102" y="114" width="722" height="472" rx="8" />
    <text class="text headline" x="142" y="172">Aus Daten wird eine Auswertemethode</text>
    <text class="text small" x="142" y="208">Der Python-Plot liefert den grafischen Kontext.</text>
    {plot_image("assets/plots/RE3_TEST_1/weibull_probability_context.svg", 142, 238, 642, 318)}
  </g>

  <g id="g05_layer_02_transition" data-anim-label="Auswertung fuehrt zur Methodenwahl">
    <path class="arrow" d="M 842 354 C 930 354, 1004 354, 1084 354" marker-end="url(#arrow-blue)" />
    <rect class="soft" x="888" y="404" width="250" height="94" rx="8" />
    <text class="text pill-text" x="922" y="444">Methodenwahl</text>
    <text class="text small" x="922" y="476">abh&#228;ngig von Datenlage</text>
  </g>

  <g id="g05_layer_03_graphical" data-anim-label="Grafische Methode">
    <rect class="panel" x="1212" y="122" width="500" height="270" rx="8" />
    <image href="../../../../assets/scenes/RE3_TEST_1/pictograms/method-graph.png" x="1248" y="170" width="112" height="112" preserveAspectRatio="xMidYMid meet" />
    <text class="text headline" x="1392" y="204">Grafische Methode</text>
    <text class="text small" x="1392" y="244">Weibull-Papier, Fit und</text>
    <text class="text small" x="1392" y="276">sichtbare Plausibilit&#228;t</text>
  </g>

  <g id="g05_layer_04_calculation" data-anim-label="Berechnungs-Methoden">
    <rect class="panel" x="1212" y="512" width="500" height="270" rx="8" />
    <image href="../../../../assets/scenes/RE3_TEST_1/pictograms/method-calculation-pictogram.png" x="1248" y="560" width="112" height="112" preserveAspectRatio="xMidYMid meet" />
    <text class="text headline" x="1392" y="594">Berechnung</text>
    <text class="text small" x="1392" y="634">Parameter werden rechnerisch</text>
    <text class="text small" x="1392" y="666">aus den Daten bestimmt.</text>
  </g>

  <g id="g05_layer_05_submethods" data-anim-label="MLS und MLE">
    <rect class="accent-panel" x="102" y="702" width="722" height="154" rx="8" />
    <text class="text headline" x="142" y="758">Typische Rechenwege</text>
    <rect class="soft" x="142" y="790" width="230" height="48" rx="8" />
    <text class="text pill-text" x="184" y="822">MLS</text>
    <text class="text small" x="394" y="822">Methode der kleinsten Quadrate</text>
    <rect class="soft" x="142" y="858" width="230" height="48" rx="8" />
    <text class="text pill-text" x="184" y="890">MLE</text>
    <text class="text small" x="394" y="890">Maximum-Likelihood-Sch&#228;tzung</text>
  </g>
"""
    write_svg(
        SCENE_ROOT / "g05_method_selection" / "g05_method_selection_012.svg",
        "Selection of graphical and calculation methods",
        "Regenerated SVG for RE3_TEST_1 slide 12 using a Python-generated plot as the diagram context.",
        "    source_plan: analysis/rebuild-plans/RE3_TEST_1_g05_scene_plan.md\n    source_slides: 12\n    visible_powerpoint_title: omitted",
        body,
    )


def g06() -> None:
    body = f"""
  <g id="g06_layer_01_context" data-anim-label="Ausfalldaten als Ausgangspunkt">
    <rect class="panel" x="112" y="124" width="560" height="188" rx="8" />
    <text class="text headline" x="150" y="182">Sch&#228;tzung mit Unsicherheit</text>
    <text class="text small" x="150" y="220">Die beste Linie ist nicht die einzige plausible Linie.</text>
    {time_axis(152, 272, 390, [34, 82, 142, 214, 292, 350])}
  </g>

  <g id="g06_layer_02_plot_frame" data-anim-label="Weibull-Diagramm vorbereiten">
    <rect class="plot-frame" x="738" y="102" width="1054" height="744" rx="8" />
    {plot_image("assets/plots/RE3_TEST_1/weibull_confidence_bounds_animated.svg", 764, 126, 1002, 696)}
    <text class="text tiny" x="764" y="884">Python-Plot-SVG mit zeitgesteuertem Einblenden der 5 %- und 95 %-Vertrauensgrenzen nach 3 Sekunden.</text>
  </g>

  <g id="g06_layer_03_estimate" data-anim-label="Rote Schaetzlinie">
    <rect class="soft" x="112" y="398" width="560" height="126" rx="8" />
    <line class="blue-line" x1="154" y1="458" x2="246" y2="458" />
    <text class="text headline" x="276" y="454">Weibull-Fit</text>
    <text class="text small" x="276" y="490">zentrale Sch&#228;tzung aus den Ausfalldaten</text>
  </g>

  <g id="g06_layer_04_bounds" data-anim-label="Vertrauensbereich ergaenzen">
    <rect class="accent-panel" x="112" y="580" width="560" height="152" rx="8" />
    <path class="line dash" d="M 154 632 L 246 632" />
    <path class="line dash" d="M 154 680 L 246 680" />
    <text class="text headline" x="276" y="640">Vertrauensgrenzen</text>
    <text class="text small" x="276" y="678">werden im Plot-Asset zeitgesteuert sichtbar</text>
    <text class="text tiny" x="276" y="708">Trigger: 3 Sekunden</text>
  </g>

  <g id="g06_layer_05_labels" data-anim-label="5 und 95 Prozent Vertrauensgrenzen benennen">
    <rect class="panel" x="112" y="788" width="560" height="126" rx="8" />
    <text class="text headline" x="150" y="840">Typische Grenzen</text>
    <text class="text small" x="150" y="878">5 %-Vertrauensgrenze und 95 %-Vertrauensgrenze</text>
  </g>

  <g id="g06_layer_06_note" data-anim-label="Einordnung fuer Lernende">
    <rect class="soft" x="738" y="890" width="1054" height="92" rx="8" />
    <text class="text headline" x="778" y="944">Die Grenzen sind Kurven aus der Unsicherheit der Sch&#228;tzung, keine parallelen Hilfslinien.</text>
  </g>
"""
    write_svg(
        SCENE_ROOT / "g06_confidence_bounds" / "g06_confidence_bounds_013.svg",
        "Confidence bounds in the Weibull diagram",
        "Regenerated SVG for RE3_TEST_1 slide 13 using the animated Python confidence-bound plot asset.",
        "    source_plan: analysis/rebuild-plans/RE3_TEST_1_g06_scene_plan.md\n    source_slides: 13\n    visible_powerpoint_title: omitted",
        body,
    )


def main() -> None:
    g01()
    g02()
    g03()
    g04()
    g05()
    g06()
    print("Regenerated RE3_TEST_1 SVG scenes with Python plot assets.")


if __name__ == "__main__":
    main()
