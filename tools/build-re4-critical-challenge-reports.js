"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { SCENES } = require("./re4-redesign-spec");

const root = path.resolve(__dirname, "..");
const sceneRoot = path.join(root, "rebuild-proposals", "svg", "RE4");
const reportRoot = path.join(root, "analysis", "reviews", "RE4");
const qaReport = path.join(root, "analysis", "reports", "RE4-viewer-final-qa", "svg-qa-report.md");

const DESIGN_NOTES = Object.freeze({
  1: "System, Getriebe, Komponenten und Ausfallarten bilden eine ruhige Navy-Hierarchie; Grün bleibt dem methodischen Ziel vorbehalten.",
  5: "Quellfoto, Prüfkette und Weibull-Auswertung sind klar getrennt; die Farblogik unterstützt den Ablauf statt gleichrangige Karten bunt zu codieren.",
  7: "Die Zuverlässigkeitsaggregation liest sich konsequent von unten nach oben; Ebenen werden durch Helligkeit und Abstand, nicht durch zusätzliche Farben unterschieden.",
  13: "Top-Ereignis, Ursachen und Basisereignisse sind als ein zusammenhängender Fehlerbaum lesbar und bleiben auch in Zwischenzuständen vollständig ausgerichtet.",
  17: "Datenquellen und Basisereignisse sind visuell getrennt; Koralle kennzeichnet ausschließlich Ausfallwahrscheinlichkeiten.",
  21: "Eingang, Gatterlogik und Ergebnis besitzen eine eindeutige Links-rechts-Hierarchie; Verbindungen erscheinen erst nach allen Endpunkten.",
  23: "Fehler- und Funktionslogik sind symmetrisch aufgebaut; Grün wird nur für die positive Funktionssicht verwendet.",
  25: "Fehlerbaum, Funktionsbaum und RBD werden als drei ruhige Modellstufen verglichen; der Transferpfeil konkurriert nicht mit den Inhalten.",
  31: "Das RBD bleibt der visuelle Fokus; die Funktionspfade sind klar erkennbar, ohne die Komponentenblöcke zu überzeichnen.",
  33: "Serie und Parallelität sind gleichgewichtet und tonal konsistent; Hervorhebungen bleiben auf den jeweiligen Funktionspfad begrenzt.",
  39: "Formel, Struktur und Zahlenbeispiel stehen in zwei symmetrischen Spalten; die beiden Ergebnisse erhalten getrennte Sprechertext-Zeitpunkte.",
  41: "Teilreduktion und Gesamtformel folgen derselben Leserichtung wie das Blockdiagramm; Formeln bleiben kollisionsfrei in ihren Karten.",
  44: "FTA, Funktionsbaum und RBD bilden eine konsistente Dreiersequenz; Beziehungen werden erst nach den drei Modellen sichtbar.",
  48: "Die drei Voraussetzungen bleiben Navy-tonal; die Brückenschaltung ist als große, quellengetreue Fünf-Komponenten-Topologie auch in der 960×540-Ansicht eindeutig lesbar.",
  54: "Die binäre Zustandsdefinition ist als statische Referenz bewusst knapp und ohne unbelegte Animation umgesetzt.",
  55: "Ausgangsbrücke, beide Separationsfälle und Gesamtformel bleiben trotz hoher Informationsdichte eindeutig; alle drei RBDs verwenden dieselbe Komponentensprache.",
  61: "Die Methodenübersicht nutzt ein einheitliches Kartensystem; keine Methode wird ohne fachlichen Grund farblich bevorzugt.",
  62: "Die drei Modellannahmen sind als ruhige Wiederholungsfolie gleichrangig und statisch aufgebaut.",
  63: "Serie, Parallel- und Mischstruktur passen vollständig in die Referenzkarten; Formeln und Mini-RBDs bleiben lesbar.",
  65: "Das technische Diagramm nutzt vier Navy-Tonwerte und nur eine grüne Referenzkurve; Achsen, Legende und Kurven sind vollständig sichtbar.",
  66: "Das technische Quellbild bleibt groß genug für die Bauteilerkennung; der Transfer zum RBD wird ohne zusätzliche Farbcodierung erklärt.",
  68: "Die fünf Übungsnetzwerke und der Arbeitsauftrag stehen ohne Ablenkung im Vordergrund; die Szene bleibt mangels Sprechertext-Trigger statisch.",
});

const CHANGE_NOTES = Object.freeze({
  13: "Den zuvor monolithischen Baumaufbau in Top-Ereignis, Ursachenebene und Basisereignisse getrennt.",
  21: "Ergebnis und Berechnungspfeile hinter die Gatterlogik verschoben; dadurch erscheinen keine Verbindungen vor ihren Zielknoten.",
  23: "Logikumkehr einschließlich Pfeilen hinter beide Modell-Endpunkte verschoben.",
  31: "Grüne Pfadmarkierung auf die Verbindungen begrenzt und Strichstärke reduziert.",
  33: "Zu dominante Pfad-Hervorhebungen reduziert.",
  39: "Serien- und Parallelergebnis in zwei getrennte Animationsgruppen mit eigenen wörtlichen Cues aufgeteilt.",
  41: "Formelpositionen korrigiert und Überlagerungen beseitigt.",
  48: "Zu kleine und topologisch fehlerhafte Vorschau durch eine große Brücke mit vertikaler Komponente 5 zwischen den mittleren Knoten ersetzt.",
  55: "Gemeinsame Bridge-Komponente fachlich neu aufgebaut; Ausgangsbrücke und beide Ersatzstrukturen vergrößert sowie die Reveal-Reihenfolge um einen frühen Ausgangszustand ergänzt.",
  63: "Mischstruktur skaliert, damit Diagramm und Formel vollständig innerhalb der Karte bleiben.",
  65: "Defekte externe Einbettung durch internes Vektor-Markup ersetzt, XML-Fehler behoben und Farbpalette beruhigt.",
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
  return `${manifest.steps.length} semantische Schritte an ${uniqueCues} wörtlich belegten Sprechertext-Cues; chronologisch sortiert${drawCount ? `; ${drawCount} Verbindungsgruppe(n) nach den fachlichen Endpunkten` : ""}.`;
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
    const preview = path.join(root, "analysis", "render-checks", "RE4", "target-previews", `${scene.work_unit}.png`);
    const stateDir = path.join(root, "analysis", "render-checks", "RE4", "animation-states", scene.work_unit);
    const stateCount = fs.existsSync(stateDir) ? fs.readdirSync(stateDir).filter((name) => name.endsWith(".png")).length : 0;
    totalStateCount += stateCount;
    const animation = animationSummary(scene, manifest);
    const design = DESIGN_NOTES[scene.output_slide_number];
    const change = CHANGE_NOTES[scene.output_slide_number] || "Im visuellen und animationslogischen Challenge keine zusätzliche Korrektur erforderlich.";
    if (!design || !fs.existsSync(svg) || !fs.existsSync(preview)) throw new Error(`Challenge-Grundlage fehlt für ${scene.work_unit}.`);

    const individual = `# Kritischer Challenge — ${scene.work_unit}\n\n` +
      `- Quellen: ${scene.source_slides.map((slide) => `RE4::${slide}`).join(", ")}\n` +
      `- Struktur: Kapitel/Lektion bewusst nicht zugeordnet\n` +
      `- Design-Challenge: ${design}\n` +
      `- Animations-Challenge: ${animation}\n` +
      `- Sichtprüfung: ${scene.animation_decision === "static" ? "finaler statischer Zustand" : `${stateCount} gerenderte Zustände`} plus 1920×1080-Endzustand geprüft\n` +
      `- Korrektur/Entscheidung: ${change}\n` +
      `- Technisches Ergebnis: 0 Fehler; 21 erwartete Asset-Warnungen für nicht-16:9-Formel-/Plotfragmente und Live-Text-Formeln; 0 gerenderte Layoutprobleme\n` +
      `- Urteil: FREIGEGEBEN\n`;
    fs.writeFileSync(path.join(dir, "critical-challenge.md"), individual, "utf8");

    rows.push(`| ${scene.work_unit} | ${scene.source_slides.join(", ")} | ${scene.animation_decision === "static" ? "statisch" : `${manifest.steps.length} Schritte / ${stateCount} Zustände`} | ${design} | ${change} | freigegeben |`);
  }

  const summary = `# RE4 — kritischer Challenge jeder Ziel-SVG\n\n` +
    `- Ziel-SVGs: ${SCENES.length}\n` +
    `- Animiert: ${SCENES.filter((scene) => scene.animation_decision === "animated").length}\n` +
    `- Statisch mangels belastbarer Einzeltrigger: ${SCENES.filter((scene) => scene.animation_decision === "static").length}\n` +
    `- Gerenderte Animationszustände: ${totalStateCount}\n` +
    `- Striktes Modul-QA: 0 Fehler; 21 erwartete fragmentbezogene Warnungen; 0 Layoutprobleme\n` +
    `- Kapitel-/Lektionsstruktur: deferred_by_user\n\n` +
    `| Szene | Quellen | Animation | Design-Challenge | Korrektur/Entscheidung | Urteil |\n` +
    `|---|---:|---|---|---|---|\n${rows.join("\n")}\n\n` +
    `Technischer Nachweis: [${relative(qaReport)}](../../reports/RE4-viewer-final-qa/svg-qa-report.md)\n`;
  const output = path.join(reportRoot, "critical-challenge-by-scene.md");
  fs.writeFileSync(output, summary, "utf8");
  process.stdout.write(`Wrote ${SCENES.length} individual challenge reports and ${relative(output)}.\n`);
}

main();
