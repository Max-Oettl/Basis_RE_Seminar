const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const source = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

test("main viewer exposes the SVG editor as a proposal action", () => {
  assert.match(source, /id="svgEdit"[^>]*>SVG bearbeiten<\/button>/);
  assert.match(source, /location\.href = `\/svg-editor\?id=\$\{encodeURIComponent\(slide\.id\)\}`/);
  assert.match(source, /state\.selectedVersionId !== "current"/);
});
