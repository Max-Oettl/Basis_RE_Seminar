"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const planPath = path.join(root, "analysis", "rebuild-plans", "RE2_scene-plan.json");
const curationPath = path.join(root, "analysis", "viewer-notes", "viewer-curation.json");

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function slideNumberFromWorkUnit(workUnit) {
  const match = String(workUnit || "").match(/^slide_(\d+)$/);
  if (!match) throw new Error(`Ungueltige RE2-Arbeitseinheit: ${workUnit}`);
  return Number(match[1]);
}

function main() {
  const plan = readJson(planPath, null);
  if (!plan || plan.module_id !== "RE2" || !Array.isArray(plan.scenes)) {
    throw new Error("RE2-Szenenplan fehlt oder ist ungueltig.");
  }

  const canonical = new Map(plan.scenes.map((scene) => [
    slideNumberFromWorkUnit(scene.work_unit),
    Number(scene.output_slide_number),
  ]));
  const sourceStateCount = Number(plan.source_state_count) || 165;
  const store = readJson(curationPath, {
    schema_version: "basisRebuildViewerCuration/v1",
    slides: {},
  });
  store.schema_version = "basisRebuildViewerCuration/v1";
  store.slides = store.slides && typeof store.slides === "object" ? store.slides : {};
  const updatedAt = new Date().toISOString();

  for (let slideNumber = 1; slideNumber <= sourceStateCount; slideNumber += 1) {
    const key = `RE2::${slideNumber}`;
    const current = store.slides[key] && typeof store.slides[key] === "object" ? store.slides[key] : {};
    store.slides[key] = {
      ...current,
      order: canonical.get(slideNumber) || null,
      hidden: !canonical.has(slideNumber),
      updated_at: updatedAt,
    };
  }

  fs.mkdirSync(path.dirname(curationPath), { recursive: true });
  fs.writeFileSync(curationPath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  process.stdout.write(`Configured RE2 viewer: ${canonical.size} active scenes, ${sourceStateCount - canonical.size} absorbed source states hidden.\n`);
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
