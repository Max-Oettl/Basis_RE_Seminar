"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { SCENES, REMOVED_SOURCE_SLIDES, SOURCE_STATE_COUNT } = require("./re3-redesign-spec");

const repoRoot = path.resolve(__dirname, "..");
const svgRoot = path.join(repoRoot, "rebuild-proposals", "svg", "RE3");

test("all canonical RE3 scenes are transparent content SVGs", () => {
  assert.equal(SCENES.length, 38);
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

test("the active RE3 design system does not use a generic card primitive", () => {
  const source = fs.readFileSync(path.join(__dirname, "re3-creative-builders.js"), "utf8");
  assert.doesNotMatch(source, /function\s+card\s*\(/);
  assert.doesNotMatch(source, /backgroundMode:\s*"brand-frame"/);
});

test("RE3 covers all active source states exactly once and archives the superseded chapter-five states", () => {
  const sources = SCENES.flatMap((scene) => scene.source_slides);
  assert.equal(SOURCE_STATE_COUNT, 72);
  assert.equal(sources.length, 60);
  assert.equal(new Set(sources).size, 60);
  assert.deepEqual(
    [...new Set([...sources, ...REMOVED_SOURCE_SLIDES])].sort((a, b) => a - b),
    Array.from({ length: 72 }, (_, index) => index + 1),
  );
  assert.deepEqual(REMOVED_SOURCE_SLIDES, [60, 61, 62, 63, 64, 65, 66, 68, 69, 70, 71, 72]);
});

test("split narration sections preserve their source paragraphs without repetition", () => {
  const textMap = JSON.parse(fs.readFileSync(path.join(repoRoot, "analysis", "inventories", "RE3_svg-text-map.json"), "utf8"));
  for (const sectionId of ["section_003", "section_008", "section_013", "section_018", "section_019"]) {
    const source = textMap.mappings.find((entry) => entry.source_text_section_id === sectionId);
    const paragraphs = String(source.spoken_text).split(/\n\s*\n/).map((value) => value.trim()).filter(Boolean);
    const assigned = SCENES.filter((scene) => scene.source_text_section_id === sectionId && Array.isArray(scene.narration_paragraphs))
      .flatMap((scene) => scene.narration_paragraphs);
    assert.deepEqual(assigned, paragraphs.map((_, index) => index), sectionId);
  }
});

test("critical technical details remain visible in the rebuilt exercise and result sequence", () => {
  const expectations = new Map([
    [24, ["5-%-Grenze", "95-%-Grenze", "Zweiseitiger Vertrauensbereich"]],
    [27, ["maximale Ausfallwahrscheinlichkeit", "Eine obere Grenze", "90-%-Grenze"]],
    [29, ["Minimale Ausfallwahrscheinlichkeit", "Minimale Zuverlässigkeit", "10-%-Grenze", "Dichte f(R)"]],
    [39, ["Analyse A", "B: zensiert", "Analyse B", "A: zensiert", "Beobachtung: A und B"]],
    [44, ["1.528 N/mm²", "15,1", "30,5"]],
    [45, ["7,9", "6,7 %", "30,5", "93,3 %"]],
    [47, ["380 N/mm²", "186.000", "B₁₀", "B₅", "R(50.000 LW)"]],
    [49, ["2,69218", "1,83271", "3,95472", "18,4396", "22,6376"]],
    [50, ["12.800", "128.000", "B₂", "70.000 km"]],
    [56, ["12.367", "37.512", "12 × 40.000", "Suspensionen"]],
    [58, ["3-Parameter-Weibullverteilung", "besser geeignet?", "Weibull mit 3 Parametern"]],
    [59, ["2,99231", "35.255,4", "20.008,5", "t₀ = −1374", "Stichprobe überprüfen"]],
    [60, ["Ausfallfreie Zeit begründbar", "Deutlich konkaver Verlauf", "Ausreichend großer Stichprobenumfang", "2-PARAMETER-WEIBULL", "t = 0"]],
    [67, ["eine Gerade passt schlecht", "jeweils separat analysieren", "eine eigene Weibull-Verteilung", "IMMER GETRENNT AUSWERTEN"]],
  ]);
  for (const [slide, snippets] of expectations) {
    const number = String(slide).padStart(3, "0");
    const svg = fs.readFileSync(path.join(svgRoot, `slide_${number}`, `slide_${number}.svg`), "utf8");
    for (const snippet of snippets) assert.ok(svg.includes(snippet), `slide_${number} fehlt: ${snippet}`);
  }
});

test("chapter-five special-case plots are Python-generated and present beside their source data", () => {
  const assets = [
    [58, "three-parameter-weibull.svg", "three_parameter.json"],
    [59, "three-parameter-weibull.svg", "three_parameter.json"],
    [67, "multiple-mechanisms-joint.svg", "mechanisms_joint.json"],
    [67, "multiple-mechanisms-split.svg", "mechanisms_split.json"],
  ];
  for (const [slide, plot, data] of assets) {
    const number = String(slide).padStart(3, "0");
    assert.ok(fs.existsSync(path.join(svgRoot, `slide_${number}`, "plots", plot)), `${number}/${plot}`);
    assert.ok(fs.existsSync(path.join(svgRoot, `slide_${number}`, "data", data)), `${number}/${data}`);
  }
});
