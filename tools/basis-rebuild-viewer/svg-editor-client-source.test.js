"use strict";

const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const html = fs.readFileSync(path.join(__dirname, "svg-editor.html"), "utf8");
const client = fs.readFileSync(path.join(__dirname, "svg-editor.js"), "utf8");

test("Editor-Oberfläche bietet Ebenen, acht Ziehpunkte, Text und Formeln", () => {
  assert.match(html, /id="layerTree"/);
  assert.match(html, /id="canvasViewport"/);
  assert.equal((html.match(/data-handle="(?:nw|n|ne|e|se|s|sw|w)"/g) || []).length, 8);
  assert.match(html, /id="textField"/);
  assert.match(html, /id="formulaSourceField"/);
  assert.match(html, /id="versionsToggle"/);
  assert.equal((html.match(/data-layer-action="(?:back|backward|forward|front)"/g) || []).length, 4);
  assert.equal((html.match(/data-line-handle="(?:start|end)"/g) || []).length, 2);
  assert.match(html, /id="pickReferenceButton"/);
  assert.match(html, /data-align="dock"/);
  assert.match(html, /id="connectorHandles"/);
  assert.match(html, /id="multiSelectionBoxes"/);
  assert.match(html, /id="selectionMarquee"/);
  assert.match(html, /id="fontFamilyField"/);
  assert.match(html, /id="bulletStyleField"/);
  assert.match(html, /id="bulletColorField"/);
  assert.match(html, /id="addConnectorCorner"/);
  assert.equal((html.match(/data-connector-dock="(?:left|top|right|bottom)"/g) || []).length, 4);
  assert.equal((html.match(/data-brand-palette="(?:element|text)"/g) || []).length, 2);
  assert.equal((html.match(/data-palette-target-button="(?:fill|stroke)"/g) || []).length, 2);
  assert.ok((html.match(/class="formula-library-group"/g) || []).length >= 5);
  assert.ok(html.includes('data-insert="\\alpha"'));
  assert.ok(html.includes('data-insert="\\pi"'));
  assert.ok(html.includes('data-insert="\\begin{bmatrix}'));
  assert.ok(html.includes('data-insert="\\begin{cases}'));
  assert.ok(html.includes('data-insert="\\prod_{}^{}"'));
  assert.ok(html.includes('data-insert="\\partial"'));
  assert.ok(html.includes('data-insert="\\infty"'));
});

test("Client hält Bearbeitung, Vorschau und Persistenz sauber getrennt", () => {
  assert.match(client, /new XMLSerializer\(\)\.serializeToString\(state\.document\.documentElement\)/);
  assert.match(client, /function sanitizeDisplayClone\(\)/);
  assert.match(client, /data-svg-editor-path/);
  assert.match(client, /getScreenCTM\(\)/);
  assert.match(client, /matrixTransform\(matrix\.inverse\(\)\)/);
  assert.equal((client.match(/session\.parent = displayNode\(\)\?\.parentElement \|\| session\.parent/g) || []).length, 3);
  assert.match(client, /closest\?\.\("\[data-formula-asset\], \[data-qc-role='formula'\]"\)/);
  assert.match(client, /createElementNS\(SVG_NS, "tspan"\)/);
  assert.match(client, /return node\?\.localName === "text" \? node : null/);
  assert.match(client, /rootSelected \|\| state\.readOnly/);
  assert.match(client, /\/api\/svg-editor\/save/);
  assert.match(client, /\/api\/svg-editor\/restore/);
  assert.match(client, /beforeunload/);
  assert.match(client, /function moveLayer\(action\)/);
  assert.match(client, /function startLineEndpointResize\(event\)/);
  assert.match(client, /constrainLineEndpoint/);
  assert.match(client, /function alignToReference\(mode\)/);
  assert.match(client, /function startConnectorPointDrag\(event\)/);
  assert.match(client, /function insertConnectorPointFromHandle\(event\)/);
  assert.match(client, /function dockConnectorToReference\(side\)/);
  assert.match(client, /replaceConnectorWithPolyline/);
  assert.match(client, /function startMarquee\(event\)/);
  assert.match(client, /function finishMarquee\(\)/);
  assert.match(client, /function createMultiMoveSession\(event\)/);
  assert.match(client, /rectMatchesMarquee/);
  assert.match(client, /event\.ctrlKey \|\| event\.metaKey \|\| event\.shiftKey/);
  assert.match(client, /toggleOnClick/);
  assert.match(client, /activateInspectorForSelection/);
  assert.match(client, /data-editor-bullet/);
  assert.match(client, /font-family/);
  assert.match(client, /function handleCanvasWheel\(event\)/);
  assert.match(client, /zoomFromWheel/);
  assert.match(client, /panFromWheel/);
  assert.match(client, /addEventListener\("wheel", handleCanvasWheel, \{ passive: false \}\)/);
  assert.match(client, /after\.left \+ after\.width \* relativeX - anchorX/);
  assert.doesNotMatch(client, /Math\.min\(1\.15,/);
  assert.match(client, /reltest-education-slide-design-tokens\.json/);
  assert.match(client, /function applyBrandColor\(panel, color\)/);
  assert.match(client, /Marineblau 80 %/);
  assert.match(client, /prepareFormulaInsertion/);
});

test("Warnhinweis bezeichnet eine Datei erst bei mehreren Folien als geteilt", () => {
  assert.match(client, /sharedSlides\.length > 1/);
});
