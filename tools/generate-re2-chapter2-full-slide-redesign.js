const fs = require("fs");
const path = require("path");
const educationTheme = require("./reltest-education-theme");

const root = path.resolve(__dirname, "..");
const outRoot = path.join(root, "rebuild-proposals", "svg", "RE2");
const assetRoot = path.join(root, "components", "image-library", "re2-ch2-pv");
const pDiagramPictogramRoot = path.join(root, "components", "image-library", "generated-pictograms", "re2-p-diagram");
const corePictogramRoot = path.join(root, "components", "image-library", "generated-pictograms", "education-core");
const abcPictogramRoot = path.join(root, "components", "image-library", "generated-pictograms", "re2-abc-classes");
const systemLevelPictogramRoot = path.join(root, "components", "image-library", "generated-pictograms", "re2-system-levels");
const abcSourceMediaRoot = path.join(root, "analysis", "redesign-assets", "RE2-user-feedback-2026-08-27", "source_018");
const sourceMap = JSON.parse(fs.readFileSync(path.join(root, "analysis", "rebuild-plans", "RE2_source-reference-map.json"), "utf8"));
const scenes = sourceMap.mappings.filter((scene) => scene.chapter === 2);
const animated = process.argv.includes("--animated");

const C = educationTheme.colors;

const sceneMeta = {
  4: ["Systemgrenzen am Beispiel einer PV-Anlage", "Die Systemgrenze trennt PV-Anlage, Subsysteme und relevante Umwelt.", "system-landscape", "Konkrete PV-Komponenten mit äußerer und verschachtelter Systemgrenze."],
  6: ["Vom Umfeld bis zum Bauteil", "Eine saubere Systemanalyse ordnet Umwelt, System, Subsystem und Komponente.", "nested-system", "Quellnahe vierzeilige Ebenenmatrix mit konzentrischer Hierarchie und angeschlossener Systemgrenze."],
  8: ["Das P-Diagramm als Analysemodell", "Das P-Diagramm ordnet Eingänge, Steuergrößen, Störungen und Zielgrößen um ein System.", "p-diagram", "Vier Parametergruppen in einer klaren Kreuzstruktur."],
  9: ["P-Diagramm des Wechselrichters", "Am Wechselrichter werden Energie, Steuerung, Störungen und Zielgröße konkret.", "p-diagram", "Konkretes P-Diagramm mit Wechselrichter als System."],
  10: ["Ursache-Wirkungs-Diagramm (Ishikawa-Diagramm)", "Das Ishikawa-Diagramm strukturiert konkrete Ursachen des PV-Leistungsverlusts in fünf M-Kategorien.", "ishikawa", "Quellnahe Fischgräten-Topologie mit drei oberen und zwei unteren Ursachenkategorien."],
  11: ["Bauteilblockdiagramm: Prinzip", "Komponenten werden über Energie-, Stoff- und Informationsströme verbunden.", "component-block", "Zwei Komponenten innerhalb einer Systemgrenze und drei bidirektionale Flüsse."],
  13: ["Bauteilblockdiagramm des Wechselrichters", "Der Wechselrichter wird in Energiepfad, Steuerung, Kommunikation und Nebenfunktionen zerlegt.", "component-block-detailed", "Detaillierte, zonierte Komponenten- und Schnittstellenübersicht."],
  14: ["Von der Black Box zur Funktionsstruktur", "Eine abstrakte Gesamtfunktion wird über Ein- und Ausgangsgrößen beschrieben und in Teilfunktionen zerlegt.", "function-structure-principle", "Black Box oben und generische Zerlegung in drei Teilfunktionen darunter."],
  16: ["Funktionsstruktur", "Die detaillierte Wechselrichterstruktur ist die aufgeklappte Zerlegung der Hauptfunktion DC-Strom in AC-Strom.", "function-structure", "Obere DC-zu-AC-Hauptfunktion mit sichtbar aufgespannter Detailstruktur und acht Teilfunktionen."],
  17: ["ABC-Analyse: Ausgangsinventar", "Bauteile, Fehlermöglichkeiten und Ausfallmechanismen bilden die Grundlage der anschließenden ABC-Einstufung.", "risk-inventory-table", "Großformatige Inventartabelle ohne vorweggenommene ABC-Bewertung."],
  18: ["ABC-Einteilung von Ausfallmechanismen", "A- und B-Teile sind risikoreich; C-Teile gelten als risikoneutral.", "three-column-comparison", "Drei klar getrennte Bewertungsspalten mit Definition, Berechenbarkeit und Ausfallverhalten."],
  19: ["ABC-Analyse des Wechselrichters", "Die Einstufung macht die weiterzuverfolgenden A- und B-Risiken unmittelbar sichtbar.", "risk-inventory-table", "Großformatige Ergebnistabelle mit farbcodierter ABC-Einstufung."],
};

const animationSpec = {
  4: [
    ["pv_environment", "Umwelt und Schnittstellen", "Um die Wechselwirkungen der PV-Anlage mit der Umgebung zu betrachten"],
    ["pv_system", "System PV-Anlage", "Um zu beschreiben, welche Komponenten zu der PV-Anlage gehören"],
    ["pv_flows", "Energieflüsse und DC/DC-Wandler", "Jedes dieser Elemente kann wiederum als eigenes Subsystem betrachtet werden."],
    ["pv_inverter_boundary", "Subsystem Wechselrichter", "So hat der Wechselrichter beispielsweise wieder eine eigene Systemgrenze."],
  ],
  6: [
    ["level_environment", "Umwelt", "Da jedes technische System in einer Umwelt existiert"],
    ["level_system", "System", "Anschließend betrachten wir das technische System selbst."],
    ["level_subsystem", "Subsystem", "Das System kann dann weiter in Subsysteme unterteilt werden."],
    ["level_component", "Komponente", "Schließlich gelangen wir zur Komponentenebene."],
    ["level_focus", "Fokus Wechselrichter", "Nehmen wir an wir wollen im weiteren Verlauf nun den Wechselrichter näher analysieren."],
  ],
  8: [
    ["p_system", "System Produkt oder Prozess", "Das Parameter Diagramm stellt den Zusammenhang zwischen Systemparametern"],
    ["p_inputs", "Eingangs- und Stellgrößen", "Ganz links gibt es die Eingangsgrößen oder auch Stellgrößen"],
    ["p_controls", "Kontrollierbare Größen", "Zusätzlich gehen in das System kontrollierbare Größen oder Steuergrößen ein."],
    ["p_disturbances", "Störgrößen", "Unerwünschte Einflüsse, die wir nicht direkt kontrollieren können"],
    ["p_outputs", "Zielgrößen", "Aus dem System heraus gehen die Zielgrößen."],
    ["p_relations", "Wirkbeziehungen", "Die Klassifizierung dieser Größen innerhalb des P-Diagramms hilft uns"],
  ],
  9: [
    ["pi_system", "System Wechselrichter", "Die verschiedenen Systemparameter des Wechselrichters können wie folgt klassifiziert werden."],
    ["pi_inputs", "Gleichstrom", "Als Eingangsgröße oder Stellgröße wird der elektrische Gleichstrom definiert"],
    ["pi_controls", "Steuersignale", "Zusätzlich können sämtliche Signale, aber auch die Betätigungsenergie"],
    ["pi_disturbances", "Störgrößen", "Daneben gibt es noch eine ganze Reihe an Störgrößen."],
    ["pi_outputs", "Wechselstrom", "Die Zielgröße und damit die Ausgangsgröße des Wechselrichters ist der Wechselstrom."],
    ["pi_relations", "Wirkbeziehungen", "Dieser ist die vom Wechselrichter erzeugte elektrische Energie"],
  ],
  10: [
    ["ishi_framework", "Fischgräte und Wirkung", "In unserem Fall ist die unerwünschte Wirkung der Leistungsverlust der PV-Anlage."],
    ["ishi_material", "Materialien", "Zunächst werden alle Materialien bzw. Bauteile betrachtet"],
    ["ishi_machine", "Maschinen und Ausrüstung", "In der zweiten Gräte können die eingesetzten Maschinen und Ausrüstungen erfasst werden."],
    ["ishi_human", "Mensch", "Der Mensch spielt natürlich auch in technischen Systemen meist eine relevante Rolle."],
    ["ishi_methods", "Methoden", "Unter Methoden verstehen wir die Prozesse und Verfahren"],
    ["ishi_environment", "Milieu und Umwelt", "Zum Schluss gibt es noch die Umweltfaktoren"],
    ["ishi_reading_direction", "Leserichtung Wirkung zu Ursachen", "Das Ishikawa-Diagramm wird von rechts nach links gelesen"],
  ],
  11: [
    ["block_boundary", "Systemgrenze", "Nachdem wir die Systemgrenze definiert"],
    ["block_components", "Komponenten", "Hierzu werden sämtliche Baugruppen und Komponenten innerhalb des Systems erfasst."],
    ["block_energy", "Energiestrom", "Der Energiestrom repräsentiert dabei den Austausch von Energie."],
    ["block_material", "Stoffstrom", "Der Stoffstrom steht für den Transfer von Materialien oder Substanzen."],
    ["block_information", "Informationsstrom", "Und der Informationsstrom zeigt die Kommunikation oder den Datenaustausch an."],
  ],
  13: [
    ["inv_boundary", "Systemgrenze und Schnittstellen", "Als Beispiel betrachten wir das Bauteilblockdiagramm eines Wechselrichters."],
    ["inv_legend", "Legende der Flussarten", "Als Beispiel betrachten wir das Bauteilblockdiagramm eines Wechselrichters."],
    ["inv_aux", "Bordnetz und Lüfter", "Darin sind alle elektronischen Baugruppen und Komponenten dargestellt."],
    ["inv_energy", "Energiepfad", "Der Energiestrom im Leistungspfad des Wechselrichters kann eingezeichnet werden"],
    ["inv_communication", "Kommunikation", "Sämtliche Bauteile zur Kommunikation werden ebenfalls erfasst"],
    ["inv_control", "Steuerung und Überwachung", "ebenso alle Informationsströme und Messsignale innerhalb des Wechselrichters."],
    ["inv_environment", "Umwelteinflüsse und Abgaben", "Ein solcher Fall tritt beispielsweise durch thermische Energie"],
  ],
  14: [
    ["func_blackbox", "Black Box", "Dabei kann das System zunächst als Black-Box aufgefasst werden"],
    ["func_definition", "Abstrakte Aufgabenbeschreibung", "Die Funktion selbst ist die Aufgabenbeschreibung in neutraler Form"],
    ["func_decomposition", "Zerlegung in Teilfunktionen", "Auf System-Ebene kann eine Funktion meist in untergeordnete Teilfunktionen aufgeteilt werden"],
    ["func_relations", "Funktionsbeziehungen", "Wird die Summe dieser Teilfunktionen erfüllt, so ist auch die übergeordnete Funktion des Systems erfüllt."],
  ],
  16: [
    ["func16_overview", "Hauptfunktion DC-Strom zu AC-Strom", "Im Falle des Wechselrichters ist die Hauptfunktion die Umwandlung von Gleichstrom in Wechselstrom."],
    ["func16_detail", "Aufgeklappte Detailstruktur des Wechselrichters", "Dies kann dann wieder weiter aufgeteilt werden in alle für den Wechselrichter relevanten Teilfunktionen."],
  ],
  17: [
    ["abc17_header", "Inventarschema", "Hierzu werden zunächst alle kritischen Bauteile des Systems identifiziert und aufgelistet."],
    ["abc17_connectors", "Klemmen und Trennschalter", "Beispielsweise kann die D-C-Klemme ausfallen"],
    ["abc17_capacitor", "Kondensator", "Diesen Ausfallarten liegen wiederum spezifische Ausfallmechanismen bzw. Ausfallursachen, zugrunde."],
    ["abc17_semiconductor", "Leistungshalbleiter", "Diesen Ausfallarten liegen wiederum spezifische Ausfallmechanismen bzw. Ausfallursachen, zugrunde."],
    ["abc17_sensor", "Spannungs- und Stromsensor", "Diesen Ausfallarten liegen wiederum spezifische Ausfallmechanismen bzw. Ausfallursachen, zugrunde."],
    ["abc17_next", "Nächster Analyseschritt", "Für jeden Ausfallmechanismus wird nun eine eigene Kritikalitätsbewertung in Form einer ABC-Analyse durchgeführt."],
  ],
  18: [
    ["abc18_a", "A-Teile", "Dabei wird jeder Ausfallmechanismus als A-Teil, B-Teil oder C-Teil klassifiziert."],
    ["abc18_b", "B-Teile", "A-Teile und B-Teile gelten als risikoreich."],
    ["abc18_difference", "Unterschied A und B", "Der Unterschied zwischen ihnen besteht darin, dass die Belastung für A-Teile definierbar oder berechenbar ist."],
    ["abc18_c", "C-Teile", "C-Teile dagegen sind risikoneutral und müssen nicht weiterverfolgt werden."],
  ],
  19: [
    ["abc19_header", "Bewertungsschema", "Auf diese Weise erhält man eine Übersicht über alle relevanten Bauteile"],
    ["abc19_connectors", "Klemmen und Trennschalter", "Auf diese Weise erhält man eine Übersicht über alle relevanten Bauteile"],
    ["abc19_capacitor", "Kondensator", "Auf diese Weise erhält man eine Übersicht über alle relevanten Bauteile"],
    ["abc19_semiconductor", "Leistungshalbleiter", "Auf diese Weise erhält man eine Übersicht über alle relevanten Bauteile"],
    ["abc19_sensor", "Spannungs- und Stromsensor", "Auf diese Weise erhält man eine Übersicht über alle relevanten Bauteile"],
    ["abc19_transition", "Übergang zur FTA", "Als ergänzende Methode zur ABC-Klassifizierung eignet sich die Fehlerbaumanalyse."],
  ],
};

function esc(v) { return String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;"); }
function wrap(text, max) {
  const out = []; let line = "";
  for (const word of String(text).split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && next.length > max) { out.push(line); line = word; } else line = next;
  }
  if (line) out.push(line);
  return out;
}
function txt(x, y, text, size = 26, weight = 600, fill = C.text, anchor = "start") {
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" data-qc-padding="2">${esc(text)}</text>`;
}
function multi(x, y, width, text, size = 24, weight = 560, fill = C.text, anchor = "start", lineH = 1.25) {
  const max = Math.max(10, Math.floor(width / (size * .54)));
  const spans = wrap(text, max).map((line, i) => `<tspan x="${x}" dy="${i ? Math.round(size * lineH) : 0}">${esc(line)}</tspan>`).join("");
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" data-qc-padding="2">${spans}</text>`;
}
function stackText(x, y, width, text, size = 18, weight = 560, fill = C.text, lineH = 1.08) {
  const max = Math.max(10, Math.floor(width / (size * .54)));
  return wrap(text, max).map((value, i) => txt(x, y + i * Math.round(size * lineH), value, size, weight, fill)).join("");
}
function box(x, y, w, h, fill = C.surface, stroke = C.border, sw = 1.5, rx = 8) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
}
function group(id, label, body) {
  return `<g id="${id}"${animated ? ` data-anim-target="true" data-anim-label="${esc(label)}"` : ""}><title>${esc(label)}</title>${body}</g>`;
}
function line(x1, y1, x2, y2, color = C.deep, sw = 2.5, ends = "end", dash = "") {
  const markerStart = ends === "both" ? ` marker-start="url(#arrow_${color.slice(1)})"` : "";
  const markerEnd = ends === "none" ? "" : ` marker-end="url(#arrow_${color.slice(1)})"`;
  return `<path d="M ${x1} ${y1} L ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${sw}"${markerStart}${markerEnd}${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
}
function pathLine(d, color = C.deep, sw = 2.5, ends = "end", dash = "") {
  const markerStart = ends === "both" ? ` marker-start="url(#arrow_${color.slice(1)})"` : "";
  const markerEnd = ends === "none" ? "" : ` marker-end="url(#arrow_${color.slice(1)})"`;
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${markerStart}${markerEnd}${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
}
function pill(x, y, w, text, color, fill) {
  return `${box(x, y, w, 38, fill, color, 1.5, 19)}${txt(x + w / 2, y + 26, text, 18, 780, color, "middle")}`;
}
function evidence(markup, ref) {
  return markup.replace("<g ", `<g data-source-evidence="source_slide" data-source-reference="${esc(ref)}" `);
}
function mediaPath(n, filename) { return path.join(outRoot, `slide_${String(n).padStart(3, "0")}`, "media", filename); }
function dataUri(file) { return `data:image/png;base64,${fs.readFileSync(file).toString("base64")}`; }
function img(n, filename, x, y, w, h, label) {
  return `<image x="${x}" y="${y}" width="${w}" height="${h}" href="${dataUri(mediaPath(n, filename))}" preserveAspectRatio="xMidYMid meet" aria-label="${esc(label)}" data-source-media="true" data-source-evidence="user_request" data-source-reference="Nutzerfeedback: konkrete technische Abbildung statt generischer Box"/>`;
}
function pictogramImg(n, filename, kind, x, y, size) {
  return `<image x="${x}" y="${y}" width="${size}" height="${size}" href="${dataUri(mediaPath(n, filename))}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" data-component="reltest-pictogram" data-pictogram-style="reltest-education-minimal-v1" data-pictogram-kind="${esc(kind)}" data-source-media="true" data-source-evidence="user_request" data-source-reference="Nutzerfeedback: freigegebenes PNG-Piktogramm als visueller Lernanker"/>`;
}
function abcPictogramImg(filename, kind, x, y, size, label) {
  return `<image x="${x}" y="${y}" width="${size}" height="${size}" href="${dataUri(path.join(abcPictogramRoot, filename))}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" data-component="reltest-pictogram" data-pictogram-style="reltest-education-minimal-v1" data-pictogram-kind="${esc(kind)}" data-source-media="true" data-source-evidence="user_request" data-source-reference="Nutzerfeedback Szene 12: alt wirkende Quellbilder durch neu generierte PNG-Piktogramme ersetzen" data-qc-label="${esc(label)}"/>`;
}
function sourceMediaImg(filename, x, y, w, h, label) {
  return `<image x="${x}" y="${y}" width="${w}" height="${h}" href="${dataUri(path.join(abcSourceMediaRoot, filename))}" preserveAspectRatio="xMidYMid meet" aria-label="${esc(label)}" data-source-media="true" data-source-evidence="source_slide" data-source-reference="Quellfolie 18: technische Beispielabbildung für die ABC-Klasse"/>`;
}
function annotate(markup) {
  return markup
    .replace(/<text(?![^>]*data-qc-role)/g, '<text data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true"')
    .replace(/<tspan(?![^>]*data-qc-role)/g, '<tspan data-qc-role="text" data-qc-layer="text" data-qc-allow-overlap="true"')
    .replace(/<rect(?![^>]*data-qc-allow-overlap)/g, '<rect data-qc-allow-overlap="true"')
    .replace(/<image(?![^>]*data-qc-allow-overlap)/g, '<image data-qc-allow-overlap="true"')
    .replace(/<path(?![^>]*data-role)/g, '<path data-role="connector"')
    .replace(/<line(?![^>]*data-role)/g, '<line data-role="connector"');
}
function frame(scene, body) {
  const [defaultTitle, takeaway, archetype, layoutIntent] = sceneMeta[scene.output_slide_number];
  const title = scene.content_title_override || defaultTitle;
  const metadata = {
    artifactScope: "content-svg", embeddingTarget: "powerpoint-slide", slideType: archetype,
    contentTitle: title, layoutIntent, takeaway, density: [9, 13, 17, 18, 19].includes(scene.output_slide_number) ? "dense" : "normal",
    contentMode: "transparent-content", backgroundMode: "transparent", brandProfile: educationTheme.brandProfile,
    brandVariant: educationTheme.brandVariant, sourceSlides: scene.source_slides, officialLogoStatus: "pending-original-asset",
  };
  const markers = [...new Set([C.accent, C.deep, C.failure, C.success, C.secondary, C.educationAccent, C.cyan, C.technical, C.graphite, C.border])]
    .filter((color) => body.includes(color))
    .map((color) =>
    `<marker id="arrow_${color.slice(1)}" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1L11 6L1 11Z" fill="${color}"/></marker>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-labelledby="accessible_title accessible_description" data-artifact-scope="content-svg" data-embedding-target="powerpoint-slide" data-scene-id="${scene.scene_id}" data-brand-profile="${educationTheme.brandProfile}">
<metadata id="slide_quality_metadata" type="application/json"><![CDATA[${JSON.stringify(metadata)}]]></metadata>
<title id="accessible_title">${esc(title)}</title><desc id="accessible_description">${esc(takeaway)}</desc>
<defs>${markers}</defs>
<style>text{font-family:${educationTheme.bodyFontFamily};letter-spacing:0}</style>
<g id="scene_content" data-qc-group="scene_content" data-qc-layer="content">${annotate(body)}</g>
</svg>`;
}

function slide4() {
  const n = 4;
  const environment = group("pv_environment", "Umwelt und Schnittstellen",
    `${img(n, "electricity-meter.png", 1240, 438, 145, 170, "Stromzähler")}${txt(1312, 634, "Zähler", 23, 760, C.deep, "middle")}
     ${img(n, "public-grid-pylon.png", 1510, 260, 230, 330, "Öffentliches Netz")}${multi(1625, 626, 250, "Öffentliches Netz", 23, 760, C.deep, "middle")}
     ${img(n, "household-consumers.png", 1470, 666, 320, 200, "Hausverbraucher: Lampe, Fernseher und Waschmaschine")}${multi(1630, 892, 300, "Hausverbraucher", 23, 760, C.deep, "middle")}`);
  const system = group("pv_system", "System PV-Anlage",
    `<rect x="104" y="224" width="1122" height="664" rx="18" fill="${C.accentSoft}" fill-opacity=".28" stroke="${C.accent}" stroke-width="3" stroke-dasharray="12 8"/>
     ${pill(130, 246, 252, "Systemgrenze PV-Anlage", C.accent, C.surface)}
     ${img(n, "pv-panels.png", 152, 386, 292, 285, "PV-Module")}${txt(298, 716, "PV-Module", 24, 780, C.deep, "middle")}
     ${img(n, "inverter.png", 526, 390, 245, 270, "Wechselrichter")}${txt(648, 716, "Wechselrichter", 24, 780, C.deep, "middle")}
     ${img(n, "battery-storage.png", 914, 630, 185, 190, "Batteriespeicher")}${multi(1006, 856, 220, "Batteriespeicher", 23, 780, C.deep, "middle")}
     ${box(875, 338, 260, 112, C.surface, C.secondary, 2)}${multi(1005, 378, 220, "DC/DC-Wandler", 25, 780, C.secondary, "middle")}`);
  const inverterBoundary = group("pv_inverter_boundary", "Subsystem Wechselrichter",
    `<rect x="480" y="300" width="334" height="496" rx="16" fill="none" stroke="${C.secondary}" stroke-width="3" stroke-dasharray="9 7" data-role="connector" data-qc-role="connector"/>${pill(500, 318, 294, "Systemgrenze Wechselrichter", C.secondary, C.surface)}`);
  const flows = group("pv_flows", "Energieflüsse und DC/DC-Wandler",
    `${line(430, 530, 530, 530, C.accent, 3)}${pill(444, 475, 74, "DC", C.accent, C.surface)}
     ${pathLine("M 770 526 H 1260 V 500", C.deep, 3)}${pill(1115, 472, 74, "AC", C.deep, C.surface)}
     ${line(1385, 500, 1515, 450, C.deep, 3, "both")}${line(1385, 535, 1510, 755, C.deep, 3)}
     ${pathLine("M 775 590 H 865 V 394", C.accent, 3)}${pathLine("M 1005 450 V 630", C.accent, 3, "both")}
     ${pill(790, 610, 74, "DC", C.accent, C.surface)}${pill(970, 472, 74, "DC", C.accent, C.surface)}${pill(1406, 566, 74, "AC", C.deep, C.surface)}`);
  return evidence(environment, "Quellfolien 4–5: Umwelt") + evidence(system, "Quellfolien 4–5: PV-Anlage") + evidence(inverterBoundary, "Quellfolie 5: Wechselrichtergrenze") + evidence(flows, "Quellfolien 4–5: DC-/AC-Flüsse");
}

function slide6() {
  const bullet = (x, y, label, width = 250, size = 22) =>
    `<rect x="${x}" y="${y - 8}" width="7" height="7" fill="${C.deep}"/>${multi(x + 22, y, width, label, size, 620, C.deep, "start", 1.12)}`;
  const context = `<g id="level_structure_context" data-anim-label="Konzentrische Systemebenen und Tabellenraster"><title>Konzentrische Systemebenen und Tabellenraster</title>
     <path d="M 520 218 A 322 322 0 0 0 520 862 Z" fill="${C.accent}"/>
     <path d="M 520 373 A 244 244 0 0 0 520 861" fill="none" stroke="${C.surface}" stroke-width="4"/>
     <path d="M 520 528 A 166 166 0 0 0 520 860" fill="none" stroke="${C.surface}" stroke-width="4"/>
     <path d="M 520 683 A 89.5 89.5 0 0 0 520 862" fill="none" stroke="${C.surface}" stroke-width="4"/>
     <rect x="520" y="218" width="900" height="645" fill="${C.surface}" stroke="${C.deep}" stroke-width="3"/>
     <path d="M 520 373 H 1420 M 520 528 H 1420 M 520 683 H 1420 M 520 838 H 1420" fill="none" stroke="${C.deep}" stroke-width="3"/>
   </g>`;
  const environment = group("level_environment", "Umwelt",
    `${txt(540, 258, "Umwelt", 27, 800, C.deep)}
     ${pictogramImg(6, "re2-level-environment.png", "system-level-environment", 650, 266, 96)}
     ${bullet(800, 258, "Standort", 220)}
     ${bullet(1080, 258, "Umwelteinflüsse", 260)}
     ${bullet(800, 316, "Umgebungseinflüsse", 250)}
     ${bullet(1080, 316, "Gesetzliche Regularien & Anforderungen", 300, 20)}`);
  const system = group("level_system", "System",
    `${txt(540, 413, "Systemebene", 27, 800, C.deep)}
     ${pictogramImg(6, "re2-level-pv-system.png", "system-level-pv-system", 650, 421, 96)}
     ${bullet(800, 413, "Anlagentyp", 220)}
     ${bullet(1080, 413, "Elektrische Verschaltung", 280, 21)}
     ${bullet(800, 471, "Betriebsstrategie", 250)}
     ${bullet(1080, 471, "Nennleistung", 240)}`);
  const subsystem = group("level_subsystem", "Subsystem",
    `${txt(540, 568, "Subsystemebene", 27, 800, C.deep)}
     ${pictogramImg(6, "re2-level-inverter.png", "system-level-inverter", 650, 576, 96)}
     ${bullet(800, 598, "Wechselrichter", 205)}
     ${bullet(1035, 598, "PV-Modul", 160)}
     ${bullet(1218, 598, "Batteriesystem", 180)}`);
  const component = group("level_component", "Komponente",
    `${txt(540, 723, "Komponentenebene", 25, 800, C.deep)}
     ${pictogramImg(6, "re2-level-microcontroller.png", "system-level-microcontroller", 650, 731, 96)}
     ${bullet(800, 780, "Mikrocontroller", 220)}
     ${bullet(1060, 780, "Weitere Baugruppen oder Bauteile", 330, 20)}`);
  const focus = group("level_focus", "Fokus Wechselrichter",
    `<path d="M 520 528 H 1420 V 838 H 520 A 155 155 0 0 1 520 528 Z" fill="${C.technical}" fill-opacity=".18" stroke="none"/>
     <path d="M 520 528 H 1690 V 838 H 520 A 155 155 0 0 1 520 528 Z" fill="none" stroke="${C.failure}" stroke-width="4" stroke-dasharray="14 10" stroke-linejoin="round"/>
     ${multi(1470, 300, 290, "Schnittstelle für Wechselwirkungen zur Umgebung", 25, 760, C.deep, "start", 1.18)}
     ${line(1490, 430, 1490, 504, C.failure, 4)}${line(1570, 430, 1570, 504, C.failure, 4)}${line(1650, 430, 1650, 504, C.failure, 4)}
     ${txt(1554, 700, "SYSTEMGRENZE", 25, 820, C.failure, "middle")}`);
  return evidence(context, "Quellfolien 6–7: konzentrische Ebenenmatrix") + evidence(environment, "Quellfolien 6–7: Umwelt") + evidence(system, "Quellfolien 6–7: System") + evidence(subsystem, "Quellfolien 6–7: Subsysteme") + evidence(component, "Quellfolien 6–7: Komponenten") + evidence(focus, "Quellfolie 7: Wechselrichter-Fokus und Systemgrenze");
}

function pNode(x, y, w, h, labelText, color, fill, id, label) {
  return group(id, label, `${box(x, y, w, h, fill, color, 2.5, 12)}${multi(x + w / 2, y + h / 2 - 4, w - 40, labelText, 27, 760, color, "middle")}`);
}
function slide8() {
  const center = group("p_system", "System Produkt oder Prozess",
    `${box(710, 386, 500, 252, C.accent, C.accent, 2.5, 14)}
     ${txt(960, 450, "SYSTEM", 18, 820, C.accentSoft, "middle")}
     ${multi(960, 520, 420, "Produkt / Prozess", 34, 820, C.surface, "middle")}
     ${multi(960, 582, 390, "wandelt Einwirkungen in ein gewünschtes Ergebnis", 20, 620, C.surface, "middle", 1.12)}`);
  const inputs = group("p_inputs", "Eingangs- und Stellgrößen",
    `${box(92, 406, 492, 212, C.surface, C.accent, 2.2, 12)}${box(92, 406, 12, 212, C.accent, C.accent, 0, 6)}
     ${pictogramImg(8, "re2-p-diagram-input.png", "p-diagram-input", 122, 450, 124)}
     ${txt(276, 472, "EINGANG", 18, 820, C.secondary)}
     ${multi(276, 518, 270, "Eingangsgrößen / Stellgrößen", 25, 780, C.accent, "start", 1.12)}`);
  const controls = group("p_controls", "Kontrollierbare Größen",
    `${box(660, 180, 600, 154, C.surface, C.secondary, 2.2, 12)}${box(660, 180, 600, 10, C.accent, C.accent, 0, 5)}
     ${pictogramImg(8, "re2-p-diagram-control.png", "p-diagram-control", 698, 202, 112)}
     ${txt(842, 228, "GEZIELT BEEINFLUSSBAR", 18, 820, C.secondary)}
     ${multi(842, 270, 370, "Kontrollierbare Größen / Steuergrößen", 23, 760, C.accent, "start", 1.1)}`);
  const disturbances = group("p_disturbances", "Störgrößen",
    `${box(660, 704, 600, 154, C.surface, C.failure, 2.2, 12)}${box(660, 704, 600, 10, C.failure, C.failure, 0, 5)}
     ${pictogramImg(8, "re2-p-diagram-disturbance.png", "p-diagram-disturbance", 698, 726, 112)}
     ${txt(842, 752, "NICHT DIREKT KONTROLLIERBAR", 18, 820, C.failure)}
     ${multi(842, 794, 370, "Störgrößen", 25, 780, C.accent, "start", 1.1)}`);
  const outputs = group("p_outputs", "Zielgrößen",
    `${box(1336, 406, 492, 212, C.surface, C.accent, 2.2, 12)}${box(1816, 406, 12, 212, C.accent, C.accent, 0, 6)}
     ${pictogramImg(8, "re2-p-diagram-output.png", "p-diagram-output", 1364, 450, 124)}
     ${txt(1518, 472, "ERGEBNIS", 18, 820, C.secondary)}
     ${multi(1518, 518, 270, "Ausgangsgrößen / Zielgrößen", 25, 780, C.accent, "start", 1.12)}`);
  const rel = group("p_relations", "Wirkbeziehungen",
    `${line(584, 512, 710, 512, C.accent, 2.8)}${line(960, 334, 960, 386, C.accent, 2.8)}${line(960, 704, 960, 638, C.failure, 2.8)}${line(1210, 512, 1336, 512, C.accent, 2.8)}`);
  return evidence(center + inputs + controls + disturbances + outputs + rel, "Quellfolie 8: generisches P-Diagramm; keine Systemgrenze");
}
function slide9() {
  const center = group("pi_system", "System Wechselrichter",
    `<rect x="686" y="348" width="548" height="340" rx="18" fill="${C.surface}" stroke="${C.secondary}" stroke-width="3" stroke-dasharray="10 7"/>${pill(710, 370, 178, "SYSTEMGRENZE", C.secondary, C.surface)}
     ${img(9, "inverter.png", 804, 408, 310, 220, "Wechselrichter")}${txt(960, 660, "Wechselrichter", 29, 800, C.deep, "middle")}`);
  const inputs = pNode(102, 448, 360, 132, "Gleichstrom (DC)", C.accent, C.accentSoft, "pi_inputs", "Gleichstrom");
  const controls = group("pi_controls", "Steuersignale", `${box(684, 184, 552, 120, C.successSoft, C.success, 2.5, 12)}${txt(960, 224, "KONTROLLIERBARE GRÖSSEN", 18, 780, C.success, "middle")}${multi(960, 258, 500, "Signal · SOS-Signal · Betätigungsenergie", 24, 720, C.deep, "middle")}`);
  const disturb = group("pi_disturbances", "Störgrößen", `${box(684, 746, 552, 120, C.failureSoft, C.failure, 2.5, 12)}${txt(960, 786, "STÖRGRÖSSEN", 18, 780, C.failure, "middle")}${multi(960, 820, 500, "Vibration · Schmutz · Wärme · Feuchtigkeit", 24, 720, C.deep, "middle")}`);
  const outputs = pNode(1458, 448, 360, 132, "Wechselstrom (AC)", C.secondary, C.secondarySoft, "pi_outputs", "Wechselstrom");
  const rel = group("pi_relations", "Wirkbeziehungen", `${line(462, 514, 686, 514, C.accent, 3)}${line(960, 304, 960, 348, C.success, 3)}${line(960, 746, 960, 688, C.failure, 3)}${line(1234, 514, 1458, 514, C.secondary, 3)}`);
  return evidence(center + inputs + controls + disturb + outputs + rel, "Quellfolie 9: P-Diagramm Wechselrichter");
}

function ishCategory(id, label, config) {
  const {
    ribbonX, ribbonY, ribbonW, boneStartX, boneStartY, boneEndX, boneEndY,
    examples, sourceLabel,
  } = config;
  const ribbon = `<path d="M ${ribbonX} ${ribbonY} H ${ribbonX + ribbonW - 42} L ${ribbonX + ribbonW} ${ribbonY + 40} L ${ribbonX + ribbonW - 42} ${ribbonY + 80} H ${ribbonX} Z" fill="${C.accentSoft}" stroke="${C.accent}" stroke-width="2.5" stroke-linejoin="round"/>
    <rect x="${ribbonX}" y="${ribbonY}" width="14" height="80" fill="${C.accent}"/>
    ${multi(ribbonX + (ribbonW / 2) - 8, ribbonY + 31, ribbonW - 70, label, 24, 800, C.accent, "middle", 1.05)}`;
  const bone = pathLine(`M ${boneStartX} ${boneStartY} L ${boneEndX} ${boneEndY}`, C.accent, 3, "none");
  const tributaries = examples.map((example) =>
    `${pathLine(`M ${example.x1} ${example.y} L ${example.x2} ${example.y}`, C.secondary, 1.8)}
     ${multi((example.x1 + example.x2) / 2, example.labelY || example.y - 14, example.x2 - example.x1 - 10, example.label, 20, 610, C.text, "middle", 1.05)}`
  ).join("");
  return evidence(group(id, label, `${ribbon}${bone}${tributaries}`), `Quellfolie 10: ${sourceLabel}`);
}
function slide10() {
  const framework = evidence(group("ishi_framework", "Fischgräte und Wirkung",
    `<path d="M 132 548 H 1462" fill="none" stroke="${C.deep}" stroke-width="5"/>
     <path d="M 132 548 L 88 500 M 132 548 L 88 596" fill="none" stroke="${C.deep}" stroke-width="5" stroke-linecap="round"/>
     <path d="M 1462 432 H 1706 L 1812 548 L 1706 664 H 1462 Z" fill="${C.deep}" stroke="${C.accent}" stroke-width="3" stroke-linejoin="round"/>
     ${txt(1634, 486, "WIRKUNG", 20, 800, C.failure, "middle")}
     ${multi(1634, 532, 300, "Leistungsverlust der PV-Anlage", 31, 820, C.surface, "middle", 1.15)}
     ${txt(136, 518, "URSACHEN", 18, 800, C.soft)}`), "Quellfolie 10: Hauptachse und Wirkung Leistungsverlust der PV-Anlage");

  const material = ishCategory("ishi_material", "Materialien", {
    ribbonX: 120, ribbonY: 202, ribbonW: 305,
    boneStartX: 425, boneStartY: 242, boneEndX: 630, boneEndY: 548,
    examples: [
      { x1: 214, y: 350, x2: 497, labelY: 320, label: "Qualität elektrischer Bauteile" },
      { x1: 304, y: 426, x2: 548, label: "Verkabelung" },
    ],
    sourceLabel: "Materialien mit Qualität elektrischer Bauteile und Verkabelung",
  });
  const machine = ishCategory("ishi_machine", "Maschinen (Ausrüstung)", {
    ribbonX: 510, ribbonY: 202, ribbonW: 320,
    boneStartX: 830, boneStartY: 242, boneEndX: 1038, boneEndY: 548,
    examples: [
      { x1: 624, y: 350, x2: 903, label: "Montagestruktur" },
      { x1: 706, y: 426, x2: 955, label: "Überwachungssysteme" },
    ],
    sourceLabel: "Maschinen und Ausrüstung mit Montagestruktur und Überwachungssystemen",
  });
  const human = ishCategory("ishi_human", "Mensch", {
    ribbonX: 920, ribbonY: 202, ribbonW: 275,
    boneStartX: 1195, boneStartY: 242, boneEndX: 1398, boneEndY: 548,
    examples: [
      { x1: 954, y: 350, x2: 1267, label: "Fehler bei der Installation" },
      { x1: 1082, y: 426, x2: 1317, label: "Wartungsfehler" },
    ],
    sourceLabel: "Mensch mit Installations- und Wartungsfehlern",
  });
  const methods = ishCategory("ishi_methods", "Methoden", {
    ribbonX: 300, ribbonY: 790, ribbonW: 310,
    boneStartX: 610, boneStartY: 830, boneEndX: 824, boneEndY: 548,
    examples: [
      { x1: 390, y: 710, x2: 701, labelY: 665, label: "Wartungsintervalle und -protokolle" },
      { x1: 482, y: 642, x2: 753, labelY: 597, label: "Standards bei Installation" },
    ],
    sourceLabel: "Methoden mit Standards und Wartungsintervallen",
  });
  const environment = ishCategory("ishi_environment", "Milieu (Umwelt)", {
    ribbonX: 700, ribbonY: 790, ribbonW: 320,
    boneStartX: 1020, boneStartY: 830, boneEndX: 1234, boneEndY: 548,
    examples: [
      { x1: 796, y: 710, x2: 1111, label: "Schattenwurf durch Objekte" },
      { x1: 890, y: 642, x2: 1163, label: "Wetterbedingungen" },
    ],
    sourceLabel: "Milieu und Umwelt mit Wetterbedingungen und Schattenwurf",
  });
  const readingDirection = group("ishi_reading_direction", "Leserichtung Wirkung zu Ursachen",
    `<path d="M 1370 912 H 1010" fill="none" stroke="${C.secondary}" stroke-width="2.5" stroke-dasharray="8 7" marker-end="url(#arrow_${C.secondary.slice(1)})"/>`)
    .replace("<g ", `<g data-source-evidence="speaker_text" data-source-reference="Sprechertext section_007: von rechts nach links gelesen" `);
  return framework + material + machine + human + methods + environment + readingDirection;
}

function slide11() {
  const boundary = group("block_boundary", "Systemgrenze",
    `<rect x="350" y="232" width="1220" height="630" rx="20" fill="${C.accentSoft}" fill-opacity=".25" stroke="${C.accent}" stroke-width="3" stroke-dasharray="12 8"/>${pill(382, 256, 170, "SYSTEMGRENZE", C.accent, C.surface)}`);
  const components = group("block_components", "Komponenten",
    `${box(560, 394, 300, 300, C.deep, C.deep, 2.5, 14)}${txt(710, 534, "Komponente 1", 34, 800, C.surface, "middle")}${multi(710, 580, 250, "Teilfunktion im System", 21, 600, C.border, "middle")}
     ${box(1060, 394, 300, 300, C.deep, C.deep, 2.5, 14)}${txt(1210, 534, "Komponente 2", 34, 800, C.surface, "middle")}${multi(1210, 580, 250, "gekoppelte Teilfunktion", 21, 600, C.border, "middle")}`);
  const energy = group("block_energy", "Energiestrom", `${txt(180, 390, "Energiestrom", 22, 760, C.deep)}${line(110, 420, 560, 420, C.deep, 3, "both")}${line(860, 420, 1060, 420, C.deep, 3, "both")}${line(1360, 420, 1810, 420, C.deep, 3, "both")}`);
  const material = group("block_material", "Stoffstrom", `${txt(180, 520, "Stoffstrom", 22, 760, C.accent)}${line(110, 550, 560, 550, C.accent, 3, "both")}${line(860, 550, 1060, 550, C.accent, 3, "both")}${line(1360, 550, 1810, 550, C.accent, 3, "both")}`);
  const info = group("block_information", "Informationsstrom", `${txt(180, 650, "Informationsstrom", 22, 760, C.cyan)}${line(110, 680, 560, 680, C.cyan, 3, "both")}${line(860, 680, 1060, 680, C.cyan, 3, "both")}${line(1360, 680, 1810, 680, C.cyan, 3, "both")}`);
  return evidence(boundary + components + energy + material + info, "Quellfolien 11–12: Systemgrenze, Komponenten und bidirektionale Flüsse");
}

function smallBlock(x, y, w, h, text, color = C.deep, fill = C.surface, size = 18) {
  const fontSize = Math.max(18, size);
  const lines = String(text).split("|");
  const textMarkup = lines.length === 1
    ? multi(x + w / 2, y + h / 2 + 1, w - 18, text, fontSize, 700, color, "middle", 1.1)
    : lines.map((value, i) => txt(x + w / 2, y + h / 2 - ((lines.length - 1) * fontSize * .55) + i * fontSize * 1.1, value, fontSize, 700, color, "middle")).join("");
  return `${box(x, y, w, h, fill, color, 1.8, 7)}${textMarkup}`;
}
function slide13() {
  const boundary = group("inv_boundary", "Systemgrenze und Schnittstellen",
    `<rect x="230" y="196" width="1460" height="718" rx="18" fill="${C.surface}" fill-opacity=".76" stroke="${C.failure}" stroke-width="2.8" stroke-dasharray="12 8"/>
     ${pill(256, 216, 366, "SYSTEMGRENZE WECHSELRICHTER", C.failure, C.surface)}`);
  const legend = group("inv_legend", "Legende der Flussarten",
    `${box(650, 208, 1006, 66, C.surface, C.border, 1.2, 8)}
     ${pathLine("M 674 230 H 722", C.failure, 2.4, "none", "9 6")}${txt(734, 237, "Systemgrenze", 18, 730, C.deep)}
     ${line(884, 230, 932, 230, C.deep, 2.4, "none")}${txt(944, 237, "Energiestrom", 18, 730, C.deep)}
     ${line(1094, 230, 1142, 230, C.technical, 2.4, "none")}${txt(1154, 237, "Bordnetzstrom", 18, 730, C.deep)}
     ${line(1312, 230, 1360, 230, C.secondary, 2.4, "none")}${txt(1372, 237, "Informationsstrom", 18, 730, C.deep)}
     ${line(674, 254, 722, 254, C.graphite, 2.4, "none")}${txt(734, 261, "Messsignal", 18, 730, C.deep)}
     ${line(884, 254, 932, 254, C.educationAccent, 2.4, "none")}${txt(944, 261, "Stoff-/Umwelteinfluss", 18, 730, C.deep)}`);
  const energy = group("inv_energy", "Energiepfad",
    `${multi(104, 336, 112, "DC-ENERGIE (Gleichstrom)", 18, 780, C.technical, "middle", 1.08)}
     ${multi(1810, 336, 126, "AC-ENERGIE (Wechselstrom)", 18, 780, C.technical, "middle", 1.08)}
     ${line(170, 349, 270, 349, C.deep, 2.6)}${line(400, 349, 420, 349, C.deep, 2.6, "none")}${line(580, 349, 600, 349, C.deep, 2.6, "none")}${line(735, 349, 755, 349, C.deep, 2.6, "none")}
     ${line(875, 349, 895, 349, C.deep, 2.6, "none")}${line(1055, 349, 1075, 349, C.deep, 2.6, "none")}${line(1205, 349, 1225, 349, C.deep, 2.6, "none")}${line(1395, 349, 1415, 349, C.deep, 2.6, "none")}${line(1530, 349, 1748, 349, C.deep, 2.6)}
     ${smallBlock(270, 306, 130, 86, "DC-|Klemmen", C.accent, C.surfaceSoft, 18)}
     ${smallBlock(420, 306, 160, 86, "DC-Fehlerstrom-|überwachung", C.accent, C.surfaceSoft, 18)}
     ${smallBlock(600, 306, 135, 86, "DC-Trenn-|schalter", C.accent, C.surfaceSoft, 18)}
     ${smallBlock(755, 306, 120, 86, "EMV-|Filter", C.accent, C.surfaceSoft, 18)}
     ${smallBlock(895, 298, 160, 102, "Hoch-/Tiefsetz-|steller", C.accent, C.surfaceSoft, 18)}
     ${smallBlock(1075, 306, 130, 86, "Zwischen-|kreis", C.accent, C.surfaceSoft, 18)}
     ${smallBlock(1225, 298, 170, 102, "H-Brücken-|schaltung", C.accent, C.surfaceSoft, 18)}
     ${smallBlock(1415, 306, 115, 86, "AC-|Filter", C.accent, C.surfaceSoft, 18)}`);
  const control = group("inv_control", "Steuerung und Überwachung",
    `${pathLine("M 800 486 V 450 H 975 V 400", C.graphite, 2.2)}
     ${pathLine("M 960 486 V 438 H 1310 V 400", C.graphite, 2.2)}
     ${line(1040, 540, 1100, 540, C.graphite, 2.2)}${line(1290, 540, 1320, 540, C.graphite, 2.2)}${line(1410, 540, 1430, 540, C.graphite, 2.2)}${line(1520, 540, 1540, 540, C.graphite, 2.2)}
     ${pathLine("M 1595 574 V 598", C.graphite, 2.2)}
     ${box(720, 486, 320, 108, C.accent, C.accent, 2, 10)}${txt(880, 548, "MICROCONTROLLER", 23, 820, C.surface, "middle")}
     ${smallBlock(1100, 500, 190, 80, "Netzüberwachung|AC", C.accent, C.surfaceSoft, 18)}
     ${smallBlock(1320, 506, 90, 68, "Relais", C.accent, C.surface)}${smallBlock(1430, 506, 90, 68, "Relais", C.accent, C.surface)}
     ${smallBlock(1540, 506, 110, 68, "EMV-|Filter", C.accent, C.surface, 18)}${smallBlock(1540, 598, 110, 68, "AC-|Klemmen", C.accent, C.surface, 18)}
     ${txt(810, 430, "U, I", 18, 740, C.graphite)}${txt(1068, 420, "Tastgrad · Messsignale", 18, 700, C.graphite)}
     ${txt(1068, 526, "I, f, U", 18, 740, C.graphite)}`);
  const aux = group("inv_aux", "Bordnetz und Lüfter",
    `${pathLine("M 380 626 V 440 H 815 V 392", C.technical, 2.2)}${line(460, 663, 500, 663, C.technical, 2.2, "none")}${pathLine("M 640 663 H 700 V 594", C.technical, 2.2)}
     ${smallBlock(300, 626, 160, 74, "DC-Bordnetz", C.technical, C.surfaceSoft)}${smallBlock(500, 626, 140, 74, "Lüfter", C.technical, C.surfaceSoft)}
     ${txt(652, 648, "Drehzahl", 18, 700, C.technical)}`);
  const comm = group("inv_communication", "Kommunikation",
    `${smallBlock(640, 706, 640, 66, "Kommunikationseinheit", C.accent, C.surfaceSoft, 20)}
     ${line(345, 808, 1575, 808, C.secondary, 2.2, "none")}
     ${[345,550,755,960,1165,1370,1575].map((x) => line(x, 808, x, 832, C.secondary, 2, "none")).join("")}
     ${["Display", "Bluetooth", "RS232", "RS485", "Funk", "Ethernet", "WLAN"].map((t, i) => smallBlock(260 + i * 205, 832, 170, 52, t, C.accent, C.surface, 18)).join("")}
     ${pathLine("M 1062 772 V 934", C.secondary, 2.2, "both")}
     ${multi(1062, 958, 760, "Kommunikationsdaten · Netzsignal ↕ Betriebsdaten", 18, 720, C.secondary, "middle")}`);
  const environment = group("inv_environment", "Umwelteinflüsse und Abgaben",
    `${box(34, 478, 174, 104, C.surface, C.accent, 1.8, 10)}${txt(121, 514, "BETÄTIGUNG", 18, 820, C.accent, "middle")}${multi(121, 548, 140, "Betätigungsenergie", 18, 680, C.accent, "middle")}
     ${pathLine("M 208 530 H 244 V 663 H 300", C.accent, 2.2)}
     ${box(34, 612, 174, 196, C.failureSoft, C.failure, 1.8, 10)}${txt(121, 648, "STÖRGRÖSSEN", 18, 820, C.failure, "middle")}${multi(121, 686, 136, "Thermische Energie · Verschmutzung · Feuchtigkeit · Störsignale", 18, 650, C.text, "middle", 1.13)}
     ${line(208, 676, 230, 676, C.failure, 2.2, "none")}${line(208, 724, 230, 724, C.educationAccent, 2.2, "none")}${line(208, 772, 230, 772, C.graphite, 2.2, "none")}
     ${box(1712, 500, 174, 178, C.surface, C.secondary, 1.8, 10)}${txt(1799, 536, "ABGABEN", 18, 820, C.secondary, "middle")}${multi(1799, 574, 136, "Thermische Energie · Feuchtigkeit · Störsignale", 18, 650, C.text, "middle", 1.13)}
     ${line(1690, 552, 1712, 552, C.failure, 2.2, "none")}${line(1690, 608, 1712, 608, C.educationAccent, 2.2, "none")}${line(1690, 656, 1712, 656, C.graphite, 2.2, "none")}`);
  return evidence(boundary + legend + energy + aux + comm + control + environment, "Quellfolie 13: detailliertes Wechselrichter-Bauteilblockdiagramm");
}

function funcBox(x, y, w, h, number, text, color = C.deep, fill = C.surface) {
  return `${box(x, y, w, h, fill, color, 1.8, 8)}${txt(x + 18, y + 30, `(${number})`, 18, 800, color)}${multi(x + w / 2, y + h / 2 + 8, w - 44, text, 18, 720, color, "middle", 1.15)}`;
}
function slide14() {
  const black = group("func_blackbox", "Black Box",
    `${txt(112, 222, "BLACK BOX", 18, 800, C.soft)}
     ${line(338, 324, 470, 324, C.accent, 3)}${txt(164, 332, "Eingangsgrößen", 23, 760, C.accent)}
     ${box(470, 246, 560, 156, C.deep, C.deep, 2.5, 12)}${multi(750, 310, 500, "Funktion", 34, 820, C.surface, "middle")}
     ${line(1030, 324, 1166, 324, C.secondary, 3)}${txt(1190, 332, "Ausgangsgrößen", 23, 760, C.secondary)}`);
  const definition = group("func_definition", "Abstrakte Aufgabenbeschreibung",
    `${box(470, 432, 560, 92, C.accentSoft, C.accent, 1.5, 9)}
     ${multi(750, 474, 500, "Aufgabenformulierung auf abstrakter und lösungsneutraler Ebene", 22, 720, C.deep, "middle")}`);
  const decomposition = group("func_decomposition", "Zerlegung in Teilfunktionen",
    `<rect x="300" y="610" width="1320" height="252" rx="16" fill="${C.surface}" stroke="${C.deep}" stroke-width="2.5" stroke-dasharray="10 7"/>
     ${pill(326, 628, 246, "FUNKTIONSSTRUKTUR", C.deep, C.surface)}
     ${line(282, 748, 390, 748, C.accent, 3)}${txt(114, 756, "Eingangsgrößen", 22, 760, C.accent)}
     ${box(390, 690, 300, 116, C.deep, C.deep, 2, 10)}${multi(540, 742, 250, "Teilfunktion 1", 26, 800, C.surface, "middle")}
     ${box(810, 690, 300, 116, C.deep, C.deep, 2, 10)}${multi(960, 742, 250, "Teilfunktion 2", 26, 800, C.surface, "middle")}
     ${box(1230, 690, 300, 116, C.deep, C.deep, 2, 10)}${multi(1380, 742, 250, "Teilfunktion 3", 26, 800, C.surface, "middle")}
     ${line(690, 748, 810, 748, C.accent, 2.5)}${line(1110, 748, 1230, 748, C.accent, 2.5)}
     ${line(1530, 748, 1640, 748, C.secondary, 3)}${txt(1660, 756, "Ausgangsgrößen", 22, 760, C.secondary)}`);
  const relations = group("func_relations", "Funktionsbeziehungen",
    `${pathLine("M 610 402 L 300 610", C.soft, 2.2, "none")}${pathLine("M 890 402 L 1620 610", C.soft, 2.2, "none")}
     ${box(300, 886, 1320, 58, C.accentSoft, C.accent, 1.5, 8)}
     ${multi(960, 923, 1220, "Die Summe der Teilfunktionen erfüllt die übergeordnete Funktion.", 22, 740, C.deep, "middle")}`);
  return evidence(black + definition + decomposition + relations, "Quellfolien 14–15: Black Box, abstrakte Aufgabenbeschreibung und generische Funktionszerlegung");
}

function slide16() {
  const darkFunction = (x, y, w, h, number, label) =>
    `${box(x, y, w, h, C.accent, C.accent, 2, 10)}
     ${txt(x + 18, y + 28, `(${number})`, 18, 800, C.accentSoft)}
     ${multi(x + w / 2, y + h / 2 + 5, w - 34, label, 18, 720, C.surface, "middle", 1.08)}`;

  const overview = group("func16_overview", "Hauptfunktion DC-Strom zu AC-Strom",
    `${txt(478, 284, "DC-Strom", 23, 760, C.accent, "end")}
     ${line(500, 276, 650, 276, C.accent, 3)}
     ${box(650, 206, 620, 140, C.accent, C.accent, 2.5, 12)}
     ${multi(960, 252, 550, "Umwandlung DC-Strom in AC-Strom", 30, 820, C.surface, "middle", 1.08)}
     ${line(1270, 276, 1420, 276, C.secondary, 3)}
     ${txt(1444, 284, "AC-Strom", 23, 760, C.secondary)}`);

  const detail = group("func16_detail", "Aufgeklappte Detailstruktur des Wechselrichters",
    `${pathLine("M 700 346 L 142 426", C.accent, 2.5, "none")}
     ${pathLine("M 1220 346 L 1778 426", C.accent, 2.5, "none")}
     <rect x="116" y="426" width="1688" height="474" rx="18" fill="${C.surface}" fill-opacity=".66" stroke="${C.accent}" stroke-width="2.5" stroke-dasharray="12 9"/>

     ${txt(92, 581, "DC-Strom", 19, 760, C.accent, "end")}${line(100, 574, 180, 574, C.accent, 2.5)}
     ${darkFunction(180, 508, 200, 132, 1, "Eingang DC-Strom")}
     ${darkFunction(470, 508, 200, 132, 2, "DC/DC-Wandlung")}
     ${darkFunction(760, 508, 200, 132, 4, "DC/AC-Wandlung")}
     ${darkFunction(1050, 496, 260, 156, 5, "Netzeinspeisung und -trennung")}
     ${darkFunction(1400, 508, 200, 132, 8, "Ausgang AC-Strom")}

     ${line(380, 574, 470, 574, C.accent, 2.5)}${txt(425, 550, "DC-Strom", 18, 700, C.accent, "middle")}
     ${line(670, 574, 760, 574, C.accent, 2.5)}${txt(715, 550, "DC-Strom", 18, 700, C.accent, "middle")}
     ${line(960, 574, 1050, 574, C.secondary, 2.5)}${txt(1005, 550, "AC-Strom", 18, 700, C.secondary, "middle")}
     ${line(1310, 574, 1400, 574, C.secondary, 2.5)}${txt(1355, 550, "AC-Strom", 18, 700, C.secondary, "middle")}
     ${line(1600, 574, 1680, 574, C.secondary, 2.5)}${txt(1704, 581, "AC-Strom", 19, 760, C.secondary)}

     ${darkFunction(470, 742, 200, 112, 3, "Arbeitspunktregelung (MPPT)")}
     ${darkFunction(760, 742, 200, 112, 7, "Netz-Synchronisierung")}
     ${darkFunction(1050, 742, 260, 112, 6, "Netzüberwachung")}

     ${pathLine("M 570 742 V 640", C.accent, 2.2, "both")}${multi(545, 692, 104, "Elektr. Signal", 18, 680, C.accent, "end")}
     ${pathLine("M 860 742 V 640", C.secondary, 2.2)}${multi(835, 692, 104, "Elektr. Signal", 18, 680, C.secondary, "end")}
     ${pathLine("M 1180 742 V 652", C.secondary, 2.2)}${multi(1155, 696, 104, "Elektr. Signal", 18, 680, C.secondary, "end")}
     ${line(1050, 798, 960, 798, C.secondary, 2.2)}${multi(1005, 827, 104, "Elektr. Signal", 18, 680, C.secondary, "middle")}
     ${pathLine("M 1310 798 H 1355 V 574 H 1400", C.secondary, 2.2)}`);

  return evidence(overview, "Quellfolie 16: obere Hauptfunktion DC-Strom zu AC-Strom") +
    evidence(detail, "Quellfolien 15–16: aufgeklappte Detailstruktur mit acht Teilfunktionen und Signalbeziehungen");
}

function classBadge(x, y, value) {
  const color = value === "A" ? C.failure : value === "B" ? C.semanticWarning : C.semanticSuccess;
  const fill = value === "A" ? C.failureSoft : value === "B" ? C.semanticWarningSoft : C.semanticSuccessSoft;
  return `${box(x, y, 44, 32, fill, color, 1.5, 16)}${txt(x + 22, y + 23, value, 18, 820, color, "middle")}`;
}
function tableRow(id, label, y, component, functionText, risks) {
  const gap = 28;
  const h = Math.max(68, risks.length * gap + 12);
  const entries = risks.map((r, i) => `${txt(1160, y + 27 + i * gap, r[0], 18, 570, C.text)}${classBadge(1658, y + 5 + i * gap, r[1])}`).join("");
  return group(id, label,
    `${box(92, y, 1720, h, y % 2 ? C.surface : C.surfaceSoft, C.border, 1, 0)}${multi(112, y + 30, 300, component, 18, 720, C.deep)}${multi(452, y + 30, 630, functionText, 18, 560, C.text)}${entries}`);
}
function inventoryRow(y, h, component, failures, mechanisms, alternate = false) {
  return `${box(92, y, 1736, h, alternate ? C.surfaceSoft : C.surface, C.border, 1, 0)}
    ${multi(116, y + 34, 286, component, 20, 750, C.deep, "start", 1.16)}
    ${multi(452, y + 34, 612, failures, 20, 600, C.text, "start", 1.16)}
    ${multi(1168, y + 34, 616, mechanisms, 20, 600, C.text, "start", 1.16)}`;
}
function slide17() {
  const header = group("abc17_header", "Inventarschema",
    `${box(92, 208, 1736, 64, C.deep, C.deep, 1, 6)}
     ${txt(116, 249, "Bauteil", 20, 800, C.surface)}
     ${txt(452, 249, "Fehlermöglichkeit", 20, 800, C.surface)}
     ${txt(1168, 249, "Ausfallmechanismus", 20, 800, C.surface)}`);
  const connectors = group("abc17_connectors", "Klemmen und Trennschalter",
    `${inventoryRow(272, 94, "DC-Klemme", "Unterbrechung elektrischer Anschlüsse", "Korrosion · Mechanische Belastung")}
     ${inventoryRow(366, 94, "DC-Trennschalter", "Unterbrechung elektrischer Anschlüsse", "Korrosion · Mechanische Belastung", true)}`);
  const capacitor = group("abc17_capacitor", "Kondensator",
    inventoryRow(460, 130, "Kondensator", "Kapazitätsverlust · Kurzschluss", "Thermischer Verschleiß · Verdampfen des Elektrolyten · Durchbruch des Dielektrikums"));
  const semiconductor = group("abc17_semiconductor", "Leistungshalbleiter",
    inventoryRow(590, 94, "Leistungshalbleiter", "Kurzschluss · fehlerhafte Ansteuerung", "Überstrom · Fehlerhafte Software", true));
  const sensor = group("abc17_sensor", "Spannungs- und Stromsensor",
    inventoryRow(684, 110, "Spannungs- und Stromsensor", "Fehlmessung · thermische Zerstörung", "Staub- und Schmutzablagerungen · Überhitzung"));
  const next = group("abc17_next", "Nächster Analyseschritt",
    `${box(92, 824, 1736, 94, C.accentSoft, C.accent, 1.5, 8)}
     ${txt(120, 880, "NÄCHSTER SCHRITT", 18, 800, C.accent)}
     ${multi(378, 880, 1380, "Jeden Ausfallmechanismus anschließend als A-, B- oder C-Teil klassifizieren.", 23, 720, C.deep)}`);
  return evidence(header + connectors + capacitor + semiconductor + sensor + next, "Quellfolie 17: Bauteile, Fehlermöglichkeiten und Ausfallmechanismen vor der ABC-Bewertung");
}

function abcRuleColumn(id, label, x, title, imageFile, imageKind, imageLabel, rows) {
  const rowMarkup = rows.map((row, i) => {
    const y = 514 + i * 112;
    return `${circleBullet(x + 32, y + 3, C.accent)}${multi(x + 58, y, 430, row, 20, 620, C.text, "start", 1.18)}`;
  }).join("");
  return group(id, label,
    `${line(x, 224, x + 532, 224, C.accent, 4, "none")}
     ${txt(x, 278, title, 31, 850, C.accent)}
     ${abcPictogramImg(imageFile, imageKind, x + 189, 306, 154, imageLabel)}
     ${rowMarkup}`);
}
function circleBullet(cx, cy, color = C.accent) {
  return `<circle cx="${cx}" cy="${cy}" r="7" fill="${color}"/>`;
}
function slide18() {
  const a = abcRuleColumn("abc18_a", "A-Teile", 92, "A-TEILE", "abc-a-bearing-load.png", "abc-a-bearing-load", "Belastetes Wälzlager als Beispiel für A-Teile", [
    "Statische und dynamische Belastung; Lastkollektiv bekannt; leistungsführend",
    "Lebensdauerberechnung möglich und weitgehend gesichert",
    "Ausfallverhalten aus Wöhlerversuchen bekannt; Formparameter b > 1,0",
  ]);
  const b = abcRuleColumn("abc18_b", "B-Teile", 694, "B-TEILE", "abc-b-wear-bushing.png", "abc-b-wear-bushing", "Verschleißbeanspruchte Buchse als Beispiel für B-Teile", [
    "Reibung, Verschleiß, extreme Temperaturen, Erschütterungen, Schmutz oder Korrosion",
    "Lebensdauerberechnung nicht möglich oder nicht gesichert",
    "Ausfallverhalten schätzen oder im Versuch bestimmen; Formparameter b ≥ 1,0",
  ]);
  const c = abcRuleColumn("abc18_c", "C-Teile", 1296, "C-TEILE", "abc-c-standard-fastener.png", "abc-c-standard-fastener", "Einfacher Standardbefestiger als Beispiel für C-Teile", [
    "Beanspruchung durch Stöße, Reibung, Verschleiß und vergleichbare Einflüsse",
    "Keine rechnerische Auslegung möglich",
    "Nur Zufalls- oder Frühausfälle; Formparameter 0 < b ≤ 1,0",
  ]);
  const difference = group("abc18_difference", "Unterschied A und B",
    `${box(92, 886, 1736, 66, C.accent, C.accent, 1.5, 8)}
     ${txt(120, 927, "ENTSCHEIDUNGSLOGIK", 18, 800, C.surface)}
     ${multi(386, 927, 1370, "A: Lebensdauer weitgehend berechenbar · B: Schätzung oder Versuch · C: nicht weiterverfolgen", 22, 720, C.surface)}`);
  return evidence(a + b + c + difference, "Quellfolie 18: Regeln der ABC-Einteilung von Ausfallmechanismen");
}

function resultRow(id, label, y, component, failure, mechanisms) {
  const h = Math.max(76, mechanisms.length * 42 + 18);
  const rows = mechanisms.map((entry, i) =>
    `${txt(1168, y + 34 + i * 42, entry[0], 20, 600, C.text)}${classBadge(1690, y + 10 + i * 42, entry[1])}`).join("");
  return group(id, label,
    `${box(92, y, 1736, h, C.accentSoft, C.border, 1, 0)}
     ${box(92, y, 320, h, C.accent, C.accent, 1, 0)}
     ${multi(116, y + 36, 270, component, 20, 760, C.surface)}
     ${multi(452, y + 36, 620, failure, 20, 600, C.text)}
     ${rows}`);
}
function slide19() {
  const header = group("abc19_header", "Bewertungsschema",
    `${box(92, 208, 1736, 64, C.accent, C.accent, 1, 6)}
     ${txt(116, 249, "Bauteil", 20, 800, C.surface)}
     ${txt(452, 249, "Fehlermöglichkeit", 20, 800, C.surface)}
     ${txt(1168, 249, "Ausfallmechanismus", 20, 800, C.surface)}
     ${txt(1712, 249, "ABC", 20, 800, C.surface, "middle")}`);
  const connectors = resultRow("abc19_connectors", "Klemmen und Trennschalter", 272, "DC-Klemme", "Unterbrechung elektrischer Anschlüsse", [["Korrosion", "C"], ["Mechanische Belastung", "C"]]) +
    resultRow("abc19_connectors_2", "DC-Trennschalter", 374, "DC-Trennschalter", "Unterbrechung elektrischer Anschlüsse", [["Korrosion", "B"], ["Mechanische Belastung", "C"]]);
  const capacitor = resultRow("abc19_capacitor", "Kondensator", 476, "Kondensator", "Kapazitätsverlust · Kurzschluss", [["Thermischer Verschleiß", "A"], ["Verdampfen des Elektrolyten", "A"], ["Durchbruch des Dielektrikums", "A"]]);
  const semiconductor = resultRow("abc19_semiconductor", "Leistungshalbleiter", 620, "Leistungshalbleiter", "Kurzschluss · fehlerhafte Ansteuerung", [["Überstrom", "A"], ["Fehlerhafte Software", "B"]]);
  const sensor = resultRow("abc19_sensor", "Spannungs- und Stromsensor", 722, "Spannungssensor · Stromsensor", "Fehlmessung · thermische Zerstörung", [["Staub- und Schmutzablagerungen", "B"], ["Überhitzung", "A"]]);
  const transition = group("abc19_transition", "Übergang zur FTA",
    `${box(92, 846, 1736, 82, C.accent, C.accent, 1.5, 8)}
     ${txt(120, 896, "WEITERVERFOLGUNG", 18, 800, C.accentSoft)}
     ${multi(354, 896, 1400, "A- und B-Risiken werden in der Fehlerbaumanalyse vertieft.", 23, 720, C.surface)}`);
  return evidence(header + connectors + capacitor + semiconductor + sensor + transition, "Quellfolie 19: ABC-Ergebnis für Bauteile des Wechselrichters");
}

const builders = { 4: slide4, 6: slide6, 8: slide8, 9: slide9, 10: slide10, 11: slide11, 13: slide13, 14: slide14, 16: slide16, 17: slide17, 18: slide18, 19: slide19 };
function selected() {
  const i = process.argv.indexOf("--slides");
  if (i < 0) return new Set(Object.keys(builders).map(Number));
  const result = new Set();
  for (const token of String(process.argv[i + 1] || "").split(",")) {
    const m = token.trim().match(/^(\d+)(?:-(\d+))?$/); if (!m) throw new Error(`Ungültige Auswahl: ${token}`);
    for (let n = Number(m[1]); n <= Number(m[2] || m[1]); n++) if (builders[n]) result.add(n);
  }
  return result;
}
function prepareMedia(n) {
  const mediaDir = path.join(outRoot, `slide_${String(n).padStart(3, "0")}`, "media");
  fs.mkdirSync(mediaDir, { recursive: true });
  for (const filename of ["pv-panels.png", "inverter.png", "battery-storage.png", "electricity-meter.png", "public-grid-pylon.png", "household-consumers.png"]) {
    fs.copyFileSync(path.join(assetRoot, filename), path.join(mediaDir, filename));
  }
  if (n === 6) {
    for (const filename of ["re2-level-environment.png", "re2-level-pv-system.png", "re2-level-inverter.png", "re2-level-microcontroller.png"]) {
      fs.copyFileSync(path.join(systemLevelPictogramRoot, filename), path.join(mediaDir, filename));
    }
  }
  if (n === 8) {
    for (const filename of ["re2-p-diagram-input.png", "re2-p-diagram-control.png", "re2-p-diagram-disturbance.png", "re2-p-diagram-output.png"]) {
      fs.copyFileSync(path.join(pDiagramPictogramRoot, filename), path.join(mediaDir, filename));
    }
  }
}
function writeManifest(scene) {
  const spec = animationSpec[scene.output_slide_number];
  const manifest = {
    schemaVersion: "svgAnimationManifest/v1", svgPath: `${scene.work_unit}.svg`,
    defaults: { enterFrames: 16, exitFrames: 12, highlightDurFrames: 30, drawDurFrames: 42, transformDurFrames: 30 },
    targets: spec.map(([targetId, label]) => ({ targetId, label, status: "animated", visibleInEditor: true, render: true, confidence: "high" })),
    steps: spec.map(([targetId, label, sourceText], i) => ({
      stepId: `step_${String(i + 1).padStart(2, "0")}_${targetId}`, targetId,
      action: targetId.endsWith("relations") || targetId.endsWith("flows") || targetId.endsWith("spine") ? "draw" : "show",
      sourceText, occurrence: 1, confidence: "high",
      notes: "Sprechertextgeführte semantische Gruppe; Beziehungen folgen erst nach ihren Endpunkten.",
      ...(targetId.endsWith("relations") || targetId.endsWith("flows") || targetId.endsWith("spine") ? { drawDurFrames: 42 } : { enterFrames: 16 }),
    })),
  };
  fs.writeFileSync(path.join(outRoot, scene.work_unit, "scene.animation.v1.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(outRoot, scene.work_unit, "element-animation-plan.json"), `${JSON.stringify({
    schemaVersion: "elementAnimationPlan/v1", sceneId: scene.scene_id, targets: manifest.targets, steps: manifest.steps,
  }, null, 2)}\n`, "utf8");
}
function writeBrief(scene) {
  const [defaultTitle, takeaway, archetype, layout] = sceneMeta[scene.output_slide_number];
  const title = scene.content_title_override || defaultTitle;
  const reference = scene.output_slide_number === 6
    ? "Direkter Referenz-Lock auf die alte Komposition der Quellfolien 6–7; ausschließlich die vier Bildmotive werden durch freigegebene PNG-Piktogramme ersetzt."
    : "RE1-Full-Slide-System und Kapitelbrief analysis/rebuild-plans/RE2_chapter_02_redesign_brief.md";
  const text = `# Redesign-Brief — ${scene.work_unit}\n\n- Kapitel: 2\n- Lektion: ${scene.lesson}\n- Quellfolien: ${scene.source_slides.join(", ")}\n- Titel: ${title}\n- Takeaway: ${takeaway}\n- Archetyp: ${archetype}\n- Layout: ${layout}\n- Referenz: ${reference}\n- Produktionsmodus: Content-SVG 1920×1080; Titel und Masterelemente werden downstream gerendert\n- Animation: ${animated ? "sprechertextgeführt aktiviert" : "noch nicht aktiviert; statischer Endzustand zur Freigabe"}\n`;
  fs.writeFileSync(path.join(outRoot, scene.work_unit, "redesign-brief.md"), text, "utf8");
}
function main() {
  const wanted = selected();
  const generated = [];
  for (const scene of scenes) {
    const n = scene.output_slide_number;
    if (!wanted.has(n)) continue;
    const renderN = scene.render_source_slide || scene.primary_source_slide || n;
    const renderScene = { ...scene, output_slide_number: renderN };
    if (!builders[renderN]) throw new Error(`Keine Kapitel-2-Endzustandsdefinition für Quellfolie ${renderN}.`);
    const dir = path.join(outRoot, scene.work_unit); fs.mkdirSync(dir, { recursive: true }); prepareMedia(n);
    const svg = frame(renderScene, builders[renderN]());
    fs.writeFileSync(path.join(dir, `${scene.work_unit}.svg`), `${svg}\n`, "utf8");
    writeBrief(renderScene);
    if (animated) writeManifest(renderScene);
    generated.push(scene.work_unit);
  }
  process.stdout.write(`Generated ${generated.length} RE2 chapter-2 scene(s)${animated ? " with animation" : " as static end states"}: ${generated.join(", ")}.\n`);
}
main();
