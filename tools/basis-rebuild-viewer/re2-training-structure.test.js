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

const expectedSegments = [
  [1, 3, "chapter_001", "lesson_001"],
  [4, 5, "chapter_002", "lesson_002"],
  [6, 9, "chapter_002", "lesson_003"],
  [10, 10, "chapter_002", "lesson_004"],
  [11, 13, "chapter_002", "lesson_005"],
  [14, 16, "chapter_002", "lesson_006"],
  [17, 19, "chapter_002", "lesson_007"],
  [20, 22, "chapter_003", "lesson_008"],
  [23, 23, "chapter_003", "lesson_009"],
  [24, 51, "chapter_003", "lesson_010"],
  [52, 62, "chapter_003", "lesson_011"],
  [63, 71, "chapter_004", "lesson_012"],
  [72, 77, "chapter_004", "lesson_013"],
  [78, 90, "chapter_004", "lesson_014"],
  [91, 96, "chapter_004", "lesson_015"],
  [97, 111, "chapter_004", "lesson_016"],
  [112, 127, "chapter_004", "lesson_017"],
  [128, 131, "chapter_004", "lesson_018"],
  [132, 138, "chapter_004", "lesson_019"],
  [139, 165, "chapter_004", "lesson_020"],
];

test("RE2 chapter and lesson assignments cover slides 1 through 165 exactly", () => {
  const store = normalizeStore(JSON.parse(fs.readFileSync(structurePath, "utf8")));
  const module = store.modules.RE2;

  assert.ok(module);
  assert.equal(module.chapters.length, 4);
  assert.equal(module.chapters.flatMap((chapter) => chapter.lessons).length, 20);

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

  assert.equal(expectedAssignments.size, 165);
  assert.equal(Object.keys(module.scene_assignments).length, 165);
  for (const [slideNumber, expected] of expectedAssignments) {
    const assignment = module.scene_assignments[`RE2::${slideNumber}`];
    assert.ok(assignment, `Folie ${slideNumber} ist nicht zugeordnet.`);
    assert.equal(assignment.chapter_id, expected.chapter_id);
    assert.equal(assignment.lesson_id, expected.lesson_id);
  }
});
