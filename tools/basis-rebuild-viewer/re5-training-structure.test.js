"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { normalizeStore } = require("./training-structure-domain");

const structurePath = path.resolve(
  __dirname,
  "..",
  "..",
  "analysis",
  "viewer-notes",
  "training-structure.json",
);
const textMapPath = path.resolve(
  __dirname,
  "..",
  "..",
  "analysis",
  "inventories",
  "RE5_svg-text-map.json",
);

const expectedSegments = [
  [1, 3, "chapter_001", "lesson_001"],
  [4, 6, "chapter_001", "lesson_002"],
  [7, 18, "chapter_001", "lesson_003"],
  [19, 21, "chapter_002", "lesson_004"],
  [22, 33, "chapter_002", "lesson_005"],
  [34, 40, "chapter_002", "lesson_006"],
  [41, 54, "chapter_003", "lesson_007"],
  [55, 73, "chapter_003", "lesson_008"],
  [74, 75, "chapter_003", "lesson_009"],
];

test("RE5 chapter and lesson assignments cover slides 1 through 75 exactly", () => {
  const store = normalizeStore(JSON.parse(fs.readFileSync(structurePath, "utf8")));
  const module = store.modules.RE5;

  assert.ok(module);
  assert.equal(module.chapters.length, 3);
  assert.equal(module.chapters.flatMap((chapter) => chapter.lessons).length, 9);

  const expectedAssignments = new Map();
  for (const [start, end, chapterId, lessonId] of expectedSegments) {
    for (let slideNumber = start; slideNumber <= end; slideNumber += 1) {
      assert.equal(expectedAssignments.has(slideNumber), false);
      expectedAssignments.set(slideNumber, {
        chapter_id: chapterId,
        lesson_id: lessonId,
      });
    }
  }

  assert.equal(expectedAssignments.size, 75);
  assert.equal(Object.keys(module.scene_assignments).length, 75);
  for (const [slideNumber, expected] of expectedAssignments) {
    const assignment = module.scene_assignments[`RE5::${slideNumber}`];
    assert.ok(assignment, `Folie ${slideNumber} ist nicht zugeordnet.`);
    assert.equal(assignment.chapter_id, expected.chapter_id);
    assert.equal(assignment.lesson_id, expected.lesson_id);
  }
});

test("RE5 speaker text map covers all source SVGs and all nine lessons", () => {
  const textMap = JSON.parse(fs.readFileSync(textMapPath, "utf8"));

  assert.equal(textMap.module_id, "RE5");
  assert.equal(textMap.mapping_status, "mapped");
  assert.equal(textMap.mappings.length, 75);
  assert.equal(textMap.unmapped_svgs.length, 0);
  assert.equal(textMap.unmapped_documents.length, 0);
  assert.equal(textMap.unmapped_text_sections.length, 0);

  const sectionIds = new Set();
  for (let slideNumber = 1; slideNumber <= 75; slideNumber += 1) {
    const mapping = textMap.mappings.find((entry) => entry.source_slide_number === slideNumber);
    assert.ok(mapping, `Sprechertext fuer Folie ${slideNumber} fehlt.`);
    assert.ok(mapping.spoken_text.trim(), `Sprechertext fuer Folie ${slideNumber} ist leer.`);
    assert.equal(fs.existsSync(path.resolve(__dirname, "..", "..", mapping.source_svg)), true);
    sectionIds.add(mapping.source_text_section_id);
  }

  assert.equal(sectionIds.size, 9);
});
