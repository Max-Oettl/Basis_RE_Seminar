"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const {
  pictogram,
  pictogramKinds,
  pictogramRegistry,
  pictogramTokens,
} = require("./reltest-pictograms");

test("library exposes active Education metadata for every pictogram", () => {
  assert.equal(pictogramRegistry.style, pictogramTokens.style);
  const legacySvgItems = pictogramRegistry.items.filter((item) => !item.assetType || item.assetType === "legacy_svg");
  assert.equal(pictogramKinds.length, legacySvgItems.length);
  for (const kind of pictogramKinds) {
    const markup = pictogram(kind, { size: 64 });
    assert.match(markup, /data-component="reltest-pictogram"/);
    assert.match(markup, new RegExp(`data-pictogram-kind="${kind}"`));
    assert.match(markup, /data-pictogram-style="reltest-education-minimal-v1"/);
    assert.match(markup, /stroke-width="1.8"/);
    assert.match(markup, /stroke-linecap="round"/);
    assert.match(markup, /stroke-linejoin="round"/);
  }
});

test("library rejects unregistered colors and unknown semantic roles", () => {
  assert.throws(
    () => pictogram("target", { size: 64, color: "#FF00FF" }),
    /not part of the RelTest Education pictogram palette/,
  );
  assert.throws(
    () => pictogram("target", { size: 64, semanticRole: "decoration" }),
    /Unknown pictogram semantic role/,
  );
});
