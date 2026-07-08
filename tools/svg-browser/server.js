const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const repoRoot = path.resolve(__dirname, "..", "..");
const indexPath = path.join(__dirname, "index.html");
const scenesRoot = path.join(repoRoot, "assets", "scenes");
const binRoot = path.join(repoRoot, "bin", "scenes");
const versionsDirectoryName = "versions";
const storyboardsRoot = path.join(repoRoot, "storyboards");
const storyboardRowsPath = path.join(
  repoRoot,
  "source-materials",
  "storyboard_modul_1_datenlandkarte_current.rows.json",
);
const portArgument = process.argv.slice(2).find((argument) => /^\d+$/.test(argument));
const requestedPort = Number(process.env.SVG_BROWSER_PORT || portArgument || 4173);
const ignoredDirectories = new Set([".git", "node_modules", "bin"]);
const reviewSchemaVersion = "sceneReview/v1";
const animationSchemaVersion = "svgAnimationManifest/v1";
const animationTargetTags = new Set([
  "g",
  "path",
  "rect",
  "circle",
  "ellipse",
  "line",
  "polyline",
  "polygon",
  "image",
  "text",
]);
const nonRenderedSvgContainers = new Set([
  "defs",
  "clippath",
  "mask",
  "marker",
  "pattern",
  "symbol",
]);
const targetStatuses = new Set([
  "needsReview",
  "animated",
  "notAnimated",
  "ignored",
  "orphaned",
]);
const animationActions = new Set(["show", "hide", "highlight", "draw"]);

function toWebPath(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function naturalCompare(left, right) {
  return left.localeCompare(right, "de", {
    numeric: true,
    sensitivity: "base",
  });
}

function readSvgTitle(filePath) {
  try {
    const source = fs.readFileSync(filePath, "utf8");
    const match = source.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/i);
    return match
      ? match[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
      : "";
  } catch {
    return "";
  }
}

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function textValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function sceneNumberFromStoryboardScene(scene) {
  const sceneId = textValue(scene?.scene_id);
  const idMatch = sceneId.match(/(\d+)/);
  if (idMatch) {
    const number = Number(idMatch[1]);
    if (Number.isInteger(number) && number > 0) return number;
  }

  const order = Number(scene?.order);
  return Number.isInteger(order) && order > 0 ? order : null;
}

function shouldReadStoryboardJson(filePath) {
  const fileName = path.basename(filePath).toLowerCase();
  return (
    fileName.endsWith(".json") &&
    fileName !== "storyboard.schema.json" &&
    !fileName.endsWith(".template.json")
  );
}

function collectStoryboardJsonFiles(directory, results = []) {
  if (!fs.existsSync(directory)) return results;

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collectStoryboardJsonFiles(absolutePath, results);
    } else if (entry.isFile() && shouldReadStoryboardJson(absolutePath)) {
      results.push(absolutePath);
    }
  }

  return results;
}

function stringArray(value) {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === "string" && item.trim())
    : [];
}

function storyboardSceneRecord(storyboardPath, storyboard, scene) {
  const sceneNumber = sceneNumberFromStoryboardScene(scene);
  if (!Number.isInteger(sceneNumber)) return null;

  const source = toWebPath(storyboardPath);
  return {
    id: `${source}#${sceneNumber}`,
    source,
    sourceType: "storyboard_json",
    courseId: textValue(storyboard.course_id),
    language: textValue(storyboard.language),
    order: Number.isInteger(Number(scene.order)) ? Number(scene.order) : sceneNumber,
    sceneNumber,
    sceneId: textValue(scene.scene_id),
    title: textValue(scene.title),
    spokenText: textValue(scene?.narration?.text),
    status: textValue(scene.status),
    reviewStatus: textValue(scene.review?.status),
    topicId: textValue(scene.topic_id),
    module: scene.module || null,
    chapter: scene.chapter || null,
    lesson: scene.lesson || null,
    sourceRefs: stringArray(scene.source_refs),
    coreContent: textValue(scene.core_content),
    buildSequence: stringArray(scene.build_sequence),
    visibleText: stringArray(scene.slide?.visible_text),
    visualComposition: textValue(scene.visual?.composition),
    visual: {
      styleNotes: textValue(scene.visual?.style_notes),
      composition: textValue(scene.visual?.composition),
      elements: Array.isArray(scene.visual?.elements) ? scene.visual.elements : [],
      svgPlan: Array.isArray(scene.visual?.svg_plan) ? scene.visual.svg_plan : [],
      generatedAssets: Array.isArray(scene.visual?.generated_assets)
        ? scene.visual.generated_assets
        : [],
      qualityRequirements: stringArray(scene.visual?.quality_requirements),
      assetLinks: Array.isArray(scene.visual?.asset_links) ? scene.visual.asset_links : [],
    },
    animationTriggers: Array.isArray(scene.animation_triggers)
      ? scene.animation_triggers
      : [],
    interactions: Array.isArray(scene.interactions) ? scene.interactions : [],
    designNotes: textValue(scene.design_notes),
    assumptions: stringArray(scene.assumptions),
    openQuestions: stringArray(scene.open_questions),
    reviewNotes: stringArray(scene.review?.notes),
  };
}

function legacyStoryboardSource() {
  if (!fs.existsSync(storyboardRowsPath)) return null;

  try {
    const rows = readJsonFile(storyboardRowsPath);
    if (!Array.isArray(rows)) return null;

    const source = toWebPath(storyboardRowsPath);
    const scenes = rows
      .map((row) => {
        const sceneNumber = Number(row.Reihenfolge);
        if (!Number.isInteger(sceneNumber) || sceneNumber <= 0) return null;
        return {
          id: `${source}#${sceneNumber}`,
          source,
          sourceType: "legacy_rows_json",
          order: sceneNumber,
          sceneNumber,
          sceneId: textValue(row.Scene_ID) || `scene_${String(sceneNumber).padStart(3, "0")}`,
          title: textValue(row.Titel),
          spokenText: textValue(row["Gesprochener Text"]),
          status: textValue(row.Status),
          topicId: textValue(row.Themen_ID),
          module: { id: textValue(row.Modul), title: textValue(row.Modul) },
          chapter: { id: textValue(row.Kapitel), title: textValue(row.Kapitel) },
          lesson: { id: textValue(row.Lektion), title: textValue(row.Lektion) },
          coreContent: textValue(row.Hauptinhalt),
          buildSequence: stringArray(row.Aufbau ? [String(row.Aufbau)] : []),
          visibleText: [],
          visualComposition: textValue(row["Platz fuer Bilder/ Ideen/ Notizen"]) ||
            textValue(row["Platz für Bilder/ Ideen/ Notizen"]),
          visual: {
            styleNotes: "",
            composition: textValue(row["Platz fuer Bilder/ Ideen/ Notizen"]) ||
              textValue(row["Platz für Bilder/ Ideen/ Notizen"]),
            elements: textValue(row["Grafikelemente (Auflistung)"])
              ? [textValue(row["Grafikelemente (Auflistung)"])]
              : [],
            svgPlan: [],
            generatedAssets: [],
            qualityRequirements: [],
            assetLinks: [],
          },
          animationTriggers: [],
          interactions: textValue(row["Interaktionen (z.B. Quiz)"])
            ? [textValue(row["Interaktionen (z.B. Quiz)"])]
            : [],
          designNotes: textValue(row["Platz fuer Bilder/ Ideen/ Notizen"]) ||
            textValue(row["Platz für Bilder/ Ideen/ Notizen"]),
          assumptions: [],
          openQuestions: [],
          reviewNotes: [],
          excelRow: Number.isInteger(row.excel_row) ? row.excel_row : null,
        };
      })
      .filter(Boolean);

    return {
      id: source,
      source,
      sourceType: "legacy_rows_json",
      courseId: "legacy",
      title: "Legacy Storyboard",
      scenes,
    };
  } catch (error) {
    console.error(`Legacy-Storyboard konnte nicht gelesen werden: ${error.message}`);
    return null;
  }
}

function loadStoryboardSources() {
  const sources = [];

  for (const storyboardPath of collectStoryboardJsonFiles(storyboardsRoot).sort(naturalCompare)) {
    try {
      const storyboard = readJsonFile(storyboardPath);
      if (!Array.isArray(storyboard.scenes)) continue;

      const scenes = storyboard.scenes
        .map((scene) => storyboardSceneRecord(storyboardPath, storyboard, scene))
        .filter(Boolean)
        .sort((left, right) => left.order - right.order || left.sceneNumber - right.sceneNumber);

      if (!scenes.length) continue;
      const source = toWebPath(storyboardPath);
      sources.push({
        id: source,
        source,
        sourceType: "storyboard_json",
        courseId: textValue(storyboard.course_id),
        language: textValue(storyboard.language),
        title: textValue(storyboard.course_id) || path.basename(path.dirname(storyboardPath)),
        sceneCount: scenes.length,
        scenes,
      });
    } catch (error) {
      console.error(`Storyboard-JSON konnte nicht gelesen werden: ${error.message}`);
    }
  }

  const legacy = legacyStoryboardSource();
  if (legacy?.scenes?.length) sources.push(legacy);
  return sources;
}

function decodeXmlEntities(value) {
  return String(value || "")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function parseSvgAttributes(markup) {
  const attributes = {};
  const pattern = /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  let match;
  while ((match = pattern.exec(markup))) {
    attributes[match[1].toLowerCase()] = decodeXmlEntities(
      match[2] ?? match[3] ?? "",
    );
  }
  return attributes;
}

function labelFromTargetId(targetId) {
  return String(targetId || "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}

function buildSvgInventory(svgPath) {
  const source = fs.readFileSync(svgPath, "utf8");
  const inventory = [];
  const warnings = [];
  const seenIds = new Set();
  const stack = [];
  const tagPattern = /<\/?([A-Za-z][\w:.-]*)(?:\s[^<>]*?)?\/?>/g;
  let match;

  if (/<script\b/i.test(source)) {
    warnings.push({
      code: "svg-script",
      level: "warning",
      message: "Das SVG enthält ein script-Element. Skripte werden im Editor nicht ausgeführt.",
    });
  }

  while ((match = tagPattern.exec(source))) {
    const markup = match[0];
    const tagName = match[1].split(":").pop().toLowerCase();
    const isClosing = markup.startsWith("</");
    const isSelfClosing = /\/>\s*$/.test(markup);

    if (isClosing) {
      for (let index = stack.length - 1; index >= 0; index -= 1) {
        const item = stack.pop();
        if (item.tagName === tagName) break;
      }
      continue;
    }

    const attributes = parseSvgAttributes(markup);
    const parent = stack[stack.length - 1] || null;
    const excluded =
      Boolean(parent?.excluded) || nonRenderedSvgContainers.has(tagName);
    const targetId =
      !excluded && animationTargetTags.has(tagName) && attributes.id
        ? attributes.id.trim()
        : "";
    const parentTarget = [...stack]
      .reverse()
      .find((item) => item.targetId && !item.excluded);

    if (targetId) {
      if (seenIds.has(targetId)) {
        warnings.push({
          code: "duplicate-id",
          level: "warning",
          targetId,
          message: `Die SVG-ID ${targetId} ist mehrfach vorhanden.`,
        });
      } else {
        seenIds.add(targetId);
      }

      inventory.push({
        targetId,
        tagName,
        label:
          attributes["data-anim-label"] ||
          attributes["data-label"] ||
          attributes["aria-label"] ||
          labelFromTargetId(targetId),
        parentTargetId: parentTarget?.targetId || "",
        isExplicitTarget:
          String(attributes["data-anim-target"] || "").toLowerCase() === "true",
        depth: stack.filter((item) => item.targetId && !item.excluded).length,
      });
    }

    if (!isSelfClosing) {
      stack.push({ tagName, targetId, excluded });
    }
  }

  return { inventory, warnings };
}

function animationManifestPathFor(svgPath) {
  return path.join(path.dirname(svgPath), "scene.animation.v1.json");
}

function defaultAnimationManifest(svgPath) {
  return {
    schemaVersion: animationSchemaVersion,
    svgPath: path.basename(svgPath),
    defaults: {
      enterFrames: 16,
      exitFrames: 16,
      highlightDurFrames: 24,
      drawDurFrames: 32,
    },
    targets: [],
    steps: [],
  };
}

function normalizeAnimationTarget(target) {
  if (!target || typeof target.targetId !== "string" || !target.targetId.trim()) {
    return null;
  }
  const status = targetStatuses.has(target.status)
    ? target.status
    : "needsReview";
  const render = target.render !== false;
  const defaultVisible =
    status === "animated" || status === "needsReview";
  return {
    ...target,
    targetId: target.targetId.trim(),
    label:
      typeof target.label === "string" && target.label.trim()
        ? target.label.trim()
        : labelFromTargetId(target.targetId),
    status,
    render,
    visibleInEditor:
      render &&
      (typeof target.visibleInEditor === "boolean"
        ? target.visibleInEditor
        : defaultVisible),
    confidence: ["low", "medium", "high"].includes(target.confidence)
      ? target.confidence
      : "medium",
  };
}

function normalizeAnimationStep(step, index) {
  if (!step || typeof step.targetId !== "string" || !step.targetId.trim()) {
    return null;
  }
  return {
    ...step,
    stepId:
      typeof step.stepId === "string" && step.stepId.trim()
        ? step.stepId.trim()
        : String(index + 1).padStart(2, "0"),
    targetId: step.targetId.trim(),
    action: animationActions.has(step.action) ? step.action : "show",
    sourceText:
      typeof step.sourceText === "string" ? step.sourceText.trim() : "",
    confidence: ["low", "medium", "high"].includes(step.confidence)
      ? step.confidence
      : "medium",
  };
}

function syncAnimationManifest(svgPath, manifest, inventory) {
  const fallback = defaultAnimationManifest(svgPath);
  const parsed = manifest && typeof manifest === "object" ? manifest : {};
  const inventoryById = new Map(
    inventory.map((item) => [item.targetId, item]),
  );
  const targets = [];
  const targetById = new Map();

  for (const rawTarget of Array.isArray(parsed.targets) ? parsed.targets : []) {
    const target = normalizeAnimationTarget(rawTarget);
    if (!target || targetById.has(target.targetId)) continue;
    if (!inventoryById.has(target.targetId)) {
      target.status = "orphaned";
      target.visibleInEditor = false;
    }
    targets.push(target);
    targetById.set(target.targetId, target);
  }

  const steps = (Array.isArray(parsed.steps) ? parsed.steps : [])
    .map(normalizeAnimationStep)
    .filter(Boolean);

  for (const step of steps) {
    if (targetById.has(step.targetId)) continue;
    const item = inventoryById.get(step.targetId);
    const target = normalizeAnimationTarget({
      targetId: step.targetId,
      label: item?.label || labelFromTargetId(step.targetId),
      status: item ? "animated" : "orphaned",
      visibleInEditor: Boolean(item),
      render: Boolean(item),
      confidence: step.confidence,
    });
    targets.push(target);
    targetById.set(target.targetId, target);
  }

  for (const item of inventory) {
    if (!item.isExplicitTarget || targetById.has(item.targetId)) continue;
    const target = normalizeAnimationTarget({
      targetId: item.targetId,
      label: item.label,
      status: "needsReview",
      visibleInEditor: true,
      render: true,
      confidence: "medium",
    });
    targets.push(target);
    targetById.set(target.targetId, target);
  }

  return {
    ...fallback,
    ...parsed,
    schemaVersion: animationSchemaVersion,
    svgPath:
      typeof parsed.svgPath === "string" && parsed.svgPath.trim()
        ? parsed.svgPath.trim()
        : fallback.svgPath,
    defaults: {
      ...fallback.defaults,
      ...(parsed.defaults && typeof parsed.defaults === "object"
        ? parsed.defaults
        : {}),
    },
    targets,
    steps,
  };
}

function animationEditorWarnings(manifest, inventory, extraWarnings = []) {
  const warnings = [...extraWarnings];
  const inventoryIds = new Set(inventory.map((item) => item.targetId));
  const targets = new Map(
    (manifest.targets || []).map((target) => [target.targetId, target]),
  );

  for (const target of manifest.targets || []) {
    if (!inventoryIds.has(target.targetId)) {
      warnings.push({
        code: "orphaned-target",
        level: "warning",
        targetId: target.targetId,
        message: `Target ${target.targetId} fehlt im SVG.`,
      });
    } else if (target.status === "needsReview") {
      warnings.push({
        code: "needs-review",
        level: "info",
        targetId: target.targetId,
        message: `Target ${target.targetId} ist noch offen.`,
      });
    }
    if (target.confidence === "low") {
      warnings.push({
        code: "low-confidence-target",
        level: "info",
        targetId: target.targetId,
        message: `Target ${target.targetId} hat niedrige Confidence.`,
      });
    }
  }

  for (const step of manifest.steps || []) {
    const target = targets.get(step.targetId);
    if (!target) {
      warnings.push({
        code: "missing-step-target",
        level: "warning",
        stepId: step.stepId,
        message: `Step ${step.stepId} verweist auf ein unbekanntes Target.`,
      });
    } else if (
      ["notAnimated", "ignored", "orphaned"].includes(target.status) ||
      target.render === false
    ) {
      warnings.push({
        code: "inactive-step-target",
        level: "warning",
        stepId: step.stepId,
        targetId: step.targetId,
        message: `Step ${step.stepId} verwendet ein nicht animierbares Target.`,
      });
    }
    if (!step.sourceText) {
      warnings.push({
        code: "missing-source-text",
        level: "warning",
        stepId: step.stepId,
        message: `Step ${step.stepId} hat keinen sourceText.`,
      });
    }
    if (step.confidence === "low") {
      warnings.push({
        code: "low-confidence-step",
        level: "info",
        stepId: step.stepId,
        message: `Step ${step.stepId} hat niedrige Confidence.`,
      });
    }
  }

  return warnings;
}

function readAnimationEditorState(svgPath, info) {
  const { inventory, warnings } = buildSvgInventory(svgPath);
  const manifestPath = animationManifestPathFor(svgPath);
  let parsed = null;
  if (fs.existsSync(manifestPath)) {
    try {
      parsed = readJsonFile(manifestPath);
    } catch {
      warnings.push({
        code: "invalid-manifest",
        level: "warning",
        message: "Das Animationsmanifest ist ungültig.",
      });
    }
  }
  const manifest = syncAnimationManifest(svgPath, parsed, inventory);
  return {
    inventory,
    manifest,
    warnings: animationEditorWarnings(manifest, inventory, warnings),
    readOnly: info.isVersionSnapshot,
    manifestExists: fs.existsSync(manifestPath),
  };
}

function validateManifestPath(svgPath, manifest) {
  if (typeof manifest.svgPath !== "string" || !manifest.svgPath.trim()) {
    return "svgPath fehlt.";
  }
  const relativePath = manifest.svgPath.trim();
  if (path.isAbsolute(relativePath) || relativePath.split(/[\\/]/).includes("..")) {
    return "svgPath muss relativ innerhalb der Szene liegen.";
  }
  const resolvedPath = path.resolve(path.dirname(svgPath), relativePath);
  if (resolvedPath !== path.resolve(svgPath)) {
    return "svgPath muss auf die ausgewählte SVG verweisen.";
  }
  return "";
}

function saveAnimationEditorState(svgPath, info, draft) {
  if (info.isVersionSnapshot) {
    return {
      error: "Archivierte Versionen sind schreibgeschützt.",
      status: 409,
    };
  }
  if (!draft || typeof draft !== "object") {
    return { error: "Animationsmanifest fehlt.", status: 400 };
  }

  const pathError = validateManifestPath(svgPath, draft);
  if (pathError) {
    return { error: pathError, status: 400 };
  }

  const { inventory, warnings } = buildSvgInventory(svgPath);
  const manifest = syncAnimationManifest(svgPath, draft, inventory);
  const targetIds = new Set();
  for (const target of manifest.targets) {
    if (targetIds.has(target.targetId)) {
      return {
        error: `Target ${target.targetId} ist doppelt vorhanden.`,
        status: 400,
      };
    }
    targetIds.add(target.targetId);
    if (target.render === false) {
      target.visibleInEditor = false;
    }
  }

  manifest.steps = manifest.steps.filter((step) => {
    const target = manifest.targets.find(
      (item) => item.targetId === step.targetId,
    );
    return target?.render !== false;
  });

  fs.writeFileSync(
    animationManifestPathFor(svgPath),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );

  return {
    manifest,
    inventory,
    warnings: animationEditorWarnings(manifest, inventory, warnings),
    readOnly: false,
    manifestExists: true,
  };
}

function animationInfoFor(svgPath, info) {
  const manifestPath = path.join(path.dirname(svgPath), "scene.animation.v1.json");
  if (!fs.existsSync(manifestPath)) {
    return {
      available: false,
      url: "",
      stepCount: 0,
    };
  }

  try {
    const manifest = readJsonFile(manifestPath);
    return {
      available: Array.isArray(manifest.steps) && manifest.steps.length > 0,
      url: `/files/${toWebPath(manifestPath)
        .split("/")
        .map(encodeURIComponent)
        .join("/")}`,
      stepCount: Array.isArray(manifest.steps) ? manifest.steps.length : 0,
    };
  } catch {
    return {
      available: false,
      url: "",
      stepCount: 0,
      readError: "Animationsmanifest ist ungültig.",
    };
  }
}

function loadStoryboardIndex() {
  const index = new Map();
  for (const source of loadStoryboardSources()) {
    for (const scene of source.scenes || []) {
      if (!scene.spokenText || index.has(scene.sceneNumber)) continue;
      index.set(scene.sceneNumber, scene);
    }
  }

  return index;
}

function sceneInfo(relativePath) {
  const versionMatch = relativePath.match(
    /^assets\/scenes\/(scene_(\d+)(?:_([a-z0-9_-]+))?)\/versions\/([^/]+)\/scene\.svg$/i,
  );

  if (versionMatch) {
    return {
      isScene: true,
      sceneId: versionMatch[1],
      sceneNumber: Number(versionMatch[2]),
      variant: versionMatch[3] || "original",
      versionId: versionMatch[4],
      isVersionSnapshot: true,
      group: `Szene ${String(Number(versionMatch[2])).padStart(3, "0")}`,
    };
  }

  const match = relativePath.match(
    /^assets\/scenes\/(scene_(\d+)(?:_([a-z0-9_-]+))?)\/composed\/scene\.svg$/i,
  );

  if (!match) {
    return {
      isScene: false,
      sceneId: "",
      sceneNumber: null,
      variant: "",
      versionId: "",
      isVersionSnapshot: false,
      group: "Weitere SVGs",
    };
  }

  return {
    isScene: true,
    sceneId: match[1],
    sceneNumber: Number(match[2]),
    variant: match[3] || "original",
    versionId: "current",
    isVersionSnapshot: false,
    group: `Szene ${String(Number(match[2])).padStart(3, "0")}`,
  };
}

function defaultReviewState(sceneId = "") {
  return {
    schema_version: reviewSchemaVersion,
    scene_id: sceneId,
    final: false,
    finalized_at: null,
    notes: "",
    notes_status: "empty",
    notes_updated_at: null,
    notes_applied_at: null,
    notes_history: [],
  };
}

function normalizeHistoryEntry(entry) {
  if (!entry || typeof entry.note !== "string") {
    return null;
  }

  const note = entry.note.replace(/\r\n/g, "\n").trim();
  if (!note) {
    return null;
  }

  return {
    note,
    noted_at: typeof entry.noted_at === "string" ? entry.noted_at : null,
    applied_at: typeof entry.applied_at === "string" ? entry.applied_at : null,
    version_id: typeof entry.version_id === "string" ? entry.version_id : "",
    version_label: typeof entry.version_label === "string" ? entry.version_label : "",
  };
}

function versionMetadataPathFor(svgPath, info) {
  if (!info.isVersionSnapshot) {
    return "";
  }
  return path.join(path.dirname(svgPath), "version.json");
}

function defaultVersionState(info) {
  return {
    schema_version: "sceneVersion/v1",
    scene_id: info.sceneId,
    version_id: info.versionId,
    label: info.versionId,
    version_label: info.versionId,
    created_at: null,
    source_note: "",
    source_note_noted_at: null,
    source_note_applied_at: null,
  };
}

function readVersionState(svgPath, info) {
  if (!info.isVersionSnapshot) {
    return null;
  }

  const metadataPath = versionMetadataPathFor(svgPath, info);
  const fallback = defaultVersionState(info);
  if (!metadataPath || !fs.existsSync(metadataPath)) {
    return fallback;
  }

  try {
    const parsed = readJsonFile(metadataPath);
    const label =
      typeof parsed.label === "string" && parsed.label.trim()
        ? parsed.label.trim()
        : typeof parsed.version_label === "string" && parsed.version_label.trim()
          ? parsed.version_label.trim()
          : fallback.label;
    return {
      ...fallback,
      ...parsed,
      label,
      version_label: label,
      source_note: typeof parsed.source_note === "string" ? parsed.source_note.trim() : "",
    };
  } catch {
    return {
      ...fallback,
      read_error: "Versionsmetadaten sind ungültig.",
    };
  }
}

function appendHistoryEntry(history, entry) {
  const normalizedEntry = normalizeHistoryEntry(entry);
  if (!normalizedEntry) {
    return history;
  }

  const alreadyPresent = history.some((item) =>
    item.note === normalizedEntry.note &&
    item.noted_at === normalizedEntry.noted_at &&
    item.applied_at === normalizedEntry.applied_at
  );
  if (alreadyPresent) {
    return history;
  }
  return [...history, normalizedEntry];
}

function normalizeReviewState(parsed, fallback) {
  const history = Array.isArray(parsed.notes_history)
    ? parsed.notes_history
        .map(normalizeHistoryEntry)
        .filter(Boolean)
    : [];

  const normalized = {
    ...fallback,
    ...parsed,
    final: parsed.final === true,
    notes: typeof parsed.notes === "string" ? parsed.notes.replace(/\r\n/g, "\n").trim() : "",
    notes_history: history,
  };

  if (normalized.notes_status === "applied" && normalized.notes) {
    normalized.notes_history = appendHistoryEntry(normalized.notes_history, {
      note: normalized.notes,
      noted_at: normalized.notes_updated_at,
      applied_at: normalized.notes_applied_at,
    });
    normalized.notes = "";
    normalized.notes_status = "empty";
    normalized.notes_updated_at = null;
    normalized.notes_applied_at = null;
  }

  if (normalized.notes_status !== "open" || !normalized.notes) {
    normalized.notes = normalized.notes_status === "open" ? normalized.notes : "";
    if (!normalized.notes) {
      normalized.notes_status = "empty";
    }
  }

  return normalized;
}

function reviewPathFor(svgPath, info) {
  if (info.isScene) {
    return path.join(scenesRoot, info.sceneId, "review.json");
  }
  return `${svgPath}.review.json`;
}

function readReviewState(svgPath, info) {
  const reviewPath = reviewPathFor(svgPath, info);
  const fallback = defaultReviewState(info.sceneId);
  if (!fs.existsSync(reviewPath)) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(reviewPath, "utf8"));
    return normalizeReviewState(parsed, fallback);
  } catch {
    return {
      ...fallback,
      read_error: "review.json ist ungültig",
    };
  }
}

function writeReviewState(svgPath, info, review) {
  const reviewPath = reviewPathFor(svgPath, info);
  const normalized = normalizeReviewState(review, defaultReviewState(info.sceneId));
  fs.mkdirSync(path.dirname(reviewPath), { recursive: true });
  fs.writeFileSync(
    reviewPath,
    `${JSON.stringify(normalized, null, 2)}\n`,
    "utf8",
  );
}

function collectSvgFiles(directory, storyboardIndex, results = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }

    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collectSvgFiles(absolutePath, storyboardIndex, results);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".svg")) {
      const relativePath = toWebPath(absolutePath);
      const info = sceneInfo(relativePath);
      const review = readReviewState(absolutePath, info);
      const version = readVersionState(absolutePath, info);
      const storyboard = info.isScene
        ? storyboardIndex.get(info.sceneNumber) || null
        : null;
      const animation = animationInfoFor(absolutePath, info);
      results.push({
        id: relativePath,
        path: relativePath,
        url: `/files/${relativePath
          .split("/")
          .map(encodeURIComponent)
          .join("/")}`,
        fileName: entry.name,
        title: readSvgTitle(absolutePath),
        review,
        version,
        animation,
        canTrash: info.isScene && !info.isVersionSnapshot,
        storyboard,
        ...info,
      });
    }
  }
  return results;
}

function listSvgs() {
  const storyboardIndex = loadStoryboardIndex();
  return collectSvgFiles(repoRoot, storyboardIndex).sort((left, right) => {
    if (left.isScene !== right.isScene) {
      return left.isScene ? -1 : 1;
    }
    if (left.sceneNumber !== right.sceneNumber) {
      return (left.sceneNumber ?? Number.MAX_SAFE_INTEGER) -
        (right.sceneNumber ?? Number.MAX_SAFE_INTEGER);
    }
    if (left.sceneId !== right.sceneId) {
      return naturalCompare(left.sceneId || left.path, right.sceneId || right.path);
    }
    if (left.isVersionSnapshot !== right.isVersionSnapshot) {
      return left.isVersionSnapshot ? 1 : -1;
    }
    if (left.isVersionSnapshot && right.isVersionSnapshot) {
      const leftTime = left.version?.created_at || "";
      const rightTime = right.version?.created_at || "";
      if (leftTime !== rightTime) {
        return rightTime.localeCompare(leftTime, "de");
      }
    }
    if (left.variant !== right.variant) {
      if (left.variant === "original") return -1;
      if (right.variant === "original") return 1;
      return naturalCompare(left.variant, right.variant);
    }
    return naturalCompare(left.path, right.path);
  });
}

function findSvgById(id) {
  return listSvgs().find((svg) => svg.id === id) || null;
}

function send(response, statusCode, body, contentType) {
  response.writeHead(statusCode, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
  });
  response.end(body);
}

function sendJson(response, statusCode, value) {
  send(
    response,
    statusCode,
    JSON.stringify(value),
    "application/json; charset=utf-8",
  );
}

function readJsonBody(request, response) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("Anfrage ist zu groß."));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Ungültiges JSON."));
      }
    });
    request.on("error", reject);
  }).catch((error) => {
    sendJson(response, 400, { error: error.message });
    return null;
  });
}

function resolveSvgRecord(id) {
  if (typeof id !== "string") {
    return null;
  }
  const record = findSvgById(id);
  if (!record) {
    return null;
  }
  const absolutePath = path.resolve(repoRoot, record.path);
  if (!isInsideRepo(absolutePath) || !fs.existsSync(absolutePath)) {
    return null;
  }
  return { record, absolutePath };
}

function updateNotes(svgPath, info, current, notes) {
  if (current.final) {
    return { error: "Finalisierte SVGs sind für Änderungen gesperrt.", status: 409 };
  }

  const normalizedNotes = String(notes ?? "").replace(/\r\n/g, "\n").trim();
  const now = new Date().toISOString();
  const next = {
    ...current,
    schema_version: reviewSchemaVersion,
    scene_id: info.sceneId,
    notes: normalizedNotes,
    notes_status: normalizedNotes ? "open" : "empty",
    notes_updated_at: normalizedNotes ? now : null,
    notes_applied_at: null,
  };
  delete next.read_error;
  writeReviewState(svgPath, info, next);
  return { review: next };
}

function updateFinal(svgPath, info, current, final) {
  const nextFinal = final === true;
  if (nextFinal && current.notes_status === "open" && current.notes.trim()) {
    return {
      error: "Offene Änderungsnotizen müssen zuerst umgesetzt oder gelöscht werden.",
      status: 409,
    };
  }

  const next = {
    ...current,
    schema_version: reviewSchemaVersion,
    scene_id: info.sceneId,
    final: nextFinal,
    finalized_at: nextFinal ? new Date().toISOString() : null,
  };
  delete next.read_error;
  writeReviewState(svgPath, info, next);
  return { review: next };
}

function trashScene(record, svgPath) {
  if (!record.isScene) {
    return { error: "Nur vollständige Szenenordner können verschoben werden.", status: 400 };
  }
  if (record.review.final) {
    return { error: "Finalisierte Szenen müssen zuerst wieder geöffnet werden.", status: 409 };
  }

  const sceneDirectory = path.resolve(scenesRoot, record.sceneId);
  const expectedSvg = path.join(sceneDirectory, "composed", "scene.svg");
  const relativeScenePath = path.relative(scenesRoot, sceneDirectory);
  if (
    relativeScenePath.startsWith("..") ||
    path.isAbsolute(relativeScenePath) ||
    sceneDirectory === scenesRoot ||
    path.resolve(svgPath) !== path.resolve(expectedSvg) ||
    !fs.existsSync(sceneDirectory)
  ) {
    return { error: "Der Szenenordner konnte nicht sicher bestimmt werden.", status: 400 };
  }

  fs.mkdirSync(binRoot, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  let destination = path.join(binRoot, `${timestamp}__${record.sceneId}`);
  let suffix = 2;
  while (fs.existsSync(destination)) {
    destination = path.join(binRoot, `${timestamp}__${record.sceneId}__${suffix}`);
    suffix += 1;
  }

  fs.renameSync(sceneDirectory, destination);
  fs.writeFileSync(
    path.join(destination, "bin-entry.json"),
    `${JSON.stringify(
      {
        schema_version: "sceneBinEntry/v1",
        scene_id: record.sceneId,
        original_path: toWebPath(sceneDirectory),
        moved_to_bin_at: new Date().toISOString(),
        bin_path: toWebPath(destination),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  return {
    moved: true,
    scene_id: record.sceneId,
    bin_path: toWebPath(destination),
    original_path: toWebPath(sceneDirectory),
  };
}

function readBinEntry(binPath) {
  const entryPath = path.join(binPath, "bin-entry.json");
  if (!fs.existsSync(entryPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(entryPath, "utf8"));
  } catch {
    return null;
  }
}

function restoreSceneFromBin(binPath) {
  const absoluteBinPath = path.resolve(repoRoot, binPath);
  const relativeBinPath = path.relative(binRoot, absoluteBinPath);
  if (
    relativeBinPath.startsWith("..") ||
    path.isAbsolute(relativeBinPath) ||
    !fs.existsSync(absoluteBinPath)
  ) {
    return { error: "Papierkorb-Eintrag wurde nicht gefunden.", status: 404 };
  }

  const binEntry = readBinEntry(absoluteBinPath);
  if (!binEntry?.original_path || !binEntry.scene_id) {
    return { error: "Papierkorb-Eintrag ist unvollstÃ¤ndig.", status: 400 };
  }

  const destination = path.resolve(repoRoot, binEntry.original_path);
  const relativeDestination = path.relative(scenesRoot, destination);
  if (
    relativeDestination.startsWith("..") ||
    path.isAbsolute(relativeDestination) ||
    fs.existsSync(destination)
  ) {
    return { error: "Die Szene kann nicht wiederhergestellt werden.", status: 409 };
  }

  fs.renameSync(absoluteBinPath, destination);
  return {
    restored: true,
    scene_id: binEntry.scene_id,
    restored_path: toWebPath(destination),
  };
}

function isInsideRepo(absolutePath) {
  const relativePath = path.relative(repoRoot, absolutePath);
  return !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
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
        !fs.statSync(assetPath).isFile()
      ) {
        return match;
      }

      const dataUrl = `data:${mimeType};base64,${fs
        .readFileSync(assetPath)
        .toString("base64")}`;
      return `${prefix}${dataUrl}${suffix}`;
    },
  );
}

function serveFile(response, relativePath) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(relativePath);
  } catch {
    send(response, 400, "Ungültiger Pfad", "text/plain; charset=utf-8");
    return;
  }

  const absolutePath = path.resolve(repoRoot, decodedPath);
  const relativeCheck = path.relative(repoRoot, absolutePath);
  if (
    relativeCheck.startsWith("..") ||
    path.isAbsolute(relativeCheck) ||
    !fs.existsSync(absolutePath) ||
    !fs.statSync(absolutePath).isFile()
  ) {
    send(response, 404, "Datei nicht gefunden", "text/plain; charset=utf-8");
    return;
  }

  const extension = path.extname(absolutePath).toLowerCase();
  const contentTypes = {
    ".svg": "image/svg+xml; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
  };
  const contentType = contentTypes[extension] || "application/octet-stream";

  if (extension === ".svg") {
    send(
      response,
      200,
      inlineSvgImages(absolutePath),
      "image/svg+xml; charset=utf-8",
    );
    return;
  }

  response.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
  });
  fs.createReadStream(absolutePath).pipe(response);
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, "http://localhost");

  if (requestUrl.pathname === "/") {
    send(
      response,
      200,
      fs.readFileSync(indexPath),
      "text/html; charset=utf-8",
    );
    return;
  }

  if (requestUrl.pathname === "/api/svgs") {
    send(
      response,
      200,
      JSON.stringify({ repoRoot, svgs: listSvgs() }),
      "application/json; charset=utf-8",
    );
    return;
  }

  if (requestUrl.pathname === "/api/storyboards") {
    sendJson(response, 200, {
      repoRoot,
      storyboards: loadStoryboardSources(),
    });
    return;
  }

  if (request.method === "GET" && requestUrl.pathname === "/api/animation-editor") {
    const resolved = resolveSvgRecord(requestUrl.searchParams.get("id"));
    if (!resolved) {
      sendJson(response, 404, { error: "SVG nicht gefunden." });
      return;
    }
    const info = sceneInfo(resolved.record.path);
    try {
      sendJson(response, 200, {
        id: resolved.record.id,
        ...readAnimationEditorState(resolved.absolutePath, info),
      });
    } catch (error) {
      sendJson(response, 500, {
        error: `Animationseditor konnte nicht geladen werden: ${error.message}`,
      });
    }
    return;
  }

  if (
    request.method === "POST" &&
    requestUrl.pathname === "/api/animation-editor/save"
  ) {
    readJsonBody(request, response).then((body) => {
      if (!body) return;
      const resolved = resolveSvgRecord(body.id);
      if (!resolved) {
        sendJson(response, 404, { error: "SVG nicht gefunden." });
        return;
      }
      if (resolved.record.review?.final === true) {
        sendJson(response, 409, {
          error: "Finalisierte SVGs sind für Änderungen gesperrt.",
        });
        return;
      }
      const info = sceneInfo(resolved.record.path);
      const result = saveAnimationEditorState(
        resolved.absolutePath,
        info,
        body.manifest,
      );
      sendJson(response, result.status || 200, result);
    });
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/review/notes") {
    readJsonBody(request, response).then((body) => {
      if (!body) return;
      const resolved = resolveSvgRecord(body.id);
      if (!resolved) {
        sendJson(response, 404, { error: "SVG nicht gefunden." });
        return;
      }
      const info = sceneInfo(resolved.record.path);
      const current = readReviewState(resolved.absolutePath, info);
      const result = updateNotes(
        resolved.absolutePath,
        info,
        current,
        body.notes,
      );
      sendJson(response, result.status || 200, result);
    });
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/review/final") {
    readJsonBody(request, response).then((body) => {
      if (!body) return;
      const resolved = resolveSvgRecord(body.id);
      if (!resolved) {
        sendJson(response, 404, { error: "SVG nicht gefunden." });
        return;
      }
      const info = sceneInfo(resolved.record.path);
      const current = readReviewState(resolved.absolutePath, info);
      const result = updateFinal(
        resolved.absolutePath,
        info,
        current,
        body.final,
      );
      sendJson(response, result.status || 200, result);
    });
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/trash") {
    readJsonBody(request, response).then((body) => {
      if (!body) return;
      const resolved = resolveSvgRecord(body.id);
      if (!resolved) {
        sendJson(response, 404, { error: "SVG nicht gefunden." });
        return;
      }
      if (body.confirmSceneId !== resolved.record.sceneId) {
        sendJson(response, 400, {
          error: "Die Bestätigung stimmt nicht mit der Scene-ID überein.",
        });
        return;
      }
      const result = trashScene(resolved.record, resolved.absolutePath);
      sendJson(response, result.status || 200, result);
    });
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/trash/undo") {
    readJsonBody(request, response).then((body) => {
      if (!body || typeof body.binPath !== "string") {
        sendJson(response, 400, { error: "Papierkorb-Pfad fehlt." });
        return;
      }
      const result = restoreSceneFromBin(body.binPath);
      sendJson(response, result.status || 200, result);
    });
    return;
  }

  if (requestUrl.pathname.startsWith("/files/")) {
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

server.listen(requestedPort, "127.0.0.1", () => {
  const url = `http://127.0.0.1:${requestedPort}`;
  console.log(`SVG-Browser läuft unter ${url}`);
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
