"use strict";

const defaultLayoutQaConfig = {
  tolerances: {
    geometryPx: 1,
    paddingPx: 8,
    overlapPx: 1,
    opacityMin: 0.05,
  },
  slide: {
    expectedAspectRatio: 16 / 9,
    aspectRatioTolerance: 0.02,
  },
  checks: {
    textInsideBox: true,
    textAboveBackground: true,
    slideBounds: true,
    unexpectedOverlap: true,
    zOrderExpected: true,
    unexpectedCovering: true,
    visibilityAndOpacity: true,
    arrowIntegrity: true,
    axisLayering: true,
    groupIntegrity: true,
    fontLoaded: true,
    animationLayoutStates: true,
  },
  animation: {
    timesSeconds: null,
    includeEndState: true,
  },
  layers: {
    background: 0,
    grid: 10,
    axis: 20,
    tick: 30,
    data: 40,
    marker: 50,
    arrow: 60,
    box: 70,
    text: 100,
    label: 110,
    critical: 200,
  },
};

function parseLayoutTimes(value) {
  if (!value) return null;
  const tokens = String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!tokens.length) return null;

  return tokens
    .map((token) => {
      if (token.toLowerCase() === "end") return "end";
      const seconds = Number(token.replace(",", "."));
      return Number.isFinite(seconds) && seconds >= 0 ? seconds : null;
    })
    .filter((item) => item !== null);
}

function normalizeLayoutOptions(options = {}) {
  const strict = Boolean(options.strict);
  return {
    enabled: Boolean(options.enabled),
    strict,
    warnOnly: strict ? Boolean(options.warnOnly) : true,
    timesSeconds: parseLayoutTimes(options.times || ""),
  };
}

module.exports = {
  defaultLayoutQaConfig,
  normalizeLayoutOptions,
  parseLayoutTimes,
};
