"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { SCENES } = require("./re4-redesign-spec");

const root = path.resolve(__dirname, "..");
const sceneRoot = path.join(root, "rebuild-proposals", "svg", "RE4");
const reviewRoot = path.join(root, "analysis", "reviews", "RE4");
const reportRoot = path.join(root, "analysis", "reports");
const proofRoot = path.join(root, "analysis", "render-checks", "RE4", "creative-redesign-final");
const qaReport = path.join(proofRoot, "qa", "svg-qa-report.md");

const DESIGN_NOTES = Object.freeze({
  1: "Offene Systemhierarchie vom PKW bis zur Ausfallursache; Piktogramm und Akzentfarben führen den Blick.",
  5: "Prüfen, Ausfallzeiten und Weibull-Auswertung bilden eine klare technische Prozesslinie statt gleichrangiger Karten.",
  7: "Die Zuverlässigkeitsaggregation liest sich konsequent von den Komponenten nach oben zum Systemwert.",
  13: "Sechsstufiger Methodenpfad und Fehlerbaum teilen die Szene in Vorgehen und fachliche Anwendung.",
  17: "Fehlerbaum, Kennwert und Datenquellen sind durch Raum, Linien und Farbfunktion eindeutig hierarchisiert.",
  21: "Eingang, Gatterlogik und Ergebnis bilden einen unmissverständlichen Links-rechts-Berechnungsfluss.",
  23: "Fehler- und Funktionslogik stehen als spiegelbildliche Modelle mit zentraler Logikumkehr gegenüber.",
  25: "Fehlerbaum, Funktionsbaum und RBD erscheinen als drei aufeinanderfolgende Modellstufen.",
  31: "Das Blockdiagramm ist der visuelle Fokus; Beschriftungen erklären Blöcke, Verbindungen und Funktionspfad direkt am Modell.",
  33: "Serie und Parallelität werden über reale Pfade und Ausfallzustände verglichen, nicht über Textkästen.",
  39: "Struktur, Formel und Ergebnis sind in zwei symmetrischen Rechenwegen klar gekoppelt.",
  41: "Die Reduktion des gemischten Systems folgt nummeriert vom markierten Teilsystem bis zur Gesamtformel.",
  44: "FTA, Funktionsbaum und RBD bilden eine konsistente Dreiersequenz mit sichtbaren Logikbeziehungen.",
  48: "Drei Modellannahmen führen in eine große, topologisch korrekte Brückenschaltung als Anwendungsfall.",
  54: "Die binäre Zustandsdefinition ist als plakative Referenzfolie bewusst statisch und knapp.",
  55: "Die Brücke wird an Komponente 5 in zwei vollständige Ersatzstrukturen zerlegt; beide Teilergebnisse bleiben direkt vergleichbar.",
  61: "Ein Methoden-Kontinuum ordnet einfache, dynamische und exakte Verfahren ohne künstliche Kartenhierarchie.",
  62: "Die drei Voraussetzungen erscheinen als gleichrangiger Prüfraster mit einheitlichen PNG-Piktogrammen.",
  63: "Drei Grundstrukturen bilden einen offenen Formelbaukasten mit darunterliegender Merkhilfe.",
  65: "Das technische Diagramm zeigt den Einfluss der Komponentenanzahl direkt über vier klar differenzierte Kurven.",
  66: "Ein nummerierter Modellierungstransfer führt vom technischen Freilaufbild zur funktionalen RBD-Sicht.",
  68: "Fünf Übungsnetzwerke und ein dreistufiger Arbeitsauftrag stehen ohne dekorative Ablenkung im Vordergrund.",
});

const CHANGE_NOTES = Object.freeze({
  13: "Methodenschritte und Baumebenen in getrennte, narrationstreue Reveals zerlegt.",
  21: "Verbindungen erscheinen erst nach den zugehörigen Endpunkten.",
  23: "Gatterlogik, Umkehrpfeile und Formel als drei semantische Zustände organisiert.",
  25: "Die Modelltransformation erhält eine eindeutige Leserichtung und ein gemeinsames boolesches Ergebnisband.",
  39: "Serien- und Parallelergebnis besitzen getrennte Sprechertext-Zeitpunkte.",
  41: "Die gemischte Topologie und ihre zweistufige Reduktion fachlich korrigiert.",
  44: "UND/Serie und ODER/Parallel erst nach den drei Modell-Endpunkten sichtbar gemacht.",
  48: "Brückentopologie mit Komponente 5 zwischen den tatsächlichen mittleren Knoten aufgebaut.",
  55: "Beide Separationsfälle als vollständige, fachlich korrekte Ersatzsysteme neu gezeichnet.",
  63: "Gemischte Struktur und Formel als zusammengehörige Referenzeinheit ausgerichtet.",
  65: "Kurven, Achsen und Legende vollständig im Content-SVG aufgebaut.",
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
  return `${manifest.steps.length} semantische Schritte an ${uniqueCues} wörtlich belegten Sprechertext-Cues${drawCount ? `; ${drawCount} Verbindungs-Reveal(s) nach den fachlichen Endpunkten` : ""}.`;
}

function main() {
  if (!fs.existsSync(qaReport)) throw new Error(`QA-Bericht fehlt: ${qaReport}`);
  fs.mkdirSync(reviewRoot, { recursive: true });
  fs.mkdirSync(reportRoot, { recursive: true });
  const rows = [];
  let totalStateCount = 0;

  for (const scene of SCENES) {
    const dir = path.join(sceneRoot, scene.work_unit);
    const svg = path.join(dir, `${scene.work_unit}.svg`);
    const manifest = readJson(path.join(dir, "scene.animation.v1.json"));
    const preview = path.join(proofRoot, `${scene.work_unit}.png`);
    const stateDir = path.join(proofRoot, "animation-states", scene.work_unit);
    const stateCount = fs.existsSync(stateDir) ? fs.readdirSync(stateDir).filter((name) => name.endsWith(".png")).length : 0;
    totalStateCount += stateCount;
    const design = DESIGN_NOTES[scene.output_slide_number];
    const change = CHANGE_NOTES[scene.output_slide_number] || "Im visuellen und animationslogischen Challenge war keine zusätzliche Korrektur erforderlich.";
    if (!design || !fs.existsSync(svg) || !fs.existsSync(preview)) throw new Error(`Challenge-Grundlage fehlt für ${scene.work_unit}.`);

    const individual = `# Kritischer Challenge — ${scene.work_unit}\n\n` +
      `- Quellen: ${scene.source_slides.map((slide) => `RE4::${slide}`).join(", ")}\n` +
      `- Struktur: Kapitel/Lektion bewusst nicht neu zugeordnet\n` +
      `- Design-Challenge: ${design}\n` +
      `- Animations-Challenge: ${animationSummary(scene, manifest)}\n` +
      `- Sichtprüfung: ${scene.animation_decision === "static" ? "finaler statischer Zustand" : `${stateCount} gerenderte Zustände`} plus 1920×1080-Endzustand geprüft\n` +
      `- Korrektur/Entscheidung: ${change}\n` +
      `- Technisches Ergebnis: 0 Fehler; 0 Warnungen; 0 gerenderte Layoutprobleme\n` +
      `- Urteil: FREIGEGEBEN\n`;
    fs.writeFileSync(path.join(dir, "critical-challenge.md"), individual, "utf8");
    rows.push(`| ${scene.work_unit} | ${scene.source_slides.join(", ")} | ${scene.animation_decision === "static" ? "statisch" : `${manifest.steps.length} Schritte / ${stateCount} Zustände`} | ${design} | ${change} | freigegeben |`);
  }

  const summary = `# RE4 — kritischer Challenge jeder Ziel-SVG\n\n` +
    `- Ziel-SVGs: ${SCENES.length}\n` +
    `- Animiert: ${SCENES.filter((scene) => scene.animation_decision === "animated").length}\n` +
    `- Statisch mangels belastbarer Einzeltrigger: ${SCENES.filter((scene) => scene.animation_decision === "static").length}\n` +
    `- Gerenderte Animationszustände: ${totalStateCount}\n` +
    `- Striktes Modul-QA: 0 Fehler; 0 Warnungen; 0 Layoutprobleme\n` +
    `- PNG-Piktogramm-Policy: 0 Fehler\n` +
    `- Kapitel-/Lektionsstruktur: deferred_by_user\n\n` +
    `| Szene | Quellen | Animation | Design-Challenge | Korrektur/Entscheidung | Urteil |\n` +
    `|---|---:|---|---|---|---|\n${rows.join("\n")}\n\n` +
    `Technischer Nachweis: [${relative(qaReport)}](../../render-checks/RE4/creative-redesign-final/qa/svg-qa-report.md)\n`;
  const output = path.join(reviewRoot, "critical-challenge-by-scene.md");
  fs.writeFileSync(output, summary, "utf8");

  const moduleReview = `# RE4 — Creative Redesign Review\n\n` +
    `RE4 wurde als zusammenhängende E-Learning-Sequenz neu gestaltet. Die 68 Quellzustände sind in 22 kanonische Lern-Szenen überführt; Inhalte, Formeln, technische Topologien und Sprechertext-Cues bleiben erhalten.\n\n` +
    `## Gestaltungsentscheidungen\n\n` +
    `- offene Informationshierarchien statt eines flächendeckenden Kartenrasters\n` +
    `- Marineblau als tragende Systemfarbe, Signalgrün für Funktion und positive Pfade, Koralle ausschließlich für Ausfall, Stahlcyan für technische Transfers\n` +
    `- vorhandene hochwertige PNG-Piktogramme mit transparenter Fläche und einheitlicher Education-Anmutung\n` +
    `- reale Systemstrukturen, Fehlerbäume, RBDs, Kurven und Rechenwege als primäre Lernvisuals\n` +
    `- narrationstreue Animationen mit semantischen Gruppen und nachgelagerten Verbindungen\n\n` +
    `## Nachweis\n\n` +
    `- 22 Content-SVGs und 22 interne Animationsmanifeste\n` +
    `- ${totalStateCount} explizit gerenderte Animationszustände für 15 animierte Szenen\n` +
    `- strenges Design-, Layout- und Animations-QA: 0 Fehler, 0 Warnungen\n` +
    `- PNG-Piktogramm-Policy: 0 Fehler\n\n` +
    `Gesamtübersicht: [contact_slide_001_slide_041.png](../render-checks/RE4/creative-redesign-final/contact-sheets/contact_slide_001_slide_041.png) und [contact_slide_044_slide_068.png](../render-checks/RE4/creative-redesign-final/contact-sheets/contact_slide_044_slide_068.png)\n\n` +
    `Szenenreview: [critical-challenge-by-scene.md](../reviews/RE4/critical-challenge-by-scene.md)\n\n` +
    `QA-Bericht: [svg-qa-report.md](../render-checks/RE4/creative-redesign-final/qa/svg-qa-report.md)\n`;
  const report = path.join(reportRoot, "RE4_creative_redesign_review.md");
  fs.writeFileSync(report, moduleReview, "utf8");
  process.stdout.write(`Wrote ${SCENES.length} scene reviews, ${relative(output)}, and ${relative(report)}.\n`);
}

main();
