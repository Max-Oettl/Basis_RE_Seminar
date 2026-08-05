const fs = require("fs");
const path = require("path");
const educationTheme = require("./reltest-education-theme");

const root = path.resolve(__dirname, "..");
const outRoot = path.join(root, "rebuild-proposals", "svg", "RE2");
const assetRoot = path.join(root, "components", "image-library", "re2-ch2-pv");
const sourceMap = JSON.parse(fs.readFileSync(path.join(root, "analysis", "rebuild-plans", "RE2_source-reference-map.json"), "utf8"));
const scenes = sourceMap.mappings.filter((scene) => scene.chapter === 2);
const animated = process.argv.includes("--animated");

const C = educationTheme.colors;

const sceneMeta = {
  4: ["Systemgrenzen am Beispiel einer PV-Anlage", "Die Systemgrenze trennt PV-Anlage, Subsysteme und relevante Umwelt.", "system-landscape", "Konkrete PV-Komponenten mit äußerer und verschachtelter Systemgrenze."],
  6: ["Vom Umfeld bis zum Bauteil", "Eine saubere Systemanalyse ordnet Umwelt, System, Subsystem und Komponente.", "nested-system", "Vier verschachtelte Ebenen mit Fokus auf den Wechselrichter."],
  8: ["Das P-Diagramm als Analysemodell", "Das P-Diagramm ordnet Eingänge, Steuergrößen, Störungen und Zielgrößen um ein System.", "p-diagram", "Vier Parametergruppen in einer klaren Kreuzstruktur."],
  9: ["P-Diagramm des Wechselrichters", "Am Wechselrichter werden Energie, Steuerung, Störungen und Zielgröße konkret.", "p-diagram", "Konkretes P-Diagramm mit Wechselrichter als System."],
  10: ["Ursachen für Leistungsverlust", "Das Ishikawa-Diagramm strukturiert mögliche Ursachen aus fünf Kategorien.", "ishikawa", "Ursache-Wirkungs-Diagramm mit dauerhaft sichtbarer Wirkung."],
  11: ["Bauteilblockdiagramm: Prinzip", "Komponenten werden über Energie-, Stoff- und Informationsströme verbunden.", "component-block", "Zwei Komponenten innerhalb einer Systemgrenze und drei bidirektionale Flüsse."],
  13: ["Bauteilblockdiagramm des Wechselrichters", "Der Wechselrichter wird in Energiepfad, Steuerung, Kommunikation und Nebenfunktionen zerlegt.", "component-block-detailed", "Detaillierte, zonierte Komponenten- und Schnittstellenübersicht."],
  14: ["Von der Black Box zur Funktionsstruktur", "Eine abstrakte Gesamtfunktion wird über Ein- und Ausgangsgrößen beschrieben und in Teilfunktionen zerlegt.", "function-structure-principle", "Black Box oben und generische Zerlegung in drei Teilfunktionen darunter."],
  16: ["Funktionsstruktur des Wechselrichters", "Acht Teilfunktionen bilden gemeinsam die Umwandlung von Gleichstrom in Wechselstrom.", "function-structure", "Eigenständige, großformatige Funktionskette mit Regelungs- und Überwachungsfunktionen."],
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
    ["ishi_effect", "Wirkung Leistungsverlust", "In unserem Fall ist die unerwünschte Wirkung der Leistungsverlust der PV-Anlage."],
    ["ishi_material", "Materialien", "Zunächst werden alle Materialien bzw. Bauteile betrachtet"],
    ["ishi_machine", "Maschinen und Ausrüstung", "In der zweiten Gräte können die eingesetzten Maschinen und Ausrüstungen erfasst werden."],
    ["ishi_human", "Mensch", "Der Mensch spielt natürlich auch in technischen Systemen meist eine relevante Rolle."],
    ["ishi_methods", "Methoden", "Unter Methoden verstehen wir die Prozesse und Verfahren"],
    ["ishi_environment", "Milieu und Umwelt", "Zum Schluss gibt es noch die Umweltfaktoren"],
    ["ishi_spine", "Ursache-Wirkungs-Beziehungen", "Das Ishikawa-Diagramm wird von rechts nach links gelesen"],
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
    ["func16_main", "Hauptfunktionskette", "Im Falle des Wechselrichters ist die Hauptfunktion die Umwandlung von Gleichstrom in Wechselstrom."],
    ["func16_controls", "Regelungs- und Überwachungsfunktionen", "Dies kann dann wieder weiter aufgeteilt werden in alle für den Wechselrichter relevanten Teilfunktionen."],
    ["func16_relations", "Funktionsbeziehungen", "Jeder dieser Teilfunktionen hat natürlich wieder seine eigene Aufgabenbeschreibung und individuelle Ein- und Ausgangsgrößen."],
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
  const [title, takeaway, archetype, layoutIntent] = sceneMeta[scene.output_slide_number];
  const metadata = {
    artifactScope: "full-slide", embeddingTarget: "standalone-slide", slideType: archetype,
    contentTitle: title, layoutIntent, takeaway, density: [13, 17, 19].includes(scene.output_slide_number) ? "dense" : "balanced",
    contentMode: "full-slide", backgroundMode: "brand-frame", brandProfile: educationTheme.brandProfile,
    brandVariant: educationTheme.brandVariant, sourceSlides: scene.source_slides, officialLogoStatus: "pending-original-asset",
  };
  const markers = [...new Set([C.accent, C.deep, C.failure, C.success, C.secondary, C.cyan])].map((color) =>
    `<marker id="arrow_${color.slice(1)}" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M1 1L11 6L1 11Z" fill="${color}"/></marker>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-labelledby="accessible_title accessible_description" data-artifact-scope="full-slide" data-embedding-target="standalone-slide" data-scene-id="${scene.scene_id}" data-brand-profile="${educationTheme.brandProfile}">
<metadata id="slide_quality_metadata" type="application/json"><![CDATA[${JSON.stringify(metadata)}]]></metadata>
<title id="accessible_title">${esc(title)}</title><desc id="accessible_description">${esc(takeaway)}</desc>
<defs><linearGradient id="backgroundGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${educationTheme.background.start}"/><stop offset="56%" stop-color="${educationTheme.background.mid}"/><stop offset="100%" stop-color="${educationTheme.background.end}"/></linearGradient><pattern id="technicalGrid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke="${C.deep}" stroke-opacity=".035" stroke-width="1"/></pattern>${markers}</defs>
<style>text{font-family:${educationTheme.bodyFontFamily};letter-spacing:0}</style>
<rect width="1920" height="1080" fill="url(#backgroundGradient)"/><rect width="1920" height="1080" fill="url(#technicalGrid)"/>
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
  const environment = group("level_environment", "Umwelt",
    `${box(94, 192, 1732, 708, C.surfaceSoft, C.soft, 2.5, 18)}${pill(120, 214, 114, "UMWELT", C.soft, C.surface)}
     ${multi(128, 292, 305, "Standort · Umwelteinflüsse · Umgebungseinflüsse · gesetzliche Regularien und Anforderungen", 22, 650, C.muted)}`);
  const system = group("level_system", "System",
    `${box(442, 266, 1330, 584, C.accentSoft, C.accent, 2.5, 16)}${pill(470, 288, 110, "SYSTEM", C.accent, C.surface)}
     ${multi(470, 356, 290, "Anlagentyp · elektrische Verschaltung · Betriebsstrategie · Nennleistung", 22, 650, C.deepSoft)}`);
  const subsystem = group("level_subsystem", "Subsystem",
    `${box(776, 338, 940, 458, C.secondarySoft, C.secondary, 2.5, 14)}${pill(804, 360, 150, "SUBSYSTEM", C.secondary, C.surface)}
     ${pill(824, 432, 174, "PV-Modul", C.secondary, C.surface)}${pill(1016, 432, 226, "Wechselrichter", C.secondary, C.surface)}${pill(1260, 432, 210, "Batteriesystem", C.secondary, C.surface)}`);
  const component = group("level_component", "Komponente",
    `${box(1004, 510, 654, 230, C.surface, C.deep, 2, 12)}${pill(1032, 532, 158, "KOMPONENTE", C.deep, C.surfaceSoft)}
     ${pill(1060, 612, 210, "Mikrocontroller", C.deep, C.surfaceSoft)}${pill(1290, 612, 330, "weitere Baugruppen / Bauteile", C.deep, C.surfaceSoft)}`);
  const focus = group("level_focus", "Fokus Wechselrichter",
    `<path d="M 1000 408 H 1252 V 490 H 1670 V 758 H 980 V 490 H 1000 Z" fill="none" stroke="${C.failure}" stroke-width="4" stroke-dasharray="10 7" stroke-linejoin="round"/>${pill(1236, 770, 178, "FOKUS ANALYSE", C.failure, C.surface)}
     ${pathLine("M 1126 408 C 1330 332 1460 298 1580 276", C.failure, 2.5)}${pill(1420, 224, 330, "SCHNITTSTELLEN ZUR UMWELT", C.failure, C.surface)}`);
  return evidence(environment, "Quellfolien 6–7: Umwelt") + evidence(system, "Quellfolien 6–7: System") + evidence(subsystem, "Quellfolien 6–7: Subsysteme") + evidence(component, "Quellfolien 6–7: Komponenten") + evidence(focus, "Quellfolie 7: Wechselrichter-Fokus");
}

function pNode(x, y, w, h, labelText, color, fill, id, label) {
  return group(id, label, `${box(x, y, w, h, fill, color, 2.5, 12)}${multi(x + w / 2, y + h / 2 - 4, w - 40, labelText, 27, 760, color, "middle")}`);
}
function slide8() {
  const center = pNode(710, 404, 500, 210, "System: Produkt / Prozess", C.deep, C.surface, "p_system", "System Produkt oder Prozess");
  const inputs = pNode(110, 434, 380, 150, "Eingangsgrößen / Stellgrößen", C.accent, C.accentSoft, "p_inputs", "Eingangs- und Stellgrößen");
  const controls = pNode(770, 204, 380, 130, "Kontrollierbare Größen / Steuergrößen", C.success, C.successSoft, "p_controls", "Kontrollierbare Größen");
  const disturbances = pNode(770, 704, 380, 130, "Störgrößen", C.failure, C.failureSoft, "p_disturbances", "Störgrößen");
  const outputs = pNode(1430, 434, 380, 150, "Zielgrößen", C.secondary, C.secondarySoft, "p_outputs", "Zielgrößen");
  const rel = group("p_relations", "Wirkbeziehungen",
    `${line(490, 509, 710, 509, C.accent, 3)}${line(960, 334, 960, 404, C.success, 3)}${line(960, 704, 960, 614, C.failure, 3)}${line(1210, 509, 1430, 509, C.secondary, 3)}`);
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

function ishBranch(id, label, x, y, side, title, a, b, color) {
  const endX = side === "top" ? x + 150 : x + 150;
  const endY = side === "top" ? 326 : 744;
  const joinY = 535;
  const stem = pathLine(`M ${x} ${joinY} L ${endX} ${endY}`, color, 2.5, "none");
  const titleY = side === "top" ? endY - 46 : endY + 34;
  const bodyY = side === "top" ? endY - 8 : endY + 70;
  return group(id, label, `${stem}${txt(endX, titleY, title, 23, 800, color, "middle")}${multi(endX, bodyY, 280, `${a} · ${b}`, 19, 610, C.text, "middle")}`);
}
function slide10() {
  const effect = group("ishi_effect", "Wirkung Leistungsverlust",
    `${box(1435, 440, 385, 190, C.failureSoft, C.failure, 3, 14)}${txt(1627, 486, "WIRKUNG", 19, 800, C.failure, "middle")}${multi(1627, 536, 330, "Leistungsverlust der PV-Anlage", 30, 820, C.deep, "middle")}`);
  const spine = group("ishi_spine", "Ursache-Wirkungs-Beziehungen", `${line(150, 535, 1435, 535, C.deep, 4)}${txt(180, 510, "URSACHEN", 18, 800, C.soft)}`);
  const branches =
    ishBranch("ishi_material", "Materialien", 180, 535, "top", "Materialien", "Qualität elektrischer Bauteile", "Verkabelung", C.accent) +
    ishBranch("ishi_machine", "Maschinen und Ausrüstung", 500, 535, "bottom", "Maschinen (Ausrüstung)", "Montagestruktur", "Überwachungssysteme", C.secondary) +
    ishBranch("ishi_human", "Mensch", 760, 535, "top", "Mensch", "Fehler bei der Installation", "Wartungsfehler", C.success) +
    ishBranch("ishi_methods", "Methoden", 1030, 535, "bottom", "Methoden", "Standards bei Installation", "Wartungsintervalle und -protokolle", C.accent) +
    ishBranch("ishi_environment", "Milieu und Umwelt", 1170, 535, "top", "Milieu (Umwelt)", "Wetterbedingungen", "Schattenwurf durch Objekte", C.secondary);
  return evidence(effect + branches + spine, "Quellfolie 10: Ishikawa-Diagramm und Beispiele");
}

function slide11() {
  const boundary = group("block_boundary", "Systemgrenze",
    `<rect x="350" y="232" width="1220" height="630" rx="20" fill="${C.accentSoft}" fill-opacity=".25" stroke="${C.failure}" stroke-width="3" stroke-dasharray="12 8"/>${pill(382, 256, 170, "SYSTEMGRENZE", C.failure, C.surface)}`);
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
    `<rect x="246" y="244" width="1430" height="620" rx="16" fill="${C.surface}" fill-opacity=".72" stroke="${C.failure}" stroke-width="3" stroke-dasharray="10 7"/>${pill(272, 262, 170, "SYSTEMGRENZE", C.failure, C.surface)}
     ${multi(108, 374, 110, "Elektr. Energie (DC-Strom)", 18, 700, C.accent, "middle")}${multi(1760, 374, 120, "Elektr. Energie (AC-Strom)", 18, 700, C.secondary, "middle")}
     ${multi(110, 510, 150, "Betätigungsenergie · Thermische Energie · Verschmutzung · Feuchtigkeit · Störsignale", 18, 620, C.muted, "middle")}
     ${multi(1760, 520, 150, "Thermische Energie · Feuchtigkeit · Störsignale", 18, 620, C.muted, "middle")}`);
  const energy = group("inv_energy", "Energiepfad",
    `${line(218, 392, 280, 392, C.accent, 2.5)}${line(404, 392, 438, 392, C.accent, 2.5)}${line(590, 392, 624, 392, C.accent, 2.5)}${line(756, 392, 790, 392, C.accent, 2.5)}${line(908, 392, 942, 392, C.accent, 2.5)}${line(1112, 392, 1146, 392, C.accent, 2.5)}${line(1278, 392, 1312, 392, C.accent, 2.5)}${line(1474, 392, 1508, 392, C.secondary, 2.5)}${line(1634, 392, 1704, 392, C.secondary, 2.5)}
     ${smallBlock(280, 350, 124, 84, "DC-|Klemmen", C.accent, C.accentSoft, 18)}${smallBlock(438, 350, 152, 84, "DC-Fehlerstrom-|überwachung", C.accent, C.accentSoft, 18)}
     ${smallBlock(624, 350, 132, 84, "DC-Trenn-|schalter", C.accent, C.accentSoft, 18)}${smallBlock(790, 350, 118, 84, "EMV-|Filter", C.accent, C.accentSoft, 18)}
     ${smallBlock(942, 340, 170, 104, "Hoch-/Tiefsetz-|steller", C.accent, C.accentSoft, 18)}${smallBlock(1146, 350, 132, 84, "Zwischen-|kreis", C.accent, C.accentSoft, 18)}
     ${smallBlock(1312, 340, 162, 104, "H-Brücken-|schaltung", C.secondary, C.secondarySoft, 18)}${smallBlock(1508, 350, 126, 84, "AC-|Filter", C.secondary, C.secondarySoft, 18)}`);
  const control = group("inv_control", "Steuerung und Überwachung",
    `${pathLine("M 910 560 V 466 H 1027 V 444", C.deep, 2.5)}${pathLine("M 1060 614 H 1100", C.deep, 2.5)}
     ${pathLine("M 1290 585 H 1324", C.deep, 2.5)}${line(1422, 585, 1444, 585, C.deep, 2.5)}${line(1542, 585, 1564, 585, C.deep, 2.5)}${pathLine("M 1606 622 V 650", C.deep, 2.5)}
     ${pathLine("M 910 560 V 512 H 1392 V 548", C.deep, 2.5)}
     ${smallBlock(760, 560, 300, 108, "Microcontroller", C.deep, C.deep, 24).replaceAll(`fill="${C.deep}" stroke`, `fill="${C.deep}" stroke`).replace(`fill="${C.deep}" text-anchor`, `fill="${C.surface}" text-anchor`)}
     ${smallBlock(1100, 548, 190, 74, "Netzüberwachung|AC", C.success, C.successSoft, 18)}${smallBlock(1324, 548, 98, 74, "Relais", C.success, C.successSoft)}${smallBlock(1444, 548, 98, 74, "Relais", C.success, C.successSoft)}
     ${smallBlock(1564, 548, 84, 74, "EMV-|Filter", C.success, C.successSoft, 18)}${smallBlock(1564, 650, 84, 74, "AC-|Klemmen", C.success, C.successSoft, 18)}
     ${txt(928, 494, "U, I", 18, 740, C.deep)}${txt(1070, 540, "I, f, U", 18, 740, C.deep)}${txt(1120, 500, "Tastgrad · Öffnen/Schließen · Messsignale", 18, 680, C.deep)}`);
  const aux = group("inv_aux", "Bordnetz und Lüfter",
    `${pathLine("M 380 680 V 474 H 850 V 434", C.secondary, 2.5)}${pathLine("M 460 718 H 500", C.secondary, 2.5)}${pathLine("M 634 718 H 760 V 650", C.secondary, 2.5)}
     ${smallBlock(300, 680, 160, 76, "DC-Bordnetz", C.secondary, C.secondarySoft)}${smallBlock(500, 680, 134, 76, "Lüfter", C.secondary, C.secondarySoft)}${txt(650, 704, "Drehzahl", 18, 700, C.secondary)}`);
  const comm = group("inv_communication", "Kommunikation",
    `${line(884, 228, 884, 768, C.accent, 2.2, "both")}${[385,575,765,955,1145,1335,1525].map((x) => line(x, 888, 884, 830, C.accent, 1.8, "both")).join("")}
     ${smallBlock(596, 768, 576, 62, "Kommunikationseinheit", C.accent, C.accentSoft, 20)}
     ${["Display", "Bluetooth", "RS232", "RS485", "Funk", "Ethernet", "WLAN"].map((t, i) => smallBlock(310 + i * 190, 888, 150, 52, t, C.accent, C.surface, 18)).join("")}
     ${multi(884, 216, 600, "Kommunikationsdaten / Netzsignal ↕ Kommunikationsdaten / Betriebsdaten", 19, 700, C.accent, "middle")}`);
  const environment = group("inv_environment", "Umwelteinflüsse und Abgaben",
    `${pill(80, 780, 150, "STÖRGRÖSSEN", C.failure, C.failureSoft)}${line(230, 799, 300, 718, C.failure, 2.5)}${pill(1690, 780, 150, "ABGABEN", C.secondary, C.secondarySoft)}${line(1648, 687, 1690, 799, C.secondary, 2.5)}`);
  return evidence(boundary + energy + aux + comm + control + environment, "Quellfolie 13: detailliertes Wechselrichter-Bauteilblockdiagramm");
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
    `${pathLine("M 610 402 V 610", C.soft, 2.2, "none", "7 6")}${pathLine("M 890 402 V 610", C.soft, 2.2, "none", "7 6")}
     ${box(300, 886, 1320, 58, C.accentSoft, C.accent, 1.5, 8)}
     ${multi(960, 923, 1220, "Die Summe der Teilfunktionen erfüllt die übergeordnete Funktion.", 22, 740, C.deep, "middle")}`);
  return evidence(black + definition + decomposition + relations, "Quellfolien 14–15: Black Box, abstrakte Aufgabenbeschreibung und generische Funktionszerlegung");
}

function slide16() {
  const main = group("func16_main", "Hauptfunktionskette",
    `<rect x="92" y="214" width="1736" height="618" rx="18" fill="${C.surface}" fill-opacity=".8" stroke="${C.border}" stroke-width="1.8"/>
     ${pill(122, 240, 328, "SYSTEMGRENZE WECHSELRICHTER", C.failure, C.surface)}
     ${txt(112, 508, "DC-STROM", 21, 800, C.accent)}${line(238, 500, 320, 500, C.accent, 3)}
     ${funcBox(320, 430, 196, 140, 1, "Eingang DC-Strom", C.accent, C.accentSoft)}
     ${funcBox(574, 430, 210, 140, 2, "DC/DC-Wandlung", C.accent, C.accentSoft)}
     ${funcBox(842, 430, 210, 140, 4, "DC/AC-Wandlung", C.secondary, C.secondarySoft)}
     ${funcBox(1110, 418, 278, 164, 5, "Netzeinspeisung und -trennung", C.secondary, C.secondarySoft)}
     ${funcBox(1446, 430, 210, 140, 8, "Ausgang AC-Strom", C.success, C.successSoft)}
     ${line(516, 500, 574, 500, C.accent, 2.5)}${line(784, 500, 842, 500, C.accent, 2.5)}
     ${line(1052, 500, 1110, 500, C.secondary, 2.5)}${line(1388, 500, 1446, 500, C.secondary, 2.5)}
     ${line(1656, 500, 1690, 500, C.success, 3)}${txt(1712, 508, "AC-STROM", 21, 800, C.success)}`);
  const controls = group("func16_controls", "Regelungs- und Überwachungsfunktionen",
    `${funcBox(522, 666, 254, 112, 3, "Arbeitspunktregelung (MPPT)", C.success, C.successSoft)}
     ${funcBox(842, 666, 238, 112, 7, "Netz-Synchronisierung", C.success, C.successSoft)}
     ${funcBox(1144, 666, 238, 112, 6, "Netzüberwachung", C.success, C.successSoft)}`);
  const relations = group("func16_relations", "Funktionsbeziehungen",
    `${pathLine("M 649 666 V 570", C.success, 2.2, "both")}
     ${pathLine("M 961 666 V 570", C.success, 2.2)}
     ${pathLine("M 1263 666 V 582", C.success, 2.2)}
     ${pathLine("M 1080 722 H 1144", C.success, 2.2)}
     ${pathLine("M 1382 722 H 1418 V 500 H 1446", C.success, 2.2)}
     ${box(92, 858, 1736, 72, C.accentSoft, C.accent, 1.5, 8)}
     ${txt(120, 903, "MERKSATZ", 18, 800, C.accent)}
     ${multi(314, 903, 1450, "Erfüllt die Summe der Teilfunktionen ihre Aufgaben, ist auch die Hauptfunktion erfüllt.", 23, 720, C.deep)}`);
  return evidence(main + controls + relations, "Quellfolie 16: vollständige Funktionsstruktur des Wechselrichters");
}

function classBadge(x, y, value) {
  const color = value === "A" ? C.failure : value === "B" ? C.secondary : C.success;
  const fill = value === "A" ? C.failureSoft : value === "B" ? C.secondarySoft : C.successSoft;
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

function abcRuleCard(id, label, x, color, fill, title, subtitle, rows) {
  const rowMarkup = rows.map((row, i) => {
    const y = 390 + i * 154;
    return `${box(x + 28, y, 476, 126, C.surface, C.border, 1.2, 8)}
      ${box(x + 48, y + 28, 52, 52, fill, color, 1.5, 26)}
      ${txt(x + 74, y + 64, String(i + 1), 20, 820, color, "middle")}
      ${multi(x + 122, y + 39, 352, row, 20, 620, C.text, "start", 1.18)}`;
  }).join("");
  return group(id, label,
    `${box(x, 210, 532, 650, fill, color, 2.5, 16)}
     ${txt(x + 266, 264, title, 31, 820, color, "middle")}
     ${multi(x + 266, 310, 460, subtitle, 21, 720, C.deep, "middle")}
     ${rowMarkup}`);
}
function slide18() {
  const a = abcRuleCard("abc18_a", "A-Teile", 92, C.failure, C.failureSoft, "A-TEILE", "risikoreich · Belastung definierbar", [
    "Statische und dynamische Belastung; Lastkollektiv bekannt; leistungsführend",
    "Lebensdauerberechnung möglich und weitgehend gesichert",
    "Ausfallverhalten aus Wöhlerversuchen bekannt; Formparameter b > 1,0",
  ]);
  const b = abcRuleCard("abc18_b", "B-Teile", 694, C.secondary, C.secondarySoft, "B-TEILE", "risikoreich · Belastung nicht sicher berechenbar", [
    "Reibung, Verschleiß, extreme Temperaturen, Erschütterungen, Schmutz oder Korrosion",
    "Lebensdauerberechnung nicht möglich oder nicht gesichert",
    "Ausfallverhalten schätzen oder im Versuch bestimmen; Formparameter b ≥ 1,0",
  ]);
  const c = abcRuleCard("abc18_c", "C-Teile", 1296, C.success, C.successSoft, "C-TEILE", "risikoneutral · stochastische Beanspruchung", [
    "Beanspruchung durch Stöße, Reibung, Verschleiß und vergleichbare Einflüsse",
    "Keine rechnerische Auslegung möglich",
    "Nur Zufalls- oder Frühausfälle; Formparameter 0 < b ≤ 1,0",
  ]);
  const difference = group("abc18_difference", "Unterschied A und B",
    `${box(92, 884, 1736, 66, C.deep, C.deep, 1.5, 8)}
     ${txt(120, 925, "ENTSCHEIDUNGSLOGIK", 18, 800, C.accentSoft)}
     ${multi(386, 925, 1370, "A: Lebensdauer weitgehend berechenbar · B: nur Schätzung oder Versuch · C: nicht weiterverfolgen", 22, 720, C.surface)}`);
  return evidence(a + b + c + difference, "Quellfolie 18: Regeln der ABC-Einteilung von Ausfallmechanismen");
}

function resultRow(id, label, y, component, failure, mechanisms) {
  const h = Math.max(76, mechanisms.length * 42 + 18);
  const rows = mechanisms.map((entry, i) =>
    `${txt(1168, y + 34 + i * 42, entry[0], 20, 600, C.text)}${classBadge(1690, y + 10 + i * 42, entry[1])}`).join("");
  return group(id, label,
    `${box(92, y, 1736, h, y % 2 ? C.surface : C.surfaceSoft, C.border, 1, 0)}
     ${multi(116, y + 36, 290, component, 20, 750, C.deep)}
     ${multi(452, y + 36, 620, failure, 20, 600, C.text)}
     ${rows}`);
}
function slide19() {
  const header = group("abc19_header", "Bewertungsschema",
    `${box(92, 208, 1736, 64, C.deep, C.deep, 1, 6)}
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
    `${box(92, 846, 1736, 82, C.accentSoft, C.accent, 1.5, 8)}
     ${txt(120, 896, "WEITERVERFOLGUNG", 18, 800, C.accent)}
     ${multi(354, 896, 1400, "A- und B-Risiken werden in der Fehlerbaumanalyse vertieft.", 23, 720, C.deep)}`);
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
  const [title, takeaway, archetype, layout] = sceneMeta[scene.output_slide_number];
  const text = `# Redesign-Brief — ${scene.work_unit}\n\n- Kapitel: 2\n- Lektion: ${scene.lesson}\n- Quellfolien: ${scene.source_slides.join(", ")}\n- Titel: ${title}\n- Takeaway: ${takeaway}\n- Archetyp: ${archetype}\n- Layout: ${layout}\n- Referenz: RE1-Full-Slide-System und Kapitelbrief analysis/rebuild-plans/RE2_chapter_02_redesign_brief.md\n- Produktionsmodus: Full-Slide 1920×1080\n- Animation: ${animated ? "sprechertextgeführt aktiviert" : "noch nicht aktiviert; statischer Endzustand zur Freigabe"}\n`;
  fs.writeFileSync(path.join(outRoot, scene.work_unit, "redesign-brief.md"), text, "utf8");
}
function main() {
  const wanted = selected();
  const generated = [];
  for (const scene of scenes) {
    const n = scene.output_slide_number;
    if (!wanted.has(n)) continue;
    const dir = path.join(outRoot, scene.work_unit); fs.mkdirSync(dir, { recursive: true }); prepareMedia(n);
    const svg = frame(scene, builders[n]());
    fs.writeFileSync(path.join(dir, `${scene.work_unit}.svg`), `${svg}\n`, "utf8");
    writeBrief(scene);
    if (animated) writeManifest(scene);
    generated.push(scene.work_unit);
  }
  process.stdout.write(`Generated ${generated.length} RE2 chapter-2 scene(s)${animated ? " with animation" : " as static end states"}: ${generated.join(", ")}.\n`);
}
main();
