"use strict";

const theme = require("./reltest-education-theme");

const C = theme.colors;

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function wrap(text, width, size) {
  const maxChars = Math.max(8, Math.floor(width / (size * 0.54)));
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else current = candidate;
  }
  if (current) lines.push(current);
  return lines;
}

function txt(x, y, text, size = 24, weight = 650, fill = C.text, anchor = "start") {
  const resolvedSize = Math.max(18, size);
  return `<text x="${x}" y="${y}" font-size="${resolvedSize}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(text)}</text>`;
}

function multi(x, y, width, text, size = 24, weight = 650, fill = C.text, anchor = "start", lineHeight = 1.25) {
  const resolvedSize = Math.max(18, size);
  const lines = wrap(text, width, resolvedSize);
  return `<text x="${x}" y="${y}" font-size="${resolvedSize}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${lines.map((lineText, index) => `<tspan x="${x}" dy="${index ? resolvedSize * lineHeight : 0}">${esc(lineText)}</tspan>`).join("")}</text>`;
}

function rect(x, y, width, height, fill = C.surface, stroke = "none", strokeWidth = 0, radius = 0) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" data-role="structural"/>`;
}

function line(x1, y1, x2, y2, stroke = C.accent, width = 3, arrow = false, dash = "") {
  const resolvedWidth = Math.min(6, width);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${resolvedWidth}" data-role="connector"${dash ? ` stroke-dasharray="${dash}"` : ""}${arrow ? ` marker-end="url(#arrow_${stroke.slice(1)})"` : ""}/>`;
}

function pathLine(d, stroke = C.accent, width = 3, arrow = false, dash = "") {
  const resolvedWidth = Math.min(6, width);
  return `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${resolvedWidth}" stroke-linejoin="round" stroke-linecap="round" data-role="connector"${dash ? ` stroke-dasharray="${dash}"` : ""}${arrow ? ` marker-end="url(#arrow_${stroke.slice(1)})"` : ""}/>`;
}

function group(id, label, body, animated = true) {
  return `<g id="${id}"${animated ? ` data-anim-target="true" data-anim-label="${esc(label)}"` : ""}>${body}</g>`;
}

function target(id, label, keywords = [], action = "show") {
  return { id, label, keywords, action };
}

function sectionLabel(x, y, width, label, color = C.accent) {
  return `${txt(x, y, label.toUpperCase(), 18, 800, color)}${line(x, y + 16, x + width, y + 16, color, 2)}`;
}

function bulletList(x, y, width, items, options = {}) {
  const size = options.size || 24;
  const gap = options.gap || 66;
  const color = options.color || C.accent;
  return items.map((item, index) => {
    const yy = y + index * gap;
    return `<circle cx="${x}" cy="${yy - 8}" r="6" fill="${color}"/>${multi(x + 24, yy, width - 24, item, size, 650, options.fill || C.text)}`;
  }).join("");
}

function bottomBand(text, color = C.accent) {
  const corporateThread = color === C.accent ? rect(92, 858, 8, 84, C.educationAccent, C.educationAccent, 0, 4) : "";
  return `${rect(92, 858, 1736, 84, color, color, 0, 4)}${corporateThread}${txt(960, 911, text.toUpperCase(), 25, 820, "#FFFFFF", "middle")}`;
}

function numberStep(x, y, number, title, body, color = C.accent, width = 300) {
  return `<circle cx="${x}" cy="${y}" r="26" fill="${color}"/>${txt(x, y + 9, number, 22, 850, "#FFFFFF", "middle")}${txt(x + 52, y - 4, title, 23, 800, C.text)}${body ? multi(x + 52, y + 28, width - 52, body, 19, 560, C.muted) : ""}`;
}

function pictogram(href, x, y, size, kind, role = "concept-anchor") {
  return `<image href="${href}" x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet" data-pictogram-asset-type="generated_png" data-pictogram-style="reltest-education-minimal-v1" data-pictogram-kind="${kind}" data-pictogram-size="${size}" data-pictogram-semantic-role="${role}" aria-hidden="true"/>`;
}

function image(href, x, y, width, height, label, mode = "meet") {
  return `<image href="${href}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid ${mode}" role="img" aria-label="${esc(label)}"/>`;
}

function formulaAsset(href, x, y, width, height, label) {
  return `<image href="${href}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(label)}" data-formula-asset="${href}" data-qc-role="formula" data-qc-allow-overlap="true"/>`;
}

function node(x, y, width, height, label, options = {}) {
  const fill = options.fill || C.surface;
  const stroke = options.stroke || C.accent;
  const textFill = options.textFill || C.text;
  const size = options.size || 23;
  return `${rect(x, y, width, height, fill, stroke, options.strokeWidth || 2, options.radius ?? 4)}${txt(x + width / 2, y + height / 2 + size * 0.34, label, size, 750, textFill, "middle")}`;
}

function rbdBlock(x, y, label, options = {}) {
  return node(x, y, options.width || 108, options.height || 58, label, { fill: options.fill || C.surface, stroke: options.stroke || C.accent, textFill: options.textFill || C.text, size: options.size || 22, radius: 3, strokeWidth: options.strokeWidth || 2.5 });
}

function rbdSeries(x, y, labels, options = {}) {
  const blockW = options.blockW || 108;
  const gap = options.gap || 62;
  const centerY = y + 29;
  let body = `<circle cx="${x}" cy="${centerY}" r="6" fill="${C.deep}"/>${txt(x - 24, centerY + 8, "E", 22, 800, C.text, "end")}`;
  let cursor = x;
  labels.forEach((label, index) => {
    const bx = x + 42 + index * (blockW + gap);
    body += line(cursor, centerY, bx, centerY, options.pathColor || C.accent, 3);
    body += rbdBlock(bx, y, label, { width: blockW, stroke: index === options.highlightIndex ? (options.highlightColor || C.educationAccent) : C.accent, fill: index === options.highlightIndex ? C.educationAccentSoft : C.surface });
    cursor = bx + blockW;
    if (index === options.failureIndex) body += `<path d="M${bx + blockW / 2 - 18} ${y + 8}L${bx + blockW / 2 + 18} ${y + 50}M${bx + blockW / 2 + 18} ${y + 8}L${bx + blockW / 2 - 18} ${y + 50}" stroke="${C.failure}" stroke-width="6" stroke-linecap="round" data-role="failure-marker"/>`;
  });
  body += line(cursor, centerY, cursor + 42, centerY, options.pathColor || C.accent, 3);
  body += `<circle cx="${cursor + 42}" cy="${centerY}" r="6" fill="${C.deep}"/>${txt(cursor + 68, centerY + 8, "A", 22, 800, C.text)}`;
  return body;
}

function rbdParallel(x, y, labels, options = {}) {
  const blockW = options.blockW || 108;
  const rowGap = options.rowGap || 88;
  const topY = y;
  const bottomY = y + (labels.length - 1) * rowGap + 58;
  const left = x + 54;
  const right = left + blockW + 96;
  const midY = (topY + bottomY) / 2;
  let body = `<circle cx="${x}" cy="${midY}" r="6" fill="${C.deep}"/>${txt(x - 24, midY + 8, "E", 22, 800, C.text, "end")}${line(x, midY, left - 34, midY, C.accent, 3)}${line(left - 34, topY + 29, left - 34, bottomY - 29, C.accent, 3)}${line(right + 34, topY + 29, right + 34, bottomY - 29, C.accent, 3)}`;
  labels.forEach((label, index) => {
    const yy = y + index * rowGap;
    const pathColor = options.pathIndex === index ? (options.pathColor || C.educationAccent) : C.accent;
    body += line(left - 34, yy + 29, left, yy + 29, pathColor, options.pathIndex === index ? 6 : 3);
    body += rbdBlock(left, yy, label, { width: blockW, stroke: options.pathIndex === index ? pathColor : C.accent, fill: options.pathIndex === index ? C.educationAccentSoft : C.surface });
    body += line(left + blockW, yy + 29, right + 34, yy + 29, pathColor, options.pathIndex === index ? 6 : 3);
    if (options.failureIndices?.includes(index)) body += `<path d="M${left + blockW / 2 - 18} ${yy + 8}L${left + blockW / 2 + 18} ${yy + 50}M${left + blockW / 2 + 18} ${yy + 8}L${left + blockW / 2 - 18} ${yy + 50}" stroke="${C.failure}" stroke-width="6" stroke-linecap="round" data-role="failure-marker"/>`;
  });
  body += `${line(right + 34, midY, right + 76, midY, C.accent, 3)}<circle cx="${right + 76}" cy="${midY}" r="6" fill="${C.deep}"/>${txt(right + 102, midY + 8, "A", 22, 800, C.text)}`;
  return body;
}

function bridgeDiagram(x, y, options = {}) {
  const scale = options.scale || 1;
  const sw = 112 * scale;
  const sh = 54 * scale;
  const leftX = x;
  const rightX = x + 430 * scale;
  const midX = x + 215 * scale;
  const topY = y;
  const bottomY = y + 210 * scale;
  const entryX = x - 70 * scale;
  const exitX = rightX + sw + 70 * scale;
  const leftNodeX = x - 24 * scale;
  const rightNodeX = rightX + sw + 24 * scale;
  const topMidY = topY + sh / 2;
  const bottomMidY = bottomY + sh / 2;
  const midTop = topY + sh;
  const midBottom = bottomY;
  const focus = options.focusFive ? C.semanticWarning : C.accent;
  return `<g transform="translate(0 0)">${line(entryX, (topMidY + bottomMidY) / 2, leftNodeX, (topMidY + bottomMidY) / 2, C.accent, 3)}${line(leftNodeX, topMidY, leftNodeX, bottomMidY, C.accent, 3)}${line(leftNodeX, topMidY, x, topMidY, C.accent, 3)}${line(leftNodeX, bottomMidY, x, bottomMidY, C.accent, 3)}${rbdBlock(x, topY, "1", { width: sw, height: sh, size: 21 * scale })}${rbdBlock(x, bottomY, "2", { width: sw, height: sh, size: 21 * scale })}${line(x + sw, topMidY, midX, topMidY, C.accent, 3)}${line(x + sw, bottomMidY, midX, bottomMidY, C.accent, 3)}${line(midX, topMidY, rightX, topMidY, C.accent, 3)}${line(midX, bottomMidY, rightX, bottomMidY, C.accent, 3)}${rbdBlock(rightX, topY, "3", { width: sw, height: sh, size: 21 * scale })}${rbdBlock(rightX, bottomY, "4", { width: sw, height: sh, size: 21 * scale })}${line(rightX + sw, topMidY, rightNodeX, topMidY, C.accent, 3)}${line(rightX + sw, bottomMidY, rightNodeX, bottomMidY, C.accent, 3)}${line(rightNodeX, topMidY, rightNodeX, bottomMidY, C.accent, 3)}${line(rightNodeX, (topMidY + bottomMidY) / 2, exitX, (topMidY + bottomMidY) / 2, C.accent, 3)}${line(midX, topMidY, midX, midTop + 22 * scale, focus, options.focusFive ? 6 : 3)}${rbdBlock(midX - 42 * scale, midTop + 22 * scale, "5", { width: 84 * scale, height: 66 * scale, size: 21 * scale, stroke: focus, fill: options.focusFive ? C.semanticWarningSoft : C.surface, strokeWidth: options.focusFive ? 4 : 2.5 })}${line(midX, midTop + 88 * scale, midX, bottomMidY, focus, options.focusFive ? 6 : 3)}<circle cx="${midX}" cy="${topMidY}" r="6" fill="${focus}"/><circle cx="${midX}" cy="${bottomMidY}" r="6" fill="${focus}"/><circle cx="${entryX}" cy="${(topMidY + bottomMidY) / 2}" r="6" fill="${C.deep}"/>${txt(entryX - 22, (topMidY + bottomMidY) / 2 + 8, "E", 22, 800, C.text, "end")}<circle cx="${exitX}" cy="${(topMidY + bottomMidY) / 2}" r="6" fill="${C.deep}"/>${txt(exitX + 22, (topMidY + bottomMidY) / 2 + 8, "A", 22, 800, C.text)}</g>`;
}

function mixedDiagram(x, y, options = {}) {
  const blockW = options.blockW || 140;
  const blockH = options.blockH || 62;
  const entryX = x;
  const oneX = x + 72;
  const splitX = oneX + blockW + 90;
  const branchX = splitX + 72;
  const joinX = branchX + blockW + 90;
  const exitX = joinX + 72;
  const midY = y + 112;
  const topY = y;
  const bottomY = y + 164;
  return `<circle cx="${entryX}" cy="${midY}" r="6" fill="${C.deep}"/>${txt(entryX - 24, midY + 8, "E", 22, 850, C.text, "end")}${line(entryX, midY, oneX, midY, C.accent, 3)}${rbdBlock(oneX, midY - blockH / 2, "1", { width: blockW, height: blockH, size: 24 })}${line(oneX + blockW, midY, splitX, midY, C.accent, 3)}${line(splitX, topY + blockH / 2, splitX, bottomY + blockH / 2, C.accent, 3)}${line(splitX, topY + blockH / 2, branchX, topY + blockH / 2, C.accent, 3)}${line(splitX, bottomY + blockH / 2, branchX, bottomY + blockH / 2, C.accent, 3)}${rbdBlock(branchX, topY, "2", { width: blockW, height: blockH, size: 24 })}${rbdBlock(branchX, bottomY, "3", { width: blockW, height: blockH, size: 24 })}${line(branchX + blockW, topY + blockH / 2, joinX, topY + blockH / 2, C.accent, 3)}${line(branchX + blockW, bottomY + blockH / 2, joinX, bottomY + blockH / 2, C.accent, 3)}${line(joinX, topY + blockH / 2, joinX, bottomY + blockH / 2, C.accent, 3)}${line(joinX, midY, exitX, midY, C.accent, 3, true)}<circle cx="${exitX}" cy="${midY}" r="6" fill="${C.deep}"/>${txt(exitX + 24, midY + 8, "A", 22, 850, C.text)}`;
}

function separatedWorkingDiagram(x, y) {
  const bw = 82;
  const bh = 42;
  const left = x + 74;
  const right = x + 300;
  const split1 = x + 38;
  const join1 = x + 192;
  const split2 = x + 264;
  const join2 = x + 418;
  const top = y;
  const bottom = y + 76;
  const mid = y + 59;
  return `<circle cx="${x}" cy="${mid}" r="5" fill="${C.deep}"/>${txt(x - 20, mid + 7, "E", 20, 850, C.text, "end")}${line(x, mid, split1, mid, C.educationAccent, 3)}${line(split1, top + bh / 2, split1, bottom + bh / 2, C.educationAccent, 3)}${line(split1, top + bh / 2, left, top + bh / 2, C.educationAccent, 3)}${line(split1, bottom + bh / 2, left, bottom + bh / 2, C.educationAccent, 3)}${rbdBlock(left, top, "1", { width: bw, height: bh, size: 18, stroke: C.educationAccent, fill: C.educationAccentSoft })}${rbdBlock(left, bottom, "2", { width: bw, height: bh, size: 18, stroke: C.educationAccent, fill: C.educationAccentSoft })}${line(left + bw, top + bh / 2, join1, top + bh / 2, C.educationAccent, 3)}${line(left + bw, bottom + bh / 2, join1, bottom + bh / 2, C.educationAccent, 3)}${line(join1, top + bh / 2, join1, bottom + bh / 2, C.educationAccent, 3)}${line(join1, mid, split2, mid, C.accent, 3)}${line(split2, top + bh / 2, split2, bottom + bh / 2, C.accent, 3)}${line(split2, top + bh / 2, right, top + bh / 2, C.accent, 3)}${line(split2, bottom + bh / 2, right, bottom + bh / 2, C.accent, 3)}${rbdBlock(right, top, "3", { width: bw, height: bh, size: 18 })}${rbdBlock(right, bottom, "4", { width: bw, height: bh, size: 18 })}${line(right + bw, top + bh / 2, join2, top + bh / 2, C.accent, 3)}${line(right + bw, bottom + bh / 2, join2, bottom + bh / 2, C.accent, 3)}${line(join2, top + bh / 2, join2, bottom + bh / 2, C.accent, 3)}${line(join2, mid, join2 + 40, mid, C.accent, 3)}<circle cx="${join2 + 40}" cy="${mid}" r="5" fill="${C.deep}"/>${txt(join2 + 62, mid + 7, "A", 20, 850, C.text)}`;
}

function separatedFailedDiagram(x, y) {
  const bw = 72;
  const bh = 40;
  const splitX = x + 38;
  const firstX = x + 76;
  const secondX = x + 178;
  const joinX = x + 288;
  const top = y;
  const bottom = y + 82;
  const mid = y + 61;
  return `<circle cx="${x}" cy="${mid}" r="5" fill="${C.deep}"/>${txt(x - 20, mid + 7, "E", 20, 850, C.text, "end")}${line(x, mid, splitX, mid, C.accent, 3)}${line(splitX, top + bh / 2, splitX, bottom + bh / 2, C.accent, 3)}${line(splitX, top + bh / 2, firstX, top + bh / 2, C.accent, 3)}${line(splitX, bottom + bh / 2, firstX, bottom + bh / 2, C.accent, 3)}${rbdBlock(firstX, top, "1", { width: bw, height: bh, size: 17 })}${rbdBlock(secondX, top, "3", { width: bw, height: bh, size: 17 })}${rbdBlock(firstX, bottom, "2", { width: bw, height: bh, size: 17 })}${rbdBlock(secondX, bottom, "4", { width: bw, height: bh, size: 17 })}${line(firstX + bw, top + bh / 2, secondX, top + bh / 2, C.accent, 3)}${line(firstX + bw, bottom + bh / 2, secondX, bottom + bh / 2, C.accent, 3)}${line(secondX + bw, top + bh / 2, joinX, top + bh / 2, C.accent, 3)}${line(secondX + bw, bottom + bh / 2, joinX, bottom + bh / 2, C.accent, 3)}${line(joinX, top + bh / 2, joinX, bottom + bh / 2, C.accent, 3)}${line(joinX, mid, joinX + 40, mid, C.accent, 3)}<circle cx="${joinX + 40}" cy="${mid}" r="5" fill="${C.deep}"/>${txt(joinX + 62, mid + 7, "A", 20, 850, C.text)}`;
}

function gate(x, y, symbol, label, color = C.accent) {
  return `${rect(x - 8, y, 122, 88, C.surface, color, 3, 4)}${txt(x + 21, y + 55, symbol, 28, 850, color, "middle")}${txt(x + 41, y + 52, label, 18, 800, color)}`;
}

function buildSystemHierarchy() {
  const context = group("hierarchy_context", "Systembegriff", `${pictogram("media/layers.png", 92, 116, 116, "layers", "orientation")}${sectionLabel(244, 138, 470, "Systemebenen")}${multi(244, 188, 500, "Eine gemeinsame Funktion verbindet Teilsysteme, Baugruppen und Komponenten.", 28, 700)}${txt(244, 292, "FUNKTION", 17, 850, C.educationAccent)}${txt(244, 330, "Drehmoment übertragen", 25, 750, C.text)}${txt(244, 394, "FEHLFUNKTION", 17, 850, C.failure)}${txt(244, 432, "Stillstand", 25, 750, C.text)}`);
  const vehicle = group("hierarchy_vehicle", "Fahrzeug als System", `${node(1030, 96, 300, 76, "PKW", { fill: C.accent, stroke: C.accent, textFill: "#FFFFFF", size: 27 })}`);
  const subsystems = group("hierarchy_subsystems", "Teilsysteme Motor, Getriebe und Fahrwerk", `${line(1180, 172, 1180, 236, C.accent, 3)}${line(900, 236, 1460, 236, C.accent, 3)}${line(900, 236, 900, 278, C.accent, 3)}${line(1180, 236, 1180, 278, C.educationAccent, 5)}${line(1460, 236, 1460, 278, C.accent, 3)}${node(770, 278, 260, 70, "Motor", { stroke: C.accent })}${node(1050, 278, 260, 70, "Getriebe", { stroke: C.educationAccent, fill: C.educationAccentSoft })}${node(1330, 278, 260, 70, "Fahrwerk", { stroke: C.accent })}`);
  const gearbox = group("hierarchy_gearbox", "Getriebe im Fokus", `${rect(1062, 382, 236, 42, C.educationAccent, "none", 0, 3)}${txt(1180, 410, "GENAUER HINSEHEN", 17, 850, "#FFFFFF", "middle")}${line(1180, 348, 1180, 382, C.educationAccent, 5)}`);
  const components = group("hierarchy_components", "Komponenten des Getriebes", `${line(1180, 424, 1180, 488, C.accent, 3)}${line(810, 488, 1550, 488, C.accent, 3)}${["Eingangswelle", "Zahnräder", "Ausgangswelle", "Gehäuse"].map((label, index) => { const x = 680 + index * 250; return `${line(x + 105, 488, x + 105, 536, index === 1 ? C.failure : C.accent, index === 1 ? 5 : 3)}${node(x, 536, 210, 70, label, { stroke: index === 1 ? C.failure : C.accent, fill: index === 1 ? C.failureSoft : C.surface, size: 20 })}`; }).join("")}${sectionLabel(680, 650, 870, "Von der Funktion bis zur Ausfallursache")}${bulletList(680, 714, 880, ["Jede Ebene besitzt eine eigene Zuverlässigkeit.", "Ausfallursachen der Komponenten wirken nach oben.", "Systemzuverlässigkeit entsteht durch Verknüpfung."], { size: 22, gap: 54 })}`);
  return { body: `${context}${vehicle}${subsystems}${gearbox}${components}${bottomBand("Komponente → Baugruppe → Teilsystem → System")}`, targets: [target("hierarchy_context", "Systembegriff"), target("hierarchy_vehicle", "PKW"), target("hierarchy_subsystems", "Teilsysteme"), target("hierarchy_gearbox", "Getriebe"), target("hierarchy_components", "Komponenten")] , pictograms: [["layers.png", "layers", "Systemhierarchie"]] };
}

function buildGearWeibull() {
  const test = group("gear_test", "Wöhlertest", `${sectionLabel(92, 124, 490, "01 · Prüfen")}${pictogram("media/flask.png", 96, 176, 92, "flask", "action-cue")}${image("media/zahnrad-versagen.png", 220, 168, 390, 250, "Zahnradversagen im Wöhlertest")}${multi(96, 462, 500, "Zahnräder werden unter wechselnder Last bis zum Ausfall geprüft.", 24, 650)}`);
  const failures = group("gear_failures", "Ausfallzeiten erfassen", `${sectionLabel(680, 124, 500, "02 · Ausfallzeiten")}${line(720, 314, 1140, 314, C.accent, 4, true)}${[0.18,0.34,0.51,0.72,0.9].map((p,i)=>`<circle cx="${720+p*410}" cy="314" r="10" fill="${C.failure}"/>${txt(720+p*410, 356+(i%2)*34, `${[120,180,245,330,410][i]} h`, 17, 700, C.muted, "middle")}`).join("")}${multi(720, 462, 440, "Beobachtete Lebensdauern werden als Stichprobe geordnet.", 24, 650)}`);
  const weibull = group("gear_weibull", "Weibull-Modell", `${sectionLabel(1240, 124, 588, "03 · Weibull-Modell")}${line(1290, 424, 1290, 198, C.accent, 3)}${line(1290, 424, 1770, 424, C.accent, 3)}${pathLine("M1310 402 C1400 370 1480 335 1570 292 C1650 254 1720 220 1770 194", C.technical, 5)}${[0,1,2,3,4].map((i)=>`<circle cx="${1340+i*95}" cy="${388-i*43+(i%2?8:-4)}" r="8" fill="#FFFFFF" stroke="${C.failure}" stroke-width="4"/>`).join("")}${txt(1530, 492, "F(t) = 1 − exp[−(t/T)ᵇ]", 28, 750, C.text, "middle")}`);
  const confidence = group("gear_confidence", "Vertrauensbereich", `${pathLine("M1310 374 C1400 342 1480 305 1570 260 C1650 222 1720 186 1770 160", C.accent, 2.5, false, "10 8")}${pathLine("M1310 430 C1400 398 1480 365 1570 326 C1650 290 1720 254 1770 226", C.accent, 2.5, false, "10 8")}${txt(1530, 554, "Vertrauensbereich macht die Unsicherheit sichtbar", 21, 700, C.accent, "middle")}`);
  return { body: `${test}${failures}${weibull}${confidence}${bottomBand("Versuchsdaten → Verteilung → abgesicherte Zuverlässigkeitsaussage")}`, targets: [target("gear_test", "Wöhlertest"), target("gear_failures", "Ausfallzeiten"), target("gear_weibull", "Weibull-Modell"), target("gear_confidence", "Vertrauensbereich")], pictograms: [["flask.png", "flask", "Lebensdauerversuch"]] };
}

function buildReliabilityAggregation() {
  const components = group("aggregate_components", "Komponentenzuverlässigkeiten", `${sectionLabel(180, 724, 1560, "Komponenten")}${["Eingangswelle", "Zahnräder", "Ausgangswelle", "Gehäuse"].map((label,index)=>{const x=180+index*400;return `${txt(x,800,label,22,750,C.text)}${rect(x,824,300,12,C.accentSoft)}${rect(x,824,297-index*6,12,index===1?C.educationAccent:C.secondary)}${txt(x+300,808,index===1?"96,5 %":"99 %",20,800,index===1?C.educationAccent:C.accent,"end")}`;}).join("")}`);
  const gearbox = group("aggregate_gearbox", "Getriebezuverlässigkeit", `${pathLine("M360 724V650H960V588", C.accent, 3)}${pathLine("M760 724V650", C.accent, 3)}${pathLine("M1160 724V650", C.accent, 3)}${pathLine("M1560 724V650H960", C.accent, 3)}${node(800, 500, 320, 88, "Getriebe · 96,5 %", { fill: C.educationAccentSoft, stroke: C.educationAccent, size: 26, strokeWidth: 4 })}`);
  const subsystems = group("aggregate_subsystems", "Teilsystemzuverlässigkeiten", `${line(960,500,960,430,C.educationAccent,4)}${line(480,430,1440,430,C.accent,3)}${["Motor · 96,5 %","Getriebe · 96,5 %","Fahrwerk · 96,5 %"].map((label,index)=>{const x=330+index*480;return `${line(x+150,430,x+150,386,index===1?C.educationAccent:C.accent,index===1?4:3)}${node(x,310,300,76,label,{stroke:index===1?C.educationAccent:C.accent,fill:index===1?C.educationAccentSoft:C.surface,size:23})}`;}).join("")}`);
  const vehicle = group("aggregate_vehicle", "Fahrzeugzuverlässigkeit", `${line(960,310,960,246,C.accent,4)}${node(760,138,400,108,"PKW · ≈ 90 %",{fill:C.accent,stroke:C.accent,textFill:"#FFFFFF",size:32})}${txt(960,116,"SYSTEMWERT AUS TEILSYSTEMEN",17,850,C.educationAccent,"middle")}`);
  return { body: `${components}${gearbox}${subsystems}${vehicle}${bottomBand("Zuverlässigkeit wird über die Systemhierarchie verknüpft")}`, targets: [target("aggregate_components","Komponenten"),target("aggregate_gearbox","Getriebe"),target("aggregate_subsystems","Teilsysteme"),target("aggregate_vehicle","Fahrzeug")] };
}

function buildFtaWorkflow() {
  const process = group("fta_process","Lernweg der quantitativen FTA",`${txt(92,132,"Vom Systemverständnis bis zur berechneten Ausfallwahrscheinlichkeit",30,750,C.text)}`);
  const firstFour = group("fta_first_four","Erste vier Schritte",`${["System definieren","Top-Ereignis festlegen","Ursachen zerlegen","Gatter verknüpfen","Kennwerte bestimmen","Quantitativ bewerten"].map((label,index)=>{const x=92+index*292;const color=index<4?C.accent:(index===4?C.technical:C.educationAccent);return `${index<5?line(x+214,278,x+278,278,color,3,true):""}${rect(x,226,214,104,index<4?C.surface:(index===4?C.cyanSoft:C.educationAccentSoft),color,2.5,3)}${txt(x+22,258,String(index+1).padStart(2,"0"),18,850,color)}${multi(x+22,294,172,label,19,750,C.text)}`;}).join("")}`);
  const top = group("fta_top","Top-Ereignis",`${node(760,420,400,74,"Getriebe defekt",{fill:C.accent,stroke:C.accent,textFill:"#FFFFFF",size:27})}`);
  const tree = group("fta_tree","Ursachenebene",`${line(960,494,960,548,C.accent,3)}${line(600,548,1320,548,C.accent,3)}${line(600,548,600,592,C.accent,3)}${line(1320,548,1320,592,C.accent,3)}${node(420,592,360,68,"Kein Drehmoment",{size:22})}${node(1140,592,360,68,"Leckage",{size:22})}${gate(907,532,"≥1","ODER",C.accent)}`);
  const basis = group("fta_basis","Basisereignisse",`${[[300,"Ermüdung"],[550,"Materialfehler"],[1090,"Verschleiß"],[1340,"Alterung"]].map(([x,label])=>`${line(x+120,660,x+120,726,C.accent,2.5)}${node(x,726,240,62,label,{stroke:C.failure,fill:C.failureSoft,size:20})}`).join("")}${txt(960,842,"BASISEREIGNISSE · quantitativ beschreibbar",20,850,C.failure,"middle")}`);
  return { body:`${process}${firstFour}${top}${tree}${basis}${bottomBand("Qualitative Fehlerlogik + Kennwerte = quantitative FTA")}`,targets:[target("fta_process","FTA"),target("fta_first_four","Erste vier Schritte"),target("fta_top","Top-Ereignis"),target("fta_tree","Ursachen"),target("fta_basis","Basisereignisse")]};
}

function buildBasisProbabilities() {
  const events=group("basis_events","Basisereignisse",`${sectionLabel(92,112,720,"Fehlerbaum · Basisereignisse")}${node(250,180,400,70,"Getriebe defekt",{fill:C.accent,stroke:C.accent,textFill:"#FFFFFF",size:25})}${line(450,250,450,310,C.accent,3)}${line(250,310,650,310,C.accent,3)}${["Ermüdung","Materialfehler","Verschleiß","Alterung"].map((label,index)=>{const x=92+index*180;return `${line(x+78,310,x+78,362,C.accent,2.5)}${node(x,362,156,60,label,{stroke:C.failure,fill:C.failureSoft,size:17})}`;}).join("")}`);
  const metric=group("basis_metric","Ausfallwahrscheinlichkeit",`${sectionLabel(92,530,720,"Kennwert zum Zeitpunkt t")}${txt(452,622,"Fᵢ(t) = P(Tᵢ ≤ t)",42,800,C.failure,"middle")}${multi(180,680,550,"Bewertung jedes Basisereignisses für denselben Betriebszeitpunkt.",23,650,C.text,"start")}`);
  const sources=group("basis_sources","Datenquellen",`${sectionLabel(920,112,908,"Belastbare Quellen")}${[["media/flask.png","Versuch & Feld","Lebensdauerversuche · Felddaten","flask"],["media/database.png","Berechnung","Simulation · statistische Modelle","database"],["media/eye.png","Erfahrung","Historische Daten · Expertenschätzung","eye"]].map((item,index)=>{const x=920+index*300;return `${pictogram(item[0],x,184,88,item[3])}${txt(x,302,item[1],22,800,C.text)}${multi(x,340,250,item[2],19,600,C.muted)}`;}).join("")}${line(920,470,1828,470,C.border,2)}`);
  const assignment=group("basis_assignment","Werte zuordnen",`${txt(920,540,"ZUORDNEN",18,850,C.educationAccent)}${["Ermüdung · F₁(t)","Materialfehler · F₂(t)","Verschleiß · F₃(t)","Alterung · F₄(t)"].map((label,index)=>{const y=600+index*66;return `${txt(920,y,label,22,750,C.text)}${line(1190,y-7,1510,y-7,C.border,7)}${line(1190,y-7,1310+index*45,y-7,C.failure,7)}${txt(1570,y,`${[2,1,5,1][index]} %`,22,850,C.failure)}`;}).join("")}`);
  return {body:`${events}${metric}${sources}${assignment}${bottomBand("Je Basisereignis · ein Zeitpunkt · ein begründeter Kennwert")}`,targets:[target("basis_events","Basisereignisse"),target("basis_metric","Kennwert"),target("basis_sources","Datenquellen"),target("basis_assignment","Zuordnung")],pictograms:[["flask.png","flask","Versuchsdaten"],["database.png","database","Berechnung und Modelle"],["eye.png","eye","Erfahrung und historische Daten"]]};
}

function buildQuantitativeTree() {
  const input=group("quant_input","Eingangswerte",`${sectionLabel(92,120,410,"01 · Eingang")}${txt(92,182,"Basisereignisse",30,800,C.text)}${["F₁ = 2 %","F₂ = 1 %","F₃ = 5 %","F₄ = 1 %"].map((label,index)=>`${txt(110,270+index*76,label,26,800,C.failure)}${line(260,260+index*76,470,260+index*76,C.border,3)}`).join("")}`);
  const logic=group("quant_logic","Gatterlogik",`${sectionLabel(620,120,650,"02 · Logik")}${node(740,222,400,68,"Getriebe defekt",{fill:C.accent,stroke:C.accent,textFill:"#FFFFFF",size:24})}${line(940,290,940,344,C.accent,3)}${gate(887,318,"≥1","ODER",C.accent)}${pathLine("M887 362H760V430",C.accent,3)}${pathLine("M993 362H1120V430",C.accent,3)}${gate(707,430,"&","UND",C.accent)}${gate(1067,430,"≥1","ODER",C.accent)}${txt(940,590,"Gatter bestimmen, wie Teilwahrscheinlichkeiten verknüpft werden.",21,650,C.muted,"middle")}`);
  const output=group("quant_output","Top-Ereignis",`${sectionLabel(1390,120,438,"03 · Ergebnis")}${txt(1609,232,"Fₛ(t)",52,850,C.failure,"middle")}${txt(1609,288,"Gesamtausfallwahrscheinlichkeit",20,750,C.text,"middle")}${rect(1450,350,318,12,C.accentSoft)}${rect(1450,350,104,12,C.failure)}${txt(1609,420,"aus allen Pfaden",22,700,C.muted,"middle")}`);
  const flow=group("quant_flow","Berechnungsfluss",`${line(490,430,620,430,C.technical,4,true)}${line(1270,430,1390,430,C.technical,4,true)}${rect(92,730,1736,120,C.accentSoft,"none",0,3)}${txt(160,778,"BASISWERTE",18,850,C.accent)}${txt(470,800,"→",34,850,C.technical,"middle")}${txt(650,778,"BOOLSCHE LOGIK",18,850,C.accent)}${txt(1050,800,"→",34,850,C.technical,"middle")}${txt(1210,778,"SYSTEMWERT",18,850,C.accent)}${txt(160,824,"F₁(t) … Fₙ(t)",24,750,C.text)}${txt(650,824,"UND / ODER",24,750,C.text)}${txt(1210,824,"Fₛ(t)",24,750,C.text)}`);
  return {body:`${input}${logic}${output}${flow}${bottomBand("Basiswert → Logik → Systemwert")}`,targets:[target("quant_input","Eingangswerte"),target("quant_logic","Gatterlogik"),target("quant_output","Top-Ereignis"),target("quant_flow","Berechnung")]};
}

function buildLogicInversion() {
  const error=group("inversion_error","Fehlerbaum",`${sectionLabel(92,116,700,"Fehlerbaum · Ausfall")}${txt(442,206,"Fₛ(t)",42,850,C.failure,"middle")}${gate(389,254,"≥1","ODER",C.failure)}${line(442,342,442,400,C.failure,3)}${line(270,400,614,400,C.failure,3)}${line(270,400,270,452,C.failure,3)}${line(614,400,614,452,C.failure,3)}${node(170,452,200,66,"Ursache 1",{stroke:C.failure,fill:C.failureSoft,size:21})}${node(514,452,200,66,"Ursache 2",{stroke:C.failure,fill:C.failureSoft,size:21})}${txt(442,594,"Eine Ursache genügt für den Ausfall.",22,700,C.text,"middle")}`);
  const functional=group("inversion_function","Funktionsbaum",`${sectionLabel(1128,116,700,"Funktionsbaum · Funktion",C.educationAccent)}${txt(1478,206,"Rₛ(t)",42,850,C.educationAccent,"middle")}${gate(1425,254,"&","UND",C.educationAccent)}${line(1478,342,1478,400,C.educationAccent,3)}${line(1306,400,1650,400,C.educationAccent,3)}${line(1306,400,1306,452,C.educationAccent,3)}${line(1650,400,1650,452,C.educationAccent,3)}${node(1206,452,200,66,"Funktion 1",{stroke:C.educationAccent,fill:C.educationAccentSoft,size:21})}${node(1550,452,200,66,"Funktion 2",{stroke:C.educationAccent,fill:C.educationAccentSoft,size:21})}${txt(1478,594,"Alle Teilfunktionen müssen erfüllt sein.",22,700,C.text,"middle")}`);
  const swap=group("inversion_swap","Logik umkehren",`${line(810,314,1080,314,C.technical,4,true)}${line(1080,388,810,388,C.technical,4,true)}${rect(820,326,250,50,C.cyanSoft,C.technical,2,3)}${txt(945,358,"GATTER UMKEHREN",16,850,C.technical,"middle")}${txt(945,684,"F(t) = 1 − R(t)",34,800,C.text,"middle")}`);
  return {body:`${error}${functional}${swap}${bottomBand("Ausfalllogik invertieren · positive Funktionslogik erhalten")}`,targets:[target("inversion_error","Fehlerbaum"),target("inversion_function","Funktionsbaum"),target("inversion_swap","Logikumkehr")]};
}

function buildTreeToRbd() {
  const error=group("transform_error","Fehlerbaum",`${sectionLabel(92,120,500,"01 · Fehlerbaum")}${gate(270,240,"≥1","ODER",C.failure)}${txt(323,364,"Top-Ereignis",23,800,C.text,"middle")}${multi(148,420,360,"Ausfallursachen werden entlang der Fehlerlogik verknüpft.",21,620,C.muted,"start")}`);
  const functional=group("transform_function","Funktionsbaum",`${line(548,340,670,340,C.technical,4,true)}${sectionLabel(700,120,500,"02 · Funktionsbaum",C.educationAccent)}${gate(868,240,"&","UND",C.educationAccent)}${txt(921,364,"Systemfunktion",23,800,C.text,"middle")}${multi(746,420,360,"Ausfallwerte werden zu Zuverlässigkeiten, Gatter werden invertiert.",21,620,C.muted,"start")}`);
  const rbd=group("transform_rbd","Blockdiagramm",`${line(1150,340,1272,340,C.technical,4,true)}${sectionLabel(1302,120,526,"03 · Blockdiagramm")}${rbdSeries(1350,260,["1","2"],{blockW:118,gap:72})}${rbdParallel(1350,440,["1","2"],{blockW:118,rowGap:88})}`);
  const boolean=group("transform_boolean","Boolesches Modell",`${rect(92,720,1736,126,C.accentSoft,"none",0,3)}${txt(160,768,"BOOLSCHES MODELL",18,850,C.accent)}${txt(160,818,"Logische Systemstruktur → mathematische Zuverlässigkeitsfunktion Rₛ(t)",29,800,C.text)}${txt(1690,818,"UND · Serie    ODER · Parallel",22,800,C.educationAccent,"end")}`);
  return {body:`${error}${functional}${rbd}${boolean}${bottomBand("Fehlerbaum → Funktionsbaum → Zuverlässigkeitsblockdiagramm")}`,targets:[target("transform_error","Fehlerbaum"),target("transform_function","Funktionsbaum"),target("transform_rbd","Blockdiagramm"),target("transform_boolean","Boolesches Modell")]};
}

function buildRbdIntro() {
  const definition=group("rbd_definition","Definition",`${sectionLabel(92,116,600,"Grundidee · RBD")}${multi(92,178,560,"Grafisches Modell der funktionsbezogenen Systemstruktur.",30,750,C.text)}`);
  const blocks=group("rbd_blocks","Komponentenblöcke",`${rbdBlock(560,400,"1",{width:160,height:78,size:26})}${rbdBlock(840,400,"2",{width:160,height:78,size:26})}${rbdBlock(1120,400,"3",{width:160,height:78,size:26})}${rbdBlock(1400,400,"n",{width:160,height:78,size:26})}${pathLine("M640 340V260H440",C.accent,2.5)}${txt(420,250,"BLÖCKE",18,850,C.accent,"end")}${multi(92,280,320,"repräsentieren Komponenten oder Teilsysteme",21,650,C.text)}`);
  const connections=group("rbd_connections","Funktionale Verbindungen",`${line(460,439,560,439,C.accent,4)}${line(720,439,840,439,C.accent,4)}${line(1000,439,1120,439,C.accent,4)}${line(1280,439,1400,439,C.accent,4,"","12 10")}${line(1560,439,1660,439,C.accent,4)}<circle cx="460" cy="439" r="7" fill="${C.deep}"/><circle cx="1660" cy="439" r="7" fill="${C.deep}"/>${txt(430,448,"E",24,850,C.text,"end")}${txt(1690,448,"A",24,850,C.text)}${pathLine("M1200 520V620H1540",C.accent,2.5)}${txt(1560,628,"VERBINDUNGEN",18,850,C.accent)}${multi(1560,672,260,"beschreiben funktionale Abhängigkeiten",21,650,C.text)}`);
  const path=group("rbd_path","Durchgängiger Funktionspfad",`${line(460,439,1660,439,C.educationAccent,8,true)}${txt(960,752,"Durchgängiger Pfad von E nach A",28,850,C.educationAccent,"middle")}${txt(960,798,"→ System funktionsfähig",24,750,C.text,"middle")}`);
  return {body:`${definition}${blocks}${connections}${path}${bottomBand("Blöcke = Komponenten · Linien = funktionale Abhängigkeiten")}`,targets:[target("rbd_definition","Definition"),target("rbd_blocks","Blöcke"),target("rbd_connections","Verbindungen"),target("rbd_path","Funktionspfad")]};
}

function buildSeriesParallelBehavior() {
  const basis=group("behavior_basis","Zwei Basisstrukturen",`${sectionLabel(92,110,1736,"Zwei Basisstrukturen · gleiche Komponenten")}${line(960,180,960,820,C.border,2)}`);
  const series=group("behavior_series","Serienstruktur",`${txt(480,240,"SERIENSTRUKTUR",24,850,C.accent,"middle")}${rbdSeries(170,350,["1","2","3"],{blockW:120,gap:54})}${txt(480,540,"Alle Komponenten müssen funktionieren.",25,750,C.text,"middle")}`);
  const seriesFailure=group("behavior_series_failure","Ein Ausfall unterbricht den Pfad",`${rbdSeries(170,650,["1","2","3"],{blockW:120,gap:54,failureIndex:1})}${txt(480,842,"Ein Ausfall → Systemausfall",22,850,C.failure,"middle")}`);
  const parallel=group("behavior_parallel","Parallelstruktur",`${txt(1440,240,"PARALLELSTRUKTUR",24,850,C.accent,"middle")}${rbdParallel(1160,300,["1","2","3"],{blockW:130,rowGap:92})}${txt(1440,620,"Redundante Pfade übernehmen dieselbe Funktion.",25,750,C.text,"middle")}`);
  const parallelRule=group("behavior_parallel_rule","Mindestens ein Pfad",`${pathLine("M1170 421H1214V421H1474V421H1604",C.educationAccent,8,true)}${txt(1440,764,"Mindestens ein funktionsfähiger Pfad genügt.",24,850,C.educationAccent,"middle")}${txt(1440,812,"Erst der Ausfall aller Pfade stoppt das System.",21,700,C.text,"middle")}`);
  return {body:`${basis}${series}${seriesFailure}${parallel}${parallelRule}${bottomBand("Serie: alle · Parallel: mindestens einer")}`,targets:[target("behavior_basis","Basisstrukturen"),target("behavior_series","Serie"),target("behavior_series_failure","Serienausfall"),target("behavior_parallel","Parallel"),target("behavior_parallel_rule","Parallelregel")]};
}

function buildSeriesParallelMath() {
  const example=group("math_example","Beispiel mit drei Komponenten",`${sectionLabel(92,108,1736,"Drei identische Komponenten · Rᵢ(t) = 0,9")}${line(960,180,960,824,C.border,2)}`);
  const series=group("math_series","Serienformel",`${txt(480,244,"SERIE",23,850,C.accent,"middle")}${rbdSeries(170,292,["1","2","3"],{blockW:116,gap:52})}${txt(480,510,"Rₛ(t) = ∏ Rᵢ(t)",34,800,C.text,"middle")}${txt(480,568,"= 0,9 · 0,9 · 0,9",26,700,C.muted,"middle")}`);
  const parallel=group("math_parallel","Parallelformel",`${txt(1440,244,"PARALLEL",23,850,C.accent,"middle")}${rbdParallel(1180,278,["1","2","3"],{blockW:116,rowGap:76})}${txt(1440,584,"Rₛ(t) = 1 − ∏[1 − Rᵢ(t)]",34,800,C.text,"middle")}`);
  const resultSeries=group("math_result_series","Serienergebnis",`${rect(250,672,460,108,C.failureSoft,C.failure,3,3)}${txt(480,724,"72,9 %",38,850,C.failure,"middle")}${txt(480,762,"kleiner als 90 %",19,750,C.text,"middle")}`);
  const resultParallel=group("math_result_parallel","Parallelergebnis",`${rect(1210,672,460,108,C.educationAccentSoft,C.educationAccent,3,3)}${txt(1440,724,"99,9 %",38,850,C.educationAccent,"middle")}${txt(1440,762,"größer als 90 %",19,750,C.text,"middle")}`);
  return {body:`${example}${series}${parallel}${resultSeries}${resultParallel}${bottomBand("Serie senkt · Redundanz erhöht die Systemzuverlässigkeit")}`,targets:[target("math_series","Serienformel"),target("math_parallel","Parallelformel"),target("math_example","Beispiel"),target("math_result_series","Serienergebnis"),target("math_result_parallel","Parallelergebnis")]};
}

function buildMixedReduction() {
  const system=group("mixed_system","Gemischtes System",`${sectionLabel(92,112,850,"Ausgangssystem")}${mixedDiagram(120,228)}${txt(470,540,"Komponente 1 in Serie mit dem Parallelsystem 2∥3",23,750,C.text,"middle")}`);
  const parallel=group("mixed_parallel","Parallelsystem erkennen",`${rect(486,202,218,284,"none",C.educationAccent,4,4)}${txt(595,188,"TEILSYSTEM 2∥3",18,850,C.educationAccent,"middle")}`);
  const reduce=group("mixed_reduce","Parallelsystem reduzieren",`${sectionLabel(1010,112,818,"01 · Parallel reduzieren",C.educationAccent)}${numberStep(1038,246,"1","Teilsystem bilden","Komponenten 2 und 3 zusammenfassen",C.educationAccent,650)}${txt(1090,360,"R₂₃ = 1 − (1 − R₂)(1 − R₃)",34,800,C.text)}${line(1038,408,1038,488,C.technical,4,true)}`);
  const total=group("mixed_total","Gesamtsystem berechnen",`${numberStep(1038,548,"2","Mit Komponente 1 verknüpfen","Teilzuverlässigkeit liegt in Serie mit R₁",C.accent,650)}${txt(1090,662,"Rₛ = R₁ · R₂₃",38,850,C.text)}${rect(1090,716,600,70,C.accentSoft,"none",0,3)}${txt(1390,760,"Rₛ = R₁ · [1 − (1 − R₂)(1 − R₃)]",26,800,C.accent,"middle")}`);
  return {body:`${system}${parallel}${reduce}${total}${bottomBand("Gemischte Strukturen schrittweise auf bekannte Grundformen reduzieren")}`,targets:[target("mixed_system","Gemischtes System"),target("mixed_parallel","Parallelsystem"),target("mixed_reduce","Reduktion"),target("mixed_total","Gesamtformel")]};
}

function buildFtaFunctionRbd() {
  const error=group("cross_error","Fehlerbaum",`${sectionLabel(92,112,500,"01 · Fehlerbaum",C.failure)}${gate(270,238,"≥1","ODER",C.failure)}${txt(323,368,"Ausfall tritt ein, wenn",20,750,C.text,"middle")}${txt(323,404,"mindestens eine Ursache wirkt.",21,800,C.failure,"middle")}`);
  const functional=group("cross_function","Funktionsbaum",`${sectionLabel(710,112,500,"02 · Funktionsbaum",C.educationAccent)}${gate(878,238,"&","UND",C.educationAccent)}${txt(931,368,"Funktion ist erfüllt, wenn",20,750,C.text,"middle")}${txt(931,404,"alle Teilfunktionen wirken.",21,800,C.educationAccent,"middle")}`);
  const rbd=group("cross_links","Blockdiagramm und Beziehungen",`${sectionLabel(1328,112,500,"03 · Blockdiagramm")}${rbdSeries(1350,252,["1","2"],{blockW:116,gap:58})}${rbdParallel(1350,450,["1","2"],{blockW:116,rowGap:82})}${line(592,310,690,310,C.technical,4,true)}${line(1210,310,1308,310,C.technical,4,true)}`);
  const series=group("cross_series","UND entspricht Serie",`${line(900,520,900,608,C.educationAccent,3,true)}${txt(900,654,"UND → SERIE",24,850,C.educationAccent,"middle")}`);
  const parallel=group("cross_parallel","ODER entspricht Parallel",`${line(1555,650,1555,720,C.accent,3,true)}${txt(1555,764,"ODER → PARALLEL",24,850,C.accent,"middle")}`);
  return {body:`${error}${functional}${rbd}${series}${parallel}${bottomBand("Drei Sichten · eine konsistente Systemlogik")}`,targets:[target("cross_function","Funktionsbaum"),target("cross_error","Fehlerbaum"),target("cross_series","UND und Serie"),target("cross_parallel","ODER und Parallel"),target("cross_links","Beziehungen")]};
}

function buildBooleanPrerequisites() {
  const binary=group("assumptions_binary","Binäre Zustände",`${sectionLabel(92,110,500,"01 · Zwei Zustände")}${pictogram("media/shield.png",92,172,100,"shield")}${txt(224,216,"1 · funktionsfähig",26,850,C.educationAccent)}${txt(224,266,"0 · ausgefallen",26,850,C.failure)}${multi(92,342,460,"Keine Zwischenstufen wie eingeschränkt oder in Wartung.",22,650,C.text)}`);
  const repair=group("assumptions_repair","Nicht reparierbar",`${sectionLabel(710,110,500,"02 · Nicht reparierbar")}${pictogram("media/wrench-alert.png",710,172,100,"wrenchAlert","status")}${txt(842,222,"Ausfall bleibt bestehen",27,800,C.text)}${multi(710,342,460,"Das betrachtete System endet mit dem ersten Ausfall.",22,650,C.text)}`);
  const independent=group("assumptions_independent","Unabhängig",`${sectionLabel(1328,110,500,"03 · Unabhängig")}${pictogram("media/layers.png",1328,172,100,"layers","orientation")}${txt(1460,222,"Keine Kopplung",27,800,C.text)}${multi(1328,342,460,"Der Ausfall eines Bauteils verändert die anderen Wahrscheinlichkeiten nicht.",22,650,C.text)}`);
  const bridge=group("assumptions_bridge","Brückenschaltung",`${line(92,518,1828,518,C.border,2)}${txt(92,572,"WENN DIE STRUKTUR NICHT DIREKT REDUZIERBAR IST",18,850,C.failure)}${multi(92,628,520,"Die Brückenschaltung besitzt mehrere mögliche Systempfade und benötigt ein exaktes Verfahren.",24,700,C.text)}${bridgeDiagram(850,530,{scale:1.15,focusFive:true})}`);
  return {body:`${binary}${repair}${independent}${bridge}${bottomBand("Vor der Berechnung: Zustände · Reparierbarkeit · Unabhängigkeit prüfen")}`,targets:[target("assumptions_binary","Zwei Zustände"),target("assumptions_repair","Nicht reparierbar"),target("assumptions_independent","Unabhängig"),target("assumptions_bridge","Brückenschaltung")],pictograms:[["shield.png","shield","Funktionsfähigkeit"],["wrench-alert.png","wrenchAlert","Nicht reparierbarer Ausfall"],["layers.png","layers","Getrennte Komponenten"]]};
}

function buildBooleanStates() {
  const body=`${sectionLabel(92,118,1736,"Positive Logik")}${txt(490,330,"1",190,900,C.educationAccent,"middle")}${txt(490,430,"FUNKTIONSFÄHIG",28,850,C.educationAccent,"middle")}${line(960,210,960,640,C.border,2)}${txt(1430,330,"0",190,900,C.failure,"middle")}${txt(1430,430,"AUSGEFALLEN",28,850,C.failure,"middle")}${rect(280,540,1360,136,C.accentSoft,"none",0,3)}${txt(960,594,"xᵢ ∈ {0,1}",36,850,C.accent,"middle")}${txt(960,642,"Komponenten- und Systemzustände werden eindeutig codiert.",23,700,C.text,"middle")}${bottomBand("1 = Funktion · 0 = Ausfall")}`;
  return {body,targets:[]};
}

function buildBridgeSeparation() {
  const bridge=group("separation_bridge","Ausgangsbrücke",`${sectionLabel(92,112,790,"Ausgangsstruktur")}${bridgeDiagram(200,246,{scale:1.05,focusFive:false})}${sectionLabel(1040,112,788,"Methodenwahl")}${txt(1040,190,"DIREKTREDUKTION",18,850,C.accent)}${multi(1040,238,700,"Mit Reihen- und Parallelformeln nicht lösbar.",28,800,C.text)}`);
  const methods=group("separation_methods","Zwei exakte Methoden",`${txt(1040,372,"ZWEI EXAKTE VERFAHREN",18,850,C.accent)}${txt(1040,434,"Separation",28,850,C.educationAccent)}${line(1286,394,1286,446,C.border,2)}${txt(1338,434,"Multilinearform",28,850,C.accent)}`);
  const focus=group("separation_focus","Schlüsselkomponente 5",`${rect(372,316,108,90,"none",C.semanticWarning,4,4)}${line(426,406,426,556,C.semanticWarning,4,true)}${txt(426,600,"KOMPONENTE 5",18,850,C.semanticWarning,"middle")}${txt(426,642,"Schlüsselkomponente",24,800,C.text,"middle")}${txt(1040,574,"DIESE LEKTION",18,850,C.educationAccent)}${txt(1040,630,"Separation von Komponente 5",28,850,C.text)}${multi(1040,686,700,"Eine Schlüsselkomponente wird isoliert betrachtet.",24,700,C.text)}${bottomBand("Schlüsselkomponente isolieren · zwei Zustände getrennt betrachten")}`);
  return {body:`${bridge}${methods}${focus}`,targets:[target("separation_bridge","Brückenschaltung"),target("separation_methods","Methoden"),target("separation_focus","Komponente 5")]};
}

function buildBridgeSeparationCases() {
  const cases=group("separation_cases","Zwei disjunkte Fälle",`${sectionLabel(92,112,1736,"Separation nach Komponente 5")}${node(790,164,340,64,"Komponente 5",{fill:C.accent,textFill:"#FFFFFF",stroke:C.accent,size:24})}${line(960,228,960,258,C.accent,4)}${line(500,258,1420,258,C.accent,4)}${line(500,258,500,284,C.accent,4,true)}${line(1420,258,1420,284,C.accent,4,true)}${txt(500,318,"FALL I · FUNKTIONSFÄHIG",24,850,C.educationAccent,"middle")}${txt(1420,318,"FALL II · AUSGEFALLEN",24,850,C.failure,"middle")}${line(960,288,960,714,C.border,2)}`);
  const working=group("separation_case_working","Ersatzstruktur bei funktionsfähiger Komponente 5",`<g transform="translate(160 352) scale(1.32)">${separatedWorkingDiagram(24,0)}</g>${txt(500,548,"Zwei Parallelschaltungen in Serie",24,800,C.text,"middle")}`);
  const failed=group("separation_case_failed","Ersatzstruktur bei ausgefallener Komponente 5",`<g transform="translate(1172 352) scale(1.32)">${separatedFailedDiagram(24,0)}</g>${txt(1420,548,"Zwei Serienpfade parallel",24,800,C.text,"middle")}`);
  const workingFormula=group("separation_weight_working","Fallgewicht und Teilzuverlässigkeit des funktionsfähigen Zustands",`${txt(500,602,"Fallgewicht R₅",18,850,C.educationAccent,"middle")}${formulaAsset("formulas/bridge-case-working.svg",120,622,760,72,"Teilzuverlässigkeit für den Fall, dass Komponente 5 funktionsfähig ist")}`);
  const failedFormula=group("separation_weight_failed","Fallgewicht und Teilzuverlässigkeit des ausgefallenen Zustands",`${txt(1420,602,"Fallgewicht 1 − R₅",18,850,C.failure,"middle")}${formulaAsset("formulas/bridge-case-failed.svg",1040,622,760,72,"Teilzuverlässigkeit für den Fall, dass Komponente 5 ausgefallen ist")}`);
  const sum=group("separation_sum","Teilergebnisse addieren",`${line(92,714,1828,714,C.border,2)}${txt(92,756,"SYSTEMZUVERLÄSSIGKEIT",18,850,C.accent)}${formulaAsset("formulas/bridge-total.svg",92,770,430,60,"Systemzuverlässigkeit als Summe beider Teilzuverlässigkeiten")}${line(568,738,568,836,C.border,2)}${txt(624,756,"VOLLSTÄNDIGE FORMEL",18,850,C.accent)}${formulaAsset("formulas/bridge-expanded-working.svg",624,766,1156,38,"Erster Summand der vollständigen Separationsformel")}${formulaAsset("formulas/bridge-expanded-failed.svg",624,808,1156,38,"Zweiter Summand der vollständigen Separationsformel")}${bottomBand("Zwei disjunkte Fälle addieren · Satz der totalen Wahrscheinlichkeit")}`);
  return {body:`${cases}${working}${failed}${workingFormula}${failedFormula}${sum}`,targets:[target("separation_cases","Falltrennung"),target("separation_case_working","Ersatzstruktur Fall I"),target("separation_case_failed","Ersatzstruktur Fall II"),target("separation_weight_working","Teilzuverlässigkeit Fall I"),target("separation_weight_failed","Teilzuverlässigkeit Fall II"),target("separation_sum","Gesamtergebnis")]};
}

function buildMethodOverview() {
  const body=`${sectionLabel(92,112,1736,"Methodenspektrum")}${pictogram("media/settings.png",92,170,112,"settings","orientation")}${line(260,250,1740,250,C.accent,4,true)}${[[320,"EINFACH","Boolesche Systemtheorie",["nicht reparierbar","klare Logik"]],[950,"KOMPLEX","Dynamische Modelle",["Markov-Theorie","Petri-Netze","Monte-Carlo-Simulation"]],[1540,"ANALYTISCH","Exakte Verfahren",["Multilinearform","Mellin-Transformation"]]].map((item,index)=>{const color=index===1?C.technical:C.accent;return `${txt(item[0],226,item[1],18,850,color,"middle")}<circle cx="${item[0]}" cy="250" r="15" fill="${color}"/>${txt(item[0],330,item[2],27,850,C.text,"middle")}${item[3].map((b,i)=>`${txt(item[0]-140,400+i*54,"•",24,850,color)}${txt(item[0]-112,400+i*54,b,21,650,C.text)}`).join("")}`;}).join("")}${txt(260,720,"PRAKTISCH",18,850,C.educationAccent)}${line(390,714,1610,714,C.border,8)}${line(390,714,920,714,C.educationAccent,8)}${txt(1740,720,"MODELLKOMPLEXITÄT",18,850,C.accent,"end")}${bottomBand("Methode folgt Systemstruktur und Reparierbarkeit")}`;
  return {body,targets:[],pictograms:[["settings.png","settings","Methodenauswahl"]]};
}

function buildBooleanSummary() {
  const columns=[
    [92,"media/shield.png","Zwei Zustände",["funktionsfähig","ausgefallen"],"shield"],
    [710,"media/wrench-alert.png","Nicht reparierbar",["Ausfall bleibt bestehen","Systemlebensdauer endet"],"wrenchAlert"],
    [1328,"media/layers.png","Unabhängig",["keine gemeinsamen Ursachen","keine Wechselwirkungen"],"layers"],
  ];
  const body=`${sectionLabel(92,112,1736,"Drei Prüffragen")}${columns.map(([x,href,title,items,kind],index)=>`${pictogram(href,x,190,112,kind)}${txt(x,350,String(index+1).padStart(2,"0"),18,850,C.educationAccent)}${txt(x,398,title,30,850,C.text)}${bulletList(x,474,450,items,{size:22,gap:66})}${line(x,660,x+470,660,C.border,2)}`).join("")}${rect(92,744,1736,100,C.educationAccentSoft,"none",0,3)}${txt(960,804,"Erst wenn alle drei Annahmen gelten, sind die einfachen Formeln belastbar.",27,850,C.educationAccent,"middle")}${bottomBand("Annahmen prüfen, bevor gerechnet wird")}`;
  return {body,targets:[],pictograms:[["shield.png","shield","Funktionszustand"],["wrench-alert.png","wrenchAlert","Nicht reparierbar"],["layers.png","layers","Unabhängige Komponenten"]]};
}

function buildStructureReference() {
  const series=`${sectionLabel(92,116,520,"Serie")}${rbdSeries(110,250,["1","2","n"],{blockW:100,gap:46})}${txt(350,438,"Rₛ = ∏ Rᵢ",30,800,C.text,"middle")}${txt(350,500,"0,9³ = 0,729",22,850,C.failure,"middle")}`;
  const parallel=`${sectionLabel(700,116,520,"Parallel")}${rbdParallel(760,214,["1","2","n"],{blockW:106,rowGap:72})}${txt(960,494,"Rₛ = 1 − ∏(1 − Rᵢ)",29,800,C.text,"middle")}${txt(960,550,"1 − 0,1³ = 0,999",22,850,C.educationAccent,"middle")}`;
  const mixed=`${sectionLabel(1308,116,520,"Gemischt")}<g transform="translate(1250 172) scale(.72)">${mixedDiagram(120,100,{blockW:120,blockH:56})}</g>${txt(1568,494,"Rₛ = R₁ · [1−(1−R₂)(1−R₃)]",22,800,C.text,"middle")}${txt(1568,550,"schrittweise reduzieren",20,850,C.technical,"middle")}`;
  return {body:`${series}${parallel}${mixed}${line(92,610,1828,610,C.border,2)}${txt(92,664,"MERKREGELN",18,850,C.accent)}${bulletList(92,720,1650,["Serie: Ein Ausfall unterbricht die Funktion.","Parallel: Erst der Ausfall aller Pfade stoppt das System.","Gemischt: Teilstruktur zuerst, Gesamtsystem danach."],{size:22,gap:50})}${bottomBand("Ein Formelbaukasten für drei Grundstrukturen")}`,targets:[]};
}

function curvePoints(r, x, y, width, height) {
  const points=[];
  for(let n=1;n<=30;n+=1){const px=x+(n-1)/29*width;const value=Math.pow(r,n);const py=y+height-(value*height);points.push(`${px.toFixed(1)},${py.toFixed(1)}`);}return points.join(" ");
}

function buildComponentCountPlot() {
  const x=690,y=172,w=1090,h=620;
  const grid=[0,.2,.4,.6,.8,1].map(v=>`${line(x,y+h-v*h,x+w,y+h-v*h,C.border,1)}${txt(x-18,y+h-v*h+7,`${Math.round(v*100)}`,16,650,C.muted,"end")}`).join("");
  const curves=[[.999,C.educationAccent,"Rᵢ = 99,9 %"],[.995,C.technical,"Rᵢ = 99,5 %"],[.99,C.accent,"Rᵢ = 99 %"],[.95,C.failure,"Rᵢ = 95 %"]].map(([r,color,label],index)=>`<polyline points="${curvePoints(r,x,y,w,h)}" fill="none" stroke="${color}" stroke-width="${index===0?5:4}"/>${txt(x+w-10,y+80+index*62,label,19,800,color,"end")}`).join("");
  const body=`${sectionLabel(92,112,500,"Serienstruktur")}${multi(92,184,500,"Jede zusätzliche Komponente multipliziert einen weiteren Zuverlässigkeitswert in das System.",27,750,C.text)}${txt(92,364,"Rₛ = Rᵢⁿ",42,850,C.accent)}${bulletList(92,454,500,["Je kleiner Rᵢ, desto steiler der Abfall.","Viele gute Komponenten können ein schwaches System ergeben.","Komponentenzahl ist selbst ein Zuverlässigkeitstreiber."],{size:21,gap:76})}${grid}${line(x,y,x,y+h,C.accent,3)}${line(x,y+h,x+w,y+h,C.accent,3)}${curves}${txt(x+w/2,y+h+54,"Anzahl der Komponenten n",21,800,C.text,"middle")}<text x="${x-86}" y="${y+h/2}" font-size="21" font-weight="800" fill="${C.text}" text-anchor="middle" transform="rotate(-90 ${x-86} ${y+h/2})">Systemzuverlässigkeit Rₛ [%]</text>${bottomBand("In Serie sinkt Rₛ mit jeder zusätzlichen Komponente")}`;
  return {body,targets:[]};
}

function buildFreewheelTransfer() {
  const body=`${sectionLabel(92,112,600,"Anwendung · Freilauf")}${pictogram("media/settings.png",92,172,100,"settings","orientation")}${numberStep(92,338,"1","Konstruktion verstehen","Bauteile und Kraftfluss erkennen",C.accent,520)}${numberStep(92,486,"2","Funktion strukturieren","Systemfunktionen und Ausfallursachen ordnen",C.technical,520)}${numberStep(92,634,"3","RBD ableiten","Funktionspfade als Blöcke und Linien modellieren",C.educationAccent,520)}${line(572,338,660,338,C.accent,3,true)}${line(572,486,660,486,C.technical,3,true)}${line(572,634,660,634,C.educationAccent,3,true)}${image("media/freilauf-ableitung.png",700,142,1060,610,"Konstruktion, Funktionsstruktur und Zuverlässigkeitsblockdiagramm eines Freilaufs")}${rect(700,774,1060,54,C.accentSoft,"none",0,3)}${txt(1230,809,"System → Funktion → Zuverlässigkeitsblockdiagramm",22,850,C.accent,"middle")}${bottomBand("Technisches System nicht nach Form, sondern nach Funktion modellieren")}`;
  return {body,targets:[],pictograms:[["settings.png","settings","Technische Modellierung"]]};
}

function buildNetworkExercise() {
  const body=`${sectionLabel(92,112,520,"Arbeitsauftrag")}${txt(92,184,"Fünf Netzwerke",34,850,C.text)}${multi(92,232,500,"Bestimme für jedes System die Zuverlässigkeitsfunktion Rₛ(t).",25,700,C.text)}${numberStep(92,382,"1","Struktur lesen","Serie, Parallelität und Mischformen erkennen",C.accent,520)}${numberStep(92,516,"2","Funktion aufstellen","Bekannte Regeln schrittweise anwenden",C.technical,520)}${numberStep(92,650,"3","Wert berechnen","Für identische Komponenten Rₖ(t)=0,9 einsetzen",C.educationAccent,520)}${rect(92,750,490,74,C.educationAccentSoft,"none",0,3)}${txt(337,797,"Rₖ(t) = 0,9",28,850,C.educationAccent,"middle")}${image("media/netzwerke-aufgabe.png",650,130,1120,690,"Fünf Zuverlässigkeitsblockdiagramme der Übung")}${bottomBand("Erst Struktur erkennen · dann Formel · zuletzt Zahlen einsetzen")}`;
  return {body,targets:[]};
}

function createCreativeBuilders() {
  return Object.freeze({
    system_hierarchy: buildSystemHierarchy,
    gear_weibull: buildGearWeibull,
    reliability_aggregation: buildReliabilityAggregation,
    fta_workflow: buildFtaWorkflow,
    basis_probabilities: buildBasisProbabilities,
    quantitative_tree: buildQuantitativeTree,
    logic_inversion: buildLogicInversion,
    tree_to_rbd: buildTreeToRbd,
    rbd_intro: buildRbdIntro,
    series_parallel_behavior: buildSeriesParallelBehavior,
    series_parallel_math: buildSeriesParallelMath,
    mixed_reduction: buildMixedReduction,
    fta_function_rbd: buildFtaFunctionRbd,
    boolean_prerequisites: buildBooleanPrerequisites,
    boolean_states: buildBooleanStates,
    bridge_separation: buildBridgeSeparation,
    bridge_separation_cases: buildBridgeSeparationCases,
    method_overview: buildMethodOverview,
    boolean_summary: buildBooleanSummary,
    structure_reference: buildStructureReference,
    component_count_plot: buildComponentCountPlot,
    freewheel_transfer: buildFreewheelTransfer,
    network_exercise: buildNetworkExercise,
    ...require('./re4-feedback-builders').builders,
    ...require('./re4-rbd-feedback-builders').builders,
    ...require('./re4-final-feedback-builders').builders,
  });
}

module.exports = Object.freeze({ createCreativeBuilders });
