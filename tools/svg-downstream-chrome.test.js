"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  findDownstreamOwnedSlideChrome,
  stripDownstreamOwnedSlideChrome,
} = require("./svg-downstream-chrome");

const fullSlideFixture = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
  <title id="accessible_title">Fachlicher Titel</title>
  <style>text{font-family:Arial}.slide-title{fill:#102A43}</style>
  <rect width="1920" height="1080" fill="#F9FBFC"/>
  <rect x="74" y="36" width="118" height="5" fill="#007EA7"/>
  <text x="78" y="116" class="slide-title">Sichtbarer Titel</text>
  <line x1="78" y1="148" x2="1842" y2="148"/>
  <g id="scene_content"><text x="100" y="300">Fachinhalt</text></g>
  <line x1="78" y1="982" x2="1842" y2="982"/>
  <text x="78" y="1026">Professional Reliability Training | Reliability Engineer</text>
  <text x="1580" y="1026">RE1 · Szene 06</text>
  <g id="official_logo_reserved"/>
</svg>`;

test("strips downstream-owned slide chrome and preserves content metadata", () => {
  const stripped = stripDownstreamOwnedSlideChrome(fullSlideFixture);

  assert.deepEqual(findDownstreamOwnedSlideChrome(stripped), []);
  assert.match(stripped, /<title id="accessible_title">Fachlicher Titel<\/title>/);
  assert.match(stripped, /<g id="scene_content"><text x="100" y="300">Fachinhalt<\/text><\/g>/);
  assert.match(stripped, /<rect width="1920" height="1080" fill="#F9FBFC"\/>/);
});

test("detects each downstream-owned chrome category before cleanup", () => {
  assert.deepEqual(findDownstreamOwnedSlideChrome(fullSlideFixture), [
    "visible_slide_title",
    "training_footer",
    "scene_label",
    "title_accent",
    "title_rule",
    "footer_rule",
    "logo_placeholder",
  ]);
});
