const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const svgAnimationDomain = require("./svg-animation-domain");
const contentCrosscheckDomain = require("./content-crosscheck-domain");

const repoRoot = path.resolve(__dirname, "..", "..");
const realRepoRoot = fs.realpathSync(repoRoot);
const indexPath = path.join(__dirname, "index.html");
const svgAnimationEditorPath = path.join(__dirname, "svg-animation-editor.html");
const viewerAssetPaths = new Map([
  ["svg-animation-domain.js", path.join(__dirname, "svg-animation-domain.js")],
  ["svg-animation-editor.js", path.join(__dirname, "svg-animation-editor.js")],
  ["svg-animation-editor.css", path.join(__dirname, "svg-animation-editor.css")],
]);
const sourceRoot = path.join(repoRoot, "source-materials", "basis-seminar");
const pngRoot = path.join(sourceRoot, "png");
const analysisRoot = path.join(repoRoot, "analysis");
const slideAnalysisRoot = path.join(analysisRoot, "slides");
const moduleAnalysisRoot = path.join(analysisRoot, "modules");
const reviewRoot = path.join(analysisRoot, "viewer-notes");
const reviewVersionRoot = path.join(reviewRoot, "versions");
const pendingReviewRoot = path.join(reviewRoot, "_pending");
const additionalSlidesPath = path.join(reviewRoot, "additional-slides.json");
const viewerCurationPath = path.join(reviewRoot, "viewer-curation.json");
const crosscheckRoot = path.join(reviewRoot, "crosschecks");
const rebuildPlanRoot = path.join(analysisRoot, "rebuild-plans");
const proposalRoots = [
  path.join(repoRoot, "rebuild-proposals", "svg"),
  path.join(analysisRoot, "svg-proposals"),
  path.join(repoRoot, "svg-proposals"),
];

const portArgument = process.argv.slice(2).find((argument) => /^\d+$/.test(argument));
const requestedPort = Number(process.env.BASIS_REBUILD_VIEWER_PORT || portArgument || 4174);

const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const svgExtensions = new Set([".svg"]);
const reviewStatuses = new Set(["open", "needs_revision", "accepted", "final"]);
const unresolvedReviewStatuses = new Set(["open", "needs_revision"]);

function naturalCompare(left, right) {
  return String(left).localeCompare(String(right), "de", {
    numeric: true,
    sensitivity: "base",
  });
}

function isInsideRepo(absolutePath) {
  const relativePath = path.relative(repoRoot, absolutePath);
  return !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
}

function isInsideRepoReal(existingPath) {
  if (!fs.existsSync(existingPath)) return false;
  const resolvedPath = fs.realpathSync(existingPath);
  const relativePath = path.relative(realRepoRoot, resolvedPath);
  return !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
}

function toWebPath(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function fileUrl(filePath) {
  return `/files/${toWebPath(filePath).split("/").map(encodeURIComponent).join("/")}`;
}

function animationManifestPathFor(svgPath) {
  return path.join(path.dirname(svgPath), "scene.animation.v1.json");
}

function animationInfoFor(svgPath) {
  const manifestPath = animationManifestPathFor(svgPath);
  if (!fs.existsSync(manifestPath)) {
    return {
      exists: false,
      available: false,
      url: "",
      stepCount: 0,
      defaultPauseMs: null,
    };
  }

  try {
    const manifest = readJsonFile(manifestPath);
    return {
      exists: true,
      available: Array.isArray(manifest.steps) && manifest.steps.length > 0,
      url: fileUrl(manifestPath),
      stepCount: Array.isArray(manifest.steps) ? manifest.steps.length : 0,
      defaultPauseMs: Number(manifest.defaults?.pauseMs) || null,
    };
  } catch {
    return {
      exists: true,
      available: false,
      url: "",
      stepCount: 0,
      defaultPauseMs: null,
      readError: "Animationsmanifest ist kein gueltiges JSON.",
    };
  }
}

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function writeJsonFile(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeJsonFileAtomic(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  try {
    fs.writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
    fs.renameSync(temporaryPath, filePath);
  } catch (error) {
    if (fs.existsSync(temporaryPath)) fs.rmSync(temporaryPath, { force: true });
    throw error;
  }
}

function sourceReferenceMapPath(moduleId) {
  return path.join(
    rebuildPlanRoot,
    `${cleanModuleId(moduleId)}_source-reference-map.json`,
  );
}

function normalizeSourceReferenceMapping(entry, source = "reference_map") {
  const outputSlideNumber = Number(entry?.output_slide_number);
  const sourceSlides = Array.isArray(entry?.source_slides)
    ? [...new Set(entry.source_slides.map(Number).filter((value) => Number.isFinite(value) && value > 0))]
    : [];
  const primarySourceSlide = Number(entry?.primary_source_slide);
  const outputSlideNumbers = Array.isArray(entry?.output_slide_numbers)
    ? [...new Set(entry.output_slide_numbers.map(Number).filter((value) => Number.isFinite(value) && value > 0))]
    : [];
  return {
    work_unit: String(entry?.work_unit || ""),
    output_slide_number: Number.isFinite(outputSlideNumber) ? outputSlideNumber : null,
    source_slides: sourceSlides,
    primary_source_slide: sourceSlides.includes(primarySourceSlide)
      ? primarySourceSlide
      : sourceSlides.at(-1) || null,
    output_slide_numbers: outputSlideNumbers,
    mapping_type: String(entry?.mapping_type || (sourceSlides.length > 1 ? "merged" : "direct")),
    rationale: String(entry?.rationale || ""),
    mapping_source: source,
  };
}

function readSourceReferenceMap(moduleId) {
  const filePath = sourceReferenceMapPath(moduleId);
  if (!fs.existsSync(filePath)) {
    return {
      path: "",
      schema_version: "",
      module_id: cleanModuleId(moduleId),
      sequence_plan: "",
      mappings: [],
      read_error: "",
    };
  }

  try {
    const parsed = readJsonFile(filePath);
    return {
      path: toWebPath(filePath),
      schema_version: String(parsed?.schema_version || ""),
      module_id: cleanModuleId(parsed?.module_id || moduleId),
      sequence_plan: String(parsed?.sequence_plan || ""),
      mappings: Array.isArray(parsed?.mappings)
        ? parsed.mappings.map((entry) => normalizeSourceReferenceMapping(entry)).filter((entry) => entry.output_slide_number)
        : [],
      read_error: "",
    };
  } catch (error) {
    return {
      path: toWebPath(filePath),
      schema_version: "",
      module_id: cleanModuleId(moduleId),
      sequence_plan: "",
      mappings: [],
      read_error: error.message,
    };
  }
}

function sourceReferenceMappingFor(moduleId, slideNumber, isAdditionalSlide = false) {
  const safeSlideNumber = Number(slideNumber);
  if (isAdditionalSlide || safeSlideNumber >= 1000) {
    return normalizeSourceReferenceMapping({
      output_slide_number: safeSlideNumber,
      source_slides: [],
      mapping_type: "new_content",
      rationale: "Zusatzfolie ohne alte PowerPoint-Referenz; das Review-Briefing ist der Inhaltsanker.",
    }, "additional_slide");
  }

  const referenceMap = readSourceReferenceMap(moduleId);
  const direct = referenceMap.mappings.find((entry) => entry.output_slide_number === safeSlideNumber);
  if (direct) {
    return {
      ...direct,
      reference_map_path: referenceMap.path,
      sequence_plan: referenceMap.sequence_plan,
      read_error: referenceMap.read_error,
    };
  }

  const absorbedBy = referenceMap.mappings
    .filter((entry) => entry.source_slides.includes(safeSlideNumber))
    .map((entry) => entry.output_slide_number);
  if (absorbedBy.length) {
    return {
      ...normalizeSourceReferenceMapping({
      source_slides: [],
      output_slide_numbers: absorbedBy,
      mapping_type: "absorbed_source",
      rationale: `Quellfolie ${safeSlideNumber} wird in einer anderen SVG-Arbeitseinheit mitgeprueft.`,
      }, referenceMap.path || "reference_map"),
      reference_map_path: referenceMap.path,
      sequence_plan: referenceMap.sequence_plan,
      read_error: referenceMap.read_error,
    };
  }

  return {
    ...normalizeSourceReferenceMapping({
      output_slide_number: safeSlideNumber,
      source_slides: [safeSlideNumber],
      primary_source_slide: safeSlideNumber,
      mapping_type: "direct_fallback",
      rationale: "Noch kein explizites Referenz-Mapping vorhanden; direkte Foliennummer wird vorlaeufig verwendet.",
    }, "same_slide_fallback"),
    reference_map_path: referenceMap.path,
    sequence_plan: referenceMap.sequence_plan,
    read_error: referenceMap.read_error,
  };
}

function crosscheckFilePath(moduleId, slideNumber) {
  return path.join(
    crosscheckRoot,
    `${cleanModuleId(moduleId)}_slide_${padSlideNumber(slideNumber)}.json`,
  );
}

function hashFileIfReadable(filePath) {
  if (!filePath || !isInsideRepo(filePath) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return "";
  }
  return hashText(fs.readFileSync(filePath));
}

function readContentCrosscheck(moduleId, slideNumber, proposal, referenceMapping) {
  const filePath = crosscheckFilePath(moduleId, slideNumber);
  if (!fs.existsSync(filePath)) return null;
  try {
    const report = readJsonFile(filePath);
    const proposalPath = proposal?.path ? path.resolve(repoRoot, proposal.path) : "";
    const currentProposalHash = hashFileIfReadable(proposalPath);
    const currentMappingHash = hashText(JSON.stringify(referenceMapping || {}));
    return {
      ...report,
      report_path: toWebPath(filePath),
      is_stale: Boolean(
        (currentProposalHash && report?.proposal?.svg_sha256 !== currentProposalHash) ||
        (report?.reference_mapping_sha256 && report.reference_mapping_sha256 !== currentMappingHash)
      ),
    };
  } catch (error) {
    return {
      status: "read_error",
      findings: [{
        severity: "error",
        code: "crosscheck-report-invalid",
        message: `Gespeicherter Crosscheck ist kein gueltiges JSON: ${error.message}`,
      }],
      report_path: toWebPath(filePath),
      is_stale: true,
    };
  }
}

function removedSvgProposalSlides(moduleId) {
  const planPath = path.join(rebuildPlanRoot, `${cleanModuleId(moduleId)}_final_svg_rebuild_plan.json`);
  if (!fs.existsSync(planPath)) return new Set();

  try {
    const plan = readJsonFile(planPath);
    const removed = Array.isArray(plan.removed_slides) ? plan.removed_slides : [];
    return new Set(
      removed
        .map((entry) => Number(entry?.slide ?? entry?.source_slide_number ?? entry))
        .filter((slideNumber) => Number.isFinite(slideNumber) && slideNumber > 0),
    );
  } catch {
    return new Set();
  }
}

function isSvgProposalRemoved(moduleId, slideNumber) {
  return removedSvgProposalSlides(moduleId).has(Number(slideNumber));
}

function defaultViewerCurationStore() {
  return {
    schema_version: "basisRebuildViewerCuration/v1",
    slides: {},
  };
}

function curationKey(moduleId, slideNumber) {
  return slideKey(moduleId, slideNumber);
}

function readViewerCurationStore() {
  if (!fs.existsSync(viewerCurationPath)) return defaultViewerCurationStore();
  try {
    const parsed = readJsonFile(viewerCurationPath);
    return {
      ...defaultViewerCurationStore(),
      ...parsed,
      slides: parsed && typeof parsed.slides === "object" && !Array.isArray(parsed.slides)
        ? parsed.slides
        : {},
    };
  } catch {
    return defaultViewerCurationStore();
  }
}

function writeViewerCurationStore(store) {
  writeJsonFile(viewerCurationPath, {
    ...defaultViewerCurationStore(),
    ...store,
    slides: store && typeof store.slides === "object" && !Array.isArray(store.slides)
      ? store.slides
      : {},
  });
}

function normalizedSlideCuration(value) {
  const order = Number(value?.order);
  return {
    order: Number.isFinite(order) ? order : null,
    hidden: value?.hidden === true,
    updated_at: value?.updated_at || null,
  };
}

function defaultAdditionalSlideStore() {
  return {
    schema_version: "basisRebuildViewerAdditionalSlides/v1",
    slides: [],
  };
}

function readAdditionalSlideStore() {
  if (!fs.existsSync(additionalSlidesPath)) return defaultAdditionalSlideStore();
  try {
    const parsed = readJsonFile(additionalSlidesPath);
    return {
      ...defaultAdditionalSlideStore(),
      ...parsed,
      slides: Array.isArray(parsed.slides) ? parsed.slides : [],
    };
  } catch {
    return defaultAdditionalSlideStore();
  }
}

function writeAdditionalSlideStore(store) {
  writeJsonFile(additionalSlidesPath, {
    ...defaultAdditionalSlideStore(),
    ...store,
    slides: Array.isArray(store.slides) ? store.slides : [],
  });
}

function additionalSlideLabel(index) {
  return `Zusatzfolie ${padSlideNumber(index)}`;
}

function normalizeAdditionalSlide(entry, fallbackIndex = 0) {
  const moduleId = cleanModuleId(entry?.module_id || entry?.moduleId);
  const slideNumber = Number(entry?.source_slide_number || entry?.slideNumber);
  if (!moduleId || !Number.isFinite(slideNumber) || slideNumber < 1000) return null;

  const additionalIndex = Number(entry?.additional_index) ||
    Math.max(1, Math.round(slideNumber - 1000)) ||
    fallbackIndex + 1;
  const insertAfter = Number(entry?.insert_after_slide_number);

  return {
    schema_version: "basisRebuildViewerAdditionalSlide/v1",
    module_id: moduleId,
    source_slide_number: slideNumber,
    additional_slide_id: entry?.additional_slide_id || `additional_${padSlideNumber(additionalIndex)}`,
    additional_index: additionalIndex,
    insert_after_slide_number: Number.isFinite(insertAfter) && insertAfter > 0 ? insertAfter : null,
    title: String(entry?.title || additionalSlideLabel(additionalIndex)),
    created_at: entry?.created_at || null,
    updated_at: entry?.updated_at || null,
  };
}

function collectAdditionalSlides() {
  return readAdditionalSlideStore()
    .slides
    .map((entry, index) => normalizeAdditionalSlide(entry, index))
    .filter(Boolean)
    .sort((left, right) =>
      naturalCompare(left.module_id, right.module_id) ||
      left.source_slide_number - right.source_slide_number
    );
}

function createAdditionalSlide(moduleId, insertAfterSlideNumber) {
  const safeModule = cleanModuleId(moduleId);
  if (!safeModule) return null;

  const store = readAdditionalSlideStore();
  const existing = store.slides
    .map((entry, index) => normalizeAdditionalSlide(entry, index))
    .filter(Boolean);
  const moduleSlides = existing.filter((entry) => entry.module_id === safeModule);
  const nextSlideNumber = Math.max(1000, ...moduleSlides.map((entry) => entry.source_slide_number)) + 1;
  const additionalIndex = Math.max(0, ...moduleSlides.map((entry) => entry.additional_index)) + 1;
  const insertAfter = Number(insertAfterSlideNumber);
  const now = new Date().toISOString();
  const entry = {
    schema_version: "basisRebuildViewerAdditionalSlide/v1",
    module_id: safeModule,
    source_slide_number: nextSlideNumber,
    additional_slide_id: `additional_${padSlideNumber(additionalIndex)}`,
    additional_index: additionalIndex,
    insert_after_slide_number: Number.isFinite(insertAfter) && insertAfter > 0 ? insertAfter : null,
    title: additionalSlideLabel(additionalIndex),
    created_at: now,
    updated_at: now,
  };

  writeAdditionalSlideStore({
    ...store,
    slides: [...existing, entry],
  });

  return entry;
}

function updateSlideHiddenState(id, hidden) {
  const match = String(id || "").match(/^(.+)::(\d+)$/);
  if (!match) return null;
  const moduleId = cleanModuleId(match[1]);
  const slideNumber = Number(match[2]);
  const store = readViewerCurationStore();
  const key = curationKey(moduleId, slideNumber);
  const current = normalizedSlideCuration(store.slides[key]);
  store.slides[key] = {
    ...current,
    hidden: Boolean(hidden),
    updated_at: new Date().toISOString(),
  };
  writeViewerCurationStore(store);
  return { id: key, moduleId, slideNumber, curation: store.slides[key] };
}

function moveSlideInCuration(id, direction) {
  const match = String(id || "").match(/^(.+)::(\d+)$/);
  if (!match) return null;
  const moduleId = cleanModuleId(match[1]);
  const safeDirection = direction === "down" ? "down" : "up";
  const allSlides = listSlides().slides
    .filter((slide) => slide.moduleId === moduleId && !slide.isHidden)
    .sort((left, right) =>
      (Number(left.sortOrder) || left.slideNumber) - (Number(right.sortOrder) || right.slideNumber) ||
      left.slideNumber - right.slideNumber
    );
  const index = allSlides.findIndex((slide) => slide.id === String(id));
  if (index < 0) return null;
  const targetIndex = safeDirection === "down" ? index + 1 : index - 1;
  if (targetIndex < 0 || targetIndex >= allSlides.length) {
    return { id, moduleId, unchanged: true };
  }

  const reordered = [...allSlides];
  const [moved] = reordered.splice(index, 1);
  reordered.splice(targetIndex, 0, moved);

  const store = readViewerCurationStore();
  const now = new Date().toISOString();
  reordered.forEach((slide, orderIndex) => {
    const key = curationKey(slide.moduleId, slide.slideNumber);
    const current = normalizedSlideCuration(store.slides[key]);
    store.slides[key] = {
      ...current,
      order: orderIndex + 1,
      updated_at: now,
    };
  });
  writeViewerCurationStore(store);
  return { id, moduleId, direction: safeDirection };
}

function applySlideCuration(action, id) {
  if (action === "hide" || action === "delete") return updateSlideHiddenState(id, true);
  if (action === "restore") return updateSlideHiddenState(id, false);
  if (action === "up" || action === "down") return moveSlideInCuration(id, action);
  return null;
}

function collectFiles(directory, extensions, results = []) {
  if (!fs.existsSync(directory)) return results;

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collectFiles(absolutePath, extensions, results);
    } else if (entry.isFile() && extensions.has(path.extname(entry.name).toLowerCase())) {
      results.push(absolutePath);
    }
  }

  return results;
}

function cleanModuleId(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w.-]+/g, "_") || "unassigned";
}

function padSlideNumber(value) {
  return String(value).padStart(3, "0");
}

function extractModuleFromName(fileName) {
  const value = String(fileName);
  const reMatch = value.match(/(?:^|[^A-Za-z0-9])(RE\d+)(?=$|[^A-Za-z0-9])/i) ||
    value.match(/(RE\d+)/i);
  if (!reMatch) return "";

  const testMatch = value.match(/(?:^|[^A-Za-z0-9])Test[_\-\s]*(\d+)(?=$|[^A-Za-z0-9])/i) ||
    value.match(/Test[_\-\s]*(\d+)/i);
  if (testMatch) {
    return `${reMatch[1].toUpperCase()}_TEST_${testMatch[1]}`;
  }

  return reMatch[1].toUpperCase();
}

function extractSlideNumber(fileName) {
  const name = String(fileName);
  const labeled =
    name.match(/(?:slide|folie|seite|page)[_\-\s]*(\d+)/i) ||
    name.match(/\bS[_\-\s]*(\d+)\b/i);
  if (labeled) return Number(labeled[1]);

  const numericParts = [...name.matchAll(/(\d+)/g)].map((match) => Number(match[1]));
  if (!numericParts.length) return null;
  return numericParts[numericParts.length - 1];
}

function inferModuleAndSlide(filePath, root, fallbackIndex = 0) {
  const relativeParts = path.relative(root, filePath).split(path.sep);
  const fileName = path.basename(filePath);
  const folderModule = relativeParts.length > 1 ? extractModuleFromName(relativeParts[0]) || relativeParts[0] : "";
  const nameModule = extractModuleFromName(fileName);
  const moduleId = cleanModuleId(folderModule || nameModule || "unassigned");
  const slideNumber = extractSlideNumber(fileName) || fallbackIndex + 1;
  return { moduleId, slideNumber };
}

function slideKey(moduleId, slideNumber) {
  return `${cleanModuleId(moduleId)}::${Number(slideNumber)}`;
}

function reviewFilePath(moduleId, slideNumber) {
  const safeModule = cleanModuleId(moduleId);
  return path.join(reviewRoot, `${safeModule}_slide_${padSlideNumber(slideNumber)}.json`);
}

function reviewVersionDirectory(moduleId, slideNumber) {
  const safeModule = cleanModuleId(moduleId);
  return path.join(reviewVersionRoot, `${safeModule}_slide_${padSlideNumber(slideNumber)}`);
}

function pendingReviewDirectory(moduleId, slideNumber) {
  const safeModule = cleanModuleId(moduleId);
  return path.join(pendingReviewRoot, `${safeModule}_slide_${padSlideNumber(slideNumber)}`);
}

function timestampParts(value) {
  const date = value instanceof Date ? value : new Date(value || Date.now());
  return {
    date,
    compact: [
      String(date.getFullYear()).padStart(4, "0"),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
      String(date.getHours()).padStart(2, "0"),
      String(date.getMinutes()).padStart(2, "0"),
      String(date.getSeconds()).padStart(2, "0"),
      String(date.getMilliseconds()).padStart(3, "0"),
    ].join(""),
  };
}

function makeVersionId(moduleId, slideNumber, createdAt) {
  const root = reviewVersionDirectory(moduleId, slideNumber);
  const base = `version_${timestampParts(createdAt).compact}`;
  let candidate = base;
  let counter = 2;
  while (fs.existsSync(path.join(root, candidate))) {
    candidate = `${base}_${String(counter).padStart(2, "0")}`;
    counter += 1;
  }
  return candidate;
}

function versionLabel(createdAt) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "Archivierte Version";
  return `Version ${date.toLocaleString("de-DE")}`;
}

function hashText(value) {
  return crypto.createHash("sha256").update(String(value || ""), "utf8").digest("hex");
}

function normalizedReviewStatus(value) {
  return reviewStatuses.has(value) ? value : "open";
}

function normalizedReviewNotes(value) {
  return String(value || "").replace(/\r\n/g, "\n").trim();
}

function normalizedIncludeInPresentation(value) {
  return value !== false;
}

function isUnresolvedReview(status, notes) {
  return Boolean(normalizedReviewNotes(notes)) && unresolvedReviewStatuses.has(normalizedReviewStatus(status));
}

function defaultReview(moduleId, slideNumber) {
  return {
    schema_version: "basisRebuildViewerNote/v2",
    module_id: cleanModuleId(moduleId),
    source_slide_number: Number(slideNumber),
    status: "open",
    notes: "",
    include_in_presentation: true,
    updated_at: null,
  };
}

function readRawReview(moduleId, slideNumber) {
  const filePath = reviewFilePath(moduleId, slideNumber);
  if (!fs.existsSync(filePath)) return {};
  return readJsonFile(filePath);
}

function versionRecordFromMetadata(moduleId, slideNumber, versionRoot, metadata) {
  const svgPath = metadata.svg_path
    ? path.resolve(repoRoot, metadata.svg_path)
    : path.join(versionRoot, `slide_${padSlideNumber(slideNumber)}.svg`);
  if (!isInsideRepo(svgPath) || !fs.existsSync(svgPath) || !fs.statSync(svgPath).isFile()) {
    return null;
  }

  const reviewStatus = normalizedReviewStatus(metadata.review_status);
  return {
    version_id: String(metadata.version_id || path.basename(versionRoot)),
    label: metadata.label || versionLabel(metadata.created_at),
    created_at: metadata.created_at || null,
    review_status: reviewStatus,
    notes: typeof metadata.notes === "string" ? metadata.notes : "",
    source_svg_path: metadata.source_svg_path || "",
    svg_sha256: metadata.svg_sha256 || "",
    proposal: {
      path: toWebPath(svgPath),
      url: fileUrl(svgPath),
      fileName: path.basename(svgPath),
      animation: animationInfoFor(svgPath),
    },
  };
}

function readReviewVersions(moduleId, slideNumber) {
  const root = reviewVersionDirectory(moduleId, slideNumber);
  if (!fs.existsSync(root)) return [];

  const versions = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const versionRoot = path.join(root, entry.name);
    const metadataPath = path.join(versionRoot, "version.json");
    if (!fs.existsSync(metadataPath)) continue;
    try {
      const metadata = readJsonFile(metadataPath);
      const record = versionRecordFromMetadata(moduleId, slideNumber, versionRoot, metadata);
      if (record) versions.push(record);
    } catch {
      // Ignore broken archived metadata; active review files must stay readable.
    }
  }

  return versions.sort((left, right) =>
    naturalCompare(right.created_at || right.version_id, left.created_at || left.version_id)
  );
}

function findVisibleSvgProposal(moduleId, slideNumber) {
  const id = slideKey(moduleId, slideNumber);
  return listSlides().slides.find((slide) => slide.id === id)?.svgProposal || null;
}

function currentSvgSnapshot(moduleId, slideNumber) {
  const proposal = findVisibleSvgProposal(moduleId, slideNumber);
  if (!proposal?.path) return null;

  const sourceSvgPath = path.resolve(repoRoot, proposal.path);
  if (
    !isInsideRepo(sourceSvgPath) ||
    !fs.existsSync(sourceSvgPath) ||
    !fs.statSync(sourceSvgPath).isFile() ||
    path.extname(sourceSvgPath).toLowerCase() !== ".svg"
  ) {
    return null;
  }

  const archivedSvgSource = inlineSvgImages(sourceSvgPath);
  const sourceAnimationPath = animationManifestPathFor(sourceSvgPath);
  return {
    proposal,
    sourceSvgPath,
    sourceAnimationPath: fs.existsSync(sourceAnimationPath) && fs.statSync(sourceAnimationPath).isFile()
      ? sourceAnimationPath
      : "",
    svgFileName: path.basename(sourceSvgPath) || `slide_${padSlideNumber(slideNumber)}.svg`,
    svgSource: archivedSvgSource,
    svgSha256: hashText(archivedSvgSource),
  };
}

function archiveCurrentSvgVersion(moduleId, slideNumber, status, notes) {
  const snapshot = currentSvgSnapshot(moduleId, slideNumber);
  if (!snapshot) return null;

  const normalizedStatus = normalizedReviewStatus(status);
  const normalizedNotes = normalizedReviewNotes(notes);
  const svgSha256 = snapshot.svgSha256;
  const duplicate = readReviewVersions(moduleId, slideNumber).find((version) =>
    version.svg_sha256 === svgSha256 &&
    version.review_status === normalizedStatus &&
    version.notes === normalizedNotes
  );
  if (duplicate) return { ...duplicate, reused: true };

  const createdAt = new Date().toISOString();
  const versionId = makeVersionId(moduleId, slideNumber, createdAt);
  const versionRoot = path.join(reviewVersionDirectory(moduleId, slideNumber), versionId);
  fs.mkdirSync(versionRoot, { recursive: true });

  const svgFileName = snapshot.svgFileName;
  const targetSvgPath = path.join(versionRoot, svgFileName);
  fs.writeFileSync(targetSvgPath, snapshot.svgSource, "utf8");

  let animationPath = "";
  if (snapshot.sourceAnimationPath) {
    const targetAnimationPath = path.join(versionRoot, "scene.animation.v1.json");
    fs.copyFileSync(snapshot.sourceAnimationPath, targetAnimationPath);
    animationPath = toWebPath(targetAnimationPath);
  }

  const metadata = {
    schema_version: "basisRebuildViewerVersion/v1",
    module_id: cleanModuleId(moduleId),
    source_slide_number: Number(slideNumber),
    version_id: versionId,
    label: versionLabel(createdAt),
    created_at: createdAt,
    review_status: normalizedStatus,
    notes: normalizedNotes,
    source_svg_path: snapshot.proposal.path,
    svg_path: toWebPath(targetSvgPath),
    animation_path: animationPath,
    svg_sha256: svgSha256,
  };
  writeJsonFile(path.join(versionRoot, "version.json"), metadata);
  return versionRecordFromMetadata(moduleId, slideNumber, versionRoot, metadata);
}

function readPendingReviewSnapshot(moduleId, slideNumber) {
  const pendingRoot = pendingReviewDirectory(moduleId, slideNumber);
  const metadataPath = path.join(pendingRoot, "pending.json");
  if (!fs.existsSync(metadataPath)) return null;
  try {
    const metadata = readJsonFile(metadataPath);
    const svgPath = metadata.svg_path ? path.resolve(repoRoot, metadata.svg_path) : "";
    if (!svgPath || !isInsideRepo(svgPath) || !fs.existsSync(svgPath)) return null;
    return {
      ...metadata,
      pending_root: pendingRoot,
      svg_absolute_path: svgPath,
      animation_absolute_path: metadata.animation_path
        ? path.resolve(repoRoot, metadata.animation_path)
        : "",
    };
  } catch {
    return null;
  }
}

function writePendingReviewSnapshot(moduleId, slideNumber, status, notes) {
  const normalizedStatus = normalizedReviewStatus(status);
  const normalizedNotes = normalizedReviewNotes(notes);
  if (!isUnresolvedReview(normalizedStatus, normalizedNotes)) return null;

  const pendingRoot = pendingReviewDirectory(moduleId, slideNumber);
  const existing = readPendingReviewSnapshot(moduleId, slideNumber);
  if (existing) {
    const updated = {
      ...existing,
      review_status: normalizedStatus,
      notes: normalizedNotes,
      updated_at: new Date().toISOString(),
    };
    delete updated.pending_root;
    delete updated.svg_absolute_path;
    delete updated.animation_absolute_path;
    writeJsonFile(path.join(pendingRoot, "pending.json"), updated);
    return updated;
  }

  const snapshot = currentSvgSnapshot(moduleId, slideNumber);
  if (!snapshot) return null;

  fs.mkdirSync(pendingRoot, { recursive: true });
  const svgFileName = snapshot.svgFileName;
  const targetSvgPath = path.join(pendingRoot, svgFileName);
  fs.writeFileSync(targetSvgPath, snapshot.svgSource, "utf8");

  let animationPath = "";
  if (snapshot.sourceAnimationPath) {
    const targetAnimationPath = path.join(pendingRoot, "scene.animation.v1.json");
    fs.copyFileSync(snapshot.sourceAnimationPath, targetAnimationPath);
    animationPath = toWebPath(targetAnimationPath);
  }

  const now = new Date().toISOString();
  const metadata = {
    schema_version: "basisRebuildViewerPendingNote/v1",
    module_id: cleanModuleId(moduleId),
    source_slide_number: Number(slideNumber),
    created_at: now,
    updated_at: now,
    review_status: normalizedStatus,
    notes: normalizedNotes,
    source_svg_path: snapshot.proposal.path,
    svg_path: toWebPath(targetSvgPath),
    animation_path: animationPath,
    svg_sha256: snapshot.svgSha256,
  };
  writeJsonFile(path.join(pendingRoot, "pending.json"), metadata);
  return metadata;
}

function clearPendingReviewSnapshot(moduleId, slideNumber) {
  const pendingRoot = pendingReviewDirectory(moduleId, slideNumber);
  if (fs.existsSync(pendingRoot)) {
    fs.rmSync(pendingRoot, { recursive: true, force: true });
  }
}

function promotePendingReviewSnapshot(moduleId, slideNumber, status, notes) {
  const pending = readPendingReviewSnapshot(moduleId, slideNumber);
  if (!pending) return null;

  const normalizedStatus = normalizedReviewStatus(status);
  const normalizedNotes = normalizedReviewNotes(notes || pending.notes);
  const duplicate = readReviewVersions(moduleId, slideNumber).find((version) =>
    version.svg_sha256 === pending.svg_sha256 &&
    version.notes === normalizedNotes
  );
  if (duplicate) {
    clearPendingReviewSnapshot(moduleId, slideNumber);
    return { ...duplicate, reused: true };
  }

  const createdAt = new Date().toISOString();
  const versionId = makeVersionId(moduleId, slideNumber, createdAt);
  const versionRoot = path.join(reviewVersionDirectory(moduleId, slideNumber), versionId);
  fs.mkdirSync(versionRoot, { recursive: true });

  const targetSvgPath = path.join(versionRoot, path.basename(pending.svg_absolute_path));
  fs.copyFileSync(pending.svg_absolute_path, targetSvgPath);

  let animationPath = "";
  if (
    pending.animation_absolute_path &&
    isInsideRepo(pending.animation_absolute_path) &&
    fs.existsSync(pending.animation_absolute_path) &&
    fs.statSync(pending.animation_absolute_path).isFile()
  ) {
    const targetAnimationPath = path.join(versionRoot, "scene.animation.v1.json");
    fs.copyFileSync(pending.animation_absolute_path, targetAnimationPath);
    animationPath = toWebPath(targetAnimationPath);
  }

  const metadata = {
    schema_version: "basisRebuildViewerVersion/v1",
    module_id: cleanModuleId(moduleId),
    source_slide_number: Number(slideNumber),
    version_id: versionId,
    label: `Behoben ${new Date(createdAt).toLocaleString("de-DE")}`,
    created_at: createdAt,
    review_status: normalizedStatus,
    notes: normalizedNotes,
    source_svg_path: pending.source_svg_path || "",
    svg_path: toWebPath(targetSvgPath),
    animation_path: animationPath,
    svg_sha256: pending.svg_sha256 || hashText(fs.readFileSync(targetSvgPath, "utf8")),
    resolved_from_pending_created_at: pending.created_at || null,
  };
  writeJsonFile(path.join(versionRoot, "version.json"), metadata);
  clearPendingReviewSnapshot(moduleId, slideNumber);
  return versionRecordFromMetadata(moduleId, slideNumber, versionRoot, metadata);
}

function readReview(moduleId, slideNumber) {
  const fallback = defaultReview(moduleId, slideNumber);
  const filePath = reviewFilePath(moduleId, slideNumber);
  if (!fs.existsSync(filePath)) {
    return {
      ...fallback,
      versions: readReviewVersions(moduleId, slideNumber),
      pending_before_snapshot: Boolean(readPendingReviewSnapshot(moduleId, slideNumber)),
    };
  }

  try {
    const parsed = readRawReview(moduleId, slideNumber);
    return {
      ...fallback,
      ...parsed,
      schema_version: "basisRebuildViewerNote/v2",
      module_id: fallback.module_id,
      source_slide_number: fallback.source_slide_number,
      status: normalizedReviewStatus(parsed.status),
      notes: typeof parsed.notes === "string" ? parsed.notes : "",
      include_in_presentation: normalizedIncludeInPresentation(parsed.include_in_presentation),
      versions: readReviewVersions(moduleId, slideNumber),
      pending_before_snapshot: Boolean(readPendingReviewSnapshot(moduleId, slideNumber)),
    };
  } catch {
    return {
      ...fallback,
      read_error: "Viewer-Notiz ist kein gueltiges JSON.",
      versions: readReviewVersions(moduleId, slideNumber),
      pending_before_snapshot: Boolean(readPendingReviewSnapshot(moduleId, slideNumber)),
    };
  }
}

function saveReview(id, status, notes) {
  const match = String(id || "").match(/^(.+)::(\d+)$/);
  if (!match) return null;
  const moduleId = cleanModuleId(match[1]);
  const slideNumber = Number(match[2]);
  const normalizedStatus = normalizedReviewStatus(status);
  let normalizedNotes = normalizedReviewNotes(notes);
  const previous = (() => {
    try {
      return readRawReview(moduleId, slideNumber);
    } catch {
      return {};
    }
  })();
  const previousStatus = normalizedReviewStatus(previous.status);
  const previousNotes = normalizedReviewNotes(previous.notes);
  const pendingSnapshot = readPendingReviewSnapshot(moduleId, slideNumber);
  const hadUnresolvedNote =
    isUnresolvedReview(previousStatus, previousNotes) || Boolean(pendingSnapshot?.notes);
  const isSavingUnresolvedNote = isUnresolvedReview(normalizedStatus, normalizedNotes);
  const isResolvingNote =
    hadUnresolvedNote &&
    (!normalizedNotes || !unresolvedReviewStatuses.has(normalizedStatus));

  let archivedVersion = null;
  if (isResolvingNote) {
    const historyNotes = previousNotes || normalizedNotes || pendingSnapshot?.notes || "";
    archivedVersion =
      promotePendingReviewSnapshot(moduleId, slideNumber, normalizedStatus, historyNotes) ||
      (historyNotes ? archiveCurrentSvgVersion(moduleId, slideNumber, normalizedStatus, historyNotes) : null);
    normalizedNotes = "";
  } else if (isSavingUnresolvedNote) {
    writePendingReviewSnapshot(moduleId, slideNumber, normalizedStatus, normalizedNotes);
  } else if (!normalizedNotes) {
    clearPendingReviewSnapshot(moduleId, slideNumber);
  }

  const review = {
    ...defaultReview(moduleId, slideNumber),
    ...previous,
    schema_version: "basisRebuildViewerNote/v2",
    module_id: cleanModuleId(moduleId),
    source_slide_number: Number(slideNumber),
    status: normalizedStatus,
    notes: normalizedNotes,
    include_in_presentation: normalizedIncludeInPresentation(previous.include_in_presentation),
    updated_at: new Date().toISOString(),
  };
  delete review.versions;
  delete review.read_error;
  writeJsonFile(reviewFilePath(moduleId, slideNumber), review);
  return {
    ...review,
    versions: readReviewVersions(moduleId, slideNumber),
    pending_before_snapshot: Boolean(readPendingReviewSnapshot(moduleId, slideNumber)),
    archivedVersion,
  };
}

function savePresentationPreference(id, includeInPresentation) {
  const match = String(id || "").match(/^(.+)::(\d+)$/);
  if (!match) return null;
  const moduleId = cleanModuleId(match[1]);
  const slideNumber = Number(match[2]);
  const previous = (() => {
    try {
      return readRawReview(moduleId, slideNumber);
    } catch {
      return {};
    }
  })();

  const review = {
    ...defaultReview(moduleId, slideNumber),
    ...previous,
    schema_version: "basisRebuildViewerNote/v2",
    module_id: cleanModuleId(moduleId),
    source_slide_number: Number(slideNumber),
    status: normalizedReviewStatus(previous.status),
    notes: typeof previous.notes === "string" ? previous.notes : "",
    include_in_presentation: normalizedIncludeInPresentation(includeInPresentation),
    updated_at: new Date().toISOString(),
  };
  delete review.versions;
  delete review.read_error;
  writeJsonFile(reviewFilePath(moduleId, slideNumber), review);
  return {
    ...review,
    versions: readReviewVersions(moduleId, slideNumber),
    pending_before_snapshot: Boolean(readPendingReviewSnapshot(moduleId, slideNumber)),
  };
}

function collectOldSlides() {
  const files = collectFiles(pngRoot, imageExtensions).sort(naturalCompare);
  const groups = new Map();

  for (const filePath of files) {
    const relativeParts = path.relative(pngRoot, filePath).split(path.sep);
    const rawModule =
      relativeParts.length > 1
        ? extractModuleFromName(relativeParts[0]) || relativeParts[0]
        : extractModuleFromName(path.basename(filePath)) || "unassigned";
    const moduleId = cleanModuleId(rawModule);
    if (!groups.has(moduleId)) groups.set(moduleId, []);
    groups.get(moduleId).push(filePath);
  }

  const results = [];
  for (const [moduleId, moduleFiles] of groups.entries()) {
    moduleFiles.sort(naturalCompare);
    moduleFiles.forEach((filePath, index) => {
      const inferred = inferModuleAndSlide(filePath, pngRoot, index);
      results.push({
        moduleId,
        slideNumber: inferred.slideNumber,
        path: toWebPath(filePath),
        url: fileUrl(filePath),
        fileName: path.basename(filePath),
      });
    });
  }

  return results;
}

function collectSvgProposals() {
  const results = [];
  for (const root of proposalRoots) {
    const files = collectFiles(root, svgExtensions).sort(naturalCompare);
    files.forEach((filePath, index) => {
      const inferred = inferModuleAndSlide(filePath, root, index);
      results.push({
        moduleId: inferred.moduleId,
        slideNumber: inferred.slideNumber,
        path: toWebPath(filePath),
        url: fileUrl(filePath),
        fileName: path.basename(filePath),
        animation: animationInfoFor(filePath),
      });
    });
  }
  return results;
}

function normalizeStringArray(value) {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
    : [];
}

function analysisSummary(slide) {
  return {
    schemaVersion: slide?.schema_version || "",
    seminarId: slide?.seminar_id || "",
    moduleId: slide?.module_id || "",
    slideId: slide?.slide_id || "",
    sourceSlideNumber: Number(slide?.source_slide_number) || null,
    status: slide?.status || "",
    sourceFiles: slide?.source_files || {},
    sourceSlideGroup: slide?.source_slide_group || null,
    narration: slide?.narration || null,
    slideSummary: slide?.slide_summary || null,
    visibleText: Array.isArray(slide?.visible_text) ? slide.visible_text : [],
    visualElements: Array.isArray(slide?.visual_elements) ? slide.visual_elements : [],
    layoutRebuild: slide?.layout_rebuild || null,
    animationPlan: Array.isArray(slide?.animation_plan) ? slide.animation_plan : [],
    generatedAssets: Array.isArray(slide?.generated_assets) ? slide.generated_assets : [],
    qa: slide?.qa || null,
  };
}

function collectAnalysisSlides() {
  const records = [];
  const files = [
    ...collectFiles(slideAnalysisRoot, new Set([".json"])),
    ...collectFiles(moduleAnalysisRoot, new Set([".json"])),
  ].sort(naturalCompare);

  for (const filePath of files) {
    try {
      const parsed = readJsonFile(filePath);
      const slides = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.slides)
          ? parsed.slides
          : parsed?.slide_id
            ? [parsed]
            : [];

      for (const slide of slides) {
        const moduleId = cleanModuleId(slide.module_id || extractModuleFromName(slide.slide_id));
        const slideNumber = Number(slide.source_slide_number) || extractSlideNumber(slide.slide_id);
        if (!moduleId || !slideNumber) continue;
        records.push({
          moduleId,
          slideNumber,
          path: toWebPath(filePath),
          url: fileUrl(filePath),
          summary: analysisSummary(slide),
        });
      }
    } catch (error) {
      records.push({
        moduleId: "analysis_errors",
        slideNumber: records.length + 1,
        path: toWebPath(filePath),
        url: fileUrl(filePath),
        readError: error.message,
      });
    }
  }

  return records;
}

function mergeRecord(map, moduleId, slideNumber) {
  const key = slideKey(moduleId, slideNumber);
  if (!map.has(key)) {
    map.set(key, {
      id: key,
      moduleId: cleanModuleId(moduleId),
      slideNumber: Number(slideNumber),
      slideId: `${cleanModuleId(moduleId)}_${padSlideNumber(slideNumber)}`,
      title: "",
      oldSlide: null,
      svgProposal: null,
      analysis: null,
      review: null,
      isAdditionalSlide: false,
      additionalSlide: null,
      sortOrder: Number(slideNumber),
    });
  }
  return map.get(key);
}

function applyAnimationGroupSvgAliases(map) {
  const records = [...map.values()];
  const groups = new Map();

  for (const record of records) {
    const group = record.analysis?.summary?.sourceSlideGroup;
    const groupId = typeof group?.group_id === "string" ? group.group_id.trim() : "";
    const groupSlides = Array.isArray(group?.source_slide_numbers)
      ? group.source_slide_numbers.map(Number).filter(Boolean)
      : [];

    if (!groupId || !groupSlides.includes(record.slideNumber)) continue;

    const key = `${record.moduleId}::${groupId}`;
    if (!groups.has(key)) {
      groups.set(key, {
        moduleId: record.moduleId,
        groupId,
        slideNumbers: new Set(),
      });
    }

    const entry = groups.get(key);
    groupSlides.forEach((slideNumber) => entry.slideNumbers.add(slideNumber));
  }

  for (const group of groups.values()) {
    const groupRecords = [...group.slideNumbers]
      .map((slideNumber) => map.get(slideKey(group.moduleId, slideNumber)))
      .filter(Boolean)
      .sort((left, right) => left.slideNumber - right.slideNumber);

    const sourceRecord = groupRecords.find((record) => record.svgProposal);
    if (!sourceRecord?.svgProposal) continue;

    for (const record of groupRecords) {
      if (isSvgProposalRemoved(record.moduleId, record.slideNumber)) continue;
      if (record.svgProposal) continue;
      record.svgProposal = {
        ...sourceRecord.svgProposal,
        slideNumber: record.slideNumber,
        aliasForSlideNumber: sourceRecord.slideNumber,
        aliasGroupId: group.groupId,
      };
    }
  }
}

function listSlides() {
  const map = new Map();
  const curationStore = readViewerCurationStore();

  for (const oldSlide of collectOldSlides()) {
    const record = mergeRecord(map, oldSlide.moduleId, oldSlide.slideNumber);
    record.oldSlide = oldSlide;
  }

  for (const proposal of collectSvgProposals()) {
    const record = mergeRecord(map, proposal.moduleId, proposal.slideNumber);
    record.svgProposal = proposal;
  }

  for (const analysis of collectAnalysisSlides()) {
    const record = mergeRecord(map, analysis.moduleId, analysis.slideNumber);
    record.analysis = analysis;
    if (analysis.summary) {
      record.slideId = analysis.summary.slideId || record.slideId;
      record.title = analysis.summary.slideSummary?.title || record.title;
    }
  }

  for (const additional of collectAdditionalSlides()) {
    const record = mergeRecord(map, additional.module_id, additional.source_slide_number);
    record.isAdditionalSlide = true;
    record.additionalSlide = additional;
    record.oldSlide = null;
    record.title = additional.title;
    record.slideId = `${additional.module_id}_ADD_${padSlideNumber(additional.additional_index)}`;
    record.sortOrder = additional.insert_after_slide_number
      ? additional.insert_after_slide_number + (additional.additional_index / 1000)
      : 9000 + additional.additional_index;
  }

  applyAnimationGroupSvgAliases(map);

  for (const record of map.values()) {
    if (isSvgProposalRemoved(record.moduleId, record.slideNumber)) {
      record.svgProposal = null;
    }
    const curation = normalizedSlideCuration(curationStore.slides[curationKey(record.moduleId, record.slideNumber)]);
    record.curation = curation;
    record.isHidden = curation.hidden;
    if (Number.isFinite(Number(curation.order))) {
      record.sortOrder = Number(curation.order);
    }
  }

  const slides = [...map.values()]
    .map((record) => {
      const review = readReview(record.moduleId, record.slideNumber);
      const qa = record.analysis?.summary?.qa || null;
      const completeness = qa?.completeness || "missing";
      const referenceMapping = sourceReferenceMappingFor(
        record.moduleId,
        record.slideNumber,
        record.isAdditionalSlide,
      );
      const sourceReferences = referenceMapping.source_slides.map((sourceSlideNumber) => {
        const sourceRecord = map.get(slideKey(record.moduleId, sourceSlideNumber));
        return {
          sourceSlideNumber,
          slideId: sourceRecord?.slideId || `${record.moduleId}_${padSlideNumber(sourceSlideNumber)}`,
          title: sourceRecord?.title || sourceRecord?.oldSlide?.fileName || `Folie ${padSlideNumber(sourceSlideNumber)}`,
          oldSlide: sourceRecord?.oldSlide || null,
          analysisPath: sourceRecord?.analysis?.path || "",
          hasAnalysis: Boolean(sourceRecord?.analysis?.summary),
        };
      });
      const crosscheckReport = readContentCrosscheck(
        record.moduleId,
        record.slideNumber,
        record.svgProposal,
        referenceMapping,
      );
      return {
        ...record,
        title: record.title || record.oldSlide?.fileName || record.svgProposal?.fileName || record.slideId,
        review,
        crosscheck: {
          referenceMapping,
          references: sourceReferences,
          report: crosscheckReport,
        },
        status: {
          isAdditionalSlide: Boolean(record.isAdditionalSlide),
          isHidden: Boolean(record.isHidden),
          hasOldSlide: Boolean(record.oldSlide),
          hasSvgProposal: Boolean(record.svgProposal),
          hasAnimation: Boolean(record.svgProposal?.animation?.available),
          hasAnalysis: Boolean(record.analysis?.summary),
          analysisError: record.analysis?.readError || "",
          qaCompleteness: completeness,
          reviewStatus: review.status,
          crosscheckStatus: crosscheckReport?.status || "not_run",
        },
      };
    })
    .sort((left, right) =>
      naturalCompare(left.moduleId, right.moduleId) ||
      (Number(left.sortOrder) || left.slideNumber) - (Number(right.sortOrder) || right.slideNumber) ||
      left.slideNumber - right.slideNumber ||
      naturalCompare(left.slideId, right.slideId)
    );

  const modules = [...new Set(slides.map((slide) => slide.moduleId))].sort(naturalCompare);
  return { repoRoot, modules, slides };
}

function runContentCrosscheck(slideId) {
  const slideCollection = listSlides();
  const target = slideCollection.slides.find((slide) => slide.id === String(slideId || ""));
  if (!target) throw createHttpError("Folie wurde nicht gefunden.", 404);

  const referenceMapping = target.crosscheck?.referenceMapping || sourceReferenceMappingFor(
    target.moduleId,
    target.slideNumber,
    target.isAdditionalSlide,
  );
  const sources = referenceMapping.source_slides.map((sourceSlideNumber) => {
    const source = slideCollection.slides.find((slide) =>
      slide.moduleId === target.moduleId && slide.slideNumber === sourceSlideNumber
    );
    return {
      slideNumber: sourceSlideNumber,
      oldSlide: source?.oldSlide || null,
      analysisPath: source?.analysis?.path || "",
      analysis: source?.analysis?.summary || null,
    };
  });

  const proposal = target.svgProposal;
  const svgPath = proposal?.path ? path.resolve(repoRoot, proposal.path) : "";
  let svgSource = "";
  let svgSha256 = "";
  if (
    svgPath &&
    isInsideRepo(svgPath) &&
    fs.existsSync(svgPath) &&
    fs.statSync(svgPath).isFile() &&
    path.extname(svgPath).toLowerCase() === ".svg" &&
    isInsideRepoReal(svgPath)
  ) {
    svgSource = fs.readFileSync(svgPath, "utf8");
    svgSha256 = hashText(svgSource);
  }
  const extractedSvgText = contentCrosscheckDomain.extractSvgText(svgSource);
  const report = contentCrosscheckDomain.buildContentCrosscheck({
    moduleId: target.moduleId,
    outputSlideNumber: target.slideNumber,
    isAdditionalSlide: target.isAdditionalSlide,
    referenceMapping,
    sources,
    proposal: proposal?.path
      ? {
          path: proposal.path,
          svg_sha256: svgSha256,
          animation_manifest: proposal.animation?.url || "",
        }
      : null,
    svgSource,
    svgText: extractedSvgText.text,
    animationStepCount: proposal?.animation?.stepCount || 0,
    reviewNotes: target.review?.notes || "",
  });

  report.reference_mapping_sha256 = hashText(JSON.stringify(referenceMapping));
  report.reference_map_path = referenceMapping.reference_map_path || "";
  report.sequence_plan = referenceMapping.sequence_plan || "";
  const targetPath = crosscheckFilePath(target.moduleId, target.slideNumber);
  writeJsonFileAtomic(targetPath, report);
  return {
    ...report,
    report_path: toWebPath(targetPath),
    is_stale: false,
  };
}

function createHttpError(message, status = 400, details = undefined) {
  const error = new Error(message);
  error.status = status;
  if (details !== undefined) error.details = details;
  return error;
}

function markdownHeadingSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s/g, "-");
}

function markdownSection(source, anchor) {
  const requestedAnchor = String(anchor || "").replace(/^#/, "").trim();
  if (!requestedAnchor) return String(source || "").trim();
  const lines = String(source || "").replace(/\r\n/g, "\n").split("\n");
  let start = -1;
  let level = 0;
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^(#{1,6})\s+(.+?)\s*$/);
    if (!match || markdownHeadingSlug(match[2]) !== requestedAnchor) continue;
    start = index + 1;
    level = match[1].length;
    break;
  }
  if (start < 0) return "";
  let end = lines.length;
  for (let index = start; index < lines.length; index += 1) {
    const match = lines[index].match(/^(#{1,6})\s+/);
    if (match && match[1].length <= level) {
      end = index;
      break;
    }
  }
  return lines.slice(start, end).join("\n").trim();
}

function resolveNarrationText(slide) {
  const narration = slide?.analysis?.summary?.narration;
  if (typeof narration?.text === "string" && narration.text.trim()) {
    return {
      text: narration.text.trim(),
      source: slide.analysis.path || "analysis.narration.text",
      scope: "slide",
    };
  }

  const textReference = typeof narration?.text_ref === "string" ? narration.text_ref.trim() : "";
  if (!textReference) return { text: "", source: "", scope: "missing" };
  const [relativePath, anchor = ""] = textReference.split("#", 2);
  const absolutePath = path.resolve(repoRoot, relativePath);
  if (
    !isInsideRepo(absolutePath) ||
    !fs.existsSync(absolutePath) ||
    !fs.statSync(absolutePath).isFile()
  ) {
    return { text: "", source: textReference, scope: "missing" };
  }

  const source = fs.readFileSync(absolutePath, "utf8").replace(/^\uFEFF/, "");
  return {
    text: markdownSection(source, anchor),
    source: textReference,
    // Die aktuellen Analyse-JSONs verweisen folienübergreifend auf denselben
    // Aufbauabschnitt. Das ist eine Auswahlhilfe, noch kein Produktionsanker.
    scope: anchor ? "shared-section" : "document",
  };
}

function resolveAnimationEditorTarget(slideId) {
  const slide = listSlides().slides.find((item) => item.id === String(slideId || ""));
  if (!slide) throw createHttpError("Folie wurde nicht gefunden.", 404);
  const proposal = slide.svgProposal;
  if (!proposal?.path) throw createHttpError("Für diese Folie gibt es keinen SVG-Vorschlag.", 404);

  const requestedSvgPath = path.resolve(repoRoot, proposal.path);
  if (
    !isInsideRepo(requestedSvgPath) ||
    path.extname(requestedSvgPath).toLowerCase() !== ".svg" ||
    !fs.existsSync(requestedSvgPath) ||
    !fs.statSync(requestedSvgPath).isFile() ||
    !isInsideRepoReal(requestedSvgPath)
  ) {
    throw createHttpError("Der SVG-Vorschlag ist nicht sicher auflösbar.", 400);
  }

  const svgPath = fs.realpathSync(requestedSvgPath);

  const manifestPath = animationManifestPathFor(svgPath);
  const manifestDirectory = path.dirname(manifestPath);
  if (
    !isInsideRepo(manifestPath) ||
    !isInsideRepoReal(manifestDirectory) ||
    path.dirname(manifestPath) !== path.dirname(svgPath) ||
    (fs.existsSync(manifestPath) && !isInsideRepoReal(manifestPath))
  ) {
    throw createHttpError("Der Manifestpfad liegt außerhalb des SVG-Ordners.", 400);
  }
  const relativeSvgPath = path.relative(path.dirname(manifestPath), svgPath).split(path.sep).join("/");
  return { slide, proposal, svgPath, manifestPath, relativeSvgPath };
}

function readAnimationEditorState(slideId) {
  const target = resolveAnimationEditorTarget(slideId);
  const svgSource = fs.readFileSync(target.svgPath, "utf8");
  const inventoryResult = svgAnimationDomain.extractSvgInventory(svgSource);
  let rawManifest = null;
  if (fs.existsSync(target.manifestPath)) {
    try {
      rawManifest = readJsonFile(target.manifestPath);
    } catch {
      throw createHttpError(
        "Das vorhandene Animationsmanifest ist kein gültiges JSON und wird nicht automatisch überschrieben.",
        422,
      );
    }
  }

  const manifest = svgAnimationDomain.syncManifest(
    rawManifest || svgAnimationDomain.defaultManifest(target.relativeSvgPath),
    inventoryResult.inventory,
    target.relativeSvgPath,
  );
  const schemaErrors = svgAnimationDomain.validateManifest(manifest);
  const schemaIssues = schemaErrors.map((error) => ({
    code: "manifest-schema",
    severity: "error",
    message: `${error.path}: ${error.message}`,
  }));
  const narration = resolveNarrationText(target.slide);
  const issues = svgAnimationDomain.collectIssues(
    manifest,
    inventoryResult.inventory,
    narration.text,
    [...inventoryResult.warnings, ...schemaIssues],
  );
  if (narration.scope === "shared-section") {
    issues.push({
      code: "shared-narration-section",
      severity: "info",
      message: "Der Sprechertext gilt derzeit für eine gemeinsame Aufbaufolge und ist nicht folienscharf zugeordnet.",
    });
  }

  const duplicateIdError = inventoryResult.warnings.some(
    (warning) => warning.code === "duplicate-id" && warning.severity === "error",
  );
  const readOnly = target.slide.review?.status === "final";
  return {
    slide: {
      id: target.slide.id,
      moduleId: target.slide.moduleId,
      slideNumber: target.slide.slideNumber,
      slideId: target.slide.slideId,
      title: target.slide.title,
      reviewStatus: target.slide.review?.status || "open",
      aliasForSlideNumber: target.proposal.aliasForSlideNumber || null,
    },
    svg: {
      path: target.proposal.path,
      assetUrl: fileUrl(target.svgPath),
      manifestPath: toWebPath(target.manifestPath),
      manifestExists: fs.existsSync(target.manifestPath),
    },
    manifest,
    inventory: inventoryResult.inventory,
    issues,
    schemaErrors,
    spokenText: narration.text,
    spokenTextSource: narration.source,
    spokenTextScope: narration.scope,
    spokenTextReadOnly: true,
    readOnly,
    readOnlyReason: readOnly ? "Final freigegebene Folien sind schreibgeschützt." : "",
    saveBlocked: schemaErrors.length > 0 || duplicateIdError,
  };
}

function saveAnimationEditorState(slideId, draft) {
  const target = resolveAnimationEditorTarget(slideId);
  if (target.slide.review?.status === "final") {
    throw createHttpError("Final freigegebene Folien sind schreibgeschützt.", 409);
  }
  if (!draft || typeof draft !== "object" || Array.isArray(draft)) {
    throw createHttpError("Animationsmanifest fehlt.", 400);
  }

  const svgSource = fs.readFileSync(target.svgPath, "utf8");
  const inventoryResult = svgAnimationDomain.extractSvgInventory(svgSource);
  const duplicateIds = inventoryResult.warnings.filter(
    (warning) => warning.code === "duplicate-id" && warning.severity === "error",
  );
  if (duplicateIds.length) {
    throw createHttpError("Das SVG enthält doppelte IDs; Speichern wurde abgebrochen.", 400, duplicateIds);
  }

  let manifest = svgAnimationDomain.syncManifest(
    draft,
    inventoryResult.inventory,
    target.relativeSvgPath,
  );
  manifest.steps = manifest.steps.filter((step) =>
    svgAnimationDomain.isEffectivelyRendered(manifest, inventoryResult.inventory, step.targetId),
  );
  const errors = svgAnimationDomain.validateManifest(manifest);
  if (errors.length) {
    throw createHttpError("Das Animationsmanifest ist nicht gültig.", 400, errors);
  }

  writeJsonFileAtomic(target.manifestPath, manifest);
  return readAnimationEditorState(slideId);
}

function contentTypeFor(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
  }[extension] || "application/octet-stream";
}

function send(response, statusCode, body, contentType) {
  response.writeHead(statusCode, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
  });
  response.end(body);
}

function sendJson(response, statusCode, value) {
  send(response, statusCode, JSON.stringify(value), "application/json; charset=utf-8");
}

function inlineSvgImages(svgPath) {
  const imageTypes = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };

  const source = fs.readFileSync(svgPath, "utf8");
  return source.replace(
    /(<image\b[^>]*?\s(?:href|xlink:href)=["'])([^"']+)(["'])/gi,
    (match, prefix, reference, suffix) => {
      if (
        reference.startsWith("data:") ||
        reference.startsWith("http://") ||
        reference.startsWith("https://") ||
        reference.startsWith("#")
      ) {
        return match;
      }

      const cleanReference = reference.split(/[?#]/, 1)[0];
      let decodedReference;
      try {
        decodedReference = decodeURIComponent(cleanReference);
      } catch {
        return match;
      }

      const assetPath = path.resolve(path.dirname(svgPath), decodedReference);
      const mimeType = imageTypes[path.extname(assetPath).toLowerCase()];
      if (
        !mimeType ||
        !isInsideRepo(assetPath) ||
        !fs.existsSync(assetPath) ||
        !fs.statSync(assetPath).isFile() ||
        !isInsideRepoReal(assetPath)
      ) {
        return match;
      }

      const dataUrl = `data:${mimeType};base64,${fs.readFileSync(assetPath).toString("base64")}`;
      return `${prefix}${dataUrl}${suffix}`;
    },
  );
}

function serveFile(response, relativePath) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(relativePath);
  } catch {
    send(response, 400, "Ungueltiger Pfad", "text/plain; charset=utf-8");
    return;
  }

  const requestedPath = path.resolve(repoRoot, decodedPath);
  if (
    !isInsideRepo(requestedPath) ||
    !fs.existsSync(requestedPath) ||
    !fs.statSync(requestedPath).isFile() ||
    !isInsideRepoReal(requestedPath)
  ) {
    send(response, 404, "Datei nicht gefunden", "text/plain; charset=utf-8");
    return;
  }
  const absolutePath = fs.realpathSync(requestedPath);

  if (path.extname(absolutePath).toLowerCase() === ".svg") {
    send(response, 200, inlineSvgImages(absolutePath), "image/svg+xml; charset=utf-8");
    return;
  }

  response.writeHead(200, {
    "Content-Type": contentTypeFor(absolutePath),
    "Cache-Control": "no-store",
  });
  fs.createReadStream(absolutePath).pipe(response);
}

function serveViewerAsset(response, fileName) {
  const assetPath = viewerAssetPaths.get(fileName);
  if (!assetPath || !fs.existsSync(assetPath) || !fs.statSync(assetPath).isFile()) {
    send(response, 404, "Datei nicht gefunden", "text/plain; charset=utf-8");
    return;
  }
  send(response, 200, fs.readFileSync(assetPath), contentTypeFor(assetPath));
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) {
        reject(new Error("Anfrage ist zu gross."));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Ungueltiges JSON."));
      }
    });
    request.on("error", reject);
  });
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, "http://localhost");

  if (request.method === "GET" && requestUrl.pathname === "/") {
    send(response, 200, fs.readFileSync(indexPath), "text/html; charset=utf-8");
    return;
  }

  if (request.method === "GET" && requestUrl.pathname === "/svg-animation-editor") {
    send(response, 200, fs.readFileSync(svgAnimationEditorPath), "text/html; charset=utf-8");
    return;
  }

  if (request.method === "GET" && requestUrl.pathname.startsWith("/viewer-assets/")) {
    serveViewerAsset(response, requestUrl.pathname.slice("/viewer-assets/".length));
    return;
  }

  if (request.method === "GET" && requestUrl.pathname === "/api/slides") {
    sendJson(response, 200, listSlides());
    return;
  }

  if (request.method === "GET" && requestUrl.pathname === "/api/svg-animation-editor") {
    try {
      sendJson(response, 200, { svgAnimation: readAnimationEditorState(requestUrl.searchParams.get("id")) });
    } catch (error) {
      sendJson(response, error.status || 500, {
        error: error.message,
        details: error.details || undefined,
      });
    }
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/svg-animation-manifest") {
    readJsonBody(request)
      .then((body) => {
        const svgAnimation = saveAnimationEditorState(body.id, body.manifest);
        sendJson(response, 200, { ok: true, svgAnimation });
      })
      .catch((error) => sendJson(response, error.status || 400, {
        error: error.message,
        details: error.details || undefined,
      }));
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/review") {
    readJsonBody(request)
      .then((body) => {
        const review = saveReview(body.id, body.status, body.notes);
        if (!review) {
          sendJson(response, 400, { error: "Ungueltige Slide-ID." });
          return;
        }
        const { archivedVersion, ...storedReview } = review;
        sendJson(response, 200, { review: storedReview, archivedVersion });
      })
      .catch((error) => sendJson(response, 400, { error: error.message }));
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/crosscheck") {
    readJsonBody(request)
      .then((body) => {
        const crosscheck = runContentCrosscheck(body.id);
        sendJson(response, 200, { crosscheck });
      })
      .catch((error) => sendJson(response, error.status || 400, {
        error: error.message,
        details: error.details || undefined,
      }));
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/presentation") {
    readJsonBody(request)
      .then((body) => {
        const review = savePresentationPreference(body.id, body.includeInPresentation);
        if (!review) {
          sendJson(response, 400, { error: "Ungueltige Slide-ID." });
          return;
        }
        sendJson(response, 200, { review });
      })
      .catch((error) => sendJson(response, 400, { error: error.message }));
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/additional-slide") {
    readJsonBody(request)
      .then((body) => {
        const additionalSlide = createAdditionalSlide(body.moduleId, body.insertAfterSlideNumber);
        if (!additionalSlide) {
          sendJson(response, 400, { error: "Ungueltiges Modul fuer Zusatzfolie." });
          return;
        }
        sendJson(response, 200, {
          slide: {
            id: slideKey(additionalSlide.module_id, additionalSlide.source_slide_number),
            moduleId: additionalSlide.module_id,
            slideNumber: additionalSlide.source_slide_number,
            slideId: `${additionalSlide.module_id}_ADD_${padSlideNumber(additionalSlide.additional_index)}`,
          },
        });
      })
      .catch((error) => sendJson(response, 400, { error: error.message }));
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/slide-curation") {
    readJsonBody(request)
      .then((body) => {
        const result = applySlideCuration(body.action, body.id);
        if (!result) {
          sendJson(response, 400, { error: "Ungueltige Folien-Aktion." });
          return;
        }
        sendJson(response, 200, { result });
      })
      .catch((error) => sendJson(response, 400, { error: error.message }));
    return;
  }

  if (request.method === "GET" && requestUrl.pathname.startsWith("/files/")) {
    serveFile(response, requestUrl.pathname.slice("/files/".length));
    return;
  }

  send(response, 404, "Nicht gefunden", "text/plain; charset=utf-8");
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${requestedPort} ist bereits belegt.`);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});

if (require.main === module) {
  server.listen(requestedPort, "127.0.0.1", () => {
    const url = `http://127.0.0.1:${requestedPort}`;
    console.log(`Basis-Rebuild-Viewer laeuft unter ${url}`);
    console.log("Beenden mit Strg+C.");

    if (!process.argv.includes("--no-open")) {
      const opener =
        process.platform === "win32"
          ? { command: "cmd", args: ["/c", "start", "", url] }
          : process.platform === "darwin"
            ? { command: "open", args: [url] }
            : { command: "xdg-open", args: [url] };
      const child = spawn(opener.command, opener.args, {
        detached: true,
        stdio: "ignore",
        windowsHide: true,
      });
      child.unref();
    }
  });
}

module.exports = {
  readAnimationEditorState,
  resolveNarrationText,
  runContentCrosscheck,
  saveAnimationEditorState,
  server,
  writeJsonFileAtomic,
};
