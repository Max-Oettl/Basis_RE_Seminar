"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const {
  mappedSpeakerTextForSlide,
  spokenTextForSlide,
} = require("./server");

function sourceTextMap() {
  return {
    path: "analysis/inventories/RE2_svg-text-map.json",
    mappingStatus: "blocked",
    mappings: new Map([
      [1, {
        source_slide_number: 1,
        source_slide_key: "slide_001",
        mapping_status: "mapped",
        shared_text_group: "shared_text_001_002",
        spoken_text: "Gemeinsamer Sprechertext",
      }],
      [2, {
        source_slide_number: 2,
        source_slide_key: "slide_002",
        mapping_status: "mapped",
        shared_text_group: "shared_text_001_002",
        spoken_text: "Gemeinsamer Sprechertext",
      }],
      [3, {
        source_slide_number: 3,
        source_slide_key: "slide_003",
        mapping_status: "mapped",
        shared_text_group: null,
        spoken_text: "Einzelner Sprechertext",
      }],
    ]),
  };
}

test("resolves a shared speaker-text group from the SVG text map", () => {
  const resolved = mappedSpeakerTextForSlide(sourceTextMap(), 2);

  assert.equal(resolved.text, "Gemeinsamer Sprechertext");
  assert.equal(resolved.scope, "shared-section");
  assert.deepEqual(resolved.sourceSlides, [1, 2]);
  assert.equal(
    resolved.source,
    "analysis/inventories/RE2_svg-text-map.json#slide_002",
  );
});

test("uses an individual mapped speaker text when no scene plan exists", () => {
  const resolved = spokenTextForSlide(
    { path: "", scenes: [] },
    3,
    {},
    null,
    sourceTextMap(),
  );

  assert.equal(resolved.text, "Einzelner Sprechertext");
  assert.equal(resolved.scope, "slide");
  assert.deepEqual(resolved.sourceSlides, [3]);
  assert.equal(resolved.isOverride, false);
});

test("keeps an explicit scene-plan narration authoritative", () => {
  const resolved = spokenTextForSlide(
    {
      path: "analysis/rebuild-plans/RE2_scene-plan.json",
      scenes: [{
        output_slide_number: 3,
        source_slides: [3],
        spoken_text: "Freigegebener Szenentext",
      }],
    },
    3,
    {},
    null,
    sourceTextMap(),
  );

  assert.equal(resolved.text, "Freigegebener Szenentext");
  assert.equal(resolved.scope, "scene");
});
