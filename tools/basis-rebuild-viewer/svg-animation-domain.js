(function exposeSvgAnimationDomain(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.SvgAnimationDomain = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createSvgAnimationDomain() {
  "use strict";

  const SCHEMA_VERSION = "svgAnimationManifest/v1";
  const TARGET_TAGS = new Set([
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
  const DRAWABLE_TAGS = new Set([
    "path",
    "rect",
    "circle",
    "ellipse",
    "line",
    "polyline",
    "polygon",
  ]);
  const EXCLUDED_CONTAINERS = new Set([
    "defs",
    "title",
    "desc",
    "metadata",
    "filter",
    "clippath",
    "mask",
    "pattern",
    "marker",
    "lineargradient",
    "radialgradient",
    "symbol",
    "style",
    "script",
    "foreignobject",
  ]);
  const TARGET_STATUSES = new Set([
    "animated",
    "notAnimated",
    "ignored",
    "needsReview",
    "orphaned",
  ]);
  const CONFIDENCE_VALUES = new Set(["high", "medium", "low"]);
  const ACTIONS = new Set(["show", "hide", "highlight", "draw", "transform"]);
  const DRAW_DIRECTIONS = new Set([
    "leftToRight",
    "rightToLeft",
    "topToBottom",
    "bottomToTop",
  ]);

  const ROOT_FIELDS = new Set([
    "schemaVersion",
    "svgPath",
    "defaults",
    "targets",
    "steps",
    // Bestehende Repo-Manifeste verwenden diese drei Felder. Sie werden bis
    // zu einer expliziten Migration verlustfrei erhalten.
    "sceneId",
    "status",
    "notes",
  ]);
  const DEFAULT_FIELDS = new Set([
    "enterFrames",
    "exitFrames",
    "highlightDurFrames",
    "drawDurFrames",
    "transformDurFrames",
    // Bestehende Repo-Erweiterungen.
    "drawFrames",
    "pauseMs",
    "stepDelayMs",
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
    // Bestehende Repo-Erweiterungen.
    "trigger",
    "afterInternalPlotDelayMs",
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

  function clone(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  function decodeXmlEntities(value) {
    return String(value || "")
      .replace(/&quot;/g, '"')
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
      attributes[match[1].toLowerCase()] = decodeXmlEntities(match[2] ?? match[3] ?? "");
    }
    return attributes;
  }

  function labelFromTargetId(targetId) {
    return String(targetId || "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .replace(/(^|\s)(\p{L})/gu, (match) => match.toUpperCase())
      .trim();
  }

  function isExplicitTargetValue(attributes) {
    if (!Object.prototype.hasOwnProperty.call(attributes, "data-anim-target")) return false;
    const value = String(attributes["data-anim-target"] || "").trim().toLowerCase();
    return !["", "0", "false", "no"].includes(value);
  }

  function extractSvgInventory(svgSource) {
    const source = String(svgSource || "");
    const inventory = [];
    const warnings = [];
    const seenIds = new Set();
    const stack = [];
    const tagPattern = /<\s*(\/?)\s*([A-Za-z][\w:.-]*)([^<>]*?)\s*(\/?)>/g;
    let match;

    if (/<\s*script\b/i.test(source)) {
      warnings.push({
        code: "svg-script",
        severity: "warning",
        message: "Das SVG enthält ein script-Element. Aktive Inhalte werden in der Vorschau entfernt.",
      });
    }
    if (/<\s*foreignObject\b/i.test(source)) {
      warnings.push({
        code: "svg-foreign-object",
        severity: "warning",
        message: "Das SVG enthält foreignObject. Der Inhalt wird in der Vorschau entfernt.",
      });
    }

    while ((match = tagPattern.exec(source))) {
      const isClosing = Boolean(match[1]);
      const qualifiedName = match[2];
      const tagName = qualifiedName.split(":").pop().toLowerCase();
      const isSelfClosing = Boolean(match[4]);

      if (isClosing) {
        for (let index = stack.length - 1; index >= 0; index -= 1) {
          const item = stack.pop();
          if (item.tagName === tagName) break;
        }
        continue;
      }

      const attributes = parseSvgAttributes(match[0]);
      const parent = stack[stack.length - 1] || null;
      const excluded = Boolean(parent?.excluded) || EXCLUDED_CONTAINERS.has(tagName);
      const rawId = typeof attributes.id === "string" ? attributes.id.trim() : "";
      const targetId = !excluded && TARGET_TAGS.has(tagName) ? rawId : "";
      const parentTarget = [...stack].reverse().find((item) => item.targetId && !item.excluded);

      if (targetId) {
        if (seenIds.has(targetId)) {
          warnings.push({
            code: "duplicate-id",
            severity: "error",
            targetId,
            message: `Die SVG-ID ${targetId} ist mehrfach vorhanden.`,
          });
        } else {
          seenIds.add(targetId);
          inventory.push({
            targetId,
            tagName,
            label:
              attributes["data-anim-label"] ||
              attributes["data-label"] ||
              attributes["aria-label"] ||
              labelFromTargetId(targetId),
            parentTargetId: parentTarget?.targetId || undefined,
            isExplicitTarget: isExplicitTargetValue(attributes),
          });
        }
      }

      if (!isSelfClosing) stack.push({ tagName, targetId, excluded });
    }

    return { inventory, warnings };
  }

  function defaultManifest(svgPath) {
    return {
      schemaVersion: SCHEMA_VERSION,
      svgPath: String(svgPath || "").trim(),
      defaults: {
        enterFrames: 16,
        exitFrames: 16,
        highlightDurFrames: 24,
        drawDurFrames: 36,
        transformDurFrames: 30,
      },
      targets: [],
      steps: [],
    };
  }

  function normalizeDirection(direction) {
    return {
      "left-to-right": "leftToRight",
      "right-to-left": "rightToLeft",
      "top-to-bottom": "topToBottom",
      "bottom-to-top": "bottomToTop",
    }[direction] || direction;
  }

  function normalizeTarget(rawTarget) {
    if (!isPlainObject(rawTarget)) return rawTarget;
    const target = { ...rawTarget };
    if (typeof target.targetId === "string") target.targetId = target.targetId.trim();
    if (typeof target.label === "string") target.label = target.label.trim();
    if (typeof target.ignoreReason === "string") target.ignoreReason = target.ignoreReason.trim();
    if (!target.status) target.status = "needsReview";
    if (target.status === "static_context") target.status = "notAnimated";
    if (target.render === false) target.visibleInEditor = false;
    return target;
  }

  function normalizeStep(rawStep) {
    if (!isPlainObject(rawStep)) return rawStep;
    const step = { ...rawStep };
    for (const field of ["stepId", "targetId", "sourceText", "notes", "trigger"]) {
      if (typeof step[field] === "string") step[field] = step[field].trim();
    }
    if (step.action === "draw" && step.direction) step.direction = normalizeDirection(step.direction);
    if (step.action === "transform") {
      if (step.fromTranslateX == null) step.fromTranslateX = 0;
      if (step.fromTranslateY == null) step.fromTranslateY = 0;
      if (step.fromScale == null) step.fromScale = 1;
      if (step.translateX == null) step.translateX = 0;
      if (step.translateY == null) step.translateY = 0;
      if (step.scale == null) step.scale = 1;
      if (!step.transformOrigin) step.transformOrigin = "center";
    }
    return step;
  }

  function normalizeManifest(rawManifest, svgPath) {
    const fallback = defaultManifest(svgPath);
    const parsed = isPlainObject(rawManifest) ? clone(rawManifest) : {};
    return {
      ...fallback,
      ...parsed,
      schemaVersion: SCHEMA_VERSION,
      svgPath:
        typeof svgPath === "string" && svgPath.trim()
          ? svgPath.trim()
          : typeof parsed.svgPath === "string"
            ? parsed.svgPath.trim()
            : fallback.svgPath,
      defaults: {
        ...fallback.defaults,
        ...(isPlainObject(parsed.defaults) ? parsed.defaults : {}),
      },
      targets: Array.isArray(parsed.targets) ? parsed.targets.map(normalizeTarget) : [],
      steps: Array.isArray(parsed.steps) ? parsed.steps.map(normalizeStep) : [],
    };
  }

  function unknownFields(value, allowedFields, path, errors) {
    if (!isPlainObject(value)) return;
    for (const field of Object.keys(value)) {
      if (!allowedFields.has(field)) {
        errors.push({ path: `${path}.${field}`, message: `Unbekanntes Feld ${field}.` });
      }
    }
  }

  function requireNonEmptyString(value, path, errors) {
    if (typeof value !== "string" || !value.trim()) {
      errors.push({ path, message: "Nicht leerer Text erwartet." });
      return false;
    }
    return true;
  }

  function optionalString(value, path, errors) {
    if (value != null && typeof value !== "string") {
      errors.push({ path, message: "Text erwartet." });
    }
  }

  function positiveInteger(value, path, errors, optional = true) {
    if (value == null && optional) return;
    if (!Number.isInteger(value) || value <= 0) {
      errors.push({ path, message: "Positive Ganzzahl erwartet." });
    }
  }

  function finiteNumber(value, path, errors, optional = true) {
    if (value == null && optional) return;
    if (typeof value !== "number" || !Number.isFinite(value)) {
      errors.push({ path, message: "Endliche Zahl erwartet." });
    }
  }

  function validateManifest(rawManifest) {
    const errors = [];
    if (!isPlainObject(rawManifest)) {
      return [{ path: "$", message: "Manifestobjekt erwartet." }];
    }
    unknownFields(rawManifest, ROOT_FIELDS, "$", errors);
    if (rawManifest.schemaVersion !== SCHEMA_VERSION) {
      errors.push({ path: "$.schemaVersion", message: `Erwartet wird ${SCHEMA_VERSION}.` });
    }
    requireNonEmptyString(rawManifest.svgPath, "$.svgPath", errors);

    if (!isPlainObject(rawManifest.defaults)) {
      errors.push({ path: "$.defaults", message: "Defaults-Objekt erwartet." });
    } else {
      unknownFields(rawManifest.defaults, DEFAULT_FIELDS, "$.defaults", errors);
      for (const field of DEFAULT_FIELDS) {
        if (rawManifest.defaults[field] != null) {
          positiveInteger(rawManifest.defaults[field], `$.defaults.${field}`, errors);
        }
      }
    }

    if (!Array.isArray(rawManifest.targets)) {
      errors.push({ path: "$.targets", message: "Targetliste erwartet." });
    } else {
      const ids = new Set();
      rawManifest.targets.forEach((target, index) => {
        const targetPath = `$.targets[${index}]`;
        if (!isPlainObject(target)) {
          errors.push({ path: targetPath, message: "Targetobjekt erwartet." });
          return;
        }
        unknownFields(target, TARGET_FIELDS, targetPath, errors);
        if (requireNonEmptyString(target.targetId, `${targetPath}.targetId`, errors)) {
          if (ids.has(target.targetId)) {
            errors.push({ path: `${targetPath}.targetId`, message: `Target ${target.targetId} ist doppelt.` });
          }
          ids.add(target.targetId);
        }
        if (!TARGET_STATUSES.has(target.status)) {
          errors.push({ path: `${targetPath}.status`, message: "Unbekannter Targetstatus." });
        }
        optionalString(target.label, `${targetPath}.label`, errors);
        optionalString(target.ignoreReason, `${targetPath}.ignoreReason`, errors);
        if (target.visibleInEditor != null && typeof target.visibleInEditor !== "boolean") {
          errors.push({ path: `${targetPath}.visibleInEditor`, message: "Boolean erwartet." });
        }
        if (target.render != null && typeof target.render !== "boolean") {
          errors.push({ path: `${targetPath}.render`, message: "Boolean erwartet." });
        }
        if (target.confidence != null && !CONFIDENCE_VALUES.has(target.confidence)) {
          errors.push({ path: `${targetPath}.confidence`, message: "Unbekannter Confidencewert." });
        }
      });
    }

    if (!Array.isArray(rawManifest.steps)) {
      errors.push({ path: "$.steps", message: "Stepliste erwartet." });
    } else {
      rawManifest.steps.forEach((step, index) => {
        const stepPath = `$.steps[${index}]`;
        if (!isPlainObject(step)) {
          errors.push({ path: stepPath, message: "Stepobjekt erwartet." });
          return;
        }
        const allowedFields = new Set([
          ...STEP_BASE_FIELDS,
          ...(ACTION_FIELDS[step.action] || []),
        ]);
        unknownFields(step, allowedFields, stepPath, errors);
        requireNonEmptyString(step.targetId, `${stepPath}.targetId`, errors);
        if (!ACTIONS.has(step.action)) {
          errors.push({ path: `${stepPath}.action`, message: "Unbekannte Aktion." });
        }
        optionalString(step.stepId, `${stepPath}.stepId`, errors);
        optionalString(step.sourceText, `${stepPath}.sourceText`, errors);
        optionalString(step.notes, `${stepPath}.notes`, errors);
        optionalString(step.trigger, `${stepPath}.trigger`, errors);
        if (step.confidence != null && !CONFIDENCE_VALUES.has(step.confidence)) {
          errors.push({ path: `${stepPath}.confidence`, message: "Unbekannter Confidencewert." });
        }
        positiveInteger(step.occurrence, `${stepPath}.occurrence`, errors);
        positiveInteger(step.afterInternalPlotDelayMs, `${stepPath}.afterInternalPlotDelayMs`, errors);

        if (step.action === "show") {
          positiveInteger(step.enterFrames, `${stepPath}.enterFrames`, errors);
          finiteNumber(step.fromY, `${stepPath}.fromY`, errors);
        } else if (step.action === "hide") {
          positiveInteger(step.exitFrames, `${stepPath}.exitFrames`, errors);
          finiteNumber(step.toY, `${stepPath}.toY`, errors);
        } else if (step.action === "highlight") {
          positiveInteger(step.durFrames, `${stepPath}.durFrames`, errors);
          optionalString(step.fill, `${stepPath}.fill`, errors);
          optionalString(step.stroke, `${stepPath}.stroke`, errors);
          finiteNumber(step.strokeWidth, `${stepPath}.strokeWidth`, errors);
          if (typeof step.strokeWidth === "number" && step.strokeWidth < 0) {
            errors.push({ path: `${stepPath}.strokeWidth`, message: "Stroke-Breite darf nicht negativ sein." });
          }
        } else if (step.action === "draw") {
          positiveInteger(step.durFrames, `${stepPath}.durFrames`, errors);
          if (step.drawStyle != null && !["stroke", "reveal"].includes(step.drawStyle)) {
            errors.push({ path: `${stepPath}.drawStyle`, message: "Unbekannter Draw-Stil." });
          }
          if (step.direction != null && !DRAW_DIRECTIONS.has(step.direction)) {
            errors.push({ path: `${stepPath}.direction`, message: "Unbekannte Draw-Richtung." });
          }
        } else if (step.action === "transform") {
          positiveInteger(step.durFrames, `${stepPath}.durFrames`, errors);
          for (const field of [
            "fromTranslateX",
            "fromTranslateY",
            "fromScale",
            "translateX",
            "translateY",
            "scale",
          ]) {
            finiteNumber(step[field], `${stepPath}.${field}`, errors, false);
          }
          if (typeof step.fromScale === "number" && step.fromScale <= 0) {
            errors.push({ path: `${stepPath}.fromScale`, message: "Skalierung muss größer null sein." });
          }
          if (typeof step.scale === "number" && step.scale <= 0) {
            errors.push({ path: `${stepPath}.scale`, message: "Skalierung muss größer null sein." });
          }
          requireNonEmptyString(step.transformOrigin, `${stepPath}.transformOrigin`, errors);
        }
      });
    }

    if (rawManifest.sceneId != null) optionalString(rawManifest.sceneId, "$.sceneId", errors);
    if (rawManifest.status != null) optionalString(rawManifest.status, "$.status", errors);
    if (
      rawManifest.notes != null &&
      (!Array.isArray(rawManifest.notes) || rawManifest.notes.some((note) => typeof note !== "string"))
    ) {
      errors.push({ path: "$.notes", message: "Liste aus Texten erwartet." });
    }
    return errors;
  }

  function inventoryRelations(inventory) {
    const byId = new Map();
    const childrenById = new Map();
    for (const item of inventory || []) {
      byId.set(item.targetId, item);
      if (!childrenById.has(item.targetId)) childrenById.set(item.targetId, []);
    }
    for (const item of inventory || []) {
      if (!item.parentTargetId) continue;
      if (!childrenById.has(item.parentTargetId)) childrenById.set(item.parentTargetId, []);
      childrenById.get(item.parentTargetId).push(item.targetId);
    }
    return { byId, childrenById };
  }

  function ancestorIds(inventory, targetId) {
    const { byId } = inventoryRelations(inventory);
    const result = [];
    const seen = new Set();
    let current = byId.get(targetId);
    while (current?.parentTargetId && !seen.has(current.parentTargetId)) {
      seen.add(current.parentTargetId);
      result.push(current.parentTargetId);
      current = byId.get(current.parentTargetId);
    }
    return result;
  }

  function descendantIds(inventory, targetId, includeSelf = true) {
    const { childrenById } = inventoryRelations(inventory);
    const result = new Set(includeSelf ? [targetId] : []);
    const queue = [...(childrenById.get(targetId) || [])];
    while (queue.length) {
      const childId = queue.shift();
      if (result.has(childId)) continue;
      result.add(childId);
      queue.push(...(childrenById.get(childId) || []));
    }
    return result;
  }

  function syncManifest(rawManifest, inventory, svgPath) {
    const manifest = normalizeManifest(rawManifest, svgPath);
    const inventoryById = new Map((inventory || []).map((item) => [item.targetId, item]));
    const existingTargets = new Map();
    for (const target of manifest.targets) {
      if (isPlainObject(target) && target.targetId && !existingTargets.has(target.targetId)) {
        existingTargets.set(target.targetId, target);
      }
    }
    const stepCounts = new Map();
    for (const step of manifest.steps) {
      if (!isPlainObject(step) || !step.targetId) continue;
      stepCounts.set(step.targetId, (stepCounts.get(step.targetId) || 0) + 1);
    }

    const hiddenTargetIds = new Set(
      [...existingTargets.values()]
        .filter((target) => target.visibleInEditor === false)
        .map((target) => target.targetId),
    );
    const nonRenderedTargetIds = new Set(
      [...existingTargets.values()]
        .filter((target) => target.render === false)
        .map((target) => target.targetId),
    );
    const publicTargetIds = new Set();
    for (const item of inventory || []) {
      if (item.isExplicitTarget && !hiddenTargetIds.has(item.targetId) && !nonRenderedTargetIds.has(item.targetId)) {
        publicTargetIds.add(item.targetId);
      }
    }
    for (const [targetId] of existingTargets) {
      if (
        inventoryById.has(targetId) &&
        !hiddenTargetIds.has(targetId) &&
        !nonRenderedTargetIds.has(targetId)
      ) {
        publicTargetIds.add(targetId);
      }
    }
    for (const targetId of stepCounts.keys()) {
      if (inventoryById.has(targetId)) publicTargetIds.add(targetId);
    }

    const managedIds = new Set([...publicTargetIds, ...hiddenTargetIds, ...nonRenderedTargetIds]);
    const isCoveredByManagedParent = (targetId) =>
      ancestorIds(inventory, targetId).some((parentId) => managedIds.has(parentId));

    const targets = [];
    const included = new Set();
    for (const item of inventory || []) {
      const existing = existingTargets.get(item.targetId);
      if (!existing && !publicTargetIds.has(item.targetId) && isCoveredByManagedParent(item.targetId)) {
        continue;
      }
      const target = existing
        ? { ...existing }
        : {
            targetId: item.targetId,
            label: item.label,
            status: stepCounts.has(item.targetId) ? "animated" : "needsReview",
          };
      if (!target.label && item.label) target.label = item.label;
      if (target.status === "orphaned") {
        target.status = stepCounts.has(item.targetId) ? "animated" : "needsReview";
      }
      if (target.render === false) target.visibleInEditor = false;
      targets.push(target);
      included.add(target.targetId);
    }

    for (const target of existingTargets.values()) {
      if (included.has(target.targetId) || inventoryById.has(target.targetId)) continue;
      targets.push({ ...target, status: "orphaned" });
      included.add(target.targetId);
    }
    for (const step of manifest.steps) {
      if (!step?.targetId || included.has(step.targetId)) continue;
      targets.push({
        targetId: step.targetId,
        label: labelFromTargetId(step.targetId),
        status: "orphaned",
        confidence: step.confidence,
      });
      included.add(step.targetId);
    }

    return { ...manifest, targets };
  }

  function targetMap(manifest) {
    return new Map((manifest?.targets || []).map((target) => [target.targetId, target]));
  }

  function isEffectivelyRendered(manifest, inventory, targetId) {
    const targets = targetMap(manifest);
    if (targets.get(targetId)?.render === false) return false;
    return !ancestorIds(inventory, targetId).some((parentId) => targets.get(parentId)?.render === false);
  }

  function ensureTarget(manifest, inventory, targetId) {
    let target = manifest.targets.find((item) => item.targetId === targetId);
    if (target) return target;
    const item = (inventory || []).find((candidate) => candidate.targetId === targetId);
    target = {
      targetId,
      label: item?.label || labelFromTargetId(targetId),
      status: "needsReview",
    };
    manifest.targets.push(target);
    return target;
  }

  function setEditorVisibility(rawManifest, inventory, targetId, visible) {
    const manifest = clone(rawManifest);
    const hasSteps = manifest.steps.some((step) => step.targetId === targetId);
    if (!visible && hasSteps) return manifest;
    const target = ensureTarget(manifest, inventory, targetId);
    if (visible) {
      delete target.visibleInEditor;
      delete target.render;
      if (target.status === "orphaned") target.status = "needsReview";
    } else {
      target.visibleInEditor = false;
    }
    return syncManifest(manifest, inventory, manifest.svgPath);
  }

  function setRenderVisibility(rawManifest, inventory, targetId, visible) {
    const manifest = clone(rawManifest);
    const target = ensureTarget(manifest, inventory, targetId);
    if (visible) {
      delete target.render;
      delete target.visibleInEditor;
      if (target.status === "orphaned") target.status = "needsReview";
    } else {
      target.render = false;
      target.visibleInEditor = false;
      const excludedIds = descendantIds(inventory, targetId, true);
      manifest.steps = manifest.steps.filter((step) => !excludedIds.has(step.targetId));
    }
    return syncManifest(manifest, inventory, manifest.svgPath);
  }

  function normalizeWord(value) {
    return String(value || "")
      .replace(/Ä/g, "Ae")
      .replace(/Ö/g, "Oe")
      .replace(/Ü/g, "Ue")
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "");
  }

  function wordTokens(text) {
    return Array.from(String(text || "").matchAll(/[\p{L}\p{N}]+/gu))
      .map((match) => ({
        raw: match[0],
        normalized: normalizeWord(match[0]),
        start: match.index,
        end: match.index + match[0].length,
      }))
      .filter((token) => token.normalized);
  }

  function findSourceMatches(spokenText, sourceText) {
    const spoken = wordTokens(spokenText);
    const source = wordTokens(sourceText).map((token) => token.normalized);
    if (!source.length || source.length > spoken.length) return [];
    const matches = [];
    for (let start = 0; start <= spoken.length - source.length; start += 1) {
      if (source.every((token, offset) => spoken[start + offset].normalized === token)) {
        const first = spoken[start];
        const last = spoken[start + source.length - 1];
        matches.push({ wordIndex: start, start: first.start, end: last.end });
      }
    }
    return matches;
  }

  function matchSourceText(spokenText, sourceText, occurrence) {
    const matches = findSourceMatches(spokenText, sourceText);
    const selectedIndex = Number.isInteger(occurrence) && occurrence > 0 ? occurrence - 1 : 0;
    const selected = matches[selectedIndex] || null;
    return {
      matches,
      selected,
      matched: Boolean(selected),
      ambiguous: matches.length > 1 && !(Number.isInteger(occurrence) && occurrence > 0),
      occurrenceOutOfRange: Number.isInteger(occurrence) && occurrence > matches.length,
    };
  }

  function expandToWordBoundaries(text, rawStart, rawEnd) {
    const source = String(text || "");
    let start = Math.max(0, Math.min(Math.min(rawStart, rawEnd), source.length));
    let end = Math.max(0, Math.min(Math.max(rawStart, rawEnd), source.length));
    while (start < end && /\s/u.test(source[start])) start += 1;
    while (end > start && /\s/u.test(source[end - 1])) end -= 1;
    if (end <= start) return "";
    while (start > 0 && /[\p{L}\p{N}]/u.test(source[start - 1])) start -= 1;
    while (end < source.length && /[\p{L}\p{N}]/u.test(source[end])) end += 1;
    return source.slice(start, end).trim();
  }

  function buildMockTimeline(manifest, inventory, spokenText) {
    const entries = [];
    const spokenWordCount = wordTokens(spokenText).length;
    (manifest?.steps || []).forEach((step, originalIndex) => {
      if (!isEffectivelyRendered(manifest, inventory, step.targetId)) return;
      const match = matchSourceText(spokenText, step.sourceText || "", step.occurrence);
      entries.push({
        step,
        originalIndex,
        matched: match.matched,
        ambiguous: match.ambiguous,
        wordIndex: match.selected?.wordIndex ?? Number.POSITIVE_INFINITY,
        fallbackWordIndex: spokenWordCount + originalIndex,
        range: match.selected,
      });
    });
    entries.sort((left, right) => {
      const leftIndex = Number.isFinite(left.wordIndex) ? left.wordIndex : left.fallbackWordIndex;
      const rightIndex = Number.isFinite(right.wordIndex) ? right.wordIndex : right.fallbackWordIndex;
      return leftIndex - rightIndex || left.originalIndex - right.originalIndex;
    });
    return entries.map((entry, timelineIndex) => ({
      ...entry,
      timelineIndex,
      mockSec: timelineIndex * 0.5,
    }));
  }

  function issue(code, severity, message, details = {}) {
    return { code, severity, message, ...details };
  }

  function collectIssues(manifest, inventory, spokenText = "", extraIssues = []) {
    const issues = [...(extraIssues || [])];
    const inventoryIds = new Set((inventory || []).map((item) => item.targetId));
    const targets = targetMap(manifest);
    const stepCounts = new Map();
    for (const step of manifest?.steps || []) {
      stepCounts.set(step.targetId, (stepCounts.get(step.targetId) || 0) + 1);
    }

    for (const target of manifest?.targets || []) {
      if (!inventoryIds.has(target.targetId)) {
        issues.push(issue("orphaned-target", "warning", `Target ${target.targetId} fehlt im SVG.`, { targetId: target.targetId }));
        continue;
      }
      if (target.visibleInEditor !== false && target.render !== false && target.status === "needsReview") {
        issues.push(issue("needs-review", "info", `Target ${target.targetId} ist noch offen.`, { targetId: target.targetId }));
      }
      if (target.visibleInEditor !== false && target.render !== false && target.confidence === "low") {
        issues.push(issue("low-confidence-target", "info", `Target ${target.targetId} hat niedrige Confidence.`, { targetId: target.targetId }));
      }
      if (target.status === "animated" && !stepCounts.has(target.targetId)) {
        issues.push(issue("animated-without-step", "info", `Target ${target.targetId} ist animiert markiert, hat aber keinen Trigger.`, { targetId: target.targetId }));
      }
    }

    for (const [index, step] of (manifest?.steps || []).entries()) {
      if (!isEffectivelyRendered(manifest, inventory, step.targetId)) continue;
      const target = targets.get(step.targetId);
      const stepLabel = step.stepId || String(index + 1);
      if (!target) {
        issues.push(issue("missing-step-target", "warning", `Step ${stepLabel} verweist auf ein unbekanntes Target.`, { stepId: step.stepId }));
      } else if (["notAnimated", "ignored", "orphaned"].includes(target.status)) {
        issues.push(issue("inactive-step-target", "warning", `Step ${stepLabel} verwendet ein nicht animierbares Target.`, { stepId: step.stepId, targetId: step.targetId }));
      }
      if (!inventoryIds.has(step.targetId)) {
        issues.push(issue("missing-step-id", "warning", `Step ${stepLabel}: ID ${step.targetId} fehlt im SVG.`, { stepId: step.stepId, targetId: step.targetId }));
      }
      if (!step.sourceText) {
        issues.push(issue("missing-source-text", "warning", `Step ${stepLabel} hat keinen sourceText.`, { stepId: step.stepId }));
      } else if (spokenText) {
        const match = matchSourceText(spokenText, step.sourceText, step.occurrence);
        if (!match.matches.length) {
          issues.push(issue("unmatched-source-text", "warning", `Step ${stepLabel}: sourceText kommt im Sprechertext nicht vor.`, { stepId: step.stepId }));
        } else if (match.ambiguous) {
          issues.push(issue("ambiguous-source-text", "warning", `Step ${stepLabel}: sourceText ist mehrfach vorhanden; occurrence fehlt.`, { stepId: step.stepId }));
        } else if (match.occurrenceOutOfRange) {
          issues.push(issue("invalid-occurrence", "warning", `Step ${stepLabel}: occurrence liegt außerhalb der Trefferzahl.`, { stepId: step.stepId }));
        }
      }
      if (step.confidence === "low") {
        issues.push(issue("low-confidence-step", "info", `Step ${stepLabel} hat niedrige Confidence.`, { stepId: step.stepId }));
      }
    }

    if (!spokenText && (manifest?.steps || []).some((step) => step.sourceText)) {
      issues.push(issue("spoken-text-unavailable", "info", "Der folienscharfe Sprechertext fehlt; sourceText-Matches können noch nicht geprüft werden."));
    }
    if (manifest?.sceneId != null || manifest?.status != null || manifest?.notes != null) {
      issues.push(issue("legacy-root-fields", "info", "Legacy-Rootfelder werden bis zur beschlossenen Manifestmigration verlustfrei erhalten."));
    }
    if ((manifest?.steps || []).some((step) => step.trigger != null || step.afterInternalPlotDelayMs != null)) {
      issues.push(issue("legacy-step-fields", "info", "Legacy-Stepfelder werden bis zur beschlossenen Manifestmigration verlustfrei erhalten."));
    }
    return issues;
  }

  return {
    ACTIONS: [...ACTIONS],
    DRAWABLE_TAGS: [...DRAWABLE_TAGS],
    SCHEMA_VERSION,
    TARGET_STATUSES: [...TARGET_STATUSES],
    ancestorIds,
    buildMockTimeline,
    collectIssues,
    defaultManifest,
    descendantIds,
    expandToWordBoundaries,
    extractSvgInventory,
    findSourceMatches,
    inventoryRelations,
    isEffectivelyRendered,
    labelFromTargetId,
    matchSourceText,
    normalizeManifest,
    normalizeWord,
    setEditorVisibility,
    setRenderVisibility,
    syncManifest,
    validateManifest,
    wordTokens,
  };
});
