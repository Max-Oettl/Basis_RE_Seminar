const crypto = require("node:crypto");
const path = require("node:path");

const FORBIDDEN_ELEMENTS = new Set([
  "script",
  "foreignobject",
  "iframe",
  "object",
  "embed",
]);

function sha256(value) {
  return crypto.createHash("sha256").update(String(value ?? ""), "utf8").digest("hex");
}

function decodeXmlEntities(value) {
  return String(value ?? "")
    .replace(/&#x([0-9a-f]+);?/gi, (_, hex) => {
      const codePoint = Number.parseInt(hex, 16);
      return Number.isFinite(codePoint) && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : "";
    })
    .replace(/&#([0-9]+);?/g, (_, decimal) => {
      const codePoint = Number.parseInt(decimal, 10);
      return Number.isFinite(codePoint) && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : "";
    })
    .replace(/&colon;/gi, ":")
    .replace(/&tab;/gi, "\t")
    .replace(/&newline;/gi, "\n")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");
}

function readAttribute(attributes, requestedName) {
  const escapedName = String(requestedName).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const expression = new RegExp(
    `(?:^|\\s)${escapedName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>\\x60]+))`,
    "i",
  );
  const match = String(attributes || "").match(expression);
  return match ? decodeXmlEntities(match[1] ?? match[2] ?? match[3] ?? "") : "";
}

function normalizeFormulaAssetPath(reference) {
  let decoded = decodeXmlEntities(reference).trim();
  if (!decoded || /^(?:true|false)$/i.test(decoded)) return null;
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    return null;
  }
  decoded = decoded.replaceAll("\\", "/");
  if (
    !decoded ||
    decoded.includes("\0") ||
    decoded.includes("?") ||
    decoded.includes("#") ||
    decoded.startsWith("/") ||
    decoded.startsWith("//") ||
    /^[a-z][a-z0-9+.-]*:/i.test(decoded)
  ) {
    return null;
  }

  const segments = decoded.split("/");
  if (segments.some((segment) => !segment || segment === "." || segment === "..")) return null;
  const normalized = path.posix.normalize(decoded);
  if (normalized !== decoded || !normalized.toLowerCase().endsWith(".svg")) return null;
  return normalized;
}

function discoverFormulaAssetReferences(source) {
  const references = [];
  const issues = [];
  const seen = new Set();
  const tagExpression = /<([a-z][\w:.-]*)\b([^<>]*?\bdata-formula-asset\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>\x60]+)[^<>]*)>/gi;
  let match;
  while ((match = tagExpression.exec(String(source || "")))) {
    const tagName = match[1].split(":").pop().toLowerCase();
    const attributes = match[2];
    const marker = readAttribute(attributes, "data-formula-asset");
    let reference = marker;
    if (/^(?:true|false)$/i.test(reference)) {
      reference = /^true$/i.test(reference)
        ? readAttribute(attributes, "href") || readAttribute(attributes, "xlink:href")
        : "";
    }
    if (!reference || /^(?:true|false)$/i.test(reference)) continue;

    const normalizedPath = normalizeFormulaAssetPath(reference);
    if (!normalizedPath) {
      issues.push({
        code: "unsafe-formula-reference",
        severity: "error",
        reference,
        message: `Unsicherer oder nicht lokaler Formelpfad: ${reference}`,
      });
      continue;
    }
    if (seen.has(normalizedPath)) continue;
    seen.add(normalizedPath);
    references.push({ path: normalizedPath, tagName, reference });
  }
  return { references, issues };
}

function trimXmlEnvelope(source) {
  let value = String(source || "").replace(/^\uFEFF/, "").trim();
  value = value.replace(/^<\?xml\b[\s\S]*?\?>\s*/i, "");
  while (/^<!--[\s\S]*?-->\s*/.test(value)) value = value.replace(/^<!--[\s\S]*?-->\s*/, "");
  while (/\s*<!--[\s\S]*?-->$/.test(value)) value = value.replace(/\s*<!--[\s\S]*?-->$/, "");
  return value.trim();
}

function referenceValues(source) {
  const values = [];
  const attributeExpression = /(?:^|\s)(?:[\w.-]+:)?(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>\x60]+))/gi;
  let match;
  while ((match = attributeExpression.exec(String(source || "")))) {
    values.push(decodeXmlEntities(match[1] ?? match[2] ?? match[3] ?? "").trim());
  }
  const cssUrlExpression = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)'"\s]+))\s*\)/gi;
  while ((match = cssUrlExpression.exec(String(source || "")))) {
    values.push(decodeXmlEntities(match[1] ?? match[2] ?? match[3] ?? "").trim());
  }
  return values;
}

function isRemoteReference(value) {
  const compact = String(value || "").replace(/[\u0000-\u0020\u007f]+/g, "");
  if (!compact || compact.startsWith("#")) return false;
  if (/^data:/i.test(compact)) {
    return !/^data:image\/(?:png|jpe?g|gif|webp|avif|svg\+xml)(?:;[^,]*)?,/i.test(compact);
  }
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(compact);
}

function collectIds(source) {
  const ids = [];
  const expression = /(?:^|\s)id\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>\x60]+))/gi;
  let match;
  while ((match = expression.exec(String(source || "")))) {
    ids.push(decodeXmlEntities(match[1] ?? match[2] ?? match[3] ?? ""));
  }
  return ids;
}

function validateSvgSource(source) {
  const errors = [];
  if (typeof source !== "string" || !source.trim()) {
    return { valid: false, errors: [{ code: "missing-source", message: "SVG-Quelltext fehlt." }] };
  }

  const envelope = trimXmlEnvelope(source);
  if (!/^<svg(?:\s|>)/i.test(envelope) || !/<\/svg\s*>$/i.test(envelope)) {
    errors.push({
      code: "invalid-svg-root",
      message: "Der Quelltext muss mit einem SVG-Wurzelelement beginnen und mit </svg> enden.",
    });
  }
  if (/<!\s*(?:doctype|entity)\b/i.test(source)) {
    errors.push({ code: "xml-external-entity", message: "DOCTYPE- und ENTITY-Deklarationen sind nicht erlaubt." });
  }

  const elementExpression = /<\s*\/?\s*(?:[\w.-]+:)?([a-z][\w.-]*)\b/gi;
  let elementMatch;
  const forbiddenFound = new Set();
  while ((elementMatch = elementExpression.exec(source))) {
    const localName = elementMatch[1].toLowerCase();
    if (FORBIDDEN_ELEMENTS.has(localName)) forbiddenFound.add(localName);
  }
  for (const element of forbiddenFound) {
    errors.push({ code: "forbidden-element", element, message: `<${element}> ist im SVG-Editor nicht erlaubt.` });
  }

  if (/\s(?:[\w.-]+:)?on[a-z0-9_.-]*\s*=/i.test(source)) {
    errors.push({ code: "event-handler", message: "Ereignis-Handler wie onload oder onclick sind nicht erlaubt." });
  }

  const decoded = decodeXmlEntities(source);
  const compactSchemes = decoded.replace(/[\u0000-\u0020\u007f]+/g, "");
  if (/(?:javascript|vbscript|data:text\/html)\s*:/i.test(compactSchemes)) {
    errors.push({ code: "active-uri", message: "Aktive javascript-, vbscript- oder HTML-Daten-URIs sind nicht erlaubt." });
  }
  if (/@import\b/i.test(decoded)) {
    errors.push({ code: "remote-style-import", message: "CSS-Importe sind nicht erlaubt." });
  }
  const remoteReferences = [...new Set(referenceValues(source).filter(isRemoteReference))];
  if (remoteReferences.length) {
    errors.push({
      code: "remote-reference",
      references: remoteReferences,
      message: "Externe oder aktive Referenzen sind nicht erlaubt.",
    });
  }

  const seenIds = new Set();
  const duplicateIds = [];
  for (const id of collectIds(source)) {
    if (seenIds.has(id) && !duplicateIds.includes(id)) duplicateIds.push(id);
    seenIds.add(id);
  }
  if (duplicateIds.length) {
    errors.push({
      code: "duplicate-id",
      ids: duplicateIds,
      message: `Doppelte SVG-IDs: ${duplicateIds.join(", ")}`,
    });
  }

  const formulaResult = discoverFormulaAssetReferences(source);
  errors.push(...formulaResult.issues);
  return {
    valid: errors.length === 0,
    errors,
    ids: [...seenIds],
    formulaReferences: formulaResult.references,
  };
}

function extractRootAttributes(source) {
  const rootMatch = trimXmlEnvelope(source).match(/^<svg\b([^>]*)>/i);
  const attributes = rootMatch?.[1] || "";
  return {
    width: readAttribute(attributes, "width"),
    height: readAttribute(attributes, "height"),
    viewBox: readAttribute(attributes, "viewBox"),
  };
}

function extractSvgMetadata(source) {
  const rootMatch = trimXmlEnvelope(source).match(/^<svg\b([^>]*)>/i);
  const attributes = rootMatch?.[1] || "";
  const metadata = {
    ...extractRootAttributes(source),
    formulaFontSize: readAttribute(attributes, "data-formula-fontsize"),
    renderer: readAttribute(attributes, "data-renderer"),
    formula: "",
  };
  const metadataExpression = /<metadata\b[^>]*>([\s\S]*?)<\/metadata\s*>/gi;
  let match;
  while ((match = metadataExpression.exec(String(source || "")))) {
    const raw = match[1].replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, "$1").trim();
    if (!raw.startsWith("{") || !raw.endsWith("}")) continue;
    try {
      const parsed = JSON.parse(raw);
      if (!metadata.formula && typeof parsed.formula === "string") metadata.formula = parsed.formula;
      if (!metadata.formulaFontSize && parsed.fontSize != null) metadata.formulaFontSize = String(parsed.fontSize);
      if (!metadata.renderer && typeof parsed.renderer === "string") metadata.renderer = parsed.renderer;
    } catch {
      // Metadata may legitimately contain non-JSON RDF or descriptive XML.
    }
  }
  return metadata;
}

function documentSha256(svgSource, formulaAssets) {
  const assets = [...(Array.isArray(formulaAssets) ? formulaAssets : [])]
    .map((asset) => ({
      path: String(asset?.path || ""),
      exists: asset?.exists !== false,
      source: typeof asset?.source === "string" ? asset.source : "",
    }))
    .sort((left, right) => left.path.localeCompare(right.path));
  const hash = crypto.createHash("sha256");
  hash.update(`svg:${Buffer.byteLength(String(svgSource || ""), "utf8")}\0`, "utf8");
  hash.update(String(svgSource || ""), "utf8");
  for (const asset of assets) {
    hash.update(`\0asset:${Buffer.byteLength(asset.path, "utf8")}:${asset.path}:${asset.exists ? "1" : "0"}:`, "utf8");
    if (asset.exists) {
      hash.update(`${Buffer.byteLength(asset.source, "utf8")}\0`, "utf8");
      hash.update(asset.source, "utf8");
    }
  }
  return hash.digest("hex");
}

function normalizeVersionLabel(value, fallback = "SVG-Editor-Version") {
  const normalized = String(value || "")
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
  return normalized || fallback;
}

const exported = {
  decodeXmlEntities,
  discoverFormulaAssetReferences,
  documentSha256,
  extractRootAttributes,
  extractSvgMetadata,
  normalizeFormulaAssetPath,
  normalizeVersionLabel,
  sha256,
  validateSvgSource,
};

if (typeof module !== "undefined" && module.exports) module.exports = exported;
