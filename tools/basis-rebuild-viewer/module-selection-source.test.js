"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const viewerSource = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

test("RE3_TEST_1 ist aus der Modulauswahl und der Hauptansicht ausgeschlossen", () => {
  assert.ok(
    viewerSource.includes('const MODULES_EXCLUDED_FROM_SELECTION = new Set(["RE3_TEST_1"])'),
  );
  assert.match(
    viewerSource,
    /state\.slides = \(payload\.slides \|\| \[\]\)\.filter\([\s\S]*?MODULES_EXCLUDED_FROM_SELECTION\.has\(slide\.moduleId\)/,
  );
  assert.match(
    viewerSource,
    /state\.modules = \(payload\.modules \|\| \[\]\)\.filter\([\s\S]*?MODULES_EXCLUDED_FROM_SELECTION\.has\(moduleId\)/,
  );
});
