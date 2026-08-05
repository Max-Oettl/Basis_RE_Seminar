"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { validatePictogramProductionPolicy } = require("./pictogram-qa");

const files = process.argv.slice(2);
if (files.length === 0) {
  process.stderr.write("Usage: node tools/pictogram-png-policy-qa.js <scene.svg> [...]\n");
  process.exitCode = 2;
} else {
  let errorCount = 0;
  for (const file of files) {
    const absolute = path.resolve(file);
    const findings = validatePictogramProductionPolicy(fs.readFileSync(absolute, "utf8"));
    for (const finding of findings) {
      process.stdout.write(`${finding.severity.toUpperCase()} ${file} ${finding.rule}: ${finding.message}${finding.detail ? ` (${finding.detail})` : ""}\n`);
    }
    errorCount += findings.filter((finding) => finding.severity === "error").length;
  }
  process.stdout.write(`Pictogram PNG policy QA: ${errorCount} error(s) across ${files.length} file(s).\n`);
  process.exitCode = errorCount ? 1 : 0;
}
