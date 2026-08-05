"use strict";

const { bbox, elementKey, intersection, intersects } = require("./layout-rules");
const { makeLayoutIssue } = require("./layout-report");

const layerByRole = {
  "slide-background": 0,
  "grid-line": 10,
  "axis-line": 20,
  tick: 30,
  "data-point": 40,
  "cross-marker": 50,
  "timeline-marker": 50,
  arrow: 60,
  "arrow-shaft": 60,
  "background-box": 70,
  shape: 70,
  "legend-background": 70,
  "callout-box": 70,
  text: 100,
  formula: 100,
  "legend-text": 110,
  "axis-label": 110,
  "plot-label": 110,
  "timeline-label": 110,
  "callout-text": 110,
  "arrow-head": 120,
};

function expectedLayer(element) {
  if (element.qc?.layer && Object.prototype.hasOwnProperty.call(layerByRole, element.qc.layer)) {
    return layerByRole[element.qc.layer];
  }
  return layerByRole[element.role] ?? null;
}

function relationshipApplies(above, below) {
  if (above.qc?.layer || below.qc?.layer || above.qc?.above || below.qc?.below) return true;

  const aboveRole = above.role;
  const belowRole = below.role;
  const textRoles = new Set(["text", "axis-label", "plot-label", "legend-text", "timeline-label", "callout-text", "formula"]);
  const boxRoles = new Set(["background-box", "legend-background", "callout-box"]);
  const markerRoles = new Set(["data-point", "cross-marker", "timeline-marker"]);

  if (textRoles.has(aboveRole) && boxRoles.has(belowRole)) return true;
  if (aboveRole === "axis-label" && belowRole === "axis-line") return true;
  if (markerRoles.has(aboveRole) && ["grid-line", "axis-line"].includes(belowRole)) return true;
  if (aboveRole === "arrow-head" && ["arrow", "arrow-shaft", "axis-line"].includes(belowRole)) return true;
  return false;
}

function stackIndex(hit, element) {
  const key = elementKey(element);
  return (hit.stack || []).findIndex((entry) => entry.runtimeId === key || (element.id && entry.id === element.id));
}

function hitAtOverlap(above, below) {
  const overlap = intersection(bbox(above), bbox(below));
  if (!overlap || overlap.width <= 0 || overlap.height <= 0) return null;
  const hits = [...(above.hitTests || []), ...(below.hitTests || [])];
  return hits.find((hit) => {
    const point = hit.point;
    if (!point) return false;
    return (
      point.x >= overlap.left &&
      point.x <= overlap.right &&
      point.y >= overlap.top &&
      point.y <= overlap.bottom &&
      stackIndex(hit, above) >= 0 &&
      stackIndex(hit, below) >= 0
    );
  }) || null;
}

function runZOrderExpected(layout, context, config) {
  if (!config.checks.zOrderExpected) return [];
  const issues = [];
  const visible = layout.elements.filter((element) =>
    element.visible &&
    !element.animationHidden &&
    !element.qc?.allowOverlap
  );

  for (let index = 0; index < visible.length; index += 1) {
    for (let otherIndex = index + 1; otherIndex < visible.length; otherIndex += 1) {
      const left = visible[index];
      const right = visible[otherIndex];
      const leftLayer = expectedLayer(left);
      const rightLayer = expectedLayer(right);
      if (leftLayer === null || rightLayer === null || leftLayer === rightLayer) continue;
      if (!intersects(bbox(left), bbox(right), config.tolerances.overlapPx)) continue;

      const above = leftLayer > rightLayer ? left : right;
      const below = above === left ? right : left;
      if (!relationshipApplies(above, below)) continue;
      const hit = hitAtOverlap(above, below);
      if (!hit) {
        if (above.domIndex > below.domIndex) continue;
      } else {
        const aboveIndex = stackIndex(hit, above);
        const belowIndex = stackIndex(hit, below);
        if (aboveIndex >= 0 && belowIndex >= 0 && aboveIndex < belowIndex) continue;
      }

      issues.push(makeLayoutIssue(context, {
        rule: "z_order_expected",
        elementId: elementKey(above),
        relatedElementId: elementKey(below),
        message: "Expected foreground element is not above the background/lower layer element.",
        expected: `${elementKey(above)} above ${elementKey(below)}`,
        actual: hit
          ? hit.stack.map((entry) => entry.id || entry.runtimeId).join(" > ")
          : `DOM order ${elementKey(below)} after ${elementKey(above)}`,
        bbox: {
          above: bbox(above),
          below: bbox(below),
          overlap: intersection(bbox(above), bbox(below)),
          point: hit?.point || null,
        },
        recommendation: "Render foreground elements later or add/correct data-qc-layer relationships.",
      }));
    }
  }

  return issues;
}

function runLayerRules(layout, context, config) {
  return [
    ...runZOrderExpected(layout, context, config),
  ];
}

module.exports = {
  runLayerRules,
};
