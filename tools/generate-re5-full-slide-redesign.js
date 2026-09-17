"use strict";

const fs = require("node:fs");
const path = require("node:path");
const theme = require("./reltest-education-theme");

const root = path.resolve(__dirname, "..");
const outRoot = path.join(root, "rebuild-proposals", "svg", "RE5");
const planPath = path.join(root, "analysis", "rebuild-plans", "RE5_scene-plan.json");
const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const C = theme.colors;

function parseArgs(argv) {
  const args = { slides: "", animation: false };
  for (let index = 2; index < argv.length; index += 1) {
    if (argv[index] === "--with-animation") args.animation = true;
    else if (argv[index] === "--slides") args.slides = argv[++index];
  }
  if (!args.slides) throw new Error("Usage: node tools/generate-re5-full-slide-redesign.js --slides 1[,2] [--with-animation]");
  return args;
}

function slideNumbers(value) {
  return value.split(",").flatMap((part) => {
    const [start, end] = part.split("-").map(Number);
    return end ? Array.from({ length: end - start + 1 }, (_, offset) => start + offset) : [start];
  });
}

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function wrap(value, width, size) {
  const maxChars = Math.max(8, Math.floor(width / (size * 0.54)));
  const result = [];
  for (const explicit of String(value).split("\n")) {
    const words = explicit.split(/\s+/).filter(Boolean);
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (candidate.length > maxChars && line) {
        result.push(line);
        line = word;
      } else line = candidate;
    }
    if (line) result.push(line);
  }
  return result;
}

function txt(x, y, value, size = 24, weight = 650, fill = C.text, anchor = "start", attrs = "") {
  size = Math.max(18, size);
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true" ${attrs}>${esc(value)}</text>`;
}

function multi(x, y, width, value, size = 24, weight = 650, fill = C.text, anchor = "start", lineHeight = 1.25, attrs = "") {
  size = Math.max(18, size);
  const lines = wrap(value, width, size);
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true" ${attrs}>${lines.map((line, index) => `<tspan x="${x}" dy="${index ? size * lineHeight : 0}">${esc(line)}</tspan>`).join("")}</text>`;
}

function box(x, y, width, height, fill = C.surface, stroke = C.border, strokeWidth = 1.8, radius = 16, attrs = "") {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" data-qc-allow-overlap="true" ${attrs}/>`;
}

function line(x1, y1, x2, y2, stroke = C.deep, width = 3, arrow = false, dash = "", attrs = "") {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}${arrow ? ` marker-end="url(#arrow_${stroke.slice(1)})"` : ""} data-role="connector" data-qc-role="connector" data-qc-layer="connector" ${attrs}/>`;
}

function pathLine(d, stroke = C.deep, width = 3, arrow = false, dash = "", attrs = "") {
  return `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}${arrow ? ` marker-end="url(#arrow_${stroke.slice(1)})"` : ""} data-role="connector" data-qc-role="connector" data-qc-layer="connector" ${attrs}/>`;
}

function pill(x, y, width, label, options = {}) {
  const stroke = options.stroke || C.accent;
  const fill = options.fill || C.surface;
  const textFill = options.textFill || stroke;
  return `${box(x, y, width, options.height || 46, fill, stroke, options.strokeWidth || 1.8, 23)}${txt(x + width / 2, y + (options.height || 46) / 2 + 8, label, options.size || 18, 820, textFill, "middle")}`;
}

function card(x, y, width, height, eyebrow, heading, body = "", options = {}) {
  const stroke = options.stroke || C.accent;
  const fill = options.fill || C.surface;
  const headingY = y + (eyebrow ? 92 : 62);
  return `${box(x, y, width, height, fill, stroke, options.strokeWidth || 2, options.radius || 16)}${eyebrow ? txt(x + 34, y + 44, eyebrow, 17, 850, stroke) : ""}${multi(x + 34, headingY, width - 68, heading, options.headingSize || 28, 820, options.headingFill || C.deep, "start", 1.18)}${body ? multi(x + 34, headingY + (options.bodyOffset || 96), width - 68, body, options.bodySize || 21, 600, options.bodyFill || C.text, "start", 1.28) : ""}`;
}

function target(id, label, cue, body, action = "show") {
  return {
    body: `<g id="${id}" data-anim-target="true" data-anim-label="${esc(label)}" data-qc-group="${id}">${body}</g>`,
    target: { id, label, cue, action },
  };
}

function composeTargets(items) {
  return { body: items.map((item) => item.body).join(""), targets: items.map((item) => item.target) };
}

function bulletList(x, y, width, items, options = {}) {
  const gap = options.gap || 54;
  const size = options.size || 22;
  const color = options.color || C.text;
  return items.map((item, index) => {
    const yy = y + index * gap;
    return `<circle cx="${x}" cy="${yy - 7}" r="5" fill="${options.bullet || C.accent}"/>${multi(x + 20, yy, width - 20, item, size, 620, color, "start", 1.2)}`;
  }).join("");
}

function sectionTag(x, y, label, width = 260, color = C.accent) {
  return pill(x, y, width, label.toLocaleUpperCase("de-DE"), { stroke: color, size: 17, height: 42 });
}

function formulaAsset(scene, name, x, y, width, height, label = name) {
  const assetPath = path.join(outRoot, scene.work_unit, "formulas", `${name}.svg`);
  if (!fs.existsSync(assetPath)) throw new Error(`Formelasset fehlt: ${assetPath}`);
  const data = Buffer.from(fs.readFileSync(assetPath)).toString("base64");
  return `<image id="${name}" data-anim-target="true" data-anim-label="${esc(label)}" data-formula-asset="formulas/${name}.svg" href="data:image/svg+xml;base64,${data}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" data-qc-role="formula" data-qc-group="${name}"/>`;
}

function plotAsset(scene, name, x, y, width, height) {
  const assetPath = path.join(outRoot, scene.work_unit, "plots", `${name}.svg`);
  if (!fs.existsSync(assetPath)) throw new Error(`Plotasset fehlt: ${assetPath}`);
  const source = fs.readFileSync(assetPath, "utf8");
  const viewBox = source.match(/viewBox="([^"]+)"/)?.[1] || "0 0 1280 720";
  const inner = source
    .replace(/^.*?<svg\b[^>]*>/s, "")
    .replace(/<\/svg>\s*$/s, "")
    .replace(/<metadata\b[\s\S]*?<\/metadata>/g, "")
    .replace(/\s(?:ns\d+|xlink):href=/g, " href=");
  return `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet" data-plot-asset="plots/${name}.svg" data-qc-role="plot" data-qc-allow-overlap="true" data-qc-allow-hidden="true">${inner}</svg>`;
}

function defs() {
  const colors = [C.deep, C.accent, C.educationAccent];
  return `<defs><linearGradient id="backgroundGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="56%" stop-color="#F7F9FC"/><stop offset="100%" stop-color="#E8E9EE"/></linearGradient><pattern id="technicalGrid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke="#031334" stroke-opacity=".035" stroke-width="1"/></pattern>${colors.map((color) => `<marker id="arrow_${color.slice(1)}" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto"><path d="M1 1L11 6L1 11Z" fill="${color}"/></marker>`).join("")}</defs>`;
}

function sceneSvg(scene, build) {
  const denseBuilders = new Set(["sample_size_table", "strategy_comparison", "strategy_guideline"]);
  const metadata = {
    artifactScope: "full-slide",
    embeddingTarget: "standalone-slide",
    slideType: scene.archetype,
    contentTitle: scene.title,
    layoutIntent: `re5-${scene.builder}-full-slide`,
    takeaway: scene.takeaway,
    density: scene.plot_strategy !== "none" || scene.formula_strategy.length || denseBuilders.has(scene.builder) ? "dense" : "balanced",
    contentMode: "full-slide",
    backgroundMode: "brand-frame",
    brandProfile: "reltest-education",
    brandVariant: "education-production",
    sourceSlides: scene.source_slides,
    sourceTextSection: scene.source_text_section_id,
    chapter: scene.chapter,
    lesson: scene.lesson,
    officialLogoStatus: "downstream-owned",
    downstreamOwned: ["visible_title", "title_rule", "footer", "logo", "scene_id"],
    referenceLock: ["RE4::1", "RE4::13", "RE4::48", "RE4::65"],
  };
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-labelledby="accessible_title accessible_description" data-artifact-scope="full-slide" data-embedding-target="standalone-slide" data-scene-id="${scene.scene_id}" data-brand-profile="reltest-education">\n<metadata id="slide_quality_metadata" type="application/json"><![CDATA[${JSON.stringify(metadata)}]]></metadata>\n<title id="accessible_title">${esc(scene.title)}</title><desc id="accessible_description">${esc(scene.takeaway)}</desc>\n${defs()}\n<style>text{font-family:"Archivo",Arial,Helvetica,sans-serif;letter-spacing:0}.display{font-family:"Oxanium","Archivo",Arial,sans-serif}</style>\n<rect width="1920" height="1080" fill="url(#backgroundGradient)"/><rect width="1920" height="1080" fill="url(#technicalGrid)"/>\n<g id="scene_content" data-qc-group="scene_content" data-qc-layer="content" data-source-evidence="source-svg+spoken-text" data-source-reference="${scene.source_slides.map((slide) => `RE5::${slide}`).join(",")}">${build.body}</g>\n</svg>\n`;
}

function uniqueCue(text, cue) {
  const count = text.split(cue).length - 1;
  if (count !== 1) throw new Error(`Triggerphrase für ${cue} ist ${count}x in der Szene vorhanden.`);
  return cue;
}

function manifest(scene, targets, withAnimation) {
  if (!withAnimation || scene.animation_decision === "static") {
    return {
      schemaVersion: "svgAnimationManifest/v1",
      svgPath: `${scene.work_unit}.svg`,
      defaults: { enterFrames: 16, exitFrames: 12, highlightDurFrames: 30, drawDurFrames: 42, transformDurFrames: 30 },
      targets: [],
      steps: [],
    };
  }
  return {
    schemaVersion: "svgAnimationManifest/v1",
    svgPath: `${scene.work_unit}.svg`,
    defaults: { enterFrames: 16, exitFrames: 12, highlightDurFrames: 30, drawDurFrames: 42, transformDurFrames: 30 },
    targets: targets.map((item) => ({ targetId: item.id, label: item.label, status: "animated", visibleInEditor: true, render: true, confidence: "high" })),
    steps: targets.map((item, index) => ({
      stepId: `step_${String(index + 1).padStart(2, "0")}_${item.id}`,
      targetId: item.id,
      action: item.action,
      sourceText: uniqueCue(scene.spoken_text, item.cue),
      occurrence: 1,
      confidence: "high",
      notes: "Sprechertextgeführte, fachlich vollständige Gruppe.",
      ...(item.action === "draw" ? { durFrames: 42, drawStyle: "stroke", direction: "forward" } : item.action === "highlight" ? { durFrames: 30, stroke: C.educationAccent, strokeWidth: 4 } : { enterFrames: 16 }),
    })),
  };
}

function sceneBrief(scene, build, withAnimation) {
  return `# Redesign-Brief · ${scene.scene_id}\n\n- Modul: RE5\n- Quellfolien: ${scene.source_slides.join(", ")}\n- Kapitel/Lektion: ${scene.chapter}/${scene.lesson}\n- Ausgabemodus: full_slide im module_redesign\n- Referenz-Lock: RE4::1, RE4::13, RE4::48, RE4::65\n- Archetyp: ${scene.archetype}\n- Lernbotschaft: ${scene.takeaway}\n- Titelbehandlung: kein sichtbarer globaler Titel; Downstream-System ergänzt Titel, Regel, Footer, Logo und Szenenkennung.\n- Inhaltsäquivalenz: Begriffe, Zahlen, Formeln, Plotbeziehungen und fachliche Zustände der Quellen ${scene.source_slides.join(", ")} bleiben in der Zielkomposition erhalten.\n- Spezialpfade: Plot=${scene.plot_strategy}; Formeln=${scene.formula_strategy.join(", ") || "keine"}; neue Piktogramme=keine.\n- Assetentscheidung: technische Achsdiagramme aus Python, nicht triviale Formeln als lokale pfadbasierte Formel-SVGs, übrige Beziehungen nativ im SVG.\n- Animation: ${scene.animation_decision}${withAnimation ? " umgesetzt" : " nach statischer Freigabe ausstehend"}; semantische Gruppen=${build.targets.map((targetItem) => targetItem.id).join(", ") || "keine"}.\n- QA: Quelle/Ziel/Referenz bei 1920×1080 und 960×540, beidseitiger Inhaltsabgleich, Textfit, Kontrast, Plot-/Formelgeometrie und Animationszustände.\n`;
}

function writeScene(scene, build, withAnimation) {
  const dir = path.join(outRoot, scene.work_unit);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${scene.work_unit}.svg`), sceneSvg(scene, build), "utf8");
  fs.writeFileSync(path.join(dir, "scene.animation.v1.json"), `${JSON.stringify(manifest(scene, build.targets, withAnimation), null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(dir, "element-animation-plan.json"), `${JSON.stringify({ sceneId: scene.scene_id, decision: scene.animation_decision, staticGate: withAnimation ? "passed_before_animation" : "open", targets: build.targets }, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(dir, "redesign-brief.md"), sceneBrief(scene, build, withAnimation), "utf8");
}

function buildReliabilityManagement() {
  const phases = ["Planung", "Schwachstellenanalyse", "Erprobung & Nachweis", "Produktion", "Feldeinsatz"];
  const axis = phases.map((label, index) => {
    const x = 110 + index * 340;
    const focus = index === 1 || index === 2;
    return `${index < phases.length - 1 ? line(x + 268, 356, x + 326, 356, C.deep, 3, true) : ""}${box(x, 300, 270, 112, focus ? (index === 2 ? "#142452" : "#E6F6EE") : C.surface, focus ? (index === 2 ? "#142452" : C.educationAccent) : C.border, focus ? 3 : 1.6, 14)}${multi(x + 135, 342, 230, label, 22, 800, index === 2 ? C.surface : C.deep, "middle", 1.15)}`;
  }).join("");
  const management = target("management_phases", "Phasen des Zuverlässigkeitsmanagements", "Das Zuverlässigkeitsmanagement besteht aus mehreren Phasen", axis, "draw");
  const phaseThree = target("phase_three_tests", "Phase 3: Erprobung und Nachweis", "Wir befinden uns nun in Phase drei", `${card(790, 500, 650, 314, "PHASE 3", "Zuverlässigkeitserprobung & Nachweis", "Lebensdauertests · End-of-Life · Success Run\nProduktfreigabe mit belastbarer Aussage", { stroke: C.educationAccent, strokeWidth: 3, headingSize: 30 })}${pill(830, 734, 270, "FORMALER NACHWEIS", { stroke: C.educationAccent })}`);
  const phaseTwo = target("phase_two_tests", "Phase 2: Schwachstellenanalyse", "Aber auch in Phase zwei", `${card(110, 500, 610, 314, "PHASE 2", "Schwachstellenanalyse & Bewertung", "Qualitative Tests · HALT\nRisiken früh erkennen und Design verbessern", { stroke: C.accent, headingSize: 30 })}${pill(150, 734, 300, "RISIKEN IDENTIFIZIEREN", { stroke: C.accent })}`);
  return composeTargets([management, phaseThree, phaseTwo]);
}

function buildTestObjectives() {
  const data = [
    ["risk_identification", "Risiken identifizieren", "Erstens die Identifizierung von Risiken", "01", "Schwachstellen finden", "HALT · qualitative Methoden", C.accent],
    ["reliability_measurement", "Zuverlässigkeit messen", "Zweitens die Zuverlässigkeitsmessung", "02", "Ist-Zuverlässigkeit bestimmen", "End-of-Life · ALT · Degradation", C.deep],
    ["reliability_proof", "Zuverlässigkeit nachweisen", "Und drittens der Zuverlässigkeitsnachweis", "03", "Freigabe formal absichern", "Success Run · quantitative Lebensdauertests", C.educationAccent],
  ];
  return composeTargets(data.map((entry, index) => target(entry[0], entry[1], entry[2], card(92 + index * 586, 254, 540, 540, entry[3], entry[4], entry[5], { stroke: entry[6], strokeWidth: index === 2 ? 3 : 2, headingSize: 31, bodySize: 23, bodyOffset: 154 }))));
}

function buildDevelopmentTimeline() {
  const steps = ["Planung", "Konzeption", "Entwurf", "Design", "Produktion", "Feldeinsatz"];
  const axisBody = `${line(132, 360, 1770, 360, C.deep, 4, true)}${steps.map((label, index) => {
    const x = 155 + index * 300;
    return `${line(x, 345, x, 378, C.deep, 3)}${txt(x, 420, label, 20, 750, C.deep, "middle")}`;
  }).join("")}`;
  const axis = target("development_axis", "Entwicklungsprozess", "einzelnen Prozessschritte", axisBody, "draw");
  const qualitative = target("qualitative_window", "Qualitative Methoden", "Qualitative Methoden wie der Halt-Test", `${box(132, 492, 650, 118, "#FFFFFF", C.accent, 2.5, 14)}${txt(168, 538, "QUALITATIVE TESTS", 17, 850, C.accent)}${multi(168, 580, 560, "früh · Ursachen und Risiken aufdecken · Design verbessern", 21, 650, C.deep)}`);
  const quantitative = target("quantitative_window", "Quantitative Methoden", "Quantitative Methoden wie der End-of-Life Tests", `${box(650, 650, 760, 118, "#FFFFFF", C.deep, 2.5, 14)}${txt(686, 696, "QUANTITATIVE TESTS", 17, 850, C.deep)}${multi(686, 738, 680, "später · Lebensdauer und tatsächliche Zuverlässigkeit bestimmen", 21, 650, C.deep)}`);
  const proof = target("proof_window", "Nachweistests", "Für den formalen Nachweis", `${box(1230, 492, 540, 118, "#E6F6EE", C.educationAccent, 3, 14)}${txt(1266, 538, "NACHWEISTESTS", 17, 850, C.educationAccent)}${multi(1266, 580, 470, "Success Run oder quantitative Lebensdauertests", 21, 700, C.deep)}`);
  return composeTargets([axis, qualitative, quantitative, proof]);
}

function buildDualPlanning() {
  const technical = target("technical_planning", "Versuchstechnisch-messtechnische Planung", "Beginnen wir mit der versuchstechnisch-messtechnischen Planung", `${card(92, 230, 790, 520, "VERSUCHSTECHNISCH · MESSTECHNISCH", "Kontrollierte Prüfbedingungen", "Prüfstände und Messmittel\nBelastungen und Umgebungsbedingungen\nPrüfobjekte: Bauteile oder Systeme", { stroke: C.accent, headingSize: 32, bodySize: 23, bodyOffset: 124 })}${pill(132, 662, 390, "REPRODUZIERBAR & AUSSAGEKRÄFTIG", { stroke: C.accent })}`);
  const statistical = target("statistical_planning", "Statistische Planung", "Kommen wir nun zur statistischen Planung", `${card(1038, 230, 790, 520, "STATISTISCH", "Teststrategie und Versuchsaufwand", "Prüflingszahl n · Prüfdauer t\nLastniveaus x₀, x₁, x₂\nZufallsstichprobe und Versuchsablauf", { stroke: C.deep, headingSize: 32, bodySize: 23, bodyOffset: 124 })}${pill(1078, 662, 330, "AUFWAND · DAUER · KOSTEN", { stroke: C.deep })}`);
  const outcome = target("shared_outcome", "Gemeinsames Planungsergebnis", "Sie bilden die Grundlage", `${line(882, 476, 1038, 476, C.educationAccent, 4, true)}${box(444, 818, 1032, 82, "#142452", "#142452", 0, 16)}${txt(960, 869, "Realistische Tests + statistisch abgesicherte Ergebnisse", 27, 800, C.surface, "middle")}`);
  return composeTargets([technical, statistical, outcome]);
}

function buildStrategyDimensions() {
  const rows = [
    ["test_type", "Testart", "Erstens die Testart", "01", "Was wird beobachtet?", ["End-of-Life: bis zum Ausfall", "Success Run: feste Laufzeit ohne Ausfall", "Degradation: messbarer Verschleiß"]],
    ["censoring_type", "Zensierung", "Zweitens der Zensierungstyp", "02", "Wann endet der Test?", ["unzensiert: alle Ausfälle", "zensiert: Zeit oder Stückzahl begrenzt"]],
    ["acceleration_type", "Beschleunigung", "Und drittens die Beschleunigungsart", "03", "Unter welcher Belastung?", ["unbeschleunigt: Feldbedingungen", "beschleunigt: höhere Last oder Frequenz"]],
  ];
  return composeTargets(rows.map((row, index) => {
    const x = 92 + index * 586;
    return target(row[0], row[1], row[2], `${card(x, 238, 540, 560, row[3], row[4], "", { stroke: index === 2 ? C.educationAccent : C.deep, strokeWidth: index === 2 ? 3 : 2, headingSize: 30 })}${bulletList(x + 44, 488, 440, row[5], { gap: 78, size: 21, bullet: index === 2 ? C.educationAccent : C.accent })}`);
  }));
}

function buildStrategyTree() {
  const rootNode = target("strategy_root", "Testart wählen", "Wir starten mit der Testart", `${box(700, 206, 520, 86, "#142452", "#142452", 0, 14)}${txt(960, 260, "TESTART WÄHLEN", 24, 850, C.surface, "middle")}`);
  const endOfLife = target("end_of_life_branch", "End-of-Life-Zweig", "Ein End-of-Life Test kann vollständig durchgeführt werden", `${pathLine("M840 292V360H490V410", C.deep, 3)}${box(176, 410, 628, 246, C.surface, C.deep, 2, 16)}${txt(214, 458, "END-OF-LIFE", 18, 850, C.deep)}${pill(214, 500, 250, "VOLLSTÄNDIG", { stroke: C.deep })}${pill(486, 500, 230, "ZENSIERT", { stroke: C.deep })}${multi(214, 598, 500, "jeweils unbeschleunigt oder beschleunigt", 22, 650, C.text)}`);
  const success = target("success_run_branch", "Success-Run-Zweig", "Beim Success Run Test gilt die Definition", `${pathLine("M1080 292V360H1430V410", C.deep, 3)}${box(1116, 410, 628, 246, C.surface, C.educationAccent, 3, 16)}${txt(1154, 458, "SUCCESS RUN", 18, 850, C.educationAccent)}${multi(1154, 526, 520, "Kein Prüfling darf ausfallen.\nEnde nach festgelegter Laufzeit.", 24, 720, C.deep)}${pill(1154, 594, 300, "U · ODER · BESCHLEUNIGT", { stroke: C.educationAccent })}`);
  const configuration = target("test_configuration", "Testkonfiguration", "Ganz unten in der Grafik siehst du die Testkonfiguration", `${line(490, 656, 490, 754, C.deep, 3, true)}${line(1430, 656, 1430, 754, C.deep, 3, true)}${box(292, 770, 1336, 112, "#E8E9EE", C.border, 1.8, 16)}${txt(960, 816, "TESTKONFIGURATION", 17, 850, C.deep, "middle")}${txt(960, 856, "Prüflingszahl · Lastniveaus · Prüfdauer · Ablauf", 24, 750, C.deep, "middle")}`);
  return composeTargets([rootNode, endOfLife, success, configuration]);
}

function buildProofDefinition() {
  return { body: `${box(236, 272, 1448, 474, "#142452", "#142452", 0, 22)}${sectionTag(300, 332, "Zuverlässigkeitsnachweis", 340, C.educationAccent)}${multi(300, 448, 1280, "Wir zeigen, dass die Zuverlässigkeit des Produktes höher ist als die geforderte.", 42, 780, C.surface, "start", 1.18)}${line(300, 640, 1320, 640, C.educationAccent, 5, true)}${pill(1328, 616, 282, "ANFORDERUNG ERFÜLLT", { stroke: C.educationAccent, fill: C.surface, textFill: C.educationAccent })}`, targets: [] };
}

function plotShell(scene, name, leftBody, plotTargets, options = {}) {
  const plotX = options.plotX || 660;
  const plotY = options.plotY || 198;
  const plotW = options.plotW || 1168;
  const plotH = options.plotH || 700;
  const body = `${box(92, 220, 500, 620, C.surface, C.border, 1.6, 16)}${leftBody}${box(plotX, 190, plotW, 720, C.surface, C.border, 1.6, 16)}${plotAsset(scene, name, plotX + 20, plotY + 18, plotW - 40, plotH - 30)}`;
  return { body, targets: plotTargets };
}

function buildConfidenceRecap(scene) {
  const sample = target("sample_context", "Stichprobe und Grundgesamtheit", "Da diese Daten nur eine Stichprobe darstellen", `${sectionTag(132, 258, "Stichprobe → Grundgesamtheit", 392)}${multi(132, 352, 420, "Lebensdauerdaten liefern eine Weibull-Verteilung aus einer Stichprobe.", 25, 760, C.deep)}${multi(132, 500, 410, "Der Vertrauensbereich zeigt, wo die wahre Verteilung der Grundgesamtheit liegt.", 22, 620, C.text)}`);
  const shell = plotShell(scene, "weibull_confidence", sample.body, [
    sample.target,
    { id: "plot_weibull_fit", label: "Weibullgerade", cue: "erhalten wir eine Weibull-Verteilung", action: "draw" },
    { id: "plot_confidence_limits", label: "Vertrauensgrenzen", cue: "Der Vertrauensbereich wird durch zwei Vertrauensgrenzen definiert", action: "show" },
  ]);
  return shell;
}

function buildProofAcceptance(scene) {
  const requirement = target("requirement_parameters", "Anforderungsparameter", "Eine typische Anforderung besteht dabei aus drei Parametern", `${sectionTag(132, 254, "Anforderung", 220)}${txt(132, 360, "t = 10⁶ LW", 31, 820, C.deep)}${txt(132, 426, "R(t) = 90 %", 31, 820, C.deep)}${txt(132, 492, "P_A = 95 %", 31, 820, C.deep)}`);
  const targetPoint = target("plot_target_point", "Nachweispunkt", "Diesen Punkt können wir als Anforderung", `${circleTarget(1422, 520, C.warning || "#E9B400")}${pill(1260, 774, 350, "ZIELPUNKT · F(t)=10 %", { stroke: C.warning || "#E9B400" })}`);
  const result = target("acceptance_result", "Nachweis erfüllt", "Ist das der Fall, dann haben wir die Anforderung erfüllt", `${pill(132, 704, 400, "VERTRAUENSGRENZE RECHTS VOM ZIEL", { stroke: C.educationAccent, size: 16 })}${box(132, 774, 400, 64, "#E6F6EE", C.educationAccent, 2.5, 14)}${txt(332, 816, "ANFORDERUNG ERFÜLLT", 20, 850, C.educationAccent, "middle")}`);
  const shell = plotShell(scene, "weibull_confidence", `${requirement.body}${result.body}`, [
    requirement.target,
    targetPoint.target,
    { id: "plot_weibull_fit", label: "Weibullgerade", cue: "eine Weibull-Analyse durchführen", action: "draw" },
    { id: "plot_confidence_limits", label: "Vertrauensbereich", cue: "den gewünschten Vertrauensbereich", action: "show" },
    result.target,
  ]);
  shell.body += targetPoint.body;
  return shell;
}

function circleTarget(x, y, color) {
  return `<circle cx="${x}" cy="${y}" r="15" fill="#FFFFFF" stroke="${color}" stroke-width="5"/><line x1="${x - 28}" y1="${y}" x2="${x + 28}" y2="${y}" stroke="${color}" stroke-width="3"/><line x1="${x}" y1="${y - 28}" x2="${x}" y2="${y + 28}" stroke="${color}" stroke-width="3"/>`;
}

function buildProofAlternatives(scene) {
  const gap = target("proof_gap", "Nicht erfüllter Nachweis", "In diesem Fall können wir nur Folgendes nachweisen", `${sectionTag(132, 250, "Anforderung nicht erfüllt", 360, C.failure)}${multi(132, 342, 410, "Die 95%-Vertrauensgrenze liegt links vom Zielpunkt.", 24, 760, C.deep)}`);
  const alternatives = [
    target("lower_reliability", "Geringere Zuverlässigkeit", "Erstens – eine geringere Zuverlässigkeit", card(92, 620, 500, 244, "OPTION 1", "R(t) = 83 %", "gleiche Lebensdauer · höhere Ausfallwahrscheinlichkeit F(t)=17 %", { stroke: C.failure, headingSize: 31, bodySize: 20, bodyOffset: 92 })),
    target("shorter_lifetime", "Kürzere Lebensdauer", "Zweitens – eine geringere Lebensdauer", card(710, 620, 500, 244, "OPTION 2", "t = 6·10⁵ LW", "gleiche Zuverlässigkeit R(t)=90 %", { stroke: C.warning || "#E9B400", headingSize: 31, bodySize: 20, bodyOffset: 92 })),
    target("lower_confidence", "Geringere Aussagesicherheit", "Oder drittens – wir können das Ziel nur mit einer geringeren Aussagesicherheit", card(1328, 620, 500, 244, "OPTION 3", "P_A = 70 %", "gleiches Ziel · geringere Aussagesicherheit", { stroke: C.accent, headingSize: 31, bodySize: 20, bodyOffset: 92 })),
  ];
  return { body: `${box(92, 220, 500, 340, C.surface, C.border, 1.6, 16)}${gap.body}${box(660, 190, 1168, 390, C.surface, C.border, 1.6, 16)}${plotAsset(scene, "weibull_confidence", 690, 204, 1108, 350)}${alternatives.map((item) => item.body).join("")}`, targets: [gap.target, { id: "plot_confidence_limits", label: "Vertrauensgrenzen", cue: "höhere Ausfallwahrscheinlichkeit unter gleicher Lebensdauer", action: "show" }, ...alternatives.map((item) => item.target)] };
}

function buildSuccessRunProblem(scene) {
  const requirement = target("success_run_requirement", "Beispielanforderung", "Die Anforderung kann zum Beispiel so aussehen", `${card(92, 226, 538, 302, "ANFORDERUNG", "B10 = 200.000 km", "Mindestzuverlässigkeit R(t)=90 %\nAussagesicherheit P_A=95 %", { stroke: C.educationAccent, strokeWidth: 3, headingSize: 34, bodySize: 23, bodyOffset: 92 })}`);
  const zeroFailures = target("zero_failures", "Null Ausfälle", "Und während des Testlaufs darf kein einziger Prüfling ausfallen", `${card(92, 574, 538, 264, "SUCCESS RUN", "0 Ausfälle bis zur Zielzeit", "Jeder Prüfling muss die geforderte Lebensdauer erreichen.", { stroke: C.accent, headingSize: 30, bodySize: 21, bodyOffset: 88 })}`);
  const plot = target("proof_plot", "Bekannter Nachweis mit Weibullverteilung", "Wenn wir die Weibullverteilung samt Vertrauensbereich", `${box(684, 194, 1144, 548, C.surface, C.border, 1.6, 16)}${plotAsset(scene, "weibull_confidence", 714, 214, 1084, 500)}`, "draw");
  const missing = target("missing_weibull", "Fehlende Weibull-Auswertung", "Wenn kein Ausfall auftritt", `${box(684, 770, 542, 110, C.failureSoft, C.failure, 2.5, 14)}${multi(718, 814, 474, "Keine Ausfälle → keine Weibullgerade, kein Vertrauensbereich", 21, 760, C.deep)}`);
  const question = target("proof_question", "Zentrale Nachweisfrage", "Wie können wir aber trotzdem einen Nachweis führen", `${box(1260, 770, 568, 110, "#142452", "#142452", 0, 14)}${multi(1544, 812, 500, "Wie gelingt der formale Nachweis ohne einen einzigen Ausfall?", 22, 780, C.surface, "middle", 1.18)}`);
  return composeTargets([requirement, zeroFailures, plot, missing, question]);
}

function buildSuccessRunDerivation(scene) {
  const specimens = target("specimen_group", "n identische Prüflinge", "Stellen wir uns n identische Prüflinge", `${sectionTag(92, 224, "n identische Prüflinge", 330)}${Array.from({ length: 7 }, (_, index) => `${box(108 + index * 63, 318, 46, 82, index < 6 ? C.surface : "#E6F6EE", index < 6 ? C.deep : C.educationAccent, 2, 10)}${txt(131 + index * 63, 371, index < 6 ? String(index + 1) : "n", 21, 820, C.deep, "middle")}`).join("")}${multi(92, 464, 500, "Jeder Prüfling besitzt dieselbe Zuverlässigkeit R(t).", 24, 720, C.deep)}`);
  const groupFormula = target("group_survival_block", "Gruppenüberleben", "Die Wahrscheinlichkeit, dass alle n Prüflinge", `${box(662, 218, 520, 238, C.surface, C.accent, 2.5, 16)}${txt(700, 266, "GRUPPENÜBERLEBEN", 17, 850, C.accent)}${formulaAsset(scene, "group_survival", 704, 302, 436, 110, "P(0 Ausfälle)=R(t)^n")}`);
  const alpha = target("alpha_formula", "Irrtumswahrscheinlichkeit", "Damit gilt: Alpha gleich R von t hoch n", `${box(1248, 218, 580, 238, C.surface, C.warning || "#E9B400", 2.5, 16)}${txt(1286, 266, "IRRTUMSWAHRSCHEINLICHKEIT", 17, 850, C.warning || "#E9B400")}${formulaAsset(scene, "alpha_relation", 1292, 302, 492, 110, "Alpha=R(t)^n")}`);
  const equation = target("success_run_formula", "Success-Run-Gleichung", "Setzen wir nun für Alpha R von t hoch n ein", `${box(420, 570, 1080, 252, C.surface, C.educationAccent, 3, 20)}${txt(960, 626, "SUCCESS-RUN-GLEICHUNG", 19, 850, C.educationAccent, "middle")}${formulaAsset(scene, "success_run", 610, 656, 700, 118, "P_A=1-R(t)^n")}`);
  return composeTargets([specimens, groupFormula, alpha, equation]);
}

function buildSampleSizeExample(scene) {
  const requirement = target("requirement_block", "Getriebeanforderung", "Im Lastenheft für ein Fahrzeuggetriebe", `${card(92, 218, 520, 584, "FAHRZEUGGETRIEBE", "Gesucht: Stichprobenumfang n", "B10 ≥ 250.000 km\nR(t) = 90 %\nP_A = 95 %\n0 Ausfälle bis zur Zielzeit", { stroke: C.deep, headingSize: 30, bodySize: 25, bodyOffset: 126 })}`);
  const formula = target("sample_size_formula", "Nach n umgestellte Gleichung", "Nun stellen wir die Gleichung nach der Stichprobengröße n um", `${box(682, 218, 1146, 244, C.surface, C.accent, 2.5, 16)}${txt(724, 268, "NACH n UMSTELLEN", 17, 850, C.accent)}${formulaAsset(scene, "sample_size", 852, 302, 806, 118, "Stichprobenformel")}`);
  const substitution = target("substitution", "Werte einsetzen", "Setzen wir die geforderten Werte ein", `${box(682, 506, 1146, 180, C.surface, C.border, 1.8, 16)}${formulaAsset(scene, "sample_size_example", 798, 536, 914, 118, "Einsetzen der Werte")}`);
  const result = target("sample_size_result", "29 Prüflinge", "benötigen wir neunundzwanzig Prüflinge", `${box(682, 730, 1146, 122, "#E6F6EE", C.educationAccent, 3, 16)}${txt(742, 806, "AUFRUNDEN", 18, 850, C.educationAccent)}${txt(1772, 810, "n = 29 Prüflinge", 35, 850, C.deep, "end")}`);
  return composeTargets([requirement, formula, substitution, result]);
}

function successRunN(confidence, reliability) {
  return Math.ceil(Math.log(1 - confidence) / Math.log(reliability));
}

function buildSampleSizeTable() {
  const reliabilities = [0.80, 0.85, 0.90, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99, 0.995];
  const confidences = [0.80, 0.85, 0.90, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99, 0.995];
  const x0 = 270;
  const y0 = 236;
  const cellW = 120;
  const cellH = 47;
  const decimal = (value) => value.toLocaleString("de-DE", { minimumFractionDigits: value === 0.995 ? 3 : 2, maximumFractionDigits: 3 });
  const table = `${box(74, 170, 1772, 690, C.surface, C.border, 1.6, 18, 'data-role="table-background"')}${box(92, y0 - cellH, 178, cellH, "#142452", "#FFFFFF", 1, 0, 'data-role="table-header"')}${txt(181, y0 - 17, "P_A ↓   R →", 18, 850, C.surface, "middle")}${reliabilities.map((value, col) => `${box(x0 + col * cellW, y0 - cellH, cellW, cellH, "#142452", "#FFFFFF", 1, 0, 'data-role="table-header"')}${txt(x0 + col * cellW + cellW / 2, y0 - 17, decimal(value), 18, 820, C.surface, "middle")}`).join("")}${confidences.map((confidence, row) => `${box(92, y0 + row * cellH, 178, cellH, row % 2 ? "#F7F9FC" : "#E8E9EE", C.border, 1, 0, 'data-role="table-header"')}${txt(181, y0 + row * cellH + 30, decimal(confidence), 18, 820, C.deep, "middle")}${reliabilities.map((reliability, col) => {
    const value = successRunN(confidence, reliability);
    const highlight = (confidence === 0.90 && (reliability === 0.90 || reliability === 0.95)) || (confidence === 0.95 && (reliability === 0.95 || reliability === 0.99));
    return `${box(x0 + col * cellW, y0 + row * cellH, cellW, cellH, highlight ? "#E6F6EE" : row % 2 ? "#FFFFFF" : "#F7F9FC", highlight ? C.educationAccent : C.border, highlight ? 3 : 1, 0, 'data-role="table-cell"')}${txt(x0 + col * cellW + cellW / 2, y0 + row * cellH + 30, String(value), highlight ? 20 : 18, highlight ? 850 : 700, C.deep, "middle")}`;
  }).join("")}`).join("")}`;
  const lookup = target("lookup_table", "Stichprobentabelle", "Die Tabelle zeigt verschiedene Kombinationen", table, "show");
  const a = target("example_90_90", "90/90-Beispiel", "In diesem Fall benötigen wir zweiundzwanzig Prüflinge", pill(92, 894, 356, "90 / 90 → n=22", { stroke: C.deep, size: 20 }));
  const b = target("example_95_90", "95/90-Beispiel", "Nun steigt die erforderliche Stichprobengröße bereits auf fünfundvierzig Prüflinge", pill(486, 894, 356, "90 / 95 → n=45", { stroke: C.accent, size: 20 }));
  const c = target("example_95_95", "95/95-Beispiel", "benötigen wir schon neunundfünfzig Prüflinge", pill(880, 894, 356, "95 / 95 → n=59", { stroke: C.educationAccent, size: 20 }));
  const d = target("example_99_95", "99/95-Beispiel", "steigt die Zahl sogar auf zweihundertneunundneunzig Prüflinge", pill(1274, 894, 554, "95 / 99 → n=299", { stroke: C.failure, size: 20 }));
  return composeTargets([lookup, a, b, c, d]);
}

function buildSuccessRunCurves(scene) {
  const plot = target("success_run_plot", "Success-Run-Kurven", "Wir sehen die Kurven für Aussagesicherheiten", `${box(92, 192, 1260, 708, C.surface, C.border, 1.6, 16)}${plotAsset(scene, "success_run_curves", 120, 214, 1204, 650)}`, "draw");
  const noFailure = target("no_failure_rule", "Null-Ausfall-Regel", "Bis zum Zeitpunkt t darf kein einziger Ausfall auftreten", `${card(1410, 224, 418, 180, "BEDINGUNG", "0 Ausfälle", "bis zum Zeitpunkt t", { stroke: C.failure, headingSize: 30, bodySize: 22, bodyOffset: 64 })}`);
  const pa95 = target("target_pa95", "Beispiel P_A 95 Prozent", "Bei einer Aussagesicherheit von fünfundneunzig Prozent", `${card(1410, 462, 418, 168, "R=90 %", "P_A=95 % → n≈29", "höhere Sicherheit", { stroke: C.educationAccent, headingSize: 27, bodySize: 19, bodyOffset: 62 })}`);
  const pa90 = target("target_pa90", "Beispiel P_A 90 Prozent", "Bei einer Aussagesicherheit von neunzig Prozent", `${card(1410, 688, 418, 168, "R=90 %", "P_A=90 % → n≈22", "kleinere Stichprobe", { stroke: C.accent, headingSize: 27, bodySize: 19, bodyOffset: 62 })}`);
  return composeTargets([noFailure, plot, pa95, pa90]);
}

function buildDurationRatioIntro(scene) {
  return { body: `${card(92, 238, 520, 514, "REFERENZFALL", "Prüfdauer = Lebensdauer", "t_p = t\nursprüngliche Success-Run-Gleichung gilt direkt", { stroke: C.educationAccent, headingSize: 30, bodySize: 24, bodyOffset: 128 })}${card(1308, 238, 520, 514, "PRAXISFALL", "Prüfdauer ≠ Lebensdauer", "t_p < t oder t_p > t\nÜberlebenswahrscheinlichkeit muss korrigiert werden", { stroke: C.accent, headingSize: 30, bodySize: 24, bodyOffset: 128 })}${line(612, 494, 800, 494, C.deep, 3, true)}${line(1120, 494, 1308, 494, C.deep, 3, true)}${box(800, 334, 320, 320, "#142452", "#142452", 0, 160)}${txt(960, 400, "LEBENSDAUER-", 18, 850, C.educationAccent, "middle")}${txt(960, 430, "VERHÄLTNIS", 18, 850, C.educationAccent, "middle")}${formulaAsset(scene, "duration_ratio", 842, 470, 236, 112, "Lebensdauerverhältnis")}${pill(785, 790, 350, "KORREKTUR FÜR t_p ≠ t", { stroke: C.deep, size: 18 })}`, targets: [] };
}

function buildDurationWeibullRelation(scene) {
  const curve = target("weibull_relation_plot", "Weibullverteilung", "Hier kommt die Weibullverteilung ins Spiel", `${box(92, 198, 1120, 694, C.surface, C.border, 1.6, 16)}${plotAsset(scene, "weibull_probability", 120, 220, 1064, 640)}`, "draw");
  const shape = target("shape_parameter", "Formparameter b", "Der entscheidende Parameter ist der Formparameter b", `${card(1268, 216, 560, 218, "FORMPARAMETER b", "Steigung der Kurve", "b>1: steigende Ausfallrate\nb=1: konstanter Ausfallprozess", { stroke: C.educationAccent, headingSize: 28, bodySize: 20, bodyOffset: 76 })}`);
  const markers = target("duration_markers", "Zwei Zeitpunkte", "zwischen zwei verschiedenen Zeiten", `${pill(1268, 484, 246, "Prüfzeit t_p", { stroke: C.accent })}${pill(1582, 484, 246, "Zielzeit t", { stroke: C.deep })}${line(1518, 507, 1574, 507, C.deep, 3, true)}`);
  const relation = target("survival_ratio_block", "Verhältnis der Überlebenswahrscheinlichkeiten", "Verhältnis der logarithmierten Überlebenswahrscheinlichkeiten", `${box(1268, 584, 560, 256, C.surface, C.deep, 2.5, 16)}${formulaAsset(scene, "survival_ratio", 1306, 634, 484, 136, "Weibull-Zeitrelation")}`);
  return composeTargets([curve, shape, markers, relation]);
}

function buildDurationAdjustedSuccessRun(scene) {
  const equation = target("duration_adjusted_formula", "Korrigierte Success-Run-Gleichung", "gilt nun:R von t gleich", `${box(330, 202, 1260, 220, C.surface, C.educationAccent, 3, 18)}${txt(960, 252, "SUCCESS RUN MIT LEBENSDAUERVERHÄLTNIS", 18, 850, C.educationAccent, "middle")}${formulaAsset(scene, "duration_adjusted_success_run", 620, 286, 680, 104, "Korrigierte Success-Run-Gleichung")}`);
  const longer = target("longer_test", "Länger prüfen", "Wenn wir länger prüfen", `${card(92, 500, 520, 304, "t_p > t · L_V > 1", "Länger prüfen", "strengere Bedingung\nmehr Aussagekraft je Prüfling\n→ weniger Prüflinge", { stroke: C.educationAccent, headingSize: 29, bodySize: 22, bodyOffset: 92 })}`);
  const shorter = target("shorter_test", "Kürzer prüfen", "Prüfen wir kürzer", `${card(700, 500, 520, 304, "t_p < t · L_V < 1", "Kürzer prüfen", "schwächere Bedingung\nweniger Aussagekraft je Prüfling\n→ mehr Prüflinge", { stroke: C.accent, headingSize: 29, bodySize: 22, bodyOffset: 92 })}`);
  const warning = target("shape_warning", "Formparameter abschätzen", "müssen wir den Formparameter anderweitig abschätzen", `${card(1308, 500, 520, 304, "ACHTUNG", "b ist im Success Run unbekannt", "Abschätzung aus Vorgängerprodukten oder Vorversuchen erforderlich.", { stroke: C.warning || "#E9B400", headingSize: 28, bodySize: 21, bodyOffset: 96 })}`);
  return composeTargets([equation, longer, shorter, warning]);
}

function buildEndOfLife(scene) {
  const process = [
    target("test_to_failure", "Bis zum Ausfall prüfen", "prüfen wir bis zum Ausfall", card(92, 230, 430, 218, "01", "Bis zum Ausfall", "Lebensdauerdaten erfassen", { stroke: C.accent, headingSize: 29, bodySize: 20, bodyOffset: 70 })),
    target("weibull_evaluation", "Weibullverteilung bestimmen", "bestimmen die Weibullverteilung", card(92, 500, 430, 218, "02", "Weibull auswerten", "Verteilung + Vertrauensbereich", { stroke: C.deep, headingSize: 29, bodySize: 20, bodyOffset: 70 })),
    target("proof_result", "Nachweis bewerten", "prüfen wir, ob die geforderte Zuverlässigkeit", card(92, 770, 430, 180, "03", "Nachweispunkt bewerten", "Zuverlässigkeit mit Aussagesicherheit", { stroke: C.educationAccent, headingSize: 27, bodySize: 19, bodyOffset: 64 })),
  ];
  const plot = target("end_of_life_plot", "End-of-Life-Weibullplot", "die Weibullgerade mit Vertrauensbereich ermitteln", `${box(588, 198, 1240, 576, C.surface, C.border, 1.6, 16)}${plotAsset(scene, "weibull_confidence", 618, 218, 1180, 536)}`, "draw");
  const example = target("long_lifetime_example", "Langzeitbeispiel Wechselrichter", "Denke an einen Wechselrichter für Solaranlagen", `${box(588, 812, 1240, 138, C.semanticWarningSoft, C.warning || "#E9B400", 2.5, 16)}${txt(632, 860, "> 20 JAHRE", 28, 850, C.warning || "#E9B400")}${multi(820, 854, 940, "Wechselrichter im Feld: zu lange reale Lebensdauer für einen direkten Entwicklungstest.", 22, 720, C.deep)}`);
  return composeTargets([...process, plot, example]);
}

function buildAccelerationPrinciple() {
  const condition = target("field_test_conditions", "Feld und Versuch", "Schädigung pro Zeiteinheit im Versuch höher", `${card(92, 250, 650, 480, "FELDEINSATZ", "Repräsentative Belastung", "geringere Schädigung pro Zeiteinheit\nlange beobachtete Lebensdauer", { stroke: C.deep, headingSize: 31, bodySize: 23, bodyOffset: 124 })}${card(1178, 250, 650, 480, "VERSUCH", "Erhöhte Schädigung", "höhere Schädigung pro Zeiteinheit\nverkürzte beobachtete Lebensdauer", { stroke: C.educationAccent, strokeWidth: 3, headingSize: 31, bodySize: 23, bodyOffset: 124 })}${line(742, 490, 1178, 490, C.educationAccent, 5, true)}${pill(810, 444, 300, "ZEIT WIRD GERAFFT", { stroke: C.educationAccent })}`);
  const benefits = target("acceleration_benefits", "Nutzen beschleunigter Tests", "Beschleunigte Tests sparen so Zeit und Kosten", `${box(268, 796, 1384, 112, "#142452", "#142452", 0, 16)}${txt(960, 842, "ZEIT & KOSTEN SPAREN", 19, 850, C.educationAccent, "middle")}${txt(960, 880, "frühere Aussagen · Last-Lebensdauer-Zusammenhang · Nutzungsstreuung", 23, 720, C.surface, "middle")}`);
  return composeTargets([condition, benefits]);
}

function buildAccelerationMethods() {
  const methods = [
    ["time_compression", "Zeitliche Raffung", "Als Erstes sollte immer eine zeitliche Raffung", "01", "Frequenz erhöhen", "Belastungen schneller aufbringen\nDrehzahl / Schaltfrequenz erhöhen\nStandzeiten reduzieren", C.educationAccent],
    ["stress_increase", "Belastungsniveau erhöhen", "Zweitens kann über ein höheres Belastungsniveau", "02", "Last erhöhen", "Temperatur · Spannung · Feuchte\nVibration · Temperaturwechsel\nSchädigungsparameter kennen", C.accent],
    ["censoring", "Zensierte Tests", "Drittens gibt es zensierte Tests", "03", "Früher beenden", "nach Zeit oder Stückzahl\nvor allen Ausfällen\nkeine physikalische Beschleunigung", C.deep],
  ];
  return composeTargets(methods.map((method, index) => target(method[0], method[1], method[2], card(92 + index * 586, 236, 540, 586, method[3], method[4], method[5], { stroke: method[6], strokeWidth: index === 0 ? 3 : 2, headingSize: 31, bodySize: 22, bodyOffset: 120 }))));
}

function buildDegradationPaths(scene) {
  const plot = target("degradation_plot", "Degradationspfade", "Viertens sind Degradationstests möglich", `${box(92, 192, 1154, 716, C.surface, C.border, 1.6, 16)}${plotAsset(scene, "degradation_paths", 118, 216, 1102, 660)}`, "draw");
  const threshold = target("eol_criterion", "End-of-Life-Kriterium", "Über einen festgelegten Grenzwert", card(1302, 214, 526, 190, "GRENZWERT", "End-of-Life-Kriterium", "Schnittpunkt liefert geschätzten Ausfallzeitpunkt", { stroke: C.accent, headingSize: 27, bodySize: 19, bodyOffset: 70 }));
  const estimates = target("lifetime_estimates", "Geschätzte Ausfallzeitpunkte", "Wiederholen wir dieses Vorgehen für mehrere Prüflinge", card(1302, 448, 526, 190, "MEHRERE PRÜFLINGE", "Ausfallzeitpunkte schätzen", "jede Degradationskurve wird extrapoliert", { stroke: C.deep, headingSize: 27, bodySize: 19, bodyOffset: 70 }));
  const distribution = target("lifetime_distribution", "Lebensdauerverteilung", "erhalten wir eine Menge geschätzter Ausfallzeitpunkte", card(1302, 682, 526, 190, "ERGEBNIS", "Lebensdauerverteilung", "Lebensdauer + ausgewiesene Unsicherheit", { stroke: C.educationAccent, headingSize: 27, bodySize: 19, bodyOffset: 70 }));
  const guardrail = target("degradation_guardrail", "Ausfallmechanismus erhalten", "Entscheidend ist immer der Ausfallmechanismus", pill(92, 936, 1736, "GUARDRAIL · AUSFALLMECHANISMUS MUSS UNVERÄNDERT BLEIBEN", { stroke: C.warning || "#E9B400", size: 19 }));
  return composeTargets([plot, threshold, estimates, distribution, guardrail]);
}

function buildAccelerationFactor(scene) {
  const plot = target("acceleration_plot", "Feld- und Versuchsverteilung", "Schädigung pro Zeiteinheit im Versuch höher", `${box(92, 192, 1134, 708, C.surface, C.border, 1.6, 16)}${plotAsset(scene, "acceleration_factor", 120, 218, 1078, 646)}`, "draw");
  const formula = target("acceleration_factor_formula", "Raffungsfaktor", "benötigen wir den sogenannten Raffungsfaktor", `${box(1282, 216, 546, 260, C.surface, C.educationAccent, 3, 16)}${txt(1555, 266, "RAFFUNGSFAKTOR", 18, 850, C.educationAccent, "middle")}${formulaAsset(scene, "acceleration_factor", 1348, 316, 414, 108, "Raffungsfaktor")}`);
  const transfer = target("transfer_guardrail", "Übertragbarkeit", "Übertragbarkeit ist nur gegeben", `${card(1282, 542, 546, 310, "ÜBERTRAGBARKEIT", "Nur bei gleichem Mechanismus", "Ausfallmechanismus bleibt erhalten\nFormparameter b ist identisch\nVersuch lässt Feldschluss zu", { stroke: C.warning || "#E9B400", headingSize: 28, bodySize: 21, bodyOffset: 96 })}`);
  return composeTargets([plot, formula, transfer]);
}

function buildLoadLifeModels(scene) {
  const plot = target("load_life_plot", "Last-Lebensdauer-Korrelation", "Last-Lebensdauer-Korrelation", `${box(92, 192, 1090, 706, C.surface, C.border, 1.6, 16)}${plotAsset(scene, "load_life_correlation", 120, 218, 1034, 644)}`, "draw");
  const models = target("model_catalog", "Typische Schädigungsmodelle", "Typische Modelle sind das Wöhler-Modell", `${card(1238, 216, 590, 380, "MODELLE", "Physik + Daten verbinden", "", { stroke: C.deep, headingSize: 28 })}${bulletList(1280, 426, 500, ["Wöhler: strukturmechanische Ermüdung", "Arrhenius: temperaturgetriebene Prozesse", "Inverse Potenz: elektro-mechanische Spannung"], { gap: 64, size: 19 })}`);
  const guard = target("model_guardrail", "Tragfähiges Modell erforderlich", "Gibt es kein tragfähiges Modell", `${card(1238, 646, 590, 206, "GO / NO-GO", "Kein Modell → kein sicherer Feldschluss", "Raffungsfaktor an realen Daten validieren.", { stroke: C.failure, headingSize: 26, bodySize: 20, bodyOffset: 74 })}`);
  return composeTargets([plot, models, guard]);
}

function buildAltQuestions(scene) {
  const plot = target("alt_basis_plot", "Last-Lebensdauer-Basis", "Die Basis dafür ist wieder die Last-Lebensdauer-Korrelation", `${box(92, 192, 1010, 708, C.surface, C.border, 1.6, 16)}${plotAsset(scene, "test_level_overview", 118, 216, 958, 646)}`, "draw");
  const questions = [
    target("question_levels", "Anzahl der Niveaus", "wie viele Versuchsniveaus", card(1158, 210, 670, 150, "01", "Wie viele Niveaus?", "linearer oder gekrümmter Zusammenhang", { stroke: C.accent, headingSize: 25, bodySize: 18, bodyOffset: 58 })),
    target("question_position", "Lage der Niveaus", "welche Lage diese Niveaus", card(1158, 394, 670, 150, "02", "Wo liegen die Niveaus?", "Feldnähe versus Beschleunigung", { stroke: C.deep, headingSize: 25, bodySize: 18, bodyOffset: 58 })),
    target("question_allocation", "Prüflinge je Niveau", "wie viele Prüflinge pro Niveau", card(1158, 578, 670, 150, "03", "Wie verteilen?", "Prüflinge auf oberes und unteres Niveau", { stroke: C.educationAccent, headingSize: 25, bodySize: 18, bodyOffset: 58 })),
    target("question_total", "Gesamtzahl der Prüflinge", "insgesamt getestet werden müssen", card(1158, 762, 670, 150, "04", "Wie viele insgesamt?", "Kosten und Prognosegenauigkeit balancieren", { stroke: C.warning || "#E9B400", headingSize: 25, bodySize: 18, bodyOffset: 58 })),
  ];
  return composeTargets([plot, ...questions]);
}

function buildNumberOfLevels(scene) {
  const plot = target("levels_plot", "Versuchsniveaus", "Schauen wir uns zunächst die Frage nach der Anzahl der Versuchsniveaus an", `${box(92, 192, 1120, 706, C.surface, C.border, 1.6, 16)}${plotAsset(scene, "number_of_levels", 120, 218, 1064, 644)}`, "draw");
  const two = target("two_levels", "Zwei Niveaus", "Wenn wir nur zwei Niveaus prüfen", `${card(1268, 246, 560, 240, "2 NIVEAUS", "Nur linear abbildbar", "Geradenmodell zwischen zwei Versuchspunkten", { stroke: C.deep, headingSize: 29, bodySize: 21, bodyOffset: 84 })}`);
  const third = target("third_level", "Drittes Niveau", "ein drittes Niveau hinzuzunehmen", `${card(1268, 558, 560, 240, "3 NIVEAUS", "Krümmung erfassen", "zuverlässigere Prognose auf das Feldniveau", { stroke: C.educationAccent, strokeWidth: 3, headingSize: 29, bodySize: 21, bodyOffset: 84 })}`);
  return composeTargets([plot, two, third]);
}

function buildUpperTestLevel(scene) {
  const plot = target("upper_level_plot", "Oberes Versuchsniveau", "Für das obere Versuchsniveau gilt", `${box(92, 192, 1160, 708, C.surface, C.border, 1.6, 16)}${plotAsset(scene, "upper_test_level", 120, 218, 1104, 646)}`, "draw");
  const principle = target("upper_level_principle", "So hoch wie möglich", "Wir wählen es so hoch wie möglich", `${card(1308, 230, 520, 280, "MAXIMALE RAFFUNG", "So hoch wie möglich", "aber unterhalb der Grenze, an der sich der Ausfallmechanismus verändert", { stroke: C.educationAccent, headingSize: 29, bodySize: 21, bodyOffset: 92 })}`);
  const pretest = target("pretest", "Vorversuche", "In der Regel braucht man dazu Vorversuche", `${card(1308, 590, 520, 244, "ABSICHERUNG", "Vorversuche", "maximal mögliche Beschleunigung und Mechanismusgrenze abschätzen", { stroke: C.warning || "#E9B400", headingSize: 29, bodySize: 20, bodyOffset: 84 })}`);
  return composeTargets([plot, principle, pretest]);
}

function buildLowerTestLevel(scene) {
  const plot = target("lower_level_plot", "Unteres Versuchsniveau", "Das untere Versuchsniveau ist dagegen ein Kompromiss", `${box(92, 192, 1120, 708, C.surface, C.border, 1.6, 16)}${plotAsset(scene, "lower_test_level", 120, 218, 1064, 646)}`, "draw");
  const field = target("field_proximity", "Nähe zum Feld", "möglichst nah am Feldniveau", card(1268, 218, 560, 190, "GENAUIGKEIT", "Nah am Feldniveau", "höhere Prognosegüte", { stroke: C.deep, headingSize: 27, bodySize: 20, bodyOffset: 68 }));
  const runtime = target("runtime_limit", "Laufzeit begrenzen", "Gleichzeitig darf die Laufzeit aber nicht so lang sein", card(1268, 462, 560, 190, "DURCHFÜHRBARKEIT", "Laufzeit begrenzen", "Kosten und Testdauer beherrschbar halten", { stroke: C.accent, headingSize: 27, bodySize: 20, bodyOffset: 68 }));
  const recommendation = target("recommended_factor", "Raffungsfaktor zwei bis drei", "Raffungsfaktoren im Bereich von zwei bis drei", card(1268, 706, 560, 190, "PRAXISWERT", "RF ≈ 2 bis 3", "höhere Werte vergrößern häufig die Streuung", { stroke: C.educationAccent, headingSize: 27, bodySize: 20, bodyOffset: 68 }));
  return composeTargets([plot, field, runtime, recommendation]);
}

function buildSampleAllocation(scene) {
  const plot = target("allocation_plot", "Prüflingsverteilung", "Ein Teil der Prüflinge läuft auf dem oberen Niveau", `${box(92, 192, 1080, 708, C.surface, C.border, 1.6, 16)}${plotAsset(scene, "sample_allocation", 120, 218, 1024, 646)}`, "draw");
  const factor = target("extrapolation_factor_block", "Extrapolationsfaktor", "Zunächst bestimmen wir den Extrapolationsfaktor", `${box(1228, 214, 600, 210, C.surface, C.accent, 2.5, 16)}${txt(1266, 260, "SCHRITT 1 · EXTRAPOLATIONSFAKTOR", 16, 850, C.accent)}${formulaAsset(scene, "extrapolation_factor", 1304, 302, 448, 90, "Extrapolationsfaktor")}`);
  const share = target("allocation_share_block", "Anteil auf unterem Niveau", "Anschließend wird der Anteil p", `${box(1228, 474, 600, 210, C.surface, C.deep, 2.5, 16)}${txt(1266, 520, "SCHRITT 2 · ANTEIL p", 16, 850, C.deep)}${formulaAsset(scene, "allocation_share", 1304, 562, 448, 90, "Anteil p")}`);
  const rule = target("allocation_rule", "Mehr Prüflinge unten", "Auf dem unteren Versuchsniveau müssen immer mehr Prüflinge", `${box(1228, 742, 600, 158, "#E6F6EE", C.educationAccent, 3, 16)}${txt(1528, 790, "n_unten > n_oben", 30, 850, C.deep, "middle")}${txt(1528, 836, "Streuung reduzieren · Feldprognose stabilisieren", 18, 720, C.educationAccent, "middle")}`);
  return composeTargets([plot, factor, share, rule]);
}

function buildAllocationExample(scene) {
  const inputs = target("allocation_inputs", "Eingabedaten", "Eine Isolierung soll auf Lebensdauer geprüft werden", `${card(92, 214, 550, 628, "ISOLIERUNG · n=20", "Drei Temperaturniveaus", "Feld x_0 = 180 °C\nOben x_1 = 260 °C\nUnten x_2 = 220 °C\n\nGesucht: Verteilung von 20 Prüflingen", { stroke: C.deep, headingSize: 30, bodySize: 24, bodyOffset: 122 })}`);
  const factor = target("example_factor", "Extrapolationsfaktor zwei", "Zuerst berechnen wir den Extrapolationsfaktor", `${box(700, 214, 1128, 210, C.surface, C.accent, 2.5, 16)}${txt(742, 260, "SCHRITT 1", 17, 850, C.accent)}${formulaAsset(scene, "extrapolation_example", 900, 296, 728, 96, "Beispiel Extrapolationsfaktor")}`);
  const share = target("example_share", "Anteil 67 Prozent", "Setzen wir diesen nun in die zweite Gleichung ein", `${box(700, 480, 1128, 210, C.surface, C.deep, 2.5, 16)}${txt(742, 526, "SCHRITT 2", 17, 850, C.deep)}${formulaAsset(scene, "allocation_example", 900, 562, 728, 96, "Beispiel Anteil p")}`);
  const result = target("allocation_result", "14 unten und 6 oben", "vierzehn Prüflinge", `${box(700, 746, 1128, 132, "#142452", "#142452", 0, 16)}${txt(760, 828, "UNTEN 14", 31, 850, C.educationAccent)}${txt(1768, 828, "OBEN 6", 31, 850, C.surface, "end")}${line(1134, 812, 1434, 812, C.educationAccent, 4, true)}`);
  return composeTargets([inputs, factor, share, result]);
}

function buildTotalSampleSize(scene) {
  const plot = target("monte_carlo_plot", "Monte-Carlo-Simulation", "nutzen wir die Monte-Carlo-Simulation", `${box(92, 192, 1150, 708, C.surface, C.border, 1.6, 16)}${plotAsset(scene, "monte_carlo_precision", 120, 218, 1094, 646)}`, "draw");
  const runs = target("simulation_runs", "Viele Simulationsdurchläufe", "viele zufällige Simulationsdurchläufe", card(1298, 220, 530, 190, "SIMULATION", "Viele Zufallsdurchläufe", "Stichprobengröße systematisch variieren", { stroke: C.accent, headingSize: 27, bodySize: 19, bodyOffset: 68 }));
  const envelope = target("precision_envelope", "Prognosegenauigkeit", "Einfluss der Prüflingsanzahl auf die Genauigkeit", card(1298, 466, 530, 190, "AUSWERTUNG", "Unsicherheit sichtbar machen", "mehr Prüflinge → engere Prognose", { stroke: C.deep, headingSize: 27, bodySize: 19, bodyOffset: 68 }));
  const balance = target("cost_precision_balance", "Balance aus Kosten und Genauigkeit", "richtige Balance", card(1298, 712, 530, 190, "ENTSCHEIDUNG", "So viele wie nötig", "Zielgenauigkeit erreichen, Ressourcen nicht verschwenden", { stroke: C.educationAccent, headingSize: 27, bodySize: 19, bodyOffset: 68 }));
  return composeTargets([plot, runs, envelope, balance]);
}

function strategyColumn(x, width, label, heading, rows, color) {
  return `${box(x, 178, width, 752, C.surface, color, 2.5, 16)}${txt(x + 26, 226, label, 16, 850, color)}${multi(x + 26, 278, width - 52, heading, 27, 830, C.deep, "start", 1.15)}${rows.map((row, index) => `${txt(x + 26, 374 + index * 86, row[0].toUpperCase(), 14, 850, color)}${multi(x + 26, 400 + index * 86, width - 52, row[1], 18, 650, C.text, "start", 1.16)}`).join("")}`;
}

function buildStrategyComparison() {
  const data = [
    ["strategy_success_run", "Success Run", "Der Success-Run Test ist eine ausfallfreie Teststrategie", "AUSFALLFREI", [["Allgemein", "Systemebene · einfache, transparente Planung"], ["Ergebnis", "Mindestzuverlässigkeit + P_A; kein Ausfallverhalten"], ["Lasten", "repräsentative Betriebslasten"], ["Testdauer", "bis Zielzeit · kein Ausfall"], ["Planung", "P_A=1−R(t)^n · L_V-Korrektur · oft großes n"], ["Grenze", "nur bei Überdimensionierung"]], C.educationAccent],
    ["strategy_eol", "End of Life", "Der End-of-Life Test ist ausfallbasiert", "BIS AUSFALL", [["Allgemein", "Komponente / System · zensiert oder unzensiert"], ["Ergebnis", "Zuverlässigkeit + Ausfallverhalten"], ["Lasten", "repräsentative Betriebslasten"], ["Testdauer", "bis zum Ausfall"], ["Planung", "n≥3 · Ausfallmechanismen trennen"], ["Grenze", "lange Laufzeit bei großer Produktlebensdauer"]], C.deep],
    ["strategy_alt", "Accelerated Life", "Der Accelerated Life Test ist ebenfalls ausfallbasiert", "BESCHLEUNIGT", [["Allgemein", "effizient auf Komponente · zensiert oder unzensiert"], ["Ergebnis", "Zuverlässigkeit + Ausfall- und Alterungsmodell"], ["Lasten", "Raffung durch Lasterhöhung"], ["Testdauer", "bis Ausfall · beschleunigt"], ["Planung", "n≥6 · Mechanismen trennen · Lastmodell validieren"], ["Grenze", "Feldübertragung absichern"]], C.accent],
    ["strategy_degradation", "Degradation", "Degradationstests sind die richtige Wahl", "MESSBARER VERSCHLEISS", [["Allgemein", "Komponente / System · messbarer Verschleiß"], ["Ergebnis", "Zuverlässigkeit + Ausfall- und Degradationsmodell"], ["Lasten", "repräsentativ oder durch Lasterhöhung"], ["Testdauer", "bis Verschleißmodell / EOL-Kriterium"], ["Planung", "n≥6 · EOL definieren · hoher Messaufwand"], ["Grenze", "nur bei messbarem Verschleiß"]], C.warning || "#E9B400"],
  ];
  return composeTargets(data.map((entry, index) => target(entry[0], entry[1], entry[2], strategyColumn(72 + index * 460, 426, entry[3], entry[1], entry[4], entry[5]))));
}

function decisionNode(x, y, width, label, options = {}) {
  return `${box(x, y, width, options.height || 74, options.fill || C.surface, options.stroke || C.deep, options.strokeWidth || 2, options.radius || 14)}${multi(x + width / 2, y + 44, width - 34, label, options.size || 19, options.weight || 790, options.textFill || C.deep, "middle", 1.12)}`;
}

function buildStrategyGuideline() {
  const design = target("design_gate", "Dimensionierung prüfen", "wie das Produktdesign im Verhältnis zur Anforderung", `${decisionNode(700, 176, 520, "Design im Verhältnis zur Anforderung?", { fill: "#142452", stroke: "#142452", textFill: C.surface, height: 82, size: 21 })}${pathLine("M840 258V330H350V392", C.deep, 3)}${pathLine("M1080 258V330H960V392", C.deep, 3)}${pill(410, 300, 240, "ÜBERDIMENSIONIERT", { stroke: C.educationAccent, size: 16 })}${pill(1018, 300, 180, "ON TARGET", { stroke: C.deep, size: 16 })}${decisionNode(164, 392, 372, "SUCCESS RUN", { fill: "#E6F6EE", stroke: C.educationAccent, strokeWidth: 3, height: 82, size: 22 })}`);
  const wear = target("wear_gate", "Messbaren Verschleiß prüfen", "ob ein messbarer Verschleiß vorhanden ist", `${decisionNode(754, 392, 412, "Messbarer Verschleiß?", { stroke: C.deep, height: 82, size: 21 })}${pathLine("M856 474V544H678V606", C.deep, 3)}${pathLine("M1064 474V544H1398V606", C.deep, 3)}${pill(694, 520, 120, "NEIN", { stroke: C.deep, size: 16 })}${pill(1268, 520, 100, "JA", { stroke: C.accent, size: 16 })}`);
  const acceleration = target("acceleration_gate", "Beschleunigung prüfen", "ob eine Beschleunigung durch Lasterhöhung möglich ist", `${decisionNode(438, 606, 480, "Lasterhöhung möglich?", { stroke: C.deep, height: 76, size: 19 })}${decisionNode(1158, 606, 480, "Lasterhöhung möglich?", { stroke: C.accent, height: 76, size: 19 })}${pathLine("M558 682V744H350V806", C.deep, 3)}${pathLine("M798 682V744H850V806", C.deep, 3)}${pathLine("M1278 682V744H1176V806", C.deep, 3)}${pathLine("M1518 682V744H1580V806", C.deep, 3)}`);
  const outcomes = target("strategy_outcomes", "Vier Strategien", "wählen wir den End-of-Life Test", `${decisionNode(164, 806, 372, "END OF LIFE", { stroke: C.deep, height: 82 })}${decisionNode(690, 806, 320, "ACCELERATED LIFE", { fill: C.educationAccentSoft, stroke: C.educationAccent, strokeWidth: 3, height: 82 })}${decisionNode(1016, 806, 320, "DEGRADATION", { stroke: C.accent, height: 82 })}${decisionNode(1394, 806, 372, "ACCELERATED DEGRADATION", { fill: C.semanticWarningSoft, stroke: C.warning || "#E9B400", height: 82, size: 17 })}`);
  const guard = target("universal_guardrail", "Universelle Guardrails", "Noch ein wichtiger Hinweis gilt unabhängig", `${pill(164, 936, 1602, "IMMER PRÜFEN · ZEITLICHE RAFFUNG · BELASTBARES MODELL · AUSFALLMECHANISMUS UNVERÄNDERT", { stroke: C.warning || "#E9B400", size: 16 })}`);
  return composeTargets([design, wear, acceleration, outcomes, guard]);
}

// Scene builders are defined above.

const BUILDERS = {
  reliability_management: buildReliabilityManagement,
  test_objectives: buildTestObjectives,
  development_timeline: buildDevelopmentTimeline,
  dual_planning: buildDualPlanning,
  strategy_dimensions: buildStrategyDimensions,
  strategy_tree: buildStrategyTree,
  proof_definition: buildProofDefinition,
  confidence_recap: buildConfidenceRecap,
  proof_acceptance: buildProofAcceptance,
  proof_alternatives: buildProofAlternatives,
  success_run_problem: buildSuccessRunProblem,
  success_run_derivation: buildSuccessRunDerivation,
  sample_size_example: buildSampleSizeExample,
  sample_size_table: buildSampleSizeTable,
  success_run_curves: buildSuccessRunCurves,
  duration_ratio_intro: buildDurationRatioIntro,
  duration_weibull_relation: buildDurationWeibullRelation,
  duration_adjusted_success_run: buildDurationAdjustedSuccessRun,
  end_of_life: buildEndOfLife,
  acceleration_principle: buildAccelerationPrinciple,
  acceleration_methods: buildAccelerationMethods,
  degradation_paths: buildDegradationPaths,
  acceleration_factor: buildAccelerationFactor,
  load_life_models: buildLoadLifeModels,
  alt_questions: buildAltQuestions,
  number_of_levels: buildNumberOfLevels,
  upper_test_level: buildUpperTestLevel,
  lower_test_level: buildLowerTestLevel,
  sample_allocation: buildSampleAllocation,
  allocation_example: buildAllocationExample,
  total_sample_size: buildTotalSampleSize,
  strategy_comparison: buildStrategyComparison,
  strategy_guideline: buildStrategyGuideline,
};

function main() {
  const args = parseArgs(process.argv);
  const requested = new Set(slideNumbers(args.slides));
  const scenes = plan.scenes.filter((scene) => requested.has(scene.output_slide_number));
  if (scenes.length !== requested.size) throw new Error("Mindestens eine angeforderte RE5-Zielszene ist nicht im Szenenplan vorhanden.");
  for (const scene of scenes) {
    const builder = BUILDERS[scene.builder];
    if (!builder) throw new Error(`Builder fehlt: ${scene.builder}`);
    const build = builder(scene);
    writeScene(scene, build, args.animation);
    process.stdout.write(`Generated ${scene.work_unit}${args.animation ? " with animation" : " static-only"}.\n`);
  }
}

main();
