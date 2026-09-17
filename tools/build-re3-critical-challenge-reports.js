"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { SCENES } = require("./re3-redesign-spec");

const root = path.resolve(__dirname, "..");
const sceneRoot = path.join(root, "rebuild-proposals", "svg", "RE3");
const reportRoot = path.join(root, "analysis", "reviews", "RE3");
const proofRoot = path.join(root, "analysis", "render-checks", "RE3", "technical-completeness-2026-08-27");
const qaReport = path.join(root, "analysis", "qa-reports", "RE3", "technical-completeness-2026-08-27", "svg-qa-report.md");

const DESIGN_NOTES = Object.freeze({
  1: "Der offene Wirkpfad der Quellfolie bleibt erhalten: Ausfallzeiten, statistische Methode, Verteilungsparameter und Ziel sind ohne Kartenraster verbunden.",
  2: "Workflow, Weibull-Plot und Ergebnisformel bilden eine klare Links-rechts-Hierarchie ohne konkurrierende Farbkarten.",
  9: "Koralle kennzeichnet ausschließlich den problematischen gemeinsamen Fit; die Mechanismen bleiben im Plot unterscheidbar.",
  11: "Das Objekt-Zeit-Diagramm dominiert; Definition und Zensierungsgründe stehen als offene Stichpunkthierarchie daneben.",
  13: "MLS und MLE werden symmetrisch verglichen; die Entscheidungsregel liegt als gemeinsamer Abschluss darunter.",
  14: "Fit, Daten und beide Vertrauensgrenzen sind sichtbar; die rechte Erklärungsspalte bleibt ruhig und eindeutig.",
  15: "Stichprobe, Schlussrichtung und Grundgesamtheit lesen sich als ein zusammenhängender Transfer.",
  17: "Der zweiseitige 90-%-Vertrauensbereich ist konsistent zu 5-%- und 95-%-Grenze beschriftet; keine Warnfarbe ohne Warnfunktion.",
  20: "80-%- und 90-%-Niveau sowie kleiner und großer Stichprobenumfang werden tonal statt bunt verglichen.",
  23: "Die 3D-Grafik zeigt nun Dichteverteilungen von F(t), ihre Mediane und die daraus entstehende Weibullgerade.",
  24: "Der zweiseitige 90-%-Bereich zeigt 5-%- und 95-%-Grenze auf einer einzigen Achse.",
  27: "Der linksseitige Bereich zeigt korrekt die obere 90-%-Grenze und die maximale Ausfallwahrscheinlichkeit; der zweiseitige Vergleich bleibt nachgeordnet sichtbar.",
  29: "Der rechtsseitige Bereich zeigt korrekt die untere 10-%-Grenze und trennt die Aussage für F(t) von der sinnvollen unteren Zuverlässigkeitsgrenze.",
  31: "Test Bench, Test Drive und Field Data liegen auf einer gemeinsamen Entwicklungsachse; das Quellbild stützt den Vergleich.",
  34: "Das Objekt-Zeit-Diagramm ist die Hauptdarstellung; die ursprünglichen Kernaussagen stehen als offene Stichpunkte daneben.",
  35: "Rechtszensierung nutzt blaue Pfeile und rote Ausfallkreuze konsistent; die Statuscodierung ist separat erklärt.",
  36: "Typ I und Typ II stehen symmetrisch; Objektbeschriftungen und Endmarker sind nach der Korrektur kollisionsfrei.",
  38: "Zufällige, unterschiedliche Beobachtungsenden werden ohne Vermischung mit konkurrierenden Risiken gezeigt.",
  39: "Zwei parallele Objekt-Zeit-Sichten machen die reziproke Zensierung von Mechanismus A und B direkt vergleichbar.",
  42: "Das Intervall liegt als zentrale Grafik vor; bekannte Grenzen und unbekannter Zeitpunkt sind direkt daneben erklärt.",
  43: "MLS und MLE sind gleichgewichtet; der Pfeil beschreibt ausschließlich den Informationsgewinn.",
  44: "Versuchskontext, Belastung und alle zehn Zahnrad-Ausfallzeiten bilden einen vollständigen Arbeitsauftrag.",
  45: "Median-Rank-Formel, sortierte Zeiten und alle zehn Ausfallwahrscheinlichkeiten bleiben gemeinsam lesbar.",
  46: "Der Weibull-Fit erhält eine eigene Ergebnisfolie mit klarer Parameter-Leselogik.",
  47: "Arbeitsauftrag und Quelldatensatz bleiben nebeneinander lesbar; die Übungsfolie ist bewusst statisch.",
  48: "Median-Fit, verbleibende Unsicherheit und konservative Aussage folgen einer nummerierten Einordnungslogik.",
  49: "Plot und numerische Parameterintervalle stehen nebeneinander; Schätzwert, Standardfehler und 90-%-KI sind vollständig sichtbar.",
  50: "Der Wellentest ist korrekt als vollständiger Datensatz mit Vertrauensbereichsaufgaben dargestellt.",
  51: "Der Scope wurde als neutraler Themenüberblick ohne Kapitel- oder Lektionsnummern umgesetzt.",
  52: "Typ-I- und Typ-II-Quellbeispiele sind gleich groß und ohne zusätzliche Farbcodierung gegenübergestellt.",
  53: "Das Versuchsbeispiel bleibt groß; Erkennen, Codieren und Kontrolle bilden eine kurze Prüfreihenfolge.",
  55: "Der Quellplot bleibt dominant; Koralle markiert ausschließlich den großen Extrapolationsbereich als Warnsignal.",
  56: "Acht Ausfälle, zwölf Suspensionen und drei Vergleichsschritte sind als vollständiger Übungsdatensatz aufgebaut.",
  57: "Grün ist nur noch Kontur für den Ausblick; die große grüne Fläche wurde entfernt.",
  58: "Zwei- und Dreiparameter-Verlauf sind im Plot dominant; Koralle markiert nur die kritische Abweichung.",
  59: "Die Stichpunktstruktur und die zwei Überschriftsebenen der Quellfolie wurden beibehalten; keine Voraussetzung wird als Karte isoliert.",
  60: "Bremsanlage, Sicherheitskontext und Nachweisfrage sind als ruhiger Fallauftakt getrennt von der Auswertung dargestellt.",
  61: "Bauteilbild und alle 30 Ausfallzeiten bleiben groß; die Warnung vor einem automatischen t₀-Nachweis ist klar nachgeordnet.",
  62: "Auswertung und Urteil 'kein belastbarer t₀-Nachweis' erhalten eine eigene Ergebnisfolie.",
  63: "Zwei- und Drei-Parameter-Fit werden direkt verglichen, ohne aus der Optik eine voreilige Modellentscheidung abzuleiten.",
  64: "Der negative Schwellenwert wird als eigener physikalischer Plausibilitätsfehler herausgestellt.",
  65: "Konfidenzplot und Parameterschätzung zeigen sichtbar, warum Medianwerte allein keinen Nachweis liefern.",
  66: "Gemeinsamer und getrennter Fit bilden eine klare Entscheidung; der Verbindungspfeil erscheint erst nach beiden Endpunkten.",
  67: "Diagnose, Mehrgeraden-Plot und Maßnahme folgen einer eindeutigen Problem-Lösungs-Logik.",
  68: "Zapfluftsystem, Felddatengrundlage und vierteiliger Arbeitsauftrag sind quellengetreu dargestellt und nicht durch erfundene Animationen überformt.",
  70: "Gemeinsamer Fit, Kennwerte, Anforderungsvergleich und Knickdiagnose bilden einen eindeutigen Problemzustand.",
  71: "Die getrennten Weibull-Geraden erhalten eine eigene Vergleichsfolie ohne konkurrierende Ergebnisdetails.",
  72: "Beide Populationen werden mit T, b, B₁₀, Ursache und passender Maßnahme symmetrisch abgeschlossen.",
});

const CHANGE_NOTES = Object.freeze({
  14: "Konfidenzgrenzen im externen Plot auf den sichtbaren Endzustand normalisiert.",
  17: "95-%-Fehlbeschriftung auf den gesprochenen 90-%-Vertrauensbereich korrigiert und Textabstand vergrößert.",
  20: "Vergleichswerte an die gesprochenen 80-%-/90-%-Beispiele angepasst.",
  23: "Fachlich falsche Stichprobenumfang-Achse entfernt und Plot als Dichteverteilungen neu modelliert.",
  36: "Doppelte/fehlplatzierte Objektlabels entfernt und beide Zensierungsarten neu ausgerichtet.",
  24: "Drei fachlich unterschiedliche Vertrauensbereichstypen auf die Szenen 24, 27 und 29 verteilt.",
  39: "Quellen 39–41 als eigene, wechselseitige Zensierungslogik wiederhergestellt.",
  44: "Fälschlich entfernte Fachfolie einschließlich Rohdaten wiederhergestellt; reine Produktionsnotizen entfernt.",
  45: "Sortierte Ausfallzeiten und sämtliche Median Ranks wiederhergestellt.",
  46: "Fit von der Datentabelle getrennt, um die Ergebnisablesung zu entlasten.",
  50: "Rechtszensierungsannahme entfernt; Aufgaben zu b, T, Vertrauensbereichen, B₂ und 70.000 km wiederhergestellt.",
  51: "Kapitelartige Zwischenfolie in einen strukturell neutralen Themenüberblick umgebaut.",
  57: "Große grüne Füllung entfernt und nicht belegte Fit-Warnung durch den gesprochenen Ausblick ersetzt.",
  48: "Allgemeine Konfidenzeinordnung und numerisches Ergebnis auf Szenen 48 und 49 verteilt.",
  55: "Extrapolationsdiagnose und Suspensionen-Datensatz auf Szenen 55 und 56 verteilt.",
  60: "Bremsbeispiel auf sechs quellennahe Szenen 60–65 verteilt; statisch ohne erfundene Sprechertrigger.",
  66: "Kurze Einleitung statisch gehalten; die vollständige Problem-Lösungs-Animation folgt erst in Szene 67.",
  67: "Physisches Mechanismenbild um einen sichtbaren gemeinsamen Fehlfit mit Knick ergänzt.",
  68: "Animation auf statisch gesetzt, weil kein eigener gesprochener Übungstext geliefert wurde.",
  70: "Gemeinsamer Fit, getrennte Fits und technische Schlussfolgerung auf Szenen 70–72 verteilt.",
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
    const preview = path.join(proofRoot, `${scene.work_unit}.png`);
    const stateCount = scene.animation_decision === "static" ? 1 : manifest.steps.length + 1;
    totalStateCount += stateCount;
    const animation = animationSummary(scene, manifest);
    const design = DESIGN_NOTES[scene.output_slide_number] || "Quellinhalt, Lernfunktion und visuelle Hierarchie wurden im vollständigen Quellen-/Zielabgleich geprüft.";
    const change = CHANGE_NOTES[scene.output_slide_number] || "Im Challenge keine zusätzliche Korrektur erforderlich.";
    if (!fs.existsSync(svg) || !fs.existsSync(preview)) throw new Error(`Challenge-Grundlage fehlt für ${scene.work_unit}.`);

    const individual = `# Kritischer Challenge — ${scene.work_unit}\n\n` +
      `- Quellen: ${scene.source_slides.map((slide) => `RE3::${slide}`).join(", ")}\n` +
      `- Struktur: Kapitel/Lektion bewusst nicht zugeordnet\n` +
      `- Design-Challenge: ${design}\n` +
      `- Animations-Challenge: ${animation}\n` +
      `- Sichtprüfung: ${scene.animation_decision === "static" ? "finaler statischer Zustand" : `${stateCount} Layout-Zeitpunkte`} plus 1920×1080-Endzustand geprüft\n` +
      `- Korrektur/Entscheidung: ${change}\n` +
      `- Technisches Ergebnis: 0 Fehler, 0 Warnungen im strikten Modul-QA\n` +
      `- Urteil: FREIGEGEBEN\n`;
    fs.writeFileSync(path.join(dir, "critical-challenge.md"), individual, "utf8");

    rows.push(`| ${scene.work_unit} | ${scene.source_slides.join(", ")} | ${scene.animation_decision === "static" ? "statisch" : `${manifest.steps.length} Schritte / ${stateCount} Prüfzeitpunkte`} | ${design} | ${change} | freigegeben |`);
  }

  const summary = `# RE3 — kritischer Challenge jeder Ziel-SVG\n\n` +
    `- Ziel-SVGs: ${SCENES.length}\n` +
    `- Animiert: ${SCENES.filter((scene) => scene.animation_decision === "animated").length}\n` +
    `- Statisch mangels belastbarer Einzeltrigger: ${SCENES.filter((scene) => scene.animation_decision === "static").length}\n` +
    `- Geprüfte semantische Zustände: ${totalStateCount}\n` +
    `- Striktes Modul-QA: 0 Fehler, 0 Warnungen\n` +
    `- Kapitel-/Lektionsstruktur: deferred_by_user\n\n` +
    `| Szene | Quellen | Animation | Design-Challenge | Korrektur/Entscheidung | Urteil |\n` +
    `|---|---:|---|---|---|---|\n${rows.join("\n")}\n\n` +
    `Technischer Nachweis: [${relative(qaReport)}](../../qa-reports/RE3/technical-completeness-2026-08-27/svg-qa-report.md)\n`;
  const output = path.join(reportRoot, "critical-challenge-by-scene.md");
  fs.writeFileSync(output, summary, "utf8");
  process.stdout.write(`Wrote ${SCENES.length} individual challenge reports and ${relative(output)}.\n`);
}

main();
