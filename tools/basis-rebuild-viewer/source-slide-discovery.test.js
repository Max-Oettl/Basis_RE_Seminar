"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const { inferModuleAndSlide } = require("./server");

test("uses the PowerPoint SVG filename instead of the module folder number", () => {
  const root = path.resolve("source-materials", "basis-seminar", "powerpoint-svg");
  const filePath = path.join(root, "RE2", "SVG", "Modul_2", "Folie110.SVG");

  assert.deepEqual(inferModuleAndSlide(filePath, root), {
    moduleId: "RE2",
    slideNumber: 110,
  });
});

test("keeps explicit slide folders authoritative for nested proposal assets", () => {
  const root = path.resolve("rebuild-proposals", "svg");
  const filePath = path.join(
    root,
    "RE1",
    "slide_013",
    "plots",
    "confidence_plot_asset.inline.svg",
  );

  assert.deepEqual(inferModuleAndSlide(filePath, root), {
    moduleId: "RE1",
    slideNumber: 13,
  });
});
