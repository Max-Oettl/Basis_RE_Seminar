const fs = require("fs");
const path = require("path");
const { pictogram: svgPictogram } = require("../components/pictogram-library/reltest-pictograms");
const educationTheme = require("./reltest-education-theme");

const repoRoot = path.resolve(__dirname, "..");
const outputRoot = path.join(repoRoot, "rebuild-proposals", "svg", "RE1");
const sourceAssetRoot = path.join(repoRoot, "analysis", "redesign-assets", "RE1");
const reusableImageAssetRoot = path.join(repoRoot, "components", "image-library");
const educationPictogramAssetRoot = path.join(reusableImageAssetRoot, "generated-pictograms", "education-core");
const scenePlan = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "analysis", "rebuild-plans", "RE1_scene-plan.json"), "utf8"),
);

const C = educationTheme.colors;
const CHAPTER_ONE_SLIDES = new Set(Array.from({ length: 13 }, (_, index) => index + 1));

const EDUCATION_PICTOGRAM_FILES = {
  target: "target.png",
  shieldCheck: "shield-check.png",
  settings: "settings.png",
  layers: "layers.png",
  search: "search.png",
  package: "package.png",
  cloud: "cloud.png",
  flask: "flask.png",
  factory: "factory.png",
  wrenchAlert: "wrench-alert.png",
  eye: "eye.png",
  database: "database.png",
  loop: "loop.png",
  listCheck: "list-check.png",
  machineAlert: "machine-alert.png",
  clock: "clock.png",
  percent: "percent.png",
  shield: "shield.png",
  reliabilityImprovement: "../education-v3/reliability-improvement-chart-flat.png",
  timedReliabilityProof: "../education-v3/timed-reliability-proof-flat.png",
};

const chapterOneTriggerPhrases = {
  1: {
    a320_case_context: "Ein Fall aus der jüngsten Vergangenheit",
    a320_business_impact: "Die Auswirkungen erstrecken sich auf die Hersteller",
  },
  2: {
    recall_data_series: "Das Kraftfahrt-Bundesamt liefert jedoch offizielle Daten",
    recall_key_figures: "In den letzten zehn Jahren hat sich",
  },
  3: {
    takata_case_context: "Der Rückruf im Zusammenhang mit den Takata-Airbags",
    takata_scope_and_consequences: "Das Ausmaß dieses Problems zeigt sich",
  },
  4: {
    note7_case_context: "Samsung initiierte im September Zweitausendsechzehn",
    note7_business_impact: "Die Konsequenzen für Samsung waren erheblich",
  },
  5: {
    nonlegal_consequences: "Zu den nicht-rechtlichen Folgen zählen beispielsweise wirtschaftliche Verluste",
    civil_consequences: "Zudem stehen Unternehmen vor zivilrechtlichen Konsequenzen",
    criminal_consequences: "In besonders schwerwiegenden Fällen können auch strafrechtliche Sanktionen",
  },
  6: {
    development_pressure: "Wichtige Einflussgrößen auf die Zuverlässigkeit sind",
    complexity_pressure: "Zusätzlich steigen auch Komplexität und Funktionsumfang",
    counteracting_demands: "Dem gegenüber stehen die steigende Produkthaftung",
  },
  8: {
    motivation_media_context: "bewirbt SKF ihr Trouble-Free Operation Service Program",
    forecast_quote_setup: "Drei Dinge kann keiner voraussagen",
    forecast_quote_conclusion: "Mach zwei daraus",
    forecast_quote_implication: "Die Intention dahinter ist klar",
  },
  9: {
    vehicle_system_hierarchy: "schauen wir uns zunächst einmal die System-Struktur",
    function_examples: "Im Falle eines PKWs ist die entsprechende Funktion",
    failure_propagation: "Verliert nun beispielsweise der Kolben",
  },
  10: {
    stress_context: "Zunächst einmal wirkt auf ein Produkt",
    strength_context: "Dem gegenüber steht die Belastbarkeit",
    failure_overlap: "Zwischen den Verteilungen von Belastung und Belastbarkeit",
    failure_consequences: "Diese Ausfälle wiederum führen zu Kundenunzufriedenheit",
  },
  11: {
    shifted_strength_distribution: "wodurch dessen Kurve nach rechts verschoben wird",
    failure_overlap: "Die Folge ist ein kleinerer Überlappungsbereich",
  },
  12: {
    quality_cost_tradeoff: "Durch die Qualitätserhöhung entstehen aber auch deutliche Mehrkosten",
  },
  13: {
    reliability_definition: "Die Zuverlässigkeit ist die Wahrscheinlichkeit dafür",
  },
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function wrap(text, maxChars) {
  const words = String(text).trim().split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function textLines({ x, y, lines, size = 30, weight = 560, fill = C.text, lineHeight = 1.34, anchor = "start", klass = "", role = "text", fontFamily = null }) {
  const effectiveSize = role === "caption" ? Math.max(14, size) : size;
  const content = lines
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : Math.round(effectiveSize * lineHeight)}" data-qc-role="${role}" data-qc-layer="text" data-qc-allow-overlap="true">${esc(line)}</tspan>`)
    .join("");
  return `<text x="${x}" y="${y}" class="${klass}" font-size="${effectiveSize}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" data-qc-role="${role}"${fontFamily ? ` font-family='${fontFamily}'` : ""}>${content}</text>`;
}

function richTextLine(x, y, segments, options = {}) {
  const size = options.size || 36;
  const anchor = options.anchor || "start";
  const content = segments.map((segment) => `<tspan fill="${segment.fill || options.fill || C.deep}" font-weight="${segment.weight || options.weight || 600}">${esc(segment.text)}</tspan>`).join("");
  return `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true">${content}</text>`;
}

function paragraph(x, y, width, text, options = {}) {
  const size = options.size || 28;
  const maxChars = options.maxChars || Math.max(12, Math.floor(width / (size * 0.53)));
  return textLines({ x, y, lines: wrap(text, maxChars), size, ...options });
}

function card(x, y, width, height, options = {}) {
  const fill = options.fill || C.surface;
  const stroke = options.stroke || C.border;
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
}

function label(x, y, text, color = C.accent) {
  return `<text x="${x}" y="${y}" font-size="18" font-weight="760" fill="${color}">${esc(text.toUpperCase())}</text>`;
}

function bulletList(x, y, width, items, options = {}) {
  const size = options.size || 25;
  const gap = options.gap || 54;
  const color = options.color || C.text;
  return items
    .map((item, index) => {
      const itemY = y + index * gap;
      return `<circle cx="${x}" cy="${itemY - 7}" r="5" fill="${options.bulletColor || C.accent}"/>${paragraph(
        x + 20,
        itemY,
        width - 20,
        item,
        { size, fill: color, maxChars: options.maxChars },
      )}`;
    })
    .join("");
}

function animGroup(id, labelText, content) {
  return `<g id="${id}" data-anim-target="true" data-anim-label="${esc(labelText)}"><title>${esc(labelText)}</title>${content}</g>`;
}

function semanticGroup(id, labelText, content) {
  return `<g id="${id}" data-semantic-group="true" aria-label="${esc(labelText)}"><title>${esc(labelText)}</title>${content}</g>`;
}

function metricTile(x, y, width, value, caption, color = C.accent, fill = C.accentSoft, options = {}) {
  const height = options.height || 126;
  return `${card(x, y, width, height, { fill, stroke: color, shadow: false })}${textLines({
    x: x + 22,
    y: y + 55,
    lines: [value],
    size: options.valueSize || 42,
    weight: 800,
    fill: color,
    fontFamily: educationTheme.displayFontFamily,
  })}${paragraph(x + 22, y + 91, width - 44, caption, { size: 21, weight: 620, fill: C.deepSoft })}`;
}

function generatedPictogramTile(slideNumber, x, y, width, text, filename, color = C.failure, fill = C.failureSoft) {
  const height = 150;
  const fontSize = text.length > 18 ? 21 : text.length > 12 ? 24 : 30;
  const imageSize = 96;
  const href = mediaDataUri(localMedia(slideNumber, filename));
  return `${card(x, y, width, height, { fill, stroke: color, shadow: false })}<rect x="${x}" y="${y}" width="7" height="${height}" rx="3.5" fill="${color}"/><image x="${x + (width - imageSize) / 2}" y="${y + 3}" width="${imageSize}" height="${imageSize}" href="${href}" preserveAspectRatio="xMidYMid meet" data-source-media="true" data-pictogram-asset-type="generated_png" data-pictogram-style="reltest-education-minimal-v1" aria-hidden="true"/>${textLines({
    x: x + width / 2,
    y: y + 126,
    lines: [text],
    size: fontSize,
    weight: 800,
    fill: C.deep,
    anchor: "middle",
  })}`;
}

function localMedia(slideNumber, filename) {
  return path.join(outputRoot, `slide_${String(slideNumber).padStart(3, "0")}`, "media", filename);
}

function mediaDataUri(filePath) {
  const extension = path.extname(filePath).slice(1).toLowerCase();
  const mime = extension === "jpg" || extension === "jpeg" ? "image/jpeg" : `image/${extension}`;
  return `data:${mime};base64,${fs.readFileSync(filePath).toString("base64")}`;
}

function pictogram(id, options = {}) {
  const filename = EDUCATION_PICTOGRAM_FILES[id];
  if (!filename) return svgPictogram(id, options);
  const { cx, cy, size = 48 } = options;
  const assetPath = path.join(educationPictogramAssetRoot, filename);
  if (!fs.existsSync(assetPath)) throw new Error(`Missing generated Education pictogram: ${assetPath}`);
  const imageSize = size * 1.18;
  const background = options.background || (options.color === "#FFFFFF" ? "#FFFFFF" : null);
  const radius = options.radius || size * 0.72;
  const backdrop = background
    ? `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${background}" data-pictogram-backdrop="true"/>`
    : "";
  return `<g aria-label="${esc(id)}" data-pictogram-asset-type="generated_png" data-pictogram-style="reltest-education-minimal-v1">${backdrop}<image x="${cx - imageSize / 2}" y="${cy - imageSize / 2}" width="${imageSize}" height="${imageSize}" href="${mediaDataUri(assetPath)}" preserveAspectRatio="xMidYMid meet" data-source-media="true" aria-hidden="true"/></g>`;
}

function imagePanel({ slideNumber, filename, x, y, width, height, clipId, position = "xMidYMid slice" }) {
  const href = mediaDataUri(localMedia(slideNumber, filename));
  return `<defs><clipPath id="${clipId}"><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="8"/></clipPath></defs><image x="${x}" y="${y}" width="${width}" height="${height}" href="${href}" preserveAspectRatio="${position}" clip-path="url(#${clipId})"/><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="8" fill="none" stroke="${C.border}" stroke-width="1.5"/>`;
}

function croppedRasterPanel({ slideNumber, filename, x, y, width, height, sourceViewBox, sourceWidth, sourceHeight, assetId }) {
  const href = mediaDataUri(localMedia(slideNumber, filename));
  return `<svg id="${assetId}" x="${x}" y="${y}" width="${width}" height="${height}" viewBox="${sourceViewBox}" preserveAspectRatio="xMidYMid meet" overflow="hidden" data-source-media="true"><image x="0" y="0" width="${sourceWidth}" height="${sourceHeight}" href="${href}"/></svg><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="7" fill="none" stroke="${C.border}" stroke-width="1.5"/>`;
}

function nestedSvg(filePath, x, y, width, height, assetId) {
  let source = fs.readFileSync(filePath, "utf8");
  source = source.replace(/^<\?xml[^>]*>\s*/i, "").replace(/<!DOCTYPE[\s\S]*?>\s*/i, "");
  source = source.replace(/<metadata[\s\S]*?<\/metadata>/i, "");
  const root = source.match(/<svg\b([^>]*)>/i);
  if (!root) throw new Error(`Invalid plot SVG: ${filePath}`);
  const viewBox = (root[1].match(/viewBox=["']([^"']+)["']/i) || [])[1];
  if (!viewBox) throw new Error(`Plot SVG has no viewBox: ${filePath}`);
  const namespaceAttributes = [...root[1].matchAll(/\s(xmlns:[\w-]+=["'][^"']+["'])/gi)]
    .map((match) => match[1])
    .join(" ");
  let inner = source.slice(root.index + root[0].length, source.lastIndexOf("</svg>"));
  inner = inner.replace(/<text(?![^>]*\bfont-size=)([^>]*)>/gi, '<text font-size="18"$1>');
  inner = inner.replace(/font-size=["']([\d.]+)["']/gi, (match, value) => Number(value) < 18 ? 'font-size="18"' : match);
  const legacyColorMap = {
    "#E2E8F0": "#E6E7EB",
    "#6A7A86": C.muted,
    "#062D46": C.deep,
    "#102A43": C.deep,
    "#007EA7": C.cyan,
    "#139CCB": C.cyan,
    "#B7791F": C.secondary,
    "#2F6F55": C.success,
    "#D1495B": C.failure,
    "#9F3443": C.failure,
    "#00698A": C.cyan,
    "#4F78A8": C.cyan,
    "#8A5A17": C.secondary,
    "#7A5C99": C.deepSoft,
  };
  for (const [legacyColor, educationColor] of Object.entries(legacyColorMap)) {
    inner = inner.replaceAll(legacyColor, educationColor).replaceAll(legacyColor.toLowerCase(), educationColor);
  }
  const localIds = [...inner.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
  const animationTargetIds = new Set(
    [...inner.matchAll(/<[^>]*\bid=["']([^"']+)["'][^>]*\bdata-anim-target=["']true["'][^>]*>/g)].map((match) => match[1]),
  );
  for (const localId of localIds) {
    if (animationTargetIds.has(localId)) continue;
    const scopedId = `${assetId}__${localId}`;
    inner = inner
      .replaceAll(`id="${localId}"`, `id="${scopedId}"`)
      .replaceAll(`id='${localId}'`, `id='${scopedId}'`)
      .replaceAll(`url(#${localId})`, `url(#${scopedId})`)
      .replaceAll(`href="#${localId}"`, `href="#${scopedId}"`)
      .replaceAll(`href='#${localId}'`, `href='#${scopedId}'`)
      .replaceAll(`xlink:href="#${localId}"`, `xlink:href="#${scopedId}"`)
      .replaceAll(`xlink:href='#${localId}'`, `xlink:href='#${scopedId}'`);
  }
  return `<svg id="${assetId}" x="${x}" y="${y}" width="${width}" height="${height}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet" overflow="visible" data-plot-asset="true" ${namespaceAttributes}>${inner}</svg>`;
}

function vectorMediaPanel({ slideNumber, filename, x, y, width, height, assetId }) {
  return nestedSvg(localMedia(slideNumber, filename), x, y, width, height, assetId)
    .replace('data-plot-asset="true"', 'data-source-media="true"')
    .replace('overflow="visible"', 'overflow="hidden"');
}

function sourceLine(text) {
  return `<text x="82" y="948" font-size="18" font-weight="540" fill="${C.soft}">${esc(text)}</text>`;
}

function arrow(x1, y1, x2, y2, color = C.accent, width = 3) {
  return `<path d="M ${x1} ${y1} L ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" marker-end="url(#arrow_${color.replace("#", "")})"/>`;
}

function failedSystemSymbol(cx, cy, size = 56) {
  const badgeRadius = size * 0.2;
  const badgeX = cx + size * 0.34;
  const badgeY = cy + size * 0.3;
  return `<g aria-label="Ausgefallenes System">${pictogram("machineAlert", { cx, cy, size, color: C.failure, background: C.failureSoft, radius: size * 0.72 })}<circle cx="${badgeX}" cy="${badgeY}" r="${badgeRadius}" fill="#FFFFFF" stroke="${C.failure}" stroke-width="2.5"/><path d="M ${badgeX - badgeRadius * 0.45} ${badgeY - badgeRadius * 0.45} L ${badgeX + badgeRadius * 0.45} ${badgeY + badgeRadius * 0.45} M ${badgeX + badgeRadius * 0.45} ${badgeY - badgeRadius * 0.45} L ${badgeX - badgeRadius * 0.45} ${badgeY + badgeRadius * 0.45}" fill="none" stroke="${C.failure}" stroke-width="3" stroke-linecap="round"/></g>`;
}

function planTrigger(scene, targetId) {
  const step = scene.animation_plan?.steps?.find((candidate) => candidate.target_id === targetId);
  if (!step) throw new Error(`No planned trigger for ${scene.work_unit}:${targetId}`);
  return step.source_text;
}

function chapterTrigger(scene, targetId) {
  const phrase = chapterOneTriggerPhrases[scene.output_slide_number]?.[targetId];
  if (!phrase) return planTrigger(scene, targetId);
  if (!scene.spoken_text.includes(phrase)) {
    throw new Error(`${scene.work_unit}: chapter-one trigger phrase not found: ${phrase}`);
  }
  return phrase;
}

function target(id, labelText) {
  return { targetId: id, label: labelText, status: "animated", visibleInEditor: true, render: true, confidence: "high" };
}

function step(id, targetId, action, sourceText, notes = "Sprechertextgeführte semantische Gruppe des Full-Slide-Redesigns.") {
  const timing = action === "draw"
    ? { drawDurFrames: 42 }
    : action === "hide"
      ? { exitFrames: 16 }
      : { enterFrames: 16 };
  return {
    stepId: id,
    targetId,
    action,
    sourceText,
    occurrence: 1,
    confidence: "high",
    notes,
    ...timing,
  };
}

function transformStep(id, targetId, sourceText, fromTranslateX, translateX = 0, durFrames = 60) {
  return {
    stepId: id,
    targetId,
    action: "transform",
    sourceText,
    occurrence: 1,
    confidence: "high",
    notes: "Sprechertextgeführte Bewegung desselben fachlichen Elements zwischen zwei Zuständen.",
    durFrames,
    fromTranslateX,
    fromTranslateY: 0,
    fromScale: 1,
    translateX,
    translateY: 0,
    scale: 1,
    transformOrigin: "center",
  };
}

function annotateQa(markup) {
  return markup
    .replace(/<text(?![^>]*\bdata-qc-role=)/g, '<text data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true"')
    .replace(/<tspan(?![^>]*\bdata-qc-role=)/g, '<tspan data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true"')
    .replace(/<rect(?![^>]*\bdata-qc-allow-overlap=)/g, '<rect data-qc-allow-overlap="true"')
    .replace(/<image(?![^>]*\bdata-qc-allow-overlap=)/g, '<image data-qc-allow-overlap="true"')
    .replace(/<(rect|circle|line|path|polygon|polyline|ellipse)(?![^>]*\b(?:data-role|data-qc-role)=)/g, '<$1 data-role="functional"');
}

function frame(scene, body, metadata) {
  const title = metadata.title;
  const description = metadata.takeaway;
  const qualityMetadata = {
    artifactScope: "full-slide",
    embeddingTarget: "standalone-slide",
    slideType: metadata.archetype,
    contentTitle: title,
    layoutIntent: metadata.layoutIntent,
    takeaway: description,
    density: metadata.density || "balanced",
    designException: metadata.designException,
    contentMode: "full-slide",
    backgroundMode: "brand-frame",
    brandProfile: educationTheme.brandProfile,
    brandVariant: educationTheme.brandVariant,
    sourceSlides: scene.source_slides,
    officialLogoStatus: "downstream-owned",
  };
  const arrowMarkerDefs = [...new Set([C.accent, C.deep, C.failure, C.success, C.secondary])]
    .filter((color) => body.includes(`url(#arrow_${color.replace("#", "")})`))
    .map((color) => `<marker id="arrow_${color.replace("#", "")}" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="10" markerHeight="10" orient="auto-start-reverse"><path d="M1 1L11 6L1 11Z" fill="${color}"/></marker>`)
    .join("\n    ");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-labelledby="accessible_title accessible_description" data-artifact-scope="full-slide" data-embedding-target="standalone-slide" data-scene-id="${scene.scene_id}" data-brand-profile="${educationTheme.brandProfile}">
  <metadata id="slide_quality_metadata" type="application/json"><![CDATA[${JSON.stringify(qualityMetadata)}]]></metadata>
  <title id="accessible_title">${esc(title)}</title>
  <desc id="accessible_description">${esc(description)}</desc>
  <defs>
    <linearGradient id="backgroundGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${educationTheme.background.start}"/>
      <stop offset="56%" stop-color="${educationTheme.background.mid}"/>
      <stop offset="100%" stop-color="${educationTheme.background.end}"/>
    </linearGradient>
    <pattern id="technicalGrid" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M80 0H0V80" fill="none" stroke="#031334" stroke-opacity="0.035" stroke-width="1"/>
    </pattern>
    ${arrowMarkerDefs}
  </defs>
  <style>
    text { font-family: ${educationTheme.bodyFontFamily}; letter-spacing: 0; }
    .display { font-family: ${educationTheme.displayFontFamily}; }
  </style>
  <g id="brand_background" data-semantic-group="true" aria-label="RelTest-Education-Hintergrund">
    <rect width="1920" height="1080" fill="url(#backgroundGradient)"/>
    <rect width="1920" height="1080" fill="url(#technicalGrid)"/>
  </g>
  <g id="scene_content" data-qc-group="scene_content" data-qc-layer="content">${annotateQa(body)}</g>
</svg>`;
}

const caseSlides = {
  1: {
    title: "2023: Rückruf A320neo-Triebwerke",
    image: "a320neo-engine.jpg",
    source: "Quelle: aero.de · GTF-Rückruf und Herstellerkosten",
    introLabel: "Materialmangel an Triebwerken des Airbus A320neo",
    cause: "Prozessfehler in der Produktion von Metallpulver für Hochdruckturbinen-Scheiben",
    consequence: "Einschlüsse können entstehen und die Haltbarkeit der Triebwerke verkürzen.",
    metrics: [
      ["1.200", "betroffene Triebwerke", C.accent, C.accentSoft],
      ["4,5 Mrd. $", "mögliche Kosten für Untersuchung und Austausch", C.failure, C.failureSoft],
      ["1 Mrd. €", "erwartete Belastung für MTU im Jahr 2023", C.secondary, C.secondarySoft],
    ],
    contextId: "a320_case_context",
    impactId: "a320_business_impact",
    contextLabel: "Technische Ursache und Folge",
    impactLabel: "Ausmaß und wirtschaftliche Wirkung",
    manufacturerNote: "Betroffene Hersteller: Pratt & Whitney und MTU",
  },
  3: {
    title: "2015: PKW-Rückruf Takata-Airbags",
    image: "takata-airbag.jpg",
    source: "Quelle: Focus Online · Takata-Airbag-Rückruf",
    introLabel: "Fehlerhafter Gasgenerator in Takata-Airbags",
    cause: "Bei der Auslösung kann sich der Gasgenerator unkontrolliert entfalten und scharfe Metallfragmente freisetzen.",
    causeSize: 22,
    consequence: "Für Fahrzeuginsassen entstehen erhebliche Verletzungsgefahren.",
    metrics: [
      ["34 Mio.", "Fahrzeuge verschiedener Hersteller allein in den USA", C.accent, C.accentSoft],
      ["Mrd. €", "Belastung für die beteiligten Hersteller", C.failure, C.failureSoft],
      ["Recht", "rechtliche Konsequenzen und Imageschäden", C.secondary, C.secondarySoft],
    ],
    contextId: "takata_case_context",
    impactId: "takata_scope_and_consequences",
    contextLabel: "Ursache und Verletzungsfolge",
    impactLabel: "Ausmaß und Konsequenzen",
  },
  4: {
    title: "2016: Rückruf Galaxy Note 7",
    image: "galaxy-note7.jpg",
    source: "Quellen: PC-Welt und heise online · Galaxy-Note-7-Rückruf",
    introLabel: "Designfehler bei der Akkuproduktion",
    cause: "Ein Fehler in der Akkuauslegung führte bei Geräten des Samsung Galaxy Note 7 zu Akkubränden.",
    consequence: "Samsung startete die größte Rückrufaktion für ein Premium-Telefon in seiner Geschichte.",
    metrics: [
      ["2,5 Mio.", "weltweit verkaufte und betroffene Geräte", C.accent, C.accentSoft],
      ["5,3 Mrd. $", "geschätzter Verlust durch die Rückrufaktion", C.failure, C.failureSoft],
      ["Vertrauen", "erheblicher und nachhaltiger Imageschaden", C.secondary, C.secondarySoft],
    ],
    contextId: "note7_case_context",
    impactId: "note7_business_impact",
    contextLabel: "Akkufehler und Brandfolge",
    impactLabel: "Ausmaß und Geschäftswirkung",
  },
};

function renderCaseSlide(scene, config) {
  const context = `${card(78, 196, 800, 430)}${label(112, 238, "Technischer Auslöser")}${paragraph(112, 286, 730, config.introLabel, { size: 32, weight: 760, fill: C.deep })}${label(112, 382, "Ursache", C.failure)}${paragraph(112, 422, 730, config.cause, { size: config.causeSize || 24 })}${label(112, 523, "Folge", C.secondary)}${paragraph(112, 563, 730, config.consequence, { size: 24 })}`;
  const metrics = config.metrics
    .map(([value, caption, color, fill], index) => metricTile(78 + index * 267, 662, 244, value, caption, color, fill, { height: 214, valueSize: 36 }))
    .join("") + (config.manufacturerNote ? `${card(1080, 812, 620, 64, { fill: C.surface, stroke: C.accent, shadow: false })}${textLines({ x: 1390, y: 852, lines: [config.manufacturerNote], size: 22, weight: 740, fill: C.deep, anchor: "middle" })}` : "");
  const media = imagePanel({ slideNumber: scene.output_slide_number, filename: config.image, x: 930, y: 196, width: 912, height: 700, clipId: `case_media_clip_${scene.output_slide_number}` });
  const caseContext = animGroup(config.contextId, config.contextLabel, `${media}${context}${sourceLine(config.source)}`);
  return {
    svg: frame(scene, `${caseContext}${animGroup(config.impactId, config.impactLabel, metrics)}`, {
      title: config.title,
      takeaway: `${config.introLabel}: ${config.consequence}`,
      archetype: "media-aside-case-study",
      layoutIntent: "case-study-media-aside",
    }),
    targets: [target(config.contextId, config.contextLabel), target(config.impactId, config.impactLabel)],
    steps: [
      step(`show_${config.contextId}`, config.contextId, "show", chapterTrigger(scene, config.contextId)),
      step(`show_${config.impactId}`, config.impactId, "show", chapterTrigger(scene, config.impactId)),
    ],
    brief: { archetype: "Media Aside / Fallstudie", takeaway: `${config.introLabel}: ${config.consequence}`, animation: `${config.contextLabel}; danach ${config.impactLabel}.` },
  };
}

function renderSlide2(scene) {
  const plot = semanticGroup(
    "recall_chart_frame",
    "Achsen, Skalen und Legende der Rückrufstatistik",
    nestedSvg(path.join(outputRoot, "slide_002", "plots", "recall_statistics.svg"), 92, 258, 1330, 640, "recall_statistics_plot"),
  );
  const keyFigures = animGroup(
    "recall_key_figures",
    "Schlüsselwerte und Zehnjahresentwicklung",
    `${metricTile(1480, 270, 340, "125", "Rückrufaktionen 2009", C.accent, C.accentSoft)}${metricTile(1480, 430, 340, "390", "Rückrufaktionen 2019", C.failure, C.failureSoft)}${card(1480, 596, 340, 280, { fill: C.secondarySoft, stroke: C.secondary, shadow: false })}${label(1510, 636, "Entwicklung", C.secondary)}${textLines({ x: 1510, y: 706, lines: ["> 3×"], size: 64, weight: 800, fill: C.secondary, fontFamily: educationTheme.displayFontFamily })}${paragraph(1510, 757, 280, "mehr sicherheitskritische Rückrufe innerhalb von zehn Jahren", { size: 24, weight: 620 })}`,
  );
  const dataTrigger = chapterTrigger(scene, "recall_data_series");
  const figureTrigger = chapterTrigger(scene, "recall_key_figures");
  return {
    svg: frame(scene, `${plot}${keyFigures}${sourceLine("Quelle: KBA / ADAC, Stand 01/2020 · Werte aus der Quellgrafik")}`, {
      title: "Rückrufe auf dem Höchststand",
      takeaway: "Die Zahl sicherheitskritischer PKW-Rückrufaktionen hat sich zwischen 2009 und 2019 mehr als verdreifacht.",
      archetype: "data-chart",
      layoutIntent: "chart-with-key-figures",
      density: "dense",
    }),
    targets: [
      target("recall_actions_series", "Rückrufaktionen 2009 bis 2019"),
      target("affected_vehicles_series", "Betroffene Fahrzeuge 2009 bis 2019"),
      target("recall_key_figures", "Schlüsselwerte und Zehnjahresentwicklung"),
    ],
    steps: [
      step("draw_recall_actions_series", "recall_actions_series", "draw", dataTrigger),
      step("draw_affected_vehicles_series", "affected_vehicles_series", "draw", dataTrigger),
      step("show_recall_key_figures", "recall_key_figures", "show", figureTrigger),
    ],
    brief: { archetype: "Datenfolie", takeaway: "Rückrufaktionen haben sich 2009–2019 mehr als verdreifacht.", animation: "Achsenrahmen bleibt sichtbar; beide Datenserien erscheinen gemeinsam, danach die Schlusskennzahlen." },
  };
}

function renderSlide5(scene) {
  const root = semanticGroup(
    "consequence_root",
    "Gemeinsame Wurzel der Produktfolgen",
    `${card(610, 196, 700, 105, { fill: C.deep, stroke: C.deep, shadow: false })}${textLines({ x: 960, y: 262, lines: ["Folgen fehlerhafter Produkte"], size: 34, weight: 800, fill: "#FFFFFF", anchor: "middle", fontFamily: educationTheme.displayFontFamily })}`,
  );
  const nonlegal = animGroup("nonlegal_consequences", "Nicht-rechtliche Folgen", `<path d="M810 301V350H345V392" fill="none" stroke="${C.deep}" stroke-width="3"/>${card(78, 392, 535, 490, { fill: C.accentSoft, stroke: C.accent })}${label(112, 435, "Nicht rechtlich")}${textLines({ x: 112, y: 488, lines: ["Wirtschaftliche Verluste"], size: 30, weight: 760, fill: C.deep })}${bulletList(116, 548, 455, ["Einbußen an Umsatz", "Verlust von Marktstellung", "Image- und Vertrauensschäden"], { size: 25, gap: 72 })}`);
  const civil = animGroup("civil_consequences", "Zivilrechtliche Folgen", `<path d="M960 301V392" fill="none" stroke="${C.deep}" stroke-width="3"/>${card(693, 392, 535, 490, { fill: C.secondarySoft, stroke: C.secondary })}${label(727, 435, "Rechtlich · Zivilrecht", C.secondary)}${textLines({ x: 727, y: 488, lines: ["Gewährleistung"], size: 30, weight: 760, fill: C.deep })}${bulletList(731, 540, 455, ["Mängelausgleich", "Minderung oder Wandlung", "Ersatzlieferung"], { size: 23, gap: 50, bulletColor: C.secondary })}${textLines({ x: 727, y: 715, lines: ["Produkthaftung"], size: 30, weight: 760, fill: C.deep })}${paragraph(727, 759, 450, "Schadensersatz für Personen-, Sach- und Vermögensschäden", { size: 23 })}`);
  const criminal = animGroup("criminal_consequences", "Strafrechtliche Folgen", `<path d="M1110 301V350H1575V392" fill="none" stroke="${C.deep}" stroke-width="3"/>${card(1308, 392, 535, 490, { fill: C.failureSoft, stroke: C.failure })}${label(1342, 435, "Rechtlich · Strafrecht", C.failure)}${textLines({ x: 1342, y: 488, lines: ["Produktverantwortung"], size: 30, weight: 760, fill: C.deep })}${bulletList(1346, 548, 455, ["Strafrechtliche Sanktionen", "Freiheitsstrafe", "Geldstrafe"], { size: 25, gap: 72, bulletColor: C.failure })}`);
  return {
    svg: frame(scene, `${root}${nonlegal}${civil}${criminal}`, { title: "Konsequenzen von Unzuverlässigkeit", takeaway: "Fehlerhafte Produkte haben wirtschaftliche, zivilrechtliche und strafrechtliche Folgen.", archetype: "consequence-comparison", layoutIntent: "three-branch-consequence-tree" }),
    targets: [target("nonlegal_consequences", "Nicht-rechtliche Folgen"), target("civil_consequences", "Zivilrechtliche Folgen"), target("criminal_consequences", "Strafrechtliche Folgen")],
    steps: ["nonlegal_consequences", "civil_consequences", "criminal_consequences"].map((id) => step(`show_${id}`, id, "show", chapterTrigger(scene, id))),
    brief: { archetype: "Folgenstruktur", takeaway: "Unzuverlässigkeit wirkt wirtschaftlich und rechtlich.", animation: "Die Wurzel ist Startkontext; jeder Ast erscheint vollständig mit seinem eigenen Verbinder." },
  };
}

function influenceLabel(x, y, width, title) {
  const center = x + width / 2;
  return `<line x1="${center - 34}" y1="${y}" x2="${center + 34}" y2="${y}" stroke="${C.accent}" stroke-width="5" stroke-linecap="round"/>${textLines({ x: center, y: y + 45, lines: wrap(title, 22), size: 27, weight: 760, fill: C.deep, anchor: "middle", lineHeight: 1.18 })}`;
}

function renderSlide6(scene) {
  const core = semanticGroup("reliability_core", "Zuverlässigkeit als Bezugszentrum", `<ellipse cx="960" cy="555" rx="315" ry="150" fill="${C.surface}" stroke="${C.deep}" stroke-width="3"/><ellipse cx="960" cy="555" rx="295" ry="130" fill="none" stroke="${C.accent}" stroke-opacity="0.28" stroke-width="2"/>${textLines({ x: 960, y: 568, lines: ["Zuverlässigkeit"], size: 42, weight: 820, fill: C.deep, anchor: "middle", fontFamily: educationTheme.displayFontFamily })}`);
  const development = animGroup("development_pressure", "Entwicklungsdruck", `${influenceLabel(120, 238, 360, "Kürzere Entwicklungszeit")}${influenceLabel(520, 192, 360, "Verringerte Entwicklungskosten")}${arrow(470, 340, 700, 457, C.accent, 5)}${arrow(790, 320, 835, 408, C.accent, 5)}`);
  const complexity = animGroup("complexity_pressure", "Komplexitätsdruck", `${influenceLabel(1040, 192, 320, "Höhere Komplexität")}${influenceLabel(1430, 258, 360, "Größere Funktionalität")}${arrow(1135, 320, 1085, 408, C.accent, 5)}${arrow(1460, 365, 1218, 465, C.accent, 5)}`);
  const counter = animGroup("counteracting_demands", "Weitere Einflüsse", `${influenceLabel(1430, 720, 380, "Gestiegene Kundenanforderungen")}${influenceLabel(760, 830, 400, "Minimierung von Fehlerkosten")}${influenceLabel(120, 720, 380, "Steigende Produkthaftung")}${arrow(1460, 705, 1218, 645, C.accent, 5)}${arrow(960, 820, 960, 712, C.accent, 5)}${arrow(470, 705, 700, 645, C.accent, 5)}`);
  return {
    svg: frame(scene, `${development}${complexity}${counter}${core}`, { title: "Einflüsse auf die Zuverlässigkeit", takeaway: "Sieben technische, wirtschaftliche und marktbezogene Einflüsse wirken gemeinsam auf die Zuverlässigkeit.", archetype: "radial-influence-map", layoutIntent: "source-oriented-radial-influence-map" }),
    targets: [target("development_pressure", "Entwicklungsdruck"), target("complexity_pressure", "Komplexitätsdruck"), target("counteracting_demands", "Weitere Einflüsse")],
    steps: ["development_pressure", "complexity_pressure", "counteracting_demands"].map((id) => step(`show_${id}`, id, "show", chapterTrigger(scene, id))),
    brief: { archetype: "Radiale Einflusskarte", takeaway: "Sieben Einflüsse wirken gemeinsam auf die Zuverlässigkeit.", animation: "Das Zentrum ist Startkontext; drei vollständige Pfeil-/Label-Bündel folgen der Sprecherreihenfolge." },
  };
}

function circleCard(cx, cy, radius, fill, title) {
  const lines = wrap(title, 15);
  return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${fill}"/><circle cx="${cx}" cy="${cy}" r="${radius - 13}" fill="none" stroke="#FFFFFF" stroke-opacity="0.24" stroke-width="2"/>${textLines({ x: cx, y: cy - ((lines.length - 1) * 22), lines, size: 34, weight: 800, fill: "#FFFFFF", anchor: "middle", lineHeight: 1.15 })}`;
}

function renderSlide7(scene) {
  const plot = nestedSvg(path.join(outputRoot, "slide_007", "plots", "purchase_criteria.svg"), 78, 286, 1764, 590, "purchase_criteria_plot");
  const highlights = `${pictogram("shieldCheck", { cx: 126, cy: 226, size: 48, color: C.accent, background: C.accentSoft, radius: 39 })}${textLines({ x: 180, y: 218, lines: ["Zuverlässigkeit"], size: 28, weight: 800, fill: C.deep })}${textLines({ x: 180, y: 247, lines: ["Top-Kriterium über alle vier Jahre"], size: 18, weight: 650, fill: C.muted })}<line x1="610" y1="190" x2="610" y2="260" stroke="${C.border}" stroke-width="2"/>${pictogram("shield", { cx: 674, cy: 226, size: 48, color: C.success, background: C.successSoft, radius: 39 })}${textLines({ x: 728, y: 218, lines: ["Sicherheit"], size: 28, weight: 800, fill: C.deep })}${textLines({ x: 728, y: 247, lines: ["nahezu gleich hoher Stellenwert"], size: 18, weight: 650, fill: C.muted })}${textLines({ x: 1210, y: 225, lines: ["Beide Kriterien liegen deutlich vor", "Preis, Verbrauch und Design."], size: 22, weight: 680, fill: C.deep, lineHeight: 1.3 })}`;
  const chart = semanticGroup("purchase_chart_context", "Vollständiger Mehrjahresvergleich der Kaufkriterien", `${highlights}${plot}`);
  return {
    svg: frame(scene, `${chart}${sourceLine("Quelle: VuMA · ID 171605 · Deutschland 2017–2020, deutschsprachige Bevölkerung ab 14 Jahren")}`, { title: "Kriterien beim PKW-Neuwagenkauf", takeaway: "Zuverlässigkeit und Sicherheit besitzen für Käufer den höchsten Stellenwert.", archetype: "data-chart", layoutIntent: "multi-year-horizontal-bars", density: "dense" }),
    targets: [],
    steps: [],
    brief: { archetype: "Datenfolie", takeaway: "Zuverlässigkeit und Sicherheit sind die wichtigsten Kaufkriterien.", animation: "Statisch für direkten Mehrjahresvergleich." },
  };
}

function renderSlide8(scene) {
  const media = imagePanel({ slideNumber: 8, filename: "industrial-plant.jpg", x: 78, y: 192, width: 720, height: 720, clipId: "motivation_media" });
  const overlay = `<rect x="78" y="192" width="720" height="720" rx="8" fill="${C.deep}" opacity="0.16"/>`;
  const mediaContext = animGroup("motivation_media_context", "Industrieller Anlagenkontext", `${media}${overlay}`);
  const setup = animGroup(
    "forecast_quote_setup",
    "Zitat zum Unvorhersehbaren",
    `${card(880, 260, 862, 360, { fill: C.surface, stroke: C.border, shadow: false })}${label(920, 305, "SKF Trouble-Free Operation Service Program")}<text x="916" y="424" font-size="116" font-weight="760" fill="${C.accent}" opacity="0.42">„</text>${textLines({ x: 1018, y: 380, lines: ["Drei Dinge kann keiner", "voraussagen:", "das Leben, den Tod und den", "Ausfall einer Maschine."], size: 38, weight: 740, fill: C.deep, lineHeight: 1.24 })}`,
  );
  const conclusion = animGroup(
    "forecast_quote_conclusion",
    "Schlusszeile des SKF-Zitats",
    `<line x1="1018" y1="545" x2="1688" y2="545" stroke="${C.accent}" stroke-width="3"/><text x="1018" y="590" font-size="34" font-weight="820" fill="${C.accent}">Machen Sie zwei daraus.“</text>`,
  );
  const implication = animGroup(
    "forecast_quote_implication",
    "Praktische Bedeutung des Zitats",
    `${card(880, 680, 862, 200, { fill: C.successSoft, stroke: C.success, shadow: false })}<rect x="880" y="680" width="10" height="200" rx="5" fill="${C.success}"/>${label(930, 730, "Intention", C.success)}${textLines({ x: 930, y: 786, lines: ["Lebensdauer-Ende vorhersagen", "und vor dem Ausfall tauschen."], size: 30, weight: 760, fill: C.deep, lineHeight: 1.28 })}`,
  );
  return {
    svg: frame(scene, `${mediaContext}${setup}${conclusion}${implication}`, { title: "Maschinenausfälle planbar machen", takeaway: "Vorhersagbare Lebensdauer ermöglicht rechtzeitigen Austausch und störungsfreien Betrieb.", archetype: "key-takeaway-quote", layoutIntent: "industrial-media-quote" }),
    targets: [target("motivation_media_context", "Industrieller Anlagenkontext"), target("forecast_quote_setup", "Zitat zum Unvorhersehbaren"), target("forecast_quote_conclusion", "Schlusszeile des SKF-Zitats"), target("forecast_quote_implication", "Praktische Bedeutung des Zitats")],
    steps: [step("show_motivation_media_context", "motivation_media_context", "show", chapterTrigger(scene, "motivation_media_context")), step("show_forecast_quote_setup", "forecast_quote_setup", "show", chapterTrigger(scene, "forecast_quote_setup")), step("show_forecast_quote_conclusion", "forecast_quote_conclusion", "show", chapterTrigger(scene, "forecast_quote_conclusion")), step("show_forecast_quote_implication", "forecast_quote_implication", "show", chapterTrigger(scene, "forecast_quote_implication"))],
    brief: { archetype: "Key Takeaway / Zitat", takeaway: "Ausfallzeitpunkte sollen planbar werden.", animation: "Anlagenkontext bei der SKF-Nennung; Zitatkörper und originale Schlusszeile innerhalb derselben Zitatkarte; praktische Bedeutung danach separat." },
  };
}

function hierarchyCard(x, y, width, height, title, subtitle, accent = C.accent) {
  return `${card(x, y, width, height, { fill: C.surface, stroke: accent, shadow: false })}<rect x="${x}" y="${y}" width="8" height="${height}" rx="4" fill="${accent}"/>${textLines({ x: x + 28, y: y + 44, lines: [title], size: 26, weight: 800, fill: C.deep })}${subtitle ? paragraph(x + 28, y + 80, width - 52, subtitle, { size: 20, weight: 700, fill: C.success }) : ""}`;
}

function renderSlide9(scene) {
  const root = semanticGroup("vehicle_root", "PKW als Systembezug", `
    <rect x="810" y="205" width="300" height="95" rx="8" fill="${C.deep}"/>
    ${pictogram("car", { cx: 866, cy: 252, size: 46, color: "#FFFFFF" })}
    ${textLines({ x: 910, y: 252, lines: ["PKW"], size: 32, weight: 820, fill: "#FFFFFF", fontFamily: educationTheme.displayFontFamily })}
  `);
  const hierarchy = animGroup("vehicle_system_hierarchy", "Systemstruktur eines PKW", `
    <path d="M960 300V340H390V390M960 340V390M960 340H1530V390" fill="none" stroke="${C.deepSoft}" stroke-width="4"/>
    <path d="M390 490V555H245V630M390 555H515V630M515 555H785V630M785 555H1055V630" fill="none" stroke="${C.deepSoft}" stroke-width="4"/>
    ${hierarchyCard(220, 390, 340, 100, "Motor")}
    ${hierarchyCard(790, 390, 340, 100, "Getriebe")}
    ${hierarchyCard(1360, 390, 340, 100, "Fahrwerk")}
    ${hierarchyCard(120, 630, 250, 100, "Kolben")}
    ${hierarchyCard(390, 630, 250, 100, "Pleuel")}
    ${hierarchyCard(660, 630, 250, 100, "Kurbelgehäuse")}
    ${hierarchyCard(930, 630, 250, 100, "Kurbelwelle")}
  `);
  const functions = animGroup("function_examples", "Funktionen von Motor und PKW", `
    ${textLines({ x: 910, y: 282, lines: ["Fahren"], size: 18, weight: 700, fill: C.accentSoft })}
    ${textLines({ x: 248, y: 470, lines: ["Leistung erzeugen"], size: 20, weight: 700, fill: C.success })}
    ${textLines({ x: 818, y: 470, lines: ["Drehmoment wandeln"], size: 20, weight: 700, fill: C.success })}
    ${textLines({ x: 1388, y: 470, lines: ["Fahrzeug führen"], size: 20, weight: 700, fill: C.success })}
    ${textLines({ x: 148, y: 710, lines: ["Druck übertragen"], size: 18, weight: 700, fill: C.success })}
    ${textLines({ x: 418, y: 710, lines: ["Kraft übertragen"], size: 18, weight: 700, fill: C.success })}
    ${textLines({ x: 688, y: 710, lines: ["Bauteile aufnehmen"], size: 18, weight: 700, fill: C.success })}
    ${textLines({ x: 958, y: 710, lines: ["Drehung erzeugen"], size: 18, weight: 700, fill: C.success })}
    ${card(1230, 565, 610, 345, { fill: C.surface, stroke: C.border, shadow: false })}
    ${label(1264, 607, "Funktionszusammenhang")}
    ${textLines({ x: 1320, y: 660, lines: ["Kolben"], size: 26, weight: 820, fill: C.deep, anchor: "middle" })}
    ${textLines({ x: 1535, y: 660, lines: ["Motor"], size: 26, weight: 820, fill: C.deep, anchor: "middle" })}
    ${textLines({ x: 1750, y: 660, lines: ["PKW"], size: 26, weight: 820, fill: C.deep, anchor: "middle" })}
    ${textLines({ x: 1264, y: 698, lines: ["FUNKTION"], size: 18, weight: 800, fill: C.success })}
    ${textLines({ x: 1320, y: 724, lines: ["Druck", "übertragen"], size: 18, weight: 730, fill: C.success, anchor: "middle", lineHeight: 1.12 })}
    ${arrow(1400, 730, 1450, 730, C.success, 3)}
    ${textLines({ x: 1535, y: 724, lines: ["Leistung", "erzeugen"], size: 18, weight: 730, fill: C.success, anchor: "middle", lineHeight: 1.12 })}
    ${arrow(1615, 730, 1665, 730, C.success, 3)}
    ${textLines({ x: 1750, y: 736, lines: ["Fahren"], size: 18, weight: 730, fill: C.success, anchor: "middle" })}
    <line x1="1264" y1="775" x2="1806" y2="775" stroke="${C.border}" stroke-width="2"/>
  `);
  const failure = animGroup("failure_propagation", "Fehlerwirkung vom Kolben bis zum PKW", `
    ${pictogram("bolt", { cx: 350, cy: 680, size: 38, color: "#FFFFFF", background: C.failure, radius: 30 })}
    ${textLines({ x: 1264, y: 813, lines: ["FEHLERWIRKUNG"], size: 18, weight: 800, fill: C.failure })}
    ${textLines({ x: 1320, y: 846, lines: ["Kolben", "fällt aus"], size: 18, weight: 760, fill: C.failure, anchor: "middle", lineHeight: 1.15 })}
    ${arrow(1400, 850, 1450, 850, C.failure, 3)}
    ${textLines({ x: 1535, y: 846, lines: ["keine Leistungs-", "abgabe"], size: 18, weight: 760, fill: C.failure, anchor: "middle", lineHeight: 1.15 })}
    ${arrow(1615, 850, 1665, 850, C.failure, 3)}
    ${textLines({ x: 1750, y: 846, lines: ["Fahren nicht", "möglich"], size: 18, weight: 760, fill: C.failure, anchor: "middle", lineHeight: 1.15 })}
  `);
  return {
    svg: frame(scene, `${hierarchy}${root}${functions}${failure}`, { title: "Was ist Zuverlässigkeit?", takeaway: "Der Ausfall des Kolbens wirkt über den Motor bis auf die Fahrfunktion des PKW.", archetype: "system-hierarchy", layoutIntent: "orthogonal-system-tree-with-causal-failure-chain" }),
    targets: [target("vehicle_system_hierarchy", "Systemstruktur eines PKW"), target("function_examples", "Funktionen von Motor und PKW"), target("failure_propagation", "Fehlerwirkung vom Kolben bis zum PKW")],
    steps: [step("show_vehicle_system_hierarchy", "vehicle_system_hierarchy", "show", chapterTrigger(scene, "vehicle_system_hierarchy")), step("show_function_examples", "function_examples", "show", chapterTrigger(scene, "function_examples")), step("show_failure_propagation", "failure_propagation", "show", chapterTrigger(scene, "failure_propagation"))],
    brief: { archetype: "Systemhierarchie", takeaway: "Der Ausfall einer Komponente wirkt bis zur Systemfunktion.", animation: "Der PKW ist Startkontext; Baumstruktur und Verbinder erscheinen gemeinsam mit den Knoten, danach Funktionen und Fehlerfortpflanzung." },
  };
}

function stressSideCard(x, y, titleText, items, tone) {
  const color = tone === "stress" ? C.accent : C.deep;
  const fill = tone === "stress" ? C.accentSoft : C.surfaceSoft;
  return `${card(x, y, 360, 270, { fill, stroke: color, shadow: false })}${label(x + 28, y + 42, titleText, color)}${bulletList(x + 32, y + 96, 300, items, { size: 22, gap: 58, bulletColor: color })}`;
}

function renderSlide10(scene) {
  const plot = semanticGroup(
    "ssi_plot_frame",
    "Achsen und Skalen des Stress-Strength-Diagramms",
    nestedSvg(path.join(outputRoot, "slide_010", "plots", "stress_strength.svg"), 450, 210, 1020, 580, "stress_strength_plot"),
  );
  const stressCard = animGroup("stress_influences", "Einflüsse auf die Belastung", stressSideCard(78, 280, "Belastung", ["Kundenverhalten", "Anwendungsfälle", "Umgebungsbedingungen"], "stress"));
  const strengthCard = animGroup("strength_influences", "Einflüsse auf die Belastbarkeit", stressSideCard(1482, 280, "Belastbarkeit", ["Produktauslegung", "Produktionsprozesse", "Materialstreuung"], "strength"));
  const consequences = animGroup("failure_consequences", "Folgen des Ausfallbereichs", `${generatedPictogramTile(scene.output_slide_number, 490, 810, 290, "Kosten", "re1-costs.png")}${generatedPictogramTile(scene.output_slide_number, 815, 810, 290, "Produkthaftung", "re1-product-liability.png")}${generatedPictogramTile(scene.output_slide_number, 1140, 810, 290, "Kundenzufriedenheit", "re1-customer-dissatisfaction.png")}`);
  const stressPhrase = chapterTrigger(scene, "stress_context");
  const strengthPhrase = chapterTrigger(scene, "strength_context");
  const overlapPhrase = chapterTrigger(scene, "failure_overlap");
  const consequencePhrase = chapterTrigger(scene, "failure_consequences");
  return {
    svg: frame(scene, `${plot}${stressCard}${strengthCard}${consequences}`, { title: "Stress-Strength-Interference", takeaway: "Ausfälle entstehen im Überlappungsbereich von Belastung und Belastbarkeit.", archetype: "technical-diagram", layoutIntent: "stress-strength-with-context" }),
    targets: [target("stress_distribution", "Belastungsverteilung"), target("stress_influences", "Einflüsse auf die Belastung"), target("strength_distribution", "Belastbarkeitsverteilung"), target("strength_influences", "Einflüsse auf die Belastbarkeit"), target("failure_overlap", "Ausfallbereich"), target("failure_consequences", "Ausfallfolgen")],
    steps: [step("show_stress_distribution", "stress_distribution", "draw", stressPhrase), step("show_stress_influences", "stress_influences", "show", stressPhrase), step("show_strength_distribution", "strength_distribution", "draw", strengthPhrase), step("show_strength_influences", "strength_influences", "show", strengthPhrase), step("show_failure_overlap", "failure_overlap", "show", overlapPhrase), step("show_failure_consequences", "failure_consequences", "show", consequencePhrase)],
    brief: { archetype: "Technisches Diagramm", takeaway: "Belastung über Belastbarkeit erzeugt Ausfälle.", animation: "Belastung und Kontext, Belastbarkeit und Kontext, Überlappung, Folgen." },
  };
}

function renderSlide11(scene) {
  const context = `${card(110, 180, 580, 64, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${textLines({ x: 400, y: 220, lines: ["Belastung: Kundenverhalten · Anwendungsfälle"], size: 21, weight: 700, fill: C.deep, anchor: "middle" })}${card(770, 180, 580, 64, { fill: C.surfaceSoft, stroke: C.deep, shadow: false })}${textLines({ x: 1060, y: 220, lines: ["Belastbarkeit: Produktauslegung · Produktionsprozesse"], size: 20, weight: 700, fill: C.deep, anchor: "middle" })}`;
  const plot = semanticGroup(
    "shift_plot_context",
    "Belastung, Achsen und gestrichelter Vorher-Zustand",
    nestedSvg(path.join(outputRoot, "slide_011", "plots", "stress_strength.svg"), 110, 276, 1240, 588, "stress_strength_shift_plot"),
  );
  const explanationFrame = card(1400, 248, 410, 530, { fill: C.surface, stroke: C.border });
  const shiftedExplanation = animGroup("shifted_strength_explanation", "Belastbarkeit erhöhen", `${label(1434, 294, "Qualitätsverbesserung")}${textLines({ x: 1434, y: 365, lines: ["Belastbarkeit", "erhöhen"], size: 36, weight: 800, fill: C.deep, lineHeight: 1.18 })}${arrow(1460, 495, 1740, 495, C.success, 6)}`);
  const overlapExplanation = animGroup("reduced_overlap_explanation", "Kleinerer Ausfallbereich", `${card(1434, 592, 342, 130, { fill: C.successSoft, stroke: C.success, shadow: false })}${textLines({ x: 1605, y: 650, lines: ["kleinerer", "Ausfallbereich"], size: 27, weight: 800, fill: C.success, anchor: "middle", lineHeight: 1.2 })}`);
  const shiftPhrase = chapterTrigger(scene, "shifted_strength_distribution");
  const overlapPhrase = chapterTrigger(scene, "failure_overlap");
  const shiftUserUnits = 74.8;
  return {
    svg: frame(scene, `${context}${plot}${explanationFrame}${shiftedExplanation}${overlapExplanation}`, { title: "Belastbarkeit erhöhen", takeaway: "Eine nach rechts verschobene Belastbarkeitsverteilung reduziert den Überlappungs- und damit den Ausfallbereich.", archetype: "technical-diagram-change", layoutIntent: "stress-strength-shift" }),
    targets: [target("shifted_strength_distribution", "Nach rechts bewegte Belastbarkeit"), target("shifted_strength_explanation", "Belastbarkeit erhöhen"), target("failure_overlap", "Reduzierter Ausfallbereich"), target("reduced_overlap_explanation", "Kleinerer Ausfallbereich")],
    steps: [transformStep("move_shifted_strength_distribution", "shifted_strength_distribution", shiftPhrase, -shiftUserUnits), step("show_shifted_strength_explanation", "shifted_strength_explanation", "show", shiftPhrase), step("show_reduced_failure_overlap", "failure_overlap", "show", overlapPhrase), step("show_reduced_overlap_explanation", "reduced_overlap_explanation", "show", overlapPhrase)],
    brief: { archetype: "Technisches Diagramm / Zustandsänderung", takeaway: "Höhere Belastbarkeit reduziert Ausfälle.", animation: "Der gestrichelte Vorher-Zustand ist Frame-0-Kontext; dieselbe Zielkurve bewegt sich sichtbar nach rechts, danach erscheinen Ausfallbereich und Ergebnis gemeinsam." },
  };
}

function renderSlide12(scene) {
  const context = `${card(78, 180, 500, 64, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${textLines({ x: 328, y: 220, lines: ["Belastung: Nutzung und Umgebung"], size: 21, weight: 700, fill: C.deep, anchor: "middle" })}${card(640, 180, 518, 64, { fill: C.surfaceSoft, stroke: C.deep, shadow: false })}${textLines({ x: 899, y: 220, lines: ["Belastbarkeit: Auslegung und Produktion"], size: 21, weight: 700, fill: C.deep, anchor: "middle" })}`;
  const plot = semanticGroup(
    "tradeoff_plot_context",
    "Bekannter Stress-Strength-Kontext",
    nestedSvg(path.join(outputRoot, "slide_012", "plots", "stress_strength.svg"), 78, 250, 1080, 590, "stress_strength_tradeoff_plot"),
  );
  const balanceScaleHref = mediaDataUri(localMedia(scene.output_slide_number, "re1-reliability-cost-balance.png"));
  const balanceScale = `<image x="1408" y="468" width="240" height="230" href="${balanceScaleHref}" preserveAspectRatio="xMidYMid meet" data-source-media="true" data-pictogram-asset-type="generated_png" data-pictogram-style="reltest-education-minimal-v1" aria-hidden="true"/>`;
  const tradeoff = animGroup("quality_cost_tradeoff", "Zielkonflikt aus Ausfällen und Kosten", `${card(1215, 238, 625, 570, { fill: C.surface, stroke: C.border })}${label(1255, 286, "Zielkonflikt")}${metricTile(1255, 320, 250, "↓ Ausfälle", "durch höhere Belastbarkeit", C.success, C.successSoft, { height: 140, valueSize: 36 })}${metricTile(1550, 320, 250, "↑ Kosten", "durch Überdimensionierung", C.failure, C.failureSoft, { height: 140, valueSize: 36 })}${balanceScale}<rect x="1235" y="710" width="585" height="68" rx="8" fill="${C.secondarySoft}" stroke="${C.secondary}"/><text x="1528" y="751" font-size="20" font-weight="760" fill="${C.deep}" text-anchor="middle">Ziel: Ausfälle minimieren · Überdimensionierung vermeiden</text>`);
  return {
    svg: frame(scene, `${context}${plot}${tradeoff}`, { title: "Zuverlässigkeit ist ein Zielkonflikt", takeaway: "Ausfälle sollen sinken, ohne unnötige und teure Überdimensionierung zu erzeugen.", archetype: "formula-tradeoff", layoutIntent: "diagram-with-balance", density: "dense" }),
    targets: [target("quality_cost_tradeoff", "Zielkonflikt aus Ausfällen und Kosten")],
    steps: [step("show_quality_cost_tradeoff", "quality_cost_tradeoff", "show", chapterTrigger(scene, "quality_cost_tradeoff"))],
    brief: { archetype: "Trade-off", takeaway: "Ausfallreduktion und Kosten müssen ausbalanciert werden.", animation: "Trade-off als eine unteilbare Gruppe." },
  };
}

function renderSlide13(scene) {
  const rows = [
    { y: 280, icon: "percent", color: C.accent, background: C.accentSoft, segments: [{ text: "Zuverlässigkeit ist die " }, { text: "Wahrscheinlichkeit", fill: C.accent, weight: 820 }, { text: " dafür," }] },
    { y: 420, icon: "package", color: C.deep, background: C.surfaceSoft, segments: [{ text: "dass ein " }, { text: "Produkt", fill: C.deep, weight: 820 }] },
    { y: 560, icon: "clock", color: C.secondary, background: C.secondarySoft, segments: [{ text: "während einer definierten " }, { text: "Zeitdauer", fill: C.secondary, weight: 820 }] },
    { y: 700, icon: "settings", color: C.accent, background: C.accentSoft, segments: [{ text: "unter gegebenen " }, { text: "Funktions- und Umgebungsbedingungen", fill: C.accent, weight: 820 }] },
    { y: 840, icon: "shieldCheck", color: C.success, background: C.successSoft, segments: [{ text: "nicht ausfällt.", fill: C.success, weight: 820 }] },
  ];
  const definition = animGroup("reliability_definition", "Definition der Zuverlässigkeit", `
    <line x1="210" y1="250" x2="210" y2="865" stroke="${C.border}" stroke-width="4"/>
    ${rows.map((row, index) => `${pictogram(row.icon, { cx: 210, cy: row.y - 12, size: 48, color: row.color, background: row.background, radius: 40 })}${richTextLine(290, row.y, row.segments, { size: 38, weight: 620, fill: C.deep })}${index < rows.length - 1 ? `<line x1="290" y1="${row.y + 54}" x2="1750" y2="${row.y + 54}" stroke="${C.border}" stroke-width="1.5"/>` : ""}`).join("")}
  `);
  return {
    svg: frame(scene, definition, { title: "Definition der Zuverlässigkeit", takeaway: "Zuverlässigkeit ist die Wahrscheinlichkeit des ausfallfreien Funktionserhalts über eine definierte Zeit unter gegebenen Bedingungen.", archetype: "definition", layoutIntent: "definition-pictogram-track" }),
    targets: [target("reliability_definition", "Definition der Zuverlässigkeit")],
    steps: [step("show_reliability_definition", "reliability_definition", "show", chapterTrigger(scene, "reliability_definition"))],
    brief: { archetype: "Definition", takeaway: "Wahrscheinlichkeit, Produkt, Zeitdauer und Bedingungen sind untrennbare Bestandteile.", animation: "Definition erscheint als atomare Einheit." },
  };
}

function renderSlide14(scene) {
  const plot = `<g id="bathtub_curve_plot" data-plot-asset="true" aria-label="Badewannenkurve mit drei Lebensdauerbereichen">
    <rect x="164" y="294" width="492" height="356" fill="${C.failureSoft}" opacity="0.42"/>
    <rect x="656" y="294" width="656" height="356" fill="${C.secondarySoft}" opacity="0.36"/>
    <rect x="1312" y="294" width="492" height="356" fill="${C.secondarySoft}" opacity="0.58"/>
    <line x1="164" y1="650" x2="1804" y2="650" stroke="${C.deep}" stroke-width="3"/>
    <line x1="164" y1="294" x2="164" y2="650" stroke="${C.deep}" stroke-width="3"/>
    <line x1="656" y1="294" x2="656" y2="650" stroke="${C.deepSoft}" stroke-width="2" stroke-dasharray="8 7"/>
    <line x1="1312" y1="294" x2="1312" y2="650" stroke="${C.deepSoft}" stroke-width="2" stroke-dasharray="8 7"/>
    <text x="984" y="700" font-size="25" font-weight="760" fill="${C.deep}" text-anchor="middle">Lebensdauer <tspan font-style="italic">t</tspan></text>
    <text x="118" y="482" font-size="25" font-weight="760" fill="${C.deep}" text-anchor="middle" transform="rotate(-90 118 482)">Ausfallrate λ(<tspan font-style="italic">t</tspan>)</text>
    <g id="bathtub_curve_path" aria-label="Ausgangsverlauf der Badewannenkurve">
      <path d="M176 320 C232 505 450 584 656 604 C860 623 1110 617 1312 607 C1500 598 1706 530 1792 322" fill="none" stroke="${C.deep}" stroke-width="6" stroke-linecap="round"/>
    </g>
    <g id="qualitative_plot_effect" aria-label="Risikoreduktion im Früh- und Zufallsausfallbereich">
      <path d="M176 445 C286 565 488 607 656 614 C880 623 1118 619 1312 617" fill="none" stroke="${C.accent}" stroke-width="5" stroke-linecap="round"/>
      ${arrow(270, 462, 270, 548, C.accent, 5)}
    </g>
    <g id="quantitative_plot_effect" aria-label="Risikoreduktion im Ermüdungsausfallbereich">
      <path d="M1312 617 C1512 616 1684 584 1792 500" fill="none" stroke="${C.accent}" stroke-width="5" stroke-linecap="round"/>
      ${arrow(1680, 516, 1680, 582, C.accent, 5)}
    </g>
    ${[
      [410, "1", "Frühausfälle", C.failure],
      [984, "2", "Zufallsausfälle", C.secondary],
      [1558, "3", "Ermüdungsausfälle", C.secondary],
    ].map(([x, number, name, color]) => `<circle cx="${x}" cy="340" r="24" fill="#FFFFFF" stroke="${color}" stroke-width="2"/><text x="${x}" y="349" font-size="25" font-weight="820" fill="${color}" text-anchor="middle">${number}</text><text x="${x}" y="397" font-size="23" font-weight="800" fill="${color}" text-anchor="middle">${name}</text>`).join("")}
  </g>`;
  const qualitative = animGroup("qualitative_method_focus", "Fokus qualitative Methoden", `${card(164, 194, 1136, 100, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${textLines({ x: 732, y: 252, lines: ["Fokus qualitative Zuverlässigkeitsmethoden"], size: 27, weight: 800, fill: C.deep, anchor: "middle" })}${card(164, 756, 1136, 126, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${textLines({ x: 732, y: 829, lines: ["Risikoreduktion durch Systemanalyse"], size: 31, weight: 800, fill: C.deep, anchor: "middle" })}`);
  const quantitative = animGroup("quantitative_method_focus", "Fokus quantitative Methoden", `${card(1324, 194, 480, 100, { fill: C.secondarySoft, stroke: C.secondary, shadow: false })}${textLines({ x: 1564, y: 230, lines: ["Fokus quantitative", "Zuverlässigkeitsmethoden"], size: 23, weight: 800, fill: C.deep, anchor: "middle", lineHeight: 1.18 })}${card(1324, 756, 480, 126, { fill: C.secondarySoft, stroke: C.secondary, shadow: false })}${textLines({ x: 1564, y: 828, lines: ["Nachweis der Zuverlässigkeit"], size: 25, weight: 800, fill: C.deep, anchor: "middle" })}`);
  return {
    svg: frame(scene, `${plot}${qualitative}${quantitative}`, { title: "Einteilung der Zuverlässigkeitsmethoden", takeaway: "Qualitative Methoden reduzieren Frühausfälle durch Systemanalyse; quantitative Methoden reduzieren Ermüdungsausfälle und weisen Zuverlässigkeit nach.", archetype: "diagram-method-mapping", layoutIntent: "complete-bathtub-curve-with-reduction-effects-and-method-focus" }),
    targets: [target("bathtub_curve_path", "Ausgangsverlauf der Badewannenkurve"), target("qualitative_plot_effect", "Risikoreduktion im Frühausfallbereich"), target("qualitative_method_focus", "Qualitative Methoden"), target("quantitative_plot_effect", "Reduktion im Ermüdungsbereich"), target("quantitative_method_focus", "Quantitative Methoden")],
    steps: [step("draw_bathtub_curve_path", "bathtub_curve_path", "draw", planTrigger(scene, "bathtub_curve_overview")), step("show_qualitative_plot_effect", "qualitative_plot_effect", "draw", planTrigger(scene, "qualitative_method_focus")), step("show_qualitative_method_focus", "qualitative_method_focus", "show", planTrigger(scene, "qualitative_method_focus")), step("show_quantitative_plot_effect", "quantitative_plot_effect", "draw", planTrigger(scene, "quantitative_method_focus")), step("show_quantitative_method_focus", "quantitative_method_focus", "show", planTrigger(scene, "quantitative_method_focus"))],
    brief: { archetype: "Diagramm und Methodenfokus", takeaway: "Methodenkategorien adressieren unterschiedliche Ausfallbereiche und senken den Ausgangsverlauf gezielt ab.", animation: "Ausgangskurve zeichnen; qualitative und quantitative Reduktionswirkung jeweils zusammen mit ihrer Ergebnisbox zeigen." },
  };
}

function toolbox(x, y, width, titleText, purposeLines, methods, color, fill, iconId) {
  return `${card(x, y, width, 610, { fill, stroke: color })}<rect x="${x}" y="${y}" width="${width}" height="84" rx="8" fill="${color}"/><text x="${x + 34}" y="${y + 55}" font-size="30" font-weight="800" fill="#FFFFFF">${esc(titleText)}</text>${label(x + 34, y + 132, "Aufgabe", color)}${textLines({ x: x + 34, y: y + 184, lines: purposeLines, size: 27, weight: 760, fill: C.deep, lineHeight: 1.3 })}${pictogram(iconId, { cx: x + width - 94, cy: y + 180, size: 94 })}<line x1="${x + 34}" y1="${y + 282}" x2="${x + width - 34}" y2="${y + 282}" stroke="${C.border}" stroke-width="1.5"/>${label(x + 34, y + 328, "Typische Werkzeuge", color)}${bulletList(x + 38, y + 380, width - 72, methods, { size: 23, gap: 48, bulletColor: color, maxChars: 42 })}`;
}

function renderSlide15(scene) {
  const qualitative = animGroup("qualitative_toolbox", "Qualitativer Werkzeugkasten", toolbox(100, 240, 810, "Qualitative Methoden", ["Kritische Ausfallmechanismen", "identifizieren und Zuverlässigkeit verbessern"], ["FMEA und FTA", "HALT, HASS und HASA", "ESS und Burn-In-Test", "Degradation Screening"], C.accent, C.accentSoft, "reliabilityImprovement"));
  const quantitative = animGroup("quantitative_toolbox", "Quantitativer Werkzeugkasten", toolbox(1010, 240, 810, "Quantitative Methoden", ["Lebensdauermodelle bestimmen und", "Zuverlässigkeit quantitativ nachweisen"], ["End-of-Life-Test", "Accelerated Life Test (ALT)", "Degradation Test", "Success Run Test"], C.secondary, C.secondarySoft, "timedReliabilityProof"));
  return {
    svg: frame(scene, `${qualitative}${quantitative}`, { title: "Zuverlässigkeitsmethoden als Werkzeugkästen", takeaway: "Qualitative und quantitative Methoden erfüllen unterschiedliche Aufgaben und ergänzen sich.", archetype: "toolbox-comparison", layoutIntent: "two-complementary-toolboxes" }),
    targets: [target("qualitative_toolbox", "Qualitativer Werkzeugkasten"), target("quantitative_toolbox", "Quantitativer Werkzeugkasten")],
    steps: [step("show_qualitative_toolbox", "qualitative_toolbox", "show", planTrigger(scene, "qualitative_toolbox")), step("show_quantitative_toolbox", "quantitative_toolbox", "show", planTrigger(scene, "quantitative_toolbox"))],
    brief: { archetype: "Vergleich / Werkzeugkästen", takeaway: "Beide Methodenkategorien werden benötigt und ergänzen sich.", animation: "Beide Werkzeugkästen jeweils erst mit ihrer fachlichen Einführung zeigen; kein redundantes Zwischenbanner." },
  };
}

const MANAGEMENT_PHASES = [
  { number: 1, key: "planning", short: "Zuverlässigkeitsplanung", title: "Zuverlässigkeitsplanung", color: C.accent, soft: C.accentSoft },
  { number: 2, key: "analysis", short: "Schwachstellenanalyse", title: "Schwachstellenanalyse & Zuverlässigkeitsbewertung", color: C.failure, soft: C.failureSoft },
  { number: 3, key: "testing", short: "Erprobung & Nachweis", title: "Zuverlässigkeitserprobung & Nachweis", color: C.success, soft: C.successSoft },
  { number: 4, key: "production", short: "Produktionsabsicherung", title: "Produktionsabsicherung", color: C.secondary, soft: C.secondarySoft },
  { number: 5, key: "field", short: "Feldprognosen", title: "Feldprognosen", color: C.deep, soft: C.surfaceSoft },
];

function phaseRail(activePhase) {
  const phase = MANAGEMENT_PHASES.find((entry) => entry.number === activePhase);
  if (!phase) return "";
  return `<g id="management_phase_marker" aria-label="Managementphase ${phase.number} von 5: ${esc(phase.title)}"><rect x="92" y="174" width="720" height="64" rx="8" fill="${phase.soft}" stroke="${phase.color}" stroke-width="1.8"/><rect x="92" y="174" width="190" height="64" rx="8" fill="${phase.color}"/><text x="187" y="214" font-size="18" font-weight="840" fill="#FFFFFF" text-anchor="middle">PHASE ${phase.number} VON 5</text><text x="312" y="214" font-size="22" font-weight="800" fill="${phase.color}">${esc(phase.short)}</text></g>`;
}

function compactPill(x, y, width, text, color = C.accent, fill = C.accentSoft) {
  return `<rect x="${x}" y="${y}" width="${width}" height="42" rx="8" fill="${fill}" stroke="${color}" stroke-width="1.2"/><text x="${x + width / 2}" y="${y + 28}" font-size="18" font-weight="760" fill="${color}" text-anchor="middle">${esc(text)}</text>`;
}

function phaseOverviewRow(y, phase, leftLines, rightLines, lifecycleRange, targetId, targetLabel) {
  const lifecycleStages = ["Planung", "Konzeption", "Entwurf", "Ausarbeitung", "Produktion", "Feldeinsatz", "Recycling"];
  const activeStages = new Set(lifecycleRange.split("·").map((value) => value.trim()));
  const lifecycleTag = `<g aria-label="Zuordnung zum Produktlebenszyklus: ${esc(lifecycleRange)}">${lifecycleStages.map((stage, index) => `<rect x="${190 + index * 56}" y="${y + 76}" width="48" height="20" rx="4" fill="${activeStages.has(stage) ? phase.color : C.surfaceSoft}" stroke="${activeStages.has(stage) ? phase.color : C.border}" stroke-width="1"/>`).join("")}</g>`;
  return animGroup(targetId, targetLabel, `${card(92, y, 1736, 112, { fill: C.surface, stroke: phase.color, shadow: false })}<rect x="92" y="${y}" width="10" height="112" rx="5" fill="${phase.color}"/><circle cx="146" cy="${y + 56}" r="25" fill="${phase.soft}"/><text x="146" y="${y + 65}" font-size="26" font-weight="820" fill="${phase.color}" text-anchor="middle">${phase.number}</text>${paragraph(190, y + 33, 420, phase.title, { size: 22, weight: 800, fill: C.deep, maxChars: 34, lineHeight: 1.15 })}${lifecycleTag}<line x1="620" y1="${y + 16}" x2="620" y2="${y + 96}" stroke="${C.border}" stroke-width="1.5"/>${textLines({ x: 650, y: y + 35, lines: leftLines, size: 18, weight: 650, fill: C.deepSoft, lineHeight: 1.45 })}${textLines({ x: 1230, y: y + 35, lines: rightLines, size: 18, weight: 650, fill: C.deepSoft, lineHeight: 1.45 })}`);
}

function renderSlide16(scene) {
  const assurance = animGroup("assurance_contribution", "Beitrag von Erprobung und Absicherung", `${card(1030, 352, 760, 430, { fill: C.surface, stroke: C.success })}${pictogram("shieldCheck", { cx: 1100, cy: 430, size: 54, color: C.success, background: C.successSoft, radius: 43 })}${textLines({ x: 1170, y: 441, lines: ["Erprobung und Absicherung"], size: 32, weight: 820, fill: C.deep })}<path d="M1410 482V520M1188 520H1632M1188 520V548M1632 520V548" fill="none" stroke="${C.success}" stroke-width="3"/>${card(1070, 548, 326, 190, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${label(1096, 582, "Qualitativ", C.accent)}${textLines({ x: 1096, y: 626, lines: ["Kritische Mechanismen", "FMEA · FTA", "Root-Cause-Analyse"], size: 21, weight: 680, fill: C.deep, lineHeight: 1.42 })}${card(1424, 548, 326, 190, { fill: C.successSoft, stroke: C.success, shadow: false })}${label(1450, 582, "Quantitativ", C.success)}${textLines({ x: 1450, y: 626, lines: ["Prognosen · Ausfallraten", "Lebensdauerversuche", "Feldtest · Weibull"], size: 21, weight: 680, fill: C.deep, lineHeight: 1.42 })}`);
  const collaboration = animGroup("reliability_collaboration", "Gemeinsames Ziel Produktzuverlässigkeit", `${card(450, 190, 1020, 110, { fill: C.deep, stroke: C.deep })}${pictogram("target", { cx: 525, cy: 245, size: 58, color: "#FFFFFF" })}${textLines({ x: 590, y: 256, lines: ["Sicherstellung der Produktzuverlässigkeit"], size: 38, weight: 820, fill: "#FFFFFF" })}`);
  const connections = animGroup("reliability_collaboration_links", "Verbindung beider Beiträge mit dem gemeinsamen Ziel", `<path d="M960 300V328H500V352M960 328H1410V352" fill="none" stroke="${C.deepSoft}" stroke-width="4"/>`);
  const design = animGroup("design_contribution", "Beitrag der konstruktiven Auslegung", `${card(130, 352, 760, 430, { fill: C.surface, stroke: C.accent })}${pictogram("settings", { cx: 200, cy: 430, size: 54, color: C.accent, background: C.accentSoft, radius: 43 })}${textLines({ x: 270, y: 441, lines: ["Konstruktive Auslegung"], size: 32, weight: 820, fill: C.deep })}<line x1="170" y1="510" x2="850" y2="510" stroke="${C.border}" stroke-width="2"/>${textLines({ x: 185, y: 582, lines: ["Bewährte Konstruktionsrichtlinien", "Repräsentatives Lastkollektiv", "Abgesicherte Berechnungsrichtlinien"], size: 24, weight: 680, fill: C.deep, lineHeight: 2.05 })}`);
  return {
    svg: frame(scene, `${collaboration}${assurance}${design}${connections}`, { title: "Auslegung und Absicherung", takeaway: "Produktzuverlässigkeit entsteht im Zusammenspiel von konstruktiver Auslegung und Zuverlässigkeitsabsicherung.", archetype: "collaboration-model", layoutIntent: "two-pillars-one-reliability-goal" }),
    targets: [target("assurance_contribution", "Erprobung und Absicherung"), target("reliability_collaboration", "Gemeinsames Ziel"), target("design_contribution", "Konstruktive Auslegung"), target("reliability_collaboration_links", "Zusammenspiel beider Beiträge")],
    steps: [step("show_assurance_contribution", "assurance_contribution", "show", "Für die Sicherstellung der Produktzuverlässigkeit reichen die quantitativen sowie die qualitativen Methoden allein nicht aus"), step("show_reliability_collaboration", "reliability_collaboration", "show", "Eine Zusammenarbeit zwischen Design und Zuverlässigkeit-Team ist entscheidend"), step("show_design_contribution", "design_contribution", "show", "Bei der konstruktiven Auslegung kann zum einen auf bewährte Konstruktionsrichtlinien zurückgegriffen werden"), step("draw_reliability_collaboration_links", "reliability_collaboration_links", "draw", "Ein zuverlässiges Produkt resultiert also immer nur aus Zusammenspiel")],
    brief: { archetype: "Kooperationsmodell", takeaway: "Auslegung und Absicherung tragen gemeinsam die Produktzuverlässigkeit.", animation: "Beiträge und Ziel in Sprecherreihenfolge; die Verbindungen erst beim abschließenden Zusammenspiel zeichnen." },
  };
}

function renderSlide17(scene) {
  const lifecycle = `${label(96, 190, "Produktlebenszyklus")}${["Planung", "Konzeption", "Entwurf", "Ausarbeitung", "Produktion", "Feldeinsatz", "Recycling"].map((stage, index) => `${compactPill(92 + index * 247, 210, 225, stage, index < 4 ? C.accent : C.deepSoft, index < 4 ? C.accentSoft : C.surfaceSoft)}${index < 6 ? `<path d="M${319 + index * 247} 231H${332 + index * 247}" stroke="${C.deepSoft}" stroke-width="2"/><path d="M${329 + index * 247} 225L${337 + index * 247} 231L${329 + index * 247} 237" fill="none" stroke="${C.deepSoft}" stroke-width="2"/>` : ""}`).join("")}`;
  const rows = [
    phaseOverviewRow(286, MANAGEMENT_PHASES[0], ["Bq · MTBF · MTTF"], ["Ausfallrate", "Repräsentative Lastkollektive"], "Planung", "phase_1_planning", "Phase 1 Zuverlässigkeitsplanung"),
    phaseOverviewRow(414, MANAGEMENT_PHASES[1], ["System- und Strukturanalyse", "FMEA · Fehlerbaumanalyse FTA"], ["Design Review", "Derating"], "Konzeption · Entwurf", "phase_2_analysis", "Phase 2 Schwachstellenanalyse"),
    phaseOverviewRow(542, MANAGEMENT_PHASES[2], ["HALT · DOE · Success Run Tests"], ["End of Life · ALT", "Degradation Tests"], "Entwurf · Ausarbeitung", "phase_3_testing", "Phase 3 Zuverlässigkeitserprobung"),
    phaseOverviewRow(670, MANAGEMENT_PHASES[3], ["P-FMEA · Audits", "Qualitätskontrollen"], ["DOE · HASS · ESS", "Burn-In · Run-In"], "Produktion", "phase_4_production", "Phase 4 Produktionsabsicherung"),
    phaseOverviewRow(798, MANAGEMENT_PHASES[4], ["Feldbeobachtung", "Frühwarnindikatoren · Felddatenermittlung"], ["Felddatenauswertung", "Lastkollektive · kritische Mechanismen"], "Feldeinsatz · Recycling", "phase_5_field", "Phase 5 Feldprognosen"),
  ];
  const phrases = ["In Phase eins der Zuverlässigkeitsplanung definieren wir", "In Phase zwei, also während der Konzeptions- und Entwurfsphase", "Kommen wir nun zur dritten Phase des Zuverlässigkeitsmanagements", "In Phase vier wird die Produktion durch den Einsatz von Zuverlässigkeitsmethoden verbessert", "Und in der letzten Phase, während des Feldeinsatzes unseres Produktes"];
  return {
    svg: frame(scene, `${lifecycle}${rows.join("")}`, { title: "Fünf Phasen des Zuverlässigkeitsmanagements", takeaway: "Zuverlässigkeit begleitet den Produktlebenszyklus in fünf aufeinander bezogenen Managementphasen.", archetype: "process-overview", layoutIntent: "lifecycle-with-five-reliability-phases", density: "dense" }),
    targets: [1, 2, 3, 4, 5].map((number) => target(`phase_${number}_${["planning", "analysis", "testing", "production", "field"][number - 1]}`, `Phase ${number}`)),
    steps: phrases.map((phrase, index) => step(`show_phase_${index + 1}`, `phase_${index + 1}_${["planning", "analysis", "testing", "production", "field"][index]}`, "show", phrase)),
    brief: { archetype: "Prozessüberblick", takeaway: "Fünf Phasen verbinden Zuverlässigkeit mit dem gesamten Produktlebenszyklus.", animation: "Die fünf vollständigen Phasenbänder erscheinen nacheinander." },
  };
}

function renderSlide18(scene) {
  const drivers = animGroup("planning_drivers", "Treiber und Systemziel", `${label(100, 308, "Treiber des Zuverlässigkeitsziels", C.secondary)}${compactPill(100, 340, 285, "Gesetzliche Vorgaben", C.secondary, C.secondarySoft)}${compactPill(410, 340, 285, "Kundenanforderungen", C.secondary, C.secondarySoft)}${compactPill(100, 402, 285, "Firmenstrategie", C.secondary, C.secondarySoft)}${compactPill(410, 402, 285, "Technische Gegebenheiten", C.secondary, C.secondarySoft)}${arrow(398, 484, 398, 535, C.accent, 4)}${card(170, 540, 456, 116, { fill: C.deep, stroke: C.deep })}${pictogram("target", { cx: 230, cy: 598, size: 54, color: "#FFFFFF" })}${textLines({ x: 290, y: 588, lines: ["Zuverlässigkeitsziel", "auf Systemebene"], size: 29, weight: 800, fill: "#FFFFFF", lineHeight: 1.25 })}`);
  const cascade = animGroup("reliability_goal_cascade", "Zielkaskade vom System zur Komponente", `${label(96, 724, "Zielkaskade")}${arrow(340, 786, 518, 786, C.accent, 4)}${arrow(790, 786, 968, 786, C.accent, 4)}${card(96, 742, 244, 92, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${textLines({ x: 218, y: 798, lines: ["Systemziel"], size: 25, weight: 800, fill: C.accent, anchor: "middle" })}${card(518, 742, 272, 92, { fill: C.surface, stroke: C.accent, shadow: false })}${textLines({ x: 654, y: 798, lines: ["Subsystem"], size: 25, weight: 800, fill: C.deep, anchor: "middle" })}${card(968, 742, 272, 92, { fill: C.surface, stroke: C.accent, shadow: false })}${textLines({ x: 1104, y: 798, lines: ["Komponente"], size: 25, weight: 800, fill: C.deep, anchor: "middle" })}`);
  const loads = animGroup("representative_load_collective", "Repräsentatives Lastkollektiv", `${card(1270, 310, 540, 524, { fill: C.surface, stroke: C.success })}${pictogram("layers", { cx: 1342, cy: 385, size: 58, color: C.success, background: C.successSoft, radius: 47 })}${textLines({ x: 1410, y: 374, lines: ["Repräsentatives", "Lastkollektiv"], size: 32, weight: 820, fill: C.deep, lineHeight: 1.2 })}<line x1="1310" y1="455" x2="1770" y2="455" stroke="${C.border}" stroke-width="2"/>${pictogram("settings", { cx: 1350, cy: 548, size: 50, color: C.accent, background: C.accentSoft, radius: 40 })}${textLines({ x: 1410, y: 540, lines: ["Betriebsbedingungen", "Nutzung · Lasten · Lastwechsel"], size: 24, weight: 700, fill: C.deep, lineHeight: 1.45 })}${pictogram("cloud", { cx: 1350, cy: 692, size: 50, color: C.secondary, background: C.secondarySoft, radius: 40 })}${textLines({ x: 1410, y: 684, lines: ["Umgebungsbedingungen", "Temperatur · Feuchte · Medien"], size: 24, weight: 700, fill: C.deep, lineHeight: 1.45 })}`);
  return {
    svg: frame(scene, `${phaseRail(1)}${drivers}${cascade}${loads}`, { title: "Phase 1: Zuverlässigkeitsplanung", takeaway: "Ziele werden aus Anforderungen abgeleitet, kaskadiert und durch repräsentative Lastkollektive konkretisiert.", archetype: "goal-system", layoutIntent: "goal-drivers-cascade-and-load-collective" }),
    targets: [target("planning_drivers", "Treiber und Systemziel"), target("reliability_goal_cascade", "Zielkaskade"), target("representative_load_collective", "Repräsentatives Lastkollektiv")],
    steps: [step("show_planning_drivers", "planning_drivers", "show", "unter der Berücksichtigung der gesetzlichen Vorgaben"), step("show_reliability_goal_cascade", "reliability_goal_cascade", "show", "Dieses Ziel wird auf der obersten Systemebene festgelegt"), step("show_representative_load_collective", "representative_load_collective", "show", "Ein zweiter wichtiger Punkt neben der Zuverlässigkeitsplanung")],
    brief: { archetype: "Zielsystem", takeaway: "Zuverlässigkeitsziele benötigen Treiber, Kaskade und Lastkollektiv.", animation: "Treiber, Zielkaskade und Lastkollektiv." },
  };
}

function analysisStepCard(x, number, titleText, lines, icon, color = C.accent) {
  return `${card(x, 360, 360, 420, { fill: C.surface, stroke: color })}<circle cx="${x + 48}" cy="410" r="25" fill="${color}"/><text x="${x + 48}" y="419" font-size="25" font-weight="820" fill="#FFFFFF" text-anchor="middle">${number}</text>${paragraph(x + 30, 488, 300, titleText, { size: 29, weight: 820, fill: C.deep, maxChars: 22 })}${textLines({ x: x + 28, y: 620, lines, size: 23, weight: 680, fill: C.deepSoft, lineHeight: 1.5 })}`;
}

function renderSlide19(scene) {
  const context = animGroup("system_context", "Systemgrenze und Einflussgrößen", `${analysisStepCard(90, 1, "Systemgrenze definieren", ["Einflussgrößen erfassen", "Betrieb und Umwelt", "Systemverständnis aufbauen"], "package")}`);
  const analysis = animGroup("critical_system_analysis", "Kritische Mechanismen und Komponenten", `${arrow(450, 570, 520, 570, C.accent, 4)}${analysisStepCard(520, 2, "System intern analysieren", ["Struktur untersuchen", "Funktionen verstehen", "Wechselwirkungen erkennen"], "search")}${arrow(880, 570, 950, 570, C.accent, 4)}${analysisStepCard(950, 3, "Kritische Stellen identifizieren", ["kritische Fehlermechanismen", "kritische Komponenten", "Ausfallpfade"], "wrenchAlert", C.failure)}`);
  const improvement = animGroup("design_improvement", "Design-Schwachstellen beheben", `${arrow(1310, 570, 1380, 570, C.success, 4)}${analysisStepCard(1380, 4, "Design verbessern", ["Design-Schwachstellen", "beheben", "Frühausfälle reduzieren", "Verbesserung der", "Zuverlässigkeit"], "shieldCheck", C.success)}`);
  return {
    svg: frame(scene, `${phaseRail(2)}${context}${analysis}${improvement}`, { title: `Phase 2: ${MANAGEMENT_PHASES[1].title}`, takeaway: "Systemverständnis führt über kritische Mechanismen und Komponenten zur gezielten Designverbesserung.", archetype: "analysis-process", layoutIntent: "four-step-system-analysis" }),
    targets: [target("system_context", "Systemgrenze und Einflussgrößen"), target("critical_system_analysis", "Kritische Systemanalyse"), target("design_improvement", "Designverbesserung")],
    steps: [step("show_system_context", "system_context", "show", "Ziel hier ist es ein tiefes Systemverständnis aufzubauen"), step("show_critical_system_analysis", "critical_system_analysis", "show", "Das System wird Innerhalb dieser Grenze nun genauer untersucht"), step("show_design_improvement", "design_improvement", "show", "Im Anschluss daran werden Design Schwachstellen abgeleitet")],
    brief: { archetype: "Analyseprozess", takeaway: "Systemverständnis macht kritische Mechanismen sichtbar und ermöglicht Verbesserungen.", animation: "Systemkontext, interne Analyse und Verbesserung." },
  };
}

function methodMiniDiagram(kind, x, y, width) {
  if (kind === "p") return `${card(x, y + 60, 122, 70, { fill: C.surfaceSoft, stroke: C.accent, shadow: false })}${textLines({ x: x + 61, y: y + 88, lines: ["Eingangs-", "größen"], size: 13, weight: 760, fill: C.deep, anchor: "middle", role: "caption", lineHeight: 1.15 })}${card(x + 142, y + 56, 96, 78, { fill: C.deep, stroke: C.deep, shadow: false })}${textLines({ x: x + 190, y: y + 103, lines: ["System"], size: 20, weight: 800, fill: "#FFFFFF", anchor: "middle", role: "caption" })}${card(x + 258, y + 60, 122, 70, { fill: C.surfaceSoft, stroke: C.accent, shadow: false })}${textLines({ x: x + 319, y: y + 88, lines: ["Ausgangs-", "größen"], size: 13, weight: 760, fill: C.deep, anchor: "middle", role: "caption", lineHeight: 1.15 })}${card(x + 113, y - 2, 154, 40, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${textLines({ x: x + 190, y: y + 25, lines: ["Umwelteinflüsse"], size: 18, weight: 760, fill: C.deep, anchor: "middle", role: "caption" })}${card(x + 126, y + 152, 128, 40, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${textLines({ x: x + 190, y: y + 179, lines: ["Störgrößen"], size: 18, weight: 760, fill: C.deep, anchor: "middle", role: "caption" })}${arrow(x + 122, y + 95, x + 142, y + 95, C.accent, 2.5)}${arrow(x + 238, y + 95, x + 258, y + 95, C.accent, 2.5)}${arrow(x + 190, y + 38, x + 190, y + 56, C.accent, 2.5)}${arrow(x + 190, y + 152, x + 190, y + 134, C.accent, 2.5)}`;
  if (kind === "block") return `<rect x="${x + 4}" y="${y + 66}" width="104" height="58" rx="6" fill="${C.accentSoft}" stroke="${C.accent}"/><rect x="${x + 150}" y="${y + 24}" width="104" height="58" rx="6" fill="${C.accentSoft}" stroke="${C.accent}"/><rect x="${x + 150}" y="${y + 110}" width="104" height="58" rx="6" fill="${C.accentSoft}" stroke="${C.accent}"/><rect x="${x + 296}" y="${y + 66}" width="80" height="58" rx="6" fill="${C.accentSoft}" stroke="${C.accent}"/><path d="M${x + 108} ${y + 95}H${x + 130}V${y + 53}H${x + 142}M${x + 130} ${y + 95}V${y + 139}H${x + 142}" fill="none" stroke="${C.deepSoft}" stroke-width="2.5"/><path d="M${x + 142} ${y + 47}L${x + 150} ${y + 53}L${x + 142} ${y + 59}Z M${x + 142} ${y + 133}L${x + 150} ${y + 139}L${x + 142} ${y + 145}Z" fill="${C.deepSoft}"/><path d="M${x + 254} ${y + 53}H${x + 274}V${y + 95}M${x + 254} ${y + 139}H${x + 274}V${y + 95}H${x + 288}" fill="none" stroke="${C.deepSoft}" stroke-width="2.5"/><path d="M${x + 288} ${y + 89}L${x + 296} ${y + 95}L${x + 288} ${y + 101}Z" fill="${C.deepSoft}"/><text data-qc-role="caption" x="${x + 56}" y="${y + 101}" font-size="16" font-weight="760" fill="${C.deep}" text-anchor="middle">System</text><text data-qc-role="caption" x="${x + 202}" y="${y + 59}" font-size="14" font-weight="760" fill="${C.deep}" text-anchor="middle">Baugruppe</text><text data-qc-role="caption" x="${x + 202}" y="${y + 145}" font-size="14" font-weight="760" fill="${C.deep}" text-anchor="middle">Komponente</text><text data-qc-role="caption" x="${x + 336}" y="${y + 101}" font-size="15" font-weight="760" fill="${C.deep}" text-anchor="middle">Funktion</text>`;
  if (kind === "tree") return `<rect x="${x + 120}" y="${y + 10}" width="140" height="48" rx="6" fill="${C.failureSoft}" stroke="${C.failure}"/><text data-qc-role="caption" x="${x + 190}" y="${y + 40}" font-size="16" font-weight="760" fill="${C.failure}" text-anchor="middle">Systemausfall</text><path d="M${x + 190} ${y + 58}V${y + 88}H${x + 90}V${y + 112}M${x + 190} ${y + 88}H${x + 290}V${y + 112}" fill="none" stroke="${C.deepSoft}" stroke-width="3"/><rect x="${x + 30}" y="${y + 112}" width="120" height="48" rx="6" fill="${C.surfaceSoft}" stroke="${C.failure}"/><rect x="${x + 230}" y="${y + 112}" width="120" height="48" rx="6" fill="${C.surfaceSoft}" stroke="${C.failure}"/><text data-qc-role="caption" x="${x + 90}" y="${y + 142}" font-size="15" font-weight="700" fill="${C.deep}" text-anchor="middle">Ausfallpfad A</text><text data-qc-role="caption" x="${x + 290}" y="${y + 142}" font-size="15" font-weight="700" fill="${C.deep}" text-anchor="middle">Ausfallpfad B</text>`;
  return `<rect x="${x + 20}" y="${y + 18}" width="340" height="142" rx="6" fill="${C.surfaceSoft}" stroke="${C.border}"/><path d="M${x + 20} ${y + 70}H${x + 360}M${x + 120} ${y + 18}V${y + 160}M${x + 278} ${y + 18}V${y + 160}" fill="none" stroke="${C.border}"/><text data-qc-role="caption" x="${x + 70}" y="${y + 51}" font-size="14" font-weight="760" fill="${C.deep}" text-anchor="middle">Fehler</text>${textLines({ x: x + 199, y: y + 43, lines: ["Folgen und", "Auswirkungen"], size: 13, weight: 760, fill: C.deep, anchor: "middle", lineHeight: 1.08, role: "caption" })}<text data-qc-role="caption" x="${x + 319}" y="${y + 51}" font-size="14" font-weight="760" fill="${C.deep}" text-anchor="middle">Risiko</text>${textLines({ x: x + 38, y: y + 98, lines: ["Root Causes", "Fehlerarten"], size: 13, weight: 650, fill: C.deepSoft, lineHeight: 1.85, role: "caption" })}${textLines({ x: x + 148, y: y + 98, lines: ["Fehlerfolgen", "Auswirkungen"], size: 13, weight: 650, fill: C.deepSoft, lineHeight: 1.85, role: "caption" })}${textLines({ x: x + 292, y: y + 98, lines: ["Ranking", "Maßnahmen"], size: 13, weight: 650, fill: C.deepSoft, lineHeight: 1.85, role: "caption" })}`;
}

function methodStation(x, number, titleText, subtitle, kind, id) {
  return animGroup(id, titleText, `${card(x, 300, 400, 570, { fill: C.surface, stroke: C.border })}<circle cx="${x + 42}" cy="344" r="24" fill="${C.accent}"/><text x="${x + 42}" y="353" font-size="24" font-weight="820" fill="#FFFFFF" text-anchor="middle">${number}</text>${paragraph(x + 82, 344, 288, titleText, { size: 25, weight: 820, fill: C.deep, maxChars: 21 })}${methodMiniDiagram(kind, x + 10, 404, 380)}<line x1="${x + 28}" y1="620" x2="${x + 372}" y2="620" stroke="${C.border}" stroke-width="2"/>${paragraph(x + 28, 670, 326, subtitle, { size: 21, weight: 680, fill: C.deepSoft, maxChars: 29 })}`);
}

function methodMatrixPanel(x, y, number, titleText, kind, id, color = C.accent) {
  const isBlock = titleText === "Bauteil-Blockschaltbild";
  const visual = `<g transform="translate(${x + (isBlock ? 382 : 360)} ${y + 26}) scale(${isBlock ? 1.08 : 1.16})">${methodMiniDiagram(kind, 0, 0, 380)}</g>`;
  const titleLines = titleText === "Bauteil-Blockschaltbild" ? ["Bauteil-", "Blockschaltbild"] : [titleText];
  const dividerX = x + (isBlock ? 370 : 330);
  return animGroup(id, titleText, `${card(x, y, 842, 264, { fill: C.surface, stroke: color })}<circle cx="${x + 54}" cy="${y + 54}" r="25" fill="${color}"/><text x="${x + 54}" y="${y + 63}" font-size="25" font-weight="820" fill="#FFFFFF" text-anchor="middle">${number}</text>${textLines({ x: x + 94, y: y + 67, lines: titleLines, size: isBlock ? 26 : 28, weight: 820, fill: C.deep, lineHeight: 1.2 })}<line x1="${dividerX}" y1="${y + 28}" x2="${dividerX}" y2="${y + 236}" stroke="${C.border}" stroke-width="2"/>${visual}`);
}

function renderSlide20(scene) {
  const stations = [
    methodMatrixPanel(90, 286, 1, "P-Diagramm", "p", "p_diagram_method", C.accent),
    methodMatrixPanel(988, 286, 2, "Bauteil-Blockschaltbild", "block", "block_diagram_method", C.secondary),
    methodMatrixPanel(90, 590, 3, "Fehlerbaum", "tree", "fault_tree_method", C.failure),
    methodMatrixPanel(988, 590, 4, "FMEA", "fmea", "fmea_method", C.success),
  ];
  return {
    svg: frame(scene, `${phaseRail(2)}${stations.join("")}`, { title: "Methoden der Schwachstellenanalyse", takeaway: "Vier Methoden betrachten Systemkontext, Struktur, Ausfallpfade und Risikobewertung aus unterschiedlichen Perspektiven.", archetype: "method-matrix", layoutIntent: "source-faithful-two-by-two-method-visuals-without-explanatory-paragraphs", density: "dense", designException: "Die vier Methoden werden bewusst als kompakte 2×2-Matrix mit ihren charakteristischen Mini-Diagrammen gezeigt; die Detailtexte sind Diagrammbeschriftungen, kein Fließtext." }),
    targets: [target("p_diagram_method", "P-Diagramm"), target("block_diagram_method", "Bauteil-Blockschaltbild"), target("fault_tree_method", "Fehlerbaum"), target("fmea_method", "FMEA")],
    steps: [step("show_p_diagram_method", "p_diagram_method", "show", "Über das P-Diagramm können anschließend die Eingangs- und Ausgangsgrößen des Systems beschrieben werden"), step("show_block_diagram_method", "block_diagram_method", "show", "Dafür werden Bauteil-Blockschaltbilder verwendet"), step("show_fault_tree_method", "fault_tree_method", "show", "Hierfür wird auf die Methode des Fehlerbaums zurückgegriffen"), step("show_fmea_method", "fmea_method", "show", "Der Fehlerbaum ist auch eine sehr gute Vorarbeit für unsere nächste Methode")],
    brief: { archetype: "2×2-Methodenmatrix", takeaway: "Die vier Methoden werden über ihre charakteristische Darstellungsform erkannt.", animation: "Vier vollständige Methodenfelder in Sprecherreihenfolge." },
  };
}

function renderSlide21(scene) {
  const testingCore = `${card(590, 300, 740, 130, { fill: C.deep, stroke: C.deep })}${pictogram("flask", { cx: 660, cy: 365, size: 62, color: "#FFFFFF" })}${textLines({ x: 735, y: 356, lines: ["Zuverlässigkeitserprobung"], size: 34, weight: 820, fill: "#FFFFFF" })}${textLines({ x: 735, y: 394, lines: ["gezielt prüfen · lernen · nachweisen"], size: 21, weight: 650, fill: "#FFFFFF" })}`;
  const improvement = animGroup("weakness_testing", "Erprobung zur Schwachstellenidentifikation", `${arrow(820, 430, 500, 515, C.accent, 4)}${card(110, 510, 760, 330, { fill: C.accentSoft, stroke: C.accent })}${pictogram("search", { cx: 190, cy: 590, size: 62, color: C.accent, background: "#FFFFFF", radius: 49 })}${label(265, 555, "Verbesserung", C.accent)}${textLines({ x: 265, y: 605, lines: ["Schwachstellen identifizieren"], size: 31, weight: 820, fill: C.deep })}${compactPill(265, 645, 210, "HALT", C.accent, "#FFFFFF")}${textLines({ x: 150, y: 760, lines: ["Qualitative Erprobung", "kritische Ausfallmechanismen sichtbar machen"], size: 23, weight: 680, fill: C.deepSoft, lineHeight: 1.45 })}`);
  const proof = animGroup("reliability_proof_testing", "Quantitativer Zuverlässigkeitsnachweis", `${arrow(1100, 430, 1420, 515, C.success, 4)}${card(1050, 510, 760, 330, { fill: C.successSoft, stroke: C.success })}${pictogram("shieldCheck", { cx: 1130, cy: 590, size: 62, color: C.success, background: "#FFFFFF", radius: 49 })}${label(1205, 555, "Nachweis", C.success)}${textLines({ x: 1205, y: 605, lines: ["Zuverlässigkeitsziele nachweisen"], size: 31, weight: 820, fill: C.deep })}${compactPill(1205, 645, 210, "ALT", C.success, "#FFFFFF")}${compactPill(1435, 645, 260, "Success Run Test", C.success, "#FFFFFF")}${textLines({ x: 1090, y: 760, lines: ["Quantitative Lebensdauertests", "Verbesserung und Nachweis der Zuverlässigkeit"], size: 23, weight: 680, fill: C.deepSoft, lineHeight: 1.45 })}`);
  return {
    svg: frame(scene, `${phaseRail(3)}${testingCore}${improvement}${proof}`, { title: `Phase 3: ${MANAGEMENT_PHASES[2].title}`, takeaway: "Erprobung identifiziert Schwachstellen und weist Zuverlässigkeitsziele quantitativ nach.", archetype: "two-test-paths", layoutIntent: "testing-core-splits-into-improvement-and-proof" }),
    targets: [target("weakness_testing", "Schwachstellenidentifikation"), target("reliability_proof_testing", "Zuverlässigkeitsnachweis")],
    steps: [step("show_weakness_testing", "weakness_testing", "show", "Die Erprobung kann dabei ebenfalls eingesetzt werden, um Schwachstellen zu identifizieren"), step("show_reliability_proof_testing", "reliability_proof_testing", "show", "Zusätzlich können mit der Erprobung aber auch die Zuverlässigkeitsziele quantitativ nachgewiesen werden")],
    brief: { archetype: "Zwei Testpfade", takeaway: "Tests verbessern und messen Zuverlässigkeit.", animation: "Verbesserungspfad, danach Nachweispfad." },
  };
}

function renderSlide22(scene) {
  const methods = `${card(100, 300, 510, 560, { fill: C.surface, stroke: C.border })}${pictogram("flask", { cx: 168, cy: 370, size: 58, color: C.deep, background: C.surfaceSoft, radius: 46 })}${textLines({ x: 235, y: 380, lines: ["Reliability Tests"], size: 31, weight: 820, fill: C.deep })}${["HALT", "Degradation Test", "Burn-In Test", "End of Life Test", "ALT", "HASS", "weitere Tests"].map((name, index) => compactPill(145, 430 + index * 56, 420, name, C.deepSoft, C.surfaceSoft)).join("")}`;
  const improvement = animGroup("test_goal_improvement", "Zuverlässigkeit verbessern", `${card(700, 300, 1090, 160, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${pictogram("wrenchAlert", { cx: 780, cy: 380, size: 58, color: C.accent, background: "#FFFFFF", radius: 46 })}${textLines({ x: 850, y: 370, lines: ["Zuverlässigkeit verbessern"], size: 34, weight: 820, fill: C.deep })}${textLines({ x: 850, y: 412, lines: ["z. B. HALT · Burn-In Test · HASS"], size: 23, weight: 680, fill: C.deepSoft })}`);
  const measurement = animGroup("test_goal_measurement", "Zuverlässigkeit messen", `${card(700, 500, 1090, 160, { fill: C.successSoft, stroke: C.success, shadow: false })}${pictogram("search", { cx: 780, cy: 580, size: 58, color: C.success, background: "#FFFFFF", radius: 46 })}${textLines({ x: 850, y: 570, lines: ["Zuverlässigkeit messen"], size: 34, weight: 820, fill: C.deep })}${textLines({ x: 850, y: 612, lines: ["Degradation Test · End of Life Test · ALT"], size: 23, weight: 680, fill: C.deepSoft })}`);
  const other = animGroup("test_goal_comparison", "Weitere Zielsetzungen", `${card(700, 700, 1090, 160, { fill: C.secondarySoft, stroke: C.secondary, shadow: false })}${pictogram("layers", { cx: 780, cy: 780, size: 58, color: C.secondary, background: "#FFFFFF", radius: 46 })}${textLines({ x: 850, y: 770, lines: ["Weitere Zielsetzungen"], size: 34, weight: 820, fill: C.deep })}${textLines({ x: 850, y: 812, lines: ["z. B. Produktgenerationen vergleichen"], size: 23, weight: 680, fill: C.deepSoft })}`);
  return {
    svg: frame(scene, `${phaseRail(3)}${methods}${improvement}${measurement}${other}`, { title: "Zielsetzungen von Zuverlässigkeitstests", takeaway: "Tests dienen vor allem der Verbesserung oder Messung der Zuverlässigkeit; weitere Vergleiche sind möglich.", archetype: "goal-mapping", layoutIntent: "test-methods-mapped-to-three-goals" }),
    targets: [target("test_goal_improvement", "Zuverlässigkeit verbessern"), target("test_goal_measurement", "Zuverlässigkeit messen"), target("test_goal_comparison", "Weitere Zielsetzungen")],
    steps: [step("show_test_goal_improvement", "test_goal_improvement", "show", "um die Zuverlässigkeit zu verbessern"), step("show_test_goal_measurement", "test_goal_measurement", "show", "Es kann aber auch beispielsweise der Degradationsverlauf einer Komponente gemessen werden"), step("show_test_goal_comparison", "test_goal_comparison", "show", "Darüber hinaus sind aber auch andere Ziele denkbar")],
    brief: { archetype: "Zielzuordnung", takeaway: "Verbesserung und Messung sind die zwei Hauptziele.", animation: "Drei Zielklassen in Sprecherreihenfolge." },
  };
}

function productionStage(x, icon, labelText, titleText, lines, color) {
  return `${card(x, 360, 500, 400, { fill: C.surface, stroke: color })}${pictogram(icon, { cx: x + 72, cy: 430, size: 58, color, background: color === C.success ? C.successSoft : color === C.secondary ? C.secondarySoft : C.accentSoft, radius: 46 })}${label(x + 140, 404, labelText, color)}${paragraph(x + 140, 454, 320, titleText, { size: 30, weight: 820, fill: C.deep, maxChars: 23 })}<line x1="${x + 36}" y1="540" x2="${x + 464}" y2="540" stroke="${C.border}" stroke-width="2"/>${textLines({ x: x + 42, y: 596, lines, size: 23, weight: 690, fill: C.deepSoft, lineHeight: 1.55 })}`;
}

function renderSlide23(scene) {
  const risk = animGroup("production_risk_prevention", "Produktionsrisiken mit P-FMEA vermeiden", `${productionStage(110, "listCheck", "Risiko vermeiden", "Prozess-FMEA", ["Schwachstellen identifizieren", "Mitigationsmaßnahmen festlegen"], C.accent)}`);
  const optimization = animGroup("production_process_optimization", "Prozessparameter mit DOE optimieren", `${arrow(610, 560, 710, 560, C.accent, 4)}${productionStage(710, "settings", "Prozess robust auslegen", "DOE", ["optimale Prozessparameter", "robust gegenüber Störeinflüssen"], C.secondary)}`);
  const quality = animGroup("production_screening_monitoring", "Serienqualität screenen und überwachen", `${arrow(1210, 560, 1310, 560, C.success, 4)}${productionStage(1310, "factory", "Serie absichern", "Screening und Monitoring", ["HASS · ESS · Burn-In · Run-In", "HASA · Qualitätsüberwachung"], C.success)}${card(350, 810, 1220, 84, { fill: C.successSoft, stroke: C.success, shadow: false })}${pictogram("shieldCheck", { cx: 415, cy: 852, size: 48, color: C.success })}${textLines({ x: 480, y: 860, lines: ["Gleichbleibende Produktionsqualität → Verbesserung der Zuverlässigkeit"], size: 23, weight: 820, fill: C.success })}`);
  return {
    svg: frame(scene, `${phaseRail(4)}${risk}${optimization}${quality}`, { title: "Phase 4: Produktionsabsicherung", takeaway: "P-FMEA, DOE und Screening sichern eine robuste, gleichbleibende Produktionsqualität.", archetype: "production-pipeline", layoutIntent: "risk-optimization-screening-to-quality" }),
    targets: [target("production_risk_prevention", "Prozess-FMEA"), target("production_process_optimization", "DOE"), target("production_screening_monitoring", "Screening und Monitoring")],
    steps: [step("show_production_risk_prevention", "production_risk_prevention", "show", "Hierbei kann wieder auf die f m e a zurückgegriffen werden"), step("show_production_process_optimization", "production_process_optimization", "show", "Auch die statistische Versuchsplanung kurz D-O-E findet Einsatz"), step("show_production_screening_monitoring", "production_screening_monitoring", "show", "Sicherstellung der Produktionsqualität")],
    brief: { archetype: "Produktionspipeline", takeaway: "Produktionsqualität wird präventiv geplant, optimiert und überwacht.", animation: "P-FMEA, DOE, Screening und Monitoring." },
  };
}

function renderSlide24(scene) {
  const functional = animGroup("functional_testing", "Funktionale Erprobung", `${card(180, 210, 1560, 120, { fill: C.surface, stroke: C.accent })}${pictogram("listCheck", { cx: 250, cy: 270, size: 54, color: C.accent, background: C.accentSoft, radius: 43 })}${textLines({ x: 320, y: 263, lines: ["Funktionale Erprobung"], size: 34, weight: 820, fill: C.deep })}${textLines({ x: 320, y: 302, lines: ["Nachweis der funktionalen Anforderungen und Produkteigenschaften"], size: 22, weight: 680, fill: C.deepSoft })}`);
  const qualitative = animGroup("qualitative_product_assurance", "Qualitative und analytische Absicherung", `<line x1="100" y1="400" x2="1820" y2="400" stroke="${C.deepSoft}" stroke-width="3" stroke-dasharray="12 12"/>${card(120, 455, 560, 340, { fill: C.accentSoft, stroke: C.accent })}${pictogram("search", { cx: 190, cy: 530, size: 56, color: C.accent, background: "#FFFFFF", radius: 45 })}${textLines({ x: 260, y: 512, lines: ["Qualitative", "Zuverlässigkeitsanalyse"], size: 27, weight: 820, fill: C.deep, lineHeight: 1.22 })}${textLines({ x: 170, y: 650, lines: ["FMEA · FTA · HALT", "Qualitative und analytische Absicherung", "der Komponenten"], size: 23, weight: 690, fill: C.deepSoft, lineHeight: 1.5 })}${arrow(680, 625, 820, 625, C.accent, 4)}${card(820, 487, 360, 276, { fill: C.surface, stroke: C.accent, shadow: false })}${textLines({ x: 1000, y: 585, lines: ["Kritische Komponenten", "durch Erprobung", "absichern"], size: 26, weight: 780, fill: C.deep, anchor: "middle", lineHeight: 1.3 })}`);
  const quantitative = animGroup("quantitative_product_assurance", "Quantitative Zuverlässigkeitsabsicherung", `${arrow(1180, 625, 1260, 625, C.success, 4)}${card(1260, 455, 560, 340, { fill: C.successSoft, stroke: C.success })}${pictogram("flask", { cx: 1330, cy: 530, size: 56, color: C.success, background: "#FFFFFF", radius: 45 })}${textLines({ x: 1400, y: 510, lines: ["Quantitative", "Zuverlässigkeits-", "absicherung"], size: 27, weight: 820, fill: C.deep, lineHeight: 1.08 })}${textLines({ x: 1310, y: 650, lines: ["Accelerated Life Test · Degradation Test", "End of Life Test · Success Run Test", "Zuverlässigkeitsziel nachweisen"], size: 22, weight: 690, fill: C.deepSoft, lineHeight: 1.5 })}`);
  return {
    svg: frame(scene, `${functional}${qualitative}${quantitative}`, { title: "Bausteine einer systematischen Produkterprobung", takeaway: "Funktionale, qualitative und quantitative Absicherung bauen zu einem vollständigen Erprobungsprozess aufeinander auf.", archetype: "assurance-process", layoutIntent: "cross-phase-functional-qualitative-quantitative-assurance" }),
    targets: [target("functional_testing", "Funktionale Erprobung"), target("qualitative_product_assurance", "Qualitative Absicherung"), target("quantitative_product_assurance", "Quantitative Absicherung")],
    steps: [step("show_functional_testing", "functional_testing", "show", "Wir sprechen hierbei auch von der funktionalen Erprobung"), step("show_qualitative_product_assurance", "qualitative_product_assurance", "show", "mit Hilfe von qualitativen Zuverlässigkeitsanalysen"), step("show_quantitative_product_assurance", "quantitative_product_assurance", "show", "quantitativen Zuverlässigkeitsabsicherung")],
    brief: { archetype: "Phasenübergreifender Absicherungsprozess", takeaway: "Funktion, Schwachstellen und Lebensdauer werden gestuft abgesichert.", animation: "Funktionale, qualitative und quantitative Stufe ohne irreführenden Phasenrücksprung." },
  };
}

function renderSlide25(scene) {
  const productContext = `${label(100, 300, "Produktbezogene Zuverlässigkeitsabsicherung")}${card(100, 340, 850, 470, { fill: C.surfaceSoft, stroke: C.border, shadow: false })}${textLines({ x: 150, y: 410, lines: ["Qualitative Analyse"], size: 29, weight: 820, fill: C.accent })}${textLines({ x: 150, y: 452, lines: ["FMEA · FTA · HALT · analytische Absicherung"], size: 21, weight: 680, fill: C.deepSoft })}${arrow(500, 505, 500, 590, C.accent, 4)}${textLines({ x: 150, y: 650, lines: ["Quantitative Zuverlässigkeitsabsicherung"], size: 29, weight: 820, fill: C.success })}${textLines({ x: 150, y: 692, lines: ["ALT · Degradation · End of Life · Success Run"], size: 21, weight: 680, fill: C.deepSoft })}`;
  const production = animGroup("series_production_preparation", "Planung und Optimierung der Serienfertigung", `${label(1050, 300, "Absicherung in der Produktion", C.secondary)}${card(1050, 340, 760, 250, { fill: C.secondarySoft, stroke: C.secondary })}${pictogram("factory", { cx: 1125, cy: 415, size: 58, color: C.secondary, background: "#FFFFFF", radius: 46 })}${textLines({ x: 1195, y: 405, lines: ["Planung Serienfertigung"], size: 30, weight: 820, fill: C.deep })}${textLines({ x: 1195, y: 448, lines: ["Optimierung Serienfertigung"], size: 26, weight: 760, fill: C.deep })}${compactPill(1195, 485, 200, "P-FMEA", C.secondary, "#FFFFFF")}${compactPill(1415, 485, 200, "DOE", C.secondary, "#FFFFFF")}${textLines({ x: 1195, y: 560, lines: ["Prozessfähigkeit und Qualität sicherstellen"], size: 21, weight: 680, fill: C.deepSoft })}`);
  const sample = animGroup("representative_series_sample", "Repräsentative Stichprobe aus der Serie", `${card(1050, 630, 760, 180, { fill: C.successSoft, stroke: C.success })}${pictogram("layers", { cx: 1125, cy: 720, size: 58, color: C.success, background: "#FFFFFF", radius: 46 })}${textLines({ x: 1195, y: 700, lines: ["Serienfertigung"], size: 30, weight: 820, fill: C.deep })}${textLines({ x: 1195, y: 744, lines: ["Screening · Qualitätsüberwachung"], size: 24, weight: 700, fill: C.deep })}${textLines({ x: 1195, y: 780, lines: ["liefert die repräsentative Stichprobe"], size: 21, weight: 680, fill: C.success })}${card(700, 680, 240, 82, { fill: C.successSoft, stroke: C.success, shadow: false })}${textLines({ x: 820, y: 710, lines: ["repräsentative", "Stichprobe"], size: 18, weight: 760, fill: C.success, anchor: "middle", lineHeight: 1.3 })}${arrow(1050, 721, 940, 721, C.success, 4)}`);
  return {
    svg: frame(scene, `${phaseRail(4)}${productContext}${production}${sample}`, { title: "Produkterprobung und Serienfertigung", takeaway: "Eine abgesicherte Serienfertigung liefert die repräsentative Stichprobe für den Zuverlässigkeitsnachweis.", archetype: "integrated-process", layoutIntent: "product-assurance-connected-to-series-production" }),
    targets: [target("series_production_preparation", "Planung und Optimierung der Serienfertigung"), target("representative_series_sample", "Repräsentative Stichprobe")],
    steps: [step("show_representative_series_sample", "representative_series_sample", "show", "Diese repräsentative Stichprobe kommt natürlich aus der Produktion"), step("show_series_production_preparation", "series_production_preparation", "show", "unterstützt die Zuverlässigkeitstechnik mit den statistischen Methoden wie Design of Experiments")],
    brief: { archetype: "Integrierter Prozess", takeaway: "Produkt- und Produktionsabsicherung sind über die Stichprobe verbunden.", animation: "Zuerst die im Sprechertext genannte Serien-Stichprobe und ihre Verbindung, danach Planung und Optimierung der Produktion." },
  };
}

function renderSlide26(scene) {
  const observation = animGroup("field_observation", "Feldbeobachtung und Felddatenermittlung", `${card(100, 340, 470, 380, { fill: C.surface, stroke: C.accent })}${pictogram("eye", { cx: 180, cy: 425, size: 66, color: C.accent, background: C.accentSoft, radius: 52 })}${textLines({ x: 260, y: 410, lines: ["Produkt im Feld", "beobachten"], size: 32, weight: 820, fill: C.deep, lineHeight: 1.2 })}<line x1="140" y1="500" x2="530" y2="500" stroke="${C.border}" stroke-width="2"/>${bulletList(150, 558, 370, ["Feldbeobachtung", "Frühwarnindikatoren", "Felddatenermittlung"], { size: 23, gap: 52, bulletColor: C.accent, color: C.deepSoft, maxChars: 32 })}`);
  const assessment = animGroup("field_reliability_assessment", "Reale Zuverlässigkeit und Zielerreichung bewerten", `${arrow(570, 530, 690, 530, C.accent, 4)}${card(690, 300, 590, 460, { fill: C.surface, stroke: C.success })}${pictogram("database", { cx: 770, cy: 385, size: 66, color: C.success, background: C.successSoft, radius: 52 })}${textLines({ x: 850, y: 370, lines: ["Felddatenauswertung"], size: 32, weight: 820, fill: C.deep })}${textLines({ x: 850, y: 412, lines: ["reale Produktzuverlässigkeit"], size: 23, weight: 700, fill: C.success })}<line x1="730" y1="470" x2="1240" y2="470" stroke="${C.border}" stroke-width="2"/>${bulletList(745, 528, 470, ["Reale Belastung und Lastkollektive", "kritische Ausfallmechanismen", "Zuverlässigkeitsziele erfüllt?", "Recall Action notwendig?"], { size: 22, gap: 46, bulletColor: C.success, color: C.deepSoft, maxChars: 43 })}`);
  const learning = animGroup("next_generation_learning_loop", "Lessons Learned für die nächste Produktgeneration", `${arrow(1280, 530, 1390, 530, C.success, 4)}${card(1360, 340, 460, 380, { fill: C.secondarySoft, stroke: C.secondary })}${pictogram("loop", { cx: 1432, cy: 425, size: 62, color: C.secondary, background: "#FFFFFF", radius: 50 })}${textLines({ x: 1500, y: 410, lines: ["Lessons Learned"], size: 30, weight: 820, fill: C.deep })}${textLines({ x: 1405, y: 540, lines: ["Erkenntnisse zu Kundeneinsatz", "und Schwachstellen"], size: 24, weight: 700, fill: C.deepSoft, lineHeight: 1.45 })}${textLines({ x: 1405, y: 650, lines: ["Input für die nächste", "Produktgeneration"], size: 28, weight: 820, fill: C.secondary, lineHeight: 1.25 })}<path d="M1590 720V855H330V720" fill="none" stroke="${C.secondary}" stroke-width="4" marker-end="url(#arrow_${C.secondary.replace("#", "")})"/><text x="960" y="890" font-size="22" font-weight="760" fill="${C.secondary}" text-anchor="middle">Rückkopplung in Planung und Entwicklung</text>`);
  return {
    svg: frame(scene, `${phaseRail(5)}${observation}${assessment}${learning}`, { title: "Phase 5: Feldprognosen", takeaway: "Nur Felddaten zeigen reale Zuverlässigkeit und liefern die Lernschleife für die nächste Produktgeneration.", archetype: "feedback-loop", layoutIntent: "field-observation-assessment-learning-loop" }),
    targets: [target("field_observation", "Feldbeobachtung"), target("field_reliability_assessment", "Felddatenauswertung"), target("next_generation_learning_loop", "Lessons Learned")],
    steps: [step("show_field_observation", "field_observation", "show", "Sobald unser Produkt im Feld ist"), step("show_field_reliability_assessment", "field_reliability_assessment", "show", "nur mit Hilfe der Daten aus dem Feld final feststellen"), step("show_next_generation_learning_loop", "next_generation_learning_loop", "show", "wichtiger Input für die Weiterentwicklung der nächsten Produktgeneration")],
    brief: { archetype: "Rückkopplungsschleife", takeaway: "Felddaten schließen den Zuverlässigkeitsprozess und starten die nächste Generation.", animation: "Beobachtung, Bewertung und Lernschleife." },
  };
}

const RELIABILITY_FUNCTIONS = [
  { key: "density", number: 1, symbol: "f(t)", title: "Dichtefunktion", color: C.accent, soft: C.accentSoft },
  { key: "failure_probability", number: 2, symbol: "F(t)", title: "Ausfallwahrscheinlichkeit", color: C.cyan, soft: C.cyanSoft },
  { key: "reliability", number: 3, symbol: "R(t)", title: "Zuverlässigkeit", color: C.success, soft: C.successSoft },
  { key: "hazard", number: 4, symbol: "λ(t)", title: "Ausfallrate", color: C.failure, soft: C.failureSoft },
];

function reliabilityFunctionRail(activeKey) {
  return `<g id="reliability_function_rail" aria-label="Vier Zuverlässigkeitsfunktionen">${RELIABILITY_FUNCTIONS.map((item, index) => {
    const active = item.key === activeKey;
    const x = 98 + index * 435;
    return `<g data-reliability-function="${item.key}"><title>${item.number}. ${esc(item.title)} ${esc(item.symbol)}</title><rect x="${x}" y="174" width="400" height="52" rx="6" fill="${active ? item.color : C.surface}" stroke="${active ? item.color : C.border}" stroke-width="1.5"/><circle cx="${x + 28}" cy="200" r="16" fill="${active ? "#FFFFFF" : item.soft}"/><text x="${x + 28}" y="207" font-size="18" font-weight="820" fill="${item.color}" text-anchor="middle">${item.number}</text><text x="${x + 56}" y="207" font-size="19" font-weight="780" fill="${active ? "#FFFFFF" : C.deepSoft}">${esc(item.symbol)} · ${esc(item.title)}</text></g>`;
  }).join("")}</g>`;
}

function reliabilityFunctionTag(activeKey) {
  const item = RELIABILITY_FUNCTIONS.find((entry) => entry.key === activeKey);
  if (!item) return "";
  return `<g id="reliability_function_tag" aria-label="${item.number}. ${esc(item.title)} ${esc(item.symbol)}"><rect x="98" y="174" width="326" height="42" rx="6" fill="${item.soft}" stroke="${item.color}" stroke-width="1.5"/><circle cx="123" cy="195" r="14" fill="#FFFFFF"/><text x="123" y="201" font-size="18" font-weight="820" fill="${item.color}" text-anchor="middle">${item.number}</text><text x="149" y="202" font-size="18" font-weight="800" fill="${item.color}">${esc(item.symbol)} · ${esc(item.title)}</text></g>`;
}

function plotAsset(slideNumber, filename, x, y, width, height, assetId) {
  return nestedSvg(path.join(outputRoot, `slide_${String(slideNumber).padStart(3, "0")}`, "plots", filename), x, y, width, height, assetId)
    .replace(/font-size:\s*([0-9.]+)px/gi, (match, value) => `font-size: ${Math.max(18, Number(value))}px`)
    .replace(/font-size=["']([0-9.]+)(?:px)?["']/gi, (match, value) => `font-size="${Math.max(18, Number(value))}"`);
}

function formulaAsset(slideNumber, filename, x, y, width, height, assetId) {
  const embedded = nestedSvg(path.join(outputRoot, `slide_${String(slideNumber).padStart(3, "0")}`, "formulas", filename), x, y, width, height, assetId)
    .replace('preserveAspectRatio="xMidYMid meet"', 'preserveAspectRatio="xMinYMid meet"')
    .replace(new RegExp(`<g id="${assetId}__patch_1">[\\s\\S]*?<\\/g>`), "")
    .replaceAll("#062d46", C.deep)
    .replaceAll("#062D46", C.deep)
    .replaceAll("<text>", '<text data-qc-role="formula" data-qc-allow-overlap="true">')
    .replaceAll("<tspan ", '<tspan data-qc-role="formula" data-qc-allow-overlap="true" ');
  return embedded.replace('data-plot-asset="true"', 'data-formula-asset="true" data-qc-role="formula" data-qc-allow-overlap="true"');
}

function renderSlide27(scene) {
  const plot = plotAsset(27, "woehler.svg", 568, 224, 1256, 684, "woehler_plot");
  const selected = animGroup("selected_640_context", "Streuung bei 640 N/mm²", `<rect x="98" y="632" width="430" height="218" rx="8" fill="${C.surface}" stroke="${C.border}" stroke-width="1.5"/>${pictogram("target", { cx: 156, cy: 700, size: 42, color: C.failure, background: C.failureSoft, radius: 36 })}${textLines({ x: 210, y: 687, lines: ["LASTNIVEAU 640 N/mm²"], size: 18, weight: 840, fill: C.failure })}${textLines({ x: 210, y: 724, lines: ["gleiche Spannung", "unterschiedliche Ausfallzeiten"], size: 21, weight: 720, fill: C.deep, lineHeight: 1.4 })}`);
  const task = animGroup("statistical_description_task", "Aufgabe der Zuverlässigkeitstechnik", `<rect x="98" y="250" width="430" height="368" rx="8" fill="${C.surface}" stroke="${C.border}" stroke-width="1.5"/>${pictogram("search", { cx: 156, cy: 322, size: 42, color: C.accent, background: C.accentSoft, radius: 36 })}${textLines({ x: 210, y: 310, lines: ["AUFGABE DER", "ZUVERLÄSSIGKEITSTECHNIK"], size: 18, weight: 840, fill: C.accent, lineHeight: 1.35 })}${textLines({ x: 132, y: 410, lines: ["Trotz der Streuung", "Informationen zum", "produktspezifischen", "Ausfallverhalten ermitteln"], size: 27, weight: 760, fill: C.deep, lineHeight: 1.38 })}${textLines({ x: 132, y: 585, lines: ["Lebensdauer statistisch bewerten"], size: 19, weight: 700, fill: C.deepSoft })}`);
  return {
    svg: frame(scene, `${reliabilityFunctionRail("density")}${plot}${selected}${task}`, { title: "Streuung von Ausfallzeiten im Wöhlerversuch", takeaway: "Mehrere Ausfallzeiten auf demselben Lastniveau streuen und müssen statistisch beschrieben werden.", archetype: "data-chart", layoutIntent: "source-faithful-task-card-with-horizontal-load-level-plot" }),
    targets: [target("woehler_data", "Versuchsdaten"), target("woehler_curve", "Wöhlerkurve"), target("selected_load_level", "Stichprobe bei 640 N/mm²"), target("selected_640_context", "Streuung bei 640 N/mm²"), target("statistical_description_task", "Statistische Beschreibungsaufgabe")],
    steps: [step("draw_woehler_curve", "woehler_curve", "draw", "Die Wöhlerkurve beschreibt den Zusammenhang"), step("show_woehler_data", "woehler_data", "show", "Dabei wurden mehrere Versuche auf unterschiedlichen Lastniveaus"), step("show_selected_load_level", "selected_load_level", "show", "Betrachten wir nun die erreichten Ausfallzeiten für die Stichproben auf dem Lastniveau"), step("show_selected_640_context", "selected_640_context", "show", "Betrachten wir nun die erreichten Ausfallzeiten für die Stichproben auf dem Lastniveau"), step("show_statistical_description_task", "statistical_description_task", "show", "Die Aufgabe der Zuverlässigkeitstechnik ist es nun")],
    brief: { archetype: "Aufgabenkarte mit dominantem Datenplot", takeaway: "Streuung auf gleichem Lastniveau erfordert statistische Beschreibung.", animation: "Zuerst Wöhlerkurve samt Label, danach Versuchsdaten, anschließend das vollständige Lastniveau 640 und abschließend der Aufgabenblock." },
  };
}

function renderSlide28(scene) {
  const plot = plotAsset(28, "histogram_density.svg", 96, 224, 1728, 690, "histogram_density_plot");
  return {
    svg: frame(scene, `${reliabilityFunctionRail("density")}${plot}`, { title: "Vom Histogramm zur Dichtefunktion", takeaway: "Das Histogramm beschreibt die Stichprobe; die Dichtefunktion schätzt im selben Koordinatensystem das Ausfallverhalten der Grundgesamtheit.", archetype: "animated-chart-build", layoutIntent: "single-axes-histogram-to-density-animation" }),
    targets: [target("histogram_bars", "Stichprobe als Histogramm"), target("histogram_classes", "Klassen und Klassenbreite"), target("density_curve", "Dichtefunktion der Grundgesamtheit"), target("density_interpretation", "Ablesung des Ausfallbereichs")],
    steps: [step("show_histogram_bars", "histogram_bars", "show", "Zunächst erstellen wir ein Histogramm für die Ausfallzeiten unserer Stichprobe"), step("show_histogram_classes", "histogram_classes", "show", "Die einzelnen Balken werden auch als Klassen bezeichnet"), step("draw_density_curve", "density_curve", "draw", "Würden wir nun die Stichprobengröße und auch die Klassenanzahl immer weiter erhöhen"), step("show_density_interpretation", "density_interpretation", "show", "So könnte man in unserem Schaubild direkt interpretieren")],
    brief: { archetype: "Einzelner animierter Aufbauplot", takeaway: "Von der endlichen Stichprobe zur empirisch geschätzten Grundgesamtheit im selben Graphen.", animation: "Die gemeinsame Achse bleibt als Orientierung sichtbar. Danach erscheinen Histogramm, Klassenhinweis, glatte Dichtefunktion und abschließend die Ablesung bei etwa 23.000 und 45.000 Lastwechseln. Es gibt keinen zweiten Graphen und keine externe Erklärbox." },
  };
}

function renderSlide29(scene) {
  const plot = plotAsset(29, "woehler_3d.svg", 24, 188, 1872, 770, "woehler_3d_plot");
  return {
    svg: frame(scene, `${reliabilityFunctionRail("density")}${plot}`, { title: "Dreidimensionale Wöhlerkurve im Zahnbruchversuch", takeaway: "Die Spannung ergänzt die Dichtefunktion zur dreidimensionalen Wöhlerdarstellung.", archetype: "three-dimensional-data-chart", layoutIntent: "source-oriented-wireframe-with-base-plane-woehler-line" }),
    targets: [target("density_ridges", "Dichtefunktionen je Lastniveau"), target("woehler_peak_line", "Beschriftete Wöhlerlinie")],
    steps: [step("draw_density_ridges", "density_ridges", "draw", "Die Dichtefunktion beschreibt das Ausfallverhalten über der Zeit für ein spezifisches Lastniveau"), step("draw_woehler_peak_line", "woehler_peak_line", "draw", "Erweitert man nun die Darstellung um die Dimension der Spannung")],
    brief: { archetype: "Dominanter 3D-Datenplot", takeaway: "Mehrere Dichtefunktionen bilden gemeinsam die dreidimensionale Wöhlerdarstellung.", animation: "Zuerst die Dichterippen je Lastniveau, danach die direkt beschriftete Wöhlerlinie durch ihre Maxima." },
  };
}

function renderSlide30(scene) {
  const meta = "";
  const plot = plotAsset(30, "nkw_density.svg", 96, 238, 1180, 660, "nkw_density_plot");
  const gearboxImage = animGroup("nkw_gearbox_image", "Generierte Illustration eines 6-Gang-NKW-Getriebes", `<rect x="1310" y="238" width="512" height="260" rx="8" fill="${C.surface}" stroke="${C.border}" stroke-width="1.5"/>${croppedRasterPanel({ slideNumber: 30, filename: "nkw-6-speed-gearbox-cutaway-display.jpg", x: 1355, y: 252, width: 422, height: 236, sourceViewBox: "0 38 960 540", sourceWidth: 960, sourceHeight: 640, assetId: "nkw_density_gearbox_image" })}`);
  const question = animGroup("nkw_density_question", "Prüffragen zur Verteilung", `<rect x="1310" y="510" width="512" height="84" rx="8" fill="${C.surface}" stroke="${C.border}" stroke-width="1.5"/>${textLines({ x: 1342, y: 538, lines: ["PAUSE & PRÜFE"], size: 18, weight: 840, fill: C.secondary })}${textLines({ x: 1342, y: 568, lines: ["Was fällt am Verlauf auf? · Wäre er wünschenswert?"], size: 18, weight: 760, fill: C.deep })}`);
  const diagnosis = animGroup("nkw_density_diagnosis", "Rechtsschiefe Verteilung und frühe Ausfälle", `<rect x="1310" y="606" width="512" height="174" rx="8" fill="${C.surface}" stroke="${C.border}" stroke-width="1.5"/>${textLines({ x: 1342, y: 638, lines: ["BEOBACHTUNG"], size: 18, weight: 840, fill: C.failure })}${textLines({ x: 1342, y: 678, lines: ["• rechtsschief / linkssteil", "• Ausfälle bereits ab t = 0", "• viele frühe Ausfälle", "• nicht wünschenswert"], size: 20, weight: 740, fill: C.deep, lineHeight: 1.35 })}`);
  const desired = animGroup("nkw_density_desired_state", "Gewünschte Verteilung", `<rect x="1310" y="792" width="512" height="106" rx="8" fill="${C.surface}" stroke="${C.border}" stroke-width="1.5"/>${textLines({ x: 1342, y: 824, lines: ["ZIEL"], size: 18, weight: 840, fill: C.success })}${textLines({ x: 1342, y: 862, lines: ["flacher Beginn · nach rechts verschoben"], size: 20, weight: 760, fill: C.deep })}`);
  return {
    svg: frame(scene, `${reliabilityFunctionRail("density")}${meta}${plot}${gearboxImage}${question}${diagnosis}${desired}`, { title: "Ausfalldichte eines 6-Gang-NKW-Getriebes", takeaway: "Eine rechtsschiefe Dichte mit Ausfällen ab t=0 ist unerwünscht; Ziel ist ein späterer, flacher Beginn.", archetype: "diagnostic-data-chart", layoutIntent: "single-plot-with-consistent-gearbox-context-and-compact-diagnostic-panel" }),
    targets: [target("observed_density", "Reale Ausfalldichte"), target("nkw_gearbox_image", "Generierte Illustration des 6-Gang-NKW-Getriebes"), target("nkw_density_question", "Prüffragen"), target("nkw_density_diagnosis", "Diagnose"), target("desired_density", "Gewünschte Dichte"), target("nkw_density_desired_state", "Zielzustand")],
    steps: [step("draw_observed_density", "observed_density", "draw", "Im Schaubild ist die Dichtefunktion der Ausfälle eines Sechsgang-Nutzfahrzeuggetriebes zu sehen"), step("show_nkw_gearbox_image", "nkw_gearbox_image", "show", "Im Schaubild ist die Dichtefunktion der Ausfälle eines Sechsgang-Nutzfahrzeuggetriebes zu sehen"), step("show_nkw_density_question", "nkw_density_question", "show", "Nun zu zwei Fragen"), step("show_nkw_density_diagnosis", "nkw_density_diagnosis", "show", "Was dir als erstes auffallen sollte"), step("draw_desired_density", "desired_density", "draw", "Es wäre also wünschenswert"), step("show_nkw_density_desired_state", "nkw_density_desired_state", "show", "Es wäre also wünschenswert")],
    brief: { archetype: "Fragegeleiteter Diagnoseplot", takeaway: "Frühe Ausfälle sind unerwünscht; die Zielverteilung beginnt flacher und später.", animation: "Reale Dichte und generierte technische Illustration des 6-Gang-NKW-Getriebes erscheinen gemeinsam; danach Prüffrage und einheitlich formatierte Diagnose; abschließend Zielkurve und Zielzustand." },
  };
}

function renderSlide31(scene) {
  const plot = plotAsset(31, "human_density.svg", 98, 218, 1724, 710, "human_density_plot");
  const curvesTrigger = "Hierbei kann die Sterblichkeit von Männern und Frauen auch mithilfe der Dichtefunktion beschrieben werden";
  return {
    svg: frame(scene, `${reliabilityFunctionRail("density")}${plot}`, { title: "Dichtefunktion menschlicher Sterbefälle", takeaway: "Dichtefunktionen beschreiben auch menschliche Sterbealter; die Maxima liegen bei Männern und Frauen unterschiedlich.", archetype: "comparison-data-chart", layoutIntent: "source-faithful-two-curve-comparison-with-separated-peak-labels" }),
    targets: [target("men_density", "Dichte Männer"), target("women_density", "Dichte Frauen"), target("men_peak", "Maximum Männer"), target("women_peak", "Maximum Frauen")],
    steps: [step("draw_men_density", "men_density", "draw", curvesTrigger), step("draw_women_density", "women_density", "draw", curvesTrigger), step("show_men_peak", "men_peak", "show", "Die meisten Männer sterben demnach"), step("show_women_peak", "women_peak", "show", "Bei den Frauen treten die häufigsten Todesfälle")],
    brief: { archetype: "Direkt beschrifteter Vergleichsplot", takeaway: "Die Maxima der Sterbealtersdichten liegen bei Männern und Frauen unterschiedlich.", animation: "Beide Kurven nacheinander, danach die räumlich getrennten Peakmarkierungen; keine zusätzlichen Anstiegs- oder Transferboxen." },
  };
}

function renderSlide32(scene) {
  const plot = plotAsset(32, "empirical_cdf.svg", 100, 236, 1720, 620, "empirical_cdf_plot");
  const transition = animGroup("cumulative_transition", "Übergang durch Kumulieren", `${textLines({ x: 960, y: 286, lines: ["kumulieren"], size: 18, weight: 800, fill: C.cyan, anchor: "middle" })}<line x1="900" y1="306" x2="1010" y2="306" stroke="${C.cyan}" stroke-width="4"/><path d="M1010 296 L1032 306 L1010 316 Z" fill="${C.cyan}"/>`);
  const definition = animGroup("empirical_cdf_definition", "Empirische Verteilungsfunktion", `<rect x="98" y="872" width="1724" height="70" rx="8" fill="${C.surfaceSoft}" stroke="${C.border}" stroke-width="1.5"/>${textLines({ x: 138, y: 916, lines: ["F*(t)"], size: 23, weight: 840, fill: C.failure })}${textLines({ x: 228, y: 916, lines: ["Empirische Verteilungsfunktion · Anteil aller Ausfälle bis zum Zeitpunkt t"], size: 20, weight: 720, fill: C.deep })}`);
  const cumulativeTargets = [1, 2, 3, 4, 5].map((index) => target(`cumulative_class_${index}`, `Kumulierte Klasse ${index}`));
  const cumulativeSteps = [1, 2, 3, 4, 5].map((index) => step(`show_cumulative_class_${index}`, `cumulative_class_${index}`, "show", "Man summiert also einfach im Histogramm", "Klassenweiser Aufbau von links nach rechts; Balken und Rechenschritt bleiben eine Gruppe."));
  return {
    svg: frame(scene, `${reliabilityFunctionRail("failure_probability")}${plot}${transition}${definition}`, { title: "Von der Häufigkeit zur Summenhäufigkeit", takeaway: "Kumulierte Klassen ergeben die empirische Verteilungsfunktion und zeigen alle Ausfälle bis zu einem Zeitpunkt.", archetype: "before-after-data-chart", layoutIntent: "classwise-left-to-right-cumulative-build-with-local-arithmetic", density: "dense", designException: "Die hohe Elementzahl entsteht aus fünf einzeln nachvollziehbaren Kumulationsschritten im Datenplot." }),
    targets: [target("frequency_histogram", "Einzelhäufigkeiten"), target("cumulative_transition", "Übergang durch Kumulieren"), ...cumulativeTargets, target("empirical_distribution", "Empirische Verteilungsfunktion"), target("empirical_cdf_definition", "Definition F Stern von t")],
    steps: [step("show_frequency_histogram", "frequency_histogram", "show", "Das Histogramm bzw. die Dichtefunktion gibt einen Aufschluss"), step("show_cumulative_transition", "cumulative_transition", "show", "Man summiert also einfach im Histogramm"), ...cumulativeSteps, step("draw_empirical_distribution", "empirical_distribution", "draw", "Die Verbindungslinie im Histogramm ergibt eine weitere Funktion"), step("show_empirical_cdf_definition", "empirical_cdf_definition", "show", "Die Verbindungslinie im Histogramm ergibt eine weitere Funktion")],
    brief: { archetype: "Rechenweg als Vorher-Nachher-Diagramm", takeaway: "Kumulieren überführt Einzelhäufigkeiten in F*(t).", animation: "Einzelhistogramm; Übergang; fünf kumulierte Balken mit direkt zugeordnetem Rechenschritt von links nach rechts; abschließend empirische Verbindungslinie und kompakte Definition." },
  };
}

function renderSlide33(scene) {
  const plot = plotAsset(33, "smooth_cdf.svg", 78, 256, 1130, 640, "smooth_cdf_plot");
  const integral = animGroup("cdf_integral_formula", "Integralbeziehung", `${card(1235, 270, 585, 182, { fill: C.cyanSoft, stroke: C.cyan, shadow: false })}${label(1275, 312, "Dichte aufsummieren → Ausfallwahrscheinlichkeit", C.cyan)}${formulaAsset(33, "cdf-integral.svg", 1280, 334, 490, 92, "cdf_integral_asset")}`);
  const derivative = animGroup("cdf_derivative_formula", "Ableitungsbeziehung", `${card(1235, 482, 585, 182, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${label(1275, 524, "Steigung von F(t) → Dichte", C.accent)}${formulaAsset(33, "cdf-derivative.svg", 1280, 546, 490, 92, "cdf_derivative_asset")}`);
  const meaning = animGroup("cdf_statistical_meaning", "Statistische Bedeutung", `${card(1235, 694, 585, 202, { fill: C.successSoft, stroke: C.success, shadow: false })}${pictogram("shieldCheck", { cx: 1300, cy: 790, size: 48, color: C.success, background: "#FFFFFF", radius: 40 })}${label(1362, 746, "STATISTISCHE BEDEUTUNG", C.success)}${textLines({ x: 1362, y: 790, lines: ["F(t) = Wahrscheinlichkeit,"], size: 23, weight: 820, fill: C.deep })}${textLines({ x: 1362, y: 828, lines: ["dass ein Produkt bis zum Zeitpunkt t", "ausgefallen ist"], size: 21, weight: 690, fill: C.deepSoft, lineHeight: 1.35 })}`);
  return {
    svg: frame(scene, `${reliabilityFunctionRail("failure_probability")}${plot}${integral}${derivative}${meaning}`, { title: "Verteilungsfunktion und Ausfallwahrscheinlichkeit", takeaway: "F(t) ist die kumulierte Dichte und beschreibt die Ausfallwahrscheinlichkeit bis zu einem Zeitpunkt.", archetype: "formula-data-chart", layoutIntent: "dominant-s-curve-with-mathtext-integral-derivative-bridge", density: "dense", designException: "Datenplot, zwei Formelbrücken und statistische Deutung sind für die Herleitung gemeinsam erforderlich." }),
    targets: [target("population_stems", "Kumulierte Grundgesamtheit"), target("smooth_distribution", "Glatte Verteilungsfunktion"), target("cdf_integral_formula", "Integralbeziehung"), target("cdf_derivative_formula", "Ableitungsbeziehung"), target("cdf_zero_endpoint", "Startwert null Prozent"), target("cdf_hundred_endpoint", "Grenzwert einhundert Prozent"), target("cdf_statistical_meaning", "Statistische Bedeutung")],
    steps: [step("show_population_stems", "population_stems", "show", "Wird nun wieder die Anzahl der Ausfälle gegen unendlich immer weiter erhöht"), step("draw_smooth_distribution", "smooth_distribution", "draw", "ergib sich wieder eine glatte Kurve"), step("show_cdf_integral_formula", "cdf_integral_formula", "show", "Mathematisch kann die Ausfallwahrscheinlichkeit durch das Integral"), step("show_cdf_derivative_formula", "cdf_derivative_formula", "show", "oder andersherum, die Dichtefunktion einfach durch die Ableitung der Ausfallwahrscheinlichkeit"), step("show_cdf_zero_endpoint", "cdf_zero_endpoint", "show", "Die Ausfallwahrscheinlichkeit startet zu Beginn der Lebensdauer immer bei einem Wert von null Prozent"), step("show_cdf_hundred_endpoint", "cdf_hundred_endpoint", "show", "erreicht zu einem bestimmten Zeitpunkt dann den Wert von einhundert Prozent"), step("show_cdf_statistical_meaning", "cdf_statistical_meaning", "show", "Die Ausfallwahrscheinlichkeit beschreibt statistisch")],
    brief: { archetype: "Funktionsplot mit Formelbrücke", takeaway: "F(t) und f(t) sind über Integral und Ableitung verknüpft.", animation: "Kumulierte Grundgesamtheit, danach gezeichnete S-Kurve; Integral- und Ableitungsbeziehung; erst anschließend die narrativ erklärten Randwerte 0 Prozent und 100 Prozent; abschließend die statistische Interpretation." },
  };
}

function renderSlide34(scene) {
  const meta = `${pictogram("database", { cx: 142, cy: 270, size: 36, color: C.deepSoft, background: C.surfaceSoft, radius: 30 })}${textLines({ x: 188, y: 265, lines: ["6-Gang-NKW-Getriebe · 2.115 Schadensereignisse · 82 Klassen"], size: 19, weight: 790, fill: C.deep })}${textLines({ x: 188, y: 294, lines: ["normierte Lebensdauer"], size: 18, weight: 660, fill: C.muted })}`;
  const plot = plotAsset(34, "nkw_cdf.svg", 80, 290, 1380, 548, "nkw_cdf_plot");
  const gearboxImage = animGroup("nkw_cdf_gearbox_image", "Wiederkehrende generierte Illustration des 6-Gang-NKW-Getriebes", croppedRasterPanel({ slideNumber: 34, filename: "nkw-6-speed-gearbox-cutaway-display.jpg", x: 1375, y: 300, width: 425, height: 238, sourceViewBox: "0 38 960 540", sourceWidth: 960, sourceHeight: 640, assetId: "nkw_cdf_gearbox_image_asset" }));
  const ten = animGroup("ten_percent_context", "Zeitpunkt bei zehn Prozent", `<rect x="98" y="844" width="862" height="90" rx="8" fill="${C.surfaceSoft}" stroke="${C.border}" stroke-width="1.5"/>${pictogram("target", { cx: 150, cy: 889, size: 42, color: C.failure, background: C.failureSoft, radius: 35 })}${textLines({ x: 204, y: 878, lines: ["VON F(t) ZUR ZEIT"], size: 18, weight: 840, fill: C.failure })}${textLines({ x: 204, y: 910, lines: ["10 % ausgefallen → t ≈ 0,25"], size: 23, weight: 820, fill: C.deep })}`);
  const one = animGroup("time_one_context", "Ausfallwahrscheinlichkeit bei t gleich eins", `<rect x="960" y="844" width="862" height="90" rx="8" fill="${C.surfaceSoft}" stroke="${C.border}" stroke-width="1.5"/>${pictogram("target", { cx: 1015, cy: 889, size: 42, color: C.secondary, background: C.secondarySoft, radius: 35 })}${textLines({ x: 1068, y: 878, lines: ["VON DER ZEIT ZU F(t)"], size: 18, weight: 840, fill: C.secondary })}${textLines({ x: 1068, y: 910, lines: ["t = 1 → F(t) = 63 %"], size: 23, weight: 820, fill: C.deep })}`);
  return {
    svg: frame(scene, `${reliabilityFunctionRail("failure_probability")}${meta}${plot}${gearboxImage}${ten}${one}`, { title: "Ausfallwahrscheinlichkeit eines 6-Gang-NKW-Getriebes", takeaway: "Die Verteilungsfunktion erlaubt beide Leserichtungen: Prozent zu Zeitpunkt und Zeitpunkt zu Prozent.", archetype: "readout-data-chart", layoutIntent: "source-calibrated-cdf-with-recurring-gearbox-context-and-bidirectional-readouts", density: "dense", designException: "Der technische Kontext und zwei getrennte Leserichtungen werden lokal am selben Datenplot benötigt." }),
    targets: [target("nkw_distribution", "Ausfallwahrscheinlichkeitskurve"), target("nkw_cdf_gearbox_image", "Generierte Illustration des 6-Gang-NKW-Getriebes"), target("ten_percent_readout", "Leseweg zehn Prozent"), target("ten_percent_context", "Erklärung zehn Prozent"), target("time_one_readout", "Leseweg t gleich eins"), target("time_one_context", "Erklärung t gleich eins")],
    steps: [step("draw_nkw_distribution", "nkw_distribution", "draw", "Betrachten wir nun am bekannten Beispiel des Sechsgang-Nutzfahrzeuggetriebes die Ausfallwahrscheinlichkeit"), step("show_nkw_cdf_gearbox_image", "nkw_cdf_gearbox_image", "show", "Betrachten wir nun am bekannten Beispiel des Sechsgang-Nutzfahrzeuggetriebes die Ausfallwahrscheinlichkeit"), step("show_ten_percent_readout", "ten_percent_readout", "show", "Interessiert uns beispielsweise, wann zehn Prozent der Getriebe ausgefallen sind"), step("show_ten_percent_context", "ten_percent_context", "show", "Interessiert uns beispielsweise, wann zehn Prozent der Getriebe ausgefallen sind"), step("show_time_one_readout", "time_one_readout", "show", "Interessiert uns aber wie viele Einheiten zum Zeitpunkt eins ausgefallen sind"), step("show_time_one_context", "time_one_context", "show", "Interessiert uns aber wie viele Einheiten zum Zeitpunkt eins ausgefallen sind")],
    brief: { archetype: "Direkter Ableseplot", takeaway: "F(t) verbindet Zeit und kumulierten Ausfallanteil in beide Richtungen.", animation: "Kurve und dieselbe generierte technische Illustration des 6-Gang-NKW-Getriebes wie in der vorangegangenen Dichtefolie; danach der vollständige 10-Prozent-Leseweg und der vollständige t=1-Leseweg samt Ergebnis." },
  };
}

function renderSlide35(scene) {
  const plot = plotAsset(35, "human_cdf.svg", 100, 246, 1720, 590, "human_cdf_plot");
  const comparison = animGroup("human_cdf_comparison", "Vergleich bei achtzig Jahren", `<rect x="98" y="852" width="1724" height="82" rx="8" fill="${C.surfaceSoft}" stroke="${C.border}" stroke-width="1.5"/>${textLines({ x: 145, y: 902, lines: ["80 JAHRE"], size: 18, weight: 840, fill: C.deepSoft })}${textLines({ x: 360, y: 902, lines: ["Männer 62 %"], size: 24, weight: 840, fill: C.cyan })}${textLines({ x: 960, y: 902, lines: ["Unterschied: 26 Prozentpunkte"], size: 22, weight: 820, fill: C.secondary, anchor: "middle" })}${textLines({ x: 1775, y: 902, lines: ["Frauen 36 %"], size: 24, weight: 840, fill: C.failure, anchor: "end" })}`);
  const trigger = "Die Ausfallwahrscheinlichkeit, also die Wahrscheinlichkeit zu sterben, steigt bei Männern im Vergleich zu den Frauen deutlich steiler an";
  return {
    svg: frame(scene, `${reliabilityFunctionRail("failure_probability")}${plot}${comparison}`, { title: "Ausfallwahrscheinlichkeit des Menschen", takeaway: "Bei 80 Jahren liegt die kumulierte Sterbewahrscheinlichkeit der Männer deutlich über jener der Frauen.", archetype: "comparison-data-chart", layoutIntent: "direct-age-80-readout-with-percentage-point-difference", density: "dense", designException: "Zwei Datenreihen, vollständiger Ablesepfad und Ergebnisvergleich bilden eine gemeinsame Auswertung." }),
    targets: [target("men_distribution", "Ausfallwahrscheinlichkeit Männer"), target("women_distribution", "Ausfallwahrscheinlichkeit Frauen"), target("age_80_readout", "Ablesung bei achtzig Jahren"), target("human_cdf_comparison", "Werte bei achtzig Jahren")],
    steps: [step("draw_men_distribution", "men_distribution", "draw", trigger), step("draw_women_distribution", "women_distribution", "draw", trigger), step("show_age_80_readout", "age_80_readout", "show", "Demnach sind auch bei einem Lebensalter von achtzig Jahren"), step("show_human_cdf_comparison", "human_cdf_comparison", "show", "Demnach sind auch bei einem Lebensalter von achtzig Jahren")],
    brief: { archetype: "Direkter Vergleichsplot", takeaway: "Bei 80 Jahren: 62 Prozent Männer und 36 Prozent Frauen, also 26 Prozentpunkte Unterschied.", animation: "Beide Kurven gemeinsam; anschließend vollständiger Ablesepfad mit Werten und Differenz." },
  };
}

function renderSlide36(scene) {
  const relation = animGroup("reliability_relation", "Komplementäre Grundbeziehung", `<rect x="98" y="246" width="1724" height="106" rx="8" fill="${C.deep}"/>${pictogram("shieldCheck", { cx: 150, cy: 299, size: 44, color: "#FFFFFF" })}${formulaAsset(36, "reliability-complement.svg", 210, 260, 390, 78, "reliability_complement_asset")}${textLines({ x: 720, y: 288, lines: ["AUSGEFALLENE TEILE + INTAKTE TEILE = 100 %"], size: 22, weight: 820, fill: "#FFFFFF" })}${textLines({ x: 720, y: 324, lines: ["Reliability = Überlebenswahrscheinlichkeit"], size: 20, weight: 660, fill: "#FFFFFF" })}`);
  const plot = plotAsset(36, "reliability_partition.svg", 100, 372, 1720, 448, "reliability_partition_plot");
  const failure = animGroup("failure_area_formula", "Ausfallwahrscheinlichkeit bis tx", `<rect x="98" y="842" width="862" height="94" rx="8" fill="${C.surfaceSoft}" stroke="${C.border}" stroke-width="1.5"/>${textLines({ x: 140, y: 876, lines: ["BIS tₓ AUSGEFALLEN"], size: 18, weight: 840, fill: C.cyan })}${formulaAsset(36, "failure-area-integral.svg", 370, 854, 500, 66, "failure_area_integral_asset")}`);
  const reliability = animGroup("reliability_area_formula", "Zuverlässigkeit nach tx", `<rect x="960" y="842" width="862" height="94" rx="8" fill="${C.surfaceSoft}" stroke="${C.border}" stroke-width="1.5"/>${textLines({ x: 1010, y: 876, lines: ["NACH tₓ INTAKT"], size: 18, weight: 840, fill: C.success })}${formulaAsset(36, "reliability-area-integral.svg", 1210, 854, 520, 66, "reliability_area_integral_asset")}`);
  return {
    svg: frame(scene, `${reliabilityFunctionRail("reliability")}${relation}${plot}${failure}${reliability}`, { title: "Überlebenswahrscheinlichkeit und Zuverlässigkeit", takeaway: "F(t) und R(t) teilen die Gesamtpopulation in ausgefallene und noch intakte Einheiten.", archetype: "formula-area-diagram", layoutIntent: "single-density-partition-with-local-mathtext-area-formulas", density: "dense", designException: "Komplementärbeziehung, Flächenzerlegung und zwei lokale Integrale sind für die Herleitung gemeinsam erforderlich." }),
    targets: [target("reliability_relation", "R gleich eins minus F"), target("density_reference", "Dichtefunktion"), target("tx_reference", "Bezugszeitpunkt tx"), target("failure_probability_area", "Ausfallfläche"), target("failure_area_formula", "Integral der Ausfallfläche"), target("reliability_area", "Zuverlässigkeitsfläche"), target("reliability_area_formula", "Integral der Zuverlässigkeitsfläche")],
    steps: [step("show_reliability_relation", "reliability_relation", "show", "Demnach berechnet sich die Überlebenswahrscheinlichkeit bzw. Zuverlässigkeit also einfach zu eins minus der Ausfallwahrscheinlichkeit"), step("draw_density_reference", "density_reference", "draw", "Grafisch kann die Abhängigkeit auch mit Hilfe der Dichtefunktion visualisiert werden"), step("show_tx_reference", "tx_reference", "show", "Für einen spezifischen Zeitpunkt t-x"), step("show_failure_probability_area", "failure_probability_area", "show", "Für einen spezifischen Zeitpunkt t-x kann die Ausfallwahrscheinlichkeit über das Flächenintegral"), step("show_failure_area_formula", "failure_area_formula", "show", "Für einen spezifischen Zeitpunkt t-x kann die Ausfallwahrscheinlichkeit über das Flächenintegral"), step("show_reliability_area", "reliability_area", "show", "Umgekehrt kann die Zuverlässigkeit über das Flächenintegral"), step("show_reliability_area_formula", "reliability_area_formula", "show", "Umgekehrt kann die Zuverlässigkeit über das Flächenintegral")],
    brief: { archetype: "Eine Flächenzerlegung mit Formelankern", takeaway: "Ausfallwahrscheinlichkeit und Zuverlässigkeit sind komplementäre Flächen.", animation: "Mathtext-Grundgleichung, Dichte und Bezugszeitpunkt; danach jeweils vollständige Fläche samt lokaler Mathtext-Formel." },
  };
}

function renderBathtubCurveSlide(scene, assetSlideNumber) {
  const summaryMode = assetSlideNumber === 75;
  const definition = animGroup("hazard_definition", "Definition der Ausfallrate", `<rect x="98" y="242" width="930" height="100" rx="8" fill="${C.deep}"/>${formulaAsset(assetSlideNumber, "hazard-ratio.svg", 145, 254, 430, 76, "hazard_ratio_asset")}${textLines({ x: 610, y: 282, lines: ["AUSFÄLLE"], size: 18, weight: 840, fill: "#FFFFFF" })}${textLines({ x: 610, y: 314, lines: ["im Verhältnis zu den noch intakten Einheiten"], size: 19, weight: 700, fill: "#FFFFFF" })}`);
  const risk = animGroup("hazard_risk_meaning", "Bedingtes Ausfallrisiko", `<rect x="1040" y="242" width="782" height="100" rx="8" fill="${C.deep}"/>${pictogram("machineAlert", { cx: 1095, cy: 292, size: 42, color: C.failure, background: "#FFFFFF", radius: 35 })}${textLines({ x: 1150, y: 277, lines: ["BEDINGTES RISIKO"], size: 18, weight: 840, fill: C.failure })}${textLines({ x: 1150, y: 313, lines: ["Ausfall zum Zeitpunkt t – sofern das Bauteil bis dahin intakt blieb"], size: 19, weight: 700, fill: "#FFFFFF" })}`);
  const plot = plotAsset(assetSlideNumber, "bathtub_curve.svg", 98, 354, 1724, 304, "bathtub_curve_standard_plot");
  const early = animGroup("early_failure_region", "Frühausfälle und Maßnahmen", `<rect x="98" y="674" width="516" height="264" fill="${C.failureSoft}" stroke="${C.failure}" stroke-width="1.5"/>${textLines({ x: 130, y: 714, lines: ["1 · FRÜHAUSFÄLLE · λ(t) SINKT"], size: 21, weight: 840, fill: C.failure })}${textLines({ x: 130, y: 755, lines: ["URSACHEN"], size: 18, weight: 840, fill: C.muted })}${textLines({ x: 130, y: 786, lines: ["Design · Montage · Fertigung", "Werkstofffehler"], size: 20, weight: 720, fill: C.deep, lineHeight: 1.35 })}${textLines({ x: 130, y: 855, lines: ["GEGENMASSNAHMEN"], size: 18, weight: 840, fill: C.muted })}${textLines({ x: 130, y: 886, lines: ["Qualitative Methoden · Versuche", "Fertigungs- und Qualitätskontrolle"], size: 19, weight: 700, fill: C.deep, lineHeight: 1.35 })}`);
  const random = animGroup("random_failure_region", "Zufallsausfälle und Maßnahmen", `<rect x="614" y="674" width="690" height="264" fill="${C.accentSoft}" stroke="${C.accent}" stroke-width="1.5"/>${textLines({ x: 650, y: 714, lines: ["2 · ZUFALLSAUSFÄLLE · λ(t) KONSTANT"], size: 21, weight: 840, fill: C.accent })}${textLines({ x: 650, y: 755, lines: ["URSACHEN"], size: 18, weight: 840, fill: C.muted })}${textLines({ x: 650, y: 786, lines: ["Bedienfehler · Wartungsfehler · Schmutzpartikel"], size: 19, weight: 720, fill: C.deep })}${textLines({ x: 650, y: 827, lines: ["GEGENMASSNAHMEN"], size: 18, weight: 840, fill: C.muted })}${textLines({ x: 650, y: 858, lines: ["Sachgemäße Nutzung · korrekte Bedienung", "regelmäßige Wartung"], size: 19, weight: 700, fill: C.deep, lineHeight: 1.3 })}${textLines({ x: 650, y: 916, lines: ["Relativ geringes, gleichbleibendes Risiko"], size: 19, weight: 820, fill: C.accent })}`);
  const wear = animGroup("wearout_failure_region", "Ermüdungsausfälle und Maßnahmen", `<rect x="1304" y="674" width="518" height="264" fill="${C.secondarySoft}" stroke="${C.secondary}" stroke-width="1.5"/>${textLines({ x: 1340, y: 714, lines: ["3 · ERMÜDUNGSAUSFÄLLE · λ(t) STEIGT"], size: 20, weight: 840, fill: C.secondary })}${textLines({ x: 1340, y: 755, lines: ["URSACHEN"], size: 18, weight: 840, fill: C.muted })}${textLines({ x: 1340, y: 786, lines: ["Rissbildung · Bruch · Alterung", "Verschleiß"], size: 19, weight: 720, fill: C.deep, lineHeight: 1.35 })}${textLines({ x: 1340, y: 840, lines: ["GEGENMASSNAHMEN"], size: 18, weight: 840, fill: C.muted })}${textLines({ x: 1340, y: 871, lines: ["Auslegung · Berechnung", "Lebensdauerversuche"], size: 19, weight: 700, fill: C.deep, lineHeight: 1.35 })}${textLines({ x: 1340, y: 925, lines: ["bestimmt die maximal erreichbare Lebensdauer"], size: 18, weight: 820, fill: C.secondary })}`);
  return {
    svg: frame(scene, `${reliabilityFunctionRail("hazard")}${definition}${risk}${plot}${early}${random}${wear}`, { title: "Ausfallrate und Badewannenkurve", takeaway: "Die Ausfallrate beschreibt das bedingte Risiko und gliedert den Lebenszyklus in Früh-, Zufalls- und Ermüdungsausfälle.", archetype: "three-zone-function-chart", layoutIntent: "aligned-hazard-formula-curve-causes-actions-and-life-meaning", density: "dense" }),
    targets: summaryMode
      ? [target("hazard_definition", "Definition der Ausfallrate"), target("hazard_risk_meaning", "Bedingtes Ausfallrisiko"), target("bathtub_curve_path", "Badewannenkurve"), target("bathtub_early_zone", "Frühausfallzone"), target("early_failure_region", "Frühausfälle"), target("bathtub_random_zone", "Zufallsausfallzone"), target("random_failure_region", "Zufallsausfälle"), target("bathtub_wear_zone", "Ermüdungsausfallzone"), target("wearout_failure_region", "Ermüdungsausfälle")]
      : [target("hazard_definition", "Definition der Ausfallrate"), target("hazard_risk_meaning", "Bedingtes Ausfallrisiko"), target("bathtub_curve_path", "Badewannenkurve"), ...["span", "divider", "number", "label"].map((part) => target(`bathtub_early_${part}`, `Frühausfallzone · ${part}`)), target("early_failure_region", "Frühausfälle"), ...["span", "divider", "number", "label"].map((part) => target(`bathtub_random_${part}`, `Zufallsausfallzone · ${part}`)), target("random_failure_region", "Zufallsausfälle"), ...["span", "number", "label"].map((part) => target(`bathtub_wear_${part}`, `Ermüdungsausfallzone · ${part}`)), target("wearout_failure_region", "Ermüdungsausfälle")],
    steps: summaryMode
      ? [step("show_hazard_definition", "hazard_definition", "show", "Die Ausfallrate wird mit Lambda abgekürzt und beschreibt das Verhältnis der Ausfälle"), step("show_hazard_risk_meaning", "hazard_risk_meaning", "show", "Die Ausfallrate zu einem bestimmten Zeitpunkt t"), step("draw_bathtub_curve_path", "bathtub_curve_path", "draw", "Der charakteristische Verlauf dieser Raten wird durch die sogenannte Badewannenkurve dargestellt"), step("show_bathtub_early_zone", "bathtub_early_zone", "show", "Im ersten Bereich der Kurve nimmt die Ausfallrate ab"), step("show_early_failure_region", "early_failure_region", "show", "Im ersten Bereich der Kurve nimmt die Ausfallrate ab"), step("show_bathtub_random_zone", "bathtub_random_zone", "show", "Im zweiten Bereich, der die Zufallsausfälle darstellt"), step("show_random_failure_region", "random_failure_region", "show", "Im zweiten Bereich, der die Zufallsausfälle darstellt"), step("show_bathtub_wear_zone", "bathtub_wear_zone", "show", "Der dritte Bereich beschreibt die Ermüdungsausfälle"), step("show_wearout_failure_region", "wearout_failure_region", "show", "Der dritte Bereich beschreibt die Ermüdungsausfälle")]
      : [step("show_hazard_definition", "hazard_definition", "show", "Die Ausfallrate wird mit Lambda abgekürzt und beschreibt das Verhältnis der Ausfälle"), step("show_hazard_risk_meaning", "hazard_risk_meaning", "show", "Die Ausfallrate zu einem bestimmten Zeitpunkt t"), step("draw_bathtub_curve_path", "bathtub_curve_path", "draw", "Der charakteristische Verlauf dieser Raten wird durch die sogenannte Badewannenkurve dargestellt"), ...["span", "divider", "number", "label"].map((part) => step(`show_bathtub_early_${part}`, `bathtub_early_${part}`, "show", "Im ersten Bereich der Kurve nimmt die Ausfallrate ab")), step("show_early_failure_region", "early_failure_region", "show", "Im ersten Bereich der Kurve nimmt die Ausfallrate ab"), ...["span", "divider", "number", "label"].map((part) => step(`show_bathtub_random_${part}`, `bathtub_random_${part}`, "show", "Im zweiten Bereich, der die Zufallsausfälle darstellt")), step("show_random_failure_region", "random_failure_region", "show", "Im zweiten Bereich, der die Zufallsausfälle darstellt"), ...["span", "number", "label"].map((part) => step(`show_bathtub_wear_${part}`, `bathtub_wear_${part}`, "show", "Der dritte Bereich beschreibt die Ermüdungsausfälle")), step("show_wearout_failure_region", "wearout_failure_region", "show", "Der dritte Bereich beschreibt die Ermüdungsausfälle")],
    brief: { archetype: "Ausgerichteter Dreizonen-Funktionsplot", takeaway: "Jeder Bereich der Badewannenkurve besitzt eigene Ursachen, Gegenmaßnahmen und Risikobedeutungen.", animation: "Mathtext-Definition und bedingtes Risiko; Kurve; anschließend je Bereich eine vollständige Ursachen-Maßnahmen-Gruppe." },
  };
}

function renderSlide37(scene) {
  return renderBathtubCurveSlide(scene, 37);
}

function renderSlide38(scene) {
  const plot = plotAsset(38, "human_hazard.svg", 100, 246, 1720, 574, "human_hazard_plot");
  const early = animGroup("human_hazard_early_phase", "Frühe Sterberate", `<rect x="98" y="832" width="520" height="116" fill="${C.failureSoft}" stroke="${C.failure}" stroke-width="1.5"/>${textLines({ x: 130, y: 875, lines: ["FRÜHE PHASE · RATE FÄLLT LEICHT"], size: 18, weight: 840, fill: C.failure })}${textLines({ x: 130, y: 909, lines: ["Einfluss der Kindersterblichkeit"], size: 18, weight: 700, fill: C.deep })}`);
  const constant = animGroup("human_hazard_constant_phase", "Nahezu konstante Sterberate", `<rect x="618" y="832" width="684" height="116" fill="${C.surfaceSoft}" stroke="${C.cyan}" stroke-width="1.5"/>${textLines({ x: 650, y: 875, lines: ["LANGE MITTLERE PHASE · NAHEZU KONSTANT"], size: 18, weight: 840, fill: C.cyan })}${textLines({ x: 650, y: 909, lines: ["Plötzliche Ereignisse, beispielsweise Unfälle"], size: 18, weight: 700, fill: C.deep })}`);
  const ageing = animGroup("human_hazard_ageing_phase", "Altersbedingter Anstieg", `<rect x="1302" y="832" width="520" height="116" fill="${C.secondarySoft}" stroke="${C.secondary}" stroke-width="1.5"/>${textLines({ x: 1334, y: 875, lines: ["HOHES ALTER · DEUTLICHER ANSTIEG"], size: 18, weight: 840, fill: C.secondary })}${textLines({ x: 1334, y: 909, lines: ["Erkrankungen · Verschleiß", "nachlassende physiologische Systeme"], size: 18, weight: 700, fill: C.deep, lineHeight: 1.25 })}`);
  const curvesTrigger = "Am Beispiel der Sterblichkeitsraten von Männern und Frauen lässt sich ebenfalls ein Verlauf erkennen";
  return {
    svg: frame(scene, `${reliabilityFunctionRail("hazard")}${plot}${early}${constant}${ageing}`, { title: "Ausfallrate des Menschen", takeaway: "Die menschliche Sterberate ähnelt einer Badewannenkurve aus früher, konstanter und altersbedingt steigender Phase.", archetype: "comparison-chart-with-phases", layoutIntent: "full-width-direct-labeled-human-hazard-with-aligned-life-phases", density: "dense", designException: "Zwei Datenreihen und drei entlang der Lebensachse ausgerichtete Phasen bilden die vollständige Interpretation." }),
    targets: [target("men_hazard", "Ausfallrate Männer"), target("women_hazard", "Ausfallrate Frauen"), target("human_hazard_early_span", "Hintergrund der frühen Phase"), target("human_hazard_early_label", "Beschriftung der frühen Phase"), target("human_hazard_early_phase", "Frühe Phase"), target("human_hazard_constant_span", "Hintergrund der konstanten Phase"), target("human_hazard_constant_label", "Beschriftung der konstanten Phase"), target("human_hazard_constant_phase", "Konstante Phase"), target("human_hazard_ageing_span", "Hintergrund der altersbedingten Phase"), target("human_hazard_ageing_label", "Beschriftung der altersbedingten Phase"), target("human_hazard_ageing_phase", "Altersanstieg")],
    steps: [step("draw_men_hazard", "men_hazard", "draw", curvesTrigger), step("draw_women_hazard", "women_hazard", "draw", curvesTrigger), step("show_human_hazard_early_span", "human_hazard_early_span", "show", "Zu Beginn fällt die Sterberate geringfügig ab"), step("show_human_hazard_early_label", "human_hazard_early_label", "show", "Zu Beginn fällt die Sterberate geringfügig ab"), step("show_human_hazard_early_phase", "human_hazard_early_phase", "show", "Zu Beginn fällt die Sterberate geringfügig ab"), step("show_human_hazard_constant_span", "human_hazard_constant_span", "show", "Anschließend bleibt die Sterberate für eine längere Phase nahezu konstant"), step("show_human_hazard_constant_label", "human_hazard_constant_label", "show", "Anschließend bleibt die Sterberate für eine längere Phase nahezu konstant"), step("show_human_hazard_constant_phase", "human_hazard_constant_phase", "show", "Anschließend bleibt die Sterberate für eine längere Phase nahezu konstant"), step("show_human_hazard_ageing_span", "human_hazard_ageing_span", "show", "Mit zunehmendem Alter steigt die Sterberate dann deutlich an"), step("show_human_hazard_ageing_label", "human_hazard_ageing_label", "show", "Mit zunehmendem Alter steigt die Sterberate dann deutlich an"), step("show_human_hazard_ageing_phase", "human_hazard_ageing_phase", "show", "Mit zunehmendem Alter steigt die Sterberate dann deutlich an")],
    brief: { archetype: "Direkt beschrifteter Vergleichsplot mit Phasenband", takeaway: "Auch menschliche Sterberaten zeigen einen badewannenähnlichen Verlauf.", animation: "Beide Kurven gemeinsam; danach drei vollständige, entlang der Lebensachse ausgerichtete Phasenerklärungen." },
  };
}

function renderSlide39(scene) {
  const meta = `${pictogram("database", { cx: 142, cy: 270, size: 36, color: C.deepSoft, background: C.surfaceSoft, radius: 30 })}${textLines({ x: 188, y: 266, lines: ["6-Gang-NKW-Getriebe · 2.115 Schadensereignisse · 82 Klassen"], size: 19, weight: 790, fill: C.deep })}${textLines({ x: 188, y: 295, lines: ["normierte Lebensdauer"], size: 18, weight: 660, fill: C.muted })}`;
  const plot = plotAsset(39, "nkw_hazard.svg", 98, 304, 1260, 526, "nkw_hazard_plot");
  const gearbox = animGroup("nkw_hazard_gearbox_image", "Generierte Illustration eines 6-Gang-NKW-Getriebes", croppedRasterPanel({ slideNumber: 39, filename: "nkw-6-speed-gearbox-cutaway-display.jpg", x: 1430, y: 310, width: 330, height: 185, sourceViewBox: "0 38 960 540", sourceWidth: 960, sourceHeight: 640, assetId: "nkw_hazard_gearbox_image_asset" }));
  const mechanism = animGroup("nkw_hazard_mechanism", "Verschleiß und Ermüdung", `${pictogram("wrenchAlert", { cx: 1438, cy: 570, size: 44, color: C.failure, background: C.failureSoft, radius: 37 })}${textLines({ x: 1492, y: 556, lines: ["VERSCHLEISS & ERMÜDUNG"], size: 18, weight: 840, fill: C.failure })}${textLines({ x: 1492, y: 590, lines: ["Ausfallrisiko steigt", "kontinuierlich über der Zeit"], size: 20, weight: 740, fill: C.deep, lineHeight: 1.3 })}`);
  const conclusion = animGroup("nkw_hazard_counterexample", "Kein typischer Badewannenverlauf", `<g opacity="0.7"><path d="M1435 682 C1460 754 1500 735 1545 735 C1590 735 1630 754 1660 682" fill="none" stroke="${C.muted}" stroke-width="4"/><line x1="1418" y1="765" x2="1680" y2="765" stroke="${C.muted}" stroke-width="2"/><line x1="1488" y1="678" x2="1605" y2="770" stroke="${C.failure}" stroke-width="5"/><line x1="1605" y1="678" x2="1488" y2="770" stroke="${C.failure}" stroke-width="5"/></g>${textLines({ x: 1548, y: 806, lines: ["KEIN TYPISCHER BADEWANNENVERLAUF"], size: 18, weight: 840, fill: C.secondary, anchor: "middle" })}<rect x="98" y="852" width="1724" height="82" rx="8" fill="${C.secondarySoft}" stroke="${C.secondary}" stroke-width="1.5"/>${pictogram("search", { cx: 150, cy: 893, size: 38, color: C.secondary, background: "#FFFFFF", radius: 32 })}${textLines({ x: 205, y: 902, lines: ["Nicht jedes Produkt besitzt alle drei Bereiche der Badewannenkurve."], size: 23, weight: 820, fill: C.deep })}`);
  return {
    svg: frame(scene, `${reliabilityFunctionRail("hazard")}${meta}${plot}${gearbox}${mechanism}${conclusion}`, { title: "Ausfallrate eines 6-Gang-NKW-Getriebes", takeaway: "Eine kontinuierlich steigende Ausfallrate weist auf Verschleiß und Ermüdung hin und muss keine Badewannenkurve bilden.", archetype: "counterexample-data-chart", layoutIntent: "dominant-increasing-hazard-with-recurring-generated-gearbox-illustration-and-explicit-not-bathtub-comparison", density: "dense", designException: "Datenplot, technischer Kontext, Ausfallmechanismus und Gegenbeispiel werden für die Schlussfolgerung gemeinsam benötigt." }),
    targets: [target("nkw_hazard_curve", "Steigende Ausfallrate"), target("nkw_hazard_gearbox_image", "Generierte Illustration des 6-Gang-NKW-Getriebes"), target("wearout_area", "Verschleißbereich"), target("nkw_hazard_mechanism", "Verschleiß und Ermüdung"), target("nkw_hazard_counterexample", "Gegenbeispiel zur Badewannenkurve")],
    steps: [step("draw_nkw_hazard_curve", "nkw_hazard_curve", "draw", "Hierbei steigt die Ausfallrate kontinuierlich über der Zeit an"), step("show_nkw_hazard_gearbox_image", "nkw_hazard_gearbox_image", "show", "Hierbei steigt die Ausfallrate kontinuierlich über der Zeit an"), step("show_wearout_area", "wearout_area", "show", "In unserem Beispiel sehen wir aufgrund der ansteigenden Ausfallrate"), step("show_nkw_hazard_mechanism", "nkw_hazard_mechanism", "show", "In unserem Beispiel sehen wir aufgrund der ansteigenden Ausfallrate"), step("show_nkw_hazard_counterexample", "nkw_hazard_counterexample", "show", "Der Verlauf der Ausfallrate eines Produktes muss also nicht immer zwangsläufig alle drei Bereiche")],
    brief: { archetype: "Datenplot als explizites Gegenbeispiel", takeaway: "Nicht jede Ausfallrate folgt der Badewannenkurve.", animation: "Steigende Kurve und wiederkehrende generierte technische Illustration des 6-Gang-NKW-Getriebes; vollständiger Verschleiß-/Ermüdungsmechanismus; abschließend durchgestrichener Badewannenvergleich und Schlussfolgerung." },
  };
}

function renderSlide40(scene) {
  const measures = animGroup("location_measures_overview", "Mittelwert, Median und Modalwert", `
    <line x1="330" y1="570" x2="1590" y2="570" stroke="${C.border}" stroke-width="4"/>
    <circle cx="400" cy="570" r="12" fill="${C.secondary}"/><circle cx="960" cy="570" r="12" fill="${C.success}"/><circle cx="1520" cy="570" r="12" fill="${C.accent}"/>
    ${pictogram("target", { cx: 400, cy: 410, size: 72, color: C.secondary, background: C.secondarySoft, radius: 58 })}
    ${pictogram("layers", { cx: 960, cy: 410, size: 72, color: C.success, background: C.successSoft, radius: 58 })}
    ${pictogram("search", { cx: 1520, cy: 410, size: 72, color: C.accent, background: C.accentSoft, radius: 58 })}
    ${textLines({ x: 400, y: 700, lines: ["MITTELWERT"], size: 30, weight: 840, fill: C.secondary, anchor: "middle" })}
    ${textLines({ x: 400, y: 754, lines: ["arithmetischer Schwerpunkt"], size: 24, weight: 700, fill: C.deep, anchor: "middle" })}
    ${textLines({ x: 960, y: 700, lines: ["MEDIAN"], size: 30, weight: 840, fill: C.success, anchor: "middle" })}
    ${textLines({ x: 960, y: 754, lines: ["teilt die Daten in zwei Hälften"], size: 24, weight: 700, fill: C.deep, anchor: "middle" })}
    ${textLines({ x: 1520, y: 700, lines: ["MODALWERT"], size: 30, weight: 840, fill: C.accent, anchor: "middle" })}
    ${textLines({ x: 1520, y: 754, lines: ["häufigste Ausfallzeit"], size: 24, weight: 700, fill: C.deep, anchor: "middle" })}
  `);
  return {
    svg: frame(scene, measures, { title: "Statistische Maßzahlen: drei Lageparameter", takeaway: "Mittelwert, Median und Modalwert beschreiben die Lage derselben Ausfalldaten aus unterschiedlichen Perspektiven.", archetype: "three-measure-concept-line", layoutIntent: "single-open-concept-line-with-three-equal-location-measures" }),
    targets: [target("location_measures_overview", "Mittelwert, Median und Modalwert")],
    steps: [step("show_location_measures_overview", "location_measures_overview", "show", "den Mittelwert, den Median und den Modalwert")],
    brief: { archetype: "Offene Dreier-Systematik", takeaway: "Die drei Lageparameter werden gleichrangig angekündigt, ohne die folgenden Erklärungen vorwegzunehmen.", animation: "Alle drei Maßzahlen erscheinen als eine gekoppelte Gruppe zur gemeinsamen Nennung im Sprechertext." },
  };
}

function renderSlide41(scene) {
  const definition = `${label(104, 244, "Lageparameter", C.secondary)}${textLines({ x: 104, y: 300, lines: ["Arithmetischer Schwerpunkt", "der Ausfallzeiten"], size: 32, weight: 820, fill: C.deep, lineHeight: 1.24 })}`;
  const formula = animGroup("mean_formula", "Berechnung des arithmetischen Mittelwerts", `${card(890, 210, 932, 190, { fill: C.surface, stroke: C.secondary })}${label(930, 250, "Berechnung: Summe ÷ Anzahl", C.secondary)}${formulaAsset(41, "mean.svg", 930, 272, 840, 100, "mean_formula_asset")}`);
  const plot = plotAsset(41, "mean_balance.svg", 98, 410, 1724, 510, "mean_balance_plot");
  return {
    svg: frame(scene, `${definition}${formula}${plot}`, { title: "Mittelwert", takeaway: "Der Mittelwert ist der Schwerpunkt der Ausfallzeiten und reagiert empfindlich auf Ausreißer.", archetype: "formula-and-centroid-plot", layoutIntent: "compact-formula-zone-with-dominant-animated-mass-point-centroid-plot" }),
    targets: [target("mean_formula", "Formel des arithmetischen Mittelwerts"), target("mass_points", "Ausfallzeiten als Massenpunkte"), target("mean_centroid", "Mittelwert als Schwerpunkt"), target("outlier_effect", "Ausreißereinfluss auf den Mittelwert")],
    steps: [
      step("show_mean_formula", "mean_formula", "show", "Dabei wird einfach die Summe aller Ausfallzeiten durch die Anzahl der Ausfälle geteilt"),
      step("show_mass_points", "mass_points", "show", "Stellt euch hierzu die Ausfallzeiten als Massenpunkte vor"),
      step("show_mean_centroid", "mean_centroid", "show", "Der Mittelwert entspricht dann genau dem Schwerpunkt dieser Punkte"),
      step("show_outlier_effect", "outlier_effect", "show", "dass der Mittelwert sehr empfindlich auf Ausreißer reagiert"),
    ],
    brief: { archetype: "Formel plus Vorher-Nachher-Schwerpunktmodell", takeaway: "Der Ausreißer verschiebt den Schwerpunkt derselben Ausfallzeiten sichtbar.", animation: "Formel; obere Ausfallzeitreihe; Schwerpunkt; vollständige Vergleichsreihe mit Ausreißer und verschobenem Schwerpunkt." },
  };
}

function renderSlide42(scene) {
  const definition = `${label(104, 242, "50-Prozent-Zeitpunkt", C.success)}${textLines({ x: 104, y: 292, lines: ["Zwei gleich große Hälften:", "eine früher, eine später."], size: 29, weight: 760, fill: C.deep, lineHeight: 1.32 })}`;
  const formula = animGroup("median_formula", "Median über die Ausfallwahrscheinlichkeit", `${card(98, 420, 450, 150, { fill: C.surface, stroke: C.success })}${formulaAsset(42, "median.svg", 145, 448, 356, 94, "median_formula_asset")}`);
  const robust = animGroup("median_robustness", "Robustheit des Medians gegenüber Ausreißern", `${card(98, 662, 450, 204, { fill: C.successSoft, stroke: C.success, shadow: false })}${pictogram("shieldCheck", { cx: 155, cy: 724, size: 44, color: C.success, background: "#FFFFFF", radius: 36 })}${textLines({ x: 212, y: 713, lines: ["ROBUST GEGENÜBER"], size: 18, weight: 840, fill: C.success })}${textLines({ x: 212, y: 750, lines: ["Ausreißern"], size: 28, weight: 820, fill: C.deep })}${textLines({ x: 132, y: 810, lines: ["Extrem kurze oder lange Ausfallzeiten", "verschieben den Median nicht."], size: 20, weight: 690, fill: C.deepSoft, lineHeight: 1.3 })}`);
  const plot = plotAsset(42, "median_split.svg", 585, 224, 1235, 642, "median_split_plot");
  return {
    svg: frame(scene, `${definition}${formula}${robust}${plot}`, { title: "Median", takeaway: "Der Median liegt bei 50 Prozent Ausfallwahrscheinlichkeit, halbiert die Dichtefläche und bleibt robust gegenüber Ausreißern.", archetype: "formula-and-equal-area-plot", layoutIntent: "compact-definition-formula-and-robustness-with-dominant-equal-area-density" }),
    targets: [target("median_formula", "Medianformel"), target("median_equal_halves", "Zwei gleiche Flächenhälften"), target("median_robustness", "Robustheit gegenüber Ausreißern")],
    steps: [
      step("show_median_formula", "median_formula", "show", "entspricht dem Zeitpunkt, zu dem fünfzig Prozent der Bauteile ausgefallen sind"),
      step("show_median_equal_halves", "median_equal_halves", "show", "teilt der Median die Fläche unter dieser Kurve in zwei exakt gleiche Hälften"),
      step("show_median_robustness", "median_robustness", "show", "Robustheit gegenüber Ausreißern"),
    ],
    brief: { archetype: "50-Prozent-Formel und Flächenteilung", takeaway: "Formel, Flächenteilung und Robustheit ergeben ein geschlossenes Medianbild.", animation: "Formel; beide Flächenhälften mit Medianlinie und Labels als eine Gruppe; vollständiger Robustheitsblock." },
  };
}

function renderSlide43(scene) {
  const definition = `${label(104, 246, "Häufigste Ausfallzeit", C.accent)}${textLines({ x: 104, y: 302, lines: ["Der Modalwert liegt dort,", "wo die Verteilung ihr", "Maximum erreicht."], size: 31, weight: 780, fill: C.deep, lineHeight: 1.32 })}`;
  const formula = animGroup("mode_formula", "Bedingung für den Modalwert", `${card(98, 500, 440, 178, { fill: C.surface, stroke: C.accent })}${label(132, 544, "Erste Ableitung", C.accent)}${formulaAsset(43, "mode.svg", 158, 566, 320, 82, "mode_formula_asset")}`);
  const plot = plotAsset(43, "mode_peak.svg", 585, 232, 1235, 630, "mode_peak_plot");
  return {
    svg: frame(scene, `${definition}${formula}${plot}`, { title: "Modalwert", takeaway: "Der Modalwert ist die häufigste Ausfallzeit und liegt am Maximum der Dichtefunktion.", archetype: "definition-derivative-and-peak", layoutIntent: "short-definition-and-formula-with-dominant-density-maximum" }),
    targets: [target("mode_formula", "Ableitungsbedingung des Modalwerts"), target("mode_peak", "Maximum der Dichtefunktion")],
    steps: [
      step("show_mode_formula", "mode_formula", "show", "indem man die erste Ableitung der Dichtefunktion auf Null setzt"),
      step("show_mode_peak", "mode_peak", "show", "Punkt, an dem die Dichtefunktion ihr Maximum erreicht"),
    ],
    brief: { archetype: "Kurze Definition plus Maximum", takeaway: "Die Ableitungsbedingung wird unmittelbar mit dem Kurvenmaximum verknüpft.", animation: "Formel; anschließend Peaklinie, Punkt und Label als vollständige Gruppe." },
  };
}

function renderSlide44(scene) {
  const plot = plotAsset(44, "right_skew_compare.svg", 92, 220, 1270, 680, "right_skew_compare_plot");
  const conclusion = animGroup("skew_measure_conclusion", "Einordnung für Ausfalldaten", `${card(1400, 270, 420, 520, { fill: C.surface, stroke: C.border })}${pictogram("search", { cx: 1464, cy: 342, size: 48, color: C.accent, background: C.accentSoft, radius: 40 })}${textLines({ x: 1506, y: 332, lines: ["RECHTSSCHIEFE VERTEILUNG", "VON AUSFALLDATEN"], size: 18, weight: 840, fill: C.accent, lineHeight: 1.25 })}<line x1="1435" y1="398" x2="1785" y2="398" stroke="${C.border}" stroke-width="2"/>${textLines({ x: 1438, y: 448, lines: ["Mittelwert"], size: 24, weight: 820, fill: C.secondary })}${textLines({ x: 1438, y: 482, lines: ["wird durch Ausreißer", "nach rechts gezogen"], size: 20, weight: 680, fill: C.deep, lineHeight: 1.28 })}${textLines({ x: 1438, y: 572, lines: ["Nur bei Normalverteilung"], size: 19, weight: 820, fill: C.muted })}${textLines({ x: 1438, y: 606, lines: ["liegen je 50 % links und", "rechts vom Mittelwert."], size: 20, weight: 680, fill: C.deep, lineHeight: 1.28 })}<rect x="1434" y="680" width="352" height="78" rx="8" fill="${C.successSoft}" stroke="${C.success}" stroke-width="1.5"/>${pictogram("shieldCheck", { cx: 1476, cy: 719, size: 36, color: C.success })}${textLines({ x: 1520, y: 728, lines: ["Median bevorzugen"], size: 24, weight: 840, fill: C.success })}`);
  return {
    svg: frame(scene, `${plot}${conclusion}`, { title: "Mittelwert, Median und Modalwert im Vergleich", takeaway: "Bei rechtsschiefen Ausfalldaten gilt t_modal < t_Median < t_m; der Median ist robuster als der Mittelwert.", archetype: "sequential-measure-comparison", layoutIntent: "dominant-right-skew-plot-with-sequential-markers-and-compact-engineering-conclusion" }),
    targets: [target("skew_distribution_curve", "Rechtsschiefe Verteilung"), target("mode_marker", "Modalwert"), target("median_marker", "Median"), target("mean_marker", "Mittelwert"), target("skew_measure_conclusion", "Einordnung für Ausfalldaten")],
    steps: [
      step("draw_skew_distribution_curve", "skew_distribution_curve", "draw", "anhand der hier gezeigten rechtsschiefen Verteilung"),
      step("show_mode_marker", "mode_marker", "show", "Der Modalwert befindet sich am Maximum der Dichtefunktion"),
      step("show_median_marker", "median_marker", "show", "Rechts davon liegt der Median"),
      step("show_mean_marker", "mean_marker", "show", "Noch weiter rechts, in einem Bereich, der von Ausreißern beeinflusst wird, finden wir den Mittelwert"),
      step("show_skew_measure_conclusion", "skew_measure_conclusion", "show", "Da Ausfalldaten in der Regel nicht normalverteilt sind"),
    ],
    brief: { archetype: "Sequenzieller Vergleich auf einer gemeinsamen Verteilung", takeaway: "Die Reihenfolge der drei Lageparameter und die Robustheit des Medians werden direkt sichtbar.", animation: "Kurve; anschließend jeder Marker vollständig mit Linie, Punkt und Label; abschließend fachliche Einordnung." },
  };
}

function renderSlide45(scene) {
  const metricRow = (y, index, abbreviation, fullName, detail, color, abbreviationSize = 38) => `<circle cx="250" cy="${y}" r="34" fill="${color}" opacity="0.14"/><text x="250" y="${y + 9}" text-anchor="middle" font-family="Archivo, Arial, Helvetica, sans-serif" font-size="24" font-weight="800" fill="${color}">${index}</text>${textLines({ x: 330, y: y + 12, lines: [abbreviation], size: abbreviationSize, weight: 860, fill: color })}${textLines({ x: 650, y: y + 8, lines: [fullName], size: 28, weight: 760, fill: C.deep })}${textLines({ x: 1260, y: y + 8, lines: [detail], size: 22, weight: 680, fill: C.deepSoft })}`;
  const averages = animGroup("time_average_metrics", "MTTF und MTBF", `${metricRow(314, "01", "MTTF", "Mean Time To Failure", "mittlere Lebensdauer", C.secondary)}<line x1="220" y1="383" x2="1700" y2="383" stroke="${C.border}" stroke-width="2"/>${metricRow(454, "02", "MTBF", "Mean Time Between Failure", "mittlerer Ausfallabstand", C.secondary)}`);
  const requirements = animGroup("probability_requirement_metrics", "ppm und Bq-Lebensdauer", `<line x1="220" y1="523" x2="1700" y2="523" stroke="${C.border}" stroke-width="2"/>${metricRow(594, "03", "ppm", "Parts per Million", "zulässiger Ausfallanteil", C.accent)}<line x1="220" y1="663" x2="1700" y2="663" stroke="${C.border}" stroke-width="2"/>${metricRow(734, "04", "Bq-Lebensdauer", "Ausfallwahrscheinlichkeit bei Lebensdauer", "Zuverlässigkeitsanforderungen", C.success, 32)}`);
  return {
    svg: frame(scene, `${averages}${requirements}`, { title: "Weitere Zuverlässigkeitskennzahlen", takeaway: "Als Nächstes folgen MTTF, MTBF, ppm und Bq-Lebensdauer.", archetype: "four-item-metric-preview", layoutIntent: "single-quiet-source-near-list-of-four-upcoming-metrics" }),
    targets: [target("time_average_metrics", "MTTF und MTBF"), target("probability_requirement_metrics", "ppm und Bq-Lebensdauer")],
    steps: [
      step("show_time_average_metrics", "time_average_metrics", "show", "Zunächst betrachten wir die Mean Time To Failure und den Mean Time Between Failure"),
      step("show_probability_requirement_metrics", "probability_requirement_metrics", "show", "Anschließend werden wir die Kennzahlen Parts Per Million, kurz P-P-M, und die B-Q-Lebensdauer betrachten"),
    ],
    brief: { archetype: "Ruhige Vorschau auf vier Kennzahlen", takeaway: "Die Szene kündigt die vier folgenden Kennzahlen an, ohne eine Abhängigkeit zwischen ihnen zu behaupten.", animation: "MTTF/MTBF gemeinsam entsprechend der ersten Sprecherpassage; danach ppm/Bq-Lebensdauer gemeinsam." },
  };
}

function renderSlide46(scene) {
  const definition = `${card(98, 205, 1724, 102, { fill: C.surface, stroke: C.border, shadow: false })}${pictogram("clock", { cx: 158, cy: 256, size: 46, color: C.secondary, background: C.secondarySoft, radius: 38 })}${richTextLine(220, 267, [{ text: "MTTF", fill: C.secondary, weight: 860 }, { text: " = mittlere Lebensdauer nicht reparierbarer Einheiten", fill: C.deep, weight: 760 }], { size: 31 })}`;
  const formula = animGroup("mttf_formula", "MTTF als Erwartungswert", `${card(98, 338, 760, 168, { fill: C.surface, stroke: C.secondary })}${label(132, 380, "Erwartungswert aus der Zuverlässigkeitsfunktion", C.secondary)}${integralExpression(140, 458, "MTTF = E(T) =", "∞", "0", "R(t) dt", 250)}`);
  const half = animGroup("mttf_half_probability", "50-Prozent-Einordnung bei Normalverteilung", `${card(900, 338, 922, 168, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${pictogram("percent", { cx: 958, cy: 422, size: 46, color: C.accent, background: "#FFFFFF", radius: 38 })}${textLines({ x: 1018, y: 390, lines: ["BEI NORMALVERTEILUNG"], size: 18, weight: 840, fill: C.accent })}${richTextLine(1018, 450, [{ text: "50 % ausgefallen", fill: C.failure, weight: 840 }, { text: "  |  ", fill: C.muted, weight: 700 }, { text: "50 % intakt", fill: C.success, weight: 840 }], { size: 28 })}`);
  const failurePositions = [662, 941, 1074, 1354];
  const failureIconHref = mediaDataUri(localMedia(46, "failed-industrial-system-pictogram.png"));
  const failureIconDefinition = `<defs><image id="slide46_failed_system_png" x="0" y="0" width="100" height="100" href="${failureIconHref}" preserveAspectRatio="xMidYMid meet"/></defs>`;
  const observations = animGroup("mttf_failure_observations", "Ausfallzeiten nicht reparierbarer Einheiten", `${failureIconDefinition}${textLines({ x: 132, y: 574, lines: ["BEOBACHTETE AUSFALLZEITPUNKTE"], size: 18, weight: 840, fill: C.failure })}<line x1="300" y1="632" x2="1628" y2="632" stroke="${C.border}" stroke-width="2"/>${failurePositions.map((x) => `<line x1="${x}" y1="610" x2="${x}" y2="646" stroke="${C.failure}" stroke-width="2" stroke-dasharray="5 5"/><use href="#slide46_failed_system_png" x="${x - 50}" y="522" data-source-media="true"/>`).join("")}`);
  const plot = plotAsset(46, "mttf.svg", 98, 620, 1724, 315, "mttf_plot");
  return {
    svg: frame(scene, `${definition}${formula}${half}${observations}${plot}`, { title: "MTTF – Mean Time To Failure", takeaway: "Die MTTF ist die mittlere Lebensdauer nicht reparierbarer Einheiten und entspricht dem Erwartungswert der Lebensdauer.", archetype: "definition-formula-and-failure-observation-plot", layoutIntent: "compact-definition-and-formula-over-recognizable-failure-observations-and-dominant-density-plot" }),
    targets: [target("mttf_failure_observations", "Ausfallzeiten nicht reparierbarer Einheiten"), target("mttf_formula", "MTTF-Formel"), target("mttf_density", "Dichtefunktion der Lebensdauer"), target("mttf_marker", "MTTF-Marker"), target("mttf_half_probability", "50-Prozent-Einordnung")],
    steps: [
      step("show_mttf_failure_observations", "mttf_failure_observations", "show", "Produkten, die nicht repariert werden können"),
      step("show_mttf_formula", "mttf_formula", "show", "Erwartungswert der Lebensdauer, der aus dem Integral der Zuverlässigkeitsfunktion über der Zeit berechnet wird"),
      step("draw_mttf_density", "mttf_density", "draw", "Näherungsweise kann dieser Wert auch durch den Mittelwert der Verteilung abgeschätzt werden"),
      step("show_mttf_marker", "mttf_marker", "show", "Der M-T-T-F repräsentiert somit die mittlere Lebensdauer"),
      step("show_mttf_half_probability", "mttf_half_probability", "show", "fünfzig Prozent Überlebens- beziehungsweise Ausfallwahrscheinlichkeit"),
    ],
    brief: { archetype: "MTTF aus Beobachtungen, Dichte und Erwartungswert", takeaway: "Die abstrakte Integralform wird mit konkreten Ausfallbeobachtungen und dem Mittelwertmarker verbunden.", animation: "Ausfallbeobachtungen; Formel; Dichtekurve; MTTF-Marker; 50-Prozent-Einordnung bei Normalverteilung." },
  };
}

function renderSlide47(scene) {
  const x0 = 252;
  const x1 = 650;
  const x2 = 1130;
  const x3 = 1568;
  const axis = `${card(98, 202, 1724, 112, { fill: C.surface, stroke: C.border, shadow: false })}${textLines({ x: 138, y: 250, lines: ["MTTFF · Mean Time To First Failure"], size: 25, weight: 820, fill: C.secondary })}${textLines({ x: 1010, y: 250, lines: ["MTBF · Mean Time Between Failure"], size: 25, weight: 820, fill: C.accent })}${textLines({ x: 138, y: 286, lines: ["mittlere Lebensdauer bis zum ersten Ausfall"], size: 19, weight: 680, fill: C.deepSoft })}${textLines({ x: 1010, y: 286, lines: ["mittlerer Ausfallabstand im reparierbaren System"], size: 19, weight: 680, fill: C.deepSoft })}<line x1="${x0}" y1="620" x2="1700" y2="620" stroke="${C.deep}" stroke-width="4" marker-end="url(#arrow_${C.deep.replace("#", "")})"/>${textLines({ x: 1704, y: 654, lines: ["Betriebszeit"], size: 21, weight: 720, fill: C.deep, anchor: "end" })}`;
  const failureIconHref = mediaDataUri(localMedia(47, "failed-industrial-system-pictogram.png"));
  const failureIconDefinition = `<defs><image id="slide47_failed_system_png" x="0" y="0" width="96" height="96" href="${failureIconHref}" preserveAspectRatio="xMidYMid meet"/></defs>`;
  const failureSymbol = (x, labelText) => `<line x1="${x}" y1="430" x2="${x}" y2="646" stroke="${C.deepSoft}" stroke-width="2.5" opacity="0.6"/><use href="#slide47_failed_system_png" x="${x - 48}" y="512" data-source-media="true"/>${pictogram("loop", { cx: x + 58, cy: 552, size: 32, color: C.success })}${textLines({ x, y: 682, lines: [labelText], size: 20, weight: 780, fill: C.failure, anchor: "middle" })}`;
  const interval = (left, right, y, caption, color) => `<line x1="${left}" y1="${y}" x2="${right}" y2="${y}" stroke="${color}" stroke-width="3" marker-start="url(#arrow_${color.replace("#", "")})" marker-end="url(#arrow_${color.replace("#", "")})"/>${textLines({ x: (left + right) / 2, y: y - 18, lines: [caption], size: 25, weight: 840, fill: color, anchor: "middle" })}`;
  const mtbf = animGroup("mtbf_intervals", "Ausfälle und MTBF-Intervalle", `${failureIconDefinition}${failureSymbol(x1, "1. Ausfall")}${failureSymbol(x2, "2. Ausfall")}${failureSymbol(x3, "3. Ausfall")}${interval(x1, x2, 456, "MTBF", C.accent)}${interval(x2, x3, 456, "MTBF", C.accent)}`);
  const mttff = animGroup("mttff_interval", "Zeit bis zum ersten Ausfall", `${interval(x0, x1, 390, "MTTFF", C.secondary)}<line x1="${x0}" y1="370" x2="${x0}" y2="642" stroke="${C.secondary}" stroke-width="2"/>`);
  const limitation = animGroup("mean_metric_limitation", "Grenze von Mittelwertkennzahlen", `${card(120, 756, 820, 150, { fill: C.failureSoft, stroke: C.failure, shadow: false })}${pictogram("shield", { cx: 180, cy: 831, size: 44, color: C.failure, background: "#FFFFFF", radius: 36 })}${textLines({ x: 238, y: 806, lines: ["NICHT ALS ZUVERLÄSSIGKEITSANFORDERUNG"], size: 18, weight: 840, fill: C.failure })}${textLines({ x: 238, y: 849, lines: ["Ein Mittelwert entspricht nur etwa", "50 % Erreichungswahrscheinlichkeit."], size: 22, weight: 720, fill: C.deep, lineHeight: 1.3 })}`);
  const alternative = animGroup("defined_probability_transition", "Übergang zu definierter Ausfallwahrscheinlichkeit", `${arrow(974, 830, 1080, 830, C.success, 4)}${card(1110, 756, 690, 150, { fill: C.successSoft, stroke: C.success, shadow: false })}${pictogram("target", { cx: 1170, cy: 831, size: 44, color: C.success, background: "#FFFFFF", radius: 36 })}${textLines({ x: 1228, y: 806, lines: ["BESSER: DEFINIERTE NIEDRIGE"], size: 18, weight: 840, fill: C.success })}${textLines({ x: 1228, y: 849, lines: ["Ausfallwahrscheinlichkeit", "bei festgelegter Lebensdauer"], size: 23, weight: 760, fill: C.deep, lineHeight: 1.3 })}`);
  return {
    svg: frame(scene, `${axis}${mtbf}${mttff}${limitation}${alternative}`, { title: "MTTFF und MTBF", takeaway: "MTTFF beschreibt die Zeit bis zum ersten Ausfall, MTBF die Abstände zwischen Ausfällen eines reparierbaren Systems.", archetype: "repairable-system-event-timeline", layoutIntent: "single-event-timeline-with-coupled-failures-repairs-and-interval-labels" }),
    targets: [target("mtbf_intervals", "MTBF-Intervalle"), target("mttff_interval", "MTTFF-Intervall"), target("mean_metric_limitation", "Grenze von Mittelwertkennzahlen"), target("defined_probability_transition", "Übergang zu definierter Ausfallwahrscheinlichkeit")],
    steps: [
      step("show_mtbf_intervals", "mtbf_intervals", "show", "mittleren Zeitraum zwischen zwei aufeinanderfolgenden Ausfällen in einem reparierbaren System"),
      step("show_mttff_interval", "mttff_interval", "show", "Der M-T-T-F-F ist die mittlere Lebensdauer bis zum ersten Ausfall"),
      step("show_mean_metric_limitation", "mean_metric_limitation", "show", "nicht als Zuverlässigkeitsanforderungen geeignet"),
      step("show_defined_probability_transition", "defined_probability_transition", "show", "für eine definierte niedrige Ausfallwahrscheinlichkeit festgelegt werden können"),
    ],
    brief: { archetype: "Ereigniszeitachse für reparierbare Systeme", takeaway: "MTTFF und MTBF werden an derselben Ereignisfolge unterschieden und anschließend als unzureichende Anforderungskennzahlen eingeordnet.", animation: "Ausfälle, Reparaturen und MTBF-Intervalle gekoppelt; MTTFF; Einschränkung; Übergang zur definierten Ausfallwahrscheinlichkeit." },
  };
}

function renderSlide48(scene) {
  const scaleRow = (y, term, value, equivalent, color) => `<circle cx="184" cy="${y}" r="8" fill="${color}"/>${textLines({ x: 230, y: y + 10, lines: [term], size: 30, weight: 840, fill: color })}${textLines({ x: 770, y: y + 10, lines: [value], size: 35, weight: 860, fill: color, anchor: "middle" })}${textLines({ x: 1280, y: y + 10, lines: [equivalent], size: 29, weight: 760, fill: C.deep, anchor: "middle" })}`;
  const scales = animGroup("ppm_scale_comparison", "Prozent, Promille und ppm", `${card(104, 224, 1712, 474, { fill: C.surface, stroke: C.border })}${textLines({ x: 230, y: 280, lines: ["KENNZAHL"], size: 18, weight: 840, fill: C.muted })}${textLines({ x: 770, y: 280, lines: ["ANGABE"], size: 18, weight: 840, fill: C.muted, anchor: "middle" })}${textLines({ x: 1280, y: 280, lines: ["ENTSPRICHT"], size: 18, weight: 840, fill: C.muted, anchor: "middle" })}<line x1="142" y1="306" x2="1778" y2="306" stroke="${C.border}" stroke-width="2"/>${scaleRow(360, "Prozent", "1 %", "1 von 100", C.secondary)}<line x1="142" y1="424" x2="1778" y2="424" stroke="${C.border}" stroke-width="1.5"/>${scaleRow(492, "Promille", "1 ‰", "1 von 1.000", C.success)}<line x1="142" y1="556" x2="1778" y2="556" stroke="${C.border}" stroke-width="1.5"/>${scaleRow(624, "ppm", "1 ppm", "1 von 1.000.000", C.accent)}`);
  const reference = animGroup("ppm_lifetime_reference", "ppm benötigt eine Bezugslebensdauer", `${card(104, 748, 1180, 154, { fill: C.failureSoft, stroke: C.failure, shadow: false })}${pictogram("clock", { cx: 172, cy: 825, size: 48, color: C.failure, background: "#FFFFFF", radius: 39 })}${textLines({ x: 236, y: 798, lines: ["AUSFALLWAHRSCHEINLICHKEIT ALLEIN REICHT NICHT"], size: 18, weight: 840, fill: C.failure })}${textLines({ x: 236, y: 846, lines: ["ppm immer mit Zeitpunkt, Lebensdauer", "oder Laufleistung angeben"], size: 25, weight: 760, fill: C.deep, lineHeight: 1.28 })}`);
  const transition = animGroup("ppm_to_bq_transition", "Übergang zur Bq-Lebensdauer", `${arrow(1318, 825, 1418, 825, C.success, 4)}${card(1448, 748, 368, 154, { fill: C.successSoft, stroke: C.success, shadow: false })}${textLines({ x: 1632, y: 803, lines: ["DIE KOPPLUNG"], size: 18, weight: 840, fill: C.success, anchor: "middle" })}${textLines({ x: 1632, y: 850, lines: ["leistet die", "Bq-Lebensdauer"], size: 25, weight: 820, fill: C.deep, anchor: "middle", lineHeight: 1.22 })}`);
  return {
    svg: frame(scene, `${scales}${reference}${transition}`, { title: "Parts per Million (ppm)", takeaway: "Prozent, Promille und ppm beschreiben Ausfallanteile; eine ppm-Angabe ist erst mit einer Bezugslebensdauer vollständig.", archetype: "three-level-proportion-scale", layoutIntent: "single-aligned-scale-comparison-with-explicit-lifetime-coupling" }),
    targets: [target("ppm_scale_comparison", "Prozent, Promille und ppm"), target("ppm_lifetime_reference", "Kopplung an Lebensdauer"), target("ppm_to_bq_transition", "Übergang zur Bq-Lebensdauer")],
    steps: [
      step("show_ppm_scale_comparison", "ppm_scale_comparison", "show", "in Prozent, Promille oder Parts Per Million"),
      step("show_ppm_lifetime_reference", "ppm_lifetime_reference", "show", "nur sinnvoll, wenn sie für eine Lebensdauer wie eine bestimmte Anzahl an Betriebsstunden oder eine Laufleistung definiert wird"),
      step("show_ppm_to_bq_transition", "ppm_to_bq_transition", "show", "Genau hierfür ist die B-Q-Lebensdauer geeignet"),
    ],
    brief: { archetype: "Reduzierte Anteilsskala", takeaway: "Jede Kennzahl wird einmal als Angabe und einmal als leicht lesbares Verhältnis gezeigt; die notwendige Bezugslebensdauer bleibt explizit.", animation: "Alle Skalen gemeinsam; Bezugslebensdauer; Übergang zur Bq-Lebensdauer." },
  };
}

function renderSlide49(scene) {
  const plot = plotAsset(49, "bq_life.svg", 86, 220, 1270, 680, "bq_life_plot");
  const qDefinition = animGroup("bq_q_definition", "Bedeutung von q", `${card(1400, 236, 420, 210, { fill: C.surface, stroke: C.accent })}${pictogram("percent", { cx: 1460, cy: 305, size: 48, color: C.accent, background: C.accentSoft, radius: 40 })}${textLines({ x: 1522, y: 294, lines: ["q"], size: 42, weight: 860, fill: C.accent })}${textLines({ x: 1522, y: 335, lines: ["Ausfallwahrscheinlichkeit", "in Prozent"], size: 21, weight: 740, fill: C.deep, lineHeight: 1.3 })}${textLines({ x: 1438, y: 405, lines: ["Bq verknüpft q mit einer Laufleistung."], size: 19, weight: 720, fill: C.deepSoft })}`);
  const conclusion = animGroup("bq_requirement_conclusion", "Bq als Zuverlässigkeitsanforderung", `${card(1400, 500, 420, 344, { fill: C.successSoft, stroke: C.success, shadow: false })}${pictogram("shieldCheck", { cx: 1464, cy: 574, size: 52, color: C.success, background: "#FFFFFF", radius: 42 })}${textLines({ x: 1526, y: 562, lines: ["PRÄZISE ANFORDERUNG"], size: 18, weight: 840, fill: C.success })}${textLines({ x: 1438, y: 650, lines: ["Lebensdauer"], size: 27, weight: 820, fill: C.deep })}${textLines({ x: 1438, y: 692, lines: ["+"], size: 25, weight: 820, fill: C.muted })}${textLines({ x: 1438, y: 726, lines: ["zulässige", "Ausfallwahrscheinlichkeit"], size: 22, weight: 760, fill: C.deep, lineHeight: 1.2 })}${textLines({ x: 1438, y: 804, lines: ["festlegen und überprüfen"], size: 20, weight: 820, fill: C.success })}`);
  return {
    svg: frame(scene, `${plot}${qDefinition}${conclusion}`, { title: "Bq-Lebensdauer", takeaway: "Die Bq-Lebensdauer ordnet einer definierten Ausfallwahrscheinlichkeit eine konkrete Laufleistung zu.", archetype: "cdf-quantile-requirement-plot", layoutIntent: "dominant-bq-distribution-with-coupled-example-markers-and-compact-requirement-definition" }),
    targets: [target("bq_distribution", "Verteilungskurve"), target("bq_q_definition", "Bedeutung von q"), target("b5_example", "B5-Beispiel"), target("other_bq_markers", "Weitere Bq-Lebensdauern"), target("bq_requirement_conclusion", "Bq als Zuverlässigkeitsanforderung")],
    steps: [
      step("draw_bq_distribution", "bq_distribution", "draw", "ordnet einer bestimmten Lebensdauer eine definierte Ausfallwahrscheinlichkeit zu"),
      step("show_bq_q_definition", "bq_q_definition", "show", "Dabei steht das Q für die Ausfallwahrscheinlichkeit in Prozent"),
      step("show_b5_example", "b5_example", "show", "Zum Beispiel bedeutet eine B-fünf-Lebensdauer von einhunderttausend Kilometern"),
      step("show_other_bq_markers", "other_bq_markers", "show", "flexibel für verschiedene Lebensdauern"),
      step("show_bq_requirement_conclusion", "bq_requirement_conclusion", "show", "präzise Methode zur Festlegung und Überprüfung von Zuverlässigkeitsanforderungen"),
    ],
    brief: { archetype: "Bq-Quantildiagramm als Anforderung", takeaway: "B5 und weitere Bq-Werte verbinden Ausfallwahrscheinlichkeit und Laufleistung eindeutig.", animation: "Verteilungskurve; q-Definition; vollständiges B5-Beispiel einschließlich 5/95-Aufteilung; weitere Bq-Marker; Anwendungsnutzen." },
  };
}

function lifecyclePhaseBand(x, y, width, activePhase) {
  const phases = [
    { key: "early", label: "Frühausfälle" },
    { key: "random", label: "Zufallsausfälle" },
    { key: "wear", label: "Verschleiß / Ermüdung" },
  ];
  const gap = 8;
  const segmentWidth = (width - gap * 2) / 3;
  return phases.map((phase, index) => {
    const active = phase.key === activePhase;
    const phaseX = x + index * (segmentWidth + gap);
    const fill = active ? (activePhase === "wear" ? C.failureSoft : C.accentSoft) : C.surfaceSoft;
    const stroke = active ? (activePhase === "wear" ? C.failure : C.accent) : C.border;
    const textColor = active ? stroke : C.muted;
    return `<rect x="${phaseX}" y="${y}" width="${segmentWidth}" height="54" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="${active ? 2.2 : 1.2}"/>${textLines({ x: phaseX + segmentWidth / 2, y: y + 34, lines: [phase.label], size: 18, weight: active ? 840 : 700, fill: textColor, anchor: "middle" })}`;
  }).join("");
}

function applicationItem(kind, x, y, text, color, background) {
  return `<line x1="${x - 14}" y1="${y}" x2="${x + 16}" y2="${y}" stroke="${color}" stroke-width="4" stroke-linecap="round"/>${textLines({ x: x + 42, y: y + 8, lines: [text], size: 21, weight: 760, fill: C.deep })}`;
}

function formulaRow(slideNumber, id, y, labelText, formulaFile, formulaWidth, sourceLabel) {
  const content = `${textLines({ x: 142, y: y + 66, lines: [labelText], size: 24, weight: 790, fill: C.deep })}${formulaAsset(slideNumber, formulaFile, 610, y + 18, formulaWidth, 78, `${id}_formula`)}`;
  return animGroup(id, sourceLabel, content);
}

function integralExpression(x, y, prefix, upper, lower, integrand, prefixWidth = 150) {
  const integralX = x + prefixWidth;
  return `<g data-qc-role="formula" data-qc-allow-overlap="true"><text x="${x}" y="${y}" font-size="32" font-weight="720" fill="${C.deep}">${esc(prefix)}</text><text x="${integralX}" y="${y + 10}" font-size="62" font-weight="520" fill="${C.deep}">∫</text><text x="${integralX + 42}" y="${y - 25}" font-size="18" font-weight="760" fill="${C.deep}">${esc(upper)}</text><text x="${integralX + 42}" y="${y + 30}" font-size="18" font-weight="760" fill="${C.deep}">${esc(lower)}</text><text x="${integralX + 72}" y="${y}" font-size="32" font-weight="720" fill="${C.deep}">${esc(integrand)}</text></g>`;
}

function renderSlide50(scene) {
  const plot = plotAsset(50, "normal_density.svg", 560, 204, 1270, 672, "normal_density_plot");
  const mu = animGroup("normal_mu_meaning", "Erwartungswert mü als Lageparameter", `${pictogram("target", { cx: 138, cy: 308, size: 42, color: C.accent, background: C.accentSoft, radius: 36 })}${textLines({ x: 198, y: 298, lines: ["μ  ·  LAGE"], size: 20, weight: 850, fill: C.accent })}${textLines({ x: 198, y: 340, lines: ["verschiebt die Kurve", "auf der Lebensdauerachse"], size: 24, weight: 720, fill: C.deep, lineHeight: 1.32 })}`);
  const sigma = animGroup("normal_sigma_meaning", "Standardabweichung als Streuparameter", `${pictogram("layers", { cx: 138, cy: 466, size: 42, color: C.secondary, background: C.secondarySoft, radius: 36 })}${textLines({ x: 198, y: 456, lines: ["σ  ·  STREUUNG"], size: 20, weight: 850, fill: C.secondary })}${textLines({ x: 198, y: 498, lines: ["kleineres σ:"], size: 23, weight: 780, fill: C.deep })}${textLines({ x: 198, y: 532, lines: ["schmaler und höher"], size: 23, weight: 720, fill: C.deepSoft })}`);
  const properties = animGroup("normal_symmetry_properties", "Symmetrie und Lagewerte", `${card(84, 592, 430, 176, { fill: C.surface, stroke: C.border, shadow: false })}${textLines({ x: 116, y: 630, lines: ["SYMMETRISCHE GLOCKENFORM"], size: 18, weight: 850, fill: C.success })}${textLines({ x: 116, y: 676, lines: ["μ = Median = Modalwert"], size: 25, weight: 790, fill: C.deep })}${textLines({ x: 116, y: 710, lines: ["bei 50 %"], size: 19, weight: 760, fill: C.success })}${textLines({ x: 116, y: 744, lines: ["theoretisch in beide Richtungen unbegrenzt"], size: 18, weight: 690, fill: C.muted })}`);
  const applications = animGroup("normal_application_fields", "Typische Anwendungen", `${applicationItem("flask", 122, 804, "Naturwissenschaften", C.accent, C.accentSoft)}${applicationItem("database", 122, 866, "Finanzwesen", C.secondary, C.secondarySoft)}${applicationItem("shieldCheck", 122, 928, "Medizin", C.success, C.successSoft)}`);
  return {
    svg: frame(scene, `${plot}${mu}${sigma}${properties}${applications}`, { title: "Die Normalverteilung", takeaway: "Der Erwartungswert legt die Lage fest, die Standardabweichung die Streuung der symmetrischen Glockenkurve.", archetype: "distribution-introduction", layoutIntent: "dominant-normal-density-plot-with-compact-parameter-and-application-context", density: "dense", designException: "Der dominante Mehrkurvenplot benötigt gemeinsam mit Parameterbedeutung, Eigenschaften und Anwendungsfeldern eine fachlich vollständige Einführungsfolie." }),
    targets: [target("normal_density_curves", "Dichtekurven der Normalverteilung"), target("normal_mean_marker", "Lageparameter mü"), target("normal_mu_meaning", "Bedeutung von mü"), target("normal_sigma_meaning", "Bedeutung von sigma"), target("normal_symmetry_properties", "Symmetrie und Lagewerte"), target("normal_application_fields", "Typische Anwendungen")],
    steps: [
      step("draw_normal_density_curves", "normal_density_curves", "draw", "Wir starten mit der hier abgebildeten Normalverteilung, welche als Dichtefunktion dargestellt ist"),
      step("show_normal_mean_marker", "normal_mean_marker", "show", "Zum einen durch den Erwartungswert mü"),
      step("show_normal_mu_meaning", "normal_mu_meaning", "show", "Zum einen durch den Erwartungswert mü"),
      step("show_normal_sigma_meaning", "normal_sigma_meaning", "show", "Und zum anderen durch die Standardabweichung"),
      step("show_normal_symmetry_properties", "normal_symmetry_properties", "show", "Charakteristisch für die Normalverteilung ist die symmetrische Glockenform"),
      step("show_normal_application_fields", "normal_application_fields", "show", "Typische Anwendungsgebiete sind beispielsweise das Finanzwesen, die Medizin, aber auch Naturwissenschaften"),
    ],
    brief: { archetype: "Dominanter Dichteplot mit Parameterankern", takeaway: "μ bestimmt die Lage, σ die Streuung.", animation: "Kurvenfamilie; μ-Marker und Bedeutung gemeinsam; σ-Bedeutung; Symmetrie; Anwendungen." },
  };
}

function renderSlide51(scene) {
  const hazardPlot = plotAsset(51, "normal_hazard.svg", 70, 224, 850, 520, "normal_hazard_plot");
  const cdfPlot = plotAsset(51, "normal_cdf.svg", 996, 224, 850, 520, "normal_cdf_plot");
  const wearout = animGroup("normal_wearout_mapping", "Zuordnung zum Verschleißbereich", `${lifecyclePhaseBand(90, 770, 810, "wear")}${textLines({ x: 495, y: 858, lines: ["Steigende Ausfallrate beschreibt nur Bereich 3"], size: 23, weight: 800, fill: C.failure, anchor: "middle" })}${textLines({ x: 495, y: 894, lines: ["Verschleiß- und Ermüdungsausfälle"], size: 20, weight: 720, fill: C.deepSoft, anchor: "middle" })}`);
  const limitation = animGroup("normal_lifetime_limitation", "Einschränkung für Lebensdauerdaten", `${card(1016, 770, 810, 132, { fill: C.failureSoft, stroke: C.failure, shadow: false })}${pictogram("wrenchAlert", { cx: 1082, cy: 836, size: 46, color: C.failure, background: "#FFFFFF", radius: 38 })}${textLines({ x: 1140, y: 818, lines: ["F(0) > 0 IST MÖGLICH"], size: 18, weight: 850, fill: C.failure })}${textLines({ x: 1140, y: 860, lines: ["Negative Ausfallzeiten sind für reale", "Lebensdauern nicht plausibel."], size: 22, weight: 730, fill: C.deep, lineHeight: 1.28 })}`);
  return {
    svg: frame(scene, `${hazardPlot}${cdfPlot}${wearout}${limitation}`, { title: "Normalverteilung in der Zuverlässigkeitstechnik", takeaway: "Die steigende Ausfallrate passt zu Verschleiß, negative Ausfallzeiten begrenzen jedoch die Eignung für Lebensdauerprognosen.", archetype: "two-evidence-distribution-assessment", layoutIntent: "paired-hazard-and-cdf-evidence-with-source-faithful-lifecycle-and-zero-time-conclusions", density: "dense", designException: "Die Gegenüberstellung von Ausfallrate und Ausfallwahrscheinlichkeit ist für die fachliche Eignungsbewertung untrennbar; die beiden Schlussfolgerungen bleiben deshalb auf einer Vergleichsfolie." }),
    targets: [target("normal_hazard_curves", "Steigende Ausfallrate"), target("normal_wearout_mapping", "Bereich 3 der Badewannenkurve"), target("normal_cdf_curves", "Ausfallwahrscheinlichkeit"), target("normal_zero_problem", "Problem bei t gleich null"), target("normal_lifetime_limitation", "Eignungsgrenze")],
    steps: [
      step("draw_normal_hazard_curves", "normal_hazard_curves", "draw", "Betrachten wir zunächst nur den Verlauf der Ausfallrate"),
      step("show_normal_wearout_mapping", "normal_wearout_mapping", "show", "Das heißt also, dass sich die Normalverteilung aufgrund ihrer steigenden Ausfallrate, nur zur Beschreibung des dritten Bereichs der Badewannenkurve eignet"),
      step("draw_normal_cdf_curves", "normal_cdf_curves", "draw", "Betrachten wir nun das Schaubild der Ausfallwahrscheinlichkeit"),
      step("show_normal_zero_problem", "normal_zero_problem", "show", "Zum Zeitpunkt t gleich null sind bereits zehn Prozent der Produkte ausgefallen"),
      step("show_normal_lifetime_limitation", "normal_lifetime_limitation", "show", "Da die Ausfallzeiten in Realität natürlich nicht im negativen Zeitbereich sein können"),
    ],
    brief: { archetype: "Zwei Evidenzplots mit klarer Schlussfolgerung", takeaway: "Verschleißmodell ja, allgemeine Lebensdauerprognose meist nein.", animation: "Ausfallrate; Bereich 3; Ausfallwahrscheinlichkeit; t=0-Problem; Eignungsgrenze." },
  };
}

function renderSlide52(scene) {
  const panel = `${card(96, 248, 1728, 586, { fill: C.surface, stroke: C.border })}<line x1="560" y1="270" x2="560" y2="812" stroke="${C.border}" stroke-width="2"/><line x1="120" y1="380" x2="1800" y2="380" stroke="${C.border}"/><line x1="120" y1="512" x2="1800" y2="512" stroke="${C.border}"/><line x1="120" y1="644" x2="1800" y2="644" stroke="${C.border}"/>`;
  const parameters = animGroup("normal_formula_parameters", "Parameter der Normalverteilung", `${card(96, 178, 1728, 52, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${textLines({ x: 132, y: 212, lines: ["t  ·  Lebensdauer / Beanspruchung"], size: 19, weight: 760, fill: C.deep })}${textLines({ x: 688, y: 212, lines: ["μ  ·  Erwartungswert und Lageparameter"], size: 19, weight: 760, fill: C.deep })}${textLines({ x: 1320, y: 212, lines: ["σ  ·  Standardabweichung"], size: 19, weight: 760, fill: C.deep })}`);
  const density = formulaRow(52, "normal_density_formula", 270, "Dichtefunktion  f(t)", "density.svg", 930, "Dichtefunktion der Normalverteilung");
  const failure = animGroup("normal_failure_formula", "Ausfallwahrscheinlichkeit als Integral", `${textLines({ x: 142, y: 468, lines: ["Ausfallwahrscheinlichkeit  F(t)"], size: 24, weight: 790, fill: C.deep })}${integralExpression(610, 470, "F(t) =", "t", "0", "f(τ) dτ", 132)}`);
  const reliability = formulaRow(52, "normal_reliability_formula", 534, "Überlebenswahrscheinlichkeit  R(t)", "reliability.svg", 760, "Überlebenswahrscheinlichkeit als Gegenwahrscheinlichkeit");
  const hazard = formulaRow(52, "normal_hazard_formula", 666, "Ausfallrate  λ(t)", "hazard.svg", 380, "Ausfallrate als Quotient");
  const conclusion = animGroup("normal_formula_conclusion", "Mathematische Komplexität", `${card(366, 866, 1188, 70, { fill: C.failureSoft, stroke: C.failure, shadow: false })}${textLines({ x: 960, y: 910, lines: ["Die komplexe Dichtefunktion setzt sich in F(t), R(t) und λ(t) fort."], size: 23, weight: 790, fill: C.failure, anchor: "middle" })}`);
  return {
    svg: frame(scene, `${parameters}${panel}${density}${failure}${reliability}${hazard}${conclusion}`, { title: "Formeln der Normalverteilung", takeaway: "Alle Zuverlässigkeitsfunktionen bauen auf der vergleichsweise komplexen Normaldichte auf.", archetype: "formula-matrix", layoutIntent: "four-row-mathtext-formula-system-with-shared-parameter-band" }),
    targets: [target("normal_formula_parameters", "Parameter"), target("normal_density_formula", "Dichtefunktion"), target("normal_failure_formula", "Ausfallwahrscheinlichkeit"), target("normal_reliability_formula", "Überlebenswahrscheinlichkeit"), target("normal_hazard_formula", "Ausfallrate"), target("normal_formula_conclusion", "Komplexitätsfolgerung")],
    steps: [
      step("show_normal_formula_parameters", "normal_formula_parameters", "show", "Wie bereits beschrieben, wird die Normalverteilung durch den Erwartungswert und die Standardabweichung definiert"),
      step("show_normal_density_formula", "normal_density_formula", "show", "Allein durch Betrachtung der Dichtefunktion fällt ein weiterer negativer Aspekt der Normalverteilung auf"),
      step("show_normal_failure_formula", "normal_failure_formula", "show", "Die Ausfallwahrscheinlichkeit zum Zeitpunkt t berechnet sich aus dem Integral von null bis t über der Dichtefunktion"),
      step("show_normal_reliability_formula", "normal_reliability_formula", "show", "Die Überlebenswahrscheinlichkeit dagegen kann dann wiederrum einfach zu eins minus der Ausfallwahrscheinlichkeit berechnet werden"),
      step("show_normal_hazard_formula", "normal_hazard_formula", "show", "Die Ausfallrate kann wiederrum berechnet werden, indem die Dichtefunktion durch die Zuverlässigkeitsfunktion geteilt wird"),
      step("show_normal_formula_conclusion", "normal_formula_conclusion", "show", "Da die Berechnung aller Funktionen mathematisch auf der Dichtefunktion basiert"),
    ],
    brief: { archetype: "Vierzeilige Formelmatrix", takeaway: "Komplexe Dichte, komplexe abgeleitete Funktionen.", animation: "Parameter; f(t); F(t); R(t); λ(t); Schlussfolgerung." },
  };
}

function renderSlide53(scene) {
  const plot = plotAsset(53, "exponential_density.svg", 560, 204, 1270, 672, "exponential_density_plot");
  const shape = animGroup("exponential_shape", "Rechtsschiefe Verteilungsform", `${pictogram("layers", { cx: 138, cy: 310, size: 42, color: C.accent, background: C.accentSoft, radius: 36 })}${textLines({ x: 198, y: 300, lines: ["KONTINUIERLICH · RECHTSSCHIEF"], size: 18, weight: 850, fill: C.accent })}${textLines({ x: 198, y: 342, lines: ["viele Werte am Anfang,"], size: 23, weight: 720, fill: C.deep })}${textLines({ x: 198, y: 376, lines: ["flacher Auslauf nach rechts"], size: 23, weight: 720, fill: C.deepSoft })}`);
  const lambda = animGroup("exponential_lambda_meaning", "Ausfallrate lambda als einziger Parameter", `${pictogram("clock", { cx: 138, cy: 490, size: 42, color: C.secondary, background: C.secondarySoft, radius: 36 })}${textLines({ x: 198, y: 480, lines: ["λ  ·  EIN PARAMETER"], size: 20, weight: 850, fill: C.secondary })}${textLines({ x: 198, y: 522, lines: ["größeres λ:"], size: 23, weight: 780, fill: C.deep })}${textLines({ x: 198, y: 556, lines: ["höherer Start, steilerer Abfall"], size: 21, weight: 720, fill: C.deepSoft })}`);
  const random = animGroup("exponential_random_events", "Modell für zufällige Ereignisse", `${card(84, 632, 430, 116, { fill: C.successSoft, stroke: C.success, shadow: false })}${pictogram("loop", { cx: 138, cy: 690, size: 40, color: C.success, background: "#FFFFFF", radius: 34 })}${textLines({ x: 198, y: 678, lines: ["ZUFÄLLIGE EREIGNISSE"], size: 18, weight: 850, fill: C.success })}${textLines({ x: 198, y: 706, lines: ["Einsatz in der", "Zuverlässigkeitstechnik"], size: 18, lineHeight: 1.2, weight: 720, fill: C.deep })}`);
  const applications = animGroup("exponential_application_fields", "Typische Anwendungen", `${applicationItem("flask", 122, 802, "Naturwissenschaften", C.accent, C.accentSoft)}${applicationItem("database", 122, 864, "Finanzwesen", C.secondary, C.secondarySoft)}${applicationItem("machineAlert", 122, 926, "Lebensdauerdaten", C.success, C.successSoft)}`);
  return {
    svg: frame(scene, `${plot}${shape}${lambda}${random}${applications}`, { title: "Die Exponentialverteilung", takeaway: "Die Ausfallrate lambda steuert allein Startwert und Abfall der rechtsschiefen Dichte.", archetype: "distribution-introduction", layoutIntent: "dominant-exponential-density-plot-with-single-parameter-and-random-event-context" }),
    targets: [target("exponential_density_curves", "Dichtekurven der Exponentialverteilung"), target("exponential_shape", "Rechtsschiefe Form"), target("exponential_lambda_meaning", "Parameterwirkung von lambda"), target("exponential_random_events", "Zufällige Ereignisse"), target("exponential_application_fields", "Anwendungen")],
    steps: [
      step("draw_exponential_density_curves", "exponential_density_curves", "draw", "Kommen wir nun zu unserer zweiten Wahrscheinlichkeitsverteilung, die sogenannte Exponentialverteilung, welche hier als Dichtefunktion dargestellt ist"),
      step("show_exponential_shape", "exponential_shape", "show", "Im Vergleich zur Normalverteilung ist die Exponentialverteilung nicht symmetrisch, sondern eine rechtsschiefe Verteilung"),
      step("show_exponential_lambda_meaning", "exponential_lambda_meaning", "show", "Die Verteilung ist durch einen einzigen Parameter definiert"),
      step("show_exponential_random_events", "exponential_random_events", "show", "Sie wird immer dann angewendet, wenn zufällige Ereignisse modelliert werden müssen"),
      step("show_exponential_application_fields", "exponential_application_fields", "show", "Die Exponentialverteilung hat ein breites Anwendungsspektrum in Naturwissenschaften wie auch im Finanzwesen oder der Zuverlässigkeitstechnik"),
    ],
    brief: { archetype: "Dominanter Dichteplot mit Einparameterlogik", takeaway: "λ allein bestimmt Startwert und Abfall.", animation: "Kurvenfamilie; Form; λ-Wirkung; Zufallsereignisse und Anwendungen." },
  };
}

function renderSlide54(scene) {
  const hazardPlot = plotAsset(54, "exponential_hazard.svg", 70, 224, 850, 520, "exponential_hazard_plot");
  const cdfPlot = plotAsset(54, "exponential_cdf.svg", 996, 224, 850, 520, "exponential_cdf_plot");
  const randomMapping = animGroup("exponential_random_mapping", "Zuordnung zum Zufallsausfallbereich", `${lifecyclePhaseBand(90, 770, 810, "random")}${textLines({ x: 495, y: 858, lines: ["Konstante Ausfallrate beschreibt nur Bereich 2"], size: 23, weight: 800, fill: C.accent, anchor: "middle" })}${textLines({ x: 495, y: 894, lines: ["Früh- und Ermüdungsausfälle bleiben unberücksichtigt"], size: 19, weight: 720, fill: C.deepSoft, anchor: "middle" })}`);
  const suitability = animGroup("exponential_lifetime_suitability", "Positive Lebensdauer und Parameterwirkung", `${card(1016, 770, 810, 132, { fill: C.successSoft, stroke: C.success, shadow: false })}${pictogram("shieldCheck", { cx: 1082, cy: 836, size: 46, color: C.success, background: "#FFFFFF", radius: 38 })}${textLines({ x: 1140, y: 818, lines: ["F(0) = 0  ·  NUR t ≥ 0"], size: 18, weight: 850, fill: C.success })}${textLines({ x: 1140, y: 860, lines: ["Größeres λ erreicht 100 %", "Ausfallwahrscheinlichkeit früher."], size: 22, weight: 730, fill: C.deep, lineHeight: 1.28 })}`);
  return {
    svg: frame(scene, `${hazardPlot}${cdfPlot}${randomMapping}${suitability}`, { title: "Exponentialverteilung in der Zuverlässigkeitstechnik", takeaway: "Die konstante Ausfallrate beschreibt Zufallsausfälle; die Ausfallwahrscheinlichkeit beginnt bei t gleich null ebenfalls bei null.", archetype: "two-evidence-distribution-assessment", layoutIntent: "paired-constant-hazard-and-positive-time-cdf-with-random-failure-mapping", density: "dense", designException: "Ausfallrate und Ausfallwahrscheinlichkeit werden als zusammengehörige Evidenz für Einsatzbereich und Zeitdomäne direkt verglichen." }),
    targets: [target("exponential_hazard_curves", "Konstante Ausfallrate"), target("exponential_random_mapping", "Bereich 2 der Badewannenkurve"), target("exponential_cdf_curves", "Ausfallwahrscheinlichkeit"), target("exponential_zero_start", "Start bei F von null gleich null"), target("exponential_lifetime_suitability", "Eignung und Parameterwirkung")],
    steps: [
      step("draw_exponential_hazard_curves", "exponential_hazard_curves", "draw", "Links unten ist die Ausfallrate dargestellt"),
      step("show_exponential_random_mapping", "exponential_random_mapping", "show", "Wenn wir uns hierzu nochmals die Badewannenkurve anschauen, sehen wir, dass wir mit einer konstanten Ausfallrate nur den zweiten Bereich, also die Zufallsausfälle, beschreiben können"),
      step("draw_exponential_cdf_curves", "exponential_cdf_curves", "draw", "schauen uns die Verläufe der Ausfallwahrscheinlichkeit mal etwas näher an"),
      step("show_exponential_zero_start", "exponential_zero_start", "show", "Demnach beginnen auch alle Kurven bei einer Lebensdauer von t gleich null mit einer Ausfallwahrscheinlichkeit von null Prozent"),
      step("show_exponential_lifetime_suitability", "exponential_lifetime_suitability", "show", "Je größer die Ausfallrate ist, desto steiler ist hier der Anstieg"),
    ],
    brief: { archetype: "Zwei Evidenzplots mit positiver Lebensdauerlogik", takeaway: "Konstantes λ modelliert Zufallsausfälle im positiven Zeitbereich.", animation: "Ausfallrate; Bereich 2; Ausfallwahrscheinlichkeit; Nullstart; Parameterwirkung." },
  };
}

function renderSlide55(scene) {
  const panel = `${card(96, 248, 1728, 586, { fill: C.surface, stroke: C.border })}<line x1="560" y1="270" x2="560" y2="812" stroke="${C.border}" stroke-width="2"/><line x1="120" y1="380" x2="1800" y2="380" stroke="${C.border}"/><line x1="120" y1="512" x2="1800" y2="512" stroke="${C.border}"/><line x1="120" y1="644" x2="1800" y2="644" stroke="${C.border}"/>`;
  const parameters = animGroup("exponential_formula_parameters", "Parameter der Exponentialverteilung", `${card(96, 178, 1728, 52, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${textLines({ x: 132, y: 212, lines: ["t  ·  Lebensdauer / Beanspruchung"], size: 19, weight: 760, fill: C.deep })}${textLines({ x: 1030, y: 212, lines: ["λ  ·  konstante Ausfallrate und einziger Verteilungsparameter"], size: 19, weight: 760, fill: C.deep, anchor: "middle" })}`);
  const density = formulaRow(55, "exponential_density_formula", 270, "Dichtefunktion  f(t)", "density.svg", 440, "Dichtefunktion der Exponentialverteilung");
  const failure = formulaRow(55, "exponential_failure_formula", 402, "Ausfallwahrscheinlichkeit  F(t)", "failure_probability.svg", 440, "Ausfallwahrscheinlichkeit der Exponentialverteilung");
  const reliability = formulaRow(55, "exponential_reliability_formula", 534, "Überlebenswahrscheinlichkeit  R(t)", "reliability.svg", 380, "Überlebenswahrscheinlichkeit der Exponentialverteilung");
  const hazard = formulaRow(55, "exponential_hazard_formula", 666, "Ausfallrate  λ(t)", "hazard.svg", 620, "Konstante Ausfallrate und Kehrwert des Mittelwertes");
  const conclusion = animGroup("exponential_formula_conclusion", "Einfache Beziehungen für Zufallsausfälle", `${card(330, 866, 1260, 70, { fill: C.successSoft, stroke: C.success, shadow: false })}${textLines({ x: 960, y: 910, lines: ["Ein Parameter, überschaubare Formeln, geeignet für zufälliges Ausfallverhalten."], size: 23, weight: 790, fill: C.success, anchor: "middle" })}`);
  return {
    svg: frame(scene, `${parameters}${panel}${density}${failure}${reliability}${hazard}${conclusion}`, { title: "Formeln der Exponentialverteilung", takeaway: "Mit nur einem Parameter bleiben alle Zuverlässigkeitsfunktionen der Exponentialverteilung überschaubar.", archetype: "formula-matrix", layoutIntent: "four-row-mathtext-formula-system-with-single-parameter-band" }),
    targets: [target("exponential_formula_parameters", "Parameter"), target("exponential_density_formula", "Dichtefunktion"), target("exponential_failure_formula", "Ausfallwahrscheinlichkeit"), target("exponential_reliability_formula", "Überlebenswahrscheinlichkeit"), target("exponential_hazard_formula", "Ausfallrate"), target("exponential_formula_conclusion", "Anwendungsfolgerung")],
    steps: [
      step("show_exponential_formula_parameters", "exponential_formula_parameters", "show", "Wie bereits beschrieben, wird die Exponentialverteilung nur über die Ausfallrate Lamda definiert"),
      step("show_exponential_density_formula", "exponential_density_formula", "show", "Die Dichtefunktion ergibt sich dabei einfach"),
      step("show_exponential_failure_formula", "exponential_failure_formula", "show", "Die Ausfallwahrscheinlichkeit groß F von t berechnet sich aus dem Integral von null bis t über der Dichtefunktion"),
      step("show_exponential_reliability_formula", "exponential_reliability_formula", "show", "Die Überlebenswahrscheinlichkeit berechnet sich wiederum zu eins minus der Ausfallwahrscheinlichkeit"),
      step("show_exponential_hazard_formula", "exponential_hazard_formula", "show", "Tut man dies, erhält man für die Ausfallrate einfach nur den Parameter Lambda"),
      step("show_exponential_formula_conclusion", "exponential_formula_conclusion", "show", "Dies ist unter anderem auch mit ein Grund, warum die Exponentialverteilung in der Zuverlässigkeitstechnik zur Beschreibung von zufälligem Ausfallverhalten sehr beliebt ist"),
    ],
    brief: { archetype: "Vierzeilige Formelmatrix", takeaway: "Ein Parameter hält alle Beziehungen überschaubar.", animation: "Parameter; f(t); F(t); R(t); λ(t); Anwendungsfolgerung." },
  };
}

function renderSlide56(scene) {
  const plot = plotAsset(56, "weibull_density.svg", 612, 208, 1218, 664, "weibull_density_plot");
  const eta = animGroup("weibull_eta_meaning", "Charakteristische Lebensdauer als Lageparameter", `${card(84, 234, 462, 142, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${pictogram("target", { cx: 146, cy: 305, size: 46, color: C.accent, background: "#FFFFFF", radius: 38 })}${textLines({ x: 210, y: 288, lines: ["T · LAGEPARAMETER"], size: 20, weight: 850, fill: C.accent })}${textLines({ x: 210, y: 330, lines: ["verschiebt die Verteilung", "entlang der Zeitachse"], size: 22, weight: 730, fill: C.deep, lineHeight: 1.28 })}`);
  const beta = animGroup("weibull_beta_meaning", "Formparameter steuert die Kurvenform", `${card(84, 404, 462, 142, { fill: C.secondarySoft, stroke: C.secondary, shadow: false })}${pictogram("layers", { cx: 146, cy: 475, size: 46, color: C.secondary, background: "#FFFFFF", radius: 38 })}${textLines({ x: 210, y: 458, lines: ["b · FORMPARAMETER"], size: 20, weight: 850, fill: C.secondary })}${textLines({ x: 210, y: 500, lines: ["bestimmt Form und", "Ausfallverhalten"], size: 22, weight: 730, fill: C.deep, lineHeight: 1.28 })}`);
  const cases = animGroup("weibull_special_cases", "Spezialfälle der Weibullverteilung", `${card(84, 574, 462, 138, { fill: C.surface, stroke: C.border, shadow: false })}${textLines({ x: 116, y: 612, lines: ["SPEZIALFÄLLE"], size: 18, weight: 850, fill: C.muted })}${richTextLine(116, 655, [{ text: "b = 1", fill: C.accent, weight: 850 }, { text: "  Exponentialverteilung", fill: C.deep, weight: 720 }], { size: 21 })}${richTextLine(116, 690, [{ text: "b ≈ 3,5", fill: C.failure, weight: 850 }, { text: "  normalähnlich", fill: C.deep, weight: 720 }], { size: 21 })}`);
  const applications = animGroup("weibull_applications", "Typische Anwendungen", `${textLines({ x: 100, y: 770, lines: ["BREITES ANWENDUNGSSPEKTRUM"], size: 18, weight: 850, fill: C.success })}${applicationItem("machineAlert", 124, 824, "Lebensdauerdaten", C.success, C.successSoft)}${applicationItem("shieldCheck", 124, 882, "Versicherungswesen", C.accent, C.accentSoft)}${applicationItem("flask", 124, 940, "Medizin", C.secondary, C.secondarySoft)}`);
  return {
    svg: frame(scene, `${plot}${eta}${beta}${cases}${applications}`, { title: "Die Weibullverteilung", takeaway: "Die charakteristische Lebensdauer T bestimmt die Lage, der Formparameter b die flexible Form der Verteilung.", archetype: "distribution-introduction", layoutIntent: "dominant-weibull-density-family-with-two-parameter-anchors-and-compact-applications" }),
    targets: [target("weibull_density_curves", "Dichtekurven der Weibullverteilung"), target("weibull_density_eta", "Charakteristische Lebensdauer im Plot"), target("weibull_eta_meaning", "Bedeutung von T"), target("weibull_beta_meaning", "Bedeutung von b"), target("weibull_special_cases", "Spezialfälle"), target("weibull_applications", "Anwendungen")],
    steps: [
      step("draw_weibull_density_curves", "weibull_density_curves", "draw", "Auf der rechten Seite sind hierzu unterschiedliche Verläufe von Dichtefunktionen dargestellt"),
      step("show_weibull_density_eta", "weibull_density_eta", "show", "Zum einen durch die charakteristische Lebensdauer groß T"),
      step("show_weibull_eta_meaning", "weibull_eta_meaning", "show", "Die charakteristische Lebensdauer ist eine Art Lageparameter"),
      step("show_weibull_beta_meaning", "weibull_beta_meaning", "show", "Der Formparameter b bestimmt dabei die Form der Verteilung"),
      step("show_weibull_special_cases", "weibull_special_cases", "show", "Für b gleich eins ergibt sich beispielsweise genau die Exponentialverteilung"),
      step("show_weibull_applications", "weibull_applications", "show", "Aufgrund der Flexibilität hat die Weibullverteilung ein sehr breites Anwendungsspektrum"),
    ],
    brief: { archetype: "Dominanter Dichteplot mit Parameterankern", takeaway: "T steuert die Lage, b die Form.", animation: "Kurvenfamilie; T im Plot; Lagewirkung; Formwirkung; Spezialfälle; Anwendungen." },
  };
}

function renderSlide57(scene) {
  const plot = plotAsset(57, "weibull_hazard.svg", 142, 206, 1636, 696, "weibull_hazard_plot");
  return {
    svg: frame(scene, plot, { title: "Der Formparameter steuert die Ausfallrate", takeaway: "Mit b kleiner, gleich oder größer eins bildet die Weibullverteilung sinkende, konstante und steigende Ausfallraten ab.", archetype: "hazard-function-comparison", layoutIntent: "single-dominant-hazard-plot-with-three-directly-labeled-complete-curve-groups" }),
    targets: [target("weibull_hazard_random", "Konstante Ausfallrate"), target("weibull_hazard_early", "Sinkende Ausfallrate"), target("weibull_hazard_wear", "Steigende Ausfallrate")],
    steps: [
      step("draw_weibull_hazard_random", "weibull_hazard_random", "draw", "Für b gleich eins ergibt sich eine konstante Ausfallrate"),
      step("draw_weibull_hazard_early", "weibull_hazard_early", "draw", "Für b kleiner eins, sinkt die Ausfallrate über der Zeit"),
      step("draw_weibull_hazard_wear", "weibull_hazard_wear", "draw", "Und für b größer eins ist ein ansteigender Verlauf der Ausfallrate zu erkennen"),
    ],
    brief: { archetype: "Dominanter Ausfallratenplot", takeaway: "Der Formparameter wählt eine von drei Ausfallratenklassen.", animation: "Jede Kurve erscheint zusammen mit ihrer direkten Beschriftung." },
  };
}

function renderSlide58(scene) {
  const plot = plotAsset(58, "weibull_hazard.svg", 72, 236, 970, 560, "weibull_hazard_plot");
  const mappingCard = (id, y, betaText, phase, detail, color, soft, icon) => animGroup(id, phase, `${card(1110, y, 712, 148, { fill: soft, stroke: color, shadow: false })}${pictogram(icon, { cx: 1172, cy: y + 74, size: 44, color, background: "#FFFFFF", radius: 38 })}${textLines({ x: 1232, y: y + 48, lines: [betaText + "  ·  " + phase], size: 22, weight: 850, fill: color })}${textLines({ x: 1232, y: y + 91, lines: [detail], size: 23, weight: 730, fill: C.deep })}<rect x="1536" y="${y + 86}" width="250" height="52" rx="6" fill="#FFFFFF" stroke="${color}" stroke-width="1.5"/>${textLines({ x: 1661, y: y + 119, lines: [phase], size: 18, weight: 820, fill: color, anchor: "middle" })}`);
  const random = mappingCard("weibull_random_mapping", 226, "b = 1", "Zufallsausfälle", "konstante Ausfallrate", C.accent, C.accentSoft, "loop");
  const early = mappingCard("weibull_early_mapping", 404, "b < 1", "Frühausfälle", "sinkende Ausfallrate", C.success, C.successSoft, "machineAlert");
  const wear = mappingCard("weibull_wear_mapping", 582, "b > 1", "Verschleiß / Ermüdung", "steigende Ausfallrate", C.failure, C.failureSoft, "wrenchAlert");
  const conclusion = animGroup("weibull_lifecycle_conclusion", "Gesamter Lebenszyklus", `${card(214, 838, 1492, 92, { fill: C.secondarySoft, stroke: C.secondary, shadow: false })}${pictogram("shieldCheck", { cx: 282, cy: 884, size: 42, color: C.secondary, background: "#FFFFFF", radius: 36 })}${textLines({ x: 344, y: 893, lines: ["Eine Verteilungsfamilie beschreibt alle drei Bereiche des Produktlebenszyklus."], size: 26, weight: 800, fill: C.deep })}`);
  return {
    svg: frame(scene, `${plot}${random}${early}${wear}${conclusion}`, { title: "Ein Modell für alle drei Lebenszyklusbereiche", takeaway: "Die drei Klassen des Formparameters ordnen sich direkt den Früh-, Zufalls- und Verschleißausfällen der Badewannenkurve zu.", archetype: "hazard-to-lifecycle-mapping", layoutIntent: "one-hazard-reference-plot-with-three-source-faithful-lifecycle-mapping-groups" }),
    targets: [target("weibull_random_mapping", "Zufallsausfälle"), target("weibull_early_mapping", "Frühausfälle"), target("weibull_wear_mapping", "Verschleißausfälle"), target("weibull_lifecycle_conclusion", "Gesamter Lebenszyklus")],
    steps: [
      step("show_weibull_random_mapping", "weibull_random_mapping", "show", "Mit einem Formparameter von eins können wir den mittleren Bereich der Badewannenkurve beschreiben"),
      step("show_weibull_early_mapping", "weibull_early_mapping", "show", "Für einen Formparameter kleiner eins befinden wir uns im ersten Bereich der Badewannenkurve"),
      step("show_weibull_wear_mapping", "weibull_wear_mapping", "show", "Und für b größer eins befinden wir uns im dritten Bereich der Badewannenkurve"),
      step("show_weibull_lifecycle_conclusion", "weibull_lifecycle_conclusion", "show", "Wir sehen, dass wir mit Hilfe der Weibullverteilung alle drei Bereiche der Badewannenkurve abdecken können"),
    ],
    brief: { archetype: "Plot-zu-Lebenszyklus-Zuordnung", takeaway: "b verbindet die Weibullkurven mit allen drei Badewannenbereichen.", animation: "Drei vollständige Zuordnungsgruppen; danach die Lebenszyklusfolgerung." },
  };
}

function renderSlide59(scene) {
  const plot = plotAsset(59, "weibull_cdf.svg", 544, 206, 1280, 696, "weibull_cdf_plot");
  const eta = animGroup("weibull_eta_location", "T als Lageparameter", `${card(88, 256, 404, 244, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${textLines({ x: 120, y: 310, lines: ["CHARAKTERISTISCHE", "LEBENSDAUER T"], size: 20, weight: 850, fill: C.accent, lineHeight: 1.25 })}${textLines({ x: 120, y: 406, lines: ["Gemeinsamer Zeitpunkt", "für alle Formparameter", "Lageparameter der Verteilung"], size: 22, weight: 740, fill: C.deep, lineHeight: 1.35 })}`);
  const conclusion = animGroup("weibull_eta_conclusion", "F von T gleich 63,2 Prozent", `${card(88, 548, 404, 250, { fill: C.failureSoft, stroke: C.failure, shadow: false })}${textLines({ x: 290, y: 600, lines: ["F(T)"], size: 34, weight: 850, fill: C.failure, anchor: "middle" })}${textLines({ x: 290, y: 674, lines: ["63,2 %"], size: 52, weight: 880, fill: C.failure, anchor: "middle" })}${textLines({ x: 290, y: 730, lines: ["unabhängig von b"], size: 23, weight: 760, fill: C.deep, anchor: "middle" })}${textLines({ x: 290, y: 770, lines: ["R(T) = 36,8 %"], size: 21, weight: 760, fill: C.success, anchor: "middle" })}`);
  return {
    svg: frame(scene, `${plot}${eta}${conclusion}`, { title: "Die charakteristische Lebensdauer", takeaway: "Alle Weibull-Verteilungsfunktionen schneiden bei t gleich T denselben Punkt F(T) gleich 63,2 Prozent.", archetype: "cdf-characteristic-life", layoutIntent: "dominant-cdf-family-with-single-shared-point-and-compact-characteristic-life-explanation" }),
    targets: [target("weibull_cdf_curves", "Weibull-Verteilungsfunktionen"), target("weibull_common_point", "Gemeinsamer Punkt"), target("weibull_eta_location", "T als Lageparameter"), target("weibull_eta_conclusion", "F von T und R von T")],
    steps: [
      step("draw_weibull_cdf_curves", "weibull_cdf_curves", "draw", "Hierzu sind die Verläufe der Ausfallwahrscheinlichkeit wieder für unterschiedliche Formparameter"),
      step("show_weibull_common_point", "weibull_common_point", "show", "alle Kurven zum Zeitpunkt der charakteristischen Lebensdauer durch einen gemeinsamen Punkt verlaufen"),
      step("show_weibull_eta_location", "weibull_eta_location", "show", "Nun schauen wir uns einmal genauer die charakteristische Lebensdauer an"),
      step("show_weibull_eta_conclusion", "weibull_eta_conclusion", "show", "der charakteristischen Lebensdauer immer eine Ausfallwahrscheinlichkeit von dreiundsechzigkommazwei Prozent zugeordnet ist"),
    ],
    brief: { archetype: "CDF-Familie mit einem gemeinsamen Punkt", takeaway: "T ist über F(T) = 63,2 % eindeutig verankert.", animation: "Kurvenfamilie; gemeinsamer Punkt mit Hilfslinien und Label; Lageparameter; Schlussfolgerung." },
  };
}

function renderSlide60(scene) {
  const panel = `${card(96, 248, 1728, 586, { fill: C.surface, stroke: C.border })}<line x1="560" y1="270" x2="560" y2="812" stroke="${C.border}" stroke-width="2"/><line x1="120" y1="380" x2="1800" y2="380" stroke="${C.border}"/><line x1="120" y1="512" x2="1800" y2="512" stroke="${C.border}"/><line x1="120" y1="644" x2="1800" y2="644" stroke="${C.border}"/>`;
  const parameters = animGroup("weibull_formula_parameters", "Parameter der Weibullverteilung", `${card(96, 178, 1728, 52, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${textLines({ x: 132, y: 212, lines: ["t · Lebensdauer / Beanspruchung"], size: 19, weight: 760, fill: C.deep })}${textLines({ x: 800, y: 212, lines: ["T · charakteristische Lebensdauer"], size: 19, weight: 760, fill: C.deep, anchor: "middle" })}${textLines({ x: 1460, y: 212, lines: ["b · Formparameter"], size: 19, weight: 760, fill: C.deep, anchor: "middle" })}`);
  const density = formulaRow(60, "weibull_density_formula", 270, "Dichtefunktion  f(t)", "density.svg", 850, "Dichtefunktion der Weibullverteilung");
  const failure = formulaRow(60, "weibull_failure_formula", 402, "Ausfallwahrscheinlichkeit  F(t)", "failure_probability.svg", 630, "Ausfallwahrscheinlichkeit der Weibullverteilung");
  const reliability = formulaRow(60, "weibull_reliability_formula", 534, "Überlebenswahrscheinlichkeit  R(t)", "reliability.svg", 520, "Überlebenswahrscheinlichkeit der Weibullverteilung");
  const hazard = formulaRow(60, "weibull_hazard_formula", 666, "Ausfallrate  λ(t)", "hazard.svg", 620, "Ausfallrate der Weibullverteilung");
  const transition = animGroup("weibull_formula_transition", "Übergang zur Herleitung von F(T)", `${card(354, 864, 1212, 70, { fill: C.secondarySoft, stroke: C.secondary, shadow: false })}${textLines({ x: 960, y: 908, lines: ["Nächster Schritt: Warum gilt immer F(T) = 63,2 %?"], size: 25, weight: 820, fill: C.secondary, anchor: "middle" })}`);
  return {
    svg: frame(scene, `${parameters}${panel}${density}${failure}${reliability}${hazard}${transition}`, { title: "Formeln der zweiparametrigen Weibullverteilung", takeaway: "Alle vier Zuverlässigkeitsfunktionen werden mit der charakteristischen Lebensdauer T und dem Formparameter b beschrieben.", archetype: "formula-matrix", layoutIntent: "four-row-weibull-mathtext-formula-system-with-shared-parameter-band" }),
    targets: [target("weibull_formula_parameters", "Parameter"), target("weibull_density_formula", "Dichtefunktion"), target("weibull_failure_formula", "Ausfallwahrscheinlichkeit"), target("weibull_reliability_formula", "Überlebenswahrscheinlichkeit"), target("weibull_hazard_formula", "Ausfallrate"), target("weibull_formula_transition", "Übergang zur Herleitung")],
    steps: [
      step("show_weibull_formula_parameters", "weibull_formula_parameters", "show", "Die Weibullverteilung kann mathematisch über die charakteristische Lebensdauer und den Formparameter beschrieben werden"),
      step("show_weibull_density_formula", "weibull_density_formula", "show", "Entsprechend lässt sich die Dichtefunktion einfach mit Hilfe dieser beiden Parameter berechnen"),
      step("show_weibull_failure_formula", "weibull_failure_formula", "show", "Über das Integral der Dichtefunktion erhält man die Ausfallwahrscheinlichkeit groß F von t"),
      step("show_weibull_reliability_formula", "weibull_reliability_formula", "show", "Die Überlebenswahrscheinlichkeit R von t berechnet sich dann einfach zu eins minus der Ausfallwahrscheinlichkeit"),
      step("show_weibull_hazard_formula", "weibull_hazard_formula", "show", "Und zum Schluss noch die Ausfallrate"),
      step("show_weibull_formula_transition", "weibull_formula_transition", "show", "Und zum Schluss noch die Ausfallrate"),
    ],
    brief: { archetype: "Vierzeilige Formelmatrix", takeaway: "T und b tragen alle vier Funktionen.", animation: "Parameterband; f(t); F(t); R(t); λ(t)." },
  };
}

function renderSlide61(scene) {
  const derivationRow = (id, y, number, file, width, caption) => animGroup(id, caption, `${card(96, y, 1130, 118, { fill: C.surface, stroke: C.border, shadow: false })}<circle cx="148" cy="${y + 59}" r="24" fill="${C.accentSoft}" stroke="${C.accent}" stroke-width="2"/>${textLines({ x: 148, y: y + 67, lines: [String(number)], size: 22, weight: 850, fill: C.accent, anchor: "middle" })}${formulaAsset(61, file, 208, y + 20, width, 76, id + "_formula")}`);
  const substitution = derivationRow("weibull_derivation_substitution", 224, 1, "substitution.svg", 900, "t gleich T einsetzen");
  const ratio = derivationRow("weibull_derivation_unit_ratio", 366, 2, "unit_ratio.svg", 900, "Quotient T durch T vereinfachen");
  const independent = derivationRow("weibull_derivation_independent", 508, 3, "independent_of_b.svg", 900, "Unabhängigkeit vom Formparameter");
  const failure = animGroup("weibull_derivation_failure_result", "Ausfallwahrscheinlichkeit bei T", `${card(1280, 242, 540, 274, { fill: C.failureSoft, stroke: C.failure, shadow: false })}${textLines({ x: 1550, y: 296, lines: ["AUSFALLWAHRSCHEINLICHKEIT"], size: 18, weight: 850, fill: C.failure, anchor: "middle" })}${formulaAsset(61, "failure_result.svg", 1370, 332, 360, 92, "weibull_failure_result_formula")}${textLines({ x: 1550, y: 476, lines: ["63,2 %"], size: 46, weight: 880, fill: C.failure, anchor: "middle" })}`);
  const reliability = animGroup("weibull_derivation_reliability_result", "Zuverlässigkeit bei T", `${card(1280, 548, 540, 274, { fill: C.successSoft, stroke: C.success, shadow: false })}${textLines({ x: 1550, y: 602, lines: ["ZUVERLÄSSIGKEIT"], size: 18, weight: 850, fill: C.success, anchor: "middle" })}${formulaAsset(61, "reliability_result.svg", 1370, 642, 360, 92, "weibull_reliability_result_formula")}${textLines({ x: 1550, y: 786, lines: ["36,8 %"], size: 46, weight: 880, fill: C.success, anchor: "middle" })}${card(332, 866, 1256, 68, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${textLines({ x: 960, y: 909, lines: ["Der gemeinsame Punkt hängt nicht vom Formparameter b ab."], size: 25, weight: 810, fill: C.deep, anchor: "middle" })}`);
  return {
    svg: frame(scene, `${substitution}${ratio}${independent}${failure}${reliability}`, { title: "Warum bei T genau 63,2 Prozent ausfallen", takeaway: "Beim Einsetzen von t gleich T kürzt sich das Verhältnis zu eins; F(T) ist deshalb unabhängig von b immer 63,2 Prozent.", archetype: "stepwise-formula-derivation", layoutIntent: "three-step-derivation-with-two-large-complementary-result-panels" }),
    targets: [target("weibull_derivation_substitution", "T einsetzen"), target("weibull_derivation_unit_ratio", "Verhältnis vereinfachen"), target("weibull_derivation_independent", "Unabhängigkeit von b"), target("weibull_derivation_failure_result", "F von T"), target("weibull_derivation_reliability_result", "R von T")],
    steps: [
      step("show_weibull_derivation_substitution", "weibull_derivation_substitution", "show", "Setzt man für die gewünschte Zeit nun die charakteristische Lebensdauer ein"),
      step("show_weibull_derivation_unit_ratio", "weibull_derivation_unit_ratio", "show", "Da sich die Klammer zu eins ergibt"),
      step("show_weibull_derivation_independent", "weibull_derivation_independent", "show", "was sich wiederrum einfach zu eins minus e, hoch minus eins, umschreiben lässt"),
      step("show_weibull_derivation_failure_result", "weibull_derivation_failure_result", "show", "für die Ausfallwahrscheinlichkeit ungefähr null-komma-sechs-drei-zwei erhält"),
      step("show_weibull_derivation_reliability_result", "weibull_derivation_reliability_result", "show", "die Kurven durch eine Zuverlässigkeit von sechsunddreißigkomma-acht Prozent verlaufen"),
    ],
    brief: { archetype: "Herleitung mit komplementären Ergebnissen", takeaway: "Die 63,2/36,8-Aufteilung folgt direkt aus t = T.", animation: "Drei Rechenschritte; F(T); R(T)." },
  };
}

function renderSlide62(scene) {
  const start = animGroup("weibull_two_parameter_start", "Zweiparametrige Ausgangsverteilung", `${card(96, 206, 450, 132, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${textLines({ x: 321, y: 252, lines: ["2 PARAMETER"], size: 18, weight: 850, fill: C.accent, anchor: "middle" })}${textLines({ x: 321, y: 306, lines: ["T   +   b"], size: 40, weight: 870, fill: C.deep, anchor: "middle" })}`);
  const t0 = animGroup("weibull_t0_concept", "Ausfallfreie Zeit t null", `${arrow(572, 272, 658, 272, C.secondary, 4)}${card(690, 190, 540, 164, { fill: C.secondarySoft, stroke: C.secondary, shadow: false })}${pictogram("clock", { cx: 756, cy: 272, size: 48, color: C.secondary, background: "#FFFFFF", radius: 40 })}${textLines({ x: 822, y: 244, lines: ["t₀ · AUSFALLFREIE ZEIT"], size: 20, weight: 850, fill: C.secondary })}${textLines({ x: 822, y: 290, lines: ["keine Ausfälle vor t₀"], size: 22, weight: 760, fill: C.deep })}${textLines({ x: 822, y: 329, lines: ["Beispiel: Bremsenverschleiß"], size: 18, weight: 740, fill: C.deepSoft })}`);
  const replacement = animGroup("weibull_replacement_rule", "Ersetzungsregel", `${arrow(1254, 272, 1340, 272, C.success, 4)}${card(1372, 206, 452, 132, { fill: C.successSoft, stroke: C.success, shadow: false })}${textLines({ x: 1598, y: 248, lines: ["ERSETZUNGSREGEL"], size: 18, weight: 850, fill: C.success, anchor: "middle" })}${textLines({ x: 1598, y: 283, lines: ["T → T − t₀"], size: 24, weight: 820, fill: C.deep, anchor: "middle" })}${textLines({ x: 1598, y: 323, lines: ["t → t − t₀"], size: 24, weight: 820, fill: C.deep, anchor: "middle" })}`);
  const formulas = animGroup("weibull_three_parameter_formulas", "Formeln der dreiparametrigen Weibullverteilung", `${card(96, 398, 1728, 438, { fill: C.surface, stroke: C.border })}<line x1="960" y1="420" x2="960" y2="814" stroke="${C.border}"/><line x1="120" y1="616" x2="1800" y2="616" stroke="${C.border}"/>${textLines({ x: 142, y: 466, lines: ["Dichtefunktion  f(t)"], size: 22, weight: 790, fill: C.deep })}${formulaAsset(62, "density.svg", 260, 492, 650, 86, "weibull_three_density_formula")}${textLines({ x: 1006, y: 466, lines: ["Ausfallwahrscheinlichkeit  F(t)"], size: 22, weight: 790, fill: C.deep })}${formulaAsset(62, "failure_probability.svg", 1040, 492, 730, 86, "weibull_three_failure_formula")}${textLines({ x: 142, y: 664, lines: ["Überlebenswahrscheinlichkeit  R(t)"], size: 22, weight: 790, fill: C.deep })}${formulaAsset(62, "reliability.svg", 260, 690, 650, 86, "weibull_three_reliability_formula")}${textLines({ x: 1006, y: 664, lines: ["Ausfallrate  λ(t)"], size: 22, weight: 790, fill: C.deep })}${formulaAsset(62, "hazard.svg", 1040, 690, 730, 86, "weibull_three_hazard_formula")}${card(464, 868, 992, 66, { fill: C.failureSoft, stroke: C.failure, shadow: false })}${textLines({ x: 960, y: 910, lines: ["3 Parameter: T, b und t₀"], size: 26, weight: 840, fill: C.failure, anchor: "middle" })}`);
  return {
    svg: frame(scene, `${start}${t0}${replacement}${formulas}`, { title: "Von zwei zu drei Parametern", takeaway: "Die ausfallfreie Zeit t null verschiebt den gültigen Zeitbereich und ergänzt T und b zum dritten Weibullparameter.", archetype: "parameter-transformation", layoutIntent: "two-to-three-parameter-transformation-over-compact-four-function-formula-matrix" }),
    targets: [target("weibull_two_parameter_start", "Zweiparametrige Verteilung"), target("weibull_t0_concept", "Ausfallfreie Zeit"), target("weibull_replacement_rule", "Ersetzungsregel"), target("weibull_three_parameter_formulas", "Angepasste Formeln")],
    steps: [
      step("show_weibull_two_parameter_start", "weibull_two_parameter_start", "show", "Wir haben nun die Weibullverteilung mit ihren zwei Parametern"),
      step("show_weibull_t0_concept", "weibull_t0_concept", "show", "Der dritte Parameter ist die sogenannte ausfallfreie Zeit t null"),
      step("show_weibull_replacement_rule", "weibull_replacement_rule", "show", "In die Gleichungen wird t null eingeführt"),
      step("show_weibull_three_parameter_formulas", "weibull_three_parameter_formulas", "show", "Demnach ergeben sich die hier in Rot angepassten Veränderungen"),
    ],
    brief: { archetype: "Parametertransformation", takeaway: "t₀ ergänzt das Modell um eine ausfallfreie Startzeit.", animation: "Zweiparameter-Ausgang; t₀-Konzept; Ersetzungsregel; vollständige angepasste Formelgruppe." },
  };
}

function renderSlide63(scene) {
  const plot = plotAsset(63, "weibull_shift.svg", 104, 208, 1712, 658, "weibull_shift_plot");
  const probabilities = animGroup("weibull_shift_probabilities", "Unveränderte Wahrscheinlichkeiten bei T", `${card(328, 860, 1264, 76, { fill: C.surface, stroke: C.border, shadow: false })}${richTextLine(960, 909, [{ text: "F(T) = 63,2 %", fill: C.failure, weight: 850 }, { text: "      ·      ", fill: C.muted, weight: 720 }, { text: "R(T) = 36,8 %", fill: C.success, weight: 850 }], { size: 27, anchor: "middle" })}`);
  return {
    svg: frame(scene, `${plot}${probabilities}`, { title: "Die ausfallfreie Zeit verschiebt die Verteilung", takeaway: "t null verschiebt dieselbe Verteilungsform nach rechts; die 63,2/36,8-Zuordnung an T bleibt erhalten.", archetype: "animated-before-after-distribution", layoutIntent: "single-axis-before-after-weibull-shift-with-visible-translation-and-probability-invariance" }),
    targets: [target("weibull_shift_base", "Zweiparametrige Ausgangskurve"), target("weibull_shifted_curve", "Verschobene dreiparametrige Kurve"), target("weibull_shift_t0", "Ausfallfreie Zeit"), target("weibull_shift_probabilities", "Unveränderte Wahrscheinlichkeiten")],
    steps: [
      step("draw_weibull_shift_base", "weibull_shift_base", "draw", "Zu sehen ist hier die zwei-parametrige Weibullverteilung mit Ihrem Ursprung im Koordinatensystem"),
      step("draw_weibull_shifted_curve", "weibull_shifted_curve", "draw", "Durch das Einführen der ausfallfreien Zeit erfolgt nun eine Verschiebung der Verteilung nach rechts"),
      step("show_weibull_shift_t0", "weibull_shift_t0", "show", "startet die drei-parametrige Weibullverteilung bai der ausfallfreien Zeit t null"),
      step("show_weibull_shift_probabilities", "weibull_shift_probabilities", "show", "Die charakteristische Lebensdauer entspricht aber weiterhin einer Ausfallwahrscheinlichkeit"),
    ],
    brief: { archetype: "Bewegter Vorher-Nachher-Plot", takeaway: "t₀ verschiebt die Verteilung, nicht ihre Wahrscheinlichkeitsdefinition.", animation: "Ausgangskurve; sichtbare Rechtsbewegung; t₀; Wahrscheinlichkeitsinvarianz." },
  };
}

function renderSlide64(scene) {
  const plot = plotAsset(64, "weibull_paper.svg", 84, 204, 1752, 610, "weibull_paper_plot");
  const axes = animGroup("weibull_paper_axes_note", "Transformierte Achsen", `${card(96, 838, 390, 96, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${textLines({ x: 128, y: 876, lines: ["ACHSEN"], size: 17, weight: 850, fill: C.accent })}${textLines({ x: 128, y: 910, lines: ["x logarithmisch · y doppellogarithmisch"], size: 18, weight: 760, fill: C.deep })}`);
  const processExample = animGroup("weibull_paper_process_example", "Arbeitsschritt Weibull-Gerade", `${card(506, 838, 410, 96, { fill: C.surface, stroke: C.border, shadow: false })}<circle cx="548" cy="886" r="22" fill="${C.accent}"/>${textLines({ x: 548, y: 894, lines: ["1"], size: 21, weight: 860, fill: "#FFFFFF", anchor: "middle" })}${textLines({ x: 586, y: 894, lines: ["Gerade aus Daten"], size: 20, weight: 780, fill: C.deep })}`);
  const processParallel = animGroup("weibull_paper_process_parallel", "Arbeitsschritt Polverschiebung", `${card(936, 838, 410, 96, { fill: C.surface, stroke: C.border, shadow: false })}<circle cx="978" cy="886" r="22" fill="${C.secondary}"/>${textLines({ x: 978, y: 894, lines: ["2"], size: 21, weight: 860, fill: "#FFFFFF", anchor: "middle" })}${textLines({ x: 1016, y: 894, lines: ["parallel in den Pol"], size: 20, weight: 780, fill: C.deep })}`);
  const processBeta = animGroup("weibull_paper_process_beta", "Arbeitsschritt Formparameter ablesen", `${card(1366, 838, 458, 96, { fill: C.successSoft, stroke: C.success, shadow: false })}<circle cx="1408" cy="886" r="22" fill="${C.success}"/>${textLines({ x: 1408, y: 894, lines: ["3"], size: 21, weight: 860, fill: "#FFFFFF", anchor: "middle" })}${textLines({ x: 1446, y: 894, lines: ["Formparameter b ablesen"], size: 20, weight: 780, fill: C.deep })}`);
  return {
    svg: frame(scene, `${plot}${axes}${processExample}${processParallel}${processBeta}`, { title: "Weibull-Wahrscheinlichkeitspapier", takeaway: "Durch transformierte Achsen wird die S-Kurve zur Geraden; ihre parallele Verschiebung zum Pol erlaubt die Ablesung von b.", archetype: "probability-paper-workflow", layoutIntent: "dominant-weibull-probability-paper-with-compact-reading-sequence", density: "normal" }),
    targets: [target("weibull_paper_reference", "Weibull-Wahrscheinlichkeitspapier"), target("weibull_paper_axes_note", "Transformierte Achsen"), target("weibull_paper_example", "Ermittelte Weibull-Gerade"), target("weibull_paper_process_example", "Arbeitsschritt Weibull-Gerade"), target("weibull_paper_parallel", "Parallele Verschiebung"), target("weibull_paper_process_parallel", "Arbeitsschritt Polverschiebung"), target("weibull_paper_beta", "Abgelesener Formparameter"), target("weibull_paper_process_beta", "Arbeitsschritt Formparameter")],
    steps: [
      step("show_weibull_paper_axes_note", "weibull_paper_axes_note", "show", "Dafür wird die Ypsilon-Achse doppellogarithmiert und die x-Achse logarithmiert"),
      step("show_weibull_paper_reference", "weibull_paper_reference", "show", "Hier könnt ihr ein sogenanntes Weibull-Wahrscheinlichkeits-Papier sehen"),
      step("draw_weibull_paper_example", "weibull_paper_example", "draw", "Angenommen wir haben mit Hilfe der Ausfallzeiten die rot dargestellte Weibull-Gerade erhalten"),
      step("show_weibull_paper_process_example", "weibull_paper_process_example", "show", "Angenommen wir haben mit Hilfe der Ausfallzeiten die rot dargestellte Weibull-Gerade erhalten"),
      step("draw_weibull_paper_parallel", "weibull_paper_parallel", "draw", "Im Anschluss kann man dann die Gerade parallel in den Pol verschieben"),
      step("show_weibull_paper_process_parallel", "weibull_paper_process_parallel", "show", "Im Anschluss kann man dann die Gerade parallel in den Pol verschieben"),
      step("show_weibull_paper_beta", "weibull_paper_beta", "show", "Auf der rechten Ypsilon-Achse kann dann mit Hilfe des Schnittpunktes der Formparameter der Weibullverteilung bestimmt werden"),
      step("show_weibull_paper_process_beta", "weibull_paper_process_beta", "show", "Auf der rechten Ypsilon-Achse kann dann mit Hilfe des Schnittpunktes der Formparameter der Weibullverteilung bestimmt werden"),
    ],
    brief: { archetype: "Technischer Arbeitsplot", takeaway: "Achstransformation und Polverschiebung machen b grafisch ablesbar.", animation: "Achsenerklärung; Papier; Gerade; parallele Verschiebung zum Pol; b-Ablesung." },
  };
}

function renderSlide65(scene) {
  const gearbox = animGroup("nkw_gearbox_context", "6-Gang-NKW-Getriebe", `${imagePanel({ slideNumber: 65, filename: "nkw-6-speed-gearbox-cutaway-display.jpg", x: 82, y: 254, width: 470, height: 420, clipId: "slide65_gearbox_clip", position: "xMidYMid contain" })}${textLines({ x: 317, y: 710, lines: ["6-Gang-NKW-Getriebe"], size: 24, weight: 820, fill: C.deep, anchor: "middle" })}`);
  const plot = plotAsset(65, "nkw_cdf.svg", 602, 206, 1220, 670, "nkw_cdf_plot");
  const formula = animGroup("nkw_weibull_model", "Weibullmodell des Getriebebeispiels", `${card(82, 758, 470, 116, { fill: C.surface, stroke: C.border, shadow: false })}${textLines({ x: 118, y: 794, lines: ["WEIBULL-MODELL"], size: 18, weight: 850, fill: C.muted })}${formulaAsset(65, "formula.svg", 128, 812, 360, 48, "nkw_weibull_formula")}`);
  const scale = animGroup("nkw_linear_scale", "Normal skalierte Achsen", `${card(634, 878, 1156, 60, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${pictogram("layers", { cx: 688, cy: 908, size: 32, color: C.accent, background: "#FFFFFF", radius: 27 })}${textLines({ x: 736, y: 916, lines: ["Normale Achsenskalierung  →  S-förmiger Verlauf der Ausfallwahrscheinlichkeit"], size: 23, weight: 800, fill: C.deep })}`);
  return {
    svg: frame(scene, `${gearbox}${plot}${formula}${scale}`, { title: "Getriebebeispiel auf normalen Achsen", takeaway: "Für b gleich 1,4 zeigt die Ausfallwahrscheinlichkeit des 6-Gang-NKW-Getriebes auf normalen Achsen den typischen S-Verlauf.", archetype: "product-anchored-cdf-example", layoutIntent: "dominant-normal-axis-weibull-cdf-with-approved-gearbox-anchor-and-compact-model-formula" }),
    targets: [target("nkw_gearbox_context", "6-Gang-NKW-Getriebe"), target("nkw_cdf_data", "Ausfalldaten und Formparameter"), target("nkw_weibull_model", "Weibullmodell"), target("nkw_cdf_curve", "S-förmige Ausfallwahrscheinlichkeit"), target("nkw_linear_scale", "Normale Skalierung")],
    steps: [
      step("show_nkw_gearbox_context", "nkw_gearbox_context", "show", "Für die ermittelten Ausfallzeiten des Getriebes"),
      step("show_nkw_cdf_data", "nkw_cdf_data", "show", "Der Formparameter wurde dabei zu eins-komma-vier ermittelt"),
      step("show_nkw_weibull_model", "nkw_weibull_model", "show", "Der Formparameter wurde dabei zu eins-komma-vier ermittelt"),
      step("draw_nkw_cdf_curve", "nkw_cdf_curve", "draw", "Verlauf der Ausfallwahrscheinlichkeit über der normierten Lebensdauer dargestellt"),
      step("show_nkw_linear_scale", "nkw_linear_scale", "show", "Die Achsen sind dabei normal skaliert und ohne Logarithmierung dargestellt"),
    ],
    brief: { archetype: "Produktanker mit dominantem CDF-Plot", takeaway: "Normale Achsen erzeugen die bekannte S-Kurve.", animation: "Getriebe; Daten samt b-Label; Kurve; Skalierungserklärung." },
  };
}

function renderSlide66(scene) {
  const gearbox = `${imagePanel({ slideNumber: 66, filename: "nkw-6-speed-gearbox-cutaway-display.jpg", x: 90, y: 280, width: 420, height: 360, clipId: "slide66_gearbox_clip", position: "xMidYMid contain" })}${textLines({ x: 300, y: 678, lines: ["derselbe Datensatz"], size: 23, weight: 820, fill: C.deep, anchor: "middle" })}`;
  const plot = plotAsset(66, "nkw_probability.svg", 548, 206, 1276, 690, "nkw_probability_plot");
  const note = animGroup("nkw_same_data_note", "Dieselben Daten, andere Skalierung", `${card(86, 728, 430, 170, { fill: C.successSoft, stroke: C.success, shadow: false })}${pictogram("layers", { cx: 148, cy: 813, size: 46, color: C.success, background: "#FFFFFF", radius: 38 })}${textLines({ x: 208, y: 786, lines: ["GLEICHE DATEN"], size: 18, weight: 850, fill: C.success })}${textLines({ x: 208, y: 830, lines: ["transformierte Achsen"], size: 22, weight: 760, fill: C.deep })}${textLines({ x: 208, y: 866, lines: ["→ Gerade statt S-Kurve"], size: 22, weight: 800, fill: C.deep })}`);
  return {
    svg: frame(scene, `${gearbox}${plot}${note}`, { title: "Dieselben Daten im Weibullnetz", takeaway: "Die einfach und doppellogarithmische Achstransformation überführt dieselbe Weibullverteilung in eine Gerade.", archetype: "transformed-probability-example", layoutIntent: "dominant-weibull-probability-line-with-small-same-product-anchor-and-explicit-data-equivalence" }),
    targets: [target("nkw_probability_data", "Transformierte Ausfalldaten"), target("nkw_probability_line", "Geradenförmiger Weibull-Fit"), target("nkw_same_data_note", "Gleiche Daten, andere Skalierung")],
    steps: [
      step("show_nkw_probability_data", "nkw_probability_data", "show", "Nach der Transformation der Achsen in eine einfach bzw. doppel-logarithmierte Skalierung"),
      step("draw_nkw_probability_line", "nkw_probability_line", "draw", "ergibt sich für dieselbe Verteilung eine geradenförmige Darstellung der Ausfallwahrscheinlichkeit"),
      step("show_nkw_same_data_note", "nkw_same_data_note", "show", "mit transformierten Achsen und damit Verteilungsfunktionen in Form von Geraden arbeiten"),
    ],
    brief: { archetype: "Transformierter Gerade-Plot", takeaway: "Der Datensatz bleibt gleich, nur seine Achsendarstellung ändert sich.", animation: "Datenpunkte; Fit-Gerade samt b; Vergleichsnotiz." },
  };
}

function renderSlide67(scene) {
  const plot = plotAsset(67, "weibull_mechanisms.svg", 66, 192, 1300, 640, "weibull_mechanisms_plot");
  const warningSignal = pictogram("machineAlert", { cx: 1612, cy: 312, size: 70, color: C.failure, background: C.failureSoft, radius: 54 });
  const warning = animGroup("weibull_mechanism_separation", "Ausfallmechanismen getrennt auswerten", `${card(1402, 230, 420, 626, { fill: C.surface, stroke: C.border })}${pictogram("search", { cx: 1612, cy: 312, size: 58, color: C.failure, background: C.failureSoft, radius: 48 })}${textLines({ x: 1612, y: 394, lines: ["KNICK ≠ EIN MECHANISMUS"], size: 18, weight: 850, fill: C.failure, anchor: "middle" })}${textLines({ x: 1440, y: 462, lines: ["Ein abknickender Verlauf kann", "aus mehreren Ausfallmechanismen", "mit unterschiedlichen b-Werten", "entstehen."], size: 22, weight: 730, fill: C.deep, lineHeight: 1.35 })}<line x1="1440" y1="612" x2="1784" y2="612" stroke="${C.border}"/>${textLines({ x: 1440, y: 666, lines: ["ZIEL DER AUSWERTUNG"], size: 18, weight: 850, fill: C.success })}${textLines({ x: 1440, y: 716, lines: ["Datenpunkte nach Mechanismus", "trennen und jeweils durch eine", "eigene Weibullverteilung", "beschreiben."], size: 22, weight: 760, fill: C.deep, lineHeight: 1.34 })}${card(434, 868, 1052, 68, { fill: C.secondarySoft, stroke: C.secondary, shadow: false })}${textLines({ x: 960, y: 911, lines: ["Schematische Darstellung: reale Daten ergeben pro Mechanismus genau eine Fit-Gerade."], size: 22, weight: 790, fill: C.deep, anchor: "middle" })}`);
  return {
    svg: frame(scene, `${plot}${warning}${warningSignal}`, { title: "Ausfallmechanismen im Weibullnetz trennen", takeaway: "Ein Knick weist auf mehrere Ausfallmechanismen hin; für eine belastbare Weibull-Schätzung müssen ihre Daten getrennt ausgewertet werden.", archetype: "mechanism-separation-probability-plot", layoutIntent: "dominant-segmented-weibull-paper-with-explicit-kink-diagnosis-and-separation-rule", density: "dense", designException: "Die drei Mechanismen, ihre Fit-Geraden, die Knickdiagnose und die daraus folgende Trennregel sind Bestandteile derselben fachlichen Diagnose." }),
    targets: [target("mechanism_random", "Zufallsausfälle"), target("mechanism_early", "Frühausfälle"), target("mechanism_wear", "Verschleißausfälle"), target("mechanism_kink_warning", "Knick als Warnsignal"), target("weibull_mechanism_separation", "Mechanismen getrennt auswerten")],
    steps: [
      step("draw_mechanism_random", "mechanism_random", "draw", "Für b gleich eins ist die Ausfallrate Lambda konstant"),
      step("draw_mechanism_early", "mechanism_early", "draw", "Für b kleiner eins sinkt die Ausfallrate über der Zeit"),
      step("draw_mechanism_wear", "mechanism_wear", "draw", "Und für b größer eins ist im Bereich drei eine ansteigende Ausfallrate zu erkennen"),
      step("show_mechanism_kink_warning", "mechanism_kink_warning", "show", "In Realität kann dadurch auch ein abknickender Verlauf der Weibull-Gerade entstehen"),
      step("show_weibull_mechanism_separation", "weibull_mechanism_separation", "show", "die einzelnen Datenpunkte getrennt nach den unterschiedlichen Ausfallmechanismen zu analysieren"),
    ],
    brief: { archetype: "Mechanismenvergleich im Weibullnetz", takeaway: "Knicke diagnostizieren Mechanismenmix, nicht eine besondere Einzelverteilung.", animation: "Drei Mechanismen; Knickwarnung; verbindliche Trennregel." },
  };
}

function renderSlide68(scene) {
  const plot = plotAsset(68, "lognormal_density.svg", 626, 206, 1198, 654, "lognormal_density_plot");
  const transform = animGroup("lognormal_transformation", "Logarithmische Transformation", `${card(84, 226, 482, 174, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${textLines({ x: 325, y: 270, lines: ["LOGARITHMISCHE TRANSFORMATION"], size: 18, weight: 850, fill: C.accent, anchor: "middle" })}${formulaAsset(68, "transformation.svg", 180, 300, 290, 74, "lognormal_transformation_formula")}`);
  const parameters = animGroup("lognormal_parameters", "Parameter der Lognormalverteilung", `${card(84, 430, 482, 138, { fill: C.surface, stroke: C.border, shadow: false })}${pictogram("target", { cx: 148, cy: 499, size: 44, color: C.secondary, background: C.secondarySoft, radius: 37 })}${textLines({ x: 210, y: 484, lines: ["μ · LAGE"], size: 21, weight: 850, fill: C.secondary })}${textLines({ x: 210, y: 529, lines: ["σ · STREUUNG"], size: 21, weight: 850, fill: C.success })}`);
  const process = animGroup("lognormal_multiplicative_process", "Multiplikative Zufallsprozesse", `${card(84, 598, 482, 126, { fill: C.successSoft, stroke: C.success, shadow: false })}${pictogram("layers", { cx: 148, cy: 661, size: 44, color: C.success, background: "#FFFFFF", radius: 37 })}${textLines({ x: 210, y: 646, lines: ["MULTIPLIKATIVE PROZESSE"], size: 18, weight: 850, fill: C.success })}${textLines({ x: 210, y: 690, lines: ["Produkt positiver Zufallsvariablen"], size: 20, weight: 740, fill: C.deep })}`);
  const applications = animGroup("lognormal_applications", "Typische Anwendungen", `${textLines({ x: 98, y: 782, lines: ["TYPISCHE ANWENDUNGEN"], size: 18, weight: 850, fill: C.muted })}${applicationItem("machineAlert", 122, 832, "Lebensdauerdaten", C.accent, C.accentSoft)}${applicationItem("database", 122, 884, "Finanzwesen", C.secondary, C.secondarySoft)}${applicationItem("flask", 122, 936, "Biologie, Medizin, Öl und Gas", C.success, C.successSoft)}`);
  return {
    svg: frame(scene, `${plot}${transform}${parameters}${process}${applications}`, { title: "Die Lognormalverteilung", takeaway: "Ist der Logarithmus einer positiven Zufallsvariablen normalverteilt, folgt die Variable selbst einer flexiblen rechtsschiefen Lognormalverteilung.", archetype: "distribution-introduction", layoutIntent: "dominant-lognormal-density-family-with-transformation-parameter-and-multiplicative-process-anchors" }),
    targets: [target("lognormal_transformation", "Logarithmische Transformation"), target("lognormal_density_curves", "Dichtekurven"), target("lognormal_parameters", "Parameter"), target("lognormal_multiplicative_process", "Multiplikative Prozesse"), target("lognormal_applications", "Anwendungen")],
    steps: [
      step("show_lognormal_transformation", "lognormal_transformation", "show", "wenn die mit dem Logarithmus transformierte Zufallsvariable Ypsilon normalverteilt ist"),
      step("draw_lognormal_density_curves", "lognormal_density_curves", "draw", "wenn man sich die unterschiedlichen Verläufe der Dichtefunktionen näher anschaut"),
      step("show_lognormal_parameters", "lognormal_parameters", "show", "Die Log-Normalverteilung ist durch den Erwartungswert und die Standardabweichung definiert"),
      step("show_lognormal_multiplicative_process", "lognormal_multiplicative_process", "show", "entstehen Werte durch das Produkt vieler positiver Zufallsvariablen"),
      step("show_lognormal_applications", "lognormal_applications", "show", "Typische Anwendungsgebiete sind neben der Lebensdauerdatenanalyse"),
    ],
    brief: { archetype: "Dominanter Dichteplot mit Transformationsanker", takeaway: "Logarithmische Normalität modelliert rechtsschiefe multiplikative Prozesse.", animation: "Transformation; Kurvenfamilie; Parameter; Prozessprinzip; Anwendungen." },
  };
}

function renderSlide69(scene) {
  const hazard = plotAsset(69, "lognormal_hazard.svg", 66, 210, 1120, 654, "lognormal_hazard_plot");
  const density = plotAsset(69, "lognormal_density.svg", 1222, 210, 596, 272, "lognormal_density_context_plot");
  const pair = plotAsset(69, "lognormal_probability_pair.svg", 1222, 500, 596, 264, "lognormal_probability_pair_plot");
  const limitation = animGroup("lognormal_wear_limitation", "Eignungsgrenze für Verschleiß", `${card(98, 872, 1724, 64, { fill: C.failureSoft, stroke: C.failure, shadow: false })}${pictogram("wrenchAlert", { cx: 144, cy: 904, size: 38, color: C.failure, background: "#FFFFFF", radius: 32 })}${textLines({ x: 196, y: 912, lines: ["Nach dem Maximum fällt λ(t): Verschleiß- und Ermüdungsausfälle werden nur unvollständig beschrieben."], size: 21, weight: 790, fill: C.deep })}`);
  return {
    svg: frame(scene, `${hazard}${density}${pair}${limitation}`, { title: "Eignungsgrenze der Lognormalverteilung", takeaway: "Die Lognormal-Ausfallrate erreicht ein Maximum und fällt danach; dauernd steigende Verschleiß- und Ermüdungsraten bildet sie daher nur unvollständig ab.", archetype: "distribution-suitability-assessment", layoutIntent: "dominant-lognormal-hazard-evidence-with-density-and-complementary-probability-context", density: "dense", designException: "Dichte, Hazard-Verlauf, komplementäre Wahrscheinlichkeiten und Eignungsgrenze bilden die vollständige Quellenargumentation." }),
    targets: [target("lognormal_density_curves", "Dichtefunktionen"), target("lognormal_probability_pair", "Ausfall- und Überlebenswahrscheinlichkeit"), target("lognormal_hazard_curves", "Ausfallraten"), target("lognormal_hazard_limit", "Maximum und Abfall"), target("lognormal_wear_limitation", "Eignungsgrenze")],
    steps: [
      step("draw_lognormal_density_curves", "lognormal_density_curves", "draw", "Verläufen für die Funktionen der Dichte, der Ausfallrate, der Ausfallwahrscheinlichkeit und der Überlebenswahrscheinlichkeit"),
      step("show_lognormal_probability_pair", "lognormal_probability_pair", "show", "Verläufen für die Funktionen der Dichte, der Ausfallrate, der Ausfallwahrscheinlichkeit und der Überlebenswahrscheinlichkeit"),
      step("draw_lognormal_hazard_curves", "lognormal_hazard_curves", "draw", "Ein Nachteil zeigt sich bai der Ausfallrate für Verschleißmechanismen"),
      step("show_lognormal_hazard_limit", "lognormal_hazard_limit", "show", "bis das Maximum erreicht ist und die Kurve wieder abfällt"),
      step("show_lognormal_wear_limitation", "lognormal_wear_limitation", "show", "mit Hilfe der Log-Normalverteilung nur unvollständig beschrieben werden können"),
    ],
    brief: { archetype: "Eignungsprüfung über den Hazard-Verlauf", takeaway: "Die Hazard-Kurve begrenzt den Einsatz für Verschleiß.", animation: "Funktionskontext; Ausfallraten; Maximum samt Abfall; Eignungsgrenze." },
  };
}

function renderSlide70(scene) {
  const parameters = animGroup("lognormal_formula_parameters", "Parameter der Lognormalverteilung", `${card(96, 178, 1728, 52, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${textLines({ x: 132, y: 212, lines: ["t · positive Lebensdauer"], size: 19, weight: 760, fill: C.deep })}${textLines({ x: 826, y: 212, lines: ["μ · Erwartungswert von ln(t)"], size: 19, weight: 760, fill: C.deep, anchor: "middle" })}${textLines({ x: 1500, y: 212, lines: ["σ · Standardabweichung von ln(t)"], size: 19, weight: 760, fill: C.deep, anchor: "middle" })}`);
  const formulaPanel = `${card(96, 248, 1728, 530, { fill: C.surface, stroke: C.border })}<line x1="560" y1="270" x2="560" y2="756" stroke="${C.border}" stroke-width="2"/><line x1="120" y1="378" x2="1800" y2="378" stroke="${C.border}"/><line x1="120" y1="502" x2="1800" y2="502" stroke="${C.border}"/><line x1="120" y1="626" x2="1800" y2="626" stroke="${C.border}"/>`;
  const formulaLine = (y, labelText, file, width, id) => `${textLines({ x: 142, y: y + 66, lines: [labelText], size: 24, weight: 790, fill: C.deep })}${formulaAsset(70, file, 610, y + 28, width, 62, id)}`;
  const density = formulaLine(266, "Dichtefunktion  f(t)", "density.svg", 980, "lognormal_density_formula");
  const failure = formulaLine(390, "Ausfallwahrscheinlichkeit  F(t)", "failure_probability.svg", 920, "lognormal_failure_formula");
  const reliability = formulaLine(514, "Überlebenswahrscheinlichkeit  R(t)", "reliability.svg", 900, "lognormal_reliability_formula");
  const hazard = formulaLine(638, "Ausfallrate  λ(t)", "hazard.svg", 820, "lognormal_hazard_formula");
  const formulas = animGroup("lognormal_formula_system", "Zuverlässigkeitsfunktionen der Lognormalverteilung", `${formulaPanel}${density}${failure}${reliability}${hazard}`);
  const median = animGroup("lognormal_median_formula", "Median der Lognormalverteilung", `${card(330, 814, 1260, 120, { fill: C.secondarySoft, stroke: C.secondary, shadow: false })}${textLines({ x: 384, y: 860, lines: ["MEDIAN"], size: 18, weight: 850, fill: C.secondary })}${textLines({ x: 590, y: 877, lines: ["Median = e^μ"], size: 34, weight: 850, fill: C.deep })}${textLines({ x: 1010, y: 870, lines: ["Folge der logarithmierten Zeit"], size: 23, weight: 800, fill: C.deep })}`);
  return {
    svg: frame(scene, `${parameters}${formulas}${median}`, { title: "Formeln der Lognormalverteilung", takeaway: "Die Lognormalformeln entsprechen der Normalverteilung mit logarithmierter Zeit; deshalb liegt der Median bei e hoch μ.", archetype: "formula-matrix", layoutIntent: "grouped-four-function-lognormal-formula-system-with-separate-median-consequence" }),
    targets: [target("lognormal_formula_parameters", "Parameter"), target("lognormal_formula_system", "Vier Zuverlässigkeitsfunktionen"), target("lognormal_median_formula", "Median")],
    steps: [
      step("show_lognormal_formula_parameters", "lognormal_formula_parameters", "show", "Die Gleichungen der Lognormalverteilung leiten sich direkt aus der Normalverteilung ab"),
      step("show_lognormal_formula_system", "lognormal_formula_system", "show", "Der einzige Unterschied ist, dass die Zeit hierbei noch logarithmiert wird"),
      step("show_lognormal_median_formula", "lognormal_median_formula", "show", "dass der Median nun nicht mehr gleich dem Erwartungswert mü ist"),
    ],
    brief: { archetype: "Gebündelte Formelmatrix", takeaway: "ln(t) ist der zentrale Unterschied; der Median liegt bei e^μ.", animation: "Parameter; vollständige Formelgruppe; Medianfolge." },
  };
}

function renderSlide71(scene) {
  const reusedScene = {
    ...scene,
    animation_plan: {
      steps: [
        {
          target_id: "reliability_definition",
          source_text: "Beginnen wir mit der Definition der Zuverlässigkeit.",
        },
      ],
    },
  };
  const result = renderSlide13(reusedScene);
  result.brief = {
    archetype: "Wiederverwendete Definition mit Piktogrammspur",
    takeaway: "Wahrscheinlichkeit, Produkt, Zeitdauer und Bedingungen bilden gemeinsam die Definition.",
    animation: "Die aus Szene 13 wiederverwendete Definition erscheint als vollständige semantische Einheit.",
  };
  return result;
}

function renderSlide72(scene) {
  const reusedScene = {
    ...scene,
    animation_plan: {
      steps: [
        {
          target_id: "method_toolboxes",
          source_text: "In der Zuverlässigkeitstechnik kennen wir zwei Arten von Methoden.",
        },
        {
          target_id: "qualitative_toolbox",
          source_text: "Zum einen gibt es die qualitativen Methoden",
        },
        {
          target_id: "quantitative_toolbox",
          source_text: "Und zum anderen gibt es die quantitativen Methoden",
        },
      ],
    },
  };
  const result = renderSlide15(reusedScene);
  result.brief = {
    archetype: "Wiederverwendeter Werkzeugkastenvergleich",
    takeaway: "Qualitative und quantitative Methoden erfüllen unterschiedliche, einander ergänzende Aufgaben.",
    animation: "Orientierung; qualitativer Werkzeugkasten; quantitativer Werkzeugkasten.",
  };
  return result;
}

function renderSlide73(scene) {
  const result = renderSlide17(scene);
  result.steps = [
    step("show_phase_1", "phase_1_planning", "show", "In Phase eins der Zuverlässigkeitsplanung definieren wir"),
    step("show_phase_2", "phase_2_analysis", "show", "In Phase zwei, also während der Konzeptions- und Entwurfsphase"),
    step("show_phase_3", "phase_3_testing", "show", "Die dritte Phase des Zuverlässigkeitsmanagements ist die Zuverlässigkeitserprobung"),
    step("show_phase_4", "phase_4_production", "show", "In Phase vier wird die Produktion durch den Einsatz von Zuverlässigkeitsmethoden verbessert"),
    step("show_phase_5", "phase_5_field", "show", "Und in der letzten Phase, während des Feldeinsatzes unseres Produktes"),
  ];
  result.brief = {
    archetype: "Wiederverwendete kanonische Phasenübersicht",
    takeaway: "Fünf Managementphasen begleiten den Produktlebenszyklus von der Planung bis zum Feldeinsatz.",
    animation: "Die fünf vollständigen Phasenbänder erscheinen in der Reihenfolge des Zusammenfassungstextes.",
  };
  return result;
}

function renderSlide74(scene) {
  const plot = plotAsset(74, "reliability_function_summary.svg", 92, 204, 1736, 724, "reliability_function_summary_plot");
  return {
    svg: frame(scene, plot, {
      title: "Vier Zuverlässigkeitsfunktionen",
      takeaway: "Dichte, Ausfallwahrscheinlichkeit, Überlebenswahrscheinlichkeit und Ausfallrate beschreiben denselben Lebensdauerprozess aus vier Blickrichtungen.",
      archetype: "four-function-summary",
      layoutIntent: "source-oriented-two-by-two-reliability-function-summary-with-shared-time-model",
      density: "dense",
      designException: "Vier vollständige Funktionsplots werden in der Zusammenfassung als direkt vergleichbare 2x2-Matrix benötigt.",
    }),
    targets: [
      target("summary_density", "Dichtefunktion"),
      target("summary_failure_probability", "Ausfallwahrscheinlichkeit"),
      target("summary_reliability", "Überlebenswahrscheinlichkeit"),
      target("summary_hazard", "Ausfallrate"),
    ],
    steps: [
      step("draw_summary_density", "summary_density", "draw", "Zum einen links oben dargestellt, die Dichtefunktion"),
      step("draw_summary_failure_probability", "summary_failure_probability", "draw", "Zum anderen sind rechts die Ausfall- und Überlebenswahrscheinlichkeit dargestellt"),
      step("draw_summary_reliability", "summary_reliability", "draw", "Zum anderen sind rechts die Ausfall- und Überlebenswahrscheinlichkeit dargestellt"),
      step("draw_summary_hazard", "summary_hazard", "draw", "Und zuletzt links unten die Ausfallrate"),
    ],
    brief: {
      archetype: "Ruhige 2x2-Plotmatrix",
      takeaway: "Vier Funktionen beschreiben denselben Lebensdauerprozess aus unterschiedlichen Blickrichtungen.",
      animation: "Dichte; Ausfall- und Überlebenswahrscheinlichkeit gemeinsam; Ausfallrate zuletzt.",
    },
  };
}

function renderSlide75(scene) {
  const result = renderBathtubCurveSlide(scene, 75);
  result.steps = [
    step("show_hazard_definition", "hazard_definition", "show", "Die Ausfallrate wird durch den Buchstaben Lambda abgekürzt"),
    step("show_hazard_risk_meaning", "hazard_risk_meaning", "show", "Oder mit anderen Worten, die Ausfallrate beschreibt das Risiko"),
    step("draw_bathtub_curve_path", "bathtub_curve_path", "draw", "Mit der Ausfallrate kann das gesamte Ausfallverhalten eines Produktes beschrieben"),
    step("show_bathtub_early_zone", "bathtub_early_zone", "show", "Dabei lässt sich die Badewannen-Kurve entsprechend einer abfallenden"),
    step("show_early_failure_region", "early_failure_region", "show", "Die Ausfälle in den verschiedenen Bereichen entstehen durch unterschiedliche Ursachen"),
    step("show_bathtub_random_zone", "bathtub_random_zone", "show", "Dabei lässt sich die Badewannen-Kurve entsprechend einer abfallenden"),
    step("show_random_failure_region", "random_failure_region", "show", "Die Ausfälle in den verschiedenen Bereichen entstehen durch unterschiedliche Ursachen"),
    step("show_bathtub_wear_zone", "bathtub_wear_zone", "show", "Dabei lässt sich die Badewannen-Kurve entsprechend einer abfallenden"),
    step("show_wearout_failure_region", "wearout_failure_region", "show", "Die Ausfälle in den verschiedenen Bereichen entstehen durch unterschiedliche Ursachen"),
  ];
  result.brief = {
    archetype: "Wiederverwendeter Dreizonen-Funktionsplot",
    takeaway: "Die Ausfallrate beschreibt das bedingte Risiko und gliedert die Badewannenkurve in drei Ursachenbereiche.",
    animation: "Definition; bedingtes Risiko; Badewannenkurve; drei vollständige Ursachen- und Maßnahmengruppen gemeinsam.",
  };
  return result;
}

function renderSlide76(scene) {
  const plot = plotAsset(76, "weibull_density.svg", 612, 208, 1218, 664, "weibull_density_plot");
  const eta = animGroup("weibull_eta_meaning", "Charakteristische Lebensdauer als Lageparameter", `${card(84, 234, 462, 142, { fill: C.accentSoft, stroke: C.accent, shadow: false })}${pictogram("target", { cx: 146, cy: 305, size: 46, color: C.accent, background: "#FFFFFF", radius: 38 })}${textLines({ x: 210, y: 288, lines: ["T · LAGEPARAMETER"], size: 20, weight: 850, fill: C.accent })}${textLines({ x: 210, y: 330, lines: ["verschiebt die Verteilung", "entlang der Zeitachse"], size: 22, weight: 730, fill: C.deep, lineHeight: 1.28 })}`);
  const beta = animGroup("weibull_beta_meaning", "Formparameter steuert die Kurvenform", `${card(84, 404, 462, 142, { fill: C.secondarySoft, stroke: C.secondary, shadow: false })}${pictogram("layers", { cx: 146, cy: 475, size: 46, color: C.secondary, background: "#FFFFFF", radius: 38 })}${textLines({ x: 210, y: 458, lines: ["b · FORMPARAMETER"], size: 20, weight: 850, fill: C.secondary })}${textLines({ x: 210, y: 500, lines: ["bestimmt Form und", "Ausfallverhalten"], size: 22, weight: 730, fill: C.deep, lineHeight: 1.28 })}`);
  const flexibility = animGroup("weibull_flexibility_summary", "Flexibles Anwendungsspektrum", `${card(84, 574, 462, 142, { fill: C.surface, stroke: C.border, shadow: false })}${pictogram("shieldCheck", { cx: 146, cy: 645, size: 44, color: C.success, background: C.successSoft, radius: 37 })}${textLines({ x: 210, y: 625, lines: ["FLEXIBLES MODELL"], size: 18, weight: 850, fill: C.success })}${textLines({ x: 210, y: 667, lines: ["bevorzugt für die statistische", "Beschreibung von Ausfällen"], size: 20, weight: 730, fill: C.deep, lineHeight: 1.28 })}`);
  const t0 = animGroup("weibull_t0_parameter", "Ausfallfreie Zeit t null", `${card(84, 746, 462, 168, { fill: C.successSoft, stroke: C.success, shadow: false })}${pictogram("clock", { cx: 146, cy: 830, size: 46, color: C.success, background: "#FFFFFF", radius: 38 })}${textLines({ x: 210, y: 802, lines: ["t₀ · AUSFALLFREIE ZEIT"], size: 19, weight: 850, fill: C.success })}${textLines({ x: 210, y: 848, lines: ["optionaler dritter Parameter", "setzt den Verteilungsbeginn"], size: 21, weight: 730, fill: C.deep, lineHeight: 1.28 })}`);
  return {
    svg: frame(scene, `${plot}${eta}${beta}${flexibility}${t0}`, {
      title: "Die Weibullverteilung",
      takeaway: "T steuert die Lage, b die Form und t₀ optional den ausfallfreien Beginn der Weibullverteilung.",
      archetype: "distribution-summary",
      layoutIntent: "reused-weibull-density-family-with-summary-parameter-anchors",
    }),
    targets: [
      target("weibull_density_curves", "Dichtekurven der Weibullverteilung"),
      target("weibull_density_eta", "Charakteristische Lebensdauer im Plot"),
      target("weibull_eta_meaning", "Bedeutung von T"),
      target("weibull_beta_meaning", "Bedeutung von b"),
      target("weibull_flexibility_summary", "Flexibles Anwendungsspektrum"),
      target("weibull_t0_parameter", "Ausfallfreie Zeit t null"),
    ],
    steps: [
      step("draw_weibull_density_curves", "weibull_density_curves", "draw", "Die Weibullverteilung ist durch zwei Parameter definiert."),
      step("show_weibull_density_eta", "weibull_density_eta", "show", "Zum einen durch die charakteristische Lebensdauer groß T"),
      step("show_weibull_eta_meaning", "weibull_eta_meaning", "show", "Zum einen durch die charakteristische Lebensdauer groß T"),
      step("show_weibull_beta_meaning", "weibull_beta_meaning", "show", "Und zum anderen durch den Formparameter b"),
      step("show_weibull_flexibility_summary", "weibull_flexibility_summary", "show", "Aufgrund der Flexibilität besitzt die Weibullverteilung ein sehr breites Anwendungsspektrum"),
      step("show_weibull_t0_parameter", "weibull_t0_parameter", "show", "Darüber hinaus lässt sich die Weibullverteilung auch mit Hilfe eines zusätzlichen, dritten Parameters"),
    ],
    brief: {
      archetype: "Wiederverwendeter Weibull-Dichteplot mit Zusammenfassungsankern",
      takeaway: "T steuert die Lage, b die Form und t₀ den optionalen ausfallfreien Beginn.",
      animation: "Kurvenfamilie; T samt Plotmarker; b; Flexibilität; t₀.",
    },
  };
}

function renderSlide77(scene) {
  const plot = plotAsset(77, "weibull_bathtub_network.svg", 62, 196, 1280, 736, "weibull_bathtub_network_plot");
  const sourceWarning = animGroup("weibull_separation_rule", "Schematische Darstellung und Trennregel", `${card(1380, 226, 442, 624, { fill: C.surface, stroke: C.border })}${textLines({ x: 1420, y: 278, lines: ["SCHEMATISCHE DARSTELLUNG"], size: 18, weight: 850, fill: C.failure })}<line x1="1420" y1="302" x2="1782" y2="302" stroke="${C.failure}" stroke-width="3"/>${textLines({ x: 1420, y: 364, lines: ["Die geknickte Linie verbindet", "drei getrennte", "Ausfallmechanismen."], size: 25, weight: 790, fill: C.deep, lineHeight: 1.32 })}<line x1="1420" y1="502" x2="1782" y2="502" stroke="${C.border}" stroke-width="2"/>${textLines({ x: 1420, y: 556, lines: ["AUSWERTUNGSREGEL"], size: 18, weight: 850, fill: C.success })}${textLines({ x: 1420, y: 608, lines: ["Datenpunkte nach", "Ausfallmechanismus", "trennen."], size: 25, weight: 810, fill: C.deep, lineHeight: 1.32 })}${card(1420, 720, 362, 82, { fill: C.successSoft, stroke: C.success, shadow: false })}${textLines({ x: 1601, y: 754, lines: ["EIN MECHANISMUS"], size: 18, weight: 850, fill: C.success, anchor: "middle" })}${textLines({ x: 1601, y: 785, lines: ["eine Weibullverteilung"], size: 20, weight: 790, fill: C.deep, anchor: "middle" })}`);
  return {
    svg: frame(scene, `${plot}${sourceWarning}`, {
      title: "Badewannenkurve im Weibullnetz",
      takeaway: "Die drei Formparameterklassen ordnen sich den Bereichen der Badewannenkurve zu; ein geknickter Verlauf steht schematisch für getrennt auszuwertende Mechanismen.",
      archetype: "coupled-bathtub-weibull-network-summary",
      layoutIntent: "aligned-bathtub-curve-and-segmented-weibull-paper-with-source-warning-and-separation-rule",
      density: "dense",
      designException: "Badewannenkurve, drei Weibull-Segmente und die Trennregel bilden die abschließende fachliche Zuordnung und werden gemeinsam ausgewertet.",
    }),
    targets: [
      target("weibull_bathtub_curve", "Badewannenkurve und Lebenszyklusbereiche"),
      target("weibull_bathtub_early", "b kleiner eins und Frühausfälle"),
      target("weibull_bathtub_random", "b gleich eins und Zufallsausfälle"),
      target("weibull_bathtub_wear", "b größer eins und Ermüdungs- sowie Verschleißausfälle"),
      target("weibull_separation_rule", "Schematische Darstellung und Trennregel"),
    ],
    steps: [
      step("draw_weibull_bathtub_curve", "weibull_bathtub_curve", "draw", "Zum Abschluss blicken wir noch einmal auf den Zusammenhang von Weibullverteilung und Badewannenkurve."),
      step("draw_weibull_bathtub_early", "weibull_bathtub_early", "draw", "Für b kleiner eins sinkt die Ausfallrate über der Zeit"),
      step("draw_weibull_bathtub_random", "weibull_bathtub_random", "draw", "Für b gleich eins ist die Ausfallrate Lambda konstant."),
      step("draw_weibull_bathtub_wear", "weibull_bathtub_wear", "draw", "Und für b größer eins ist im Bereich drei eine ansteigende Ausfallrate zu erkennen."),
      step("show_weibull_separation_rule", "weibull_separation_rule", "show", "Wir können also hiermit Ermüdungs- und Verschleißausfälle modellieren."),
    ],
    brief: {
      archetype: "Gekoppelte Badewannenkurve und Weibullnetz-Zuordnung",
      takeaway: "b kleiner, gleich oder größer eins verbindet die drei Mechanismen mit den drei Bereichen der Badewannenkurve.",
      animation: "Badewannenkontext; danach die drei vollständigen Mechanismensegmente in Sprecherreihenfolge; Trennregel erst mit der abschließenden Einordnung.",
    },
  };
}

function renderScene(scene) {
  if (caseSlides[scene.output_slide_number]) return renderCaseSlide(scene, caseSlides[scene.output_slide_number]);
  const renderers = { 2: renderSlide2, 5: renderSlide5, 6: renderSlide6, 7: renderSlide7, 8: renderSlide8, 9: renderSlide9, 10: renderSlide10, 11: renderSlide11, 12: renderSlide12, 13: renderSlide13, 14: renderSlide14, 15: renderSlide15, 16: renderSlide16, 17: renderSlide17, 18: renderSlide18, 19: renderSlide19, 20: renderSlide20, 21: renderSlide21, 22: renderSlide22, 23: renderSlide23, 24: renderSlide24, 25: renderSlide25, 26: renderSlide26, 27: renderSlide27, 28: renderSlide28, 29: renderSlide29, 30: renderSlide30, 31: renderSlide31, 32: renderSlide32, 33: renderSlide33, 34: renderSlide34, 35: renderSlide35, 36: renderSlide36, 37: renderSlide37, 38: renderSlide38, 39: renderSlide39, 40: renderSlide40, 41: renderSlide41, 42: renderSlide42, 43: renderSlide43, 44: renderSlide44, 45: renderSlide45, 46: renderSlide46, 47: renderSlide47, 48: renderSlide48, 49: renderSlide49, 50: renderSlide50, 51: renderSlide51, 52: renderSlide52, 53: renderSlide53, 54: renderSlide54, 55: renderSlide55, 56: renderSlide56, 57: renderSlide57, 58: renderSlide58, 59: renderSlide59, 60: renderSlide60, 61: renderSlide61, 62: renderSlide62, 63: renderSlide63, 64: renderSlide64, 65: renderSlide65, 66: renderSlide66, 67: renderSlide67, 68: renderSlide68, 69: renderSlide69, 70: renderSlide70, 71: renderSlide71, 72: renderSlide72, 73: renderSlide73, 74: renderSlide74, 75: renderSlide75, 76: renderSlide76, 77: renderSlide77 };
  const renderer = renderers[scene.output_slide_number];
  if (!renderer) throw new Error(`No renderer for slide ${scene.output_slide_number}`);
  return renderer(scene);
}

function copyMedia(slideNumber, sourceSlide, sourceName, targetName) {
  const source = path.join(sourceAssetRoot, `source_${String(sourceSlide).padStart(3, "0")}`, sourceName);
  const destination = localMedia(slideNumber, targetName);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

function copyReusableImageAsset(slideNumber, sourceName, targetName = sourceName) {
  const source = path.join(reusableImageAssetRoot, sourceName);
  const destination = localMedia(slideNumber, targetName);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function prepareLocalAssets(selected = null) {
  const wants = (slideNumber) => !selected || selected.has(slideNumber);
  if (wants(1)) copyMedia(1, 1, "img1.jpg", "a320neo-engine.jpg");
  if (wants(3)) copyMedia(3, 3, "img0.jpg", "takata-airbag.jpg");
  if (wants(4)) copyMedia(4, 4, "img1.jpg", "galaxy-note7.jpg");
  if (wants(8)) {
    copyMedia(8, 8, "img1.jpg", "industrial-plant.jpg");
    copyMedia(8, 8, "img4.jpg", "skf-source-banner.jpg");
  }
  for (const slideNumber of [30, 34, 39, 65, 66]) {
    if (!wants(slideNumber)) continue;
    copyReusableImageAsset(slideNumber, "nkw-6-speed-gearbox-cutaway-display.jpg");
    copyReusableImageAsset(slideNumber, "nkw-6-speed-gearbox-cutaway.asset.json", "nkw-6-speed-gearbox-cutaway.source.json");
  }
  for (const slideNumber of [46, 47]) {
    if (!wants(slideNumber)) continue;
    copyReusableImageAsset(slideNumber, "generated-pictograms/failed-industrial-system-pictogram.png", "failed-industrial-system-pictogram.png");
    copyReusableImageAsset(slideNumber, "generated-pictograms/failed-industrial-system-pictogram.asset.json", "failed-industrial-system-pictogram.source.json");
  }
  if (wants(10)) {
    for (const assetName of ["re1-costs", "re1-product-liability", "re1-customer-dissatisfaction"]) {
      copyReusableImageAsset(10, `generated-pictograms/education-v2/${assetName}.png`, `${assetName}.png`);
      copyReusableImageAsset(10, `generated-pictograms/education-v2/${assetName}.asset.json`, `${assetName}.source.json`);
    }
  }
  if (wants(12)) {
    copyReusableImageAsset(12, "generated-pictograms/education-v2/re1-reliability-cost-balance.png", "re1-reliability-cost-balance.png");
    copyReusableImageAsset(12, "generated-pictograms/education-v2/re1-reliability-cost-balance.asset.json", "re1-reliability-cost-balance.source.json");
  }

  if (wants(2)) writeJson(path.join(outputRoot, "slide_002", "data", "recall_statistics.json"), {
    schema_version: "reltestRecallStatistics/v1",
    source: "Digitized from the chart embedded in source slide 2; endpoints confirmed by narration.",
    years: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
    recall_actions: [116, 125, 133, 110, 112, 185, 228, 351, 333, 364, 390],
    affected_vehicles_million: [0.75, 1.4, 0.45, 1.1, 1.15, 1.2, 1.55, 3.65, 3.15, 2.6, 3.1],
  });
  if (wants(7)) writeJson(path.join(outputRoot, "slide_007", "data", "purchase_criteria.json"), {
    schema_version: "reltestPurchaseCriteria/v1",
    source: "Values derived from vector bar endpoints in source slide 7.",
    categories: ["Zuverlässigkeit", "Sicherheit", "Preis-/Leistungsverhältnis", "Geringer Spritverbrauch", "Einfache Bedienung", "Gute Innenausstattung", "Niedriger CO₂-Ausstoß", "Styling / Design", "Finanzierungsangebot", "Innovative Technik", "Image der Marke"],
    years: [2020, 2019, 2018, 2017],
    values: [
      [93.6, 93.6, 91.1, 88.0, 86.0, 83.1, 73.6, 71.2, 65.4, 63.8, 63.2],
      [93.4, 93.3, 91.5, 87.3, 85.7, 82.8, 77.2, 72.3, 65.3, 64.1, 63.6],
      [93.1, 93.3, 90.7, 86.3, 85.0, 82.5, 73.9, 71.4, 65.0, 63.8, 63.5],
      [93.6, 93.7, 90.2, 86.9, 85.7, 82.5, 74.2, 71.5, 64.7, 65.0, 64.8],
    ],
  });
  if (wants(10)) writeJson(path.join(outputRoot, "slide_010", "data", "stress_strength.json"), { schema_version: "reltestStressStrength/v1", x_min: 0, x_max: 12, stress_mean: 4.3, stress_sigma: 1.15, strength_mean: 6.4, strength_sigma: 1.15, visible_support_sigma: 2.6, failure_peak_ratio: 0.3, failure_label_x: 8.5, failure_label_y_ratio: 0.22, failure_label_anchor_x: 6.0, animation_targets: ["stress_distribution", "strength_distribution", "failure_overlap"] });
  if (wants(11)) writeJson(path.join(outputRoot, "slide_011", "data", "stress_strength.json"), { schema_version: "reltestStressStrength/v1", x_min: 0, x_max: 12, stress_mean: 4.3, stress_sigma: 1.15, previous_strength_mean: 6.4, strength_mean: 7.55, strength_sigma: 1.15, visible_support_sigma: 2.6, failure_peak_ratio: 0.22, failure_label_x: 10.15, failure_label_y_ratio: 0.16, failure_label_anchor_x: 6.5, animate_strength_shift: true, include_initial_strength_distribution: false, animation_shift_user_units: 74.8, animation_targets: ["shifted_strength_distribution", "failure_overlap"] });
  if (wants(12)) writeJson(path.join(outputRoot, "slide_012", "data", "stress_strength.json"), { schema_version: "reltestStressStrength/v1", x_min: 0, x_max: 12, stress_mean: 4.3, stress_sigma: 1.15, previous_strength_mean: 6.4, strength_mean: 8.35, strength_sigma: 1.15, visible_support_sigma: 2.6, failure_peak_ratio: 0.3, failure_label_x: 10.65, failure_label_y_ratio: 0.14, failure_label_anchor_x: 6.45, animation_targets: [] });
  if (wants(41)) writeJson(path.join(outputRoot, "slide_041", "data", "location_measure.json"), { schema_version: "reltestLocationMeasure/v1", measure: "mean", failure_times: [12, 18, 23, 29, 34, 42, 48], outlier: 82 });
  if (wants(42)) writeJson(path.join(outputRoot, "slide_042", "data", "location_measure.json"), { schema_version: "reltestLocationMeasure/v1", measure: "median", distribution: "lognormal", mu: 1.32, sigma: 0.48, probability: 0.5 });
  if (wants(43)) writeJson(path.join(outputRoot, "slide_043", "data", "location_measure.json"), { schema_version: "reltestLocationMeasure/v1", measure: "mode", distribution: "lognormal", mu: 1.32, sigma: 0.48 });
  if (wants(44)) writeJson(path.join(outputRoot, "slide_044", "data", "location_measure.json"), { schema_version: "reltestLocationMeasure/v1", measure: "comparison", distribution: "right_skewed_lognormal", mu: 1.32, sigma: 0.48 });
  if (wants(46)) writeJson(path.join(outputRoot, "slide_046", "data", "mttf.json"), { schema_version: "reltestMttf/v1", unit: "km", failure_times_thousand: [52, 92, 111, 151] });
  if (wants(49)) writeJson(path.join(outputRoot, "slide_049", "data", "bq_life.json"), { schema_version: "reltestBqLife/v1", unit: "km", probabilities_percent: [5, 10, 20, 50], lifetimes_km: [100000, 250000, 700000, 1200000] });
}

function writeBrief(scene, result) {
  const sourceList = scene.source_slides.map((slide) => `Folie${slide}.SVG`).join(", ");
  const text = `# Redesign-Brief ${scene.work_unit}\n\n## Identität\n\n- Modul: RE1\n- Zielszene: ${scene.work_unit}\n- Modus: full_slide\n- Quell-SVGs: ${sourceList}\n- Sprechertext: ${scene.spoken_text_sources.join(", ")}\n\n## Lernbotschaft\n\n${result.brief.takeaway}\n\n## Archetyp Und Komposition\n\n- Archetyp: ${result.brief.archetype}\n- Content-SVG: 1920 x 1080, RelTest-Education-Produktionspalette\n- Typografie: Oxanium ausschließlich für Display-Zahlen, Archivo für Fließtext und Labels\n- Sichtbare Titel, Footer, Logos und Szenenlabels bleiben vollständig dem nachgelagerten Video-Repository vorbehalten\n- Quellmedien: nur echte extrahierte Medien; PowerPoint-Lautsprecher ausgeschlossen\n\n## Animation\n\n${result.brief.animation}\n\n## QA-Schwerpunkte\n\n- vollständiger Inhaltstransfer gegen ${sourceList}\n- Triggerphrasen wortgetreu im Sprechertext\n- semantische Gruppen werden atomar und erst nach ihrem Kontext eingeblendet\n- lesbarer Endzustand bei 1920 x 1080\n- keine vom Content-SVG duplizierten Master-Elemente\n`;
  fs.writeFileSync(path.join(outputRoot, scene.work_unit, "redesign-brief.md"), text, "utf8");
}

function writeManifest(scene, result) {
  for (const animationStep of result.steps) {
    if (!scene.spoken_text.includes(animationStep.sourceText)) {
      throw new Error(`${scene.work_unit}: trigger phrase not found: ${animationStep.sourceText}`);
    }
  }
  writeJson(path.join(outputRoot, scene.work_unit, "scene.animation.v1.json"), {
    schemaVersion: "svgAnimationManifest/v1",
    svgPath: `${scene.work_unit}.svg`,
    defaults: { enterFrames: 16, exitFrames: 12, highlightDurFrames: 30, drawDurFrames: 42, transformDurFrames: 30 },
    targets: result.targets,
    steps: result.steps,
  });
}

function writeElementAnimationPlan(scene, result) {
  const stepsByTarget = new Map(result.steps.map((animationStep) => [animationStep.targetId, animationStep]));
  writeJson(path.join(outputRoot, scene.work_unit, "element-animation-plan.json"), {
    schema_version: "basisReElementAnimationPlan/v1",
    module_id: "RE1",
    work_unit: scene.work_unit,
    scene_id: scene.scene_id,
    source_slides: scene.source_slides,
    planning_basis: "chapter_redesign_plan_and_spoken_text",
    whole_scene_only_animation: result.steps.length === 0,
    collapsed_equivalent_source_states: [],
    groups: result.targets.map((target) => {
      const animationStep = stepsByTarget.get(target.targetId);
      return {
        target_id: target.targetId,
        label: target.label,
        action: animationStep?.action || "static",
        confidence: target.confidence || animationStep?.confidence || "high",
        semantic_grouping: "atomic",
        static_visibility: animationStep ? "hidden_until_trigger" : "visible",
      };
    }),
    steps: result.steps,
    qa: { issues: [], warnings: {}, open_questions: [] },
  });
}

function writeReport(scene, result) {
  writeJson(path.join(outputRoot, scene.work_unit, "redesign-report.json"), {
    schema_version: "reltestFullSlideRedesign/v1",
    module_id: "RE1",
    work_unit: scene.work_unit,
    scene_id: scene.scene_id,
    source_slides: scene.source_slides,
    output_mode: "full_slide",
    output_canvas: [1920, 1080],
    content_title: scene.content_title,
    target_ids: result.targets.map((item) => item.targetId),
    powerpoint_speaker_removed: true,
    source_geometry_reused: false,
    official_logo_status: "downstream-owned",
  });
}

function selectedSlideNumbers() {
  const optionIndex = process.argv.indexOf("--slides");
  if (optionIndex === -1) return null;
  const value = process.argv[optionIndex + 1];
  if (!value) throw new Error("--slides benötigt eine Foliennummer oder einen Bereich, z. B. 27 oder 27-31.");

  const selected = new Set();
  for (const token of value.split(",")) {
    const range = token.trim().match(/^(\d+)(?:-(\d+))?$/);
    if (!range) throw new Error(`Ungültige Folienauswahl: ${token}`);
    const start = Number(range[1]);
    const end = Number(range[2] || range[1]);
    for (let slide = Math.min(start, end); slide <= Math.max(start, end); slide += 1) selected.add(slide);
  }
  return selected;
}

function main() {
  const selected = selectedSlideNumbers();
  prepareLocalAssets(selected);
  if (process.argv.includes("--prepare-only")) {
    process.stdout.write(`Prepared local media and plot data for ${selected ? [...selected].sort((left, right) => left - right).map((slide) => `slide_${String(slide).padStart(3, "0")}`).join(", ") : "all RE1 scenes"}.\n`);
    return;
  }

  const scenes = scenePlan.scenes.slice(0, 77).filter((scene, index) => !selected || selected.has(index + 1));
  if (scenes.length === 0) throw new Error("Die Folienauswahl enthält keine generierbare RE1-Szene.");
  for (const scene of scenes) {
    const sceneDir = path.join(outputRoot, scene.work_unit);
    fs.mkdirSync(sceneDir, { recursive: true });
    const result = renderScene(scene);
    fs.writeFileSync(path.join(sceneDir, `${scene.work_unit}.svg`), `${result.svg}\n`, "utf8");
    writeManifest(scene, result);
    writeElementAnimationPlan(scene, result);
    writeBrief(scene, result);
    writeReport(scene, result);
  }
  process.stdout.write(`Generated ${scenes.length} RE1 full-slide redesign scene(s): ${scenes.map((scene) => scene.work_unit).join(", ")}.\n`);
}

main();
