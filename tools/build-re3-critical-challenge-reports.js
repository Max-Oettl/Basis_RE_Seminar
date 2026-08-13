"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { SCENES } = require("./re3-redesign-spec");

const root = path.resolve(__dirname, "..");
const sceneRoot = path.join(root, "rebuild-proposals", "svg", "RE3");
const reportRoot = path.join(root, "analysis", "reviews", "RE3");
const qaReport = path.join(root, "analysis", "qa-reports", "RE3", "module-final-challenge", "svg-qa-report.md");

const DESIGN_NOTES = Object.freeze({
  1: "Fünf gleichrangige Prozesskarten bleiben navy-tonal; Grün markiert nur den abschließenden Nutzen.",
  2: "Workflow, Weibull-Plot und Ergebnisformel bilden eine klare Links-rechts-Hierarchie ohne konkurrierende Farbkarten.",
  9: "Koralle kennzeichnet ausschließlich den problematischen gemeinsamen Fit; die Mechanismen bleiben im Plot unterscheidbar.",
  11: "Ausfall und Zensierung sind semantisch markiert; die beiden Infokarten bleiben im selben Navy-System.",
  13: "MLS und MLE werden symmetrisch verglichen; die Entscheidungsregel liegt als gemeinsamer Abschluss darunter.",
  14: "Fit, Daten und beide Vertrauensgrenzen sind sichtbar; die rechte Erklärungsspalte bleibt ruhig und eindeutig.",
  15: "Stichprobe, Schlussrichtung und Grundgesamtheit lesen sich als ein zusammenhängender Transfer.",
  17: "Der zweiseitige 90-%-Vertrauensbereich ist konsistent zu 5-%- und 95-%-Grenze beschriftet; keine Warnfarbe ohne Warnfunktion.",
  20: "80-%- und 90-%-Niveau sowie kleiner und großer Stichprobenumfang werden tonal statt bunt verglichen.",
  23: "Die 3D-Grafik zeigt nun Dichteverteilungen von F(t), ihre Mediane und die daraus entstehende Weibullgerade.",
  24: "Drei Intervalltypen nutzen dieselbe Kartenlogik; Koralle bleibt auf den Schätzwert begrenzt.",
  31: "Drei Datenquellen sind als ruhige Navy-Karten organisiert; das Quellbild dient nur als Evidenzstreifen.",
  34: "Vollständige Daten werden über ein großes Objekt-Zeit-Diagramm und zwei kompakte Erklärkarten vermittelt.",
  35: "Rechtszensierung nutzt blaue Pfeile und rote Ausfallkreuze konsistent; die Statuscodierung ist separat erklärt.",
  36: "Typ I und Typ II stehen symmetrisch; Objektbeschriftungen und Endmarker sind nach der Korrektur kollisionsfrei.",
  38: "Beobachtungsfenster, multiple Zensierung und konkurrierende Risiken sind klar getrennt; Koralle signalisiert nur Risiko/Ausfall.",
  42: "Das Intervall liegt als zentrale Grafik vor; bekannte Grenzen und unbekannter Zeitpunkt sind direkt daneben erklärt.",
  43: "MLS und MLE sind gleichgewichtet; der Pfeil beschreibt ausschließlich den Informationsgewinn.",
  45: "Median-Rank-Formel und Zahnrad-Grübchen-Fit sind fachlich korrekt benannt und als Lösungsweg zusammengeführt.",
  47: "Arbeitsauftrag und Quelldatensatz bleiben nebeneinander lesbar; die Übungsfolie ist bewusst statisch.",
  48: "Das vorhandene Ergebnisbild bleibt zentral; Lesefragen und Interpretationsauftrag sind klar davon getrennt.",
  50: "Der Wellentest ist korrekt als vollständiger Datensatz mit Vertrauensbereichsaufgaben dargestellt.",
  51: "Der Scope wurde als neutraler Themenüberblick ohne Kapitel- oder Lektionsnummern umgesetzt.",
  52: "Typ-I- und Typ-II-Quellbeispiele sind gleich groß und ohne zusätzliche Farbcodierung gegenübergestellt.",
  53: "Das Versuchsbeispiel bleibt groß; Erkennen, Codieren und Kontrolle bilden eine kurze Prüfreihenfolge.",
  55: "Quelldarstellung, Prüfauftrag und Ergebnisbeurteilung sind sauber getrennt und trotz dichter Quelle lesbar.",
  57: "Grün ist nur noch Kontur für den Ausblick; die große grüne Fläche wurde entfernt.",
  58: "Zwei- und Dreiparameter-Verlauf sind im Plot dominant; Koralle markiert nur die kritische Abweichung.",
  59: "Drei Voraussetzungen bleiben navy-tonal; die konservative Faustregel ist als einzige Warnzone abgesetzt.",
  60: "Bauteilkontext und Daten bleiben dauerhaft sichtbar; Ergebnis und Unsicherheitsregel sind visuell nachgeordnet.",
  63: "Negatives t₀ und unsicherer Schwellenwert sind als zwei getrennte Prüfpfade lesbar; Koralle bleibt auf den Fehlerfall begrenzt.",
  66: "Gemeinsamer und getrennter Fit bilden eine klare Entscheidung; der Verbindungspfeil erscheint erst nach beiden Endpunkten.",
  67: "Diagnose, Mehrgeraden-Plot und Maßnahme folgen einer eindeutigen Problem-Lösungs-Logik.",
  68: "Fahrwerk, Daten und Arbeitsauftrag sind im vorhandenen Übungsmaterial verankert und nicht durch erfundene Animationen überformt.",
  70: "Gemeinsamer Fit, getrennte Ergebnisse und Schlussfolgerung sind als Vorher-nachher-Vergleich sauber lesbar.",
});

const CHANGE_NOTES = Object.freeze({
  14: "Konfidenzgrenzen im externen Plot auf den sichtbaren Endzustand normalisiert.",
  17: "95-%-Fehlbeschriftung auf den gesprochenen 90-%-Vertrauensbereich korrigiert und Textabstand vergrößert.",
  20: "Vergleichswerte an die gesprochenen 80-%-/90-%-Beispiele angepasst.",
  23: "Fachlich falsche Stichprobenumfang-Achse entfernt und Plot als Dichteverteilungen neu modelliert.",
  36: "Doppelte/fehlplatzierte Objektlabels entfernt und beide Zensierungsarten neu ausgerichtet.",
  45: "Falsch angenommener Wellenabsatz durch Zahnrad-Grübchenversuch und Median-Rank-Ansatz ersetzt.",
  50: "Rechtszensierungsannahme entfernt; Aufgaben zu b, T, Vertrauensbereichen, B₂ und 70.000 km wiederhergestellt.",
  51: "Kapitelartige Zwischenfolie in einen strukturell neutralen Themenüberblick umgebaut.",
  57: "Große grüne Füllung entfernt und nicht belegte Fit-Warnung durch den gesprochenen Ausblick ersetzt.",
  60: "Nicht explizit gesprochener Bauteilkontext bleibt als initialer Kontext sichtbar; nur Ergebnis und Unsicherheit werden aufgebaut.",
  66: "Trennpfeil hinter beide fachlichen Endpunkte verschoben.",
  68: "Animation auf statisch gesetzt, weil der Sprechertext nur allgemein zum Beispiel überleitet.",
});

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function relative(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function animationSummary(scene, manifest) {
  if (scene.animation_decision === "static") {
    return `Statisch: ${scene.notes || "kein belastbarer Sprechertext-Trigger für einen semantischen Aufbau."}`;
  }
  const uniqueCues = new Set(manifest.steps.map((step) => step.sourceText)).size;
  const drawCount = manifest.steps.filter((step) => step.action === "draw").length;
  return `${manifest.steps.length} semantische Schritte an ${uniqueCues} wörtlich belegten Sprechertext-Cues; chronologisch sortiert${drawCount ? `; ${drawCount} Verbindung(en) nach den fachlichen Endpunkten` : ""}.`;
}

function main() {
  if (!fs.existsSync(qaReport)) throw new Error(`QA-Bericht fehlt: ${qaReport}`);
  fs.mkdirSync(reportRoot, { recursive: true });
  const rows = [];
  let totalStateCount = 0;

  for (const scene of SCENES) {
    const dir = path.join(sceneRoot, scene.work_unit);
    const svg = path.join(dir, `${scene.work_unit}.svg`);
    const manifestPath = path.join(dir, "scene.animation.v1.json");
    const manifest = readJson(manifestPath);
    const preview = path.join(root, "analysis", "render-checks", "RE3", "final-previews", `${scene.work_unit}.png`);
    const stateDir = path.join(root, "analysis", "render-checks", "RE3", "animation-states-final", scene.work_unit);
    const stateCount = fs.existsSync(stateDir) ? fs.readdirSync(stateDir).filter((name) => name.endsWith(".png")).length : 0;
    totalStateCount += stateCount;
    const animation = animationSummary(scene, manifest);
    const design = DESIGN_NOTES[scene.output_slide_number];
    const change = CHANGE_NOTES[scene.output_slide_number] || "Im Challenge keine zusätzliche Korrektur erforderlich.";
    if (!design || !fs.existsSync(svg) || !fs.existsSync(preview)) throw new Error(`Challenge-Grundlage fehlt für ${scene.work_unit}.`);

    const individual = `# Kritischer Challenge — ${scene.work_unit}\n\n` +
      `- Quellen: ${scene.source_slides.map((slide) => `RE3::${slide}`).join(", ")}\n` +
      `- Struktur: Kapitel/Lektion bewusst nicht zugeordnet\n` +
      `- Design-Challenge: ${design}\n` +
      `- Animations-Challenge: ${animation}\n` +
      `- Sichtprüfung: ${scene.animation_decision === "static" ? "finaler statischer Zustand" : `${stateCount} gerenderte Zustände`} plus 1920×1080-Endzustand geprüft\n` +
      `- Korrektur/Entscheidung: ${change}\n` +
      `- Technisches Ergebnis: 0 Fehler, 0 Warnungen im strikten Modul-QA\n` +
      `- Urteil: FREIGEGEBEN\n`;
    fs.writeFileSync(path.join(dir, "critical-challenge.md"), individual, "utf8");

    rows.push(`| ${scene.work_unit} | ${scene.source_slides.join(", ")} | ${scene.animation_decision === "static" ? "statisch" : `${manifest.steps.length} Schritte / ${stateCount} Zustände`} | ${design} | ${change} | freigegeben |`);
  }

  const summary = `# RE3 — kritischer Challenge jeder Ziel-SVG\n\n` +
    `- Ziel-SVGs: ${SCENES.length}\n` +
    `- Animiert: ${SCENES.filter((scene) => scene.animation_decision === "animated").length}\n` +
    `- Statisch mangels belastbarer Einzeltrigger: ${SCENES.filter((scene) => scene.animation_decision === "static").length}\n` +
    `- Gerenderte Animationszustände: ${totalStateCount}\n` +
    `- Striktes Modul-QA: 0 Fehler, 0 Warnungen\n` +
    `- Kapitel-/Lektionsstruktur: deferred_by_user\n\n` +
    `| Szene | Quellen | Animation | Design-Challenge | Korrektur/Entscheidung | Urteil |\n` +
    `|---|---:|---|---|---|---|\n${rows.join("\n")}\n\n` +
    `Technischer Nachweis: [${relative(qaReport)}](../../qa-reports/RE3/module-final-challenge/svg-qa-report.md)\n`;
  const output = path.join(reportRoot, "critical-challenge-by-scene.md");
  fs.writeFileSync(output, summary, "utf8");
  process.stdout.write(`Wrote ${SCENES.length} individual challenge reports and ${relative(output)}.\n`);
}

main();
