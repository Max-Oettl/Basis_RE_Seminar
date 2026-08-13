"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..", "..");
const tokens = JSON.parse(fs.readFileSync(path.join(root, "brand", "reltest-education-slide-design-tokens.json"), "utf8"));
const client = fs.readFileSync(path.join(__dirname, "svg-editor.js"), "utf8");

test("SVG editor fallback palette contains the active Corporate Design colors", () => {
  const required = [
    "navy", "navyDeep", "navyDark", "navy80", "navy60", "navy40", "navy20", "navy10",
    "educationGreen", "educationGreen10", "educationGold", "educationCoral", "educationSteelCyan", "educationGraphiteBlue",
  ];
  for (const key of required) {
    assert.match(client, new RegExp(tokens.colors[key], "i"), `${key} fehlt in der Offline-Palette`);
  }
  assert.match(client, /\/files\/brand\/reltest-education-slide-design-tokens\.json/);
});
