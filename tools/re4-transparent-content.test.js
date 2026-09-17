"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { SCENES } = require("./re4-redesign-spec");

const repoRoot = path.resolve(__dirname, "..");
const svgRoot = path.join(repoRoot, "rebuild-proposals", "svg", "RE4");

test("all canonical RE4 scenes are transparent content SVGs", () => {
  assert.equal(SCENES.length, 23);
  for (const scene of SCENES) {
    const file = path.join(svgRoot, scene.work_unit, `${scene.work_unit}.svg`);
    assert.ok(fs.existsSync(file), file);
    const source = fs.readFileSync(file, "utf8");
    assert.match(source, /data-artifact-scope="content-svg"/, file);
    assert.match(source, /data-embedding-target="powerpoint-slide"/, file);
    assert.match(source, /"backgroundMode":"transparent"/, file);
    assert.doesNotMatch(source, /backgroundGradient|technicalGrid|brand_background/, file);
    assert.doesNotMatch(
      source,
      /<rect\b(?=[^>]*(?:width="1920"|width="100%"))(?=[^>]*(?:height="1080"|height="100%"))[^>]*>/,
      file,
    );
  }
});

test("the active RE4 design system does not use a generic card primitive", () => {
  const source = fs.readFileSync(path.join(__dirname, "re4-creative-builders.js"), "utf8");
  assert.doesNotMatch(source, /function\s+card\s*\(/);
  assert.doesNotMatch(source, /backgroundMode:\s*"brand-frame"/);
});

test("legacy scenes keep their existing band; revised scenes omit the redundant band", () => {
  for (const scene of SCENES) {
    const file = path.join(svgRoot, scene.work_unit, `${scene.work_unit}.svg`);
    const source = fs.readFileSync(file, "utf8");
    if([1,5,7,13,17,21,23,25,31,33,39,41,44,48,54,55,58,61,62,63,65,66].includes(scene.output_slide_number)) {
      assert.doesNotMatch(source, /<rect x="92" y="858" width="1736" height="84"/);
      continue;
    }
    assert.match(source, /<rect x="92" y="858" width="1736" height="84" rx="4" fill="#142452"/, file);
    assert.match(source, /<rect x="92" y="858" width="8" height="84" rx="4" fill="#00A653"/, file);
  }
});

test("scene 13 keeps the scene title downstream and shows only the learning-path subtitle", () => {
  const file = path.join(svgRoot, "slide_013", "slide_013.svg");
  const source = fs.readFileSync(file, "utf8");
  assert.doesNotMatch(source, />QUANTITATIVE FEHLERBAUMANALYSE</i);
  assert.match(source, />Beispiel: Getriebe</);
});

test("scenes 55 and 58 preserve the separation derivation without overloading the introduction", () => {
  const introductionFile = path.join(svgRoot, "slide_055", "slide_055.svg");
  const introduction = fs.readFileSync(introductionFile, "utf8");
  for (const requiredContent of [
    "Mit Reihen- und Parallelformeln",
    "allein nicht lösbar.",
    "Separation",
    "Multilinearform",
    "Komponente 5 verbindet die beiden Pfade",
  ]) {
    assert.ok(introduction.includes(requiredContent), `${introductionFile}: ${requiredContent}`);
  }
  assert.doesNotMatch(introduction, /Fallgewicht|bridge-case-working|bridge-expanded/);

  const calculationFile = path.join(svgRoot, "slide_058", "slide_058.svg");
  const calculation = fs.readFileSync(calculationFile, "utf8");
  for (const requiredContent of [
    "Fall I · funktionsfähig",
    "Fall II · ausgefallen",
    "Zwei Parallelschaltungen in Serie",
    "Zwei Serienpfade parallel",
    "Fallgewicht R₅",
    "Fallgewicht 1 − R₅",
    "formulas/case-working-line1.svg",
    "formulas/case-working-line2.svg",
    "formulas/case-failed-line1.svg",
    "formulas/case-failed-line2.svg",
    "formulas/bridge-total.svg",
    "formulas/bridge-expanded-working.svg",
    "formulas/bridge-expanded-failed.svg",
    "Satz der totalen Wahrscheinlichkeit",
  ]) {
    assert.ok(calculation.includes(requiredContent), `${calculationFile}: ${requiredContent}`);
  }

  for (const filename of [
    "case-working-line1.svg",
    "case-working-line2.svg",
    "case-failed-line1.svg",
    "case-failed-line2.svg",
    "bridge-total.svg",
    "bridge-expanded-working.svg",
    "bridge-expanded-failed.svg",
  ]) {
    const formulaFile = path.join(svgRoot, "slide_058", "formulas", filename);
    const formula = fs.readFileSync(formulaFile, "utf8");
    assert.match(formula, /data-formula-fontsize=/, formulaFile);
    assert.doesNotMatch(formula, /<text\b|<tspan\b/, formulaFile);
  }
});
