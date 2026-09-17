"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const scenePlanPath = path.join(root, "analysis", "rebuild-plans", "RE2_scene-plan.json");
const moduleRoot = path.join(root, "rebuild-proposals", "svg", "RE2");
const scenePlan = JSON.parse(fs.readFileSync(scenePlanPath, "utf8"));
const denseWorkUnits = new Set(["slide_001", "slide_009", "slide_128"]);

const changes = [];
for (const scene of scenePlan.scenes) {
  const svgPath = path.join(moduleRoot, scene.work_unit, `${scene.work_unit}.svg`);
  if (!fs.existsSync(svgPath)) continue;

  const before = fs.readFileSync(svgPath, "utf8");
  const after = before
    .replace(/"density":"balanced"/g, '"density":"normal"')
    .replace(
      /"density":"normal"/g,
      denseWorkUnits.has(scene.work_unit) ? '"density":"dense"' : '"density":"normal"',
    )
    .replace(/#687185/gi, "#727C97");

  if (after === before) continue;
  fs.writeFileSync(svgPath, after, "utf8");
  changes.push(path.relative(root, svgPath));
}

process.stdout.write(`Normalized ${changes.length} canonical RE2 SVG(s).\n`);
for (const file of changes) process.stdout.write(`- ${file}\n`);
