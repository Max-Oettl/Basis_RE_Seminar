"use strict";

const fs = require("fs");
const path = require("path");
const SvgAnimationDomain = require("../basis-rebuild-viewer/svg-animation-domain");
const NarrationPauseDomain = require("../basis-rebuild-viewer/narration-pause-domain");

const PACKAGE_SCHEMA = "storyboardImportPackage/v1";
const ANIMATION_SCHEMA = "svgAnimationManifest/v1";
const MODULE_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SCENE_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
const PUBLIC_ID_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;
const DRAWABLE_TAGS = new Set(["path", "line", "polyline", "polygon", "circle", "ellipse", "rect"]);
const ACTIONS = new Set(["show", "hide", "highlight", "draw", "transform"]);
const TARGET_STATUSES = new Set(["animated", "notAnimated", "ignored", "needsReview", "orphaned"]);
const CONFIDENCE_VALUES = new Set(["high", "medium", "low"]);
const DRAW_STYLES = new Set(["stroke", "reveal"]);
const DRAW_DIRECTIONS = new Set(["leftToRight", "rightToLeft", "topToBottom", "bottomToTop"]);

const PACKAGE_FIELDS = new Set([
  "schemaVersion",
  "rows",
  "moduleId",
  "moduleTitle",
  "assetMode",
  "assetsDir",
  "selection",
]);
const MANIFEST_ROOT_FIELDS = new Set(["schemaVersion", "svgPath", "defaults", "targets", "steps"]);
const DEFAULT_FIELDS = new Set([
  "enterFrames",
  "exitFrames",
  "highlightDurFrames",
  "drawDurFrames",
  "transformDurFrames",
]);
const TARGET_FIELDS = new Set([
  "targetId",
  "label",
  "status",
  "visibleInEditor",
  "render",
  "confidence",
  "ignoreReason",
]);
const STEP_BASE_FIELDS = new Set([
  "stepId",
  "targetId",
  "action",
  "sourceText",
  "occurrence",
  "confidence",
  "notes",
]);
const ACTION_FIELDS = {
  show: new Set(["enterFrames", "fromY"]),
  hide: new Set(["exitFrames", "toY"]),
  highlight: new Set(["durFrames", "fill", "stroke", "strokeWidth"]),
  draw: new Set(["durFrames", "drawStyle", "direction"]),
  transform: new Set([
    "durFrames",
    "fromTranslateX",
    "fromTranslateY",
    "fromScale",
    "translateX",
    "translateY",
    "scale",
    "transformOrigin",
  ]),
};

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toPosix(value) {
  return String(value || "").split(path.sep).join("/");
}

function relativeFile(packageRoot, filePath) {
  if (!filePath) return "";
  return toPosix(path.relative(packageRoot, filePath));
}

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function isSafeRelativePath(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  const normalized = value.replace(/\\/g, "/");
  if (normalized.startsWith("/") || /^[a-zA-Z]:\//.test(normalized)) return false;
  return !normalized.split("/").some((part) => part === "..");
}

function readUtf8(filePath) {
  return fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
}

function severityForRecommendation(strict) {
  return strict ? "error" : "warning";
}

function addIssue(result, severity, filePath, message, detail = "") {
  result.issues.push({
    severity,
    file: relativeFile(result.packageRoot, filePath),
    message,
    detail,
  });
}

function addRecommendation(result, filePath, message, detail = "") {
  addIssue(result, severityForRecommendation(result.strict), filePath, message, detail);
}

function parseJson(filePath, result) {
  try {
    return JSON.parse(readUtf8(filePath));
  } catch (error) {
    addIssue(result, "error", filePath, "JSON could not be parsed.", error.message);
    return null;
  }
}

function validateKnownFields(value, allowed, result, filePath, location) {
  if (!isPlainObject(value)) return;
  for (const field of Object.keys(value)) {
    if (!allowed.has(field)) {
      addIssue(result, "error", filePath, `Unknown field in ${location}.`, field);
    }
  }
}

function validatePositiveInteger(value, result, filePath, location, required = false) {
  if (value == null && !required) return;
  if (!Number.isInteger(value) || value <= 0) {
    addIssue(result, "error", filePath, `${location} must be a positive integer.`, String(value));
  }
}

function validateFiniteNumber(value, result, filePath, location) {
  if (value == null) return;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    addIssue(result, "error", filePath, `${location} must be a finite number.`, String(value));
  }
}

function collectSvgElements(svgText) {
  const elements = new Map();
  const stack = [];
  const tagPattern = /<\s*(\/?)\s*([A-Za-z][\w:.-]*)([^<>]*?)\s*(\/?)>/g;
  let match;

  while ((match = tagPattern.exec(svgText))) {
    const closing = Boolean(match[1]);
    const tagName = match[2].split(":").pop().toLowerCase();
    const selfClosing = Boolean(match[4]);

    if (closing) {
      for (let index = stack.length - 1; index >= 0; index -= 1) {
        const current = stack.pop();
        if (current.tagName !== tagName) continue;
        current.end = tagPattern.lastIndex;
        if (current.id && elements.has(current.id)) elements.get(current.id).end = current.end;
        break;
      }
      continue;
    }

    const attrs = {};
    for (const attr of match[0].matchAll(/([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
      attrs[attr[1].toLowerCase()] = attr[2] ?? attr[3] ?? "";
    }
    const element = {
      id: String(attrs.id || "").trim(),
      tagName,
      attrs,
      start: match.index,
      end: tagPattern.lastIndex,
    };
    if (element.id && !elements.has(element.id)) elements.set(element.id, element);
    if (!selfClosing) stack.push(element);
  }

  return elements;
}

function hasDrawableGeometry(svgText, element) {
  if (!element) return false;
  if (DRAWABLE_TAGS.has(element.tagName)) return true;
  if (element.tagName !== "g") return false;
  return /<(?:path|line|polyline|polygon|circle|ellipse|rect)\b/i.test(
    svgText.slice(element.start, element.end),
  );
}

function validateSvg(svgPath, result) {
  const svgText = readUtf8(svgPath);
  result.files.push(relativeFile(result.packageRoot, svgPath));

  if (!/^\s*(?:<\?xml[^>]*>\s*)?(?:<!--[^]*?-->\s*)*<svg\b/i.test(svgText)) {
    addIssue(result, "error", svgPath, "File does not have a parseable SVG root.");
  }
  const rootMatch = svgText.match(/<svg\b([^>]*)>/i);
  const rootAttrs = rootMatch ? rootMatch[1] : "";
  if (!/\bxmlns\s*=\s*["']http:\/\/www\.w3\.org\/2000\/svg["']/i.test(rootAttrs)) {
    addIssue(result, "error", svgPath, "SVG root is missing the SVG namespace.");
  }
  if (!/\bviewBox\s*=\s*["'][^"']+["']/i.test(rootAttrs)) {
    addIssue(result, "error", svgPath, "SVG root is missing viewBox.");
  }
  if (!/<\/svg>\s*$/i.test(svgText.trim())) {
    addIssue(result, "error", svgPath, "SVG does not end with </svg>.");
  }
  if (/\uFFFD|[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(svgText)) {
    addIssue(result, "error", svgPath, "SVG contains invalid or replacement characters.");
  }

  const ids = [...svgText.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map((match) => match[1]);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  for (const id of duplicates) addIssue(result, "error", svgPath, "Duplicate SVG id.", id);

  if (/<\s*script\b/i.test(svgText)) addIssue(result, "error", svgPath, "SVG contains a script element.");
  if (/\son[a-z]+\s*=/i.test(svgText)) addIssue(result, "error", svgPath, "SVG contains an event-handler attribute.");
  if (/javascript\s*:/i.test(svgText)) addIssue(result, "error", svgPath, "SVG contains a javascript URL.");
  if (/<\s*foreignObject\b/i.test(svgText)) {
    addRecommendation(result, svgPath, "SVG contains foreignObject and is not safely portable.");
  }
  if (/<\s*link\b/i.test(svgText) || /@import\b/i.test(svgText)) {
    addIssue(result, "error", svgPath, "SVG contains an external stylesheet mechanism.");
  }

  const approvedEmbeddedImages = new Set(
    [...svgText.matchAll(/<image\b([^>]*)>/gi)]
      .filter((match) => /\bdata-qa-embedded-image\s*=\s*["']allowed["']/i.test(match[1]) && /\bdata-qa-reason\s*=\s*["'][^"']+["']/i.test(match[1]))
      .map((match) => {
        const href = match[1].match(/\b(?:href|xlink:href)\s*=\s*["']([^"']+)["']/i);
        return href ? href[1].trim() : "";
      })
      .filter(Boolean),
  );
  for (const match of svgText.matchAll(/\b(?:href|xlink:href)\s*=\s*["']([^"']+)["']/gi)) {
    const reference = match[1].trim();
    if (/^(?:https?:|file:|blob:|javascript:)/i.test(reference)) {
      addIssue(result, "error", svgPath, "SVG contains an external or active reference.", reference);
    } else if (/^data:/i.test(reference) && !approvedEmbeddedImages.has(reference)) {
      addRecommendation(result, svgPath, "Embedded data URL should be reviewed for size and provenance.");
    }
  }
  if (/\burl\(\s*["']?(?:https?:|file:|blob:|javascript:)/i.test(svgText)) {
    addIssue(result, "error", svgPath, "SVG CSS contains an external or active URL.");
  }
  if (/(?:[A-Za-z]:\\|\/Users\/|\/home\/)[^\s"']+/i.test(svgText)) {
    addIssue(result, "error", svgPath, "SVG leaks an absolute local file path.");
  }

  const publicTargets = [];
  for (const match of svgText.matchAll(/<([A-Za-z][\w:.-]*)\b([^>]*)\bdata-anim-target\s*=\s*["']true["']([^>]*)>/gi)) {
    const markup = `${match[2]} ${match[3]}`;
    const idMatch = markup.match(/\bid\s*=\s*["']([^"']+)["']/i);
    if (!idMatch) {
      addIssue(result, "error", svgPath, "Public animation target has no id.", match[0]);
      continue;
    }
    const targetId = idMatch[1];
    publicTargets.push(targetId);
    if (!PUBLIC_ID_PATTERN.test(targetId)) {
      addIssue(result, "error", svgPath, "Public animation target id is not semantic ASCII snake_case.", targetId);
    }
  }

  return {
    svgText,
    ids: new Set(ids),
    elements: collectSvgElements(svgText),
    publicTargets: new Set(publicTargets),
  };
}

function validateAnimationManifest(manifestPath, svgPath, svgInfo, spokenText, result) {
  const manifest = parseJson(manifestPath, result);
  if (!manifest) return;
  result.manifests.push(relativeFile(result.packageRoot, manifestPath));

  if (!isPlainObject(manifest)) {
    addIssue(result, "error", manifestPath, "Animation manifest root must be an object.");
    return;
  }
  validateKnownFields(manifest, MANIFEST_ROOT_FIELDS, result, manifestPath, "manifest root");
  if (manifest.schemaVersion !== ANIMATION_SCHEMA) {
    addIssue(result, "error", manifestPath, "Animation manifest has the wrong schemaVersion.", String(manifest.schemaVersion));
  }
  if (typeof manifest.svgPath !== "string" || path.basename(manifest.svgPath) !== path.basename(svgPath)) {
    addIssue(result, "error", manifestPath, "Manifest svgPath does not identify the paired SVG.", String(manifest.svgPath));
  }
  if (!isSafeRelativePath(manifest.svgPath)) {
    addIssue(result, "error", manifestPath, "Manifest svgPath must be a safe scene-relative path.", String(manifest.svgPath));
  }

  if (manifest.defaults != null && !isPlainObject(manifest.defaults)) {
    addIssue(result, "error", manifestPath, "Manifest defaults must be an object.");
  } else if (isPlainObject(manifest.defaults)) {
    validateKnownFields(manifest.defaults, DEFAULT_FIELDS, result, manifestPath, "defaults");
    for (const [field, value] of Object.entries(manifest.defaults)) {
      validatePositiveInteger(value, result, manifestPath, `defaults.${field}`, true);
    }
  }

  const targets = Array.isArray(manifest.targets) ? manifest.targets : [];
  const steps = Array.isArray(manifest.steps) ? manifest.steps : [];
  if (manifest.targets != null && !Array.isArray(manifest.targets)) {
    addIssue(result, "error", manifestPath, "Manifest targets must be an array.");
  }
  if (manifest.steps != null && !Array.isArray(manifest.steps)) {
    addIssue(result, "error", manifestPath, "Manifest steps must be an array.");
  }

  const targetById = new Map();
  for (let index = 0; index < targets.length; index += 1) {
    const target = targets[index];
    const location = `targets[${index}]`;
    if (!isPlainObject(target)) {
      addIssue(result, "error", manifestPath, `${location} must be an object.`);
      continue;
    }
    validateKnownFields(target, TARGET_FIELDS, result, manifestPath, location);
    const targetId = typeof target.targetId === "string" ? target.targetId.trim() : "";
    if (!targetId) {
      addIssue(result, "error", manifestPath, `${location}.targetId is required.`);
      continue;
    }
    if (targetById.has(targetId)) addIssue(result, "error", manifestPath, "Duplicate manifest targetId.", targetId);
    targetById.set(targetId, target);
    if (!PUBLIC_ID_PATTERN.test(targetId)) {
      addIssue(result, "error", manifestPath, "Manifest targetId is not semantic ASCII snake_case.", targetId);
    }
    if (!svgInfo.ids.has(targetId)) addIssue(result, "error", manifestPath, "Manifest targetId does not exist in SVG.", targetId);
    if (target.status != null && !TARGET_STATUSES.has(target.status)) {
      addIssue(result, "error", manifestPath, `${location}.status is invalid.`, String(target.status));
    }
    if (target.status === "ignored") addRecommendation(result, manifestPath, "Target uses legacy status ignored; use notAnimated.", targetId);
    if (target.status === "orphaned") addIssue(result, "error", manifestPath, "Final handoff contains an orphaned target.", targetId);
    if (target.confidence != null && !CONFIDENCE_VALUES.has(target.confidence)) {
      addIssue(result, "error", manifestPath, `${location}.confidence is invalid.`, String(target.confidence));
    }
    if (target.visibleInEditor != null && typeof target.visibleInEditor !== "boolean") {
      addIssue(result, "error", manifestPath, `${location}.visibleInEditor must be boolean.`);
    }
    if (target.render != null && typeof target.render !== "boolean") {
      addIssue(result, "error", manifestPath, `${location}.render must be boolean.`);
    }
  }

  const stepCountByTarget = new Map();
  const wholeSceneTarget = /^(?:scene_content|main_content|source_state_[0-9]+)$/;
  if (steps.length && targets.length && targets.every((target) => wholeSceneTarget.test(String(target?.targetId || "")))) {
    addIssue(
      result,
      "error",
      manifestPath,
      "Animation only targets complete scene/source-state containers; semantic element targets are required.",
    );
  }
  for (let index = 0; index < steps.length; index += 1) {
    const step = steps[index];
    const location = `steps[${index}]`;
    if (!isPlainObject(step)) {
      addIssue(result, "error", manifestPath, `${location} must be an object.`);
      continue;
    }
    const action = step.action;
    const allowed = new Set([...STEP_BASE_FIELDS, ...(ACTION_FIELDS[action] || [])]);
    validateKnownFields(step, allowed, result, manifestPath, location);
    if (!ACTIONS.has(action)) addIssue(result, "error", manifestPath, `${location}.action is invalid.`, String(action));

    const targetId = typeof step.targetId === "string" ? step.targetId.trim() : "";
    if (!targetId) {
      addIssue(result, "error", manifestPath, `${location}.targetId is required.`);
    } else {
      stepCountByTarget.set(targetId, (stepCountByTarget.get(targetId) || 0) + 1);
      if (!targetById.has(targetId)) addIssue(result, "error", manifestPath, "Animation step references an undeclared target.", targetId);
      if (!svgInfo.ids.has(targetId)) addIssue(result, "error", manifestPath, "Animation step target does not exist in SVG.", targetId);
    }

    if (step.confidence != null && !CONFIDENCE_VALUES.has(step.confidence)) {
      addIssue(result, "error", manifestPath, `${location}.confidence is invalid.`, String(step.confidence));
    }
    if (step.occurrence != null) validatePositiveInteger(step.occurrence, result, manifestPath, `${location}.occurrence`, true);

    const sourceText = typeof step.sourceText === "string" ? step.sourceText.trim() : "";
    if (!sourceText) {
      addIssue(result, "error", manifestPath, `${location}.sourceText is required for final handoff.`);
    } else if (/\{\{pause:/i.test(sourceText)) {
      addIssue(result, "error", manifestPath, "sourceText must not contain a pause marker.", sourceText);
    } else if (!spokenText.trim()) {
      addIssue(result, "error", manifestPath, "Scene has animation steps but no spoken text.", sourceText);
    } else {
      const match = SvgAnimationDomain.matchSourceText(spokenText, sourceText, step.occurrence);
      if (!match.matched) {
        addIssue(result, "error", manifestPath, "sourceText does not occur in the scene spoken text.", sourceText);
      } else if (match.ambiguous) {
        addIssue(result, "error", manifestPath, "sourceText occurs multiple times and needs occurrence.", sourceText);
      } else if (step.occurrence != null && step.occurrence > match.matches.length) {
        addIssue(result, "error", manifestPath, "sourceText occurrence is outside the available matches.", `${sourceText} #${step.occurrence}`);
      }
      const wordCount = SvgAnimationDomain.wordTokens(sourceText).length;
      if (wordCount < 3 || wordCount > 8) {
        addRecommendation(result, manifestPath, "sourceText should usually contain three to eight complete words.", sourceText);
      }
    }

    if (action === "show") {
      validatePositiveInteger(step.enterFrames, result, manifestPath, `${location}.enterFrames`);
      validateFiniteNumber(step.fromY, result, manifestPath, `${location}.fromY`);
    } else if (action === "hide") {
      validatePositiveInteger(step.exitFrames, result, manifestPath, `${location}.exitFrames`);
      validateFiniteNumber(step.toY, result, manifestPath, `${location}.toY`);
    } else if (action === "highlight") {
      validatePositiveInteger(step.durFrames, result, manifestPath, `${location}.durFrames`);
      validateFiniteNumber(step.strokeWidth, result, manifestPath, `${location}.strokeWidth`);
      if (typeof step.strokeWidth === "number" && step.strokeWidth < 0) {
        addIssue(result, "error", manifestPath, `${location}.strokeWidth must be nonnegative.`);
      }
    } else if (action === "draw") {
      validatePositiveInteger(step.durFrames, result, manifestPath, `${location}.durFrames`);
      if (step.drawStyle != null && !DRAW_STYLES.has(step.drawStyle)) {
        addIssue(result, "error", manifestPath, `${location}.drawStyle is invalid.`, String(step.drawStyle));
      }
      if (step.direction != null && !DRAW_DIRECTIONS.has(step.direction)) {
        addIssue(result, "error", manifestPath, `${location}.direction must use the v1 camelCase enum.`, String(step.direction));
      }
      if (!hasDrawableGeometry(svgInfo.svgText, svgInfo.elements.get(targetId))) {
        addIssue(result, "error", manifestPath, "Draw target has no measurable SVG geometry.", targetId);
      }
      const previous = steps[index - 1];
      if (step.drawStyle === "reveal" && previous?.targetId === targetId && previous?.action === "show") {
        addRecommendation(result, manifestPath, "Reveal step is immediately preceded by show for the same target.", targetId);
      }
    } else if (action === "transform") {
      validatePositiveInteger(step.durFrames, result, manifestPath, `${location}.durFrames`);
      for (const field of ["fromTranslateX", "fromTranslateY", "translateX", "translateY"]) {
        validateFiniteNumber(step[field], result, manifestPath, `${location}.${field}`);
      }
      for (const field of ["fromScale", "scale"]) {
        validateFiniteNumber(step[field], result, manifestPath, `${location}.${field}`);
        if (step[field] != null && (!(step[field] > 0))) {
          addIssue(result, "error", manifestPath, `${location}.${field} must be positive.`);
        }
      }
    }
  }

  for (const [targetId, target] of targetById.entries()) {
    const count = stepCountByTarget.get(targetId) || 0;
    if (target.status === "animated" && count === 0) {
      addIssue(result, "error", manifestPath, "Animated target has no animation step.", targetId);
    }
    if ((target.status === "notAnimated" || target.status === "ignored") && count > 0) {
      addRecommendation(result, manifestPath, "Non-animated target still has animation steps.", targetId);
    }
    if (target.render === false && count > 0) {
      addRecommendation(result, manifestPath, "render:false target has steps that will be suppressed.", targetId);
    }
  }
}

function runHandoffPackageQa({ packageRoot, strict = false } = {}) {
  const resolvedRoot = path.resolve(String(packageRoot || ""));
  const result = {
    checked: true,
    strict: Boolean(strict),
    packageRoot: resolvedRoot,
    package: "",
    moduleId: "",
    files: [],
    manifests: [],
    scenes: [],
    issues: [],
    summary: {
      scenes_checked: 0,
      svg_files_checked: 0,
      manifests_checked: 0,
      errors: 0,
      warnings: 0,
    },
  };

  if (!fs.existsSync(resolvedRoot) || !fs.statSync(resolvedRoot).isDirectory()) {
    addIssue(result, "error", resolvedRoot, "Handoff package directory does not exist.");
    result.summary.errors = 1;
    return result;
  }

  const packagePath = path.join(resolvedRoot, "import.package.v1.json");
  result.package = relativeFile(resolvedRoot, packagePath);
  if (!fs.existsSync(packagePath)) {
    addIssue(result, "error", packagePath, "Missing import.package.v1.json.");
    result.summary.errors = result.issues.length;
    return result;
  }

  const packageManifest = parseJson(packagePath, result);
  if (!packageManifest || !isPlainObject(packageManifest)) {
    if (packageManifest != null) addIssue(result, "error", packagePath, "Package manifest root must be an object.");
    result.summary.errors = result.issues.filter((issue) => issue.severity === "error").length;
    return result;
  }
  validateKnownFields(packageManifest, PACKAGE_FIELDS, result, packagePath, "package manifest");
  if (packageManifest.schemaVersion !== PACKAGE_SCHEMA) {
    addIssue(result, "error", packagePath, "Package has the wrong schemaVersion.", String(packageManifest.schemaVersion));
  }
  if (packageManifest.assetMode !== "bySceneId") {
    addIssue(result, "error", packagePath, "Package assetMode must be bySceneId.", String(packageManifest.assetMode));
  }

  result.moduleId = typeof packageManifest.moduleId === "string" ? packageManifest.moduleId.trim() : "";
  if (!result.moduleId) {
    addIssue(result, "error", packagePath, "Package moduleId is required.");
  } else {
    if (result.moduleId.length > 80) addRecommendation(result, packagePath, "moduleId should not exceed 80 characters.");
    if (!MODULE_ID_PATTERN.test(result.moduleId)) {
      addRecommendation(result, packagePath, "moduleId should use lowercase letters, digits and hyphens.", result.moduleId);
    }
  }
  if (typeof packageManifest.moduleTitle !== "string" || !packageManifest.moduleTitle.trim()) {
    addRecommendation(result, packagePath, "moduleTitle should be provided for the reviewer.");
  }

  const rowsRelative = packageManifest.rows;
  if (!isSafeRelativePath(rowsRelative)) {
    addIssue(result, "error", packagePath, "rows must be a safe relative package path.", String(rowsRelative));
  }
  const rowsPath = isSafeRelativePath(rowsRelative) ? path.resolve(resolvedRoot, rowsRelative) : "";
  if (!rowsPath || !isInside(resolvedRoot, rowsPath) || !fs.existsSync(rowsPath)) {
    addIssue(result, "error", packagePath, "rows does not point to an existing file inside the package.", String(rowsRelative));
  }

  const assetsRelative = packageManifest.assetsDir == null ? "assets" : packageManifest.assetsDir;
  if (!isSafeRelativePath(assetsRelative)) {
    addIssue(result, "error", packagePath, "assetsDir must be a safe relative package path.", String(assetsRelative));
  }
  const assetsPath = isSafeRelativePath(assetsRelative) ? path.resolve(resolvedRoot, assetsRelative) : "";
  if (!assetsPath || !isInside(resolvedRoot, assetsPath) || !fs.existsSync(assetsPath) || !fs.statSync(assetsPath).isDirectory()) {
    addIssue(result, "error", packagePath, "Package assets directory is missing.", String(assetsRelative));
  }

  let rows = [];
  if (rowsPath && fs.existsSync(rowsPath)) {
    const parsedRows = parseJson(rowsPath, result);
    if (Array.isArray(parsedRows)) {
      rows = parsedRows;
      addRecommendation(result, rowsPath, "Use the recommended {\"rows\": [...]} wrapper.");
    } else if (isPlainObject(parsedRows) && Array.isArray(parsedRows.rows)) {
      rows = parsedRows.rows;
    } else if (parsedRows != null) {
      addIssue(result, "error", rowsPath, "storyboard.rows.json must be an array or an object with rows[].");
    }
  }
  if (!rows.length) addIssue(result, "error", rowsPath || packagePath, "Package contains no storyboard rows.");

  const sceneIds = new Set();
  const moduleNames = new Set();
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const location = `rows[${index}]`;
    if (!isPlainObject(row)) {
      addIssue(result, "error", rowsPath, `${location} must be an object.`);
      continue;
    }
    const sceneId = typeof row.Scene_ID === "string" ? row.Scene_ID.trim() : "";
    if (!sceneId) {
      addIssue(result, "error", rowsPath, `${location}.Scene_ID is required.`);
    } else if (!SCENE_ID_PATTERN.test(sceneId)) {
      addIssue(result, "error", rowsPath, `${location}.Scene_ID must be a safe single path segment.`, sceneId);
    } else if (sceneIds.has(sceneId)) {
      addIssue(result, "error", rowsPath, "Duplicate Scene_ID.", sceneId);
    } else {
      sceneIds.add(sceneId);
    }
    if (typeof row.Modul !== "string" || !row.Modul.trim()) {
      addIssue(result, "error", rowsPath, `${location}.Modul is required.`);
    } else {
      moduleNames.add(row.Modul.trim());
    }
    if (
      (typeof row.Kapitel !== "string" || !row.Kapitel.trim()) &&
      (typeof row["System.Xml.XmlElement"] !== "string" || !row["System.Xml.XmlElement"].trim())
    ) {
      addIssue(result, "error", rowsPath, `${location} requires Kapitel or System.Xml.XmlElement.`);
    }
    if (typeof row.Lektion !== "string" || !row.Lektion.trim()) {
      addIssue(result, "error", rowsPath, `${location}.Lektion is required.`);
    }
    const spokenText = String(row["Gesprochener Text"] || "");
    for (const pauseError of NarrationPauseDomain.validateNarration(spokenText).errors) {
      addIssue(
        result,
        "error",
        rowsPath,
        `${location}.Gesprochener Text contains an invalid pause marker.`,
        `${pauseError.raw}: ${pauseError.message}`,
      );
    }
  }
  if (moduleNames.size > 1) addIssue(result, "error", rowsPath, "Storyboard rows contain more than one module.", [...moduleNames].join(", "));

  const assetEntries = assetsPath && fs.existsSync(assetsPath)
    ? fs.readdirSync(assetsPath, { withFileTypes: true })
    : [];
  for (const entry of assetEntries) {
    const entryPath = path.join(assetsPath, entry.name);
    if (!entry.isDirectory()) {
      addIssue(result, "error", entryPath, "Only scene directories are allowed directly below assetsDir.");
    } else if (!sceneIds.has(entry.name)) {
      addRecommendation(result, entryPath, "Asset directory has no matching Scene_ID.", entry.name);
    }
  }

  for (const row of rows) {
    if (!isPlainObject(row) || typeof row.Scene_ID !== "string" || !row.Scene_ID.trim()) continue;
    const sceneId = row.Scene_ID.trim();
    const scenePath = assetsPath ? path.join(assetsPath, sceneId) : "";
    const sceneResult = { sceneId, svg: "", animationManifest: "", spokenText: Boolean(String(row["Gesprochener Text"] || "").trim()) };
    result.scenes.push(sceneResult);

    if (!scenePath || !fs.existsSync(scenePath) || !fs.statSync(scenePath).isDirectory()) {
      addIssue(result, "error", scenePath || assetsPath, "Scene has no matching asset directory.", sceneId);
      continue;
    }
    const entries = fs.readdirSync(scenePath, { withFileTypes: true });
    const svgFiles = entries.filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === ".svg");
    const manifestFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".animation.v1.json"));
    const unexpectedDirs = entries.filter((entry) => entry.isDirectory());
    for (const entry of unexpectedDirs) {
      addRecommendation(result, path.join(scenePath, entry.name), "Scene asset directory should be flat.");
    }
    if (svgFiles.length !== 1) {
      addIssue(result, "error", scenePath, "Automatically assignable scene must contain exactly one SVG.", `${svgFiles.length} SVG files`);
      continue;
    }

    const svgPath = path.join(scenePath, svgFiles[0].name);
    sceneResult.svg = relativeFile(resolvedRoot, svgPath);
    const svgInfo = validateSvg(svgPath, result);

    if (manifestFiles.length > 1) {
      addIssue(result, "error", scenePath, "Scene contains more than one animation manifest.");
    }
    if (manifestFiles.length === 1) {
      const manifestPath = path.join(scenePath, manifestFiles[0].name);
      const expectedName = `${path.basename(svgPath, ".svg")}.animation.v1.json`;
      sceneResult.animationManifest = relativeFile(resolvedRoot, manifestPath);
      if (path.basename(manifestPath) !== expectedName) {
        addIssue(result, "error", manifestPath, "Animation manifest basename does not match SVG basename.", expectedName);
      }
      validateAnimationManifest(
        manifestPath,
        svgPath,
        svgInfo,
        String(row["Gesprochener Text"] || ""),
        result,
      );
    } else if (String(row["Gesprochener Text"] || "").trim() && svgInfo.publicTargets.size) {
      addRecommendation(result, svgPath, "Scene exposes animation targets but has no animation manifest.");
    }
  }

  result.summary.scenes_checked = result.scenes.length;
  result.summary.svg_files_checked = result.files.length;
  result.summary.manifests_checked = result.manifests.length;
  result.summary.errors = result.issues.filter((issue) => issue.severity === "error").length;
  result.summary.warnings = result.issues.filter((issue) => issue.severity === "warning").length;
  return result;
}

module.exports = {
  ANIMATION_SCHEMA,
  PACKAGE_SCHEMA,
  runHandoffPackageQa,
};
