"use strict";

const fs = require("node:fs");
const path = require("node:path");
const theme = require("./reltest-education-theme");
const { SCENES } = require("./re3-redesign-spec");

const root = path.resolve(__dirname, "..");
const outRoot = path.join(root, "rebuild-proposals", "svg", "RE3");
const sourceAssetRoot = path.join(root, "analysis", "source-assets", "RE3");
const textMap = JSON.parse(fs.readFileSync(path.join(root, "analysis", "inventories", "RE3_svg-text-map.json"), "utf8"));
const C = theme.colors;

const PLOTS = {
  parameter: path.join(root, "assets", "plots", "RE3_TEST_1", "weibull_parameter_plot.svg"),
  probability: path.join(root, "assets", "plots", "RE3_TEST_1", "weibull_probability_context.svg"),
  mechanisms: path.join(root, "assets", "plots", "RE3_TEST_1", "weibull_mechanism_split_plot.svg"),
  confidence: path.join(root, "assets", "plots", "RE3_TEST_1", "weibull_confidence_bounds_animated.svg"),
  failures: path.join(root, "assets", "plots", "RE3_TEST_1", "object_time_failures_slide_010.svg"),
  censored: path.join(root, "assets", "plots", "RE3_TEST_1", "object_time_censored_slide_011.svg"),
  shift: path.join(root, "rebuild-proposals", "svg", "RE1", "slide_063", "plots", "weibull_shift.svg"),
  surface: path.join(root, "analysis", "re3-assets", "plots", "failure_probability_surface.svg"),
};

const MEDIA = {
  life_data_sources: [[33, "img4.jpg", "lifecycle-data.jpg"]],
  mls_mle: [[43, "img4.png", "mls-mle-source.png"]],
  exercise_bike_solution: [[45, "img3.png", "median-rank-formula.png"], [46, "img3.png", "gear-fit.png"]],
  exercise_one: [[47, "img4.png", "exercise-one-data.png"], [47, "img7.png", "exercise-one-icon.png"]],
  exercise_confidence: [[49, "img3.png", "confidence-result.png"]],
  exercise_two: [[50, "img4.jpg", "exercise-two-photo.jpg"], [50, "img7.png", "exercise-two-icon.png"]],
  exercise_censoring_compare: [[52, "img3.png", "type-i-source.png"], [52, "img6.png", "type-ii-source.png"], [52, "img8.png", "censoring-status.png"]],
  exercise_censoring_example: [[53, "img3.png", "censoring-example.png"]],
  exercise_three: [[55, "img4.jpg", "exercise-three.jpg"]],
  brake_example: [[60, "img4.png", "brake-small.png"], [61, "img4.jpg", "brake-large.jpg"], [61, "img6.png", "brake-data.png"], [62, "img3.png", "brake-result.png"]],
  three_parameter_challenge: [[64, "img3.png", "negative-threshold.png"], [65, "img3.png", "confidence-check.png"], [65, "img4.jpg", "parameter-table.jpg"]],
  exercise_four: [[68, "img4.jpg", "jet.jpg"], [68, "img6.jpg", "landing-gear.jpg"], [68, "img9.png", "exercise-four-icon.png"]],
  multiple_modes_result: [[70, "img3.png", "joint-fit.png"], [71, "img3.jpg", "split-fit.jpg"], [71, "img4.png", "mechanism-icon.png"], [72, "img3.png", "result-a.png"], [72, "img4.png", "result-b.png"]],
};

const PLOT_BY_BUILDER = {
  workflow: [[PLOTS.parameter, "weibull-parameter.svg"]],
  mechanisms_overview: [[PLOTS.mechanisms, "mechanism-split.svg"]],
  censored_overview: [[PLOTS.censored, "censored.svg"]],
  confidence_intro: [[PLOTS.confidence, "confidence.svg"]],
  sample_population: [[PLOTS.confidence, "confidence.svg"]],
  confidence_meaning: [[PLOTS.confidence, "confidence.svg"]],
  confidence_drivers: [[PLOTS.confidence, "confidence.svg"]],
  probability_surface: [[PLOTS.surface, "probability-surface.svg"]],
  confidence_types: [[PLOTS.confidence, "confidence.svg"]],
  complete_data: [[PLOTS.failures, "failures.svg"]],
  right_censored: [[PLOTS.censored, "censored.svg"]],
  three_parameter_intro: [[PLOTS.shift, "weibull-shift.svg"]],
  multiple_modes: [[PLOTS.mechanisms, "mechanism-split.svg"]],
};

const CUE_HINTS = Object.freeze({
  intro_1: ["In diesem Abschnitt lernen"],
  intro_2: ["Sobald wir die Lebensdauerdaten gesammelt"],
  intro_3: ["In diesem Fall nutzen"],
  intro_4: ["Die charakteristische Lebensdauer gibt"],
  intro_5: ["Vergleiche anstellen"],
  intro_relation: ["grundlegende Vorgehen"],
  workflow_1: ["der Größe nach sortiert"],
  workflow_2: ["Median-Rang-Verfahrens"],
  workflow_3: ["als Punkte in das Weibull-Wahrscheinlichkeits-Papier"],
  workflow_4: ["Ausgleichsgerade"],
  workflow_5: ["Sobald die Gerade festgelegt"],
  workflow_plot: ["als Punkte in das Weibull-Wahrscheinlichkeits-Papier"],
  workflow_result: ["Damit haben wir die Weibullverteilung bestimmt"],
  mechanisms_joint: ["mehrere Ausfallmechanismen einer Komponente"],
  mechanisms_plot: ["zwei ermittelte Weibull-Geraden"],
  mechanisms_rule: ["getrennt voneinander"],
  censored_plot: ["nicht zwingend ausschließlich als Ausfallzeiten"],
  censored_context: ["Test vorzeitig abbrechen"],
  censored_examples: ["Test vorzeitig abbrechen"],
  censored_rule: ["zensierten Informationen"],
  method_mls: ["Methode der kleinsten Quadrate"],
  method_mle: ["Maximum-Likelihood-Schätzung"],
  method_decision: ["richtige Methode angewendet"],
  confidence_estimate: ["Weibullverteilung nur einen Teil"],
  confidence_plot: ["Weibullverteilung nur einen Teil"],
  confidence_bounds: ["zusätzlich einen sogenannten Vertrauensbereich"],
  confidence_takeaway: ["Warum dieser notwendig"],
  sample_population_sample: ["Analyse von Lebensdauerdaten auf Basis einer Stichprobe"],
  sample_population_transfer: ["gilt zunächst nur für die Stichprobe selbst"],
  sample_population_distribution: ["Ergebnis ist eine Weibullverteilung"],
  sample_population_rule: ["Aussagen über die Grundgesamtheit"],
  meaning_fit: ["Weibullgerade ermittelt"],
  meaning_bounds: ["durch zwei Vertrauensgrenzen definiert"],
  meaning_warning: ["andere Stichprobe aus derselben Grundgesamtheit"],
  meaning_rule: ["Aussagewahrscheinlichkeit oder auch Aussagesicherheit"],
  drivers_level: ["neunzigprozentigen Vertrauensbereich"],
  drivers_sample: ["Größe unserer Stichprobe"],
  drivers_rule: ["Je größer die Stichprobe"],
  surface_plot: ["dreidimensionalen Visualisierung"],
  surface_meaning: ["keine exakt festgelegte Ausfallwahrscheinlichkeit"],
  surface_message: ["Median jeder dieser Verteilungen"],
  surface_note: ["fünfzig Prozent der Fälle"],
  types_two: ["zweiseitigen Vertrauensbereich"],
  types_left: ["Beim linksseitigen Vertrauensbereich"],
  types_right: ["rechtsseitigen Vertrauensbereich"],
  types_rule: ["konkreten Fragestellung"],
  sources_development: ["entlang des Entwicklungsprozesses"],
  sources_testing: ["stark beschleunigte Lebensdauerversuche"],
  sources_field: ["Felddaten oder sogenannte Feldversuche"],
  sources_evidence: ["Zusammenfassend lässt sich sagen"],
  complete_definition: ["genauen Ausfallzeitpunkt"],
  complete_plot: ["roten Kreuze"],
  complete_data: ["vollständigen Daten"],
  complete_rule: ["besonders einfach auszuwerten"],
  right_censored_definition: ["bis zu einem bestimmten Zeitpunkt funktioniert"],
  right_censored_rule: ["jenseits der bekannten Beobachtungsdauer"],
  right_censored_coding: ["Zensierungszeitpunkte korrekt zu erfassen"],
  right_censored_plot: ["blauen Pfeilen"],
  censor_type_i: ["Rechtszensierung vom Typ eins"],
  censor_type_ii: ["Rechtszensierung vom Typ zwei"],
  censor_types_rule: ["Beide Varianten haben gemeinsam"],
  multi_censor_axes: ["Multiplen Zensierung"],
  multi_entry_exit: ["unterschiedlichen Zeitpunkten"],
  multi_competing: ["mehrere Ausfallmechanismen gleichzeitig"],
  multi_legend: ["als Zensierungszeitpunkte nutzen"],
  interval_windows: ["sogenannte Intervallzensierung"],
  interval_known: ["innerhalb eines bestimmten Zeitintervalls"],
  interval_unknown: ["innerhalb eines Intervalls verborgen"],
  interval_rule: ["zwei Zeitpunkte, zwischen denen"],
  mls_panel: ["M-L-S-Methode basiert"],
  mle_panel: ["Anders verhält es sich mit der Maximum-Likelihood-Methode"],
  mls_mle_arrow: ["vollständige als auch zensierte Daten"],
  mls_mle_rule: ["Unterschiede zu kennen"],
  special_completed: ["ersten drei Übungen"],
  special_transition_rule: ["weitere Zensierungsarten"],
  special_next: ["Blick auf einige Sonderfälle"],
  special_transition_arrow: ["Blick auf einige Sonderfälle"],
  three_intro_plot: ["deutlich gekrümmte Kurve"],
  three_intro_indicator: ["Hinweis darauf"],
  three_intro_t0: ["sogenannte Schwellenwert"],
  three_intro_rule: ["vorsichtig sein"],
  three_rule_1: ["physikalisch begründbare und statistisch nachvollziehbare"],
  three_rule_2: ["deutlich konkav"],
  three_rule_3: ["ausreichend großen Stichprobenumfang"],
  three_rule_fallback: ["folgende Faustregel"],
  brake_result: ["negativen Schwellenwert berechnet"],
  brake_rule: ["zu kleine Stichprobe"],
  three_challenge_negative: ["negativen Schwellenwert berechnet"],
  three_challenge_confidence: ["zu kleine Stichprobe"],
  three_challenge_rule: ["physikalisch nicht sinnvoll"],
  modes_transition_joint: ["Liste von Ausfallzeiten"],
  modes_transition_signal: ["mehrere Geraden beschreiben"],
  modes_transition_arrow: ["So erhält man für jeden Mechanismus"],
  modes_transition_split: ["jeweils separat analysiert"],
  multiple_modes_diagnosis: ["Fit ist schlecht"],
  multiple_modes_plot: ["mehrere Geraden beschreiben"],
  multiple_modes_action: ["nach Ausfallmechanismen getrennt"],
  multiple_modes_rule: ["präzisere Beschreibung und bessere Prognose"],
  modes_result_joint: ["gemeinsam in einer Weibull-Grafik"],
  modes_result_split: ["jeweils separat analysiert"],
  modes_result_rule: ["präzisere Beschreibung und bessere Prognose"],
});

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function wrap(text, width, size) {
  const maxChars = Math.max(8, Math.floor(width / (size * 0.55)));
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else current = candidate;
  }
  if (current) lines.push(current);
  return lines;
}

function txt(x, y, text, size = 22, weight = 650, fill = C.text, anchor = "start") {
  const safeSize = Math.max(18, size);
  return `<text x="${x}" y="${y}" font-size="${safeSize}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true" data-qc-padding="2">${esc(text)}</text>`;
}

function multi(x, y, width, text, size = 22, weight = 650, fill = C.text, anchor = "start", lineHeight = 1.25) {
  const lines = String(text).split("\n").flatMap((line) => wrap(line, width, size));
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true" data-qc-padding="2">${lines.map((line, index) => `<tspan x="${x}" dy="${index ? size * lineHeight : 0}">${esc(line)}</tspan>`).join("")}</text>`;
}

function box(x, y, width, height, fill = C.surface, stroke = C.border, strokeWidth = 1.5, radius = 12) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" data-qc-allow-overlap="true"/>`;
}

function pill(x, y, width, label, stroke = C.accent, fill = C.surface) {
  return `${box(x, y, width, 38, fill, stroke, 1.5, 19)}${txt(x + width / 2, y + 26, label, 17, 820, stroke, "middle")}`;
}

function line(x1, y1, x2, y2, stroke = C.accent, width = 2.5, arrow = false, dash = "") {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}${arrow ? ` marker-end="url(#arrow_${stroke.slice(1)})"` : ""} data-role="connector" data-qc-role="connector" data-qc-layer="connector"/>`;
}

function pathLine(d, stroke = C.accent, width = 2.5, arrow = false, dash = "") {
  return `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}${arrow ? ` marker-end="url(#arrow_${stroke.slice(1)})"` : ""} data-role="connector" data-qc-role="connector" data-qc-layer="connector"/>`;
}

function group(id, label, body, animated = true) {
  return `<g id="${id}"${animated ? ` data-anim-target="true" data-anim-label="${esc(label)}"` : ""} data-qc-group="${id}">${body}</g>`;
}

function image(href, x, y, width, height, label) {
  return `<image href="${href}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" aria-label="${esc(label)}" data-qc-allow-overlap="true"/>`;
}

function card(id, x, y, width, height, eyebrow, title, body, options = {}) {
  const stroke = options.stroke || C.accent;
  const fill = options.fill || C.surface;
  const titleSize = options.titleSize || 25;
  const bodySize = options.bodySize || 20;
  return group(id, title, `${box(x, y, width, height, fill, stroke, options.strokeWidth || 1.8, options.radius || 12)}${txt(x + 28, y + 40, eyebrow, 16, 850, stroke)}${multi(x + 28, y + 84, width - 56, title, titleSize, 800, C.deep)}${body ? multi(x + 28, y + 142, width - 56, body, bodySize, 620, C.text, "start", 1.28) : ""}`, options.animated !== false);
}

function bulletList(x, y, width, items, color = C.accent, size = 21, gap = 70) {
  return items.map((item, index) => `${box(x, y + index * gap - 16, 18, 18, color, color, 1, 9)}${multi(x + 38, y + index * gap, width - 38, item, size, 650, C.text)}`).join("");
}

function target(id, label, keywords = [], action = "show") {
  return { id, label, keywords, action };
}

function timelineRow(id, label, y, end, censored = false, start = 250, color = C.accent) {
  const endX = start + end;
  const labelX = Math.max(118, start - 132);
  const marker = censored
    ? `${line(endX - 16, y - 13, endX, y, color, 3)}${line(endX - 16, y + 13, endX, y, color, 3)}`
    : `${line(endX - 12, y - 12, endX + 12, y + 12, C.failure, 3)}${line(endX - 12, y + 12, endX + 12, y - 12, C.failure, 3)}`;
  return group(id, label, `${txt(labelX, y + 7, label, 19, 750, C.deep)}${line(start, y, endX, y, color, 3)}${marker}${txt(endX + 28, y + 7, censored ? "zensiert" : "Ausfall", 17, 760, censored ? C.accent : C.failure)}`);
}

function plotCard(id, href, x, y, width, height, label) {
  return group(id, label, `${box(x, y, width, height, C.surface, C.border, 1.5, 14)}${image(href, x + 20, y + 18, width - 40, height - 36, label)}`);
}

function plotHref(filename) {
  return `../../../../analysis/re3-assets/plots/${filename}`;
}

function buildIntro() {
  const items = [
    ["01", "Lebensdauerdaten", "Ausfallzeiten einer Komponente oder eines Systems"],
    ["02", "Daten auswerten", "Beobachtetes Ausfallverhalten strukturieren"],
    ["03", "Verteilung wählen", "Weibullverteilung als flexibles Lebensdauermodell"],
    ["04", "Parameter bestimmen", "Charakteristische Lebensdauer T und Formparameter b"],
    ["05", "Aussagen ableiten", "Vergleiche, Berechnungen und Prognosen"],
  ];
  const body = items.map(([number, title, text], index) => {
    const x = 92 + index * 350;
    return card(`intro_${index + 1}`, x, 292, 316, 390, number, title, text, { stroke: index === 4 ? C.educationAccent : [C.accent, C.secondary, C.accent, C.secondary][index % 4], fill: C.surface });
  }).join("") + group("intro_relation", "Vom Datensatz zur Prognose", `${line(168, 760, 1752, 760, C.accent, 3, true)}${pill(675, 806, 570, "DATEN → MODELL → PROGNOSE", C.accent, C.surface)}`);
  return { body, targets: [target("intro_1", "Lebensdauerdaten", ["Lebensdauerdaten"]), target("intro_2", "Auswertung", ["auswerten"]), target("intro_3", "Weibullverteilung", ["Weibullverteilung"]), target("intro_4", "Parameter", ["Parameter"]), target("intro_5", "Prognosen", ["Prognosen"]), target("intro_relation", "Gesamtweg", ["grundlegende Vorgehen"], "draw")] };
}

function buildWorkflow() {
  const steps = [
    ["01", "Ausfallzeiten sortieren", "t₁ ≤ t₂ ≤ … ≤ tₙ"],
    ["02", "Median Ranks berechnen", "F(tᵢ) = (i − 0,3) / (n + 0,4)"],
    ["03", "Punkte auftragen", "Lebensdauer und Ausfallwahrscheinlichkeit"],
    ["04", "Gerade fitten", "Lineare Regression im Weibullnetz"],
    ["05", "T und b ablesen", "Lage und Steigung der Fit-Gerade"],
  ];
  const left = steps.map(([number, title, body], index) => card(`workflow_${index + 1}`, 92, 176 + index * 146, 630, 122, number, title, body, { stroke: index === 4 ? C.educationAccent : C.accent, fill: C.surface, titleSize: 22, bodySize: 18 })).join("");
  const plot = plotCard("workflow_plot", plotHref("weibull-parameter.svg"), 790, 184, 1038, 650, "Weibullnetz mit T- und b-Ablesung");
  const result = group("workflow_result", "Ausfallwahrscheinlichkeit berechnen", `${box(790, 860, 1038, 88, C.accentSoft, C.accent, 1.8, 10)}${txt(824, 913, "ERGEBNIS", 17, 850, C.accent)}${txt(1040, 919, "F(t) = 1 − exp[−(t / T)ᵇ]", 30, 780, C.deep)}`);
  return { body: left + plot + result, targets: steps.map(([, title], index) => target(`workflow_${index + 1}`, title, [["sortiert", "sortieren"], ["Median Ranks"], ["Punkte"], ["Regressionsgerade", "Regression"], ["charakteristische Lebensdauer", "Formparameter"]][index])).concat([target("workflow_plot", "Weibullnetz", ["Weibullnetz", "Weibull-Papier"]), target("workflow_result", "Weibull-Funktion", ["mathematischen Formel", "Ausfallwahrscheinlichkeit"])] ) };
}

function buildMechanismsOverview() {
  const joint = card("mechanisms_joint", 92, 228, 540, 530, "GEMEINSAMER FIT", "Eine Gerade für alle Daten", "Ein sichtbarer Knick oder mehrere lineare Bereiche werden von einem gemeinsamen Fit schlecht beschrieben.", { stroke: C.failure, fill: C.surface });
  const plot = plotCard("mechanisms_plot", plotHref("mechanism-split.svg"), 680, 190, 1148, 650, "Getrennte Ausfallmechanismen im Weibullnetz");
  const rule = group("mechanisms_rule", "Mechanismen trennen", `${box(92, 860, 1736, 88, C.accentSoft, C.accent, 1.8, 10)}${txt(126, 914, "MERKSATZ", 17, 850, C.accent)}${multi(342, 914, 1430, "Mehrere Geraden → Mechanismen identifizieren und getrennt auswerten.", 25, 780, C.deep)}`);
  return { body: joint + plot + rule, targets: [target("mechanisms_joint", "Gemeinsamer Fit", ["mehrere Ausfallmechanismen"]), target("mechanisms_plot", "Mehrere Geraden", ["mehreren Geraden", "Mechanismen"]), target("mechanisms_rule", "Trennregel", ["getrennt", "separat"])] };
}

function buildCensoredOverview() {
  const plot = plotCard("censored_plot", plotHref("censored.svg"), 92, 198, 1040, 640, "Objekt-Zeit-Diagramm mit zensierten Beobachtungen");
  const context = card("censored_context", 1180, 228, 648, 250, "BEOBACHTUNG", "Nicht ausgefallen heißt nicht unbekannt", "Die bis zum Beobachtungsende erreichte Lebensdauer ist als zensierte Information verwertbar.", { stroke: C.accent });
  const examples = card("censored_examples", 1180, 516, 648, 282, "TYPISCHE GRÜNDE", "Beobachtung endet vor dem Ausfall", "Prüfende · erreichtes Versuchsende · Objekt aus der Studie ausgeschieden", { stroke: C.secondary });
  const rule = group("censored_rule", "Zensierte Zeit", `${pill(1196, 852, 610, "→ Laufzeit bekannt · Ausfallzeit unbekannt", C.accent, C.surface)}`);
  return { body: plot + context + examples + rule, targets: [target("censored_plot", "Objekt-Zeit-Diagramm", ["zensierte Daten", "Beobachtung"]), target("censored_context", "Zensierte Information", ["nicht ausgefallen", "weiterhin"]), target("censored_examples", "Zensierungsgründe", ["Versuchsende", "Studie"]), target("censored_rule", "Laufzeit bleibt bekannt", ["zensiert"])] };
}

function buildMethodChoice() {
  const mls = card("method_mls", 92, 252, 800, 490, "MLS · REGRESSION", "Grafische Schätzung", "Besonders anschaulich bei vollständigen Datensätzen. Fit-Gerade und Parameter werden im Weibullnetz bestimmt.", { stroke: C.accent, fill: C.surface });
  const mle = card("method_mle", 928, 252, 900, 490, "MLE · LIKELIHOOD", "Information vollständig nutzen", "Bevorzugt bei zensierten Datensätzen, weil Ausfälle und Zensierungsinformationen gemeinsam in die Schätzung eingehen.", { stroke: C.secondary, fill: C.surface });
  const decision = group("method_decision", "Methodenwahl", `${box(92, 794, 1736, 126, C.accentSoft, C.accent, 1.8, 10)}${txt(132, 842, "ENTSCHEIDUNGSREGEL", 17, 850, C.accent)}${multi(132, 884, 1640, "vollständig → MLS gut nachvollziehbar · zensiert → MLE bevorzugen", 26, 780, C.deep)}`);
  return { body: mls + mle + decision, targets: [target("method_mls", "MLS", ["Least Square", "MLS"]), target("method_mle", "MLE", ["Maximum-Likelihood", "MLE"]), target("method_decision", "Methodenwahl", ["zensierte Daten", "vollständigen"])] };
}

function buildConfidenceIntro() {
  const plot = plotCard("confidence_plot", plotHref("confidence.svg"), 92, 190, 1110, 660, "Weibull-Fit mit Vertrauensgrenzen");
  const estimate = card("confidence_estimate", 1240, 220, 588, 188, "PUNKTSCHÄTZUNG", "Fit aus der Stichprobe", "Die Gerade ist die beste Schätzung auf Basis der beobachteten Daten.", { stroke: C.accent });
  const bounds = card("confidence_bounds", 1240, 444, 588, 218, "VERTRAUENSGRENZEN", "Untere und obere Grenze", "Sie zeigen den Bereich plausibler Verläufe für die Grundgesamtheit.", { stroke: C.secondary });
  const takeaway = group("confidence_takeaway", "Unsicherheit sichtbar machen", `${pill(1240, 724, 588, "UNSICHERHEIT SICHTBAR MACHEN", C.educationAccent, C.surface)}`);
  return { body: plot + estimate + bounds + takeaway, targets: [target("confidence_estimate", "Punktschätzung", ["Schätzung"]), target("confidence_plot", "Fit", ["Verteilung"]), target("confidence_bounds", "Vertrauensgrenzen", ["Vertrauensgrenzen", "Vertrauensbereich"]), target("confidence_takeaway", "Unsicherheit", ["Unsicherheit"])] };
}

function buildSamplePopulation() {
  const dots = Array.from({ length: 12 }, (_, index) => {
    const x = 170 + (index % 4) * 112;
    const y = 340 + Math.floor(index / 4) * 112;
    return `<circle cx="${x}" cy="${y}" r="19" fill="${index < 8 ? C.accent : C.secondary}" opacity="${index < 8 ? .92 : .55}"/>`;
  }).join("");
  const sample = group("sample_population_sample", "Stichprobe", `${box(92, 238, 560, 520, C.surface, C.accent, 1.8, 14)}${txt(132, 292, "STICHPROBE", 18, 850, C.accent)}${dots}${multi(132, 696, 470, "Beobachtete Ausfallzeiten liefern eine Schätzung.", 23, 720, C.deep)}`);
  const arrow = group("sample_population_transfer", "Statistischer Schluss", `${line(682, 506, 838, 506, C.accent, 4, true)}${pill(666, 548, 188, "SCHÄTZEN", C.accent, C.surface)}`);
  const population = plotCard("sample_population_distribution", plotHref("confidence.svg"), 870, 208, 958, 620, "Grundgesamtheit mit Vertrauensgrenzen");
  const rule = group("sample_population_rule", "Vertrauensbereich", `${box(92, 864, 1736, 76, C.accentSoft, C.accent, 1.5, 9)}${multi(960, 913, 1640, "Punktschätzung + Vertrauensbereich = Aussage über die Grundgesamtheit", 25, 780, C.deep, "middle")}`);
  return { body: sample + arrow + population + rule, targets: [target("sample_population_sample", "Stichprobe", ["Stichprobe"]), target("sample_population_transfer", "Schluss auf die Grundgesamtheit", ["Grundgesamtheit"], "draw"), target("sample_population_distribution", "Verteilung und Grenzen", ["Vertrauensbereich"]), target("sample_population_rule", "Aussage", ["Schätzung"])] };
}

function buildConfidenceMeaning() {
  const plot = plotCard("meaning_plot", plotHref("confidence.svg"), 92, 188, 990, 620, "Weibull-Vertrauensgrenzen");
  const cards = card("meaning_fit", 1122, 214, 706, 172, "FIT", "Beste Schätzung", "Parameter und Fit-Gerade stammen aus der konkreten Stichprobe.", { stroke: C.accent })
    + card("meaning_bounds", 1122, 418, 706, 188, "90-%-VERTRAUENSBEREICH", "Untere und obere Vertrauensgrenze", "Die 5-%- und die 95-%-Grenze schließen den zweiseitigen 90-%-Vertrauensbereich ein.", { stroke: C.secondary })
    + card("meaning_warning", 1122, 622, 706, 198, "AUSSAGESICHERHEIT", "Wiederholte Stichproben einordnen", "Bei wiederholten Stichproben liegen rund 90 Prozent der ermittelten Weibullgeraden innerhalb der Grenzen.", { stroke: C.secondary });
  const rule = group("meaning_rule", "Korrekte Interpretation", `${pill(370, 856, 1180, "VERTRAUENSGRENZEN MACHEN SCHÄTZUNSICHERHEIT SICHTBAR", C.accent, C.surface)}`);
  return { body: plot + cards + rule, targets: [target("meaning_fit", "Schätzung", ["Schätzung"]), target("meaning_bounds", "Vertrauensgrenzen", ["Vertrauensgrenzen"]), target("meaning_warning", "Aussagesicherheit", ["Stichprobe"]), target("meaning_rule", "Unsicherheitsbereich", ["Grundgesamtheit"])] };
}

function buildConfidenceDrivers() {
  const sample = group("drivers_sample", "Stichprobenumfang", `${box(92, 230, 820, 540, C.surface, C.accent, 1.8, 14)}${txt(132, 284, "STICHPROBENUMFANG", 18, 850, C.accent)}${txt(160, 386, "klein", 21, 760, C.deep)}${box(312, 354, 470, 58, C.surfaceSoft, C.border, 1.2, 29)}${box(404, 366, 286, 34, C.accentSoft, C.accent, 1.5, 17)}${txt(160, 540, "groß", 21, 760, C.deep)}${box(312, 508, 470, 58, C.surfaceSoft, C.border, 1.2, 29)}${box(500, 520, 96, 34, C.accentSoft, C.accent, 1.5, 17)}${multi(132, 686, 700, "Mehr Daten → engerer Vertrauensbereich", 25, 800, C.deep)}`);
  const level = group("drivers_level", "Konfidenzniveau", `${box(948, 230, 880, 540, C.surface, C.secondary, 1.8, 14)}${txt(988, 284, "KONFIDENZNIVEAU", 18, 850, C.secondary)}${txt(1016, 386, "80 %", 21, 760, C.deep)}${box(1162, 354, 516, 58, C.surfaceSoft, C.border, 1.2, 29)}${box(1320, 366, 200, 34, C.secondarySoft, C.secondary, 1.5, 17)}${txt(1016, 540, "90 %", 21, 760, C.deep)}${box(1162, 508, 516, 58, C.surfaceSoft, C.border, 1.2, 29)}${box(1238, 520, 366, 34, C.secondarySoft, C.secondary, 1.5, 17)}${multi(988, 686, 760, "Höhere Sicherheit → breiterer Bereich", 25, 800, C.deep)}`);
  const rule = group("drivers_rule", "Zwei Stellgrößen", `${pill(510, 834, 900, "BREITE = DATENMENGE × KONFIDENZNIVEAU", C.accent, C.surface)}`);
  return { body: sample + level + rule, targets: [target("drivers_sample", "Stichprobenumfang", ["Stichprobenumfang", "Stichprobe"]), target("drivers_level", "Konfidenzniveau", ["Konfidenzniveau"]), target("drivers_rule", "Breite", ["breiter", "enger"])] };
}

function buildProbabilitySurface() {
  const plot = plotCard("surface_plot", plotHref("probability-surface.svg"), 92, 180, 1220, 700, "Dichteverteilungen der Ausfallwahrscheinlichkeit über der Lebensdauer");
  const meaning = card("surface_meaning", 1352, 220, 476, 252, "VERTEILUNG STATT EINZELWERT", "F(t) bleibt unsicher", "Für einen Zeitpunkt ergibt sich aus der Stichprobe eine Verteilung plausibler Ausfallwahrscheinlichkeiten.", { stroke: C.accent });
  const message = card("surface_message", 1352, 508, 476, 270, "MEDIANE VERBINDEN", "Die Weibullgerade entsteht", "Die Mediane der Dichteverteilungen bilden über die Zeit die beste Schätzung der Weibullgeraden.", { stroke: C.educationAccent, fill: C.surface });
  const note = group("surface_note", "Lage der wahren Gerade", `${pill(1328, 840, 520, "50 % OBERHALB · 50 % UNTERHALB", C.secondary, C.surface)}`);
  return { body: plot + meaning + message + note, targets: [target("surface_plot", "Dichteverteilungen", ["dreidimensional"]), target("surface_meaning", "Verteilung statt Einzelwert", ["keine exakt festgelegte"]), target("surface_message", "Mediane und Weibullgerade", ["Median"]), target("surface_note", "50-50-Lage", ["fünfzig Prozent"])] };
}

function intervalGraphic(x, y, width, mode, label) {
  const center = x + width / 2;
  const left = x + 60;
  const right = x + width - 60;
  let active = "";
  if (mode === "two") active = line(left, y + 90, right, y + 90, C.accent, 4) + line(left, y + 68, left, y + 112, C.accent, 3) + line(right, y + 68, right, y + 112, C.accent, 3);
  if (mode === "left") active = line(left, y + 90, center, y + 90, C.accent, 4) + line(left, y + 68, left, y + 112, C.accent, 3);
  if (mode === "right") active = line(center, y + 90, right, y + 90, C.accent, 4) + line(right, y + 68, right, y + 112, C.accent, 3);
  return `${active}<circle cx="${center}" cy="${y + 90}" r="13" fill="${C.failure}"/><text x="${center}" y="${y + 148}" font-size="18" font-weight="760" fill="${C.deep}" text-anchor="middle">${esc(label)}</text>`;
}

function buildConfidenceTypes() {
  const two = group("types_two", "Zweiseitiges Intervall", `${box(92, 260, 540, 470, C.surface, C.accent, 1.8, 14)}${txt(132, 316, "ZWEISEITIG", 18, 850, C.accent)}${multi(132, 370, 450, "Untere und obere Grenze", 25, 800, C.deep)}${intervalGraphic(132, 462, 460, "two", "Schätzwert")}${multi(132, 660, 450, "Wenn Abweichungen in beide Richtungen relevant sind.", 20, 620, C.text)}`);
  const left = group("types_left", "Linksseitiges Intervall", `${box(690, 260, 540, 470, C.surface, C.secondary, 1.8, 14)}${txt(730, 316, "LINKSSEITIG", 18, 850, C.secondary)}${multi(730, 370, 450, "Nur die untere Grenze", 25, 800, C.deep)}${intervalGraphic(730, 462, 460, "left", "Schätzwert")}${multi(730, 660, 450, "Wenn ein Mindestwert abgesichert werden soll.", 20, 620, C.text)}`);
  const right = group("types_right", "Rechtsseitiges Intervall", `${box(1288, 260, 540, 470, C.surface, C.accent, 1.8, 14)}${txt(1328, 316, "RECHTSSEITIG", 18, 850, C.accent)}${multi(1328, 370, 450, "Nur die obere Grenze", 25, 800, C.deep)}${intervalGraphic(1328, 462, 460, "right", "Schätzwert")}${multi(1328, 660, 450, "Wenn ein maximaler Wert entscheidend ist.", 20, 620, C.text)}`);
  const rule = group("types_rule", "Richtung folgt Fragestellung", `${pill(510, 810, 900, "RICHTUNG FOLGT DER FACHLICHEN FRAGE", C.accent, C.surface)}`);
  return { body: two + left + right + rule, targets: [target("types_two", "Zweiseitig", ["zweiseitiges"]), target("types_left", "Linksseitig", ["linksseitiges"]), target("types_right", "Rechtsseitig", ["rechtsseitiges"]), target("types_rule", "Fragestellung", ["Fragestellung", "Frage"])] };
}

function buildLifeDataSources() {
  const development = card("sources_development", 92, 246, 520, 430, "ENTWICKLUNG", "Simulation und Berechnung", "Lastkollektive · digitale Modelle · frühe Versuche", { stroke: C.accent });
  const testing = card("sources_testing", 700, 246, 520, 430, "ERPROBUNG", "Komponenten- und Systemtests", "Labor · Prüfstand · beschleunigte Versuche", { stroke: C.secondary });
  const field = card("sources_field", 1308, 246, 520, 430, "FELD", "Nutzungs- und Ausfalldaten", "Garantie · Service · Flotten- und Betriebsdaten", { stroke: C.accent });
  const evidenceImage = group("sources_evidence", "Beispielhafte Datenquellen", `${box(92, 728, 1736, 186, C.surface, C.border, 1.5, 12)}${image("media/lifecycle-data.jpg", 116, 742, 510, 158, "Quellcollage zu Lebensdauerdaten")}${multi(676, 794, 1080, "Datenquellen unterscheiden sich in Realitätsnähe, Aufwand und Zensierungsanteil – gemeinsam bilden sie die Evidenzbasis.", 23, 720, C.deep)}`);
  return { body: development + testing + field + evidenceImage, targets: [target("sources_development", "Entwicklung", ["Produktentwicklungsprozess", "Simulation"]), target("sources_testing", "Erprobung", ["Tests", "Versuchen"]), target("sources_field", "Feld", ["Feld", "Praxis"]), target("sources_evidence", "Evidenzbasis", ["Lebensdauerdaten"])] };
}

function buildCompleteData() {
  const plot = plotCard("complete_plot", plotHref("failures.svg"), 92, 210, 1120, 640, "Vollständige Objekt-Zeit-Verläufe");
  const definition = card("complete_definition", 1252, 242, 576, 250, "VOLLSTÄNDIG", "Jede Beobachtung endet im Ausfall", "Für jedes Objekt ist die exakte Ausfallzeit bekannt.", { stroke: C.accent });
  const data = card("complete_data", 1252, 532, 576, 230, "DATENSATZ", "t₁, t₂, …, tₙ", "Alle Zeiten gehen als Ausfälle in die Schätzung ein.", { stroke: C.secondary });
  const rule = group("complete_rule", "Ausfallmarker", `${pill(1280, 818, 520, "× = BEOBACHTETER AUSFALL", C.failure, C.surface)}`);
  return { body: plot + definition + data + rule, targets: [target("complete_plot", "Objekt-Zeit-Verläufe", ["vollständigen Lebensdauerdaten"]), target("complete_definition", "Definition", ["Ausfall", "Prüfobjekte"]), target("complete_data", "Datensatz", ["Ausfallzeit"]), target("complete_rule", "Ausfallmarker", ["Ausfall"])] };
}

function buildRightCensored() {
  const plot = plotCard("right_censored_plot", plotHref("censored.svg"), 92, 210, 1120, 640, "Rechtszensierte Objekt-Zeit-Verläufe");
  const definition = card("right_censored_definition", 1252, 242, 576, 250, "RECHTSZENSIERT", "Beobachtung endet ohne Ausfall", "Bekannt ist nur: Die tatsächliche Lebensdauer liegt rechts vom letzten Beobachtungszeitpunkt.", { stroke: C.accent });
  const coding = card("right_censored_coding", 1252, 532, 576, 230, "DATENCODIERUNG", "Zeit plus Status", "Ausfall und zensierte Beobachtung müssen unterscheidbar erfasst werden.", { stroke: C.secondary });
  const rule = group("right_censored_rule", "Zensierungsmarker", `${pill(1280, 818, 520, "→ = BIS DAHIN FUNKTIONSFÄHIG", C.accent, C.surface)}`);
  return { body: plot + definition + coding + rule, targets: [target("right_censored_plot", "Zensierte Verläufe", ["rechtszensiert"]), target("right_censored_definition", "Definition", ["Versuchsende", "funktioniert"]), target("right_censored_coding", "Zeit und Status", ["zensierte", "Daten"]), target("right_censored_rule", "Bedeutung", ["mindestens"])] };
}

function buildCensoringTypes() {
  const typeI = group("censor_type_i", "Typ I", `${box(92, 232, 820, 560, C.surface, C.accent, 1.8, 14)}${txt(132, 286, "TYP I · FESTE ZEIT", 18, 850, C.accent)}${line(680, 350, 680, 650, C.failure, 3, false, "8 6")}${txt(680, 334, "Prüfende", 18, 780, C.failure, "middle")}${timelineRow("type_i_1", "Objekt 1", 410, 250, false, 180)}${timelineRow("type_i_2", "Objekt 2", 510, 390, false, 180)}${timelineRow("type_i_3", "Objekt 3", 610, 500, true, 180)}${multi(132, 724, 700, "Die Zeit ist fest; die Zahl der Ausfälle ist zufällig.", 23, 760, C.deep)}`);
  const typeII = group("censor_type_ii", "Typ II", `${box(948, 232, 880, 560, C.surface, C.secondary, 1.8, 14)}${txt(988, 286, "TYP II · FESTE AUSFALLZAHL", 18, 850, C.secondary)}${timelineRow("type_ii_1", "Objekt 1", 430, 310, false, 1060, C.secondary)}${timelineRow("type_ii_2", "Objekt 2", 510, 430, false, 1060, C.secondary)}${timelineRow("type_ii_3", "Objekt 3", 590, 550, true, 1060, C.secondary)}${multi(988, 724, 760, "Die Ausfallzahl ist fest; die Prüfzeit ergibt sich aus dem Versuch.", 23, 760, C.deep)}`);
  const rule = group("censor_types_rule", "Vergleich", `${pill(510, 840, 900, "ZEIT FEST ↔ AUSFALLZAHL FEST", C.accent, C.surface)}`);
  return { body: typeI + typeII + rule, targets: [target("censor_type_i", "Typ I", ["Typ I", "festen Zeit"]), target("censor_type_ii", "Typ II", ["Typ II", "Ausfälle"]), target("censor_types_rule", "Vergleich", ["Unterschied"])] };
}

function buildMultipleCensoring() {
  const axes = group("multi_censor_axes", "Unterschiedliche Beobachtungsfenster", `${box(92, 214, 1160, 650, C.surface, C.border, 1.5, 14)}${txt(132, 268, "OBJEKT-ZEIT-VERLÄUFE", 18, 850, C.accent)}${timelineRow("multi_1", "A", 370, 540, false, 270)}${timelineRow("multi_2", "B", 470, 430, true, 350, C.secondary)}${timelineRow("multi_3", "C", 570, 590, false, 210)}${timelineRow("multi_4", "D", 670, 350, true, 470, C.secondary)}${line(220, 760, 1120, 760, C.deep, 2, true)}${txt(1120, 806, "Zeit", 18, 750, C.deep, "end")}`);
  const staggered = card("multi_entry_exit", 1292, 244, 536, 238, "MULTIPLE ZENSIERUNG", "Ein- und Austritt variieren", "Objekte beginnen und enden ihre Beobachtung zu unterschiedlichen Zeitpunkten.", { stroke: C.accent });
  const competing = card("multi_competing", 1292, 520, 536, 244, "KONKURRIERENDE RISIKEN", "Mechanismus kennzeichnen", "Tritt ein anderer Mechanismus ein, wird die ursprüngliche Ausfallart für dieses Objekt zensiert.", { stroke: C.failure });
  const legend = group("multi_legend", "Legende", `${pill(1292, 818, 240, "× AUSFALL", C.failure, C.surface)}${pill(1550, 818, 278, "→ ZENSIERT", C.accent, C.surface)}`);
  return { body: axes + staggered + competing + legend, targets: [target("multi_censor_axes", "Beobachtungsfenster", ["Multiplen Zensierung", "unterschiedlichen Zeitpunkten"]), target("multi_entry_exit", "Ein- und Austritt", ["Studie", "Beobachtung"]), target("multi_competing", "Konkurrierende Risiken", ["konkurrierenden Risiken", "Mechanismus"]), target("multi_legend", "Status", ["zensiert"])] };
}

function buildIntervalCensoring() {
  const windows = group("interval_windows", "Beobachtungsfenster", `${box(92, 230, 1200, 580, C.surface, C.border, 1.5, 14)}${txt(132, 286, "INSPEKTIONSZEITPUNKTE", 18, 850, C.accent)}${line(190, 584, 1180, 584, C.deep, 3, true)}${[280, 520, 760, 1000].map((x, index) => `${line(x, 520, x, 648, C.secondary, 2)}${txt(x, 682, `t${index}`, 18, 760, C.deep, "middle")}`).join("")}${box(520, 520, 240, 128, C.accentSoft, C.accent, 2, 8)}${txt(640, 570, "AUSFALL", 18, 850, C.accent, "middle")}${txt(640, 614, "irgendwo im Intervall", 20, 720, C.deep, "middle")}${txt(280, 440, "funktionsfähig", 19, 760, C.accent, "middle")}${txt(760, 440, "ausgefallen", 19, 760, C.failure, "middle")}`);
  const known = card("interval_known", 1332, 250, 496, 226, "BEKANNT", "Intervallgrenzen", "Bei t₁ funktionsfähig, bei t₂ ausgefallen.", { stroke: C.accent });
  const unknown = card("interval_unknown", 1332, 522, 496, 226, "UNBEKANNT", "Exakter Zeitpunkt", "Der Ausfall liegt zwischen den beiden Inspektionen.", { stroke: C.secondary });
  const rule = group("interval_rule", "Datencodierung", `${pill(468, 854, 984, "DATENSATZ = [UNTERE GRENZE, OBERE GRENZE]", C.accent, C.surface)}`);
  return { body: windows + known + unknown + rule, targets: [target("interval_windows", "Intervall", ["Intervallzensierung"]), target("interval_known", "Bekannte Grenzen", ["Zeitintervall"]), target("interval_unknown", "Unbekannter Zeitpunkt", ["nicht genau bekannt"]), target("interval_rule", "Intervall codieren", ["zwischen"])] };
}

function buildMlsMle() {
  const mls = card("mls_panel", 92, 244, 760, 500, "MLS", "Kleinste Quadrate", "Grafischer Fit im Weibullnetz · leicht nachvollziehbar · geeignet für vollständige Daten", { stroke: C.accent, bodySize: 22 });
  const mle = card("mle_panel", 1068, 244, 760, 500, "MLE", "Maximum Likelihood", "Nutzt Ausfälle und Zensierungsinformationen · robust für zensierte Datensätze", { stroke: C.secondary, bodySize: 22 });
  const arrow = group("mls_mle_arrow", "Von MLS zu MLE", `${line(876, 500, 1044, 500, C.accent, 4, true)}${pill(866, 548, 190, "MEHR DATEN", C.accent, C.surface)}`);
  const rule = group("mls_mle_rule", "Methodenregel", `${box(92, 810, 1736, 110, C.accentSoft, C.accent, 1.8, 10)}${multi(960, 876, 1640, "Vollständig: MLS gut interpretierbar · Zensiert: MLE verwendet die verfügbare Information vollständig", 24, 780, C.deep, "middle")}`);
  return { body: mls + mle + arrow + rule, targets: [target("mls_panel", "MLS", ["MLS", "Least Square"]), target("mle_panel", "MLE", ["MLE", "Maximum-Likelihood"]), target("mls_mle_arrow", "Mehr Information", ["zensierte Daten"], "draw"), target("mls_mle_rule", "Methodenregel", ["Methode"])] };
}

function buildExerciseBikeSolution() {
  const context = group("bike_context", "Median-Rank-Ansatz", `${box(92, 214, 560, 628, C.surface, C.accent, 1.8, 14)}${txt(132, 268, "MEDIAN-RANK-ANSATZ", 18, 850, C.accent)}${image("media/median-rank-formula.png", 136, 330, 472, 92, "Formel für Median Ranks")}${multi(132, 520, 460, "Ausfallzeiten sortieren und empirische Ausfallwahrscheinlichkeiten bestimmen.", 23, 720, C.deep)}`);
  const result = group("bike_result", "Weibull-Auswertung", `${box(700, 214, 1128, 628, C.surface, C.border, 1.5, 14)}${image("media/gear-fit.png", 734, 246, 1060, 560, "Weibull-Auswertung des Zahnrad-Grübchenversuchs")}`);
  const rule = group("bike_rule", "Lösungsweg", `${pill(510, 874, 900, "DATEN → FIT → PARAMETER → INTERPRETATION", C.accent, C.surface)}`);
  return { body: context + result + rule, targets: [] };
}

function buildExerciseOne() {
  const prompt = card("exercise_one_prompt", 92, 230, 690, 560, "ARBEITSAUFTRAG", "Weibull-Analyse erstellen", "1 · Ausfallzeiten eingeben\n2 · Weibullverteilung fitten\n3 · T und b bestimmen\n4 · Ergebnis fachlich interpretieren", { stroke: C.accent, bodySize: 23 });
  const data = group("exercise_one_data", "Datensatz", `${box(830, 230, 998, 560, C.surface, C.border, 1.5, 14)}${image("media/exercise-one-data.png", 860, 276, 938, 250, "Datensatz der ersten Übung")}${image("media/exercise-one-icon.png", 1510, 548, 210, 210, "Übungssymbol")}${pill(902, 638, 520, "VOLLSTÄNDIGE AUSFALLDATEN", C.secondary, C.surface)}`);
  const check = group("exercise_one_check", "Ergebniskontrolle", `${pill(510, 844, 900, "KONTROLLE: FIT · T · b · PLAUSIBILITÄT", C.accent, C.surface)}`);
  return { body: prompt + data + check, targets: [] };
}

function buildExerciseConfidence() {
  const plot = group("exercise_conf_plot", "Minitab-Ergebnis", `${box(92, 206, 1170, 650, C.surface, C.border, 1.5, 14)}${image("media/confidence-result.png", 122, 238, 1110, 586, "Weibull-Ergebnis mit Vertrauensgrenzen")}`);
  const read = card("exercise_conf_read", 1302, 236, 526, 244, "ABLESEN", "Fit und Grenzen", "Welche Parameter zeigt das Ergebnis und wie breit sind die Vertrauensgrenzen?", { stroke: C.accent });
  const interpret = card("exercise_conf_interpret", 1302, 518, 526, 244, "INTERPRETIEREN", "Aussage absichern", "Welche Prognose ist belastbar und wo bleibt statistische Unsicherheit?", { stroke: C.secondary });
  const check = group("exercise_conf_check", "Kontrolle", `${pill(1302, 820, 526, "NICHT NUR DEN FIT LESEN", C.failure, C.surface)}`);
  return { body: plot + read + interpret + check, targets: [] };
}

function buildExerciseTwo() {
  const photo = group("exercise_two_photo", "Wellentest", `${box(92, 220, 650, 600, C.surface, C.border, 1.5, 14)}${image("media/exercise-two-photo.jpg", 122, 250, 590, 400, "Bauteil des Wellentests")}${pill(178, 706, 478, "8 VOLLSTÄNDIGE AUSFÄLLE", C.accent, C.surface)}`);
  const prompt = group("exercise_two_prompt", "Vertrauensbereiche bestimmen", `${box(790, 220, 1038, 600, C.surface, C.accent, 1.8, 14)}${txt(824, 264, "ARBEITSAUFTRAG", 18, 850, C.accent)}${multi(824, 322, 940, "Wellentest mit 90 % Aussagesicherheit", 28, 820, C.deep)}${bulletList(824, 438, 900, ["Formparameter b und Lebensdauer T schätzen", "Vertrauensbereiche von b und T bestimmen", "B₂-Lebensdauer mit 90 % Sicherheit angeben", "Überlebenswahrscheinlichkeit bei 70.000 km bestimmen"], C.accent, 22, 78)}`);
  const check = group("exercise_two_check", "Ergebniskontrolle", `${image("media/exercise-two-icon.png", 1490, 574, 220, 220, "Übungssymbol")}${pill(510, 864, 900, "FIT + GRENZEN GEMEINSAM LESEN", C.failure, C.surface)}`);
  return { body: photo + prompt + check, targets: [] };
}

function buildExerciseTransition() {
  const topics = [
    ["DATENSÄTZE", "Vollständig oder zensiert", "Beobachtungsart und Status sauber klassifizieren."],
    ["AUSWERTUNG", "Passende Methode wählen", "MLS und MLE passend zur Datenlage einsetzen."],
    ["SONDERFÄLLE", "Ergebnisse kritisch prüfen", "Dritter Parameter und mehrere Mechanismen hinterfragen."],
  ].map(([eyebrow, title, body], index) => card(`transition_topic_${index + 1}`, 92 + index * 584, 292, 540, 420, eyebrow, title, body, { stroke: index === 2 ? C.educationAccent : C.accent, fill: C.surface, animated: false })).join("");
  const rule = group("transition_rule", "Thematischer Überblick", `${pill(510, 780, 900, "DATEN → METHODE → KRITISCHE PRÜFUNG", C.accent, C.surface)}`, false);
  return { body: topics + rule, targets: [] };
}

function buildExerciseCensoringCompare() {
  const i = group("exercise_censor_i", "Typ-I-Datensatz", `${box(92, 230, 820, 560, C.surface, C.accent, 1.8, 14)}${txt(132, 282, "TYP I · FESTE PRÜFZEIT", 18, 850, C.accent)}${image("media/type-i-source.png", 126, 326, 752, 300, "Typ-I-Beispiel")}${multi(132, 716, 700, "Status am festen Prüfende codieren.", 22, 740, C.deep)}`);
  const ii = group("exercise_censor_ii", "Typ-II-Datensatz", `${box(948, 230, 880, 560, C.surface, C.secondary, 1.8, 14)}${txt(988, 282, "TYP II · FESTE AUSFALLZAHL", 18, 850, C.secondary)}${image("media/type-ii-source.png", 982, 326, 812, 300, "Typ-II-Beispiel")}${multi(988, 716, 760, "Versuch nach der vorgegebenen Ausfallzahl beenden.", 22, 740, C.deep)}`);
  const status = group("exercise_censor_status", "Statuscodierung", `${image("media/censoring-status.png", 760, 828, 400, 78, "Statuscodes für Ausfall und Zensierung")}`, false);
  return { body: i + ii + status, targets: [] };
}

function buildExerciseCensoringExample() {
  const source = group("exercise_censor_example", "Versuchsbeispiel", `${box(92, 210, 1160, 650, C.surface, C.border, 1.5, 14)}${image("media/censoring-example.png", 120, 238, 1104, 594, "Beispiel eines rechtszensierten Datensatzes")}`);
  const identify = card("exercise_censor_identify", 1292, 236, 536, 242, "ERKENNEN", "Welche Grenze ist fest?", "Prüfzeit oder Ausfallzahl bestimmt die Zensierungsart.", { stroke: C.accent });
  const code = card("exercise_censor_code", 1292, 518, 536, 242, "CODIEREN", "Zeit plus Status", "Ausfälle und zensierte Objekte korrekt unterscheiden.", { stroke: C.secondary });
  const rule = group("exercise_censor_rule", "Kontrolle", `${pill(1292, 816, 536, "GRENZE → TYP → STATUS", C.accent, C.surface)}`, false);
  return { body: source + identify + code + rule, targets: [] };
}

function buildExerciseThree() {
  const source = group("exercise_three_source", "Übungsunterlage", `${box(92, 198, 1180, 670, C.surface, C.border, 1.5, 14)}${image("media/exercise-three.jpg", 124, 230, 1116, 606, "Unterlage der dritten Übung")}`);
  const task = card("exercise_three_task", 1312, 230, 516, 250, "AUFGABE", "Datensatz prüfen", "Zensierungsart, Zeit- und Statuscodierung nachvollziehen.", { stroke: C.accent });
  const result = card("exercise_three_result", 1312, 520, 516, 250, "ERGEBNIS", "Fit kritisch lesen", "Parameter, Vertrauensgrenzen und Plausibilität gemeinsam beurteilen.", { stroke: C.secondary });
  const check = group("exercise_three_check", "Plausibilität", `${pill(1312, 826, 516, "PLAUSIBILITÄT VOR ZAHLEN", C.failure, C.surface)}`, false);
  return { body: source + task + result + check, targets: [] };
}

function buildSpecialCasesTransition() {
  const completed = card("special_completed", 156, 292, 700, 420, "ABGESCHLOSSEN", "Grundlegende Auswertung", "Vollständige und rechtszensierte Lebensdauerdaten mit Weibull-Modellen analysieren.", { stroke: C.accent });
  const next = card("special_next", 1064, 292, 700, 420, "ALS NÄCHSTES", "Sonderfälle und Stolpersteine", "3-Parameter-Weibullverteilung · mehrere Ausfallmechanismen", { stroke: C.educationAccent, fill: C.surface });
  const arrow = group("special_transition_arrow", "Übergang", `${line(880, 502, 1040, 502, C.accent, 4, true)}`);
  const rule = group("special_transition_rule", "Ausblick", `${pill(510, 780, 900, "WEITERE ZENSIERUNGSARTEN + SONDERFÄLLE", C.accent, C.surface)}`);
  return { body: completed + next + arrow + rule, targets: [target("special_completed", "Grundlagen", ["Übungen", "abgeschlossen"]), target("special_next", "Sonderfälle", ["Sonderfälle"]), target("special_transition_arrow", "Übergang", ["nächsten Schritt"], "draw"), target("special_transition_rule", "Kritische Prüfung", ["Praxis"])] };
}

function buildThreeParameterIntro() {
  const plot = plotCard("three_intro_plot", plotHref("weibull-shift.svg"), 92, 188, 1180, 680, "Zwei- und Dreiparameter-Weibullverteilung mit Zeitverschiebung");
  const indicator = card("three_intro_indicator", 1312, 220, 516, 230, "INDIKATION", "Gekrümmter Verlauf", "Eine deutliche Krümmung kann darauf hindeuten, dass ein zusätzlicher Schwellenwert die Daten besser beschreibt.", { stroke: C.failure });
  const t0 = card("three_intro_t0", 1312, 490, 516, 232, "DRITTER PARAMETER", "t₀ · ausfallfreie Zeit", "Der Verteilungsbeginn wird gegenüber t = 0 verschoben.", { stroke: C.accent });
  const rule = group("three_intro_rule", "Prüfauftrag", `${pill(1312, 790, 516, "HINWEIS, KEIN BEWEIS", C.failure, C.surface)}`);
  return { body: plot + indicator + t0 + rule, targets: [target("three_intro_plot", "Gekrümmter Verlauf", ["gekrümmte Kurve"]), target("three_intro_indicator", "Indikation", ["Hinweis"]), target("three_intro_t0", "Schwellenwert", ["Schwellenwert", "ausfallfreie Zeit"]), target("three_intro_rule", "Vorsicht", ["vorsichtig"])] };
}

function buildThreeParameterRules() {
  const cards = [
    ["PHYSIK", "Physikalisch begründbar", "Eine reale ausfallfreie Zeit muss technisch erklärbar sein."],
    ["VERLAUF", "Deutlich konkav", "Die Zweiparameter-Darstellung zeigt eine systematische Krümmung."],
    ["DATEN", "Große Stichprobe", "Der zusätzliche Parameter benötigt eine belastbare Datenbasis."],
  ].map(([eyebrow, title, body], index) => card(`three_rule_${index + 1}`, 92 + index * 584, 272, 540, 420, eyebrow, title, body, { stroke: C.accent, fill: index === 0 ? C.accentSoft : C.surface })).join("");
  const fallback = group("three_rule_fallback", "Konservative Faustregel", `${box(92, 756, 1736, 150, C.surface, C.failure, 1.8, 12)}${txt(132, 808, "BEI UNSICHERHEIT", 18, 850, C.failure)}${multi(132, 858, 1620, "Zweiparameter-Weibull verwenden – konservativ und ab t = 0 definiert.", 27, 800, C.deep)}`);
  return { body: cards + fallback, targets: [target("three_rule_1", "Physikalisch begründbar", ["physikalisch"]), target("three_rule_2", "Konkaver Verlauf", ["konkav"]), target("three_rule_3", "Stichprobenumfang", ["Stichprobenumfang"]), target("three_rule_fallback", "Faustregel", ["Faustregel", "klassischen zweiparametrigen"])] };
}

function buildBrakeExample() {
  const context = group("brake_context", "Bremsanlage und Daten", `${box(92, 196, 620, 672, C.surface, C.border, 1.5, 14)}${image("media/brake-large.jpg", 126, 228, 552, 300, "Betriebsbremsanlage")}${pill(152, 548, 500, "30 PRÜFLINGE · LASTWECHSEL", C.accent, C.surface)}${image("media/brake-data.png", 124, 610, 556, 210, "Ausfallzeiten der Bremshebel")}`, false);
  const result = group("brake_result", "Zwei- und Dreiparameter-Ergebnis", `${box(760, 196, 1068, 672, C.surface, C.border, 1.5, 14)}${image("media/brake-result.png", 790, 226, 1008, 568, "Lebensdauerauswertung mit zwei und drei Parametern")}${pill(1020, 812, 548, "NACHWEIS TROTZ n = 30 UNSICHER", C.failure, C.surface)}`);
  const rule = group("brake_rule", "Stichprobe reicht nicht automatisch", `${pill(510, 898, 900, "STICHPROBENGRÖSSE ≠ NACHWEISSICHERHEIT", C.failure, C.surface)}`);
  return { body: context + result + rule, targets: [target("brake_result", "Auswertung", ["negativen Schwellenwert"]), target("brake_rule", "Unsicherheit", ["kleine Stichprobe"])] };
}

function buildThreeParameterChallenge() {
  const negative = group("three_challenge_negative", "Negativer Schwellenwert", `${box(92, 206, 820, 610, C.surface, C.failure, 1.8, 14)}${image("media/negative-threshold.png", 122, 238, 760, 420, "Ergebnis mit negativem Schwellenwert")}${multi(132, 724, 700, "Negatives t₀ ist physikalisch nicht erklärbar.", 25, 800, C.failure)}`);
  const confidence = group("three_challenge_confidence", "Unsicherer Schwellenwert", `${box(948, 206, 880, 610, C.surface, C.accent, 1.8, 14)}${image("media/confidence-check.png", 978, 238, 820, 420, "Vertrauensbereich des Schwellenwerts")}${image("media/parameter-table.jpg", 1210, 654, 360, 112, "Parameterschätzung")}${multi(988, 790, 760, "Vertrauensbereich und Datenbasis gemeinsam prüfen.", 23, 760, C.deep)}`);
  const rule = group("three_challenge_rule", "Plausibilität vor Fit", `${pill(438, 866, 1044, "RECHNERISCH BESSER ≠ PHYSIKALISCH SINNVOLL", C.failure, C.surface)}`);
  return { body: negative + confidence + rule, targets: [target("three_challenge_negative", "Negatives t null", ["negativen Schwellenwert"]), target("three_challenge_confidence", "Vertrauensbereich", ["Stichprobe", "Unsicherheit"]), target("three_challenge_rule", "Plausibilitätsregel", ["physikalisch nicht sinnvoll"])] };
}

function buildMultipleModesTransition() {
  const joint = card("modes_transition_joint", 180, 292, 680, 420, "EIN FIT", "Alle Ausfälle gemeinsam", "Eine einzige Gerade soll unterschiedliche Mechanismen beschreiben.", { stroke: C.failure });
  const split = card("modes_transition_split", 1060, 292, 680, 420, "GETRENNT", "Ein Fit je Mechanismus", "Jeder Mechanismus erhält seine eigene Weibull-Verteilung.", { stroke: C.accent });
  const arrow = group("modes_transition_arrow", "Trennung", `${line(884, 502, 1036, 502, C.accent, 4, true)}${pill(854, 550, 212, "TRENNEN", C.accent, C.surface)}`);
  const signal = group("modes_transition_signal", "Knick als Signal", `${pill(510, 780, 900, "MEHRERE GERADEN = TRENNUNG PRÜFEN", C.failure, C.surface)}`);
  return { body: joint + split + arrow + signal, targets: [target("modes_transition_joint", "Gemeinsamer Fit", ["Liste von Ausfallzeiten"]), target("modes_transition_signal", "Knick", ["mehrere Geraden"]), target("modes_transition_arrow", "Trennen", ["getrennt"], "draw"), target("modes_transition_split", "Separate Fits", ["separat analysiert"])] };
}

function buildMultipleModes() {
  const plot = plotCard("multiple_modes_plot", plotHref("mechanism-split.svg"), 92, 188, 1190, 680, "Weibullnetz mit zwei Ausfallmechanismen");
  const diagnosis = card("multiple_modes_diagnosis", 1322, 220, 506, 230, "DIAGNOSE", "Mehrere lineare Bereiche", "Ein gemeinsamer Fit ist schlecht und die Prognosen werden ungenau.", { stroke: C.failure });
  const action = card("multiple_modes_action", 1322, 490, 506, 230, "MASSNAHME", "Mechanismen trennen", "Daten zuordnen und für jeden Mechanismus separat fitten.", { stroke: C.accent });
  const rule = group("multiple_modes_rule", "Ein Mechanismus, ein Fit", `${pill(1322, 792, 506, "1 MECHANISMUS = 1 FIT", C.educationAccent, C.surface)}`);
  return { body: plot + diagnosis + action + rule, targets: [target("multiple_modes_plot", "Mehrere Geraden", ["mehrere Geraden"]), target("multiple_modes_diagnosis", "Schlechter gemeinsamer Fit", ["Fit ist schlecht"]), target("multiple_modes_action", "Trennen", ["getrennt", "separat"]), target("multiple_modes_rule", "Regel", ["eigene Weibull-Verteilung"])] };
}

function buildExerciseFour() {
  const context = group("exercise_four_context", "Flugzeugfahrwerk", `${box(92, 206, 720, 650, C.surface, C.border, 1.5, 14)}${image("media/jet.jpg", 126, 236, 250, 500, "Verkehrsflugzeug")}${image("media/landing-gear.jpg", 400, 326, 366, 260, "Fahrwerksbaugruppe")}${pill(204, 770, 496, "AUSFÄLLE AM FAHRWERK", C.accent, C.surface)}`);
  const prompt = group("exercise_four_prompt", "Mehrere Mechanismen erkennen", `${box(852, 206, 976, 650, C.surface, C.accent, 1.8, 14)}${txt(892, 252, "ARBEITSAUFTRAG", 18, 850, C.accent)}${multi(892, 316, 880, "Mehrere Mechanismen erkennen", 30, 820, C.deep)}${bulletList(892, 456, 820, ["Gemeinsamen Weibull-Fit prüfen", "Knicke und Teilgeraden identifizieren", "Ausfälle nach Mechanismus zuordnen", "Separate Fits vergleichen"], C.accent, 23, 82)}`);
  const check = group("exercise_four_check", "Mechanismen statt Gesamtdaten", `${image("media/exercise-four-icon.png", 1510, 600, 220, 220, "Übungssymbol")}${pill(510, 894, 900, "MECHANISMUS VOR MODELL", C.failure, C.surface)}`);
  return { body: context + prompt + check, targets: [target("exercise_four_context", "Beispiel", ["konkretes Beispiel"]), target("exercise_four_prompt", "Analyseauftrag", ["Ausfallzeiten", "Weibull-Analyse"]), target("exercise_four_check", "Mechanismen prüfen", ["Ausfallmechanismen"])] };
}

function buildMultipleModesResult() {
  const joint = group("modes_result_joint", "Gemeinsamer Fit", `${box(92, 194, 780, 620, C.surface, C.failure, 1.8, 14)}${txt(132, 246, "GEMEINSAMER FIT", 18, 850, C.failure)}${image("media/joint-fit.png", 126, 280, 712, 480, "Gemeinsamer Weibull-Fit")}`);
  const split = group("modes_result_split", "Getrennte Fits", `${box(908, 194, 920, 620, C.surface, C.accent, 1.8, 14)}${txt(948, 246, "GETRENNTE MECHANISMEN", 18, 850, C.accent)}${image("media/result-a.png", 944, 286, 404, 430, "Erster Mechanismus")}${image("media/result-b.png", 1382, 286, 404, 430, "Zweiter Mechanismus")}${pill(1110, 746, 516, "PRÄZISERE PARAMETER", C.educationAccent, C.surface)}`);
  const rule = group("modes_result_rule", "Trennregel", `${box(92, 854, 1736, 88, C.accentSoft, C.accent, 1.8, 10)}${multi(960, 910, 1620, "Mechanismen getrennt auswerten → bessere Beschreibung und belastbarere Prognose", 25, 800, C.deep, "middle")}`);
  return { body: joint + split + rule, targets: [target("modes_result_joint", "Gemeinsamer Fit", ["gemeinsam"]), target("modes_result_split", "Getrennte Fits", ["getrennt", "separat"]), target("modes_result_rule", "Bessere Prognose", ["präzisere Beschreibung", "bessere Prognose"])] };
}

const BUILDERS = {
  intro: buildIntro,
  workflow: buildWorkflow,
  mechanisms_overview: buildMechanismsOverview,
  censored_overview: buildCensoredOverview,
  method_choice: buildMethodChoice,
  confidence_intro: buildConfidenceIntro,
  sample_population: buildSamplePopulation,
  confidence_meaning: buildConfidenceMeaning,
  confidence_drivers: buildConfidenceDrivers,
  probability_surface: buildProbabilitySurface,
  confidence_types: buildConfidenceTypes,
  life_data_sources: buildLifeDataSources,
  complete_data: buildCompleteData,
  right_censored: buildRightCensored,
  censoring_types: buildCensoringTypes,
  multiple_censoring: buildMultipleCensoring,
  interval_censoring: buildIntervalCensoring,
  mls_mle: buildMlsMle,
  exercise_bike_solution: buildExerciseBikeSolution,
  exercise_one: buildExerciseOne,
  exercise_confidence: buildExerciseConfidence,
  exercise_two: buildExerciseTwo,
  exercise_transition: buildExerciseTransition,
  exercise_censoring_compare: buildExerciseCensoringCompare,
  exercise_censoring_example: buildExerciseCensoringExample,
  exercise_three: buildExerciseThree,
  special_cases_transition: buildSpecialCasesTransition,
  three_parameter_intro: buildThreeParameterIntro,
  three_parameter_rules: buildThreeParameterRules,
  brake_example: buildBrakeExample,
  three_parameter_challenge: buildThreeParameterChallenge,
  multiple_modes_transition: buildMultipleModesTransition,
  multiple_modes: buildMultipleModes,
  exercise_four: buildExerciseFour,
  multiple_modes_result: buildMultipleModesResult,
};

function sourceEntry(slide) {
  const entry = textMap.mappings.find((item) => item.source_slide_number === slide);
  if (!entry) throw new Error(`Kein Sprechertext-Mapping für RE3::${slide}.`);
  return entry;
}

function spokenText(scene) {
  return sourceEntry(scene.primary_source_slide).spoken_text;
}

function sentenceList(text) {
  const paragraphs = String(text).split(/\n\s*\n/).map((value) => value.trim()).filter(Boolean);
  const sentences = paragraphs.flatMap((paragraph) => paragraph.match(/[^.!?]+[.!?]?/g) || [paragraph]).map((value) => value.trim()).filter(Boolean);
  return [...new Set(sentences)];
}

function normalizeKeywords(keywords) {
  return (Array.isArray(keywords) ? keywords : [keywords]).flat(Infinity).map((value) => String(value).toLocaleLowerCase("de-DE"));
}

function cue(scene, entry) {
  const text = spokenText(scene);
  const sentences = sentenceList(text);
  const needles = normalizeKeywords(CUE_HINTS[entry.id] || entry.keywords);
  for (const needle of needles) {
    const hit = sentences.find((sentence) => sentence.toLocaleLowerCase("de-DE").includes(needle));
    if (hit) return hit;
  }
  throw new Error(`Kein semantischer Sprechertext-Trigger für ${scene.work_unit}::${entry.id}.`);
}

function frame(scene, content) {
  const body = scene.animation_decision === "static"
    ? content.body.replace(/ data-anim-target="true" data-anim-label="[^"]*"/g, "")
    : content.body;
  const colors = [...new Set([C.accent, C.deep, C.secondary, C.success, C.failure, C.educationAccent, C.semanticSuccess, C.semanticWarning, C.border])]
    .filter((color) => body.includes(color));
  const markers = colors.map((color) => `<marker id="arrow_${color.slice(1)}" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto"><path d="M1 1L11 6L1 11Z" fill="${color}"/></marker>`).join("");
  const metadata = {
    artifactScope: "full-slide",
    embeddingTarget: "standalone-slide",
    slideType: scene.archetype,
    contentTitle: scene.title,
    layoutIntent: `re3-${scene.builder.replaceAll("_", "-")}-full-slide`,
    takeaway: scene.takeaway,
    density: ["worked-example", "exercise-solution", "mechanism-result", "multi-censoring"].includes(scene.archetype) ? "dense" : "balanced",
    contentMode: "full-slide",
    backgroundMode: "brand-frame",
    brandProfile: theme.brandProfile,
    brandVariant: theme.brandVariant,
    sourceSlides: scene.source_slides,
    sourceTextSection: scene.source_text_section_id,
    structureStatus: "deferred-by-user",
    officialLogoStatus: "downstream-owned",
  };
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-labelledby="accessible_title accessible_description" data-artifact-scope="full-slide" data-embedding-target="standalone-slide" data-scene-id="${scene.scene_id}" data-brand-profile="${theme.brandProfile}">
<metadata id="slide_quality_metadata" type="application/json"><![CDATA[${JSON.stringify(metadata)}]]></metadata>
<title id="accessible_title">${esc(scene.title)}</title><desc id="accessible_description">${esc(scene.takeaway)}</desc>
<defs><linearGradient id="backgroundGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${theme.background.start}"/><stop offset="56%" stop-color="${theme.background.mid}"/><stop offset="100%" stop-color="${theme.background.end}"/></linearGradient><pattern id="technicalGrid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke="${C.deep}" stroke-opacity=".035" stroke-width="1"/></pattern>${markers}</defs>
<style>text{font-family:${theme.bodyFontFamily};letter-spacing:0}</style>
<rect width="1920" height="1080" fill="url(#backgroundGradient)"/><rect width="1920" height="1080" fill="url(#technicalGrid)"/>
<g id="scene_content" data-qc-group="scene_content" data-qc-layer="content" data-source-ref="RE3::${scene.source_slides.join(",RE3::")}">${body}</g>
</svg>`;
}

function copyAsset(source, destination) {
  if (!fs.existsSync(source)) throw new Error(`Asset fehlt: ${source}`);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

function prepareAssets(scene) {
  const dir = path.join(outRoot, scene.work_unit);
  for (const [source, filename] of PLOT_BY_BUILDER[scene.builder] || []) {
    const destination = path.join(root, "analysis", "re3-assets", "plots", filename);
    copyAsset(source, destination);
    if (filename === "confidence.svg") {
      const visible = fs.readFileSync(destination, "utf8")
        .replace(/ opacity="0"(?=[^>]*data-animation-trigger-type="time")/g, ' opacity="1"')
        .replace(/<animate\b[^>]*\/>/g, "");
      fs.writeFileSync(destination, visible, "utf8");
    }
  }
  for (const [slide, sourceName, filename] of MEDIA[scene.builder] || []) {
    const source = path.join(sourceAssetRoot, `source_${String(slide).padStart(3, "0")}`, sourceName);
    copyAsset(source, path.join(dir, "media", filename));
  }
  if (scene.builder === "probability_surface") {
    copyAsset(path.join(root, "analysis", "re3-assets", "data", "failure_probability_surface.json"), path.join(dir, "data", "failure_probability_surface.json"));
  }
}

function writeManifest(scene, content) {
  const dir = path.join(outRoot, scene.work_unit);
  const staticScene = scene.animation_decision === "static";
  const targets = staticScene ? [] : content.targets.map((entry) => ({ targetId: entry.id, label: entry.label, status: "animated", visibleInEditor: true, render: true, confidence: "high" }));
  const resolved = staticScene ? [] : content.targets.map((entry, index) => {
    const sourceText = cue(scene, entry);
    return { entry, sourceText, sourceIndex: spokenText(scene).indexOf(sourceText), originalIndex: index };
  }).sort((a, b) => a.sourceIndex - b.sourceIndex || a.originalIndex - b.originalIndex);
  const steps = resolved.map(({ entry, sourceText }, index) => ({
    stepId: `step_${String(index + 1).padStart(2, "0")}_${entry.id}`,
    targetId: entry.id,
    action: entry.action,
    sourceText,
    occurrence: 1,
    confidence: "high",
    notes: entry.action === "draw" ? "Beziehung erscheint nach ihren fachlichen Endpunkten." : "Sprechertextgeführte semantische Gruppe.",
    ...(entry.action === "draw" ? { drawDurFrames: 42 } : { enterFrames: 16 }),
  }));
  const defaults = { enterFrames: 16, exitFrames: 12, highlightDurFrames: 30, drawDurFrames: 42, transformDurFrames: 30 };
  fs.writeFileSync(path.join(dir, "scene.animation.v1.json"), `${JSON.stringify({ schemaVersion: "svgAnimationManifest/v1", svgPath: `${scene.work_unit}.svg`, defaults, targets, steps }, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(dir, "element-animation-plan.json"), `${JSON.stringify({ schemaVersion: "elementAnimationPlan/v1", sceneId: scene.scene_id, decision: scene.animation_decision, defaults, targets, steps, notes: scene.notes || undefined }, null, 2)}\n`, "utf8");
}

function writeBrief(scene, content) {
  const sourceTitles = [...new Set(scene.source_slides.map((slide) => sourceEntry(slide).source_text_title))];
  const text = `# Redesign-Brief — ${scene.work_unit}

- Strukturstatus: Kapitel und Lektion noch nicht zugeordnet; Nutzervorgabe ausstehend
- Quellfolien: ${scene.source_slides.join(", ")}
- Sprechertext: ${scene.source_text_section_id} — ${sourceTitles.join(" / ")}
- Titel: ${scene.title}
- Takeaway: ${scene.takeaway}
- Archetyp: ${scene.archetype}
- Zielmodus: full_slide, 1920×1080
- Referenz-Lock: RE1 slide_009, slide_013, slide_027 und slide_064
- Farbdramaturgie: Navy-Tonalität für gleichrangige Inhalte; Grün, Gold und Koralle nur semantisch und sparsam
- Animation: ${scene.animation_decision === "static" ? "statisch — gelieferter Sprechertext enthält keine belastbaren Trigger" : "sprechertextgeführt; semantische Gruppen statt Einzelobjekt-Mikroanimation"}
- Quellenregel: PowerPoint-Sprechericons, gelbe Produktionsnotizen und Masterdekoration entfallen
- Assets: ${[...(PLOT_BY_BUILDER[scene.builder] || []), ...(MEDIA[scene.builder] || [])].length ? "bereinigte Quellmedien bzw. vorhandene Python-Plotassets in neuem Full-Slide-Layout" : "native SVG-Komposition"}
`;
  fs.writeFileSync(path.join(outRoot, scene.work_unit, "redesign-brief.md"), text, "utf8");
}

function selectedScenes() {
  const index = process.argv.indexOf("--slides");
  if (index < 0) return new Set(SCENES.map((scene) => scene.output_slide_number));
  const selected = new Set();
  for (const token of String(process.argv[index + 1] || "").split(",")) {
    const match = token.trim().match(/^(\d+)(?:-(\d+))?$/);
    if (!match) throw new Error(`Ungültige Folienauswahl: ${token}`);
    for (let slide = Number(match[1]); slide <= Number(match[2] || match[1]); slide += 1) selected.add(slide);
  }
  return selected;
}

function main() {
  const selected = selectedScenes();
  const generated = [];
  for (const scene of SCENES) {
    if (!selected.has(scene.output_slide_number)) continue;
    const builder = BUILDERS[scene.builder];
    if (!builder) throw new Error(`Builder fehlt: ${scene.builder}`);
    const dir = path.join(outRoot, scene.work_unit);
    fs.mkdirSync(dir, { recursive: true });
    prepareAssets(scene);
    const content = builder(scene);
    fs.writeFileSync(path.join(dir, `${scene.work_unit}.svg`), `${frame(scene, content)}\n`, "utf8");
    writeManifest(scene, content);
    writeBrief(scene, content);
    generated.push(scene.work_unit);
  }
  process.stdout.write(`Generated ${generated.length} RE3 scene(s): ${generated.join(", ")}.\n`);
}

main();
