"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..", "..");
const plan = JSON.parse(fs.readFileSync(path.join(root, "analysis", "rebuild-plans", "RE2_scene-plan.json"), "utf8"));
const curation = JSON.parse(fs.readFileSync(path.join(root, "analysis", "viewer-notes", "viewer-curation.json"), "utf8"));

test("RE2 viewer exposes only the 51 consolidated work units by default", () => {
  const activeSlides = plan.scenes.map((scene) => Number(String(scene.work_unit).replace("slide_", "")));
  assert.equal(activeSlides.length, 51);
  assert.equal(new Set(activeSlides).size, 51);

  for (let slideNumber = 1; slideNumber <= 165; slideNumber += 1) {
    const entry = curation.slides[`RE2::${slideNumber}`];
    assert.ok(entry, `Curation entry missing for RE2::${slideNumber}`);
    assert.equal(entry.hidden, !activeSlides.includes(slideNumber));
  }

  plan.scenes.forEach((scene, index) => {
    const slideNumber = Number(String(scene.work_unit).replace("slide_", ""));
    assert.equal(curation.slides[`RE2::${slideNumber}`].order, index + 1);
    assert.equal(scene.production_status, "complete");
  });
});

