"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  findDownstreamOwnedSlideChrome,
  stripDownstreamOwnedSlideChrome,
} = require("./svg-downstream-chrome");

const repoRoot = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 1) {
    if (!argv[index].startsWith("--")) continue;
    const key = argv[index].slice(2);
    if (key === "write" || key === "check") {
      args[key] = true;
      continue;
    }
    args[key] = argv[index + 1];
    index += 1;
  }
  if (!args.modules) {
    throw new Error("Usage: node tools/strip-module-slide-chrome.js --modules RE1,RE2 --write|--check");
  }
  if (Boolean(args.write) === Boolean(args.check)) {
    throw new Error("Choose exactly one mode: --write or --check.");
  }
  return args;
}

function targetSvgFiles(moduleId) {
  const moduleRoot = path.join(repoRoot, "rebuild-proposals", "svg", moduleId);
  if (!fs.existsSync(moduleRoot)) throw new Error(`Module target directory is missing: ${moduleRoot}`);
  return fs.readdirSync(moduleRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^slide_\d+$/i.test(entry.name))
    .map((entry) => path.join(moduleRoot, entry.name, `${entry.name}.svg`))
    .filter((filePath) => fs.existsSync(filePath))
    .sort();
}

function main() {
  const args = parseArgs(process.argv);
  const modules = args.modules.split(",").map((value) => value.trim().toUpperCase()).filter(Boolean);
  let checked = 0;
  let changed = 0;
  const remaining = [];

  for (const moduleId of modules) {
    for (const svgPath of targetSvgFiles(moduleId)) {
      checked += 1;
      const original = fs.readFileSync(svgPath, "utf8");
      const findings = findDownstreamOwnedSlideChrome(original);
      if (args.write && findings.length) {
        const updated = stripDownstreamOwnedSlideChrome(original);
        fs.writeFileSync(svgPath, updated, "utf8");
        changed += 1;
      }
      const effective = args.write ? fs.readFileSync(svgPath, "utf8") : original;
      const effectiveFindings = findDownstreamOwnedSlideChrome(effective);
      if (effectiveFindings.length) {
        remaining.push(`${path.relative(repoRoot, svgPath)}: ${effectiveFindings.join(", ")}`);
      }
    }
  }

  process.stdout.write(`Checked ${checked} target SVG(s); changed ${changed}; remaining violations ${remaining.length}.\n`);
  if (remaining.length) {
    process.stderr.write(`${remaining.join("\n")}\n`);
    process.exitCode = 1;
  }
}

main();
