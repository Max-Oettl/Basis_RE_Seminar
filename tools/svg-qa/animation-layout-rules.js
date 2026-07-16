"use strict";

function normalizeAnimationManifest(manifest) {
  const parsed = manifest && typeof manifest === "object" ? manifest : {};
  return {
    schemaVersion: parsed.schemaVersion || "svgAnimationManifest/v1",
    defaults: parsed.defaults && typeof parsed.defaults === "object" ? parsed.defaults : {},
    targets: Array.isArray(parsed.targets)
      ? parsed.targets
          .map((target) => ({
            ...target,
            targetId: target.targetId || target.id || "",
            status: target.status || "animated",
            render: target.render !== false,
          }))
          .filter((target) => target.targetId)
      : [],
    steps: Array.isArray(parsed.steps)
      ? parsed.steps.filter((step) => step && step.targetId)
      : [],
  };
}

function animationTargets(manifest) {
  return manifest.targets.filter((target) => target.render !== false && target.status === "animated");
}

function frameDuration(manifest, step) {
  const defaults = manifest.defaults || {};
  const frames =
    step.action === "draw"
      ? step.drawDurFrames ?? step.durFrames ?? defaults.drawDurFrames ?? 30
      : step.action === "highlight"
        ? step.highlightDurFrames ?? defaults.highlightDurFrames ?? 24
        : step.action === "hide"
          ? step.exitFrames ?? defaults.exitFrames ?? 16
          : step.enterFrames ?? defaults.enterFrames ?? 16;
  return Math.max(200, Math.min(2500, (Number(frames) / 30) * 1000));
}

function buildTimeline(manifest) {
  const targetIds = new Set(animationTargets(manifest).map((target) => target.targetId));
  const pause = Number(manifest.defaults?.pauseMs ?? manifest.defaults?.stepDelayMs ?? 450);
  let cursor = 0;
  return manifest.steps
    .filter((step) => targetIds.has(step.targetId))
    .map((step, index) => {
      const start = cursor;
      const end = start + frameDuration(manifest, step);
      const pauseEnd = end + (index < manifest.steps.length - 1 ? pause : 0);
      cursor = pauseEnd;
      return { step, index, start, end, pauseEnd };
    });
}

function buildAnimationStates(rawManifest, options = {}) {
  const manifest = normalizeAnimationManifest(rawManifest);
  const timeline = buildTimeline(manifest);
  const durationMs = timeline.length ? Math.max(...timeline.map((segment) => segment.pauseEnd)) : 0;

  if (!timeline.length) {
    return {
      manifest,
      timeline,
      durationMs,
      states: [{ label: "static", timeMs: 0, timeSeconds: 0 }],
    };
  }

  const explicitTimes = Array.isArray(options.timesSeconds) ? options.timesSeconds : null;
  const times = explicitTimes
    ? explicitTimes.map((time) => (time === "end" ? durationMs : Number(time) * 1000))
    : [
        0,
        ...timeline.map((segment) => segment.end),
        ...(options.includeEndState === false ? [] : [durationMs]),
      ];

  const uniqueTimes = [...new Set(times.map((time) => Math.max(0, Math.min(durationMs, Math.round(time)))))]
    .sort((left, right) => left - right);

  return {
    manifest,
    timeline,
    durationMs,
    states: uniqueTimes.map((timeMs, index) => ({
      label: timeMs === durationMs ? "end" : index === 0 ? "initial" : `time_${index}`,
      timeMs,
      timeSeconds: Number((timeMs / 1000).toFixed(3)),
    })),
  };
}

function buildApplyAnimationStateExpression(manifest, timeline, state) {
  return `(() => {
    const manifest = ${JSON.stringify(manifest)};
    const timeline = ${JSON.stringify(timeline)};
    const timeMs = ${JSON.stringify(state.timeMs)};
    const svg = document.querySelector("svg");
    if (!svg) return { applied: false, reason: "No SVG root" };
    const originalStyles = window.__svgQaOriginalStyles || {};
    const animatedTargets = manifest.targets.filter((target) => target.render !== false && target.status === "animated");
    function findTarget(targetId) {
      if (!targetId || !window.CSS || !CSS.escape) return document.getElementById(targetId);
      return svg.querySelector("#" + CSS.escape(targetId));
    }
    function restoreTargetStyle(targetId) {
      const element = findTarget(targetId);
      if (!element) return null;
      if (Object.prototype.hasOwnProperty.call(originalStyles, targetId)) {
        const style = originalStyles[targetId];
        if (style == null) element.removeAttribute("style");
        else element.setAttribute("style", style);
      }
      return element;
    }
    function hideAnimationTarget(targetId) {
      const element = restoreTargetStyle(targetId);
      if (!element) return;
      element.setAttribute("data-svg-qa-animation-hidden", "true");
      element.style.visibility = "hidden";
      element.style.opacity = "0";
      element.style.pointerEvents = "none";
    }
    function clipPathForDirection(direction, progress) {
      const remaining = Math.max(0, Math.min(100, (1 - progress) * 100));
      if (direction === "rightToLeft") return "inset(0 0 0 " + remaining + "%)";
      if (direction === "topToBottom") return "inset(0 0 " + remaining + "% 0)";
      if (direction === "bottomToTop") return "inset(" + remaining + "% 0 0 0)";
      return "inset(0 " + remaining + "% 0 0)";
    }
    function applyStepProgress(step, progress) {
      const element = restoreTargetStyle(step.targetId);
      if (!element) return;
      const value = Math.max(0, Math.min(1, progress));
      if (step.action === "hide") {
        element.removeAttribute("data-svg-qa-animation-hidden");
        element.style.visibility = "visible";
        element.style.opacity = String(1 - value);
        return;
      }
      element.removeAttribute("data-svg-qa-animation-hidden");
      element.style.visibility = "visible";
      element.style.opacity = String(Math.max(0.15, value));
      element.style.pointerEvents = "none";
      if (step.action === "draw") {
        element.style.clipPath = clipPathForDirection(step.direction, value);
      }
    }
    function applyStepFinal(step) {
      const element = restoreTargetStyle(step.targetId);
      if (!element) return;
      if (step.action === "hide") {
        element.setAttribute("data-svg-qa-animation-hidden", "true");
        element.style.visibility = "hidden";
        element.style.opacity = "0";
        return;
      }
      element.removeAttribute("data-svg-qa-animation-hidden");
      element.style.visibility = "visible";
      element.style.opacity = "1";
      element.style.clipPath = "";
      element.style.pointerEvents = "none";
    }
    for (const target of animatedTargets) hideAnimationTarget(target.targetId);
    for (const segment of timeline) {
      if (timeMs < segment.start) break;
      if (timeMs >= segment.end) {
        applyStepFinal(segment.step);
      } else {
        const progress = (timeMs - segment.start) / Math.max(1, segment.end - segment.start);
        applyStepProgress(segment.step, progress);
        break;
      }
    }
    return { applied: true, timeMs };
  })()`;
}

module.exports = {
  buildAnimationStates,
  buildApplyAnimationStateExpression,
  normalizeAnimationManifest,
};
