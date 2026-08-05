(function exposeNarrationPauseDomain(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.NarrationPauseDomain = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createNarrationPauseDomain() {
  "use strict";

  const PAUSE_DURATIONS_MS = Object.freeze({
    short: 400,
    medium: 800,
    long: 1400,
  });
  const MAX_CUSTOM_DURATION_MS = 3000;
  const PRESET_LABELS = Object.freeze({
    short: "Kurz",
    medium: "Mittel",
    long: "Lang",
  });

  function formatDuration(durationMs) {
    return `${(Number(durationMs) / 1000).toLocaleString("de-DE", {
      minimumFractionDigits: Number(durationMs) % 1000 === 0 ? 0 : 1,
      maximumFractionDigits: 3,
    })} s`;
  }

  function invalidPause(raw, start, end, reason) {
    return {
      type: "pause",
      raw,
      start,
      end,
      valid: false,
      preset: "custom",
      durationMs: null,
      label: "Ungültige Pause",
      error: reason,
    };
  }

  function parsePauseMarker(raw, start = 0, end = start + String(raw || "").length) {
    const source = String(raw || "");
    const exact = source.match(/^\{\{pause:([^{}]+)\}\}$/i);
    if (!exact) {
      return invalidPause(source, start, end, "Marker muss dem Format {{pause:...}} entsprechen.");
    }
    const value = exact[1];
    const preset = value.toLowerCase();
    if (Object.hasOwn(PAUSE_DURATIONS_MS, preset)) {
      return {
        type: "pause",
        raw: source,
        start,
        end,
        valid: true,
        preset,
        durationMs: PAUSE_DURATIONS_MS[preset],
        label: PRESET_LABELS[preset],
        error: "",
      };
    }

    let durationMs = null;
    if (/^\d+(?:\.\d+)?s$/.test(value)) {
      durationMs = Number.parseFloat(value.slice(0, -1)) * 1000;
    } else if (/^\d+ms$/.test(value)) {
      durationMs = Number.parseInt(value.slice(0, -2), 10);
    } else {
      return invalidPause(
        source,
        start,
        end,
        "Erlaubt sind short, medium, long, Sekunden mit Punkt oder Millisekunden.",
      );
    }

    if (!Number.isFinite(durationMs) || durationMs <= 0) {
      return invalidPause(source, start, end, "Die Pausendauer muss größer als 0 Sekunden sein.");
    }
    if (durationMs > MAX_CUSTOM_DURATION_MS) {
      return invalidPause(source, start, end, "Die Pausendauer darf höchstens 3 Sekunden betragen.");
    }
    return {
      type: "pause",
      raw: source,
      start,
      end,
      valid: true,
      preset: "custom",
      durationMs: Math.round(durationMs),
      label: "Benutzerdefiniert",
      error: "",
    };
  }

  function parseNarration(text) {
    const source = String(text || "");
    const segments = [];
    let cursor = 0;
    while (cursor < source.length) {
      const rest = source.slice(cursor);
      const opening = rest.search(/\{\{\s*pause\b/i);
      if (opening < 0) {
        if (cursor < source.length) segments.push({ type: "text", value: source.slice(cursor), start: cursor, end: source.length });
        break;
      }
      const start = cursor + opening;
      if (start > cursor) segments.push({ type: "text", value: source.slice(cursor, start), start: cursor, end: start });
      const close = source.indexOf("}}", start + 2);
      const end = close < 0 ? source.length : close + 2;
      segments.push(parsePauseMarker(source.slice(start, end), start, end));
      cursor = end;
    }
    if (!source.length) return [];
    return segments;
  }

  function pauseSegments(text) {
    return parseNarration(text).filter((segment) => segment.type === "pause");
  }

  function validateNarration(text) {
    const pauses = pauseSegments(text);
    const errors = pauses
      .filter((pause) => !pause.valid)
      .map((pause) => ({
        code: "invalid-pause-marker",
        message: pause.error,
        raw: pause.raw,
        start: pause.start,
        end: pause.end,
      }));
    return {
      valid: errors.length === 0,
      errors,
      pauseCount: pauses.filter((pause) => pause.valid).length,
      durationMs: pauses.reduce((sum, pause) => sum + (pause.valid ? pause.durationMs : 0), 0),
    };
  }

  function markerFor(value) {
    const normalized = String(value || "").trim().toLowerCase().replace(",", ".");
    if (Object.hasOwn(PAUSE_DURATIONS_MS, normalized)) return `{{pause:${normalized}}}`;
    const seconds = Number.parseFloat(normalized.replace(/s$/, ""));
    if (!Number.isFinite(seconds) || seconds <= 0 || seconds * 1000 > MAX_CUSTOM_DURATION_MS) {
      throw new Error("Die benutzerdefinierte Pause muss größer als 0 und höchstens 3 Sekunden sein.");
    }
    const compact = String(Math.round(seconds * 1000) / 1000);
    return `{{pause:${compact}s}}`;
  }

  function insertPause(text, selectionStart, selectionEnd, value) {
    const source = String(text || "");
    const start = Math.max(0, Math.min(Number(selectionStart) || 0, source.length));
    const end = Math.max(start, Math.min(Number(selectionEnd) || start, source.length));
    const marker = markerFor(value);
    const beforeSpace = start > 0 && !/\s/u.test(source[start - 1]) ? " " : "";
    const afterSpace = start < source.length && !/\s/u.test(source[start]) ? " " : "";
    const insertion = `${beforeSpace}${marker}${afterSpace}`;
    return {
      text: `${source.slice(0, start)}${insertion}${source.slice(start)}`,
      selectionStart: start + insertion.length,
      selectionEnd: start + insertion.length,
      markerStart: start + beforeSpace.length,
      markerEnd: start + beforeSpace.length + marker.length,
    };
  }

  function replacePause(text, start, end, value) {
    const source = String(text || "");
    const safeStart = Math.max(0, Math.min(Number(start) || 0, source.length));
    const safeEnd = Math.max(safeStart, Math.min(Number(end) || safeStart, source.length));
    const marker = value == null ? "" : markerFor(value);
    const before = source.slice(0, safeStart);
    let after = source.slice(safeEnd);
    if (!marker && /[ \t]$/u.test(before) && /^[ \t]/u.test(after)) after = after.slice(1);
    return {
      text: `${before}${marker}${after}`,
      selectionStart: safeStart + marker.length,
      selectionEnd: safeStart + marker.length,
    };
  }

  function stripPauseMarkers(text) {
    let output = "";
    for (const segment of parseNarration(text)) {
      if (segment.type === "text") output += segment.value;
      else output += " ".repeat(Math.max(1, segment.end - segment.start));
    }
    return output;
  }

  function wordCount(text) {
    return Array.from(stripPauseMarkers(text).matchAll(/[\p{L}\p{N}]+/gu)).length;
  }

  function durationBefore(text, characterIndex) {
    const limit = Math.max(0, Number(characterIndex) || 0);
    return pauseSegments(text).reduce(
      (sum, pause) => sum + (pause.valid && pause.end <= limit ? pause.durationMs : 0),
      0,
    );
  }

  function toSsmlBreaks(text) {
    const source = String(text || "");
    const validation = validateNarration(source);
    if (!validation.valid) {
      const error = new Error("Der Sprechertext enthält ungültige Pausenmarker.");
      error.details = validation.errors;
      throw error;
    }
    let output = "";
    for (const segment of parseNarration(source)) {
      output += segment.type === "text"
        ? segment.value
        : `<break time="${segment.durationMs}ms"/>`;
    }
    return output;
  }

  return {
    MAX_CUSTOM_DURATION_MS,
    PAUSE_DURATIONS_MS,
    PRESET_LABELS,
    durationBefore,
    formatDuration,
    insertPause,
    markerFor,
    parseNarration,
    parsePauseMarker,
    pauseSegments,
    replacePause,
    stripPauseMarkers,
    toSsmlBreaks,
    validateNarration,
    wordCount,
    // Compatibility names used by the animation domain.
    maskPauseMarkers: stripPauseMarkers,
    pauseDurationBefore: durationBefore,
  };
});
