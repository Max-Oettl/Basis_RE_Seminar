"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { normalizeStore } = require("./training-structure-domain");

const root = path.resolve(__dirname, "..", "..");
const structure = normalizeStore(JSON.parse(fs.readFileSync(
  path.join(root, "analysis", "viewer-notes", "training-structure.json"),
  "utf8",
)));
const scenePlan = JSON.parse(fs.readFileSync(
  path.join(root, "analysis", "rebuild-plans", "RE4_scene-plan.json"),
  "utf8",
));

const expectedSegments = [
  [1, 12, "chapter_001", "lesson_001", 1, 1],
  [13, 16, "chapter_002", "lesson_002", 2, 1],
  [17, 20, "chapter_002", "lesson_003", 2, 2],
  [21, 30, "chapter_002", "lesson_004", 2, 3],
  [31, 47, "chapter_003", "lesson_005", 3, 1],
  [48, 52, "chapter_003", "lesson_006", 3, 2],
  [53, 68, "chapter_004", "lesson_007", 4, 1],
];

function expectedPlacement(slideNumber) {
  const segment = expectedSegments.find(([start, end]) => slideNumber >= start && slideNumber <= end);
  assert.ok(segment, `Keine erwartete Zuordnung fuer Folie ${slideNumber}.`);
  return {
    chapterId: segment[2],
    lessonId: segment[3],
    chapter: segment[4],
    lesson: segment[5],
  };
}

test("RE4 chapter and lesson assignments cover the current 68 source slides", () => {
  const module = structure.modules.RE4;
  assert.ok(module);
  assert.equal(module.chapters.length, 4);
  assert.equal(module.chapters.flatMap((chapter) => chapter.lessons).length, 7);
  assert.equal(Object.keys(module.scene_assignments).length, 68);

  for (let slideNumber = 1; slideNumber <= 68; slideNumber += 1) {
    const expected = expectedPlacement(slideNumber);
    const assignment = module.scene_assignments[`RE4::${slideNumber}`];
    assert.ok(assignment, `Folie ${slideNumber} ist nicht zugeordnet.`);
    assert.equal(assignment.chapter_id, expected.chapterId);
    assert.equal(assignment.lesson_id, expected.lessonId);
  }
});

test("RE4 consolidated scenes inherit their placement from the legacy source ranges", () => {
  assert.equal(scenePlan.structure_status, "mapped_from_legacy_source_ranges");
  assert.equal(scenePlan.scenes.length, 22);

  for (const scene of scenePlan.scenes) {
    const expected = expectedPlacement(Math.min(...scene.source_slides));
    assert.equal(scene.chapter, expected.chapter, scene.work_unit);
    assert.equal(scene.lesson, expected.lesson, scene.work_unit);
    assert.equal(scene.structure_status, "mapped_from_legacy_source_ranges", scene.work_unit);
  }
});
