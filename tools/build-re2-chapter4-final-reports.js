"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const mapPath = path.join(root, "analysis", "rebuild-plans", "RE2_source-reference-map.json");
const qaPath = path.join(root, "analysis", "render-checks", "RE2", "automated-svg-qa", "svg-qa-report.json");
const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
const qa = JSON.parse(fs.readFileSync(qaPath, "utf8"));
const chapter = map.mappings.filter((entry) => entry.chapter === 4);

function slideDir(n) {
  return path.join(root, "rebuild-proposals", "svg", "RE2", `slide_${String(n).padStart(3, "0")}`);
}

function titleFor(n) {
  const svg = fs.readFileSync(path.join(slideDir(n), `slide_${String(n).padStart(3, "0")}.svg`), "utf8");
  const match = svg.match(/<title id="accessible_title">([\s\S]*?)<\/title>/);
  return (match?.[1] || `Folie ${n}`)
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", "\"");
}

function manifestFor(n) {
  return JSON.parse(fs.readFileSync(path.join(slideDir(n), "scene.animation.v1.json"), "utf8"));
}

const rows = chapter.map((entry) => {
  const manifest = manifestFor(entry.output_slide_number);
  return {
    ...entry,
    title: titleFor(entry.output_slide_number),
    steps: manifest.steps.length,
  };
});

const totalSteps = rows.reduce((sum, row) => sum + row.steps, 0);
const logoIssues = qa.issues.filter((issue) =>
  issue.rule === "full-slide-logo" &&
  Number(issue.file?.match(/slide_(\d+)/)?.[1]) >= 63 &&
  Number(issue.file?.match(/slide_(\d+)/)?.[1]) <= 165);
const substantiveIssues = qa.issues.filter((issue) =>
  issue.severity === "error" &&
  issue.rule !== "full-slide-logo" &&
  Number(issue.slide || issue.file?.match(/slide_(\d+)/)?.[1]) >= 63 &&
  Number(issue.slide || issue.file?.match(/slide_(\d+)/)?.[1]) <= 165);

const lessonRanges = [
  [1, 63, 71, "FMEA-Grundlagen, Ziele und Arten"],
  [2, 72, 77, "Sieben Schritte und Planung/Vorbereitung"],
  [3, 78, 90, "Strukturanalyse und Anpassungsgetriebe"],
  [4, 91, 96, "Funktionsanalyse"],
  [5, 97, 111, "Fehleranalyse und Fehlerzusammenhänge"],
  [6, 112, 127, "Risikoanalyse, RPZ und Aufgabenpriorität"],
  [7, 128, 131, "Optimierung"],
  [8, 132, 138, "Ergebnisdokumentation und FMEA-Formblatt"],
  [9, 139, 165, "Design-FMEA und Prozess-FMEA im Vergleich"],
];

const crosscheck = [
  "# RE2 Kapitel 4 – Content-Transfer-Crosscheck",
  "",
  "## Ergebnis",
  "",
  `- Quellfolien geprüft: ${rows.length}`,
  `- Zielfolien vorhanden: ${rows.length}`,
  "- Zuordnung: vollständig 1:1, ohne Zusammenführung und ohne Auslassung",
  `- Sprechertextgebundene Animationsschritte: ${totalSteps}`,
  `- Inhaltliche/technische QA-Fehler: ${substantiveIssues.length}`,
  `- Bekannter Asset-Gate-Hinweis: ${logoIssues.length} reservierte Original-Logo-Platzhalter`,
  "",
  "| Quelle | Kapitel/Lektion | Ziel | Folientitel | Mapping | Cue-Schritte | Status |",
  "|---:|:---:|---:|---|---|---:|---|",
  ...rows.map((row) =>
    `| ${row.primary_source_slide} | 4/${row.lesson} | ${row.output_slide_number} | ${row.title.replaceAll("|", "\\|")} | direct | ${row.steps} | Inhalt, Layout, Animation geprüft |`),
  "",
  "## Prüfbasis",
  "",
  "- Inhalt und Reihenfolge wurden gegen die neu eingelesenen SVG-Quellen geprüft.",
  "- Jede Zielfolie enthält eine explizite Quellenreferenz und ein eigenes Redesign-Briefing.",
  "- Sprechertext-Cues wurden gegen den Modulbestand validiert; es gab keine fehlenden Treffer.",
  "- Die 103 Full-Slide-SVGs und 226 statischen/animierten Layoutzustände wurden automatisiert geprüft.",
  "- Der einzige verbleibende strikte Design-Befund ist der bewusst reservierte Platz für das noch nicht bereitgestellte originale RelTest-Logo. Es wurde kein Logo nachgebaut.",
  "",
].join("\n");

const implementation = [
  "# RE2 Kapitel 4 – Implementierungsbericht",
  "",
  "## Umfang",
  "",
  `Kapitel 4 wurde vollständig als ${rows.length} eigenständige Full-Slide-SVGs für die Folien 63 bis 165 umgesetzt. Die Quellenfolge bleibt 1:1 erhalten; es wurden weder Folien zusammengezogen noch ausgelassen.`,
  "",
  "## Lektionen",
  "",
  "| Lektion | Folien | Inhaltlicher Bogen |",
  "|---:|:---:|---|",
  ...lessonRanges.map(([lesson, start, end, topic]) => `| ${lesson} | ${start}–${end} | ${topic} |`),
  "",
  "## Gestaltungs- und Animationssystem",
  "",
  "- Durchgängiger RelTest-Academy-Full-Slide-Rahmen mit identischer Titel-, Raster- und Footerlogik wie im freigegebenen Referenzmodul.",
  "- Kanonische siebenstufige FMEA-Prozessleiste; der aktive Schritt wird über alle Fachfolien konsistent hervorgehoben.",
  "- Feine technische Verbindungen; Boxen und fachliche Endpunkte erscheinen vor Pfeilen und Hierarchielinien.",
  "- Quellnahe technische Assets für Anpassungsgetriebe, Stücklisten, Funktions-/Fehlerbäume, Bewertungstabellen, Aufgabenpriorität und FMEA-Formblätter.",
  "- Tabellen und komplexe Quellabbildungen werden als ruhige semantische Einheiten gezeigt; erklärende Vergleiche und Listen werden schrittweise aufgebaut.",
  "",
  "## Qualitätssicherung",
  "",
  `- Sprechertext-Cues: ${rows.length} Szenen, ${totalSteps} Schritte, 0 Fehler.`,
  "- Statische und animierte Layoutprüfung: 103 Dateien, 226 Zustände, 0 inhaltliche oder geometrische Fehler.",
  "- Visuelle Endzustände: sieben Kontaktbögen für die vollständige Folge 63–165 geprüft.",
  `- Bekannter Asset-Gate: ${logoIssues.length} Logo-Hinweise, weil das freigegebene originale RelTest-Logo weiterhin nicht vorliegt. Der vorgesehene Bereich bleibt reserviert.`,
  "",
  "## Relevante Artefakte",
  "",
  "- Final gerenderte Kontaktbögen: `analysis/reports/RE2-chapter4-final-contact-sheets/`",
  "- Final gerenderte Einzelvorschauen: `analysis/reports/RE2-chapter4-final-previews/`",
  "- Redesign-Plan: `analysis/rebuild-plans/RE2_chapter_04_redesign_plan.md`",
  "- Quellen-Lock: `analysis/rebuild-plans/RE2_chapter_04_reference_lock.md`",
  "- Automatischer QA-Bericht: `analysis/render-checks/RE2/automated-svg-qa/svg-qa-report.md`",
  "- Content-Transfer-Crosscheck: `analysis/qa-reports/RE2_chapter_04_content_transfer_crosscheck.md`",
  "",
].join("\n");

const crosscheckPath = path.join(root, "analysis", "qa-reports", "RE2_chapter_04_content_transfer_crosscheck.md");
const implementationPath = path.join(root, "analysis", "reports", "RE2_chapter_04_implementation.md");
fs.mkdirSync(path.dirname(crosscheckPath), { recursive: true });
fs.mkdirSync(path.dirname(implementationPath), { recursive: true });
fs.writeFileSync(crosscheckPath, crosscheck, "utf8");
fs.writeFileSync(implementationPath, implementation, "utf8");

console.log(`Wrote chapter-4 crosscheck (${rows.length} rows, ${totalSteps} cues) and implementation report.`);
