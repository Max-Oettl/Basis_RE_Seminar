"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..", "rebuild-proposals", "svg", "RE2");

test("all RE2 scenes are transparent content SVGs", () => {
  const files = fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^slide_\d+$/.test(entry.name))
    .map((entry) => path.join(root, entry.name, `${entry.name}.svg`))
    .filter((file) => fs.existsSync(file));

  assert.equal(files.length, 160);
  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    assert.match(source, /data-artifact-scope="content-svg"/, file);
    assert.match(source, /data-embedding-target="powerpoint-slide"/, file);
    assert.match(source, /"backgroundMode":"transparent"/, file);
    assert.doesNotMatch(source, /brand_background|backgroundGradient|technicalGrid/, file);
    assert.doesNotMatch(
      source,
      /<rect\b(?=[^>]*(?:width="1920"|width="100%"))(?=[^>]*(?:height="1080"|height="100%"))[^>]*>/,
      file,
    );
  }
});

test("RE2 generators do not emit slide backgrounds", () => {
  const generators = [
    "generate-re2-chapter2-full-slide-redesign.js",
    "generate-re2-chapter3-full-slide-redesign.js",
    "generate-re2-chapter4-full-slide-redesign.js",
  ];
  for (const name of generators) {
    const source = fs.readFileSync(path.join(__dirname, name), "utf8");
    assert.doesNotMatch(source, /backgroundGradient|technicalGrid|brand_background/, name);
    assert.doesNotMatch(source, /backgroundMode:\s*"brand-frame"/, name);
  }
});
