"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const mapPath = path.join(root, "analysis", "rebuild-plans", "RE2_source-reference-map.json");
const sourceMap = JSON.parse(fs.readFileSync(mapPath, "utf8"));
const existingByOutput = new Map(
  sourceMap.mappings
    .filter((entry) => entry.chapter === 4)
    .map((entry) => [entry.output_slide_number, entry]),
);

function lessonForSlide(slide) {
  if (slide <= 71) return 1;
  if (slide <= 77) return 2;
  if (slide <= 90) return 3;
  if (slide <= 96) return 4;
  if (slide <= 111) return 5;
  if (slide <= 127) return 6;
  if (slide <= 131) return 7;
  if (slide <= 138) return 8;
  return 9;
}

const directMappings = [];
for (let slide = 63; slide <= 165; slide += 1) {
  const existing = existingByOutput.get(slide);
  directMappings.push({
    work_unit: `slide_${String(slide).padStart(3, "0")}`,
    scene_id: existing?.scene_id || `re2_ch4_fmea_slide_${String(slide).padStart(3, "0")}`,
    chapter: 4,
    lesson: lessonForSlide(slide),
    output_slide_number: slide,
    source_slides: [slide],
    primary_source_slide: slide,
    mapping_type: "direct",
    rationale: "Eigenständiger, quelltreuer Zielzustand; Kapitel 4 wird ausdrücklich Folie für Folie umgesetzt.",
  });
}

sourceMap.mappings = [
  ...sourceMap.mappings.filter((entry) => entry.chapter !== 4),
  ...directMappings,
].sort((a, b) => a.output_slide_number - b.output_slide_number);
sourceMap.updated_at = "2026-07-24";
sourceMap.planning_status = "chapter_04_direct_mapping_and_redesign_plan";

fs.writeFileSync(mapPath, `${JSON.stringify(sourceMap, null, 2)}\n`, "utf8");
process.stdout.write(`Updated RE2 chapter 4 to ${directMappings.length} direct source-to-target mappings.\n`);
