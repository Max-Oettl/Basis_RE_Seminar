"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const viewerSource = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

test("show and draw targets start fully transparent at progress zero", () => {
  assert.match(viewerSource, /element\.style\.opacity = String\(value\);/);
  assert.doesNotMatch(viewerSource, /Math\.max\(0\.15,\s*value\)/);
});

test("animation step pause defaults to one second in both viewer modes", () => {
  assert.equal(
    viewerSource.match(/<option value="1000" selected>1,0 s<\/option>/g)?.length,
    2,
  );
  assert.doesNotMatch(viewerSource, /<option value="2500" selected>/);
  assert.match(viewerSource, /animationPauseMs:\s*1000,/);
  assert.match(viewerSource, /return options\.length \? options : \[1000\];/);
});
