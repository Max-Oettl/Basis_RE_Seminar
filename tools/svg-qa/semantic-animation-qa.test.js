"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { inspectSemanticAnimationBoundaries } = require("./semantic-animation-qa");

test("verschachtelte semantische Gruppe darf nicht mit einem Listenpunkt enden", () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg">
    <g id="case" data-anim-target="true" data-anim-kind="semantic_group" data-anim-label="Fall">
      <g><text>Folge:</text><text>Inhalt</text></g>
      <g><text>•</text></g>
    </g>
  </svg>`;
  const findings = inspectSemanticAnimationBoundaries(svg);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].code, "orphan_list_marker");
  assert.match(findings[0].detail, /case/);
});

test("Abschnittslabel ohne zugehoerigen Inhalt wird beanstandet", () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg">
    <g id="impact" data-anim-target="true" data-anim-kind="semantic_group"><text>Ausmaß</text></g>
  </svg>`;
  const findings = inspectSemanticAnimationBoundaries(svg);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].code, "detached_list_label");
});

test("vollstaendige Liste bleibt ohne Befund", () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg">
    <g id="impact" data-anim-target="true" data-anim-kind="semantic_group">
      <text>•</text><text>Ausmaß</text><text>•</text><text>34 Millionen Fahrzeuge</text>
    </g>
  </svg>`;
  assert.deepEqual(inspectSemanticAnimationBoundaries(svg), []);
});
