"use strict";

const { bbox, elementKey } = require("./layout-rules");
const { makeLayoutIssue } = require("./layout-report");

function markerIdFromUrl(value) {
  const match = String(value || "").match(/url\(["']?#([^"')]+)["']?\)/);
  return match ? match[1] : "";
}

function runMarkerReferenceChecks(layout, context, config) {
  if (!config.checks.arrowIntegrity) return [];
  const issues = [];
  const markerMap = new Map((layout.markerDefs || []).map((marker) => [marker.id, marker]));

  for (const element of layout.elements) {
    const refs = [
      ["marker-start", element.attributes?.markerStart],
      ["marker-mid", element.attributes?.markerMid],
      ["marker-end", element.attributes?.markerEnd],
    ].filter(([, value]) => value);

    for (const [attribute, value] of refs) {
      const markerId = markerIdFromUrl(value);
      const marker = markerMap.get(markerId);
      if (!markerId || !marker) {
        issues.push(makeLayoutIssue(context, {
          rule: "arrow_integrity",
          elementId: elementKey(element),
          message: `${attribute} references a missing marker definition.`,
          expected: `${attribute} references existing marker id`,
          actual: value,
          recommendation: "Add the marker definition or correct the marker URL.",
        }));
        continue;
      }

      if (!marker.childCount || !marker.hasPaintedChild) {
        issues.push(makeLayoutIssue(context, {
          rule: "arrow_integrity",
          elementId: elementKey(element),
          relatedElementId: marker.id,
          message: "Marker definition is empty or has no painted geometry.",
          expected: "Marker contains path, polygon, polyline, line, circle, or rect.",
          actual: marker,
          recommendation: "Add visible marker geometry.",
        }));
      }

      const plausibleSize =
        Number.isFinite(marker.markerWidth) &&
        Number.isFinite(marker.markerHeight) &&
        marker.markerWidth > 0 &&
        marker.markerHeight > 0;
      if (!plausibleSize) {
        issues.push(makeLayoutIssue(context, {
          rule: "arrow_integrity",
          elementId: elementKey(element),
          relatedElementId: marker.id,
          message: "Marker has implausible markerWidth or markerHeight.",
          expected: "markerWidth > 0 and markerHeight > 0",
          actual: marker,
          recommendation: "Set markerWidth, markerHeight, refX, refY, viewBox, and orient explicitly.",
        }));
      }

      if (!marker.orient) {
        issues.push(makeLayoutIssue(context, {
          rule: "arrow_integrity",
          elementId: elementKey(element),
          relatedElementId: marker.id,
          message: "Marker has no orient attribute.",
          expected: "orient=\"auto\" or another intentional orientation",
          actual: marker,
          recommendation: "Set orient=\"auto\" or orient=\"auto-start-reverse\" for arrow heads.",
        }));
      }
    }
  }

  return issues;
}

function runGroupedArrowChecks(layout, context, config) {
  if (!config.checks.arrowIntegrity) return [];
  const issues = [];
  const arrowGroups = layout.elements.filter((element) => element.role === "arrow" && element.tag === "g");

  for (const group of arrowGroups) {
    const descendants = layout.elements.filter((element) =>
      element.ancestors?.some((ancestor) => ancestor.runtimeId === group.runtimeId)
    );
    const shaft = descendants.find((element) => element.role === "arrow-shaft" || ["line", "path", "polyline"].includes(element.tag));
    const head = descendants.find((element) => element.role === "arrow-head" || /head/i.test(element.id || ""));

    if (!shaft || !head) {
      issues.push(makeLayoutIssue(context, {
        rule: "arrow_integrity",
        elementId: elementKey(group),
        message: "Arrow group does not contain both shaft and head.",
        expected: "Arrow group has shaft and head elements.",
        actual: { hasShaft: Boolean(shaft), hasHead: Boolean(head) },
        recommendation: "Add data-qc-role=\"arrow-shaft\" and data-qc-role=\"arrow-head\" to grouped arrows.",
      }));
      continue;
    }

    if (!head.visible) {
      issues.push(makeLayoutIssue(context, {
        rule: "arrow_integrity",
        elementId: elementKey(group),
        relatedElementId: elementKey(head),
        message: "Arrow head exists but is not visible.",
        expected: "Arrow head visible above shaft.",
        actual: { headVisible: head.visible, bbox: bbox(head) },
        recommendation: "Check fill, stroke, opacity, visibility, and DOM order of the arrow head.",
      }));
    }
  }

  return issues;
}

function runArrowRules(layout, context, config) {
  return [
    ...runMarkerReferenceChecks(layout, context, config),
    ...runGroupedArrowChecks(layout, context, config),
  ];
}

module.exports = {
  markerIdFromUrl,
  runArrowRules,
};
