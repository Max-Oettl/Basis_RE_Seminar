"use strict";

function layoutSeverity(context) {
  return context.strict && !context.warnOnly ? "error" : "warning";
}

function makeLayoutIssue(context, issue) {
  return {
    rule: issue.rule || "layout",
    severity: issue.severity || layoutSeverity(context),
    file: context.file || "",
    slide: context.slide || "",
    time_seconds: context.timeSeconds ?? null,
    state: context.stateLabel || "",
    element_id: issue.elementId || "",
    related_element_id: issue.relatedElementId || "",
    message: issue.message || "Layout issue.",
    expected: issue.expected ?? null,
    actual: issue.actual ?? null,
    bbox: issue.bbox ?? null,
    recommendation: issue.recommendation || "",
    detail: issue.detail || "",
  };
}

function formatLayoutIssue(issue) {
  const rule = issue.rule ? ` [${issue.rule}]` : "";
  const file = issue.file ? ` (${issue.file})` : "";
  const element = issue.element_id ? ` element=${issue.element_id}` : "";
  const related = issue.related_element_id ? ` related=${issue.related_element_id}` : "";
  const time = Number.isFinite(issue.time_seconds) ? ` t=${issue.time_seconds}s` : "";
  const recommendation = issue.recommendation ? ` Recommendation: ${issue.recommendation}` : "";
  const detail = issue.detail ? ` Detail: ${issue.detail}` : "";
  return `- ${String(issue.severity || "warning").toUpperCase()}${rule}${file}:${time}${element}${related} ${issue.message}${detail}${recommendation}`;
}

function summarizeLayout(layout) {
  const issues = Array.isArray(layout?.issues) ? layout.issues : [];
  return {
    checked: Boolean(layout?.checked),
    files_checked: Array.isArray(layout?.files) ? layout.files.length : 0,
    states_checked: Array.isArray(layout?.files)
      ? layout.files.reduce((sum, file) => sum + (file.states_checked || 0), 0)
      : 0,
    errors: issues.filter((issue) => issue.severity === "error").length,
    warnings: issues.filter((issue) => issue.severity === "warning").length,
  };
}

module.exports = {
  formatLayoutIssue,
  layoutSeverity,
  makeLayoutIssue,
  summarizeLayout,
};
