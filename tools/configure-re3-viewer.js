"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { SCENES, SOURCE_STATE_COUNT } = require("./re3-redesign-spec");

const root = path.resolve(__dirname, "..");
const curationPath = path.join(root, "analysis", "viewer-notes", "viewer-curation.json");

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function main() {
  const active = new Map(SCENES.map((scene, index) => [scene.output_slide_number, index + 1]));
  const store = readJson(curationPath, { schema_version: "basisRebuildViewerCuration/v1", slides: {} });
  store.schema_version = "basisRebuildViewerCuration/v1";
  store.slides = store.slides && typeof store.slides === "object" ? store.slides : {};
  const updatedAt = new Date().toISOString();
  for (let slide = 1; slide <= SOURCE_STATE_COUNT; slide += 1) {
    const key = `RE3::${slide}`;
    const current = store.slides[key] && typeof store.slides[key] === "object" ? store.slides[key] : {};
    store.slides[key] = { ...current, order: active.get(slide) || null, hidden: !active.has(slide), updated_at: updatedAt };
  }
  fs.mkdirSync(path.dirname(curationPath), { recursive: true });
  fs.writeFileSync(curationPath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  process.stdout.write(`Configured RE3 viewer: ${active.size} active scenes, ${SOURCE_STATE_COUNT - active.size} hidden source states.\n`);
}

main();
