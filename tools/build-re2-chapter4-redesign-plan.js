"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const inventory = require(path.join(root, "analysis", "inventories", "RE2_source-svg-inventory.json"));
const textMap = require(path.join(root, "analysis", "inventories", "RE2_svg-text-map.json"));
const rows = inventory.slides.filter((entry) => entry.source_slide_number >= 63 && entry.source_slide_number <= 165);
const mappingBySlide = new Map(textMap.mappings.map((entry) => [entry.source_slide_number, entry]));

function lesson(slide) {
  if (slide <= 71) return 1;
  if (slide <= 77) return 2;
  if (slide <= 90) return 3;
  if (slide <= 96) return 4;
  if (slide <= 111) return 5;
  if (slide <= 127) return 6;
  if (slide <= 131) return 7;
  if (slide <= 138) return 8;
  return 9;
}

function role(slide) {
  if ([63, 64].includes(slide)) return "title-question";
  if (slide === 65) return "definition";
  if ([66, 67, 71, 74, 75, 76, 81, 82, 92, 94, 98, 99, 100, 105, 109, 114, 115, 116, 117, 120, 122, 123, 124, 125, 126, 129, 130, 137, 139, 142, 155, 158, 162, 165].includes(slide)) return "structured-explanation";
  if ([68, 69, 70].includes(slide)) return "two-column-comparison";
  if ([72, 77, 90, 96, 111, 127, 131, 138].includes(slide)) return "process-overview";
  if ([73, 78, 91, 97, 112, 128, 132, 140, 141, 143, 144, 147, 148, 151, 152, 156, 157, 160, 161, 163, 164].includes(slide)) return "process-focus";
  if ([79, 80, 83, 84, 85, 88, 89, 93, 95, 101, 102, 106, 107, 108, 110].includes(slide)) return "hierarchy-tree";
  if ([86, 87].includes(slide)) return "technical-media";
  if ([103, 104, 118, 119, 121, 133, 134, 135, 136, 145, 146, 149, 150, 153, 154, 159].includes(slide)) return "source-asset-diagram";
  return "structured-explanation";
}

function assetStrategy(slide) {
  if ([86, 87].includes(slide)) return "extrahierte technische Quell-PNGs";
  if ([103, 104, 118, 119, 121, 133, 134, 135, 136, 142, 145, 146, 149, 150, 153, 154, 159].includes(slide)) return "extrahiertes bzw. sauber beschnittenes Quellasset";
  return "native RelTest-SVG-Komposition";
}

function animationDecision(slide) {
  if ([63, 64, 72, 73, 77, 78, 90, 91, 96, 97, 111, 112, 127, 128, 131, 132, 138, 140, 141, 143, 144, 147, 148, 151, 152, 156, 157, 160, 161, 163, 164].includes(slide)) return "static";
  return "animated";
}

const referenceLock = `# RE2 Kapitel 4 — Referenz-Lock

- Planungsmodus: \`module_redesign\`
- Zielmodus jeder Szene: \`full_slide\`, 1920×1080
- Referenzmodul: RE1, freigegebene Full-Slide-Szenen
- Konkrete Referenzen:
  - \`rebuild-proposals/svg/RE1/slide_013/slide_013.svg\` — Definition und ruhige Typohierarchie
  - \`rebuild-proposals/svg/RE1/slide_009/slide_009.svg\` — technische Hierarchie und Beziehungen
  - \`rebuild-proposals/svg/RE1/slide_027/slide_027.svg\` — dominante technische Erklärfläche
  - \`rebuild-proposals/svg/RE1/slide_022/slide_022.svg\` — Karten, Ziele und strukturierte Aussagen
- Wiederverwendung: heller technischer BrandFrame, dezentes 80-px-Raster, Cyan-Akzentlinie, linksbündige Titelzone, fester Footer, Deep-Navy-Typografie, 8-px-Kartenradien, 1,5–2,5-px-Standardverbinder.
- Logo: nur freigegebenes Originalasset; bis dahin \`officialLogoStatus=pending-original-asset\`.
- Bewusste Abweichung: dichte FMEA-Formblätter und Bewertungsmatrizen dürfen eine größere zusammenhängende Medienfläche erhalten.
`;

const sightingRows = rows.map((entry) => {
  const slide = entry.source_slide_number;
  const mapping = mappingBySlide.get(slide);
  const state = mapping?.shared_text_group ? `Aufbauzustand ${mapping.shared_text_group}` : "Einzelzustand";
  return `| ${slide} | ${lesson(slide)} | ${entry.visible_content_summary.replaceAll("|", "/")} | ${state} | ${role(slide)} | ${assetStrategy(slide)} | ${animationDecision(slide)} | 1:1 nach \`slide_${String(slide).padStart(3, "0")}\` |`;
}).join("\n");

const plan = `${referenceLock}

# RE2 Kapitel 4 — Redesign- und Produktionsplan

## Umfang und Regeln

- Quellfolien: 63–165
- Ziel: 103 eigenständige, gleich nummerierte Full-Slide-Szenen
- Lektionsgrenzen: 63–71, 72–77, 78–90, 91–96, 97–111, 112–127, 128–131, 132–138, 139–165
- Keine Quellfolie wird zusammengezogen oder übersprungen.
- Aufbau-, Fokus- und Rückblickzustände bleiben eigenständig.
- Wiederkehrende 7-Schritt-Leiste, Systembäume, Funktions-/Fehlerbäume, B/A/E-Bewertung und Design-/Prozessvergleich verwenden kanonische Komponenten.
- Konkrete technische Motive und dichte Quelltabellen werden als freigegebene Quellassets übernommen.

## Kapitelweite Archetypen

1. Titel/Leitfrage
2. Definition und strukturierte Kernaussagen
3. Zwei-Spalten-Vergleich
4. 7-Schritt-Prozessübersicht und Schritt-Fokus
5. System-, Funktions- und Fehlerbaum
6. Technisches Medienbeispiel Anpassungsgetriebe
7. Risikoformel, Kriterien- und Prioritätsmatrix
8. FMEA-Formblatt mit stufenweiser Bereichsaktivierung
9. Design-/Prozess-FMEA-Vergleich

## Vollständige Sichtung

| Quelle | Lektion | sichtbarer Schwerpunkt | Sequenzrolle | Archetyp | Assetstrategie | Animation | Ziel |
|---:|---:|---|---|---|---|---|---|
${sightingRows}

## Pilot-Gates

- Titel/Leitfrage: Folie 63
- Definition: Folie 65
- Strukturierte Aussagen: Folie 66
- Prozesskomponente: Folie 72
- Hierarchiebaum: Folie 83
- Technisches Medienbeispiel: Folie 86
- Funktions-/Fehlerlogik: Folie 98
- Risikobewertung: Folie 113
- Bewertungsmatrix: Folie 119
- Formel: Folie 120
- FMEA-Formblatt: Folie 133
- Design-/Prozessvergleich: Folie 139

Jeder Pilot wird statisch gerendert und gegen Quelle sowie die Referenzfolien geprüft, bevor sein Muster für weitere Szenen verwendet wird.
`;

fs.writeFileSync(
  path.join(root, "analysis", "rebuild-plans", "RE2_chapter_04_reference_lock.md"),
  `${referenceLock}\n`,
  "utf8",
);
fs.writeFileSync(
  path.join(root, "analysis", "rebuild-plans", "RE2_chapter_04_redesign_plan.md"),
  `${plan}\n`,
  "utf8",
);
process.stdout.write(`Wrote chapter-4 reference lock and ${rows.length}-row redesign plan.\n`);
