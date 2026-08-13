#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawn, spawnSync } = require("child_process");
const { runBrowserLayoutQa } = require("./svg-qa/browser-layout-qa");
const { formatLayoutIssue } = require("./svg-qa/layout-report");
const { runStaticDesignQa } = require("./svg-qa/design-qa");
const { runHandoffPackageQa } = require("./svg-qa/handoff-package-qa");
const { inspectSemanticAnimationBoundaries } = require("./svg-qa/semantic-animation-qa");

const repoRoot = path.resolve(__dirname, "..");
const defaultProposalRoot = path.join(repoRoot, "rebuild-proposals", "svg");
const defaultReportRoot = path.join(repoRoot, "analysis", "render-checks");

function usage() {
  console.log(`Usage:
  node tools/svg-rebuild-qa.js [<module_id_or_svg_dir>] [options]

Options:
  --viewer              Start the Basis Rebuild Viewer API and check slide mapping.
  --expect-all          Fail when checked viewer slides have no SVG or no animation.
  --slides <range>      Restrict viewer check, e.g. 1-13 or 1,2,7-9.
  --layout              Run deterministic browser-based rendered SVG layout QA.
  --layout-warn-only    Report layout QA findings as warnings (default for --layout).
  --layout-strict       Count layout QA findings as errors.
  --layout-times <list> Animation times for layout QA, e.g. 0,0.5,1,end.
  --strict-design       Count static Content-SVG/design/brand QA findings as errors.
  --no-design           Disable static Content-SVG/design/brand QA.
  --handoff-package <path>
                        Validate a final storyboardImportPackage/v1 delivery.
  --strict-handoff      Count strong handoff recommendations as errors.
  --report-dir <path>   Override report output directory.
  --no-report           Do not write JSON/Markdown reports.
  --help                Show this help.

Examples:
  node tools/svg-rebuild-qa.js RE3_TEST_1
  node tools/svg-rebuild-qa.js RE3_TEST_1 --viewer --slides 1-13 --expect-all
  node tools/svg-rebuild-qa.js RE3_TEST_1 --viewer --slides 1-13 --expect-all --layout
  node tools/svg-rebuild-qa.js --handoff-package delivery-packages/storyboard-import/<module_id> --strict-handoff`);
}

function parseArgs(argv) {
  const options = {
    target: "",
    viewer: false,
    expectAll: false,
    slides: "",
    layout: false,
    layoutWarnOnly: false,
    layoutStrict: false,
    layoutTimes: "",
    design: true,
    strictDesign: false,
    handoffPackage: "",
    strictHandoff: false,
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
    } else if (arg === "--layout") {
      options.layout = true;
    } else if (arg === "--layout-warn-only") {
      options.layout = true;
      options.layoutWarnOnly = true;
    } else if (arg === "--layout-strict") {
      options.layout = true;
      options.layoutStrict = true;
    } else if (arg === "--layout-times") {
      options.layout = true;
      options.layoutTimes = argv[++index] || "";
    } else if (arg === "--strict-design") {
      options.strictDesign = true;
    } else if (arg === "--no-design") {
      options.design = false;
    } else if (arg === "--handoff-package") {
      options.handoffPackage = argv[++index] || "";
    } else if (arg === "--strict-handoff") {
      options.strictHandoff = true;
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

function inferHandoffModuleId(packageRoot) {
  try {
    const manifestPath = path.join(packageRoot, "import.package.v1.json");
    const manifest = JSON.parse(readUtf8(manifestPath));
    return cleanModuleId(manifest.moduleId || path.basename(packageRoot));
  } catch {
    return cleanModuleId(path.basename(packageRoot));
  }
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

  const command = "& { param([string]$p) $ErrorActionPreference='Stop'; $xml = New-Object System.Xml.XmlDocument; $xml.XmlResolver = $null; $xml.PreserveWhitespace = $true; $xml.Load($p) }";

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

  const isFormulaAsset = /(?:^|[\\/])formulas[\\/][^\\/]+\.svg$/i.test(svgPath);
  if (isFormulaAsset && /<(?:text|tspan)\b/i.test(svgText)) {
    addIssue(
      report,
      "warning",
      svgPath,
      "Formula asset contains live text glyphs and may change through font fallback or surrounding CSS.",
      "Render formula glyphs as paths with components/formula-library/render_formula_svg.py.",
    );
  }
  if (isFormulaAsset && !/\bdata-formula-fontsize\s*=\s*["'][\d.]+["']/i.test(svgText)) {
    addIssue(
      report,
      "warning",
      svgPath,
      "Formula asset has no nominal font-size metadata.",
      "Without data-formula-fontsize, formula matrices can accidentally scale each expression by its bounding-box height.",
    );
  }

  const textNodes = [...svgText.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/gi)]
    .map((match) => decodeXmlText(match[1]))
    .filter(Boolean);

  for (const text of textNodes) {
    if (text.includes("Allgemeines Vorgehen in der Lebensdatenanalyse")) {
      addIssue(report, "error", svgPath, "Visible PowerPoint title found in SVG text.", text);
    }
    if (/\bRE\d+(?:_TEST_\d+)?\s*[·|.-]\s*(?:Folie|Slide)\s*\d+/i.test(text)) {
      addIssue(report, "error", svgPath, "Visible module/slide kicker found in SVG text.", text);
    }
    if (/\b(?:neuer Workflow|Workflow-Variante|Workflow-Hinweis|Quelle:\s*Folie|Fokus:)\b/i.test(text)) {
      addIssue(report, "error", svgPath, "Visible workflow/source metadata found in SVG text.", text);
    }
    if (/\b(fuer|koennen|muessen|Schaetz|geschaetzt|Ausfaelle|ergaenzen)\b/i.test(text)) {
      addIssue(report, "warning", svgPath, "Visible text may use ASCII replacement instead of German characters.", text);
    }
  }

  for (const finding of inspectSemanticAnimationBoundaries(svgText)) {
    addIssue(report, "error", svgPath, finding.message, finding.detail);
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
    if (href.startsWith("/files/")) {
      let servedPath = "";
      try {
        servedPath = decodeURIComponent(href.slice("/files/".length).split(/[?#]/, 1)[0]);
      } catch {
        servedPath = "";
      }
      const assetPath = path.resolve(repoRoot, servedPath);
      if (!isInside(repoRoot, assetPath) || !fs.existsSync(assetPath)) {
        addIssue(report, "error", svgPath, "Referenced /files image asset is missing.", href);
      }
      continue;
    }
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
  if (steps.length && !targets.length) {
    addIssue(report, "error", manifestPath, "Animated manifest has steps but no targets.");
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

  const wholeSceneTarget = /^(?:scene_content|main_content|source_state_[0-9]+)$/;
  if (steps.length && targets.length && targets.every((target) => wholeSceneTarget.test(String(target?.targetId || "")))) {
    addIssue(
      report,
      "error",
      manifestPath,
      "Animation only targets complete scene/source-state containers; semantic element targets are required.",
    );
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

function inferSvgSlideNumber(filePath) {
  const normalized = String(filePath || "").replace(/\\/g, "/");
  const match =
    normalized.match(/(?:slide|folie|page)[_\-\s]*(\d+)/i) ||
    path.basename(normalized).match(/(\d+)/);
  return match ? Number(match[1]) : null;
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
      .sort((left, right) => (Number(left.sortOrder) || left.slideNumber) - (Number(right.sortOrder) || right.slideNumber))
      .map((slide) => ({
        slide: slide.slideNumber,
        isAdditionalSlide: Boolean(slide.isAdditionalSlide),
        isHidden: Boolean(slide.isHidden || slide.status?.isHidden),
        hasOldSlide: Boolean(slide.status && slide.status.hasOldSlide),
        hasSvg: Boolean(slide.status && slide.status.hasSvgProposal),
        hasAnimationManifest: Boolean(slide.status && slide.status.hasAnimationManifest),
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
        if (row.isHidden) continue;
        if (!row.hasSvg) {
          if (row.isAdditionalSlide) continue;
          addIssue(report, "error", null, "Viewer slide has no SVG proposal.", `slide ${row.slide}`);
        }
        if (!row.hasAnimationManifest) {
          if (row.isAdditionalSlide && !row.hasSvg) continue;
          addIssue(report, "error", null, "Viewer slide has no animation decision manifest.", `slide ${row.slide}`);
        }
      }
    }

    for (const row of rows) {
      if (!row.hasSvg || !row.url) continue;
      try {
        const svgResponse = await fetch(`http://127.0.0.1:${port}${row.url}`);
        const svgText = await svgResponse.text();
        let servedSvgPath = "";
        if (row.url.startsWith("/files/")) {
          try {
            servedSvgPath = path.resolve(repoRoot, decodeURIComponent(row.url.slice("/files/".length).split(/[?#]/, 1)[0]));
          } catch {
            servedSvgPath = "";
          }
        }
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
            if (servedSvgPath && isInside(repoRoot, servedSvgPath)) {
              const cleanReference = reference.split(/[?#]/, 1)[0];
              let decodedReference = "";
              try {
                decodedReference = decodeURIComponent(cleanReference);
              } catch {
                decodedReference = cleanReference;
              }
              const assetPath = path.resolve(path.dirname(servedSvgPath), decodedReference);
              if (isInside(repoRoot, assetPath) && fs.existsSync(assetPath)) {
                return false;
              }
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
    `- Layout files checked: ${report.summary.layout_files_checked}`,
    `- Layout states checked: ${report.summary.layout_states_checked}`,
    `- Design files checked: ${report.summary.design_files_checked}`,
    `- Design errors: ${report.summary.design_errors}`,
    `- Design warnings: ${report.summary.design_warnings}`,
    `- Handoff scenes checked: ${report.summary.handoff_scenes_checked}`,
    `- Handoff manifests checked: ${report.summary.handoff_manifests_checked}`,
    `- Handoff errors: ${report.summary.handoff_errors}`,
    `- Handoff warnings: ${report.summary.handoff_warnings}`,
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
      if (issue.rule) {
        lines.push(formatLayoutIssue(issue));
        continue;
      }
      const file = issue.file ? ` (${issue.file})` : "";
      const detail = issue.detail ? `: ${issue.detail}` : "";
      lines.push(`- ${issue.severity.toUpperCase()}${file}: ${issue.message}${detail}`);
    }
    lines.push("");
  }

  if (report.layout && report.layout.checked) {
    lines.push("## Layout QA", "");
    lines.push(`- Mode: ${report.layout.strict && !report.layout.warnOnly ? "strict" : "warn-only"}`);
    lines.push(`- Files checked: ${report.layout.summary?.files_checked || 0}`);
    lines.push(`- States checked: ${report.layout.summary?.states_checked || 0}`);
    lines.push(`- Browser: ${report.layout.browser?.executable || "not available"}`);
    lines.push("");

    const layoutIssues = Array.isArray(report.layout.issues) ? report.layout.issues : [];
    if (!layoutIssues.length) {
      lines.push("No layout issues found by rendered SVG layout QA.", "");
    } else {
      for (const issue of layoutIssues) {
        lines.push(formatLayoutIssue(issue));
      }
      lines.push("");
    }
  }

  if (report.design && report.design.checked) {
    lines.push("## Design QA", "");
    lines.push(`- Mode: ${report.design.strict ? "strict-design" : "warn-only"}`);
    lines.push(`- Files checked: ${report.design.summary?.files_checked || 0}`);
    lines.push(`- Brand tokens: ${report.design.brandTokens?.path || "not configured"}`);
    lines.push(`- Brand profile: ${report.design.brandTokens?.profile || "unknown"}`);
    lines.push("");

    const designIssues = Array.isArray(report.design.issues) ? report.design.issues : [];
    if (!designIssues.length) {
      lines.push("No Content-SVG/design/brand issues found by static QA.", "");
    } else {
      for (const issue of designIssues) {
        lines.push(formatLayoutIssue(issue));
      }
      lines.push("");
    }
  }

  if (report.handoff && report.handoff.checked) {
    lines.push("## Handoff Package QA", "");
    lines.push(`- Mode: ${report.handoff.strict ? "strict-handoff" : "recommendations-as-warnings"}`);
    lines.push(`- Package: ${report.handoff.packageRoot || "not configured"}`);
    lines.push(`- Module ID: ${report.handoff.moduleId || "unknown"}`);
    lines.push(`- Scenes checked: ${report.handoff.summary?.scenes_checked || 0}`);
    lines.push(`- SVGs checked: ${report.handoff.summary?.svg_files_checked || 0}`);
    lines.push(`- Animation manifests checked: ${report.handoff.summary?.manifests_checked || 0}`);
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
  if (options.help || (!options.target && !options.handoffPackage)) {
    usage();
    process.exit(options.help ? 0 : 2);
  }

  const handoffRoot = options.handoffPackage
    ? path.resolve(repoRoot, options.handoffPackage)
    : "";
  const targetPath = options.target ? path.resolve(repoRoot, options.target) : "";
  const moduleId = options.target
    ? (fs.existsSync(targetPath)
      ? cleanModuleId(path.basename(targetPath))
      : cleanModuleId(options.target))
    : inferHandoffModuleId(handoffRoot);
  const svgRoot = options.target
    ? (fs.existsSync(targetPath) ? targetPath : path.join(defaultProposalRoot, moduleId))
    : handoffRoot;

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
    layout: { checked: false },
    design: { checked: false },
    handoff: { checked: false },
    summary: {
      files_checked: 0,
      manifests_checked: 0,
      layout_files_checked: 0,
      layout_states_checked: 0,
      design_files_checked: 0,
      design_errors: 0,
      design_warnings: 0,
      handoff_scenes_checked: 0,
      handoff_manifests_checked: 0,
      handoff_errors: 0,
      handoff_warnings: 0,
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

  const selectedSlideRange = parseSlideRange(options.slides);
  const scopedSvgFiles = selectedSlideRange
    ? svgFiles.filter((svgPath) => selectedSlideRange.has(inferSvgSlideNumber(svgPath)))
    : svgFiles;

  if (options.design) {
    const design = runStaticDesignQa({
      svgFiles: scopedSvgFiles,
      manifestFiles,
      repoRoot,
      strictDesign: options.strictDesign,
    });
    report.design = design;
    report.issues.push(...design.issues);
  }

  if (options.viewer) {
    await runViewerCheck(moduleId, options, report);
  }

  if (options.layout) {
    const layout = await runBrowserLayoutQa({
      svgFiles: scopedSvgFiles,
      repoRoot,
      options: {
        enabled: true,
        strict: options.layoutStrict,
        warnOnly: options.layoutWarnOnly || !options.layoutStrict,
        times: options.layoutTimes,
      },
    });
    report.layout = layout;
    report.issues.push(...layout.issues);
  }

  if (handoffRoot) {
    const handoff = runHandoffPackageQa({
      packageRoot: handoffRoot,
      strict: options.strictHandoff,
    });
    handoff.packageRoot = toPosixPath(handoffRoot);
    report.handoff = handoff;
    report.issues.push(...handoff.issues);
  }

  report.summary.files_checked = svgFiles.length;
  report.summary.manifests_checked = manifestFiles.length;
  report.summary.layout_files_checked = report.layout?.summary?.files_checked || 0;
  report.summary.layout_states_checked = report.layout?.summary?.states_checked || 0;
  report.summary.design_files_checked = report.design?.summary?.files_checked || 0;
  report.summary.design_errors = report.design?.summary?.errors || 0;
  report.summary.design_warnings = report.design?.summary?.warnings || 0;
  report.summary.handoff_scenes_checked = report.handoff?.summary?.scenes_checked || 0;
  report.summary.handoff_manifests_checked = report.handoff?.summary?.manifests_checked || 0;
  report.summary.handoff_errors = report.handoff?.summary?.errors || 0;
  report.summary.handoff_warnings = report.handoff?.summary?.warnings || 0;
  report.summary.errors = report.issues.filter((issue) => issue.severity === "error").length;
  report.summary.warnings = report.issues.filter((issue) => issue.severity === "warning").length;

  let written = null;
  if (options.writeReport) {
    written = writeReports(report, reportDir);
  }

  console.log(`SVG QA ${moduleId}: ${report.summary.errors} error(s), ${report.summary.warnings} warning(s), ${svgFiles.length} SVG(s), ${manifestFiles.length} internal manifest(s), design ${report.summary.design_errors} error(s)/${report.summary.design_warnings} warning(s), handoff ${report.summary.handoff_errors} error(s)/${report.summary.handoff_warnings} warning(s).`);
  if (written) {
    console.log(`Report: ${toPosixPath(written.mdPath)}`);
  }

  if (report.summary.errors > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
