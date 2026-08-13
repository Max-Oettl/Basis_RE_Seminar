(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.SvgEditorDomain = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const XMLNS = "http://www.w3.org/2000/svg";

  function finiteNumber(value, fallback = 0) {
    const parsed = Number.parseFloat(String(value ?? "").replace(",", "."));
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function formatNumber(value, precision = 3) {
    const factor = 10 ** precision;
    const rounded = Math.round(finiteNumber(value) * factor) / factor;
    return Object.is(rounded, -0) ? "0" : String(rounded);
  }

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, finiteNumber(value, minimum)));
  }

  function isRelativeReference(value) {
    const reference = String(value || "").trim();
    return Boolean(reference) && !/^(?:#|data:|https?:|\/\/|\/)/i.test(reference);
  }

  function normalizeWebPath(pathname) {
    const parts = [];
    String(pathname || "").replace(/\\/g, "/").split("/").forEach((part) => {
      if (!part || part === ".") return;
      if (part === "..") parts.pop();
      else parts.push(part);
    });
    return parts.join("/");
  }

  function resolveAssetUrl(svgPath, reference) {
    if (!isRelativeReference(reference)) return String(reference || "");
    const path = String(svgPath || "").replace(/\\/g, "/");
    const directory = path.includes("/") ? path.slice(0, path.lastIndexOf("/") + 1) : "";
    const match = String(reference).match(/^([^?#]*)(.*)$/);
    const resolved = normalizeWebPath(`${directory}${match?.[1] || reference}`);
    return `/files/${resolved.split("/").map(encodeURIComponent).join("/")}${match?.[2] || ""}`;
  }

  function stripMathDelimiters(source) {
    let value = String(source || "").trim();
    if (value.startsWith("$$") && value.endsWith("$$")) value = value.slice(2, -2);
    else if (value.startsWith("$") && value.endsWith("$")) value = value.slice(1, -1);
    else if (value.startsWith("\\[") && value.endsWith("\\]")) value = value.slice(2, -2);
    return value.trim();
  }

  function parseConnectorPoints(value) {
    const numbers = String(value || "").match(/[-+]?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?/gi)?.map(Number) || [];
    const points = [];
    for (let index = 0; index + 1 < numbers.length; index += 2) {
      if (Number.isFinite(numbers[index]) && Number.isFinite(numbers[index + 1])) points.push({ x: numbers[index], y: numbers[index + 1] });
    }
    return points;
  }

  function pathToConnectorPoints(value) {
    const source = String(value || "").trim();
    if (!source || /[ACQSTZ]/i.test(source)) return [];
    const tokens = source.match(/[MLHVmlhv]|[-+]?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?/g) || [];
    const residue = source.replace(/[MLHVmlhv]|[-+]?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?|[\s,]+/g, "");
    if (residue || !tokens.length) return [];
    const points = [];
    let command = ""; let index = 0; let x = 0; let y = 0;
    const isCommand = (token) => /^[MLHVmlhv]$/.test(token || "");
    while (index < tokens.length) {
      if (isCommand(tokens[index])) command = tokens[index++];
      if (!command || index >= tokens.length) break;
      const relative = command === command.toLowerCase();
      const upper = command.toUpperCase();
      if (upper === "M" || upper === "L") {
        if (isCommand(tokens[index]) || isCommand(tokens[index + 1])) return [];
        const nextX = Number(tokens[index++]); const nextY = Number(tokens[index++]);
        if (!Number.isFinite(nextX) || !Number.isFinite(nextY)) return [];
        x = relative ? x + nextX : nextX; y = relative ? y + nextY : nextY;
        points.push({ x, y });
        if (upper === "M") command = relative ? "l" : "L";
      } else {
        const next = Number(tokens[index++]);
        if (!Number.isFinite(next)) return [];
        if (upper === "H") x = relative ? x + next : next;
        else y = relative ? y + next : next;
        points.push({ x, y });
      }
    }
    return points.length >= 2 ? points : [];
  }

  function serializeConnectorPoints(points) {
    return (points || []).map((point) => `${formatNumber(point.x)} ${formatNumber(point.y)}`).join(" ");
  }

  function insertConnectorPoint(points, segmentIndex, point) {
    const result = (points || []).map((item) => ({ ...item }));
    const index = Math.max(0, Math.min(result.length - 2, Number(segmentIndex) || 0));
    const start = result[index] || { x: 0, y: 0 };
    const end = result[index + 1] || start;
    result.splice(index + 1, 0, point ? { x: finiteNumber(point.x), y: finiteNumber(point.y) } : { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 });
    return result;
  }

  function longestConnectorSegment(points) {
    let bestIndex = 0;
    let bestLength = -1;
    for (let index = 0; index < (points || []).length - 1; index += 1) {
      const dx = points[index + 1].x - points[index].x;
      const dy = points[index + 1].y - points[index].y;
      const length = dx * dx + dy * dy;
      if (length > bestLength) { bestIndex = index; bestLength = length; }
    }
    return bestIndex;
  }

  function dockConnectorPoint(box, side, position = 0.5) {
    const t = clamp(position, 0, 1);
    if (side === "left") return { x: box.x, y: box.y + box.height * t };
    if (side === "right") return { x: box.x + box.width, y: box.y + box.height * t };
    if (side === "top") return { x: box.x + box.width * t, y: box.y };
    return { x: box.x + box.width * t, y: box.y + box.height };
  }

  function rectMatchesMarquee(rect, bounds) {
    if (!rect || !bounds) return false;
    return rect.left >= bounds.left && rect.right <= bounds.right && rect.top >= bounds.top && rect.bottom <= bounds.bottom;
  }

  function zoomFromWheel(currentZoom, deltaY, minimum = 0.2, maximum = 4) {
    const current = finiteNumber(currentZoom, 1);
    const delta = finiteNumber(deltaY, 0);
    return clamp(current * Math.exp(-delta * 0.0015), minimum, maximum);
  }

  function panFromWheel(deltaX, deltaY, shiftKey = false) {
    const x = finiteNumber(deltaX, 0); const y = finiteNumber(deltaY, 0);
    return shiftKey && Math.abs(x) < 0.01 ? { dx: y, dy: 0 } : { dx: x, dy: y };
  }

  function extractFormulaSource(svgSource, metadata) {
    if (metadata && typeof metadata === "object") {
      for (const key of ["formula", "latex", "mathText", "mathtext", "source"]) {
        if (typeof metadata[key] === "string" && metadata[key].trim()) return metadata[key].trim();
      }
    }
    const source = String(svgSource || "");
    const labelled = source.match(/<!--\s*(?:formula|latex|mathtext)\s*:\s*([\s\S]*?)-->/i);
    if (labelled) return labelled[1].trim();
    const bareMath = source.match(/<!--\s*(\${1,2}[\s\S]*?\${1,2}|\\\[[\s\S]*?\\\])\s*-->/);
    if (bareMath) return stripMathDelimiters(bareMath[1]);
    for (const match of source.matchAll(/<metadata\b[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/metadata>/gi)) {
      const text = match[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&").trim();
      try { const value = extractFormulaSource("", JSON.parse(text)); if (value) return value; } catch { /* prose metadata */ }
    }
    const attribute = source.match(/data-formula-source=["']([^"']+)["']/i);
    if (attribute) return attribute[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    const text = source.match(/<text\b[^>]*>([^<]+)<\/text>/i);
    return text ? text[1].replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").trim() : "";
  }

  function appendTransform(existing, operation) { return `${String(operation || "").trim()} ${String(existing || "").trim()}`.trim(); }

  function preserveXmlPreamble(originalSource, serializedRoot) {
    const source = String(originalSource || ""); const rootIndex = source.search(/<svg\b/i);
    return `${rootIndex > 0 ? source.slice(0, rootIndex) : ""}${serializedRoot}`;
  }

  function normalizeLineHeight(value) { return clamp(value || 1.25, .8, 3); }

  function prepareFormulaInsertion(template, selectedText = "") {
    let text = String(template || "");
    const selected = String(selectedText || "");
    if (selected && text.includes("{}")) {
      const placeholder = text.indexOf("{}");
      text = `${text.slice(0, placeholder + 1)}${selected}${text.slice(placeholder + 1)}`;
      return { text, selectionStart: placeholder + 1, selectionEnd: placeholder + 1 + selected.length };
    }
    const candidates = [text.indexOf("{}"), text.indexOf("[]")].filter((index) => index >= 0);
    const placeholder = candidates.length ? Math.min(...candidates) : -1;
    const cursor = placeholder >= 0 ? placeholder + 1 : text.length;
    return { text, selectionStart: cursor, selectionEnd: cursor };
  }

  function constrainDelta(dx, dy, enabled = true) {
    const horizontal = finiteNumber(dx);
    const vertical = finiteNumber(dy);
    if (!enabled) return { dx: horizontal, dy: vertical };
    return Math.abs(horizontal) >= Math.abs(vertical)
      ? { dx: horizontal, dy: 0 }
      : { dx: 0, dy: vertical };
  }

  function constrainLineEndpoint(line, endpoint, point, enabled = true) {
    const movingFirst = endpoint === "start";
    const other = {
      x: finiteNumber(movingFirst ? line?.x2 : line?.x1),
      y: finiteNumber(movingFirst ? line?.y2 : line?.y1),
    };
    const next = { x: finiteNumber(point?.x), y: finiteNumber(point?.y) };
    if (!enabled) return next;
    const delta = constrainDelta(next.x - other.x, next.y - other.y, true);
    return { x: other.x + delta.dx, y: other.y + delta.dy };
  }

  function alignmentDelta(selectedBox, referenceBox, mode) {
    const selected = {
      x: finiteNumber(selectedBox?.x), y: finiteNumber(selectedBox?.y),
      width: Math.max(0, finiteNumber(selectedBox?.width)), height: Math.max(0, finiteNumber(selectedBox?.height)),
    };
    const reference = {
      x: finiteNumber(referenceBox?.x), y: finiteNumber(referenceBox?.y),
      width: Math.max(0, finiteNumber(referenceBox?.width)), height: Math.max(0, finiteNumber(referenceBox?.height)),
    };
    const selectedCenter = { x: selected.x + selected.width / 2, y: selected.y + selected.height / 2 };
    const referenceCenter = { x: reference.x + reference.width / 2, y: reference.y + reference.height / 2 };
    const centerDx = referenceCenter.x - selectedCenter.x;
    const centerDy = referenceCenter.y - selectedCenter.y;
    if (mode === "center-x") return { dx: centerDx, dy: 0 };
    if (mode === "center-y") return { dx: 0, dy: centerDy };
    if (mode === "center-both") return { dx: centerDx, dy: centerDy };
    if (mode === "dock") {
      if (reference.width >= reference.height) {
        const lineY = referenceCenter.y;
        return {
          dx: centerDx,
          dy: selectedCenter.y <= lineY ? lineY - (selected.y + selected.height) : lineY - selected.y,
        };
      }
      const lineX = referenceCenter.x;
      return {
        dx: selectedCenter.x <= lineX ? lineX - (selected.x + selected.width) : lineX - selected.x,
        dy: centerDy,
      };
    }
    return { dx: 0, dy: 0 };
  }

  return Object.freeze({ alignmentDelta, appendTransform, clamp, constrainDelta, constrainLineEndpoint, dockConnectorPoint, extractFormulaSource, finiteNumber, formatNumber, insertConnectorPoint, isRelativeReference, longestConnectorSegment, normalizeLineHeight, normalizeWebPath, panFromWheel, parseConnectorPoints, pathToConnectorPoints, prepareFormulaInsertion, preserveXmlPreamble, rectMatchesMarquee, resolveAssetUrl, serializeConnectorPoints, stripMathDelimiters, zoomFromWheel });
});
