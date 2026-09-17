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
  path.join(root, "analysis", "rebuild-plans", "RE3_scene-plan.json"),
  "utf8",
));

const expectedSegments = [
  [1, 8, "chapter_001", "lesson_001", 1, 1],
  [9, 14, "chapter_001", "lesson_002", 1, 2],
  [15, 22, "chapter_001", "lesson_003", 1, 3],
  [23, 30, "chapter_001", "lesson_004", 1, 4],
  [31, 33, "chapter_002", "lesson_005", 2, 1],
  [34, 42, "chapter_002", "lesson_006", 2, 2],
  [43, 43, "chapter_003", "lesson_007", 3, 1],
  [44, 57, "chapter_004", "lesson_008", 4, 1],
  [58, 65, "chapter_005", "lesson_009", 5, 1],
  [66, 72, "chapter_005", "lesson_010", 5, 2],
];

function expectedPlacement(slideNumber) {
  const segment = expectedSegments.find(([start, end]) => slideNumber >= start && slideNumber <= end);
  assert.ok(segment, `Keine erwartete RE3-Zuordnung für Quellfolie ${slideNumber}.`);
  return {
    chapterId: segment[2],
    lessonId: segment[3],
    chapter: segment[4],
    lesson: segment[5],
  };
}

test("RE3 source-SVG ranges are transferred to five chapters and ten lessons", () => {
  const module = structure.modules.RE3;
  assert.ok(module);
  assert.equal(module.chapters.length, 5);
  assert.equal(module.chapters.flatMap((chapter) => chapter.lessons).length, 10);
  assert.equal(module.chapters[3].lessons[0].title, "Übung");
  assert.equal(Object.keys(module.scene_assignments).length, 72);

  for (let slideNumber = 1; slideNumber <= 72; slideNumber += 1) {
    const expected = expectedPlacement(slideNumber);
    const assignment = module.scene_assignments[`RE3::${slideNumber}`];
    assert.ok(assignment, `Quellfolie ${slideNumber} ist nicht zugeordnet.`);
    assert.equal(assignment.chapter_id, expected.chapterId);
    assert.equal(assignment.lesson_id, expected.lessonId);
  }
});

test("all 38 active RE3 scenes inherit one unambiguous lesson", () => {
  assert.equal(scenePlan.structure_status, "mapped_from_user_source_svg_ranges");
  assert.equal(scenePlan.scenes.length, 38);

  for (const scene of scenePlan.scenes) {
    const placementSources = scene.source_slides.length ? scene.source_slides : [scene.structure_source_slide];
    const placements = placementSources.map(expectedPlacement);
    const expected = placements[0];
    assert.ok(placements.every((placement) => (
      placement.chapter === expected.chapter && placement.lesson === expected.lesson
    )), `${scene.work_unit} überschreitet eine Kapitel- oder Lektionsgrenze.`);
    assert.equal(scene.chapter, expected.chapter, scene.work_unit);
    assert.equal(scene.lesson, expected.lesson, scene.work_unit);
    assert.equal(scene.structure_status, "mapped_from_user_source_svg_ranges", scene.work_unit);
  }
});

test("chapter five follows the user-confirmed active lesson content", () => {
  const lessonOne = scenePlan.scenes.filter((scene) => scene.chapter === 5 && scene.lesson === 1);
  const lessonTwo = scenePlan.scenes.filter((scene) => scene.chapter === 5 && scene.lesson === 2);
  assert.deepEqual(lessonOne.map((scene) => scene.output_slide_number), [58, 59, 60]);
  assert.deepEqual(lessonTwo.map((scene) => scene.output_slide_number), [67]);
  assert.equal(lessonOne[1].mapping_type, "new_content_from_confirmed_source_and_narration");
  assert.deepEqual(scenePlan.removed_source_slides, [60, 61, 62, 63, 64, 65, 66, 68, 69, 70, 71, 72]);
});
