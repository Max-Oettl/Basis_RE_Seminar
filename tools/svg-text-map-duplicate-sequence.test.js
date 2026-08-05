"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { findAdjacentDuplicateSvgSequences } = require("./validate-svg-text-map");

function mappings(hashes, firstSlide = 1) {
  return hashes.map((hash, index) => ({
    source_slide_number: firstSlide + index,
    source_svg_sha256: hash,
  }));
}

test("finds a directly repeated multi-slide SVG sequence", () => {
  const duplicates = findAdjacentDuplicateSvgSequences(
    mappings(["a", "b", "c", "a", "b", "c"], 52),
  );

  assert.equal(duplicates.length, 1);
  assert.deepEqual(
    duplicates[0].first.map((entry) => entry.source_slide_number),
    [52, 53, 54],
  );
  assert.deepEqual(
    duplicates[0].second.map((entry) => entry.source_slide_number),
    [55, 56, 57],
  );
});

test("finds a directly repeated single-slide SVG state", () => {
  const duplicates = findAdjacentDuplicateSvgSequences(mappings(["a", "a"], 102));

  assert.equal(duplicates.length, 1);
  assert.equal(duplicates[0].first[0].source_slide_number, 102);
  assert.equal(duplicates[0].second[0].source_slide_number, 103);
});

test("ignores matching hashes that are not adjacent blocks", () => {
  assert.deepEqual(
    findAdjacentDuplicateSvgSequences(mappings(["a", "b", "x", "a", "b"])),
    [],
  );
});

test("uses active ordering even when archived slides leave a number gap", () => {
  const duplicates = findAdjacentDuplicateSvgSequences([
    { source_slide_number: 102, source_svg_sha256: "a" },
    { source_slide_number: 104, source_svg_sha256: "a" },
  ]);

  assert.equal(duplicates.length, 1);
});
