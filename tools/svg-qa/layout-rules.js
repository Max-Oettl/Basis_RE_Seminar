"use strict";

const { makeLayoutIssue } = require("./layout-report");

const textRoles = new Set([
  "text",
  "axis-label",
  "plot-label",
  "legend-text",
  "timeline-label",
  "callout-text",
]);

const boxRoles = new Set([
  "background-box",
  "callout-box",
  "legend-background",
  "shape",
]);

const importantRoles = new Set([
  "text",
  "axis-label",
  "plot-label",
  "legend",
  "legend-text",
  "formula",
  "timeline-label",
  "timeline-marker",
  "callout",
  "callout-text",
  "data-point",
  "cross-marker",
  "arrow-head",
]);

function elementKey(element) {
  return element.id || element.runtimeId;
}

function bbox(element) {
  return element?.bbox?.svg || null;
}

function intersects(left, right, tolerance = 0) {
  if (!left || !right) return false;
  return !(
    left.right <= right.left + tolerance ||
    right.right <= left.left + tolerance ||
    left.bottom <= right.top + tolerance ||
    right.bottom <= left.top + tolerance
  );
}

function intersection(left, right) {
  if (!intersects(left, right)) return null;
  const box = {
    left: Math.max(left.left, right.left),
    top: Math.max(left.top, right.top),
    right: Math.min(left.right, right.right),
    bottom: Math.min(left.bottom, right.bottom),
  };
  return {
    ...box,
    width: Math.max(0, box.right - box.left),
    height: Math.max(0, box.bottom - box.top),
  };
}

function area(rect) {
  return rect ? Math.max(0, rect.width) * Math.max(0, rect.height) : 0;
}

function contains(outer, inner, padding = 0, tolerance = 0) {
  return (
    inner.left >= outer.left + padding - tolerance &&
    inner.right <= outer.right - padding + tolerance &&
    inner.top >= outer.top + padding - tolerance &&
    inner.bottom <= outer.bottom - padding + tolerance
  );
}

function sameLogicalGroup(left, right) {
  if (!left || !right) return false;
  if (left.qc?.group && left.qc.group === right.qc?.group) return true;
  const leftAncestors = new Set((left.ancestors || []).map((item) => item.runtimeId).filter(Boolean));
  return Boolean(
    left.parentRuntimeId &&
    left.parentRuntimeId === right.parentRuntimeId ||
    leftAncestors.has(right.parentRuntimeId) ||
    (right.ancestors || []).some((item) => item.runtimeId && item.runtimeId === left.parentRuntimeId)
  );
}

function byIdOrRuntime(elements) {
  const map = new Map();
  for (const element of elements) {
    if (element.id) map.set(element.id, element);
    if (element.runtimeId) map.set(element.runtimeId, element);
  }
  return map;
}

function inferBoxForText(text, elements) {
  const map = byIdOrRuntime(elements);
  if (text.qc?.box && map.has(text.qc.box)) return map.get(text.qc.box);

  const textBox = bbox(text);
  if (!textBox) return null;

  const candidates = elements
    .filter((element) => element.visible && boxRoles.has(element.role) && elementKey(element) !== elementKey(text))
    .filter((element) => {
      const candidateBox = bbox(element);
      if (!candidateBox) return false;
      if (!contains(candidateBox, textBox, -2, 4) && !intersects(candidateBox, textBox)) return false;
      return sameLogicalGroup(text, element) || contains(candidateBox, textBox, -2, 4);
    })
    .sort((left, right) => area(bbox(left)) - area(bbox(right)));

  return candidates[0] || null;
}

function stackContains(stack, element) {
  const key = elementKey(element);
  return stack.findIndex((entry) => entry.id === element.id && element.id || entry.runtimeId === key);
}

function runTextInsideBox(layout, context, config) {
  if (!config.checks.textInsideBox) return [];
  const issues = [];
  const tolerance = config.tolerances.geometryPx;
  const defaultPadding = config.tolerances.paddingPx;
  const visibleTexts = layout.elements.filter((element) =>
    element.visible &&
    !element.animationHidden &&
    !element.qc?.allowOverlap &&
    textRoles.has(element.role)
  );

  for (const text of visibleTexts) {
    const box = inferBoxForText(text, layout.elements);
    if (!box) continue;

    const textBox = bbox(text);
    const backgroundBox = bbox(box);
    if (!textBox || !backgroundBox) continue;

    const padding = Number(text.qc?.padding || box.qc?.padding || defaultPadding);
    if (contains(backgroundBox, textBox, padding, tolerance)) continue;

    const failures = [];
    if (textBox.left < backgroundBox.left + padding - tolerance) failures.push("left");
    if (textBox.right > backgroundBox.right - padding + tolerance) failures.push("right");
    if (textBox.top < backgroundBox.top + padding - tolerance) failures.push("top");
    if (textBox.bottom > backgroundBox.bottom - padding + tolerance) failures.push("bottom");

    issues.push(makeLayoutIssue(context, {
      rule: "text_inside_box",
      elementId: elementKey(text),
      relatedElementId: elementKey(box),
      message: `Text does not fit inside its background box (${failures.join(", ")}).`,
      expected: {
        left_min: backgroundBox.left + padding,
        right_max: backgroundBox.right - padding,
        top_min: backgroundBox.top + padding,
        bottom_max: backgroundBox.bottom - padding,
      },
      actual: {
        left: textBox.left,
        right: textBox.right,
        top: textBox.top,
        bottom: textBox.bottom,
      },
      bbox: { text: textBox, box: backgroundBox },
      recommendation: "Box enlarge, text wrap, or move text so visible padding remains on every side.",
    }));
  }

  return issues;
}

function runTextAboveBackground(layout, context, config) {
  if (!config.checks.textAboveBackground) return [];
  const issues = [];
  const visibleTexts = layout.elements.filter((element) =>
    element.visible &&
    !element.animationHidden &&
    !element.qc?.allowOverlap &&
    textRoles.has(element.role)
  );

  for (const text of visibleTexts) {
    const box = inferBoxForText(text, layout.elements);
    if (!box || !intersects(bbox(text), bbox(box))) continue;

    const textKey = elementKey(text);
    const boxKey = elementKey(box);
    const badHit = (text.hitTests || []).find((hit) => {
      const textIndex = hit.stack.findIndex((entry) => entry.id === text.id && text.id || entry.runtimeId === textKey);
      const boxIndex = hit.stack.findIndex((entry) => entry.id === box.id && box.id || entry.runtimeId === boxKey);
      return textIndex >= 0 && boxIndex >= 0 && boxIndex < textIndex;
    });

    if (!badHit) continue;

    issues.push(makeLayoutIssue(context, {
      rule: "text_above_background",
      elementId: textKey,
      relatedElementId: boxKey,
      message: "Text is below its background box in the rendered hit-test stack.",
      expected: `${textKey} above ${boxKey}`,
      actual: badHit.stack.map((entry) => entry.id || entry.runtimeId).join(" > "),
      bbox: { text: bbox(text), box: bbox(box), point: badHit.point },
      recommendation: "Render the background box before the text or move the text to a later foreground layer.",
    }));
  }

  return issues;
}

function runSlideBounds(layout, context, config) {
  if (!config.checks.slideBounds || !layout.viewBox) return [];
  const issues = [];
  const tolerance = config.tolerances.geometryPx;
  const slide = {
    left: layout.viewBox.x,
    top: layout.viewBox.y,
    right: layout.viewBox.x + layout.viewBox.width,
    bottom: layout.viewBox.y + layout.viewBox.height,
  };

  for (const element of layout.elements) {
    if (!element.visible) continue;
    if (!importantRoles.has(element.role) && !element.qc?.important) continue;
    const box = bbox(element);
    if (!box || box.width <= 0 || box.height <= 0) continue;
    if (contains(slide, box, 0, tolerance)) continue;

    issues.push(makeLayoutIssue(context, {
      rule: "slide_bounds",
      elementId: elementKey(element),
      message: "Important visible element extends outside the SVG viewBox.",
      expected: slide,
      actual: box,
      bbox: { element: box },
      recommendation: "Move the element inside the slide area or resize the composition.",
    }));
  }

  return issues;
}

function runUnexpectedOverlap(layout, context, config) {
  if (!config.checks.unexpectedOverlap) return [];
  const issues = [];
  const tolerance = config.tolerances.overlapPx;
  const important = layout.elements.filter((element) =>
    element.visible &&
    (importantRoles.has(element.role) || element.qc?.important) &&
    !element.qc?.allowOverlap
  );

  for (let index = 0; index < important.length; index += 1) {
    for (let otherIndex = index + 1; otherIndex < important.length; otherIndex += 1) {
      const left = important[index];
      const right = important[otherIndex];
      if (left.qc?.allowOverlap || right.qc?.allowOverlap) continue;
      if (left.parentRuntimeId === right.runtimeId || right.parentRuntimeId === left.runtimeId) continue;
      if (textRoles.has(left.role) && boxRoles.has(right.role)) continue;
      if (textRoles.has(right.role) && boxRoles.has(left.role)) continue;

      const overlap = intersection(bbox(left), bbox(right));
      if (!overlap || overlap.width <= tolerance || overlap.height <= tolerance) continue;
      if (area(overlap) < Math.max(4, tolerance * tolerance)) continue;

      const textVsText = textRoles.has(left.role) && textRoles.has(right.role);
      const textVsCritical = textRoles.has(left.role) || textRoles.has(right.role) || left.role === "formula" || right.role === "formula";
      if (!textVsText && !textVsCritical) continue;

      issues.push(makeLayoutIssue(context, {
        rule: "unexpected_overlap",
        elementId: elementKey(left),
        relatedElementId: elementKey(right),
        message: "Important elements overlap without an explicit data-qc-allow-overlap exception.",
        expected: "No unexpected overlap between important labels, formulas, callouts, and markers.",
        actual: { overlap },
        bbox: { left: bbox(left), right: bbox(right), overlap },
        recommendation: "Move one element, add wrapping, or mark the intentional overlap with data-qc-allow-overlap=\"true\".",
      }));
    }
  }

  return issues;
}

function runUnexpectedCovering(layout, context, config) {
  if (!config.checks.unexpectedCovering) return [];
  const issues = [];
  const important = layout.elements.filter((element) =>
    element.visible && (textRoles.has(element.role) || element.role === "formula" || element.qc?.expectedTop)
  );

  for (const element of important) {
    const key = elementKey(element);
    const usableHits = (element.hitTests || []).filter((hit) => hit.stack.length);
    if (!usableHits.length) continue;

    const hasSelfOnTop = usableHits.some((hit) => {
      const top = hit.stack[0];
      return top.id === element.id && element.id || top.runtimeId === key;
    });
    if (hasSelfOnTop) continue;

    const coveringHit = usableHits.find((hit) => {
      const ownIndex = hit.stack.findIndex((entry) => entry.id === element.id && element.id || entry.runtimeId === key);
      if (ownIndex < 0) return false;
      const top = hit.stack[0];
      if (!top || top.runtimeId === key || top.id === element.id) return false;
      return ownIndex > 0;
    });
    if (!coveringHit) continue;

    issues.push(makeLayoutIssue(context, {
      rule: "unexpected_covering",
      elementId: key,
      relatedElementId: coveringHit.stack[0].id || coveringHit.stack[0].runtimeId,
      message: "Important element appears below another rendered element at hit-test points.",
      expected: `${key} visible on top at its sample points`,
      actual: coveringHit.stack.map((entry) => entry.id || entry.runtimeId).join(" > "),
      bbox: { element: bbox(element), point: coveringHit.point },
      recommendation: "Move the important element later in DOM order or adjust data-qc layer relationships.",
    }));
  }

  return issues;
}

function runVisibilityAndOpacity(layout, context, config) {
  if (!config.checks.visibilityAndOpacity) return [];
  const issues = [];
  const opacityMin = config.tolerances.opacityMin;

  for (const element of layout.elements) {
    const explicitImportant = element.qc?.important || Boolean(element.qc?.role);
    if (!explicitImportant) continue;
    if (element.animationHidden || element.qc?.allowHidden) continue;
    const style = element.computedStyle || {};
    const opacity = Number(style.opacity);
    const invisible =
      style.display === "none" ||
      style.visibility === "hidden" ||
      !Number.isFinite(opacity) ||
      opacity <= opacityMin;

    if (invisible) {
      issues.push(makeLayoutIssue(context, {
        rule: "visibility_and_opacity",
        elementId: elementKey(element),
        message: "Important data-qc element is not visibly rendered.",
        expected: { display: "not none", visibility: "visible", opacity_min: opacityMin },
        actual: style,
        bbox: { element: bbox(element) },
        recommendation: "Check animation state, style attributes, clip-path, mask, fill, stroke, and opacity.",
      }));
      continue;
    }

    if (["line", "path", "polyline"].includes(element.tag) && (style.stroke === "none" || Number.parseFloat(style.strokeWidth) <= 0)) {
      issues.push(makeLayoutIssue(context, {
        rule: "visibility_and_opacity",
        elementId: elementKey(element),
        message: "Line/path element has no visible stroke.",
        expected: "stroke != none and stroke-width > 0",
        actual: { stroke: style.stroke, strokeWidth: style.strokeWidth },
        recommendation: "Set a visible stroke and stroke-width for line-based elements.",
      }));
    }
  }

  return issues;
}

function runGroupIntegrity(layout, context, config) {
  if (!config.checks.groupIntegrity) return [];
  const issues = [];

  if (context.stateIndex === 0 && layout.qcStats?.elementsWithDataQc === 0) {
    issues.push(makeLayoutIssue(context, {
      rule: "group_integrity",
      message: "No data-qc-* attributes found; layout QA is using heuristics only.",
      expected: "Explicit data-qc roles and relationships for text boxes, arrows, axes, formulas, and timelines.",
      actual: { elementsWithDataQc: 0, totalElements: layout.qcStats.totalElements },
      recommendation: "Add data-qc-role, data-qc-box, data-qc-group, and data-qc-layer to newly generated SVGs.",
    }));
  }

  const explicitTextboxes = layout.elements.filter((element) => element.qc?.role === "textbox");
  for (const group of explicitTextboxes) {
    const descendants = layout.elements.filter((element) =>
      element.ancestors?.some((ancestor) => ancestor.runtimeId === group.runtimeId)
    );
    const hasBox = descendants.some((element) => boxRoles.has(element.role));
    const hasText = descendants.some((element) => textRoles.has(element.role));
    if (hasBox && hasText) continue;
    issues.push(makeLayoutIssue(context, {
      rule: "group_integrity",
      elementId: elementKey(group),
      message: "Textbox group is incomplete.",
      expected: "Textbox contains a background box and at least one text element.",
      actual: { hasBox, hasText },
      recommendation: "Add the missing textbox part or correct data-qc-role assignments.",
    }));
  }

  return issues;
}

function runFontLoaded(layout, context, config) {
  if (!config.checks.fontLoaded || context.stateIndex !== 0) return [];
  const issues = [];
  const textElements = layout.elements.filter((element) => element.visible && textRoles.has(element.role));
  if (!textElements.length) return issues;

  if (layout.fonts?.status && layout.fonts.status !== "loaded") {
    issues.push(makeLayoutIssue(context, {
      rule: "font_loaded",
      message: "Browser Font Loading API did not report loaded fonts.",
      expected: "document.fonts.status === loaded",
      actual: layout.fonts,
      recommendation: "Wait for fonts before layout QA or use installed/system-safe fonts.",
    }));
  }

  const missingFamily = textElements.find((element) => !element.computedStyle?.fontFamily);
  if (missingFamily) {
    issues.push(makeLayoutIssue(context, {
      rule: "font_loaded",
      elementId: elementKey(missingFamily),
      message: "Text element has no computed font family.",
      expected: "computed font-family present",
      actual: missingFamily.computedStyle,
      recommendation: "Check SVG style cascade and font-family declarations.",
    }));
  }

  return issues;
}

function runLayoutRules(layout, context, config) {
  return [
    ...runGroupIntegrity(layout, context, config),
    ...runTextInsideBox(layout, context, config),
    ...runTextAboveBackground(layout, context, config),
    ...runSlideBounds(layout, context, config),
    ...runUnexpectedOverlap(layout, context, config),
    ...runUnexpectedCovering(layout, context, config),
    ...runVisibilityAndOpacity(layout, context, config),
    ...runFontLoaded(layout, context, config),
  ];
}

module.exports = {
  bbox,
  elementKey,
  importantRoles,
  intersection,
  intersects,
  runLayoutRules,
  textRoles,
};
