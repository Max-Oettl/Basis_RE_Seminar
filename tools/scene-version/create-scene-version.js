const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const scenesRoot = path.join(repoRoot, "assets", "scenes");

function parseArgs(argv) {
  const args = {
    sceneId: "",
    label: "",
    note: "",
    noteFile: "",
    notedAt: null,
    appliedAt: null,
  };

  const values = [...argv];
  while (values.length > 0) {
    const current = values.shift();
    if (!args.sceneId && !current.startsWith("--")) {
      args.sceneId = current;
      continue;
    }
    if (current === "--label") {
      args.label = values.shift() || "";
      continue;
    }
    if (current === "--note") {
      args.note = values.shift() || "";
      continue;
    }
    if (current === "--note-file") {
      args.noteFile = values.shift() || "";
      continue;
    }
    if (current === "--noted-at") {
      args.notedAt = values.shift() || null;
      continue;
    }
    if (current === "--applied-at") {
      args.appliedAt = values.shift() || null;
      continue;
    }
    throw new Error(`Unbekanntes Argument: ${current}`);
  }

  if (!args.sceneId) {
    throw new Error("Scene-ID fehlt.");
  }
  return args;
}

function ensureFile(filePath) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    throw new Error(`Datei fehlt: ${path.relative(repoRoot, filePath)}`);
  }
}

function versionIdFromTimestamp(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    throw new Error("Zeitstempel für Version ist ungültig.");
  }
  const parts = [
    String(date.getFullYear()).padStart(4, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
    String(date.getHours()).padStart(2, "0"),
    String(date.getMinutes()).padStart(2, "0"),
    String(date.getSeconds()).padStart(2, "0"),
  ];
  return `version_${parts.join("")}`;
}

function copyIfExists(sourcePath, targetPath) {
  if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) {
    return false;
  }
  fs.copyFileSync(sourcePath, targetPath);
  return true;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const sceneRoot = path.join(scenesRoot, args.sceneId);
  const composedRoot = path.join(sceneRoot, "composed");
  const sourceSvg = path.join(composedRoot, "scene.svg");
  const sourceAnimation = path.join(composedRoot, "scene.animation.v1.json");

  ensureFile(sourceSvg);

  if (args.noteFile) {
    const absoluteNotePath = path.resolve(process.cwd(), args.noteFile);
    args.note = fs.readFileSync(absoluteNotePath, "utf8").replace(/^\uFEFF/, "").trim();
  }

  const versionId = versionIdFromTimestamp(args.appliedAt);
  const versionRoot = path.join(sceneRoot, "versions", versionId);
  if (fs.existsSync(versionRoot)) {
    throw new Error(`Version existiert bereits: ${path.relative(repoRoot, versionRoot)}`);
  }

  fs.mkdirSync(versionRoot, { recursive: true });
  fs.copyFileSync(sourceSvg, path.join(versionRoot, "scene.svg"));
  copyIfExists(sourceAnimation, path.join(versionRoot, "scene.animation.v1.json"));

  const metadata = {
    schema_version: "sceneVersion/v1",
    scene_id: args.sceneId,
    version_id: versionId,
    label: args.label || `Version ${versionId.replace(/^version_/, "")}`,
    created_at: args.appliedAt || new Date().toISOString(),
    source_note: args.note || "",
    source_note_noted_at: args.notedAt,
    source_note_applied_at: args.appliedAt || null,
  };

  fs.writeFileSync(
    path.join(versionRoot, "version.json"),
    `${JSON.stringify(metadata, null, 2)}\n`,
    "utf8",
  );

  process.stdout.write(
    `${JSON.stringify({
      scene_id: args.sceneId,
      version_id: versionId,
      version_path: path.relative(repoRoot, versionRoot).split(path.sep).join("/"),
      label: metadata.label,
    })}\n`,
  );
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
