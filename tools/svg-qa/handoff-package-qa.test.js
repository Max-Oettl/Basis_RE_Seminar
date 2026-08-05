"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");
const { runHandoffPackageQa } = require("./handoff-package-qa");

const fixtureRoot = path.join(__dirname, "fixtures", "handoff-package-good");
const centralQa = path.resolve(__dirname, "..", "svg-rebuild-qa.js");

function withFixture(mutator) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "basis-re-handoff-"));
  const packageRoot = path.join(tempRoot, "package");
  fs.cpSync(fixtureRoot, packageRoot, { recursive: true });
  try {
    mutator(packageRoot);
    return runHandoffPackageQa({ packageRoot, strict: true });
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

test("strict handoff fixture passes without findings", () => {
  const result = runHandoffPackageQa({ packageRoot: fixtureRoot, strict: true });
  assert.equal(result.summary.errors, 0);
  assert.equal(result.summary.warnings, 0);
  assert.equal(result.summary.scenes_checked, 1);
  assert.equal(result.summary.manifests_checked, 1);
});

test("static handoff manifest may keep targets and steps empty", () => {
  const result = withFixture((packageRoot) => {
    const manifestPath = path.join(packageRoot, "assets", "scene_001", "diagram.animation.v1.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    manifest.targets = [];
    manifest.steps = [];
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  });

  assert.equal(result.summary.errors, 0);
  assert.equal(result.summary.warnings, 0);
});

test("unknown manifest fields and missing spoken-text matches fail", () => {
  const result = withFixture((packageRoot) => {
    const manifestPath = path.join(packageRoot, "assets", "scene_001", "diagram.animation.v1.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    manifest.sceneId = "internal-only";
    manifest.steps[0].trigger = "time";
    manifest.steps[0].sourceText = "Diese Phrase existiert nicht";
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  });

  const messages = result.issues.map((issue) => issue.message);
  assert.ok(messages.includes("Unknown field in manifest root."));
  assert.ok(messages.includes("Unknown field in steps[0]."));
  assert.ok(messages.includes("sourceText does not occur in the scene spoken text."));
});

test("manifest basename and SVG security violations fail", () => {
  const result = withFixture((packageRoot) => {
    const sceneRoot = path.join(packageRoot, "assets", "scene_001");
    fs.renameSync(
      path.join(sceneRoot, "diagram.animation.v1.json"),
      path.join(sceneRoot, "wrong.animation.v1.json"),
    );
    const svgPath = path.join(sceneRoot, "diagram.svg");
    const svg = fs.readFileSync(svgPath, "utf8").replace(
      "</svg>",
      '<script>alert("x")</script><image href="https://example.invalid/image.png" /></svg>',
    );
    fs.writeFileSync(svgPath, svg, "utf8");
  });

  const messages = result.issues.map((issue) => issue.message);
  assert.ok(messages.includes("Animation manifest basename does not match SVG basename."));
  assert.ok(messages.includes("SVG contains a script element."));
  assert.ok(messages.includes("SVG contains an external or active reference."));
});

test("valid narration pauses pass while invalid markers and pause triggers fail", () => {
  const valid = withFixture((packageRoot) => {
    const rowsPath = path.join(packageRoot, "storyboard.rows.json");
    const rows = JSON.parse(fs.readFileSync(rowsPath, "utf8"));
    rows.rows[0]["Gesprochener Text"] = "Zuerst erscheint die Inhaltsgruppe. {{pause:medium}} Danach bleibt sie sichtbar.";
    fs.writeFileSync(rowsPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
  });
  assert.equal(valid.summary.errors, 0);

  const invalid = withFixture((packageRoot) => {
    const rowsPath = path.join(packageRoot, "storyboard.rows.json");
    const rows = JSON.parse(fs.readFileSync(rowsPath, "utf8"));
    rows.rows[0]["Gesprochener Text"] = "Zuerst erscheint die Inhaltsgruppe. {{pause:4s}} Danach bleibt sie sichtbar.";
    fs.writeFileSync(rowsPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
    const manifestPath = path.join(packageRoot, "assets", "scene_001", "diagram.animation.v1.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    manifest.steps[0].sourceText = "{{pause:4s}}";
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  });
  const messages = invalid.issues.map((issue) => issue.message);
  assert.ok(messages.some((message) => message.includes("invalid pause marker")));
  assert.ok(messages.includes("sourceText must not contain a pause marker."));
});

test("central svg-rebuild-qa entry point validates handoff packages", () => {
  const run = spawnSync(
    process.execPath,
    [centralQa, "--handoff-package", fixtureRoot, "--strict-handoff", "--strict-design", "--no-report"],
    { encoding: "utf8" },
  );
  assert.equal(run.status, 0, `${run.stdout}\n${run.stderr}`);
  assert.match(run.stdout, /handoff 0 error\(s\)\/0 warning\(s\)/);
});
