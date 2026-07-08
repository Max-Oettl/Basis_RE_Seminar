#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawn, spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const defaultProposalRoot = path.join(repoRoot, "rebuild-proposals", "svg");
const defaultReportRoot = path.join(repoRoot, "analysis", "render-checks");

function usage() {
  console.log(`Usage:
  node tools/svg-rebuild-qa.js <module_id_or_svg_dir> [options]

Options:
  --viewer              Start the Basis Rebuild Viewer API and check slide mapping.
  --expect-all          Fail when checked viewer slides have no SVG or no animation.
  --slides <range>      Restrict viewer check, e.g. 1-13 or 1,2,7-9.
  --report-dir <path>   Override report output directory.
  --no-report           Do not write JSON/Markdown reports.
  --help                Show this help.

Examples:
  node tools/svg-rebuild-qa.js RE3_TEST_1
  node tools/svg-rebuild-qa.js RE3_TEST_1 --viewer --slides 1-13 --expect-all`);
}

function parseArgs(argv) {
  const options = {
    target: "",
    viewer: false,
    expectAll: false,
    slides: "",
    reportDir: "",
    writeReport: true,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--viewer") {
      options.viewer = true;
    } else if (arg === "--expect-all") {
      options.expectAll = true;
    } else if (arg === "--slides") {
      options.slides = argv[++index] || "";
    } else if (arg === "--report-dir") {
      options.reportDir = argv[++index] || "";
    } else if (arg === "--no-report") {
      options.writeReport = false;
    } else if (!options.target) {
      options.target = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function cleanModuleId(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w.-]+/g, "_") || "unassigned";
}

function toPosixPath(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return !relative.startsWith("..") && !path.isAbsolute(relative);
}

function collectFiles(directory, predicate, results = []) {
  if (!fs.existsSync(directory)) return results;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collectFiles(absolute, predicate, results);
    } else if (entry.isFile() && predicate(absolute)) {
      results.push(absolute);
    }
  }
  return results.sort((left, right) => left.localeCompare(right, "de", { numeric: true }));
}

function addIssue(report, severity, filePath, message, detail = "") {
  report.issues.push({
    severity,
    file: filePath ? toPosixPath(filePath) : "",
    message,
    detail,
  });
}

function readUtf8(filePath) {
  return fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
}

function parseJsonFile(filePath, report) {
  try {
    return JSON.parse(readUtf8(filePath));
  } catch (error) {
    addIssue(report, "error", filePath, "JSON could not be parsed.", error.message);
    return null;
  }
}

function powershellXmlCheck(filePath) {
  if (process.platform !== "win32") return null;

  const command = "& { param([string]$p) $ErrorActionPreference='Stop'; $xml = New-Object System.Xml.XmlDocument; $xml.PreserveWhitespace = $true; $xml.Load($p) }";

  const result = spawnSync("powershell.exe", ["-NoProfile", "-Command", command, filePath], {
    encoding: "utf8",
    windowsHide: true,
  });

  if (result.error) return null;
  if (result.status !== 0) {
    return `${result.stderr || result.stdout}`.trim() || "PowerShell XML parser failed.";
  }
  return "";
}

function basicXmlShapeCheck(svgText) {
  if (!/<svg\b/i.test(svgText)) return "Missing <svg> root element.";
  if (!/<\/svg>\s*$/i.test(svgText.trim())) return "SVG does not end with </svg>.";
  return "";
}

function decodeXmlText(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function attrValue(attrs, name) {
  const match = attrs.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match ? match[1] : "";
}

function parseNumber(value) {
  const number = Number(String(value || "").replace(",", "."));
  return Number.isFinite(number) ? number : null;
}

function parseViewBox(svgText) {
  const match = svgText.match(/\bviewBox\s*=\s*["']([^"']+)["']/i);
  if (!match) return null;
  const parts = match[1].trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isFinite(part))) return null;
  return { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
}

function extractIds(svgText) {
  return [...svgText.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map((match) => match[1]);
}

function validateSvg(svgPath, report) {
  const svgText = readUtf8(svgPath);
  const relative = toPosixPath(svgPath);
  const fileResult = {
    path: relative,
    ids: 0,
    animationManifest: "",
  };

  const xmlError = powershellXmlCheck(svgPath);
  if (xmlError === null) {
    const basicError = basicXmlShapeCheck(svgText);
    if (basicError) addIssue(report, "error", svgPath, basicError);
  } else if (xmlError) {
    addIssue(report, "error", svgPath, "SVG XML parser failed.", xmlError);
  }

  const viewBox = parseViewBox(svgText);
  if (!viewBox) {
    addIssue(report, "error", svgPath, "Missing or invalid viewBox.");
  } else {
    const ratio = viewBox.width / viewBox.height;
    if (Math.abs(ratio - 16 / 9) > 0.02) {
      addIssue(report, "warning", svgPath, "ViewBox is not close to 16:9.", `${viewBox.width}x${viewBox.height}`);
    }

    for (const match of svgText.matchAll(/<text\b([^>]*)>/gi)) {
      const attrs = match[1];
      const x = parseNumber(attrValue(attrs, "x"));
      const y = parseNumber(attrValue(attrs, "y"));
      if (x !== null && (x < viewBox.x - 20 || x > viewBox.x + viewBox.width + 20)) {
        addIssue(report, "warning", svgPath, "Text x-position is outside the viewBox.", match[0]);
      }
      if (y !== null && (y < viewBox.y - 20 || y > viewBox.y + viewBox.height + 20)) {
        addIssue(report, "warning", svgPath, "Text y-position is outside the viewBox.", match[0]);
      }
    }
  }

  if (/<animate(?:\b|Transform\b)/i.test(svgText)) {
    addIssue(report, "error", svgPath, "Inline SVG <animate> elements are not allowed; use scene.animation.v1.json.");
  }

  if (/[ÃÂ�]|\uFFFD|â€|â†|Î/.test(svgText)) {
    addIssue(report, "error", svgPath, "Possible mojibake or replacement character found.");
  }

  const textNodes = [...svgText.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/gi)]
    .map((match) => decodeXmlText(match[1]))
    .filter(Boolean);

  for (const text of textNodes) {
    if (text.includes("Allgemeines Vorgehen in der Lebensdatenanalyse")) {
      addIssue(report, "error", svgPath, "Visible PowerPoint title found in SVG text.", text);
    }
    if (/\b(fuer|koennen|muessen|Schaetz|geschaetzt|Ausfaelle|ergaenzen)\b/i.test(text)) {
      addIssue(report, "warning", svgPath, "Visible text may use ASCII replacement instead of German characters.", text);
    }
  }

  const ids = extractIds(svgText);
  fileResult.ids = ids.length;
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  for (const id of [...new Set(duplicateIds)]) {
    addIssue(report, "error", svgPath, "Duplicate SVG id.", id);
  }

  const idSet = new Set(ids);
  for (const match of svgText.matchAll(/\b(?:href|xlink:href)\s*=\s*["']#([^"']+)["']/g)) {
    if (!idSet.has(match[1])) {
      addIssue(report, "error", svgPath, "Internal href target does not exist.", `#${match[1]}`);
    }
  }

  for (const match of svgText.matchAll(/<image\b[^>]*\b(?:href|xlink:href)\s*=\s*["']([^"']+)["'][^>]*>/gi)) {
    const href = match[1];
    if (/^(data:|https?:|#)/i.test(href)) continue;
    const assetPath = path.resolve(path.dirname(svgPath), href);
    if (!isInside(repoRoot, assetPath) || !fs.existsSync(assetPath)) {
      addIssue(report, "error", svgPath, "Referenced image asset is missing.", href);
    }
  }

  report.files.push(fileResult);
  return { svgText, ids: idSet, fileResult };
}

function validateManifest(manifestPath, svgByPath, report) {
  const manifest = parseJsonFile(manifestPath, report);
  if (!manifest) return;

  const relative = toPosixPath(manifestPath);
  const dir = path.dirname(manifestPath);
  const targetSvg = manifest.svgPath
    ? path.resolve(dir, manifest.svgPath)
    : null;

  if (!manifest.svgPath) {
    addIssue(report, "error", manifestPath, "Animation manifest has no svgPath.");
    return;
  }

  if (!fs.existsSync(targetSvg)) {
    addIssue(report, "error", manifestPath, "Manifest svgPath does not exist.", manifest.svgPath);
    return;
  }

  const svgInfo = svgByPath.get(path.resolve(targetSvg));
  if (!svgInfo) {
    addIssue(report, "error", manifestPath, "Manifest svgPath points outside checked SVG set.", manifest.svgPath);
    return;
  }

  const matchingFile = report.files.find((file) => file.path === toPosixPath(targetSvg));
  if (matchingFile) matchingFile.animationManifest = relative;

  const targets = Array.isArray(manifest.targets) ? manifest.targets : [];
  const steps = Array.isArray(manifest.steps) ? manifest.steps : [];
  if (!targets.length) {
    addIssue(report, "error", manifestPath, "Animation manifest has no targets.");
  }
  if (!steps.length) {
    addIssue(report, "error", manifestPath, "Animation manifest has no steps.");
  }

  const targetIds = new Set();
  for (const target of targets) {
    const targetId = target && target.targetId;
    if (!targetId) {
      addIssue(report, "error", manifestPath, "Animation target without targetId.");
      continue;
    }
    targetIds.add(targetId);
    if (!svgInfo.ids.has(targetId)) {
      addIssue(report, "error", manifestPath, "Animation target ID does not exist in SVG.", targetId);
    }
  }

  for (const step of steps) {
    const targetId = step && step.targetId;
    if (!targetId) {
      addIssue(report, "error", manifestPath, "Animation step without targetId.");
    } else if (!targetIds.has(targetId)) {
      addIssue(report, "error", manifestPath, "Animation step references unknown target.", targetId);
    }
  }
}

function parseSlideRange(value) {
  if (!value) return null;
  const result = new Set();
  for (const part of value.split(",").map((item) => item.trim()).filter(Boolean)) {
    const range = part.match(/^(\d+)-(\d+)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      for (let slide = Math.min(start, end); slide <= Math.max(start, end); slide += 1) {
        result.add(slide);
      }
      continue;
    }
    const number = Number(part);
    if (Number.isInteger(number)) result.add(number);
  }
  return result;
}

async function waitForViewer(port) {
  const url = `http://127.0.0.1:${port}/api/slides`;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch {
      // Wait and retry.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Viewer API did not start.");
}

async function runViewerCheck(moduleId, options, report) {
  const port = 4300 + Math.floor(Math.random() * 500);
  const serverPath = path.join(repoRoot, "tools", "basis-rebuild-viewer", "server.js");
  const child = spawn(process.execPath, [serverPath, String(port), "--no-open"], {
    cwd: repoRoot,
    windowsHide: true,
    stdio: "ignore",
  });

  try {
    const payload = await waitForViewer(port);
    const slideRange = parseSlideRange(options.slides);
    const rows = (payload.slides || [])
      .filter((slide) => slide.moduleId === moduleId)
      .filter((slide) => !slideRange || slideRange.has(Number(slide.slideNumber)))
      .sort((left, right) => left.slideNumber - right.slideNumber)
      .map((slide) => ({
        slide: slide.slideNumber,
        hasOldSlide: Boolean(slide.status && slide.status.hasOldSlide),
        hasSvg: Boolean(slide.status && slide.status.hasSvgProposal),
        hasAnimation: Boolean(slide.status && slide.status.hasAnimation),
        file: slide.svgProposal && slide.svgProposal.fileName || "",
        url: slide.svgProposal && slide.svgProposal.url || "",
        aliasFor: slide.svgProposal && slide.svgProposal.aliasForSlideNumber || null,
        animationSteps: slide.svgProposal && slide.svgProposal.animation && slide.svgProposal.animation.stepCount || 0,
      }));

    report.viewer = {
      checked: true,
      slides: options.slides || "all",
      rows,
    };

    if (!rows.length) {
      addIssue(report, "error", null, "Viewer check found no slides for module.", moduleId);
    }

    if (options.expectAll) {
      for (const row of rows) {
        if (!row.hasSvg) {
          addIssue(report, "error", null, "Viewer slide has no SVG proposal.", `slide ${row.slide}`);
        }
        if (!row.hasAnimation) {
          addIssue(report, "error", null, "Viewer slide has no animation.", `slide ${row.slide}`);
        }
      }
    }

    for (const row of rows) {
      if (!row.hasSvg || !row.url) continue;
      try {
        const svgResponse = await fetch(`http://127.0.0.1:${port}${row.url}`);
        const svgText = await svgResponse.text();
        const unresolvedLocalImages = [...svgText.matchAll(/<image\b[^>]*?\s(?:href|xlink:href)=["']([^"']+)["']/gi)]
          .map((match) => match[1])
          .filter((reference) => {
            if (
              reference.startsWith("data:") ||
              reference.startsWith("http://") ||
              reference.startsWith("https://") ||
              reference.startsWith("#") ||
              reference.startsWith("/files/")
            ) {
              return false;
            }
            return true;
          });

        row.viewerServedImageCheck = {
          checked: true,
          unresolvedLocalImages,
        };

        if (unresolvedLocalImages.length) {
          addIssue(
            report,
            "error",
            null,
            "Viewer-served SVG has unresolved local image hrefs.",
            `slide ${row.slide}: ${unresolvedLocalImages.join(", ")}`,
          );
        }
      } catch (error) {
        addIssue(report, "error", null, "Viewer-served SVG image check failed.", `slide ${row.slide}: ${error.message}`);
      }
    }
  } catch (error) {
    addIssue(report, "error", null, "Viewer check failed.", error.message);
  } finally {
    child.kill();
  }
}

function writeReports(report, reportDir) {
  fs.mkdirSync(reportDir, { recursive: true });
  const jsonPath = path.join(reportDir, "svg-qa-report.json");
  const mdPath = path.join(reportDir, "svg-qa-report.md");

  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  const lines = [
    `# SVG QA Report - ${report.module_id}`,
    "",
    `Generated: ${report.generated_at}`,
    "",
    "## Summary",
    "",
    `- Files checked: ${report.summary.files_checked}`,
    `- Animation manifests checked: ${report.summary.manifests_checked}`,
    `- Errors: ${report.summary.errors}`,
    `- Warnings: ${report.summary.warnings}`,
    "",
    "## Issues",
    "",
  ];

  if (!report.issues.length) {
    lines.push("No issues found by automated checks.", "");
  } else {
    for (const issue of report.issues) {
      const file = issue.file ? ` (${issue.file})` : "";
      const detail = issue.detail ? `: ${issue.detail}` : "";
      lines.push(`- ${issue.severity.toUpperCase()}${file}: ${issue.message}${detail}`);
    }
    lines.push("");
  }

  if (report.viewer && report.viewer.checked) {
    lines.push("## Viewer Mapping", "");
    for (const row of report.viewer.rows) {
      const alias = row.aliasFor ? ` alias for ${row.aliasFor}` : "";
      lines.push(`- slide ${row.slide}: svg=${row.hasSvg}, animation=${row.hasAnimation}, steps=${row.animationSteps}, file=${row.file}${alias}`);
    }
    lines.push("");
  }

  fs.writeFileSync(mdPath, `${lines.join("\n")}\n`, "utf8");
  return { jsonPath, mdPath };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help || !options.target) {
    usage();
    process.exit(options.help ? 0 : 2);
  }

  const targetPath = path.resolve(repoRoot, options.target);
  const moduleId = fs.existsSync(targetPath)
    ? cleanModuleId(path.basename(targetPath))
    : cleanModuleId(options.target);
  const svgRoot = fs.existsSync(targetPath)
    ? targetPath
    : path.join(defaultProposalRoot, moduleId);

  if (!fs.existsSync(svgRoot)) {
    throw new Error(`SVG root not found: ${svgRoot}`);
  }

  const reportDir = options.reportDir
    ? path.resolve(repoRoot, options.reportDir)
    : path.join(defaultReportRoot, moduleId, "automated-svg-qa");

  const report = {
    schema_version: "svgQaReport/v1",
    module_id: moduleId,
    svg_root: toPosixPath(svgRoot),
    generated_at: new Date().toISOString(),
    command: process.argv.join(" "),
    files: [],
    issues: [],
    viewer: { checked: false },
    summary: {
      files_checked: 0,
      manifests_checked: 0,
      errors: 0,
      warnings: 0,
    },
  };

  const svgFiles = collectFiles(svgRoot, (filePath) => path.extname(filePath).toLowerCase() === ".svg");
  const manifestFiles = collectFiles(svgRoot, (filePath) => path.basename(filePath) === "scene.animation.v1.json");
  const svgByPath = new Map();

  for (const svgPath of svgFiles) {
    const svgInfo = validateSvg(svgPath, report);
    svgByPath.set(path.resolve(svgPath), svgInfo);
  }

  for (const manifestPath of manifestFiles) {
    validateManifest(manifestPath, svgByPath, report);
  }

  if (options.viewer) {
    await runViewerCheck(moduleId, options, report);
  }

  report.summary.files_checked = svgFiles.length;
  report.summary.manifests_checked = manifestFiles.length;
  report.summary.errors = report.issues.filter((issue) => issue.severity === "error").length;
  report.summary.warnings = report.issues.filter((issue) => issue.severity === "warning").length;

  let written = null;
  if (options.writeReport) {
    written = writeReports(report, reportDir);
  }

  console.log(`SVG QA ${moduleId}: ${report.summary.errors} error(s), ${report.summary.warnings} warning(s), ${svgFiles.length} SVG(s), ${manifestFiles.length} manifest(s).`);
  if (written) {
    console.log(`Report: ${toPosixPath(written.mdPath)}`);
  }

  if (report.summary.errors > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
