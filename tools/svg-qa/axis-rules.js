"use strict";

const { bbox, elementKey, intersects } = require("./layout-rules");
const { makeLayoutIssue } = require("./layout-report");

function runAxisLayering(layout, context, config) {
  if (!config.checks.axisLayering) return [];
  const issues = [];
  const axes = layout.elements.filter((element) => element.visible && element.role === "axis-line");
  const labels = layout.elements.filter((element) => element.visible && element.role === "axis-label");
  const markers = layout.elements.filter((element) =>
    element.visible && ["data-point", "cross-marker", "timeline-marker"].includes(element.role)
  );
  const grids = layout.elements.filter((element) => element.visible && element.role === "grid-line");

  for (const marker of markers) {
    for (const axis of axes) {
      if (!intersects(bbox(marker), bbox(axis), config.tolerances.overlapPx)) continue;
      if (marker.domIndex > axis.domIndex) continue;
      issues.push(makeLayoutIssue(context, {
        rule: "axis_layering",
        elementId: elementKey(marker),
        relatedElementId: elementKey(axis),
        message: "Marker intersects an axis but is not rendered after the axis.",
        expected: "marker above axis_line",
        actual: { markerDomIndex: marker.domIndex, axisDomIndex: axis.domIndex },
        bbox: { marker: bbox(marker), axis: bbox(axis) },
        recommendation: "Render markers after axes so failures, data points, and timeline events remain visible.",
      }));
    }
  }

  for (const grid of grids) {
    for (const marker of markers) {
      if (!intersects(bbox(grid), bbox(marker), config.tolerances.overlapPx)) continue;
      if (grid.domIndex < marker.domIndex) continue;
      issues.push(makeLayoutIssue(context, {
        rule: "axis_layering",
        elementId: elementKey(grid),
        relatedElementId: elementKey(marker),
        message: "Gridline intersects a marker and is rendered above it.",
        expected: "grid_line below marker",
        actual: { gridDomIndex: grid.domIndex, markerDomIndex: marker.domIndex },
        bbox: { grid: bbox(grid), marker: bbox(marker) },
        recommendation: "Render gridlines before axes and markers.",
      }));
    }
  }

  for (const label of labels) {
    for (const axis of axes) {
      if (!intersects(bbox(label), bbox(axis), config.tolerances.overlapPx)) continue;
      if (label.domIndex > axis.domIndex) continue;
      issues.push(makeLayoutIssue(context, {
        rule: "axis_layering",
        elementId: elementKey(label),
        relatedElementId: elementKey(axis),
        message: "Axis label intersects an axis and is not rendered above it.",
        expected: "axis_label above axis_line",
        actual: { labelDomIndex: label.domIndex, axisDomIndex: axis.domIndex },
        bbox: { label: bbox(label), axis: bbox(axis) },
        recommendation: "Move labels away from the axis or render labels after axes.",
      }));
    }
  }

  return issues;
}

function runAxisRules(layout, context, config) {
  return [
    ...runAxisLayering(layout, context, config),
  ];
}

module.exports = {
  runAxisRules,
};
